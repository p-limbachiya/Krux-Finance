'use client';

import { motion } from 'framer-motion';
import { CreativeCommons } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FloatingInfoButtonProps {
  onClick: () => void;
}

const STORAGE_KEY = 'krux-floating-info-pos';

const FloatingInfoButton: React.FC<FloatingInfoButtonProps> = ({ onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Load saved position on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed?.top === 'number' &&
          typeof parsed?.left === 'number'
        ) {
          setPos({ top: parsed.top, left: parsed.left });
        }
      }
    } catch {}
  }, []);

  const handleDragEnd = () => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const nextPos = { top: rect.top, left: rect.left };
    setPos(nextPos);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPos));
    } catch {}
  };

  // Default initial position: slightly above middle on the right side
  const defaultStyle: React.CSSProperties = {
    position: 'fixed',
    top: '22vh',
    right: 24,
  };

  const savedStyle: React.CSSProperties | undefined = pos
    ? { position: 'fixed', top: pos.top, left: pos.left }
    : undefined;

  return (
    <div ref={containerRef} className="fixed inset-0 z-40 pointer-events-none">
      <motion.div
        ref={nodeRef}
        className="pointer-events-auto"
        drag
        dragConstraints={containerRef}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={savedStyle ?? defaultStyle}
      >
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
          onClick={onClick}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Show website information"
        >
          <CreativeCommons size={24} className="group-hover:animate-pulse" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FloatingInfoButton;
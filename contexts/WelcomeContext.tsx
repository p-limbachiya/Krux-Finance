'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WelcomeContextType {
  showModal: boolean;
  showFloatingButton: boolean;
  setShowModal: (show: boolean) => void;
  setShowFloatingButton: (show: boolean) => void;
  dontShowAgain: () => void;
}

const WelcomeContext = createContext<WelcomeContextType | undefined>(undefined);

export const useWelcome = () => {
  const context = useContext(WelcomeContext);
  if (context === undefined) {
    throw new Error('useWelcome must be used within a WelcomeProvider');
  }
  return context;
};

interface WelcomeProviderProps {
  children: ReactNode;
}

export const WelcomeProvider: React.FC<WelcomeProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    // Check if user has visited before or clicked "don't show again"
    const hasVisited = localStorage.getItem('krux-welcome-visited');
    const dontShowAgain = localStorage.getItem('krux-welcome-dont-show');

    if (dontShowAgain === 'true') {
      // User clicked don't show again, don't show anything
      setShowModal(false);
      setShowFloatingButton(false);
    } else if (hasVisited === 'true') {
      // User has visited before, show floating button only
      setShowModal(false);
      setShowFloatingButton(true);
    } else {
      // First time visitor, show modal
      setShowModal(true);
      setShowFloatingButton(false);
      localStorage.setItem('krux-welcome-visited', 'true');
    }
  }, []);

  const handleDontShowAgain = () => {
    localStorage.setItem('krux-welcome-dont-show', 'true');
    setShowModal(false);
    setShowFloatingButton(false);
  };

  const value: WelcomeContextType = {
    showModal,
    showFloatingButton,
    setShowModal,
    setShowFloatingButton,
    dontShowAgain: handleDontShowAgain,
  };

  return (
    <WelcomeContext.Provider value={value}>
      {children}
    </WelcomeContext.Provider>
  );
};
'use client';

import { useWelcome } from '@/contexts/WelcomeContext';
import WelcomeModal from '@/components/WelcomeModal';
import FloatingInfoButton from '@/components/FloatingInfoButton';

export default function WelcomeModalWrapper() {
  const { showModal, showFloatingButton, setShowModal, setShowFloatingButton, dontShowAgain } = useWelcome();

  const handleModalClose = () => {
    setShowModal(false);
    setShowFloatingButton(true);
  };

  const handleFloatingButtonClick = () => {
    setShowModal(true);
    setShowFloatingButton(false);
  };

  return (
    <>
      {showModal && (
        <WelcomeModal
          onClose={handleModalClose}
          onDontShowAgain={dontShowAgain}
        />
      )}
      {showFloatingButton && (
        <FloatingInfoButton onClick={handleFloatingButtonClick} />
      )}
    </>
  );
}
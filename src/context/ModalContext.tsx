import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { modalService } from '../services/modalService';
import type { ModalOptions } from '../services/modalService';
import { Modal } from '../components/ui/Modal';

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  useEffect(() => {
    const unsubscribe = modalService.subscribe((options) => {
      setModalOptions(options);
    });
    return unsubscribe;
  }, []);

  const showModal = (options: ModalOptions) => setModalOptions(options);
  const hideModal = () => {
    if (modalOptions?.onClose) modalOptions.onClose();
    setModalOptions(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalOptions && (
        <Modal 
          isOpen={!!modalOptions} 
          onClose={hideModal} 
          {...modalOptions} 
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

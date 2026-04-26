type ModalType = 'success' | 'error' | 'info';

export interface ModalOptions {
  title?: string;
  message: string;
  type: ModalType;
  autoClose?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

type ModalListener = (options: ModalOptions | null) => void;

let listener: ModalListener | null = null;

export const modalService = {
  subscribe: (l: ModalListener) => {
    listener = l;
    return () => {
      listener = null;
    };
  },
  show: (options: ModalOptions) => {
    if (listener) listener(options);
  },
  hide: () => {
    if (listener) listener(null);
  },
  showSuccess: (message: string, title?: string) => {
    modalService.show({ type: 'success', message, title: title || 'Sucesso!', autoClose: true });
  },
  showError: (message: string, title?: string) => {
    modalService.show({ type: 'error', message, title: title || 'Erro' });
  },
  showInfo: (message: string, title?: string) => {
    modalService.show({ type: 'info', message, title: title || 'Informação' });
  },
  showConfirm: (message: string, onConfirm: () => void, title?: string) => {
    modalService.show({ type: 'info', message, title: title || 'Confirmar', onConfirm });
  }
};

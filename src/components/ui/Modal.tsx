import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { ModalOptions } from '../../services/modalService';

interface ModalProps extends ModalOptions {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  autoClose,
  onConfirm
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  const config = {
    success: {
      icon: <CheckCircle className="w-12 h-12 text-emerald-500" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      button: 'bg-emerald-500 hover:bg-emerald-600'
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-rose-500" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      button: 'bg-rose-500 hover:bg-rose-600'
    },
    info: {
      icon: <Info className="w-12 h-12 text-sky-500" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      button: 'bg-sky-500 hover:bg-sky-600'
    }
  };

  const current = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-8 flex flex-col items-center text-center ${current.bg}/30`}>
          <div className="mb-4">
            {current.icon}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-center gap-3">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-full text-slate-600 font-semibold hover:bg-slate-200/50 transition-all active:scale-95 border border-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    if (onConfirm) await onConfirm();
                  } finally {
                    onClose();
                  }
                }}
                className={`px-6 py-2 rounded-full text-white font-semibold transition-all shadow-lg active:scale-95 ${current.button}`}
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`px-8 py-2.5 rounded-full text-white font-semibold transition-all shadow-lg active:scale-95 ${current.button}`}
            >
              {type === 'success' ? 'Entendi' : 'Fechar'}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

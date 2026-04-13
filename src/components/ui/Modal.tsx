'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          <motion.div
            ref={contentRef}
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="
              relative z-10 flex w-full flex-col overflow-hidden
              h-[100dvh] max-h-[100dvh]
              rounded-t-3xl bg-bg-primary shadow-2xl
              pt-[max(0.5rem,env(safe-area-inset-top,0px))]
              lg:h-auto lg:max-h-[85vh] lg:min-h-0 lg:rounded-3xl lg:pt-0
              lg:my-auto lg:max-w-md lg:overflow-y-auto
            "
          >
            <div className="flex shrink-0 justify-center pb-2 pt-1 lg:hidden">
              <div className="h-1 w-10 rounded-full bg-gray-300" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-none lg:overflow-visible">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

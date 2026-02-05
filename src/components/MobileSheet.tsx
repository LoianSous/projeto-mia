'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileSheet({ isOpen, onClose, children }: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 md:hidden max-h-[85vh] flex flex-col shadow-2xl"
        style={{
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div className="flex-shrink-0 w-full pt-2 pb-3 flex justify-center">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-xl bg-white shadow-xl dark:bg-zinc-900 dark:shadow-black/40`}
      >
        {children}
      </div>
    </div>
  );
}

// Subcomponents
Modal.Header = function ModalHeader({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-zinc-700">
      <div className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 py-4 text-gray-700 dark:text-zinc-300">{children}</div>
  );
};

Modal.Footer = function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-zinc-700">
      {children}
    </div>
  );
};

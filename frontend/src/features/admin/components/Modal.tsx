import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="absolute right-3 top-2 text-xl text-gray-500 hover:text-red-600"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

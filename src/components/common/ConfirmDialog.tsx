import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      bg: 'bg-red-50',
    },
    warning: {
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      bg: 'bg-yellow-50',
    },
    info: {
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      bg: 'bg-blue-50',
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onCancel} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onCancel}
              className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto ${colors[type].bg} rounded-full sm:mx-0 sm:h-10 sm:w-10`}>
                <AlertTriangle className={`w-6 h-6 ${colors[type].icon}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${colors[type].button}`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
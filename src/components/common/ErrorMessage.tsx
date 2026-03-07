import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  details?: Record<string, string>;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  details,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          
          {details && Object.keys(details).length > 0 && (
            <div className="mt-2 text-sm text-red-600">
              {Object.entries(details).map(([field, error]) => (
                <p key={field} className="mt-1">
                  • {field}: {error}
                </p>
              ))}
            </div>
          )}
          
          <div className="mt-3 flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
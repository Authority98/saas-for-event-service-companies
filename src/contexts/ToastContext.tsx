import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastContextType {
  showToast: (message: string, type: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Create a global reference to the showToast function
let globalShowToast: ((message: string, type: AlertColor) => void) | undefined;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertColor>('success');

  const showToast = (message: string, type: AlertColor) => {
    setMessage(message);
    setType(type);
    setOpen(true);
  };

  // Store the showToast function in our global reference
  globalShowToast = showToast;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={type} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Export the global toast function
export const toast = {
  success: (message: string) => globalShowToast?.(message, 'success'),
  error: (message: string) => globalShowToast?.(message, 'error'),
  warning: (message: string) => globalShowToast?.(message, 'warning'),
  info: (message: string) => globalShowToast?.(message, 'info'),
}; 
import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, AlertColor, useTheme } from '@mui/material';

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
  const theme = useTheme();

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

  const getAlertColor = (type: AlertColor) => {
    switch (type) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 24px 0 rgba(34, 41, 47, 0.1)',
          }
        }}
      >
        <Alert 
          onClose={handleClose} 
          severity={type} 
          variant="standard"
          sx={{
            width: '100%',
            bgcolor: '#ffffff',
            color: 'text.primary',
            border: '1px solid',
            borderColor: (theme) => `${getAlertColor(type)}20`,
            '& .MuiAlert-icon': {
              color: getAlertColor(type)
            },
            '& .MuiAlert-message': {
              color: 'text.primary'
            },
            '& .MuiAlert-action': {
              alignItems: 'center',
              '& .MuiIconButton-root': {
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: (theme) => `${getAlertColor(type)}10`
                }
              }
            }
          }}
        >
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
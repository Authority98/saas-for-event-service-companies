import { useToast } from '../contexts/ToastContext';

export const showToast = {
  success: (message: string) => {
    const { showToast } = useToast();
    showToast(message, 'success');
  },
  error: (message: string) => {
    const { showToast } = useToast();
    showToast(message, 'error');
  },
  info: (message: string) => {
    const { showToast } = useToast();
    showToast(message, 'info');
  },
  warning: (message: string) => {
    const { showToast } = useToast();
    showToast(message, 'warning');
  }
}; 
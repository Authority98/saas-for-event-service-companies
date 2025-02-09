import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { X } from 'lucide-react';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  loading?: boolean;
}

const FormDialog = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Save',
  loading = false,
}: FormDialogProps) => {
  const theme = useTheme();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme => `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }
      }}
      TransitionProps={{
        timeout: 200
      }}
    >
      <DialogTitle 
        sx={{ 
          p: 3,
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: 'error.main',
              }
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent 
        sx={{ 
          p: 3,
          '&:first-of-type': {
            pt: 3
          }
        }}
      >
        {children}
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3,
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Button 
          onClick={onClose}
          sx={{
            minWidth: 100,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          sx={{
            minWidth: 100,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          }}
        >
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog; 
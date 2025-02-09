import React from 'react';
import { Box, Typography } from '@mui/material';

interface StepProgressProps {
  activeStep: number;
}

const steps = ['Event Details', 'Tent Selection', 'Contact Details', 'Thank You'];

const StepProgress: React.FC<StepProgressProps> = ({ activeStep }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      mb: 4,
      gap: 4,
      px: 2
    }}>
      {steps.map((label, index) => (
        <Box
          key={label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            position: 'relative'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 1.5,
            minWidth: '100px'
          }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: index === activeStep ? 'primary.main' : index < activeStep ? 'primary.light' : 'transparent',
                border: '1.5px solid',
                borderColor: index === activeStep ? 'primary.main' : index < activeStep ? 'primary.light' : 'divider',
                color: index === activeStep || index < activeStep ? 'white' : 'text.disabled',
                transition: 'all 0.3s ease',
                fontWeight: 500,
                fontSize: '0.875rem',
                boxShadow: index === activeStep ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              {index + 1}
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: index === activeStep ? 'text.primary' : index < activeStep ? 'text.secondary' : 'text.disabled',
                fontWeight: index === activeStep ? 500 : 400,
                fontSize: '0.8rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                letterSpacing: '0.02em'
              }}
            >
              {label}
            </Typography>
          </Box>
          {index < steps.length - 1 && (
            <Box 
              sx={{ 
                position: 'absolute',
                right: -48,
                top: 16,
                width: 32,
                height: 1.5,
                bgcolor: index < activeStep ? 'primary.light' : 'divider',
                transition: 'all 0.3s ease'
              }} 
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default StepProgress;
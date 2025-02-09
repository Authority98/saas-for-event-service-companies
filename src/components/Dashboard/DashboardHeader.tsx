import React from 'react';
import { Box, Typography } from '@mui/material';

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your {title.toLowerCase()} and settings
      </Typography>
    </Box>
  );
};

export default DashboardHeader; 
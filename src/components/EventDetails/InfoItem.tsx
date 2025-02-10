import React from 'react';
import { Box, Typography } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      px: { xs: 1, md: 2 },
      py: 0.5,
      borderRadius: 1,
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider'
    }}
  >
    <Icon size={16} />
    <Typography 
      variant="body2" 
      sx={{ fontWeight: 500 }}
    >
      {value}
    </Typography>
  </Box>
);

export default InfoItem; 
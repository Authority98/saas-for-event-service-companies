import React from 'react';
import { Box } from '@mui/material';
import { DashboardStats } from './';
import type { DashboardStat } from './types';

interface DashboardOverviewProps {
  stats: DashboardStat[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  return (
    <Box>
      <DashboardStats stats={stats} />
    </Box>
  );
};

export default DashboardOverview; 
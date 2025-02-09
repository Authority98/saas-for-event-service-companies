import React from 'react';
import { Box, Grid } from '@mui/material';
import { DashboardStats } from './';
import type { DashboardStat } from './types';
import RecentEnquiries from './RecentEnquiries';
import PopularTentTypes from './PopularTentTypes';

interface DashboardOverviewProps {
  stats: DashboardStat[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  // Mock data for demonstration - Replace with real data later
  const recentEnquiries = [
    { id: 1, name: 'John Smith', eventType: 'Wedding', date: '2024-08-15', status: 'pending' },
    { id: 2, name: 'Sarah Johnson', eventType: 'Corporate Event', date: '2024-07-22', status: 'pending' },
    { id: 3, name: 'Mike Brown', eventType: 'Birthday Party', date: '2024-09-01', status: 'pending' },
  ];

  const popularTentTypes = [
    { name: 'Stretch Tent', count: 12 },
    { name: 'Traditional Pole', count: 8 },
    { name: 'Clear Span', count: 6 },
  ];

  return (
    <Box>
      <DashboardStats stats={stats} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RecentEnquiries enquiries={recentEnquiries} />
        </Grid>

        <Grid item xs={12} md={6}>
          <PopularTentTypes tentTypes={popularTentTypes} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 
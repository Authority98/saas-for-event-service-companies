import React from 'react';
import { Grid, Paper, Box, Typography, useTheme, alpha } from '@mui/material';
import type { DashboardStat } from './types';

interface DashboardStatsProps {
  stats: DashboardStat[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s',
              borderRadius: 2,
              bgcolor: '#ffffff',
              boxShadow: '0 4px 24px 0 rgba(34, 41, 47, 0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 30px 0 rgba(34, 41, 47, 0.2)',
              }
            }}
          >
            {/* Decorative gradient line */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: (theme) => `linear-gradient(90deg, ${
                  index % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main
                }, ${
                  index % 2 === 0 ? theme.palette.secondary.main : theme.palette.primary.main
                })`
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'primary.main',
                opacity: 0.1,
                transform: 'scale(2)',
                transformOrigin: 'top right',
              }}
            >
              {stat.icon}
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                {stat.value.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {stat.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {stat.description}
              </Typography>
              {stat.trend !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'success.main',
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 500,
                    }}
                  >
                    +{stat.trend}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs last month
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats; 
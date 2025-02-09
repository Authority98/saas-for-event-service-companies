import React from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  Avatar,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import { Tent, TrendingUp } from 'lucide-react';

interface TentTypeStats {
  name: string;
  count: number;
}

interface PopularTentTypesProps {
  tentTypes: TentTypeStats[];
}

const PopularTentTypes: React.FC<PopularTentTypesProps> = ({ tentTypes }) => {
  const theme = useTheme();

  return (
    <Paper 
      sx={{ 
        p: 3,
        height: '100%',
        borderRadius: 2,
        boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp size={20} />
        Popular Tent Types
      </Typography>
      <Grid container spacing={2}>
        {tentTypes.map((type) => (
          <Grid item xs={12} key={type.name}>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Tent size={20} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{type.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {type.count} bookings
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PopularTentTypes; 
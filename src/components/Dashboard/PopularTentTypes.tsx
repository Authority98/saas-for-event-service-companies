import React from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Tent, TrendingUp, Crown, ArrowUpRight } from 'lucide-react';

interface TentTypeStats {
  name: string;
  count: number;
}

interface PopularTentTypesProps {
  tentTypes: TentTypeStats[];
}

const PopularTentTypes: React.FC<PopularTentTypesProps> = ({ tentTypes }) => {
  const theme = useTheme();
  const maxCount = Math.max(...tentTypes.map(t => t.count));

  return (
    <Paper 
      sx={{ 
        p: 3,
        height: '100%',
        borderRadius: 2,
        bgcolor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s',
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
          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              color: 'secondary.main'
            }}
          >
            <TrendingUp size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Popular Tents
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Based on {tentTypes.reduce((acc, curr) => acc + curr.count, 0)} bookings
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tentTypes.map((type, index) => (
          <Box
            key={type.name}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.2s',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 2px 8px 0 rgba(34, 41, 47, 0.08)',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: '0 4px 16px 0 rgba(34, 41, 47, 0.12)',
                '& .arrow-icon': {
                  opacity: 1,
                  transform: 'translateX(0)',
                }
              }
            }}
          >
            {/* Crown for the most popular tent */}
            {index === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -6,
                  right: 16,
                  color: theme.palette.warning.main,
                  transform: 'rotate(12deg)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              >
                <Crown size={20} />
              </Box>
            )}

            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'secondary.main'
              }}
            >
              <Tent size={20} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {type.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    height: 4, 
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    flex: 1,
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px 0 rgba(34, 41, 47, 0.05)'
                  }}
                >
                  <Box 
                    sx={{ 
                      height: '100%',
                      width: `${(type.count / maxCount) * 100}%`,
                      bgcolor: 'secondary.main',
                      borderRadius: 2,
                      transition: 'width 1s ease-in-out',
                      boxShadow: '0 0 8px 0 rgba(34, 41, 47, 0.1)'
                    }} 
                  />
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    minWidth: 60,
                    textAlign: 'right'
                  }}
                >
                  {type.count} bookings
                </Typography>
              </Box>
            </Box>

            <Tooltip title="View Details">
              <IconButton 
                className="arrow-icon"
                size="small"
                sx={{ 
                  opacity: 0,
                  transform: 'translateX(-8px)',
                  transition: 'all 0.2s',
                  color: 'secondary.main'
                }}
              >
                <ArrowUpRight size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PopularTentTypes; 
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { Mail, Calendar, Users, ArrowUpRight } from 'lucide-react';
import dayjs from 'dayjs';

interface Enquiry {
  id: number;
  name: string;
  eventType: string;
  date: string;
  status: string;
}

interface RecentEnquiriesProps {
  enquiries: Enquiry[];
}

const RecentEnquiries: React.FC<RecentEnquiriesProps> = ({ enquiries }) => {
  const theme = useTheme();

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
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
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
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main'
            }}
          >
            <Mail size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Recent Enquiries
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last {enquiries.length} enquiries
            </Typography>
          </Box>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={70} 
          sx={{ 
            width: 60,
            height: 4,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: 'primary.main'
            }
          }} 
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {enquiries.map((enquiry) => (
          <Box
            key={enquiry.id}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.2s',
              cursor: 'pointer',
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
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              {enquiry.name[0].toUpperCase()}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {enquiry.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Calendar size={14} />
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(enquiry.date).format('MMM D, YYYY')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Users size={14} />
                  <Typography variant="caption" color="text.secondary">
                    {enquiry.eventType}
                  </Typography>
                </Box>
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
                  color: 'primary.main'
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

export default RecentEnquiries; 
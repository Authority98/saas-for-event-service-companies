import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Mail, Calendar, Users, ArrowUpRight } from 'lucide-react';
import dayjs from 'dayjs';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import EnquiryDetails from '../Admin/EnquiryDetails';

interface Enquiry {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  status: string;
  created_at: string;
}

const RecentEnquiries: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchRecentEnquiries = async () => {
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setEnquiries(data || []);
      } catch (err) {
        console.error('Error fetching recent enquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEnquiries();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return theme.palette.warning.main;
      case 'approved':
        return theme.palette.success.main;
      case 'rejected':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleEnquiryClick = async (enquiryId: string) => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .eq('id', enquiryId)
        .single();

      if (error) throw error;
      setSelectedEnquiry(data);
      setDetailsOpen(true);
    } catch (err) {
      console.error('Error fetching enquiry details:', err);
    }
  };

  return (
    <>
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
          {loading ? (
            <LinearProgress 
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
          ) : (
            <Chip 
              label={`${enquiries.length} total`}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 500
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {enquiries.map((enquiry) => (
            <Box
              key={enquiry.id}
              onClick={() => handleEnquiryClick(enquiry.id)}
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
                  bgcolor: (theme) => alpha(getStatusColor(enquiry.status), 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getStatusColor(enquiry.status),
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {enquiry.name[0].toUpperCase()}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {enquiry.name}
                  </Typography>
                  <Chip 
                    label={enquiry.status}
                    size="small"
                    sx={{ 
                      bgcolor: alpha(getStatusColor(enquiry.status), 0.1),
                      color: getStatusColor(enquiry.status),
                      fontWeight: 500,
                      fontSize: '0.65rem'
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={14} />
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(enquiry.event_date).format('MMM D, YYYY')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Users size={14} />
                    <Typography variant="caption" color="text.secondary">
                      {enquiry.event_type}
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

      <EnquiryDetails
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedEnquiry(null);
        }}
        enquiry={selectedEnquiry}
      />
    </>
  );
};

export default RecentEnquiries; 
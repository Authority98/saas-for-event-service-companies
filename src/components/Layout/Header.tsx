import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme, alpha, Button } from '@mui/material';
import { Tent, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import EventSummaryBar from '../EventDetails/EventSummaryBar';
import { useEvent } from '../../contexts/EventContext';

interface HeaderProps {
  onContactClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  const theme = useTheme();
  const { eventDetails } = useEvent();
  const location = useLocation();

  // Only show EventSummaryBar on tent selection page
  const showEventSummary = location.pathname === '/tent-selection';
  // Only show contact button on landing page
  const showContactButton = location.pathname === '/';

  return (
    <AppBar 
      position="sticky" 
      color="transparent" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        bgcolor: '#F5F5F5',
        boxShadow: theme => `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          minHeight: { xs: 'auto', sm: '64px' }, 
          py: 1,
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <Tent size={32} />
            <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
                Tent+
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem', 
                  opacity: 0.7,
                  letterSpacing: '0.05em',
                  fontStyle: 'italic',
                  mt: -0.5,
                  background: 'linear-gradient(45deg, #1a1a1a 30%, #9c8275 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                By Authority98
              </Typography>
            </Box>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {showEventSummary && eventDetails && <EventSummaryBar eventDetails={eventDetails} />}
          
          {showContactButton && (
            <Button
              variant="outlined"
              onClick={onContactClick}
              startIcon={<MessageSquare size={18} />}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              Contact Us
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
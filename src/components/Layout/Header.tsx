import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme, alpha, IconButton } from '@mui/material';
import { Tent, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EventSummaryBar from '../EventDetails/EventSummaryBar';
import { useEvent } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../lib/toast';

const Header: React.FC = () => {
  const theme = useTheme();
  const { eventDetails } = useEvent();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast.success('Successfully logged out!');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      showToast.error('Failed to log out. Please try again.');
    }
  };

  // Only show EventSummaryBar on tent selection page
  const showEventSummary = location.pathname === '/tent-selection';

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
                Event+
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
          {user && (
            <IconButton
              onClick={handleSignOut}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1)
                }
              }}
            >
              <LogOut size={20} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Tent } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventSummaryBar from '../EventDetails/EventSummaryBar';

const Header: React.FC = () => {
  // Get event details from localStorage
  const savedEventDetails = localStorage.getItem('eventDetails');
  const eventDetails = savedEventDetails ? JSON.parse(savedEventDetails) : null;

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
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

        {eventDetails && <EventSummaryBar eventDetails={eventDetails} />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
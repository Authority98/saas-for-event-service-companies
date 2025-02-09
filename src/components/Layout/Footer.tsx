import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Event+. All rights reserved.
          </Typography>
          <Link to={user ? "/dashboard" : "/login"} style={{ textDecoration: 'none' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              color: 'text.secondary',
              '&:hover': { 
                color: 'primary.main'
              }
            }}>
              <Typography variant="body2">
                {user ? 'Dashboard' : 'Login'}
              </Typography>
              {user ? <LayoutDashboard size={16} /> : <LogIn size={16} />}
            </Box>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 
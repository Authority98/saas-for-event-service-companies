import React from 'react';
import { Box, Container, Grid, Typography, Button, alpha, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InstantQuoteGenerator from '../QuoteGenerator/InstantQuoteGenerator';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 2, md: 4 },
        pb: { xs: 2, md: 4 },
        bgcolor: '#F5F5F5',
        overflow: 'hidden',
        minHeight: '88vh',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.75rem', md: '3.75rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  mb: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Revolutionize Your Event Services
              </Typography>
              <Typography
                variant="h2"
                sx={{ 
                  fontSize: { xs: '1.25rem', md: '1.5rem' }, 
                  mb: 4,
                  color: alpha(theme.palette.text.primary, 0.7),
                  lineHeight: 1.6,
                  maxWidth: '90%',
                  fontWeight: 500,
                }}
              >
                Generate instant quotes, manage events, and grow your business with our all-in-one platform
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => window.location.href = 'https://buy.polar.sh/polar_cl_luGfhM8SeyW92R1rfe9hA3c0pTFtGXM5UCRZY0Fuu6x'}
                    sx={{
                      px: 4,
                      py: 1.8,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      bgcolor: '#1a1a1a',
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                      '&:hover': {
                        bgcolor: '#000000',
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/quote')}
                    sx={{
                      px: 4,
                      py: 1.8,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                    }}
                  >
                    Try Now
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', height: '500px' }}>
              <InstantQuoteGenerator />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
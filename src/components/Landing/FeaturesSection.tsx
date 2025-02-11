import React from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { Zap, Calendar, BarChart, Users } from 'lucide-react';

const features = [
  {
    icon: <Zap size={32} />,
    title: 'Instant Quotes',
    description: 'Generate accurate event quotes in seconds, not hours. Our smart algorithm considers all aspects of your event for precise pricing.',
    color: '#1a1a1a',
  },
  {
    icon: <Calendar size={32} />,
    title: 'Event Planning',
    description: 'Streamlined event management and scheduling with an intuitive interface. Keep track of all your events in one place.',
    color: '#9c8275',
  },
  {
    icon: <BarChart size={32} />,
    title: 'Analytics Dashboard',
    description: 'Track performance and growth with detailed insights. Make data-driven decisions to optimize your business.',
    color: '#1a1a1a',
  },
  {
    icon: <Users size={32} />,
    title: 'Client Management',
    description: 'Organize and manage your client relationships efficiently. Keep all client communications and preferences in one secure location.',
    color: '#9c8275',
  },
];

const FeatureCard: React.FC<{
  feature: typeof features[0];
  index: number;
}> = ({ feature, index }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Paper
        sx={{
          p: 4,
          height: '100%',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#ffffff',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
            '& .feature-icon': {
              transform: 'scale(1.1) rotate(5deg)',
              color: feature.color,
            },
            '& .feature-gradient': {
              opacity: 0.1,
            },
          },
        }}
      >
        {/* Background Gradient */}
        <Box
          className="feature-gradient"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            transition: 'opacity 0.3s ease',
            background: `linear-gradient(45deg, ${feature.color}, transparent)`,
          }}
        />

        {/* Icon */}
        <Box
          className="feature-icon"
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(feature.color, 0.08),
            color: alpha(feature.color, 0.8),
            mb: 3,
            transition: 'all 0.3s ease',
          }}
        >
          {feature.icon}
        </Box>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: feature.color,
            }}
          >
            {feature.title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: alpha(theme.palette.text.primary, 0.7),
              lineHeight: 1.7,
            }}
          >
            {feature.description}
          </Typography>
        </Box>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: alpha(feature.color, 0.03),
            transform: 'rotate(-45deg)',
          }}
        />
      </Paper>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: '#F5F5F5', pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Everything You Need
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Powerful features designed to streamline your event service business
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <FeatureCard feature={feature} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection; 
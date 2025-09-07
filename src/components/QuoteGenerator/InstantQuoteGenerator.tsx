import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  alpha,
  Slider,
} from '@mui/material';
import {
  PartyPopper,
  CalendarDays,
  Users2,
  Clock,
  ArrowRight,
  HeartHandshake,
  Building2,
  Cake,
  Users,
  Tent as TentIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const demoEventTypes = [
  { 
    type: 'Wedding Reception',
    icon: HeartHandshake,
    guests: 150,
    date: '2024-08-15',
    color: '#1a1a1a'
  },
  { 
    type: 'Corporate Event',
    icon: Building2,
    guests: 200,
    date: '2024-09-20',
    color: '#1a1a1a'
  },
  { 
    type: 'Birthday Party',
    icon: Cake,
    guests: 80,
    date: '2024-07-10',
    color: '#9c8275'
  },
  { 
    type: 'Family Reunion',
    icon: Users,
    guests: 120,
    date: '2024-06-25',
    color: '#1a1a1a'
  },
  { 
    type: 'Festival',
    icon: TentIcon,
    guests: 300,
    date: '2024-08-01',
    color: '#9c8275'
  },
];

const InstantQuoteGenerator: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [eventType, setEventType] = useState(demoEventTypes[0].type);
  const [guestCount, setGuestCount] = useState(100);
  const [eventDate, setEventDate] = useState<Date | null>(new Date('2024-08-15'));
  const [quoteAmount, setQuoteAmount] = useState(2450);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const getCurrentEventTypeInfo = () => {
    return demoEventTypes.find(event => event.type === eventType) || demoEventTypes[0];
  };

  const runDemoSequence = async () => {
    const demo = demoEventTypes[currentDemoIndex];
    
    // Highlight event type section
    setActiveSection('eventType');
    setEventType(demo.type);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Highlight and animate guest count
    setActiveSection('guestCount');
    const steps = 30;
    const currentGuests = isFirstLoad ? 100 : guestCount;
    const guestDiff = demo.guests - currentGuests;
    const guestStep = guestDiff / steps;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 60));
      setGuestCount(prev => Math.max(50, Math.round(prev + guestStep)));
    }
    
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Highlight and update date
    setActiveSection('eventDate');
    setEventDate(new Date(demo.date));
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Calculate quote
    setActiveSection('quote');
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const basePrice = 1500;
    const guestPrice = demo.guests * 5;
    const seasonMultiplier = new Date(demo.date).getMonth() >= 5 && new Date(demo.date).getMonth() <= 8 ? 1.2 : 1;
    const newQuote = Math.round((basePrice + guestPrice) * seasonMultiplier);
    
    setQuoteAmount(newQuote);
    setIsCalculating(false);
    
    // Reset active section and prepare for next demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    setActiveSection(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentDemoIndex((prev) => (prev + 1) % demoEventTypes.length);
  };

  useEffect(() => {
    const timer = setTimeout(runDemoSequence, 1000);
    return () => clearTimeout(timer);
  }, [currentDemoIndex]);

  const EventIcon = getCurrentEventTypeInfo().icon;
  const eventColor = getCurrentEventTypeInfo().color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: '#ffffff',
          boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.08)}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient line with animation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Instant Quote Generator
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.7,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontStyle: 'italic'
                }}
              >
                for tent rental service companies
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/quote')}
              endIcon={<motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={16} />
              </motion.div>}
              sx={{
                px: 3,
                py: 1,
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.9),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Try Now
            </Button>
          </motion.div>
        </Box>

        {/* Interactive Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={activeSection === 'eventType' ? 2 : 0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transform: activeSection === 'eventType' ? 'scale(1.005)' : 'scale(1)',
                transition: 'all 0.4s ease',
                bgcolor: activeSection === 'eventType' ? alpha(eventColor, 0.02) : '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(eventColor, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: eventColor,
                  }}
                >
                  <EventIcon size={20} />
                </Box>
                <Typography variant="body1" sx={{ 
                  color: activeSection === 'eventType' ? eventColor : 'text.primary',
                  fontWeight: activeSection === 'eventType' ? 500 : 400,
                  transition: 'all 0.3s ease',
                }}>
                  {eventType}
                </Typography>
              </Box>
            </Paper>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Paper
              elevation={activeSection === 'guestCount' ? 2 : 0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transform: activeSection === 'guestCount' ? 'scale(1.005)' : 'scale(1)',
                transition: 'all 0.4s ease',
                bgcolor: activeSection === 'guestCount' ? alpha(theme.palette.secondary.main, 0.02) : '#ffffff',
              }}
            >
              <Box sx={{ px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">
                    Guest Count
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    {guestCount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Users2 size={20} color={theme.palette.secondary.main} />
                  <Box sx={{ flex: 1 }}>
                    <Slider
                      value={guestCount}
                      onChange={(_, value) => setGuestCount(Math.max(50, value as number))}
                      min={50}
                      max={500}
                      step={10}
                      sx={{
                        color: theme.palette.secondary.main,
                        '& .MuiSlider-thumb': {
                          width: 24,
                          height: 24,
                          backgroundColor: '#fff',
                          border: `2px solid ${theme.palette.secondary.main}`,
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.secondary.main, 0.1)}`,
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0 0 0 8px ${alpha(theme.palette.secondary.main, 0.16)}`,
                          },
                        },
                        '& .MuiSlider-track': {
                          height: 4,
                          backgroundColor: theme.palette.secondary.main,
                        },
                        '& .MuiSlider-rail': {
                          height: 4,
                          backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              elevation={activeSection === 'eventDate' ? 2 : 0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transform: activeSection === 'eventDate' ? 'scale(1.005)' : 'scale(1)',
                transition: 'all 0.4s ease',
                bgcolor: activeSection === 'eventDate' ? alpha(theme.palette.primary.main, 0.02) : '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarDays size={20} color={activeSection === 'eventDate' ? theme.palette.primary.main : undefined} />
                <Typography 
                  variant="body1"
                  sx={{
                    color: activeSection === 'eventDate' ? theme.palette.primary.main : 'text.primary',
                    fontWeight: activeSection === 'eventDate' ? 500 : 400,
                  }}
                >
                  {dayjs(eventDate).format('MMMM D, YYYY')}
                </Typography>
              </Box>
            </Paper>
          </motion.div>

          {/* Quote Result */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              animate={{ 
                y: [0, -4, 0],
                boxShadow: [
                  `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                  `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                  `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Paper
                elevation={activeSection === 'quote' ? 2 : 0}
                sx={{
                  mt: 2,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: activeSection === 'quote' 
                    ? alpha(theme.palette.primary.main, 0.02)
                    : alpha(theme.palette.primary.main, 0.01),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.1),
                  transform: activeSection === 'quote' ? 'scale(1.005)' : 'scale(1)',
                  transition: 'all 0.4s ease',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Estimated Quote
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isCalculating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={quoteAmount}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.4,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                          }}
                        >
                          ${quoteAmount.toLocaleString()}
                        </Typography>
                      </motion.div>
                    )}
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Includes tent, setup, and basic amenities
                </Typography>
              </Paper>
            </motion.div>
          </motion.div>
        </Box>

        {/* Add subtle background pulse animation */}
        <motion.div
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      </Paper>
    </motion.div>
  );
};

export default InstantQuoteGenerator; 
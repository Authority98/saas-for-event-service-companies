import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Slider,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Zap,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle,
  ArrowRight,
  BarChart,
  Shield,
  Users,
  Tent,
  PartyPopper,
  CalendarDays,
  Users2,
  X,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import InstantQuoteGenerator from '../components/QuoteGenerator/InstantQuoteGenerator';
import HeroSection from '../components/Landing/HeroSection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import CTASection from '../components/Landing/CTASection';

const features = [
  {
    icon: <Zap size={28} />,
    title: 'Instant Quotes',
    description: 'Generate accurate tent rental quotes in seconds, not hours. Our smart algorithm considers all aspects of your tent rental needs for precise pricing.',
  },
  {
    icon: <Calendar size={28} />,
    title: 'Tent Rental Planning',
    description: 'Streamlined tent rental management and scheduling with an intuitive interface. Keep track of all your tent rentals in one place.',
  },
  {
    icon: <BarChart size={28} />,
    title: 'Analytics Dashboard',
    description: 'Track performance and growth with detailed insights. Make data-driven decisions to optimize your business.',
  },
  {
    icon: <Users size={28} />,
    title: 'Client Management',
    description: 'Organize and manage your client relationships',
  },
];

const pricingFeatures = [
  'Unlimited Quote Generation',
  'Client Management System',
  'Analytics Dashboard',
  'Event Planning Tools',
  'Email Notifications',
  'Priority Support',
  'Custom Branding',
  'Data Export',
];

const eventTypes = [
  'Wedding Reception',
  'Corporate Event',
  'Birthday Party',
  'Family Reunion',
  'Festival',
];

const demoEventTypes = [
  { type: 'Wedding Reception', guests: 150, date: '2024-08-15' },
  { type: 'Corporate Event', guests: 200, date: '2024-09-20' },
  { type: 'Birthday Party', guests: 80, date: '2024-07-10' },
  { type: 'Family Reunion', guests: 120, date: '2024-06-25' },
  { type: 'Festival', guests: 300, date: '2024-08-01' },
];

interface LandingPageProps {
  contactOpen: boolean;
  onContactClose: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ contactOpen, onContactClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [paymentOpen, setPaymentOpen] = useState(false);
  
  // Interactive quote state
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [guestCount, setGuestCount] = useState(150);
  const [eventDate, setEventDate] = useState<Date | null>(new Date('2024-08-15'));
  const [quoteAmount, setQuoteAmount] = useState(2450);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  // Animation sequence
  const runDemoSequence = async () => {
    const demo = demoEventTypes[currentDemoIndex];
    
    // Animate event type change
    setEventType(demo.type);
    
    // Animate guest count change smoothly using the slider
    const steps = 20;
    const guestDiff = demo.guests - guestCount;
    const guestStep = guestDiff / steps;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setGuestCount(prev => Math.round(prev + guestStep));
    }
    
    // Animate date change
    setEventDate(new Date(demo.date));
    
    // Show calculation animation
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update quote
    const basePrice = 1500;
    const guestPrice = demo.guests * 5;
    const seasonMultiplier = new Date(demo.date).getMonth() >= 5 && new Date(demo.date).getMonth() <= 8 ? 1.2 : 1;
    const newQuote = Math.round((basePrice + guestPrice) * seasonMultiplier);
    
    setQuoteAmount(newQuote);
    setIsCalculating(false);
    
    // Prepare for next demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentDemoIndex((prev) => (prev + 1) % demoEventTypes.length);
  };

  React.useEffect(() => {
    const timer = setTimeout(runDemoSequence, 1000);
    return () => clearTimeout(timer);
  }, [currentDemoIndex]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContactClose();
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission
    setPaymentOpen(false);
    // Navigate to success or dashboard
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <HeroSection />
      <FeaturesSection />
      <CTASection />

      {/* Contact Dialog */}
      <Dialog 
        open={contactOpen} 
        onClose={onContactClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Contact Us</Typography>
            <IconButton onClick={onContactClose} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleContactSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Users size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageSquare size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
              }}
            >
              Send Message
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog 
        open={paymentOpen} 
        onClose={() => setPaymentOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Complete Your Subscription</Typography>
            <IconButton onClick={() => setPaymentOpen(false)} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 2 }}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Monthly Subscription
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  $25
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Billed monthly • Cancel anytime
              </Typography>
            </Paper>

            <Box component="form" onSubmit={handlePaymentSubmit}>
              <TextField
                fullWidth
                label="Card Number"
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCard size={20} />
                    </InputAdornment>
                  ),
                }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={paymentForm.expiry}
                    onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVC"
                    value={paymentForm.cvc}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cvc: e.target.value })}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Name on Card"
                value={paymentForm.name}
                onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                }}
              >
                Subscribe Now
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LandingPage; 
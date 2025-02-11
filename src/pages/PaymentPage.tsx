import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  alpha,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CreditCard,
  CheckCircle,
  Shield,
  Zap,
  Calendar,
  Users,
  BarChart,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const PaymentPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle payment submission
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 4, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          zIndex: 0,
          borderRadius: '50%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          zIndex: 0,
          borderRadius: '50%',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                  position: 'relative',
                  overflow: 'hidden',
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
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                />

                <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                  Complete Your Purchase
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Professional Plan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monthly subscription
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          $25
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 400 }}
                          >
                            /mo
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Grid container spacing={2} sx={{ mb: 3 }}>
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
                    sx={{ mb: 4 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                  </Button>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
                      <Lock size={16} />
                      <Typography variant="caption">
                        Secure payment powered by Stripe
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  What's Included
                </Typography>

                <List>
                  {pricingFeatures.map((feature, index) => (
                    <ListItem
                      key={feature}
                      sx={{
                        px: 0,
                        '&:hover': {
                          '& .MuiListItemIcon-root': {
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: 'primary.main',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <CheckCircle size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          sx: { fontWeight: 500 },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.secondary.main, 0.1),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Shield size={24} color={theme.palette.secondary.main} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      30-Day Money-Back Guarantee
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Try our platform risk-free. If you're not completely satisfied, we'll refund your payment within the first 30 days.
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PaymentPage; 
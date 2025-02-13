import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Grid,
  Divider,
  Avatar,
  Button,
  Tooltip,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  MessageSquare,
  Tent,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  Download,
  Printer,
} from 'lucide-react';
import dayjs from 'dayjs';

interface EnquiryDetailsProps {
  open: boolean;
  onClose: () => void;
  enquiry: any;
}

const EnquiryDetails: React.FC<EnquiryDetailsProps> = ({ open, onClose, enquiry }) => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState<string | null>('all');

  if (!enquiry) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return theme.palette.info.main;
      case 'in_discussion':
        return theme.palette.warning.main;
      case 'quote_sent':
        return theme.palette.secondary.main;
      case 'confirmed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusBg = (status: string) => alpha(getStatusColor(status), 0.1);

  interface SectionProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    id: string;
    gradient?: string;
  }

  const Section: React.FC<SectionProps> = ({ 
    title, 
    icon: Icon, 
    children, 
    id,
    gradient = `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }) => {
    const isExpanded = expandedSection === 'all' || expandedSection === id;
    
    return (
      <Box 
        sx={{ 
          mb: 2,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: '#fff',
          boxShadow: '0 2px 8px 0 rgba(34, 41, 47, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 16px 0 rgba(34, 41, 47, 0.12)',
          }
        }}
      >
        <Box
          onClick={() => setExpandedSection(isExpanded && expandedSection !== 'all' ? null : id)}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: gradient,
            }
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
            }}
          >
            <Icon size={20} style={{ color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            {title}
          </Typography>
          {expandedSection !== 'all' && (isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
        </Box>
        <Collapse in={isExpanded}>
          <Box sx={{ p: 2, pt: 0 }}>
            <Divider sx={{ my: 2 }} />
            {children}
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: `linear-gradient(to bottom right, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.02)})`,
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56,
              bgcolor: getStatusBg(enquiry.status),
              color: getStatusColor(enquiry.status),
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            {enquiry.name[0].toUpperCase()}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {enquiry.name}
              </Typography>
              <Chip
                label={enquiry.status}
                size="small"
                sx={{
                  bgcolor: getStatusBg(enquiry.status),
                  color: getStatusColor(enquiry.status),
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Clock size={14} />
                {dayjs(enquiry.created_at).format('MMM D, YYYY [at] h:mm A')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Mail size={14} />
                {enquiry.email}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Send Email">
            <IconButton size="small" sx={{ color: 'primary.main' }}>
              <Send size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download PDF">
            <IconButton size="small" sx={{ color: 'primary.main' }}>
              <Download size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton size="small" sx={{ color: 'primary.main' }}>
              <Printer size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
              <X size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Section title="Contact Information" icon={Users} id="contact" gradient={`linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={16} />
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {enquiry.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={16} />
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {enquiry.telephone}
                  </Typography>
                </Grid>
              </Grid>
            </Section>

            <Section title="Event Details" icon={Calendar} id="event" gradient={`linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.success.main})`}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" color="text.secondary">Event Date</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {dayjs(enquiry.event_date).format('MMMM D, YYYY')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={16} />
                    <Typography variant="body2" color="text.secondary">Location</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {enquiry.venue_location}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={16} />
                    <Typography variant="body2" color="text.secondary">Total Guests</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {enquiry.total_guests} people
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={16} />
                    <Typography variant="body2" color="text.secondary">Formal Dining</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {enquiry.formal_dining_seats} seats
                  </Typography>
                </Grid>
              </Grid>
            </Section>

            <Section title="Selected Tents & Extras" icon={Tent} id="products" gradient={`linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.info.main})`}>
              <Grid container spacing={2}>
                {enquiry.selected_products?.map((product: any, index: number) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      {/* Tent Details */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        justifyContent: 'space-between',
                        mb: product.extras?.length > 0 ? 2 : 0
                      }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tent size={18} />
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.type} - {product.size}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                            £{product.price}
                          </Typography>
                          {product.quantity && (
                            <Typography variant="caption" color="text.secondary">
                              Qty: {product.quantity}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Associated Extras */}
                      {product.extras && Object.keys(product.extras).length > 0 && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                            Selected Extras:
                          </Typography>
                          <Grid container spacing={1}>
                            {Object.entries(product.extras).map(([extraId, extraData]: [string, any], extraIndex: number) => {
                              if (!extraData.selected) return null;
                              const extra = extraData.details || { name: 'Unknown Extra', price: 0, price_per_unit: 0 };
                              const quantity = extraData.quantity || 1;
                              const price = extra.price_per_unit ? extra.price_per_unit * quantity : extra.price;

                              return (
                                <Grid item xs={12} sm={6} key={extraIndex}>
                                  <Box
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 1,
                                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {extra.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        {extraData.quantity ? `Quantity: ${quantity}` : 'Selected'}
                                      </Typography>
                                      <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                                        £{price}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Section>

            {enquiry.comments && (
              <Section title="Additional Comments" icon={MessageSquare} id="comments" gradient={`linear-gradient(45deg, ${theme.palette.grey[700]}, ${theme.palette.grey[900]})`}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                  {enquiry.comments}
                </Typography>
              </Section>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryDetails; 
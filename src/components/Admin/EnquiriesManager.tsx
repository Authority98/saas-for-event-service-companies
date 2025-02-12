import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Menu,
  MenuItem,
} from '@mui/material';
import { Eye, X, MoreVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import dayjs from 'dayjs';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  telephone: string;
  event_type: string;
  comments: string;
  event_date: string;
  venue_location: string;
  total_guests: number;
  formal_dining_seats: number;
  selected_products: any[];
  selected_extras: any;
  status: string;
  created_at: string;
  send_brochure: boolean;
}

const EnquiriesManager: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEnquiryForStatus, setSelectedEnquiryForStatus] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setEnquiries(data || []);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'info';
      case 'in_discussion':
        return 'warning';
      case 'quote_sent':
        return 'secondary';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setDetailsOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedEnquiryForStatus) return;

    try {
      const { error: updateError } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', selectedEnquiryForStatus);

      if (updateError) throw updateError;

      // Update local state
      setEnquiries(enquiries.map(enquiry => 
        enquiry.id === selectedEnquiryForStatus 
          ? { ...enquiry, status: newStatus }
          : enquiry
      ));

      // Update selected enquiry if it's open in the details dialog
      if (selectedEnquiry?.id === selectedEnquiryForStatus) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }

    } catch (err) {
      console.error('Error updating enquiry status:', err);
      setError('Failed to update status');
    } finally {
      setStatusMenuAnchor(null);
      setSelectedEnquiryForStatus(null);
    }
  };

  const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>, enquiryId: string) => {
    event.stopPropagation();
    setStatusMenuAnchor(event.currentTarget);
    setSelectedEnquiryForStatus(enquiryId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedEnquiryForStatus(null);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Customer Enquiries</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow 
                key={enquiry.id}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleViewDetails(enquiry)}
              >
                <TableCell>{dayjs(enquiry.created_at).format('MMM D, YYYY')}</TableCell>
                <TableCell>{enquiry.name}</TableCell>
                <TableCell>{enquiry.event_type}</TableCell>
                <TableCell>{dayjs(enquiry.event_date).format('MMM D, YYYY')}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={enquiry.status}
                      color={getStatusColor(enquiry.status)}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleStatusMenuOpen(e, enquiry.id)}
                    >
                      <MoreVertical size={16} />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(enquiry);
                    }}
                  >
                    <Eye size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleStatusMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('new')}>
          <Chip label="New Enquiry" color="info" size="small" sx={{ minWidth: 120 }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('in_discussion')}>
          <Chip label="In Discussion" color="warning" size="small" sx={{ minWidth: 120 }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('quote_sent')}>
          <Chip label="Quote Sent" color="secondary" size="small" sx={{ minWidth: 120 }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('confirmed')}>
          <Chip label="Confirmed" color="success" size="small" sx={{ minWidth: 120 }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>
          <Chip label="Cancelled" color="error" size="small" sx={{ minWidth: 120 }} />
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">Enquiry Details</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={selectedEnquiry?.status} 
                  color={getStatusColor(selectedEnquiry?.status || '')}
                  size="small"
                />
                {selectedEnquiry && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleStatusMenuOpen(e, selectedEnquiry.id)}
                  >
                    <MoreVertical size={16} />
                  </IconButton>
                )}
              </Box>
            </Box>
            <IconButton onClick={() => setDetailsOpen(false)} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEnquiry && (
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body1">
                      <strong>Name:</strong> {selectedEnquiry.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {selectedEnquiry.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Phone:</strong> {selectedEnquiry.telephone}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Event Details */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Event Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body1">
                      <strong>Event Type:</strong> {selectedEnquiry.event_type}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date:</strong> {dayjs(selectedEnquiry.event_date).format('MMM D, YYYY')}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {selectedEnquiry.venue_location}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Total Guests:</strong> {selectedEnquiry.total_guests}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Formal Dining Seats:</strong> {selectedEnquiry.formal_dining_seats}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Selected Products */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Selected Products
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {selectedEnquiry.selected_products.map((product, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: 'background.default',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="body2">{product.name}</Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={500}>
                          £{product.price}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Selected Extras */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Selected Extras
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(selectedEnquiry.selected_extras).map(([extraId, extraData]: [string, any]) => {
                      if (!extraData.selected && (!extraData.quantity || extraData.quantity === 0)) {
                        return null;
                      }
                      return (
                        <Box 
                          key={extraId}
                          sx={{ 
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: 'background.default',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Box>
                            <Typography variant="body2">
                              {extraData.name || "Extra Item"}
                            </Typography>
                            {extraData.quantity > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Quantity: {extraData.quantity}
                              </Typography>
                            )}
                          </Box>
                          {extraData.price && (
                            <Typography variant="body2" color="primary.main" fontWeight={500}>
                              £{extraData.price * (extraData.quantity || 1)}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              </Grid>

              {/* Additional Comments */}
              {selectedEnquiry.comments && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Additional Comments
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedEnquiry.comments}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnquiriesManager; 
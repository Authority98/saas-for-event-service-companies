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
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Eye, X, MoreVertical, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import dayjs from 'dayjs';
import EnquiryDetails from './EnquiryDetails';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      
      // First fetch all enquiries
      const { data: enquiriesData, error: enquiriesError } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (enquiriesError) throw enquiriesError;

      // Fetch all extras
      const { data: extrasData, error: extrasError } = await supabase
        .from('extras')
        .select('*');

      if (extrasError) throw extrasError;

      // Create a map of extras by ID for easy lookup
      const extrasMap = extrasData.reduce((acc: any, extra: any) => {
        acc[extra.id] = extra;
        return acc;
      }, {});

      // Merge extras details with enquiries
      const enrichedEnquiries = enquiriesData.map((enquiry: any) => {
        if (enquiry.selected_extras) {
          const enrichedExtras = Object.entries(enquiry.selected_extras).reduce((acc: any, [extraId, extraData]: [string, any]) => {
            acc[extraId] = {
              ...extraData,
              details: extrasMap[extraId] || null
            };
            return acc;
          }, {});
          return { ...enquiry, selected_extras: enrichedExtras };
        }
        return enquiry;
      });

      setEnquiries(enrichedEnquiries || []);
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

  const handleViewDetails = async (enquiry: Enquiry) => {
    try {
      // Fetch all extras
      const { data: extrasData, error: extrasError } = await supabase
        .from('extras')
        .select('*');

      if (extrasError) throw extrasError;

      // Create a map of extras by ID for easy lookup
      const extrasMap = extrasData.reduce((acc: any, extra: any) => {
        acc[extra.id] = extra;
        return acc;
      }, {});

      // Enrich the selected products with extras details
      const enrichedProducts = enquiry.selected_products?.map((product: any) => {
        if (product.extras) {
          const enrichedExtras = Object.entries(product.extras).reduce((acc: any, [extraId, extraData]: [string, any]) => {
            acc[extraId] = {
              ...extraData,
              details: extrasMap[extraId] || null
            };
            return acc;
          }, {});
          return { ...product, extras: enrichedExtras };
        }
        return product;
      });

      // Set the enriched enquiry data
      setSelectedEnquiry({
        ...enquiry,
        selected_products: enrichedProducts
      });
      setDetailsOpen(true);
    } catch (err) {
      console.error('Error fetching extras details:', err);
      setError('Failed to load enquiry details');
    }
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

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.event_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    const matchesEventType = eventTypeFilter === 'all' || enquiry.event_type === eventTypeFilter;
    
    const eventDate = dayjs(enquiry.event_date);
    const matchesDate = dateFilter === 'all' ||
      (dateFilter === 'upcoming' && eventDate.isAfter(dayjs())) ||
      (dateFilter === 'past' && eventDate.isBefore(dayjs())) ||
      (dateFilter === 'thisMonth' && eventDate.isSame(dayjs(), 'month')) ||
      (dateFilter === 'nextMonth' && eventDate.isAfter(dayjs().endOf('month')));

    return matchesSearch && matchesStatus && matchesEventType && matchesDate;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Customer Enquiries</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            placeholder="Search by name, email, or event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="new">New Enquiry</MenuItem>
                <MenuItem value="in_discussion">In Discussion</MenuItem>
                <MenuItem value="quote_sent">Quote Sent</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={eventTypeFilter}
                label="Event Type"
                onChange={(e) => setEventTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Events</MenuItem>
                <MenuItem value="Wedding">Wedding</MenuItem>
                <MenuItem value="Corporate Event">Corporate Event</MenuItem>
                <MenuItem value="Birthday Party">Birthday Party</MenuItem>
                <MenuItem value="Anniversary">Anniversary</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                label="Date"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="upcoming">Upcoming Events</MenuItem>
                <MenuItem value="past">Past Events</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="nextMonth">Next Month</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {filteredEnquiries.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="text.secondary">
            No enquiries found matching your filters
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
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
              {filteredEnquiries.map((enquiry) => (
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
      )}

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
      <EnquiryDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        enquiry={selectedEnquiry}
      />
    </Box>
  );
};

export default EnquiriesManager; 
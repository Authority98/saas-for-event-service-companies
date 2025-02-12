import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';
import StepProgress from '../components/EventForm/StepProgress';
import QuoteBuilder from '../components/Quote/QuoteBuilder';
import type { ContactDetails, Product, Extra } from '../types';
import { supabase } from '../lib/supabase';

interface SelectedExtra {
  selected: boolean;
  quantity?: number;
  options?: {
    [key: string]: {
      selected: boolean;
      quantity: number;
    };
  };
}

interface SelectedExtras {
  [key: string]: SelectedExtra;
}

const ContactDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    name: '',
    email: '',
    eventType: '',
    referralSource: '',
    telephone: '',
    comments: '',
    sendBrochure: false,
  });
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtras>({});
  const [extras, setExtras] = useState<Extra[]>([]);

  useEffect(() => {
    // Load selected products from localStorage
    const savedProducts = localStorage.getItem('selectedProducts');
    if (savedProducts) {
      setSelectedProducts(JSON.parse(savedProducts));
    }
    
    // Load selected extras from localStorage
    const savedExtras = localStorage.getItem('selectedExtras');
    if (savedExtras) {
      setSelectedExtras(JSON.parse(savedExtras));
    }
    
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExtras(data || []);
    } catch (err) {
      console.error('Error fetching extras:', err);
    }
  };

  const getTotalExtrasPrice = () => {
    let total = 0;
    
    extras.forEach(extra => {
      const extraState = selectedExtras[extra.id];
      if (!extraState) return;

      if (extra.type === 'CHECKBOX' && extraState.selected) {
        total += extra.price ?? 0;
      }

      if (extra.type === 'QUANTITY' && extraState.quantity) {
        total += (extra.price ?? 0) * extraState.quantity;
      }

      if (extra.type === 'TOGGLE_WITH_QUANTITY' && extraState.options) {
        Object.entries(extraState.options).forEach(([optionId, optionState]) => {
          const option = extra.options?.find(o => o.id === optionId);
          if (option && optionState.selected && optionState.quantity) {
            total += (option.price ?? 0) * optionState.quantity;
          }
        });
      }
    });

    return total;
  };

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Anniversary',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get event details from localStorage
      const eventDetailsStr = localStorage.getItem('eventDetails');
      const eventDetails = eventDetailsStr ? JSON.parse(eventDetailsStr) : null;

      const enquiryData = {
        name: contactDetails.name,
        email: contactDetails.email,
        telephone: contactDetails.telephone,
        event_type: contactDetails.eventType,
        comments: contactDetails.comments,
        send_brochure: contactDetails.sendBrochure,
        event_date: eventDetails?.eventDate,
        venue_location: eventDetails?.venueLocation,
        total_guests: eventDetails?.totalGuests,
        formal_dining_seats: eventDetails?.formalDiningSeats,
        selected_products: selectedProducts,
        selected_extras: selectedExtras,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('enquiries')
        .insert([enquiryData]);

      if (error) throw error;

      // Save to localStorage and navigate only if database save was successful
      localStorage.setItem('contactDetails', JSON.stringify(contactDetails));
      navigate('/thank-you');
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <StepProgress activeStep={2} />

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      required
                      value={contactDetails.name}
                      onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      required
                      value={contactDetails.email}
                      onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telephone"
                      required
                      value={contactDetails.telephone}
                      onChange={(e) => setContactDetails({ ...contactDetails, telephone: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Event Type"
                      required
                      value={contactDetails.eventType}
                      onChange={(e) => setContactDetails({ ...contactDetails, eventType: e.target.value })}
                    >
                      {eventTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Comments / Notes"
                      multiline
                      rows={4}
                      value={contactDetails.comments}
                      onChange={(e) => setContactDetails({ ...contactDetails, comments: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={contactDetails.sendBrochure}
                          onChange={(e) => setContactDetails({ ...contactDetails, sendBrochure: e.target.checked })}
                        />
                      }
                      label="Send Brochure"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                      >
                        Submit Enquiry
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Quote Builder */}
          <Grid item xs={12} md={4}>
            <QuoteBuilder
              selectedProducts={selectedProducts}
              selectedExtras={selectedExtras}
              extras={extras}
              getTotalExtrasPrice={getTotalExtrasPrice}
              showExtras={false}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ContactDetailsPage;
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
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import { Check } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import StepProgress from '../components/EventForm/StepProgress';
import type { EventDetails, TentType } from '../types';
import { useEvent } from '../contexts/EventContext';
import { supabase } from '../lib/supabase';

const EventDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { eventDetails: contextEventDetails, updateEventDetails } = useEvent();
  const [tentTypes, setTentTypes] = useState<TentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState<EventDetails>(() => {
    if (contextEventDetails) {
      return contextEventDetails;
    }
    return {
      eventDate: dayjs().toDate(),
      venueLocation: '',
      totalGuests: 0,
      formalDiningSeats: 0,
      interestedIn: {},
    };
  });

  useEffect(() => {
    if (contextEventDetails) {
      setEventDetails(contextEventDetails);
    }
  }, [contextEventDetails]);

  useEffect(() => {
    fetchTentTypes();
  }, []);

  const fetchTentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('tent_types')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Initialize interestedIn object with fetched tent types
      const initialInterestedIn = (data || []).reduce((acc: Record<string, boolean>, type) => {
        acc[type.name.toLowerCase().replace(/\s+/g, '')] = false;
        return acc;
      }, {});

      setTentTypes(data || []);
      setEventDetails(prev => ({
        ...prev,
        interestedIn: prev.interestedIn || initialInterestedIn
      }));
    } catch (err) {
      console.error('Error fetching tent types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEventDetails(eventDetails);
    navigate('/tent-selection');
  };

  const handleNumberChange = (field: 'totalGuests' | 'formalDiningSeats', value: string) => {
    const numberValue = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
    setEventDetails({ ...eventDetails, [field]: numberValue });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <StepProgress activeStep={0} />
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary" sx={{ mb: 3 }}>
            Please provide some basic event details so we can work out options.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Event Date"
                  value={dayjs(eventDetails.eventDate)}
                  onChange={(date) => setEventDetails({ ...eventDetails, eventDate: date?.toDate() || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Venue Location"
                  value={eventDetails.venueLocation}
                  onChange={(e) => setEventDetails({ ...eventDetails, venueLocation: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Guests"
                  value={eventDetails.totalGuests || ''}
                  onChange={(e) => handleNumberChange('totalGuests', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Dining Seats"
                  value={eventDetails.formalDiningSeats || ''}
                  onChange={(e) => handleNumberChange('formalDiningSeats', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                I'm interested in:
              </Typography>

              <Grid container spacing={3}>
                {tentTypes.map((tentType) => {
                  const key = tentType.name.toLowerCase().replace(/\s+/g, '');
                  return (
                    <Grid item xs={12} sm={6} md={3} key={tentType.id}>
                      <Card 
                        sx={{ 
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                          },
                          ...(eventDetails.interestedIn[key] && {
                            outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                          })
                        }}
                        onClick={() => setEventDetails({
                          ...eventDetails,
                          interestedIn: { 
                            ...eventDetails.interestedIn, 
                            [key]: !eventDetails.interestedIn[key]
                          }
                        })}
                      >
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="160"
                            image={tentType.image_url || "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80"}
                            alt={tentType.name}
                          />
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {tentType.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {tentType.description}
                            </Typography>
                          </CardContent>
                          {eventDetails.interestedIn[key] && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                bgcolor: 'primary.main',
                                borderRadius: '50%',
                                width: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Check color="white" size={20} />
                            </Box>
                          )}
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={loading || tentTypes.length === 0}
              >
                Next: Tent Selection
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EventDetailsPage;
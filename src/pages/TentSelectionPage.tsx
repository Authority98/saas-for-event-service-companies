import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Switch,
  Chip,
} from '@mui/material';
import { Calendar, MapPin, Users, UtensilsCrossed } from 'lucide-react';
import { supabase } from '../lib/supabase';
import StepProgress from '../components/EventForm/StepProgress';
import type { Product, Extra, EventDetails } from '../types';
import dayjs from 'dayjs';
import EventSummaryBar from '../components/EventDetails/EventSummaryBar';
import { useEvent } from '../contexts/EventContext';
import QuoteBuilder from '../components/Quote/QuoteBuilder';

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

const TentSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventDetails } = useEvent();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtras>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchProducts();
    fetchExtras();
  }, []);

  useEffect(() => {
    if (products.length > 0 && eventDetails) {
      // Filter products based on interested tent types
      const interestedTypes = Object.entries(eventDetails.interestedIn)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      const filtered = products.filter(product => 
        interestedTypes.some(type => 
          product.type.toLowerCase().replace(/\s+/g, '') === type.toLowerCase()
        )
      );
      setFilteredProducts(filtered);

      // Also update selected products to remove any that are no longer in interested types
      const updatedSelectedProducts = selectedProducts.filter(product => 
        interestedTypes.some(type => 
          product.type.toLowerCase().replace(/\s+/g, '') === type.toLowerCase()
        )
      );
      if (updatedSelectedProducts.length !== selectedProducts.length) {
        setSelectedProducts(updatedSelectedProducts);
        localStorage.setItem('selectedProducts', JSON.stringify(updatedSelectedProducts));
      }
    } else {
      setFilteredProducts([]);
    }
  }, [products, eventDetails, selectedProducts]);

  // Add new useEffect to save selectedExtras to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedExtras', JSON.stringify(selectedExtras));
  }, [selectedExtras]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExtras(data || []);

      // Initialize extras with their minimum quantities
      const initialExtras: SelectedExtras = {};
      data?.forEach(extra => {
        if (extra.type === 'TOGGLE_WITH_QUANTITY' || extra.type === 'RANGE') {
          initialExtras[extra.id] = {
            selected: false,
            quantity: extra.min_quantity || 0
          };
        }
      });
      setSelectedExtras(prev => ({
        ...prev,
        ...initialExtras
      }));
    } catch (err) {
      console.error('Error fetching extras:', err);
      setError('Failed to load extras. Please try again later.');
    }
  };

  const handleProductSelect = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
      // Save selected products to localStorage
      const updatedProducts = selectedProducts.filter(p => p.id !== product.id);
      localStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
    } else {
      setSelectedProducts([...selectedProducts, product]);
      // Save selected products and extras to localStorage
      const updatedProducts = [...selectedProducts, product];
      localStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
      localStorage.setItem('selectedExtras', JSON.stringify(selectedExtras));
    }
  };

  const handleExtraChange = (extraId: string, value: boolean) => {
    setSelectedExtras((prev: SelectedExtras) => ({
      ...prev,
      [extraId]: {
        ...prev[extraId],
        selected: value,
      },
    }));
  };

  const handleExtraQuantityChange = (extraId: string, quantity: number) => {
    setSelectedExtras((prev: SelectedExtras) => ({
      ...prev,
      [extraId]: {
        ...prev[extraId],
        quantity,
      },
    }));
  };

  const handleToggleOptionChange = (extraId: string, optionId: string, value: boolean) => {
    setSelectedExtras((prev: SelectedExtras) => ({
      ...prev,
      [extraId]: {
        ...prev[extraId],
        options: {
          ...prev[extraId]?.options,
          [optionId]: {
            selected: value,
            quantity: prev[extraId]?.options?.[optionId]?.quantity || 0,
          },
        },
      },
    }));
  };

  const handleToggleQuantityChange = (extraId: string, optionId: string, quantity: number) => {
    setSelectedExtras((prev: SelectedExtras) => ({
      ...prev,
      [extraId]: {
        ...prev[extraId],
        options: {
          ...prev[extraId]?.options,
          [optionId]: {
            selected: prev[extraId]?.options?.[optionId]?.selected || false,
            quantity,
          },
        },
      },
    }));
  };

  const handleNext = () => {
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    localStorage.setItem('selectedExtras', JSON.stringify(selectedExtras));
    navigate('/contact-details');
  };

  const getTotalExtrasPrice = () => {
    let total = 0;
    
    extras.forEach(extra => {
      const extraState = selectedExtras[extra.id];
      if (!extraState) return;

      if (extra.type === 'CHECKBOX' && extraState.selected) {
        total += extra.price ?? 0;
      }

      if (extra.type === 'RANGE' && extraState.quantity !== undefined) {
        total += (extra.price_per_unit ?? 0) * extraState.quantity;
      }

      if (extra.type === 'TOGGLE_WITH_QUANTITY' && extraState.quantity !== undefined) {
        total += (extra.price ?? 0) * extraState.quantity;
      }
    });

    return total;
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <StepProgress activeStep={1} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Quote Builder */}
          <Grid item xs={12} md={4}>
            <QuoteBuilder
              selectedProducts={selectedProducts}
              selectedExtras={selectedExtras}
              extras={extras}
              getTotalExtrasPrice={getTotalExtrasPrice}
              onExtraChange={handleExtraChange}
              onExtraQuantityChange={handleExtraQuantityChange}
              onToggleOptionChange={handleToggleOptionChange}
              onToggleQuantityChange={handleToggleQuantityChange}
              onRemoveProduct={(productId) => handleProductSelect(selectedProducts.find(p => p.id === productId)!)}
              onNext={handleNext}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {filteredProducts.length === 0 ? (
                <Grid item xs={12}>
                  <Typography color="text.secondary">
                    No tents available at the moment. Please check back later.
                  </Typography>
                </Grid>
              ) : (
                filteredProducts.map(product => (
                  <Grid item xs={12} sm={6} key={product.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {selectedProducts.find(p => p.id === product.id) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: 'primary.main',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: '4px',
                            zIndex: 1,
                            boxShadow: 2,
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Selected
                          </Typography>
                        </Box>
                      )}
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image_url || 'https://images.unsplash.com/photo-1612454376902-577cd469d008?auto=format&fit=crop&w=800&q=80'}
                        alt={product.name}
                        sx={{
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
                          }
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip 
                            label={product.type}
                            size="small"
                            sx={{ 
                              bgcolor: 'background.default',
                              fontWeight: 500
                            }}
                          />
                          {product.size && (
                            <Chip 
                              label={product.size}
                              size="small"
                              sx={{ 
                                bgcolor: 'background.default',
                                fontWeight: 500
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {product.description}
                        </Typography>

                        {/* Selected Extras Display */}
                        {Object.entries(selectedExtras).length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Selected Extras:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {extras.map(extra => {
                                const extraState = selectedExtras[extra.id];
                                if (!extraState) return null;

                                if (extra.type === 'CHECKBOX' && extraState.selected) {
                                  return (
                                    <Chip
                                      key={extra.id}
                                      label={extra.name}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.7rem' }}
                                    />
                                  );
                                }

                                if (extra.type === 'RANGE' && extraState.quantity !== undefined) {
                                  return (
                                    <Chip
                                      key={extra.id}
                                      label={`${extra.name} (${extraState.quantity})`}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.7rem' }}
                                    />
                                  );
                                }

                                if (extra.type === 'TOGGLE_WITH_QUANTITY' && extraState.quantity !== undefined) {
                                  const toggleState = extraState.selected ? extra.right_label : extra.left_label;
                                  return (
                                    <Chip
                                      key={extra.id}
                                      label={`${extra.name} (${extraState.quantity}) - ${toggleState}`}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.7rem' }}
                                    />
                                  );
                                }

                                return null;
                              })}
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                          <Typography 
                            variant="h6" 
                            color="primary" 
                            sx={{ 
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: 0.5
                            }}
                          >
                            £{product.price + getTotalExtrasPrice()}
                          </Typography>
                          <Button
                            variant={selectedProducts.find(p => p.id === product.id) ? "contained" : "outlined"}
                            onClick={() => handleProductSelect(product)}
                            sx={{
                              minWidth: 120,
                              borderRadius: '4px'
                            }}
                          >
                            {selectedProducts.find(p => p.id === product.id) ? "Selected" : "Select"}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TentSelectionPage;
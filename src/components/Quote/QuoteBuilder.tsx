import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  FormControlLabel,
  Checkbox,
  TextField,
  Switch,
  Grid,
  IconButton,
  Button,
} from '@mui/material';
import { X } from 'lucide-react';
import type { Product, Extra } from '../../types';

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

interface QuoteBuilderProps {
  selectedProducts: Product[];
  selectedExtras: SelectedExtras;
  extras: Extra[];
  getTotalExtrasPrice: () => number;
  showTitle?: boolean;
  onExtraChange?: (extraId: string, value: boolean) => void;
  onExtraQuantityChange?: (extraId: string, quantity: number) => void;
  onToggleOptionChange?: (extraId: string, optionId: string, value: boolean) => void;
  onToggleQuantityChange?: (extraId: string, optionId: string, quantity: number) => void;
  onRemoveProduct?: (productId: string) => void;
  onNext?: () => void;
}

const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  selectedProducts,
  selectedExtras,
  extras,
  getTotalExtrasPrice,
  showTitle = true,
  onExtraChange,
  onExtraQuantityChange,
  onToggleOptionChange,
  onToggleQuantityChange,
  onRemoveProduct,
  onNext,
}) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        bgcolor: 'background.paper',
        boxShadow: (theme) => `0 4px 24px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}`
      }}
    >
      {/* Background accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
        }}
      />
      
      <Box sx={{ mb: 4 }}>
        {showTitle && (
          <Box 
            sx={{ 
              mb: 3,
              position: 'relative',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Divider 
              sx={{ 
                width: '100%',
                borderStyle: 'dashed',
                borderWidth: '2px',
                borderColor: 'divider'
              }} 
            />
            <Box
              sx={{
                position: 'absolute',
                bgcolor: 'background.paper',
                px: 2,
                py: 1,
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Your Quote
            </Box>
          </Box>
        )}
        {selectedProducts.length === 0 ? (
          <Box 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              bgcolor: 'background.default',
              borderRadius: 1,
              border: '2px dashed',
              borderColor: 'divider',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Your quote is empty
            </Typography>
            <Typography variant="caption">
              Please select tents to build your quote
            </Typography>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              maxHeight: '400px',
              overflowY: 'auto',
              pr: 1,
              bgcolor: '#ffffff',
              borderRadius: '8px',
              p: 2,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: (theme) => theme.palette.divider,
                borderRadius: '3px',
              }
            }}
          >
            {selectedProducts.map(product => (
              <Paper
                key={product.id}
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  bgcolor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: (theme) => theme.palette.divider,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', position: 'relative' }}>
                  <Box
                    component="img"
                    src={product.image_url || 'https://images.unsplash.com/photo-1612454376902-577cd469d008?auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    sx={{
                      width: 80,
                      height: 60,
                      borderRadius: 1,
                      objectFit: 'cover'
                    }}
                  />
                  <Box sx={{ flex: 1, pr: 4 }}>
                    <Typography variant="subtitle2">{product.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {product.size}
                    </Typography>
                    
                    {/* Selected Extras Summary */}
                    {Object.entries(selectedExtras).some(([_, extraValue]) => 
                      extraValue.selected || 
                      (extraValue.quantity && extraValue.quantity > 0) || 
                      Object.values(extraValue.options || {}).some(opt => opt.selected)
                    ) && (
                      <Box sx={{ mt: 1 }}>
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

                            if (extra.type === 'QUANTITY' && extraState.quantity && extraState.quantity > 0) {
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

                            if (extra.type === 'TOGGLE_WITH_QUANTITY' && extraState.options) {
                              return Object.entries(extraState.options).map(([optionId, optionState]) => {
                                const option = extra.options?.find(o => o.id === optionId);
                                if (!option || !optionState.selected) return null;
                                return (
                                  <Chip
                                    key={`${extra.id}-${optionId}`}
                                    label={`${option.name} (${optionState.quantity})`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                );
                              });
                            }

                            return null;
                          })}
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
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
                    </Box>
                  </Box>
                  {onRemoveProduct && (
                    <IconButton
                      size="small"
                      onClick={() => onRemoveProduct(product.id)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'error.main'
                        }
                      }}
                    >
                      <X size={18} />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* Add Extras Section */}
        {extras.length > 0 && onExtraChange && (
          <>
            <Box 
              sx={{ 
                my: 2,
                position: 'relative',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Divider 
                sx={{ 
                  width: '100%',
                  borderStyle: 'dashed',
                  borderWidth: '2px',
                  borderColor: 'divider'
                }} 
              />
              <Box
                sx={{
                  position: 'absolute',
                  bgcolor: 'background.paper',
                  px: 2,
                  py: 1,
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                Add Extras
              </Box>
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  pr: 1,
                  bgcolor: '#ffffff',
                  borderRadius: '8px',
                  p: 2,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: (theme) => theme.palette.divider,
                    borderRadius: '3px',
                  }
                }}
              >
                {extras.map(extra => (
                  <Paper
                    key={extra.id}
                    sx={{
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: '#ffffff',
                      position: 'relative',
                      border: '1px solid',
                      borderColor: (theme) => theme.palette.divider,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    {extra.type === 'CHECKBOX' && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedExtras[extra.id]?.selected || false}
                            onChange={(e) => onExtraChange(extra.id, e.target.checked)}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2">{extra.name}</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              £{extra.price}
                            </Typography>
                          </Box>
                        }
                      />
                    )}

                    {extra.type === 'QUANTITY' && onExtraQuantityChange && (
                      <Box component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box component="div">
                          <Typography variant="body2">{extra.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            £{extra.price_per_unit} per unit
                          </Typography>
                        </Box>
                        <TextField
                          type="number"
                          size="small"
                          value={selectedExtras[extra.id]?.quantity ?? ''}
                          onChange={(e) => onExtraQuantityChange(extra.id, Number(e.target.value))}
                          inputProps={{
                            min: extra.min_quantity || 0,
                            max: extra.max_quantity || undefined,
                            style: { width: '60px', padding: '4px 8px' }
                          }}
                        />
                      </Box>
                    )}

                    {extra.type === 'TOGGLE_WITH_QUANTITY' && onToggleOptionChange && onToggleQuantityChange && (
                      <Box>
                        <Typography variant="subtitle2">{extra.name}</Typography>
                        <Box sx={{ mt: 1 }}>
                          {extra.options?.map((option) => (
                            <Box key={option.id} sx={{ mt: 1 }}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={8}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        size="small"
                                        checked={selectedExtras[extra.id]?.options?.[option.id]?.selected || false}
                                        onChange={(e) => onToggleOptionChange(extra.id, option.id, e.target.checked)}
                                      />
                                    }
                                    label={
                                      <Box>
                                        <Typography variant="body2">{option.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          £{option.price} per unit
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={selectedExtras[extra.id]?.options?.[option.id]?.quantity || ''}
                                    onChange={(e) => onToggleQuantityChange(extra.id, option.id, Number(e.target.value))}
                                    inputProps={{
                                      min: option.min_quantity || 0,
                                      max: option.max_quantity || undefined,
                                    }}
                                    sx={{ width: '80px' }}
                                    disabled={!selectedExtras[extra.id]?.options?.[option.id]?.selected}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          </>
        )}

        {/* Next Button */}
        {selectedProducts.length > 0 && onNext && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={onNext}
            >
              Next: Contact Details
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default QuoteBuilder; 
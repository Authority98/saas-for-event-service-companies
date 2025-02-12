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
  Slider,
} from '@mui/material';
import { X, ArrowRight, Tent } from 'lucide-react';
import type { Product, Extra } from '../../types';

interface SelectedExtra {
  selected: boolean;
  quantity?: number;
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
  onRemoveProduct,
  onNext,
}) => {
  const renderExtra = (extra: Extra) => {
    const extraState = selectedExtras[extra.id] || { selected: false };

    switch (extra.type) {
      case 'CHECKBOX':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={extraState.selected}
                onChange={(e) => onExtraChange?.(extra.id, e.target.checked)}
              />
            }
            label={
              <Box>
                <Typography variant="body2">{extra.name}</Typography>
                {extra.description && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {extra.description}
                  </Typography>
                )}
                <Typography variant="caption" color="primary" fontWeight={500}>
                  £{extra.price}
                </Typography>
              </Box>
            }
          />
        );

      case 'RANGE':
        return (
          <Box sx={{ width: '100%', py: 2 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">{extra.name}</Typography>
              {extra.description && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {extra.description}
                </Typography>
              )}
              <Typography variant="caption" color="primary" fontWeight={500}>
                £{extra.price_per_unit} per unit
              </Typography>
            </Box>
            <Box sx={{ px: 2 }}>
              <Slider
                value={extraState.quantity || 0}
                onChange={(_, value) => onExtraQuantityChange?.(extra.id, value as number)}
                min={extra.min_quantity || 0}
                max={extra.max_quantity || 100}
                valueLabelDisplay="auto"
                marks={[
                  { value: extra.min_quantity || 0, label: extra.min_quantity || 0 },
                  { value: extra.max_quantity || 100, label: extra.max_quantity || 100 },
                ]}
              />
            </Box>
          </Box>
        );

      case 'TOGGLE_WITH_QUANTITY':
        return (
          <Box sx={{ width: '100%', py: 1 }}>
            {extra.description && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                {extra.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color={extraState.selected ? 'text.secondary' : 'text.primary'}>
                {extra.left_label}
              </Typography>
              <Switch
                checked={extraState.selected}
                onChange={(e) => onExtraChange?.(extra.id, e.target.checked)}
              />
              <Typography variant="body2" color={!extraState.selected ? 'text.secondary' : 'text.primary'}>
                {extra.right_label}
              </Typography>
            </Box>
            <Box sx={{ px: 2, mt: 2, opacity: extraState.selected ? 1 : 0.8 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {extra.name}
              </Typography>
              <Slider
                value={extraState.quantity || extra.min_quantity || 0}
                onChange={(_, value) => onExtraQuantityChange?.(extra.id, value as number)}
                min={extra.min_quantity || 0}
                max={extra.max_quantity || 100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} (£${(extra.price ?? 0) * value})`}
                marks={[
                  { value: extra.min_quantity || 0, label: extra.min_quantity || 0 },
                  { value: extra.max_quantity || 100, label: extra.max_quantity || 100 },
                ]}
              />
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

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
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Selected Products Section */}
        <Box>
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
                Selected Tents
              </Box>
            </Box>
          )}

          {selectedProducts.length > 0 ? (
            <>
              {selectedProducts.map(product => (
                <Paper
                  key={product.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'divider',
                    mb: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}`,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{product.name}</Typography>
                        <Chip 
                          label="Selected"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ 
                            height: '20px',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            letterSpacing: '0.03em'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {product.type} - {product.size}
                      </Typography>
                      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                        £{product.price}
                      </Typography>

                      {/* Selected Extras Summary */}
                      {Object.entries(selectedExtras).some(([_, extraValue]) => 
                        extraValue.selected || (extraValue.quantity && extraValue.quantity > 0)
                      ) && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
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
                                    sx={{ 
                                      fontSize: '0.7rem',
                                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                                    }}
                                  />
                                );
                              }

                              if (extra.type === 'RANGE' && extraState.quantity && extraState.quantity > 0) {
                                return (
                                  <Chip
                                    key={extra.id}
                                    label={`${extra.name} (${extraState.quantity})`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      fontSize: '0.7rem',
                                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                                    }}
                                  />
                                );
                              }

                              if (extra.type === 'TOGGLE_WITH_QUANTITY' && extraState.quantity && extraState.quantity > 0) {
                                const toggleState = extraState.selected ? extra.right_label : extra.left_label;
                                return (
                                  <Chip
                                    key={extra.id}
                                    label={`${extra.name} (${extraState.quantity}) - ${toggleState}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      fontSize: '0.7rem',
                                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                                    }}
                                  />
                                );
                              }

                              return null;
                            })}
                          </Box>
                        </Box>
                      )}
                    </Box>
                    {onRemoveProduct && (
                      <IconButton
                        size="small"
                        onClick={() => onRemoveProduct(product.id)}
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'error.main',
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                          }
                        }}
                      >
                        <X size={18} />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              ))}
              
              {/* Next Button - Moved here */}
              {onNext && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={onNext}
                  sx={{ 
                    mt: 3,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 600,
                    letterSpacing: '0.03em'
                  }}
                >
                  Next Step
                  <ArrowRight size={18} />
                </Button>
              )}
            </>
          ) : (
            <Box
              sx={{
                p: 4,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderColor: (theme) => theme.palette.primary.main,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                position: 'relative',
                mb: 2
              }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.1)',
                      },
                      '70%': {
                        boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)',
                      },
                      '100%': {
                        boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
                      },
                    },
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <Tent 
                    size={48} 
                    strokeWidth={1.5}
                    style={{ 
                      color: 'currentColor',
                      opacity: 0.7
                    }} 
                  />
                </Box>
              </Box>
              <Typography 
                variant="h6" 
                color="text.primary" 
                align="center"
                sx={{ 
                  fontWeight: 500,
                  letterSpacing: '-0.01em'
                }}
              >
                No Tents Selected
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center"
                sx={{
                  maxWidth: 250,
                  lineHeight: 1.5
                }}
              >
                Start by selecting tents from the options on the right to build your custom quote
              </Typography>
            </Box>
          )}
        </Box>

        {/* Extras Section - Always Visible */}
        <Box>
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
              Available Extras
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {extras.map(extra => (
              <Paper
                key={extra.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {renderExtra(extra)}
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuoteBuilder; 
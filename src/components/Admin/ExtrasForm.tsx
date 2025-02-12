import React, { useEffect } from 'react';
import {
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  Typography,
  Slider,
  Switch,
  FormHelperText,
} from '@mui/material';
import FormDialog from './FormDialog';
import type { ExtraType } from '../../types';

interface ExtrasFormData {
  name: string;
  description: string;
  type: ExtraType;
  price: number;
  price_per_unit?: number;
  min_quantity?: number;
  max_quantity?: number;
  left_label?: string;
  right_label?: string;
}

const EXTRA_TYPES = [
  { value: 'CHECKBOX', label: 'Checkbox', description: 'Simple yes/no selection' },
  { value: 'RANGE', label: 'Range Slider', description: 'Select a value within a range' },
  { value: 'TOGGLE_WITH_QUANTITY', label: 'Toggle Switch with Range Slider', description: 'Switch between two options with adjustable range' },
] as const;

interface ExtrasFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExtrasFormData) => void;
  loading?: boolean;
  initialData?: Partial<ExtrasFormData>;
}

const ExtrasForm = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData,
}: ExtrasFormProps) => {
  const [formData, setFormData] = React.useState<ExtrasFormData>({
    name: '',
    description: '',
    type: 'CHECKBOX',
    price: 0,
    price_per_unit: undefined,
    min_quantity: undefined,
    max_quantity: undefined,
    left_label: '',
    right_label: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        price: initialData.price || 0,
        price_per_unit: initialData.price_per_unit,
        min_quantity: initialData.min_quantity,
        max_quantity: initialData.max_quantity,
        left_label: initialData.left_label || '',
        right_label: initialData.right_label || '',
      }));
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'CHECKBOX',
        price: 0,
        price_per_unit: undefined,
        min_quantity: undefined,
        max_quantity: undefined,
        left_label: '',
        right_label: '',
      });
    }
  }, [initialData, open]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['price', 'price_per_unit', 'min_quantity', 'max_quantity'].includes(name) 
        ? value === '' ? 0 : Number(value)
        : value 
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.type || formData.price === undefined) {
      return;
    }

    if (formData.type === 'TOGGLE_WITH_QUANTITY') {
      if (!formData.left_label || !formData.right_label || !formData.min_quantity || !formData.max_quantity) {
        return;
      }
    }

    if (formData.type === 'RANGE') {
      if (!formData.min_quantity || !formData.max_quantity || !formData.price_per_unit) {
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Extra' : 'Add New Extra'}
      onSubmit={handleSubmit}
      loading={loading}
    >
      <Box component="form" sx={{ p: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleTextChange}
              required
              autoFocus
              placeholder="Enter extra item name"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleTextChange}
              multiline
              rows={3}
              placeholder="Enter extra item description"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Type"
                onChange={handleSelectChange}
              >
                {EXTRA_TYPES.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <Typography variant="body1">{type.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select how this extra will be displayed in the quote builder
              </FormHelperText>
            </FormControl>
          </Grid>

          {formData.type === 'TOGGLE_WITH_QUANTITY' ? (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Toggle Switch Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Left Label"
                      name="left_label"
                      value={formData.left_label}
                      onChange={handleTextChange}
                      required
                      placeholder="e.g., Without Chairs"
                      helperText="Text shown when toggle is off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Right Label"
                      name="right_label"
                      value={formData.right_label}
                      onChange={handleTextChange}
                      required
                      placeholder="e.g., With Chairs"
                      helperText="Text shown when toggle is on"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Slider Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Slider Label"
                      name="name"
                      value={formData.name}
                      onChange={handleTextChange}
                      required
                      placeholder="e.g., Number of Chairs"
                      helperText="Label shown above the slider"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Value"
                      name="min_quantity"
                      type="number"
                      value={formData.min_quantity}
                      onChange={handleTextChange}
                      required
                      placeholder="Enter minimum value"
                      helperText="Minimum value on the slider"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Maximum Value"
                      name="max_quantity"
                      type="number"
                      value={formData.max_quantity}
                      onChange={handleTextChange}
                      required
                      placeholder="Enter maximum value"
                      helperText="Maximum value on the slider"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Pricing
                </Typography>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleTextChange}
                  required
                  placeholder="Enter price"
                  helperText="Price per unit"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">£</InputAdornment>,
                  }}
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleTextChange}
                required
                placeholder="Enter price"
                helperText="Price per unit"
                InputProps={{
                  startAdornment: <InputAdornment position="start">£</InputAdornment>,
                }}
              />
            </Grid>
          )}

          {formData.type === 'RANGE' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price Per Unit"
                  name="price_per_unit"
                  type="number"
                  value={formData.price_per_unit}
                  onChange={handleTextChange}
                  required
                  placeholder="Enter price per unit"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">£</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Quantity"
                  name="min_quantity"
                  type="number"
                  value={formData.min_quantity}
                  onChange={handleTextChange}
                  required
                  placeholder="Enter minimum quantity"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Quantity"
                  name="max_quantity"
                  type="number"
                  value={formData.max_quantity}
                  onChange={handleTextChange}
                  required
                  placeholder="Enter maximum quantity"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </FormDialog>
  );
};

export default ExtrasForm; 
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';

interface ExtrasFormData {
  name: string;
  description?: string;
  type: 'CHECKBOX' | 'QUANTITY' | 'TOGGLE_WITH_QUANTITY';
  price: number;
  price_per_unit?: number;
  min_quantity?: number;
  max_quantity?: number;
  options?: any;
  left_label?: string;
  right_label?: string;
}

interface ExtrasFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExtrasFormData) => void;
  initialData?: Partial<ExtrasFormData>;
  loading?: boolean;
  error?: string | null;
  mode?: 'add' | 'edit';
}

const ExtrasForm: React.FC<ExtrasFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  error = null,
  mode = 'add'
}) => {
  const [formData, setFormData] = useState<ExtrasFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'CHECKBOX',
    price: initialData?.price || 0,
    price_per_unit: initialData?.price_per_unit,
    min_quantity: initialData?.min_quantity,
    max_quantity: initialData?.max_quantity,
    options: initialData?.options,
    left_label: initialData?.left_label,
    right_label: initialData?.right_label
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Extra' : 'Edit Extra'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">£</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="CHECKBOX">Checkbox</MenuItem>
                  <MenuItem value="QUANTITY">Quantity</MenuItem>
                  <MenuItem value="TOGGLE_WITH_QUANTITY">Toggle with Quantity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : mode === 'add' ? (
            'Add Extra'
          ) : (
            'Save Changes'
          )}
        </Button>
      </DialogActions>
      {error && (
        <DialogContent>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ExtrasForm; 
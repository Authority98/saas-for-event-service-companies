import React, { useEffect } from 'react';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
  InputAdornment,
} from '@mui/material';
import FormDialog from './FormDialog';

interface TentFormData {
  name: string;
  description: string;
  tentType: string;
  size: string;
  capacity: string;
  price: string;
}

interface TentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TentFormData) => void;
  loading?: boolean;
  initialData?: Partial<TentFormData>;
}

const TentForm = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData,
}: TentFormProps) => {
  const [formData, setFormData] = React.useState<TentFormData>({
    name: '',
    description: '',
    tentType: '',
    size: '',
    capacity: '',
    price: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    } else {
      setFormData({
        name: '',
        description: '',
        tentType: '',
        size: '',
        capacity: '',
        price: '',
      });
    }
  }, [initialData, open]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Tent' : 'Add New Tent'}
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
              placeholder="Enter tent name"
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
              placeholder="Enter tent description"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Tent Type</InputLabel>
              <Select
                name="tentType"
                value={formData.tentType}
                label="Tent Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="stretch">Stretch Tent</MenuItem>
                <MenuItem value="traditional">Traditional Pole</MenuItem>
                <MenuItem value="clearspan">Clear Span</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Size"
              name="size"
              value={formData.size}
              onChange={handleTextChange}
              required
              placeholder="e.g., 10x15m"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleTextChange}
              required
              placeholder="Enter maximum capacity"
              InputProps={{
                endAdornment: <InputAdornment position="end">people</InputAdornment>,
              }}
            />
          </Grid>

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
              InputProps={{
                startAdornment: <InputAdornment position="start">£</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </FormDialog>
  );
};

export default TentForm; 
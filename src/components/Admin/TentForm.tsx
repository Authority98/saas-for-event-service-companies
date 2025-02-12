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
import type { TentType } from '../../types';

interface TentFormData {
  name: string;
  description: string;
  type: string;
  size: string;
  price: number;
  image_url?: string;
}

interface TentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TentFormData) => void;
  loading?: boolean;
  initialData?: Partial<TentFormData>;
  tentTypes: TentType[];
}

const TentForm = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData,
  tentTypes,
}: TentFormProps) => {
  const [formData, setFormData] = React.useState<TentFormData>({
    name: '',
    description: '',
    type: '',
    size: '',
    price: 0,
    image_url: '',
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
        type: tentTypes.length > 0 ? tentTypes[0].id : '',
        size: '',
        price: 0,
        image_url: '',
      });
    }
  }, [initialData, open, tentTypes]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? Number(value) : value 
    }));
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
                name="type"
                value={formData.type}
                label="Tent Type"
                onChange={handleSelectChange}
              >
                {tentTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Image URL"
              name="image_url"
              value={formData.image_url}
              onChange={handleTextChange}
              placeholder="Enter image URL"
            />
          </Grid>
        </Grid>
      </Box>
    </FormDialog>
  );
};

export default TentForm; 
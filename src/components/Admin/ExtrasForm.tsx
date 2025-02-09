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
} from '@mui/material';
import FormDialog from './FormDialog';

interface ExtrasFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  type: 'CHECKBOX' | 'QUANTITY' | 'TOGGLE_WITH_QUANTITY';
}

const CATEGORIES = [
  { value: 'furniture', label: 'Furniture' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'flooring', label: 'Flooring' },
  { value: 'decoration', label: 'Decoration' },
  { value: 'catering', label: 'Catering Equipment' },
  { value: 'other', label: 'Other' },
];

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
    category: '',
    price: '',
    type: 'CHECKBOX',
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
        category: '',
        price: '',
        type: 'CHECKBOX',
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

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleSelectChange}
              >
                {CATEGORIES.map(category => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default ExtrasForm; 
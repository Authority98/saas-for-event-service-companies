import React, { useEffect } from 'react';
import {
  TextField,
  Grid,
  Box,
} from '@mui/material';
import FormDialog from './FormDialog';

interface TentTypeFormData {
  name: string;
  description: string;
  image_url?: string;
}

interface TentTypeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TentTypeFormData) => void;
  loading?: boolean;
  initialData?: Partial<TentTypeFormData>;
}

const TentTypeForm = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData,
}: TentTypeFormProps) => {
  const [formData, setFormData] = React.useState<TentTypeFormData>({
    name: '',
    description: '',
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
        image_url: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      title={initialData ? 'Edit Tent Type' : 'Add New Tent Type'}
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
              onChange={handleChange}
              required
              autoFocus
              placeholder="Enter tent type name"
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
              rows={3}
              placeholder="Enter tent type description"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Enter image URL"
              helperText="Enter a URL for an image that represents this tent type"
            />
          </Grid>
        </Grid>
      </Box>
    </FormDialog>
  );
};

export default TentTypeForm; 
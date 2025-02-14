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
  Chip,
  Stack,
} from '@mui/material';

interface TentTypeFormData {
  name: string;
  description?: string;
  capacity: number;
  features: string[];
  status: 'active' | 'inactive';
}

interface TentTypeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TentTypeFormData) => void;
  initialData?: Partial<TentTypeFormData>;
  loading?: boolean;
  error?: string | null;
  mode?: 'add' | 'edit';
}

const TentTypeForm: React.FC<TentTypeFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  error = null,
  mode = 'add'
}) => {
  const [formData, setFormData] = useState<TentTypeFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    capacity: initialData?.capacity || 0,
    features: initialData?.features || [],
    status: initialData?.status || 'active'
  });

  const [newFeature, setNewFeature] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value
    }));
  };

  const handleStatusChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Tent Type' : 'Edit Tent Type'}
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
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddFeature}
                    disabled={!newFeature.trim()}
                  >
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => handleRemoveFeature(index)}
                    />
                  ))}
                </Box>
              </Box>
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
            'Add Tent Type'
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

export default TentTypeForm; 
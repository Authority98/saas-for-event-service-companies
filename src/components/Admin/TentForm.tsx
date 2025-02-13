import React, { useEffect, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
} from '@mui/material';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { TentType } from '../../types';

interface TentFormData {
  name: string;
  type: string;
  size: string;
  price: number;
  description?: string;
  image_url?: string;
}

interface TentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TentFormData) => void;
  initialData?: Partial<TentFormData>;
  tentTypes: { id: string; name: string; }[];
  loading?: boolean;
  error?: string | null;
  mode?: 'add' | 'edit';
}

const TentForm: React.FC<TentFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  tentTypes,
  loading = false,
  error = null,
  mode = 'add'
}) => {
  const getInitialFormData = (): TentFormData => ({
    name: '',
    type: '',
    size: '',
    price: 0,
    description: '',
    image_url: ''
  });

  const [formData, setFormData] = useState<TentFormData>(getInitialFormData());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || '',
        size: initialData.size || '',
        price: initialData.price || 0,
        description: initialData.description || '',
        image_url: initialData.image_url || ''
      });
      setImagePreview(initialData.image_url || null);
    }
  }, [initialData, mode]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(getInitialFormData());
      setImageFile(null);
      setImagePreview(null);
      setUploadError(null);
    }
  }, [open, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? Number(value) : value 
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    setUploadProgress(true);
    setUploadError(null);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `tent-images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('tents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tents')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setUploadError(err.message);
      throw err;
    } finally {
      setUploadProgress(false);
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      onSubmit({
        ...formData,
        image_url: imageUrl
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith('http')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Tent' : 'Edit Tent'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  position: 'relative',
                  bgcolor: 'background.default',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {imagePreview ? (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Tent preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                      }}
                    />
                    <IconButton
                      onClick={handleImageRemove}
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: -12,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': {
                          bgcolor: 'error.light',
                          color: 'white',
                        },
                      }}
                      size="small"
                    >
                      <X size={16} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    component="label"
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                      }}
                    >
                      <ImageIcon size={24} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Click to upload tent image
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supports: JPG, PNG (max 5MB)
                    </Typography>
                  </Box>
                )}
              </Box>
              {uploadError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {uploadError}
                </Alert>
              )}
            </Grid>

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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  {tentTypes.map((type) => (
                    <MenuItem key={type.id} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
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
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || uploadProgress}
        >
          {loading || uploadProgress ? (
            <CircularProgress size={24} />
          ) : mode === 'add' ? (
            'Add Tent'
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

export default TentForm; 
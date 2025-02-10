import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Alert,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Trash2, X, Check, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../lib/toast';
import { Toaster } from '../../components/ui/toaster';
import type { Product, TentType } from '../../types';

interface ProductsManagerProps {
  products: Product[];
  tentTypes: TentType[];
  onUpdate: () => void;
}

const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  tentTypes,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    size: '',
    type: tentTypes.length > 0 ? tentTypes[0].name : '',
    image_url: '',
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      setError('Name and price are required');
      showToast.warning('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) throw error;

      showToast.success('Product added successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        size: '',
        type: tentTypes.length > 0 ? tentTypes[0].name : '',
        image_url: '',
      });

      onUpdate();
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
      showToast.error('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          size: product.size,
          type: product.type,
          image_url: product.image_url,
        })
        .eq('id', product.id);

      if (error) throw error;

      showToast.success('Product updated successfully!');
      setEditingProduct(null);
      onUpdate();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
      showToast.error('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast.success('Product deleted successfully!');
      setDeleteConfirmation(null);
      onUpdate();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
      showToast.error('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Add New Product Form */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Plus size={20} />
          Add New Product
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Size"
              value={newProduct.size}
              onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Type"
              value={newProduct.type}
              onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
            >
              {tentTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              InputProps={{
                startAdornment: <ImageIcon size={20} style={{ marginRight: '8px', opacity: 0.5 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleAddProduct}
              disabled={loading}
              startIcon={<Plus size={20} />}
              sx={{ px: 4 }}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Products List */}
      <Paper sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image_url ? (
                      <Box
                        component="img"
                        src={product.image_url}
                        alt={product.name}
                        sx={{
                          width: 60,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 60,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: 'background.default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImageIcon size={20} style={{ opacity: 0.5 }} />
                      </Box>
                    )}
                  </TableCell>
                  {editingProduct === product.id ? (
                    <>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={product.name}
                          onChange={(e) => {
                            const updatedProducts = products.map(p =>
                              p.id === product.id ? { ...p, name: e.target.value } : p
                            );
                            onUpdate();
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          select
                          size="small"
                          value={product.type}
                          onChange={(e) => {
                            const updatedProducts = products.map(p =>
                              p.id === product.id ? { ...p, type: e.target.value } : p
                            );
                            onUpdate();
                          }}
                        >
                          {tentTypes.map((type) => (
                            <MenuItem key={type.id} value={type.name}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={product.size}
                          onChange={(e) => {
                            const updatedProducts = products.map(p =>
                              p.id === product.id ? { ...p, size: e.target.value } : p
                            );
                            onUpdate();
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={product.price}
                          onChange={(e) => {
                            const updatedProducts = products.map(p =>
                              p.id === product.id ? { ...p, price: Number(e.target.value) } : p
                            );
                            onUpdate();
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Save">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditProduct(product)}
                            disabled={loading}
                            size="small"
                          >
                            <Check size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton
                            color="error"
                            onClick={() => setEditingProduct(null)}
                            disabled={loading}
                            size="small"
                          >
                            <X size={20} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <Typography variant="body2">{product.name}</Typography>
                        {product.description && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {product.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.type}
                          size="small"
                          sx={{ 
                            bgcolor: 'background.default',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>{product.size}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          £{product.price}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => setEditingProduct(product.id)}
                            disabled={loading}
                            size="small"
                            sx={{ color: 'primary.main' }}
                          >
                            <Edit size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => setDeleteConfirmation(product.id)}
                            disabled={loading}
                            size="small"
                            color="error"
                          >
                            <Trash2 size={20} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirmation)}
        onClose={() => setDeleteConfirmation(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
          <Button
            onClick={() => deleteConfirmation && handleDeleteProduct(deleteConfirmation)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster />
    </Box>
  );
};

export default ProductsManager; 
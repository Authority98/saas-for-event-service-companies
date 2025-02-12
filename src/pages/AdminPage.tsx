import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Alert,
  IconButton,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  TentsManager,
  ExtrasManager,
  TentTypesManager,
  EnquiriesManager,
} from '../components/Admin';
import type { Product, TentType } from '../types';
import { Edit, Trash2, X, Check } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [tentTypes, setTentTypes] = useState<TentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    size: '',
    type: '',
    image_url: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchTentTypes();
  }, []);

  const fetchTentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('tent_types')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTentTypes(data || []);

      // Set default type if none selected and tent types exist
      if (!newProduct.type && data && data.length > 0) {
        setNewProduct(prev => ({ ...prev, type: data[0].name }));
      }
    } catch (err) {
      console.error('Error fetching tent types:', err);
      setError('Failed to fetch tent types');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      setError('Name and price are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) throw error;

      setNewProduct({
        name: '',
        description: '',
        price: 0,
        size: '',
        type: tentTypes.length > 0 ? tentTypes[0].name : '',
        image_url: '',
      });

      await fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
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
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
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
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product.id);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Products" />
            <Tab label="Extras" />
            <Tab label="Tent Types" />
            <Tab label="Enquiries" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Add New Product
                  </Typography>
                  <Grid container spacing={2}>
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
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleAddProduct}
                        disabled={loading}
                      >
                        {loading ? 'Adding...' : 'Add Product'}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Product List
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            {editingProduct === product.id ? (
                              <>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    value={product.name}
                                    onChange={(e) => setProducts(products.map(p => 
                                      p.id === product.id ? { ...p, name: e.target.value } : p
                                    ))}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    select
                                    size="small"
                                    value={product.type}
                                    onChange={(e) => setProducts(products.map(p => 
                                      p.id === product.id ? { ...p, type: e.target.value } : p
                                    ))}
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
                                    onChange={(e) => setProducts(products.map(p => 
                                      p.id === product.id ? { ...p, size: e.target.value } : p
                                    ))}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    size="small"
                                    value={product.price}
                                    onChange={(e) => setProducts(products.map(p => 
                                      p.id === product.id ? { ...p, price: Number(e.target.value) } : p
                                    ))}
                                  />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEditProduct(product)}
                                    disabled={loading}
                                  >
                                    <Check size={20} />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={cancelEditing}
                                    disabled={loading}
                                  >
                                    <X size={20} />
                                  </IconButton>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.type}</TableCell>
                                <TableCell>{product.size}</TableCell>
                                <TableCell>£{product.price}</TableCell>
                                <TableCell>
                                  <IconButton
                                    color="primary"
                                    onClick={() => startEditing(product)}
                                    disabled={loading}
                                  >
                                    <Edit size={20} />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    disabled={loading}
                                  >
                                    <Trash2 size={20} />
                                  </IconButton>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <ExtrasManager />
            )}

            {tabValue === 2 && (
              <TentTypesManager />
            )}

            {tabValue === 3 && (
              <EnquiriesManager />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPage;
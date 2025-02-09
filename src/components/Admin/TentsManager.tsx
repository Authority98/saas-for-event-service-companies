import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { TentForm } from './';
import { supabase } from '../../lib/supabase';
import type { Product, TentType } from '../../types';

interface TentsManagerProps {
  products: Product[];
  tentTypes: TentType[];
  onUpdate: () => void;
}

const TentsManager = ({ products, tentTypes, onUpdate }: TentsManagerProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAdd = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('products')
        .insert([data]);

      if (supabaseError) throw supabaseError;

      setIsAddOpen(false);
      onUpdate();
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('products')
        .update(data)
        .eq('id', selectedProduct.id);

      if (supabaseError) throw supabaseError;

      setIsEditOpen(false);
      setSelectedProduct(null);
      onUpdate();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      onUpdate();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
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

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Manage Tents</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setIsAddOpen(true)}
        >
          Add New Tent
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>£{product.price}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsEditOpen(true);
                    }}
                    size="small"
                  >
                    <Edit size={20} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(product.id)}
                    size="small"
                    color="error"
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TentForm
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        loading={loading}
      />

      <TentForm
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEdit}
        loading={loading}
        initialData={selectedProduct}
      />
    </Box>
  );
};

export default TentsManager; 
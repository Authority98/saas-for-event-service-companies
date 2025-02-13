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
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { TentForm } from './';
import { supabase } from '../../lib/supabase';

interface Product {
  id: string;
  name: string;
  type: string;
  size: string;
  price: number;
  description?: string;
  status: 'available' | 'booked' | 'maintenance';
}

interface TentFormData {
  name: string;
  type: string;
  size: string;
  price: number;
  description?: string;
  status: 'available' | 'booked' | 'maintenance';
}

interface TentsManagerProps {
  products: Product[];
  tentTypes: { id: string; name: string; }[];
  onUpdate: () => void;
}

const TentsManager: React.FC<TentsManagerProps> = ({ products, tentTypes, onUpdate }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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

  const handleEdit = async (data: TentFormData) => {
    if (!selectedProduct) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', selectedProduct.id);

      if (error) throw error;

      onUpdate();
      setIsEditOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      setError(err.message);
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesType = selectedType === 'all' || product.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search tents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Tent Type</InputLabel>
          <Select
            value={selectedType}
            label="Tent Type"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            {tentTypes.map((type) => (
              <MenuItem key={type.id} value={type.name}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="booked">Booked</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {filteredProducts.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="text.secondary">
            No tents found matching your filters
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
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
              {filteredProducts.map((product) => (
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
      )}

      <TentForm
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        loading={loading}
        tentTypes={tentTypes}
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
        tentTypes={tentTypes}
      />
    </Box>
  );
};

export default TentsManager; 
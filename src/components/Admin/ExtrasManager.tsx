import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  TextField,
  InputAdornment,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { ExtrasForm as ExtraForm } from './';
import { supabase } from '../../lib/supabase';

interface Extra {
  id: string;
  name: string;
  description?: string;
  type: 'CHECKBOX' | 'QUANTITY' | 'TOGGLE_WITH_QUANTITY';
  price: number;
  price_per_unit?: number;
  min_quantity?: number;
  max_quantity?: number;
  options?: any;
  left_label?: string;
  right_label?: string;
  created_at?: string;
  updated_at?: string;
}

const ExtrasManager: React.FC = () => {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredExtras = extras.filter(extra => {
    const matchesSearch = extra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (extra.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesType = typeFilter === 'all' || extra.type === typeFilter;
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && extra.price <= 50) ||
                        (priceFilter === 'medium' && extra.price > 50 && extra.price <= 150) ||
                        (priceFilter === 'high' && extra.price > 150);
    
    return matchesSearch && matchesType && matchesPrice;
  });

  useEffect(() => {
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .order('name');

      if (error) throw error;

      setExtras(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAdd = async (data: Omit<Extra, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('extras')
        .insert([data]);

      if (error) throw error;

      await fetchExtras();
      setIsAddOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: Omit<Extra, 'id'>) => {
    if (!selectedExtra) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('extras')
        .update(data)
        .eq('id', selectedExtra.id);

      if (error) throw error;

      await fetchExtras();
      setIsEditOpen(false);
      setSelectedExtra(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this extra?')) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('extras')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchExtras();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Extras</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setIsAddOpen(true)}
        >
          Add Extra
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search extras..."
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
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="CHECKBOX">Checkbox</MenuItem>
            <MenuItem value="QUANTITY">Quantity</MenuItem>
            <MenuItem value="TOGGLE_WITH_QUANTITY">Toggle with Quantity</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Price Range</InputLabel>
          <Select
            value={priceFilter}
            label="Price Range"
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <MenuItem value="all">All Prices</MenuItem>
            <MenuItem value="low">Low (≤ £50)</MenuItem>
            <MenuItem value="medium">Medium (£51-£150)</MenuItem>
            <MenuItem value="high">High (&gt; £150)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {filteredExtras.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="text.secondary">
            No extras found matching your filters
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
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExtras.map((extra) => (
                <TableRow key={extra.id}>
                  <TableCell>{extra.name}</TableCell>
                  <TableCell>{extra.description}</TableCell>
                  <TableCell>
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {extra.type.replace('_', ' ').toLowerCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>£{extra.price}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setSelectedExtra(extra);
                        setIsEditOpen(true);
                      }}
                      size="small"
                    >
                      <Edit size={20} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(extra.id)}
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

      <ExtraForm
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        loading={loading}
      />

      <ExtraForm
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedExtra(null);
        }}
        onSubmit={handleEdit}
        initialData={selectedExtra}
        loading={loading}
        mode="edit"
      />
    </Box>
  );
};

export default ExtrasManager; 
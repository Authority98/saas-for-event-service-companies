import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { TentTypeForm } from './';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../lib/toast';

interface TentType {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  features: string[];
  status: 'active' | 'inactive';
}

interface TentTypeFormData {
  name: string;
  description?: string;
  capacity: number;
  features: string[];
  status: 'active' | 'inactive';
}

const TentTypesManager = () => {
  const [tentTypes, setTentTypes] = useState<TentType[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTentType, setSelectedTentType] = useState<TentType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');

  const filteredTentTypes = tentTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (type.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || type.status === statusFilter;
    const matchesCapacity = capacityFilter === 'all' || 
                           (capacityFilter === 'small' && type.capacity <= 50) ||
                           (capacityFilter === 'medium' && type.capacity > 50 && type.capacity <= 150) ||
                           (capacityFilter === 'large' && type.capacity > 150);
    
    return matchesSearch && matchesStatus && matchesCapacity;
  });

  const fetchTentTypes = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('tent_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setTentTypes(data || []);
    } catch (err) {
      console.error('Error fetching tent types:', err);
      setError('Failed to fetch tent types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTentTypes();
  }, []);

  const handleAdd = async (data: TentTypeFormData) => {
    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('tent_types')
        .insert([data]);

      if (supabaseError) throw supabaseError;

      showToast.success('Tent type added successfully!');
      setIsAddOpen(false);
      fetchTentTypes();
    } catch (err) {
      console.error('Error adding tent type:', err);
      setError('Failed to add tent type');
      showToast.error('Failed to add tent type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: TentTypeFormData) => {
    if (!selectedTentType) return;

    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('tent_types')
        .update(data)
        .eq('id', selectedTentType.id);

      if (supabaseError) throw supabaseError;

      showToast.success('Tent type updated successfully!');
      setIsEditOpen(false);
      setSelectedTentType(null);
      fetchTentTypes();
    } catch (err) {
      console.error('Error updating tent type:', err);
      setError('Failed to update tent type');
      showToast.error('Failed to update tent type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('tent_types')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      showToast.success('Tent type deleted successfully!');
      fetchTentTypes();
    } catch (err) {
      console.error('Error deleting tent type:', err);
      setError('Failed to delete tent type');
      showToast.error('Failed to delete tent type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFormData = (tentType: TentType | null): Partial<TentTypeFormData> | undefined => {
    if (!tentType) return undefined;
    return {
      name: tentType.name,
      description: tentType.description,
      capacity: tentType.capacity,
      features: tentType.features,
      status: tentType.status,
    };
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Tent Types</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setIsAddOpen(true)}
        >
          Add Tent Type
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search tent types..."
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
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Capacity</InputLabel>
          <Select
            value={capacityFilter}
            label="Capacity"
            onChange={(e) => setCapacityFilter(e.target.value)}
          >
            <MenuItem value="all">All Sizes</MenuItem>
            <MenuItem value="small">Small (≤ 50)</MenuItem>
            <MenuItem value="medium">Medium (51-150)</MenuItem>
            <MenuItem value="large">Large (&gt; 150)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {filteredTentTypes.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="text.secondary">
            No tent types found matching your filters
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
                <TableCell>Capacity</TableCell>
                <TableCell>Features</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTentTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>{type.capacity}</TableCell>
                  <TableCell>{type.features?.join(', ') || 'No features'}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        textTransform: 'capitalize',
                        color: type.status === 'active' ? 'success.main' : 'error.main'
                      }}
                    >
                      {type.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setSelectedTentType(type);
                        setIsEditOpen(true);
                      }}
                      size="small"
                    >
                      <Edit size={20} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(type.id)}
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

      <TentTypeForm
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        loading={loading}
      />

      <TentTypeForm
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTentType(null);
        }}
        onSubmit={handleEdit}
        initialData={selectedTentType ? {
          name: selectedTentType.name,
          description: selectedTentType.description,
          capacity: selectedTentType.capacity,
          features: selectedTentType.features || [],
          status: selectedTentType.status
        } : undefined}
        loading={loading}
        mode="edit"
      />
    </Box>
  );
};

export default TentTypesManager; 
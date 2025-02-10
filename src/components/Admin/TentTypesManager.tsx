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
} from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { TentTypeForm } from './';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../lib/toast';
import { Toaster } from '../../components/ui/toaster';
import type { TentType } from '../../types';

interface TentTypeFormData {
  name: string;
  description: string;
}

const TentTypesManager = () => {
  const [tentTypes, setTentTypes] = useState<TentType[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTentType, setSelectedTentType] = useState<TentType | null>(null);

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
    };
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Manage Tent Types</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setIsAddOpen(true)}
        >
          Add New Tent Type
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tentTypes.map((tentType) => (
              <TableRow key={tentType.id}>
                <TableCell>{tentType.name}</TableCell>
                <TableCell>{tentType.description}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setSelectedTentType(tentType);
                      setIsEditOpen(true);
                    }}
                    size="small"
                  >
                    <Edit size={20} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(tentType.id)}
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
        loading={loading}
        initialData={getFormData(selectedTentType)}
      />
      <Toaster />
    </Box>
  );
};

export default TentTypesManager; 
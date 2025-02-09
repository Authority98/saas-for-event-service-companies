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
import { ExtrasForm } from './';
import { supabase } from '../../lib/supabase';
import type { Extra } from '../../types';

interface ExtrasFormData {
  name: string;
  description: string;
  category: string;
  price: string;
}

const ExtrasManager = () => {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);

  const fetchExtras = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('extras')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setExtras(data || []);
    } catch (err) {
      console.error('Error fetching extras:', err);
      setError('Failed to fetch extras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtras();
  }, []);

  const handleAdd = async (data: ExtrasFormData) => {
    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('extras')
        .insert([data]);

      if (supabaseError) throw supabaseError;

      setIsAddOpen(false);
      fetchExtras();
    } catch (err) {
      console.error('Error adding extra:', err);
      setError('Failed to add extra');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: ExtrasFormData) => {
    if (!selectedExtra) return;

    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('extras')
        .update(data)
        .eq('id', selectedExtra.id);

      if (supabaseError) throw supabaseError;

      setIsEditOpen(false);
      setSelectedExtra(null);
      fetchExtras();
    } catch (err) {
      console.error('Error updating extra:', err);
      setError('Failed to update extra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('extras')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      fetchExtras();
    } catch (err) {
      console.error('Error deleting extra:', err);
      setError('Failed to delete extra');
    } finally {
      setLoading(false);
    }
  };

  const getFormData = (extra: Extra | null): Partial<ExtrasFormData> | undefined => {
    if (!extra) return undefined;
    return {
      name: extra.name,
      description: extra.description,
      category: extra.category,
      price: extra.price?.toString() || '',
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
        <Typography variant="h6">Manage Extras</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setIsAddOpen(true)}
        >
          Add New Extra
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {extras.map((extra) => (
              <TableRow key={extra.id}>
                <TableCell>{extra.name}</TableCell>
                <TableCell>{extra.category}</TableCell>
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

      <ExtrasForm
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        loading={loading}
      />

      <ExtrasForm
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedExtra(null);
        }}
        onSubmit={handleEdit}
        loading={loading}
        initialData={getFormData(selectedExtra)}
      />
    </Box>
  );
};

export default ExtrasManager; 
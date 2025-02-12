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
  Chip,
} from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ExtrasForm } from './';
import { supabase } from '../../lib/supabase';
import type { Extra } from '../../types';

const TYPE_LABELS = {
  CHECKBOX: 'Checkbox',
  QUANTITY: 'Continuous Slider',
  TOGGLE_WITH_QUANTITY: 'Toggle Switch',
} as const;

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

  const handleAdd = async (data: Partial<Extra>) => {
    try {
      setLoading(true);
      setError(null);

      // Format the data based on the type
      const formattedData = {
        name: data.name,
        description: data.description,
        type: data.type,
        price: data.price || 0,
        // Only include these fields if they are defined
        ...(data.price_per_unit !== undefined && { price_per_unit: data.price_per_unit }),
        ...(data.min_quantity !== undefined && { min_quantity: data.min_quantity }),
        ...(data.max_quantity !== undefined && { max_quantity: data.max_quantity }),
        ...(data.left_label !== undefined && { left_label: data.left_label }),
        ...(data.right_label !== undefined && { right_label: data.right_label })
      };

      console.log('Sending data to Supabase:', formattedData);

      const { data: responseData, error: supabaseError } = await supabase
        .from('extras')
        .insert([formattedData])
        .select();

      if (supabaseError) {
        console.error('Supabase error details:', supabaseError);
        throw supabaseError;
      }

      setIsAddOpen(false);
      fetchExtras();
    } catch (err) {
      console.error('Error adding extra:', err);
      setError('Failed to add extra. Please check all required fields are filled correctly.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: Partial<Extra>) => {
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
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Details</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {extras.map((extra) => (
              <TableRow key={extra.id}>
                <TableCell>
                  <Typography variant="body2">{extra.name}</Typography>
                  {extra.description && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {extra.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={TYPE_LABELS[extra.type]} 
                    size="small"
                    sx={{ 
                      bgcolor: 'background.default',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  {extra.type === 'QUANTITY' ? (
                    <Typography variant="body2">
                      £{extra.price_per_unit} per unit
                      {extra.min_quantity && extra.max_quantity && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Range: {extra.min_quantity} - {extra.max_quantity}
                        </Typography>
                      )}
                    </Typography>
                  ) : (
                    <Typography variant="body2">£{extra.price}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {extra.type === 'QUANTITY' && (
                    <Typography variant="caption" color="text.secondary">
                      Min: {extra.min_quantity}, Max: {extra.max_quantity}
                    </Typography>
                  )}
                </TableCell>
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
        initialData={selectedExtra || undefined}
      />
    </Box>
  );
};

export default ExtrasManager; 
import React, { useState, useEffect } from 'react';
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
  Alert,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TentType {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

const TentTypeManager: React.FC = () => {
  const [tentTypes, setTentTypes] = useState<TentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTentType, setNewTentType] = useState<Partial<TentType>>({
    name: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchTentTypes();
  }, []);

  const fetchTentTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tent_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTentTypes(data || []);
    } catch (err) {
      console.error('Error fetching tent types:', err);
      setError('Failed to fetch tent types');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTentType = async () => {
    if (!newTentType.name) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('tent_types')
        .insert([newTentType]);

      if (error) throw error;

      setNewTentType({
        name: '',
        description: '',
        image_url: '',
      });

      await fetchTentTypes();
    } catch (err) {
      console.error('Error adding tent type:', err);
      setError('Failed to add tent type');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTentType = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('tent_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTentTypes();
    } catch (err) {
      console.error('Error deleting tent type:', err);
      setError('Failed to delete tent type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add New Tent Type
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            value={newTentType.name}
            onChange={(e) => setNewTentType({ ...newTentType, name: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Description"
            value={newTentType.description}
            onChange={(e) => setNewTentType({ ...newTentType, description: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            value={newTentType.image_url}
            onChange={(e) => setNewTentType({ ...newTentType, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleAddTentType}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Tent Type'}
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Tent Types List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tentTypes.map((tentType) => (
              <TableRow key={tentType.id}>
                <TableCell>{tentType.name}</TableCell>
                <TableCell>{tentType.description}</TableCell>
                <TableCell>
                  {tentType.image_url && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="img"
                        src={tentType.image_url}
                        alt={tentType.name}
                        sx={{
                          width: 40,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ 
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {tentType.image_url}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteTentType(tentType.id)}
                    disabled={loading}
                    color="error"
                  >
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TentTypeManager; 
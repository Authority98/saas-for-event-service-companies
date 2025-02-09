import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
  alpha,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Tent,
  Package,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  BarChart3,
  Layers,
  LogOut,
  Bell,
  LayoutDashboard,
  Mail,
  Eye,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TentsManager, ExtrasManager, TentTypesManager } from '../components/Admin';
import { DashboardSidebar, DashboardStats, DashboardHeader, DashboardOverview } from '../components/Dashboard';
import type { Product, TentType, Extra } from '../types';
import type { MenuItem, DashboardStat } from '../components/Dashboard';

const SIDEBAR_WIDTH = 280;

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tentTypes, setTentTypes] = useState<TentType[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, tentTypesData, extrasData, enquiriesData] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('tent_types').select('*'),
        supabase.from('extras').select('*'),
        supabase.from('enquiries').select('*').eq('status', 'pending')
      ]);

      if (productsData.error) throw productsData.error;
      if (tentTypesData.error) throw tentTypesData.error;
      if (extrasData.error) throw extrasData.error;
      if (enquiriesData.error) throw enquiriesData.error;

      const newProducts = productsData.data || [];
      const newTentTypes = tentTypesData.data || [];
      
      setProducts(newProducts);
      setTentTypes(newTentTypes);
      setExtras(extrasData.data || []);

      setStats([
        {
          label: 'Total Visitors',
          value: 2547,
          icon: <Eye size={24} />,
          description: 'Website visitors this month'
        },
        {
          label: 'New Enquiries',
          value: enquiriesData.data?.length || 0,
          icon: <Mail size={24} />,
          description: 'Pending customer enquiries'
        },
        {
          label: 'Total Tents',
          value: newProducts.length,
          icon: <Tent size={24} />,
          description: 'Available tents in inventory'
        },
        {
          label: 'Tent Types',
          value: newTentTypes.length,
          icon: <Layers size={24} />,
          description: 'Different tent categories available'
        },
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const menuItems: MenuItem[] = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      component: <DashboardOverview stats={stats} />
    },
    { 
      label: 'Tents', 
      icon: <Tent size={20} />, 
      component: <TentsManager products={products} tentTypes={tentTypes} onUpdate={fetchDashboardData} />
    },
    { 
      label: 'Extras', 
      icon: <Layers size={20} />, 
      component: <ExtrasManager /> 
    },
    { 
      label: 'Tent Types', 
      icon: <Tent size={20} />, 
      component: <TentTypesManager /> 
    },
    { 
      label: 'Enquiries', 
      icon: <Users size={20} />, 
      component: (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Enquiries feature coming soon
          </Typography>
        </Box>
      )
    },
    { 
      label: 'Analytics', 
      icon: <BarChart3 size={20} />, 
      component: (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Analytics feature coming soon
          </Typography>
        </Box>
      )
    },
    { 
      label: 'Settings', 
      icon: <Settings size={20} />, 
      component: (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Settings feature coming soon
          </Typography>
        </Box>
      )
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      <DashboardSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
        sidebarWidth={SIDEBAR_WIDTH}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          bgcolor: 'background.default',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <DashboardHeader title={menuItems[activeTab].label} />
        <Paper 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {menuItems[activeTab].component}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage; 
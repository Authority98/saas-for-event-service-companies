import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { MenuItem } from './types';
import { alpha } from '@mui/material/styles';

interface DashboardSidebarProps {
  menuItems: MenuItem[];
  activeTab: number;
  onTabChange: (index: number) => void;
  onSignOut: () => void;
  sidebarWidth: number;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  menuItems,
  activeTab,
  onTabChange,
  onSignOut,
  sidebarWidth,
}) => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        height: '100%',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        pt: '64px',
      }}
    >
      {/* User Profile */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            {user?.email?.[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>
          <IconButton size="small">
            <Bell size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeTab === index}
              onClick={() => onTabChange(index)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: activeTab === index ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Sign Out Button */}
      <ListItem 
        disablePadding 
        sx={{ 
          px: 2, 
          pb: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <ListItemButton
          onClick={onSignOut}
          sx={{
            borderRadius: 2,
            color: 'text.secondary',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText 
            primary="Sign Out"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: 400,
            }}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default DashboardSidebar; 
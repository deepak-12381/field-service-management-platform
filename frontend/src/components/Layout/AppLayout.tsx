 import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/Groups';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
  { text: 'Sites', icon: <PlaceIcon />, path: '/sites' },
  { text: 'Work Orders', icon: <WorkIcon />, path: '/work-orders' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Technicians', icon: <BuildIcon />, path: '/technicians' },
  { text: 'Managers', icon: <ManageAccountsIcon />, path: '/managers' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();

  const [userName, setUserName] = useState('Administrator');

useEffect(() => {
  const loadProfile = () => {
    const savedProfile = localStorage.getItem('userProfile');

    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserName(profile.name || 'Administrator');
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    }
  };

  loadProfile();

  window.addEventListener('storage', loadProfile);

  return () => {
    window.removeEventListener('storage', loadProfile);
  };
}, []);

  const handleToggle = () => setOpen((s) => !s);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          backgroundColor: '#ffffff',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton edge="start" color="inherit" onClick={handleToggle} sx={{ mr: 2 }} aria-label="menu">
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Field Service Management Platform
          </Typography>

          <Box sx={{ flex: 1 }} />

           <Box
  onClick={() => navigate('/profile')}
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    cursor: 'pointer',
    px: 1,
    py: 0.5,
    borderRadius: 2,
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  }}
>
   <Typography
  variant="body2"
  color="text.secondary"
  sx={{ display: { xs: 'none', sm: 'block' } }}
>
  {userName}
</Typography>

 <Avatar
  sx={{
    bgcolor: 'primary.main',
    color: '#ffffff',
    fontWeight: 600,
  }}
>
  {userName ? userName.trim().charAt(0).toUpperCase() : 'A'}
</Avatar>
</Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: open ? drawerWidth : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 72,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', { duration: 200 }),
            overflowX: 'hidden',
            backgroundColor: '#ffffff',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 64, display: 'flex', alignItems: 'center', px: 2 }}>
          {open ? (
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Navigation
            </Typography>
          ) : (
            <Box sx={{ width: 32 }} />
          )}
        </Toolbar>

        <Divider />

        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                py: 1.5,
                px: 2,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, justifyContent: 'center', color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pt: '100px', minHeight: '100vh', backgroundColor: '#f7f8fb' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;

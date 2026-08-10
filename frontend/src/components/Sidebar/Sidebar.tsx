import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PlaceIcon from '@mui/icons-material/Place';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const expandedWidth = 240;
const collapsedWidth = 72;

const items = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Sites', icon: <PlaceIcon />, path: '/sites' },
  { text: 'Work Orders', icon: <WorkIcon />, path: '/work-orders' },
  { text: 'Technicians', icon: <BuildIcon />, path: '/technicians' },
  { text: 'Managers', icon: <SupervisorAccountIcon />, path: '/managers' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  { text: 'Logout', icon: <LogoutIcon />, path: '/logout' },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setOpen((s) => !s);
  const handleMobileToggle = () => setMobileOpen((s) => !s);

  const drawerContent = (
    <>
      <Toolbar sx={{ minHeight: 64, px: 2, display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center' }}>
        {open ? (
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Navigation
          </Typography>
        ) : null}

        <IconButton onClick={handleToggle} size="small" aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <Divider />

      <List sx={{ py: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            onClick={(e) => {
              if (item.text === 'Logout') {
                // simple local logout behavior: clear token and navigate to login
                try {
                  localStorage.removeItem('token');
                } catch (err) {
                  // ignore
                }
                navigate('/login');
                e.preventDefault();
              }
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              py: 1.25,
              px: 2,
              justifyContent: open ? 'initial' : 'center',
              '&.active': {
                backgroundColor: 'action.selected',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <Tooltip title={open ? '' : item.text} placement="right">
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, justifyContent: 'center', color: 'text.secondary' }}>{item.icon}</ListItemIcon>
            </Tooltip>
            {open && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />}
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={handleMobileToggle}
          sx={{ position: 'fixed', top: 12, left: 12, zIndex: (t) => t.zIndex.appBar + 2, backgroundColor: '#fff' }}
          aria-label="open navigation"
          size="small"
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : open}
        onClose={() => (isMobile ? setMobileOpen(false) : setOpen(false))}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: open ? expandedWidth : collapsedWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? expandedWidth : collapsedWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: theme.transitions.create('width', { duration: 200 }),
            backgroundColor: '#ffffff',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

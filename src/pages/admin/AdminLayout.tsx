import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Toolbar,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../providers/AuthProvider';

const drawerWidth = 260;

const adminNav = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Shows', path: '/admin/dashboard#shows', icon: <EventNoteIcon fontSize="small" /> },
  { label: 'Lanzamientos', path: '/admin/dashboard#releases', icon: <LibraryMusicIcon fontSize="small" /> },
  { label: 'Media', path: '/admin/dashboard#media', icon: <VideoLibraryIcon fontSize="small" /> },
  { label: 'Hero / EPK', path: '/admin/dashboard#hero', icon: <DashboardIcon fontSize="small" /> },
];

export function RequireAuth() {
  const { session, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, loading, error, clearError } = useAuth();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' },
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setSnackbar({ open: true, message: 'Sesión finalizada correctamente.', severity: 'success' });
      navigate('/admin/login', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión.';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Elite Clan · Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {adminNav.map((item) => {
          const isSelected = `${location.pathname}${location.hash}` === item.path;
          return (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={isSelected}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            Sesión activa
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} noWrap>
            {user?.email}
          </Typography>
          <Button
            onClick={handleLogout}
            startIcon={loading ? <CircularProgress size={16} /> : <LogoutIcon fontSize="small" />}
            disabled={loading}
            sx={{ mt: 1 }}
          >
            Cerrar sesión
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
            aria-label="Abrir navegación"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 700 }}>
            Panel administrativo
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.email}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={loading ? <CircularProgress size={14} /> : <LogoutIcon fontSize="small" />}
              onClick={handleLogout}
              disabled={loading}
            >
              Salir
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="navegación admin">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, sm: 4 }, mt: 8 }}>
        <Outlet />
      </Box>
      <Snackbar
        open={snackbar.open || Boolean(error)}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
          if (error) {
            clearError();
          }
        }}
      >
        <Alert
          severity={snackbar.open ? snackbar.severity : 'error'}
          onClose={() => {
            setSnackbar((prev) => ({ ...prev, open: false }));
            if (error) {
              clearError();
            }
          }}
          sx={{ width: '100%' }}
        >
          {snackbar.open ? snackbar.message : error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  Button,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MenuIcon from '@mui/icons-material/Menu';

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to === '/' && pathname === '/');
  return (
    <Typography
      component={Link}
      to={to}
      sx={{
        position: 'relative',
        mr: 3,
        color: active ? 'primary.main' : 'grey.300',
        textDecoration: 'none',
        fontWeight: active ? 800 : 600,
        px: 0.5,
        '&:hover': { color: 'primary.light' },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: -6,
          width: '100%',
          height: 2,
          borderRadius: 2,
          bgcolor: 'primary.main',
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease',
          opacity: active ? 1 : 0.8,
        },
      }}
    >
      {label}
    </Typography>
  );
};

export function MainLayout() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/musica', label: 'Música' },
    { to: '/shows', label: 'Shows' },
    { to: '/media', label: 'Media' },
    { to: '/epk', label: 'EPK' },
    { to: '/contacto', label: 'Contacto' },
  ];

  const socialLinks = [
    {
      icon: <InstagramIcon />,
      label: 'Instagram',
      href: 'https://www.instagram.com/eliteklan?igsh=MTZjZ3FxNmt4aWtjbg==',
    },
    {
      icon: <YouTubeIcon />,
      label: 'YouTube',
      href: 'https://www.youtube.com/@eliteklan-official/videos',
    },
  ];

  const isActive = (to: string) => pathname === to || (to === '/' && pathname === '/');

  const navLinkStyles = (active: boolean) => ({
    position: 'relative',
    justifyContent: 'flex-start',
    fontWeight: active ? 700 : 600,
    color: active ? 'primary.main' : 'text.primary',
    px: 2,
    py: isMdDown ? 1.25 : 1.5,
    borderRadius: 1,
    '&:hover': {
      color: 'primary.main',
      bgcolor: 'action.hover',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: isMdDown ? 8 : 16,
      right: isMdDown ? 8 : 16,
      bottom: isMdDown ? 6 : 8,
      height: 2,
      borderRadius: 2,
      bgcolor: 'primary.main',
      transform: active ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.3s ease',
      opacity: active ? 1 : 0.8,
    },
  });

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <MusicNoteIcon sx={{ mr: 1 }} />
          <Typography component={Link} to="/" variant="h6" sx={{ color: 'white', textDecoration: 'none', fontWeight: 900, letterSpacing: 1 }}>
            ELITE CLAN
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} label={label} />
            ))}
          </Box>
          <Button
            variant="contained"
            href="https://open.spotify.com/artist/0mPKzW0fvkYhpCy7BmvpVM"
            target="_blank"
            rel="noreferrer"
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              ml: 3,
              px: 3,
              py: 1,
              borderRadius: 999,
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(90deg, #1DB954 0%, #1ED760 100%)',
              boxShadow: '0 8px 20px rgba(30, 215, 96, 0.3)',
              color: '#0d1f0d',
              '&:hover': {
                background: 'linear-gradient(90deg, #1aa34a 0%, #19c355 100%)',
                boxShadow: '0 10px 24px rgba(30, 215, 96, 0.4)',
              },
            }}
          >
            Escuchar en Spotify
          </Button>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, ml: 2 }}>
            {socialLinks.map(({ icon, label, href }) => (
              <IconButton key={label} color="inherit" size="small" aria-label={label} href={href} target="_blank" rel="noreferrer">
                {icon}
              </IconButton>
            ))}
          </Box>
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            pt: 6,
          },
        }}
      >
        <List sx={{ px: 1 }}>
          {navItems.map(({ to, label }) => {
            const active = isActive(to);
            return (
              <ListItemButton
                key={to}
                component={Link}
                to={to}
                onClick={() => setDrawerOpen(false)}
                sx={navLinkStyles(active)}
              >
                {label}
              </ListItemButton>
            );
          })}
        </List>
        <Box sx={{ px: 3, pt: 2, display: 'flex', gap: 1 }}>
          {socialLinks.map(({ icon, label, href }) => (
            <IconButton key={label} color="primary" aria-label={label} href={href} target="_blank" rel="noreferrer">
              {icon}
            </IconButton>
          ))}
        </Box>
        <Box sx={{ px: 3, py: 3 }}>
          <Button
            fullWidth
            variant="contained"
            href="https://open.spotify.com/artist/0mPKzW0fvkYhpCy7BmvpVM"
            target="_blank"
            rel="noreferrer"
            sx={{
              mt: 2,
              borderRadius: 999,
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(90deg, #1DB954 0%, #1ED760 100%)',
              boxShadow: '0 8px 20px rgba(30, 215, 96, 0.3)',
              color: '#0d1f0d',
              '&:hover': {
                background: 'linear-gradient(90deg, #1aa34a 0%, #19c355 100%)',
                boxShadow: '0 10px 24px rgba(30, 215, 96, 0.4)',
              },
            }}
          >
            Escuchar en Spotify
          </Button>
        </Box>
      </Drawer>

      <Container sx={{ py: 6, flexGrow: 1 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2">© {new Date().getFullYear()} Elite Klan — Todos los derechos reservados.</Typography>
      </Box>
    </Box>
  );
}

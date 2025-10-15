import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to === '/' && pathname === '/');
  return (
    <Typography
      component={Link}
      to={to}
      sx={{
        mr: 3, color: active ? 'primary.main' : 'grey.300',
        textDecoration: 'none', fontWeight: active ? 800 : 600,
        '&:hover': { color: 'primary.light' },
      }}
    >
      {label}
    </Typography>
  );
};

export function MainLayout() {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
        <Toolbar sx={{ gap: 2 }}>
          <MusicNoteIcon sx={{ mr: 1 }} />
          <Typography component={Link} to="/" variant="h6" sx={{ color: 'white', textDecoration: 'none', fontWeight: 900, letterSpacing: 1 }}>
            ELITE CLAN
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <NavLink to="/" label="Inicio" />
          <NavLink to="/musica" label="Música" />
          <NavLink to="/shows" label="Shows" />
          <NavLink to="/media" label="Media" />
          <NavLink to="/epk" label="EPK" />
          <NavLink to="/contacto" label="Contacto" />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" size="small" aria-label="Instagram" href="https://www.instagram.com/eliteklan?igsh=MTZjZ3FxNmt4aWtjbg==" target="_blank" rel="noreferrer">
            <InstagramIcon />
          </IconButton>
          <IconButton color="inherit" size="small" aria-label="YouTube" href="https://www.youtube.com/@eliteklan-official/videos" target="_blank" rel="noreferrer">
            <YouTubeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 6, flexGrow: 1 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2">© {new Date().getFullYear()} Elite Klan — Todos los derechos reservados.</Typography>
      </Box>
    </Box>
  );
}

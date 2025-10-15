import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',            // vibe banda 🎤
    primary: { main: '#F59E0B' }, // dorado
    secondary: { main: '#1D4ED8' }, // acento azul
    background: { default: '#0b0b0b', paper: '#111' },
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial'].join(','),
    h1: { fontWeight: 800, letterSpacing: -0.5 },
    h2: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
});

export default theme;

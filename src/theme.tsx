import { CssBaseline, GlobalStyles } from '@mui/material';
import {
  ThemeProvider as MuiThemeProvider,
  alpha,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import { ReactNode } from 'react';

const noiseTexture =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.15"/></svg>';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F0B429',
      light: '#FFDEA1',
      dark: '#B98117',
    },
    secondary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1E3A8A',
    },
    background: {
      default: '#040510',
      paper: '#0A0C1D',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5F5',
    },
    divider: alpha('#FFFFFF', 0.08),
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontFamily: '"Clash Display", "Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.05em',
    },
    h2: {
      fontFamily: '"Clash Display", "Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h3: {
      fontFamily: '"Clash Display", "Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.04em',
    },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          paddingInline: '1.5rem',
          paddingBlock: '0.75rem',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.55)}`,
          boxShadow: `0 18px 45px ${alpha(theme.palette.primary.main, 0.2)}`,
          backdropFilter: 'blur(4px)',
          transition: theme.transitions.create(['transform', 'box-shadow', 'border-color'], {
            duration: theme.transitions.duration.short,
            easing: theme.transitions.easing.easeOut,
          }),
          '&:hover': {
            transform: 'translateY(-3px) scale(1.01)',
            boxShadow: `0 25px 60px ${alpha(theme.palette.secondary.main, 0.35)}`,
            borderColor: alpha(theme.palette.secondary.main, 0.65),
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 24,
          border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
          backgroundImage: `linear-gradient(160deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(
            theme.palette.background.default,
            0.75,
          )} 100%)`,
          boxShadow: `0 30px 80px ${alpha(theme.palette.common.black, 0.5)}`,
          backdropFilter: 'blur(14px)',
          transition: theme.transitions.create(['transform', 'box-shadow', 'border-color'], {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeOut,
          }),
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 40px 110px ${alpha(theme.palette.secondary.main, 0.4)}`,
            borderColor: alpha(theme.palette.primary.main, 0.6),
          },
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.85)}, ${alpha(
            theme.palette.secondary.main,
            0.75,
          )})`,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          boxShadow: `0 18px 55px ${alpha(theme.palette.secondary.main, 0.28)}`,
          backdropFilter: 'blur(10px)',
        }),
      },
    },
  },
});

theme = responsiveFontSizes(theme);

type ThemeProviderProps = { children: ReactNode };

const AppThemeProvider = ({ children }: ThemeProviderProps) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles
      styles={() => ({
        ':root': {
          colorScheme: 'dark',
        },
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        body: {
          margin: 0,
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          backgroundImage: `radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.light, 0.18)}, transparent 55%),
            radial-gradient(circle at 80% 0%, ${alpha(theme.palette.secondary.light, 0.15)}, transparent 60%),
            radial-gradient(circle at 10% 90%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 65%),
            url('${noiseTexture}')`,
          backgroundBlendMode: 'screen, lighten, soft-light, normal',
          backgroundAttachment: 'fixed',
          color: theme.palette.text.primary,
          transition: 'background 600ms ease, color 400ms ease',
        },
        '::selection': {
          backgroundColor: alpha(theme.palette.primary.main, 0.4),
          color: theme.palette.common.black,
        },
      })}
    />
    {children}
  </MuiThemeProvider>
);

export const ThemeProvider = Object.assign(AppThemeProvider, { theme });

export default ThemeProvider;

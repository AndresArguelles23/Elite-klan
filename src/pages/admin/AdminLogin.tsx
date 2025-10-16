import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../providers/AuthProvider';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError, session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' },
  );

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  if (session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  type LocationState = { from?: { pathname?: string } } | null;
  const from = ((location.state as LocationState)?.from?.pathname) ?? '/admin/dashboard';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({ email, password });
      setSnackbar({ open: true, message: 'Bienvenido de nuevo.', severity: 'success' });
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de autenticación.';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) => theme.palette.grey[100],
        p: 2,
      }}
    >
      <Paper elevation={8} sx={{ p: { xs: 3, sm: 5 }, maxWidth: 420, width: '100%', borderRadius: 4 }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={800}>
              Acceso administrativo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa tus credenciales para gestionar el contenido del sitio.
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <TextField
              label="Correo electrónico"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <TextField
              label="Contraseña"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            Iniciar sesión
          </Button>
        </Stack>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
          if (error) {
            clearError();
          }
        }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => {
            setSnackbar((prev) => ({ ...prev, open: false }));
            if (error) {
              clearError();
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

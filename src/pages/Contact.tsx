import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';

export function Contact() {
  type FormValues = {
    name: string;
    email: string;
    eventType: string;
    budget: string;
    eventDate: Dayjs | null;
    message: string;
  };

  const initialFormValues: FormValues = {
    name: '',
    email: '',
    eventType: '',
    budget: '',
    eventDate: null,
    message: '',
  };

  const [values, setValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (
    field: Exclude<keyof FormValues, 'eventDate'>,
  ) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>,
    ) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    };

  const handleDateChange = (newValue: Dayjs | null) => {
    setValues((prev) => ({ ...prev, eventDate: newValue }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.eventDate;
      return updated;
    });
  };

  const validate = (form: FormValues) => {
    const validationErrors: Partial<Record<keyof FormValues, string>> = {};

    if (!form.name.trim()) {
      validationErrors.name = 'Ingresa tu nombre de contacto.';
    }

    if (!form.email.trim()) {
      validationErrors.email = 'Necesitamos un correo para responderte.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/iu.test(form.email)) {
      validationErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!form.eventType) {
      validationErrors.eventType = 'Selecciona el tipo de evento.';
    }

    if (!form.budget.trim()) {
      validationErrors.budget = 'Indica el presupuesto estimado.';
    } else if (Number.isNaN(Number(form.budget)) || Number(form.budget) <= 0) {
      validationErrors.budget = 'El presupuesto debe ser un número mayor a cero.';
    }

    if (!form.eventDate) {
      validationErrors.eventDate = 'Selecciona una fecha tentativa.';
    }

    if (!form.message.trim()) {
      validationErrors.message = 'Cuéntanos más detalles del evento.';
    }

    return validationErrors;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Simula el envío al backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Booking message:', {
        ...values,
        eventDate: values.eventDate?.toISOString(),
      });
      setSuccess('¡Gracias! Te contactaremos pronto.');
      setErrors({});
      setValues(initialFormValues);
    } catch (err) {
      console.error('Error al enviar formulario de contacto', err);
      setError('No pudimos enviar tu solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>Contacto / Booking</Typography>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={7}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <form onSubmit={onSubmit} noValidate>
                <Stack spacing={2}>
                  <Typography variant="h5">Cuéntanos de tu evento</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(errors.name)}>
                        <TextField
                          name="name"
                          label="Nombre de contacto"
                          value={values.name}
                          onChange={handleFieldChange('name')}
                          required
                        />
                        {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(errors.email)}>
                        <TextField
                          name="email"
                          type="email"
                          label="Correo electrónico"
                          value={values.email}
                          onChange={handleFieldChange('email')}
                          required
                        />
                        {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(errors.eventType)}>
                        <InputLabel id="event-type-label">Tipo de evento</InputLabel>
                        <Select
                          labelId="event-type-label"
                          name="eventType"
                          label="Tipo de evento"
                          value={values.eventType}
                          onChange={handleFieldChange('eventType')}
                          required
                        >
                          <MenuItem value="concierto">Concierto</MenuItem>
                          <MenuItem value="festival">Festival</MenuItem>
                          <MenuItem value="privado">Evento privado</MenuItem>
                          <MenuItem value="corporativo">Corporativo</MenuItem>
                          <MenuItem value="otro">Otro</MenuItem>
                        </Select>
                        {errors.eventType && (
                          <FormHelperText>{errors.eventType}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(errors.budget)}>
                        <TextField
                          name="budget"
                          type="number"
                          label="Presupuesto estimado"
                          value={values.budget}
                          onChange={handleFieldChange('budget')}
                          inputProps={{ min: 0 }}
                          required
                        />
                        {errors.budget && (
                          <FormHelperText>{errors.budget}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={Boolean(errors.eventDate)}>
                        <DatePicker
                          label="Fecha tentativa"
                          value={values.eventDate}
                          onChange={handleDateChange}
                          slotProps={{
                            textField: {
                              required: true,
                              error: Boolean(errors.eventDate),
                            },
                          }}
                        />
                        {errors.eventDate && (
                          <FormHelperText>{errors.eventDate}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={Boolean(errors.message)}>
                        <TextField
                          name="message"
                          label="Mensaje"
                          multiline
                          minRows={4}
                          value={values.message}
                          onChange={handleFieldChange('message')}
                          required
                        />
                        {errors.message && (
                          <FormHelperText>{errors.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? 'Enviando…' : 'Enviar solicitud'}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack spacing={2}>
              <Typography variant="h5">Booking directo</Typography>
              <Typography>
                ¿Prefieres coordinar de manera inmediata? Contáctanos por los
                siguientes medios:
              </Typography>
              <Stack spacing={1}>
                <Typography>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:booking@eliteklan.com">booking@eliteklan.com</a>
                </Typography>
                <Typography>
                  <strong>Teléfono:</strong>{' '}
                  <a href="tel:+5215512345678">+52 1 55 1234 5678</a>
                </Typography>
                <Typography>
                  <strong>Representante:</strong> Laura Martínez
                </Typography>
              </Stack>
              <Typography variant="subtitle1">Press kit &amp; recursos</Typography>
              <Stack spacing={1}>
                <Typography>
                  <a href="/press-kit/eliteklan.zip" target="_blank" rel="noopener">
                    Descargar press kit
                  </a>
                </Typography>
                <Typography>
                  <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank" rel="noopener">
                    Showcase en video
                  </a>
                </Typography>
                <Typography>
                  <a
                    href="https://open.spotify.com/playlist/press-demo"
                    target="_blank"
                    rel="noopener"
                  >
                    Playlist de referencia
                  </a>
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

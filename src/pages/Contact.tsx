import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import type { FormEvent } from 'react';

export function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log('Booking message:', Object.fromEntries(data.entries()));
    alert('¡Gracias! Te contactaremos pronto.');
    e.currentTarget.reset();
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>Contacto / Booking</Typography>
      <Paper sx={{ p: 3, maxWidth: 640 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField name="name" label="Nombre" required />
            <TextField name="email" type="email" label="Correo" required />
            <TextField name="message" label="Mensaje" multiline minRows={4} required />
            <Button type="submit" variant="contained" size="large">Enviar</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

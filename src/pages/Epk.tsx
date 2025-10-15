import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export function Epk() {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>EPK — Electronic Press Kit</Typography>
      <Paper sx={{ p: 3, maxWidth: 900 }}>
        <Stack spacing={2}>
          <Typography><b>Género:</b> Urbano / Latino — <b>Ciudad base:</b> Barranquilla</Typography>
          <Typography><b>Bio corta:</b> Elite Clan mezcla ritmos urbanos con energía latina para shows explosivos y un sonido propio.</Typography>
          <Typography><b>Para prensa:</b> Contacto: booking@eliteclan.com — +57 300 000 0000</Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>Fotos HD (ZIP)</Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>Logo (PNG/SVG)</Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>Rider técnico (PDF)</Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>Stage plot (PDF)</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

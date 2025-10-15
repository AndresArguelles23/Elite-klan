import { Box, Button, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EventIcon from '@mui/icons-material/Event';
import { Link as RouterLink } from 'react-router-dom';

export function Home() {
  return (
    <Box
      sx={{
        minHeight: 420,
        borderRadius: 4,
        p: { xs: 4, md: 8 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'linear-gradient(135deg,#111 0%, #1c1c1c 50%, #0b0b0b 100%)',
      }}
    >
      <Stack spacing={3} alignItems="center" maxWidth={860}>
        <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 64 } }}>
          Sonido Elite. Energía en Vivo.
        </Typography>
        <Typography variant="h6" color="grey.400">
          Elite Clan es un proyecto musical con fusión urbana/latina. Escucha el nuevo single y mira las próximas fechas.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            component={RouterLink}
            to="/musica"
          >
            Escuchar ahora
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<EventIcon />}
            component={RouterLink}
            to="/shows"
          >
            Ver shows
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

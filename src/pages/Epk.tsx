import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { listSiteSettings } from '../services/contentRepository';
import { useContentQuery } from '../hooks/useContentQuery';
import type { SiteSettings } from '../types/content';

export function Epk() {
  const {
    data: settings,
    loading,
    error,
  } = useContentQuery<SiteSettings[]>(listSiteSettings, []);

  const siteSettings = settings?.[0] ?? null;
  const downloads = siteSettings?.epkDownloads ?? [];

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>EPK — Electronic Press Kit</Typography>
      {loading ? (
        <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
          <CircularProgress color="primary" />
          <Typography color="text.secondary">Cargando press kit...</Typography>
        </Stack>
      ) : null}
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          No pudimos obtener la información del press kit.
        </Alert>
      ) : null}
      {!loading && !error && !siteSettings ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No hay contenido configurado para el press kit todavía.
        </Alert>
      ) : null}
      {siteSettings ? (
        <Paper sx={{ p: 3, maxWidth: 900 }}>
          <Stack spacing={2}>
            <Typography>
              <b>Género:</b> {siteSettings.epkGenre ?? '—'} — <b>Ciudad base:</b> {siteSettings.epkCity ?? '—'}
            </Typography>
            <Typography>
              <b>Bio corta:</b> {siteSettings.epkBio ?? 'Actualiza la bio desde el panel de contenido.'}
            </Typography>
            <Typography>
              <b>Para prensa:</b> {siteSettings.pressContact ?? 'Sin información de contacto definida.'}
            </Typography>
            {downloads.length ? (
              <Stack direction="row" spacing={2} sx={{ pt: 1, flexWrap: 'wrap' }}>
                {downloads.map((item) => (
                  <Button
                    key={item.label}
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    component="a"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            ) : null}
          </Stack>
        </Paper>
      ) : null}
    </Box>
  );
}

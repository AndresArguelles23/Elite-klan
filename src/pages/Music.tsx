import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
export function Music() {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>Música</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>Último lanzamiento (YouTube)</Typography>
            <Box sx={{ position: 'relative', pt: '56.25%' }}>
              <Box
                component="iframe"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Elite Clan - Single"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, borderRadius: 2 }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>Playlist (Spotify)</Typography>
            <Box
              component="iframe"
              sx={{ width: '100%', height: 360, border: 0, borderRadius: 2 }}
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUsuxWHRQd?utm_source=generator&theme=0"
              loading="lazy"
              title="Spotify"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

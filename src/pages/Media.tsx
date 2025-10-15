import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
const PHOTOS = [
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
];

export function Media() {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>Media</Typography>
      <Grid container spacing={2}>
        {PHOTOS.map((src) => (
          <Grid item xs={12} sm={6} md={3} key={src}>
            <Box component="img" src={src} alt="Elite Clan" sx={{ width: '100%', borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

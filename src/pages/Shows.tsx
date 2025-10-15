import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
const SHOWS = [
  { date: '2025-11-08', city: 'Barranquilla', venue: 'Teatro ABC', status: 'Boletas' },
  { date: '2025-11-22', city: 'Cartagena', venue: 'Plaza Centro', status: 'Pronto' },
];

export function Shows() {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>Próximos shows</Typography>
      <Grid container spacing={3}>
        {SHOWS.map((s) => (
          <Grid item xs={12} md={6} key={s.date + s.city}>
            <Card>
              <CardContent>
                <Typography variant="h6">{s.city} — {s.venue}</Typography>
                <Typography color="grey.400">{new Date(s.date).toLocaleDateString()}</Typography>
                <Chip label={s.status} sx={{ mt: 1 }} color={s.status === 'Boletas' ? 'primary' : 'default'} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

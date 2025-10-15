import type { SvgIconProps } from '@mui/material/SvgIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AppleIcon from '@mui/icons-material/Apple';
import YouTubeIcon from '@mui/icons-material/YouTube';

type Release = {
  title: string;
  date: string;
  art: string;
  description: string;
  genres: string[];
  links: {
    spotify: string;
    apple: string;
    youtube: string;
  };
};

const releases: Release[] = [
  {
    title: 'Neon Skyline',
    date: '2024-05-17',
    art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    description:
      'Un himno synthwave que combina melodías nostálgicas con un bajo contundente para las noches más largas.',
    genres: ['Synthwave', 'Electronic', 'Midtempo'],
    links: {
      spotify: 'https://open.spotify.com/track/1zcJH7zVhk2PzvgXDpPT8f',
      apple: 'https://music.apple.com/album/neon-skyline-single/1440881047',
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  },
  {
    title: 'Digital Mirage',
    date: '2023-11-03',
    art: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    description:
      'Texturas vaporwave y ritmos nostálgicos que se fusionan con percusiones modernas para crear una atmósfera única.',
    genres: ['Vaporwave', 'Downtempo'],
    links: {
      spotify: 'https://open.spotify.com/track/6DCZcSspjsKoFjzjrWoCdn',
      apple: 'https://music.apple.com/album/digital-mirage-single/1573565310',
      youtube: 'https://www.youtube.com/watch?v=u9Mv98Gr5pY',
    },
  },
  {
    title: 'Electric Dreams',
    date: '2023-04-28',
    art: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    description:
      'Una colaboración con vocalistas invitados que explora paisajes sonoros oníricos y ritmos energéticos.',
    genres: ['Synthpop', 'Dance'],
    links: {
      spotify: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
      apple: 'https://music.apple.com/album/electric-dreams/1440833086',
      youtube: 'https://www.youtube.com/watch?v=QzcvRDWgRIE',
    },
  },
  {
    title: 'Pulse Runner',
    date: '2022-10-14',
    art: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    description:
      'Beats potentes y sintetizadores agresivos para acompañar tus entrenamientos más intensos.',
    genres: ['Electro', 'Bass'],
    links: {
      spotify: 'https://open.spotify.com/track/3eekarcy7kvN4yt5ZFzltW',
      apple: 'https://music.apple.com/album/pulse-runner-single/1468058165',
      youtube: 'https://www.youtube.com/watch?v=CS9OO0S5w2k',
    },
  },
];

const SpotifyIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 496 512">
    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 364.8c-5.3 8.8-16.7 11.5-25.4 6.2-69.3-42.3-156.5-51.9-259-28.7-9.8 2.2-19.7-3.9-21.9-13.6-2.2-9.8 3.9-19.7 13.6-21.9 112.3-25.9 208.1-15.1 286.2 32.1 8.7 5.3 11.5 16.7 6.5 25.9zm35.5-74.4c-6.6 10.6-20.7 14-31.3 7.4-79.2-48.7-200-62.7-293.3-34.6-11.5 3.4-23.7-3.2-27-14.7-3.4-11.5 3.2-23.7 14.7-27 105.3-31.9 235.9-16.8 326.1 38.3 10.6 6.6 13.9 20.8 7.4 31.6zm2.8-81.4c-95-56.5-250.5-61.7-341.2-34-13.5 4.2-27.9-3.5-32.1-17-4.2-13.5 3.5-27.9 17-32.1 102-31.7 270.3-25.8 380.9 37.6 12.3 7.3 16.3 23.2 9 35.5-7.3 12.2-23.2 16.2-35.5 9z" />
  </SvgIcon>
);

export function Music() {
  const [latestRelease, ...catalog] = releases;

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Música
      </Typography>
      <Stack spacing={4}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} alignItems="stretch">
          <Card sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box
              component="img"
              src={latestRelease.art}
              alt={latestRelease.title}
              sx={{
                width: { xs: '100%', md: 320 },
                height: { xs: 220, md: '100%' },
                objectFit: 'cover',
              }}
            />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }}>
                Último lanzamiento · {latestRelease.date}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 2 }}>
                {latestRelease.title}
              </Typography>
              <Typography sx={{ mb: 3 }}>{latestRelease.description}</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {latestRelease.genres.map((genre) => (
                  <Chip key={genre} label={genre} color="primary" variant="outlined" />
                ))}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 'auto' }}>
                <Button
                  component="a"
                  href={latestRelease.links.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<SpotifyIcon />}
                >
                  Escuchar en Spotify
                </Button>
                <Button
                  component="a"
                  href={latestRelease.links.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<AppleIcon />}
                >
                  Apple Music
                </Button>
                <Button
                  component="a"
                  href={latestRelease.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<YouTubeIcon />}
                >
                  YouTube
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Paper
            sx={{
              flexBasis: { xs: 'auto', lg: 360 },
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(23,23,40,0.85), rgba(108,29,103,0.85))',
              color: 'common.white',
              backdropFilter: 'blur(12px)',
              boxShadow: 8,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Playlist destacada
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
              Explora una selección curada con nuestros temas favoritos para acompañar tu día.
            </Typography>
            <Box
              component="iframe"
              sx={{
                width: '100%',
                height: 380,
                border: 0,
                borderRadius: 3,
                boxShadow: (theme) => theme.shadows[6],
              }}
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUsuxWHRQd?utm_source=generator&theme=0"
              loading="lazy"
              title="Elite Clan Playlist"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </Paper>
        </Stack>

        <Grid container spacing={3}>
          {catalog.map((release) => (
            <Grid key={release.title} item xs={12} sm={6} lg={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height="200" image={release.art} alt={release.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="overline" sx={{ letterSpacing: 1 }}>
                    {release.date}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                    {release.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {release.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ gap: 1, flexWrap: 'wrap', px: 2, pb: 2 }}>
                  <Button
                    component="a"
                    href={release.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<SpotifyIcon fontSize="small" />}
                  >
                    Spotify
                  </Button>
                  <Button
                    component="a"
                    href={release.links.apple}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<AppleIcon fontSize="small" />}
                  >
                    Apple
                  </Button>
                  <Button
                    component="a"
                    href={release.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<YouTubeIcon fontSize="small" />}
                  >
                    YouTube
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}

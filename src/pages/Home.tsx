import { useMemo } from 'react';
import type { ComponentProps, ReactElement } from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Chip,
  IconButton,
  Paper,
  Stack,
  SvgIcon,
  Typography,
  Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AppleIcon from '@mui/icons-material/Apple';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { listReleases, listShows, listSiteSettings } from '../services/contentRepository';
import { useContentQuery } from '../hooks/useContentQuery';
import type { Release, Show, SiteSettings } from '../types/content';

function SpotifyIcon(props: ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon viewBox="0 0 496 512" {...props}>
      <path
        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm100.7 364.1c-4.2 6.8-13.2 8.9-20 4.6-55.3-34-124.9-41.5-206.8-22.6-7.8 1.8-15.6-3.1-17.4-10.9-1.8-7.8 3.1-15.6 10.9-17.4 90.9-20.9 167.7-12.8 229.8 26.9 6.8 4.2 8.9 13.2 4.5 20.4zm27.7-61.5c-5.2 8.5-16.4 11.2-24.9 5.9-63.4-39.2-160.1-50.6-235.3-27.5-9.5 2.8-19.4-2.6-22.2-12.1-2.8-9.5 2.6-19.4 12.1-22.2 86.7-26.1 193.6-13.6 266.6 32.3 8.5 5.2 11.2 16.4 5.9 24.9zm2.5-66.3C306 204.3 193.6 200.3 130 219.8c-11.2 3.4-23-3-26.4-14.2-3.4-11.2 3-23 14.2-26.4 73.5-22.4 200.2-18 276.8 34.4 9.8 6.6 12.4 19.9 5.8 29.7-6.6 9.7-19.9 12.3-29.7 5.8z"
      />
    </SvgIcon>
  );
}

export function Home() {
  dayjs.locale('es');

  const {
    data: releases,
    loading: releasesLoading,
    error: releasesError,
  } = useContentQuery<Release[]>(listReleases, []);
  const {
    data: shows,
    loading: showsLoading,
    error: showsError,
  } = useContentQuery<Show[]>(listShows, []);
  const {
    data: settings,
    loading: settingsLoading,
    error: settingsError,
  } = useContentQuery<SiteSettings[]>(listSiteSettings, []);

  const latestRelease = releases?.[0] ?? null;
  const siteSettings = settings?.[0] ?? null;

  const nextShow = useMemo(() => {
    if (!shows?.length) {
      return null;
    }

    const sorted = [...shows].sort(
      (a, b) => dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf(),
    );
    const now = dayjs();
    return (
      sorted.find((show) => dayjs(show.startAt).isAfter(now)) ?? sorted[sorted.length - 1]
    );
  }, [shows]);

  const heroVideoUrl = siteSettings?.heroVideoUrl ?? undefined;
  const heroTagline = siteSettings?.heroTagline ?? 'Nuevo lanzamiento';
  const heroTitle = siteSettings?.heroTitle ?? 'Próximamente';
  const heroDescription = siteSettings?.heroDescription ?? 'Pronto conocerás nuestro próximo lanzamiento.';
  const releaseDateLabel = siteSettings?.releaseDateLabel
    ?? (latestRelease?.releaseDate ? dayjs(latestRelease.releaseDate).format('D [de] MMMM, YYYY') : 'Por anunciar');

  const socialLinks = siteSettings?.socialLinks ?? {};

  const isLoading = releasesLoading || showsLoading || settingsLoading;
  const hasError = releasesError || showsError || settingsError;

  const formatShowDate = (show: Show) => dayjs(show.startAt).format('D [de] MMMM, YYYY · HH:mm');
  const showLocation = nextShow ? `${nextShow.city}${nextShow.venue ? `, ${nextShow.venue}` : ''}` : null;

  const streamingLinks = latestRelease
    ? ([
        latestRelease.links.spotify && {
          label: 'Spotify' as const,
          icon: <SpotifyIcon fontSize="small" />,
          url: latestRelease.links.spotify,
        },
        latestRelease.links.appleMusic && {
          label: 'Apple Music' as const,
          icon: <AppleIcon fontSize="small" />,
          url: latestRelease.links.appleMusic,
        },
        latestRelease.links.youtube && {
          label: 'YouTube' as const,
          icon: <YouTubeIcon fontSize="small" />,
          url: latestRelease.links.youtube,
        },
      ].filter(Boolean) as Array<{ label: string; icon: ReactElement; url: string }>)
    : [];
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: 420,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 10, md: 14 },
        overflow: 'hidden',
        backgroundColor: '#050505',
      }}
    >
      {heroVideoUrl ? (
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          src={heroVideoUrl}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.65)',
            zIndex: 0,
            pointerEvents: 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.9) 100%)',
            },
          }}
        />
      ) : null}
      <Stack spacing={3} alignItems="flex-start" maxWidth={760} zIndex={1}>
        {isLoading ? (
          <Stack spacing={2} alignItems="center" sx={{ width: '100%', py: 4 }}>
            <CircularProgress color="primary" />
            <Typography variant="body1" color="grey.300">
              Preparando contenido...
            </Typography>
          </Stack>
        ) : null}
        {hasError ? (
          <Alert severity="error" sx={{ width: '100%' }}>
            No pudimos cargar el contenido más reciente. Revisa tu conexión o intenta de nuevo.
          </Alert>
        ) : null}
        <Chip
          label={heroTagline}
          color="primary"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: 1,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            },
          }}
        />
        <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 64 } }}>
          {heroTitle}
        </Typography>
        <Typography variant="h6" color="grey.200">
          {heroDescription}
        </Typography>
        <Typography variant="subtitle2" color="grey.300" sx={{ textTransform: 'uppercase', letterSpacing: 4 }}>
          Lanzamiento oficial · {releaseDateLabel}
        </Typography>
        {streamingLinks.length ? (
          <ButtonGroup
            variant="contained"
            aria-label="Escucha en plataformas"
            sx={{
              '& .MuiButton-root': {
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
                },
              },
            }}
          >
            {streamingLinks.map((link) => (
              <Button
                key={link.label}
                startIcon={link.icon}
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </Button>
            ))}
          </ButtonGroup>
        ) : null}
        <Paper
          elevation={12}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 2, md: 3 },
            p: { xs: 2.5, md: 3 },
            mt: 2,
            width: '100%',
            maxWidth: 720,
            backgroundColor: 'rgba(14,14,14,0.75)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 24px 40px rgba(0,0,0,0.4)',
            },
          }}
        >
          <Stack spacing={0.5} flexGrow={1}>
            <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 2 }}>
              Próximo show
            </Typography>
            <Typography variant="h5">
              {showLocation ?? 'Pendiente por anunciar'}
            </Typography>
            {nextShow ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="body2" color="grey.300">
                  {formatShowDate(nextShow)}
                </Typography>
              </Stack>
            ) : null}
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/shows"
              sx={{
                minWidth: 180,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 30px rgba(0,0,0,0.35)',
                },
              }}
            >
              Comprar boletas
            </Button>
            <Stack direction="row" spacing={1}>
              {socialLinks.instagram ? (
                <IconButton
                  color="inherit"
                  component="a"
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'grey.100',
                    transition: 'transform 0.25s ease, background-color 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    },
                  }}
                >
                  <InstagramIcon />
                </IconButton>
              ) : null}
              {socialLinks.facebook ? (
                <IconButton
                  color="inherit"
                  component="a"
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'grey.100',
                    transition: 'transform 0.25s ease, background-color 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    },
                  }}
                >
                  <FacebookIcon />
                </IconButton>
              ) : null}
              {socialLinks.x ? (
                <IconButton
                  color="inherit"
                  component="a"
                  href={socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'grey.100',
                    transition: 'transform 0.25s ease, background-color 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    },
                  }}
                >
                  <XIcon />
                </IconButton>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            component={RouterLink}
            to="/musica"
            sx={{
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 18px 36px rgba(0,0,0,0.35)',
              },
            }}
          >
            Escuchar ahora
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/shows"
            sx={{
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.4)',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'rgba(255,255,255,0.8)',
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            Ver shows
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

import { useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { listMediaItems, listSiteSettings } from '../services/contentRepository';
import { useContentQuery } from '../hooks/useContentQuery';
import type { MediaItem, SiteSettings } from '../types/content';

type LightboxState = {
  collection: 'media' | 'highlights';
  index: number;
} | null;

export function Media() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const {
    data: mediaItems,
    loading: mediaLoading,
    error: mediaError,
  } = useContentQuery<MediaItem[]>(listMediaItems, []);
  const {
    data: siteSettings,
  } = useContentQuery<SiteSettings[]>(listSiteSettings, []);

  const socialLinks = siteSettings?.[0]?.socialLinks ?? {};

  const galleryItems = useMemo(
    () => (mediaItems ?? []).filter((item) => item.type === 'image'),
    [mediaItems],
  );
  const highlightItems = useMemo(
    () => (mediaItems ?? []).filter((item) => item.type === 'video'),
    [mediaItems],
  );

  const activeCollection = useMemo(() => {
    if (!lightbox) return [];
    return lightbox.collection === 'media' ? galleryItems : highlightItems;
  }, [galleryItems, highlightItems, lightbox]);

  const activeItem = useMemo(() => {
    if (!lightbox) return null;
    return activeCollection[lightbox.index] ?? null;
  }, [activeCollection, lightbox]);

  const handleNavigate = (direction: 1 | -1) => {
    setLightbox((current) => {
      if (!current) return current;
      const collection = current.collection === 'media' ? galleryItems : highlightItems;
      const count = collection.length;
      const nextIndex = (current.index + direction + count) % count;
      return { ...current, index: nextIndex };
    });
  };

  const cols = useMemo(() => {
    if (isMdUp) return 3;
    if (isSmUp) return 2;
    return 1;
  }, [isMdUp, isSmUp]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Media
        </Typography>
        {mediaLoading ? (
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <CircularProgress color="primary" />
            <Typography color="text.secondary">Cargando galería...</Typography>
          </Stack>
        ) : mediaError ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            No se pudo cargar la galería multimedia. Intenta nuevamente más tarde.
          </Alert>
        ) : !galleryItems.length ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            Aún no hay fotografías publicadas.
          </Alert>
        ) : (
          <ImageList variant="masonry" cols={cols} gap={16}>
            {galleryItems.map((item, index) => (
              <ImageListItem key={item.id}>
                <Box
                  component="img"
                  src={`${item.mediaUrl}?auto=format&fit=crop&w=600&q=80`}
                  alt={item.title ?? 'Elite Clan'}
                  onClick={() => setLightbox({ collection: 'media', index })}
                  sx={{
                    width: '100%',
                    display: 'block',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>

      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Highlights
        </Typography>
        {mediaLoading ? null : !highlightItems.length ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay videos destacados disponibles.
          </Alert>
        ) : (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              overflowX: 'auto',
              py: 1,
              scrollSnapType: 'x mandatory',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {highlightItems.map((highlight, index) => (
              <Box
                key={highlight.id}
                onClick={() => setLightbox({ collection: 'highlights', index })}
                sx={{
                  minWidth: { xs: '85%', sm: 360 },
                  scrollSnapAlign: 'center',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.01)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={highlight.thumbnailUrl ?? highlight.mediaUrl}
                  alt={highlight.title ?? 'Highlight'}
                  sx={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {highlight.title ?? 'Video destacado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {highlight.platform === 'instagram'
                      ? 'Instagram Reel'
                      : highlight.platform === 'youtube'
                        ? 'YouTube Clip'
                        : 'Video'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          px: 3,
          borderRadius: 4,
          background: (themeArg) =>
            themeArg.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(63,81,181,0.85), rgba(30,136,229,0.85))'
              : 'linear-gradient(135deg, rgba(63,81,181,0.12), rgba(30,136,229,0.12))',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Síguenos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Únete a nuestra comunidad y no te pierdas los próximos lanzamientos, eventos y clips exclusivos.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
        justifyContent="center"
        alignItems="center"
      >
          {socialLinks.instagram ? (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<InstagramIcon />}
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ minWidth: 200 }}
            >
              Instagram
            </Button>
          ) : null}
          {socialLinks.youtube ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<YouTubeIcon />}
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ minWidth: 200 }}
            >
              YouTube
            </Button>
          ) : null}
          {socialLinks.tiktok ? (
            <Button
              variant="contained"
              color="inherit"
              size="large"
              startIcon={<MusicNoteIcon />}
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ minWidth: 200 }}
            >
              TikTok
            </Button>
          ) : null}
        </Stack>
      </Box>

      <Dialog
        fullScreen
        open={Boolean(lightbox && activeItem)}
        onClose={() => setLightbox(null)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.9)',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <IconButton color="inherit" onClick={() => setLightbox(null)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {activeItem && (
          <Box
            sx={{
              flex: 1,
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              px: { xs: 2, sm: 6 },
            }}
          >
            <IconButton
              onClick={() => handleNavigate(-1)}
              sx={{
                position: 'absolute',
                left: { xs: 8, sm: 32 },
                color: 'common.white',
                backgroundColor: 'rgba(0,0,0,0.4)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={() => handleNavigate(1)}
              sx={{
                position: 'absolute',
                right: { xs: 8, sm: 32 },
                color: 'common.white',
                backgroundColor: 'rgba(0,0,0,0.4)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>

            {activeItem.type === 'image' ? (
              <Box
                component="img"
                src={`${activeItem.mediaUrl}?auto=format&fit=contain&w=1600&q=80`}
                alt={activeItem.title ?? 'Media highlight'}
                sx={{
                  maxHeight: '80vh',
                  maxWidth: '90vw',
                  objectFit: 'contain',
                  borderRadius: 2,
                  boxShadow: 6,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 960,
                  aspectRatio: '16 / 9',
                  backgroundColor: 'black',
                  boxShadow: 6,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="iframe"
                  src={activeItem.embedUrl ?? activeItem.mediaUrl}
                  title={activeItem.title ?? 'Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </Box>
            )}

            {activeItem.type === 'video' && (
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  bottom: { xs: 24, sm: 32 },
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'common.white',
                  textAlign: 'center',
                  px: 3,
                }}
              >
                {activeItem.title ?? 'Video'}
              </Typography>
            )}
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

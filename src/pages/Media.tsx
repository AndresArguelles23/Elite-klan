import { useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const MEDIA_ITEMS = [
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
].map((src) => ({ type: 'image' as const, src }));

const HIGHLIGHTS = [
  {
    type: 'video' as const,
    title: 'Mix Showcase (YouTube)',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
    thumbnail: 'https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg',
  },
  {
    type: 'video' as const,
    title: 'Highlights en Vivo (YouTube)',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/CevxZvSJLk8',
    thumbnail: 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg',
  },
  {
    type: 'video' as const,
    title: 'Reel detrás de cámaras',
    platform: 'instagram',
    embedUrl: 'https://www.instagram.com/reel/Cw3uK3lS6xP/embed',
    thumbnail:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=60',
  },
];

type LightboxState = {
  collection: 'media' | 'highlights';
  index: number;
} | null;

export function Media() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const activeCollection = useMemo(() => {
    if (!lightbox) return [];
    return lightbox.collection === 'media' ? MEDIA_ITEMS : HIGHLIGHTS;
  }, [lightbox]);

  const activeItem = useMemo(() => {
    if (!lightbox) return null;
    return activeCollection[lightbox.index] ?? null;
  }, [activeCollection, lightbox]);

  const handleNavigate = (direction: 1 | -1) => {
    setLightbox((current) => {
      if (!current) return current;
      const collection = current.collection === 'media' ? MEDIA_ITEMS : HIGHLIGHTS;
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
        <ImageList variant="masonry" cols={cols} gap={16}>
          {MEDIA_ITEMS.map((item, index) => (
            <ImageListItem key={item.src}>
              <Box
                component="img"
                src={`${item.src}?auto=format&fit=crop&w=600&q=80`}
                alt="Elite Clan"
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
      </Box>

      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Highlights
        </Typography>
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
          {HIGHLIGHTS.map((highlight, index) => (
            <Box
              key={highlight.title}
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
                src={highlight.thumbnail}
                alt={highlight.title}
                sx={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  objectFit: 'cover',
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {highlight.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {highlight.platform === 'instagram' ? 'Instagram Reel' : 'YouTube Clip'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
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
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<InstagramIcon />}
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ minWidth: 200 }}
          >
            Instagram
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<YouTubeIcon />}
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ minWidth: 200 }}
          >
            YouTube
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            startIcon={<MusicNoteIcon />}
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ minWidth: 200 }}
          >
            TikTok
          </Button>
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
                src={`${activeItem.src}?auto=format&fit=contain&w=1600&q=80`}
                alt="Media highlight"
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
                  src={activeItem.embedUrl}
                  title={activeItem.title}
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
                {activeItem.title}
              </Typography>
            )}
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

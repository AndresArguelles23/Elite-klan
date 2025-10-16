import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Alert,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RoomIcon from '@mui/icons-material/Room';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import 'dayjs/locale/es';
import { listShows } from '../services/contentRepository';
import type { Show, ShowStatus } from '../types/content';
import { useContentQuery } from '../hooks/useContentQuery';

dayjs.extend(durationPlugin);
dayjs.locale('es');

const STATUS_META: Record<ShowStatus, {
  label: string;
  chipColor: 'success' | 'warning';
  dotColor: 'success' | 'warning';
  icon: typeof CheckCircleIcon;
  buttonLabel: string;
  buttonColor: 'primary' | 'secondary';
}> = {
  tickets: {
    label: 'Boletas disponibles',
    chipColor: 'success',
    dotColor: 'success',
    icon: CheckCircleIcon,
    buttonLabel: 'Tickets',
    buttonColor: 'primary',
  },
  waitlist: {
    label: 'Lista de espera',
    chipColor: 'warning',
    dotColor: 'warning',
    icon: ScheduleIcon,
    buttonLabel: 'Join waitlist',
    buttonColor: 'secondary',
  },
};

function getShowDateTime(show: Show) {
  return dayjs(show.startAt);
}

function getCountdownLabel(show: Show) {
  const target = getShowDateTime(show);
  const diff = target.diff(dayjs());

  if (diff <= 0) {
    return '¡Estamos en vivo!';
  }

  const diffDuration = dayjs.duration(diff);
  const days = Math.floor(diffDuration.asDays());
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return parts.join(' ');
}

export function Shows() {
  const { data: shows, loading, error } = useContentQuery(listShows, []);

  const sortedShows = useMemo(() => {
    if (!shows) return [] as Show[];
    return [...shows].sort((a, b) => getShowDateTime(a).valueOf() - getShowDateTime(b).valueOf());
  }, [shows]);

  const nextShow = useMemo(() => {
    if (!sortedShows.length) {
      return null;
    }

    const now = dayjs();
    return (
      sortedShows.find((show) => getShowDateTime(show).isAfter(now)) ?? sortedShows[sortedShows.length - 1]
    );
  }, [sortedShows]);

  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!nextShow) {
      return undefined;
    }

    setCountdown(getCountdownLabel(nextShow));
    const interval = window.setInterval(() => {
      setCountdown(getCountdownLabel(nextShow));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [nextShow]);

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Próximos shows
      </Typography>

      {loading ? (
        <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" color="text.secondary">
            Cargando fechas...
          </Typography>
        </Stack>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          No pudimos cargar los shows. Intenta nuevamente más tarde.
        </Alert>
      ) : !sortedShows.length ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          Aún no hay shows programados. Vuelve pronto para descubrir nuevas fechas.
        </Alert>
      ) : null}

      {nextShow ? (
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 5,
            borderRadius: 4,
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Chip
                variant="outlined"
                icon={<RoomIcon />}
                label={`${nextShow.city} · ${nextShow.venue}`}
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: 'rgba(255, 255, 255, 0.16)',
                  color: 'inherit',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              />
              <Typography variant="h4" component="h2" color="inherit">
                Próximo show — {getShowDateTime(nextShow).format('D [de] MMMM YYYY')}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {getShowDateTime(nextShow).format('dddd · HH:mm')}
                {typeof nextShow.minAge === 'number' ? ` · +${nextShow.minAge}` : null}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'inherit' }}>
                  Comienza en {countdown}
                </Typography>
                {nextShow.ticketUrl ? (
                  <Button
                    variant="contained"
                    color={STATUS_META[nextShow.status].buttonColor}
                    href={nextShow.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {STATUS_META[nextShow.status].buttonLabel}
                  </Button>
                ) : null}
              </Stack>
            </Stack>
            {(nextShow.latitude ?? null) !== null && (nextShow.longitude ?? null) !== null ? (
              <Card
                elevation={0}
                sx={{
                  width: { xs: '100%', md: 340 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  component="iframe"
                  title={`Mapa de ${nextShow.venue}`}
                  src={`https://maps.google.com/maps?q=${nextShow.latitude},${nextShow.longitude}&z=15&output=embed`}
                  sx={{
                    width: '100%',
                    border: 0,
                    height: 220,
                  }}
                  allowFullScreen
                  loading="lazy"
                />
              </Card>
            ) : null}
          </Stack>
        </Paper>
      ) : null}

      {sortedShows.length ? (
        <Timeline position="right" sx={{ pl: 0 }}>
          {sortedShows.map((show, index) => {
            const status = STATUS_META[show.status];
            const Icon = status.icon;
            const showDateTime = getShowDateTime(show);
            const isNextShow = nextShow?.id === show.id;

            return (
              <TimelineItem key={show.id}>
                <TimelineSeparator>
                  <TimelineDot color={status.dotColor} variant={isNextShow ? 'filled' : 'outlined'}>
                    <Icon fontSize="small" />
                  </TimelineDot>
                  {index < sortedShows.length - 1 ? <TimelineConnector /> : null}
                </TimelineSeparator>
                <TimelineContent sx={{ py: 2 }}>
                  <Card variant={isNextShow ? 'elevation' : 'outlined'} sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                        <Typography variant="h6">
                          {show.city} — {show.venue}
                        </Typography>
                        <Chip label={status.label} color={status.chipColor} size="small" />
                      </Stack>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {showDateTime.format('dddd, D [de] MMMM YYYY · HH:mm')}
                        {typeof show.minAge === 'number' ? ` · +${show.minAge}` : null}
                      </Typography>
                      {show.ticketUrl ? (
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={2}
                          sx={{ mt: 2 }}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                        >
                          <Button
                            variant={isNextShow ? 'contained' : 'outlined'}
                            color={status.buttonColor}
                            href={show.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {status.buttonLabel}
                          </Button>
                        </Stack>
                      ) : null}
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      ) : null}
    </Box>
  );
}

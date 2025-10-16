import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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

dayjs.extend(durationPlugin);
dayjs.locale('es');

type ShowStatus = 'tickets' | 'waitlist';

type Show = {
  date: string;
  time: string;
  city: string;
  venue: string;
  status: ShowStatus;
  urlTickets: string;
  minAge: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

const SHOWS: Show[] = [
  {
    date: '2025-03-15',
    time: '21:00',
    city: 'Bogotá',
    venue: 'Teatro ABC',
    status: 'tickets',
    urlTickets: 'https://tickets.eliteklan.com/bogota',
    minAge: 18,
    coordinates: {
      lat: 4.651332,
      lng: -74.055503,
    },
  },
  {
    date: '2025-04-12',
    time: '20:30',
    city: 'Medellín',
    venue: 'Arena Norte',
    status: 'waitlist',
    urlTickets: 'https://tickets.eliteklan.com/medellin',
    minAge: 16,
    coordinates: {
      lat: 6.244203,
      lng: -75.581215,
    },
  },
  {
    date: '2025-05-24',
    time: '19:30',
    city: 'Cali',
    venue: 'Centro de Eventos Pacífico',
    status: 'tickets',
    urlTickets: 'https://tickets.eliteklan.com/cali',
    minAge: 18,
    coordinates: {
      lat: 3.423556,
      lng: -76.5205,
    },
  },
];

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
  return dayjs(`${show.date}T${show.time}`);
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
  const sortedShows = useMemo(
    () => [...SHOWS].sort((a, b) => getShowDateTime(a).valueOf() - getShowDateTime(b).valueOf()),
    [],
  );

  const nextShow = useMemo(() => {
    const now = dayjs();
    return (
      sortedShows.find((show) => getShowDateTime(show).isAfter(now)) ?? sortedShows[sortedShows.length - 1]
    );
  }, [sortedShows]);

  const [countdown, setCountdown] = useState(getCountdownLabel(nextShow));

  useEffect(() => {
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
              {getShowDateTime(nextShow).format('dddd · HH:mm')} · +{nextShow.minAge}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="h5" fontWeight={700} sx={{ color: 'inherit' }}>
                Comienza en {countdown}
              </Typography>
              <Button
                variant="contained"
                color={STATUS_META[nextShow.status].buttonColor}
                href={nextShow.urlTickets}
                target="_blank"
                rel="noopener noreferrer"
              >
                {STATUS_META[nextShow.status].buttonLabel}
              </Button>
            </Stack>
          </Stack>
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
              src={`https://maps.google.com/maps?q=${nextShow.coordinates.lat},${nextShow.coordinates.lng}&z=15&output=embed`}
              sx={{
                width: '100%',
                border: 0,
                height: 220,
              }}
              allowFullScreen
              loading="lazy"
            />
          </Card>
        </Stack>
      </Paper>

      <Timeline position="right" sx={{ pl: 0 }}>
        {sortedShows.map((show, index) => {
          const status = STATUS_META[show.status];
          const Icon = status.icon;
          const showDateTime = getShowDateTime(show);

          return (
            <TimelineItem key={`${show.date}-${show.city}`}>
              <TimelineSeparator>
                <TimelineDot color={status.dotColor} variant={show === nextShow ? 'filled' : 'outlined'}>
                  <Icon fontSize="small" />
                </TimelineDot>
                {index < sortedShows.length - 1 ? <TimelineConnector /> : null}
              </TimelineSeparator>
              <TimelineContent sx={{ py: 2 }}>
                <Card variant={show === nextShow ? 'elevation' : 'outlined'} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                      <Typography variant="h6">
                        {show.city} — {show.venue}
                      </Typography>
                      <Chip label={status.label} color={status.chipColor} size="small" />
                    </Stack>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {showDateTime.format('dddd, D [de] MMMM YYYY · HH:mm')} · +{show.minAge}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Button
                        variant={show === nextShow ? 'contained' : 'outlined'}
                        color={status.buttonColor}
                        href={show.urlTickets}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {status.buttonLabel}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
}

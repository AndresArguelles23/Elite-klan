import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { contentRepository } from '../../repositories/contentRepository';
import type {
  HeroRecord,
  MediaRecord,
  ReleaseRecord,
  ShowRecord,
} from '../../repositories/contentRepository';

type Feedback = {
  message: string;
  severity: 'success' | 'error';
};

type FeedbackHandler = (feedback: Feedback) => void;

type TabPanelProps = {
  children: ReactNode;
  value: number;
  index: number;
};

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function ShowsSection({ active, onFeedback }: { active: boolean; onFeedback: FeedbackHandler }) {
  const [shows, setShows] = useState<ShowRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState<ShowRecord | null>(null);
  const [initialized, setInitialized] = useState(false);

  const emptyShow: ShowRecord = useMemo(
    () => ({ name: '', city: '', venue: '', event_date: '', tickets_url: '', status: 'tickets' }),
    [],
  );

  const loadShows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentRepository.listShows();
      setShows(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible obtener los shows.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [onFeedback]);

  useEffect(() => {
    if (active && !initialized) {
      loadShows();
      setInitialized(true);
    }
  }, [active, initialized, loadShows]);

  const handleEdit = (show?: ShowRecord) => {
    setCurrent(show ?? emptyShow);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrent(null);
  };

  const handleSave = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const saved = await contentRepository.upsertShow(current);
      setShows((prev) => {
        const exists = prev.some((item) => item.id === saved.id);
        if (exists) {
          return prev.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...prev];
      });
      onFeedback({ message: 'Show guardado correctamente.', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible guardar el show.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (show: ShowRecord) => {
    if (!show.id) return;
    setSaving(true);
    try {
      await contentRepository.removeShow(show.id);
      setShows((prev) => prev.filter((item) => item.id !== show.id));
      onFeedback({ message: 'Show eliminado.', severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible eliminar el show.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }} id="shows">
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Shows
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona conciertos, ubicaciones y estado de tickets.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={loadShows} disabled={loading} aria-label="Recargar shows">
            {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleEdit()}>
            Nuevo show
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : shows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aún no hay shows registrados.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>Lugar</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shows.map((show) => (
                <TableRow key={show.id ?? `${show.name}-${show.event_date}`} hover>
                  <TableCell>{show.name}</TableCell>
                  <TableCell>{show.city}</TableCell>
                  <TableCell>{show.venue}</TableCell>
                  <TableCell>{show.event_date}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {show.tickets_url ?? '—'}
                      </Typography>
                      {show.status && (
                        <Chip
                          label={
                            show.status === 'tickets'
                              ? 'Disponible'
                              : show.status === 'waitlist'
                              ? 'Lista de espera'
                              : 'Agotado'
                          }
                          color={show.status === 'tickets' ? 'success' : show.status === 'waitlist' ? 'warning' : 'default'}
                          size="small"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <IconButton size="small" onClick={() => handleEdit(show)} aria-label="Editar show">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(show)}
                        aria-label="Eliminar show"
                        disabled={saving && current?.id === show.id}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{current?.id ? 'Editar show' : 'Nuevo show'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del show"
              value={current?.name ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyShow), name: event.target.value }))}
              required
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Ciudad"
                value={current?.city ?? ''}
                onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyShow), city: event.target.value }))}
                required
                fullWidth
              />
              <TextField
                label="Lugar"
                value={current?.venue ?? ''}
                onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyShow), venue: event.target.value }))}
                required
                fullWidth
              />
            </Stack>
            <TextField
              label="Fecha"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={current?.event_date ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyShow), event_date: event.target.value }))}
              required
            />
            <TextField
              label="URL de tickets"
              value={current?.tickets_url ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyShow), tickets_url: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Estado"
              select
              value={current?.status ?? 'tickets'}
              onChange={(event) =>
                setCurrent((prev) => ({ ...(prev ?? emptyShow), status: event.target.value as ShowRecord['status'] }))
              }
            >
              <MenuItem value="tickets">Boletas disponibles</MenuItem>
              <MenuItem value="waitlist">Lista de espera</MenuItem>
              <MenuItem value="sold_out">Agotado</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

function ReleasesSection({ active, onFeedback }: { active: boolean; onFeedback: FeedbackHandler }) {
  const [releases, setReleases] = useState<ReleaseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState<ReleaseRecord | null>(null);
  const [initialized, setInitialized] = useState(false);

  const emptyRelease: ReleaseRecord = useMemo(
    () => ({ title: '', release_date: '', cover_url: '', stream_url: '' }),
    [],
  );

  const loadReleases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentRepository.listReleases();
      setReleases(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible obtener los lanzamientos.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [onFeedback]);

  useEffect(() => {
    if (active && !initialized) {
      loadReleases();
      setInitialized(true);
    }
  }, [active, initialized, loadReleases]);

  const handleEdit = (release?: ReleaseRecord) => {
    setCurrent(release ?? emptyRelease);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrent(null);
  };

  const handleSave = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const saved = await contentRepository.upsertRelease(current);
      setReleases((prev) => {
        const exists = prev.some((item) => item.id === saved.id);
        if (exists) {
          return prev.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...prev];
      });
      onFeedback({ message: 'Lanzamiento guardado correctamente.', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible guardar el lanzamiento.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (release: ReleaseRecord) => {
    if (!release.id) return;
    setSaving(true);
    try {
      await contentRepository.removeRelease(release.id);
      setReleases((prev) => prev.filter((item) => item.id !== release.id));
      onFeedback({ message: 'Lanzamiento eliminado.', severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible eliminar el lanzamiento.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }} id="releases">
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Lanzamientos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mantén actualizada la discografía, portadas y enlaces.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={loadReleases} disabled={loading} aria-label="Recargar lanzamientos">
            {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleEdit()}>
            Nuevo lanzamiento
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : releases.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aún no hay lanzamientos registrados.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Portada</TableCell>
                <TableCell>Streaming</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {releases.map((release) => (
                <TableRow key={release.id ?? release.title} hover>
                  <TableCell>{release.title}</TableCell>
                  <TableCell>{release.release_date}</TableCell>
                  <TableCell>{release.cover_url ?? '—'}</TableCell>
                  <TableCell>{release.stream_url ?? '—'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <IconButton size="small" onClick={() => handleEdit(release)} aria-label="Editar lanzamiento">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(release)}
                        aria-label="Eliminar lanzamiento"
                        disabled={saving && current?.id === release.id}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{current?.id ? 'Editar lanzamiento' : 'Nuevo lanzamiento'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Título"
              value={current?.title ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyRelease), title: event.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Fecha de lanzamiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={current?.release_date ?? ''}
              onChange={(event) =>
                setCurrent((prev) => ({ ...(prev ?? emptyRelease), release_date: event.target.value }))
              }
              required
            />
            <TextField
              label="URL de portada"
              value={current?.cover_url ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyRelease), cover_url: event.target.value }))}
              fullWidth
            />
            <TextField
              label="URL de streaming"
              value={current?.stream_url ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyRelease), stream_url: event.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

function MediaSection({ active, onFeedback }: { active: boolean; onFeedback: FeedbackHandler }) {
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState<MediaRecord | null>(null);
  const [initialized, setInitialized] = useState(false);

  const emptyMedia: MediaRecord = useMemo(
    () => ({ title: '', media_type: 'video', url: '', description: '', thumbnail_url: '' }),
    [],
  );

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentRepository.listMedia();
      setMedia(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible obtener el contenido multimedia.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [onFeedback]);

  useEffect(() => {
    if (active && !initialized) {
      loadMedia();
      setInitialized(true);
    }
  }, [active, initialized, loadMedia]);

  const handleEdit = (item?: MediaRecord) => {
    setCurrent(item ?? emptyMedia);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrent(null);
  };

  const handleSave = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const saved = await contentRepository.upsertMedia(current);
      setMedia((prev) => {
        const exists = prev.some((item) => item.id === saved.id);
        if (exists) {
          return prev.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...prev];
      });
      onFeedback({ message: 'Elemento multimedia guardado.', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible guardar el elemento multimedia.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MediaRecord) => {
    if (!item.id) return;
    setSaving(true);
    try {
      await contentRepository.removeMedia(item.id);
      setMedia((prev) => prev.filter((mediaItem) => mediaItem.id !== item.id));
      onFeedback({ message: 'Elemento multimedia eliminado.', severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible eliminar el elemento multimedia.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }} id="media">
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Media
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona videos, fotografías y notas de prensa.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={loadMedia} disabled={loading} aria-label="Recargar media">
            {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleEdit()}>
            Nuevo elemento
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : media.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aún no hay contenido multimedia registrado.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {media.map((item) => (
                <TableRow key={item.id ?? item.title} hover>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        item.media_type === 'video'
                          ? 'Video'
                          : item.media_type === 'photo'
                          ? 'Foto'
                          : 'Prensa'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.url}</TableCell>
                  <TableCell>{item.description ?? '—'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <IconButton size="small" onClick={() => handleEdit(item)} aria-label="Editar media">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item)}
                        aria-label="Eliminar media"
                        disabled={saving && current?.id === item.id}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{current?.id ? 'Editar media' : 'Nuevo media'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Título"
              value={current?.title ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyMedia), title: event.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Tipo"
              select
              value={current?.media_type ?? 'video'}
              onChange={(event) =>
                setCurrent((prev) => ({ ...(prev ?? emptyMedia), media_type: event.target.value as MediaRecord['media_type'] }))
              }
            >
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="photo">Fotografía</MenuItem>
              <MenuItem value="press">Prensa</MenuItem>
            </TextField>
            <TextField
              label="URL"
              value={current?.url ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyMedia), url: event.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="URL miniatura"
              value={current?.thumbnail_url ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyMedia), thumbnail_url: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Descripción"
              value={current?.description ?? ''}
              onChange={(event) => setCurrent((prev) => ({ ...(prev ?? emptyMedia), description: event.target.value }))}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

function HeroSection({ active, onFeedback }: { active: boolean; onFeedback: FeedbackHandler }) {
  const [hero, setHero] = useState<HeroRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const defaultHero = useMemo<HeroRecord>(
    () => ({
      headline: '',
      subheadline: '',
      hero_image_url: '',
      primary_cta_label: '',
      primary_cta_url: '',
      epk_url: '',
    }),
    [],
  );

  const loadHero = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentRepository.getHero();
      setHero(data ?? defaultHero);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible obtener la información del hero.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [defaultHero, onFeedback]);

  useEffect(() => {
    if (active && !initialized) {
      loadHero();
      setInitialized(true);
    }
  }, [active, initialized, loadHero]);

  const handleChange = (key: Exclude<keyof HeroRecord, 'id'>, value: string) => {
    setHero((prev) => ({ ...(prev ?? defaultHero), [key]: value } as HeroRecord));
  };

  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);
    try {
      const saved = await contentRepository.upsertHero(hero);
      setHero(saved);
      onFeedback({ message: 'Hero actualizado correctamente.', severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible actualizar el hero.';
      onFeedback({ message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }} id="hero">
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Hero / EPK
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Controla el titular principal, CTA y enlaces de press kit.
          </Typography>
        </Box>
        <IconButton color="primary" onClick={loadHero} disabled={loading} aria-label="Recargar hero">
          {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
        </IconButton>
      </Stack>
      <Box sx={{ mt: 3 }}>
        {loading || !hero ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            <TextField
              label="Titular"
              value={hero.headline ?? ''}
              onChange={(event) => handleChange('headline', event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Bajada"
              value={hero.subheadline ?? ''}
              onChange={(event) => handleChange('subheadline', event.target.value)}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Texto CTA"
                value={hero.primary_cta_label ?? ''}
                onChange={(event) => handleChange('primary_cta_label', event.target.value)}
                fullWidth
              />
              <TextField
                label="URL CTA"
                value={hero.primary_cta_url ?? ''}
                onChange={(event) => handleChange('primary_cta_url', event.target.value)}
                fullWidth
              />
            </Stack>
            <TextField
              label="URL Hero"
              value={hero.hero_image_url ?? ''}
              onChange={(event) => handleChange('hero_image_url', event.target.value)}
              fullWidth
            />
            <TextField
              label="URL EPK"
              value={hero.epk_url ?? ''}
              onChange={(event) => handleChange('epk_url', event.target.value)}
              fullWidth
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={loadHero} startIcon={<RefreshIcon />} disabled={loading}>
                Restablecer
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Guardar cambios'}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}

export function Dashboard() {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' },
  );

  const handleFeedback: FeedbackHandler = useCallback((feedback) => {
    setSnackbar({ open: true, ...feedback });
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          Dashboard de contenido
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra toda la información que se muestra en la web pública.
        </Typography>
      </Stack>
      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        <Tabs
          value={tab}
          onChange={(_event, newValue) => setTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="secciones del dashboard"
          sx={{ px: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab label="Shows" />
          <Tab label="Lanzamientos" />
          <Tab label="Media" />
          <Tab label="Hero / EPK" />
        </Tabs>
      </Paper>
      <TabPanel value={tab} index={0}>
        <ShowsSection active={tab === 0} onFeedback={handleFeedback} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ReleasesSection active={tab === 1} onFeedback={handleFeedback} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <MediaSection active={tab === 2} onFeedback={handleFeedback} />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <HeroSection active={tab === 3} onFeedback={handleFeedback} />
      </TabPanel>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

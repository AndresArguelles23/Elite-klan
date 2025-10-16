import { supabase } from './supabaseClient';
import type {
  MediaItem,
  Release,
  Show,
  SiteSettings,
} from '../types/content';

const mapShow = (row: Record<string, any>): Show => ({
  id: row.id,
  startAt: row.start_at,
  city: row.city,
  venue: row.venue,
  status: row.status,
  ticketUrl: row.ticket_url ?? null,
  minAge: row.min_age ?? null,
  latitude: row.latitude ?? null,
  longitude: row.longitude ?? null,
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
});

const mapRelease = (row: Record<string, any>): Release => ({
  id: row.id,
  title: row.title,
  releaseDate: row.release_date,
  coverArtUrl: row.cover_art_url,
  description: row.description ?? null,
  genres: Array.isArray(row.genres) ? row.genres : [],
  links: {
    spotify: row.spotify_url ?? null,
    appleMusic: row.apple_music_url ?? null,
    youtube: row.youtube_url ?? null,
  },
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
});

const mapMediaItem = (row: Record<string, any>): MediaItem => ({
  id: row.id,
  type: row.type,
  title: row.title ?? null,
  description: row.description ?? null,
  mediaUrl: row.media_url,
  embedUrl: row.embed_url ?? null,
  thumbnailUrl: row.thumbnail_url ?? null,
  platform: row.platform ?? null,
  displayOrder: row.display_order ?? null,
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
});

const mapSiteSettings = (row: Record<string, any>): SiteSettings => ({
  id: row.id,
  heroTagline: row.hero_tagline ?? null,
  heroTitle: row.hero_title ?? null,
  heroDescription: row.hero_description ?? null,
  heroVideoUrl: row.hero_video_url ?? null,
  releaseDateLabel: row.release_date_label ?? null,
  playlistEmbedUrl: row.playlist_embed_url ?? null,
  socialLinks: row.social_links ?? {},
  epkGenre: row.epk_genre ?? null,
  epkCity: row.epk_city ?? null,
  epkBio: row.epk_bio ?? null,
  pressContact: row.press_contact ?? null,
  epkDownloads: Array.isArray(row.epk_downloads) ? row.epk_downloads : [],
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
});

const handleError = (error: { message?: string } | null | undefined) => {
  if (error) {
    throw new Error(error.message ?? 'Supabase request failed');
  }
};

// Shows CRUD
export const listShows = async (): Promise<Show[]> => {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .order('start_at', { ascending: true });

  handleError(error);

  return (data ?? []).map(mapShow);
};

export const getShow = async (id: number): Promise<Show | null> => {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  handleError(error);

  return data ? mapShow(data) : null;
};

export const createShow = async (
  payload: Omit<Show, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Show> => {
  const { data, error } = await supabase
    .from('shows')
    .insert({
      start_at: payload.startAt,
      city: payload.city,
      venue: payload.venue,
      status: payload.status,
      ticket_url: payload.ticketUrl,
      min_age: payload.minAge,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
    .select()
    .maybeSingle();

  handleError(error);

  if (!data) {
    throw new Error('Unable to create show');
  }

  return mapShow(data);
};

export const updateShow = async (
  id: number,
  payload: Partial<Omit<Show, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Show> => {
  const { data, error } = await supabase
    .from('shows')
    .update({
      start_at: payload.startAt,
      city: payload.city,
      venue: payload.venue,
      status: payload.status,
      ticket_url: payload.ticketUrl,
      min_age: payload.minAge,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  handleError(error);

  if (!data) {
    throw new Error(`Show with id ${id} was not updated`);
  }

  return mapShow(data);
};

export const deleteShow = async (id: number): Promise<void> => {
  const { error } = await supabase.from('shows').delete().eq('id', id);
  handleError(error);
};

// Releases CRUD
export const listReleases = async (): Promise<Release[]> => {
  const { data, error } = await supabase
    .from('releases')
    .select('*')
    .order('release_date', { ascending: false });

  handleError(error);

  return (data ?? []).map(mapRelease);
};

export const getRelease = async (id: number): Promise<Release | null> => {
  const { data, error } = await supabase
    .from('releases')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  handleError(error);

  return data ? mapRelease(data) : null;
};

export const createRelease = async (
  payload: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Release> => {
  const { data, error } = await supabase
    .from('releases')
    .insert({
      title: payload.title,
      release_date: payload.releaseDate,
      cover_art_url: payload.coverArtUrl,
      description: payload.description,
      genres: payload.genres,
      spotify_url: payload.links.spotify,
      apple_music_url: payload.links.appleMusic,
      youtube_url: payload.links.youtube,
    })
    .select()
    .maybeSingle();

  handleError(error);

  if (!data) {
    throw new Error('Unable to create release');
  }

  return mapRelease(data);
};

export const updateRelease = async (
  id: number,
  payload: Partial<Omit<Release, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Release> => {
  const { data, error } = await supabase
    .from('releases')
    .update({
      title: payload.title,
      release_date: payload.releaseDate,
      cover_art_url: payload.coverArtUrl,
      description: payload.description,
      genres: payload.genres,
      spotify_url: payload.links?.spotify,
      apple_music_url: payload.links?.appleMusic,
      youtube_url: payload.links?.youtube,
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  handleError(error);

  if (!data) {
    throw new Error(`Release with id ${id} was not updated`);
  }

  return mapRelease(data);
};

export const deleteRelease = async (id: number): Promise<void> => {
  const { error } = await supabase.from('releases').delete().eq('id', id);
  handleError(error);
};

// Media items CRUD
export const listMediaItems = async (): Promise<MediaItem[]> => {
  const { data, error } = await supabase
    .from('media_items')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  handleError(error);

  return (data ?? []).map(mapMediaItem);
};

export const getMediaItem = async (id: number): Promise<MediaItem | null> => {
  const { data, error } = await supabase
    .from('media_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  handleError(error);

  return data ? mapMediaItem(data) : null;
};

export const createMediaItem = async (
  payload: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<MediaItem> => {
  const { data, error } = await supabase
    .from('media_items')
    .insert({
      type: payload.type,
      title: payload.title,
      description: payload.description,
      media_url: payload.mediaUrl,
      embed_url: payload.embedUrl,
      thumbnail_url: payload.thumbnailUrl,
      platform: payload.platform,
      display_order: payload.displayOrder,
    })
    .select()
    .maybeSingle();

  handleError(error);

  if (!data) {
    throw new Error('Unable to create media item');
  }

  return mapMediaItem(data);
};

export const updateMediaItem = async (
  id: number,
  payload: Partial<Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<MediaItem> => {
  const { data, error } = await supabase
    .from('media_items')
    .update({
      type: payload.type,
      title: payload.title,
      description: payload.description,
      media_url: payload.mediaUrl,
      embed_url: payload.embedUrl,
      thumbnail_url: payload.thumbnailUrl,
      platform: payload.platform,
      display_order: payload.displayOrder,
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  handleError(error);

  if (!data) {
    throw new Error(`Media item with id ${id} was not updated`);
  }

  return mapMediaItem(data);
};

export const deleteMediaItem = async (id: number): Promise<void> => {
  const { error } = await supabase.from('media_items').delete().eq('id', id);
  handleError(error);
};

// Site settings CRUD
export const listSiteSettings = async (): Promise<SiteSettings[]> => {
  const { data, error } = await supabase.from('site_settings').select('*');
  handleError(error);
  return (data ?? []).map(mapSiteSettings);
};

export const getSiteSettings = async (id: number): Promise<SiteSettings | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  handleError(error);

  return data ? mapSiteSettings(data) : null;
};

export const createSiteSettings = async (
  payload: Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('site_settings')
    .insert({
      hero_tagline: payload.heroTagline,
      hero_title: payload.heroTitle,
      hero_description: payload.heroDescription,
      hero_video_url: payload.heroVideoUrl,
      release_date_label: payload.releaseDateLabel,
      playlist_embed_url: payload.playlistEmbedUrl,
      social_links: payload.socialLinks,
      epk_genre: payload.epkGenre,
      epk_city: payload.epkCity,
      epk_bio: payload.epkBio,
      press_contact: payload.pressContact,
      epk_downloads: payload.epkDownloads,
    })
    .select()
    .maybeSingle();

  handleError(error);

  if (!data) {
    throw new Error('Unable to create site settings');
  }

  return mapSiteSettings(data);
};

export const updateSiteSettings = async (
  id: number,
  payload: Partial<Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      hero_tagline: payload.heroTagline,
      hero_title: payload.heroTitle,
      hero_description: payload.heroDescription,
      hero_video_url: payload.heroVideoUrl,
      release_date_label: payload.releaseDateLabel,
      playlist_embed_url: payload.playlistEmbedUrl,
      social_links: payload.socialLinks,
      epk_genre: payload.epkGenre,
      epk_city: payload.epkCity,
      epk_bio: payload.epkBio,
      press_contact: payload.pressContact,
      epk_downloads: payload.epkDownloads,
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  handleError(error);

  if (!data) {
    throw new Error(`Site settings with id ${id} were not updated`);
  }

  return mapSiteSettings(data);
};

export const deleteSiteSettings = async (id: number): Promise<void> => {
  const { error } = await supabase.from('site_settings').delete().eq('id', id);
  handleError(error);
};

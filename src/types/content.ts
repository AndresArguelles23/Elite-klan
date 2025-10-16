export type ShowStatus = 'tickets' | 'waitlist';

export type Show = {
  id: number;
  startAt: string;
  city: string;
  venue: string;
  status: ShowStatus;
  ticketUrl: string | null;
  minAge: number | null;
  latitude: number | null;
  longitude: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ReleaseLinkSet = {
  spotify?: string | null;
  appleMusic?: string | null;
  youtube?: string | null;
};

export type Release = {
  id: number;
  title: string;
  releaseDate: string;
  coverArtUrl: string;
  description: string | null;
  genres: string[];
  links: ReleaseLinkSet;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type MediaItemType = 'image' | 'video';

export type MediaItem = {
  id: number;
  type: MediaItemType;
  title: string | null;
  description: string | null;
  mediaUrl: string;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'spotify' | 'other' | null;
  displayOrder: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type SocialLinks = {
  instagram?: string | null;
  facebook?: string | null;
  x?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  spotify?: string | null;
};

export type EpkDownload = {
  label: string;
  url: string;
};

export type SiteSettings = {
  id: number;
  heroTagline: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  heroVideoUrl: string | null;
  releaseDateLabel: string | null;
  playlistEmbedUrl: string | null;
  socialLinks: SocialLinks;
  epkGenre: string | null;
  epkCity: string | null;
  epkBio: string | null;
  pressContact: string | null;
  epkDownloads: EpkDownload[];
  createdAt?: string | null;
  updatedAt?: string | null;
};

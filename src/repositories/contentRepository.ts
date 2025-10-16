import { supabase } from '../lib/supabaseClient';

export type Identifier = number | string;

export type ShowRecord = {
  id?: Identifier;
  name: string;
  city: string;
  venue: string;
  event_date: string;
  tickets_url?: string;
  status?: 'tickets' | 'sold_out' | 'waitlist';
};

export type ReleaseRecord = {
  id?: Identifier;
  title: string;
  release_date: string;
  cover_url?: string;
  stream_url?: string;
};

export type MediaRecord = {
  id?: Identifier;
  title: string;
  media_type: 'video' | 'photo' | 'press';
  url: string;
  description?: string;
  thumbnail_url?: string;
};

export type HeroRecord = {
  id?: Identifier;
  headline: string;
  subheadline?: string;
  hero_image_url?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  epk_url?: string;
};

export const contentRepository = {
  async listShows(): Promise<ShowRecord[]> {
    const { data, error } = await supabase.from('shows').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data ?? [];
  },
  async upsertShow(payload: ShowRecord): Promise<ShowRecord> {
    const { data, error } = await supabase
      .from('shows')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('No se recibieron datos de Supabase.');
    }
    return data;
  },
  async removeShow(id: Identifier) {
    const { error } = await supabase.from('shows').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  },
  async listReleases(): Promise<ReleaseRecord[]> {
    const { data, error } = await supabase.from('releases').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data ?? [];
  },
  async upsertRelease(payload: ReleaseRecord): Promise<ReleaseRecord> {
    const { data, error } = await supabase
      .from('releases')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('No se recibieron datos de Supabase.');
    }
    return data;
  },
  async removeRelease(id: Identifier) {
    const { error } = await supabase.from('releases').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  },
  async listMedia(): Promise<MediaRecord[]> {
    const { data, error } = await supabase.from('media').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data ?? [];
  },
  async upsertMedia(payload: MediaRecord): Promise<MediaRecord> {
    const { data, error } = await supabase
      .from('media')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('No se recibieron datos de Supabase.');
    }
    return data;
  },
  async removeMedia(id: Identifier) {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  },
  async getHero(): Promise<HeroRecord | null> {
    const { data, error } = await supabase.from('hero').select('*').limit(1).maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    return data ?? null;
  },
  async upsertHero(payload: HeroRecord): Promise<HeroRecord> {
    const { data, error } = await supabase
      .from('hero')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('No se recibieron datos de Supabase.');
    }
    return data;
  },
};

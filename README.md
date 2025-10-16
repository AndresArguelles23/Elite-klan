# Elite Clan — Frontend

Aplicación React construida con Vite y TypeScript para el sitio oficial de Elite Clan. La app consume el contenido desde Supabase y muestra shows, lanzamientos, media y el press kit en tiempo real.

## Requisitos previos

- Node.js 20+
- npm 10+
- Proyecto en [Supabase](https://supabase.com/) con la base de datos configurada.

## Configuración rápida

1. Clona el repositorio y navega al directorio del proyecto.
2. Copia `.env` con tus credenciales de Supabase:

   ```bash
   cp .env.example .env # crea el archivo si aún no existe
   ```

   Completa los valores:

   ```env
   VITE_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
   VITE_SUPABASE_ANON_KEY="<tu-anon-key>"
   ```

3. Instala dependencias y levanta el entorno local:

   ```bash
   npm install
   npm run dev
   ```

## Esquema de Supabase

Ejecuta las siguientes migraciones en tu proyecto de Supabase. Puedes usar el panel SQL o el CLI (`supabase migration new`).

```sql
-- Shows
create table if not exists public.shows (
  id bigint generated always as identity primary key,
  start_at timestamptz not null,
  city text not null,
  venue text not null,
  status text not null check (status in ('tickets', 'waitlist')),
  ticket_url text,
  min_age integer,
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Releases
create table if not exists public.releases (
  id bigint generated always as identity primary key,
  title text not null,
  release_date date not null,
  cover_art_url text not null,
  description text,
  genres text[] default array[]::text[],
  spotify_url text,
  apple_music_url text,
  youtube_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media
create table if not exists public.media_items (
  id bigint generated always as identity primary key,
  type text not null check (type in ('image', 'video')),
  title text,
  description text,
  media_url text not null,
  embed_url text,
  thumbnail_url text,
  platform text,
  display_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site settings
create table if not exists public.site_settings (
  id bigint generated always as identity primary key,
  hero_tagline text,
  hero_title text,
  hero_description text,
  hero_video_url text,
  release_date_label text,
  playlist_embed_url text,
  social_links jsonb not null default '{}'::jsonb,
  epk_genre text,
  epk_city text,
  epk_bio text,
  press_contact text,
  epk_downloads jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger shows_updated_at
  before update on public.shows
  for each row execute procedure public.touch_updated_at();

create trigger releases_updated_at
  before update on public.releases
  for each row execute procedure public.touch_updated_at();

create trigger media_items_updated_at
  before update on public.media_items
  for each row execute procedure public.touch_updated_at();

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute procedure public.touch_updated_at();
```

Habilita RLS si tu proyecto lo requiere y crea las políticas adecuadas para acceso público en lectura.

## Seeds de ejemplo

Ejecuta estas inserciones para poblar la base de datos con contenido inicial:

```sql
insert into public.site_settings (hero_tagline, hero_title, hero_description, hero_video_url, release_date_label, playlist_embed_url, social_links, epk_genre, epk_city, epk_bio, press_contact, epk_downloads)
values (
  'Nuevo single',
  'Sonido Elite. Energía en vivo.',
  'Elite Clan fusiona ritmos urbanos y latinos con atmósferas futuristas. Dale play al lanzamiento y siente la vibra antes del tour.',
  'https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4',
  '15 de marzo, 2025',
  'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUsuxWHRQd?utm_source=generator&theme=0',
  jsonb_build_object(
    'instagram', 'https://instagram.com/eliteclan',
    'facebook', 'https://facebook.com/eliteclan',
    'x', 'https://x.com/eliteclan',
    'youtube', 'https://youtube.com/@eliteclan',
    'tiktok', 'https://www.tiktok.com/@eliteclan'
  ),
  'Urbano / Latino',
  'Barranquilla',
  'Elite Clan mezcla ritmos urbanos con energía latina para shows explosivos y un sonido propio.',
  'booking@eliteclan.com — +57 300 000 0000',
  jsonb_build_array(
    jsonb_build_object('label', 'Fotos HD (ZIP)', 'url', 'https://cdn.example.com/epk/fotos.zip'),
    jsonb_build_object('label', 'Logo (SVG)', 'url', 'https://cdn.example.com/epk/logo.svg'),
    jsonb_build_object('label', 'Rider técnico (PDF)', 'url', 'https://cdn.example.com/epk/rider.pdf'),
    jsonb_build_object('label', 'Stage plot (PDF)', 'url', 'https://cdn.example.com/epk/stage-plot.pdf')
  )
) on conflict do nothing;

insert into public.releases (title, release_date, cover_art_url, description, genres, spotify_url, apple_music_url, youtube_url)
values
  ('Neon Skyline', '2024-05-17', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 'Un himno synthwave que combina melodías nostálgicas con un bajo contundente para las noches más largas.', array['Synthwave','Electronic','Midtempo'], 'https://open.spotify.com/track/1zcJH7zVhk2PzvgXDpPT8f', 'https://music.apple.com/album/neon-skyline-single/1440881047', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  ('Digital Mirage', '2023-11-03', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80', 'Texturas vaporwave y ritmos nostálgicos que se fusionan con percusiones modernas para crear una atmósfera única.', array['Vaporwave','Downtempo'], 'https://open.spotify.com/track/6DCZcSspjsKoFjzjrWoCdn', 'https://music.apple.com/album/digital-mirage-single/1573565310', 'https://www.youtube.com/watch?v=u9Mv98Gr5pY'),
  ('Electric Dreams', '2023-04-28', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80', 'Una colaboración con vocalistas invitados que explora paisajes sonoros oníricos y ritmos energéticos.', array['Synthpop','Dance'], 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b', 'https://music.apple.com/album/electric-dreams/1440833086', 'https://www.youtube.com/watch?v=QzcvRDWgRIE')
  on conflict do nothing;

insert into public.shows (start_at, city, venue, status, ticket_url, min_age, latitude, longitude)
values
  ('2025-03-15T21:00:00Z', 'Bogotá', 'Teatro ABC', 'tickets', 'https://tickets.eliteklan.com/bogota', 18, 4.651332, -74.055503),
  ('2025-04-12T20:30:00Z', 'Medellín', 'Arena Norte', 'waitlist', 'https://tickets.eliteklan.com/medellin', 16, 6.244203, -75.581215),
  ('2025-05-24T19:30:00Z', 'Cali', 'Centro de Eventos Pacífico', 'tickets', 'https://tickets.eliteklan.com/cali', 18, 3.423556, -76.5205)
  on conflict do nothing;

insert into public.media_items (type, title, description, media_url, embed_url, thumbnail_url, platform, display_order)
values
  ('image', 'Backstage 1', null, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d', null, null, null, 1),
  ('image', 'Backstage 2', null, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', null, null, null, 2),
  ('image', 'Backstage 3', null, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81', null, null, null, 3),
  ('video', 'Mix Showcase (YouTube)', null, 'https://www.youtube.com/watch?v=2Vv-BfVoq4g', 'https://www.youtube.com/embed/2Vv-BfVoq4g', 'https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg', 'youtube', 4),
  ('video', 'Highlights en Vivo', null, 'https://www.youtube.com/watch?v=CevxZvSJLk8', 'https://www.youtube.com/embed/CevxZvSJLk8', 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg', 'youtube', 5),
  ('video', 'Reel detrás de cámaras', null, 'https://www.instagram.com/reel/Cw3uK3lS6xP/', 'https://www.instagram.com/reel/Cw3uK3lS6xP/embed', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=60', 'instagram', 6)
  on conflict do nothing;
```

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: compila la aplicación para producción.
- `npm run preview`: sirve la build generada localmente.
- `npm run lint`: ejecuta las reglas de ESLint.

## Notas adicionales

- Los componentes consumen datos mediante `@supabase/supabase-js`. Asegúrate de mantener tu clave pública protegida y limitar las políticas de lectura/escritura según tus necesidades.
- Los hooks de contenido (`useContentQuery`) muestran estados de carga y error utilizando componentes de MUI para mejorar la DX.

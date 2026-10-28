-- Ejecuta en Supabase SQL Editor.
create table if not exists public.opinions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  organization_id uuid,
  kind text not null check (kind in ('digital','physical')),
  target text not null default '',
  target_url text,
  score smallint not null check (score between 1 and 5),
  intensity smallint not null check (intensity between 1 and 3),
  comment text not null default '',
  summary text not null default '',
  keywords text[] not null default '{}',
  -- No guardar coordenadas precisas del usuario por defecto.
  location_cell text,
  created_at timestamptz not null default now()
);
alter table public.opinions enable row level security;
-- Política inicial: cada usuario solo puede leer sus propias opiniones.
create policy "read own opinions" on public.opinions for select
  using (auth.uid() = user_id);
create policy "insert own opinions" on public.opinions for insert
  with check (auth.uid() = user_id);
create policy "delete own opinions" on public.opinions for delete
  using (auth.uid() = user_id);
-- No crees políticas públicas de lectura. Para paneles agregados, usa una API
-- de servidor que compruebe permisos y oculte grupos pequeños de usuarios.

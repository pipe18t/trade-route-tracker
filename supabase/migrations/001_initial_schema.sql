-- ============================================
-- Trade Route Tracker - Initial Schema
-- ============================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'practicante' check (role in ('admin', 'supervisor', 'ejecutivo', 'practicante')),
  created_at timestamp with time zone default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'practicante');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ZONES
-- ============================================
create table if not exists public.zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Seed zones (skip if already exist)
insert into public.zones (name, region)
select name, region
from (values
  ('Providencia / Manuel Montt / Bilbao', 'RM'),
  ('Ñuñoa / Plaza Ñuñoa', 'RM'),
  ('La Reina / Larraín', 'RM'),
  ('Las Condes / Vitacura', 'RM'),
  ('Santiago Centro / Bellavista', 'RM'),
  ('Otras comunas RM', 'RM'),
  ('Viña del Mar', 'V'),
  ('Valparaíso', 'V'),
  ('Reñaca / Concón', 'V'),
  ('Quilpué / Villa Alemana', 'V'),
  ('Interior / pendientes', 'V')
) as t(name, region)
where not exists (select 1 from public.zones where zones.name = t.name);

-- ============================================
-- CLIENTS
-- ============================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  region text,
  comuna text,
  zone_id uuid references public.zones(id) on delete set null,
  executive text,
  visit_day text,
  dispatch_day text,
  priority text default 'media' check (priority in ('alta', 'media', 'baja')),
  status text default 'pendiente' check (status in ('pendiente', 'visitado', 'seguimiento', 'no_atendido', 'coordinar_hora', 'administrador_no_disponible')),
  google_maps_url text,
  general_notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- VISITS
-- ============================================
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  visit_date date not null,
  visit_time time,
  contact_name text,
  contact_role text,
  could_talk boolean,
  no_contact_reason text,
  total_taps integer,
  kross_taps integer,
  best_selling_brand text,
  kross_price integer,
  competitor_price integer,
  kross_on_menu text,
  menu_execution text,
  pop_material text[],
  competitors text[],
  most_visible_competitor text,
  recommended_brand_by_staff text,
  competitor_notes text,
  opportunity_type text[],
  next_action text,
  follow_up_date date,
  follow_up_priority text check (follow_up_priority in ('alta', 'media', 'baja')),
  general_notes text,
  final_status text check (final_status in ('visitado', 'seguimiento', 'no_atendido', 'coordinar_hora', 'administrador_no_disponible')),
  created_at timestamp with time zone default now()
);

-- ============================================
-- VISIT PHOTOS
-- ============================================
create table if not exists public.visit_photos (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references public.visits(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  photo_url text not null,
  photo_type text check (photo_type in ('fachada', 'barra', 'carta', 'material_pop', 'competencia', 'salidas_cerveza', 'otro')),
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROUTES
-- ============================================
create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  region text,
  zone_id uuid references public.zones(id) on delete set null,
  route_date date,
  status text default 'planificada' check (status in ('planificada', 'en_progreso', 'completada', 'cancelada')),
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROUTE CLIENTS (join table)
-- ============================================
create table if not exists public.route_clients (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references public.routes(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  position integer,
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Drop all existing policies to make migration idempotent
do $$
declare
  pol record;
begin
  for pol in select policyname, tablename from pg_policies where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end;
$$;

-- Profiles: users can read all but only update their own
alter table public.profiles enable row level security;
create policy "Users can view all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Zones
alter table public.zones enable row level security;
create policy "Users can read zones" on public.zones for select using (true);
create policy "Users can insert zones" on public.zones for insert with check (auth.uid() is not null);
create policy "Users can update zones" on public.zones for update using (auth.uid() is not null);
create policy "Users can delete zones" on public.zones for delete using (auth.uid() is not null);

-- Clients
alter table public.clients enable row level security;
create policy "Users can read clients" on public.clients for select using (true);
create policy "Users can insert clients" on public.clients for insert with check (auth.uid() is not null);
create policy "Users can update clients" on public.clients for update using (auth.uid() is not null);
create policy "Users can delete clients" on public.clients for delete using (auth.uid() is not null);

-- Visits
alter table public.visits enable row level security;
create policy "Users can read visits" on public.visits for select using (true);
create policy "Users can insert own visits" on public.visits for insert with check (auth.uid() = user_id);
create policy "Users can update own visits" on public.visits for update using (auth.uid() = user_id);
create policy "Users can delete own visits" on public.visits for delete using (auth.uid() = user_id);

-- Visit photos
alter table public.visit_photos enable row level security;
create policy "Users can read photos" on public.visit_photos for select using (true);
create policy "Users can insert own visit photos" on public.visit_photos for insert with check (
  auth.uid() is not null and
  exists (select 1 from public.visits where visits.id = visit_photos.visit_id and visits.user_id = auth.uid())
);
create policy "Users can delete own visit photos" on public.visit_photos for delete using (
  exists (select 1 from public.visits where visits.id = visit_photos.visit_id and visits.user_id = auth.uid())
);

-- Routes
alter table public.routes enable row level security;
create policy "Users can read routes" on public.routes for select using (true);
create policy "Users can insert own routes" on public.routes for insert with check (auth.uid() = user_id);
create policy "Users can update own routes" on public.routes for update using (auth.uid() = user_id);
create policy "Users can delete own routes" on public.routes for delete using (auth.uid() = user_id);

-- Route clients
alter table public.route_clients enable row level security;
create policy "Users can read route_clients" on public.route_clients for select using (true);
create policy "Users can insert route_clients" on public.route_clients for insert with check (
  exists (select 1 from public.routes where routes.id = route_clients.route_id and routes.user_id = auth.uid())
);
create policy "Users can delete own route_clients" on public.route_clients for delete using (
  exists (select 1 from public.routes where routes.id = route_clients.route_id and routes.user_id = auth.uid())
);

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Bucket created via Management API. Run policies below:

-- Storage policies (idempotent)
do $$
declare
  spol record;
begin
  for spol in select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects'
  loop
    execute format('drop policy if exists %I on storage.objects', spol.policyname);
  end loop;
end;
$$;

create policy "Public can view visit photos" on storage.objects for select using (bucket_id = 'visit-photos');
create policy "Authenticated users can upload visit photos" on storage.objects for insert with check (bucket_id = 'visit-photos' and auth.role() = 'authenticated');
create policy "Users can delete own visit photos" on storage.objects for delete using (bucket_id = 'visit-photos' and auth.uid() = owner);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_clients_zone_id on public.clients(zone_id);
create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_clients_region on public.clients(region);
create index if not exists idx_visits_client_id on public.visits(client_id);
create index if not exists idx_visits_user_id on public.visits(user_id);
create index if not exists idx_visits_visit_date on public.visits(visit_date);
create index if not exists idx_visit_photos_visit_id on public.visit_photos(visit_id);
create index if not exists idx_routes_user_id on public.routes(user_id);
create index if not exists idx_route_clients_route_id on public.route_clients(route_id);

-- ============================================
-- TRIGGER: auto-update clients.updated_at
-- ============================================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger update_clients_updated_at
  before update on public.clients
  for each row execute function public.update_updated_at_column();

-- ============================================
-- TRIGGER: update client status when visit is created/updated
-- ============================================
create or replace function public.update_client_status_from_visit()
returns trigger
language plpgsql
as $$
begin
  if new.final_status is not null then
    update public.clients set status = new.final_status where id = new.client_id;
  end if;
  return new;
end;
$$;

create or replace trigger update_client_status_after_visit
  after insert or update of final_status on public.visits
  for each row execute function public.update_client_status_from_visit();

-- ============================================
-- GRANTS — ensure authenticated role has access
-- ============================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;
alter default privileges in schema public grant all on routines to anon, authenticated;

-- Create services table for providers to offer services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  duration_minutes integer not null,
  price decimal(10, 2) not null,
  location text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.services enable row level security;

-- Policies for services table
create policy "Anyone can view active services"
  on public.services for select
  using (is_active = true);

create policy "Providers can view their own services"
  on public.services for select
  using (auth.uid() = provider_id);

create policy "Providers can insert their own services"
  on public.services for insert
  with check (auth.uid() = provider_id);

create policy "Providers can update their own services"
  on public.services for update
  using (auth.uid() = provider_id);

create policy "Providers can delete their own services"
  on public.services for delete
  using (auth.uid() = provider_id);

-- Create updated_at trigger
create trigger set_updated_at
  before update on public.services
  for each row
  execute function public.handle_updated_at();

-- Create index for faster queries
create index services_provider_id_idx on public.services(provider_id);
create index services_category_idx on public.services(category);

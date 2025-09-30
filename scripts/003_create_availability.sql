-- Create availability table for provider time slots
create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  is_booked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_time_range check (end_time > start_time)
);

-- Enable Row Level Security
alter table public.availability enable row level security;

-- Policies for availability table
create policy "Anyone can view available slots"
  on public.availability for select
  using (true);

create policy "Providers can insert their own availability"
  on public.availability for insert
  with check (auth.uid() = provider_id);

create policy "Providers can update their own availability"
  on public.availability for update
  using (auth.uid() = provider_id);

create policy "Providers can delete their own availability"
  on public.availability for delete
  using (auth.uid() = provider_id);

-- Create updated_at trigger
create trigger set_updated_at
  before update on public.availability
  for each row
  execute function public.handle_updated_at();

-- Create indexes for faster queries
create index availability_service_id_idx on public.availability(service_id);
create index availability_provider_id_idx on public.availability(provider_id);
create index availability_date_idx on public.availability(date);

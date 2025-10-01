-- Create favorites table for user wishlists
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
-- alter table public.favorites enable row level security; -- Temporarily disabled for testing

-- Policies for favorites table
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own favorites"
  on public.favorites for update
  using (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate favorites
alter table public.favorites add constraint unique_user_service_favorite unique (user_id, service_id);

-- Create indexes for faster queries
create index favorites_user_id_idx on public.favorites(user_id);
create index favorites_service_id_idx on public.favorites(service_id);
-- Create reviews table for user feedback on services and providers
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.reviews enable row level security;

-- Policies for reviews table
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Users can insert their own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger set_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at();

-- Create indexes for faster queries
create index reviews_service_id_idx on public.reviews(service_id);
create index reviews_provider_id_idx on public.reviews(provider_id);
create index reviews_user_id_idx on public.reviews(user_id);
create index reviews_rating_idx on public.reviews(rating);
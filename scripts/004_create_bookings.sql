-- Create bookings table for user reservations
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  availability_id uuid not null references public.availability(id) on delete cascade,
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  total_price decimal(10, 2) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.bookings enable row level security;

-- Policies for bookings table
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Providers can view bookings for their services"
  on public.bookings for select
  using (auth.uid() = provider_id);

create policy "Users can insert their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Providers can update bookings for their services"
  on public.bookings for update
  using (auth.uid() = provider_id);

-- Create updated_at trigger
create trigger set_updated_at
  before update on public.bookings
  for each row
  execute function public.handle_updated_at();

-- Create indexes for faster queries
create index bookings_user_id_idx on public.bookings(user_id);
create index bookings_service_id_idx on public.bookings(service_id);
create index bookings_provider_id_idx on public.bookings(provider_id);
create index bookings_status_idx on public.bookings(status);
create index bookings_booking_date_idx on public.bookings(booking_date);

-- Create function to automatically mark availability as booked
create or replace function public.mark_availability_booked()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.availability
  set is_booked = true
  where id = new.availability_id;
  return new;
end;
$$;

create trigger on_booking_created
  after insert on public.bookings
  for each row
  execute function public.mark_availability_booked();

-- Create function to unmark availability when booking is cancelled
create or replace function public.unmark_availability_on_cancel()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status = 'cancelled' and old.status != 'cancelled' then
    update public.availability
    set is_booked = false
    where id = new.availability_id;
  end if;
  return new;
end;
$$;

create trigger on_booking_cancelled
  after update on public.bookings
  for each row
  execute function public.unmark_availability_on_cancel();

-- Create notifications table for user alerts and updates
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('booking_request', 'booking_confirmed', 'booking_cancelled', 'booking_completed', 'review_received', 'payment_received', 'reminder')),
  title text not null,
  message text not null,
  related_id uuid, -- Can reference booking, service, etc.
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.notifications enable row level security;

-- Policies for notifications table
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Create indexes for faster queries
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_type_idx on public.notifications(type);
create index notifications_read_idx on public.notifications(read);
create index notifications_created_at_idx on public.notifications(created_at desc);
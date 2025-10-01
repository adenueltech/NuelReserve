-- Create messages table for user-to-provider communication
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Policies for messages table
create policy "Users can view messages they sent or received"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert messages they send"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can update messages they received (mark as read)"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- Create indexes for faster queries
create index messages_sender_id_idx on public.messages(sender_id);
create index messages_receiver_id_idx on public.messages(receiver_id);
create index messages_booking_id_idx on public.messages(booking_id);
create index messages_created_at_idx on public.messages(created_at desc);

-- Create function to mark messages as read when booking is completed
create or replace function public.mark_messages_read_on_booking_complete()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    update public.messages
    set read = true
    where booking_id = new.id and receiver_id = new.user_id;
  end if;
  return new;
end;
$$;

create trigger on_booking_completed_mark_messages_read
  after update on public.bookings
  for each row
  execute function public.mark_messages_read_on_booking_complete();
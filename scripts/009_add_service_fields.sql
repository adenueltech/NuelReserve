-- Add currency and duration_unit fields to services table
alter table public.services
add column if not exists currency text default 'USD',
add column if not exists duration_unit text default 'minutes';

-- Update existing records to have proper defaults
update public.services
set currency = 'USD', duration_unit = 'minutes'
where currency is null or duration_unit is null;

-- Add check constraints
alter table public.services
add constraint valid_currency check (currency in ('USD')),
add constraint valid_duration_unit check (duration_unit in ('minutes', 'hours'));
create type extra_type as enum ('CHECKBOX', 'QUANTITY', 'TOGGLE_WITH_QUANTITY');

create table public.extras (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  type extra_type not null,
  category text not null,
  price numeric,  -- For simple checkbox extras
  price_per_unit numeric,  -- For quantity-based extras
  min_quantity integer,  -- For quantity-based extras
  max_quantity integer,  -- For quantity-based extras
  options jsonb,  -- For toggle_with_quantity type (e.g., chairs vs benches)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.extras enable row level security;

-- Create policies
create policy "Allow anonymous read access" 
  on public.extras for select 
  using (true);

create policy "Allow authenticated insert access" 
  on public.extras for insert 
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update access" 
  on public.extras for update 
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete access" 
  on public.extras for delete 
  using (auth.role() = 'authenticated'); 
create table public.enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  event_type text not null,
  telephone text not null,
  comments text,
  send_brochure boolean default false,
  event_date date not null,
  venue_location text,
  total_guests integer,
  formal_dining_seats integer,
  selected_products jsonb,
  selected_extras jsonb,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.enquiries enable row level security;

-- Create policies
create policy "Allow anonymous insert access" 
  on public.enquiries for insert 
  to anon
  with check (true);

create policy "Allow authenticated read access" 
  on public.enquiries for select 
  to authenticated
  using (true);

create policy "Allow authenticated update access" 
  on public.enquiries for update 
  to authenticated
  using (true);

create policy "Allow authenticated delete access" 
  on public.enquiries for delete 
  to authenticated
  using (true); 
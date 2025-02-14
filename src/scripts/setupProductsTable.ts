import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hdrfxmpssteinlribsob.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcmZ4bXBzc3RlaW5scmlic29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMTE3NDksImV4cCI6MjA1NDU4Nzc0OX0.ehi7xWmW56MJOK1P9wCW3v7kyVbnhAYeUosexlgd5kU'
);

// This is just to verify the table exists and has the right structure
async function setupProductsTable() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error accessing products table:', error.message);
    console.log('Please create a products table in Supabase with the following SQL:');
    console.log(`
      create table public.products (
        id uuid default gen_random_uuid() primary key,
        name text not null,
        description text,
        price numeric not null,
        size text,
        type text not null,
        image_url text,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
      );

      -- Enable Row Level Security (RLS)
      alter table public.products enable row level security;

      -- Create policies
      create policy "Allow anonymous read access" 
        on public.products for select 
        using (true);

      create policy "Allow authenticated insert access" 
        on public.products for insert 
        with check (auth.role() = 'authenticated');

      create policy "Allow authenticated update access" 
        on public.products for update 
        using (auth.role() = 'authenticated');

      create policy "Allow authenticated delete access" 
        on public.products for delete 
        using (auth.role() = 'authenticated');
    `);
    return;
  }

  console.log('Products table exists and is accessible');
  console.log('Current data:', data);
}

setupProductsTable(); 
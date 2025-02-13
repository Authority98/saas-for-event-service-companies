-- Create a new storage bucket for tent images
insert into storage.buckets (id, name, public)
values ('tents', 'tents', true);

-- Allow public access to read tent images
create policy "Allow public read access"
on storage.objects for select
using (bucket_id = 'tents');

-- Allow authenticated users to upload tent images
create policy "Allow authenticated users to upload tent images"
on storage.objects for insert
with check (
  bucket_id = 'tents' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update tent images
create policy "Allow authenticated users to update tent images"
on storage.objects for update
using (
  bucket_id = 'tents'
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to delete tent images
create policy "Allow authenticated users to delete tent images"
on storage.objects for delete
using (
  bucket_id = 'tents'
  and auth.role() = 'authenticated'
); 
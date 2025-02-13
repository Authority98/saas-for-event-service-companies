-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for all users" ON public.enquiries;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.enquiries;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.enquiries;

-- Enable RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone (including unauthenticated users) to insert enquiries
CREATE POLICY "Enable insert for everyone" ON public.enquiries 
FOR INSERT 
TO public
WITH CHECK (true);

-- Only allow authenticated users to view enquiries
CREATE POLICY "Enable read access for authenticated users only" ON public.enquiries 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Only allow authenticated users to update enquiries
CREATE POLICY "Enable update for authenticated users only" ON public.enquiries 
FOR UPDATE 
USING (auth.role() = 'authenticated');

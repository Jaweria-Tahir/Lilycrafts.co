-- Run this SQL in your Supabase SQL Editor to fix the RLS policy for reviews table

-- First, enable RLS if not already enabled
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional, to clean up)
DROP POLICY IF EXISTS "Allow public insert" ON public.reviews;
DROP POLICY IF EXISTS "Allow public read" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated users" ON public.reviews;

-- Create policy to allow anyone to INSERT
CREATE POLICY "Allow public insert"
ON public.reviews
FOR INSERT
WITH CHECK (true);

-- Create policy to allow anyone to SELECT
CREATE POLICY "Allow public read"
ON public.reviews
FOR SELECT
USING (true);

-- Create policy to allow SELECT for all (ensure reviews are visible)
CREATE POLICY "Allow read all reviews"
ON public.reviews
FOR SELECT
USING (true);

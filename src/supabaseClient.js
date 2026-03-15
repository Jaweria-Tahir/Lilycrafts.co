import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vqdtaxvhziznvgyybtki.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZHRheHZoeml6bnZneXlidGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODE2OTEsImV4cCI6MjA4ODU1NzY5MX0.G0xqLwwpLiKzd9cHxySm3Gm1TrOTdYwvQWPI0MaLE0s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
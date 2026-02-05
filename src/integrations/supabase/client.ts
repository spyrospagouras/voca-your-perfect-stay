import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rjmyyaqjowcnhuqftikp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqbXl5YXFqb3djbmh1cWZ0aWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODUxODUsImV4cCI6MjA4NDc2MTE4NX0.RgmL14MxtBS2t-MB-l-iAGAN2hqhXttxquXQ71mGnik';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

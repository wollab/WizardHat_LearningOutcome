import { createClient } from '@supabase/supabase-js';

// Same Supabase project as WizardHat_GameIdea. Anon key is public by design;
// the identify-cards Edge Function holds the real secret (ANTHROPIC_API_KEY).
const URL = import.meta.env.VITE_SUPABASE_URL || 'https://ogxjhyysevcjljjmjham.supabase.co';
const ANON =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9neGpoeXlzZXZjamxqam1qaGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NDQxMzIsImV4cCI6MjA5NzEyMDEzMn0.m8ucxizELASG_6wQig7M4Gz4fwOsQP8etvPoRcBB6jI';

export const supabase = createClient(URL, ANON, {
  auth: { persistSession: true, autoRefreshToken: true },
});

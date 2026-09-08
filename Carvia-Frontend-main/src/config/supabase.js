import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://naqinvrergiatkbxhapt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1-QsUdjetCUetrNdcImtSA_ptE6aOqX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


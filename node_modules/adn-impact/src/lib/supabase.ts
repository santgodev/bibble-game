import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variables de entorno de Supabase faltantes. Asegúrate de tener el archivo .env configurado.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

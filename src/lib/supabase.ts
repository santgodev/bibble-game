import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_ENABLED = true;

const supabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://kadgcnqvsrqfkojhfltp.supabase.co';
const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable__5BIR52VUupPw7HQG6A6Ug_GuT3fnyK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

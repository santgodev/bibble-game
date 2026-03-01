import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kadgcnqvsrqfkojhfltp.supabase.co';
const supabaseAnonKey = 'sb_publishable__5BIR52VUupPw7HQG6A6Ug_GuT3fnyK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

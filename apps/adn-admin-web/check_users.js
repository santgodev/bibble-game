import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kadgcnqvsrqfkojhfltp.supabase.co';
const supabaseKey = 'sb_publishable__5BIR52VUupPw7HQG6A6Ug_GuT3fnyK';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
    const { data, error } = await supabase.from('users').select('id, username');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Usuarios actuales en la BD:');
        console.log(data);
    }
}
checkUsers();

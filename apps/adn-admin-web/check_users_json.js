import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://kadgcnqvsrqfkojhfltp.supabase.co';
const supabaseKey = 'sb_publishable__5BIR52VUupPw7HQG6A6Ug_GuT3fnyK';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
    const { data, error } = await supabase.from('users').select('id, username');
    if (error) {
        fs.writeFileSync('output-users.json', JSON.stringify(error, null, 2));
    } else {
        fs.writeFileSync('output-users.json', JSON.stringify(data, null, 2));
    }
}
checkUsers();

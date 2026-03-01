import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = 'https://kadgcnqvsrqfkojhfltp.supabase.co';
const supabaseKey = 'sb_publishable__5BIR52VUupPw7HQG6A6Ug_GuT3fnyK';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Iniciando test de inserción en Supabase...');

    const { data: church, error: churchError } = await supabase
        .from('churches')
        .insert([{ name: 'Iglesia Central de Prueba', city: 'Bogotá' }])
        .select()
        .single();

    if (churchError) {
        if (churchError.code === '42P01') {
            console.log('🚨 ¡Error 42P01! La tabla no existe. Asegúrate de ejecutar el código SQL que vimos arriba dentro del SQL Editor de Supabase (https://kadgcnqvsrqfkojhfltp.supabase.co).');
        } else {
            console.error('❌ Error creando iglesia:', churchError.message);
        }
        return;
    }
    console.log('✅ Iglesia creada:', church.name);

    const userId1 = crypto.randomUUID();
    const userId2 = crypto.randomUUID();

    const { data: users, error: usersError } = await supabase
        .from('users')
        .insert([
            { id: userId1, church_id: church.id, username: 'GamerLegend_2026', role: 'USER', total_xp: 0 },
            { id: userId2, church_id: church.id, username: 'ProJugador_77', role: 'USER', total_xp: 0 }
        ])
        .select();

    if (usersError) {
        console.error('❌ Error insertando usuarios:', usersError.message);
        return;
    }
    console.log('✅ Usuarios creados:', users.map(u => u.username).join(', '));

    console.log('🎮 Simulando partidas terminadas y sumando XP...');
    await new Promise(resolve => setTimeout(resolve, 500));

    const { error: eventsError } = await supabase
        .from('events')
        .insert([
            { church_id: church.id, user_id: userId1, trophies: 15, xp: 50, description: 'Victoria en Charadas Bíblicas' },
            { church_id: church.id, user_id: userId1, trophies: 5, xp: 10, description: 'Participación en Impostor' },
            { church_id: church.id, user_id: userId2, trophies: 10, xp: 25, description: 'Respuestas Rápidas' }
        ]);

    if (eventsError) {
        console.error('❌ Error insertando eventos:', eventsError.message);
        return;
    }

    console.log('🌟 ¡La XP ha sido actualizada automáticamente gracias a tu Trigger!');

    const { data: ranking, error: rankError } = await supabase
        .from('monthly_ranking')
        .select('*')
        .order('total_trophies', { ascending: false });

    if (!rankError && ranking) {
        console.log('\n🏆 === RANKING ACTUALIZADO EN VIVO === 🏆');
        ranking.forEach((r, idx) => {
            console.log(`#${idx + 1} - ${r.username} | Trofeos: ${r.total_trophies}`);
        });
    }

    const { data: user1Stats } = await supabase.from('users').select('total_xp').eq('id', userId1).single();
    console.log(`\n🤖 XP Total de ${users[0].username} luego de los eventos: ${user1Stats.total_xp} XP (Debería ser 60 XP)`);

    console.log('\n🔥 Test completado de forma exitosa. Ve a app para verlos en el Dashboard.');
}

seed();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kadgcnqvsrqfkojhfltp.supabase.co';
const supabaseKey = 'sb_publishable__5BIR52VUupPw7HQG6A6Ug_GuT3fnyK';
const supabase = createClient(supabaseUrl, supabaseKey);

async function registerRealUser() {
    console.log('👤 Iniciando registro del usuario en Supabase...');

    // 1. Buscamos la Iglesia
    let { data: church } = await supabase
        .from('churches')
        .select('id')
        .limit(1)
        .single();

    if (!church) {
        console.log('⛪ Creando iglesia inicial para atar a los usuarios...');
        const { data: newCh } = await supabase.from('churches').insert([{ name: "Iglesia Central de Prueba", city: "Medellín" }]).select().single();
        church = newCh;
        if (!church) {
            console.error('❌ Error crítico creando iglesia base.');
            return;
        }
    }

    // Correo y pass provistos
    const email = "santy.29.2004@gmail.com";
    const password = "Santy.29"; // Según el prompt es este
    const username = "santgodev";
    const phone = "3102297981";

    // 2. Registramos autenticación oficial (Auth)
    console.log('🔑 Creando cuenta (Auth API)...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: "Santy",
                username: username,
                phone: phone,
            }
        }
    });

    if (authError) {
        console.error('❌ Error registrando en la capa de Auth:', authError.message);
        return;
    }

    const userId = authData.user.id;
    console.log('✅ Autorizado en Supabase Auth. User ID:', userId);

    // 3. Creamos su perfil en BD pública (Users public table)
    console.log('📁 Insertando en tabla pública Users...');
    const { error: dbError } = await supabase
        .from('users')
        .insert([{
            id: userId,
            church_id: church.id,
            username: username,
            role: 'ADMIN', // Darle privilegios de ADMIN por defecto
            total_xp: 0
        }]);

    if (dbError) {
        console.error('❌ Error creando prefil público (¿Ya existe?):', dbError.message);
    } else {
        console.log('✅ Perfil público de base de datos exitoso.');
    }

    // Damos un bono de test de Eventos directamente
    console.log('🌟 Dando Bono de Bienvenida (XP y Trofeos)...');
    await supabase.from('events').insert([
        { church_id: church.id, user_id: userId, trophies: 30, xp: 100, description: 'Bono Creador Master' }
    ]);

    console.log(`\n🎉 ¡Felicitaciones! El usuario ${username} (${email}) ha sido registrado con éxito.`);
    console.log('Puedes probar el inicio de sesión desde la App (RN) o el UI Administrador directamente.');
}

registerRealUser();

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 1. Configura tus credenciales. 
// Para el seed usa tú la SERVICE_ROLE_KEY de Supabase en vez del public anon key
// ya que este script interactuará agresivamente con la base de datos bypaseando RLS
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno EXPO_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 1. DATA: CATEGORY BATCH
// ==========================================
const UNIVERSAL_CATEGORIES = [
  {
    slug: 'principios_reino',
    title: 'Principios del Reino',
    description: 'Conceptos básicos de la fe, la gracia y la vida cristiana diaria.',
    icon: 'leaf',
    is_premium: false
  },
  {
    slug: 'heroes_villanos',
    title: 'Héroes y Villanos',
    description: 'Personajes clave del Antiguo y Nuevo Testamento.',
    icon: 'people',
    is_premium: false
  },
  {
    slug: 'senales_milagros',
    title: 'Señales y Milagros',
    description: 'Los actos sobrenaturales de Dios a través de la historia.',
    icon: 'flash',
    is_premium: false
  },
  {
    slug: 'gran_viaje',
    title: 'El Gran Viaje',
    description: 'Historia del Antiguo Testamento, desde Génesis hasta los Profetas.',
    icon: 'map',
    is_premium: false
  }
];

// ==========================================
// 2. DATA: TRIVIA QUESTIONS (Relacionados al slug)
// ==========================================
const TRIVIA_SEED = [
  {
    _slug: 'heroes_villanos',
    difficulty_level: 1,
    question: '¿Quién fue llamado por Dios para construir un arca y salvar a su familia del diluvio?',
    options: ['Moisés', 'Abraham', 'Noé', 'David'],
    correct_index: 2,
    explanation: 'Noé fue el único hombre justo en su generación, y Dios le dio instrucciones precisas para construir el arca.',
    verse_support: 'Génesis 6:13-14'
  },
  {
    _slug: 'senales_milagros',
    difficulty_level: 1,
    question: '¿Qué joven pastor derribó a un gigante usando solo una honda y una piedra?',
    options: ['Salomón', 'Josué', 'David', 'Gedeón'],
    correct_index: 2,
    explanation: 'David confió no en sus armas, sino en el nombre de Dios, enseñándonos que Dios es más grande que todo.',
    verse_support: '1 Samuel 17:49-50'
  },
  {
    _slug: 'principios_reino',
    difficulty_level: 1,
    question: '¿Cuál es el mandamiento más importante según Jesús?',
    options: ['Ir a la iglesia', 'No robar', 'Amar a Dios sobre todo', 'Ayudar a los pobres'],
    correct_index: 2,
    explanation: 'Amar a Dios y amar al prójimo resumen toda la enseñanza de la Biblia.',
    verse_support: 'Mateo 22:37-39'
  },
  {
    _slug: 'gran_viaje',
    difficulty_level: 2,
    question: '¿Qué plaga fue la última que cayó sobre Egipto antes de que el Faraón dejara ir a los israelitas?',
    options: ['Ranas', 'Oscuridad total', 'Muerte de los primogénitos', 'Langostas'],
    correct_index: 2,
    explanation: 'La última plaga llevó a la institución de la Pascua y apuntaba a lo que Jesús haría por nosotros en la cruz.',
    verse_support: 'Éxodo 11:4-5'
  }
];

// ==========================================
// 3. DATA: CHARADAS (Relacionados al slug)
// ==========================================
const CHARADAS_SEED = [
    {
      _slug: 'gran_viaje',
      word: 'Arca de Noé',
      difficulty_level: 1,
      impostor_hints: ['Flota en el agua', 'Involucra a muchos animales', 'Rescató a una familia']
    },
    {
      _slug: 'heroes_villanos',
      word: 'David',
      difficulty_level: 1,
      impostor_hints: ['Llevaba una honda', 'Cuidaba ovejas', 'Llegó a ser rey']
    },
    {
      _slug: 'principios_reino',
      word: 'La Cruz',
      difficulty_level: 1,
      impostor_hints: ['Es un símbolo mundial', 'Hecha de madera', 'Representa el sacrificio']
    },
    {
      _slug: 'gran_viaje',
      word: 'La Zarza Ardiente',
      difficulty_level: 2,
      impostor_hints: ['Estaba envuelta en fuego', 'No se consumía', 'Ocurrió en un monte con Moisés']
    }
];

// ==========================================
// FUNCIÓN PRINCIPAL DE SEED
// ==========================================
async function runSeed() {
  console.log("🌱 Iniciando migración de datos...");
  try {
    
    // 2. Insertar Categorías Universales
    console.log("⏳ Insertando Categorías...");
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .upsert(UNIVERSAL_CATEGORIES, { onConflict: 'slug' })
      .select('id, slug');
    
    if(catError) throw catError;
    console.log("✅ Categorías listas.");
    
    // Crear mapa de UUIDs -> slugToId
    const slugToId = {};
    catData.forEach(c => { slugToId[c.slug] = c.id });

    // 3. Insertar Trivia
    console.log("⏳ Insertando Preguntas de Trivia...");
    const parsedTrivia = TRIVIA_SEED.map(t => {
      const { _slug, ...rest } = t;
      return { ...rest, category_id: slugToId[_slug] };
    });
    
    const { error: triError } = await supabase
      .from('trivia_questions')
      .insert(parsedTrivia);

    if(triError) throw triError;
    console.log("✅ Trivia lista.");

    // 4. Insertar Charadas
    console.log("⏳ Insertando Banco de Charadas/Impostor...");
    const parsedCharadas = CHARADAS_SEED.map(c => {
      const { _slug, ...rest } = c;
      return { ...rest, category_id: slugToId[_slug] };
    });
    
    const { error: chaError } = await supabase
      .from('words')
      .insert(parsedCharadas);

    if(chaError) throw chaError;
    console.log("✅ Charadas listas.");


    console.log("🎉 ¡SEED COMPLETADO EXITOSAMENTE!");

  } catch (error) {
    console.error("❌ Ocurrió un error gigantesco:", error);
  }
}

runSeed();

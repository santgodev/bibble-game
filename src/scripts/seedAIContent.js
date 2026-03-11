require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Data proveída por el usuario (traducida y adaptada)
const rawData = {
  "questions": [
    { "difficulty": 1, "question": "¿Quién construyó el arca?", "options": ["Moisés", "Noé", "Abraham", "David"], "answer": "Noé", "verse_support": "Génesis 6", "category": "antiguo_testamento" },
    { "difficulty": 1, "question": "¿Quién derrotó a Goliat?", "options": ["David", "Saúl", "Samuel", "Josué"], "answer": "David", "verse_support": "1 Samuel 17", "category": "personajes_biblicos" },
    { "difficulty": 2, "question": "¿Quién fue tragado por un gran pez?", "options": ["Jonás", "Daniel", "Elías", "Isaías"], "answer": "Jonás", "verse_support": "Jonás 1", "category": "personajes_biblicos" }
  ],
  "riddles": [
    // Convertirlas a formato Trivia para que sean jugables
    { "question": "Adivinanza: Construí un arca enorme para salvar a mi familia y a los animales. ¿Quién soy?", "options": ["Noé", "Moisés", "Pedro", "Lot"], "answer": "Noé", "verse_support": "Génesis 6", "difficulty": 1, "category": "personajes_biblicos" },
    { "question": "Adivinanza: Maté a un gigante con solo una piedra. ¿Quién soy?", "options": ["David", "Sansón", "Salomón", "Gedeón"], "answer": "David", "verse_support": "1 Samuel 17", "difficulty": 1, "category": "personajes_biblicos" },
    { "question": "Adivinanza: Pasé una noche con leones y sobreviví. ¿Quién soy?", "options": ["Daniel", "José", "Elías", "Jeremías"], "answer": "Daniel", "verse_support": "Daniel 6", "difficulty": 2, "category": "personajes_biblicos" }
  ],
  "mini_plays": [
    // Convertirlas en Tarjetas de Charadas Actuables (Words)
    { "word": "La Batalla de David y Goliat", "difficulty": 1, "category": "antiguo_testamento", "hints": ["Pídele a alguien que actúe de gigante", "Necesitas una honda imaginaria", "Apunta a la frente"] },
    { "word": "Daniel en el foso de los leones", "difficulty": 2, "category": "antiguo_testamento", "hints": ["Actúa como si estuvieras rodeado de leones", "Ponte a orar de rodillas con fe", "Eres salvado por un ángel"] }
  ],
  "devotionals": [
    { "title": "Dios es nuestro creador", "verse": "Génesis 1:1", "text": "Todo lo que vemos fue creado por Dios. Podemos confiar en Él.", "challenge": "Agradece a Dios por tres cosas que creó." },
    { "title": "Confía en Dios", "verse": "Proverbios 3:5", "text": "Aunque no entendamos todo, Dios sabe lo que hace.", "challenge": "Ora hoy entregando una preocupación a Dios." }
  ],
  "kahoot_games": [
    // Más trivias!
    { "question": "¿Quién derrotó a Goliat?", "options": ["David", "Saúl", "Samuel", "Abraham"], "answer": "David", "difficulty": 1, "category": "personajes_biblicos", "verse_support": "" },
    { "question": "¿Quién sobrevivió al foso de los leones?", "options": ["Daniel", "Moisés", "Elías", "Isaías"], "answer": "Daniel", "difficulty": 1, "category": "personajes_biblicos", "verse_support": "" },
    { "question": "¿Qué convirtió Jesús en vino?", "options": ["Agua", "Aceite", "Leche", "Miel"], "answer": "Agua", "difficulty": 1, "category": "milagros", "verse_support": "" },
    { "question": "¿Cuántos panes tenía el niño en la multiplicación?", "options": ["5", "3", "7", "10"], "answer": "5", "difficulty": 1, "category": "milagros", "verse_support": "" }
  ]
};

async function run() {
  console.log("Iniciando inyección y adaptación de datos...");

  // Obtener categorías desde la BD
  const { data: catData, error: catError } = await supabase.from('categories').select('id, slug');
  if (catError) {
    console.log("Error consultando categorías:", catError);
    return;
  }
  
  const catMap = {};
  catData.forEach(c => catMap[c.slug] = c.id);

  // Helper para armar Trivias
  const buildTriviaPayload = (arr) => arr.map(t => {
      let ci = t.options.indexOf(t.answer);
      if (ci === -1) ci = 0;
      let cat_id = catMap[t.category] || catMap['biblia_basica']; // Fallback
      
      return {
          category_id: cat_id,
          difficulty_level: t.difficulty,
          question: t.question,
          options: t.options,
          correct_index: ci,
          explanation: `¡Correcto! Es ${t.answer}.`,
          verse_support: t.verse_support || "La Biblia"
      };
  });

  const allTrivias = [
      ...buildTriviaPayload(rawData.questions),
      ...buildTriviaPayload(rawData.riddles),
      ...buildTriviaPayload(rawData.kahoot_games)
  ];

  console.log(`Insertando ${allTrivias.length} trivias adaptadas...`);
  const { error: errTri } = await supabase.from('trivia_questions').insert(allTrivias);
  if (errTri) console.log("Error Trivia:", errTri);

  // Helper para armar Charadas (Mini Plays)
  const allWords = rawData.mini_plays.map(m => {
      let cat_id = catMap[m.category] || catMap['biblia_basica'];
      return {
          category_id: cat_id,
          word: m.word,
          difficulty_level: m.difficulty,
          impostor_hints: m.hints
      };
  });

  console.log(`Insertando ${allWords.length} charadas (obras actuables)...`);
  const { error: errWords } = await supabase.from('words').insert(allWords);
  if (errWords) console.log("Error Charadas:", errWords);

  // Helper para armar Devocionales
  // Consultamos el día máximo actual para sumarle a los nuevos devocionales
  const { data: existingDevos } = await supabase.from('devotionals').select('day_number').order('day_number', { ascending: false }).limit(1);
  let startDay = (existingDevos && existingDevos.length > 0) ? existingDevos[0].day_number + 1 : 1;

  const devoPayload = rawData.devotionals.map((d, index) => ({
      day_number: startDay + index,
      title: d.title,
      verse_text: d.verse,
      reflection: d.text,
      challenge_action: d.challenge,
      micro_quiz_question: `¿Sobre qué reflexiona ${d.title}?`,
      micro_quiz_options: [{"text": "Sobre confiar en Dios y la creación", "correct": true}, {"text": "Sobre rendirse", "correct": false}],
      micro_quiz_correct: 0,
      reward_xp: 30
  }));

  console.log(`Insertando ${devoPayload.length} devocionales...`);
  const { error: errDevo } = await supabase.from('devotionals').insert(devoPayload);
  if (errDevo) console.log("Error Devocionales:", errDevo);

  console.log("¡Todo insertado y adaptado!");
}

run();

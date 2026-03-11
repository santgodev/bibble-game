require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const charadesRaw = [
{"word":"David derrota a Goliat","difficulty":1,"category":"Old Testament"},
{"word":"Noé construye el arca","difficulty":1,"category":"Old Testament"},
{"word":"Jonás dentro del gran pez","difficulty":1,"category":"Old Testament"},
{"word":"Daniel en el foso de los leones","difficulty":1,"category":"Old Testament"},
{"word":"Sansón rompe las columnas","difficulty":2,"category":"Old Testament"},
{"word":"Moisés abre el Mar Rojo","difficulty":1,"category":"Old Testament"},
{"word":"Moisés recibe los diez mandamientos","difficulty":1,"category":"Old Testament"},
{"word":"José interpretando sueños","difficulty":2,"category":"Old Testament"},
{"word":"Elías hace caer fuego del cielo","difficulty":2,"category":"Old Testament"},
{"word":"Elías sube al cielo en carro de fuego","difficulty":2,"category":"Old Testament"},
{"word":"Josué derriba los muros de Jericó","difficulty":1,"category":"Old Testament"},
{"word":"Abraham mira las estrellas","difficulty":1,"category":"Old Testament"},
{"word":"Jacob lucha con el ángel","difficulty":3,"category":"Old Testament"},
{"word":"José vendido por sus hermanos","difficulty":2,"category":"Old Testament"},
{"word":"Reina Ester salva a su pueblo","difficulty":2,"category":"Old Testament"},
{"word":"Jesús convierte agua en vino","difficulty":1,"category":"New Testament"},
{"word":"Jesús calma la tormenta","difficulty":1,"category":"New Testament"},
{"word":"Jesús camina sobre el agua","difficulty":1,"category":"New Testament"},
{"word":"Jesús sana a un ciego","difficulty":1,"category":"New Testament"},
{"word":"Jesús alimenta a cinco mil","difficulty":1,"category":"New Testament"},
{"word":"Jesús resucita a Lázaro","difficulty":1,"category":"New Testament"},
{"word":"Jesús lava los pies a los discípulos","difficulty":2,"category":"New Testament"},
{"word":"Pedro niega a Jesús","difficulty":2,"category":"New Testament"},
{"word":"Jesús carga la cruz","difficulty":1,"category":"New Testament"},
{"word":"La tumba vacía de Jesús","difficulty":1,"category":"New Testament"},
{"word":"Pentecostés fuego del Espíritu","difficulty":2,"category":"New Testament"},
{"word":"Pablo predica en una ciudad","difficulty":2,"category":"New Testament"},
{"word":"Pablo y Silas cantan en la cárcel","difficulty":2,"category":"New Testament"},
{"word":"Pedro camina sobre el agua","difficulty":1,"category":"New Testament"},
{"word":"Zaqueo sube a un árbol","difficulty":1,"category":"New Testament"},
{"word":"El buen samaritano ayuda al herido","difficulty":1,"category":"Parables"},
{"word":"El hijo pródigo vuelve a casa","difficulty":1,"category":"Parables"},
{"word":"El sembrador lanza semillas","difficulty":1,"category":"Parables"},
{"word":"La oveja perdida encontrada","difficulty":1,"category":"Parables"},
{"word":"La moneda perdida buscada","difficulty":1,"category":"Parables"},
{"word":"El fariseo y el publicano orando","difficulty":2,"category":"Parables"},
{"word":"Jesús bendice a los niños","difficulty":1,"category":"New Testament"},
{"word":"Jesús ora en Getsemaní","difficulty":2,"category":"New Testament"},
{"word":"Jesús resucita","difficulty":1,"category":"New Testament"},
{"word":"Tomás toca las heridas","difficulty":2,"category":"New Testament"},
{"word":"Jesús asciende al cielo","difficulty":2,"category":"New Testament"},
{"word":"El Espíritu Santo desciende","difficulty":2,"category":"New Testament"},
{"word":"El paralítico baja por el techo","difficulty":1,"category":"New Testament"},
{"word":"Jesús sana al leproso","difficulty":1,"category":"New Testament"},
{"word":"La pesca milagrosa","difficulty":1,"category":"New Testament"},
{"word":"Jesús entra a Jerusalén","difficulty":1,"category":"New Testament"},
{"word":"Jesús expulsa vendedores del templo","difficulty":2,"category":"New Testament"},
{"word":"La viuda da dos monedas","difficulty":2,"category":"New Testament"},
{"word":"Jesús perdona a la mujer pecadora","difficulty":2,"category":"New Testament"},
{"word":"Jesús enseña el sermón del monte","difficulty":2,"category":"New Testament"}
];

const triviaRaw = [
{
"question":"¿Quién construyó el arca?",
"options":["Abraham","Noé","Moisés","David"],
"answer":"Noé",
"difficulty":1,
"category":"Old Testament"
},
{
"question":"¿Quién derrotó a Goliat?",
"options":["Saúl","David","Samuel","Josué"],
"answer":"David",
"difficulty":1,
"category":"Old Testament"
},
{
"question":"¿Quién fue tragado por un gran pez?",
"options":["Elías","Jonás","Isaías","Daniel"],
"answer":"Jonás",
"difficulty":1,
"category":"Old Testament"
},
{
"question":"¿Quién fue lanzado al foso de los leones?",
"options":["Daniel","José","Moisés","Isaías"],
"answer":"Daniel",
"difficulty":1,
"category":"Old Testament"
},
{
"question":"¿Quién abrió el Mar Rojo?",
"options":["Moisés","Josué","Elías","David"],
"answer":"Moisés",
"difficulty":1,
"category":"Old Testament"
},
{
"question":"¿Cuántos discípulos eligió Jesús?",
"options":["10","12","7","15"],
"answer":"12",
"difficulty":1,
"category":"New Testament"
},
{
"question":"¿Quién negó a Jesús tres veces?",
"options":["Pedro","Juan","Mateo","Tomás"],
"answer":"Pedro",
"difficulty":1,
"category":"New Testament"
},
{
"question":"¿Dónde nació Jesús?",
"options":["Nazaret","Jerusalén","Belén","Galilea"],
"answer":"Belén",
"difficulty":1,
"category":"New Testament"
},
{
"question":"¿Quién bautizó a Jesús?",
"options":["Pedro","Juan el Bautista","Elías","Pablo"],
"answer":"Juan el Bautista",
"difficulty":1,
"category":"New Testament"
},
{
"question":"¿Quién subió a un árbol para ver a Jesús?",
"options":["Zaqueo","Bartimeo","Nicodemo","José"],
"answer":"Zaqueo",
"difficulty":1,
"category":"New Testament"
}
];

const impostorRaw = [
{"word":"David y Goliat","category":"Battle"},
{"word":"Arca de Noé","category":"Old Testament"},
{"word":"Jonás","category":"Prophets"},
{"word":"Moisés","category":"Leaders"},
{"word":"Daniel","category":"Prophets"},
{"word":"Jesús","category":"New Testament"},
{"word":"Pedro","category":"Disciples"},
{"word":"Pablo","category":"Apostles"},
{"word":"José","category":"Old Testament"},
{"word":"Abraham","category":"Patriarchs"},
{"word":"Elías","category":"Prophets"},
{"word":"Sansón","category":"Judges"},
{"word":"Ester","category":"Queens"},
{"word":"Rut","category":"Old Testament"},
{"word":"María","category":"New Testament"},
{"word":"Juan el Bautista","category":"Prophets"},
{"word":"Lázaro","category":"Miracles"},
{"word":"Bartimeo","category":"Miracles"},
{"word":"El buen samaritano","category":"Parables"},
{"word":"Hijo pródigo","category":"Parables"},
{"word":"La oveja perdida","category":"Parables"},
{"word":"Sembrador","category":"Parables"},
{"word":"Pentecostés","category":"Church"},
{"word":"Resurrección","category":"New Testament"},
{"word":"Ascensión","category":"New Testament"},
{"word":"Crucifixión","category":"New Testament"},
{"word":"Pesca milagrosa","category":"Miracles"},
{"word":"Multiplicación de panes","category":"Miracles"},
{"word":"Jesús calma tormenta","category":"Miracles"},
{"word":"Jesús camina agua","category":"Miracles"}
];

const devotionalsRaw = [
{
"title":"Confía en Dios",
"verse":"Proverbios 3:5",
"message":"Cuando no entiendas lo que sucede, recuerda que Dios ve todo el camino.",
"reflection":"¿En qué área necesitas confiar más en Dios?"
},
{
"title":"Dios usa lo pequeño",
"verse":"1 Samuel 17:45",
"message":"David tenía una honda y fe. Dios usa lo pequeño para hacer cosas grandes.",
"reflection":"¿Qué puedes poner hoy en manos de Dios?"
},
{
"title":"Paz en medio de la tormenta",
"verse":"Marcos 4:39",
"message":"Jesús puede traer paz incluso cuando todo parece fuera de control.",
"reflection":"¿Qué tormenta necesitas entregar a Dios?"
}
];

// Helper to make an ID slug out of strings
function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '_');
}

async function run() {
  console.log("Iniciando inyección de la nueva estructura...");

  // Recopilar categorías
  const categoryNames = new Set();
  charadesRaw.forEach(c => categoryNames.add(c.category));
  triviaRaw.forEach(t => categoryNames.add(t.category));
  impostorRaw.forEach(i => categoryNames.add(i.category));

  const catsPayload = Array.from(categoryNames).map(name => {
      let icon = 'book';
      if(name === 'Old Testament' || name === 'New Testament') icon = 'book-outline';
      if(name === 'Parables') icon = 'chatbubbles-outline';
      if(name === 'Battle') icon = 'shield-outline';
      if(name === 'Miracles') icon = 'flash-outline';
      if(name === 'Disciples' || name === 'Patriarchs' || name === 'Prophets' || name === 'Apostles' || name === 'Leaders' || name === 'Judges' || name === 'Queens') icon = 'people-outline';

      return {
          slug: slugify(name),
          title: name,
          description: `Categoría de ${name}`,
          icon: icon,
          is_premium: false
      };
  });

  console.log('Upsertando categorias...', catsPayload.map(c => c.slug));
  const { data: catData, error: catErr } = await supabase
    .from('categories')
    .upsert(catsPayload, { onConflict: 'slug' })
    .select('*');

  if (catErr) {
    console.log("Error upserting categories", catErr);
    return;
  }

  const catMap = {};
  catData.forEach(c => catMap[slugify(c.title)] = c.id);

  // Formatear charadas y combinar con las tareas de impostor en 'words'
  let charadasList = charadesRaw.map(c => ({
      category_id: catMap[slugify(c.category)],
      word: c.word,
      difficulty_level: c.difficulty,
      impostor_hints: ['Pista oculta 1', 'Pista oculta 2']
  }));
  
  let impostorList = impostorRaw.map(i => ({
      category_id: catMap[slugify(i.category)],
      word: i.word,
      difficulty_level: 2, 
      impostor_hints: ['Pista oculta 1', 'Pista oculta 2']
  }));

  const allWords = [...charadasList, ...impostorList];
  
  console.log(`Insertando ${allWords.length} words...`);
  const { error: wordsErr } = await supabase.from('words').insert(allWords);
  if(wordsErr) console.log("Error words", wordsErr);

  // Formatear Trivia
  let triviaList = triviaRaw.map(t => {
      let ci = t.options.indexOf(t.answer);
      if (ci === -1) ci = 0; // fallback just in case
      return {
          category_id: catMap[slugify(t.category)],
          difficulty_level: t.difficulty,
          question: t.question,
          options: t.options,
          correct_index: ci,
          explanation: `La respuesta correcta es ${t.answer}.`,
          verse_support: ""
      };
  });
  console.log(`Insertando ${triviaList.length} trivias...`);
  const { error: trivErr } = await supabase.from('trivia_questions').insert(triviaList);
  if(trivErr) console.log("Error trivia", trivErr);

  // Formatear Devocionales
  let devosList = devotionalsRaw.map((d, index) => ({
      day_number: index + 1,
      title: d.title,
      verse_text: d.verse,
      reflection: d.message,
      challenge_action: d.reflection,
      micro_quiz_question: "¿Sobre qué reflexionamos hoy?",
      micro_quiz_options: [{"text": "El tema del devocional", "correct": true}, {"text": "Otra cosa", "correct": false}],
      micro_quiz_correct: 0,
      reward_xp: 20
  }));

  console.log(`Insertando ${devosList.length} devocionales...`);
  const { error: devoErr } = await supabase.from('devotionals').insert(devosList);
  if (devoErr) console.log("Error devocionales", devoErr);

  console.log("¡Todo insertado correctamente!");
}

run();

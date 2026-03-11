require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function dumpData() {
  const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const { data: categories, error: errCat } = await supabase.from('categories').select('*');
  const { data: trivia, error: errTri } = await supabase.from('trivia_questions').select('*');
  const { data: words, error: errWord } = await supabase.from('words').select('*');

  if (errCat || errTri || errWord) {
      console.error(errCat || errTri || errWord);
      return;
  }

  const report = {
    Resumen: {
      TotalCategorias: categories.length,
      TotalTrivia: trivia.length,
      TotalCharadas: words.length
    },
    Categorias: categories,
    TriviaQuestions: trivia,
    CharadasRestantes: words
  };
  
  fs.writeFileSync('database_dump.json', JSON.stringify(report, null, 2));
  console.log("✅ Dump creado exitosamente en database_dump.json");
}

dumpData();

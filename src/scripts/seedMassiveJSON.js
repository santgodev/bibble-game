require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const data = {
  "trivia_questions": [
    {
      "category_slug": "biblia_basica",
      "difficulty_level": 1,
      "question": "¿En cuántos días creó Dios el mundo y todo lo que hay en él, incluyendo el descanso?",
      "options": ["5 días", "7 días", "10 días", "30 días"],
      "correct_index": 1,
      "explanation": "Dios creó todo en seis días y descansó en el séptimo, estableciendo el principio del descanso para nosotros.",
      "verse_support": "Génesis 2:2-3"
    },
    {
      "category_slug": "personajes_biblicos",
      "difficulty_level": 1,
      "question": "¿Quién fue llamado por Dios para construir un arca y salvar a su familia del diluvio?",
      "options": ["Moisés", "Abraham", "Noé", "David"],
      "correct_index": 2,
      "explanation": "Noé creyó a Dios y construyó el arca, siendo un ejemplo de obediencia cuando nadie más le creía.",
      "verse_support": "Hebreos 11:7"
    },
    {
      "category_slug": "antiguo_testamento",
      "difficulty_level": 1,
      "question": "¿Qué joven pastor derrotó a un gigante usando una honda y una piedra?",
      "options": ["Josué", "David", "Salomón", "Gedeón"],
      "correct_index": 1,
      "explanation": "David no confió en armas humanas, sino en el nombre de Dios, enseñando que Dios nos da la victoria frente a problemas gigantes.",
      "verse_support": "1 Samuel 17:49-50"
    },
    {
      "category_slug": "nuevo_testamento",
      "difficulty_level": 1,
      "question": "¿En qué ciudad nació Jesús?",
      "options": ["Jerusalén", "Nazaret", "Belén", "Jericó"],
      "correct_index": 2,
      "explanation": "Jesús nació en Belén, cumpliendo exactamente lo que el profeta Miqueas había anunciado cientos de años antes.",
      "verse_support": "Miqueas 5:2"
    },
    {
      "category_slug": "milagros",
      "difficulty_level": 1,
      "question": "¿Qué alimento multiplicó Jesús para dar de comer a cinco mil hombres?",
      "options": ["Panes y peces", "Uvas y vino", "Manzanas y trigo", "Corderos"],
      "correct_index": 0,
      "explanation": "Jesús tomó cinco panes y dos peces de un niño, mostrando que Él puede hacer mucho con lo poco que le entregamos.",
      "verse_support": "Juan 6:9-11"
    },
    {
      "category_slug": "parabolas",
      "difficulty_level": 1,
      "question": "En la parábola de Jesús, ¿qué hizo el buen samaritano que no hicieron los líderes religiosos?",
      "options": ["Orar en voz alta", "Ayudar a un hombre herido", "Dar dinero al templo", "Predicar en la calle"],
      "correct_index": 1,
      "explanation": "El buen samaritano se detuvo a ayudar al herido, enseñándonos que el verdadero amor a Dios se refleja ayudando al prójimo.",
      "verse_support": "Lucas 10:33-34"
    },
    {
      "category_slug": "vida_cristiana",
      "difficulty_level": 1,
      "question": "¿Cómo nos comunicamos con Dios?",
      "options": ["Haciendo buenas obras", "A través de la oración", "Solo yendo a la iglesia", "Leyendo muchos libros"],
      "correct_index": 1,
      "explanation": "La oración es simplemente hablar con Dios como con un amigo que siempre nos escucha.",
      "verse_support": "Filipenses 4:6"
    },
    {
      "category_slug": "antiguo_testamento",
      "difficulty_level": 1,
      "question": "¿Quién fue tragado por un gran pez por desobedecer a Dios?",
      "options": ["Jonás", "Job", "Daniel", "Elías"],
      "correct_index": 0,
      "explanation": "Jonás intentó huir de la misión que Dios le dio, pero Dios usó al gran pez para salvarlo y corregir su camino.",
      "verse_support": "Jonás 1:17"
    },
    {
      "category_slug": "personajes_biblicos",
      "difficulty_level": 1,
      "question": "¿Quién fue el primer hombre creado por Dios?",
      "options": ["Adán", "Caín", "Abel", "Set"],
      "correct_index": 0,
      "explanation": "Dios formó a Adán del polvo de la tierra y sopló en él aliento de vida.",
      "verse_support": "Génesis 2:7"
    },
    {
      "category_slug": "milagros",
      "difficulty_level": 1,
      "question": "¿Sobre qué elemento caminó Jesús sorprendiendo a sus amigos?",
      "options": ["Fuego", "Agua", "Nubes", "Viento"],
      "correct_index": 1,
      "explanation": "Jesús caminó sobre el agua en medio de la tormenta, mostrando que Él tiene el control absoluto de la naturaleza.",
      "verse_support": "Mateo 14:25"
    },
    {
      "category_slug": "biblia_basica",
      "difficulty_level": 1,
      "question": "¿Cuántas partes principales tiene la Biblia?",
      "options": ["Dos: Antiguo y Nuevo Testamento", "Tres: Pasado, Presente y Futuro", "Solo una historia", "Cuatro Evangelios"],
      "correct_index": 0,
      "explanation": "La Biblia está dividida en dos testamentos: el Antiguo (antes de Cristo) y el Nuevo (después de Cristo).",
      "verse_support": "2 Timoteo 3:16"
    },
    {
      "category_slug": "personajes_biblicos",
      "difficulty_level": 1,
      "question": "¿Cómo se llamaba la madre de Jesús?",
      "options": ["Marta", "María", "Rut", "Ester"],
      "correct_index": 1,
      "explanation": "María fue elegida por Dios debido a su fe y disposición para obedecer los planes divinos.",
      "verse_support": "Lucas 1:30-31"
    },
    {
      "category_slug": "antiguo_testamento",
      "difficulty_level": 1,
      "question": "¿Qué famoso mar cruzaron los israelitas en tierra seca para escapar de Egipto?",
      "options": ["El Mar Mediterráneo", "El Mar Muerto", "El Mar de Galilea", "El Mar Rojo"],
      "correct_index": 3,
      "explanation": "Dios abrió el Mar Rojo para que su pueblo cruzara a salvo, mostrando que Él siempre abre un camino de escape.",
      "verse_support": "Éxodo 14:21-22"
    },
    {
      "category_slug": "parabolas",
      "difficulty_level": 1,
      "question": "En la parábola del hijo pródigo, ¿qué hizo el padre cuando vio a su hijo regresar de lejos?",
      "options": ["Corrió, lo abrazó y lo besó", "Lo ignoró", "Le reclamó su dinero", "Lo envió a trabajar con los sirvientes"],
      "correct_index": 0,
      "explanation": "El padre corrió a recibirlo, lo cual ilustra cómo Dios nos recibe con alegría cuando nos arrepentimos y volvemos a Él.",
      "verse_support": "Lucas 15:20"
    },
    {
      "category_slug": "vida_cristiana",
      "difficulty_level": 1,
      "question": "¿Qué día celebramos que Jesús volvió a vivir luego de ser crucificado?",
      "options": ["Nochebuena", "Día de Resurrección (Pascua)", "El diluvio", "Pentecostés"],
      "correct_index": 1,
      "explanation": "La Resurrección es el centro de nuestra fe; porque Él vive nosotros también tenemos vida eterna.",
      "verse_support": "Marcos 16:6"
    },
    {
      "category_slug": "antiguo_testamento",
      "difficulty_level": 2,
      "question": "¿A qué profeta le habló Dios desde una zarza ardiente que no se consumía?",
      "options": ["Moisés", "Elías", "Isaías", "Jeremías"],
      "correct_index": 0,
      "explanation": "Dios llamó a Moisés desde la zarza para liberar a Israel, demostrando que Dios se manifiesta de formas asombrosas en nuestra vida cotidiana.",
      "verse_support": "Éxodo 3:2-4"
    },
    {
      "category_slug": "parabolas",
      "difficulty_level": 2,
      "question": "Según Jesús en la parábola del sembrador, ¿sobre dónde cayó la semilla que sí dio buen fruto?",
      "options": ["Junto al camino", "Entre espinos", "En pedregales", "En buena tierra"],
      "correct_index": 3,
      "explanation": "La buena tierra representa el corazón de quienes escuchan el mensaje de Dios, lo entienden y lo ponen en práctica.",
      "verse_support": "Mateo 13:23"
    },
    {
      "category_slug": "personajes_biblicos",
      "difficulty_level": 2,
      "question": "¿Qué amigo de Jesús estuvo muerto por cuatro días antes de que Jesús lo resucitara?",
      "options": ["Lázaro", "Pedro", "Juan", "Judas"],
      "correct_index": 0,
      "explanation": "La resurrección de Lázaro probó que Jesús tiene absoluto poder sobre la vida y la muerte.",
      "verse_support": "Juan 11:43-44"
    },
    {
      "category_slug": "vida_cristiana",
      "difficulty_level": 2,
      "question": "¿Qué regalo dice Jesús que nos dejaría como nuestro ayudador y guía cuando Él regresara al cielo?",
      "options": ["Un ángel guardián", "El Espíritu Santo", "Una gran riqueza", "Un templo nuevo"],
      "correct_index": 1,
      "explanation": "El Espíritu Santo vive dentro de los creyentes para guiarlos, consolarlos y darles poder para vivir cristianamente.",
      "verse_support": "Juan 14:16-17"
    },
    {
      "category_slug": "milagros",
      "difficulty_level": 2,
      "question": "¿Cómo sanó Jesús a una mujer que había padecido flujo de sangre por 12 años?",
      "options": ["Pidiéndole que se lavara", "Orando por ella", "Ella tocó el borde de su manto", "Mandándole aceite"],
      "correct_index": 2,
      "explanation": "La mujer actuó con fe pura. Su creencia de que solo acercarse a Él la sanaría fue recompensada.",
      "verse_support": "Marcos 5:28-29"
    },
    {
      "category_slug": "biblia_basica",
      "difficulty_level": 2,
      "question": "¿A quién le dio Dios las tablas de piedra con los 10 Mandamientos?",
      "options": ["A Abraham", "A Moisés", "A Noé", "A David"],
      "correct_index": 1,
      "explanation": "Dios le entregó su ley a Moisés en el Monte Sinaí para que el pueblo aprendiera a vivir rectamente.",
      "verse_support": "Éxodo 31:18"
    },
    {
      "category_slug": "nuevo_testamento",
      "difficulty_level": 2,
      "question": "¿Qué apóstol era un cobrador de impuestos antes de seguir a Jesús?",
      "options": ["Mateo", "Lucas", "Juan", "Pedro"],
      "correct_index": 0,
      "explanation": "Jesús llamó a Mateo aunque los cobradores de impuestos eran muy odiados. Dios usa a las personas menos esperadas.",
      "verse_support": "Mateo 9:9"
    },
    {
      "category_slug": "nuevo_testamento",
      "difficulty_level": 2,
      "question": "En Pentecostés, ¿qué forma visible acompañó la llenura del Espíritu Santo sobre los discípulos?",
      "options": ["Una nube oscura", "Lenguas como de fuego", "Un río de agua", "Un arcoíris"],
      "correct_index": 1,
      "explanation": "Esto simbolizaba la presencia ardiente y purificadora de Dios, capacitando a los creyentes para expandir el evangelio.",
      "verse_support": "Hechos 2:3"
    },
    {
      "category_slug": "personajes_biblicos",
      "difficulty_level": 2,
      "question": "¿Qué profeta fue ascendido al cielo en un torbellino de fuego y caballos?",
      "options": ["Jeremías", "Ezequiel", "Elías", "Eliseo"],
      "correct_index": 2,
      "explanation": "Elías no experimentó la muerte regular sino que Dios se lo llevó directamente asumiendo su fidelidad inquebrantable.",
      "verse_support": "2 Reyes 2:11"
    },
    {
      "category_slug": "antiguo_testamento",
      "difficulty_level": 2,
      "question": "¿Quién era el rey famoso por su inmensa sabiduría y por construir el templo en Jerusalén?",
      "options": ["El rey David", "El rey Salomón", "El rey Saúl", "El rey Ezequías"],
      "correct_index": 1,
      "explanation": "Salomón pidió sabiduría a Dios en lugar de riquezas cuando era joven. Dios le otorgó sabiduría además de riquezas.",
      "verse_support": "1 Reyes 3:11-12"
    },
    {
      "category_slug": "parabolas",
      "difficulty_level": 2,
      "question": "En la parábola de los talentos, ¿qué hizo el siervo que recibió un talento?",
      "options": ["Lo invirtió en bancos", "Lo gastó", "Hizo un negocio grande", "Lo escondió bajo la tierra"],
      "correct_index": 3,
      "explanation": "Actuó por miedo en vez de fe. Dios quiere que multipliquemos los dones y habilidades que Él nos ha dado.",
      "verse_support": "Mateo 25:25"
    },
    {
      "category_slug": "vida_cristiana",
      "difficulty_level": 2,
      "question": "¿Cuál es conocido como 'El Fruto del Espíritu' según la carta a los Gálatas?",
      "options": ["Amor, gozo, paz, paciencia...", "Fe, esperanza y caridad", "Profecía y lenguas", "Diezmos y ofrendas"],
      "correct_index": 0,
      "explanation": "Estos comportamientos no se logran por esfuerzo humano, sino que son resultado ('fruto') de tener una relación cercana con Dios.",
      "verse_support": "Gálatas 5:22-23"
    },
    {
      "category_slug": "milagros",
      "difficulty_level": 2,
      "question": "¿En dónde realizó Jesús su primer milagro convirtiendo el agua en vino?",
      "options": ["En el templo", "En unas bodas en Caná", "En un barco", "En el desierto"],
      "correct_index": 1,
      "explanation": "Jesús eligió una fiesta de bodas para revelar su gloria inicial, mostrando que Él se interesa en el gozo y la vida diaria de las personas.",
      "verse_support": "Juan 2:11"
    },
    {
      "category_slug": "personajes_biblicos",
      "difficulty_level": 2,
      "question": "¿Cómo se llamaba la reina que salvó a su pueblo judío arriesgando su propia vida frente al rey persa?",
      "options": ["Rut", "María", "Ester", "Sara"],
      "correct_index": 2,
      "explanation": "Ester entendió que Dios la había puesto en una posición de poder 'para una hora como esta', enseñando que nuestra influencia es un llamado.",
      "verse_support": "Ester 4:14"
    },
    {
      "category_slug": "vida_cristiana",
      "difficulty_level": 2,
      "question": "Cuando le preguntaron a Jesús cuántas veces debemos perdonar, Él respondió 'hasta setenta veces siete'. ¿Qué significa?",
      "options": ["Solo perdonar 490 veces", "Perdonar siempre sin límite", "Llevar un cuaderno de apuntes", "Perdonar solo si el otro lo merece"],
      "correct_index": 1,
      "explanation": "Cristo usó el número setenta veces siete como una metáfora para mostrar que el perdón verdadero es inagotable porque Él así nos perdona a nosotros.",
      "verse_support": "Mateo 18:21-22"
    },
    {
      "category_slug": "antiguo_testamento",
      "difficulty_level": 3,
      "question": "¿Qué profeta del Antiguo Testamento detalló el sufrimiento crucificado de Jesús al afirmar 'herido fue por nuestras rebeliones' siglos antes?",
      "options": ["Jeremías", "Daniel", "Malaquías", "Isaías"],
      "correct_index": 3,
      "explanation": "Isaías 53 contiene profecías extraordinariamente exactas sobre Cristo, evidenciando que el sacrificio expiatorio de Dios siempre fue el plan central.",
      "verse_support": "Isaías 53:5"
    },
    {
      "category_slug": "nuevo_testamento",
      "difficulty_level": 3,
      "question": "¿En qué concilio apostólico se debatió intensamente si los gentiles convertidos a Jesús debían circuncidarse y guardar la ley de Moisés?",
      "options": ["Concilio de Antioquía", "Concilio de Jerusalén", "Concilio de Nicea", "Concilio de Roma"],
      "correct_index": 1,
      "explanation": "El Concilio de Jerusalén, relatado en Hechos 15, fue vital para asentar que la salvación espiritual es por la sola fe y gracia y no por cumplir ritos judíos tradicionales.",
      "verse_support": "Hechos 15:1-2"
    },
    {
      "category_slug": "parabolas",
      "difficulty_level": 3,
      "question": "En la parábola del hijo pródigo, ¿qué pecado subyacente revela la actitud del hijo mayor que se queda en casa?",
      "options": ["Inmoralidad", "Flojera", "Autojustificación y orgullo religioso", "Rebeldía física"],
      "correct_index": 2,
      "explanation": "Jesús apuntó esta parábola contra los religiosos fariseos. El hijo mayor muestra que uno puede estar cerca del Padre físicamente pero alienado afectivamente por creerse perfecto.",
      "verse_support": "Lucas 15:28-29"
    },
    {
      "category_slug": "personajes_biblicos",
      "difficulty_level": 3,
      "question": "¿Qué sacerdote, maestro y escriba regresó a Jerusalén desde Babilonia dedicando su corazón a estudiar y enseñar la Ley?",
      "options": ["Nehemías", "Zorobabel", "Malaquías", "Esdras"],
      "correct_index": 3,
      "explanation": "Esdras fue un erudito que trajo un avivamiento espiritual al leer apasionadamente la Escritura tras reconstruirse Jerusalén.",
      "verse_support": "Esdras 7:10"
    },
    {
      "category_slug": "vida_cristiana",
      "difficulty_level": 3,
      "question": "El apóstol Pablo establece que somos justificados (declarados inocentes ante Dios) no por obras sino por fe en Cristo, fuertemente en su carta a...",
      "options": ["Los Romanos", "Los Efesios", "Hebreos", "Filemón"],
      "correct_index": 0,
      "explanation": "Romanos es la exposición teológica más densa del Nuevo Testamento. Plantea el problema universal del pecado y la inmensa solución a través de la fe.",
      "verse_support": "Romanos 3:23-24"
    },
    {
      "category_slug": "milagros",
      "difficulty_level": 3,
      "question": "¿Qué oficial militar romano le dijo a Jesús 'di la palabra, y mi siervo sanará', lo cual asombró a Cristo por su madura fe?",
      "options": ["Poncio Pilato", "Un gobernador de Siria", "Un Centurión", "Cornelio"],
      "correct_index": 2,
      "explanation": "El centurión entendía de línea de mando y autoridad espiritual; Jesús declaró no haber hallado una fe tan estructurada en el mismo Israel.",
      "verse_support": "Lucas 7:7"
    },
    {
      "category_slug": "antiguo_testamento",
      "difficulty_level": 3,
      "question": "¿Quién era el líder de la resistencia ante la cual cayó finalmente la amurallada ciudad de Jericó tras 7 días de marchas constantes?",
      "options": ["Sansón", "Moisés", "Gedeón", "Josué"],
      "correct_index": 3,
      "explanation": "Josué confió en un plan divinamente ilógico de marchar en silencio e impartir gritos y trompetas al final, enseñando que Dios responde a la persistente paciencia activa.",
      "verse_support": "Josué 6:20"
    },
    {
      "category_slug": "biblia_basica",
      "difficulty_level": 3,
      "question": "¿Qué nombre hebreo del Antiguo Testamento se traduce literalmente como Jesucristo en el Nuevo Testamento?",
      "options": ["Enoc", "Josué (Yeshua)", "Jehová", "Elías"],
      "correct_index": 1,
      "explanation": "Tanto Josué en hebreo como Jesús en griego (Yeshua) significan 'El Señor Salva'. Josué llevó al pueblo de Dios territorialmente; Jesús, eternamente.",
      "verse_support": "Mateo 1:21"
    },
    {
      "category_slug": "nuevo_testamento",
      "difficulty_level": 3,
      "question": "¿A quién dirigió Lucas su Evangelio y el libro de los Hechos (probablemente un dignatario)?",
      "options": ["Teófilo", "Filemón", "Priscila", "Aquila"],
      "correct_index": 0,
      "explanation": "Lucas, un médico, recopiló meticulosamente la información con métodos de historiador para proporcionar certidumbre en las enseñanzas a Teófilo y a los futuros creyentes.",
      "verse_support": "Lucas 1:3"
    },
    {
      "category_slug": "vida_cristiana",
      "difficulty_level": 3,
      "question": "En la armadura de Dios (Efesios 6), la 'espada del Espíritu' representa específicamente:",
      "options": ["El entusiasmo", "La fe", "La verdad", "La palabra de Dios"],
      "correct_index": 3,
      "explanation": "Es la única arma ofensiva de la lista. Conocer la Biblia nos permite discernir y contrarrestar mentiras como Jesús hizo en el desierto ante la tentación.",
      "verse_support": "Efesios 6:17"
    }
  ],
  "charades_cards": [
    {
      "category_slug": "biblia_basica",
      "word": "Arca de Noé",
      "difficulty_level": 1,
      "impostor_hints": [
        "Flota en el agua",
        "Salva a una familia",
        "Incluye parejas de animales"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "David y Goliat",
      "difficulty_level": 1,
      "impostor_hints": [
        "Involucra a alguien pequeño y a alguien grande",
        "Usa una pequeña piedra",
        "Termina con la derrota total de un bando"
      ]
    },
    {
      "category_slug": "biblia_basica",
      "word": "La Creación",
      "difficulty_level": 1,
      "impostor_hints": [
        "Habla de principios y orden absoluto",
        "Duró seis días de profundo impacto",
        "Hay luz, oscuridad, mares y aves"
      ]
    },
    {
      "category_slug": "nuevo_testamento",
      "word": "La Cruz",
      "difficulty_level": 1,
      "impostor_hints": [
        "Esencial y vital en la fe",
        "Símbolo físico hecho de madera",
        "Involucra extremo sacrificio y perdón verdadero"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Pescando Peces",
      "difficulty_level": 1,
      "impostor_hints": [
        "Ocurre junto a las orillas o mar adentro",
        "Incluye el uso manual de redes",
        "Es lo que hacían los apóstoles"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Jesús y los niños",
      "difficulty_level": 1,
      "impostor_hints": [
        "Hay personas muy pequeñas acercándose",
        "Demuestra amor incondicional con brazos abiertos",
        "Los adultos querían impedir lo que pasaba"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "Moisés abre el Mar",
      "difficulty_level": 1,
      "impostor_hints": [
        "Hay un escape hacia zonas áridas",
        "Se usa una vara mágica o bastón divino",
        "Agua controlada físicamente hacia dos lados"
      ]
    },
    {
      "category_slug": "nuevo_testamento",
      "word": "Los Reyes Magos",
      "difficulty_level": 1,
      "impostor_hints": [
        "Personas extranjeras y observadoras atentas",
        "Llevan cajas pequeñas llenas de cosas caras",
        "Suelen mirar en los cielos para la ruta"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Caminando en el agua",
      "difficulty_level": 1,
      "impostor_hints": [
        "Rompe las leyes naturales físicas completamente",
        "Ocurre entre viento fuerte de la noche",
        "Muestra gran fe frente al miedo real"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Eva comiendo manzana",
      "difficulty_level": 1,
      "impostor_hints": [
        "Ocurre al interior de un hermoso lugar natural",
        "Demuestra rotunda desobediencia inicial de alguien",
        "Se relaciona con alimentarse rápido y esconderse"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "Leyendo la Biblia",
      "difficulty_level": 1,
      "impostor_hints": [
        "Demanda observación y profunda atención silenciosa",
        "Generalmente incluye libros llenos de información antigua",
        "Implica voltear páginas a diario temprano"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "Bautismo",
      "difficulty_level": 1,
      "impostor_hints": [
        "Ocurre sumergidos y no de manera seca",
        "Se requiere la ayuda directa de alguien más",
        "Termina usualmente en una nueva vida feliz"
      ]
    },
    {
      "category_slug": "nuevo_testamento",
      "word": "El Pesebre",
      "difficulty_level": 1,
      "impostor_hints": [
        "Es de noche rodeados por animales",
        "Representa profundo frío y naciente calor juntos",
        "Pobreza rodeada por inmensa realeza presente"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Sansón",
      "difficulty_level": 1,
      "impostor_hints": [
        "Un líder con tremendo poder bruto evidente",
        "Muy reconocible por tener cabello peculiar largo",
        "Pierde la batalla real con una astuta mujer engañosa"
      ]
    },
    {
      "category_slug": "parabolas",
      "word": "Buen Samaritano",
      "difficulty_level": 1,
      "impostor_hints": [
        "Aquel que sana físicamente vendando curaciones",
        "Representa apoyo real y efectivo a extranjeros",
        "Recoge a un hombre mal herido sangrando"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "Orar de rodillas",
      "difficulty_level": 1,
      "impostor_hints": [
        "Tiene postura corporal claramente devota y sumisa",
        "Demanda ojos cerrados firmemente y atención plena",
        "Interacción comunicativa directa hablada en silencio"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "El Diluvio",
      "difficulty_level": 1,
      "impostor_hints": [
        "Días y largas noches lluviosas intensas continuas",
        "Involucra un barco gigante con olor animal intenso",
        "Finaliza alegremente con promesas multicolor de paz"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Levantando un Paralítico",
      "difficulty_level": 1,
      "impostor_hints": [
        "Estaba tirado todo el tiempo postrado débil",
        "Hubo un esfuerzo milagroso inesperado notable y efectivo",
        "Incluía que le bajaran el techo dramáticamente para ayuda"
      ]
    },
    {
      "category_slug": "parabolas",
      "word": "Oveja Perdida",
      "difficulty_level": 1,
      "impostor_hints": [
        "Trata del cuidado profundo protector maternal o pastoral",
        "Incluye un escape ingenuo tonto e irresponsable temporal",
        "Llevada sobre los hombros felizmente como premio ganado"
      ]
    },
    {
      "category_slug": "biblia_basica",
      "word": "La Última Cena",
      "difficulty_level": 1,
      "impostor_hints": [
        "Un grupo amplio masculino cenando alimentos básicos tranquilamente",
        "Bebiendo líquido en una cáliz ceremonioso representativo simbólico",
        "Marcó fatalmente antes que todos fuesen sorpresivamente traicionados"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Jonás",
      "difficulty_level": 2,
      "impostor_hints": [
        "Rebeldía clara mediante escape por aguas lejanas",
        "Ocurrió tragado por inmenso animal gigante desconocido atemorizante",
        "Predicador dramático renegado con arrepentimiento forzoso salvador final"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "La Zarza Ardiente",
      "difficulty_level": 2,
      "impostor_hints": [
        "Presentaba fuego visual ilógico consumible sin destruir materialmente real",
        "Aparecía apartada oculta frente a rústico gran pastor atónito",
        "De ahí surge mandamiento a descalzarse sagradamente con respeto sumo"
      ]
    },
    {
      "category_slug": "parabolas",
      "word": "El Hijo Pródigo",
      "difficulty_level": 2,
      "impostor_hints": [
        "Incluye irse feliz para luego derrochar mucho dinero",
        "Trata sobre apestosos cerdos insalubres indeseados comiendo algarrobas",
        "Retorna trágicamente pobre antes que rico y sorprendido por abrazo final"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Cegado en el camino (Pablo)",
      "difficulty_level": 2,
      "impostor_hints": [
        "Deslumbrado profundamente ante luz radical transformadora superior impensable",
        "Aconteció cayendo súbito golpeado tropezando ciego temeroso impotente",
        "Dejó agresividad atrás virando destino apostólico hacia nuevas tierras"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "Los Diez Mandamientos",
      "difficulty_level": 2,
      "impostor_hints": [
        "Grabados directamente divinos y pesados físicamente imposibles falsificar",
        "Resultan de un encuentro tormentoso denso lleno truenos arriba misterioso",
        "El responsable portador acabó furioso temporal rompiendo estruendosos trozos abajo inmensos"
      ]
    },
    {
      "category_slug": "biblia_basica",
      "word": "Gólgota (Lugar de la Calavera)",
      "difficulty_level": 2,
      "impostor_hints": [
        "Un paraje tosco montañoso triste empinado elevado notable final indeseado",
        "Involucró lamentos agonizantes con gran sed asfixia y fuerte crucifixión real trágica masiva",
        "Tres maderos dolorosos enclavados con ruidosa violencia por crueles manos bárbaras allí mismo"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Moisés de bebé en la cesta",
      "difficulty_level": 2,
      "impostor_hints": [
        "Involucra lloriqueos arrullados y canastas flotantes rústicas pequeñas escondidas ansiosamente sigilosamente solas",
        "Tenia hermanita hábil vigilando alerta cerca matorral acuático ansiosa por resolver pronta salvación oportuna",
        "Acaba adoptado rica princesita con inmenso capital egipcio pagando nodriza propia encubierta irónicamente"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "El Diezmo",
      "difficulty_level": 2,
      "impostor_hints": [
        "Ocurre soltando finanzas monedas papeletas generosas libre voluntad entregadas secretamente separadas responsablemente apartadas devotamente para siempre",
        "Suma por proporción divina exactamente pequeña pero muy simbólica de fe total real absoluta ciega financiera",
        "Promete abrir inmensas puertas de bendición abundancia multiplicada sorpresiva"
      ]
    },
    {
      "category_slug": "parabolas",
      "word": "El Sembrador",
      "difficulty_level": 2,
      "impostor_hints": [
        "Involucra semillas agrícolas tiradas al azar fuertemente regadas libre campo sin medir tierra correcta ni mala previamente",
        "Implica algunas morir entre sol fuerte maleza agobiante pájaros comelones devoradores instantáneos robadores de toda labor efectuada veloz",
        "Enseña el poder que tiene oídos prestando atención devocional arraigados profundamente transformando fruto masivo generoso abundante final"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Agua a Vino (Bodas de Caná)",
      "difficulty_level": 2,
      "impostor_hints": [
        "Hubo escasez lamentable vergonzosa penosa fiesta alegre boda ajetreada y madre ansiosa suplicante pidió intervenir rápidamente salva al honor familiar pronto",
        "Resultó que enormes grandes vasijas tinajas pesadísimas llenadas puro abundante cristalino líquido bebible sin sabor fueron transmutadas rojizo dulzón premium altísima calidad exquisito exquisita",
        "Evitó bochorno público total con magistral silencioso acto sublime oculto reservando gran maravilla postrera maravillosa final perfecta"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Zaqueo en el árbol",
      "difficulty_level": 2,
      "impostor_hints": [
        "Era rechoncho bajito impopular ladrón dinero estado recaudador infame vil",
        "Trepó ágilmente vegetación para mirar a alguien notable popular rodeado apretado",
        "Aceptó gozosamente cena inmediata arrepentido devolviendo multiplicado bienes extra"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "Ayuno",
      "difficulty_level": 2,
      "impostor_hints": [
        "Sientes hambre real ruido estómago sacrificio voluntario abnegado control físico absoluto",
        "Mezclado ferviente ruego clamor a Dios constante y debilitante físicamente",
        "Evitas manjares viandas ricas deliciosas prefiriendo claridad espíritu mental enfocada superior atenta despierta total absoluta pureza silenciosa secreta"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "Muros de Jericó cayendo",
      "difficulty_level": 2,
      "impostor_hints": [
        "Involucró vueltas misteriosas caminadas silencio tropa masiva armada calladita expectante disciplinada",
        "Cerró con sonido ruidoso estruendo inmenso choque piedra tierra polvo denso asfixiante temblor derrumbe espectacular imponente victoria mágica inesperada total caída ruidosa masiva colosal epopeya rústica estruendosa",
        "No emplearon máquinas arietes convencionales armas lógicas solo fe gritada acústica trompetas"
      ]
    },
    {
      "category_slug": "nuevo_testamento",
      "word": "El Apocalipsis",
      "difficulty_level": 2,
      "impostor_hints": [
        "Involucra sellos bestias dragones trompetas copas símbolos épicos batallas celestes oscuras finales aterradoras complejas gloriosas futuras místicas proféticas visión encriptada en isla desierta",
        "Culmina brillantemente con esplendor cristal oro eterna paz ciudad divina nupcias cordero maravilloso desenlace final absoluto universal eterno divino victorioso glorioso final",
        "Suele dar misterio complejo intriga ansiedad estudiarlo descifrar números raros oscuros"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Lázaro, ven fuera",
      "difficulty_level": 2,
      "impostor_hints": [
        "Incluía olor apestoso fetidez hedor cueva fúnebre triste lágrimas masivas amigas",
        "Hubo llamado grito alta orden tajante despertador fuerte mandatorio",
        "Vino hombre vendado momificado tambaleante espantoso y resucitado atónico vivo coleando feliz maravilla"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Elías huyendo a la cueva",
      "difficulty_level": 2,
      "impostor_hints": [
        "Habiendo sido valiente sintió terrible miedo pavor cobardía deprimido asustado letal",
        "Durmió profundamente rústico comió alimento divino fortalecido angélicamente especial místico milagroso puro orgánico divino excelso misterioso oculto reservado apartado triste nostálgico silencioso y llorón",
        "Escuchó al Creador no ruidoso viento ni rayo sino silbito sutil fino interno susurro gentil apacible consuelo reparador transformador sanador aliviador restaurador"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "Las Plagas de Egipto",
      "difficulty_level": 2,
      "impostor_hints": [
        "Ocurrió río rojo sangre insectos ranas moscas molestosas asfixiantes",
        "Gobernante necio obstinado terco corazón duro insistía esclavizar aguantando azote dolor castigo divino repetición ruda cruel castigo severo implacable temeroso ruego angustia ruego clamor cediendo terco falso hipócrita tirano",
        "Finalizó trágica muerte triste luto dolor hijos primogénitos fin esclavitud liberación salida veloz festin amargo prisas maletas libertad"
      ]
    },
    {
      "category_slug": "parabolas",
      "word": "Construir sobre la Roca",
      "difficulty_level": 2,
      "impostor_hints": [
        "Se compara con cimientos arena duna suelta frágil contra piedra firme pesada",
        "Involucra clima fuerte lluvioso tormentoso vendaval vientos ráfaga huracán destructor",
        "Quien escucha repara la vida obedeciendo se salva estructuralmente ileso victorioso firme intacto"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "Ofrenda de la Viuda",
      "difficulty_level": 2,
      "impostor_hints": [
        "Fue mujer pobrecita humilde arrojando monedas latón muy pequeñitas valor monetario nulo espeso minúsculo insignificante",
        "Comparó con grandes ricachones daban sobra fariseos ricos gordos altivos presuntuosos engreídos ruidosos dadores espectáculo sonoro y vistoso público presuntuoso show off tacaños corazón duro dinero suelto vuelto migajas sobras",
        "Es un acto entrega brutal porcentual total valioso invaluable entrega divina superior entrega real total plena honesta generosa desinteresada desmedida fe grande altísima admiración sincera enorme ejemplar modesta ejemplar real y cruda"
      ]
    },
    {
      "category_slug": "biblia_basica",
      "word": "El Paraíso (El Jardín)",
      "difficulty_level": 2,
      "impostor_hints": [
        "Había fruta prohibida ríos lindos árboles vida bellos leones dóciles corderos preciosidad pacífica armoniosa desnudez pura casta transparente honesta feliz gozosa inocente silvestre natural silvestre inmaculada prístina virginal radiante perfecta hermosa idílica sublime encantadora celestial espléndida deslumbrante",
        "Culminó terrible con expulsión trágica castigo exilio vergüenza espinos sudor frente triste tragedia amarga separación",
        "Lugar que Dios armó bello idílico y perfecto paraíso primigenio inicial Edén"
      ]
    },
    {
      "category_slug": "nuevo_testamento",
      "word": "Día de Pentecostés",
      "difficulty_level": 3,
      "impostor_hints": [
        "Hubo idiomas y lenguas extranjeras no estudiadas previas",
        "Incluía llamaradas lumínicas estruendo sonoro ventarrón poderoso",
        "Marcó el debut e inicio expansivo mundial universal de la Iglesia valerosa de Cristo"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Transfiguración de Jesús",
      "difficulty_level": 3,
      "impostor_hints": [
        "En montaña inmerso ropa brillante luz cegadora deslumbrador incandescente ropa",
        "Fueron de visita figuras místicas de Elías y Moisés hablando apariciones misteriosas conversando gloriosos puros asombrosos espectaculares rutilantes relucientes esplendentes fulgurantes brillantes blancos impecables excelsos radiantes",
        "Pedro asustadísimo ingenuo atontado sugirió montar casetas toldos tiendas honoríficas ridículo aturdido choque emoción sorpresa pánico glorioso majestuoso estupendo"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "El Tabernáculo",
      "difficulty_level": 3,
      "impostor_hints": [
        "Carpa inmensa santuario desierto piel muebles oro altar velos oscuros divisiones",
        "Adentro contenía Arca pacto propiciatorio presencia chekinah nube fuego divina temible majestuosa reverencia extrema sumo respeto sagrado prohibido restringido temeroso pavor místico",
        "Para acceder exigía ritos limpiezas ofrendas corderos sacerdote sangre pureza rigor"
      ]
    },
    {
      "category_slug": "nuevo_testamento",
      "word": "Sermón del Monte",
      "difficulty_level": 3,
      "impostor_hints": [
        "Sentado alzó voz multitud campestre pacífica atenta extensa charla discursiva maestro montaña ladera verde aire puro aire libre pastizales muchedumbre rebaño congregado asamblea multitudinario gentío expectante",
        "Mencionaba bienaventurados pobres mansos llorones pacíficos luz sal mundo salinidad pureza resplandor buen vivir paz justicia caridad misericordia compasión rectitud amor",
        "Dictaminó el resumen ético más influyente amor enemigos regla oro perdonatorio noble grandioso superior sublime divino humano social perfecto mandamiento enseñanza"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Pablo en el naufragio (Malta)",
      "difficulty_level": 3,
      "impostor_hints": [
        "Causado por tempestad euroclidón semanas oscuras ayuno forzoso miedo marino terror náutico brújula rotas barcos tablas madera nadando salvados milagro",
        "Arribaron playa e intentando calentar fuego fogata inofensiva salió serpiente víbora letal picadura inmensa dolor encono susto mortal asombro",
        "El afectado sacudió bicho fuego sin inmutarse creyendo ser magia o dios locales atónicos boquiabiertos mudos"
      ]
    },
    {
      "category_slug": "parabolas",
      "word": "El siervo despiadado (De Los 10.000 talentos)",
      "difficulty_level": 3,
      "impostor_hints": [
        "Fue absuelto de cifra exagerada millonaria incalculable vida inmensa favor",
        "Inmediatamente agarró compañero por el cuello estrangulado exigiendo cien moneditas limosna vuelto sencillo mendigo suelto menuda pequeña poco escasa irónicamente brutal",
        "Recibió encierro severo castigo prisión carcelario verdugo tortura condena justicia"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "El yugo desigual",
      "difficulty_level": 3,
      "impostor_hints": [
        "Metáfora agrícola buey burrito arando disparejos torcidos cojeando asimétricos disparejo tirando desnivel ineficaz desastre arrastre ladeado desviado choque error junta fracasa",
        "Significa relación compromisos alianzas matrimonio creyente atado a no creyente incredulidad fe choca luz tiniebla opuestos incompatibles",
        "Termina causando roce tensión sufrimiento desilusión fractura moral espiritual desvío dolor lastima estruja divide confunde rompe quiebra"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Muerte de Ananías y Safira",
      "difficulty_level": 3,
      "impostor_hints": [
        "Hubo fingimiento donación engaño mentira hipocresía avaros tacaños aparentar santos mostrar falso teatro egoísmo fingir falso engañar estafar disimular tapar disfraz mentir codicia",
        "Cayeron muertos instantáneos terror paralizó asistentes espanto pavor fúnebre severo castigo fulminante rápido letal divino juicio",
        "Enseñó a primera iglesia no burlarse Espíritu Santo solemnidad respeto reverencia purificación disciplina"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Josías (El rey niño)",
      "difficulty_level": 3,
      "impostor_hints": [
        "Gobernó infante bajito pequeño corona inmensa trono grande inmaduro edad",
        "Encontró libro polvoriento antiguo rollo perdido ley arrimado templo sucio escombros abandonado descuidado roto ignorado marginado empolvado arrumbado guardado limpieza",
        "Lloró rasgó vestido ordenó reforma inmensa limpieza nacional avivamiento despertar volver Dios purificar país arrasó ídolos"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "Construcción de la Torre de Babel",
      "difficulty_level": 3,
      "impostor_hints": [
        "Proyecto egoísta inmenso ingeniería ladrillos fama fama humano rebelde alto altitud alzar orgullo prepotencia desafío vanidad altura techo desafío presunción humana altiva rascacielos cimientos obra civil colosal edificación ladrillos brea asfalto albañil masiva",
        "Terminó en balbuceo incoherencias ruido confusión idiomas extraños caos mímica gestos frustración abandono emigración ruido desorden dispersos exilio separan huida emigrantes mundiales",
        "Generó multiplicidad cultural etnias alejamiento fin de unificación global perversa"
      ]
    },
    {
      "category_slug": "parabolas",
      "word": "La Red y los Peces",
      "difficulty_level": 3,
      "impostor_hints": [
        "Tira malla inmensa arrastra recoge de todo moluscos buenos basuras malos mezclados revueltos combinados amontonados",
        "Orilla agua playa arena separación meticulosa escrutinio descarte selección limpieza basura fuego recolección cestas juicio final separación escrutinio",
        "Comparó el fin ciclo mundo malvados echados horno fuego llanto crujir desesperante lamento ardiente llamas condena dolor final separación justa certera dolorosa eterna definitiva"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "La Justificación por la Fe",
      "difficulty_level": 3,
      "impostor_hints": [
        "Un tribunal legal juez sentencia culpable inocente indulto libre perdonado fianza paga otro absuelto liberado cargo exento deuda cancelada paga anulada multa saldada limpia gratis expediente inmaculado",
        "No logras por esfuerzo sudor buenas obras méritos filantropía sudor cansancio propio inútil ganar cielo imposible autosuficiente fracaso",
        "Recibir mero regalo creer sacrificio cruz regalo gracia divina paz corazón limpia inmerecido amor gratis favor mérito de otro apropiado fe"
      ]
    },
    {
      "category_slug": "nuevo_testamento",
      "word": "Eunuco Etíope Bautizado",
      "difficulty_level": 3,
      "impostor_hints": [
        "Funcionario ministro africano negro lejano carruaje leyendo profeta enigmático confuso desierto solitario árido carroza polvorienta viaje lectura intrigado pasaje Isaías confuso lector devoto investigador ignorante buscador sediento",
        "Apareció predicador corriendo guiado ángel espíritu rápido Felipe intérprete explicación claridad revelación iluminación charla entendida",
        "Vio agua oasis charco bajense ruego bautizar feliz gozoso bautizado eunuco fe convertida alegría siguió viaje solitario mojado pero eufórico extasiado feliz renovado"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Ezequiel",
      "difficulty_level": 3,
      "impostor_hints": [
        "Profeta raro mímico dramas exiliado junto río triste esclavo marginado",
        "Tuvo visiones carros fuego ruedas ojos ángeles rarísimas huesos secos juntándose calaveras ejército vida ruido esqueleto armar revivir chasquido unión",
        "Dios mandó predicarles madera respirar espíritu viento vida avivamiento levantar nación moribunda"
      ]
    },
    {
      "category_slug": "antiguo_testamento",
      "word": "La Serpiente de Bronce",
      "difficulty_level": 3,
      "impostor_hints": [
        "Pueblo rebelde mordido venenos víboras quejumbras rabia quejas murmullo dolor llanto hinchazón enfermedad castigo arena plaga reptiles veneno colmillo",
        "Curación extraña forjar metal subir asta poste mirar reptil metálico fijar vista sanar medicina insólita mirar figura milagrosa cura absurda inusual extravagante salvación mirada",
        "Símbolo previo tipo cristo crucificado fe fijada sanación mirada salva"
      ]
    },
    {
      "category_slug": "nuevo_testamento",
      "word": "El Concilio de Jerusalén",
      "difficulty_level": 3,
      "impostor_hints": [
        "Asamblea junta debate acalorado acalorada reunión grave seria tensa choque cultural choque mentes teológico doctrinario legal",
        "Discutían gentiles costumbres cuchillo dieta no comer cerdo no sangre ahogado leyes viejas tradición moises carga pesada forzosa imposición judaísmo prosélito",
        "Pablo Pedro Santiago pactaron libre gracia no atar libertar carta acuerdo paz unidad gozo libertad cristiana consenso armonía"
      ]
    },
    {
      "category_slug": "parabolas",
      "word": "Las diez vírgenes",
      "difficulty_level": 3,
      "impostor_hints": [
        "Jóvenes invitadas traje fiesta antorcha lámpara candil espera novio boda fiesta noche oscuridad vela vigilia boda",
        "Demora sueño letargo dormir cerrar ojos cansancio roncando cabeceando despabilar ronquidos sopor",
        "Grito medianoche despertar susto 5 listas previsoras aceiteras reservas frasco relleno iluminan y 5 locas insensatas distraídas apagadas descuidadas rogar aceite denegado puerta cerrada cerradura portazo exclusión final"
      ]
    },
    {
      "category_slug": "vida_cristiana",
      "word": "Llevar la cruz diaria",
      "difficulty_level": 3,
      "impostor_hints": [
        "No es joya dije cuello oro plata brillar moda colgante superficial",
        "Involucra negarse decir no capricho orgullo matar ego morir carne renuncia sudor fatiga padecer disciplina sacrificio abnegación entrega sufrir dolor sumisión rendición pesada carga gozosa muerte diaria resurrección espiritual constante lucha interior",
        "Seguir paso huella ensangrentada maestro pisar modelo caminar sufrir alegrarse obediencia extrema radical sumisión total"
      ]
    },
    {
      "category_slug": "milagros",
      "word": "Eliseo y el hacha flotante",
      "difficulty_level": 3,
      "impostor_hints": [
        "Talando madera obrero esforzado tala orilla río herramienta fierro hierro pesado tajo corte sudor leña trabajo peón peones tala bosque",
        "Chispazo suelta herramienta salpica resbala cae profundo remolino hundido pérdida pánico herramienta ajena préstamo deuda dolor tristeza llanto obrero desesperado queja angustia prestada valiosa fierro hundido irrecuperable",
        "Profeta corta rama palito lanza agua milagro físico fierro liviano flota madera hunde inversión ley natural rescate asombroso"
      ]
    },
    {
      "category_slug": "personajes_biblicos",
      "word": "Melquisedec",
      "difficulty_level": 3,
      "impostor_hints": [
        "Aparece fugaz misterioso Abraham guerra victoria regreso botines desierto pan vino misterio paz rey salem",
        "Sin genealogía sin padres origen fecha muerte sin edad sacerdote altísimo único misterioso eterno tipo Cristo rey sacerdote dualidad asombrosa majestuosa pacífico bendición suprema superior",
        "Abraham rinde diezmos entrega riquezas reconocimiento sumisión reverencia grandioso respeto homenaje tributo tributario honra máxima ofrenda ofrendamiento diezmar dador"
      ]
    }
  ]
};

const CATEGORIES = [
  { slug: 'biblia_basica', title: 'Biblia Básica', description: 'Fundamentos de la fe', icon: 'book', is_premium: false },
  { slug: 'personajes_biblicos', title: 'Personajes Bíblicos', description: 'Héroes y Villanos', icon: 'people', is_premium: false },
  { slug: 'milagros', title: 'Milagros', description: 'Actos sobrenaturales de Dios', icon: 'flash', is_premium: false },
  { slug: 'parabolas', title: 'Parábolas', description: 'Historias de Jesús', icon: 'chat', is_premium: false },
  { slug: 'vida_cristiana', title: 'Vida Cristiana', description: 'Práctica de la fe', icon: 'heart', is_premium: false },
  { slug: 'antiguo_testamento', title: 'Antiguo Testamento', description: 'Génesis hasta los profetas', icon: 'map', is_premium: false },
  { slug: 'nuevo_testamento', title: 'Nuevo Testamento', description: 'Jesús y la iglesia primitiva', icon: 'boat', is_premium: false }
];

async function seedMassive() {
  console.log("Iniciando inyección masiva de datos...");

  // Insertar Categorías y obtener IDs
  const { data: catData, error: catError } = await supabase
    .from('categories')
    .upsert(CATEGORIES, { onConflict: 'slug' })
    .select('id, slug');

  if (catError) {
    console.error("Error cats:", catError);
    return;
  }

  const slugMap = {};
  catData.forEach(c => slugMap[c.slug] = c.id);

  // Mapear Trivia
  const formattedTrivia = data.trivia_questions.map(t => {
    const { category_slug, ...rest } = t;
    return { ...rest, category_id: slugMap[category_slug] };
  });

  // Mapear Charadas
  const formattedCharadas = data.charades_cards.map(c => {
    const { category_slug, ...rest } = c;
    return { ...rest, category_id: slugMap[category_slug] };
  });

  // Insertar Todo
  await supabase.from('trivia_questions').delete().neq('id', '0'); // Limpieza
  await supabase.from('words').delete().neq('id', '0'); 
  
  const { error: errTri } = await supabase.from('trivia_questions').insert(formattedTrivia);
  const { error: errCha } = await supabase.from('words').insert(formattedCharadas);

  if (errTri) console.error("Error Trivia:", errTri);
  if (errCha) console.error("Error Charadas:", errCha);

  if (!errTri && !errCha) console.log("¡Todo el contenido nuevo (40 trivias y 50 charadas) se ha subido exitosamente a Supabase!");
}

seedMassive();

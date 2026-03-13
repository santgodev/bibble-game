import { TriviaQuestion } from './categories';

export const TRIVIA_GENERAL: TriviaQuestion[] = [
    // --- NIVEL SEMILLA (20) ---
    {
        id: 'g1',
        question: '¿Cuántos días le tomó a Dios crear el mundo?',
        options: ['7 días', '6 días', '5 días', '8 días'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'En el sexto día Dios terminó su obra y en el séptimo descansó.',
        verseSupport: 'Génesis 1:31'
    },
    {
        id: 'g2',
        question: '¿Quién construyó el arca para salvarse del diluvio?',
        options: ['Moisés', 'Abraham', 'Noé', 'David'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Dios le dio instrucciones a Noé para construir el arca debido a la maldad de la humanidad.',
        verseSupport: 'Génesis 6:14'
    },
    {
        id: 'g3',
        question: '¿Cuál es el primer libro de la Biblia?',
        options: ['Mateo', 'Apocalipsis', 'Salmos', 'Génesis'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Génesis significa "principio" u "origen".',
        verseSupport: 'Génesis 1:1'
    },
    {
        id: 'g4',
        question: '¿Quién derrotó al gigante Goliat?',
        options: ['Saúl', 'David', 'Josué', 'Sansón'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'David, siendo un joven pastor, confió en Dios y venció a Goliat con una honda y una piedra.',
        verseSupport: '1 Samuel 17:50'
    },
    {
        id: 'g5',
        question: '¿Cuántos mandamientos le dio Dios a Moisés en el Sinaí?',
        options: ['12 mandamientos', '5 mandamientos', '10 mandamientos', '7 mandamientos'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Son conocidos como el Decálogo o las Tablas de la Ley.',
        verseSupport: 'Éxodo 20:1-17'
    },
    {
        id: 'g6',
        question: '¿En qué ciudad nació Jesús?',
        options: ['Nazaret', 'Jerusalén', 'Belén', 'Jericó'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Jesús nació en Belén de Judea, cumpliendo la profecía de Miqueas.',
        verseSupport: 'Mateo 2:1'
    },
    {
        id: 'g7',
        question: '¿Quién fue el traidor que entregó a Jesús?',
        options: ['Pedro', 'Juan', 'Judas Iscariote', 'Tomás'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Judas entregó a Jesús por treinta piezas de plata.',
        verseSupport: 'Mateo 26:14-15'
    },
    {
        id: 'g8',
        question: '¿Cuál es el último libro de la Biblia?',
        options: ['Malaquías', 'Apocalipsis', 'Hebreos', 'Lucas'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Apocalipsis contiene las visiones de Juan sobre el fin de los tiempos.',
        verseSupport: 'Apocalipsis 1:1'
    },
    {
        id: 'g9',
        question: '¿Qué mar dividió Dios a través de Moisés?',
        options: ['Mar Muerto', 'Mar Rojo', 'Mar de Galilea', 'Mar Mediterráneo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Dios abrió el Mar Rojo para que el pueblo de Israel escapara de Egipto.',
        verseSupport: 'Éxodo 14:21'
    },
    {
        id: 'g10',
        question: '¿Quién fue el primer hombre creado por Dios?',
        options: ['Adán', 'Abraham', 'Noé', 'Set'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Dios formó a Adán del polvo de la tierra.',
        verseSupport: 'Génesis 2:7'
    },
    {
        id: 'g11',
        question: '¿Quién fue la esposa de Adán?',
        options: ['Sara', 'Eva', 'Esther', 'Raquel'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Eva fue creada de una costilla de Adán.',
        verseSupport: 'Génesis 2:22'
    },
    {
        id: 'g12',
        question: '¿Cómo se llama la oración que Jesús enseñó a sus discípulos?',
        options: ['El Salmo 23', 'El Ave María', 'El Padre Nuestro', 'El Credo'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Jesús enseñó esta oración como modelo para orar.',
        verseSupport: 'Mateo 6:9-13'
    },
    {
        id: 'g13',
        question: '¿Quién fue tragado por un gran pez?',
        options: ['Pedro', 'Jonás', 'Pablo', 'Elías'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Jonás intentó huir de la presencia de Dios y fue tragado por un gran pez.',
        verseSupport: 'Jonás 1:17'
    },
    {
        id: 'g14',
        question: '¿Cuántos discípulos principales tenía Jesús?',
        options: ['10', '7', '12', '40'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Jesús eligió a doce hombres para ser sus apóstoles.',
        verseSupport: 'Mateo 10:1'
    },
    {
        id: 'g15',
        question: '¿Qué animal engañó a Eva en el Edén?',
        options: ['León', 'Serpiente', 'Águila', 'Lobo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'La serpiente era más astuta que todos los animales del campo.',
        verseSupport: 'Génesis 3:1'
    },
    {
        id: 'g16',
        question: '¿Qué derribó Sansón con su fuerza al final de su vida?',
        options: ['Los muros de Jericó', 'Un templo filisteo', 'Una torre', 'Una muralla'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Sansón empujó las columnas del templo y murió junto a los filisteos.',
        verseSupport: 'Jueces 16:30'
    },
    {
        id: 'g17',
        question: '¿De qué material eran las tablas donde Dios escribió los mandamientos?',
        options: ['Madera', 'Piedra', 'Oro', 'Bronce'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Dios escribió los mandamientos en dos tablas de piedra.',
        verseSupport: 'Éxodo 31:18'
    },
    {
        id: 'g18',
        question: '¿Quién bautizó a Jesús?',
        options: ['Pedro', 'Juan el Bautista', 'Pablo', 'Jacob'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Juan el Bautista bautizó a Jesús en el río Jordán.',
        verseSupport: 'Mateo 3:13'
    },
    {
        id: 'g19',
        question: '¿Cuál fue el primer milagro de Jesús?',
        options: ['Sanar un ciego', 'Caminar sobre el agua', 'Convertir agua en vino', 'Resucitar a Lázaro'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Ocurrió en las bodas de Caná de Galilea.',
        verseSupport: 'Juan 2:11'
    },
    {
        id: 'g20',
        question: '¿Qué le pidió Salomón a Dios?',
        options: ['Riquezas', 'Victoria', 'Sabiduría', 'Larga vida'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Salomón pidió sabiduría para gobernar bien al pueblo de Israel.',
        verseSupport: '1 Reyes 3:9'
    },

    // --- NIVEL DISCÍPULO (20) ---
    {
        id: 'g21',
        question: '¿Cómo se llama el grupo de libros que contiene los primeros cinco de la Biblia?',
        options: ['Los Evangelios', 'El Pentateuco', 'Las Epístolas', 'Los Profetas'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Contiene Génesis, Éxodo, Levítico, Números y Deuteronomio.',
        verseSupport: 'Lucas 24:44'
    },
    {
        id: 'g22',
        question: '¿Cuál es el capítulo más largo de la Biblia?',
        options: ['Salmo 23', 'Salmo 119', 'Salmo 1', 'Isaías 53'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'El Salmo 119 tiene 176 versículos dedicados a la Palabra de Dios.',
        verseSupport: 'Salmo 119'
    },
    {
        id: 'g23',
        question: '¿Quién escribió la mayoría de las epístolas del Nuevo Testamento?',
        options: ['Pedro', 'Juan', 'Pablo', 'Santiago'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'El apóstol Pablo escribió al menos 13 epístolas a iglesias y personas.',
        verseSupport: '2 Pedro 3:15-16'
    },
    {
        id: 'g24',
        question: '¿Qué significa el nombre "Emanuel"?',
        options: ['Dios nos salve', 'Dios con nosotros', 'Dios es grande', 'Enviado de Dios'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Es uno de los nombres proféticos de Jesús mencionados en Isaías y Mateo.',
        verseSupport: 'Mateo 1:23'
    },
    {
        id: 'g25',
        question: '¿En qué idioma fue escrito originalmente la mayor parte del Nuevo Testamento?',
        options: ['Hebreo', 'Latín', 'Griego', 'Arameo'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Se escribió en griego koiné, el idioma común de la época.',
        verseSupport: '-'
    },
    {
        id: 'g26',
        question: '¿Quién tuvo una visión de un valle lleno de huesos secos que cobraban vida?',
        options: ['Isaías', 'Jeremías', 'Ezequiel', 'Daniel'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Ezequiel profetizó sobre los huesos y estos recibieron espíritu y vivieron.',
        verseSupport: 'Ezequiel 37:1-10'
    },
    {
        id: 'g27',
        question: '¿Cuál de los discípulos de Jesús fue llamado "el amado"?',
        options: ['Pedro', 'Santiago', 'Juan', 'Andrés'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Juan se describe a sí mismo en su evangelio como el discípulo al que Jesús amaba.',
        verseSupport: 'Juan 13:23'
    },
    {
        id: 'g28',
        question: '¿Cuál fue la señal del pacto de Dios con Noé para no volver a destruir la tierra con agua?',
        options: ['Una paloma', 'Un arcoíris', 'Un altar', 'Una nube'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Dios puso su arco en las nubes como recordatorio de su promesa.',
        verseSupport: 'Génesis 9:13'
    },
    {
        id: 'g29',
        question: '¿Quién fue el sucesor de Moisés para guiar a Israel a la Tierra Prometida?',
        options: ['Aarón', 'Caleb', 'Josué', 'Gedeón'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Josué hijo de Nun fue elegido por Dios para suceder a Moisés.',
        verseSupport: 'Josué 1:1-2'
    },
    {
        id: 'g30',
        question: '¿Cuántos días estuvo Jesús en el desierto antes de empezar su ministerio?',
        options: ['7 días', '12 días', '40 días', '100 días'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Jesús ayunó 40 días y fue tentado por el diablo.',
        verseSupport: 'Mateo 4:2'
    },
    {
        id: 'g31',
        question: '¿Qué ciudad fue destruida cuando el pueblo de Israel gritó y tocó bocinas?',
        options: ['Sodoma', 'Nínive', 'Jericó', 'Babilonia'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Los muros de Jericó cayeron después de rodear la ciudad siete días.',
        verseSupport: 'Josué 6:20'
    },
    {
        id: 'g32',
        question: '¿Quién fue el profeta que desafió a los profetas de Baal en el Monte Carmelo?',
        options: ['Eliseo', 'Elías', 'Samuel', 'Isaías'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Dios respondió con fuego a la oración de Elías consumiendo el holocausto.',
        verseSupport: '1 Reyes 18:36-38'
    },
    {
        id: 'g33',
        question: '¿Quién escribió el libro de Hechos de los Apóstoles?',
        options: ['Pedro', 'Pablo', 'Lucas', 'Marcos'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Lucas el médico escribió Hechos como continuación de su evangelio.',
        verseSupport: 'Hechos 1:1'
    },
    {
        id: 'g34',
        question: '¿En qué día de la semana resucitó Jesús?',
        options: ['Sábado', 'Viernes', 'Domingo', 'Lunes'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Jesús resucitó el primer día de la semana.',
        verseSupport: 'Mateo 28:1'
    },
    {
        id: 'g35',
        question: '¿Qué apóstol fue cegado por una luz camino a Damasco?',
        options: ['Pedro', 'Tomás', 'Saulo (Pablo)', 'Andrés'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Jesús se le apareció y su vida cambió radicalmente.',
        verseSupport: 'Hechos 9:3-4'
    },
    {
        id: 'g36',
        question: '¿Cómo se llamaban los tres amigos de Daniel que fueron echados al horno de fuego?',
        options: ['Pedro, Jacobo y Juan', 'Sadrac, Mesac y Abed-nego', 'Elías, Eliseo y Samuel', 'Caín, Abel y Set'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Dios los protegió y el fuego no les hizo nada.',
        verseSupport: 'Daniel 3:16-25'
    },
    {
        id: 'g37',
        question: '¿Cuál es el fruto del Espíritu según Gálatas?',
        options: ['Paciencia, bondad, fe...', 'Oro, incienso y mirra', 'Sabiduría y conocimiento', 'Poder y autoridad'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Gálatas enumera el amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre y templanza.',
        verseSupport: 'Gálatas 5:22-23'
    },
    {
        id: 'g38',
        question: '¿Quién fue el primer mártir de la iglesia cristiana?',
        options: ['Santiago', 'Esteban', 'Pedro', 'Felipe'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Esteban fue apedreado por dar testimonio de Jesús.',
        verseSupport: 'Hechos 7:59-60'
    },
    {
        id: 'g39',
        question: '¿Qué pidió la hija de Herodías a Herodes después de bailar?',
        options: ['La mitad del reino', 'Riquezas', 'La cabeza de Juan el Bautista', 'Libertad para el pueblo'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Herodes se vio obligado a cumplir su promesa rash.',
        verseSupport: 'Mateo 14:8'
    },
    {
        id: 'g40',
        question: '¿Cuántas plagas envió Dios sobre Egipto?',
        options: ['7 plagas', '12 plagas', '10 plagas', '3 plagas'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Las plagas fueron para liberar al pueblo de la esclavitud.',
        verseSupport: 'Éxodo 7-12'
    },

    // --- NIVEL APÓSTOL (20) ---
    {
        id: 'g41',
        question: '¿A qué orden sacerdotal pertenece Jesús según el libro de Hebreos?',
        options: ['Orden Levítica', 'Orden de Aarón', 'Orden de Melquisedec', 'Orden de Judá'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Jesús es Sumo Sacerdote para siempre según el orden de Melquisedec.',
        verseSupport: 'Hebreos 6:20'
    },
    {
        id: 'g42',
        question: '¿Qué rey de Babilonia tuvo un sueño sobre una estatua de cuatro metales?',
        options: ['Belsasar', 'Nabucodonosor', 'Ciro', 'Darío'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Daniel interpretó el sueño sobre los imperios mundiales.',
        verseSupport: 'Daniel 2:31-45'
    },
    {
        id: 'g43',
        question: '¿En qué libro se menciona la guerra en el cielo entre Miguel y el dragón?',
        options: ['Daniel', 'Judas', 'Ezequiel', 'Apocalipsis'],
        correctIndex: 3,
        difficulty: 3,
        explanation: 'Miguel y sus ángeles lucharon contra el dragón y sus ángeles.',
        verseSupport: 'Apocalipsis 12:7'
    },
    {
        id: 'g44',
        question: '¿Cómo se llaman los dos objetos en el pectoral del sumo sacerdote para consultar a Dios?',
        options: ['Incienso y Mirra', 'Urim y Tumim', 'Oro y Plata', 'Alfa y Omega'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Eran usados para conocer la voluntad de Dios.',
        verseSupport: 'Éxodo 28:30'
    },
    {
        id: 'g45',
        question: '¿A quién se le atribuye la autoría del libro de Lamentaciones?',
        options: ['Isaías', 'Jeremías', 'Baruc', 'David'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Jeremías lamenta la destrucción de Jerusalén.',
        verseSupport: 'Lamentaciones'
    },
    {
        id: 'g46',
        question: '¿Cuál es el significado del término "Hallelujah"?',
        options: ['Dios es amor', 'Alabad a Yah (Jehová)', 'Sálvanos ahora', 'Santo es el Señor'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Es una expresión de alabanza en hebreo.',
        verseSupport: 'Salmo 150:1'
    },
    {
        id: 'g47',
        question: '¿Quién fue el rey que vio una mano escribiendo en la pared durante un banquete?',
        options: ['Nabucodonosor', 'Belsasar', 'Darío', 'Herodes'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'La escritura decía: MENE, MENE, TEKEL, UPARSIN.',
        verseSupport: 'Daniel 5:5'
    },
    {
        id: 'g48',
        question: '¿Qué profeta casó con una mujer fornicaria (Gomer) de parte de Dios como señal?',
        options: ['Amós', 'Oseas', 'Miqueas', 'Sofonías'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Su matrimonio simbolizaba la infidelidad de Israel hacia Dios.',
        verseSupport: 'Oseas 1:2'
    },
    {
        id: 'g49',
        question: '¿Cuántos años vagó Israel por el desierto antes de entrar a Canaán?',
        options: ['20 años', '40 años', '50 años', '70 años'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Un año por cada día que los espías reconocieron la tierra.',
        verseSupport: 'Números 14:34'
    },
    {
        id: 'g50',
        question: '¿A qué iglesia dice Jesús que vomitará de su boca por ser tibia?',
        options: ['Éfeso', 'Sardis', 'Laodicea', 'Filadelfia'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Laodicea no era ni fría ni caliente.',
        verseSupport: 'Apocalipsis 3:16'
    },
    {
        id: 'g51',
        question: '¿Quién fue el abuelo del rey David?',
        options: ['Booz', 'Isaí', 'Obed', 'Salmón'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Obed fue hijo de Booz y Rut.',
        verseSupport: 'Rut 4:21-22'
    },
    {
        id: 'g52',
        question: '¿Cuál es el nombre del lugar donde se llevará a cabo la batalla final en Apocalipsis?',
        options: ['Meguido', 'Armagedón', 'Esdrelón', 'Valle de Josafat'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Proviene del hebreo Har Meguido (Monte de Meguido).',
        verseSupport: 'Apocalipsis 16:16'
    },
    {
        id: 'g53',
        question: '¿Qué significa la palabra "Gólgota"?',
        options: ['Lugar de la calavera', 'Lugar del sacrificio', 'Monte Santo', 'Huerto de Olivos'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Es el lugar donde Jesús fue crucificado.',
        verseSupport: 'Mateo 27:33'
    },
    {
        id: 'g54',
        question: '¿Quién fue el primer sumo sacerdote de Israel?',
        options: ['Moisés', 'Aarón', 'Eleazar', 'Fineas'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Aarón, hermano de Moisés, fue ungido para el cargo.',
        verseSupport: 'Levítico 8:12'
    },
    {
        id: 'g55',
        question: '¿Qué profeta fue llevado al cielo en un carro de fuego?',
        options: ['Enoc', 'Elías', 'Eliseo', 'Moisés'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Elías subió al cielo en un torbellino.',
        verseSupport: '2 Reyes 2:11'
    },
    {
        id: 'g56',
        question: '¿Cuántos fueron los hombres que no doblaron sus rodillas ante Baal en tiempos de Elías?',
        options: ['10,000', '7,000', '1,000', '144,000'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Dios le reveló a Elías que había dejado un remante.',
        verseSupport: '1 Reyes 19:18'
    },
    {
        id: 'g57',
        question: '¿Cuál es la "ciudad de David"?',
        options: ['Belén', 'Hebrón', 'Jerusalén', 'Nazaret'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'David tomó la fortaleza de Sion y la llamó Ciudad de David.',
        verseSupport: '2 Samuel 5:7'
    },
    {
        id: 'g58',
        question: '¿A qué tribu de Israel pertenecía el apóstol Pablo?',
        options: ['Judá', 'Leví', 'Benjamín', 'Efraín'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Pablo menciona repetidamente su linaje hebreo.',
        verseSupport: 'Filipenses 3:5'
    },
    {
        id: 'g59',
        question: '¿Quién escribió el Salmo 51 (Ten piedad de mí, oh Dios)?',
        options: ['Moisés', 'David', 'Asaf', 'Salomón'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'David lo escribió tras su pecado con Betsabé.',
        verseSupport: 'Salmo 51'
    },
    {
        id: 'g60',
        question: '¿Cuál es el significado de "Alfa y Omega"?',
        options: ['Cielo y Tierra', 'Vida y Muerte', 'Principio y Fin', 'Luz y Verdad'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Son la primera y última letra del alfabeto griego.',
        verseSupport: 'Apocalipsis 22:13'
    },
];

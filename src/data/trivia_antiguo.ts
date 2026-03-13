import { TriviaQuestion } from './categories';

export const TRIVIA_ANTIGUO: TriviaQuestion[] = [
    // --- NIVEL SEMILLA (20) ---
    {
        id: 'at1',
        question: '¿Qué fruta comieron Adán y Eva aunque Dios les dijo que no lo hicieran?',
        options: ['Manzana', 'Pera', 'Fruto prohibido', 'Uva'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'La Biblia no especifica qué fruta era, solo dice que era del árbol del conocimiento del bien y del mal.',
        verseSupport: 'Génesis 3:6'
    },
    {
        id: 'at2',
        question: '¿Quién fue vendido por sus hermanos como esclavo?',
        options: ['Isaac', 'José', 'Benjamin', 'Rubén'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Los hermanos de José lo vendieron a unos mercaderes ismaelitas.',
        verseSupport: 'Génesis 37:28'
    },
    {
        id: 'at3',
        question: '¿Con qué mató David al gigante Goliat?',
        options: ['Una espada', 'Una lanza', 'Una honda y una piedra', 'Un arco'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'David confió en el nombre de Jehová de los ejércitos.',
        verseSupport: '1 Samuel 17:49-50'
    },
    {
        id: 'at4',
        question: '¿Cuál fue la décima y última plaga contra Egipto?',
        options: ['Langostas', 'Tinieblas', 'Muerte de los primogénitos', 'Úlceras'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Tras esta plaga, el Faraón permitió que Israel se fuera.',
        verseSupport: 'Éxodo 12:29'
    },
    {
        id: 'at5',
        question: '¿Quién fue el hombre que sobrevivió en el vientre de un gran pez?',
        options: ['Jonás', 'Pedro', 'Pablo', 'Noé'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Jonás estuvo tres días y tres noches en el vientre del pez.',
        verseSupport: 'Jonás 1:17'
    },
    {
        id: 'at6',
        question: '¿Cuántos de cada tipo de animal limpio metió Noé en el arca según Génesis 7?',
        options: ['Dos', 'Siete parejas', 'Uno', 'Diez'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'De los animales limpios tomó siete parejas, mientras que de los no limpios solo dos.',
        verseSupport: 'Génesis 7:2'
    },
    {
        id: 'at7',
        question: '¿En qué monte recibió Moisés los diez mandamientos?',
        options: ['Monte Carmelo', 'Monte de los Olivos', 'Monte Sinaí', 'Monte Ararat'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Dios descendió en fuego sobre el monte Sinaí.',
        verseSupport: 'Éxodo 19:20'
    },
    {
        id: 'at8',
        question: '¿Cuál es el libro de la Biblia que contiene muchos poemas y cantos?',
        options: ['Proverbios', 'Levítico', 'Salmos', 'Eclesiastés'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Los Salmos son himnos de alabanza, lamento y gratitud.',
        verseSupport: 'Libro de Salmos'
    },
    {
        id: 'at9',
        question: '¿Quién fue el primer hijo de Adán y Eva?',
        options: ['Abel', 'Caín', 'Set', 'Enoc'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Caín fue el primogénito, seguido de Abel.',
        verseSupport: 'Génesis 4:1'
    },
    {
        id: 'at10',
        question: '¿Qué construyeron los hombres para intentar llegar al cielo?',
        options: ['El templo', 'La torre de Babel', 'Una pirámide', 'Un palacio'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Dios confundió sus lenguas para detener la construcción.',
        verseSupport: 'Génesis 11:4-9'
    },
    {
        id: 'at11',
        question: '¿A quién le dio Dios la promesa de que su descendencia sería como las estrellas?',
        options: ['Isaac', 'Abraham', 'Jacob', 'José'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Abraham creyó a Dios y le fue contado por justicia.',
        verseSupport: 'Génesis 15:5'
    },
    {
        id: 'at12',
        question: '¿Cómo se llamaba la tierra prometida a los israelitas?',
        options: ['Egipto', 'Canaán', 'Asiria', 'Babilonia'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Era una tierra que "fluía leche y miel".',
        verseSupport: 'Éxodo 3:8'
    },
    {
        id: 'at13',
        question: '¿Quién fue el hombre que perdió todo pero se mantuvo fiel a Dios?',
        options: ['Job', 'David', 'Salomón', 'Saúl'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Job dijo: "Jehová dio, y Jehová quitó; sea el nombre de Jehová bendito".',
        verseSupport: 'Job 1:21'
    },
    {
        id: 'at14',
        question: '¿Qué usó Dios para vestir a Adán y Eva después de pecar?',
        options: ['Hojas de higuera', 'Túnicas de pieles', 'Telas de lino', 'Nada'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Después de que ellos intentaran cubrirse con hojas, Dios hizo túnicas de pieles.',
        verseSupport: 'Génesis 3:21'
    },
    {
        id: 'at15',
        question: '¿Quién fue el profeta que fue alimentado por cuervos?',
        options: ['Eliseo', 'Isaías', 'Elías', 'Jeremías'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Los cuervos le traían pan y carne por la mañana y por la tarde.',
        verseSupport: '1 Reyes 17:6'
    },
    {
        id: 'at16',
        question: '¿Quién era el padre de Isaac?',
        options: ['Jacob', 'Abraham', 'José', 'Lot'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Isaac fue el hijo de la promesa nacido en la vejez de sus padres.',
        verseSupport: 'Génesis 21:3'
    },
    {
        id: 'at17',
        question: '¿Cómo se llama el primer libro de la Biblia?',
        options: ['Éxodo', 'Levítico', 'Génesis', 'Salmos'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Narra los inicios del universo y de la humanidad.',
        verseSupport: 'Génesis 1:1'
    },
    {
        id: 'at18',
        question: '¿Quién fue el hombre que luchó con un ángel toda la noche?',
        options: ['Abraham', 'José', 'Jacob', 'Moisés'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Tras la lucha, su nombre fue cambiado a Israel.',
        verseSupport: 'Génesis 32:28'
    },
    {
        id: 'at19',
        question: '¿Qué mar se abrió para que pasara el pueblo de Israel?',
        options: ['Mar Muerto', 'Mar Rojo', 'Mar de Galilea', 'Mar Negro'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Moisés extendió su mano sobre el mar.',
        verseSupport: 'Éxodo 14:21'
    },
    {
        id: 'at20',
        question: '¿Qué recibió Noé de una paloma como señal de que las aguas bajaban?',
        options: ['Una rama de olivo', 'Un trozo de pan', 'Una flor', 'Nada'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'La paloma volvió con una hoja de olivo en el pico.',
        verseSupport: 'Génesis 8:11'
    },

    // --- NIVEL DISCÍPULO (20) ---
    {
        id: 'at21',
        question: '¿Qué libro relata el censo y el viaje de Israel por el desierto?',
        options: ['Génesis', 'Éxodo', 'Números', 'Deuteronomio'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'El libro de Números lleva ese nombre por los censos realizados.',
        verseSupport: 'Números 1:1-2'
    },
    {
        id: 'at22',
        question: '¿Cómo se llamaba la señal que los israelitas debían poner en sus puertas para que el ángel destructor pasara de largo?',
        options: ['Una marca blanca', 'Sangre de cordero', 'Una cruz', 'Ramas de palma'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Era la sangre de un cordero sin defecto aplicada en los postes y el dintel.',
        verseSupport: 'Éxodo 12:7'
    },
    {
        id: 'at23',
        question: '¿Quién fue el rey que construyó el primer templo permanente en Jerusalén?',
        options: ['David', 'Salomón', 'Ezequías', 'Josías'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Dios no permitió a David construirlo por ser hombre de guerra.',
        verseSupport: '1 Reyes 6:1'
    },
    {
        id: 'at24',
        question: '¿A qué profeta se le conoce como el "profeta llorón"?',
        options: ['Ezequiel', 'Jeremías', 'Isaías', 'Amós'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Jeremías sufrió profundamente al ver la rebeldía de su pueblo y la caída de Jerusalén.',
        verseSupport: 'Jeremías 9:1'
    },
    {
        id: 'at25',
        question: '¿En qué libro se encuentra la ley del amor al prójimo "como a ti mismo" por primera vez?',
        options: ['Génesis', 'Éxodo', 'Levítico', 'Mateo'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Aunque es famoso en el Nuevo Testamento, proviene de la ley mosaica.',
        verseSupport: 'Levítico 19:18'
    },
    {
        id: 'at26',
        question: '¿Qué comida envió Dios del cielo cada mañana durante 40 años?',
        options: ['Perdices', 'Maná', 'Pan de trigo', 'Miel'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'El maná era como semilla de culantro, blanco, y su sabor como de hojuelas con miel.',
        verseSupport: 'Éxodo 16:31'
    },
    {
        id: 'at27',
        question: '¿Cuántas veces rodearon Jericó el séptimo día?',
        options: ['1 vez', '3 veces', '7 veces', '12 veces'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Los sacerdotes tocaron bocinas y el pueblo gritó.',
        verseSupport: 'Josué 6:15'
    },
    {
        id: 'at28',
        question: '¿Quién era el sumo sacerdote que crió al profeta Samuel?',
        options: ['Aarón', 'Eli', 'Fineas', 'Sadoc'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Samuel servía a Jehová delante de Eli.',
        verseSupport: '1 Samuel 3:1'
    },
    {
        id: 'at29',
        question: '¿Qué ciudad profetizó Jonás que sería destruida?',
        options: ['Babilonia', 'Nínive', 'Tiro', 'Sidón'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'La ciudad se arrepintió y Dios tuvo misericordia.',
        verseSupport: 'Jonás 3:4'
    },
    {
        id: 'at30',
        question: '¿Quién fue arrebatado al cielo por Dios sin morir después de haber vivido 365 años?',
        options: ['Elías', 'Moisés', 'Enoc', 'Abraham'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Enoc caminó con Dios y desapareció.',
        verseSupport: 'Génesis 5:24'
    },
    {
        id: 'at31',
        question: '¿Cómo se llamaba la mujer que lideró a Israel como jueza?',
        options: ['Jael', 'Débora', 'Miriam', 'Ruth'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Ella animó a Barac para ir a la batalla contra el ejército de Jabín.',
        verseSupport: 'Jueces 4:4'
    },
    {
        id: 'at32',
        question: '¿Quién fue el profeta que vio a Dios sentado en un trono alto y sublime?',
        options: ['Ezequiel', 'Isaías', 'Daniel', 'Jeremías'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Vio serafines que decían: Santo, Santo, Santo.',
        verseSupport: 'Isaías 6:1-3'
    },
    {
        id: 'at33',
        question: '¿Cuántos años sirvió Jacob a Labán para poder casarse con Raquel?',
        options: ['7 años', '14 años', '10 años', '21 años'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Primero trabajó 7 años por ella pero recibió a Lea, luego trabajó otros 7.',
        verseSupport: 'Génesis 29:27-30'
    },
    {
        id: 'at34',
        question: '¿Quién fue el rey de Judá que purificó el templo y restableció la Pascua tras años de abandono (hijo de Amón)?',
        options: ['Ezequías', 'Manasés', 'Josías', 'Josafat'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Josías comenzó a reinar a los 8 años y fue un gran reformador.',
        verseSupport: '2 Reyes 22:1'
    },
    {
        id: 'at35',
        question: '¿Cuál era el pecado que cometieron los hijos de Aarón, Nadab y Abiú?',
        options: ['Adoraron al becerro', 'Ofrecieron fuego extraño', 'Robaron el arca', 'Mentiron a Moisés'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Salió fuego de delante de Jehová y los consumió.',
        verseSupport: 'Levítico 10:1-2'
    },
    {
        id: 'at36',
        question: '¿Quién era el rey que vio a Daniel interpretar la escritura en la pared?',
        options: ['Nabucodonosor', 'Ciro', 'Asuero', 'Belsasar'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Aquella misma noche fue muerto Belsasar.',
        verseSupport: 'Daniel 5:30'
    },
    {
        id: 'at37',
        question: '¿Quién fue el profeta que hizo flotar el hierro de un hacha?',
        options: ['Elías', 'Eliseo', 'Samuel', 'Isaías'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Ocurrió cuando los hijos de los profetas estaban cortando madera.',
        verseSupport: '2 Reyes 6:5-6'
    },
    {
        id: 'at38',
        question: '¿Qué señal le dio Dios a Gedeón para confirmar su llamado?',
        options: ['Una zarza ardiendo', 'Lana mojada y tierra seca', 'Un arcoíris', 'La vara convertida en culebra'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Fue la prueba del vellocino.',
        verseSupport: 'Jueces 6:36-40'
    },
    {
        id: 'at39',
        question: '¿A qué tribu de Israel pertenecían los sacerdotes?',
        options: ['Judá', 'Leví', 'Benjamín', 'Efraín'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Los levitas fueron apartados para el servicio del tabernáculo.',
        verseSupport: 'Números 3:6-7'
    },
    {
        id: 'at40',
        question: '¿Cuál fue el castigo de Dios por la rebelión de Coré, Datán y Abiram?',
        options: ['Una plaga', 'La tierra se los tragó', 'Fuego del cielo', 'Ceguedad'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Se abrieron las fauces de la tierra bajo sus pies.',
        verseSupport: 'Números 16:31-33'
    },

    // --- NIVEL APÓSTOL (20) ---
    {
        id: 'at41',
        question: '¿Qué significa la palabra "Eclesiastés"?',
        options: ['Lamento', 'Predicador', 'Vanidad', 'Sabiduría'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Proviene del griego "ekklesia", refiriéndose a alguien que convoca a una asamblea.',
        verseSupport: 'Eclesiastés 1:1'
    },
    {
        id: 'at42',
        question: '¿Cuál fue el nombre del lugar donde Dios confundió las lenguas de la humanidad?',
        options: ['Babel', 'Babilonia', 'Nínive', 'Erec'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Babel significa confusión.',
        verseSupport: 'Génesis 11:9'
    },
    {
        id: 'at43',
        question: '¿Quién fue el rey que tuvo una visión de una estatua compuesta por diversos metales?',
        options: ['Nabucodonosor', 'Belsasar', 'Darío el Medo', 'Ciro de Persia'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Daniel le reveló que la estatua simbolizaba imperios sucesivos.',
        verseSupport: 'Daniel 2:31'
    },
    {
        id: 'at44',
        question: '¿Cuál de los siguientes es considerado un "profeta menor"?',
        options: ['Isaías', 'Ezequiel', 'Oseas', 'Jeremías'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Se llaman así por la brevedad de sus escritos, no por su importancia.',
        verseSupport: '-'
    },
    {
        id: 'at45',
        question: '¿A qué objeto sagrado golpeó Moisés en el desierto para obtener agua desobedeciendo a Dios?',
        options: ['Una roca', 'El suelo', 'El altar', 'El tabernáculo'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Dios le dijo que solo le hablara a la peña la segunda vez.',
        verseSupport: 'Números 20:11'
    },
    {
        id: 'at46',
        question: '¿Qué profeta describió la gloria de Dios como un "aspecto de fuego" en una visión de ruedas?',
        options: ['Isaías', 'Hageo', 'Ezequiel', 'Zacarías'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Es la famosa visión del carro de Dios (Merkabah).',
        verseSupport: 'Ezequiel 1:26-27'
    },
    {
        id: 'at47',
        question: '¿En qué libro del Antiguo Testamento no se menciona ni una sola vez el nombre de Dios?',
        options: ['Eclesiastés', 'Job', 'Ester', 'Cantar de los Cantares'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Aunque Dios no se menciona, Su providencia es evidente en toda la historia.',
        verseSupport: '-'
    },
    {
        id: 'at48',
        question: '¿Quién fue el rey que vio una mano escribiendo sobre la pared durante un banquete sagrado?',
        options: ['Belsasar', 'Antíoco', 'Herodes', 'Nabucodonosor'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Esa misma noche murió el rey de los caldeos.',
        verseSupport: 'Daniel 5:5'
    },
    {
        id: 'at49',
        question: '¿Qué rey de Judá fue herido con lepra por intentar ofrecer incienso en el templo?',
        options: ['Uzías (Azarías)', 'Acab', 'Manasés', 'Josafat'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'El orgullo lo llevó a usurpar funciones sacerdotales.',
        verseSupport: '2 Crónicas 26:19'
    },
    {
        id: 'at50',
        question: '¿A qué profeta se le mandó predicar que en cuarenta días Nínive sería destruida?',
        options: ['Nahum', 'Jonás', 'Sofonías', 'Miqueas'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Nínive fue la capital de Asiria.',
        verseSupport: 'Jonás 3:4'
    },
    {
        id: 'at51',
        question: '¿Cómo se llama la fiesta judía que celebra la liberación de la muerte de los primogénitos en Egipto?',
        options: ['Pascua (Pesaj)', 'Pentecostés (Shavuot)', 'Tabernáculos (Sucot)', 'Purim'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'La Pascua significa "pasar de largo".',
        verseSupport: 'Éxodo 12:11'
    },
    {
        id: 'at52',
        question: '¿Qué profeta tuvo una visión representativa sobre cuatro caballos de colores diferentes patrullando la tierra?',
        options: ['Ezequiel', 'Zacarías', 'Amós', 'Daniel'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Zacarías tuvo ocho visiones nocturnas.',
        verseSupport: 'Zacarías 1:8'
    },
    {
        id: 'at53',
        question: '¿Quién escribió el libro de los Proverbios esencialmente?',
        options: ['David', 'Salomón', 'Agur', 'Lemuel'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Salomón propuso tres mil proverbios.',
        verseSupport: '1 Reyes 4:32'
    },
    {
        id: 'at54',
        question: '¿En qué libro se describe detalladamente la construcción del Tabernáculo?',
        options: ['Génesis', 'Éxodo', 'Levítico', 'Números'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Moisés recibió el modelo exacto en el monte.',
        verseSupport: 'Éxodo 25-40'
    },
    {
        id: 'at55',
        question: '¿Quién fue el primer rey de Israel del Reino del Norte después de la división?',
        options: ['Roboam', 'Jeroboam', 'Acab', 'Jehú'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Tenía a su cargo las diez tribus.',
        verseSupport: '1 Reyes 12:20'
    },
    {
        id: 'at56',
        question: '¿Qué profeta fue llevado cautivo a Babilonia junto con el rey Joaquín?',
        options: ['Ezequiel', 'Jeremías', 'Hageo', 'Zacarías'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Ezequiel era sacerdote y fue llevado en la segunda deportación.',
        verseSupport: 'Ezequiel 1:1-3'
    },
    {
        id: 'at57',
        question: '¿Cuál es el libro más corto del Antiguo Testamento?',
        options: ['Abdías', 'Hageo', 'Zacarías', 'Malaquías'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Consta de un solo capítulo de 21 versículos.',
        verseSupport: 'Libro de Abdías'
    },
    {
        id: 'at58',
        question: '¿A qué profeta se le asignó la tarea de profetizar a los huesos secos en un valle?',
        options: ['Isaías', 'Ezequiel', 'Jeremías', 'Daniel'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Simboliza la restauración espiritual de Israel.',
        verseSupport: 'Ezequiel 37:4'
    },
    {
        id: 'at59',
        question: '¿Cómo se llama la piedra que David puso en su honda para matar a Goliat?',
        options: ['Lisa y pulida', 'Rugosa', 'De oro', 'De cristal'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Escogió cinco piedras lisas del arroyo.',
        verseSupport: '1 Samuel 17:40'
    },
    {
        id: 'at60',
        question: '¿Cuál es el último profeta del Antiguo Testamento?',
        options: ['Zacarías', 'Sofonías', 'Hageo', 'Malaquías'],
        correctIndex: 3,
        difficulty: 3,
        explanation: 'Su libro termina con la promesa del envío de Elías.',
        verseSupport: 'Malaquías 4:5'
    },
];

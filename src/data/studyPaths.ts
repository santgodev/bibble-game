// ============================================================
// DATA DE RUTAS DE ESTUDIO (STUDY PATHS)
// Estructura Jerárquica Guiada (Estilo Duolingo)
// Path -> Semanas -> Nodos (Clases/Actividades)
// ============================================================

export interface QuizOption {
    text: string;
    correct: boolean;
}

export interface CharadaWord {
    word: string;
    category: 'personaje' | 'concepto' | 'evento' | 'frase';
    difficulty: 'facil' | 'medio' | 'dificil';
}

export type NodeType = 'intro' | 'devotional' | 'practice' | 'quiz';

export interface StudyNode {
    id: string;
    type: NodeType;
    title: string;
    subtitle: string;

    // Content fields (optional depending on type)
    bibleRef?: string;
    passage?: string; // Used for intro or devotional reading
    reflection?: string; // The main explanation
    question?: string; // Deep question
    application?: string; // Practical app

    quiz?: {
        questions: {
            question: string;
            options: QuizOption[];
        }[];
    };

    charadas?: CharadaWord[];

    xpReward: number;
    trophyReward: number;
}

export interface StudyWeek {
    id: string;
    weekNumber: number;
    title: string; // e.g. "Semana 1: Jesús es Dios"
    theme: string;
    nodes: StudyNode[];
}

export interface StudyPath {
    id: string;
    title: string;
    book: string;
    description: string;
    color: string;
    accentColor: string;
    iconName: string;
    totalWeeks: number;
    weeks: StudyWeek[];
}

// ==========================================
// PLAN 1: JESÚS REAL
// ==========================================
export const JESUS_REAL_PATH: StudyPath = {
    id: 'jesus-real',
    title: 'JESÚS REAL',
    book: 'Evangelio de Juan',
    description: 'Conoce al Jesús real: el Dios que entró a la historia, transformó vidas y sigue vivo.',
    color: '#0D001A',
    accentColor: '#C89FFF',
    iconName: 'star-outline',
    totalWeeks: 4,
    weeks: [
        // --- SEMANA 1 ---
        {
            id: 'jr-w1',
            weekNumber: 1,
            title: 'Jesús es Dios',
            theme: 'Juan 1:1–18',
            nodes: [
                {
                    id: 'jr-w1-intro',
                    type: 'intro',
                    title: 'El Verbo Eterno',
                    subtitle: 'Lectura Fundamental',
                    bibleRef: 'Juan 1:1–18',
                    passage: '"En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios... Y aquel Verbo fue hecho carne, y habitó entre nosotros (y vimos su gloria, gloria como del unigénito del Padre), lleno de gracia y de verdad."',
                    reflection: 'Juan no empieza con el nacimiento de Jesús en un pesebre. Empieza mucho antes: en la eternidad. El "Verbo" (Logos) era la razón creativa de Dios. Jesús es esa fuerza hecha persona. Dios no nos mandó un mensaje. Vino Él mismo.',
                    xpReward: 10,
                    trophyReward: 2,
                },
                {
                    id: 'jr-w1-lun',
                    type: 'devotional',
                    title: 'Lunes: Creador',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 1:1-5',
                    passage: 'Antes de que existiera el big bang, el Verbo ya existía. "era el Verbo", "era con Dios", "era Dios". La misma Persona que diseñó el ADN y las galaxias, decidió un día ponerse cara y nombre.',
                    question: '¿Qué cambia en cómo ves a Jesús si lo entiendes como el Creador del universo, no solo como un moralista o buen ejemplo?',
                    application: 'Esta semana, cada vez que veas algo de la naturaleza que te impresione, recuerda conscientemente: "Jesús hizo esto".',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w1-mie',
                    type: 'devotional',
                    title: 'Miércoles: Rechazo y Adopción',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 1:9-13',
                    passage: '"A lo suyo vino, y los suyos no le recibieron. Mas a todos los que le recibieron... les dio potestad de ser hechos hijos de Dios." Llegó a la humanidad que Él creó y fue ignorado. Pero a quienes creen, no los hace seguidores o fans. Los hace hijos.',
                    question: '¿Hay áreas de tu vida en las que decides tú solo sin incluir a Jesús? ¿Qué significaría "recibirlo" en esa área?',
                    application: 'Pon una nota de fondo en tu celular que diga "Hijo(a) de Dios". Cada vez que la veas, recuerda tu identidad principal.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w1-vie',
                    type: 'devotional',
                    title: 'Viernes: Gracia y Verdad',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 1:14-18',
                    passage: '"Habitó entre nosotros". En griego significa que puso su tienda de campaña en nuestro barrio. Y lo hizo lleno de gracia (favor) y verdad (honestidad). No te adula, pero tampoco te aplasta.',
                    question: '¿Qué te cuesta más recibir de Jesús: su gracia que te acepta sin mérito, o su verdad que señala lo que hay que cambiar?',
                    application: 'Habla hoy con alguien usando "gracia y verdad": di algo verdadero y necesario, pero hazlo desde un amor genuino.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w1-prac',
                    type: 'practice',
                    title: 'Sábado en Grupo',
                    subtitle: 'Dinámica y Charadas',
                    reflection: 'Júntense y escriban en un papel una cosa que sientan "en tinieblas" (una batalla o duda). Oren juntos declarando Juan 1:5 y rompan los papeles.',
                    charadas: [
                        { word: 'La Luz', category: 'concepto', difficulty: 'facil' },
                        { word: 'Juan el Bautista', category: 'personaje', difficulty: 'facil' },
                        { word: 'Hijos de Dios', category: 'concepto', difficulty: 'medio' },
                        { word: 'El Verbo se hizo carne', category: 'frase', difficulty: 'dificil' },
                        { word: 'La Creación', category: 'evento', difficulty: 'facil' },
                    ],
                    xpReward: 20,
                    trophyReward: 10,
                },
                {
                    id: 'jr-w1-quiz',
                    type: 'quiz',
                    title: 'Reto de la Semana',
                    subtitle: 'Quiz Final',
                    quiz: {
                        questions: [
                            {
                                question: '¿Cómo llama Juan a Jesús en el versículo inicial de su evangelio?',
                                options: [
                                    { text: 'El Elegido', correct: false },
                                    { text: 'El Verbo', correct: true },
                                    { text: 'El Profeta', correct: false },
                                    { text: 'El Sabio', correct: false },
                                ]
                            },
                            {
                                question: 'Según el devocional, en griego "habitó entre nosotros" significa que...',
                                options: [
                                    { text: 'Construyó un templo', correct: false },
                                    { text: 'Llovió del cielo', correct: false },
                                    { text: 'Puso su tienda en nuestro barrio', correct: true },
                                    { text: 'Se hizo invisible', correct: false },
                                ]
                            },
                            {
                                question: '¿A los que creyeron en Él, les dio potestad (el derecho) de ser hechos...?',
                                options: [
                                    { text: 'Ángeles', correct: false },
                                    { text: 'Hijos de Dios', correct: true },
                                    { text: 'Reyes magos', correct: false },
                                    { text: 'Sirvientes', correct: false },
                                ]
                            },
                            {
                                question: 'Según la lectura del viernes, el Verbo habitó entre nosotros lleno de...',
                                options: [
                                    { text: 'Gracia y Verdad', correct: true },
                                    { text: 'Ira y Justicia', correct: false },
                                    { text: 'Luz y Sombras', correct: false },
                                    { text: 'Poder y Gloria', correct: false },
                                ]
                            },
                            {
                                question: 'El devocional del lunes menciona que el Verbo (La Persona) no solo diseñó las galaxias sino también...',
                                options: [
                                    { text: 'El mar Rojo', correct: false },
                                    { text: 'El arca', correct: false },
                                    { text: 'El ADN', correct: true },
                                    { text: 'El Edén', correct: false },
                                ]
                            }
                        ]
                    },
                    xpReward: 30,
                    trophyReward: 15,
                }
            ]
        },
        // --- SEMANA 2 ---
        {
            id: 'jr-w2',
            weekNumber: 2,
            title: 'Jesús Transforma',
            theme: 'Juan 2 y Juan 4',
            nodes: [
                {
                    id: 'jr-w2-intro',
                    type: 'intro',
                    title: 'Agua en Vino, Sed en Vida',
                    subtitle: 'Lectura Fundamental',
                    bibleRef: 'Juan 2 y 4',
                    passage: 'Jesús actúa en dos polos: en Caná (una fiesta de bodas feliz) y en el pozo de Sicar (con una mujer marginada y avergonzada). La transformación de Jesús no discrimina tu historial ni tu contexto.',
                    xpReward: 10,
                    trophyReward: 2,
                },
                {
                    id: 'jr-w2-lun',
                    type: 'devotional',
                    title: 'Lunes: Abundancia',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 2:1-11',
                    passage: 'Su primer milagro no fue resucitar a alguien, fue salvar una fiesta convirtiendo agua en el mejor vino. La lección profunda es la obediencia de los sirvientes, que echaron agua sin entender por qué. Ese es el primer paso de fe.',
                    question: '¿En qué situación sientes que "no tienes vino"? ¿Confías en que Jesús puede transformar esa escasez si le obedeces?',
                    application: 'Identifica a alguien "sin vino" (sin energía o alegría) en tu entorno, y hazle un gesto sorpresivo hoy para recargarlo.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w2-mie',
                    type: 'devotional',
                    title: 'Miércoles: Sed',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 4:1-15',
                    passage: 'Jesús busca a una mujer samaritana en un pozo, al mediodía (cuando nadie va por el calor, probablemente ella huía de la gente). Él le pide agua. No empieza predicando, empieza con una necesidad, y la lleva al agua viva.',
                    question: '¿En qué pozos llevas buscando agua repetidamente para saciar una sed que nunca se llena (logros, redes, relaciones, aprobación)?',
                    application: 'Escribe en tu notas: "He buscado llenar mi sed en ___. Lo que Jesús ofrece es ___." Sé honesto.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w2-vie',
                    type: 'devotional',
                    title: 'Viernes: Conocidos',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 4:16-30',
                    passage: '"Llama a tu marido". Jesús le revela que conoce toda su vida rota (5 matrimonios fallidos), no para avergonzarla, sino para liberarla. Cuando el testimonio es real, no se puede guardar.',
                    question: '¿Te aterra o te da paz saber que Jesús ya conoce todos tus secretos, y aún así eligió quedarse a hablar contigo?',
                    application: 'Comparte con un amigo o compañero algo genuino que Dios ha estado tratando contigo últimamente.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w2-prac',
                    type: 'practice',
                    title: 'Sábado en Grupo',
                    subtitle: 'Dinámica y Charadas',
                    reflection: 'Círculo de testimonios rápidos: que cada uno comparta una pequeña "escasez de vino" y luego agradezcan a Dios por la transformación.',
                    charadas: [
                        { word: 'Las bodas de Caná', category: 'evento', difficulty: 'facil' },
                        { word: 'Agua en vino', category: 'evento', difficulty: 'facil' },
                        { word: 'La mujer samaritana', category: 'personaje', difficulty: 'medio' },
                        { word: 'Cinco maridos', category: 'concepto', difficulty: 'dificil' },
                        { word: 'Agua viva', category: 'concepto', difficulty: 'medio' },
                    ],
                    xpReward: 20,
                    trophyReward: 10,
                },
                {
                    id: 'jr-w2-quiz',
                    type: 'quiz',
                    title: 'Reto de la Semana',
                    subtitle: 'Quiz Final',
                    quiz: {
                        questions: [
                            {
                                question: 'Según el devocional, el primer milagro (agua en vino) nos da una gran lección sobre:',
                                options: [
                                    { text: 'El poder del agua', correct: false },
                                    { text: 'La importancia del vino', correct: false },
                                    { text: 'La obediencia de los sirvientes', correct: true },
                                    { text: 'Cómo organizar fiestas', correct: false },
                                ]
                            },
                            {
                                question: 'Al pedirle agua, ¿a quién buscó Jesús intencionalmente al mediodía (con calor) en el pozo?',
                                options: [
                                    { text: 'A Nicodemo', correct: false },
                                    { text: 'A Sus discípulos', correct: false },
                                    { text: 'A la mujer samaritana', correct: true },
                                    { text: 'A un centurión romano', correct: false },
                                ]
                            },
                            {
                                question: 'Jesús no empezó predicándole a la samaritana sobre moral, empezó con...',
                                options: [
                                    { text: 'Una limosna', correct: false },
                                    { text: 'Una necesidad (Agua)', correct: true },
                                    { text: 'Un regaño', correct: false },
                                    { text: 'Una oración', correct: false },
                                ]
                            },
                            {
                                question: '¿Cuántos matrimonios fallidos le reveló Jesús a la mujer que ella había tenido?',
                                options: [
                                    { text: 'Dos', correct: false },
                                    { text: 'Siete', correct: false },
                                    { text: 'Ninguno', correct: false },
                                    { text: 'Cinco', correct: true },
                                ]
                            },
                            {
                                question: 'El devocional explica que cuando Jesús sacó a la luz la vida de la mujer, no lo hizo para avergonzarla sino para:',
                                options: [
                                    { text: 'Juzgarla', correct: false },
                                    { text: 'Liberarla', correct: true },
                                    { text: 'Que llorara', correct: false },
                                    { text: 'Cobrarle', correct: false },
                                ]
                            }
                        ]
                    },
                    xpReward: 30,
                    trophyReward: 15,
                }
            ]
        },
        // --- SEMANA 3 ---
        {
            id: 'jr-w3',
            weekNumber: 3,
            title: 'Jesús es la Verdad',
            theme: 'Juan 8 y Juan 14',
            nodes: [
                {
                    id: 'jr-w3-intro',
                    type: 'intro',
                    title: 'Libertad y Camino',
                    subtitle: 'Lectura Fundamental',
                    bibleRef: 'Juan 8:31-36 y 14:6',
                    passage: 'Hoy todos tienen "su verdad". Pero Jesús declara: "YO SOY la verdad". La esclavitud más profunda no tiene cadenas visibles, vive en los patrones y miedos. Y la libertad sólo viene de conocer a una Persona.',
                    xpReward: 10,
                    trophyReward: 2,
                },
                {
                    id: 'jr-w3-lun',
                    type: 'devotional',
                    title: 'Lunes: Condenación',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 8:1-11',
                    passage: 'A la mujer sorprendida en adulterio, la traen para apedrearla. Jesús desbarata a los jueces y queda solo con ella. "Tampoco yo te condeno. Vete, y no peques más." Él pone primero el perdón, y eso es lo que detona el cambio.',
                    question: '¿Tienes áreas donde te has autocondenado tanto que no dejas que Jesús te diga "tampoco yo te condeno"?',
                    application: 'Si hay alguien a quien has estado juzgando o "apedreando mentalmente", decide soltar hoy esa piedra. Ora por su bienestar.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w3-mie',
                    type: 'devotional',
                    title: 'Miércoles: Prisión',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 8:31-36',
                    passage: '"Todo aquel que hace pecado, esclavo es del pecado". Las barreras invisibles. "Si permaneciereis en mi palabra... seréis libres". La libertad no es magia instantánea, es el fruto de permanecer (quedarse, persistir).',
                    question: '¿En qué área sigues siendo esclavo (malos hábitos, miedos)? ¿Qué significaría "permanecer" en la verdad allí?',
                    application: 'Fija un versículo clave en la mente; repítelo cada vez que enfrentes tu tentación o ansiedad esta semana.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w3-vie',
                    type: 'devotional',
                    title: 'Viernes: El Mapa',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 14:1-11',
                    passage: 'Sus discípulos están en pánico antes de la cruz. Él les calma y Tomás pregunta por el camino. "Yo soy el camino, la verdad y la vida". Jesús no te da un método o un mapa espiritual. Acercarse a Dios requiere acercarse a Él.',
                    question: '¿Qué otros "caminos" has probado para intentar encontrar sentido o eliminar tu vacío interior?',
                    application: 'Envía un mensaje hoy a alguien diciéndole por qué Jesús es "Camino" para ti en tu vida diaria.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w3-prac',
                    type: 'practice',
                    title: 'Sábado en Grupo',
                    subtitle: 'Dinámica y Charadas',
                    reflection: 'Compartan en grupo: "Antes de seguir a Jesús de verdad, yo buscaba paz y dirección en ___". Oren reemplazando esa fuente por Él.',
                    charadas: [
                        { word: 'Arrojar la piedra', category: 'evento', difficulty: 'medio' },
                        { word: 'Tampoco yo te condeno', category: 'frase', difficulty: 'dificil' },
                        { word: 'Yo soy el camino', category: 'frase', difficulty: 'facil' },
                        { word: 'Esclavo del pecado', category: 'concepto', difficulty: 'medio' },
                        { word: 'Tomás', category: 'personaje', difficulty: 'facil' },
                    ],
                    xpReward: 20,
                    trophyReward: 10,
                },
                {
                    id: 'jr-w3-quiz',
                    type: 'quiz',
                    title: 'Reto de la Semana',
                    subtitle: 'Quiz Final',
                    quiz: {
                        questions: [
                            {
                                question: 'Según la lectura, ¿qué querían hacerle los jueces a la mujer sorprendida en adulterio?',
                                options: [
                                    { text: 'Perdonarla', correct: false },
                                    { text: 'Llevarla a la cárcel', correct: false },
                                    { text: 'Apedrearla', correct: true },
                                    { text: 'Cobrarle dinero', correct: false },
                                ]
                            },
                            {
                                question: '¿Qué le dijo Jesús a la mujer que había sido sorprendida en adulterio?',
                                options: [
                                    { text: 'Vuelve con tu marido', correct: false },
                                    { text: 'Tampoco yo te condeno. Vete, y no peques más', correct: true },
                                    { text: 'Haz sacrificios por el perdón', correct: false },
                                    { text: 'Eres la peor pecadora', correct: false },
                                ]
                            },
                            {
                                question: 'Completa la frase que dice Jesús: "Todo aquel que hace pecado, __________ es del pecado".',
                                options: [
                                    { text: 'Jefe', correct: false },
                                    { text: 'Enemigo', correct: false },
                                    { text: 'Esclavo', correct: true },
                                    { text: 'Socio', correct: false },
                                ]
                            },
                            {
                                question: 'El devocional explica que la libertad no es magia instantánea, sino que es el fruto de...',
                                options: [
                                    { text: 'Ayunar 40 días', correct: false },
                                    { text: 'Ofrendar mucho', correct: false },
                                    { text: 'Permanecer en Su palabra', correct: true },
                                    { text: 'Esconder los errores', correct: false },
                                ]
                            },
                            {
                                question: '¿Qué dijo Jesús a Tomás en respuesta sobre cómo llegar a Dios?',
                                options: [
                                    { text: 'Sigan los 10 pasos puros', correct: false },
                                    { text: 'Yo soy el camino, la verdad y la vida', correct: true },
                                    { text: 'Busquen dentro de sí mismos', correct: false },
                                    { text: 'La religión es el único mapa', correct: false },
                                ]
                            }
                        ]
                    },
                    xpReward: 30,
                    trophyReward: 15,
                }
            ]
        },
        // --- SEMANA 4 ---
        {
            id: 'jr-w4',
            weekNumber: 4,
            title: 'Jesús Vive y Llama',
            theme: 'Juan 19 y 20',
            nodes: [
                {
                    id: 'jr-w4-intro',
                    type: 'intro',
                    title: 'Consumado Es',
                    subtitle: 'Lectura Fundamental',
                    bibleRef: 'Juan 19:30 y 20',
                    passage: 'La cruz no fue una tragedia con giro final, fue una misión cumplida: el pago total de deudas. Y la resurrección no es solo volver a vivir; es escuchar tu propio nombre en medio del dolor.',
                    xpReward: 10,
                    trophyReward: 2,
                },
                {
                    id: 'jr-w4-lun',
                    type: 'devotional',
                    title: 'Lunes: Pago Completo',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 19:14-30',
                    passage: '"Consumado es" (Tetelestai). En Roma, esta palabra se ponía sobre actas de deuda que ya habían sido canceladas al 100%. Jesús no gritó preguntando por qué, sino proclamando una victoria administrativa: deuda pagada.',
                    question: '¿Qué culpa o vergüenza específica necesitas depositar en la cruz porque Jesús ya gritó "Consumado es" sobre ella?',
                    application: 'Ora en silencio. Repite la frase "Consumado es". Acepta que no tienes que pagarle nada más a Dios, Él ya lo pagó por ti.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w4-mie',
                    type: 'devotional',
                    title: 'Miércoles: Tu Nombre',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 20:1-18',
                    passage: 'María Magdalena lloraba. Piensa que Jesús es el jardinero. Él solo le dice: "María". Y se le abren los ojos. La prueba más grande de que Jesús vive no es teológica, es que te llama por tu nombre en medio de tu dolor.',
                    question: '¿En qué momentos has estado "llorando en el jardín", pidiendo soluciones, pero ciego de que Jesús ha estado de pie frente a ti?',
                    application: 'Saca 5 a 10 minutos de total silencio esta semana solo para intentar escuchar Su voz hacia ti.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w4-vie',
                    type: 'devotional',
                    title: 'Viernes: Cicatrices',
                    subtitle: 'Devocional',
                    bibleRef: 'Juan 20:19-29',
                    passage: 'Tomás no creía por habladurías; quería pruebas físicas. Y Jesús, en lugar de expulsarlo, se le presenta y le muestra sus cicatrices. Jesús resucitó victorioso, pero retuvo sus heridas mortales. Él entiende nuestro dolor.',
                    question: '¿Eres de los que necesita pruebas? ¿Qué cicatrices te ha mostrado Jesús en tu propia historia para probar su fidelidad?',
                    application: 'Identifica una "cicatriz" (una herida del pasado que Dios sanó) y usa eso este fin de semana para animar a alguien vivo.',
                    xpReward: 15,
                    trophyReward: 5,
                },
                {
                    id: 'jr-w4-prac',
                    type: 'practice',
                    title: 'Sábado en Grupo',
                    subtitle: 'Dinámica y Charadas',
                    reflection: 'Cierren compartiendo las cicatrices sanadas. Si alguien aún sangra en un tema, oren con fe porque sirven al Resucitado.',
                    charadas: [
                        { word: 'La crucifixión', category: 'evento', difficulty: 'facil' },
                        { word: 'Sepulcro vacío', category: 'concepto', difficulty: 'facil' },
                        { word: 'María Magdalena', category: 'personaje', difficulty: 'medio' },
                        { word: 'Consumado es', category: 'frase', difficulty: 'medio' },
                        { word: 'Las heridas de Jesús', category: 'concepto', difficulty: 'dificil' },
                    ],
                    xpReward: 20,
                    trophyReward: 10,
                },
                {
                    id: 'jr-w4-quiz',
                    type: 'quiz',
                    title: 'Reto de la Semana',
                    subtitle: 'Quiz Final',
                    quiz: {
                        questions: [
                            {
                                question: 'En la cruz, Jesús usó la palabra "Tetelestai" (Consumado es), que en Roma se usaba para...',
                                options: [
                                    { text: 'Dar inicio a un imperio', correct: false },
                                    { text: 'Pedirle perdón a Dios', correct: false },
                                    { text: 'Poner sobre actas de deudas pagadas al 100%', correct: true },
                                    { text: 'Describir a los que morían', correct: false },
                                ]
                            },
                            {
                                question: '¿A quién confundió María Magdalena con el jardinero mientras lloraba?',
                                options: [
                                    { text: 'A Pedro', correct: false },
                                    { text: 'A Jesús resucitado', correct: true },
                                    { text: 'A Juan el Bautista', correct: false },
                                    { text: 'A un centurión', correct: false },
                                ]
                            },
                            {
                                question: 'Según la lectura del miércoles, ¿qué destraba los ojos de María Magdalena para que logre reconocer a Jesús?',
                                options: [
                                    { text: 'Cuando Él le muestra sus cicatrices', correct: false },
                                    { text: 'Cuando ella ve los ángeles', correct: false },
                                    { text: 'Él la llama por Su nombre: "María"', correct: true },
                                    { text: 'El sonido de una trompeta', correct: false },
                                ]
                            },
                            {
                                question: '¿Qué hizo Jesús ante Tomás cuando este quiso pruebas de su resurrección?',
                                options: [
                                    { text: 'Lo reprendió fuertemente', correct: false },
                                    { text: 'Lo sacó del grupo', correct: false },
                                    { text: 'Le mostró sus cicatrices', correct: true },
                                    { text: 'Hizo fuego del cielo', correct: false },
                                ]
                            },
                            {
                                question: 'El devocional explica que Jesús retuvo sus heridas mortales después de resucitado porque:',
                                options: [
                                    { text: 'Eran un castigo eterno', correct: false },
                                    { text: 'Él entiende nuestro dolor', correct: true },
                                    { text: 'Se olvidó de sanarlas', correct: false },
                                    { text: 'Así asustaba a los romanos', correct: false },
                                ]
                            }
                        ]
                    },
                    xpReward: 30,
                    trophyReward: 15,
                }
            ]
        }
    ]
};

export const STUDY_PATHS: StudyPath[] = [JESUS_REAL_PATH];

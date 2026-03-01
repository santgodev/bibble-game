/**
 * modules/charadas/data/categories.ts
 *
 * Fuente centralizada de todas las categorías y palabras del juego de Charadas Bíblicas.
 * Integrado dentro de adn-impact como módulo autónomo.
 *
 * Estas definiciones son compartidas entre:
 * - El panel web (adn-impact)
 * - La app móvil (charadasbiblicas)
 *
 * Para mantener unicidad: editar SOLO aquí; la app móvil consume desde su propio
 * archivo local que debe mantenerse sincronizado con este.
 */

// ─────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────

export interface CharadaCard {
    word: string;
    verse?: string;
    description?: string;
    mime?: string;
    category?: string;
    difficulty?: 'facil' | 'medio' | 'dificil';
    title?: string;
    onShowSound?: 'wrong' | 'correct';
    bgMusic?: string;
}

export interface UnleashQuestion {
    q: string;
    options: string[];
    correctIndex: number;
}

export interface CharadaCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    difficulty: 'Fácil' | 'Medio' | 'Difícil';
    words: (string | CharadaCard)[];
    unleashQuiz?: UnleashQuestion[];
    isLocked?: boolean;
    requiredMissions?: string[]; // IDs de misiones necesarias para desbloquear
}

// ─────────────────────────────────────────────────────────
// CATEGORÍAS POR DEFECTO
// ─────────────────────────────────────────────────────────

export const DEFAULT_CHARADA_CATEGORIES: CharadaCategory[] = [
    {
        id: 'biblia_basica',
        title: 'Biblia Básica',
        description: 'Juega y diviértete sin bloqueos. Palabras fáciles de toda la Biblia.',
        icon: '🕊️',
        color: '#27AE60',
        difficulty: 'Fácil',
        isLocked: false,
        words: [
            'Arca de Noé', 'Adán y Eva', 'Rey David', 'Goliat', 'Moisés',
            'Mar Rojo', '10 Mandamientos', 'La Cruz', 'Jesús', 'María',
            'Apóstol Pedro', 'El Pesebre', 'La Última Cena', 'Sansón', 'Rey Salomón',
            'Foso de los Leones', 'Jonás y la ballena', 'El Paraíso', 'Un Diluvio',
            'Sodoma y Gomorra', 'Lázaro', 'Panes y Peces', 'Espíritu Santo',
            'El Templo', 'Jerusalén', 'El Ángel Gabriel', 'La Virgen María',
            'Apóstol Juan', 'El Buen Samaritano', 'El Hijo Pródigo', 'El Apocalipsis',
            'Fruto del Espíritu', 'Manzana Prohibida', 'La Serpiente', 'Corona de Espinas',
            'Zaqueo', 'Apóstol Pablo', 'Arcángel Miguel'
        ]
    },
    {
        id: 'bib_juan1',
        title: 'Juan: Semana 1',
        description: 'Jesús es Dios — Basado en Juan 1.',
        icon: '📖',
        color: '#9B59B6',
        difficulty: 'Fácil',
        isLocked: true,
        requiredMissions: ['jr-w1-intro'],
        unleashQuiz: [
            { q: '¿Cómo llama Juan a Jesús en el versículo inicial?', options: ['El Elegido', 'El Verbo', 'El Profeta', 'El Sabio'], correctIndex: 1 },
            { q: 'En griego "habitó entre nosotros" significa que...', options: ['Construyó un templo', 'Llovió del cielo', 'Puso su tienda en nuestro barrio', 'Se hizo invisible'], correctIndex: 2 },
            { q: '¿A los que creyeron en Él, les dio potestad de ser hechos...?', options: ['Ángeles', 'Hijos de Dios', 'Reyes magos', 'Sirvientes'], correctIndex: 1 },
            { q: 'El Verbo habitó entre nosotros lleno de...', options: ['Gracia y Verdad', 'Ira y Justicia', 'Luz y Sombras', 'Poder y Gloria'], correctIndex: 0 },
            { q: 'El Verbo no solo diseñó las galaxias sino también...', options: ['El mar Rojo', 'El arca', 'El ADN', 'El Edén'], correctIndex: 2 }
        ],
        words: [
            { word: 'El Verbo', category: 'título', difficulty: 'medio', description: 'Aquel que existía desde el principio.' },
            { word: 'La Luz', category: 'concepto', difficulty: 'facil', description: 'Brilla en medio de las tinieblas.' },
            { word: 'Las Tinieblas', category: 'concepto', difficulty: 'facil', description: 'La oscuridad espiritual.' },
            { word: 'Juan el Bautista', category: 'personaje', difficulty: 'facil', description: 'La voz que clamaba en el desierto.' },
            { word: 'El Cordero de Dios', category: 'título', difficulty: 'medio', description: 'Aquel que quita el pecado del mundo.' },
            { word: 'La Paloma', category: 'símbolo', difficulty: 'facil', description: 'Forma que tomó el Espíritu Santo.' },
            { word: 'Espíritu Santo', category: 'deidad', difficulty: 'facil', description: 'Tercera persona de la Trinidad.' },
            { word: 'Andrés', category: 'personaje', difficulty: 'medio', description: 'Hermano de Simón Pedro.' },
            { word: 'Simón Pedro', category: 'personaje', difficulty: 'facil', description: 'El apóstol pescador.' },
            { word: 'Cefas', category: 'título', difficulty: 'dificil', description: 'Significa "Piedra" en arameo.' },
            { word: 'Felipe', category: 'personaje', difficulty: 'medio', description: 'Llamó a Natanael a ver a Jesús.' },
            { word: 'Natanael', category: 'personaje', difficulty: 'medio', description: 'Estaba debajo de la higuera.' },
            { word: 'Debajo de la Higuera', category: 'lugar', difficulty: 'dificil', description: 'Donde Jesús vio a Natanael.' },
            { word: 'Cielo Abierto', category: 'evento', difficulty: 'medio', description: 'Visión prometida a los creyentes.' },
            { word: 'Hijos de Dios', category: 'concepto', difficulty: 'medio', description: 'Potestad dada a los que creen.' },
            { word: 'El Verbo se hizo carne', category: 'frase', difficulty: 'dificil', description: 'El misterio de la encarnación.' },
            { word: 'La Creación', category: 'evento', difficulty: 'facil', description: 'Hecha por medio del Verbo.' },
            { word: 'Rey de Israel', category: 'título', difficulty: 'medio', description: 'Confesión de fe de Natanael.' }
        ]
    },
    {
        id: 'bib_juan2',
        title: 'Juan: Semana 2',
        description: 'Jesús Transforma — Basado en Juan 2 y 4.',
        icon: '💧',
        color: '#3498DB',
        difficulty: 'Medio',
        isLocked: true,
        requiredMissions: ['jr-w1-quiz', 'jr-w2-intro'],
        unleashQuiz: [
            { q: 'El primer milagro nos da una lección sobre:', options: ['El poder del agua', 'La importancia del vino', 'La obediencia de los sirvientes', 'Cómo organizar fiestas'], correctIndex: 2 },
            { q: '¿A quién buscó Jesús al mediodía en el pozo?', options: ['A Nicodemo', 'A Sus discípulos', 'A la mujer samaritana', 'A un centurión romano'], correctIndex: 2 },
            { q: 'Jesús empezó predicándole con...', options: ['Una limosna', 'Una necesidad (Agua)', 'Un regaño', 'Una oración'], correctIndex: 1 },
            { q: '¿Cuántos matrimonios fallidos tenía la mujer?', options: ['Dos', 'Siete', 'Ninguno', 'Cinco'], correctIndex: 3 },
            { q: 'Jesús sacó a la luz la vida de la mujer para:', options: ['Juzgarla', 'Liberarla', 'Que llorara', 'Cobrarle'], correctIndex: 1 }
        ],
        words: [
            'Las bodas de Caná', 'Agua en vino', 'La mujer samaritana',
            'Cinco maridos', 'Agua viva', 'Seis tinajas de piedra',
            'El maestresala', 'El pozo de Jacob', 'Cántaro de agua',
            'Samaria', 'Los judíos', 'Verdaderos adoradores',
            'En espíritu y en verdad', 'El Mesías', 'Cosecha blanca'
        ]
    },
    {
        id: 'bib_juan3',
        title: 'Juan: Semana 3',
        description: 'Jesús es la Verdad — Basado en Juan 8 y 14.',
        icon: '⚖️',
        color: '#E67E22',
        difficulty: 'Medio',
        isLocked: true,
        requiredMissions: ['jr-w2-quiz', 'jr-w3-intro'],
        unleashQuiz: [
            { q: '¿Qué querían hacerle a la mujer adúltera?', options: ['Perdonarla', 'Llevarla a la cárcel', 'Apedrearla', 'Cobrarle dinero'], correctIndex: 2 },
            { q: '¿Qué le dijo Jesús a la mujer?', options: ['Vuelve con tu marido', 'Tampoco yo te condeno. Vete, y no peques más', 'Haz sacrificios', 'Eres la peor pecadora'], correctIndex: 1 },
            { q: 'Todo aquel que hace pecado, __________ es del pecado.', options: ['Jefe', 'Enemigo', 'Esclavo', 'Socio'], correctIndex: 2 },
            { q: 'La libertad es el fruto de...', options: ['Ayunar 40 días', 'Ofrendar mucho', 'Permanecer en Su palabra', 'Esconder los errores'], correctIndex: 2 },
            { q: 'Respuesta de Jesús a Tomás:', options: ['Sigan los 10 pasos', 'Yo soy el camino, la verdad y la vida', 'Busquen dentro de sí mismos', 'La religión es el único mapa'], correctIndex: 1 }
        ],
        words: [
            'Arrojar la piedra', 'Tampoco yo te condeno', 'Yo soy el camino',
            'Esclavo del pecado', 'Tomás', 'La mujer adúltera',
            'Dedo en la tierra', 'El que esté libre de pecado',
            'La luz del mundo', 'Conoceréis la verdad', 'Hijos de Abraham',
            'Padre de mentira', 'Voy a preparar lugar', 'La casa de mi Padre',
            'Felipe y Jesús', 'El Consolador'
        ]
    },
    {
        id: 'bib_juan4',
        title: 'Juan: Semana 4',
        description: 'Jesús Vive — Basado en Juan 19 y 20.',
        icon: '✝️',
        color: '#E74C3C',
        difficulty: 'Difícil',
        isLocked: true,
        requiredMissions: ['jr-w3-quiz', 'jr-w4-intro'],
        unleashQuiz: [
            { q: '"Tetelestai" (Consumado es) en Roma significaba:', options: ['Dar inicio a un imperio', 'Pedir perdón a Dios', 'Poner sobre actas de deudas pagadas al 100%', 'Describir a los que morían'], correctIndex: 2 },
            { q: '¿A quién confundió María Magdalena con el jardinero?', options: ['A Pedro', 'A Jesús resucitado', 'A Juan el Bautista', 'A un centurión'], correctIndex: 1 },
            { q: '¿Qué destraba los ojos de María?', options: ['Sus cicatrices', 'Los ángeles', 'Él la llama por su nombre: "María"', 'Una trompeta'], correctIndex: 2 },
            { q: '¿Qué hizo Jesús ante Tomás?', options: ['Lo reprendió', 'Lo sacó del grupo', 'Le mostró sus cicatrices', 'Hizo fuego del cielo'], correctIndex: 2 },
            { q: 'Jesús retuvo sus heridas porque:', options: ['Eran un castigo eterno', 'Él entiende nuestro dolor', 'Se olvidó de sanarlas', 'Así asustaba a los romanos'], correctIndex: 1 }
        ],
        words: [
            'La crucifixión', 'Sepulcro vacío', 'María Magdalena',
            'Consumado es', 'Las heridas de Jesús', 'Pilato',
            'Corona de espinas', 'Manto de púrpura', 'Rey de los judíos',
            'El Gólgota', 'Echando suertes', 'La túnica',
            'Sed tengo', 'José de Arimatea', 'Nicodemo',
            'Lino limpio', 'Domingo de resurrección', 'Raboni',
            'El costado traspasado', 'Santo Tomás'
        ]
    }
];

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

/** Retorna una categoría por su ID */
export const getCategoryById = (id: string): CharadaCategory | undefined =>
    DEFAULT_CHARADA_CATEGORIES.find(c => c.id === id);

/** Retorna todas las palabras de una categoría como strings */
export const getWordsAsStrings = (category: CharadaCategory): string[] =>
    category.words.map(w => typeof w === 'string' ? w : w.word);

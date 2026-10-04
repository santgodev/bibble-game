// Nivel de dificultad universal
export type DifficultyLevel = 1 | 2 | 3; // 1: Semilla, 2: Discípulo, 3: Maestro

export interface WordItem {
    id?: string;
    word: string;
    difficulty?: DifficultyLevel;
    verseRef?: string;
    description?: string;
    impostorHints?: string[]; // Pistas para ayudar a inocentes en nivel semilla
}

export interface TriviaQuestion {
    id?: string;
    question: string;
    options: string[];
    correctIndex: number; 
    difficulty?: DifficultyLevel;
    explanation?: string; 
    verseSupport?: string; 
}

export interface BiteSizedDevotional {
    id: string;
    seasonId: string;
    dayNumber: number;
    title: string;
    verseText: string;
    reflection: string;
    challengeAction: string;
    
    microQuiz: {
        question: string;
        options: string[];
        correctIndex: number;
    };
    
    rewards: {
        xp: number;
        unlocksCategorySlug?: string;
    };
}

export interface CharadaCard {
    word: string;
    verse?: string;
    description?: string;
    mime?: string;
    category?: string;
    difficulty?: string | DifficultyLevel; 
    title?: string;
    capitulo?: string;
    thread?: string;
    exegesis?: string;
    oldTestament?: { ref: string; text: string }[];
    symbology?: { item: string; meaning: string }[];
    onShowSound?: string; 
    bgMusic?: string; 
    impostorHints?: string[]; 
}

export interface UnleashQuestion {
    q: string;
    options: string[];
    correctIndex: number;
}

export interface Category {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    words: (string | CharadaCard | WordItem)[];
    trivia?: TriviaQuestion[]; 
    difficulty: 'Fácil' | 'Medio' | 'Difícil' | DifficultyLevel;
    isCustom?: boolean;
    image?: any; 
    capitulo?: string; 
    gradientColors?: string[]; 
    backgroundImage?: any; 
    hideCamera?: boolean; 
    subcategories?: Category[]; 
    unleashQuiz?: UnleashQuestion[]; 
    slug?: string; 
}

import {
    WORDS_PERSONAJES_AT, WORDS_PERSONAJES_NT, WORDS_ANIMALES, WORDS_LUGARES,
    WORDS_OBJETOS, WORDS_COMIDA, WORDS_HISTORIAS, WORDS_NAVIDAD, WORDS_ALABANZAS,
} from './words_simple';
import { TRIVIA_GENERAL } from './trivia_general';
import { TRIVIA_PERSONAJES } from './trivia_personajes';
import { TRIVIA_ANTIGUO } from './trivia_antiguo';
import { TRIVIA_NUEVO } from './trivia_nuevo';
import { WORDS_GENERAL } from './words_general';
import { WORDS_PERSONAJES } from './words_personajes';
import { WORDS_ANTIGUO } from './words_antiguo';
import { WORDS_NUEVO } from './words_nuevo';

/**
 * PALETA DE COLORES PREMIUM (Elegante y Biblica)
 * - Gold / Navy / Crimson / Forest
 */
// Categorías de TRIVIA (conservan sus preguntas; sin Pentateuco)
export const TRIVIA_CATEGORIES: Category[] = [
    {
        id: 'biblia_general',
        slug: 'biblia_general',
        title: 'BIBLIA GENERAL',
        capitulo: 'La Palabra Viva',
        description: 'Fundamentos de la fe con preguntas esenciales.',
        icon: 'book',
        color: '#FFD700', // Sacred Gold
        gradientColors: ['#0A0A05', '#2C2307', '#0A0A05'], 
        difficulty: 1,
        image: null,
        trivia: TRIVIA_GENERAL,
        words: WORDS_GENERAL
    },
    {
        id: 'personajes_biblicos',
        slug: 'personajes_biblicos',
        title: 'PERSONAJES',
        capitulo: 'Héroes y Profetas',
        description: 'Grandes hombres y mujeres que marcaron la historia.',
        icon: 'people',
        color: '#00D4FF', // Divine Sapphire
        gradientColors: ['#040815', '#0A2472', '#040815'], 
        difficulty: 1,
        image: null,
        trivia: TRIVIA_PERSONAJES,
        words: WORDS_PERSONAJES
    },
    {
        id: 'antiguo_testamento',
        slug: 'antiguo_testamento',
        title: 'ANTIGUO TESTAMENTO',
        capitulo: 'Génesis a Malaquías',
        description: 'La historia divina antes de Cristo.',
        icon: 'library',
        color: '#FFA500', // Prophetic Amber
        gradientColors: ['#1A0F05', '#4E342E', '#1A0F05'], 
        difficulty: 2,
        image: null,
        trivia: TRIVIA_ANTIGUO,
        words: WORDS_ANTIGUO
    },
    {
        id: 'nuevo_testamento',
        slug: 'nuevo_testamento',
        title: 'NUEVO TESTAMENTO',
        capitulo: 'Evangelios y Cartas',
        description: 'Jesús y el nacimiento de la Iglesia.',
        icon: 'flame',
        color: '#FF3D00', // Apostolic Crimson (Blood of the Lamb)
        gradientColors: ['#150505', '#450000', '#150505'], 
        difficulty: 3,
        image: null,
        subcategories: [
            {
                id: 'nt_todo',
                title: 'TODO EL NUEVO TESTAMENTO',
                description: 'Desafío completo desde los Evangelios hasta el Apocalipsis.',
                icon: 'flame',
                color: '#FF3D00',
                difficulty: 3,
                trivia: TRIVIA_NUEVO,
                words: WORDS_NUEVO
            },
            {
                id: 'nt_mateo',
                title: 'MATEO',
                description: 'El Mesías prometido y el Sermón del Monte.',
                icon: 'book',
                color: '#FFD700',
                difficulty: 1,
                trivia: TRIVIA_NUEVO.filter(q => q.id?.startsWith('mat')),
                words: WORDS_NUEVO.filter(w => typeof w === 'object' && (w as any).id?.startsWith('mat'))
            },
            {
                id: 'nt_marcos',
                title: 'MARCOS',
                description: 'Jesús como el Siervo sufriente y el Hijo de Dios.',
                icon: 'flash',
                color: '#E91E63',
                difficulty: 2,
                trivia: TRIVIA_NUEVO.filter(q => q.id?.startsWith('mar')),
                words: WORDS_NUEVO.filter(w => typeof w === 'object' && (w as any).id?.startsWith('mar'))
            },
            {
                id: 'nt_lucas',
                title: 'LUCAS',
                description: 'El Salvador compasivo y las parábolas de misericordia.',
                icon: 'heart',
                color: '#2196F3',
                difficulty: 2,
                trivia: TRIVIA_NUEVO.filter(q => q.id?.startsWith('luc')),
                words: WORDS_NUEVO.filter(w => typeof w === 'object' && (w as any).id?.startsWith('luc'))
            },
            {
                id: 'nt_juan',
                title: 'JUAN',
                description: 'El Verbo hecho carne y las siete señales.',
                icon: 'water',
                color: '#00BCD4',
                difficulty: 3,
                trivia: TRIVIA_NUEVO.filter(q => q.id?.startsWith('jua')),
                words: WORDS_NUEVO.filter(w => typeof w === 'object' && (w as any).id?.startsWith('jua'))
            },
            {
                id: 'nt_cartas',
                title: 'HECHOS Y CARTAS',
                description: 'La expansión de la Iglesia y las epístolas de Pablo.',
                icon: 'mail',
                color: '#8BC34A',
                difficulty: 3,
                trivia: TRIVIA_NUEVO.filter(q => q.id?.startsWith('nt_hch') || q.id?.startsWith('hch')),
                words: WORDS_NUEVO.filter(w => typeof w === 'object' && (w as any).id?.startsWith('nt_hch'))
            }
        ],
        trivia: TRIVIA_NUEVO,
        words: WORDS_NUEVO
    }
];

/** Compatibilidad: el nombre anterior apunta a las categorías de trivia. */
export const DEFAULT_CATEGORIES: Category[] = TRIVIA_CATEGORIES;

/**
 * CATEGORÍAS SIMPLES para Charadas e Impostor.
 * Temas cotidianos y palabras que todos conocen. Todo local, sin internet.
 */
const simple = (
    id: string, title: string, description: string, icon: string, color: string,
    words: string[], capitulo: string,
): Category => ({
    id, slug: id, title, description, icon, color, capitulo,
    difficulty: 1, words,
});

export const SIMPLE_CATEGORIES: Category[] = [
    simple('personajes_at', 'PERSONAJES DEL ANTIGUO TESTAMENTO', 'Adán, Noé, David, Moisés y más.', 'people', '#00D4FF', WORDS_PERSONAJES_AT, 'Los famosos de siempre'),
    simple('personajes_nt', 'PERSONAJES DEL NUEVO TESTAMENTO', 'Jesús, Pedro, Pablo y los apóstoles.', 'person', '#FF7043', WORDS_PERSONAJES_NT, 'Jesús y sus amigos'),
    simple('animales', 'ANIMALES', 'León, serpiente, paloma, ballena…', 'paw', '#8BC34A', WORDS_ANIMALES, 'Los que salen en la Biblia'),
    simple('lugares', 'LUGARES', 'Belén, Jerusalén, el Mar Rojo…', 'map', '#FFA726', WORDS_LUGARES, 'Dónde pasó todo'),
    simple('objetos', 'COSAS Y OBJETOS', 'Arca, honda, cruz, corona…', 'cube', '#AB47BC', WORDS_OBJETOS, 'Cosas que reconoces'),
    simple('comida', 'COMIDA', 'Pan, pescado, uvas, miel…', 'restaurant', '#EF5350', WORDS_COMIDA, 'Lo que se comía'),
    simple('historias', 'HISTORIAS FAMOSAS', 'David y Goliat, el diluvio, Jonás…', 'book', '#26A69A', WORDS_HISTORIAS, 'Las que todos conocen'),
    simple('navidad_pascua', 'NAVIDAD Y PASCUA', 'Estrella, pesebre, reyes magos…', 'star', '#FFD54F', WORDS_NAVIDAD, 'Fechas especiales'),
    simple('alabanzas', 'ALABANZAS FAMOSAS', 'Marcos Witt, JAR, Miel San Marcos, Hillsong…', 'musical-notes', '#E91E63', WORDS_ALABANZAS, 'Canciones que todos cantan'),
];

export type GameMode = 'trivia' | 'charadas' | 'impostor';

export const getCategories = async (game: GameMode = 'trivia'): Promise<Category[]> => {
    return game === 'trivia' ? TRIVIA_CATEGORIES : SIMPLE_CATEGORIES;
};

export const deleteCategory = async (id: string): Promise<void> => {
    // Basic mock implementation for now
};

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
export const DEFAULT_CATEGORIES: Category[] = [
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
        trivia: TRIVIA_NUEVO,
        words: WORDS_NUEVO
    }
];

export const getCategories = async (): Promise<Category[]> => {
    return DEFAULT_CATEGORIES;
};

export const deleteCategory = async (id: string): Promise<void> => {
    // Basic mock implementation for now
};

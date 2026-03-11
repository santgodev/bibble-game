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
    // New fields for classification
    category?: string;
    difficulty?: string | DifficultyLevel; // Compatible con nueva API
    // New fields for Apocalipsis
    title?: string;
    capitulo?: string;
    thread?: string;
    exegesis?: string;
    oldTestament?: { ref: string; text: string }[];
    symbology?: { item: string; meaning: string }[];
    // Audio triggers
    onShowSound?: string; // 'wrong', 'correct', etc.
    bgMusic?: string; // filename from assets/sounds
    impostorHints?: string[]; // Para retrospectiva
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
    trivia?: TriviaQuestion[]; // NUEVO: Soporte para trivia
    difficulty: 'Fácil' | 'Medio' | 'Difícil' | DifficultyLevel;
    isCustom?: boolean;
    image?: any; // For require() or uri
    capitulo?: string; // Optional chapter number/title for minimalist cover
    gradientColors?: string[]; // Linear Gradient colors
    backgroundImage?: any; // Optional full bg image
    hideCamera?: boolean; // If true, do not show camera preview/record
    subcategories?: Category[]; // Nested categories for grouping
    unleashQuiz?: UnleashQuestion[]; // Preguntas requeridas para desbloquear la categoría
    slug?: string; // Slug para identificar categorías entre DB y Local
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export const DEFAULT_CATEGORIES: Category[] = [
    {
        id: 'biblia_basica',
        title: 'Biblia Básica',
        capitulo: 'Modo Libre',
        description: 'Juega y diviértete sin bloqueos. Palabras fáciles de toda la Biblia.',
        icon: '🕊️',
        color: '#27AE60',
        difficulty: 'Fácil' as const,
        image: null,
        trivia: [
            {
                question: '¿Quién construyó un arca de madera enorme para salvar a su familia y del diluvio?',
                options: ['Moisés', 'Abraham', 'Noé', 'David'],
                correctIndex: 2,
                difficulty: 1,
                explanation: 'Dios le ordenó a Noé construir el arca para salvar a su familia y especies de animales.',
                verseSupport: 'Génesis 6:14'
            },
            {
                question: '¿Qué joven pastor derrotó al gigante filisteo con una honda y una piedra?',
                options: ['Salomón', 'David', 'Saúl', 'Jonatán'],
                correctIndex: 1,
                difficulty: 1,
                explanation: 'David, siendo joven, confió en el nombre de Dios para vencer a Goliat.',
                verseSupport: '1 Samuel 17:49'
            },
            {
                question: '¿Qué animal habló con Eva en el jardín del Edén?',
                options: ['Un león', 'Una serpiente', 'Un cuervo', 'Un burro'],
                correctIndex: 1,
                difficulty: 1,
                explanation: 'La serpiente era más astuta que todos los animales del campo y engañó a Eva.',
                verseSupport: 'Génesis 3:1'
            },
            {
                question: '¿Cuántos panes y peces multiplicó Jesús para alimentar a los 5000?',
                options: ['7 panes y 3 peces', '5 panes y 2 peces', '3 panes y 2 peces', '10 panes y 5 peces'],
                correctIndex: 1,
                difficulty: 2,
                explanation: 'Un niño entregó su almuerzo de 5 panes de cebada y 2 pececillos que Jesús multiplicó.',
                verseSupport: 'Juan 6:9'
            },
            {
                question: '¿A qué tribu de Israel pertenecía el rey Saúl (el primer rey)?',
                options: ['Judá', 'Leví', 'Benjamín', 'Efraín'],
                correctIndex: 2,
                difficulty: 3,
                explanation: 'Saúl era hijo de Cis, varón de la tribu más pequeña, Benjamín.',
                verseSupport: '1 Samuel 9:1'
            }
        ],
        words: [
            'El Arca', 'Adán', 'Eva', 'Rey David', 'Goliat', 'Moisés',
            'Mar Rojo', 'Mandamientos', 'La Cruz', 'Jesús', 'María',
            'Pedro', 'El Pesebre', 'Última Cena', 'Sansón', 'Salomón',
            'Los Leones', 'La Ballena', 'El Paraíso', 'El Diluvio',
            'Sodoma', 'Lázaro', 'Panes', 'Peces', 'El Espíritu',
            'El Templo', 'Jerusalén', 'El Ángel', 'Juan',
            'El Samaritano', 'Hijo Pródigo', 'El Apocalipsis',
            'La Manzana', 'La Serpiente', 'La Corona',
            'Zaqueo', 'Pablo', 'Miguel', 'Ester', 'Gedeón',
            'Noé', 'Abraham', 'Isaac', 'Jacob', 'José y su Túnica',
            'La Torre de Babel', 'Sara', 'Rut', 'Samuel', 'Saúl',
            'Jonás', 'Daniel', 'Ezequiel', 'Isaías', 'Jeremías',
            'Mateo', 'Marcos', 'Lucas', 'Marta', 'María Magdalena',
            'Zacarías', 'Isabel', 'Juan el Bautista', 'Herodes',
            'Pilato', 'Barrabás', 'Río Jordán', 'Monte Sinaí',
            'Belén', 'Nazaret', 'Egipto', 'Tierra Prometida',
            'Muro de Jericó', 'La Zarza Ardiendo', 'Plagas de Egipto',
            'Maná', 'Arca del Testimonio', 'Tabernáculo',
            'Corona de Espinas', 'Los Clavos', 'La Resurrección',
            'Pentecostés', 'La Fe', 'Amor Cristiano', 'Perdón',
            'Oración', 'Alabanza', 'Diezmos', 'Ofrenda',
            'Túnica de Colores', 'Hondilla de David', 'Lámpara a mis pies',
        ]
    },
    {
        id: 'promo_2026',
        title: 'PROMO 2026',
        description: 'Charadas especiales para publicidad.',
        icon: '🚀',
        color: '#7F00FF',
        difficulty: 'Medio' as const,
        hideCamera: true,
        gradientColors: ['#4c1d95', '#7F00FF', '#3b82f6'],
        words: [
            { word: 'Cero Estrés 😴', onShowSound: 'wrong', description: '¿Realmente quieres esto?' },
            { word: 'Dormir Siempre 🛌💤', onShowSound: 'wrong', description: '¡Despierta!' },
            { word: 'Más Nivel 🚀🔥', bgMusic: 'main-screan.mp3', onShowSound: 'correct', description: '¡Vamos con toda!' }
        ]
    },
    {
        id: 'bib_juan_mes',
        title: 'Juan: Jesús Real',
        capitulo: 'Mes 1',
        description: 'Plan de estudio de 4 semanas.',
        icon: '📚',
        color: '#D4AF37', // Gold
        difficulty: 'Medio' as const,
        image: null,
        words: [], // Parent folder doesn't have direct words to play
        subcategories: [
            {
                id: 'bib_juan1',
                title: 'Unidad 1',
                capitulo: 'Jesús es Dios',
                description: 'Basado en Juan 1.',
                icon: '📖',
                color: '#9B59B6',
                difficulty: 'Fácil' as const,
                image: null,
                words: [
                    // Unidad 1 — Juan 1: Jesús es Dios. Palabras fáciles/visuales del capítulo
                    'Juan el Bautista',
                    'El Río Jordán',
                    'La Paloma',
                    'Pedro',
                    'Andrés',
                    'Felipe',
                    'Natanael',
                    'La Higuera',
                    'El Cordero',
                    'La Luz',
                    'Las Tinieblas',
                    'El Desierto',
                    'Los Ángeles',
                    'El Cielo Abierto',
                    'El Bautismo',
                ],
                unleashQuiz: [
                    { q: '¿Cómo llama Juan a Jesús en el versículo inicial de su evangelio?', options: ['El Elegido', 'El Verbo', 'El Profeta', 'El Sabio'], correctIndex: 1 },
                    { q: 'Según el devocional, en griego "habitó entre nosotros" significa que...', options: ['Construyó un templo', 'Llovió del cielo', 'Puso su tienda en nuestro barrio', 'Se hizo invisible'], correctIndex: 2 },
                    { q: '¿A los que creyeron en Él, les dio potestad (el derecho) de ser hechos...?', options: ['Ángeles', 'Hijos de Dios', 'Reyes magos', 'Sirvientes'], correctIndex: 1 },
                    { q: 'Según la lectura del viernes, el Verbo habitó entre nosotros lleno de...', options: ['Gracia y Verdad', 'Ira y Justicia', 'Luz y Sombras', 'Poder y Gloria'], correctIndex: 0 },
                    { q: 'El devocional del lunes menciona que el Verbo (La Persona) no solo diseñó las galaxias sino también...', options: ['El mar Rojo', 'El arca', 'El ADN', 'El Edén'], correctIndex: 2 }
                ]
            },
            {
                id: 'bib_juan2',
                title: 'Unidad 2',
                capitulo: 'Jesús Transforma',
                description: 'Juan 2 y 4.',
                icon: '💧',
                color: '#3498DB',
                difficulty: 'Medio' as const,
                image: null,
                words: [
                    // Unidad 2 — Juan 2 y 4: Bodas de Caná y la Samaritana
                    'Las Bodas',
                    'El Vino',
                    'El Agua',
                    'Las Tinajas',
                    'La Samaritana',
                    'El Pozo',
                    'El Cántaro',
                    'Los Discípulos',
                    'El Mesías',
                    'Samaria',
                    'El Campo',
                    'La Cosecha',
                    'El Novio',
                    'La Fiesta',
                    'Agua Viva',
                ],
                unleashQuiz: [
                    { q: 'Según el devocional, el primer milagro (agua en vino) nos da una gran lección sobre:', options: ['El poder del agua', 'La importancia del vino', 'La obediencia de los sirvientes', 'Cómo organizar fiestas'], correctIndex: 2 },
                    { q: 'Al pedirle agua, ¿a quién buscó Jesús intencionalmente al mediodía (con calor) en el pozo?', options: ['A Nicodemo', 'A Sus discípulos', 'A la mujer samaritana', 'A un centurión romano'], correctIndex: 2 },
                    { q: 'Jesús no empezó predicándole a la samaritana sobre moral, empezó con...', options: ['Una limosna', 'Una necesidad (Agua)', 'Un regaño', 'Una oración'], correctIndex: 1 },
                    { q: '¿Cuántos matrimonios fallidos le reveló Jesús a la mujer que ella había tenido?', options: ['Dos', 'Siete', 'Ninguno', 'Cinco'], correctIndex: 3 },
                    { q: 'El devocional explica que cuando Jesús sacó a la luz la vida de la mujer, no lo hizo para avergonzarla sino para:', options: ['Juzgarla', 'Liberarla', 'Que llorara', 'Cobrarle'], correctIndex: 1 }
                ]
            },
            {
                id: 'bib_juan3',
                title: 'Unidad 3',
                capitulo: 'Jesús es la Verdad',
                description: 'Juan 8 y 14.',
                icon: '⚖️',
                color: '#E67E22',
                difficulty: 'Medio' as const,
                image: null,
                words: [
                    // Unidad 3 — Juan 8 y 14: La adúltera, el camino y la verdad
                    'La Adúltera',
                    'Las Piedras',
                    'Tomás',
                    'Felipe',
                    'El Camino',
                    'La Verdad',
                    'La Vida',
                    'La Casa del Padre',
                    'El Consolador',
                    'La Tierra',
                    'Los Acusadores',
                    'El Esclavo',
                    'Abraham',
                    'El Padre',
                    'La Libertad',
                ],
                unleashQuiz: [
                    { q: 'Según la lectura, ¿qué querían hacerle los jueces a la mujer sorprendida en adulterio?', options: ['Perdonarla', 'Llevarla a la cárcel', 'Apedrearla', 'Cobrarle dinero'], correctIndex: 2 },
                    { q: '¿Qué le dijo Jesús a la mujer que había sido sorprendida en adulterio?', options: ['Vuelve con tu marido', 'Tampoco yo te condeno. Vete, y no peques más', 'Haz sacrificios por el perdón', 'Eres la peor pecadora'], correctIndex: 1 },
                    { q: 'Completa la frase que dice Jesús: "Todo aquel que hace pecado, __________ es del pecado".', options: ['Jefe', 'Enemigo', 'Esclavo', 'Socio'], correctIndex: 2 },
                    { q: 'El devocional explica que la libertad no es magia instantánea, sino que es el fruto de...', options: ['Ayunar 40 días', 'Ofrendar mucho', 'Permanecer en Su palabra', 'Esconder los errores'], correctIndex: 2 },
                    { q: '¿Qué dijo Jesús a Tomás en respuesta sobre cómo llegar a Dios?', options: ['Sigan los 10 pasos puros', 'Yo soy el camino, la verdad y la vida', 'Busquen dentro de sí mismos', 'La religión es el único mapa'], correctIndex: 1 }
                ]
            },
            {
                id: 'bib_juan4',
                title: 'Unidad 4',
                capitulo: 'Jesús Vive',
                description: 'Juan 19 y 20.',
                icon: '✝️',
                color: '#E74C3C',
                difficulty: 'Difícil' as const,
                image: null,
                words: [
                    // Unidad 4 — Juan 19 y 20: La cruz y la resurrección
                    'La Cruz',
                    'Pilato',
                    'María Magdalena',
                    'El Sepulcro',
                    'La Resurrección',
                    'Tomás',
                    'Las Cicatrices',
                    'La Corona de Espinas',
                    'El Gólgota',
                    'El Manto Único',
                    'Nicodemo',
                    'La Sábana',
                    'El Jardín',
                    'Los Soldados',
                    'La Lanza',
                ],
                unleashQuiz: [
                    { q: 'En la cruz, Jesús usó la palabra "Tetelestai" (Consumado es), que en Roma se usaba para...', options: ['Dar inicio a un imperio', 'Pedirle perdón a Dios', 'Poner sobre actas de deudas pagadas al 100%', 'Describir a los que morían'], correctIndex: 2 },
                    { q: '¿A quién confundió María Magdalena con el jardinero mientras lloraba?', options: ['A Pedro', 'A Jesús resucitado', 'A Juan el Bautista', 'A un centurión'], correctIndex: 1 },
                    { q: 'Según la lectura del miércoles, ¿qué destraba los ojos de María Magdalena para que logre reconocer a Jesús?', options: ['Cuando Él le muestra sus cicatrices', 'Cuando ella ve los ángeles', 'Él la llama por Su nombre: "María"', 'El sonido de una trompeta'], correctIndex: 2 },
                    { q: '¿Qué hizo Jesús ante Tomás cuando este quiso pruebas de su resurrección?', options: ['Lo reprendió fuertemente', 'Lo sacó del grupo', 'Le mostró sus cicatrices', 'Hizo fuego del cielo'], correctIndex: 2 },
                    { q: 'El devocional explica que Jesús retuvo sus heridas mortales después de resucitado porque:', options: ['Eran un castigo eterno', 'Él entiende nuestro dolor', 'Se olvidó de sanarlas', 'Así asustaba a los romanos'], correctIndex: 1 }
                ]
            }
        ]
    }
];

export const getCategories = async (): Promise<Category[]> => {
    try {
        // 1. Intentar cargar desde Supabase (REAL TIME)
        const { data: supabaseCategories, error } = await supabase
            .from('categories')
            .select('*')
            .order('required_level', { ascending: true });

        if (!error && supabaseCategories && supabaseCategories.length > 0) {
            // Mapear el formato de Supabase al formato de la Interfaz Category
            // Nota: En una app real, traeríamos también las relaciones de words/trivia
            const mapped: Category[] = supabaseCategories.map(cat => {
                const colors: Record<string, string[]> = {
                    'biblia_basica': ['#27AE60', '#1E8449'],
                    'personajes_biblicos': ['#3498DB', '#21618C'],
                    'milagros': ['#F1C40F', '#D4AC0D'],
                    'parabolas': ['#E67E22', '#A04000'],
                    'vida_cristiana': ['#E74C3C', '#943126'],
                    'antiguo_testamento': ['#9B59B6', '#6C3483'],
                    'nuevo_testamento': ['#1ABC9C', '#117A65'],
                };
                
                return {
                    id: cat.id,
                    title: cat.title,
                    description: cat.description || '',
                    slug: cat.slug,
                    icon: cat.icon || 'book',
                    color: cat.base_color || '#1A1A1A',
                    gradientColors: colors[cat.slug] || [cat.base_color || '#1A1A1A', '#000000'],
                    difficulty: cat.required_level === 3 ? 'Difícil' : cat.required_level === 2 ? 'Medio' : 'Fácil',
                    words: [], 
                    trivia: [] 
                };
            });

            // Si es TRIVIA, necesitamos cargar las preguntas para estas categorías
            // Por simplicidad en este parche, si hay categorías en Supabase, las devolvemos.
            // Para mantener compatibilidad con el sistema offline, mezclamos.
            const customJson = await AsyncStorage.getItem('custom_categories');
            const customCategories: Category[] = customJson ? JSON.parse(customJson) : [];
            
            // Unir DEFAULT (como fallback/base) con Supabase (como verdad actual)
            // Filtramos duplicados por slug para que Supabase mande sobre el código
            const all = [...mapped, ...DEFAULT_CATEGORIES, ...customCategories];
            const unique = all.filter((v, i, a) => a.findIndex(t => (t.slug === v.slug || t.id === v.id)) === i);
            
            return unique;
        }

        // 2. Si falla Supabase, usar el sistema local tradicional
        const customJson = await AsyncStorage.getItem('custom_categories');
        const customCategories: Category[] = customJson ? JSON.parse(customJson) : [];
        return [...DEFAULT_CATEGORIES, ...customCategories];
    } catch (e) {
        console.error("Error loading categories", e);
        return DEFAULT_CATEGORIES;
    }
};

export const deleteCategory = async (id: string): Promise<void> => {
    try {
        const customJson = await AsyncStorage.getItem('custom_categories');
        if (customJson) {
            const customCategories: Category[] = JSON.parse(customJson);
            const filtered = customCategories.filter(c => c.id !== id);
            await AsyncStorage.setItem('custom_categories', JSON.stringify(filtered));
        }
    } catch (e) {
        console.error("Error deleting category", e);
    }
};

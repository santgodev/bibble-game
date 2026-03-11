export interface CharadaCard {
    word: string;
    verse?: string;
    description?: string;
    mime?: string;
    // New fields for classification
    category?: string;
    difficulty?: string;
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
    words: (string | CharadaCard)[];
    difficulty: 'Fácil' | 'Medio' | 'Difícil';
    isCustom?: boolean;
    image?: any; // For require() or uri
    capitulo?: string; // Optional chapter number/title for minimalist cover
    gradientColors?: string[]; // Linear Gradient colors
    backgroundImage?: any; // Optional full bg image
    hideCamera?: boolean; // If true, do not show camera preview/record
    subcategories?: Category[]; // Nested categories for grouping
    unleashQuiz?: UnleashQuestion[]; // Preguntas requeridas para desbloquear la categoría
}

import AsyncStorage from '@react-native-async-storage/async-storage';

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

import rawGospels from './gospelsNtv.json';
import { DoodleKind } from '../trivia/components/EditorialDoodle';

export type GospelId = 'mateo' | 'marcos' | 'lucas' | 'juan';

export interface BibleVerse {
    verse: number;
    text: string;
    heading?: string;
}

export interface BibleChapter {
    number: number;
    verses: BibleVerse[];
}

export interface GospelBookMeta {
    id: GospelId;
    title: string;
    subtitle: string;
    accentBg: string;
    accentText: string;
    doodle: DoodleKind;
    doodleTint: string;
    coverImage: any;
    chapters: BibleChapter[];
}

const data = rawGospels as Record<GospelId, { id: GospelId; title: string; chapters: BibleChapter[] }>;

const JUAN_SCENES = [
    require('../../assets/study/verbo_1_eternidad.jpg'),
    require('../../assets/study/verbo_2_creacion.jpg'),
    require('../../assets/study/verbo_3_encarnacion.jpg'),
];

export const GOSPEL_BOOKS: GospelBookMeta[] = [
    {
        id: 'mateo',
        title: 'Mateo',
        subtitle: 'El Rey prometido',
        accentBg: '#DCECE8',
        accentText: '#2E6F65',
        doodle: 'crown',
        doodleTint: '#FFFFFF',
        coverImage: require('../../assets/study/gospel_mateo.jpg'),
        chapters: data.mateo.chapters,
    },
    {
        id: 'marcos',
        title: 'Marcos',
        subtitle: 'El Siervo en acción',
        accentBg: '#D6E8F8',
        accentText: '#1E3A5F',
        doodle: 'dove',
        doodleTint: '#FFFFFF',
        coverImage: require('../../assets/study/gospel_marcos.jpg'),
        chapters: data.marcos.chapters,
    },
    {
        id: 'lucas',
        title: 'Lucas',
        subtitle: 'El Salvador cercano',
        accentBg: '#F5DA7C',
        accentText: '#8A6408',
        doodle: 'olive',
        doodleTint: '#FFFFFF',
        coverImage: require('../../assets/study/gospel_lucas.jpg'),
        chapters: data.lucas.chapters,
    },
    {
        id: 'juan',
        title: 'Juan',
        subtitle: 'El Verbo hecho vida',
        accentBg: '#DCECE8',
        accentText: '#2E6F65',
        doodle: 'scroll',
        doodleTint: '#68AEEB',
        coverImage: JUAN_SCENES[0],
        chapters: data.juan.chapters,
    },
];

export const getGospelById = (id: GospelId): GospelBookMeta =>
    GOSPEL_BOOKS.find(b => b.id === id) || GOSPEL_BOOKS[0];

export const getGospelChapterImage = (gospelId: GospelId, chapterNumber: number): any => {
    if (gospelId === 'juan') {
        return JUAN_SCENES[(chapterNumber - 1) % JUAN_SCENES.length];
    }
    return getGospelById(gospelId).coverImage;
};

export interface ChapterSceneVisual {
    startVerse: number;
    label: string;
    ref?: string;
    image: any;
    scale?: number;
}

const MARCOS_CH1_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Juan el Bautista en el desierto',
        ref: 'v.1–8',
        image: require('../../assets/study/marcos_1_bautista.jpg'),
        scale: 1.72,
    },
    {
        startVerse: 9,
        label: 'Bautismo y tentación de Jesús',
        ref: 'v.9–15',
        image: require('../../assets/study/marcos_1_bautismo.jpg'),
        scale: 1.28,
    },
    {
        startVerse: 16,
        label: 'Llamado a los primeros discípulos',
        ref: 'v.16–20',
        image: require('../../assets/study/marcos_1_discipulos.jpg'),
        scale: 1.28,
    },
    {
        startVerse: 21,
        label: 'Enseñanza y autoridad en Capernaum',
        ref: 'v.21–28',
        image: require('../../assets/study/marcos_1_sinagoga.jpg'),
        scale: 1.26,
    },
    {
        startVerse: 29,
        label: 'Jesús sana a mucha gente',
        ref: 'v.29–34',
        image: require('../../assets/study/marcos_1_sanidad.jpg'),
        scale: 1.24,
    },
    {
        startVerse: 35,
        label: 'Oración antes del alba',
        ref: 'v.35–39',
        image: require('../../assets/study/marcos_1_oracion.jpg'),
        scale: 1.28,
    },
    {
        startVerse: 40,
        label: 'Jesús sana a un leproso',
        ref: 'v.40–45',
        image: require('../../assets/study/marcos_1_leproso.jpg'),
        scale: 1.12,
    },
];

const MARCOS_CH2_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús sana a un paralítico',
        ref: 'v.1–12',
        image: require('../../assets/study/marcos_2_paralitico.jpg'),
        scale: 1.28,
    },
    {
        startVerse: 18,
        label: 'Vino nuevo en odres nuevos',
        ref: 'v.18–22',
        image: require('../../assets/study/marcos_2_odres.jpg'),
        scale: 1.28,
    },
    {
        startVerse: 23,
        label: 'El Señor del día de descanso',
        ref: 'v.23–28',
        image: require('../../assets/study/marcos_2_espigas.jpg'),
        scale: 1.28,
    },
];

export const getChapterSceneVisuals = (
    gospelId: GospelId,
    chapterNumber: number
): ChapterSceneVisual[] => {
    if (gospelId === 'marcos' && chapterNumber === 1) {
        return MARCOS_CH1_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 2) {
        return MARCOS_CH2_SCENES;
    }
    return [
        {
            startVerse: 1,
            label: getGospelById(gospelId).subtitle,
            image: getGospelChapterImage(gospelId, chapterNumber),
        },
    ];
};

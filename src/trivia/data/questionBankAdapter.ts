import type { TriviaQuestion } from '../../data/categories';
import { TRIVIA_GENERAL } from '../../data/trivia_general';
import { TRIVIA_PERSONAJES } from '../../data/trivia_personajes';
import { TRIVIA_ANTIGUO } from '../../data/trivia_antiguo';
import { TRIVIA_NUEVO } from '../../data/trivia_nuevo';
import { TRIVIA_GENESIS } from '../../data/pentateuco/genesis';
import { TRIVIA_EXODO } from '../../data/pentateuco/exodo';
import { TRIVIA_LEVITICO } from '../../data/pentateuco/levitico';
import { TRIVIA_NUMEROS } from '../../data/pentateuco/numeros';
import { TRIVIA_DEUTERONOMIO } from '../../data/pentateuco/deuteronomio';
import { TRIVIA_TRANSICION_MONARQUIA } from '../../data/trivia_extra/transicion_monarquia';
import { TRIVIA_MONARQUIA_UNIDA } from '../../data/trivia_extra/monarquia_unida';
import { TRIVIA_REINO_DIVIDIDO } from '../../data/trivia_extra/reino_dividido';
import { TRIVIA_JUDA_TRAS_ISRAEL } from '../../data/trivia_extra/juda_tras_israel';
import { TRIVIA_EXILIO_BABILONICO } from '../../data/trivia_extra/exilio_babilonico';
import { TRIVIA_RETORNO_RESTAURACION } from '../../data/trivia_extra/retorno_restauracion';
import {
    TRIVIA_ALABANZAS,
    TRIVIA_ANIMALES,
    TRIVIA_COMIDA,
    TRIVIA_HISTORIAS,
    TRIVIA_LUGARES,
    TRIVIA_NAVIDAD_PASCUA,
    TRIVIA_OBJETOS,
} from '../../data/trivia_otros_temas';
import {
    TRIVIA_ENTRADA_CANAAN_EXTRA,
    TRIVIA_EPOCA_JUECES_EXTRA,
    TRIVIA_ORIGENES_EXTRA,
} from '../../data/trivia_etapas_at_extra';
import {
    TRIVIA_NT_CARTAS_EXTRA,
    TRIVIA_NT_JUAN_EXTRA,
    TRIVIA_NT_LUCAS_EXTRA,
    TRIVIA_NT_MARCOS_EXTRA,
    TRIVIA_NT_MATEO_EXTRA,
} from '../../data/trivia_etapas_nt_extra';
import {
    TRIVIA_ETAPA1_ORIGENES,
    TRIVIA_ETAPA1_PATRIARCAS,
} from '../../data/trivia_etapa1_genesis';
import { TRIVIA_ETAPA2_EXODO_DESIERTO } from '../../data/trivia_etapa2_exodo_desierto';
import {
    TRIVIA_ETAPA3_CANAAN,
    TRIVIA_ETAPA3_JUECES,
} from '../../data/trivia_etapa3_canaan_jueces';
import {
    TRIVIA_ETAPA4_DIVIDIDO,
    TRIVIA_ETAPA4_JUDA,
    TRIVIA_ETAPA4_TRANSICION,
    TRIVIA_ETAPA4_UNIDA,
} from '../../data/trivia_etapa4_monarquia';
import {
    TRIVIA_ETAPA5_EXILIO,
    TRIVIA_ETAPA5_RETORNO,
} from '../../data/trivia_etapa5_exilio_retorno';
import {
    TRIVIA_ETAPA6_IGLESIA_PRIMITIVA,
    TRIVIA_ETAPA6_JUAN,
    TRIVIA_ETAPA6_LUCAS,
    TRIVIA_ETAPA6_MARCOS,
    TRIVIA_ETAPA6_MATEO,
} from '../../data/trivia_etapa6_nuevo_testamento';
import {
    LevelQuestionCounts,
} from '../types';

const normalizeText = (value: string): string =>
    value.trim().toLocaleLowerCase().replace(/\s+/g, ' ');

/**
 * Deduplica preguntas conservando intactos sus IDs y dificultades originales.
 * Cuando se combinan bancos de distintos archivos (como en Mezcla bíblica),
 * también puede deduplicar por enunciado normalizado para no repetir la misma pregunta.
 */
export const dedupeQuestions = (
    list: TriviaQuestion[],
    dedupeByQuestionText = false
): TriviaQuestion[] => {
    const seenIds = new Set<string>();
    const seenTexts = new Set<string>();
    const result: TriviaQuestion[] = [];

    for (const q of list) {
        if (!q.id || seenIds.has(q.id)) continue;
        const normalizedQuestion = normalizeText(q.question);
        if (dedupeByQuestionText && seenTexts.has(normalizedQuestion)) continue;

        seenIds.add(q.id);
        seenTexts.add(normalizedQuestion);
        result.push(q);
    }

    return result;
};

export const computeLevelCounts = (questions: TriviaQuestion[]): LevelQuestionCounts => {
    const counts: LevelQuestionCounts = { 1: 0, 2: 0, 3: 0, total: 0 };
    for (const q of questions) {
        if (q.difficulty === 1 || q.difficulty === 2 || q.difficulty === 3) {
            counts[q.difficulty] += 1;
            counts.total += 1;
        }
    }
    return counts;
};

export const isThemePlayable = (
    counts: LevelQuestionCounts
): boolean => counts.total > 0;

interface ParsedVerseRef {
    book: string;
    chapter: number | null;
}

const parseVerseRef = (verseSupport?: string): ParsedVerseRef => {
    if (!verseSupport) return { book: '', chapter: null };
    const clean = verseSupport.trim();
    if (!clean || clean === '-') return { book: '', chapter: null };
    const match = clean.match(/^(.+?)\s+(\d+)(?::|$)/);
    if (!match) {
        return { book: clean, chapter: null };
    }
    return {
        book: match[1].trim(),
        chapter: Number(match[2]),
    };
};

const hasIdPrefix = (q: TriviaQuestion, prefixes: string[]): boolean =>
    Boolean(q.id && prefixes.some(p => q.id!.startsWith(p)));

const startsWithAnyBook = (q: TriviaQuestion, books: string[]): boolean => {
    const { book } = parseVerseRef(q.verseSupport);
    if (!book) return false;
    return books.includes(book);
};

const isChapterInRange = (
    q: TriviaQuestion,
    bookName: string,
    minChapter: number,
    maxChapter: number
): boolean => {
    const { book, chapter } = parseVerseRef(q.verseSupport);
    return book === bookName && chapter !== null && chapter >= minChapter && chapter <= maxChapter;
};

const ALL_SOURCE_QUESTIONS = dedupeQuestions(
    [
        ...TRIVIA_GENERAL,
        ...TRIVIA_PERSONAJES,
        ...TRIVIA_ANTIGUO,
        ...TRIVIA_NUEVO,
        ...TRIVIA_GENESIS,
        ...TRIVIA_EXODO,
        ...TRIVIA_LEVITICO,
        ...TRIVIA_NUMEROS,
        ...TRIVIA_DEUTERONOMIO,
        ...TRIVIA_TRANSICION_MONARQUIA,
        ...TRIVIA_MONARQUIA_UNIDA,
        ...TRIVIA_REINO_DIVIDIDO,
        ...TRIVIA_JUDA_TRAS_ISRAEL,
        ...TRIVIA_EXILIO_BABILONICO,
        ...TRIVIA_RETORNO_RESTAURACION,
        ...TRIVIA_COMIDA,
        ...TRIVIA_LUGARES,
        ...TRIVIA_ANIMALES,
        ...TRIVIA_OBJETOS,
        ...TRIVIA_HISTORIAS,
        ...TRIVIA_NAVIDAD_PASCUA,
        ...TRIVIA_ALABANZAS,
        ...TRIVIA_ORIGENES_EXTRA,
        ...TRIVIA_ENTRADA_CANAAN_EXTRA,
        ...TRIVIA_EPOCA_JUECES_EXTRA,
        ...TRIVIA_NT_MATEO_EXTRA,
        ...TRIVIA_NT_MARCOS_EXTRA,
        ...TRIVIA_NT_LUCAS_EXTRA,
        ...TRIVIA_NT_JUAN_EXTRA,
        ...TRIVIA_NT_CARTAS_EXTRA,
        ...TRIVIA_ETAPA1_ORIGENES,
        ...TRIVIA_ETAPA1_PATRIARCAS,
        ...TRIVIA_ETAPA2_EXODO_DESIERTO,
        ...TRIVIA_ETAPA3_CANAAN,
        ...TRIVIA_ETAPA3_JUECES,
        ...TRIVIA_ETAPA4_TRANSICION,
        ...TRIVIA_ETAPA4_UNIDA,
        ...TRIVIA_ETAPA4_DIVIDIDO,
        ...TRIVIA_ETAPA4_JUDA,
    ],
    true
);

const EXODO_DESIERTO_QUESTIONS = dedupeQuestions(
    [
        ...TRIVIA_EXODO,
        ...TRIVIA_LEVITICO,
        ...TRIVIA_NUMEROS,
        ...TRIVIA_DEUTERONOMIO,
        ...TRIVIA_ETAPA2_EXODO_DESIERTO,
    ],
    true
);

const ACTS_AND_EPISTLES_BOOKS = [
    'Hechos',
    'Romanos',
    '1 Corintios',
    '2 Corintios',
    'Gálatas',
    'Efesios',
    'Filipenses',
    'Colosenses',
    '1 Tesalonicenses',
    '2 Tesalonicenses',
    '1 Timoteo',
    '2 Timoteo',
    'Tito',
    'Filemón',
    'Hebreos',
    'Santiago',
    '1 Pedro',
    '2 Pedro',
    '1 Juan',
    '2 Juan',
    '3 Juan',
    'Judas',
];

export const ADAPTED_BANKS = {
    mezcla_biblica: ALL_SOURCE_QUESTIONS,

    // Antiguo Testamento
    antiguo_testamento_general: dedupeQuestions(TRIVIA_ANTIGUO),
    origenes_patriarcas_general: dedupeQuestions([
        ...TRIVIA_GENESIS,
        ...TRIVIA_ETAPA1_ORIGENES,
        ...TRIVIA_ETAPA1_PATRIARCAS,
    ], true),
    origenes: dedupeQuestions([
        ...ALL_SOURCE_QUESTIONS.filter(q => isChapterInRange(q, 'Génesis', 1, 11)),
        ...TRIVIA_ETAPA1_ORIGENES,
    ], true),
    patriarcas: dedupeQuestions([
        ...ALL_SOURCE_QUESTIONS.filter(q => isChapterInRange(q, 'Génesis', 12, 50)),
        ...TRIVIA_ETAPA1_PATRIARCAS,
    ], true),
    exodo_desierto: EXODO_DESIERTO_QUESTIONS,
    entrada_canaan: dedupeQuestions([
        ...ALL_SOURCE_QUESTIONS.filter(q => startsWithAnyBook(q, ['Josué'])),
        ...TRIVIA_ETAPA3_CANAAN,
    ], true),
    epoca_jueces: dedupeQuestions([
        ...ALL_SOURCE_QUESTIONS.filter(q => startsWithAnyBook(q, ['Jueces', 'Rut', 'Ruth'])),
        ...TRIVIA_ETAPA3_JUECES,
    ], true),
    transicion_monarquia: dedupeQuestions(
        [
            ...TRIVIA_TRANSICION_MONARQUIA,
            ...TRIVIA_ETAPA4_TRANSICION,
            ...ALL_SOURCE_QUESTIONS.filter(q => isChapterInRange(q, '1 Samuel', 1, 8)),
        ],
        true
    ),
    monarquia_unida: dedupeQuestions(
        [
            ...TRIVIA_MONARQUIA_UNIDA,
            ...TRIVIA_ETAPA4_UNIDA,
            ...ALL_SOURCE_QUESTIONS.filter(
                q =>
                    isChapterInRange(q, '1 Samuel', 9, 31) ||
                    startsWithAnyBook(q, ['2 Samuel']) ||
                    isChapterInRange(q, '1 Reyes', 1, 11)
            ),
        ],
        true
    ),
    reino_dividido: dedupeQuestions(
        [
            ...TRIVIA_REINO_DIVIDIDO,
            ...TRIVIA_ETAPA4_DIVIDIDO,
            ...ALL_SOURCE_QUESTIONS.filter(
                q =>
                    isChapterInRange(q, '1 Reyes', 12, 22) ||
                    isChapterInRange(q, '2 Reyes', 1, 17)
            ),
        ],
        true
    ),
    juda_tras_israel: dedupeQuestions(
        [
            ...TRIVIA_JUDA_TRAS_ISRAEL,
            ...TRIVIA_ETAPA4_JUDA,
            ...ALL_SOURCE_QUESTIONS.filter(
                q =>
                    isChapterInRange(q, '2 Reyes', 18, 25) ||
                    startsWithAnyBook(q, ['2 Crónicas'])
            ),
        ],
        true
    ),
    exilio_babilonico: dedupeQuestions(
        [
            ...TRIVIA_EXILIO_BABILONICO,
            ...TRIVIA_ETAPA5_EXILIO,
            ...ALL_SOURCE_QUESTIONS.filter(q =>
                startsWithAnyBook(q, ['Daniel', 'Ezequiel', 'Lamentaciones', 'Jeremías'])
            ),
        ],
        true
    ),
    retorno_restauracion: dedupeQuestions(
        [
            ...TRIVIA_RETORNO_RESTAURACION,
            ...TRIVIA_ETAPA5_RETORNO,
            ...ALL_SOURCE_QUESTIONS.filter(q =>
                startsWithAnyBook(q, ['Esdras', 'Nehemías', 'Ester', 'Hageo', 'Zacarías', 'Malaquías'])
            ),
        ],
        true
    ),

    // Nuevo Testamento
    nt_todo: dedupeQuestions([
        ...TRIVIA_NUEVO,
        ...TRIVIA_NT_MATEO_EXTRA,
        ...TRIVIA_NT_MARCOS_EXTRA,
        ...TRIVIA_NT_LUCAS_EXTRA,
        ...TRIVIA_NT_JUAN_EXTRA,
        ...TRIVIA_NT_CARTAS_EXTRA,
        ...TRIVIA_ETAPA1_ORIGENES,
        ...TRIVIA_ETAPA1_PATRIARCAS,
        ...TRIVIA_ETAPA6_MATEO,
        ...TRIVIA_ETAPA6_MARCOS,
        ...TRIVIA_ETAPA6_LUCAS,
        ...TRIVIA_ETAPA6_JUAN,
        ...TRIVIA_ETAPA6_IGLESIA_PRIMITIVA,
    ], true),
    evangelios_general: dedupeQuestions([
        ...TRIVIA_NUEVO.filter(
            q =>
                hasIdPrefix(q, ['mat', 'mar', 'luc', 'jua']) ||
                startsWithAnyBook(q, ['Mateo', 'Marcos', 'Lucas', 'Juan'])
        ),
        ...TRIVIA_ETAPA6_MATEO,
        ...TRIVIA_ETAPA6_MARCOS,
        ...TRIVIA_ETAPA6_LUCAS,
        ...TRIVIA_ETAPA6_JUAN,
    ], true),
    nt_mateo: dedupeQuestions(
        [
            ...TRIVIA_NUEVO.filter(q => hasIdPrefix(q, ['mat']) || startsWithAnyBook(q, ['Mateo'])),
            ...TRIVIA_NT_MATEO_EXTRA,
            ...TRIVIA_ETAPA6_MATEO,
        ],
        true
    ),
    nt_marcos: dedupeQuestions(
        [
            ...TRIVIA_NUEVO.filter(q => hasIdPrefix(q, ['mar']) || startsWithAnyBook(q, ['Marcos'])),
            ...TRIVIA_NT_MARCOS_EXTRA,
            ...TRIVIA_ETAPA6_MARCOS,
        ],
        true
    ),
    nt_lucas: dedupeQuestions(
        [
            ...TRIVIA_NUEVO.filter(q => hasIdPrefix(q, ['luc']) || startsWithAnyBook(q, ['Lucas'])),
            ...TRIVIA_NT_LUCAS_EXTRA,
            ...TRIVIA_ETAPA6_LUCAS,
        ],
        true
    ),
    nt_juan: dedupeQuestions(
        [
            ...TRIVIA_NUEVO.filter(q => hasIdPrefix(q, ['jua']) || startsWithAnyBook(q, ['Juan'])),
            ...TRIVIA_NT_JUAN_EXTRA,
            ...TRIVIA_ETAPA6_JUAN,
        ],
        true
    ),
    nt_cartas: dedupeQuestions(
        [
            ...TRIVIA_NUEVO.filter(
                q =>
                    hasIdPrefix(q, ['nt_hch', 'hch']) ||
                    startsWithAnyBook(q, ACTS_AND_EPISTLES_BOOKS)
            ),
            ...TRIVIA_NT_CARTAS_EXTRA,
            ...TRIVIA_ETAPA6_IGLESIA_PRIMITIVA,
        ],
        true
    ),

    // Otros temas
    personajes_biblicos: dedupeQuestions(TRIVIA_PERSONAJES),
    biblia_general: dedupeQuestions(TRIVIA_GENERAL),
    comida: dedupeQuestions(TRIVIA_COMIDA),
    lugares: dedupeQuestions(TRIVIA_LUGARES),
    animales: dedupeQuestions(TRIVIA_ANIMALES),
    objetos: dedupeQuestions(TRIVIA_OBJETOS),
    historias: dedupeQuestions(TRIVIA_HISTORIAS),
    navidad_pascua: dedupeQuestions(TRIVIA_NAVIDAD_PASCUA),
    alabanzas: dedupeQuestions(TRIVIA_ALABANZAS),
};

export type AdaptedBankKey = keyof typeof ADAPTED_BANKS;

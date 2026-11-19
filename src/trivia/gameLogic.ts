import type { TriviaQuestion } from '../data/categories';
import {
    DIFFICULTY_LEVELS,
    DifficultyLevel,
    TriviaCatalogThemeNode,
    TriviaRoomConfig,
    TriviaTeamConfig,
    TriviaTeamStanding,
} from './types';

export const shuffleQuestions = <T>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const dedupeById = (questions: TriviaQuestion[]): TriviaQuestion[] => {
    const seen = new Set<string>();
    const out: TriviaQuestion[] = [];
    for (const q of questions) {
        if (!q.id || seen.has(q.id)) continue;
        seen.add(q.id);
        out.push(q);
    }
    return out;
};

/**
 * Selecciona preguntas de un tema priorizando la dificultad elegida y sin repetir IDs.
 * Si el nivel elegido tiene menos preguntas que `limit`, completa con preguntas del mismo tema.
 */
export const selectQuestionsForSoloMatch = (
    theme: TriviaCatalogThemeNode,
    difficulty: DifficultyLevel,
    limit: number,
    seenIds: string[]
): { questions: TriviaQuestion[]; updatedSeenIds: string[] } => {
    const allThemePool = dedupeById(theme.questions);
    if (allThemePool.length === 0) {
        return { questions: [], updatedSeenIds: seenIds };
    }

    const levelPool = allThemePool.filter(q => q.difficulty === difficulty);
    const otherLevelsPool = allThemePool
        .filter(q => q.difficulty !== difficulty)
        .sort((a, b) => Math.abs((a.difficulty ?? difficulty) - difficulty) - Math.abs((b.difficulty ?? difficulty) - difficulty));

    const seenSet = new Set(seenIds);
    const pickFromPool = (pool: TriviaQuestion[], needed: number, alreadySelectedIds: Set<string>) => {
        if (needed <= 0 || pool.length === 0) return [];
        const candidates = pool.filter(q => !alreadySelectedIds.has(q.id!));
        const unseen = shuffleQuestions(candidates.filter(q => !seenSet.has(q.id!)));
        if (unseen.length >= needed) {
            return unseen.slice(0, needed);
        }
        const seen = shuffleQuestions(candidates.filter(q => seenSet.has(q.id!)));
        return [...unseen, ...seen].slice(0, needed);
    };

    const chosenIds = new Set<string>();
    const fromLevel = pickFromPool(levelPool, limit, chosenIds);
    fromLevel.forEach(q => chosenIds.add(q.id!));

    const remainingNeeded = limit - fromLevel.length;
    const fromOthers = remainingNeeded > 0
        ? pickFromPool(otherLevelsPool, remainingNeeded, chosenIds)
        : [];

    const selected = shuffleQuestions([...fromLevel, ...fromOthers]).slice(0, limit);
    const nextSeenIds = Array.from(new Set([...seenIds, ...selected.map(q => q.id!)])).slice(-300);

    return {
        questions: selected,
        updatedSeenIds: nextSeenIds,
    };
};

export interface RoomValidationResult {
    isValid: boolean;
    teamErrors: Record<string, string>;
    minTeamsError: string | null;
    questionsError: string | null;
    requiredQuestions: number;
    availableQuestions: number;
}

export const validateRoomConfig = (
    config: TriviaRoomConfig,
    theme: TriviaCatalogThemeNode | null
): RoomValidationResult => {
    const teamErrors: Record<string, string> = {};
    let minTeamsError: string | null = null;
    let questionsError: string | null = null;

    if (config.teams.length < 2) {
        minTeamsError = 'Se necesitan al menos 2 equipos para iniciar una partida.';
    }

    const nameCount = new Map<string, number>();
    for (const team of config.teams) {
        const normalized = team.name.trim().toLocaleLowerCase();
        if (normalized.length > 0) {
            nameCount.set(normalized, (nameCount.get(normalized) ?? 0) + 1);
        }
    }

    for (const team of config.teams) {
        const trimmed = team.name.trim();
        if (!trimmed) {
            teamErrors[team.id] = 'Escribe un nombre para este equipo.';
            continue;
        }
        const normalized = trimmed.toLocaleLowerCase();
        if ((nameCount.get(normalized) ?? 0) > 1) {
            teamErrors[team.id] = 'Hay equipos con el mismo nombre.';
        }
    }

    const requiredQuestions = config.teams.length * config.questionsPerTeam;
    const availableQuestions = theme ? theme.counts.total : 0;

    if (!theme || !theme.isPlayable) {
        questionsError = 'El tema elegido aún no tiene preguntas disponibles.';
    } else if (availableQuestions < requiredQuestions) {
        questionsError =
            `Faltan preguntas para repartir turnos completos: se necesitan ${requiredQuestions} ` +
            `(${config.questionsPerTeam} por equipo) y hay ${availableQuestions} disponibles en este tema.`;
    }

    const isValid =
        !minTeamsError &&
        !questionsError &&
        Object.keys(teamErrors).length === 0;

    return {
        isValid,
        teamErrors,
        minTeamsError,
        questionsError,
        requiredQuestions,
        availableQuestions,
    };
};

/**
 * Reparte preguntas para una partida local por equipos sin repetir IDs en la sesión.
 * En revanchas, prioriza las preguntas que no aparecieron en partidas previas.
 */
export const buildTeamMatchQuestions = (
    theme: TriviaCatalogThemeNode,
    difficulty: DifficultyLevel,
    teamCount: number,
    questionsPerTeam: number,
    previousSessionIds: string[] = []
): { questions: TriviaQuestion[]; updatedSessionIds: string[] } => {
    const allPool = dedupeById(theme.questions);
    const levelPool = allPool.filter(q => q.difficulty === difficulty);
    const fallbackPool = allPool.filter(q => q.difficulty !== difficulty);
    const totalNeeded = teamCount * questionsPerTeam;

    if (allPool.length < totalNeeded || totalNeeded <= 0) {
        return { questions: [], updatedSessionIds: previousSessionIds };
    }

    const prevSet = new Set(previousSessionIds);
    const primaryUnseen = shuffleQuestions(levelPool.filter(q => !prevSet.has(q.id!)));
    const primarySeen = shuffleQuestions(levelPool.filter(q => prevSet.has(q.id!)));
    const extraUnseen = shuffleQuestions(fallbackPool.filter(q => !prevSet.has(q.id!)));
    const extraSeen = shuffleQuestions(fallbackPool.filter(q => prevSet.has(q.id!)));

    const ordered = [...primaryUnseen, ...extraUnseen, ...primarySeen, ...extraSeen];
    const selected = shuffleQuestions(ordered.slice(0, totalNeeded));
    const nextSessionIds = Array.from(
        new Set([...previousSessionIds, ...selected.map(q => q.id!)])
    ).slice(-300);

    return {
        questions: selected,
        updatedSessionIds: nextSessionIds,
    };
};

export interface TeamMatchOutcome {
    standings: TriviaTeamStanding[];
    topScore: number;
    winners: TriviaTeamStanding[];
    isTie: boolean;
}

export const computeTeamStandings = (
    teams: TriviaTeamConfig[],
    scoresByTeamId: Record<string, number>,
    questionsPerTeam: number
): TeamMatchOutcome => {
    const raw = teams.map(team => {
        const score = scoresByTeamId[team.id] ?? 0;
        const accuracy = questionsPerTeam > 0 ? Math.round((score / questionsPerTeam) * 100) : 0;
        return {
            teamId: team.id,
            teamName: team.name.trim() || 'Equipo',
            score,
            totalTurns: questionsPerTeam,
            accuracy,
            rank: 1,
        };
    });

    raw.sort((a, b) => b.score - a.score);

    let currentRank = 1;
    for (let i = 0; i < raw.length; i++) {
        if (i > 0 && raw[i].score < raw[i - 1].score) {
            currentRank = i + 1;
        }
        raw[i].rank = currentRank;
    }

    const topScore = raw.length > 0 ? raw[0].score : 0;
    const winners = raw.filter(item => item.score === topScore);

    return {
        standings: raw,
        topScore,
        winners,
        isTie: winners.length > 1,
    };
};

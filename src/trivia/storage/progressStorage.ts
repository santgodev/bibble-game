import AsyncStorage from '@react-native-async-storage/async-storage';
import { getThemeById } from '../data/catalog';
import {
    ContinuationTarget,
    DifficultyLevel,
    LevelProgressRecord,
    TriviaPersonalProgressState,
} from '../types';

export const TRIVIA_PROGRESS_STORAGE_KEY = '@trivia_personal_progress_v1';
export const SEEN_TRIVIA_IDS_KEY = 'seen_trivia_ids';

const EMPTY_PROGRESS_STATE: TriviaPersonalProgressState = {
    version: 1,
    lastPlayedThemeId: null,
    themes: {},
};

/**
 * Criterio único de aprobación de nivel para la Fase 1.
 * Centralizado aquí para poder ajustar umbral mínimo de aciertos en futuras fases.
 */
export const evaluateLevelCompletion = (params: {
    score: number;
    total: number;
    answeredCount: number;
    abandoned?: boolean;
}): boolean => {
    if (params.abandoned) return false;
    return params.total > 0 && params.answeredCount >= params.total;
};

export const loadPersonalProgress = async (): Promise<TriviaPersonalProgressState> => {
    try {
        const raw = await AsyncStorage.getItem(TRIVIA_PROGRESS_STORAGE_KEY);
        if (!raw) return { ...EMPTY_PROGRESS_STATE, themes: {} };
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
            return { ...EMPTY_PROGRESS_STATE, themes: {} };
        }
        return {
            version: 1,
            lastPlayedThemeId:
                typeof parsed.lastPlayedThemeId === 'string' ? parsed.lastPlayedThemeId : null,
            themes: parsed.themes && typeof parsed.themes === 'object' ? parsed.themes : {},
        };
    } catch (error) {
        console.error('[TriviaProgress] Error loading local progress:', error);
        return { ...EMPTY_PROGRESS_STATE, themes: {} };
    }
};

export const savePersonalProgress = async (
    state: TriviaPersonalProgressState
): Promise<void> => {
    try {
        await AsyncStorage.setItem(TRIVIA_PROGRESS_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('[TriviaProgress] Error saving local progress:', error);
    }
};

export const loadSeenTriviaIds = async (): Promise<string[]> => {
    try {
        const raw = await AsyncStorage.getItem(SEEN_TRIVIA_IDS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
    } catch {
        return [];
    }
};

export const saveSeenTriviaIds = async (seenIds: string[]): Promise<void> => {
    try {
        const deduped = Array.from(new Set(seenIds)).slice(-300);
        await AsyncStorage.setItem(SEEN_TRIVIA_IDS_KEY, JSON.stringify(deduped));
    } catch (error) {
        console.error('[TriviaProgress] Error saving seen trivia ids:', error);
    }
};

export const recordThemeSessionStart = async (
    themeId: string,
    difficulty: DifficultyLevel
): Promise<TriviaPersonalProgressState> => {
    const state = await loadPersonalProgress();
    const now = new Date().toISOString();
    const existingTheme = state.themes[themeId] || {
        themeId,
        levels: {},
        lastPlayedDifficulty: difficulty,
        updatedAt: now,
    };

    const nextState: TriviaPersonalProgressState = {
        ...state,
        lastPlayedThemeId: themeId,
        themes: {
            ...state.themes,
            [themeId]: {
                ...existingTheme,
                lastPlayedDifficulty: difficulty,
                updatedAt: now,
            },
        },
    };

    await savePersonalProgress(nextState);
    return nextState;
};

export const recordThemeSessionFinish = async (params: {
    themeId: string;
    difficulty: DifficultyLevel;
    score: number;
    total: number;
    answeredCount: number;
    abandoned?: boolean;
}): Promise<{ state: TriviaPersonalProgressState; levelCompleted: boolean }> => {
    const state = await loadPersonalProgress();
    const now = new Date().toISOString();
    const levelCompleted = evaluateLevelCompletion({
        score: params.score,
        total: params.total,
        answeredCount: params.answeredCount,
        abandoned: params.abandoned,
    });

    if (params.abandoned) {
        return { state, levelCompleted: false };
    }

    const existingTheme = state.themes[params.themeId] || {
        themeId: params.themeId,
        levels: {},
        lastPlayedDifficulty: params.difficulty,
        updatedAt: now,
    };

    const existingLevel = existingTheme.levels[params.difficulty];
    const updatedLevel: LevelProgressRecord = {
        difficulty: params.difficulty,
        completed: Boolean(existingLevel?.completed || levelCompleted),
        bestScore: Math.max(existingLevel?.bestScore ?? 0, params.score),
        lastScore: params.score,
        totalQuestions: params.total,
        attempts: (existingLevel?.attempts ?? 0) + 1,
        updatedAt: now,
    };

    const nextState: TriviaPersonalProgressState = {
        ...state,
        lastPlayedThemeId: params.themeId,
        themes: {
            ...state.themes,
            [params.themeId]: {
                ...existingTheme,
                lastPlayedDifficulty: params.difficulty,
                updatedAt: now,
                levels: {
                    ...existingTheme.levels,
                    [params.difficulty]: updatedLevel,
                },
            },
        },
    };

    await savePersonalProgress(nextState);
    return { state: nextState, levelCompleted };
};

export const getCompletedLevelsCount = (
    state: TriviaPersonalProgressState,
    themeId: string
): number => {
    const themeRecord = state.themes[themeId];
    if (!themeRecord) return 0;
    return ([1, 2, 3] as DifficultyLevel[]).filter(
        lvl => themeRecord.levels[lvl]?.completed
    ).length;
};

export const formatCompletedLevelsIndicator = (completedCount: number): string =>
    `${completedCount} de 3 niveles completados`;

export const getNextPendingLevel = (
    state: TriviaPersonalProgressState,
    themeId: string
): DifficultyLevel | null => {
    const themeRecord = state.themes[themeId];
    for (const lvl of [1, 2, 3] as DifficultyLevel[]) {
        if (!themeRecord?.levels[lvl]?.completed) {
            return lvl;
        }
    }
    return null;
};

export const resolveContinuationTarget = (
    state: TriviaPersonalProgressState
): ContinuationTarget => {
    if (!state.lastPlayedThemeId) {
        return { type: 'open_catalog' };
    }

    const theme = getThemeById(state.lastPlayedThemeId);
    if (!theme || !theme.isPlayable) {
        return { type: 'open_catalog' };
    }

    const nextDifficulty = getNextPendingLevel(state, theme.id);
    if (!nextDifficulty) {
        return { type: 'open_catalog' };
    }

    return {
        type: 'resume_theme',
        theme,
        nextDifficulty,
        completedLevels: getCompletedLevelsCount(state, theme.id),
    };
};

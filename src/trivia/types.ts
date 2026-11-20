import type { TriviaQuestion } from '../data/categories';

export type DifficultyLevel = 1 | 2 | 3;

export const SOLO_QUESTIONS_PER_GAME = 15;
export const SOLO_DURATION_SECONDS = 90;
export const DEFAULT_QUESTIONS_PER_TEAM = 5;
export const TEAM_QUESTIONS_OPTIONS = [3, 5, 7] as const;
export const ONLINE_QUESTION_COUNT_OPTIONS = [5, 10, 15] as const;
export const DEFAULT_ONLINE_QUESTION_COUNT = 10;
export const DEFAULT_ONLINE_SECONDS_PER_QUESTION = 20;

export interface DifficultyLevelMeta {
    level: DifficultyLevel;
    name: 'Semilla' | 'Discípulo' | 'Maestro';
    title: string;
    subtitle: string;
    color: string;
    icon: string;
}

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, DifficultyLevelMeta> = {
    1: {
        level: 1,
        name: 'Semilla',
        title: 'Nivel Semilla',
        subtitle: 'Principios básicos y fundamentales.',
        color: '#27AE60',
        icon: 'leaf-outline',
    },
    2: {
        level: 2,
        name: 'Discípulo',
        title: 'Nivel Discípulo',
        subtitle: 'Conocimiento intermedio y reflexivo.',
        color: '#197D7F',
        icon: 'compass-outline',
    },
    3: {
        level: 3,
        name: 'Maestro',
        title: 'Nivel Maestro',
        subtitle: 'Desafíos avanzados de sabiduría bíblica.',
        color: '#68A877',
        icon: 'ribbon-outline',
    },
};

export interface LevelQuestionCounts {
    1: number;
    2: number;
    3: number;
    total: number;
}

export interface TriviaCatalogThemeNode {
    id: string;
    kind: 'theme';
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    parentId: string | null;
    questions: TriviaQuestion[];
    counts: LevelQuestionCounts;
    isPlayable: boolean;
}

export interface TriviaCatalogGroupNode {
    id: string;
    kind: 'group';
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    parentId: string | null;
    children: TriviaCatalogNode[];
}

export type TriviaCatalogNode = TriviaCatalogGroupNode | TriviaCatalogThemeNode;

export interface LevelProgressRecord {
    difficulty: DifficultyLevel;
    completed: boolean;
    bestScore: number;
    lastScore: number;
    totalQuestions: number;
    attempts: number;
    updatedAt: string;
}

export interface ThemeProgressRecord {
    themeId: string;
    levels: Partial<Record<DifficultyLevel, LevelProgressRecord>>;
    lastPlayedDifficulty: DifficultyLevel;
    updatedAt: string;
}

export interface TriviaPersonalProgressState {
    version: 1;
    lastPlayedThemeId: string | null;
    themes: Record<string, ThemeProgressRecord>;
}

export type ContinuationTarget =
    | {
          type: 'resume_theme';
          theme: TriviaCatalogThemeNode;
          nextDifficulty: DifficultyLevel;
          completedLevels: number;
      }
    | {
          type: 'open_catalog';
      };

export type TriviaMatchType = 'mezcla' | 'tema';

export interface TriviaTeamConfig {
    id: string;
    name: string;
}

export interface TriviaRoomConfig {
    matchType: TriviaMatchType;
    themeId: string;
    difficulty: DifficultyLevel;
    teams: TriviaTeamConfig[];
    questionsPerTeam: number;
}

export interface TriviaTeamStanding {
    teamId: string;
    teamName: string;
    score: number;
    totalTurns: number;
    accuracy: number;
    rank: number;
}

export type OnlineRoomStatus = 'waiting' | 'in_progress' | 'finished' | 'cancelled';

export interface OnlineRoomSession {
    roomId: string;
    roomCode: string;
    participantId: string;
    playerToken: string;
    isHost: boolean;
    displayName: string;
}

export interface OnlineRoomRow {
    id: string;
    room_code: string;
    host_user_id: string | null;
    status: OnlineRoomStatus;
    match_type: TriviaMatchType;
    theme_id: string;
    difficulty: DifficultyLevel;
    question_count: number;
    seconds_per_question: number;
    question_ids: string[];
    round_number: number;
    current_question_index: number;
    question_started_at: string | null;
    started_at: string | null;
    finished_at: string | null;
    expires_at: string;
}

export interface OnlineParticipantRow {
    id: string;
    room_id: string;
    user_id: string | null;
    display_name: string;
    role: 'host' | 'player';
    status: 'joined' | 'ready' | 'left';
    score: number;
    correct_count: number;
    joined_at: string;
}

export interface OnlineAnswerRow {
    id: string;
    room_id: string;
    participant_id: string;
    round_number: number;
    question_index: number;
    question_id: string;
    selected_option: number;
    is_correct: boolean;
    points_awarded: number;
    answered_at: string;
}

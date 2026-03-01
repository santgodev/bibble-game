/**
 * utils/pointsSystem.ts — charadasbiblicas
 *
 * ═══════════════════════════════════════════════════════
 * IMPORTANTE: Esta es la MISMA lógica que en:
 *   adn-impact/src/modules/ranking/pointsSystem.ts
 *
 * Mantener ambos archivos sincronizados.
 * La fuente de verdad TEÓRICA es el de adn-impact.
 * ═══════════════════════════════════════════════════════
 */
export declare const DAILY_XP_CAP = 300;
export declare const DAILY_TROPHY_CAP = 20;
export declare const XP: {
    readonly CHARADAS_PER_CORRECT: 3;
    readonly CHARADAS_COMPLETION: 20;
    readonly CHARADAS_ACCURACY_BONUS: 15;
    readonly CHARADAS_CATEGORY_UNLOCK: 50;
    readonly IMPOSTOR_PARTICIPATE: 15;
    readonly IMPOSTOR_WIN: 30;
    readonly IMPOSTOR_WIN_AS_IMPOSTOR: 25;
    readonly IMPOSTOR_IDENTIFY: 10;
    readonly DEVOTIONAL_INTRO: 25;
    readonly DEVOTIONAL_READING: 40;
    readonly DEVOTIONAL_PRACTICE: 30;
    readonly DEVOTIONAL_QUIZ_PERFECT: 60;
};
export declare const TROPHIES: {
    readonly CHARADAS_COMPLETION: 2;
    readonly CHARADAS_PERFECT_ACCURACY: 2;
    readonly CHARADAS_HARD_MODE: 1;
    readonly CHARADAS_CATEGORY_UNLOCK: 5;
    readonly IMPOSTOR_WIN: 3;
    readonly IMPOSTOR_IDENTIFY: 1;
    readonly DEVOTIONAL_READING: 4;
    readonly DEVOTIONAL_QUIZ_PERFECT: 6;
    readonly DEVOTIONAL_WEEK_STREAK: 3;
};
export interface CharadasRewards {
    xp: number;
    trophies: number;
    canEarnTrophies: boolean;
    breakdown: {
        baseXp: number;
        completionBonus: number;
        accuracyBonus: number;
        timeMultiplier: number;
    };
}
/**
 * Calcula recompensas para una partida de Charadas.
 *
 * CAMBIO vs versión anterior: ahora acepta `duration` como parámetro
 * para aplicar el multiplicador de tiempo. Default = 60s para compatibilidad.
 */
export declare const calculateCharadasRewards: (score: number, total: number, canEarnTrophies: boolean, duration?: number) => CharadasRewards;
export interface ImpostorPlayerReward {
    userId: string;
    xp: number;
    trophies: number;
    won: boolean;
    wasImpostor: boolean;
}
export declare const calculateImpostorRewards: (playerDetails: any[], impostorList: number[], citizensWon: boolean) => ImpostorPlayerReward[];
export declare const getLevelFromXP: (totalXP: number) => number;
export interface LevelProgress {
    level: number;
    current: number;
    required: number;
    percent: number;
}
export declare const getXPForCurrentLevel: (totalXP: number) => LevelProgress;

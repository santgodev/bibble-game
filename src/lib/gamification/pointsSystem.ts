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

// ─────────────────────────────────────────────────────────────────
// CAPS DIARIOS
// ─────────────────────────────────────────────────────────────────

export const DAILY_XP_CAP = 300;
export const DAILY_TROPHY_CAP = 20;

// ─────────────────────────────────────────────────────────────────
// VALORES BASE
// ─────────────────────────────────────────────────────────────────

export const XP = {
    // Charadas
    CHARADAS_PER_CORRECT: 3,
    CHARADAS_COMPLETION: 20,         // Solo si ≥10 palabras jugadas
    CHARADAS_ACCURACY_BONUS: 15,     // Si accuracy ≥ 80%
    CHARADAS_CATEGORY_UNLOCK: 50,

    // El Impostor
    IMPOSTOR_PARTICIPATE: 15,
    IMPOSTOR_WIN: 30,
    IMPOSTOR_WIN_AS_IMPOSTOR: 25,
    IMPOSTOR_IDENTIFY: 10,

    // Devocionales
    DEVOTIONAL_INTRO: 25,
    DEVOTIONAL_READING: 40,
    DEVOTIONAL_PRACTICE: 30,
    DEVOTIONAL_QUIZ_PERFECT: 60,
} as const;

export const TROPHIES = {
    // Charadas
    CHARADAS_COMPLETION: 2,
    CHARADAS_PERFECT_ACCURACY: 2,    // Bonus trofeos si accuracy ≥ 80%
    CHARADAS_HARD_MODE: 1,
    CHARADAS_CATEGORY_UNLOCK: 5,

    // El Impostor
    IMPOSTOR_WIN: 3,
    IMPOSTOR_WIN_AS_IMPOSTOR: 6, // Es más difícil ganar siendo el impostor
    IMPOSTOR_IDENTIFY: 2,

    // Devocionales
    DEVOTIONAL_READING: 4,
    DEVOTIONAL_QUIZ_PERFECT: 6,
    DEVOTIONAL_WEEK_STREAK: 3,
} as const;

// ─────────────────────────────────────────────────────────────────
// MULTIPLICADORES DE TIEMPO
// ─────────────────────────────────────────────────────────────────

const TIME_MULTIPLIERS: Record<number, number> = {
    30: 0.6,
    60: 1.0,
    90: 1.2,
    120: 1.35,
};

const getTimeMultiplier = (duration: number): number => {
    const durations = Object.keys(TIME_MULTIPLIERS).map(Number);
    const closest = durations.reduce((prev, curr) =>
        Math.abs(curr - duration) < Math.abs(prev - duration) ? curr : prev
    );
    return TIME_MULTIPLIERS[closest] ?? 1.0;
};

// ─────────────────────────────────────────────────────────────────
// CHARADAS
// ─────────────────────────────────────────────────────────────────

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
export const calculateCharadasRewards = (
    score: number,
    total: number,
    canEarnTrophies: boolean,
    duration: number = 60,
): CharadasRewards => {
    const correctWords = Math.min(score, total);
    const accuracy = total > 0 ? correctWords / total : 0;
    const timeMultiplier = getTimeMultiplier(duration);

    const baseXp = correctWords * XP.CHARADAS_PER_CORRECT;
    const completionBonus = total >= 10 ? XP.CHARADAS_COMPLETION : 0;
    const accuracyBonus = accuracy >= 0.8 ? XP.CHARADAS_ACCURACY_BONUS : 0;

    const rawXp = Math.round((baseXp + completionBonus + accuracyBonus) * timeMultiplier);

    let trophies = 0;
    if (canEarnTrophies && total >= 3) { // A partir de 3 palabras ya puedes ganar copas
        // 1 copa por cada 4 palabras adivinadas correctamente recompensa el esfuerzo/tiempo extra
        trophies += Math.floor(correctWords / 4);

        // Bonus extra por alta precisión
        if (accuracy >= 0.8) {
            trophies += TROPHIES.CHARADAS_PERFECT_ACCURACY;
        }
    }

    return {
        xp: Math.min(rawXp, DAILY_XP_CAP),
        trophies: Math.min(trophies, DAILY_TROPHY_CAP),
        canEarnTrophies,
        breakdown: { baseXp, completionBonus, accuracyBonus, timeMultiplier },
    };
};

// ─────────────────────────────────────────────────────────────────
// EL IMPOSTOR
// ─────────────────────────────────────────────────────────────────

export interface ImpostorPlayerReward {
    userId: string;
    xp: number;
    trophies: number;
    won: boolean;
    wasImpostor: boolean;
}

export const calculateImpostorRewards = (
    playerDetails: any[],
    impostorList: number[],
    citizensWon: boolean
): ImpostorPlayerReward[] => {
    return playerDetails
        .filter(p => p?.isRegistered && p?.id)
        .map((player, index) => {
            const isImpostor = impostorList.includes(index);
            const won = citizensWon ? !isImpostor : isImpostor;

            let xp = XP.IMPOSTOR_PARTICIPATE;
            let trophies = 0;

            if (won) {
                xp += isImpostor ? XP.IMPOSTOR_WIN_AS_IMPOSTOR : XP.IMPOSTOR_WIN;
                trophies += isImpostor ? TROPHIES.IMPOSTOR_WIN_AS_IMPOSTOR : TROPHIES.IMPOSTOR_WIN;
            }

            if (citizensWon && !isImpostor) {
                xp += XP.IMPOSTOR_IDENTIFY;
                trophies += TROPHIES.IMPOSTOR_IDENTIFY;
            }

            return {
                userId: player.id,
                xp: Math.min(xp, DAILY_XP_CAP),
                trophies: Math.min(trophies, DAILY_TROPHY_CAP),
                won,
                wasImpostor: isImpostor,
            };
        });
};

// ─────────────────────────────────────────────────────────────────
// NIVELES
// ─────────────────────────────────────────────────────────────────

export const getLevelFromXP = (totalXP: number): number => {
    let level = 1;
    let xpRequired = 500;
    let accumulated = 0;
    while (accumulated + xpRequired <= totalXP) {
        accumulated += xpRequired;
        level++;
        xpRequired = level * 500;
    }
    return level;
};

export interface LevelProgress {
    level: number;
    current: number;
    required: number;
    percent: number;
}

export const getXPForCurrentLevel = (totalXP: number): LevelProgress => {
    let level = 1;
    let xpRequired = 500;
    let accumulated = 0;
    while (accumulated + xpRequired <= totalXP) {
        accumulated += xpRequired;
        level++;
        xpRequired = level * 500;
    }
    const current = totalXP - accumulated;
    const percent = Math.round((current / xpRequired) * 100);
    return { level, current, required: xpRequired, percent };
};

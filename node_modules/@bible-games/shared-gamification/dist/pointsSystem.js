"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXPForCurrentLevel = exports.getLevelFromXP = exports.calculateImpostorRewards = exports.calculateCharadasRewards = exports.TROPHIES = exports.XP = exports.DAILY_TROPHY_CAP = exports.DAILY_XP_CAP = void 0;
// ─────────────────────────────────────────────────────────────────
// CAPS DIARIOS
// ─────────────────────────────────────────────────────────────────
exports.DAILY_XP_CAP = 300;
exports.DAILY_TROPHY_CAP = 20;
// ─────────────────────────────────────────────────────────────────
// VALORES BASE
// ─────────────────────────────────────────────────────────────────
exports.XP = {
    // Charadas
    CHARADAS_PER_CORRECT: 3,
    CHARADAS_COMPLETION: 20, // Solo si ≥10 palabras jugadas
    CHARADAS_ACCURACY_BONUS: 15, // Si accuracy ≥ 80%
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
};
exports.TROPHIES = {
    // Charadas
    CHARADAS_COMPLETION: 2,
    CHARADAS_PERFECT_ACCURACY: 2, // Bonus trofeos si accuracy ≥ 80%
    CHARADAS_HARD_MODE: 1,
    CHARADAS_CATEGORY_UNLOCK: 5,
    // El Impostor
    IMPOSTOR_WIN: 3,
    IMPOSTOR_IDENTIFY: 1,
    // Devocionales
    DEVOTIONAL_READING: 4,
    DEVOTIONAL_QUIZ_PERFECT: 6,
    DEVOTIONAL_WEEK_STREAK: 3,
};
// ─────────────────────────────────────────────────────────────────
// MULTIPLICADORES DE TIEMPO
// ─────────────────────────────────────────────────────────────────
const TIME_MULTIPLIERS = {
    30: 0.6,
    60: 1.0,
    90: 1.2,
    120: 1.35,
};
const getTimeMultiplier = (duration) => {
    var _a;
    const durations = Object.keys(TIME_MULTIPLIERS).map(Number);
    const closest = durations.reduce((prev, curr) => Math.abs(curr - duration) < Math.abs(prev - duration) ? curr : prev);
    return (_a = TIME_MULTIPLIERS[closest]) !== null && _a !== void 0 ? _a : 1.0;
};
/**
 * Calcula recompensas para una partida de Charadas.
 *
 * CAMBIO vs versión anterior: ahora acepta `duration` como parámetro
 * para aplicar el multiplicador de tiempo. Default = 60s para compatibilidad.
 */
const calculateCharadasRewards = (score, total, canEarnTrophies, duration = 60) => {
    const correctWords = Math.min(score, total);
    const accuracy = total > 0 ? correctWords / total : 0;
    const timeMultiplier = getTimeMultiplier(duration);
    const baseXp = correctWords * exports.XP.CHARADAS_PER_CORRECT;
    const completionBonus = total >= 10 ? exports.XP.CHARADAS_COMPLETION : 0;
    const accuracyBonus = accuracy >= 0.8 ? exports.XP.CHARADAS_ACCURACY_BONUS : 0;
    const rawXp = Math.round((baseXp + completionBonus + accuracyBonus) * timeMultiplier);
    let trophies = 0;
    if (canEarnTrophies && total >= 5) {
        trophies += exports.TROPHIES.CHARADAS_COMPLETION;
        if (accuracy >= 0.8) {
            trophies += exports.TROPHIES.CHARADAS_PERFECT_ACCURACY;
        }
    }
    return {
        xp: Math.min(rawXp, exports.DAILY_XP_CAP),
        trophies: Math.min(trophies, exports.DAILY_TROPHY_CAP),
        canEarnTrophies,
        breakdown: { baseXp, completionBonus, accuracyBonus, timeMultiplier },
    };
};
exports.calculateCharadasRewards = calculateCharadasRewards;
const calculateImpostorRewards = (playerDetails, impostorList, citizensWon) => {
    return playerDetails
        .filter(p => (p === null || p === void 0 ? void 0 : p.isRegistered) && (p === null || p === void 0 ? void 0 : p.id))
        .map((player, index) => {
        const isImpostor = impostorList.includes(index);
        const won = citizensWon ? !isImpostor : isImpostor;
        let xp = exports.XP.IMPOSTOR_PARTICIPATE;
        let trophies = 0;
        if (won) {
            xp += isImpostor ? exports.XP.IMPOSTOR_WIN_AS_IMPOSTOR : exports.XP.IMPOSTOR_WIN;
            trophies += exports.TROPHIES.IMPOSTOR_WIN;
        }
        if (citizensWon && !isImpostor) {
            xp += exports.XP.IMPOSTOR_IDENTIFY;
            trophies += exports.TROPHIES.IMPOSTOR_IDENTIFY;
        }
        return {
            userId: player.id,
            xp: Math.min(xp, exports.DAILY_XP_CAP),
            trophies: Math.min(trophies, exports.DAILY_TROPHY_CAP),
            won,
            wasImpostor: isImpostor,
        };
    });
};
exports.calculateImpostorRewards = calculateImpostorRewards;
// ─────────────────────────────────────────────────────────────────
// NIVELES
// ─────────────────────────────────────────────────────────────────
const getLevelFromXP = (totalXP) => {
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
exports.getLevelFromXP = getLevelFromXP;
const getXPForCurrentLevel = (totalXP) => {
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
exports.getXPForCurrentLevel = getXPForCurrentLevel;

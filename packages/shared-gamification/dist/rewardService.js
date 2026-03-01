"use strict";
/**
 * modules/ranking/rewardService.ts
 *
 * Servicio desacoplado de recompensas — FUENTE ÚNICA de verdad para asignación de puntos.
 * Usado por todas las apps del ecosistema BIBLE-GAMES:
 *   - Charadas (app móvil) → llama a través de API o SDK compartido
 *   - El Impostor (app móvil) → ídem
 *   - ADN Impact (web admin) → importa directamente
 *
 * Características:
 *   ✅ Idempotente (idempotency key via session_id)
 *   ✅ Atómico (usa RPC de Supabase para evitar race conditions)
 *   ✅ Validado (verifica que los user_ids existan en la DB)
 *   ✅ Auditado (registra todo en la tabla `events`)
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSessionAlreadySubmitted = exports.submitGameResult = void 0;
const pointsSystem_1 = require("./pointsSystem");
// ─────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────
const DAILY_XP_CAP = 300;
const DAILY_TROPHY_CAP = 20;
const MAX_GROUP_MEMBERS = 6;
// ─────────────────────────────────────────────────────────
// SERVICIO PRINCIPAL
// ─────────────────────────────────────────────────────────
/**
 * Submite el resultado de un juego y distribuye recompensas a los usuarios.
 *
 * @example
 * await submitGameResult({
 *   gameType: 'CHARADAS',
 *   sessionId: 'unique-game-uuid',
 *   userIds: ['user-id-1'],
 *   payload: { score: 8, total: 10, category: 'biblia_basica', duration: 60, canEarnTrophies: true }
 * });
 */
const submitGameResult = (supabase, result) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ─────────────────────────────────────────────────────
        // 1. VERIFICAR IDEMPOTENCIA
        // Evita que el mismo juego se contabilice dos veces
        // ─────────────────────────────────────────────────────
        const { data: existing } = yield supabase
            .from('events')
            .select('id')
            .eq('session_id', result.sessionId)
            .limit(1);
        if (existing && existing.length > 0) {
            console.warn('[RewardService] Session already submitted:', result.sessionId);
            return { success: true, alreadySubmitted: true };
        }
        // ─────────────────────────────────────────────────────
        // 2. VALIDAR USER IDs
        // Filtra IDs que no existan en la tabla `users`
        // ─────────────────────────────────────────────────────
        const cappedUserIds = result.userIds.slice(0, MAX_GROUP_MEMBERS);
        const { data: validUsers } = yield supabase
            .from('users')
            .select('id')
            .in('id', cappedUserIds);
        const validUserIds = (validUsers === null || validUsers === void 0 ? void 0 : validUsers.map((u) => u.id)) || [];
        if (validUserIds.length === 0) {
            return { success: false, error: 'No valid users found' };
        }
        // ─────────────────────────────────────────────────────
        // 3. CALCULAR RECOMPENSAS POR TIPO DE JUEGO
        // ─────────────────────────────────────────────────────
        let rewards = [];
        switch (result.gameType) {
            case 'CHARADAS': {
                const p = result.payload;
                const r = (0, pointsSystem_1.calculateCharadasRewards)(p.score, p.total, p.canEarnTrophies, p.duration);
                rewards = validUserIds.map((uid) => ({ userId: uid, xp: r.xp, trophies: r.trophies }));
                break;
            }
            case 'IMPOSTOR': {
                const p = result.payload;
                const calculated = (0, pointsSystem_1.calculateImpostorRewards)(p.playerDetails.filter(pd => validUserIds.includes(pd.id)), p.impostorList, p.citizensWon);
                rewards = calculated.map((r) => ({ userId: r.userId, xp: r.xp, trophies: r.trophies }));
                break;
            }
            case 'DEVOTIONAL': {
                const p = result.payload;
                rewards = validUserIds.map((uid) => ({ userId: uid, xp: p.xpReward, trophies: p.trophyReward }));
                break;
            }
            case 'LEADER_AWARD': {
                const p = result.payload;
                rewards = validUserIds.map((uid) => ({
                    userId: uid,
                    xp: Math.min(p.xpToAward, DAILY_XP_CAP),
                    trophies: Math.min(p.trophiesToAward, DAILY_TROPHY_CAP)
                }));
                break;
            }
            default:
                return { success: false, error: 'Unknown game type' };
        }
        // ─────────────────────────────────────────────────────
        // 4. INSERTAR EVENTOS (AUDIT LOG)
        // ─────────────────────────────────────────────────────
        const getDescription = () => {
            switch (result.gameType) {
                case 'CHARADAS': {
                    const p = result.payload;
                    return `Charadas: ${p.category} — ${p.score}/${p.total}`;
                }
                case 'IMPOSTOR':
                    return `Impostor: partida completada`;
                case 'DEVOTIONAL': {
                    const p = result.payload;
                    return `MISSION:${p.nodeId}`;
                }
                case 'LEADER_AWARD': {
                    const p = result.payload;
                    return p.customDescription || `Premio de líder: ${p.activityName}`;
                }
            }
        };
        const eventPayloads = rewards.map(r => ({
            user_id: r.userId,
            event_type: result.gameType,
            session_id: result.sessionId,
            description: getDescription(),
            points_awarded: r.xp,
            trophies_awarded: r.trophies,
        }));
        const { error: eventError } = yield supabase.from('events').insert(eventPayloads);
        if (eventError)
            throw new Error(`Event insert failed: ${eventError.message}`);
        // ─────────────────────────────────────────────────────
        // 5. ACTUALIZAR TOTALES CON RPC ATÓMICA
        // Evita race conditions (Read-Modify-Write)
        // ─────────────────────────────────────────────────────
        for (const r of rewards) {
            const { error: rpcError } = yield supabase.rpc('increment_user_rewards', {
                p_user_id: r.userId,
                p_xp: r.xp,
                p_trophies: r.trophies
            });
            if (rpcError) {
                console.error(`[RewardService] RPC failed for user ${r.userId}:`, rpcError);
                // No lanza error global — otros usuarios siguen recibiendo sus puntos
            }
        }
        return { success: true, rewarded: rewards };
    }
    catch (err) {
        console.error('[RewardService] Error:', err);
        return { success: false, error: err.message };
    }
});
exports.submitGameResult = submitGameResult;
// ─────────────────────────────────────────────────────────
// HELPER: Verificar si una sesión ya fue sometida
// ─────────────────────────────────────────────────────────
const isSessionAlreadySubmitted = (supabase, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { data } = yield supabase
        .from('events')
        .select('id')
        .eq('session_id', sessionId)
        .limit(1);
    return ((_a = data === null || data === void 0 ? void 0 : data.length) !== null && _a !== void 0 ? _a : 0) > 0;
});
exports.isSessionAlreadySubmitted = isSessionAlreadySubmitted;

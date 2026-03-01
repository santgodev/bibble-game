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


import { calculateCharadasRewards, calculateImpostorRewards, ImpostorPlayerReward } from './pointsSystem';

// ─────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────

export type GameType = 'CHARADAS' | 'IMPOSTOR' | 'DEVOTIONAL' | 'LEADER_AWARD';

export interface CharadasPayload {
    score: number;
    total: number;
    category: string;
    duration: number;        // Duración en segundos (60, 90, 120)
    canEarnTrophies: boolean;
}

export interface ImpostorPayload {
    playerDetails: Array<{ id: string; isRegistered: boolean }>;
    impostorList: number[];
    citizensWon: boolean;
}

export interface DevotionalPayload {
    nodeId: string;
    nodeType: 'intro' | 'devotional' | 'practice' | 'quiz';
    xpReward: number;
    trophyReward: number;
}

export interface LeaderAwardPayload {
    leaderId: string;
    activityName: string;
    xpToAward: number;
    trophiesToAward: number;
    customDescription?: string;
}

export interface GameResult {
    gameType: GameType;
    sessionId: string;          // UUID único por partida — clave de idempotencia
    userIds: string[];           // IDs de todos los usuarios a premiar
    payload: CharadasPayload | ImpostorPayload | DevotionalPayload | LeaderAwardPayload;
}

export interface RewardResult {
    success: boolean;
    alreadySubmitted?: boolean;
    error?: string;
    rewarded?: { userId: string; xp: number; trophies: number }[];
}

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
export const submitGameResult = async (supabase: any, result: GameResult): Promise<RewardResult> => {
    try {
        // ─────────────────────────────────────────────────────
        // 1. VERIFICAR IDEMPOTENCIA
        // Evita que el mismo juego se contabilice dos veces
        // ─────────────────────────────────────────────────────
        const { data: existing } = await supabase
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

        const { data: validUsers } = await supabase
            .from('users')
            .select('id')
            .in('id', cappedUserIds);

        const validUserIds = validUsers?.map((u: { id: string }) => u.id) || [];
        if (validUserIds.length === 0) {
            return { success: false, error: 'No valid users found' };
        }

        // ─────────────────────────────────────────────────────
        // 3. CALCULAR RECOMPENSAS POR TIPO DE JUEGO
        // ─────────────────────────────────────────────────────
        let rewards: { userId: string; xp: number; trophies: number }[] = [];

        switch (result.gameType) {
            case 'CHARADAS': {
                const p = result.payload as CharadasPayload;
                const r = calculateCharadasRewards(p.score, p.total, p.canEarnTrophies, p.duration);
                rewards = validUserIds.map((uid: string) => ({ userId: uid, xp: r.xp, trophies: r.trophies }));
                break;
            }

            case 'IMPOSTOR': {
                const p = result.payload as ImpostorPayload;
                const calculated = calculateImpostorRewards(
                    p.playerDetails.filter(pd => validUserIds.includes(pd.id)),
                    p.impostorList,
                    p.citizensWon
                );
                rewards = calculated.map((r: ImpostorPlayerReward) => ({ userId: r.userId, xp: r.xp, trophies: r.trophies }));
                break;
            }

            case 'DEVOTIONAL': {
                const p = result.payload as DevotionalPayload;
                rewards = validUserIds.map((uid: string) => ({ userId: uid, xp: p.xpReward, trophies: p.trophyReward }));
                break;
            }

            case 'LEADER_AWARD': {
                const p = result.payload as LeaderAwardPayload;
                rewards = validUserIds.map((uid: string) => ({
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
                    const p = result.payload as CharadasPayload;
                    return `Charadas: ${p.category} — ${p.score}/${p.total}`;
                }
                case 'IMPOSTOR':
                    return `Impostor: partida completada`;
                case 'DEVOTIONAL': {
                    const p = result.payload as DevotionalPayload;
                    return `MISSION:${p.nodeId}`;
                }
                case 'LEADER_AWARD': {
                    const p = result.payload as LeaderAwardPayload;
                    return p.customDescription || `Premio de líder: ${p.activityName}`;
                }
            }
        };

        const eventPayloads = rewards.map(r => ({
            user_id: r.userId,
            event_type: result.gameType,
            session_id: result.sessionId,
            description: getDescription(),
            xp: r.xp,
            trophies_awarded: r.trophies,
        }));

        const { error: eventError } = await supabase.from('events').insert(eventPayloads);
        if (eventError) throw new Error(`Event insert failed: ${eventError.message}`);

        // ─────────────────────────────────────────────────────
        // 5. ACTUALIZAR TOTALES CON RPC ATÓMICA
        // Evita race conditions (Read-Modify-Write)
        // ─────────────────────────────────────────────────────
        for (const r of rewards) {
            const { error: rpcError } = await supabase.rpc('increment_user_rewards', {
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

    } catch (err: any) {
        console.error('[RewardService] Error:', err);
        return { success: false, error: err.message };
    }
};

// ─────────────────────────────────────────────────────────
// HELPER: Verificar si una sesión ya fue sometida
// ─────────────────────────────────────────────────────────
export const isSessionAlreadySubmitted = async (supabase: any, sessionId: string): Promise<boolean> => {
    const { data } = await supabase
        .from('events')
        .select('id')
        .eq('session_id', sessionId)
        .limit(1);
    return (data?.length ?? 0) > 0;
};

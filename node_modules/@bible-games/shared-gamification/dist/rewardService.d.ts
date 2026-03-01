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
export type GameType = 'CHARADAS' | 'IMPOSTOR' | 'DEVOTIONAL' | 'LEADER_AWARD';
export interface CharadasPayload {
    score: number;
    total: number;
    category: string;
    duration: number;
    canEarnTrophies: boolean;
}
export interface ImpostorPayload {
    playerDetails: Array<{
        id: string;
        isRegistered: boolean;
    }>;
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
    sessionId: string;
    userIds: string[];
    payload: CharadasPayload | ImpostorPayload | DevotionalPayload | LeaderAwardPayload;
}
export interface RewardResult {
    success: boolean;
    alreadySubmitted?: boolean;
    error?: string;
    rewarded?: {
        userId: string;
        xp: number;
        trophies: number;
    }[];
}
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
export declare const submitGameResult: (supabase: any, result: GameResult) => Promise<RewardResult>;
export declare const isSessionAlreadySubmitted: (supabase: any, sessionId: string) => Promise<boolean>;

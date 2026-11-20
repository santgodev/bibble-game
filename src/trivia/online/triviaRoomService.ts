import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import {
    DifficultyLevel,
    OnlineAnswerRow,
    OnlineParticipantRow,
    OnlineRoomRow,
    OnlineRoomSession,
    TriviaMatchType,
} from '../types';

const NICKNAME_STORAGE_KEY = '@berea_trivia_nickname_v1';

const firstRow = <T>(data: T | T[] | null | undefined): T | null => {
    if (!data) return null;
    return Array.isArray(data) ? data[0] ?? null : data;
};

const formatRpcError = (error: any, fallback: string): Error => {
    const raw = String(error?.message || '').trim();
    return new Error(raw || fallback);
};

export const loadDefaultDisplayName = async (): Promise<string> => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            const { data: row } = await supabase
                .from('users')
                .select('username, full_name')
                .eq('id', user.id)
                .single();
            const fromUser = row?.username || row?.full_name;
            if (fromUser && String(fromUser).trim()) {
                return String(fromUser).trim().slice(0, 28);
            }
        }
    } catch {
        // Offline or no profile row; fallback to local nickname
    }

    try {
        const saved = await AsyncStorage.getItem(NICKNAME_STORAGE_KEY);
        if (saved && saved.trim()) {
            return saved.trim().slice(0, 28);
        }
    } catch {
        // Ignore storage read failure
    }
    return '';
};

export const saveLastDisplayName = async (name: string): Promise<void> => {
    const clean = name.trim().slice(0, 28);
    if (!clean) return;
    try {
        await AsyncStorage.setItem(NICKNAME_STORAGE_KEY, clean);
    } catch {
        // Ignore storage write failure
    }
};

export const createTriviaRoom = async (params: {
    displayName: string;
    matchType: TriviaMatchType;
    themeId: string;
    difficulty: DifficultyLevel;
    questionCount: number;
    secondsPerQuestion: number;
}): Promise<OnlineRoomSession> => {
    const cleanName = params.displayName.trim().slice(0, 28);
    const { data, error } = await supabase.rpc('create_trivia_room', {
        p_display_name: cleanName,
        p_match_type: params.matchType,
        p_theme_id: params.themeId,
        p_difficulty: params.difficulty,
        p_question_count: params.questionCount,
        p_seconds_per_question: params.secondsPerQuestion,
    });

    if (error) {
        throw formatRpcError(error, 'No se pudo crear la sala.');
    }

    const row = firstRow<any>(data);
    if (!row?.room_id || !row?.room_code || !row?.participant_id || !row?.player_token) {
        throw new Error('Respuesta incompleta al crear la sala.');
    }

    await saveLastDisplayName(cleanName);

    return {
        roomId: row.room_id,
        roomCode: row.room_code,
        participantId: row.participant_id,
        playerToken: row.player_token,
        isHost: true,
        displayName: cleanName,
    };
};

export const joinTriviaRoomByCode = async (params: {
    roomCode: string;
    displayName: string;
}): Promise<OnlineRoomSession> => {
    const cleanCode = params.roomCode.trim().toUpperCase();
    const cleanName = params.displayName.trim().slice(0, 28);

    const { data, error } = await supabase.rpc('join_trivia_room_by_code', {
        p_room_code: cleanCode,
        p_display_name: cleanName,
    });

    if (error) {
        throw formatRpcError(error, 'No se pudo entrar a la sala.');
    }

    const row = firstRow<any>(data);
    if (!row?.room_id || !row?.room_code || !row?.participant_id || !row?.player_token) {
        throw new Error('No se encontraron los datos de la sala.');
    }

    await saveLastDisplayName(cleanName);

    return {
        roomId: row.room_id,
        roomCode: row.room_code,
        participantId: row.participant_id,
        playerToken: row.player_token,
        isHost: false,
        displayName: cleanName,
    };
};

export const startTriviaRoom = async (
    session: OnlineRoomSession,
    questionIds: string[]
): Promise<void> => {
    const { error } = await supabase.rpc('start_trivia_room', {
        p_room_id: session.roomId,
        p_participant_id: session.participantId,
        p_player_token: session.playerToken,
        p_question_ids: questionIds,
    });

    if (error) {
        throw formatRpcError(error, 'No se pudo iniciar la partida.');
    }
};

export const submitTriviaAnswer = async (
    session: OnlineRoomSession,
    params: {
        questionIndex: number;
        questionId: string;
        selectedOption: number;
        isCorrect: boolean;
        pointsAwarded: number;
    }
): Promise<{ accepted: boolean; totalAnswered: number; totalActivePlayers: number }> => {
    const { data, error } = await supabase.rpc('submit_trivia_answer', {
        p_room_id: session.roomId,
        p_participant_id: session.participantId,
        p_player_token: session.playerToken,
        p_question_index: params.questionIndex,
        p_question_id: params.questionId,
        p_selected_option: params.selectedOption,
        p_is_correct: params.isCorrect,
        p_points_awarded: params.pointsAwarded,
    });

    if (error) {
        throw formatRpcError(error, 'No se pudo enviar tu respuesta.');
    }

    const row = firstRow<any>(data);
    return {
        accepted: Boolean(row?.accepted),
        totalAnswered: Number(row?.total_answered ?? 0),
        totalActivePlayers: Number(row?.total_active_players ?? 0),
    };
};

export const advanceTriviaRoom = async (
    session: OnlineRoomSession
): Promise<{ status: string; currentQuestionIndex: number }> => {
    const { data, error } = await supabase.rpc('advance_trivia_room', {
        p_room_id: session.roomId,
        p_participant_id: session.participantId,
        p_player_token: session.playerToken,
    });

    if (error) {
        throw formatRpcError(error, 'No se pudo avanzar a la siguiente pregunta.');
    }

    const row = firstRow<any>(data);
    return {
        status: String(row?.status || 'in_progress'),
        currentQuestionIndex: Number(row?.current_question_index ?? 0),
    };
};

export const resetTriviaRoomForRematch = async (
    session: OnlineRoomSession,
    questionIds: string[]
): Promise<void> => {
    const { error } = await supabase.rpc('reset_trivia_room_for_rematch', {
        p_room_id: session.roomId,
        p_participant_id: session.participantId,
        p_player_token: session.playerToken,
        p_question_ids: questionIds,
    });

    if (error) {
        throw formatRpcError(error, 'No se pudo reiniciar la sala para revancha.');
    }
};

export const leaveTriviaRoom = async (session: OnlineRoomSession): Promise<void> => {
    try {
        await supabase.rpc('leave_trivia_room', {
            p_room_id: session.roomId,
            p_participant_id: session.participantId,
            p_player_token: session.playerToken,
        });
    } catch {
        // Best-effort leave notification
    }
};

export interface RoomSnapshot {
    room: OnlineRoomRow | null;
    participants: OnlineParticipantRow[];
    currentRoundAnswers: OnlineAnswerRow[];
}

export const fetchRoomSnapshot = async (roomId: string): Promise<RoomSnapshot> => {
    const [{ data: roomData }, { data: participantsData }] = await Promise.all([
        supabase.from('trivia_rooms').select('*').eq('id', roomId).single(),
        supabase
            .from('trivia_room_participants')
            .select('*')
            .eq('room_id', roomId)
            .neq('status', 'left')
            .order('score', { ascending: false })
            .order('joined_at', { ascending: true }),
    ]);

    const room = (roomData as OnlineRoomRow | null) ?? null;
    const participants = ((participantsData as OnlineParticipantRow[] | null) ?? []).filter(
        p => p.status !== 'left'
    );

    let currentRoundAnswers: OnlineAnswerRow[] = [];
    if (room && room.status === 'in_progress') {
        const { data: answersData } = await supabase
            .from('trivia_room_answers')
            .select('*')
            .eq('room_id', roomId)
            .eq('round_number', room.round_number)
            .eq('question_index', room.current_question_index);
        currentRoundAnswers = (answersData as OnlineAnswerRow[] | null) ?? [];
    }

    return { room, participants, currentRoundAnswers };
};

export const subscribeToRoom = (roomId: string, onChange: () => void): (() => void) => {
    const channel = supabase
        .channel(`trivia-room-${roomId}-${Date.now()}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'trivia_rooms', filter: `id=eq.${roomId}` },
            () => onChange()
        )
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'trivia_room_participants',
                filter: `room_id=eq.${roomId}`,
            },
            () => onChange()
        )
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'trivia_room_answers',
                filter: `room_id=eq.${roomId}`,
            },
            () => onChange()
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel).catch(() => {});
    };
};

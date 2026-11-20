import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Confetti } from '../../components';
import { useSound } from '../../context/SoundContext';
import { EditorialDoodle, getDoodleForThemeId } from '../components/EditorialDoodle';
import { getThemeById } from '../data/catalog';
import { getQuestionById } from '../data/questionBankAdapter';
import { selectQuestionsForSoloMatch } from '../gameLogic';
import { TriviaStackParamList } from '../navigation/types';
import {
    advanceTriviaRoom,
    fetchRoomSnapshot,
    leaveTriviaRoom,
    resetTriviaRoomForRematch,
    submitTriviaAnswer,
    subscribeToRoom,
} from '../online/triviaRoomService';
import {
    DifficultyLevel,
    OnlineAnswerRow,
    OnlineParticipantRow,
    OnlineRoomRow,
} from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaOnlineGame'>;
    route: RouteProp<TriviaStackParamList, 'TriviaOnlineGame'>;
};

const LETTERS = ['A', 'B', 'C', 'D'];

const LEVEL_THEME: Record<
    DifficultyLevel,
    { accent: string; soft: string; track: string; doodleTint: string; ctaBg: string; ctaText: string }
> = {
    1: {
        accent: '#3D8A7B',
        soft: '#DCECE8',
        track: '#EDF5F3',
        doodleTint: '#9AD0C4',
        ctaBg: '#1E3A5F',
        ctaText: '#FFFFFF',
    },
    2: {
        accent: '#2B6CB0',
        soft: '#D6E8F8',
        track: '#EBF3FB',
        doodleTint: '#68AEEB',
        ctaBg: '#1E3A5F',
        ctaText: '#FFFFFF',
    },
    3: {
        accent: '#B6891B',
        soft: '#F5DA7C',
        track: '#FBF2D0',
        doodleTint: '#F5DA7C',
        ctaBg: '#F5DA7C',
        ctaText: '#1B1E23',
    },
};

const formatTime = (seconds: number): string => {
    const clamped = Math.max(0, Math.ceil(seconds));
    return `00:${String(clamped).padStart(2, '0')}`;
};

export const TriviaOnlineGameScreen = ({ navigation, route }: Props) => {
    const { session } = route.params;
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic } = useSound();

    const [room, setRoom] = useState<OnlineRoomRow | null>(null);
    const [participants, setParticipants] = useState<OnlineParticipantRow[]>([]);
    const [answers, setAnswers] = useState<OnlineAnswerRow[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [submittedRoundKey, setSubmittedRoundKey] = useState<string | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(20);
    const [advancing, setAdvancing] = useState(false);
    const [rematching, setRematching] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const lastRoundKeyRef = useRef<string>('');
    const lastTickSecRef = useRef<number>(-1);
    const victoryPlayedForRoundRef = useRef<number>(0);

    const syncSnapshot = useCallback(async () => {
        try {
            const snap = await fetchRoomSnapshot(session.roomId);
            if (!snap.room) return;
            setRoom(snap.room);
            setParticipants(snap.participants);
            setAnswers(snap.currentRoundAnswers);
        } catch {
            // Transient glitch; Realtime + fallback poll will retry
        }
    }, [session.roomId]);

    useEffect(() => {
        syncSnapshot();
        const unsubscribe = subscribeToRoom(session.roomId, () => {
            syncSnapshot();
        });
        const pollId = setInterval(() => {
            syncSnapshot();
        }, 2500);

        return () => {
            unsubscribe();
            clearInterval(pollId);
        };
    }, [session.roomId, syncSnapshot]);

    const currentRoundKey = room
        ? `${room.round_number}:${room.current_question_index}`
        : '';

    useEffect(() => {
        if (!room || !currentRoundKey) return;
        if (lastRoundKeyRef.current !== currentRoundKey) {
            lastRoundKeyRef.current = currentRoundKey;
            lastTickSecRef.current = -1;
            const existing = answers.find(a => a.participant_id === session.participantId);
            setSelectedOption(existing ? existing.selected_option : null);
            setSubmittedRoundKey(existing ? currentRoundKey : null);
            setAdvancing(false);
            if (room.status === 'in_progress') {
                setShowConfetti(false);
            }
        }
    }, [room, currentRoundKey, answers, session.participantId]);

    useEffect(() => {
        if (!room || room.status !== 'in_progress') return;
        const updateClock = () => {
            const startedMs = room.question_started_at
                ? new Date(room.question_started_at).getTime()
                : Date.now();
            const elapsed = (Date.now() - startedMs) / 1000;
            const remaining = Math.max(0, Math.ceil(room.seconds_per_question - elapsed));
            setSecondsLeft(remaining);
            if (
                remaining > 0 &&
                remaining <= 5 &&
                remaining !== lastTickSecRef.current &&
                submittedRoundKey !== currentRoundKey
            ) {
                lastTickSecRef.current = remaining;
                playSound('tick');
            }
        };
        updateClock();
        const timer = setInterval(updateClock, 250);
        return () => clearInterval(timer);
    }, [room, submittedRoundKey, currentRoundKey, playSound]);

    useEffect(() => {
        if (room?.status === 'finished' && victoryPlayedForRoundRef.current !== room.round_number) {
            victoryPlayedForRoundRef.current = room.round_number;
            playSound('win');
            playHaptic('victory');
            setShowConfetti(true);
            const hide = setTimeout(() => setShowConfetti(false), 3200);
            return () => clearTimeout(hide);
        }
    }, [room?.status, room?.round_number, playSound, playHaptic]);

    if (!room) {
        return (
            <View style={[s.loadingContainer, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color="#1E3A5F" />
            </View>
        );
    }

    const levelStyle = LEVEL_THEME[room.difficulty] || LEVEL_THEME[1];
    const themeNode = getThemeById(room.theme_id);
    const doodle = getDoodleForThemeId(room.theme_id);
    const questionIds = Array.isArray(room.question_ids) ? room.question_ids : [];
    const totalQuestions = questionIds.length || room.question_count;
    const currentQId = questionIds[room.current_question_index];
    const currentQ = currentQId ? getQuestionById(currentQId) : null;
    const hasAnswered = submittedRoundKey === currentRoundKey || selectedOption !== null;
    const timeUp = secondsLeft <= 0;
    const showFeedback = hasAnswered || timeUp;
    const answeredCount = answers.length;
    const activePlayersCount = participants.length || 1;
    const isLastQuestion = room.current_question_index + 1 >= totalQuestions;

    const handleSelectOption = async (optIndex: number) => {
        if (!currentQ || showFeedback || room.status !== 'in_progress') return;
        const isCorrect = optIndex === currentQ.correctIndex;
        const speedRatio =
            room.seconds_per_question > 0
                ? Math.max(0, Math.min(1, secondsLeft / room.seconds_per_question))
                : 0;
        const points = isCorrect ? 100 + Math.round(speedRatio * 50) : 0;

        setSelectedOption(optIndex);
        setSubmittedRoundKey(currentRoundKey);
        if (isCorrect) {
            playSound('correct');
            playHaptic('success');
        } else {
            playSound('wrong');
            playHaptic('impact');
        }

        try {
            await submitTriviaAnswer(session, {
                questionIndex: room.current_question_index,
                questionId: currentQId,
                selectedOption: optIndex,
                isCorrect,
                pointsAwarded: points,
            });
            syncSnapshot();
        } catch {
            // Optimistic UI remains consistent; poll retries if needed
        }
    };

    const handleAdvance = async () => {
        if (!session.isHost || advancing) return;
        setAdvancing(true);
        try {
            await advanceTriviaRoom(session);
            playSound('tap');
            await syncSnapshot();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'No se pudo avanzar a la siguiente pregunta.');
            setAdvancing(false);
        }
    };

    const handleRematch = async () => {
        if (!session.isHost || rematching || !themeNode) return;
        setRematching(true);
        try {
            const selection = selectQuestionsForSoloMatch(
                themeNode,
                room.difficulty,
                room.question_count,
                questionIds
            );
            const nextIds = selection.questions
                .map(q => q.id)
                .filter((id): id is string => Boolean(id));
            if (nextIds.length === 0) throw new Error('Sin preguntas disponibles.');
            await resetTriviaRoomForRematch(session, nextIds);
            playSound('unlock');
            await syncSnapshot();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'No se pudo iniciar la revancha.');
        } finally {
            setRematching(false);
        }
    };

    const handleExit = () => {
        Alert.alert('Salir de la partida', '¿Deseas abandonar esta sala?', [
            { text: 'Seguir aquí', style: 'cancel' },
            {
                text: 'Salir',
                style: 'destructive',
                onPress: async () => {
                    await leaveTriviaRoom(session);
                    navigation.navigate('TriviaFriends');
                },
            },
        ]);
    };

    // ─── Podio final ──────────────────────────────────────────────────────────
    if (room.status === 'finished') {
        const ranked = [...participants].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.correct_count - a.correct_count;
        });

        return (
            <View style={[s.container, { paddingTop: insets.top }]}>
                <Confetti visible={showConfetti} duration={3200} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[s.podiumPage, { paddingBottom: insets.bottom + 36 }]}
                >
                    <View style={s.podiumHero}>
                        <EditorialDoodle kind="trophy" tint="#F5DA7C" size={82} />
                        <AppText style={s.podiumTitle}>Podio final</AppText>
                        <AppText style={s.podiumSubtitle}>
                            {themeNode?.title || room.theme_id}
                        </AppText>
                    </View>

                    <View style={s.standingsCard}>
                        {ranked.map((player, index) => {
                            const isMe = player.id === session.participantId;
                            const badgeBg =
                                index === 0
                                    ? '#F5DA7C'
                                    : index === 1
                                    ? '#D6E8F8'
                                    : index === 2
                                    ? '#DCECE8'
                                    : '#FFFFFF';
                            const badgeIcon =
                                index === 0
                                    ? 'trophy'
                                    : index === 1
                                    ? 'medal'
                                    : index === 2
                                    ? 'ribbon'
                                    : null;
                            const badgeInk =
                                index === 0 ? '#8A6408' : index === 1 ? '#1E3A5F' : '#2E6F65';

                            return (
                                <View
                                    key={player.id}
                                    style={[
                                        s.standingRow,
                                        { backgroundColor: isMe ? '#DCECE8' : '#FFFFFF' },
                                    ]}
                                >
                                    <View style={[s.rankBadge, { backgroundColor: badgeBg }]}>
                                        {badgeIcon ? (
                                            <Ionicons name={badgeIcon as any} size={18} color={badgeInk} />
                                        ) : (
                                            <AppText style={s.rankNum}>{index + 1}</AppText>
                                        )}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <AppText style={s.standingName} numberOfLines={1}>
                                            {player.display_name}
                                            {isMe ? ' (Tú)' : ''}
                                        </AppText>
                                        <AppText style={s.standingMeta}>
                                            {player.correct_count}/{totalQuestions} aciertos
                                        </AppText>
                                    </View>
                                    <AppText style={s.standingScore}>{player.score}</AppText>
                                </View>
                            );
                        })}
                    </View>

                    <View style={s.podiumActions}>
                        {session.isHost && (
                            <Pressable
                                accessibilityRole="button"
                                disabled={rematching}
                                onPress={handleRematch}
                                style={({ pressed }) => [s.primaryBtn, pressed && s.pressed]}
                            >
                                {rematching ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <AppText style={s.primaryBtnText}>Jugar revancha</AppText>
                                )}
                            </Pressable>
                        )}
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => {
                                leaveTriviaRoom(session);
                                navigation.navigate('TriviaHome');
                            }}
                            style={({ pressed }) => [s.secondaryBtn, pressed && s.pressed]}
                        >
                            <AppText style={s.secondaryBtnText}>Salir</AppText>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // ─── Juego activo ─────────────────────────────────────────────────────────
    const progressPct = ((room.current_question_index + 1) / Math.max(1, totalQuestions)) * 100;

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <View style={s.topBar}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Salir de la partida"
                        onPress={handleExit}
                        style={s.backCircle}
                    >
                        <Ionicons name="close" size={20} color="#1B1E23" />
                    </TouchableOpacity>
                    <View style={s.topCenter}>
                        <AppText style={s.themeTopTitle} numberOfLines={1}>
                            {themeNode?.title || room.theme_id}
                        </AppText>
                        <AppText style={[s.counterText, { color: levelStyle.accent }]}>
                            {room.current_question_index + 1}/{totalQuestions}
                        </AppText>
                    </View>
                    <View style={[s.timerPill, { backgroundColor: levelStyle.soft }]}>
                        <Ionicons name="time-outline" size={14} color={levelStyle.accent} />
                        <AppText style={[s.timerText, { color: levelStyle.accent }]}>
                            {formatTime(secondsLeft)}
                        </AppText>
                    </View>
                </View>

                <View style={[s.progressTrack, { backgroundColor: levelStyle.track }]}>
                    <View
                        style={[
                            s.progressFill,
                            { width: `${progressPct}%`, backgroundColor: levelStyle.accent },
                        ]}
                    />
                </View>

                {currentQ ? (
                    <>
                        <View style={s.questionRow}>
                            <EditorialDoodle
                                kind={doodle.kind}
                                tint={levelStyle.doodleTint}
                                size={50}
                            />
                            <AppText style={s.questionText}>{currentQ.question}</AppText>
                        </View>

                        <View style={s.optionsList}>
                            {currentQ.options.map((opt, idx) => {
                                const isChosen = selectedOption === idx;
                                const isRight = idx === currentQ.correctIndex;
                                let bg = '#F6F8FA';
                                let textColor = '#1B1E23';
                                let badgeBg = levelStyle.soft;
                                let badgeColor = levelStyle.accent;

                                if (showFeedback) {
                                    if (isRight) {
                                        bg = '#2E6F65';
                                        textColor = '#FFFFFF';
                                        badgeBg = '#FFFFFF';
                                        badgeColor = '#2E6F65';
                                    } else if (isChosen) {
                                        bg = '#F7E6E6';
                                        textColor = '#8E3B3B';
                                        badgeBg = '#FFFFFF';
                                        badgeColor = '#8E3B3B';
                                    }
                                }

                                return (
                                    <Pressable
                                        key={idx}
                                        disabled={showFeedback}
                                        onPress={() => handleSelectOption(idx)}
                                        style={({ pressed }) => [
                                            s.optionCard,
                                            { backgroundColor: bg },
                                            !showFeedback && pressed && s.pressed,
                                        ]}
                                    >
                                        <View style={[s.letterBadge, { backgroundColor: badgeBg }]}>
                                            <AppText style={[s.letterText, { color: badgeColor }]}>
                                                {LETTERS[idx]}
                                            </AppText>
                                        </View>
                                        <AppText style={[s.optionText, { color: textColor }]}>
                                            {opt}
                                        </AppText>
                                        {showFeedback && isRight && (
                                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                        )}
                                        {showFeedback && isChosen && !isRight && (
                                            <Ionicons name="close-circle" size={20} color="#8E3B3B" />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={s.roundStatusRow}>
                            <Ionicons name="people-outline" size={15} color="#5B6573" />
                            <AppText style={s.roundStatusText}>
                                {answeredCount} de {activePlayersCount} respondieron
                            </AppText>
                        </View>

                        {showFeedback && (
                            <View style={s.explanationCard}>
                                {!!currentQ.verseSupport && (
                                    <View style={s.versePill}>
                                        <AppText style={s.versePillText}>
                                            {currentQ.verseSupport}
                                        </AppText>
                                    </View>
                                )}
                                <AppText style={s.explanationText}>
                                    {currentQ.explanation}
                                </AppText>
                            </View>
                        )}

                        {showFeedback &&
                            (session.isHost ? (
                                <Pressable
                                    accessibilityRole="button"
                                    disabled={advancing}
                                    onPress={handleAdvance}
                                    style={({ pressed }) => [
                                        s.continueBtn,
                                        { backgroundColor: levelStyle.ctaBg },
                                        pressed && s.pressed,
                                    ]}
                                >
                                    {advancing ? (
                                        <ActivityIndicator color={levelStyle.ctaText} />
                                    ) : (
                                        <>
                                            <AppText
                                                style={[
                                                    s.continueBtnText,
                                                    { color: levelStyle.ctaText },
                                                ]}
                                            >
                                                {isLastQuestion ? 'Ver podio' : 'Siguiente pregunta'}
                                            </AppText>
                                            <Ionicons
                                                name="arrow-forward"
                                                size={18}
                                                color={levelStyle.ctaText}
                                            />
                                        </>
                                    )}
                                </Pressable>
                            ) : (
                                <View style={s.waitingNextBox}>
                                    <ActivityIndicator color={levelStyle.accent} size="small" />
                                    <AppText style={s.waitingNextText}>
                                        Esperando siguiente pregunta…
                                    </AppText>
                                </View>
                            ))}
                    </>
                ) : (
                    <View style={s.waitingNextBox}>
                        <ActivityIndicator color="#1E3A5F" size="small" />
                        <AppText style={s.waitingNextText}>Cargando pregunta…</AppText>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    page: {
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        padding: 20,
        gap: 16,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F6F8FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topCenter: {
        flex: 1,
        alignItems: 'center',
    },
    themeTopTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1B1E23',
    },
    counterText: {
        fontSize: 12,
        fontWeight: '800',
    },
    timerPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 16,
    },
    timerText: {
        fontSize: 13,
        fontWeight: '800',
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
    },
    questionText: {
        flex: 1,
        fontSize: 21,
        lineHeight: 28,
        fontWeight: '800',
        color: '#1B1E23',
    },
    optionsList: {
        gap: 10,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 15,
        borderRadius: 20,
    },
    letterBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontSize: 14,
        fontWeight: '800',
    },
    optionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 21,
    },
    roundStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    roundStatusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5B6573',
    },
    explanationCard: {
        borderRadius: 22,
        padding: 18,
        backgroundColor: '#FBF2D0',
        gap: 10,
    },
    versePill: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
    },
    versePillText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#8A6408',
    },
    explanationText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#1B1E23',
        fontWeight: '600',
    },
    continueBtn: {
        height: 54,
        borderRadius: 27,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    continueBtnText: {
        fontSize: 16,
        fontWeight: '800',
    },
    waitingNextBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 22,
        backgroundColor: '#F6F8FA',
    },
    waitingNextText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#5B6573',
    },
    podiumPage: {
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        padding: 20,
        gap: 20,
    },
    podiumHero: {
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    podiumTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1B1E23',
    },
    podiumSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5B6573',
    },
    standingsCard: {
        padding: 16,
        borderRadius: 24,
        backgroundColor: '#F6F8FA',
        gap: 10,
    },
    standingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 18,
    },
    rankBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankNum: {
        fontSize: 14,
        fontWeight: '800',
        color: '#5B6573',
    },
    standingName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1B1E23',
    },
    standingMeta: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5B6573',
        marginTop: 2,
    },
    standingScore: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    podiumActions: {
        gap: 10,
    },
    primaryBtn: {
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    secondaryBtn: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F6F8FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E3A5F',
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.92,
    },
});

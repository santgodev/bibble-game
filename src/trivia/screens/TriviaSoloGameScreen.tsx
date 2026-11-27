import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { useSound } from '../../context/SoundContext';
import { TriviaQuestion } from '../../data/categories';
import { useGameTimer } from '../../hooks';
import { EditorialDoodle, getDoodleForThemeId } from '../components/EditorialDoodle';
import { getThemeById } from '../data/catalog';
import { selectQuestionsForSoloMatch } from '../gameLogic';
import { TriviaStackParamList } from '../navigation/types';
import {
    loadSeenTriviaIds,
    recordThemeSessionFinish,
    recordThemeSessionStart,
    saveSeenTriviaIds,
} from '../storage/progressStorage';
import {
    DifficultyLevel,
    SOLO_DURATION_SECONDS,
    SOLO_QUESTIONS_PER_GAME,
} from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaSoloGame'>;
    route: RouteProp<TriviaStackParamList, 'TriviaSoloGame'>;
};

const NAVY = '#1E3A5F';
const CORRECT_BG = '#DCECE8';
const WRONG_BG = '#F7E6E6';
const WRONG_ACCENT = '#C96A6A';
const WRONG_INK = '#8E3B3B';
const INK = '#1B1E23';
const MUTED = '#6E7785';
const SURFACE = '#F6F8FA';
const LETTERS = ['A', 'B', 'C', 'D'];

const LEVEL_THEME: Record<
    DifficultyLevel,
    {
        accent: string;
        soft: string;
        track: string;
        doodleTint: string;
        ctaBg: string;
        ctaText: string;
    }
> = {
    1: {
        // Semilla — Salvia luminoso (sincronizado con hero card)
        accent: '#3D8A7B',
        soft: '#DCECE8',
        track: '#EDF5F3',
        doodleTint: '#9AD0C4',
        ctaBg: '#1E3A5F',
        ctaText: '#FFFFFF',
    },
    2: {
        // Discípulo — Azul acuarela + Zafiro
        accent: '#2B6CB0',
        soft: '#D6E8F8',
        track: '#EBF3FB',
        doodleTint: '#68AEEB',
        ctaBg: '#1E3A5F',
        ctaText: '#FFFFFF',
    },
    3: {
        // Maestro — Oro champán
        accent: '#B6891B',
        soft: '#F5DA7C',
        track: '#FBF2D0',
        doodleTint: '#F5DA7C',
        ctaBg: '#F5DA7C',
        ctaText: '#1B1E23',
    },
};

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const TriviaSoloGameScreen = ({ navigation, route }: Props) => {
    const { themeId, difficulty } = route.params;
    const themeNode = getThemeById(themeId);
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic } = useSound();

    const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [gameStatus, setGameStatus] = useState<'READY' | 'PLAYING' | 'FEEDBACK' | 'FINISHED'>('READY');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const scoreRef = useRef(0);
    const indexRef = useRef(0);
    const statusRef = useRef<'READY' | 'PLAYING' | 'FEEDBACK' | 'FINISHED'>('READY');
    const finishedRef = useRef(false);
    const nextSeenIdsRef = useRef<string[]>([]);
    const cardOpacity = useRef(new Animated.Value(0)).current;

    const finishMatch = async (params: {
        finalScore: number;
        answeredCount: number;
        abandoned: boolean;
    }) => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        stopTimer();
        statusRef.current = 'FINISHED';
        setGameStatus('FINISHED');

        if (params.abandoned) {
            await recordThemeSessionFinish({
                themeId,
                difficulty,
                score: params.finalScore,
                total: questions.length || SOLO_QUESTIONS_PER_GAME,
                answeredCount: params.answeredCount,
                abandoned: true,
            });
            navigation.popTo('TriviaProgress');
            return;
        }

        await saveSeenTriviaIds(nextSeenIdsRef.current);
        const { levelCompleted } = await recordThemeSessionFinish({
            themeId,
            difficulty,
            score: params.finalScore,
            total: questions.length || SOLO_QUESTIONS_PER_GAME,
            answeredCount: params.answeredCount,
            abandoned: false,
        });

        navigation.replace('TriviaSoloResults', {
            themeId,
            difficulty,
            score: params.finalScore,
            total: questions.length || SOLO_QUESTIONS_PER_GAME,
            answeredCount: params.answeredCount,
            duration: SOLO_DURATION_SECONDS,
            levelCompleted,
        });
    };

    const onTimeEnd = () => {
        playSound('end');
        playHaptic('impact');
        const answeredCount =
            statusRef.current === 'FEEDBACK' ? indexRef.current + 1 : indexRef.current;
        finishMatch({
            finalScore: scoreRef.current,
            answeredCount,
            abandoned: false,
        });
    };

    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(
        SOLO_DURATION_SECONDS,
        onTimeEnd
    );

    useEffect(() => {
        if (gameStatus === 'PLAYING' && timeLeft > 0 && timeLeft <= 5) {
            playSound('tick');
        }
    }, [timeLeft, gameStatus]);

    const animateCard = () => {
        cardOpacity.setValue(0);
        Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        let active = true;

        const setup = async () => {
            if (!themeNode || !themeNode.isPlayable) {
                finishedRef.current = true;
                Alert.alert('Tema no disponible', 'Este tema aún no tiene preguntas disponibles.');
                navigation.goBack();
                return;
            }

            await recordThemeSessionStart(themeNode.id, difficulty);
            const seenIds = await loadSeenTriviaIds();
            const selection = selectQuestionsForSoloMatch(
                themeNode,
                difficulty,
                SOLO_QUESTIONS_PER_GAME,
                seenIds
            );

            if (!active) return;

            if (selection.questions.length === 0) {
                finishedRef.current = true;
                Alert.alert('Banco insuficiente', 'No hay preguntas disponibles para iniciar este tema.');
                navigation.goBack();
                return;
            }

            nextSeenIdsRef.current = selection.updatedSeenIds;
            setQuestions(selection.questions);
            scoreRef.current = 0;
            indexRef.current = 0;
            setCurrentQIndex(0);
            setSelectedOption(null);
            resetTimer();
            statusRef.current = 'PLAYING';
            setGameStatus('PLAYING');
            startTimer();
            animateCard();
        };

        setup();
        return () => {
            active = false;
            stopTimer();
        };
    }, [themeId, difficulty]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
            if (finishedRef.current) return;
            e.preventDefault();
            Alert.alert(
                'Salir de la partida',
                'Si sales ahora, esta partida no contará como nivel completado.',
                [
                    { text: 'Seguir jugando', style: 'cancel' },
                    {
                        text: 'Salir',
                        style: 'destructive',
                        onPress: async () => {
                            finishedRef.current = true;
                            stopTimer();
                            statusRef.current = 'FINISHED';
                            setGameStatus('FINISHED');
                            await recordThemeSessionFinish({
                                themeId,
                                difficulty,
                                score: scoreRef.current,
                                total: questions.length || SOLO_QUESTIONS_PER_GAME,
                                answeredCount: indexRef.current,
                                abandoned: true,
                            });
                            navigation.popTo('TriviaProgress');
                        },
                    },
                ]
            );
        });
        return unsubscribe;
    }, [navigation, themeId, difficulty, questions.length]);

    const handleAnswer = (optionIdx: number) => {
        if (gameStatus !== 'PLAYING') return;
        const q = questions[currentQIndex];
        if (!q) return;

        stopTimer();
        const correct = optionIdx === q.correctIndex;
        setSelectedOption(optionIdx);
        statusRef.current = 'FEEDBACK';
        setGameStatus('FEEDBACK');

        if (correct) {
            scoreRef.current = scoreRef.current + 1;
            playSound('correct');
            playHaptic('success');
        } else {
            playSound('wrong');
            playHaptic('impact');
        }
    };

    const handleNext = () => {
        playSound('tap');
        playHaptic('selection');
        if (currentQIndex + 1 < questions.length) {
            const nextIdx = currentQIndex + 1;
            indexRef.current = nextIdx;
            setCurrentQIndex(nextIdx);
            setSelectedOption(null);
            statusRef.current = 'PLAYING';
            setGameStatus('PLAYING');
            startTimer();
            animateCard();
        } else {
            finishMatch({
                finalScore: scoreRef.current,
                answeredCount: questions.length,
                abandoned: false,
            });
        }
    };

    const confirmExit = () => {
        Alert.alert(
            'Salir de la partida',
            'Si sales ahora, esta partida no contará como nivel completado.',
            [
                { text: 'Seguir jugando', style: 'cancel' },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: () =>
                        finishMatch({
                            finalScore: scoreRef.current,
                            answeredCount: currentQIndex,
                            abandoned: true,
                        }),
                },
            ]
        );
    };

    if (gameStatus === 'READY' || questions.length === 0) {
        return (
            <View style={s.container}>
                <View style={s.centered}>
                    <ActivityIndicator size="large" color={NAVY} />
                </View>
            </View>
        );
    }

    const q = questions[currentQIndex];
    if (!q) return <View style={s.container} />;

    const doodle = getDoodleForThemeId(themeId);
    const levelTheme = LEVEL_THEME[difficulty];
    const progressPct = ((currentQIndex + 1) / questions.length) * 100;
    const isFeedback = gameStatus === 'FEEDBACK';

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            {/* Top Bar minimalista */}
            <View style={s.topBar}>
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Salir de la partida"
                    onPress={confirmExit}
                    style={[s.navIconBtn, { backgroundColor: levelTheme.track }]}
                >
                    <Ionicons name="chevron-back" size={20} color={levelTheme.accent} />
                </TouchableOpacity>
                <AppText style={s.topTitle} numberOfLines={1}>
                    {themeNode?.title || 'Trivia'}
                </AppText>
                <View style={[s.counterPill, { backgroundColor: levelTheme.soft }]}>
                    <AppText style={[s.counterText, { color: levelTheme.accent }]}>
                        {currentQIndex + 1}/{questions.length}
                    </AppText>
                </View>
            </View>

            {/* Barra de progreso con el color del nivel */}
            <View style={[s.progressTrack, { backgroundColor: levelTheme.track }]}>
                <View
                    style={[
                        s.progressFill,
                        { width: `${progressPct}%`, backgroundColor: levelTheme.accent },
                    ]}
                />
            </View>

            <ScrollView
                contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 32 }]}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[s.contentInner, { opacity: cardOpacity }]}>
                    {/* Meta mínima: solo tiempo */}
                    <View style={s.metaRow}>
                        <View style={s.timerRow}>
                            <Ionicons
                                name="time-outline"
                                size={15}
                                color={timeLeft <= 10 ? WRONG_INK : levelTheme.accent}
                            />
                            <AppText
                                style={[
                                    s.timerText,
                                    { color: timeLeft <= 10 ? WRONG_INK : levelTheme.accent },
                                ]}
                            >
                                {formatTime(timeLeft)}
                            </AppText>
                        </View>
                    </View>

                    {/* Pregunta minimalista con figurita en el color del nivel */}
                    <View style={s.questionWrap}>
                        <AppText style={s.questionText}>{q.question}</AppText>
                        <EditorialDoodle
                            kind={doodle.kind}
                            tint={levelTheme.doodleTint}
                            size={42}
                        />
                    </View>

                    {/* Opciones minimalistas */}
                    <View style={s.optionsList}>
                        {q.options.map((opt, idx) => {
                            const isCorrectOpt = idx === q.correctIndex;
                            const isSelectedWrong = isFeedback && idx === selectedOption && !isCorrectOpt;
                            const isHighlightedCorrect = isFeedback && isCorrectOpt;

                            return (
                                <TouchableOpacity
                                    key={idx}
                                    accessibilityRole="button"
                                    disabled={isFeedback}
                                    onPress={() => handleAnswer(idx)}
                                    activeOpacity={0.82}
                                    style={[
                                        s.optionCard,
                                        isHighlightedCorrect && s.optionCardCorrect,
                                        isSelectedWrong && s.optionCardWrong,
                                        isFeedback && !isHighlightedCorrect && !isSelectedWrong && s.optionCardDim,
                                    ]}
                                >
                                    <View
                                        style={[
                                            s.letterBadge,
                                            !isFeedback && { backgroundColor: levelTheme.track },
                                            isHighlightedCorrect && s.letterBadgeCorrect,
                                            isSelectedWrong && s.letterBadgeWrong,
                                        ]}
                                    >
                                        <AppText
                                            style={[
                                                s.letterText,
                                                !isFeedback && { color: NAVY },
                                                (isHighlightedCorrect || isSelectedWrong) && { color: '#FFFFFF' },
                                            ]}
                                        >
                                            {LETTERS[idx] || String(idx + 1)}
                                        </AppText>
                                    </View>

                                    <AppText
                                        style={[
                                            s.optionText,
                                            isHighlightedCorrect && { color: INK, fontWeight: '700' },
                                            isSelectedWrong && { color: WRONG_INK, fontWeight: '700' },
                                        ]}
                                    >
                                        {opt}
                                    </AppText>

                                    {isHighlightedCorrect && (
                                        <Ionicons name="checkmark-circle" size={20} color={NAVY} />
                                    )}
                                    {isSelectedWrong && (
                                        <Ionicons name="close-circle" size={20} color={WRONG_ACCENT} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Tarjeta editorial cálida (sin bordes ni barra AI) */}
                    {isFeedback && (!!q.explanation || (!!q.verseSupport && q.verseSupport !== '-')) && (
                        <View style={s.noteCard}>
                            {!!q.verseSupport && q.verseSupport !== '-' && (
                                <View style={s.versePill}>
                                    <AppText style={s.verseText}>{q.verseSupport}</AppText>
                                </View>
                            )}
                            {!!q.explanation && (
                                <AppText style={s.explanationText}>{q.explanation}</AppText>
                            )}
                        </View>
                    )}

                    {isFeedback && (
                        <TouchableOpacity
                            accessibilityRole="button"
                            style={[s.nextBtn, { backgroundColor: levelTheme.ctaBg }]}
                            onPress={handleNext}
                            activeOpacity={0.86}
                        >
                            <AppText style={[s.nextBtnText, { color: levelTheme.ctaText }]}>
                                {currentQIndex + 1 < questions.length ? 'Continuar' : 'Ver resultados'}
                            </AppText>
                            <Ionicons name="arrow-forward" size={18} color={levelTheme.ctaText} />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 12,
    },
    navIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '800',
        color: INK,
    },
    counterPill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        backgroundColor: '#F3F7F6',
    },
    counterText: {
        fontSize: 12,
        fontWeight: '800',
        color: NAVY,
        fontVariant: ['tabular-nums'],
    },
    progressTrack: {
        height: 3,
        backgroundColor: '#EEF2F6',
        marginHorizontal: 20,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: NAVY,
        borderRadius: 2,
    },
    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 22,
    },
    contentInner: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timerText: {
        fontSize: 14,
        fontWeight: '700',
        color: MUTED,
        fontVariant: ['tabular-nums'],
    },
    levelPill: {
        paddingHorizontal: 11,
        paddingVertical: 5,
        borderRadius: 14,
    },
    levelTag: {
        fontSize: 12,
        fontWeight: '800',
    },
    questionWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        marginBottom: 26,
    },
    questionText: {
        flex: 1,
        fontSize: 22,
        lineHeight: 30,
        fontWeight: '800',
        color: INK,
        letterSpacing: -0.3,
    },
    optionsList: {
        gap: 11,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: SURFACE,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 16,
    },
    optionCardCorrect: {
        backgroundColor: CORRECT_BG,
    },
    optionCardWrong: {
        backgroundColor: WRONG_BG,
    },
    optionCardDim: {
        opacity: 0.34,
    },
    letterBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterBadgeCorrect: {
        backgroundColor: NAVY,
    },
    letterBadgeWrong: {
        backgroundColor: WRONG_ACCENT,
    },
    letterText: {
        fontSize: 13,
        fontWeight: '800',
        color: NAVY,
    },
    optionText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '600',
        color: INK,
    },
    noteCard: {
        marginTop: 18,
        backgroundColor: '#FBF2D0',
        borderRadius: 22,
        padding: 18,
        gap: 8,
    },
    versePill: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.78)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    verseText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#6F5207',
    },
    explanationText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '500',
        color: INK,
    },
    nextBtn: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: NAVY,
        paddingVertical: 16,
        borderRadius: 24,
    },
    nextBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});

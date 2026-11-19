import React, { useEffect, useRef, useState } from 'react';
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
import { TriviaQuestion } from '../../data/categories';
import { EditorialDoodle, getDoodleForThemeId } from '../components/EditorialDoodle';
import { getThemeById } from '../data/catalog';
import { buildTeamMatchQuestions, computeTeamStandings } from '../gameLogic';
import { TriviaStackParamList } from '../navigation/types';
import { DIFFICULTY_LEVELS, DifficultyLevel } from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaTeamGame'>;
    route: RouteProp<TriviaStackParamList, 'TriviaTeamGame'>;
};

const NAVY = '#1E3A5F';
const MINT_GREEN = '#2E8B6E';
const ERROR_RED = '#C94A4A';
const INK = '#1B1E23';
const MUTED = '#6E7785';
const SURFACE = '#F6F8FA';
const LEVEL_THEME: Record<
    DifficultyLevel,
    { accent: string; soft: string; track: string; doodleTint: string; ctaBg: string; ctaText: string }
> = {
    1: { accent: '#3D8A7B', soft: '#DCECE8', track: '#EDF5F3', doodleTint: '#9AD0C4', ctaBg: '#1E3A5F', ctaText: '#FFFFFF' },
    2: { accent: '#2B6CB0', soft: '#D6E8F8', track: '#EBF3FB', doodleTint: '#68AEEB', ctaBg: '#1E3A5F', ctaText: '#FFFFFF' },
    3: { accent: '#B6891B', soft: '#F5DA7C', track: '#FBF2D0', doodleTint: '#F5DA7C', ctaBg: '#F5DA7C', ctaText: '#1B1E23' },
};
const LETTERS = ['A', 'B', 'C', 'D'];
const CORRECT_BG = '#DCECE8';
const WRONG_BG = '#F7E6E6';
const WRONG_ACCENT = '#C96A6A';
const WRONG_INK = '#8E3B3B';

export const TriviaTeamGameScreen = ({ navigation, route }: Props) => {
    const { roomConfig, previousSessionIds = [] } = route.params;
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic } = useSound();
    const themeNode = getThemeById(roomConfig.themeId);
    const levelMeta = DIFFICULTY_LEVELS[roomConfig.difficulty];

    const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
    const [turnIndex, setTurnIndex] = useState(0);
    const [phase, setPhase] = useState<'LOADING' | 'PLAYING' | 'FEEDBACK' | 'FINISHED'>('LOADING');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [scoresByTeamId, setScoresByTeamId] = useState<Record<string, number>>({});
    const [showConfetti, setShowConfetti] = useState(false);

    const sessionIdsRef = useRef<string[]>(previousSessionIds);

    useEffect(() => {
        if (!themeNode) {
            Alert.alert('Error', 'No se encontró el tema seleccionado.');
            navigation.goBack();
            return;
        }

        const built = buildTeamMatchQuestions(
            themeNode,
            roomConfig.difficulty,
            roomConfig.teams.length,
            roomConfig.questionsPerTeam,
            previousSessionIds
        );

        if (built.questions.length < roomConfig.teams.length * roomConfig.questionsPerTeam) {
            Alert.alert('Banco insuficiente', 'No hay suficientes preguntas para iniciar esta sala.');
            navigation.goBack();
            return;
        }

        const initialScores: Record<string, number> = {};
        for (const team of roomConfig.teams) {
            initialScores[team.id] = 0;
        }

        sessionIdsRef.current = built.updatedSessionIds;
        setQuestions(built.questions);
        setScoresByTeamId(initialScores);
        setTurnIndex(0);
        setSelectedOption(null);
        setShowConfetti(false);
        setPhase('PLAYING');
    }, [roomConfig, previousSessionIds]);

    const currentTeam = roomConfig.teams[turnIndex % roomConfig.teams.length];
    const currentRound = Math.floor(turnIndex / roomConfig.teams.length) + 1;
    const currentQuestion = questions[turnIndex];

    const handleAnswer = (optionIdx: number) => {
        if (phase !== 'PLAYING' || !currentQuestion || !currentTeam) return;

        const correct = optionIdx === currentQuestion.correctIndex;
        setSelectedOption(optionIdx);
        setPhase('FEEDBACK');

        if (correct) {
            setScoresByTeamId(prev => ({
                ...prev,
                [currentTeam.id]: (prev[currentTeam.id] ?? 0) + 1,
            }));
            playSound('correct');
            playHaptic('success');
        } else {
            playSound('wrong');
            playHaptic('impact');
        }
    };

    const handleNextTurn = () => {
        if (turnIndex + 1 < questions.length) {
            setTurnIndex(prev => prev + 1);
            setSelectedOption(null);
            setPhase('PLAYING');
            return;
        }

        setPhase('FINISHED');
        playSound('win');
        playHaptic('victory');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const confirmExit = () => {
        Alert.alert(
            'Salir de la partida',
            'Se perderá el marcador actual de los equipos.',
            [
                { text: 'Seguir', style: 'cancel' },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: () => navigation.navigate('TriviaHome'),
                },
            ]
        );
    };

    const handleRematch = () => {
        navigation.replace('TriviaTeamGame', {
            roomConfig,
            previousSessionIds: sessionIdsRef.current,
        });
    };

    if (phase === 'LOADING' || (!currentQuestion && phase !== 'FINISHED')) {
        return (
            <View style={s.container}>
                <View style={s.centered}>
                    <ActivityIndicator size="large" color={NAVY} />
                    <AppText style={{ marginTop: 14, color: MUTED }}>
                        Repartiendo preguntas...
                    </AppText>
                </View>
            </View>
        );
    }

    if (phase === 'FINISHED') {
        const outcome = computeTeamStandings(
            roomConfig.teams,
            scoresByTeamId,
            roomConfig.questionsPerTeam
        );

        return (
            <View style={[s.container, { paddingTop: insets.top }]}>
                <Confetti visible={showConfetti} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[s.resultsPage, { paddingBottom: insets.bottom + 36 }]}
                >
                    <EditorialDoodle
                        kind={outcome.isTie ? 'dove' : 'trophy'}
                        tint={outcome.isTie ? '#68AEEB' : '#F2CF66'}
                        size={86}
                    />

                    <AppText style={s.resultsEyebrow}>MARCADOR FINAL</AppText>
                    <AppText variant="header" centered style={s.resultsTitle}>
                        {outcome.isTie
                            ? '¡Empate!'
                            : `¡Ganó ${outcome.winners[0]?.teamName || 'Equipo'}!`}
                    </AppText>
                    <AppText centered style={s.resultsSub}>
                        {outcome.isTie
                            ? `${outcome.winners.map(w => w.teamName).join(' y ')} empataron con ${outcome.topScore} ${outcome.topScore === 1 ? 'acierto' : 'aciertos'}.`
                            : `${themeNode?.title || ''} · Nivel ${levelMeta.name}`}
                    </AppText>

                    <View style={s.standingsCard}>
                        {outcome.standings.map(item => (
                            <View key={item.teamId} style={s.standingRow}>
                                <View
                                    style={[
                                        s.rankBadge,
                                        item.rank === 1 && { backgroundColor: '#F5DA7C' },
                                    ]}
                                >
                                    <AppText
                                        style={[
                                            s.rankText,
                                            item.rank === 1 && { color: '#1B1E23' },
                                        ]}
                                    >
                                        #{item.rank}
                                    </AppText>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <AppText style={s.standingTeam}>{item.teamName}</AppText>
                                    <AppText style={s.standingMeta}>{item.accuracy}% de aciertos</AppText>
                                </View>
                                <AppText style={s.standingScore}>
                                    {item.score}/{item.totalTurns}
                                </AppText>
                            </View>
                        ))}
                    </View>

                    <View style={s.resultsActions}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={handleRematch}
                            style={({ pressed }) => [s.primaryBtn, pressed && s.pressed]}
                        >
                            <AppText style={s.primaryBtnText}>Revancha</AppText>
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => navigation.navigate('TriviaHome')}
                            style={({ pressed }) => [s.secondaryBtn, pressed && s.pressed]}
                        >
                            <AppText style={s.secondaryBtnText}>Volver al menú</AppText>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <View style={s.topBar}>
                <View style={s.turnPill}>
                    <Ionicons name="people-outline" size={16} color={NAVY} />
                    <AppText style={s.turnPillText} numberOfLines={1}>
                        Turno de: {currentTeam.name}
                    </AppText>
                </View>
                <View style={s.roundBadge}>
                    <AppText style={s.roundBadgeText}>
                        Ronda {currentRound}/{roomConfig.questionsPerTeam}
                    </AppText>
                </View>
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Salir de la partida"
                    onPress={confirmExit}
                    style={s.navIconBtn}
                >
                    <Ionicons name="close" size={22} color={INK} />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.scoreboardBar}
                style={s.scoreboardWrap}
            >
                {roomConfig.teams.map(team => {
                    const active = team.id === currentTeam.id;
                    return (
                        <View
                            key={team.id}
                            style={[s.scoreChip, active && s.scoreChipActive]}
                        >
                            <AppText style={[s.scoreChipName, active && { color: '#FFFFFF' }]}>
                                {team.name}
                            </AppText>
                            <AppText style={[s.scoreChipVal, active && { color: '#F5DA7C' }]}>
                                {scoresByTeamId[team.id] ?? 0}
                            </AppText>
                        </View>
                    );
                })}
            </ScrollView>

            <View style={s.divider} />

            <ScrollView
                contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 28 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={s.contentInner}>
                    <View style={s.metaRow}>
                        <AppText style={s.themeMetaLabel} numberOfLines={1}>
                            {themeNode?.title}
                        </AppText>
                    </View>

                    <View style={s.questionWrap}>
                        <AppText style={s.questionText}>{currentQuestion.question}</AppText>
                        <EditorialDoodle
                            kind={getDoodleForThemeId(roomConfig.themeId).kind}
                            tint={LEVEL_THEME[roomConfig.difficulty].doodleTint}
                            size={40}
                        />
                    </View>

                    <View style={s.optionsList}>
                        {currentQuestion.options.map((opt, idx) => {
                            const isFeedback = phase === 'FEEDBACK';
                            const isCorrectOpt = idx === currentQuestion.correctIndex;
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
                                            isHighlightedCorrect && s.letterBadgeCorrect,
                                            isSelectedWrong && s.letterBadgeWrong,
                                        ]}
                                    >
                                        <AppText
                                            style={[
                                                s.letterText,
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

                    {phase === 'FEEDBACK' &&
                        (!!currentQuestion.explanation ||
                            (!!currentQuestion.verseSupport && currentQuestion.verseSupport !== '-')) && (
                            <View style={s.noteCard}>
                                {!!currentQuestion.verseSupport && currentQuestion.verseSupport !== '-' && (
                                    <View style={s.versePill}>
                                        <AppText style={s.verseText}>{currentQuestion.verseSupport}</AppText>
                                    </View>
                                )}
                                {!!currentQuestion.explanation && (
                                    <AppText style={s.explanationText}>{currentQuestion.explanation}</AppText>
                                )}
                            </View>
                        )}

                    {phase === 'FEEDBACK' && (
                        <TouchableOpacity
                            accessibilityRole="button"
                            style={s.nextBtn}
                            onPress={handleNextTurn}
                            activeOpacity={0.85}
                        >
                            <AppText style={s.nextBtnText}>
                                {turnIndex + 1 < questions.length ? 'Siguiente turno' : 'Ver marcador'}
                            </AppText>
                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                </View>
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
        paddingHorizontal: 32,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    turnPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: '#DCECE8',
    },
    turnPillText: {
        fontSize: 13,
        fontWeight: '800',
        color: NAVY,
        flexShrink: 1,
    },
    roundBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: SURFACE,
    },
    roundBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: MUTED,
    },
    navIconBtn: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreboardWrap: {
        flexGrow: 0,
        marginBottom: 10,
    },
    scoreboardBar: {
        paddingHorizontal: 18,
        gap: 8,
    },
    scoreChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 13,
        paddingVertical: 7,
        borderRadius: 16,
        backgroundColor: SURFACE,
    },
    scoreChipActive: {
        backgroundColor: NAVY,
    },
    scoreChipName: {
        fontSize: 12,
        fontWeight: '700',
        color: MUTED,
    },
    scoreChipVal: {
        fontSize: 13,
        fontWeight: '800',
        color: INK,
    },
    divider: {
        height: 1,
        backgroundColor: '#EDF1F4',
    },
    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 18,
    },
    contentInner: {
        width: '100%',
        maxWidth: 640,
        alignSelf: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 10,
    },
    themeMetaLabel: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        color: MUTED,
    },
    levelTag: {
        fontSize: 12,
        fontWeight: '800',
        color: NAVY,
    },
    questionWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        marginBottom: 22,
    },
    questionText: {
        flex: 1,
        fontSize: 22,
        lineHeight: 30,
        fontWeight: '800',
        color: INK,
        letterSpacing: -0.3,
    },
    levelPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
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
        lineHeight: 20,
        color: '#4B5563',
    },
    solutionInner: {
        marginTop: 14,
        marginLeft: 34,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.28)',
        gap: 5,
    },
    solutionHeading: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    solutionBody: {
        fontSize: 14,
        lineHeight: 20,
        color: 'rgba(255,255,255,0.95)',
    },
    verseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    solutionVerse: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    nextBtn: {
        marginTop: 22,
        height: 54,
        borderRadius: 27,
        backgroundColor: NAVY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    nextBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    resultsPage: {
        width: '100%',
        maxWidth: 620,
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 28,
    },
    resultsEyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.8,
        color: '#2E6F65',
        marginTop: 10,
        marginBottom: 4,
    },
    resultsTitle: {
        fontSize: 30,
        color: INK,
    },
    resultsSub: {
        fontSize: 14,
        color: MUTED,
        marginTop: 4,
        marginBottom: 22,
    },
    standingsCard: {
        width: '100%',
        padding: 16,
        borderRadius: 26,
        backgroundColor: SURFACE,
        gap: 10,
        marginBottom: 22,
    },
    standingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
    },
    rankBadge: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: '#E1EEF9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: 13,
        fontWeight: '800',
        color: NAVY,
    },
    standingTeam: {
        fontSize: 16,
        fontWeight: '800',
        color: INK,
    },
    standingMeta: {
        fontSize: 12,
        color: MUTED,
    },
    standingScore: {
        fontSize: 18,
        fontWeight: '800',
        color: NAVY,
    },
    resultsActions: {
        width: '100%',
        gap: 10,
    },
    primaryBtn: {
        height: 54,
        borderRadius: 27,
        backgroundColor: NAVY,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    secondaryBtn: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        color: NAVY,
        fontSize: 15,
        fontWeight: '700',
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.92,
    },
});

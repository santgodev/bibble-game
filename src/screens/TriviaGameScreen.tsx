import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, useWindowDimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, AppText } from '../components';
import { useGameTimer } from '../hooks';
import { useSound } from '../context/SoundContext';
import { TriviaQuestion } from '../data/categories';
import { theme } from '../theme';

const CORRECT_COLOR = '#27AE60';
const WRONG_COLOR = '#E74C3C';

export const TriviaGameScreen = ({ navigation, route }: any) => {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic, setVolumeModifier, pauseMusic, resumeMusic } = useSound();

    const { 
        categoryObj, 
        questions: initialQuestions, 
        duration = 60,
        difficulty = 1
    } = route.params || {};

    const primaryColor = categoryObj?.color || theme.colors.primary;
    const themeGradients = categoryObj?.gradientColors || ['#1A1A2E', '#16213E', '#1A1A2E'];

    const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState<'READY' | 'PLAYING' | 'FEEDBACK' | 'FINISHED'>('READY');
    
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const cardScale = useRef(new Animated.Value(0.95)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const readyPulse = useRef(new Animated.Value(1)).current;
    
    const onTimeEnd = () => handleGameFinish(score, currentQIndex);
    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(duration, onTimeEnd);

    useEffect(() => {
        if (initialQuestions && initialQuestions.length > 0) {
            let filtered = initialQuestions.filter((q: TriviaQuestion) => q.difficulty === difficulty);
            if (filtered.length === 0) filtered = initialQuestions;
            const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
            setQuestions(shuffled);
        }
    }, [initialQuestions, difficulty]);

    useEffect(() => {
        if (gameStatus !== 'READY') return;
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(readyPulse, { toValue: 1.05, duration: 800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(readyPulse, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [gameStatus]);

    const animateNextQuestion = () => {
        cardScale.setValue(0.95);
        cardOpacity.setValue(0);
        Animated.parallel([
            Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
            Animated.timing(cardOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();
    };

    const startGame = () => {
        setScore(0);
        setCurrentQIndex(0);
        setSelectedOption(null);
        resetTimer();
        setGameStatus('PLAYING');
        startTimer();
        animateNextQuestion();
    };

    const handleAnswer = (optionIdx: number) => {
        if (gameStatus !== 'PLAYING') return;
        
        setSelectedOption(optionIdx);
        const correct = optionIdx === questions[currentQIndex].correctIndex;
        setIsCorrect(correct);
        setGameStatus('FEEDBACK');
        stopTimer();

        if (correct) {
            setScore(prev => prev + 1);
            playSound('correct');
            playHaptic('success');
        } else {
            playSound('wrong');
            playHaptic('impact');
        }
    };

    const nextQuestion = () => {
        if (currentQIndex + 1 < questions.length) {
            setSelectedOption(null);
            setIsCorrect(null);
            setCurrentQIndex(prev => prev + 1);
            setGameStatus('PLAYING');
            startTimer();
            animateNextQuestion();
        } else {
            handleGameFinish(score, questions.length);
        }
    };

    const handleGameFinish = (finalScore: number, totalQuestions: number) => {
        setGameStatus('FINISHED');
        stopTimer();
        setTimeout(() => {
            navigation.replace('Results', {
                score: finalScore,
                total: totalQuestions,
                category: categoryObj.title,
                isTrivia: true,
                canEarnTrophies: true,
                duration
            });
        }, 1200);
    };

    if (gameStatus === 'READY') {
        return (
            <View style={s.container}>
                <LinearGradient colors={themeGradients} style={StyleSheet.absoluteFillObject} />
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
                
                <View style={s.centered}>
                    <View style={[s.readyIconBox, { backgroundColor: primaryColor + '20', borderColor: primaryColor + '40', borderWidth: 1 }]}>
                        <Ionicons name={categoryObj?.icon || 'book'} size={60} color={primaryColor} />
                    </View>
                    
                    <View style={s.titleContainer}>
                        <AppText variant="header" style={[s.title, { color: primaryColor }]} numberOfLines={1} adjustsFontSizeToFit>
                            {categoryObj?.title}
                        </AppText>
                    </View>
                    
                    <AppText style={s.subtitle}>{questions.length} PREGUNTAS · {duration}s</AppText>
                    
                    <View style={s.readyDivider} />
                    
                    <Animated.View style={{ transform: [{ scale: readyPulse }] }}>
                        <TouchableOpacity style={[s.startBtn, { backgroundColor: primaryColor }]} onPress={startGame} activeOpacity={0.85}>
                            <Ionicons name="play" size={24} color="#000" style={{ marginRight: 10 }} />
                            <AppText style={s.startBtnText}>EMPEZAR TRIVIA</AppText>
                        </TouchableOpacity>
                    </Animated.View>
                    
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <AppText style={s.backBtnText}>Cancelar</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (gameStatus === 'FINISHED') {
        return (
            <View style={s.container}>
                <LinearGradient colors={themeGradients} style={StyleSheet.absoluteFillObject} />
                <View style={s.centered}>
                    <Ionicons name="checkmark-circle" size={80} color={primaryColor} />
                    <AppText variant="header" style={[s.title, { marginTop: 20 }]} numberOfLines={1} adjustsFontSizeToFit>¡Trivia Completada!</AppText>
                    <AppText style={s.statLabel}>Calculando tus resultados...</AppText>
                </View>
            </View>
        );
    }

    const q = questions[currentQIndex];
    if (!q) return <View style={s.container} />;

    return (
        <View style={s.container}>
            <LinearGradient colors={themeGradients} style={StyleSheet.absoluteFillObject} />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />

            <View style={[s.header, { paddingTop: insets.top + 10 }]}>
                <View style={[s.progressBadge, { backgroundColor: primaryColor + '30' }]}>
                    <AppText style={[s.progressText, { color: primaryColor }]}>{currentQIndex + 1} / {questions.length}</AppText>
                </View>
                <View style={[s.timerChip, timeLeft <= 10 && { borderColor: WRONG_COLOR, backgroundColor: WRONG_COLOR + '20' }]}>
                    <Ionicons name="timer-outline" size={16} color={timeLeft <= 10 ? WRONG_COLOR : '#fff'} />
                    <AppText style={[s.timerText, timeLeft <= 10 && { color: WRONG_COLOR }]}>{timeLeft}s</AppText>
                </View>
                <TouchableOpacity onPress={() => handleGameFinish(score, currentQIndex)} style={s.closeIcon}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View style={[s.cardWrapper, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
                    <View style={s.questionCard}>
                        <View style={[s.diffTag, { backgroundColor: primaryColor + '20' }]}>
                            <AppText style={[s.diffText, { color: primaryColor }]}>
                                {q.difficulty === 1 ? 'SEMILLA' : q.difficulty === 2 ? 'DISCÍPULO' : 'MAESTRO'}
                            </AppText>
                        </View>
                        <AppText style={s.questionText}>{q.question}</AppText>
                    </View>

                    <View style={s.optionsGrid}>
                        {q.options.map((opt, idx) => {
                            let btnStyle: any = [s.optionBtn];
                            let textStyle: any = s.optionText;
                            let icon = null;

                            if (gameStatus === 'FEEDBACK') {
                                if (idx === q.correctIndex) {
                                    btnStyle.push({ backgroundColor: CORRECT_COLOR, borderColor: CORRECT_COLOR });
                                    textStyle = s.optionTextSelected;
                                    icon = <Ionicons name="checkmark-circle" size={20} color="#fff" />;
                                } else if (idx === selectedOption) {
                                    btnStyle.push({ backgroundColor: WRONG_COLOR, borderColor: WRONG_COLOR });
                                    textStyle = s.optionTextSelected;
                                    icon = <Ionicons name="close-circle" size={20} color="#fff" />;
                                } else {
                                    btnStyle.push({ opacity: 0.3 });
                                }
                            }

                            return (
                                <TouchableOpacity 
                                    key={idx} 
                                    style={btnStyle} 
                                    onPress={() => handleAnswer(idx)}
                                    disabled={gameStatus !== 'PLAYING'}
                                    activeOpacity={0.7}
                                >
                                    <AppText style={textStyle}>{opt}</AppText>
                                    {icon}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {gameStatus === 'FEEDBACK' && (
                        <View style={s.feedbackCard}>
                            <View style={s.feedbackHeader}>
                                <Ionicons 
                                    name={isCorrect ? "happy" : "alert-circle"} 
                                    size={24} 
                                    color={isCorrect ? CORRECT_COLOR : WRONG_COLOR} 
                                />
                                <AppText style={[s.feedbackTitle, { color: isCorrect ? CORRECT_COLOR : WRONG_COLOR }]}>
                                    {isCorrect ? '¡Excelente!' : '¡Sigue aprendiendo!'}
                                </AppText>
                            </View>
                            
                            {q.explanation && <AppText style={s.explanation}>{q.explanation}</AppText>}
                            {q.verseSupport && (
                                <View style={[s.verseBox, { borderColor: primaryColor + '30' }]}>
                                    <AppText style={[s.verseText, { color: primaryColor }]}>📖 {q.verseSupport}</AppText>
                                </View>
                            )}

                            <TouchableOpacity style={[s.nextQuestionBtn, { backgroundColor: primaryColor }]} onPress={nextQuestion}>
                                <AppText style={s.nextQuestionBtnText}>Siguiente</AppText>
                                <Ionicons name="arrow-forward" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    readyIconBox: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    titleContainer: { width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 36, fontWeight: '900', textAlign: 'center', lineHeight: 44 },
    subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.6)', marginTop: 8, fontWeight: '700' },
    readyDivider: { width: 60, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginVertical: 40 },
    startBtn: { height: 64, borderRadius: 32, paddingHorizontal: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    startBtnText: { color: '#000', fontSize: 20, fontWeight: '900' },
    backBtn: { marginTop: 30 },
    backBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: '600' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15, zIndex: 10 },
    progressBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
    progressText: { fontSize: 13, fontWeight: '900' },
    timerChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    timerText: { color: '#fff', fontSize: 16, fontWeight: '900' },
    closeIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    scrollContent: { paddingBottom: 80, paddingHorizontal: 20 },
    cardWrapper: { width: '100%', marginTop: 10 },
    questionCard: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', marginBottom: 15 },
    diffTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 15 },
    diffText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    questionText: { color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 32 },
    optionsGrid: { gap: 12 },
    optionBtn: { height: 60, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    optionText: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '700' },
    optionTextSelected: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '900' },
    feedbackCard: { marginTop: 15, backgroundColor: 'rgba(255,255,255,0.12)', padding: 18, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    feedbackTitle: { fontSize: 22, fontWeight: '900' },
    explanation: { color: '#ddd', fontSize: 16, lineHeight: 24, marginBottom: 15 },
    verseBox: { padding: 12, borderLeftWidth: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 20 },
    verseText: { fontSize: 15, fontWeight: '700', fontStyle: 'italic' },
    nextQuestionBtn: { height: 60, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    nextQuestionBtnText: { color: '#000', fontSize: 18, fontWeight: '900' },
    statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginTop: 10 }
});

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, AppText } from '../components';
import { useGameTimer } from '../hooks';
import { useSound } from '../context/SoundContext';
import { TriviaQuestion, Category } from '../data/categories';

// ─── Design Tokens ──────────────────────────────────────────
const GOLD = '#D4AF37';
const BG = '#050505';
const CORRECT_COLOR = '#27AE60';
const WRONG_COLOR = '#E74C3C';

export const TriviaGameScreen = ({ navigation, route }: any) => {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic, setVolumeModifier, pauseMusic, resumeMusic } = useSound();

    // ─── Route Params ──────────────────────────────────────────
    const { 
        categoryObj, 
        questions: initialQuestions, 
        duration = 60, // Total time for the session
        difficulty = 1 // 1: Semilla, 2: Discípulo, 3: Maestro
    } = route.params || {};

    // ─── State ────────────────────────────────────────────────
    const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState<'READY' | 'PLAYING' | 'FEEDBACK' | 'FINISHED'>('READY');
    
    // Feedback State (when an answer is clicked)
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    // ─── Animations ───────────────────────────────────────────
    const cardScale = useRef(new Animated.Value(0.95)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const readyPulse = useRef(new Animated.Value(1)).current;
    
    // Timer
    const onTimeEnd = () => handleGameFinish(score, currentQIndex);
    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(duration, onTimeEnd);

    // ─── Setup Phase ──────────────────────────────────────────
    useEffect(() => {
        // En un caso real: Filtramos por dificultad y mezclamos
        if (initialQuestions && initialQuestions.length > 0) {
            let filtered = initialQuestions;
            // Si quieres filtrar por dificultad:
            // if (difficulty) filtered = initialQuestions.filter(q => q.difficulty <= difficulty);
            
            const shuffled = [...filtered].sort(() => Math.random() - 0.5);
            setQuestions(shuffled);
        }
    }, [initialQuestions, difficulty]);

    // Pulso del botón JUGAR en READY
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

    // Animar entrada de nueva pregunta
    const animateNextQuestion = () => {
        cardScale.setValue(0.95);
        cardOpacity.setValue(0);
        Animated.parallel([
            Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
            Animated.timing(cardOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();
    };

    // ─── Core Game Logic ──────────────────────────────────────
    const startGame = () => {
        setScore(0);
        setCurrentQIndex(0);
        setSelectedOption(null);
        resetTimer();
        setGameStatus('PLAYING');
        startTimer();
        pauseMusic(); // Baja la música principal para concentrarse
        animateNextQuestion();
    };

    const handleAnswer = (index: number) => {
        if (gameStatus !== 'PLAYING') return;
        
        stopTimer(); // Pausamos el tiempo mundial mientras ven el feedback
        setSelectedOption(index);
        
        const currentQ = questions[currentQIndex];
        const correct = index === currentQ.correctIndex;
        setIsCorrect(correct);
        
        if (correct) {
            setScore(prev => prev + 1);
            playHaptic('success');
            playSound('correct');
        } else {
            playHaptic('impact');
            playSound('wrong');
        }
        
        setGameStatus('FEEDBACK');
    };

    const nextQuestion = () => {
        setSelectedOption(null);
        setIsCorrect(null);
        
        const nextIndex = currentQIndex + 1;
        if (nextIndex >= questions.length) {
            handleGameFinish(score + (isCorrect ? 1 : 0), nextIndex);
        } else {
            setCurrentQIndex(nextIndex);
            setGameStatus('PLAYING');
            startTimer();
            animateNextQuestion();
        }
    };

    const handleGameFinish = (finalScore: number, totalAnswered: number) => {
        setGameStatus('FINISHED');
        stopTimer();
        resumeMusic();
        
        // Formatear payload para inyectarlo al ResultsScreen que ya tienes
        const mockHistory = questions.slice(0, totalAnswered).map(q => ({
            word: q.question.substring(0, 30) + '...', // Usamos la misma estructura history
            result: 'pending' // Esto es para compatibilidad visual
        }));

        setTimeout(() => {
            navigation.replace('Results', {
                score: finalScore,
                total: totalAnswered, // Lo que alcanzó a responder
                category: categoryObj?.title || 'Trivia Bíblica',
                wordHistory: mockHistory,
                isTrivia: true // FLAG para decirle a Results que fuimos Trivia
            });
        }, 1500);
    };

    // ─── Renders ──────────────────────────────────────────────
    
    // 1. PANTALLA DE INICIO (READY)
    if (gameStatus === 'READY') {
        return (
            <View style={s.container}>
                <View style={[s.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                
                <View style={[s.centered, { paddingHorizontal: 20 }]}>
                    <View style={s.modePill}>
                        <Ionicons name="help-buoy" size={16} color={GOLD} />
                        <AppText style={s.modePillText}>TRIVIA BÍBLICA</AppText>
                    </View>
                    <AppText style={s.title}>{categoryObj?.title || 'Conocimiento General'}</AppText>
                    
                    <View style={s.statsBox}>
                        <View style={s.statCol}>
                            <AppText style={s.statVal}>{questions.length}</AppText>
                            <AppText style={s.statLabel}>Preguntas</AppText>
                        </View>
                        <View style={s.statCol}>
                            <AppText style={s.statVal}>{duration}s</AppText>
                            <AppText style={s.statLabel}>Tiempo Max</AppText>
                        </View>
                    </View>

                    <Animated.View style={{ transform: [{ scale: readyPulse }] }}>
                        <TouchableOpacity style={s.playBtn} onPress={startGame}>
                            <AppText style={s.playBtnText}>EMPEZAR TRIVIA</AppText>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        );
    }

    // Si terminó (cargando resultados)
    if (gameStatus === 'FINISHED') {
        return (
            <View style={s.container}>
                 <View style={s.centered}>
                     <Ionicons name="checkmark-circle" size={60} color={GOLD} />
                     <AppText style={[s.title, { marginTop: 20 }]}>¡Tiempo Cumplido!</AppText>
                     <AppText style={s.statLabel}>Calculando recompensas...</AppText>
                 </View>
            </View>
        );
    }

    // 2. JUEGO EN SÍ (PLAYING & FEEDBACK)
    const q = questions[currentQIndex];
    if (!q) return <View style={s.container} />; // Safeguard

    return (
        <View style={s.container}>
            {/* ── HEADER ── */}
            <View style={[s.header, { paddingTop: insets.top + 10, paddingHorizontal: 20, justifyContent: 'space-between' }]}>
                <View style={s.progressChip}>
                    <AppText style={s.progressText}>{currentQIndex + 1} / {questions.length}</AppText>
                </View>
                <View style={[s.timerBox, timeLeft <= 10 && { borderColor: WRONG_COLOR }]}>
                    <AppText style={[s.timerText, timeLeft <= 10 && { color: WRONG_COLOR }]}>{timeLeft}s</AppText>
                </View>
                <TouchableOpacity onPress={() => handleGameFinish(score, currentQIndex)} style={s.iconBtn}>
                    <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* ── QUESTION CARD ── */}
            <Animated.View style={[s.cardWrapper, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
                <View style={s.card}>
                    <AppText style={s.difficultyBadge}>
                        {q.difficulty === 1 ? '🌱 Semilla' : q.difficulty === 2 ? '⚔️ Discípulo' : '👑 Maestro'}
                    </AppText>
                    <AppText style={s.questionText}>{q.question}</AppText>
                </View>

                {/* ── OPTIONS ── */}
                <View style={s.optionsContainer}>
                    {q.options.map((opt: string, idx: number) => {
                        let btnStyle: any = s.optionBtn;
                        let textStyle: any = s.optionText;
                        let showIcon = null;

                        if (gameStatus === 'FEEDBACK') {
                            if (idx === q.correctIndex) {
                                btnStyle = [s.optionBtn, s.optionCorrect];
                                textStyle = [s.optionText, s.optionTextDark];
                                showIcon = <Ionicons name="checkmark-circle" size={22} color="#000" />;
                            } else if (idx === selectedOption) {
                                btnStyle = [s.optionBtn, s.optionWrong];
                                showIcon = <Ionicons name="close-circle" size={22} color={WRONG_COLOR} />;
                            } else {
                                btnStyle = [s.optionBtn, { opacity: 0.4 }]; // Dim others
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
                                {showIcon && <View style={s.iconWrap}>{showIcon}</View>}
                            </TouchableOpacity>
                        );
                    })}
                </View>
                
                {/* ── FEEDBACK PANEL (EXPLANATION) ── */}
                {gameStatus === 'FEEDBACK' && (
                    <View style={s.feedbackPanel}>
                        <AppText style={s.feedbackTitle}>
                            {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                        </AppText>
                        {q.explanation && (
                            <AppText style={s.feedbackExpl}>{q.explanation}</AppText>
                        )}
                        {q.verseSupport && (
                            <AppText style={s.feedbackVerse}>📖 {q.verseSupport}</AppText>
                        )}
                        
                        <TouchableOpacity style={s.nextBtn} onPress={nextQuestion}>
                            <AppText style={s.nextBtnText}>Siguiente Pregunta →</AppText>
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>
            
            {/* SCORE COUNTER */}
            <View style={[s.scoreCounter, { bottom: insets.bottom + 20 }]}>
                 <AppText style={s.scoreText}>PUNTOS: <AppText style={{color: GOLD}}>{score}</AppText></AppText>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    header: { flexDirection: 'row', alignItems: 'center', width: '100%', zIndex: 10 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    
    // Ready State
    modePill: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(212,175,55,0.1)',
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
        marginBottom: 16, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    },
    modePillText: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
    title: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 30 },
    statsBox: { flexDirection: 'row', gap: 40, marginBottom: 50 },
    statCol: { alignItems: 'center' },
    statVal: { color: '#fff', fontSize: 24, fontWeight: '900' },
    statLabel: { color: '#888', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    playBtn: {
        backgroundColor: GOLD, paddingHorizontal: 40, paddingVertical: 18,
        borderRadius: 30, shadowColor: GOLD, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }
    },
    playBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 2 },

    // Game State
    progressChip: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
    progressText: { color: '#fff', fontWeight: '800', fontSize: 14 },
    timerBox: { borderWidth: 2, borderColor: GOLD, width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212,175,55,0.1)' },
    timerText: { color: GOLD, fontSize: 18, fontWeight: '900' },
    
    cardWrapper: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', paddingBottom: 60 },
    card: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24, padding: 24, marginBottom: 24, alignItems: 'center'
    },
    difficultyBadge: { color: '#999', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 },
    questionText: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center', lineHeight: 30 },
    
    optionsContainer: { gap: 12 },
    optionBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)',
        padding: 18, borderRadius: 16,
    },
    optionText: { color: '#fff', fontSize: 15, fontWeight: '600', flex: 1 },
    optionCorrect: { backgroundColor: CORRECT_COLOR, borderColor: '#1E8449' },
    optionWrong: { borderColor: WRONG_COLOR, backgroundColor: 'rgba(231,76,60,0.15)' },
    optionTextDark: { color: '#000', fontWeight: '800' },
    iconWrap: { marginLeft: 10 },

    feedbackPanel: {
        marginTop: 24, padding: 20, borderRadius: 16,
        backgroundColor: 'rgba(212,175,55,0.08)',
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    },
    feedbackTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 8 },
    feedbackExpl: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22, marginBottom: 12 },
    feedbackVerse: { color: GOLD, fontSize: 13, fontWeight: '700', fontStyle: 'italic', marginBottom: 20 },
    nextBtn: { backgroundColor: '#fff', padding: 14, borderRadius: 12, alignItems: 'center' },
    nextBtnText: { color: '#000', fontSize: 14, fontWeight: '800' },

    scoreCounter: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    scoreText: { color: '#aaa', fontSize: 12, fontWeight: '800', letterSpacing: 1 }
});

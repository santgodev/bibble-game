import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, Animated, ActivityIndicator, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { StudyNode, StudyPath } from '../data/studyPaths';
import { Confetti } from '../components/Confetti';
import { useSound } from '../context/SoundContext';
import { submitGameResult } from '../lib/gamification/rewardService';

type Phase = 'content' | 'activity' | 'result';
type ActivityType = 'flip' | 'choice' | 'verse_complete';

// ─── Activity generator ─────────────────────────────────────
const buildActivity = (node: StudyNode): { type: ActivityType; data: any } | null => {
    if (node.type !== 'devotional' || !node.question) return null;

    // Every devotional gets a flip-card reveal for the application
    if (node.application) {
        return {
            type: 'flip',
            data: {
                front: node.question,
                back: node.application,
            }
        };
    }
    return null;
};

export const StudyDevotionalScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const { node, path }: { node: StudyNode; path: StudyPath } = route.params;

    const { playSound, playHaptic, pauseMusic, resumeMusic } = useSound();

    useFocusEffect(
        React.useCallback(() => {
            pauseMusic();
            return () => resumeMusic();
        }, [])
    );

    const [phase, setPhase] = useState<Phase>('content');
    const [saving, setSaving] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [alreadyDone, setAlreadyDone] = useState(false);

    // Activity state
    const activity = buildActivity(node);
    const [cardFlipped, setCardFlipped] = useState(false);
    const [activityDone, setActivityDone] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;

    // XP badge animation
    const xpBadgeScale = useRef(new Animated.Value(0)).current;
    const xpBadgeOpacity = useRef(new Animated.Value(0)).current;
    const xpBadgeY = useRef(new Animated.Value(0)).current;

    // Quiz state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const isLastQuestion = node.type === 'quiz' && node.quiz && currentQuestionIndex === node.quiz.questions.length - 1;

    const shakeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const bounce = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.08, duration: 120, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1.0, duration: 120, useNativeDriver: true }),
        ]).start();
    };

    const handleFlip = () => {
        if (cardFlipped) return;
        Animated.spring(flipAnim, {
            toValue: 1,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
        }).start(() => {
            setCardFlipped(true);
            setActivityDone(true);
            playHaptic('light');
        });
    };

    const flipInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
    const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

    const handleOptionSelect = (index: number) => {
        if (answered || !node.quiz) return;
        setSelectedOption(index);
        const currQ = node.quiz.questions[currentQuestionIndex];
        const correct = currQ.options[index].correct;
        setIsCorrect(correct);
        setAnswered(true);
        correct ? bounce() : shake();
    };

    const handleAction = async () => {
        // Devotional: first go to activity, then complete
        if (node.type === 'devotional' && phase === 'content') {
            if (activity) {
                setPhase('activity');
                return;
            }
        }

        // En quiz, manejar 'siguiente' o 'intentar de nuevo'
        if (node.type === 'quiz') {
            if (!isCorrect) {
                setSelectedOption(null);
                setAnswered(false);
                return;
            }
            if (!isLastQuestion) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setAnswered(false);
                return;
            }
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const sessionId = `DEVO_${user.id}_${node.id}`;

                const result = await submitGameResult(supabase, {
                    gameType: 'DEVOTIONAL',
                    sessionId,
                    userIds: [user.id],
                    payload: {
                        nodeId: node.id,
                        nodeType: node.type,
                        xpReward: node.xpReward,
                        trophyReward: node.trophyReward
                    }
                });

                if (!result.success && !result.alreadySubmitted) {
                    throw new Error(result.error || 'No se pudo registrar la recompensa del devocional.');
                }

                if (result.alreadySubmitted) {
                    setAlreadyDone(true);
                }
            }
        } catch (err: any) {
            console.error('Error saving node', err);
            Alert.alert('⚠️ Error de Guardado', err.message || 'No se pudo guardar el progreso. ¿Tienes internet?');
        } finally {
            setSaving(false);
            setPhase('result');
            playSound('win');
            playHaptic('victory');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3200);

            xpBadgeY.setValue(0);
            xpBadgeScale.setValue(0);
            xpBadgeOpacity.setValue(0);

            Animated.parallel([
                Animated.spring(xpBadgeScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
                Animated.timing(xpBadgeOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.sequence([
                    Animated.timing(xpBadgeY, { toValue: -12, duration: 600, useNativeDriver: true }),
                    Animated.timing(xpBadgeY, { toValue: 0, duration: 400, useNativeDriver: true }),
                ]),
            ]).start();
        }
    };

    const getColors = () => {
        switch (node.type) {
            case 'intro': return { c: '#9B59B6', i: 'book-outline' };
            case 'devotional': return { c: '#E67E22', i: 'sunny-outline' };
            case 'practice': return { c: '#3498DB', i: 'color-palette-outline' };
            case 'quiz': return { c: '#F1C40F', i: 'trophy-outline' };
            default: return { c: path.accentColor, i: 'ellipse-outline' };
        }
    };
    const nodeTheme = getColors();

    const DIFF_COLOR = { facil: '#27AE60', medio: '#D4AF37', dificil: '#E74C3C' };

    // ===================================
    // PHASE: RESULT
    // ===================================
    if (phase === 'result') {
        return (
            <View style={[styles.container, styles.resultContainer, { paddingTop: insets.top + 20 }]}>
                <StatusBar barStyle="light-content" backgroundColor="#050505" />
                <Confetti visible={showConfetti} duration={3200} />

                <View style={[styles.resultIconBg, { backgroundColor: nodeTheme.c + '15' }]}>
                    <Ionicons name="checkmark-done" size={52} color={nodeTheme.c} />
                </View>
                <Text style={[styles.resultTitle, { color: nodeTheme.c }]}>¡PASO COMPLETADO!</Text>
                <Text style={styles.resultDay}>{node.title}</Text>

                {alreadyDone ? (
                    <View style={{ marginTop: 20, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 15 }}>
                        <Ionicons name="information-circle" size={30} color="#aaa" />
                        <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>
                            Ya has cobrado las recompensas por este estudio. ¡Sigue avanzando al siguiente nivel!
                        </Text>
                    </View>
                ) : (
                    <View style={styles.rewardRow}>
                        <Animated.View style={[styles.rewardBox, {
                            transform: [{ scale: xpBadgeScale }, { translateY: xpBadgeY }],
                            opacity: xpBadgeOpacity,
                        }]}>
                            <View style={styles.rewardIconBg}>
                                <Ionicons name="flash" size={24} color="#D4AF37" />
                            </View>
                            <Text style={[styles.rewardNum, { color: '#D4AF37' }]}>+{node.xpReward}</Text>
                            <Text style={styles.rewardLabel}>XP GANADOS</Text>
                        </Animated.View>

                        <Animated.View style={[styles.rewardBox, {
                            transform: [{ scale: xpBadgeScale }, { translateY: xpBadgeY }],
                            opacity: xpBadgeOpacity,
                        }]}>
                            <View style={[styles.rewardIconBg, { backgroundColor: 'rgba(255,215,0,0.1)' }]}>
                                <Ionicons name="trophy" size={24} color="#FFD700" />
                            </View>
                            <Text style={[styles.rewardNum, { color: '#FFD700' }]}>+{node.trophyReward}</Text>
                            <Text style={styles.rewardLabel}>TROFEOS</Text>
                        </Animated.View>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.ctaBtn, { backgroundColor: nodeTheme.c, paddingHorizontal: 40, marginTop: 40 }]}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.ctaBtnText}>Ir al Mapa</Text>
                    <Ionicons name="map" size={18} color="rgba(0,0,0,0.6)" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        );
    }

    // ===================================
    // PHASE: ACTIVITY (Flip Card)
    // ===================================
    if (phase === 'activity' && activity) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <StatusBar barStyle="light-content" backgroundColor="#050505" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setPhase('content')} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={[styles.headerSub, { color: nodeTheme.c }]}>ACTIVIDAD</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={[styles.scrollContent, { alignItems: 'center' }]} showsVerticalScrollIndicator={false}>

                    {/* Step indicator */}
                    <View style={styles.stepRow}>
                        <View style={[styles.stepDot, { backgroundColor: nodeTheme.c }]} />
                        <View style={[styles.stepDot, { backgroundColor: nodeTheme.c }]} />
                        <View style={[styles.stepDot, { backgroundColor: '#222' }]} />
                    </View>

                    <Text style={styles.activityLabel}>💭 REFLEXIONA</Text>
                    <Text style={styles.activityInstruction}>
                        {cardFlipped ? '¡Muy bien! Ahora medita en la aplicación.' : 'Lee la pregunta y piénsalo. Luego voltea la tarjeta.'}
                    </Text>

                    {/* Flip Card */}
                    <View style={styles.flipCardContainer}>
                        {/* FRONT */}
                        <Animated.View
                            style={[
                                styles.flipCard,
                                styles.flipCardFront,
                                {
                                    opacity: frontOpacity,
                                    transform: [{ rotateY: flipInterpolate }],
                                    borderColor: nodeTheme.c + '60',
                                    position: 'absolute',
                                }
                            ]}
                        >
                            <LinearGradient
                                colors={[nodeTheme.c + '18', nodeTheme.c + '06']}
                                style={styles.flipCardGradient}
                            >
                                <Ionicons name="help-circle" size={32} color={nodeTheme.c} style={{ marginBottom: 16 }} />
                                <Text style={styles.flipCardQuestion}>{activity.data.front}</Text>
                                <View style={styles.flipHint}>
                                    <Ionicons name="repeat" size={14} color="#555" />
                                    <Text style={styles.flipHintText}>Toca para voltear</Text>
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        {/* BACK */}
                        <Animated.View
                            style={[
                                styles.flipCard,
                                styles.flipCardBack,
                                {
                                    opacity: backOpacity,
                                    position: 'absolute',
                                }
                            ]}
                        >
                            <LinearGradient
                                colors={['#27AE6018', '#27AE6006']}
                                style={styles.flipCardGradient}
                            >
                                <Ionicons name="bulb" size={32} color="#27AE60" style={{ marginBottom: 16 }} />
                                <Text style={[styles.flipCardLabel, { color: '#27AE60' }]}>APLÍCALO HOY</Text>
                                <Text style={styles.flipCardBack2}>{activity.data.back}</Text>
                            </LinearGradient>
                        </Animated.View>

                        {/* Touchable overlay */}
                        {!cardFlipped && (
                            <TouchableOpacity
                                style={styles.flipCardTouchable}
                                onPress={handleFlip}
                                activeOpacity={0.7}
                            />
                        )}
                    </View>

                    {/* Share prompt */}
                    {cardFlipped && (
                        <Animated.View style={[styles.sharePrompt]}>
                            <Text style={styles.sharePromptText}>
                                ✅ Medita en esto hoy. Cuando estés listo, completa el paso.
                            </Text>
                        </Animated.View>
                    )}

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* CTA */}
                <View style={styles.activityFooter}>
                    <TouchableOpacity
                        style={[
                            styles.ctaBtn,
                            { backgroundColor: activityDone ? nodeTheme.c : '#1a1a1a' },
                            !activityDone && { borderWidth: 1, borderColor: '#222', opacity: 0.5 }
                        ]}
                        onPress={handleAction}
                        disabled={!activityDone || saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={22} color={activityDone ? '#000' : '#555'} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={[styles.ctaBtnText, { color: activityDone ? '#000' : '#555' }]}>
                                        Completar y Reclamar
                                    </Text>
                                    <Text style={[styles.ctaBtnSub, { color: activityDone ? 'rgba(0,0,0,0.6)' : '#444' }]}>
                                        +{node.xpReward} XP · +{node.trophyReward} Trofeos
                                    </Text>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // ===================================
    // PHASE: CONTENT (Lectura / Quiz)
    // ===================================
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor="#050505" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerSub, { color: nodeTheme.c }]}>{node.subtitle}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Step tracker for devotional */}
                {node.type === 'devotional' && (
                    <View style={styles.stepRow}>
                        <View style={[styles.stepDot, { backgroundColor: nodeTheme.c }]} />
                        <View style={[styles.stepDot, { backgroundColor: '#222' }]} />
                        <View style={[styles.stepDot, { backgroundColor: '#222' }]} />
                    </View>
                )}

                <Text style={styles.nodeMainTitle}>{node.title}</Text>

                {/* --- RENDERIZADO POR TIPO --- */}

                {/* 1. INTRO / DEVOTIONAL (Textos) */}
                {(node.type === 'intro' || node.type === 'devotional') && (
                    <>
                        <View style={[styles.refPill, { borderColor: nodeTheme.c + '55', backgroundColor: nodeTheme.c + '10' }]}>
                            <Ionicons name="book" size={16} color={nodeTheme.c} />
                            <Text style={[styles.refText, { color: nodeTheme.c }]}>{node.bibleRef}</Text>
                        </View>

                        <View style={styles.readingCard}>
                            <Text style={styles.readingText}>{node.passage}</Text>
                        </View>

                        {node.type === 'intro' && node.reflection && (
                            <View style={styles.insightBox}>
                                <Ionicons name="bulb" size={20} color={nodeTheme.c} style={{ marginRight: 10 }} />
                                <Text style={styles.insightText}>{node.reflection}</Text>
                            </View>
                        )}

                        {node.type === 'devotional' && (
                            <View style={styles.devoWrapper}>
                                {/* Teaser de la actividad — solo muestra la pregunta */}
                                {node.question && (
                                    <LinearGradient
                                        colors={[nodeTheme.c + '18', nodeTheme.c + '05']}
                                        style={[styles.teaser, { borderColor: nodeTheme.c + '40' }]}
                                    >
                                        <View style={styles.teaserHeader}>
                                            <Ionicons name="chatbubble-ellipses" size={16} color={nodeTheme.c} />
                                            <Text style={[styles.teaserLabel, { color: nodeTheme.c }]}>PREGUNTA DE REFLEXIÓN</Text>
                                        </View>
                                        <Text style={styles.teaserText}>{node.question}</Text>
                                        <View style={styles.teaserFooter}>
                                            <Ionicons name="lock-closed" size={12} color="#555" />
                                            <Text style={styles.teaserLocked}>La aplicación práctica se revela en el siguiente paso</Text>
                                        </View>
                                    </LinearGradient>
                                )}
                            </View>
                        )}
                    </>
                )}

                {/* 2. PRACTICE */}
                {node.type === 'practice' && (
                    <>
                        <View style={styles.practiceHeader}>
                            <View style={styles.iconCircleBig}>
                                <Ionicons name="people" size={32} color={nodeTheme.c} />
                            </View>
                            <Text style={styles.practiceTitle}>Sábado en Grupo</Text>
                            <Text style={styles.practiceDesc}>{node.reflection}</Text>
                        </View>

                        {node.charadas && node.charadas.length > 0 && (
                            <View style={styles.charadasBox}>
                                <View style={styles.charadasTitleRow}>
                                    <Ionicons name="game-controller" size={20} color="#fff" />
                                    <Text style={styles.charadasTitle}>Banco de Charadas Especiales</Text>
                                </View>
                                <Text style={styles.charadasSub}>Juega estas palabras en la app principal para ganar más puntos en tu iglesia hoy.</Text>

                                {node.charadas.map((c, i) => (
                                    <View key={i} style={styles.charadaItem}>
                                        <Text style={styles.cWord}>{c.word}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <View style={styles.cCatBg}><Text style={styles.cCat}>{c.category}</Text></View>
                                            <View style={[styles.cDiffBg, { backgroundColor: DIFF_COLOR[c.difficulty] + '20' }]}>
                                                <Text style={[styles.cDiff, { color: DIFF_COLOR[c.difficulty] }]}>{c.difficulty}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}

                {/* 3. QUIZ */}
                {node.type === 'quiz' && node.quiz && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: '#888', textAlign: 'center', marginBottom: 16, fontSize: 13, fontWeight: '700', letterSpacing: 1 }}>
                            PREGUNTA {currentQuestionIndex + 1} DE {node.quiz.questions.length}
                        </Text>
                        <Animated.View style={{ transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }}>
                            <View style={styles.quizCard}>
                                <View style={[styles.iconCircleBig, { backgroundColor: nodeTheme.c + '15', marginBottom: 20 }]}>
                                    <Ionicons name="help" size={36} color={nodeTheme.c} />
                                </View>
                                <Text style={styles.quizQuestion}>{node.quiz.questions[currentQuestionIndex].question}</Text>
                            </View>
                        </Animated.View>

                        <View style={styles.optionsContainer}>
                            {node.quiz.questions[currentQuestionIndex].options.map((option, i) => {
                                let borderColor = '#1A1A1A';
                                let bgColor = '#0A0A0A';
                                let textColor = '#ccc';
                                let rightIcon: string | null = null;

                                if (answered && selectedOption === i) {
                                    borderColor = option.correct ? '#27AE60' : '#E74C3C';
                                    bgColor = option.correct ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)';
                                    textColor = option.correct ? '#27AE60' : '#E74C3C';
                                    rightIcon = option.correct ? 'checkmark-circle' : 'close-circle';
                                } else if (answered && option.correct) {
                                    borderColor = '#27AE60'; textColor = '#27AE60';
                                }

                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.optionCard, { borderColor, backgroundColor: bgColor }]}
                                        onPress={() => handleOptionSelect(i)}
                                        activeOpacity={answered ? 1 : 0.7}
                                    >
                                        <View style={[styles.optionLetterBox, { borderColor }]}>
                                            <Text style={[styles.optionLetter, { color: textColor }]}>
                                                {['A', 'B', 'C', 'D'][i]}
                                            </Text>
                                        </View>
                                        <Text style={[styles.optionText, { color: textColor }]}>{option.text}</Text>
                                        {rightIcon && <Ionicons name={rightIcon as any} size={20} color={textColor} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {answered && !isCorrect && (
                            <View style={[styles.feedbackCard, { borderColor: '#E74C3C', backgroundColor: 'rgba(231,76,60,0.08)' }]}>
                                <Ionicons name="close-circle" size={24} color="#E74C3C" />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={[styles.feedbackTitle, { color: '#E74C3C' }]}>Fallaste</Text>
                                    <Text style={styles.feedbackText}>Vuelve a intentarlo para continuar.</Text>
                                </View>
                            </View>
                        )}
                        {answered && isCorrect && (
                            <View style={[styles.feedbackCard, { borderColor: '#27AE60', backgroundColor: 'rgba(39,174,96,0.08)' }]}>
                                <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={[styles.feedbackTitle, { color: '#27AE60' }]}>¡Correcto!</Text>
                                    <Text style={styles.feedbackText}>
                                        {isLastQuestion ? 'Respuesta perfecta. Ya puedes completar la misión.' : '¡Genial! Toca el botón para continuar.'}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.footerSpacer} />

                <TouchableOpacity
                    style={[
                        styles.ctaBtn,
                        { backgroundColor: nodeTheme.c },
                        (node.type === 'quiz' && (!answered || !isCorrect)) && { backgroundColor: '#333', opacity: 0.5 },
                        saving && { opacity: 0.6 }
                    ]}
                    onPress={handleAction}
                    disabled={saving || (node.type === 'quiz' && (!answered || !isCorrect))}
                    activeOpacity={0.8}
                >
                    {saving ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <>
                            <Ionicons
                                name={node.type === 'devotional' && activity ? 'arrow-forward-circle' : 'checkmark-circle'}
                                size={22}
                                color="#000"
                            />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.ctaBtnText}>
                                    {node.type === 'quiz'
                                        ? (answered && !isCorrect
                                            ? 'Intenta de nuevo'
                                            : (!isLastQuestion ? 'Siguiente Pregunta' : 'Terminar Reto'))
                                        : node.type === 'devotional' && activity
                                            ? 'Continuar a Actividad'
                                            : 'He completado esto'}
                                </Text>
                                {(node.type !== 'quiz' || (answered && isCorrect)) && (
                                    <Text style={styles.ctaBtnSub}>
                                        {node.type === 'devotional' && activity
                                            ? 'La aplicación te espera 👀'
                                            : node.type === 'quiz' && !isLastQuestion
                                                ? 'Continuar'
                                                : `Reclamar +${node.xpReward} XP`}
                                    </Text>
                                )}
                            </View>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#111',
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerSub: { fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
    iconBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#111', alignItems: 'center', justifyContent: 'center',
    },
    scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 60 },

    // Step tracker
    stepRow: { flexDirection: 'row', gap: 8, alignSelf: 'center', marginBottom: 24 },
    stepDot: { width: 8, height: 8, borderRadius: 4 },

    nodeMainTitle: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 24, lineHeight: 32 },

    // Reading
    refPill: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 10,
        borderRadius: 16, borderWidth: 1, alignSelf: 'flex-start',
        marginBottom: 16,
    },
    refText: { fontSize: 14, fontWeight: '800', marginLeft: 8 },
    readingCard: {
        backgroundColor: '#0A0A0A', padding: 24, borderRadius: 20,
        borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 20,
    },
    readingText: { color: '#ddd', fontSize: 16, lineHeight: 28, fontWeight: '500' },
    insightBox: {
        flexDirection: 'row', backgroundColor: '#111', padding: 16,
        borderRadius: 14, borderWidth: 1, borderColor: '#1A1A1A',
        marginTop: 10, alignItems: 'center',
    },
    insightText: { color: '#aaa', fontSize: 14, lineHeight: 22, flex: 1 },

    // Teaser (replaced flat actionCard)
    devoWrapper: { gap: 16, marginTop: 10 },
    teaser: {
        borderRadius: 20, borderWidth: 1, overflow: 'hidden',
    },
    teaserHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8,
    },
    teaserLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase' },
    teaserText: { color: '#fff', fontSize: 15, lineHeight: 24, fontStyle: 'italic', fontWeight: '500', paddingHorizontal: 16, paddingBottom: 12 },
    teaserFooter: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
        paddingVertical: 10, paddingHorizontal: 16,
    },
    teaserLocked: { color: '#555', fontSize: 11, fontWeight: '600' },

    // Practice
    practiceHeader: { alignItems: 'center', paddingVertical: 20 },
    iconCircleBig: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    practiceTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 12 },
    practiceDesc: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },

    charadasBox: {
        backgroundColor: '#0A0A0A', borderRadius: 20, padding: 20, marginTop: 30, borderWidth: 1, borderColor: '#1A1A1A'
    },
    charadasTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    charadasTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
    charadasSub: { color: '#666', fontSize: 13, marginBottom: 20, lineHeight: 20 },
    charadaItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#111', padding: 14, borderRadius: 12, marginBottom: 8,
    },
    cWord: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 },
    cCatBg: { backgroundColor: '#222', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    cCat: { color: '#888', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    cDiffBg: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    cDiff: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },

    // Quiz
    quizCard: {
        alignItems: 'center', padding: 20, backgroundColor: '#0A0A0A',
        borderRadius: 24, borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 24,
    },
    quizQuestion: { color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center', lineHeight: 28 },
    optionsContainer: { gap: 12 },
    optionCard: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        padding: 16, borderRadius: 16, borderWidth: 1.5,
    },
    optionLetterBox: {
        width: 32, height: 32, borderRadius: 10, borderWidth: 1,
        alignItems: 'center', justifyContent: 'center',
    },
    optionLetter: { fontSize: 14, fontWeight: '900' },
    optionText: { flex: 1, fontSize: 15, fontWeight: '600' },

    feedbackCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 20 },
    feedbackTitle: { fontSize: 16, fontWeight: '800' },
    feedbackText: { color: '#888', fontSize: 13, marginTop: 4 },

    footerSpacer: { marginTop: 40 },
    ctaBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        padding: 20, borderRadius: 18,
    },
    ctaBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },
    ctaBtnSub: { color: 'rgba(0,0,0,0.6)', fontSize: 12, fontWeight: '700', marginTop: 2 },

    // Activity / Flip Card
    activityLabel: {
        color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 8,
    },
    activityInstruction: {
        color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 32, paddingHorizontal: 20,
    },
    flipCardContainer: {
        width: '100%', height: 280, position: 'relative', alignItems: 'center',
    },
    flipCard: {
        width: '100%', height: 280, borderRadius: 24, borderWidth: 1,
        overflow: 'hidden', backfaceVisibility: 'hidden',
    },
    flipCardFront: { backgroundColor: '#0A0A0A' },
    flipCardBack: { backgroundColor: '#0A0A14', borderColor: '#27AE6040' },
    flipCardGradient: {
        flex: 1, padding: 28, alignItems: 'center', justifyContent: 'center',
    },
    flipCardQuestion: {
        color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center',
        lineHeight: 26,
    },
    flipCardLabel: {
        fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 12,
        textTransform: 'uppercase',
    },
    flipCardBack2: {
        color: '#ccc', fontSize: 15, fontWeight: '600', textAlign: 'center',
        lineHeight: 24, fontStyle: 'italic',
    },
    flipHint: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        marginTop: 24, opacity: 0.5,
    },
    flipHintText: { color: '#555', fontSize: 12 },
    flipCardTouchable: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24,
    },
    sharePrompt: {
        backgroundColor: 'rgba(39,174,96,0.08)', borderRadius: 16,
        borderWidth: 1, borderColor: 'rgba(39,174,96,0.25)',
        padding: 16, marginTop: 24, width: '100%',
    },
    sharePromptText: {
        color: '#27AE60', fontSize: 14, textAlign: 'center', fontWeight: '600', lineHeight: 22,
    },
    activityFooter: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12,
        backgroundColor: '#050505',
        borderTopWidth: 1, borderTopColor: '#111',
    },

    // Result Phase
    resultContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
    resultIconBg: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    resultTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginBottom: 8 },
    resultDay: { color: '#777', fontSize: 15, textAlign: 'center', marginBottom: 30 },
    rewardRow: { flexDirection: 'row', gap: 16 },
    rewardBox: {
        backgroundColor: '#0A0A0A', padding: 24, borderRadius: 20,
        borderWidth: 1, borderColor: '#1A1A1A', flex: 1, alignItems: 'center',
    },
    rewardIconBg: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    rewardNum: { fontSize: 28, fontWeight: '900' },
    rewardLabel: { color: '#555', fontSize: 11, fontWeight: '800', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
});

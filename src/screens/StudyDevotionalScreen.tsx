import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, Animated, ActivityIndicator, Alert, TextInput
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { StudyNode, StudyPath } from '../data/studyPaths';
import { Confetti } from '../components/Confetti';
import { useSound } from '../context/SoundContext';
import { submitGameResult } from '../lib/gamification/rewardService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Phase = 'content' | 'microQuiz' | 'activity' | 'result';
type ActivityType = 'journal' | 'flip' | 'choice' | 'verse_complete';

// ─── Activity generator ─────────────────────────────────────
const buildActivity = (node: StudyNode): { type: ActivityType; data: any } | null => {
    if (node.type !== 'devotional' || !node.question) return null;

    if (node.application) {
        return {
            type: 'journal',
            data: {
                question: node.question,
                application: node.application,
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
    const isClaiming = useRef(false);  // ← guarda síncrona anti-doble-tap
    const [showConfetti, setShowConfetti] = useState(false);
    const [alreadyDone, setAlreadyDone] = useState(false);

    // Activity state
    const activity = buildActivity(node);
    const [journalEntry, setJournalEntry] = useState('');
    const [activityDone, setActivityDone] = useState(false);

    useEffect(() => {
        if (activity?.type === 'journal') {
            AsyncStorage.getItem(`@journal_${node.id}`).then(val => {
                if (val) {
                    setJournalEntry(val);
                    if (val.trim().length >= 10) setActivityDone(true);
                }
            });
        }
    }, []);

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



    const handleOptionSelect = (index: number) => {
        if (answered) return;
        setSelectedOption(index);

        let correct = false;
        if (node.type === 'quiz' && node.quiz) {
            correct = node.quiz.questions[currentQuestionIndex].options[index].correct;
        } else if (phase === 'microQuiz' && node.microQuiz) {
            correct = node.microQuiz.options[index].correct;
        } else {
             return;
        }

        setIsCorrect(correct);
        setAnswered(true);
        correct ? bounce() : shake();
    };

    const handleAction = async () => {
        // Devotional: content -> microQuiz -> activity -> save
        if (node.type === 'devotional' && phase === 'content') {
            if (node.microQuiz) {
                setPhase('microQuiz');
                return;
            } else if (activity) {
                setPhase('activity');
                return;
            }
        }

        if (phase === 'microQuiz') {
            if (!isCorrect) {
                 setSelectedOption(null);
                 setAnswered(false);
                 return;
            }
            // Is correct: reset state for next steps
            setSelectedOption(null);
            setAnswered(false);
            if (activity) {
                 setPhase('activity');
                 return;
            }
            // If no activity, it will fall through to save!
        }

        // En quiz grueso, manejar 'siguiente' o 'intentar de nuevo'
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

        // ── Guardia síncrona: bloquea ANTES de cualquier setState ──
        if (isClaiming.current) return;
        isClaiming.current = true;

        if (activity && activity.type === 'journal' && journalEntry.trim().length > 0) {
            try {
                await AsyncStorage.setItem(`@journal_${node.id}`, journalEntry);
            } catch (e) {}
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
                    throw new Error(result.error || 'No se pudo registrar la recompensa.');
                }

                if (result.alreadySubmitted) setAlreadyDone(true);
            }

            // ── Éxito: reproducir sonido EXACTAMENTE UNA VEZ ──
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
            setSaving(false);
        } catch (err: any) {
            console.error('Error saving node', err);
            setSaving(false);
            isClaiming.current = false;
            Alert.alert('⚠️ Error de Guardado', err.message || 'No se pudo guardar el progreso. ¿Tienes internet?');
        }
    };

    const getColors = () => {
        switch (node.type) {
            case 'intro': return { c: '#2E6F65', soft: '#DCECE8', i: 'book-outline' };
            case 'devotional': return { c: '#1E3A5F', soft: '#D6E8F8', i: 'sunny-outline' };
            case 'practice': return { c: '#2E6F65', soft: '#DCECE8', i: 'compass-outline' };
            case 'quiz': return { c: '#8A6408', soft: '#FBF2D0', i: 'trophy-outline' };
            default: return { c: '#1E3A5F', soft: '#D6E8F8', i: 'ellipse-outline' };
        }
    };
    const nodeTheme = getColors();

    const DIFF_COLOR = { facil: '#2E6F65', medio: '#1E3A5F', dificil: '#9E3A3A' };

    // ===================================
    // PHASE: RESULT
    // ===================================
    if (phase === 'result') {
        return (
            <View style={[styles.container, styles.resultContainer, { paddingTop: insets.top + 20 }]}>
                <StatusBar barStyle="dark-content" />
                <Confetti visible={showConfetti} duration={3200} />

                <View style={[styles.resultIconBg, { backgroundColor: nodeTheme.c + '15' }]}>
                    <Ionicons name="checkmark-done" size={52} color={nodeTheme.c} />
                </View>
                <Text style={[styles.resultTitle, { color: nodeTheme.c }]}>¡PASO COMPLETADO!</Text>
                <Text style={styles.resultDay}>{node.title}</Text>

                {alreadyDone ? (
                    <View style={{ marginTop: 20, alignItems: 'center', backgroundColor: "rgba(255,255,255,0.48)", padding: 15, borderRadius: 15 }}>
                        <Ionicons name="information-circle" size={30} color="#636477" />
                        <Text style={{ color: "#636477", fontSize: 16, textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>
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
                                <Ionicons name="flash" size={24} color="#68A877" />
                            </View>
                            <Text style={[styles.rewardNum, { color: "#68A877" }]}>+{node.xpReward}</Text>
                            <Text style={styles.rewardLabel}>XP GANADOS</Text>
                        </Animated.View>

                        <Animated.View style={[styles.rewardBox, {
                            transform: [{ scale: xpBadgeScale }, { translateY: xpBadgeY }],
                            opacity: xpBadgeOpacity,
                        }]}>
                            <View style={[styles.rewardIconBg, { backgroundColor: "rgba(11,138,94,0.1)" }]}>
                                <Ionicons name="trophy" size={24} color="#68A877" />
                            </View>
                            <Text style={[styles.rewardNum, { color: "#68A877" }]}>+{node.trophyReward}</Text>
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
                    <Ionicons name="map" size={18} color="#636477" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        );
    }

    // ===================================
    // PHASE: MICRO-QUIZ (Validation)
    // ===================================
    if (phase === 'microQuiz' && node.microQuiz) {
        return (
             <View style={[styles.container, { paddingTop: insets.top }]}>
                 <StatusBar barStyle="dark-content" />
                 <View style={styles.header}>
                     <TouchableOpacity onPress={() => setPhase('content')} style={styles.iconBtn}>
                         <Ionicons name="arrow-back" size={22} color="#2D3043" />
                     </TouchableOpacity>
                     <View style={styles.headerCenter}>
                         <Text style={[styles.headerSub, { color: nodeTheme.c }]}>RETO DEL DÍA</Text>
                     </View>
                     <View style={{ width: 40 }} />
                 </View>

                 <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                     <View style={styles.stepRow}>
                         <View style={[styles.stepDot, { backgroundColor: nodeTheme.c }]} />
                         <View style={[styles.stepDot, { backgroundColor: nodeTheme.c }]} />
                         <View style={[styles.stepDot, { backgroundColor: "rgba(255,255,255,0.52)" }]} />
                         <View style={[styles.stepDot, { backgroundColor: "rgba(255,255,255,0.52)" }]} />
                     </View>

                     <Animated.View style={{ transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }}>
                         <View style={styles.quizCard}>
                             <View style={[styles.iconCircleBig, { backgroundColor: nodeTheme.c + '15', marginBottom: 20 }]}>
                                 <Ionicons name="flash" size={36} color={nodeTheme.c} />
                             </View>
                             <Text style={styles.quizQuestion}>{node.microQuiz.question}</Text>
                         </View>
                     </Animated.View>

                     <View style={styles.optionsContainer}>
                         {node.microQuiz.options.map((option, i) => {
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
                                 <Text style={[styles.feedbackTitle, { color: '#E74C3C' }]}>Aún no</Text>
                                 <Text style={styles.feedbackText}>Vuelve a intentarlo para continuar la lectura.</Text>
                             </View>
                         </View>
                     )}
                     {answered && isCorrect && (
                         <View style={[styles.feedbackCard, { borderColor: '#27AE60', backgroundColor: 'rgba(39,174,96,0.08)' }]}>
                             <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
                             <View style={{ flex: 1, marginLeft: 10 }}>
                                 <Text style={[styles.feedbackTitle, { color: '#27AE60' }]}>¡Excelente!</Text>
                                 <Text style={styles.feedbackText}>Has entendido la esencia del devocional.</Text>
                             </View>
                         </View>
                     )}

                     <View style={{ height: 40 }} />
                 </ScrollView>

                 <View style={styles.activityFooter}>
                     <TouchableOpacity
                         style={[
                             styles.ctaBtn,
                             { backgroundColor: (answered && isCorrect) ? nodeTheme.c : "#E4EAEF" },
                             (!answered || !isCorrect) && { opacity: 0.65 }
                         ]}
                         onPress={handleAction}
                         disabled={!answered || !isCorrect}
                         activeOpacity={0.8}
                     >
                         <Ionicons name="arrow-forward-circle" size={22} color={(answered && isCorrect) ? "#C1D3CB" : "#C1D3CB"} />
                         <View style={{ marginLeft: 12 }}>
                             <Text style={[styles.ctaBtnText, { color: (answered && isCorrect) ? "#C1D3CB" : "#C1D3CB" }]}>
                                 {activity ? 'Siguiente: Aplicación' : 'Reclamar Loot'}
                             </Text>
                         </View>
                     </TouchableOpacity>
                 </View>
             </View>
        );
    }

    // ===================================
    // PHASE: ACTIVITY (Journal / Input)
    // ===================================
    if (phase === 'activity' && activity && activity.type === 'journal') {
        const isValidEntry = journalEntry.trim().length >= 10;

        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <StatusBar barStyle="dark-content" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setPhase('content')} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={22} color="#2D3043" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={[styles.headerSub, { color: nodeTheme.c }]}>DIARIO DIGITAL</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={[styles.scrollContent, { alignItems: 'stretch' }]} showsVerticalScrollIndicator={false}>

                    {/* Step indicator */}
                    <View style={[styles.stepRow, { alignSelf: 'center' }]}>
                        <View style={[styles.stepDot, { backgroundColor: nodeTheme.c }]} />
                        <View style={[styles.stepDot, { backgroundColor: nodeTheme.c }]} />
                        <View style={[styles.stepDot, { backgroundColor: nodeTheme.c }]} />
                        <View style={[styles.stepDot, { backgroundColor: "rgba(255,255,255,0.52)" }]} />
                    </View>

                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <Text style={styles.activityLabel}>Reflexiona y escribe</Text>
                        <Text style={[styles.activityInstruction, { textAlign: 'center' }]}>
                            {isValidEntry ? 'Excelente reflexión. Ya puedes reclamar tus recompensas.' : 'Plasma tus pensamientos. Esto quedará guardado solo para ti.'}
                        </Text>
                    </View>

                    <View
                        style={{
                            padding: 20,
                            borderRadius: 20,
                            backgroundColor: nodeTheme.soft,
                            marginBottom: 20
                        }}
                    >
                        <Ionicons name="help-circle-outline" size={24} color={nodeTheme.c} style={{ marginBottom: 10 }} />
                        <Text style={{ fontSize: 17, color: "#1B1E23", fontWeight: '800', lineHeight: 24, marginBottom: 14 }}>
                            {activity.data.question}
                        </Text>

                        <View style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 14,
                            padding: 12,
                        }}>
                            <TextInput
                                style={{
                                    color: "#1B1E23",
                                    fontSize: 16,
                                    lineHeight: 24,
                                    minHeight: 120,
                                }}
                                placeholderTextColor="#5B6573"
                                placeholder="Escribe tu reflexión aquí..."
                                multiline
                                textAlignVertical="top"
                                value={journalEntry}
                                onChangeText={(text: string) => {
                                    setJournalEntry(text);
                                    if (text.trim().length >= 10) setActivityDone(true);
                                    else setActivityDone(false);
                                }}
                            />
                        </View>
                        {!isValidEntry && (
                            <Text style={{ color: "#5B6573", fontSize: 12, marginTop: 10, textAlign: 'right' }}>
                                Escribe al menos 10 caracteres...
                            </Text>
                        )}
                    </View>

                    {isValidEntry && (
                        <Animated.View style={[styles.sharePrompt]}>
                            <Text style={styles.sharePromptText}>
                                {activity.data.application}
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
                            { backgroundColor: isValidEntry ? nodeTheme.c : "#E4EAEF" },
                            !isValidEntry && { opacity: 0.65 }
                        ]}
                        onPress={handleAction}
                        disabled={!isValidEntry || saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#2D3043" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={22} color={isValidEntry ? "#C1D3CB" : "#C1D3CB"} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={[styles.ctaBtnText, { color: isValidEntry ? "#C1D3CB" : "#C1D3CB" }]}>
                                        Completar y Reclamar
                                    </Text>
                                    <Text style={[styles.ctaBtnSub, { color: isValidEntry ? 'rgba(0,0,0,0.6)' : "#C1D3CB" }]}>
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
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="close" size={24} color="#2D3043" />
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
                        <View style={[styles.stepDot, { backgroundColor: "rgba(255,255,255,0.52)" }]} />
                        <View style={[styles.stepDot, { backgroundColor: "rgba(255,255,255,0.52)" }]} />
                        <View style={[styles.stepDot, { backgroundColor: "rgba(255,255,255,0.52)" }]} />
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
                                    <View
                                        style={[styles.teaser, { backgroundColor: '#FBF2D0' }]}
                                    >
                                        <View style={styles.teaserHeader}>
                                            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#8A6408" />
                                            <Text style={[styles.teaserLabel, { color: '#8A6408' }]}>Pregunta de reflexión</Text>
                                        </View>
                                        <Text style={styles.teaserText}>{node.question}</Text>
                                        <View style={styles.teaserFooter}>
                                            <Ionicons name="lock-closed-outline" size={12} color="#5B6573" />
                                            <Text style={styles.teaserLocked}>Completa la lectura para acceder al reto</Text>
                                        </View>
                                    </View>
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
                                    <Ionicons name="game-controller" size={20} color="#2D3043" />
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
                        <Text style={{ color: "#636477", textAlign: 'center', marginBottom: 16, fontSize: 13, fontWeight: '700', letterSpacing: 1 }}>
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
                        (node.type === 'quiz' && (!answered || !isCorrect)) && { backgroundColor: "rgba(255,255,255,0.52)", opacity: 0.5 },
                        saving && { opacity: 0.6 }
                    ]}
                    onPress={handleAction}
                    disabled={saving || (node.type === 'quiz' && (!answered || !isCorrect))}
                    activeOpacity={0.8}
                >
                    {saving ? (
                        <ActivityIndicator color="#2D3043" />
                    ) : (
                        <>
                            <Ionicons
                                name={node.type === 'devotional' && activity ? 'arrow-forward-circle' : 'checkmark-circle'}
                                size={22}
                                color="#2D3043"
                            />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.ctaBtnText}>
                                    {node.type === 'quiz'
                                        ? (answered && !isCorrect
                                            ? 'Intenta de nuevo'
                                            : (!isLastQuestion ? 'Siguiente Pregunta' : 'Terminar Reto'))
                                        : node.type === 'devotional' && (node.microQuiz || activity)
                                            ? (node.microQuiz ? 'Ir al Reto' : 'Continuar a Actividad')
                                            : 'He completado esto'}
                                </Text>
                                {(node.type !== 'quiz' || (answered && isCorrect)) && (
                                    <Text style={styles.ctaBtnSub}>
                                        {node.type === 'devotional' && (node.microQuiz || activity)
                                            ? 'Aún falta un paso más 👀'
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
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 12,
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerSub: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#F6F8FA', alignItems: 'center', justifyContent: 'center',
    },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 60 },

    // Step tracker
    stepRow: { flexDirection: 'row', gap: 8, alignSelf: 'center', marginBottom: 20 },
    stepDot: { width: 8, height: 8, borderRadius: 4 },

    nodeMainTitle: { color: '#1B1E23', fontSize: 24, fontWeight: '800', marginBottom: 18, lineHeight: 30 },

    // Reading
    refPill: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 14, alignSelf: 'flex-start',
        marginBottom: 14,
    },
    refText: { fontSize: 13, fontWeight: '700', marginLeft: 8 },
    readingCard: {
        backgroundColor: '#F6F8FA', padding: 20, borderRadius: 20,
        marginBottom: 16,
    },
    readingText: { color: '#1B1E23', fontSize: 16, lineHeight: 27, fontWeight: '500' },
    insightBox: {
        flexDirection: 'row', backgroundColor: '#FBF2D0', padding: 16,
        borderRadius: 16, marginTop: 8, alignItems: 'center',
    },
    insightText: { color: '#1B1E23', fontSize: 14, lineHeight: 22, flex: 1 },

    // Teaser
    devoWrapper: { gap: 14, marginTop: 8 },
    teaser: {
        borderRadius: 20, overflow: 'hidden',
    },
    teaserHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingTop: 16, paddingHorizontal: 16, paddingBottom: 6,
    },
    teaserLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    teaserText: { color: '#1B1E23', fontSize: 15, lineHeight: 23, fontWeight: '500', paddingHorizontal: 16, paddingBottom: 12 },
    teaserFooter: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 10, paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.55)',
    },
    teaserLocked: { color: '#5B6573', fontSize: 12, fontWeight: '600' },

    // Practice
    practiceHeader: { alignItems: 'center', paddingVertical: 16 },
    iconCircleBig: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#DCECE8', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    practiceTitle: { color: '#1B1E23', fontSize: 21, fontWeight: '800', marginBottom: 10 },
    practiceDesc: { color: '#5B6573', fontSize: 15, textAlign: 'center', lineHeight: 23, paddingHorizontal: 16 },

    charadasBox: {
        backgroundColor: '#F6F8FA', borderRadius: 20, padding: 18, marginTop: 24,
    },
    charadasTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    charadasTitle: { color: '#1B1E23', fontSize: 16, fontWeight: '800' },
    charadasSub: { color: '#5B6573', fontSize: 13, marginBottom: 16, lineHeight: 20 },
    charadaItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14, marginBottom: 8,
    },
    cWord: { color: '#1B1E23', fontSize: 15, fontWeight: '700', flex: 1 },
    cCatBg: { backgroundColor: '#F6F8FA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    cCat: { color: '#5B6573', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    cDiffBg: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    cDiff: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

    // Quiz
    quizCard: {
        alignItems: 'center', padding: 20, backgroundColor: '#F6F8FA',
        borderRadius: 22, marginBottom: 20,
    },
    quizQuestion: { color: '#1B1E23', fontSize: 18, fontWeight: '800', textAlign: 'center', lineHeight: 27 },
    optionsContainer: { gap: 10 },
    optionCard: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        padding: 16, borderRadius: 16,
    },
    optionLetterBox: {
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
    },
    optionLetter: { fontSize: 14, fontWeight: '800' },
    optionText: { flex: 1, fontSize: 15, fontWeight: '600' },

    feedbackCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginTop: 18 },
    feedbackTitle: { fontSize: 15, fontWeight: '800' },
    feedbackText: { color: '#5B6573', fontSize: 13, marginTop: 3 },

    footerSpacer: { marginTop: 32 },
    ctaBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        padding: 18, borderRadius: 18,
    },
    ctaBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    ctaBtnSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', marginTop: 2 },

    // Activity / Flip Card
    activityLabel: {
        color: '#1B1E23', fontSize: 21, fontWeight: '800', textAlign: 'center', marginBottom: 6,
    },
    activityInstruction: {
        color: '#5B6573', fontSize: 14, textAlign: 'center', marginBottom: 24, paddingHorizontal: 16,
    },
    flipCardContainer: {
        width: '100%', height: 280, position: 'relative', alignItems: 'center',
    },
    flipCard: {
        width: '100%', height: 280, borderRadius: 24,
        overflow: 'hidden', backfaceVisibility: 'hidden',
    },
    flipCardFront: { backgroundColor: '#F6F8FA' },
    flipCardBack: { backgroundColor: '#DCECE8' },
    flipCardGradient: {
        flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center',
    },
    flipCardQuestion: {
        color: '#1B1E23', fontSize: 17, fontWeight: '700', textAlign: 'center',
        lineHeight: 26,
    },
    flipCardLabel: {
        fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10,
        textTransform: 'uppercase',
    },
    flipCardBack2: {
        color: '#5B6573', fontSize: 15, fontWeight: '600', textAlign: 'center',
        lineHeight: 24,
    },
    flipHint: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        marginTop: 20, opacity: 0.6,
    },
    flipHintText: { color: '#5B6573', fontSize: 12 },
    flipCardTouchable: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24,
    },
    sharePrompt: {
        backgroundColor: '#DCECE8', borderRadius: 16,
        padding: 16, marginTop: 20, width: '100%',
    },
    sharePromptText: {
        color: '#2E6F65', fontSize: 14, textAlign: 'center', fontWeight: '600', lineHeight: 22,
    },
    activityFooter: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12,
        backgroundColor: '#FFFFFF',
    },

    // Result Phase
    resultContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    resultIconBg: { width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    resultTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
    resultDay: { color: '#5B6573', fontSize: 15, textAlign: 'center', marginBottom: 26 },
    rewardRow: { flexDirection: 'row', gap: 14 },
    rewardBox: {
        backgroundColor: '#F6F8FA', padding: 20, borderRadius: 20,
        flex: 1, alignItems: 'center',
    },
    rewardIconBg: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    rewardNum: { fontSize: 26, fontWeight: '800' },
    rewardLabel: { color: '#5B6573', fontSize: 11, fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
});

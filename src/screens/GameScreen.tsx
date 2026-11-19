import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { AppText, CameraManager, CameraManagerHandle } from '../components';
import { useGameTimer, useAccelerometer } from '../hooks';
import { useSound } from '../context/SoundContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharadaCard } from '../data/categories';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditorialDoodle } from '../trivia/components/EditorialDoodle';

const formatCategoryTitle = (raw: string): string => {
    const trimmed = (raw || '').trim();
    if (!trimmed) return '';
    if (trimmed !== trimmed.toLocaleUpperCase()) return trimmed;
    const lower = trimmed.toLocaleLowerCase();
    return (lower.charAt(0).toLocaleUpperCase() + lower.slice(1))
        .replace(/\bantiguo testamento\b/gi, 'Antiguo Testamento')
        .replace(/\bnuevo testamento\b/gi, 'Nuevo Testamento')
        .replace(/\bnavidad\b/gi, 'Navidad')
        .replace(/\bpascua\b/gi, 'Pascua');
};

const MOCK_WORDS = ['Error', 'No Data'];

export const GameScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const {
        playSound, playHaptic, pauseMusic, resumeMusic,
        shuffleMusic, setVolumeModifier, availableTracks, setInternalTrack
    } = useSound();

    const {
        category, categoryObj, words: initialWords, duration = 60, playingMembers = []
    } = route.params || {};

    const [score, setScore] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [wordsAnswered, setWordsAnswered] = useState(0);
    const [words, setWords] = useState<(string | CharadaCard)[]>([]);
    const [gameStatus, setGameStatus] = useState<'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED'>('READY');
    const [wordHistory, setWordHistory] = useState<{ word: string; timestamp: number; result: 'correct' | 'pass' | 'pending' }[]>([]);
    const [gameStartTime, setGameStartTime] = useState<number>(0);
    const [readyForAction, setReadyForAction] = useState(true);
    const [flashState, setFlashState] = useState<'correct' | 'pass' | null>(null);
    const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Camera / Video
    const cameraRef = useRef<CameraManagerHandle>(null);
    const hasNavigated = useRef<boolean>(false);
    const failsafeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scoreRef = useRef(0);
    const wordsAnsweredRef = useRef(0);
    const gameStatusRef = useRef<'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED'>('READY');
    const wordHistoryRef = useRef<{ word: string; timestamp: number; result: 'correct' | 'pass' | 'pending' }[]>([]);
    const finalResultRef = useRef<{ score: number; total: number } | null>(null);

    // Animations
    const wordScale = useRef(new Animated.Value(1)).current;
    const tiltFlashOpacity = useRef(new Animated.Value(0)).current;
    const cardSlideX = useRef(new Animated.Value(0)).current;
    const readyPulse = useRef(new Animated.Value(1)).current;
    const timerArc = useRef(new Animated.Value(1)).current; // 1 → 0

    // ─── Init ───────────────────────────────────────────────
    useEffect(() => {
        const initWords = async () => {
            let list = initialWords && initialWords.length > 0 ? [...initialWords] : MOCK_WORDS;

            // --- ALGORITMO DE NO REPETICIÓN (CHARADAS) ---
            try {
                const seenStr = await AsyncStorage.getItem('seen_charada_words');
                let seenWords: string[] = seenStr ? JSON.parse(seenStr) : [];

                // Filtrar las que NO se han visto
                let available = list.filter((w: any) => {
                    const wordText = typeof w === 'string' ? w : w.word;
                    return !seenWords.includes(wordText);
                });

                // Si quedan muy pocas (ej: < 10), reiniciamos el historial localmente
                if (available.length < 10 && list.length >= 10) {
                    available = list;
                    const textsInPool = list.map((w: any) => typeof w === 'string' ? w : w.word);
                    seenWords = seenWords.filter(sw => !textsInPool.includes(sw));
                    await AsyncStorage.setItem('seen_charada_words', JSON.stringify(seenWords));
                }

                // Barajar (Fisher-Yates)
                for (let i = available.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [available[i], available[j]] = [available[j], available[i]];
                }

                setWords(available);
            } catch (e) {
                console.error("Error loading charada history", e);
                // Fallback a shuffle simple
                setWords([...list].sort(() => Math.random() - 0.5));
            }
        };

        initWords();
    }, [initialWords]);

    useEffect(() => {
        return () => {
            if (failsafeTimeoutRef.current) {
                clearTimeout(failsafeTimeoutRef.current);
            }
            if (flashTimerRef.current) {
                clearTimeout(flashTimerRef.current);
            }
        };
    }, []);

    // Sync refs for async camera callbacks
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);
    useEffect(() => {
        wordsAnsweredRef.current = wordsAnswered;
    }, [wordsAnswered]);
    useEffect(() => {
        gameStatusRef.current = gameStatus;
    }, [gameStatus]);
    useEffect(() => {
        wordHistoryRef.current = wordHistory;
    }, [wordHistory]);

    // Promo card sounds
    useEffect(() => {
        if (gameStatus !== 'PLAYING' || words.length === 0) return;
        const current = words[wordIndex];
        if (typeof current !== 'string') {
            if (current.onShowSound === 'wrong') setTimeout(() => playSound('wrong'), 500);
            else if (current.onShowSound === 'correct') setTimeout(() => playSound('correct'), 500);
            if (current.bgMusic?.includes('Santander')) {
                const idx = availableTracks.findIndex((t: any) => t.name.includes('Santander'));
                if (idx !== -1) setInternalTrack(idx);
            }
        }
    }, [wordIndex, gameStatus]);

    // Ready screen pulse animation
    useEffect(() => {
        if (gameStatus !== 'READY') return;
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(readyPulse, { toValue: 1.06, duration: 800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(readyPulse, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [gameStatus]);

    useFocusEffect(
        React.useCallback(() => {
            // Only pause music on mount, DO NOT lock to landscape yet.
            // We lock to landscape only when the user presses "Start" to avoid visual glitches.
            pauseMusic();
            return () => {
                const lockPortrait = async () => {
                    try {
                        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                        setVolumeModifier(1.0);
                        resumeMusic();
                    } catch (e) { console.error('Failed to lock portrait', e); }
                };
                lockPortrait();
            };
        }, [])
    );

    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(duration, onTimeEnd);
    const { tilt } = useAccelerometer(gameStatus === 'PLAYING');

    useEffect(() => {
        if (gameStatus === 'PLAYING') {
            startTimer();
            Animated.timing(timerArc, {
                toValue: 0,
                duration: duration * 1000,
                useNativeDriver: false,
                easing: Easing.linear,
            }).start();
        } else {
            stopTimer();
        }
    }, [gameStatus]);

    // Tilt → action
    useEffect(() => {
        if (gameStatus !== 'PLAYING') return;
        if (readyForAction) {
            if (tilt === 'UP') handleNextWord(false);
            else if (tilt === 'DOWN') handleNextWord(true);
        } else {
            if (tilt === 'NEUTRAL') setReadyForAction(true);
        }
    }, [tilt, readyForAction, gameStatus]);

    async function onTimeEnd() {
        const playedWords = words.slice(0, wordsAnswered).map((w: any) => typeof w === 'string' ? w : w.word);
        try {
            const seenStr = await AsyncStorage.getItem('seen_charada_words');
            let seenWords: string[] = seenStr ? JSON.parse(seenStr) : [];
            const updated = Array.from(new Set([...seenWords, ...playedWords])).slice(-200);
            await AsyncStorage.setItem('seen_charada_words', JSON.stringify(updated));
        } catch (e) { console.error("Error saving charada history", e); }

        finishGame(score, wordsAnswered);
    }

    const navigateToResults = (videoUri: string | null) => {
        if (failsafeTimeoutRef.current) {
            clearTimeout(failsafeTimeoutRef.current);
            failsafeTimeoutRef.current = null;
        }
        if (hasNavigated.current) return;
        hasNavigated.current = true;
        const resolved = finalResultRef.current;
        navigation.replace('Results', {
            score: resolved ? resolved.score : scoreRef.current,
            total: resolved ? resolved.total : wordsAnsweredRef.current,
            videoUri,
            category,
            wordHistory: wordHistoryRef.current,
            playingMembers,
        });
    };

    const finishGame = async (finalScore: number, finalTotal: number) => {
        if (gameStatusRef.current === 'FINISHED') return;
        finalResultRef.current = { score: finalScore, total: finalTotal };
        gameStatusRef.current = 'FINISHED';
        setGameStatus('FINISHED');
        setVolumeModifier(1.0);
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});

        if (categoryObj?.hideCamera || !cameraRef.current) {
            navigateToResults(null);
            return;
        }

        failsafeTimeoutRef.current = setTimeout(() => {
            navigateToResults(null);
        }, 5000);

        const stoppedActiveRecording = await cameraRef.current.stopRecording();
        if (!stoppedActiveRecording) {
            navigateToResults(null);
        }
    };

    const onRecordingFinished = (uri: string) => {
        if (gameStatusRef.current === 'FINISHED') {
            navigateToResults(uri);
        }
    };

    const onRecordingError = () => {
        if (gameStatusRef.current === 'FINISHED') {
            navigateToResults(null);
        }
    };

    const getCurrentWordString = () => {
        const current = words[wordIndex];
        return typeof current === 'string' ? current : current?.word || '';
    };

    const handleNextWord = (correct: boolean) => {
        const nextAnsweredCount = wordsAnswered + 1;
        setWordsAnswered(nextAnsweredCount);
        const newScore = correct ? score + 1 : score;

        const currentTime = Date.now() - gameStartTime;
        setWordHistory(prev => {
            const nh = [...prev];
            if (nh.length > 0) nh[nh.length - 1].result = correct ? 'correct' : 'pass';
            return nh;
        });

        if (correct) {
            setScore(newScore);
            playHaptic('success');
            playSound('correct');
        } else {
            playHaptic('impact');
            playSound('wrong');
        }

        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        setFlashState(correct ? 'correct' : 'pass');
        flashTimerRef.current = setTimeout(() => setFlashState(null), 320);

        // Animation
        Animated.sequence([
            Animated.timing(cardSlideX, { toValue: correct ? -30 : 30, duration: 80, useNativeDriver: true }),
            Animated.timing(cardSlideX, { toValue: 0, duration: 120, useNativeDriver: true }),
        ]).start();

        if (nextAnsweredCount >= words.length) {
            finishGame(newScore, nextAnsweredCount);
            return;
        }

        setReadyForAction(false);
        const nextIndex = (wordIndex + 1) % words.length;
        setWordIndex(nextIndex);

        const nextWordItem = words[nextIndex];
        const nextWordString = typeof nextWordItem === 'string' ? nextWordItem : nextWordItem.word;
        setWordHistory(prev => [...prev, { word: nextWordString, timestamp: Date.now() - gameStartTime, result: 'pending' }]);
    };

    const startGame = () => {
        setScore(0);
        setWordIndex(0);
        setWordsAnswered(0);
        setReadyForAction(true);
        resetTimer();
        timerArc.setValue(1);
        setGameStatus('PLAYING');

        const now = Date.now();
        setGameStartTime(now);
        const firstWordItem = words[0];
        const firstWordString = typeof firstWordItem === 'string' ? firstWordItem : firstWordItem.word;
        setWordHistory([{ word: firstWordString, timestamp: 0, result: 'pending' }]);

        // Lock orientation to landscape exactly when the game starts
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(e => console.error(e));

        if (!categoryObj?.hideCamera) cameraRef.current?.startRecording();
    };

    const exitGame = () => {
        // Prevent camera's onRecordingFinished from instantly navigating to Results
        hasNavigated.current = true;
        
        setGameStatus('FINISHED');
        setVolumeModifier(1.0);
        stopTimer();
        
        if (!categoryObj?.hideCamera && cameraRef.current) {
            cameraRef.current.stopRecording();
        }
        
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        navigation.navigate('Home');
    };

    const totalWords = words.length;
    const progressPercent = totalWords > 0 ? wordsAnswered / totalWords : 0;

    const isCorrectVisual = tilt === 'DOWN' || flashState === 'correct';
    const isPassVisual = tilt === 'UP' || flashState === 'pass';

    const tiltBgColor = isCorrectVisual
        ? 'rgba(22,163,74,0.48)'
        : isPassVisual
            ? 'rgba(220,38,38,0.48)'
            : 'transparent';

    const wordFontSize = (() => {
        const str = getCurrentWordString();
        if (str.length > 22) return 28;
        if (str.length > 14) return 36;
        if (str.length > 8) return 46;
        return 56;
    })();

    const sideInset = Math.max(insets.left, insets.right, 20);
    const displayCategory = formatCategoryTitle(category || 'Charadas');

    return (
        <View style={styles.container}>
            {/* Camera Layer */}
            {!categoryObj?.hideCamera && (
                <View style={StyleSheet.absoluteFill}>
                    <CameraManager
                        ref={cameraRef}
                        onRecordingFinished={onRecordingFinished}
                        onRecordingError={onRecordingError}
                    />
                    <View
                        pointerEvents="none"
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor:
                                    gameStatus === 'PLAYING'
                                        ? 'rgba(255,255,255,0.78)'
                                        : '#FFFFFF',
                            },
                        ]}
                    />
                </View>
            )}

            {/* Response Overlay */}
            <Animated.View
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, { backgroundColor: tiltBgColor }]}
            />

            {/* Indicators / Edge Controls (respetan Dynamic Island / notch) */}
            {gameStatus === 'PLAYING' && (
                <>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Pasar palabra"
                        onPress={() => readyForAction && handleNextWord(false)}
                        style={({ pressed }) => [
                            styles.edgeIndicator,
                            { left: Math.max(insets.left, 16) + 8 },
                            pressed && { opacity: 0.7 },
                        ]}
                    >
                        <View style={[styles.edgeIconWrap, { backgroundColor: '#DC2626' }]}>
                            <Ionicons name="close" size={20} color="#FFFFFF" />
                        </View>
                        <AppText style={[styles.edgeLabel, { color: '#DC2626' }]}>PASAR</AppText>
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Palabra correcta"
                        onPress={() => readyForAction && handleNextWord(true)}
                        style={({ pressed }) => [
                            styles.edgeIndicator,
                            { right: Math.max(insets.right, 16) + 8 },
                            pressed && { opacity: 0.7 },
                        ]}
                    >
                        <View style={[styles.edgeIconWrap, { backgroundColor: '#16A34A' }]}>
                            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                        </View>
                        <AppText style={[styles.edgeLabel, { color: '#16A34A' }]}>¡SÍ!</AppText>
                    </Pressable>
                </>
            )}

            {/* Header */}
            <View
                style={[
                    styles.headerBar,
                    {
                        paddingTop: Math.max(insets.top, 14),
                        paddingHorizontal: sideInset,
                    },
                ]}
            >
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Salir"
                    style={styles.exitBtn}
                    onPress={exitGame}
                >
                    <Ionicons name="close" size={19} color="#1B1E23" />
                </TouchableOpacity>

                {gameStatus === 'PLAYING' ? (
                    <View style={styles.categoryPill}>
                        <AppText style={styles.categoryPillText} numberOfLines={1}>
                            {displayCategory}
                        </AppText>
                    </View>
                ) : (
                    <View />
                )}

                <View style={[styles.timerBox, timeLeft <= 10 && styles.timerBoxLow]}>
                    <AppText style={[styles.timerText, timeLeft <= 10 && { color: '#9E3A3A' }]}>
                        {timeLeft}s
                    </AppText>
                </View>
            </View>

            {/* Progress */}
            {gameStatus === 'PLAYING' && (
                <View
                    style={[
                        styles.progressTrack,
                        {
                            top: Math.max(insets.top, 14) + 46,
                            left: sideInset,
                            right: sideInset,
                        },
                    ]}
                >
                    <View style={[styles.progressFill, { width: `${progressPercent * 100}%` }]} />
                </View>
            )}

            {/* Game Logic Render */}
            {gameStatus === 'READY' ? (
                <View style={styles.centered}>
                    <View style={styles.readyCard}>
                        <EditorialDoodle kind="charades" tint="#FFFFFF" size={68} />
                        <AppText style={styles.readyCategory}>{displayCategory}</AppText>
                        <AppText style={styles.readyInfo}>
                            {totalWords} palabras · {duration}s
                        </AppText>

                        <Animated.View style={{ transform: [{ scale: readyPulse }], width: '100%', marginTop: 24 }}>
                            <Pressable
                                accessibilityRole="button"
                                style={({ pressed }) => [styles.startBtn, pressed && styles.pressed]}
                                onPress={startGame}
                            >
                                <AppText style={styles.startBtnText}>Empezar</AppText>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </Pressable>
                        </Animated.View>

                        <View style={styles.readyHintRow}>
                            <View style={styles.hintChip}>
                                <Ionicons name="arrow-down" size={14} color="#246B5C" />
                                <AppText style={[styles.hintChipText, { color: '#246B5C' }]}>
                                    Abajo · Correcto
                                </AppText>
                            </View>
                            <View style={styles.hintChip}>
                                <Ionicons name="arrow-up" size={14} color="#B84A4A" />
                                <AppText style={[styles.hintChipText, { color: '#B84A4A' }]}>
                                    Arriba · Pasar
                                </AppText>
                            </View>
                        </View>
                    </View>
                </View>
            ) : gameStatus === 'PLAYING' ? (
                <View style={styles.centered}>
                    <Animated.View
                        style={[
                            styles.wordCardWrap,
                            { transform: [{ scale: wordScale }, { translateX: cardSlideX }] },
                        ]}
                    >
                        <View
                            style={[
                                styles.wordCard,
                                isCorrectVisual && styles.wordCardCorrect,
                                isPassVisual && styles.wordCardPass,
                            ]}
                        >
                            <AppText
                                style={[
                                    styles.wordText,
                                    { fontSize: wordFontSize },
                                    (isCorrectVisual || isPassVisual) && { color: '#FFFFFF' },
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.5}
                            >
                                {getCurrentWordString()}
                            </AppText>

                            {typeof words[wordIndex] !== 'string' && (
                                <View style={styles.richContent}>
                                    {(words[wordIndex] as CharadaCard).verse && (
                                        <AppText style={styles.verseText}>
                                            {(words[wordIndex] as CharadaCard).verse}
                                        </AppText>
                                    )}
                                    {(words[wordIndex] as CharadaCard).description && (
                                        <AppText style={styles.descText} numberOfLines={3}>
                                            {(words[wordIndex] as CharadaCard).description}
                                        </AppText>
                                    )}
                                    {(words[wordIndex] as CharadaCard).mime && (
                                        <View style={styles.mimeBox}>
                                            <Ionicons
                                                name="body-outline"
                                                size={15}
                                                color="#1E3A5F"
                                                style={{ marginRight: 6 }}
                                            />
                                            <AppText style={styles.mimeText}>
                                                {(words[wordIndex] as CharadaCard).mime}
                                            </AppText>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </Animated.View>

                    <View style={styles.tiltHintWrap}>
                        <Ionicons
                            name={
                                !readyForAction
                                    ? 'refresh'
                                    : tilt === 'DOWN'
                                    ? 'checkmark-circle'
                                    : tilt === 'UP'
                                    ? 'close-circle'
                                    : 'phone-landscape-outline'
                            }
                            size={16}
                            color="#1E3A5F"
                        />
                        <AppText style={styles.tiltHint}>
                            {!readyForAction
                                ? 'Regresa al centro'
                                : tilt === 'DOWN'
                                ? '¡Correcto!'
                                : tilt === 'UP'
                                ? 'Pasado'
                                : 'Mantén en tu frente'}
                        </AppText>
                    </View>

                    <View
                        style={[
                            styles.scoreBadge,
                            {
                                bottom: Math.max(insets.bottom, 18),
                                right: Math.max(insets.right, 20),
                            },
                        ]}
                    >
                        <AppText style={styles.scoreBadgeText}>{score}</AppText>
                        <AppText style={styles.scoreBadgeSub}>
                            {wordsAnswered}/{totalWords}
                        </AppText>
                    </View>
                </View>
            ) : gameStatus === 'FINISHED' ? (
                <View style={styles.centered}>
                    <View style={styles.finishedBox}>
                        <EditorialDoodle kind="trophy" tint="#F5DA7C" size={74} />
                        <AppText style={styles.finishedTitle}>¡Tiempo!</AppText>
                        <AppText style={styles.finishedSub}>Guardando resultado...</AppText>
                    </View>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    headerBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 20,
    },
    exitBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryPill: {
        backgroundColor: '#DCECE8',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        maxWidth: '55%',
    },
    categoryPillText: {
        color: '#1B1E23',
        fontSize: 13,
        fontWeight: '800',
    },
    timerBox: {
        minWidth: 58,
        height: 36,
        paddingHorizontal: 12,
        borderRadius: 18,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerBoxLow: {
        backgroundColor: '#F7E6E6',
    },
    timerText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E3A5F',
        fontVariant: ['tabular-nums'],
    },
    progressTrack: {
        position: 'absolute',
        top: 72,
        left: 20,
        right: 20,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#EEF2F6',
        overflow: 'hidden',
    },
    progressFill: {
        height: 4,
        backgroundColor: '#1E3A5F',
        borderRadius: 2,
    },
    edgeIndicator: {
        position: 'absolute',
        top: '50%',
        marginTop: -36,
        alignItems: 'center',
        gap: 6,
    },
    edgeLeft: { left: 22 },
    edgeRight: { right: 22 },
    edgeIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    edgeLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    centered: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 22,
    },
    readyCard: {
        backgroundColor: '#DCECE8',
        padding: 28,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 440,
    },
    readyCategory: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1B1E23',
        textAlign: 'center',
        marginTop: 10,
        letterSpacing: -0.5,
    },
    readyInfo: {
        fontSize: 14,
        color: '#3D8A7B',
        marginTop: 4,
        fontWeight: '700',
    },
    startBtn: {
        width: '100%',
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    startBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    readyHintRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 18,
    },
    hintChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.82)',
    },
    hintChipText: {
        fontSize: 12,
        fontWeight: '800',
    },
    wordCardWrap: { width: '70%', maxWidth: 520, alignItems: 'center' },
    wordCard: {
        width: '100%',
        minHeight: 136,
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 26,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 6,
    },
    wordCardCorrect: { backgroundColor: '#16A34A' },
    wordCardPass: { backgroundColor: '#DC2626' },
    wordText: {
        color: '#1B1E23',
        fontWeight: '800',
        letterSpacing: -1,
        textAlign: 'center',
    },
    richContent: {
        marginTop: 12,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#F6F8FA',
        width: '100%',
        alignItems: 'center',
    },
    verseText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E3A5F',
        marginBottom: 4,
        textAlign: 'center',
    },
    descText: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 6,
    },
    mimeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#DCECE8',
    },
    mimeText: { color: '#1B1E23', fontSize: 13, fontWeight: '700' },
    tiltHintWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 20,
        backgroundColor: '#F3F7F6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
    },
    tiltHint: { color: '#1E3A5F', fontSize: 13, fontWeight: '700' },
    scoreBadge: {
        position: 'absolute',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
    },
    scoreBadgeText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
    scoreBadgeSub: { color: '#DCECE8', fontSize: 11, fontWeight: '700' },
    finishedBox: {
        alignItems: 'center',
        backgroundColor: '#DCECE8',
        borderRadius: 30,
        padding: 34,
        width: '100%',
        maxWidth: 380,
    },
    finishedTitle: {
        color: '#1B1E23',
        fontSize: 32,
        fontWeight: '800',
        marginTop: 10,
    },
    finishedSub: { color: '#3D8A7B', fontSize: 15, fontWeight: '700', marginTop: 6 },
    pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
});

import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View, StyleSheet, TouchableOpacity, Animated, Dimensions, Easing
} from 'react-native';
import { Container, AppText, CameraManager, CameraManagerHandle } from '../components';
import { useGameTimer, useAccelerometer } from '../hooks';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharadaCard } from '../data/categories';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const GOLD = '#D4AF37';
const MOCK_WORDS = ['Error', 'No Data'];

export const GameScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
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

    // Camera / Video
    const cameraRef = useRef<CameraManagerHandle>(null);
    const hasNavigated = useRef<boolean>(false);
    const failsafeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Animations
    const wordScale = useRef(new Animated.Value(1)).current;
    const tiltFlashOpacity = useRef(new Animated.Value(0)).current;
    const tiltFlashColor = useRef('#27AE60'); // mutable ref
    const cardSlideX = useRef(new Animated.Value(0)).current;
    const readyPulse = useRef(new Animated.Value(1)).current;
    const timerArc = useRef(new Animated.Value(1)).current; // 1 → 0

    // ─── Init ───────────────────────────────────────────────
    useEffect(() => {
        const list = initialWords && initialWords.length > 0 ? [...initialWords] : MOCK_WORDS;
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        setWords(list);
    }, [initialWords]);

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
            const lockLandscape = async () => {
                try {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                    pauseMusic();
                } catch (e) { console.error('Failed to lock landscape', e); }
            };
            lockLandscape();
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

    // Start timer arc when playing starts
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

    // Tilt edge flash
    useEffect(() => {
        if (gameStatus !== 'PLAYING' || !readyForAction) return;
        if (tilt === 'UP' || tilt === 'DOWN') {
            tiltFlashOpacity.setValue(0.9);
            Animated.timing(tiltFlashOpacity, {
                toValue: 0, duration: 400, useNativeDriver: true
            }).start();
        }
    }, [tilt]);

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

    function onTimeEnd() {
        finishGame(score, wordsAnswered);
    }

    const finishGame = (finalScore: number, finalTotal: number) => {
        setGameStatus('FINISHED');
        setVolumeModifier(1.0);
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

        failsafeTimeoutRef.current = setTimeout(() => {
            if (!hasNavigated.current) {
                hasNavigated.current = true;
                navigation.replace('Results', {
                    score: finalScore, total: finalTotal,
                    videoUri: null, category, wordHistory, playingMembers
                });
            }
        }, 8000);

        if (cameraRef.current) {
            cameraRef.current.stopRecording();
        } else {
            if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);
            if (!hasNavigated.current) {
                hasNavigated.current = true;
                navigation.replace('Results', {
                    score: finalScore, total: finalTotal,
                    videoUri: null, category, wordHistory, playingMembers
                });
            }
        }
    };

    const onRecordingFinished = (uri: string) => {
        if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);
        if ((gameStatus === 'FINISHED' || wordsAnswered >= 10) && !hasNavigated.current) {
            hasNavigated.current = true;
            navigation.replace('Results', {
                score, total: wordsAnswered, videoUri: uri, category, wordHistory, playingMembers
            });
        }
    };

    const getCurrentWordString = () => {
        const current = words[wordIndex];
        return typeof current === 'string' ? current : current.word;
    };

    const animateWordChange = (correct: boolean) => {
        // Slide out
        Animated.sequence([
            Animated.timing(cardSlideX, {
                toValue: correct ? -30 : 30,
                duration: 80, useNativeDriver: true
            }),
            Animated.timing(cardSlideX, {
                toValue: 0,
                duration: 120, useNativeDriver: true
            }),
        ]).start();
        // Scale pop
        Animated.sequence([
            Animated.timing(wordScale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
            Animated.spring(wordScale, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();
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

        animateWordChange(correct);

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
        resetTimer();
        timerArc.setValue(1);
        setGameStatus('PLAYING');

        const now = Date.now();
        setGameStartTime(now);
        const firstWordItem = words[0];
        const firstWordString = typeof firstWordItem === 'string' ? firstWordItem : firstWordItem.word;
        setWordHistory([{ word: firstWordString, timestamp: 0, result: 'pending' }]);

        if (!categoryObj?.hideCamera) cameraRef.current?.startRecording();
    };

    const exitGame = () => {
        setGameStatus('FINISHED');
        setVolumeModifier(1.0);
        stopTimer();
        if (!categoryObj?.hideCamera) cameraRef.current?.stopRecording();
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        navigation.navigate('Home');
    };

    // Derived values
    const totalWords = words.length;
    const progressPercent = totalWords > 0 ? wordsAnswered / totalWords : 0;
    const timerPercent = duration > 0 ? timeLeft / duration : 0;
    const timerColor = timeLeft <= 10 ? '#E74C3C' : timeLeft <= 20 ? '#F39C12' : '#27AE60';

    const tiltBgColor = tilt === 'DOWN'
        ? 'rgba(46,204,113,0.55)'
        : tilt === 'UP'
            ? 'rgba(231,76,60,0.55)'
            : categoryObj?.hideCamera ? 'transparent' : 'rgba(0,0,0,0.25)';

    const wordFontSize = (() => {
        const word = words[wordIndex];
        const str = typeof word === 'string' ? word : word?.word ?? '';
        if (str.length > 20) return 44;
        if (str.length > 14) return 56;
        if (str.length > 8) return 66;
        return 78;
    })();

    const renderContent = () => (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
            {/* Camera background */}
            {!categoryObj?.hideCamera && (
                <CameraManager ref={cameraRef} onRecordingFinished={onRecordingFinished} />
            )}

            {/* Tint overlay */}
            <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: tiltBgColor }]} />

            {/* ── TILT EDGE INDICATORS ──────────────────── */}
            {gameStatus === 'PLAYING' && (
                <>
                    {/* LEFT edge = PASS (tilt UP) */}
                    <View style={[styles.edgeIndicator, styles.edgeLeft]}>
                        <View style={styles.edgeIconWrap}>
                            <Ionicons name="close" size={24} color="#E74C3C" />
                        </View>
                        <AppText style={styles.edgeLabel}>PASAR</AppText>
                    </View>
                    {/* RIGHT edge = CORRECT (tilt DOWN) */}
                    <View style={[styles.edgeIndicator, styles.edgeRight]}>
                        <View style={[styles.edgeIconWrap, { borderColor: 'rgba(46,204,113,0.4)', backgroundColor: 'rgba(46,204,113,0.1)' }]}>
                            <Ionicons name="checkmark" size={24} color="#27AE60" />
                        </View>
                        <AppText style={[styles.edgeLabel, { color: '#27AE60' }]}>¡SÍ!</AppText>
                    </View>
                </>
            )}

            {/* ── HEADER BAR ────────────────────────────── */}
            <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 4 }]}>
                {/* Exit button */}
                <TouchableOpacity style={styles.exitBtn} onPress={exitGame}>
                    <Ionicons name="close" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>

                {/* Category name */}
                <AppText style={styles.categoryPill} numberOfLines={1}>{category}</AppText>

                {/* Timer box */}
                {gameStatus === 'PLAYING' && (
                    <View style={[styles.timerBox, { borderColor: timerColor + '80' }]}>
                        <AppText style={[styles.timerText, { color: timerColor }]}>
                            {timeLeft}s
                        </AppText>
                    </View>
                )}
                {gameStatus !== 'PLAYING' && <View style={{ width: 60 }} />}
            </View>

            {/* ── PROGRESS BAR (top) ─────────────────────── */}
            {gameStatus === 'PLAYING' && (
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progressPercent * 100}%` }]} />
                </View>
            )}

            {/* ── SCORE BADGE (bottom-right) ────────────── */}
            {gameStatus === 'PLAYING' && (
                <View style={[styles.scoreBadge, { bottom: Math.max(insets.bottom, 12) + 12, right: Math.max(insets.right, 20) + 20 }]}>
                    <AppText style={styles.scoreBadgeText}>✓ {score}</AppText>
                    <AppText style={styles.scoreBadgeSub}>{wordsAnswered}/{totalWords}</AppText>
                </View>
            )}

            {/* ── READY STATE ───────────────────────────── */}
            {gameStatus === 'READY' && (
                <View style={styles.centered}>
                    <AppText style={styles.readyCategory}>{category}</AppText>
                    <AppText style={styles.readyInfo}>{totalWords} palabras · {duration}s</AppText>

                    <Animated.View style={{ transform: [{ scale: readyPulse }] }}>
                        <TouchableOpacity
                            style={styles.startBtn}
                            onPress={startGame}
                            activeOpacity={0.85}
                        >
                            <LinearGradient colors={[GOLD, '#B8860B']} style={styles.startBtnInner}>
                                <Ionicons name="play" size={28} color="#000" />
                                <AppText style={styles.startBtnText}>¡JUGAR!</AppText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    <AppText style={styles.readyHint}>
                        📱 Inclina hacia abajo para ✅ · hacia arriba para ❌
                    </AppText>
                </View>
            )}

            {/* ── PLAYING STATE ─────────────────────────── */}
            {gameStatus === 'PLAYING' && (
                <View style={styles.centered}>
                    <Animated.View
                        style={[
                            styles.wordCardWrap,
                            {
                                transform: [
                                    { scale: wordScale },
                                    { translateX: cardSlideX },
                                ]
                            }
                        ]}
                    >
                        {/* Glass word card */}
                        <View style={[
                            styles.wordCard,
                            tilt === 'DOWN' && styles.wordCardCorrect,
                            tilt === 'UP' && styles.wordCardPass,
                        ]}>
                            <AppText
                                style={[styles.wordText, { fontSize: wordFontSize, lineHeight: wordFontSize * 1.1 }]}
                                numberOfLines={2}
                            >
                                {getCurrentWordString()}
                            </AppText>

                            {/* Rich content for special cards */}
                            {typeof words[wordIndex] !== 'string' && (
                                <View style={styles.richContent}>
                                    {(words[wordIndex] as CharadaCard).verse && (
                                        <AppText style={styles.verseText}>
                                            {(words[wordIndex] as CharadaCard).verse}
                                        </AppText>
                                    )}
                                    {(words[wordIndex] as CharadaCard).description && (
                                        <AppText style={styles.descText} numberOfLines={4}>
                                            {(words[wordIndex] as CharadaCard).description}
                                        </AppText>
                                    )}
                                    {(words[wordIndex] as CharadaCard).mime && (
                                        <AppText style={styles.mimeText} numberOfLines={2}>
                                            🎭 {(words[wordIndex] as CharadaCard).mime}
                                        </AppText>
                                    )}
                                </View>
                            )}
                        </View>
                    </Animated.View>

                    {/* Tilt nudge */}
                    <AppText style={styles.tiltHint}>
                        {!readyForAction
                            ? '↕ Regresa al centro'
                            : tilt === 'DOWN'
                                ? '✅ ¡Correcto!'
                                : tilt === 'UP'
                                    ? '❌ Pasando...'
                                    : 'Inclina el celular'}
                    </AppText>
                </View>
            )}

            {/* ── FINISHED STATE ────────────────────────── */}
            {gameStatus === 'FINISHED' && (
                <View style={styles.centered}>
                    <View style={styles.finishedBox}>
                        <Ionicons name="hourglass" size={40} color={GOLD} style={{ marginBottom: 12 }} />
                        <AppText style={styles.finishedTitle}>¡TIEMPO!</AppText>
                        <AppText style={styles.finishedSub}>Guardando tu resultado...</AppText>
                    </View>
                </View>
            )}
        </View>
    );

    if (categoryObj?.gradientColors) {
        return (
            <LinearGradient colors={categoryObj.gradientColors} style={{ flex: 1 }}>
                {renderContent()}
            </LinearGradient>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#050505' }}>
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    // Header
    headerBar: {
        position: 'absolute', top: 0, left: 0, right: 0,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingBottom: 10, zIndex: 20,
    },
    exitBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center',
    },
    categoryPill: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13, fontWeight: '800', letterSpacing: 1.5,
        textTransform: 'uppercase',
        backgroundColor: 'rgba(0,0,0,0.35)',
        paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: 20, overflow: 'hidden',
        maxWidth: 240,
    },
    timerBox: {
        width: 60, height: 36, borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    },
    timerText: { fontSize: 18, fontWeight: '900' },

    // Progress bar
    progressTrack: {
        position: 'absolute', top: 72, left: 0, right: 0,
        height: 3, backgroundColor: 'rgba(255,255,255,0.08)', zIndex: 10,
    },
    progressFill: {
        height: 3, backgroundColor: GOLD,
        borderTopRightRadius: 3, borderBottomRightRadius: 3,
    },

    // Edge indicators (left/right)
    edgeIndicator: {
        position: 'absolute', top: '50%',
        marginTop: -40,
        alignItems: 'center', gap: 4, zIndex: 5,
    },
    edgeLeft: { left: 14 },
    edgeRight: { right: 14 },
    edgeIconWrap: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(231,76,60,0.12)',
        borderWidth: 1, borderColor: 'rgba(231,76,60,0.35)',
        alignItems: 'center', justifyContent: 'center',
    },
    edgeLabel: {
        color: '#E74C3C', fontSize: 9, fontWeight: '900',
        letterSpacing: 1,
    },

    // Score badge
    scoreBadge: {
        position: 'absolute', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        zIndex: 10,
    },
    scoreBadgeText: { color: '#27AE60', fontSize: 16, fontWeight: '900' },
    scoreBadgeSub: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700' },

    // Centered layout
    centered: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 60, // space for edge indicators
    },

    // Word card
    wordCardWrap: { width: '100%', alignItems: 'center' },
    wordCard: {
        width: '100%', paddingVertical: 24, paddingHorizontal: 28,
        borderRadius: 28, alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)',
    },
    wordCardCorrect: {
        borderColor: 'rgba(46,204,113,0.7)',
        backgroundColor: 'rgba(46,204,113,0.18)',
    },
    wordCardPass: {
        borderColor: 'rgba(231,76,60,0.7)',
        backgroundColor: 'rgba(231,76,60,0.18)',
    },
    wordText: {
        color: '#fff', fontWeight: '900', textAlign: 'center',
        includeFontPadding: false,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },

    // Rich content (special cards)
    richContent: {
        width: '100%', alignItems: 'center', marginTop: 10,
        backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 14,
    },
    verseText: { fontSize: 22, fontWeight: '800', color: GOLD, marginBottom: 4, textAlign: 'center' },
    descText: { fontSize: 15, color: '#f0f0f0', textAlign: 'center', marginBottom: 4, fontStyle: 'italic' },
    mimeText: { fontSize: 14, color: '#ccc', textAlign: 'center' },

    tiltHint: {
        marginTop: 20, color: 'rgba(255,255,255,0.55)',
        fontSize: 14, fontWeight: '700', letterSpacing: 0.5,
        textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2,
    },

    // Ready state
    readyCategory: {
        color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: 1,
        textAlign: 'center', marginBottom: 6,
        textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 6,
    },
    readyInfo: {
        color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '700',
        letterSpacing: 1, marginBottom: 36,
    },
    startBtn: { borderRadius: 30, overflow: 'hidden', marginBottom: 28 },
    startBtnInner: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingVertical: 18, paddingHorizontal: 48,
    },
    startBtnText: { color: '#000', fontSize: 22, fontWeight: '900', letterSpacing: 2 },
    readyHint: {
        color: 'rgba(255,255,255,0.45)', fontSize: 13,
        textAlign: 'center', fontWeight: '600', paddingHorizontal: 20,
    },

    // Finished state
    finishedBox: {
        alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 28, padding: 36,
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    },
    finishedTitle: { color: GOLD, fontSize: 36, fontWeight: '900', letterSpacing: 3 },
    finishedSub: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600', marginTop: 8 },
});

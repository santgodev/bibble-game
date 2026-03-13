import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View, StyleSheet, TouchableOpacity, Animated, Dimensions, Easing
} from 'react-native';
import { AppText, CameraManager, CameraManagerHandle } from '../components';
import { useGameTimer, useAccelerometer } from '../hooks';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharadaCard } from '../data/categories';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

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

    // Derived Visuals
    const themeGradients = categoryObj?.gradientColors || ['#1A1A2E', '#16213E', '#1A1A2E'];
    const primaryColor = categoryObj?.color || theme.colors.primary;
    const totalWords = words.length;
    const progressPercent = totalWords > 0 ? wordsAnswered / totalWords : 0;
    const timerColor = timeLeft <= 10 ? '#E74C3C' : timeLeft <= 20 ? '#F39C12' : '#27AE60';

    const tiltBgColor = tilt === 'DOWN'
        ? 'rgba(46,204,113,0.35)'
        : tilt === 'UP'
            ? 'rgba(231,76,60,0.35)'
            : 'rgba(0,0,0,0.15)';

    const wordFontSize = (() => {
        const str = getCurrentWordString();
        if (str.length > 20) return 44;
        if (str.length > 14) return 56;
        if (str.length > 8) return 66;
        return 78;
    })();

    return (
        <View style={styles.container}>
            <LinearGradient 
                colors={themeGradients} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            >
                {/* Camera Layer */}
                {!categoryObj?.hideCamera && (
                    <View style={StyleSheet.absoluteFillObject}>
                        <CameraManager ref={cameraRef} onRecordingFinished={onRecordingFinished} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                    </View>
                )}

                {/* Response Overlay */}
                <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: tiltBgColor }]} />

                {/* Indicators / Edge UI */}
                {gameStatus === 'PLAYING' && (
                    <>
                        <View style={[styles.edgeIndicator, styles.edgeLeft]}>
                            <View style={styles.edgeIconWrap}>
                                <Ionicons name="close" size={24} color="#E74C3C" />
                            </View>
                            <AppText style={styles.edgeLabel}>PASAR</AppText>
                        </View>
                        <View style={[styles.edgeIndicator, styles.edgeRight]}>
                            <View style={[styles.edgeIconWrap, { borderColor: '#27AE6080', backgroundColor: '#27AE6020' }]}>
                                <Ionicons name="checkmark" size={24} color="#27AE60" />
                            </View>
                            <AppText style={[styles.edgeLabel, { color: '#27AE60' }]}>¡SÍ!</AppText>
                        </View>
                    </>
                )}

                {/* Header */}
                <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 4 }]}>
                    <TouchableOpacity style={styles.exitBtn} onPress={exitGame}>
                        <Ionicons name="close" size={18} color="#FFF" />
                    </TouchableOpacity>

                    <AppText style={styles.categoryPill} numberOfLines={1}>{category}</AppText>

                    <View style={[styles.timerBox, { borderColor: timerColor + '80' }]}>
                        <AppText style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</AppText>
                    </View>
                </View>

                {/* Progress */}
                {gameStatus === 'PLAYING' && (
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progressPercent * 100}%`, backgroundColor: primaryColor }]} />
                    </View>
                )}

                {/* Game Logic Render */}
                {gameStatus === 'READY' ? (
                    <View style={styles.centered}>
                        <View style={[styles.readyCard, { borderColor: primaryColor + '40' }]}>
                            {categoryObj?.icon && (
                                <View style={[styles.readyIconBox, { backgroundColor: primaryColor + '20' }]}>
                                    <Ionicons name={categoryObj.icon as any} size={40} color={primaryColor} />
                                </View>
                            )}
                            <AppText style={[styles.readyCategory, { color: primaryColor }]}>{category}</AppText>
                            <AppText style={styles.readyInfo}>{totalWords} palabras · {duration}s</AppText>

                            <Animated.View style={{ transform: [{ scale: readyPulse }], marginTop: 30 }}>
                                <TouchableOpacity style={styles.startBtn} onPress={startGame} activeOpacity={0.85}>
                                    <LinearGradient colors={[primaryColor, primaryColor]} style={styles.startBtnInner}>
                                        <Ionicons name="play" size={28} color="#000" />
                                        <AppText style={styles.startBtnText}>¡EMPEZAR!</AppText>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>

                            <AppText style={styles.readyHint}>
                                📱 Coloca el móvil en tu frente.{"\n"}Inclina hacia abajo para ✅ · hacia arriba para ❌
                            </AppText>
                        </View>
                    </View>
                ) : gameStatus === 'PLAYING' ? (
                    <View style={styles.centered}>
                        <Animated.View style={[styles.wordCardWrap, { transform: [{ scale: wordScale }, { translateX: cardSlideX }] }]}>
                            <View style={[
                                styles.wordCard,
                                tilt === 'DOWN' && styles.wordCardCorrect,
                                tilt === 'UP' && styles.wordCardPass,
                            ]}>
                                <AppText 
                                    style={[styles.wordText, { fontSize: wordFontSize }]} 
                                    numberOfLines={1} 
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.5}
                                >
                                    {getCurrentWordString()}
                                </AppText>

                                {typeof words[wordIndex] !== 'string' && (
                                    <View style={styles.richContent}>
                                        {(words[wordIndex] as CharadaCard).verse && (
                                            <AppText style={[styles.verseText, { color: primaryColor }]}>
                                                {(words[wordIndex] as CharadaCard).verse}
                                            </AppText>
                                        )}
                                        {(words[wordIndex] as CharadaCard).description && (
                                            <AppText style={styles.descText} numberOfLines={3}>
                                                {(words[wordIndex] as CharadaCard).description}
                                            </AppText>
                                        )}
                                        {(words[wordIndex] as CharadaCard).mime && (
                                            <View style={[styles.mimeBox, { borderColor: primaryColor + '40' }]}>
                                                <AppText style={styles.mimeText}>
                                                    🎭 {(words[wordIndex] as CharadaCard).mime}
                                                </AppText>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        </Animated.View>

                        <AppText style={styles.tiltHint}>
                            {!readyForAction ? '↔ Regresa al centro' : tilt === 'DOWN' ? '✅ ¡Correcto!' : tilt === 'UP' ? '❌ Pasado' : '📱 Mantén en tu frente'}
                        </AppText>

                        {/* score badge */}
                        <View style={[styles.scoreBadge, { bottom: Math.max(insets.bottom, 20), right: Math.max(insets.right, 20) }]}>
                            <AppText style={[styles.scoreBadgeText, { color: primaryColor }]}>✓ {score}</AppText>
                            <AppText style={styles.scoreBadgeSub}>{wordsAnswered}/{totalWords}</AppText>
                        </View>
                    </View>
                ) : gameStatus === 'FINISHED' ? (
                    <View style={styles.centered}>
                        <View style={[styles.finishedBox, { borderColor: primaryColor + '40' }]}>
                            <Ionicons name="hourglass" size={40} color={GOLD} style={{ marginBottom: 12 }} />
                            <AppText style={styles.finishedTitle}>¡TIEMPO!</AppText>
                            <AppText style={styles.finishedSub}>Guardando tu resultado...</AppText>
                        </View>
                    </View>
                ) : null}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    headerBar: {
        position: 'absolute', top: 0, left: 0, right: 0,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, zIndex: 20,
    },
    exitBtn: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
    },
    categoryPill: {
        color: '#fff', fontSize: 14, fontWeight: '800', textTransform: 'uppercase',
        backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    },
    timerBox: {
        width: 64, height: 38, borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    },
    timerText: { fontSize: 20, fontWeight: '900' },
    progressTrack: {
        position: 'absolute', top: 76, left: 0, right: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressFill: { height: 4 },
    edgeIndicator: { position: 'absolute', top: '50%', marginTop: -40, alignItems: 'center', gap: 6 },
    edgeLeft: { left: 24 },
    edgeRight: { right: 24 },
    edgeIconWrap: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(231,76,60,0.1)',
        borderWidth: 1.5, borderColor: 'rgba(231,76,60,0.4)', alignItems: 'center', justifyContent: 'center',
    },
    edgeLabel: { color: '#E74C3C', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    centered: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 80 },
    readyCard: {
        backgroundColor: 'rgba(0,0,0,0.6)', padding: 32, borderRadius: 32,
        alignItems: 'center', borderWidth: 1, width: '90%', maxWidth: 500
    },
    readyIconBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    readyCategory: { fontSize: 36, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
    readyInfo: { fontSize: 18, color: '#ccc', marginTop: 8, fontWeight: '600' },
    readyHint: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 14, marginTop: 24, lineHeight: 20 },
    startBtn: { minWidth: 220, height: 60, borderRadius: 30, overflow: 'hidden' },
    startBtnInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
    startBtnText: { color: '#000', fontSize: 20, fontWeight: '900' },
    wordCardWrap: { width: '100%', alignItems: 'center' },
    wordCard: {
        width: '100%', paddingVertical: 24, paddingHorizontal: 30, borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
    },
    wordCardCorrect: { borderColor: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.3)' },
    wordCardPass: { borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.3)' },
    wordText: { color: '#fff', fontWeight: '900', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
    richContent: { marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.25)', width: '100%', alignItems: 'center' },
    verseText: { fontSize: 22, fontWeight: '800', marginBottom: 6, textAlign: 'center' },
    descText: { fontSize: 15, color: '#eee', textAlign: 'center', fontStyle: 'italic', marginBottom: 8 },
    mimeBox: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
    mimeText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    tiltHint: { marginTop: 20, color: '#fff8', fontSize: 15, fontWeight: '700' },
    scoreBadge: { position: 'absolute', padding: 12, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center' },
    scoreBadgeText: { fontSize: 20, fontWeight: '900' },
    scoreBadgeSub: { color: '#fff6', fontSize: 12, fontWeight: '700' },
    finishedBox: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 28, padding: 40, borderWidth: 1 },
    finishedTitle: { color: GOLD, fontSize: 40, fontWeight: '900' },
    finishedSub: { color: '#fff6', fontSize: 16, marginTop: 8 },
});

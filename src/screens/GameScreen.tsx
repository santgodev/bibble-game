import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, AppText, Button, CameraManager, CameraManagerHandle } from '../components';
import { useGameTimer, useAccelerometer } from '../hooks';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharadaCard } from '../data/categories';
import { LinearGradient } from 'expo-linear-gradient';

// Mock words just in case
const MOCK_WORDS = ['Error', 'No Data'];

export const GameScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic, shuffleMusic, setVolumeModifier, availableTracks, setInternalTrack } = useSound();
    // Get params - prioritize param duration
    const { category, categoryObj, words: initialWords, duration = 60, playingMembers = [] } = route.params || {};

    const [score, setScore] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [wordsAnswered, setWordsAnswered] = useState(0);
    // Shuffle words on init
    const [words, setWords] = useState<(string | CharadaCard)[]>([]);
    const [gameStatus, setGameStatus] = useState<'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED'>('READY');

    // Word Tracking for Video Overlay (From HEAD)
    const [wordHistory, setWordHistory] = useState<{ word: string, timestamp: number, result: 'correct' | 'pass' | 'pending' }[]>([]);
    const [gameStartTime, setGameStartTime] = useState<number>(0);

    // Tilt handling mechanism
    const [readyForAction, setReadyForAction] = useState(true);

    // Video Recording
    const cameraRef = useRef<CameraManagerHandle>(null);
    const hasNavigated = useRef<boolean>(false);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);

    // Timeout failsafe
    const failsafeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Init words
        const list = initialWords && initialWords.length > 0 ? [...initialWords] : MOCK_WORDS;
        // Simple shuffle
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        setWords(list);
    }, [initialWords]);

    // Sound Triggers for Promo Cards
    useEffect(() => {
        if (gameStatus !== 'PLAYING' || words.length === 0) return;

        const current = words[wordIndex];
        if (typeof current !== 'string') {
            // SFX Trigger
            if (current.onShowSound === 'wrong') {
                setTimeout(() => playSound('wrong'), 500); // Slight delay for effect
            } else if (current.onShowSound === 'correct') {
                setTimeout(() => playSound('correct'), 500);
            }

            // Music Trigger
            if (current.bgMusic) {
                if (current.bgMusic.includes('Santander')) {
                    const idx = availableTracks.findIndex(t => t.name.includes('Santander'));
                    if (idx !== -1) setInternalTrack(idx);
                }
            }
        }
    }, [wordIndex, gameStatus]);

    useFocusEffect(
        React.useCallback(() => {
            const lockLandscape = async () => {
                try {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                } catch (e) {
                    console.error("Failed to lock landscape", e);
                }
            };
            lockLandscape();

            return () => {
                const lockPortrait = async () => {
                    try {
                        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                        setVolumeModifier(1.0);
                    } catch (e) {
                        console.error("Failed to lock portrait", e);
                    }
                };
                lockPortrait();
            };
        }, [])
    );

    const onTimeEnd = () => {
        finishGame(score, wordsAnswered);
    };

    const finishGame = (finalScore: number, finalTotal: number) => {
        setGameStatus('FINISHED');
        setVolumeModifier(1.0); // Restore full volume
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

        // Use a timeout as failsafe in case recording callback never fires
        failsafeTimeoutRef.current = setTimeout(() => {
            if (cameraRef.current && !hasNavigated.current) {
                hasNavigated.current = true;
                navigation.replace('Results', {
                    score: finalScore,
                    total: finalTotal,
                    videoUri: null,
                    category: category,
                    wordHistory: wordHistory,
                    playingMembers: playingMembers
                });
            }
        }, 8000); // reduced to 8s

        // Stop recording if running
        if (cameraRef.current) {
            cameraRef.current.stopRecording().then(() => {
                // Recording stopped
            });
        } else {
            if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);
            if (!hasNavigated.current) {
                hasNavigated.current = true;
                navigation.replace('Results', {
                    score: finalScore,
                    total: finalTotal,
                    videoUri: null,
                    category: category,
                    wordHistory: wordHistory,
                    playingMembers: playingMembers
                });
            }
        }
    };

    const onRecordingFinished = (uri: string) => {
        if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);
        setRecordedUri(uri);
        // Navigate when recording is done
        if ((gameStatus === 'FINISHED' || wordsAnswered >= 10) && !hasNavigated.current) {
            hasNavigated.current = true;
            navigation.replace('Results', {
                score,
                total: wordsAnswered,
                videoUri: uri,
                category: category,
                wordHistory: wordHistory,
                playingMembers: playingMembers
            });
        }
    };

    // Use Dynamic Duration (Incoming)
    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(duration, onTimeEnd);
    const { tilt, data } = useAccelerometer(gameStatus === 'PLAYING');

    useEffect(() => {
        if (gameStatus === 'PLAYING') {
            startTimer();
        } else {
            stopTimer();
        }
    }, [gameStatus, startTimer, stopTimer]);

    useEffect(() => {
        if (gameStatus !== 'PLAYING') return;

        if (readyForAction) {
            if (tilt === 'UP') {
                // Pass (Now UP is pass)
                handleNextWord(false);
            } else if (tilt === 'DOWN') {
                // Correct (Now DOWN is correct)
                handleNextWord(true);
            }
        } else {
            // Wait for neutral to reset action availability
            if (tilt === 'NEUTRAL') {
                setReadyForAction(true);
            }
        }
    }, [tilt, readyForAction, gameStatus]);

    const getCurrentWordString = () => {
        const current = words[wordIndex];
        return typeof current === 'string' ? current : current.word;
    };

    const handleNextWord = (correct: boolean) => {
        const nextAnsweredCount = wordsAnswered + 1;
        setWordsAnswered(nextAnsweredCount);

        const newScore = correct ? score + 1 : score;

        // Update current word result in history
        const currentTime = Date.now() - gameStartTime;
        setWordHistory(prev => {
            const newHistory = [...prev];
            if (newHistory.length > 0) {
                // Update the last word with result (the one we just finished)
                newHistory[newHistory.length - 1].result = correct ? 'correct' : 'pass';
            }
            return newHistory;
        });

        if (correct) {
            setScore(newScore);
            playHaptic('success');
            playSound('correct');
        } else {
            playHaptic('impact');
            playSound('wrong');
        }

        if (nextAnsweredCount >= words.length) {
            finishGame(newScore, nextAnsweredCount);
            return;
        }

        // Move to next word (Use logic from HEAD to support history)
        setReadyForAction(false);

        let nextIndex = (wordIndex + 1) % words.length;
        setWordIndex(nextIndex);

        // Record Next Word Start Time (HEAD feature)
        // Need to resolve the string for the history log as well
        const nextWordItem = words[nextIndex];
        const nextWordString = typeof nextWordItem === 'string' ? nextWordItem : nextWordItem.word;

        const nextTime = Date.now() - gameStartTime;
        setWordHistory(prev => [
            ...prev,
            { word: nextWordString, timestamp: nextTime, result: 'pending' }
        ]);
    };

    const startGame = () => {
        shuffleMusic();
        setVolumeModifier(0.2); // Soft background music
        setScore(0);
        setWordIndex(0);
        setWordsAnswered(0);
        resetTimer();
        setGameStatus('PLAYING');

        // Start Recording Logic
        const now = Date.now();
        setGameStartTime(now);

        const firstWordItem = words[0];
        const firstWordString = typeof firstWordItem === 'string' ? firstWordItem : firstWordItem.word;

        setWordHistory([{ word: firstWordString, timestamp: 0, result: 'pending' }]);

        // Start Recording if permitted
        if (!categoryObj?.hideCamera) {
            cameraRef.current?.startRecording();
        }
    };

    const exitGame = () => {
        setGameStatus('FINISHED');
        setVolumeModifier(1.0);
        stopTimer();
        if (!categoryObj?.hideCamera) {
            cameraRef.current?.stopRecording();
        }
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        navigation.navigate('Home');
    }

    const renderContent = () => (
        <Container centered style={{ width: '100%', height: '100%', backgroundColor: categoryObj?.gradientColors ? 'transparent' : undefined }}>
            {!categoryObj?.hideCamera && (
                <CameraManager
                    ref={cameraRef}
                    onRecordingFinished={onRecordingFinished}
                />
            )}
            {/* Overlay Tint - Only if camera is showing, otherwise maybe we don't need it? Or keeps it for feedback? 
               User wants "fondo llamativo", overlay makes it dark. 
               Let's keep overlay for feedback but make it lighter or transparent if camera hidden?
               Actually, tilt feedback (green/red) is still useful.
            */}
            <View style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: tilt === 'DOWN' ? 'rgba(46, 204, 113, 0.6)' : // Green
                    tilt === 'UP' ? 'rgba(231, 76, 60, 0.6)' :   // Red
                        (categoryObj?.hideCamera ? 'transparent' : 'rgba(0,0,0,0.3)') // Default dark tint or transparent if no camera
            }} />

            <TouchableOpacity
                style={[styles.exitButton, { top: Math.max(insets.top, 20) + 20, left: Math.max(insets.left, 20) + 20 }]}
                onPress={exitGame}
            >
                <AppText style={styles.exitButtonText}>{t('exit')}</AppText>
            </TouchableOpacity>

            {gameStatus === 'FINISHED' && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AppText variant="header">{t('saving')}</AppText>
                    <AppText>{t('processing_video')}</AppText>
                    {/* Music Toggle for Post-Game Vibes */}
                    <TouchableOpacity
                        style={{ marginTop: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }}
                        onPress={shuffleMusic}
                        activeOpacity={0.7}
                    >
                        <AppText style={{ fontSize: 16 }}>🎵 Cambiar Música</AppText>
                    </TouchableOpacity>
                </View>
            )}

            {gameStatus === 'READY' && (
                <>
                    <AppText variant="header">{t('prepare')}</AppText>
                    <AppText style={styles.instruction}>{t('instruction_forehead')}</AppText>
                    <Button title={t('lets_go')} onPress={startGame} style={{ marginTop: 20 }} />
                </>
            )}

            {gameStatus === 'PLAYING' && (
                <>
                    <AppText style={[styles.timer, { top: Math.max(insets.top, 20) + 20, right: Math.max(insets.right, 20) + 20 }]}>{timeLeft}s</AppText>
                    <AppText style={[styles.counter, { bottom: Math.max(insets.bottom, 20) + 20, left: Math.max(insets.left, 20) + 20 }]}>{wordsAnswered}</AppText>
                    <View style={styles.wordContainer}>
                        <View style={styles.wordCard}>
                            <AppText
                                variant="header"
                                style={styles.word}
                                adjustsFontSizeToFit
                                numberOfLines={3}
                            >
                                {getCurrentWordString()}
                            </AppText>
                            {/* Rich Content for Revelation Support (or other complex cards) */}
                            {typeof words[wordIndex] !== 'string' && (
                                <View style={styles.richContentContainer}>

                                    {/* Verse - Leading with reference for context */}
                                    {(words[wordIndex] as CharadaCard).verse && (
                                        <AppText style={styles.verseText}>
                                            {(words[wordIndex] as CharadaCard).verse}
                                        </AppText>
                                    )}

                                    {/* Description - The core meaning/Resumen */}
                                    {(words[wordIndex] as CharadaCard).description && (
                                        <AppText style={styles.descText} adjustsFontSizeToFit numberOfLines={5}>
                                            {(words[wordIndex] as CharadaCard).description}
                                        </AppText>
                                    )}

                                    {/* Mime - Practical advice (Fallback/Legacy) */}
                                    {(words[wordIndex] as CharadaCard).mime && (
                                        <AppText style={styles.mimeText} adjustsFontSizeToFit numberOfLines={2}>
                                            🎭 {(words[wordIndex] as CharadaCard).mime}
                                        </AppText>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                    <AppText style={styles.instruction}>
                        {readyForAction ? t('instruction_tilt') : t('instruction_neutral')}
                    </AppText>
                </>
            )}
        </Container>
    );

    if (categoryObj?.gradientColors) {
        return (
            <LinearGradient
                colors={categoryObj.gradientColors}
                style={{ flex: 1 }}
            >
                {renderContent()}
            </LinearGradient>
        );
    }

    return renderContent();
};

const styles = StyleSheet.create({
    container: {
        // dynamic bg
    },
    wordCard: {
        padding: 20,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    timer: {
        fontSize: 32,
        fontWeight: 'bold',
        position: 'absolute',
        top: 20,
        right: 20, // Moved closer to edge
        lineHeight: 40,
        padding: 5,
        color: '#e74c3c', // Red color for better visibility
        textAlignVertical: 'center',
        backgroundColor: 'rgba(5, 5, 5, 0.4)',
        borderRadius: 8,
        overflow: 'hidden',
    },
    counter: {
        fontSize: 18,
        position: 'absolute',
        bottom: 20,
        left: 20, // Moved closer to edge
        fontWeight: 'bold',
        color: '#aaa',
        backgroundColor: 'rgba(5, 5, 5, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    wordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20, // Reduced padding to allow more width
        width: '100%',
    },
    word: {
        fontSize: 90, // Significantly larger
        lineHeight: 100,
        textAlign: 'center',
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 6,
        marginBottom: 10,
        width: '100%',
    },
    richContentContainer: {
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 15,
        width: '90%'
    },
    verseText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700', // Gold
        marginBottom: 5,
        textAlign: 'center'
    },
    descText: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 5,
        fontStyle: 'italic'
    },
    mimeText: {
        fontSize: 16,
        color: '#CCC',
        textAlign: 'center'
    },
    instruction: {
        marginBottom: 20,
        opacity: 0.8,
        fontSize: 18,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    exitButton: {
        position: 'absolute',
        top: 40,
        left: 60,
        zIndex: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    exitButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
    },

});

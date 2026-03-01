import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Container, AppText } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useGameTimer } from '../../hooks';
import { useSound } from '../../context/SoundContext';

export const ImpostorGameScreen = ({ navigation, route }: any) => {
    const { duration, impostorList, secretWord, secretCategory, players, playerDetails } = route.params;

    const [isFinished, setIsFinished] = useState(false);
    const [starterPlayer, setStarterPlayer] = useState('');
    const { pauseMusic, resumeMusic } = useSound();

    // Track whether the game has already been started
    // so that coming back from the vote screen does NOT reset the timer
    const alreadyStartedRef = useRef(false);

    // Animate pulse ring on timer when low
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.08, duration: 500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            ])
        ).start();
    };

    const onTimeEnd = () => {
        setIsFinished(true);
        startPulse();
    };

    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(duration, onTimeEnd);

    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            pauseMusic();

            if (!alreadyStartedRef.current) {
                // ── First focus: full fresh start ──
                alreadyStartedRef.current = true;
                setIsFinished(false);
                resetTimer();

                if (playerDetails && playerDetails.length > 0) {
                    const rIndex = Math.floor(Math.random() * playerDetails.length);
                    setStarterPlayer(playerDetails[rIndex].username);
                } else {
                    setStarterPlayer(`Jugador ${Math.floor(Math.random() * players) + 1}`);
                }

                startTimer();
            } else {
                // ── Returning from vote screen: just resume where we left off ──
                if (!isFinished) startTimer();
            }

            return () => {
                // Pause (not reset) when losing focus so the counter freezes
                stopTimer();
                resumeMusic();
            };
        }, [duration, playerDetails, players, isFinished])
    );

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const isLow = timeLeft <= 15;

    const handleVote = () => {
        stopTimer();
        // Genera session única por partida para anti-farming
        const sessionId = `IMPOSTOR_${secretWord}_${Date.now()}`;
        // Categorías básicas no dan trofeos — solo XP
        const canEarnTrophies = secretCategory !== 'biblia_basica';
        navigation.navigate('ImpostorResults', {
            impostorList,
            secretWord,
            secretCategory,
            players,
            playerDetails,
            sessionId,
            canEarnTrophies,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconBtn}>
                    <Ionicons name="close" size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="help" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            <Container centered style={{ backgroundColor: 'transparent', flex: 1, paddingHorizontal: 20 }}>
                <View style={styles.chatIconWrapper}>
                    <Ionicons name="chatbubble-ellipses" size={45} color="#fff" />
                </View>

                <AppText style={styles.title}>Debate</AppText>

                <AppText style={styles.instruction}>
                    Uno por uno, los jugadores dicen una palabra o frase relacionada con la palabra secreta.
                </AppText>

                <AppText style={styles.starterText}>
                    {starterPlayer} empieza.
                </AppText>

                <View style={styles.timerWrapper}>
                    <Animated.View style={[
                        styles.timerCircle,
                        isLow && styles.timerCircleLow,
                        { transform: [{ scale: isLow ? pulseAnim : 1 }] }
                    ]}>
                        <AppText variant="display" style={[styles.timer, isLow && { color: '#ff4d4d' }]}>
                            {formatTime(timeLeft)}
                        </AppText>
                    </Animated.View>
                </View>

                <AppText style={styles.bottomInstruction}>
                    {isFinished
                        ? '¡El tiempo se acabó! Votación obligatoria.'
                        : 'Para el cronómetro cuando estén listos para votar.'}
                </AppText>
            </Container>

            <View style={styles.footerArea}>
                <TouchableOpacity
                    style={[styles.voteBtn, isFinished && { backgroundColor: '#e74c3c', borderColor: '#c0392b' }]}
                    onPress={handleVote}
                >
                    <Ionicons name="hand-right" size={20} color="#fff" style={{ marginRight: 10 }} />
                    <AppText style={styles.voteBtnText}>Votar</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a14',
        paddingTop: 50,
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    iconBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20
    },
    chatIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(78,22,181,0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 15,
        lineHeight: 40,
        includeFontPadding: false
    },
    instruction: {
        fontSize: 17,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
        lineHeight: 26,
        fontWeight: '500',
        includeFontPadding: false
    },
    starterText: {
        fontSize: 22,
        color: '#FFD700',
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        lineHeight: 30,
        includeFontPadding: false
    },
    timerWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    timerCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 6,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.04)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timerCircleLow: {
        borderColor: 'rgba(231,76,60,0.5)',
        backgroundColor: 'rgba(231,76,60,0.06)',
    },
    timer: {
        fontSize: 72,
        color: '#fff',
        fontWeight: '900',
        lineHeight: 85,
        includeFontPadding: false
    },
    bottomInstruction: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        paddingHorizontal: 30,
        fontWeight: '600',
        marginBottom: 10,
        lineHeight: 22,
        includeFontPadding: false
    },
    footerArea: {
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center'
    },
    voteBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5e16b5',
        paddingVertical: 18,
        borderRadius: 20,
        width: '100%',
        borderBottomWidth: 4,
        borderColor: '#4a0e95'
    },
    voteBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'none'
    }
});

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Container, AppText } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useGameTimer } from '../../hooks';
import { useSound } from '../../context/SoundContext';
import { LinearGradient } from 'expo-linear-gradient';

export const ImpostorGameScreen = ({ navigation, route }: any) => {
    const duration = route.params?.duration ? Number(route.params.duration) : 60;
    const players = route.params?.players ? Number(route.params.players) : 3;
    const { impostorList, secretWord, secretCategory, playerDetails, selectedCategories } = route.params || {};

    // Theme values from first selected category
    const mainCategory = selectedCategories?.[0];
    const themeGradients = mainCategory?.gradientColors || ['#2D1457', '#5E16B5', '#8E44AD'];
    const primaryColor = mainCategory?.color || '#9b59b6';

    const [isFinished, setIsFinished] = useState(false);
    const [starterPlayer, setStarterPlayer] = useState('');
    const [caughtImpostors, setCaughtImpostors] = useState<number[]>(route.params?.caughtImpostors || []);
    const [eliminatedInnocents, setEliminatedInnocents] = useState<number[]>(route.params?.eliminatedInnocents || []);
    const { pauseMusic, resumeMusic, playSound } = useSound();

    const alreadyStartedRef = useRef(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.08, duration: 500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            ])
        ).start();
    };

    const stopPulse = () => {
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
    };

    const onTimeEnd = () => {
        setIsFinished(true);
        startPulse();
        playSound('wrong');
    };

    const { timeLeft, startTimer, stopTimer, resetTimer, setTimeLeft } = useGameTimer(duration, onTimeEnd);

    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            pauseMusic();

            if (!alreadyStartedRef.current) {
                alreadyStartedRef.current = true;
                setIsFinished(false);
                if (route.params?.remainingTime !== undefined) {
                    setTimeLeft(route.params.remainingTime);
                } else {
                    resetTimer();
                }
                if (playerDetails && playerDetails.length > 0) {
                    const rIndex = Math.floor(Math.random() * playerDetails.length);
                    setStarterPlayer(playerDetails[rIndex].username || playerDetails[rIndex].name || 'Jugador');
                } else {
                    const pCount = Number(players) || 3;
                    setStarterPlayer(`Jugador ${Math.floor(Math.random() * pCount) + 1}`);
                }
                startTimer();
            } else {
                if (route.params?.remainingTime !== undefined) {
                    setTimeLeft(route.params.remainingTime);
                }
                if (timeLeft <= 0) {
                    setIsFinished(true);
                    startPulse();
                } else {
                    startTimer();
                }
            }
            return () => {
                stopTimer();
                resumeMusic();
                stopPulse();
            };
        }, [duration, playerDetails, players])
    );

    useEffect(() => {
        if (route.params?.caughtImpostors) setCaughtImpostors(route.params.caughtImpostors);
        if (route.params?.eliminatedInnocents) setEliminatedInnocents(route.params.eliminatedInnocents);
    }, [route.params?.caughtImpostors, route.params?.eliminatedInnocents]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVote = () => {
        stopTimer();
        navigation.navigate('ImpostorVote', {
            timeLeft, players, impostorList, secretWord, secretCategory, playerDetails,
            caughtImpostors, eliminatedInnocents, selectedCategories
        });
    };

    const isLow = timeLeft <= 10;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={themeGradients}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconBtn}>
                    <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={[styles.badge, { backgroundColor: primaryColor + '40' }]}>
                    <AppText style={[styles.badgeText, { color: primaryColor }]}>{secretCategory}</AppText>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="help-circle" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <Container centered>
                <View style={[styles.chatIconWrapper, { backgroundColor: primaryColor + '20', borderColor: primaryColor + '40' }]}>
                    <Ionicons name="chatbubbles" size={40} color={primaryColor} />
                </View>

                <AppText variant="display" style={styles.title}>Tiempo de Debate</AppText>
                
                <AppText style={styles.instruction}>
                    Hagan preguntas estratégicas para encontrar al impostor.
                </AppText>

                <AppText style={styles.starterText}>
                    <AppText style={{ color: '#fff' }}>Empieza: </AppText>{starterPlayer}
                </AppText>

                <View style={styles.timerWrapper}>
                    <Animated.View style={[
                        styles.timerCircle,
                        isLow && styles.timerCircleLow,
                        { transform: [{ scale: isLow ? pulseAnim : 1 }], borderColor: isLow ? '#ff4d4d' : primaryColor + '40' }
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
                    style={[styles.voteBtn, { backgroundColor: primaryColor }, isFinished && { backgroundColor: '#e74c3c' }]}
                    onPress={handleVote}
                    activeOpacity={0.8}
                >
                    <Ionicons name="checkmark-circle" size={24} color="#000" style={{ marginRight: 10 }} />
                    <AppText style={styles.voteBtnText}>VOTAR AHORA</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10
    },
    iconBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center'
    },
    badge: {
        paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    },
    badgeText: { fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
    chatIconWrapper: {
        width: 90, height: 90, borderRadius: 45,
        borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    },
    title: {
        fontSize: 36, color: '#fff', fontWeight: '900', marginBottom: 10, textAlign: 'center'
    },
    instruction: {
        fontSize: 16, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: 30, marginBottom: 20, lineHeight: 24
    },
    starterText: {
        fontSize: 24, color: '#FFD700', fontWeight: '900', marginBottom: 30, textAlign: 'center'
    },
    timerWrapper: {
        alignItems: 'center', justifyContent: 'center', marginBottom: 30
    },
    timerCircle: {
        width: 240, height: 240, borderRadius: 120,
        borderWidth: 8, backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center', alignItems: 'center'
    },
    timerCircleLow: {
        backgroundColor: 'rgba(231,76,60,0.1)',
    },
    timer: {
        fontSize: 80, color: '#fff', fontWeight: '900',
        lineHeight: 90, textAlign: 'center', includeFontPadding: false,
        paddingVertical: 10
    },
    bottomInstruction: {
        fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', paddingHorizontal: 40, fontWeight: '600'
    },
    footerArea: {
        paddingHorizontal: 30, width: '100%', alignItems: 'center'
    },
    voteBtn: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        height: 64, borderRadius: 32, width: '100%',
    },
    voteBtnText: { color: '#000', fontSize: 20, fontWeight: '900' }
});

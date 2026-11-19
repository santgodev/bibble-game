import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { useGameTimer } from '../../hooks';
import { useSound } from '../../context/SoundContext';
import { EditorialDoodle } from '../../trivia/components/EditorialDoodle';

export const ImpostorGameScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const duration = route.params?.duration ? Number(route.params.duration) : 60;
    const players = route.params?.players ? Number(route.params.players) : 3;
    const {
        impostorList,
        secretWord,
        secretCategory,
        playerDetails,
        selectedCategories,
    } = route.params || {};

    const [isFinished, setIsFinished] = useState(false);
    const [starterPlayer, setStarterPlayer] = useState('');
    const [caughtImpostors, setCaughtImpostors] = useState<number[]>(
        route.params?.caughtImpostors || []
    );
    const [eliminatedInnocents, setEliminatedInnocents] = useState<number[]>(
        route.params?.eliminatedInnocents || []
    );
    const { pauseMusic, resumeMusic, playSound, playHaptic } = useSound();

    const alreadyStartedRef = useRef(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.06,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
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

    const { timeLeft, startTimer, stopTimer, resetTimer, setTimeLeft } = useGameTimer(
        duration,
        onTimeEnd
    );

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
                    const impSet = new Set<number>(Array.isArray(impostorList) ? impostorList : []);
                    const innocentIndices = playerDetails
                        .map((_: any, idx: number) => idx)
                        .filter((idx: number) => !impSet.has(idx));
                    const pool = innocentIndices.length > 0
                        ? innocentIndices
                        : playerDetails.map((_: any, idx: number) => idx);
                    const rIndex = pool[Math.floor(Math.random() * pool.length)];
                    setStarterPlayer(
                        playerDetails[rIndex].username || playerDetails[rIndex].name || 'Jugador'
                    );
                } else {
                    const pCount = Number(players) || 3;
                    const impSet = new Set<number>(Array.isArray(impostorList) ? impostorList : []);
                    const innocentNums = Array.from({ length: pCount }, (_, i) => i).filter(i => !impSet.has(i));
                    const pool = innocentNums.length > 0 ? innocentNums : [0];
                    const chosen = pool[Math.floor(Math.random() * pool.length)];
                    setStarterPlayer(`Jugador ${chosen + 1}`);
                }
                startTimer();
            } else {
                const incomingRemaining = route.params?.remainingTime;
                if (incomingRemaining !== undefined) {
                    setTimeLeft(incomingRemaining);
                    if (incomingRemaining <= 0) {
                        setIsFinished(true);
                        startPulse();
                    } else {
                        setIsFinished(false);
                        startTimer();
                    }
                } else if (timeLeft <= 0) {
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
        if (route.params?.eliminatedInnocents)
            setEliminatedInnocents(route.params.eliminatedInnocents);
    }, [route.params?.caughtImpostors, route.params?.eliminatedInnocents]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVote = () => {
        playSound('select');
        playHaptic('selection');
        stopTimer();
        navigation.navigate('ImpostorVote', {
            timeLeft,
            remainingTime: timeLeft,
            duration,
            players,
            impostorList,
            secretWord,
            secretCategory,
            playerDetails,
            caughtImpostors,
            eliminatedInnocents,
            selectedCategories,
            initialCaughtImpostors: caughtImpostors,
            initialEliminatedInnocents: eliminatedInnocents,
        });
    };

    const isLow = timeLeft <= 10;

    return (
        <View style={[s.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={s.header}>
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Salir"
                    onPress={() => navigation.navigate('Home')}
                    style={s.iconBtn}
                >
                    <Ionicons name="close" size={20} color="#1B1E23" />
                </TouchableOpacity>
                <View style={s.categoryPill}>
                    <AppText style={s.categoryPillText}>{secretCategory}</AppText>
                </View>
                <View style={{ width: 38 }} />
            </View>

            <View style={s.center}>
                <EditorialDoodle kind="impostor" tint="#D6E8F8" size={76} />
                <AppText style={s.title}>Tiempo de debate</AppText>

                <View style={s.starterPill}>
                    <AppText style={s.starterLabel}>Empieza: </AppText>
                    <AppText style={s.starterName}>{starterPlayer}</AppText>
                </View>

                <Animated.View
                    style={[
                        s.timerCircle,
                        isLow && s.timerCircleLow,
                        { transform: [{ scale: isLow ? pulseAnim : 1 }] },
                    ]}
                >
                    <AppText style={[s.timerText, isLow && { color: '#9E3A3A' }]}>
                        {formatTime(timeLeft)}
                    </AppText>
                </Animated.View>

                <AppText style={s.bottomHint}>
                    {isFinished
                        ? 'Tiempo terminado. Hora de votar.'
                        : 'Detén el tiempo cuando estén listos para votar.'}
                </AppText>
            </View>

            <View style={s.footer}>
                <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [
                        s.voteBtn,
                        isFinished && { backgroundColor: '#C96A6A' },
                        pressed && s.pressed,
                    ]}
                    onPress={handleVote}
                >
                    <AppText style={s.voteBtnText}>Votar ahora</AppText>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryPill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#D6E8F8',
    },
    categoryPillText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -0.6,
        marginTop: 12,
    },
    starterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#F5DA7C',
    },
    starterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6F5207',
    },
    starterName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1B1E23',
    },
    timerCircle: {
        marginTop: 30,
        width: 184,
        height: 184,
        borderRadius: 92,
        backgroundColor: '#F6F8FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerCircleLow: {
        backgroundColor: '#F7E6E6',
    },
    timerText: {
        fontSize: 46,
        lineHeight: 54,
        fontWeight: '800',
        color: '#1E3A5F',
        fontVariant: ['tabular-nums'],
    },
    bottomHint: {
        marginTop: 24,
        fontSize: 14,
        color: '#6E7785',
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 520,
        alignSelf: 'center',
    },
    voteBtn: {
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    voteBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
});

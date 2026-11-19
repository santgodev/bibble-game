import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    PanResponder,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { useSound } from '../../context/SoundContext';
import { EditorialDoodle } from '../../trivia/components/EditorialDoodle';

export const ImpostorPassScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic } = useSound();
    const {
        players,
        playerDetails,
        impostors,
        hintEnabled,
        duration,
        selectedCategories,
    } = route.params;

    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [hasPeeked, setHasPeeked] = useState(false);

    const panY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dy: panY }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (_e, gestureState) => {
                if (gestureState.dy < -60) {
                    setHasPeeked(true);
                    playSound('unlock');
                    playHaptic('selection');
                }
                Animated.spring(panY, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 6,
                    speed: 12,
                }).start();
            },
        })
    ).current;

    const [secretWord, setSecretWord] = useState('');
    const [secretCategory, setSecretCategory] = useState('');
    const [impostorList, setImpostorList] = useState<number[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    useEffect(() => {
        const SEEN_KEY = 'seen_impostor_words_v2';
        const setupGame = async () => {
            if (selectedCategories && selectedCategories.length > 0) {
                const entries: { word: string; category: string }[] = [];
                selectedCategories.forEach((cat: any) => {
                    (cat.words || []).forEach((w: any) => {
                        const text = typeof w === 'string' ? w : w.word;
                        if (text) entries.push({ word: text, category: cat.title });
                    });
                });

                if (entries.length > 0) {
                    const keyOf = (e: { word: string; category: string }) =>
                        `${e.category}|${e.word}`;
                    const pickRandom = <T,>(arr: T[]): T =>
                        arr[Math.floor(Math.random() * arr.length)];
                    let chosen = pickRandom(entries);

                    try {
                        const seenStr = await AsyncStorage.getItem(SEEN_KEY);
                        let seen: string[] = seenStr ? JSON.parse(seenStr) : [];

                        let available = entries.filter(e => !seen.includes(keyOf(e)));
                        if (available.length === 0) {
                            const poolKeys = new Set(entries.map(keyOf));
                            seen = seen.filter(k => !poolKeys.has(k));
                            available = entries;
                        }

                        chosen = pickRandom(available);
                        seen.push(keyOf(chosen));
                        await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(seen.slice(-1000)));
                    } catch (e) {
                        console.error('Error with word history', e);
                    }

                    setSecretWord(chosen.word);
                    setSecretCategory(chosen.category);
                }
            }
            const impSet = new Set<number>();
            while (impSet.size < impostors) {
                impSet.add(Math.floor(Math.random() * players));
            }
            setImpostorList(Array.from(impSet));
        };
        setupGame();
    }, []);

    const isCurrentImpostor = impostorList.includes(currentPlayer);
    const currentUser = playerDetails
        ? playerDetails[currentPlayer]
        : { username: `Jugador ${currentPlayer + 1}` };

    const handleNext = () => {
        playSound('tap');
        playHaptic('selection');
        setHasPeeked(false);
        if (currentPlayer + 1 < players) {
            setCurrentPlayer(prev => prev + 1);
        } else {
            navigation.replace('ImpostorGame', {
                duration,
                impostorList,
                secretWord,
                secretCategory,
                players,
                playerDetails,
            });
        }
    };

    const clampedY = panY.interpolate({
        inputRange: [-250, 0, 500],
        outputRange: [-250, 0, 0],
        extrapolate: 'clamp',
    });

    const frontAnimatedStyle = { transform: [{ translateY: clampedY }] };

    return (
        <View style={[s.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={s.header}>
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Salir"
                    onPress={() => navigation.goBack()}
                    style={s.iconBtn}
                >
                    <Ionicons name="close" size={20} color="#1B1E23" />
                </TouchableOpacity>
                <AppText style={s.turnLabel}>PASA EL TELÉFONO</AppText>
                <View style={s.counterPill}>
                    <AppText style={s.counterText}>
                        {currentPlayer + 1}/{players}
                    </AppText>
                </View>
            </View>

            <View style={s.turnBanner}>
                <AppText style={s.turnSubLabel}>TURNO DE</AppText>
                <AppText style={s.playerName} numberOfLines={1} adjustsFontSizeToFit>
                    {currentUser.username}
                </AppText>
            </View>

            <View style={s.cardWrapper}>
                <View style={s.cardContainer}>
                    {/* Reverso */}
                    <View
                        style={[
                            s.cardReverso,
                            { backgroundColor: isCurrentImpostor ? '#F7E6E6' : '#DCECE8' },
                        ]}
                    >
                        <ScrollView
                            contentContainerStyle={s.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {isCurrentImpostor ? (
                                <View style={s.roleBox}>
                                    <EditorialDoodle kind="impostor" tint="#FFFFFF" size={76} />
                                    <AppText style={s.roleTitle}>Eres el</AppText>
                                    <AppText
                                        style={[s.roleValue, { color: '#9E3A3A' }]}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                    >
                                        IMPOSTOR
                                    </AppText>
                                    <AppText style={s.detailText}>
                                        Escucha bien y trata de no ser descubierto.
                                    </AppText>
                                    {hintEnabled && (
                                        <View style={s.pillBox}>
                                            <AppText style={s.pillLabel}>PISTA</AppText>
                                            <AppText style={s.pillValue}>{secretCategory}</AppText>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <View style={s.roleBox}>
                                    <EditorialDoodle kind="dove" tint="#FFFFFF" size={76} />
                                    <AppText style={s.roleTitle}>Eres</AppText>
                                    <AppText
                                        style={[s.roleValue, { color: '#1E3A5F' }]}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                    >
                                        CIUDADANO
                                    </AppText>

                                    <View style={s.secretWordBox}>
                                        <AppText
                                            style={s.secretWord}
                                            numberOfLines={2}
                                            adjustsFontSizeToFit
                                        >
                                            {secretWord}
                                        </AppText>
                                    </View>

                                    <View style={s.pillBox}>
                                        <AppText style={s.pillLabel}>CATEGORÍA</AppText>
                                        <AppText style={s.pillValue}>{secretCategory}</AppText>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {/* Frente deslizable editorial */}
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[s.card, frontAnimatedStyle, { zIndex: 10 }]}
                    >
                        <View style={s.coverInner}>
                            <View style={s.coverTopBadge}>
                                <AppText style={s.coverTopBadgeText}>SECRETO</AppText>
                            </View>
                            <EditorialDoodle kind="impostor" tint="#FFFFFF" size={104} />
                            <View style={s.coverPrompt}>
                                <Ionicons name="chevron-up" size={20} color="#1E3A5F" />
                                <AppText style={s.cardTouchText}>Desliza hacia arriba</AppText>
                            </View>
                        </View>
                    </Animated.View>
                </View>

                <View style={s.bottomArea}>
                    {!hasPeeked && (
                        <AppText style={s.hintPeekText}>
                            Desliza la tarjeta para ver tu rol en secreto
                        </AppText>
                    )}

                    <Pressable
                        accessibilityRole="button"
                        style={({ pressed }) => [
                            s.nextBtn,
                            !hasPeeked && { opacity: 0.35 },
                            pressed && hasPeeked && s.pressed,
                        ]}
                        onPress={handleNext}
                        disabled={!hasPeeked}
                    >
                        <AppText style={s.nextBtnText}>
                            {currentPlayer + 1 === players ? 'Empezar debate' : 'Siguiente'}
                        </AppText>
                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </Pressable>
                </View>
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
    turnLabel: {
        color: '#6E7785',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    counterPill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        backgroundColor: '#D6E8F8',
    },
    counterText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    turnBanner: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    turnSubLabel: {
        color: '#2B6CB0',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.4,
        marginBottom: 3,
    },
    playerName: {
        color: '#1B1E23',
        fontSize: 32,
        textAlign: 'center',
        lineHeight: 38,
        fontWeight: '800',
        letterSpacing: -0.6,
    },
    cardWrapper: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    cardContainer: {
        width: '100%',
        maxWidth: 320,
        height: 400,
        position: 'relative',
    },
    card: {
        width: '100%',
        height: '100%',
        backgroundColor: '#D6E8F8',
        borderRadius: 30,
        overflow: 'hidden',
    },
    coverInner: {
        flex: 1,
        padding: 26,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    coverTopBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.72)',
    },
    coverTopBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#1E3A5F',
    },
    coverPrompt: {
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.78)',
    },
    cardTouchText: {
        color: '#1E3A5F',
        fontSize: 13,
        fontWeight: '800',
    },
    cardReverso: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: 30,
        overflow: 'hidden',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleBox: {
        alignItems: 'center',
        width: '100%',
    },
    roleTitle: {
        color: '#5B6573',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 10,
    },
    roleValue: {
        fontSize: 34,
        fontWeight: '800',
        lineHeight: 42,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    detailText: {
        color: '#5B6573',
        textAlign: 'center',
        marginTop: 8,
        fontSize: 14,
        lineHeight: 20,
    },
    secretWordBox: {
        marginTop: 16,
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    secretWord: {
        color: '#1B1E23',
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 36,
    },
    pillBox: {
        marginTop: 18,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.78)',
        alignItems: 'center',
    },
    pillLabel: {
        color: '#5B6573',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: 2,
    },
    pillValue: {
        color: '#1B1E23',
        fontSize: 15,
        fontWeight: '800',
    },
    bottomArea: {
        width: '100%',
        maxWidth: 440,
        gap: 10,
    },
    hintPeekText: {
        color: '#6E7785',
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
    },
    nextBtn: {
        width: '100%',
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    nextBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
});

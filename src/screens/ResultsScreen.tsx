import React, { useRef, useState } from 'react';
import {
    Animated,
    BackHandler,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components';
import { Confetti } from '../components/Confetti';
import { calculateCharadasRewards } from '../lib/gamification/pointsSystem';
import { useSound } from '../context/SoundContext';
import { EditorialDoodle } from '../trivia/components/EditorialDoodle';

export const ResultsScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const {
        score = 0,
        total = 0,
        videoUri,
        category,
        wordHistory,
        canEarnTrophies = true,
        duration = 60,
        isTrivia = false,
    } = route.params || {};

    const rewards = calculateCharadasRewards(score, total, canEarnTrophies, duration);
    const { playSound, playHaptic } = useSound();

    const [showConfetti, setShowConfetti] = useState(false);
    const fadeIn = useRef(new Animated.Value(0)).current;
    const accuracy = total > 0 ? score / total : 0;

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            const onBackPress = () => {
                navigation.navigate('Home');
                return true;
            };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 380,
                useNativeDriver: true,
            }).start();

            if (accuracy >= 0.5) {
                setTimeout(() => {
                    playSound('win');
                    playHaptic('victory');
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }, 400);
            }

            return () => {
                subscription.remove();
            };
        }, [score, total])
    );

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <Confetti visible={showConfetti} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <Animated.View style={[s.inner, { opacity: fadeIn }]}>
                    <EditorialDoodle
                        kind={accuracy >= 0.5 ? 'trophy' : 'charades'}
                        tint={accuracy >= 0.5 ? '#F5DA7C' : '#DCECE8'}
                        size={92}
                    />

                    <AppText style={s.eyebrow}>PARTIDA FINALIZADA</AppText>
                    <AppText style={s.title}>
                        {accuracy >= 0.7 ? '¡Gran ronda!' : 'Buen intento'}
                    </AppText>
                    {!!category && <AppText style={s.subtitle}>{category}</AppText>}

                    <View style={s.scoreCard}>
                        <AppText style={s.scoreBig}>
                            {score}/{total}
                        </AppText>
                        <AppText style={s.scoreMeta}>aciertos</AppText>

                        <View style={s.rewardsRow}>
                            <View style={[s.rewardChip, { backgroundColor: '#D6E8F8' }]}>
                                <Ionicons name="flash" size={15} color="#1E3A5F" />
                                <AppText style={[s.rewardText, { color: '#1E3A5F' }]}>
                                    +{rewards.xp} XP
                                </AppText>
                            </View>
                            {rewards.trophies > 0 && (
                                <View style={[s.rewardChip, { backgroundColor: '#F5DA7C' }]}>
                                    <Ionicons name="trophy" size={15} color="#6F5207" />
                                    <AppText style={[s.rewardText, { color: '#6F5207' }]}>
                                        +{rewards.trophies} Trofeos
                                    </AppText>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={s.actions}>
                        {!!videoUri && (
                            <Pressable
                                accessibilityRole="button"
                                onPress={() =>
                                    navigation.navigate('VideoReview', {
                                        videoUri,
                                        category,
                                        score,
                                        total,
                                        wordHistory,
                                    })
                                }
                                style={({ pressed }) => [s.goldBtn, pressed && s.pressed]}
                            >
                                <Ionicons name="videocam-outline" size={18} color="#1B1E23" />
                                <AppText style={s.goldBtnText}>Revisar video</AppText>
                            </Pressable>
                        )}

                        <Pressable
                            accessibilityRole="button"
                            onPress={() =>
                                navigation.navigate('CategorySelection', {
                                    targetGame: isTrivia ? 'trivia' : 'charadas',
                                })
                            }
                            style={({ pressed }) => [s.primaryBtn, pressed && s.pressed]}
                        >
                            <AppText style={s.primaryBtnText}>Jugar otra vez</AppText>
                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            onPress={() => navigation.navigate('Home')}
                            style={({ pressed }) => [s.secondaryBtn, pressed && s.pressed]}
                        >
                            <AppText style={s.secondaryBtnText}>Volver al inicio</AppText>
                        </Pressable>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    page: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    inner: {
        width: '100%',
        maxWidth: 520,
        alignSelf: 'center',
        alignItems: 'center',
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        color: '#3D8A7B',
        marginTop: 12,
        marginBottom: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -0.6,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6E7785',
        marginTop: 4,
    },
    scoreCard: {
        width: '100%',
        marginTop: 24,
        borderRadius: 28,
        padding: 24,
        backgroundColor: '#DCECE8',
        alignItems: 'center',
    },
    scoreBig: {
        fontSize: 52,
        lineHeight: 58,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -1,
    },
    scoreMeta: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3D8A7B',
        marginTop: 2,
    },
    rewardsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    rewardChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
    },
    rewardText: {
        fontSize: 13,
        fontWeight: '800',
    },
    actions: {
        width: '100%',
        gap: 11,
        marginTop: 24,
    },
    primaryBtn: {
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    secondaryBtn: {
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E3A5F',
    },
    goldBtn: {
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F5DA7C',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    goldBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1B1E23',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
});

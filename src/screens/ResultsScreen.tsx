import { GlassBackground } from '../components/Glass';
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Animated, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AppText } from '../components';
import { Confetti } from '../components/Confetti';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { calculateCharadasRewards } from '../lib/gamification/pointsSystem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSound } from '../context/SoundContext';
import { LinearGradient } from 'expo-linear-gradient';
import { DEFAULT_CATEGORIES } from '../data/categories';

export const ResultsScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const {
        score = 0,
        total = 0,
        videoUri,
        category,
        wordHistory,
        playingMembers = [],
        canEarnTrophies = true,
        duration = 60,
        isTrivia = false,
    } = route.params || {};

    const categoryObj = DEFAULT_CATEGORIES.find(c => c.id === category || c.title === category);
    const themeGradients = (categoryObj?.gradientColors && categoryObj.gradientColors.length >= 2)
        ? (categoryObj.gradientColors as [string, string, ...string[]])
        : (["#D1E2DA", "#D1E2DA"] as [string, string, ...string[]]);
    const primaryColor = theme.colors.primary;

    const rewards = calculateCharadasRewards(score, total, canEarnTrophies, duration);
    const { playSound, playHaptic } = useSound();

    const [showConfetti, setShowConfetti] = useState(false);
    const scoreAnim = useRef(new Animated.Value(0)).current;
    const xpAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const scaleIn = useRef(new Animated.Value(0.7)).current;
    const xpBadgeScale = useRef(new Animated.Value(0)).current;
    const trophyBadgeScale = useRef(new Animated.Value(0)).current;

    const [displayScore, setDisplayScore] = useState(0);
    const [displayXP, setDisplayXP] = useState(0);
    const [showRewards, setShowRewards] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            const onBackPress = () => {
                navigation.navigate('Home');
                return true;
            };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            Animated.parallel([
                Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(scaleIn, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
            ]).start();

            const accuracy = total > 0 ? score / total : 0;
            if (accuracy >= 0.5) {
                setTimeout(() => {
                    playSound('win');
                    playHaptic('victory');
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }, 600);
            }

            scoreAnim.addListener(({ value }) => setDisplayScore(Math.round(value)));
            Animated.timing(scoreAnim, {
                toValue: score,
                duration: 1000,
                delay: 400,
                useNativeDriver: false,
            }).start();

            setTimeout(() => {
                setShowRewards(true);
                xpAnim.addListener(({ value }) => setDisplayXP(Math.round(value)));
                Animated.timing(xpAnim, {
                    toValue: rewards.xp,
                    duration: 800,
                    useNativeDriver: false,
                }).start();

                Animated.spring(xpBadgeScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
                if (rewards.trophies > 0) {
                    setTimeout(() => {
                        Animated.spring(trophyBadgeScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
                    }, 200);
                }
            }, 1500);

            return () => {
                subscription.remove();
                scoreAnim.removeAllListeners();
                xpAnim.removeAllListeners();
            };
        }, [score, total])
    );

    return (
        <View style={styles.container}>
            <GlassBackground />



            <Confetti visible={showConfetti} />

            <Animated.View style={[styles.inner, { opacity: fadeIn, transform: [{ scale: scaleIn }] }]}>
                <AppText style={styles.finishedLabel}>Partida Finalizada</AppText>

                <View style={[styles.scoreCircle, { borderColor: primaryColor + '60', backgroundColor: "rgba(255,255,255,0.48)" }]}>
                    <AppText style={styles.scoreValue}>{displayScore}</AppText>
                    <View style={styles.scoreDivider} />
                    <AppText style={styles.scoreTotal}>{total}</AppText>
                    <AppText style={[styles.scoreLabel, { color: primaryColor }]}>ACIERTOS</AppText>
                </View>

                <View style={styles.rewardsContainer}>
                    {showRewards && (
                        <>
                            <Animated.View style={[styles.rewardBadgePremium, { transform: [{ scale: xpBadgeScale }] }]}>
                                <LinearGradient colors={["#68A877", "#45834D"]} style={styles.badgeGlow} />
                                <Ionicons name="flash" size={20} color="#2D3043" />
                                <AppText style={styles.rewardValuePremium}>+{displayXP} XP</AppText>
                            </Animated.View>

                            {rewards.trophies > 0 && (
                                <Animated.View style={[styles.rewardBadgePremium, { transform: [{ scale: trophyBadgeScale }], marginLeft: 10 }]}>
                                    <LinearGradient colors={["#68A877", "#68A877"]} style={[styles.badgeGlow, { opacity: 0.8 }]} />
                                    <Ionicons name="trophy" size={20} color="#2D3043" />
                                    <AppText style={styles.rewardValuePremium}>+{rewards.trophies} Trofeos</AppText>
                                </Animated.View>
                            )}
                        </>
                    )}
                </View>

                <View style={styles.actions}>
                    {videoUri && (
                        <TouchableOpacity
                            style={[styles.btn, styles.btnSecondary, { borderColor: primaryColor + '40' }]}
                            onPress={() => navigation.navigate('VideoReview', { videoUri, category, score, total, wordHistory })}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="videocam" size={20} color="#2D3043" style={{ marginRight: 10 }} />
                            <AppText style={styles.btnSecondaryText}>Revisar Video</AppText>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.btn, styles.btnPrimary, { backgroundColor: primaryColor }, isTrivia && { backgroundColor: theme.colors.secondary }]}
                        onPress={() => navigation.navigate('CategorySelection', { targetGame: isTrivia ? 'trivia' : 'charadas' })}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="refresh" size={20} color="#2D3043" style={{ marginRight: 10 }} />
                        <AppText style={styles.btnPrimaryText}>JUGAR OTRA VEZ</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.btnOutline]}
                        onPress={() => navigation.navigate('Home')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="home" size={20} color="#636477" style={{ marginRight: 10 }} />
                        <AppText style={styles.btnOutlineText}>VOLVER AL INICIO</AppText>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inner: {
        width: '100%',
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    finishedLabel: {
        fontSize: 12,
        color: "#636477",
        letterSpacing: 4,
        textTransform: 'uppercase',
        marginBottom: 40,
        fontWeight: '800'
    },
    scoreCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        shadowColor: "#3E4C45",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    },
    scoreValue: {
        fontSize: 72,
        fontWeight: '900',
        color: "#2D3043",
        lineHeight: 80,
    },
    scoreDivider: {
        width: 40,
        height: 2,
        backgroundColor: "rgba(255,255,255,0.48)",
        marginVertical: 4,
    },
    scoreTotal: {
        fontSize: 24,
        color: "#636477",
        fontWeight: '700',
    },
    scoreLabel: {
        fontSize: 11,
        fontWeight: '900',
        marginTop: 5,
        letterSpacing: 1
    },
    rewardsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40,
        height: 50,
        alignItems: 'center'
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.82)"
    },
    rewardValue: {
        color: "#2D3043",
        fontSize: 16,
        fontWeight: '900',
    },
    rewardBadgePremium: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: "#68A877",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    badgeGlow: {
        ...StyleSheet.absoluteFill,
        opacity: 0.9,
    },
    rewardValuePremium: {
        color: "#2D3043",
        fontSize: 18,
        fontWeight: '900',
        zIndex: 1,
    },
    actions: {
        width: '100%',
        gap: 12,
    },
    btn: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPrimary: {
        backgroundColor: '#fff',
    },
    btnPrimaryText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },
    btnSecondary: {
        backgroundColor: "rgba(255,255,255,0.48)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.82)",
    },
    btnSecondaryText: {
        color: "#2D3043",
        fontSize: 18,
        fontWeight: '800',
    },
    btnOutline: {
        height: 50,
    },
    btnOutlineText: {
        color: "#636477",
        fontSize: 14,
        fontWeight: '700',
    },
});

import React, { useRef, useState } from 'react';
import { View, StyleSheet, BackHandler, Animated, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AppText } from '../components';
import { Confetti } from '../components/Confetti';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { calculateCharadasRewards } from '../lib/gamification/pointsSystem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSound } from '../context/SoundContext';


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
        duration = 60,           // Duración de la partida en segundos
        sessionId = null,        // ID único de sesión (idempotency key)
    } = route.params || {};

    const rewards = calculateCharadasRewards(score, total, canEarnTrophies, duration);
    const { playSound, playHaptic } = useSound();

    // ─── ANTI-DOBLE SUBMIT ───────────────────────────────────────────
    // Garantiza que submitRanking() se ejecute exactamente UNA VEZ,
    // incluso si el usuario navega fuera y regresa a la pantalla.
    const hasSubmitted = useRef(false);

    // Confetti state
    const [showConfetti, setShowConfetti] = useState(false);

    // Animated values
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
                navigation.popToTop();
                return true;
            };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // ✅ FIX BUG #1: Submit solo una vez, aunque el usuario navegue fuera y vuelva
            if (!hasSubmitted.current) {
                hasSubmitted.current = true;
                submitRanking();
            }

            // Entrance animation
            Animated.parallel([
                Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(scaleIn, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
            ]).start();

            // Victory moment: sound + haptic + confetti if accuracy >= 50%
            const accuracy = total > 0 ? score / total : 0;
            if (accuracy >= 0.5) {
                setTimeout(() => {
                    playSound('win');
                    playHaptic('victory');
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }, 600);
            }
            // Animated score counter
            scoreAnim.addListener(({ value }) => setDisplayScore(Math.round(value)));
            Animated.timing(scoreAnim, {
                toValue: score,
                duration: 1000,
                delay: 400,
                useNativeDriver: false,
            }).start();

            // Delayed XP counter + badge pop
            setTimeout(() => {
                setShowRewards(true);
                xpAnim.addListener(({ value }) => setDisplayXP(Math.round(value)));
                Animated.timing(xpAnim, {
                    toValue: rewards.xp,
                    duration: 800,
                    useNativeDriver: false,
                }).start();

                Animated.spring(xpBadgeScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
                setTimeout(() => {
                    Animated.spring(trophyBadgeScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
                }, 200);
            }, 1200);

            return () => {
                subscription.remove();
                scoreAnim.removeAllListeners();
                xpAnim.removeAllListeners();
            };
        }, [])
    );

    const submitRanking = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // ✅ FIX BUG #3: Validar que los IDs de playingMembers existan en la DB
            const candidateIds: string[] = playingMembers.length > 0 ? playingMembers : [user.id];

            const { data: validUsers } = await supabase
                .from('users')
                .select('id')
                .in('id', candidateIds);

            const usersToAward: string[] = validUsers?.map((u: { id: string }) => u.id) ?? [user.id];
            if (usersToAward.length === 0) return;

            // ✅ Log del evento (audit trail)
            const gameSessionId = sessionId || `charadas_${user.id}_${Date.now()}`;

            const eventPayloads = usersToAward.map((uid: string) => ({
                user_id: uid,
                event_type: 'CHARADAS',
                session_id: gameSessionId,
                description: `Charadas: ${category || 'Clásico'} — ${score}/${total}`,
                points_awarded: rewards.xp,
                trophies_awarded: rewards.trophies,
            }));

            await supabase.from('events').insert(eventPayloads);

            // ✅ FIX BUG #2: Usar RPC atómica para evitar race conditions
            // Si la RPC no existe en tu Supabase aún, cae al fallback con Read-Write
            for (const uid of usersToAward) {
                const { error: rpcError } = await supabase.rpc('increment_user_rewards', {
                    p_user_id: uid,
                    p_xp: rewards.xp,
                    p_trophies: rewards.trophies,
                });

                // Fallback si la RPC no está creada aún
                if (rpcError) {
                    const { data: targetUser } = await supabase
                        .from('users')
                        .select('total_xp, total_trophies')
                        .eq('id', uid)
                        .single();
                    if (targetUser) {
                        await supabase.from('users').update({
                            total_xp: (targetUser.total_xp || 0) + rewards.xp,
                            total_trophies: (targetUser.total_trophies || 0) + rewards.trophies,
                        }).eq('id', uid);
                    }
                }
            }
        } catch (err) {
            console.log('Ranking submission skipped:', err);
        }
    };

    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    const isExcellent = accuracy >= 80;
    const isGood = accuracy >= 50 && accuracy < 80;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Confetti celebration */}
            <Confetti visible={showConfetti} duration={2800} />
            {/* Background glow */}
            <View style={[styles.bgGlow, { backgroundColor: isExcellent ? '#D4AF37' : isGood ? '#3498db' : '#e74c3c' }]} />

            <Animated.View style={[styles.inner, { opacity: fadeIn, transform: [{ scale: scaleIn }] }]}>

                {/* Header */}
                <AppText style={styles.finishedLabel}>RESULTADO</AppText>

                {/* Score circle */}
                <View style={[styles.scoreCircle, {
                    borderColor: isExcellent ? '#D4AF37' : isGood ? '#3498db' : '#e74c3c',
                    shadowColor: isExcellent ? '#D4AF37' : isGood ? '#3498db' : '#e74c3c',
                }]}>
                    <AppText style={styles.scoreValue}>{displayScore}</AppText>
                    <View style={styles.scoreDivider} />
                    <AppText style={styles.scoreTotal}>{total}</AppText>
                    <AppText style={styles.scoreLabel}>PALABRAS</AppText>
                </View>

                {/* Accuracy line */}
                <AppText style={[styles.accuracyText, {
                    color: isExcellent ? '#D4AF37' : isGood ? '#3498db' : '#e74c3c'
                }]}>
                    {isExcellent ? '¡EXCELENTE!' : isGood ? '¡BIEN HECHO!' : 'SIGUE PRACTICANDO'}
                </AppText>

                {/* Rewards row */}
                {showRewards && (
                    <View style={styles.rewardsRow}>
                        <Animated.View style={[styles.rewardBadge, styles.xpBadge, { transform: [{ scale: xpBadgeScale }] }]}>
                            <Ionicons name="flash" size={18} color="#D4AF37" />
                            <AppText style={styles.rewardValue}>+{displayXP}</AppText>
                            <AppText style={styles.rewardLabel}>XP</AppText>
                        </Animated.View>

                        {rewards.trophies > 0 && (
                            <Animated.View style={[styles.rewardBadge, styles.trophyBadge, { transform: [{ scale: trophyBadgeScale }] }]}>
                                <Ionicons name="trophy" size={18} color="#D4AF37" />
                                <AppText style={styles.rewardValue}>+{rewards.trophies}</AppText>
                                <AppText style={styles.rewardLabel}>TROFEOS</AppText>
                            </Animated.View>
                        )}

                        {!canEarnTrophies && (
                            <View style={styles.noTrophyNote}>
                                <Ionicons name="information-circle" size={14} color="#888" />
                                <AppText style={styles.noTrophyText}>Sin trofeos — completa tu misión semanal</AppText>
                            </View>
                        )}
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    {videoUri && (
                        <TouchableOpacity
                            style={[styles.btn, styles.btnSecondary]}
                            onPress={() => navigation.navigate('VideoReview', { videoUri, category, score, total, wordHistory })}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="videocam" size={18} color="#fff" style={{ marginRight: 8 }} />
                            <AppText style={styles.btnSecondaryText}>Ver video</AppText>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.btn, styles.btnPrimary]}
                        onPress={() => navigation.navigate('CategorySelection')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="refresh" size={18} color="#000" style={{ marginRight: 8 }} />
                        <AppText style={styles.btnPrimaryText}>JUGAR OTRA VEZ</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.btnOutline]}
                        onPress={() => navigation.popToTop()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="home" size={18} color="#aaa" style={{ marginRight: 8 }} />
                        <AppText style={styles.btnOutlineText}>INICIO</AppText>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgGlow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        top: -100,
        opacity: 0.06,
        alignSelf: 'center',
    },
    inner: {
        width: '100%',
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    finishedLabel: {
        fontSize: 11,
        color: '#666',
        letterSpacing: 4,
        textTransform: 'uppercase',
        marginBottom: 30,
    },
    scoreCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    scoreValue: {
        fontSize: 62,
        fontWeight: '900',
        color: '#fff',
        lineHeight: 70,
        includeFontPadding: false,
    },
    scoreDivider: {
        width: 40,
        height: 1,
        backgroundColor: '#333',
        marginVertical: 4,
    },
    scoreTotal: {
        fontSize: 20,
        color: '#888',
        fontWeight: '300',
    },
    scoreLabel: {
        fontSize: 10,
        color: '#555',
        letterSpacing: 2,
        marginTop: 2,
    },
    accuracyText: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 3,
        marginBottom: 28,
    },
    rewardsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 36,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 30,
        gap: 6,
    },
    xpBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
    },
    trophyBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    rewardValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
    },
    rewardLabel: {
        fontSize: 10,
        color: '#D4AF37',
        letterSpacing: 1,
        fontWeight: '600',
    },
    noTrophyNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
    },
    noTrophyText: {
        fontSize: 11,
        color: '#666',
        flex: 1,
    },
    actions: {
        width: '100%',
        gap: 12,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        width: '100%',
    },
    btnPrimary: {
        backgroundColor: '#D4AF37',
    },
    btnPrimaryText: {
        color: '#000',
        fontWeight: '700',
        letterSpacing: 2,
        fontSize: 14,
    },
    btnSecondary: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    btnSecondaryText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    btnOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#222',
    },
    btnOutlineText: {
        color: '#aaa',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 2,
    },
});

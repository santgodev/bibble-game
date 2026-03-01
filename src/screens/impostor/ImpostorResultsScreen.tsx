import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Animated } from 'react-native';
import { AppText } from '../../components';
import { Confetti } from '../../components/Confetti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { supabase } from '../../lib/supabase';
import { calculateImpostorRewards } from '../../lib/gamification/pointsSystem';
import { useSound } from '../../context/SoundContext';

// ─── Types ────────────────────────────────────────────────
type FeedbackType = 'accusation' | 'hit' | 'miss' | 'impostorWin' | null;
interface FeedbackState {
    type: FeedbackType;
    title: string;
    subtitle: string;
    body: string;
    accentColor: string;
    icon: string;
}

// ─── Premium Feedback Modal ───────────────────────────────
const FeedbackModal = ({
    visible, feedback, onClose,
}: { visible: boolean; feedback: FeedbackState; onClose: () => void }) => {
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        } else {
            scaleAnim.setValue(0.85);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    if (!visible || !feedback.type) return null;

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
            <View style={fm.overlay}>
                <Animated.View style={[fm.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
                    {/* Glow halo */}
                    <View style={[fm.halo, { backgroundColor: feedback.accentColor + '18' }]} />

                    {/* Icon circle */}
                    <View style={[fm.iconCircle, { borderColor: feedback.accentColor + '50', backgroundColor: feedback.accentColor + '15' }]}>
                        <Ionicons name={feedback.icon as any} size={44} color={feedback.accentColor} />
                    </View>

                    <AppText style={[fm.title, { color: feedback.accentColor }]}>{feedback.title}</AppText>
                    <AppText style={fm.subtitle}>{feedback.subtitle}</AppText>
                    <AppText style={fm.body}>{feedback.body}</AppText>

                    <TouchableOpacity style={[fm.btn, { backgroundColor: feedback.accentColor }]} onPress={onClose} activeOpacity={0.85}>
                        <AppText style={fm.btnText}>
                            {feedback.type === 'hit' ? 'CONTINUAR VOTANDO →' : feedback.type === 'miss' ? 'SEGUIR JUGANDO →' : 'ENTENDIDO'}
                        </AppText>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const fm = StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.88)',
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#0E0E1C', borderRadius: 28, padding: 28,
        width: '100%', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5, shadowRadius: 30, elevation: 20,
    },
    halo: {
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 120, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    },
    iconCircle: {
        width: 90, height: 90, borderRadius: 45,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, marginBottom: 18,
    },
    title: { fontSize: 26, fontWeight: '900', marginBottom: 6, textAlign: 'center', letterSpacing: 0.5 },
    subtitle: { color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
    body: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
    btn: {
        borderRadius: 16, paddingVertical: 14, paddingHorizontal: 30,
        width: '100%', alignItems: 'center',
    },
    btnText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
});

// ─── Accusation Confirm Modal ─────────────────────────────
const AccuseModal = ({ visible, playerName, onConfirm, onCancel }: any) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    React.useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: true }).start();
        } else {
            scaleAnim.setValue(0.9);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={am.overlay}>
                <Animated.View style={[am.card, { transform: [{ scale: scaleAnim }] }]}>
                    <LinearGradient colors={['rgba(231,76,60,0.1)', 'transparent']} style={am.banner} />
                    <View style={am.warningIcon}>
                        <Ionicons name="warning" size={40} color="#e74c3c" />
                    </View>
                    <AppText style={am.title}>Acusación Final</AppText>
                    <AppText style={am.body}>
                        ¿Todo el grupo acusa oficialmente a{' '}
                        <AppText style={{ color: '#e74c3c', fontWeight: '900' }}>{playerName}</AppText>?{'\n'}
                        Esta decisión es irreversible.
                    </AppText>
                    <View style={am.actions}>
                        <TouchableOpacity style={am.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
                            <AppText style={am.cancelText}>Cancelar</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={am.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
                            <Ionicons name="hand-right" size={16} color="#fff" style={{ marginRight: 6 }} />
                            <AppText style={am.confirmText}>¡ACUSAR!</AppText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const am = StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#0E0E1C', borderRadius: 28, padding: 28,
        width: '100%', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    banner: { position: 'absolute', top: 0, left: 0, right: 0, height: 100 },
    warningIcon: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(231,76,60,0.1)',
        borderWidth: 1, borderColor: 'rgba(231,76,60,0.3)',
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    },
    title: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 12 },
    body: { color: '#999', fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 28 },
    actions: { flexDirection: 'row', gap: 12, width: '100%' },
    cancelBtn: {
        flex: 1, paddingVertical: 16, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    cancelText: { color: '#666', fontWeight: '700', fontSize: 14 },
    confirmBtn: {
        flex: 1, paddingVertical: 16, borderRadius: 14,
        backgroundColor: '#e74c3c', alignItems: 'center',
        flexDirection: 'row', justifyContent: 'center',
    },
    confirmText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
});

// ─── Main Screen ──────────────────────────────────────────
export const ImpostorResultsScreen = ({ navigation, route }: any) => {
    const { impostorList, secretWord, secretCategory, players, playerDetails } = route.params;

    const [revealed, setRevealed] = useState(false);
    const [xpRewarded, setXPRewarded] = useState(false);
    const [citizensWon, setCitizensWon] = useState(false);
    const [rewardSummary, setRewardSummary] = useState<{ name: string; xp: number; trophies: number; won: boolean }[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);

    const { playSound, playHaptic } = useSound();
    const rewardBadgeScale = useRef(new Animated.Value(0)).current;

    const [accuseModalVisible, setAccuseModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState({ index: -1, name: '' });
    const [caughtImpostors, setCaughtImpostors] = useState<number[]>([]);
    const [eliminatedInnocents, setEliminatedInnocents] = useState<number[]>([]);

    // Premium feedback modal state
    const [feedback, setFeedback] = useState<FeedbackState>({
        type: null, title: '', subtitle: '', body: '', accentColor: '#fff', icon: 'checkmark',
    });
    const [feedbackVisible, setFeedbackVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    const showFeedback = (state: FeedbackState) => {
        setFeedback(state);
        setFeedbackVisible(true);
    };

    const handlePlayerVote = (playerIndex: number, playerName: string) => {
        if (caughtImpostors.includes(playerIndex) || eliminatedInnocents.includes(playerIndex)) return;
        setSelectedPlayer({ index: playerIndex, name: playerName });
        setAccuseModalVisible(true);
    };

    const confirmVote = () => {
        setAccuseModalVisible(false);
        const accusedIndex = selectedPlayer.index;
        const isImpostor = impostorList.includes(accusedIndex);

        if (isImpostor) {
            const newCaught = [...caughtImpostors, accusedIndex];
            setCaughtImpostors(newCaught);
            const remaining = impostorList.length - newCaught.length;

            if (remaining === 0) {
                setCitizensWon(true);
                setRevealed(true);
                setTimeout(() => {
                    playSound('win');
                    playHaptic('victory');
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3500);
                }, 400);
            } else {
                playHaptic('victory');
                showFeedback({
                    type: 'hit',
                    title: '¡IMPOSTOR ATRAPADO!',
                    subtitle: `${selectedPlayer.name} era un espía`,
                    body: `¡Bien jugado! Pero cuidado, aún ${remaining === 1 ? 'queda 1 impostor' : `quedan ${remaining} impostores`} oculto${remaining !== 1 ? 's' : ''} entre el grupo. ¡Sigan votando!`,
                    accentColor: '#2ecc71',
                    icon: 'checkmark-circle',
                });
            }
        } else {
            const newEliminated = [...eliminatedInnocents, accusedIndex];
            setEliminatedInnocents(newEliminated);

            const totalInnocents = players - impostorList.length;
            const remainingInnocents = totalInnocents - newEliminated.length;
            const remainingImpostors = impostorList.length - caughtImpostors.length;

            if (remainingInnocents <= remainingImpostors) {
                setCitizensWon(false);
                setRevealed(true);
                setTimeout(() => playHaptic('impact'), 300);
            } else {
                playHaptic('impact');
                showFeedback({
                    type: 'miss',
                    title: '¡ERROR FATAL!',
                    subtitle: `${selectedPlayer.name} era inocente`,
                    body: `Acaban de eliminar a un ciudadano. Quedan ${remainingInnocents - 1} inocentes vivos. ¡Piensen bien el siguiente voto antes de hablar!`,
                    accentColor: '#e74c3c',
                    icon: 'close-circle',
                });
            }
        }
    };

    const handleGiveRewards = async () => {
        if (!playerDetails) return;
        setXPRewarded(true);

        const rewards = calculateImpostorRewards(playerDetails, impostorList, citizensWon);
        const summary: { name: string; xp: number; trophies: number; won: boolean }[] = [];

        for (const reward of rewards) {
            const player = playerDetails.find((p: any) => p.id === reward.userId);
            if (!player) continue;
            summary.push({ name: player.username, xp: reward.xp, trophies: reward.trophies, won: reward.won });

            try {
                await supabase.from('events').insert({
                    user_id: reward.userId,
                    event_type: reward.won ? 'IMPOSTOR_WIN' : 'IMPOSTOR_PLAY',
                    description: reward.won ? 'Victoria en El Impostor' : 'Partida de El Impostor',
                    xp: reward.xp,
                });

                const { data: userData } = await supabase
                    .from('users').select('total_xp, total_trophies').eq('id', reward.userId).single();

                if (userData) {
                    await supabase.from('users').update({
                        total_xp: (userData.total_xp || 0) + reward.xp,
                        total_trophies: (userData.total_trophies || 0) + reward.trophies,
                    }).eq('id', reward.userId);
                }
            } catch (err) {
                console.error('Error awarding points to', reward.userId, err);
            }
        }

        setRewardSummary(summary);
        Animated.spring(rewardBadgeScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    };

    return (
        <View style={styles.container}>
            <Confetti visible={showConfetti} duration={3500} />

            {/* Premium Feedback Overlay */}
            <FeedbackModal
                visible={feedbackVisible}
                feedback={feedback}
                onClose={() => setFeedbackVisible(false)}
            />

            {/* Accusation Confirm Modal */}
            <AccuseModal
                visible={accuseModalVisible}
                playerName={selectedPlayer.name}
                onConfirm={confirmVote}
                onCancel={() => setAccuseModalVisible(false)}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.iconBtn}>
                    <Ionicons name="close" size={26} color="#FFF" />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>VOTACIÓN</AppText>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="help-circle-outline" size={26} color="#aaa" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {!revealed ? (
                    /* ─── Voting Phase ─── */
                    <View style={styles.votingContainer}>
                        <LinearGradient colors={['rgba(94,22,181,0.2)', 'transparent']} style={styles.votingBanner}>
                            <View style={styles.ballotIconWrapper}>
                                <Ionicons name="finger-print" size={40} color="#5e16b5" />
                            </View>
                        </LinearGradient>

                        <AppText style={styles.title}>¿Quién es el Impostor?</AppText>
                        <AppText style={styles.subtitle}>
                            Discutan y toca el jugador que deseen acusar.
                        </AppText>

                        {/* Player grid */}
                        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
                            {Array.from({ length: players }).map((_, index) => {
                                const player = playerDetails ? playerDetails[index] : { username: `Jugador ${index + 1}` };
                                const isCaught = caughtImpostors.includes(index);
                                const isEliminated = eliminatedInnocents.includes(index);
                                const isDisabled = isCaught || isEliminated;

                                const avatarUri = `https://api.dicebear.com/7.x/bottts/png?seed=${player.username || index}`;

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.playerCard,
                                            isCaught && styles.playerCardSuccess,
                                            isEliminated && styles.playerCardDanger,
                                            isDisabled && { opacity: 0.5 },
                                        ]}
                                        onPress={() => !isDisabled && handlePlayerVote(index, player.username)}
                                        activeOpacity={isDisabled ? 1 : 0.8}
                                    >
                                        {isCaught && (
                                            <View style={styles.playerBadge}>
                                                <Ionicons name="checkmark" size={12} color="#000" />
                                            </View>
                                        )}
                                        {isEliminated && (
                                            <View style={[styles.playerBadge, { backgroundColor: '#e74c3c' }]}>
                                                <Ionicons name="close" size={12} color="#fff" />
                                            </View>
                                        )}
                                        <Image source={{ uri: avatarUri }} style={styles.playerAvatar} />
                                        <AppText style={styles.playerName} numberOfLines={1}>{player.username}</AppText>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.footerArea}>
                            <TouchableOpacity style={styles.backDiscussBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
                                <Ionicons name="arrow-back" size={18} color="#fff" style={{ marginRight: 8 }} />
                                <AppText style={styles.backDiscussText}>Volver a Debate</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    /* ─── Results Phase ─── */
                    <ScrollView contentContainerStyle={styles.resultsScroll} showsVerticalScrollIndicator={false}>
                        {/* Win banner */}
                        <LinearGradient
                            colors={citizensWon
                                ? ['rgba(46,204,113,0.15)', 'transparent']
                                : ['rgba(231,76,60,0.15)', 'transparent']}
                            style={styles.winBanner}
                        >
                            <Ionicons
                                name={citizensWon ? 'shield-checkmark' : 'glasses'}
                                size={72}
                                color={citizensWon ? '#2ecc71' : '#e74c3c'}
                                style={{ marginBottom: 10 }}
                            />
                            <AppText style={citizensWon ? styles.winTitleCit : styles.winTitleImp}>
                                {citizensWon ? '¡VICTORIA CIUDADANA!' : '¡VICTORIA DEL IMPOSTOR!'}
                            </AppText>
                            <AppText style={styles.winSub}>
                                {citizensWon ? 'Atraparon al espía' : 'Logró engañar a todos'}
                            </AppText>
                        </LinearGradient>

                        {/* Secret word */}
                        <View style={styles.wordBox}>
                            <AppText style={styles.resultBadge}>PALABRA SECRETA</AppText>
                            <AppText style={styles.wordValue} numberOfLines={3}>{secretWord}</AppText>
                            <AppText style={styles.catValue}>{secretCategory}</AppText>
                        </View>

                        {/* Impostors revealed */}
                        <View style={styles.impostorsBox}>
                            <AppText style={[styles.resultBadge, { color: '#e74c3c' }]}>
                                {impostorList.length > 1 ? 'IMPOSTORES' : 'IMPOSTOR'}
                            </AppText>
                            {impostorList.map((imp: number, index: number) => {
                                const impName = playerDetails ? playerDetails[imp].username : `Jugador ${imp + 1}`;
                                const impAvatar = `https://api.dicebear.com/7.x/bottts/png?seed=${impName}`;
                                return (
                                    <View key={index} style={styles.impItem}>
                                        <Image source={{ uri: impAvatar }} style={styles.resultAvatar} />
                                        <AppText style={styles.impName}>{impName}</AppText>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Rewards section */}
                        {!xpRewarded ? (
                            <TouchableOpacity style={styles.rewardBtn} onPress={handleGiveRewards} activeOpacity={0.85}>
                                <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.rewardBtnInner}>
                                    <Ionicons name="gift" size={22} color="#000" style={{ marginRight: 10 }} />
                                    <AppText style={styles.rewardBtnText}>DAR RECOMPENSAS</AppText>
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : (
                            <Animated.View style={[styles.rewardSuccess, { transform: [{ scale: rewardBadgeScale }] }]}>
                                <Ionicons name="checkmark-circle" size={22} color="#2ecc71" style={{ marginRight: 8 }} />
                                <AppText style={styles.rewardSuccessText}>¡Recompensas Entregadas!</AppText>
                            </Animated.View>
                        )}

                        {/* Per-player reward summary */}
                        {xpRewarded && rewardSummary.length > 0 && (
                            <View style={styles.rewardSummary}>
                                {rewardSummary.map((r, i) => (
                                    <View key={i} style={styles.rewardSummaryRow}>
                                        <Ionicons name={r.won ? 'trophy' : 'person'} size={14}
                                            color={r.won ? '#D4AF37' : '#555'} style={{ marginRight: 8 }} />
                                        <AppText style={styles.rewardSummaryName} numberOfLines={1}>{r.name}</AppText>
                                        <AppText style={[styles.rewardSummaryXP, r.won && { color: '#D4AF37' }]}>+{r.xp} XP</AppText>
                                        {r.trophies > 0 && (
                                            <AppText style={styles.rewardSummaryTrophies}>+{r.trophies} 🏆</AppText>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={{ height: 24 }} />

                        <TouchableOpacity
                            style={styles.playAgainBtn}
                            onPress={() => navigation.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'ImpostorConfig' }] })}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 10 }} />
                            <AppText style={styles.playAgainBtnText}>Jugar de Nuevo</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.popToTop()} activeOpacity={0.85}>
                            <AppText style={[styles.playAgainBtnText, { color: '#888' }]}>← Inicio</AppText>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#06060E', paddingTop: 50 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, marginBottom: 10,
    },
    headerTitle: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
    iconBtn: {
        padding: 8, backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    content: { flex: 1 },

    // Voting Phase
    votingContainer: { flex: 1, alignItems: 'center' },
    votingBanner: { width: '100%', alignItems: 'center', paddingVertical: 20, marginBottom: 10 },
    ballotIconWrapper: {
        width: 80, height: 80, backgroundColor: 'rgba(94,22,181,0.15)',
        borderRadius: 24, justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(94,22,181,0.3)',
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: '900',
        marginBottom: 8,
        textAlign: 'center',
        lineHeight: 38,
        includeFontPadding: false,
        paddingTop: 4,
    },
    subtitle: { fontSize: 15, color: '#888', textAlign: 'center', paddingHorizontal: 30, marginBottom: 20, lineHeight: 22 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingHorizontal: 16, paddingBottom: 20 },
    playerCard: {
        width: '44%', aspectRatio: 1, backgroundColor: '#0E0E1C',
        borderRadius: 20, justifyContent: 'center', alignItems: 'center',
        padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', position: 'relative',
    },
    playerCardSuccess: { borderColor: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.08)' },
    playerCardDanger: { borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.06)' },
    playerBadge: {
        position: 'absolute', top: 8, right: 8,
        width: 20, height: 20, borderRadius: 10,
        backgroundColor: '#2ecc71', alignItems: 'center', justifyContent: 'center',
    },
    playerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#1a1a2e', marginBottom: 10 },
    playerName: { color: '#fff', fontSize: 14, fontWeight: '800', textAlign: 'center' },
    footerArea: { paddingHorizontal: 20, paddingVertical: 16, width: '100%' },
    backDiscussBtn: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)',
        paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
        width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    backDiscussText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    // Results Phase
    resultsScroll: { width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 40 },
    winBanner: { width: '100%', marginBottom: 24, alignItems: 'center', paddingVertical: 24, borderRadius: 24 },
    winTitleCit: {
        fontSize: 24, fontWeight: '900', color: '#2ecc71', textAlign: 'center',
        marginBottom: 4, lineHeight: 34, includeFontPadding: false,
    },
    winTitleImp: {
        fontSize: 24, fontWeight: '900', color: '#e74c3c', textAlign: 'center',
        marginBottom: 4, lineHeight: 34, includeFontPadding: false,
    },
    winSub: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22 },
    resultBadge: { fontSize: 11, fontWeight: '800', color: '#2ecc71', letterSpacing: 2, marginBottom: 8, opacity: 0.8 },
    wordBox: {
        backgroundColor: 'rgba(46,204,113,0.07)', borderWidth: 1, borderColor: 'rgba(46,204,113,0.25)',
        borderRadius: 20, paddingTop: 18, paddingBottom: 18, paddingHorizontal: 20,
        width: '100%', alignItems: 'center', marginBottom: 16,
    },
    wordValue: {
        fontSize: 30,
        fontWeight: '900',
        color: '#2ecc71',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 4,
        lineHeight: 42,
        includeFontPadding: false,
        paddingTop: 2,
        flexShrink: 1,
        width: '100%',
    },
    catValue: { fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
    impostorsBox: {
        backgroundColor: 'rgba(231,76,60,0.07)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.25)',
        borderRadius: 20, padding: 16, width: '100%', alignItems: 'center', gap: 12, marginBottom: 20,
    },
    impItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    resultAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1a1a2e', borderWidth: 2, borderColor: '#fff' },
    impName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        lineHeight: 34,
        includeFontPadding: false,
    },
    rewardBtn: { width: '100%', borderRadius: 18, overflow: 'hidden', marginBottom: 14 },
    rewardBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
    rewardBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
    rewardSuccess: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(46,204,113,0.08)', borderColor: 'rgba(46,204,113,0.3)',
        borderWidth: 1, borderRadius: 16, padding: 18, width: '100%', marginBottom: 14,
    },
    rewardSuccessText: { color: '#2ecc71', fontSize: 15, fontWeight: '800' },
    rewardSummary: {
        width: '100%', marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', overflow: 'hidden',
    },
    rewardSummaryRow: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    rewardSummaryName: { flex: 1, color: '#ccc', fontSize: 14 },
    rewardSummaryXP: { color: '#888', fontSize: 13, fontWeight: '700', marginRight: 8 },
    rewardSummaryTrophies: { color: '#D4AF37', fontSize: 13, fontWeight: '700' },
    playAgainBtn: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#5e16b5', paddingVertical: 18, borderRadius: 18,
        width: '100%', marginBottom: 10,
    },
    homeBtn: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'transparent', paddingVertical: 16,
        borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', width: '100%',
    },
    playAgainBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

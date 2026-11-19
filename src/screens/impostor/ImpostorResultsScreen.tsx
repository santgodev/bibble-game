import React, { useCallback, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { Confetti } from '../../components/Confetti';
import { supabase } from '../../lib/supabase';
import { calculateImpostorRewards } from '../../lib/gamification/pointsSystem';
import { useSound } from '../../context/SoundContext';
import { EditorialDoodle } from '../../trivia/components/EditorialDoodle';

type FeedbackType = 'accusation' | 'hit' | 'miss' | 'impostorWin' | null;
interface FeedbackState {
    type: FeedbackType;
    title: string;
    subtitle: string;
    body: string;
    bgColor: string;
    accentColor: string;
    icon: string;
}

const FeedbackModal = ({
    visible,
    feedback,
    onClose,
}: {
    visible: boolean;
    feedback: FeedbackState;
    onClose: () => void;
}) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 7,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    if (!visible || !feedback.type) return null;

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
            <View style={fm.overlay}>
                <Animated.View
                    style={[
                        fm.card,
                        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                    ]}
                >
                    <View style={[fm.iconCircle, { backgroundColor: feedback.bgColor }]}>
                        <Ionicons
                            name={feedback.icon as any}
                            size={34}
                            color={feedback.accentColor}
                        />
                    </View>

                    <AppText style={[fm.title, { color: '#1B1E23' }]}>
                        {feedback.title}
                    </AppText>
                    <AppText style={[fm.subtitle, { color: feedback.accentColor }]}>
                        {feedback.subtitle}
                    </AppText>
                    <AppText style={fm.body}>{feedback.body}</AppText>

                    <Pressable
                        style={({ pressed }) => [fm.btn, pressed && { opacity: 0.88 }]}
                        onPress={onClose}
                    >
                        <AppText style={fm.btnText}>
                            {feedback.type === 'hit' ? 'Seguir votando' : 'Continuar'}
                        </AppText>
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
};

const fm = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(27, 30, 35, 0.36)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 26,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    body: {
        color: '#5B6573',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 22,
    },
    btn: {
        borderRadius: 24,
        height: 50,
        width: '100%',
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 15,
    },
});

const AccuseModal = ({ visible, playerName, onConfirm, onCancel }: any) => {
    const scaleAnim = useRef(new Animated.Value(0.92)).current;
    React.useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 7,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0.92);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={am.overlay}>
                <Animated.View style={[am.card, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={am.warningIcon}>
                        <Ionicons name="hand-right-outline" size={30} color="#9E3A3A" />
                    </View>
                    <AppText style={am.title}>¿Acusar a {playerName}?</AppText>
                    <AppText style={am.body}>Esta decisión no se puede deshacer.</AppText>
                    <View style={am.actions}>
                        <Pressable
                            style={({ pressed }) => [am.cancelBtn, pressed && { opacity: 0.85 }]}
                            onPress={onCancel}
                        >
                            <AppText style={am.cancelText}>Cancelar</AppText>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [am.confirmBtn, pressed && { opacity: 0.85 }]}
                            onPress={onConfirm}
                        >
                            <AppText style={am.confirmText}>Acusar</AppText>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const am = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(27, 30, 35, 0.36)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 26,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    warningIcon: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#F7E6E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        color: '#1B1E23',
        fontSize: 21,
        fontWeight: '800',
        marginBottom: 6,
        textAlign: 'center',
    },
    body: {
        color: '#6E7785',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 22,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        color: '#1E3A5F',
        fontWeight: '700',
        fontSize: 14,
    },
    confirmBtn: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#C96A6A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
    },
});

export const ImpostorResultsScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const {
        impostorList,
        secretWord,
        secretCategory,
        players,
        playerDetails,
        sessionId: incomingSessionId,
        canEarnTrophies = true,
    } = route.params;

    const sessionId = incomingSessionId || `IMPOSTOR_${secretWord}_${Date.now()}`;
    const hasRewarded = React.useRef(false);

    const [revealed, setRevealed] = useState(false);
    const [xpRewarded, setXPRewarded] = useState(false);
    const [citizensWon, setCitizensWon] = useState(false);
    const [rewardSummary, setRewardSummary] = useState<
        { name: string; xp: number; trophies: number; won: boolean }[]
    >([]);
    const [showConfetti, setShowConfetti] = useState(false);

    const { playSound, playHaptic } = useSound();
    const rewardBadgeScale = useRef(new Animated.Value(0)).current;

    const [accuseModalVisible, setAccuseModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState({ index: -1, name: '' });
    const [caughtImpostors, setCaughtImpostors] = useState<number[]>(
        route.params.initialCaughtImpostors || []
    );
    const [eliminatedInnocents, setEliminatedInnocents] = useState<number[]>(
        route.params.initialEliminatedInnocents || []
    );

    const [feedback, setFeedback] = useState<FeedbackState>({
        type: null,
        title: '',
        subtitle: '',
        body: '',
        bgColor: '#DCECE8',
        accentColor: '#1E3A5F',
        icon: 'checkmark',
    });
    const [feedbackVisible, setFeedbackVisible] = useState(false);

    React.useEffect(() => {
        if (route.params?.initialCaughtImpostors) {
            setCaughtImpostors(route.params.initialCaughtImpostors);
        }
        if (route.params?.initialEliminatedInnocents) {
            setEliminatedInnocents(route.params.initialEliminatedInnocents);
        }
    }, [route.params?.initialCaughtImpostors, route.params?.initialEliminatedInnocents]);

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
        if (
            caughtImpostors.includes(playerIndex) ||
            eliminatedInnocents.includes(playerIndex)
        ) {
            return;
        }
        setSelectedPlayer({ index: playerIndex, name: playerName });
        setAccuseModalVisible(true);
    };

    const confirmVote = () => {
        setAccuseModalVisible(false);
        const accusedIndex = selectedPlayer.index;
        if (
            revealed ||
            accusedIndex < 0 ||
            caughtImpostors.includes(accusedIndex) ||
            eliminatedInnocents.includes(accusedIndex)
        ) {
            return;
        }

        const safeImpostorList: number[] = Array.isArray(impostorList) ? impostorList : [];
        const isImpostor = safeImpostorList.includes(accusedIndex);

        if (isImpostor) {
            const newCaught = [...caughtImpostors, accusedIndex];
            setCaughtImpostors(newCaught);
            const remainingImpostors = Math.max(0, safeImpostorList.length - newCaught.length);

            if (remainingImpostors === 0) {
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
                    title: '¡Impostor atrapado!',
                    subtitle: `${selectedPlayer.name} era impostor`,
                    body: `Aún ${
                        remainingImpostors === 1
                            ? 'queda 1 impostor oculto'
                            : `quedan ${remainingImpostors} impostores ocultos`
                    }. Sigan votando.`,
                    bgColor: '#DCECE8',
                    accentColor: '#3D8A7B',
                    icon: 'checkmark-circle',
                });
            }
        } else {
            const newEliminated = [...eliminatedInnocents, accusedIndex];
            setEliminatedInnocents(newEliminated);

            const totalInnocents = Math.max(0, players - safeImpostorList.length);
            const remainingInnocents = Math.max(0, totalInnocents - newEliminated.length);
            const remainingImpostors = Math.max(0, safeImpostorList.length - caughtImpostors.length);

            if (remainingInnocents <= remainingImpostors) {
                setCitizensWon(false);
                setRevealed(true);
                setTimeout(() => playHaptic('impact'), 300);
            } else {
                playHaptic('impact');
                showFeedback({
                    type: 'miss',
                    title: 'Era inocente',
                    subtitle: `${selectedPlayer.name} no era el impostor`,
                    body: `Quedan ${remainingInnocents} inocentes y ${remainingImpostors} ${
                        remainingImpostors === 1 ? 'impostor' : 'impostores'
                    } en juego.`,
                    bgColor: '#F7E6E6',
                    accentColor: '#9E3A3A',
                    icon: 'close-circle',
                });
            }
        }
    };

    const handleGiveRewards = async () => {
        if (!playerDetails) return;
        if (hasRewarded.current) return;
        hasRewarded.current = true;
        setXPRewarded(true);

        const { data: existing } = await supabase
            .from('events')
            .select('id')
            .eq('session_id', sessionId)
            .limit(1);

        if (existing && existing.length > 0) {
            const rewards = calculateImpostorRewards(
                playerDetails,
                impostorList,
                citizensWon,
                canEarnTrophies
            );
            const summary = rewards
                .map(r => {
                    const player = playerDetails.find((p: any) => p.id === r.userId);
                    return player
                        ? { name: player.username, xp: r.xp, trophies: r.trophies, won: r.won }
                        : null;
                })
                .filter(Boolean) as {
                name: string;
                xp: number;
                trophies: number;
                won: boolean;
            }[];
            setRewardSummary(summary);
            Animated.spring(rewardBadgeScale, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }).start();
            return;
        }

        const rewards = calculateImpostorRewards(
            playerDetails,
            impostorList,
            citizensWon,
            canEarnTrophies
        );
        const summary: { name: string; xp: number; trophies: number; won: boolean }[] = [];

        for (const reward of rewards) {
            const player = playerDetails.find((p: any) => p.id === reward.userId);
            if (!player) continue;
            summary.push({
                name: player.username,
                xp: reward.xp,
                trophies: reward.trophies,
                won: reward.won,
            });

            try {
                await supabase.from('events').insert({
                    user_id: reward.userId,
                    session_id: sessionId,
                    event_type: reward.won ? 'IMPOSTOR_WIN' : 'IMPOSTOR_PLAY',
                    description: `Impostor: ${secretWord} — ${reward.won ? 'victoria' : 'participación'}`,
                    xp: reward.xp,
                    trophies_awarded: reward.trophies,
                });

                const { error: rpcErr } = await supabase.rpc('increment_user_rewards', {
                    p_user_id: reward.userId,
                    p_xp: reward.xp,
                    p_trophies: reward.trophies,
                });

                if (rpcErr) {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('total_xp, total_trophies')
                        .eq('id', reward.userId)
                        .single();
                    if (userData) {
                        await supabase
                            .from('users')
                            .update({
                                total_xp: (userData.total_xp || 0) + reward.xp,
                                total_trophies: (userData.total_trophies || 0) + reward.trophies,
                            })
                            .eq('id', reward.userId);
                    }
                }
            } catch (err) {
                console.error('[Impostor] Error awarding points to', reward.userId, err);
            }
        }

        setRewardSummary(summary);
        Animated.spring(rewardBadgeScale, {
            toValue: 1,
            friction: 5,
            tension: 80,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <Confetti visible={showConfetti} duration={3500} />

            <FeedbackModal
                visible={feedbackVisible}
                feedback={feedback}
                onClose={() => setFeedbackVisible(false)}
            />

            <AccuseModal
                visible={accuseModalVisible}
                playerName={selectedPlayer.name}
                onConfirm={confirmVote}
                onCancel={() => setAccuseModalVisible(false)}
            />

            <View style={s.header}>
                <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => navigation.navigate('Home')}
                    style={s.iconBtn}
                >
                    <Ionicons name="close" size={20} color="#1B1E23" />
                </TouchableOpacity>
                <AppText style={s.headerTitle}>
                    {revealed ? 'RESULTADO' : 'VOTACIÓN'}
                </AppText>
                <View style={{ width: 38 }} />
            </View>

            {!revealed ? (
                <View style={s.votingContainer}>
                    <View style={s.votingTop}>
                        <EditorialDoodle kind="impostor" tint="#D6E8F8" size={60} />
                        <AppText style={s.title}>¿Quién es el impostor?</AppText>
                        <View style={s.statusPill}>
                            <AppText style={s.statusPillText}>
                                {Math.max(0, (Array.isArray(impostorList) ? impostorList.length : 0) - caughtImpostors.length)}{' '}
                                {Math.max(0, (Array.isArray(impostorList) ? impostorList.length : 0) - caughtImpostors.length) === 1
                                    ? 'impostor oculto'
                                    : 'impostores ocultos'}
                            </AppText>
                        </View>
                    </View>

                    <ScrollView
                        contentContainerStyle={s.grid}
                        showsVerticalScrollIndicator={false}
                    >
                        {Array.from({ length: players }).map((_, index) => {
                            const player = playerDetails
                                ? playerDetails[index]
                                : { username: `Jugador ${index + 1}` };
                            const isCaught = caughtImpostors.includes(index);
                            const isEliminated = eliminatedInnocents.includes(index);
                            const isDisabled = isCaught || isEliminated;
                            const initial = (player.username || 'J').trim().slice(0, 1).toUpperCase();

                            return (
                                <Pressable
                                    key={index}
                                    style={({ pressed }) => [
                                        s.playerCard,
                                        isCaught && s.playerCardSuccess,
                                        isEliminated && s.playerCardDanger,
                                        isDisabled && { opacity: 0.55 },
                                        pressed && !isDisabled && s.pressed,
                                    ]}
                                    onPress={() =>
                                        !isDisabled && handlePlayerVote(index, player.username)
                                    }
                                >
                                    {isCaught && (
                                        <View style={[s.playerBadge, { backgroundColor: '#1E3A5F' }]}>
                                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                                        </View>
                                    )}
                                    {isEliminated && (
                                        <View style={[s.playerBadge, { backgroundColor: '#C96A6A' }]}>
                                            <Ionicons name="close" size={12} color="#FFFFFF" />
                                        </View>
                                    )}
                                    <View style={s.playerAvatar}>
                                        <AppText style={s.playerAvatarText}>{initial}</AppText>
                                    </View>
                                    <AppText style={s.playerName} numberOfLines={1}>
                                        {player.username}
                                    </AppText>
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <View style={[s.footerArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                        <Pressable
                            style={({ pressed }) => [s.backDiscussBtn, pressed && s.pressed]}
                            onPress={() =>
                                navigation.navigate('ImpostorGame', {
                                    ...route.params,
                                    caughtImpostors,
                                    eliminatedInnocents,
                                })
                            }
                        >
                            <Ionicons name="arrow-back" size={17} color="#1E3A5F" />
                            <AppText style={s.backDiscussText}>Volver al debate</AppText>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={[s.resultsScroll, { paddingBottom: insets.bottom + 36 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <EditorialDoodle
                        kind={citizensWon ? 'trophy' : 'impostor'}
                        tint={citizensWon ? '#F5DA7C' : '#F7E6E6'}
                        size={88}
                    />
                    <AppText style={s.winTitle}>
                        {citizensWon ? '¡Ganaron los ciudadanos!' : '¡Ganó el impostor!'}
                    </AppText>

                    <View style={s.wordBox}>
                        <AppText style={s.resultBadge}>PALABRA SECRETA</AppText>
                        <AppText style={s.wordValue} numberOfLines={3}>
                            {secretWord}
                        </AppText>
                        <AppText style={s.catValue}>{secretCategory}</AppText>
                    </View>

                    <View style={s.impostorsBox}>
                        <AppText style={[s.resultBadge, { color: '#9E3A3A' }]}>
                            {impostorList.length > 1 ? 'IMPOSTORES' : 'IMPOSTOR'}
                        </AppText>
                        {impostorList.map((imp: number, index: number) => {
                            const impName = playerDetails
                                ? playerDetails[imp].username
                                : `Jugador ${imp + 1}`;
                            const impInitial = impName.trim().slice(0, 1).toUpperCase();
                            return (
                                <View key={index} style={s.impItem}>
                                    <View style={s.resultAvatar}>
                                        <AppText style={s.resultAvatarText}>{impInitial}</AppText>
                                    </View>
                                    <AppText style={s.impName}>{impName}</AppText>
                                </View>
                            );
                        })}
                    </View>

                    {!xpRewarded ? (
                        <Pressable
                            style={({ pressed }) => [s.rewardBtn, pressed && s.pressed]}
                            onPress={handleGiveRewards}
                        >
                            <Ionicons name="sparkles-outline" size={18} color="#1B1E23" />
                            <AppText style={s.rewardBtnText}>Entregar recompensas</AppText>
                        </Pressable>
                    ) : (
                        <Animated.View
                            style={[s.rewardSuccess, { transform: [{ scale: rewardBadgeScale }] }]}
                        >
                            <Ionicons name="checkmark-circle" size={18} color="#3D8A7B" />
                            <AppText style={s.rewardSuccessText}>Recompensas entregadas</AppText>
                        </Animated.View>
                    )}

                    {xpRewarded && rewardSummary.length > 0 && (
                        <View style={s.rewardSummary}>
                            {rewardSummary.map((r, i) => (
                                <View key={i} style={s.rewardSummaryRow}>
                                    <AppText style={s.rewardSummaryName} numberOfLines={1}>
                                        {r.name}
                                    </AppText>
                                    <AppText style={s.rewardSummaryXP}>+{r.xp} XP</AppText>
                                    {r.trophies > 0 && (
                                        <View style={s.trophyChip}>
                                            <Ionicons name="trophy" size={12} color="#6F5207" />
                                            <AppText style={s.trophyChipText}>+{r.trophies}</AppText>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={s.actions}>
                        <Pressable
                            style={({ pressed }) => [s.playAgainBtn, pressed && s.pressed]}
                            onPress={() =>
                                navigation.reset({
                                    index: 1,
                                    routes: [{ name: 'Home' }, { name: 'ImpostorConfig' }],
                                })
                            }
                        >
                            <AppText style={s.playAgainBtnText}>Jugar otra vez</AppText>
                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [s.homeBtn, pressed && s.pressed]}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <AppText style={s.homeBtnText}>Volver al inicio</AppText>
                        </Pressable>
                    </View>
                </ScrollView>
            )}
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
    headerTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        color: '#2B6CB0',
    },
    votingContainer: {
        flex: 1,
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
    },
    votingTop: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 6,
        marginBottom: 16,
        gap: 8,
    },
    title: {
        fontSize: 25,
        fontWeight: '800',
        color: '#1B1E23',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    statusPill: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
        backgroundColor: '#D6E8F8',
    },
    statusPillText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    playerCard: {
        width: '45%',
        maxWidth: 180,
        borderRadius: 24,
        padding: 16,
        backgroundColor: '#F6F8FA',
        alignItems: 'center',
        position: 'relative',
    },
    playerCardSuccess: {
        backgroundColor: '#DCECE8',
    },
    playerCardDanger: {
        backgroundColor: '#F7E6E6',
    },
    playerBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#D6E8F8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    playerAvatarText: {
        fontSize: 19,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    playerName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1B1E23',
    },
    footerArea: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backDiscussBtn: {
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F3F7F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    backDiscussText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E3A5F',
    },
    resultsScroll: {
        width: '100%',
        maxWidth: 520,
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingTop: 14,
        gap: 14,
    },
    winTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1B1E23',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    wordBox: {
        width: '100%',
        borderRadius: 26,
        padding: 20,
        backgroundColor: '#DCECE8',
        alignItems: 'center',
    },
    resultBadge: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#3D8A7B',
        marginBottom: 4,
    },
    wordValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1B1E23',
        textAlign: 'center',
    },
    catValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#3D8A7B',
        marginTop: 4,
    },
    impostorsBox: {
        width: '100%',
        borderRadius: 24,
        padding: 18,
        backgroundColor: '#F7E6E6',
        alignItems: 'center',
        gap: 10,
    },
    impItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    resultAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultAvatarText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#9E3A3A',
    },
    impName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1B1E23',
    },
    rewardBtn: {
        width: '100%',
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F5DA7C',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    rewardBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1B1E23',
    },
    rewardSuccess: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: '#DCECE8',
    },
    rewardSuccessText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1B1E23',
    },
    rewardSummary: {
        width: '100%',
        borderRadius: 22,
        padding: 16,
        backgroundColor: '#F6F8FA',
        gap: 8,
    },
    rewardSummaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rewardSummaryName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: '#1B1E23',
    },
    rewardSummaryXP: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    trophyChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        backgroundColor: '#F5DA7C',
    },
    trophyChipText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#6F5207',
    },
    actions: {
        width: '100%',
        gap: 10,
        marginTop: 6,
    },
    playAgainBtn: {
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    playAgainBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    homeBtn: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E3A5F',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
});

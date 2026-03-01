import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Animated, Alert } from 'react-native';
import { AppText } from '../../components';
import { Confetti } from '../../components/Confetti';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { supabase } from '../../lib/supabase';
import { calculateImpostorRewards } from '../../lib/gamification/pointsSystem';
import { useSound } from '../../context/SoundContext';

export const ImpostorResultsScreen = ({ navigation, route }: any) => {
    const { impostorList, secretWord, secretCategory, players, playerDetails } = route.params;

    const [revealed, setRevealed] = useState(false);
    const [xpRewarded, setXPRewarded] = useState(false);
    const [citizensWon, setCitizensWon] = useState(false);
    const [rewardSummary, setRewardSummary] = useState<{ name: string; xp: number; trophies: number; won: boolean }[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);

    const { playSound, playHaptic } = useSound();
    const rewardBadgeScale = useRef(new Animated.Value(0)).current;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState({ index: -1, name: '' });
    const [caughtImpostors, setCaughtImpostors] = useState<number[]>([]);
    const [eliminatedInnocents, setEliminatedInnocents] = useState<number[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    const handlePlayerVote = (playerIndex: number, playerName: string) => {
        if (caughtImpostors.includes(playerIndex) || eliminatedInnocents.includes(playerIndex)) return;
        setSelectedPlayer({ index: playerIndex, name: playerName });
        setModalVisible(true);
    };

    const confirmVote = () => {
        setModalVisible(false);
        const accusedIndex = selectedPlayer.index;
        const isImpostor = impostorList.includes(accusedIndex);

        if (isImpostor) {
            const newCaught = [...caughtImpostors, accusedIndex];
            setCaughtImpostors(newCaught);
            if (newCaught.length === impostorList.length) {
                // Todos los impostores atrapados
                setCitizensWon(true);
                setRevealed(true);
                setTimeout(() => {
                    playSound('win');
                    playHaptic('victory');
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }, 400);
            } else {
                playHaptic('victory');
                Alert.alert("¡Acierto! 🕵️‍♂️", `¡${selectedPlayer.name} ERA un impostor! Pero aún queda(n) ${impostorList.length - newCaught.length}... ¡sigan votando!`);
            }
        } else {
            const newEliminated = [...eliminatedInnocents, accusedIndex];
            setEliminatedInnocents(newEliminated);

            const totalInnocents = players - impostorList.length;
            const remainingInnocents = totalInnocents - newEliminated.length;
            const remainingImpostors = impostorList.length - caughtImpostors.length;

            if (remainingInnocents <= remainingImpostors) {
                // Los impostores ganan porque ya no hay suficientes ciudadanos
                setCitizensWon(false);
                setRevealed(true);
                setTimeout(() => playHaptic('impact'), 300);
            } else {
                playHaptic('impact');
                Alert.alert("¡Grave Error! ❌", `¡${selectedPlayer.name} NO era el impostor! Queda eliminado(a). Sigan jugando y voten de nuevo.`);
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
                // Insert event with correct schema
                await supabase.from('events').insert({
                    user_id: reward.userId,
                    event_type: reward.won ? 'IMPOSTOR_WIN' : 'IMPOSTOR_PLAY',
                    description: reward.won ? 'Victoria en El Impostor' : 'Partida de El Impostor',
                    xp: reward.xp,
                });

                // Update user XP and trophies
                const { data: userData } = await supabase
                    .from('users')
                    .select('total_xp, total_trophies')
                    .eq('id', reward.userId)
                    .single();

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

        // Animate badge in
        Animated.spring(rewardBadgeScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    };

    return (
        <View style={styles.container}>
            {/* Celebración confetti */}
            <Confetti visible={showConfetti} duration={3000} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.iconBtn}>
                    <Ionicons name="close" size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="help" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>

                {/* MODAL DE ACUSACION PREMIUM */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <View style={styles.modalIconBox}>
                                <Ionicons name="warning" size={40} color="#e74c3c" />
                            </View>
                            <AppText style={styles.modalTitle}>Acusación Final</AppText>
                            <AppText style={styles.modalText}>
                                ¿El grupo está seguro de acusar oficialmente a <AppText style={styles.modalHighlight}>{selectedPlayer.name}</AppText>?
                            </AppText>

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                                    <AppText style={styles.modalCancelText}>Cancelar</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalConfirm} onPress={confirmVote}>
                                    <AppText style={styles.modalConfirmText}>ACUSAR</AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {!revealed ? (
                    <View style={styles.votingContainer}>
                        <View style={styles.ballotIconWrapper}>
                            <Ionicons name="file-tray-full" size={50} color="#5e16b5" />
                        </View>

                        <AppText style={styles.title}>Votación</AppText>
                        <AppText style={styles.subtitle}>
                            Discutid en grupo y decidid a quién queréis eliminar.
                        </AppText>

                        <AppText style={styles.question}>
                            ¿Quién creen que es el Impostor?
                        </AppText>

                        <ScrollView contentContainerStyle={styles.grid}>
                            {Array.from({ length: players }).map((_, index) => {
                                const player = playerDetails ? playerDetails[index] : { username: `Jugador ${index + 1}` };
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.playerCard,
                                            caughtImpostors.includes(index) && { backgroundColor: '#2ecc71', opacity: 0.6 },
                                            eliminatedInnocents.includes(index) && { backgroundColor: '#e74c3c', opacity: 0.6 }
                                        ]}
                                        onPress={() => handlePlayerVote(index, player.username)}
                                    >
                                        <View style={styles.avatarPlaceholder}>
                                            <Ionicons name="person" size={40} color="#fff" />
                                        </View>
                                        <AppText style={styles.playerName} numberOfLines={1}>{player.username}</AppText>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.footerArea}>
                            <TouchableOpacity
                                style={styles.backDiscussBtn}
                                onPress={() => navigation.goBack()}
                            >
                                <AppText style={styles.backDiscussText}>Volver a Discusión</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.resultsScroll}>

                        <View style={styles.winBanner}>
                            {citizensWon ? (
                                <View style={{ alignItems: 'center' }}>
                                    <Ionicons name="shield-checkmark" size={80} color="#2ecc71" style={{ marginBottom: 10 }} />
                                    <AppText style={styles.winTitleCit}>¡VICTORIA CIUDADANA!</AppText>
                                    <AppText style={styles.winSub}>Atraparon al Impostor</AppText>
                                </View>
                            ) : (
                                <View style={{ alignItems: 'center' }}>
                                    <Ionicons name="glasses" size={80} color="#e74c3c" style={{ marginBottom: 10 }} />
                                    <AppText style={styles.winTitleImp}>¡Victoria del IMPOSTOR!</AppText>
                                    <AppText style={styles.winSub}>Logró engañar a todos</AppText>
                                </View>
                            )}
                        </View>

                        <View style={styles.wordBox}>
                            <AppText style={styles.resultBadge}>PALABRA SECRETA</AppText>
                            <AppText style={styles.wordValue} numberOfLines={2} adjustsFontSizeToFit>{secretWord}</AppText>
                            <AppText style={styles.catValue}>{secretCategory}</AppText>
                        </View>

                        <View style={styles.impostorsBox}>
                            <AppText style={[styles.resultBadge, { color: '#e74c3c' }]}>IMPOSTOR</AppText>
                            {impostorList.map((imp: number, index: number) => {
                                const impName = playerDetails ? playerDetails[imp].username : `Jugador ${imp + 1}`;
                                const impAvatar = playerDetails && playerDetails[imp].avatar ? playerDetails[imp].avatar : `https://api.dicebear.com/7.x/bottts/png?seed=${imp}`;
                                return (
                                    <View key={index} style={styles.impItem}>
                                        <Image source={{ uri: impAvatar }} style={styles.resultAvatar} />
                                        <AppText style={styles.impName}>{impName}</AppText>
                                    </View>
                                );
                            })}
                        </View>

                        {/* REWARDS SECTION */}
                        {!xpRewarded ? (
                            <TouchableOpacity style={styles.rewardBtn} onPress={handleGiveRewards}>
                                <Ionicons name="gift" size={24} color="#000" style={{ marginRight: 10 }} />
                                <AppText style={styles.rewardBtnText}>Dar Recompensas a Todos</AppText>
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
                                        <Ionicons
                                            name={r.won ? 'trophy' : 'person'}
                                            size={14}
                                            color={r.won ? '#D4AF37' : '#888'}
                                            style={{ marginRight: 6 }}
                                        />
                                        <AppText style={styles.rewardSummaryName} numberOfLines={1}>{r.name}</AppText>
                                        <AppText style={[styles.rewardSummaryXP, r.won && { color: '#D4AF37' }]}>+{r.xp} XP</AppText>
                                        {r.trophies > 0 && (
                                            <AppText style={styles.rewardSummaryTrophies}>+{r.trophies} 🏆</AppText>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={{ height: 20 }} />

                        <TouchableOpacity
                            style={styles.playAgainBtn}
                            onPress={() => navigation.reset({
                                index: 1,
                                routes: [{ name: 'Home' }, { name: 'ImpostorConfig' }],
                            })}
                        >
                            <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 10 }} />
                            <AppText style={styles.playAgainBtnText}>Jugar Otra Vez</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.popToTop()}>
                            <AppText style={styles.playAgainBtnText}>Inicio</AppText>
                        </TouchableOpacity>

                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a14',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10
    },
    iconBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20
    },
    content: {
        flex: 1,
        width: '100%',
    },
    votingContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    ballotIconWrapper: {
        width: 100,
        height: 100,
        backgroundColor: '#f1f2f6',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
        lineHeight: 40,
        includeFontPadding: false
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
        fontWeight: '600'
    },
    question: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 30,
        includeFontPadding: false
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        paddingBottom: 20
    },
    playerCard: {
        width: '45%',
        aspectRatio: 1, // Make it square
        backgroundColor: '#4a0e95', // color morado oscuro propio
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    avatarPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    playerName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    footerArea: {
        paddingVertical: 20,
        width: '100%',
    },
    backDiscussBtn: {
        backgroundColor: '#4a0e95',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#5e16b5'
    },
    backDiscussText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    // REVEALED STYLES
    resultsScroll: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    winBanner: {
        width: '100%',
        marginBottom: 30,
        alignItems: 'center'
    },
    winTitleCit: {
        fontSize: 30,
        fontWeight: '900',
        color: '#2ecc71',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 5,
        lineHeight: 40,
        includeFontPadding: false
    },
    winTitleImp: {
        fontSize: 30,
        fontWeight: '900',
        color: '#e74c3c', // Rojo para el impostor
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 5,
        lineHeight: 40,
        includeFontPadding: false
    },
    winSub: {
        color: '#ccc',
        fontSize: 18,
        marginTop: 5,
        lineHeight: 26,
        includeFontPadding: false
    },
    resultBadge: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2ecc71',
        letterSpacing: 2,
        marginBottom: 5,
        opacity: 0.8
    },
    impostorsBox: {
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderWidth: 1,
        borderColor: '#e74c3c',
        borderRadius: 20,
        padding: 15,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20
    },
    impItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    resultAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1E1E1E',
        borderWidth: 2,
        borderColor: '#fff'
    },
    impName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff'
    },
    wordBox: {
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderWidth: 1,
        borderColor: '#2ecc71',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 30
    },
    wordValue: {
        fontSize: 36,
        fontWeight: '900',
        color: '#2ecc71',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 5,
        lineHeight: 45,
        includeFontPadding: false
    },
    catValue: {
        fontSize: 14,
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    rewardBtn: {
        flexDirection: 'row',
        backgroundColor: '#FFD700',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5
    },
    rewardBtnText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold'
    },
    rewardSuccess: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderColor: '#2ecc71',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        width: '100%'
    },
    rewardSuccessText: {
        color: '#2ecc71',
        fontSize: 16,
        fontWeight: 'bold',
    },
    playAgainBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 18,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10
    },
    homeBtn: {
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20
    },
    playAgainBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // MODAL STYLES
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    modalBox: {
        backgroundColor: '#16161c',
        borderRadius: 25,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#e74c3c",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10
    },
    modalIconBox: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e74c3c'
    },
    modalTitle: {
        fontSize: 26,
        color: '#fff',
        fontWeight: '900',
        marginBottom: 10
    },
    modalText: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30
    },
    modalHighlight: {
        color: '#e74c3c',
        fontWeight: 'bold',
        fontSize: 18
    },
    modalActions: {
        flexDirection: 'row',
        gap: 15,
        width: '100%'
    },
    modalCancel: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333'
    },
    modalCancelText: {
        color: '#888',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    modalConfirm: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 15,
        backgroundColor: '#e74c3c',
        alignItems: 'center',
        shadowColor: "#e74c3c",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5
    },
    modalConfirmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase'
    },
    rewardSummary: {
        marginTop: 16,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    rewardSummaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    rewardSummaryName: {
        flex: 1,
        color: '#ddd',
        fontSize: 14,
    },
    rewardSummaryXP: {
        color: '#aaa',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 8,
    },
    rewardSummaryTrophies: {
        color: '#D4AF37',
        fontSize: 13,
        fontWeight: '700',
    },
});

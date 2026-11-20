import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { useSound } from '../../context/SoundContext';
import { EditorialDoodle, getDoodleForThemeId } from '../components/EditorialDoodle';
import { TriviaHeader } from '../components/TriviaHeader';
import { getThemeById } from '../data/catalog';
import { selectQuestionsForSoloMatch } from '../gameLogic';
import { TriviaStackParamList } from '../navigation/types';
import {
    fetchRoomSnapshot,
    leaveTriviaRoom,
    startTriviaRoom,
    subscribeToRoom,
} from '../online/triviaRoomService';
import { DIFFICULTY_LEVELS, OnlineParticipantRow, OnlineRoomRow } from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaOnlineLobby'>;
    route: RouteProp<TriviaStackParamList, 'TriviaOnlineLobby'>;
};

export const TriviaOnlineLobbyScreen = ({ navigation, route }: Props) => {
    const { session } = route.params;
    const insets = useSafeAreaInsets();
    const { playSound } = useSound();

    const [room, setRoom] = useState<OnlineRoomRow | null>(null);
    const [participants, setParticipants] = useState<OnlineParticipantRow[]>([]);
    const [starting, setStarting] = useState(false);
    const [copiedBanner, setCopiedBanner] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const navigatedToGameRef = useRef(false);
    const leavingExplicitlyRef = useRef(false);

    const syncSnapshot = useCallback(async () => {
        try {
            const snap = await fetchRoomSnapshot(session.roomId);
            if (!snap.room) return;
            setRoom(snap.room);
            setParticipants(snap.participants);

            if (snap.room.status === 'in_progress' && !navigatedToGameRef.current) {
                navigatedToGameRef.current = true;
                navigation.replace('TriviaOnlineGame', { session });
            } else if (snap.room.status === 'cancelled' && !leavingExplicitlyRef.current) {
                Alert.alert('Sala cerrada', 'El anfitrión cerró la sala.');
                navigation.goBack();
            }
        } catch {
            // Keep retrying silently on transient network glitches
        }
    }, [navigation, session]);

    useEffect(() => {
        syncSnapshot();
        const unsubscribe = subscribeToRoom(session.roomId, () => {
            syncSnapshot();
        });
        const pollId = setInterval(() => {
            syncSnapshot();
        }, 3000);

        return () => {
            unsubscribe();
            clearInterval(pollId);
            if (!navigatedToGameRef.current && !leavingExplicitlyRef.current) {
                leaveTriviaRoom(session);
            }
        };
    }, [session, syncSnapshot]);

    const handleShareCode = async () => {
        playSound('tap');
        const message = `Únete a mi sala de Trivia bíblica en Berea con el código: ${session.roomCode}`;
        if (Platform.OS === 'web') {
            try {
                const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
                if (nav?.clipboard?.writeText) {
                    await nav.clipboard.writeText(session.roomCode);
                }
                setCopiedBanner(true);
                setTimeout(() => setCopiedBanner(false), 2200);
                return;
            } catch {
                // Fallback to Share API
            }
        }
        try {
            await Share.share({ message });
        } catch {
            setCopiedBanner(true);
            setTimeout(() => setCopiedBanner(false), 2200);
        }
    };

    const handleStart = async () => {
        if (!room || starting) return;
        const themeNode = getThemeById(room.theme_id);
        if (!themeNode || !themeNode.isPlayable) {
            setErrorMsg('No se encontraron preguntas para este tema.');
            return;
        }
        setStarting(true);
        setErrorMsg(null);
        try {
            const selection = selectQuestionsForSoloMatch(
                themeNode,
                room.difficulty,
                room.question_count,
                []
            );
            const questionIds = selection.questions
                .map(q => q.id)
                .filter((id): id is string => Boolean(id));
            if (questionIds.length === 0) {
                throw new Error('No hay suficientes preguntas disponibles.');
            }
            await startTriviaRoom(session, questionIds);
            playSound('unlock');
            if (!navigatedToGameRef.current) {
                navigatedToGameRef.current = true;
                navigation.replace('TriviaOnlineGame', { session });
            }
        } catch (err: any) {
            setErrorMsg(err?.message || 'No se pudo iniciar la partida.');
            setStarting(false);
        }
    };

    const handleLeave = async () => {
        playSound('tap');
        leavingExplicitlyRef.current = true;
        await leaveTriviaRoom(session);
        navigation.goBack();
    };

    const themeNode = room ? getThemeById(room.theme_id) : null;
    const levelMeta = room ? DIFFICULTY_LEVELS[room.difficulty] : null;
    const doodle = getDoodleForThemeId(room?.theme_id || 'mezcla_biblica');

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <TriviaHeader
                    eyebrow="SALA ONLINE"
                    title="Esperando jugadores"
                    onBack={handleLeave}
                    backLabel="Salir de la sala"
                    variant="clean"
                />

                {/* Código gigante para compartir */}
                <View style={s.codeCard}>
                    <AppText style={s.codeEyebrow}>CÓDIGO DE LA SALA</AppText>
                    <AppText style={s.codeValue}>{session.roomCode}</AppText>
                    <Pressable
                        accessibilityRole="button"
                        onPress={handleShareCode}
                        style={({ pressed }) => [s.shareBtn, pressed && s.pressed]}
                    >
                        <Ionicons
                            name={copiedBanner ? 'checkmark-circle' : 'share-social-outline'}
                            size={18}
                            color="#FFFFFF"
                        />
                        <AppText style={s.shareBtnText}>
                            {copiedBanner ? 'Código copiado' : 'Compartir código'}
                        </AppText>
                    </Pressable>
                </View>

                {/* Resumen compacto */}
                <View style={s.configCard}>
                    <View style={{ flex: 1 }}>
                        <AppText style={s.themeTitle}>
                            {themeNode?.title || room?.theme_id || 'Trivia bíblica'}
                        </AppText>
                        <AppText style={s.themeMeta}>
                            {levelMeta ? `${levelMeta.name} · ` : ''}
                            {room?.question_count ?? 10} preguntas · {room?.seconds_per_question ?? 20} s
                        </AppText>
                    </View>
                    <EditorialDoodle kind={doodle.kind} tint="#FFFFFF" size={56} />
                </View>

                {/* Lista en vivo */}
                <View style={s.playersCard}>
                    <AppText style={s.sectionLabel}>
                        JUGADORES EN SALA ({participants.length})
                    </AppText>
                    <View style={s.playersList}>
                        {participants.map(p => {
                            const isMe = p.id === session.participantId;
                            return (
                                <View key={p.id} style={s.playerRow}>
                                    <View
                                        style={[
                                            s.playerAvatar,
                                            { backgroundColor: isMe ? '#DCECE8' : '#D6E8F8' },
                                        ]}
                                    >
                                        <AppText style={s.playerInitial}>
                                            {p.display_name.slice(0, 1).toUpperCase()}
                                        </AppText>
                                    </View>
                                    <AppText style={s.playerName} numberOfLines={1}>
                                        {p.display_name}
                                    </AppText>
                                    {p.role === 'host' && (
                                        <View style={s.hostPill}>
                                            <AppText style={s.hostPillText}>Anfitrión</AppText>
                                        </View>
                                    )}
                                    {isMe && (
                                        <View style={s.mePill}>
                                            <AppText style={s.mePillText}>Tú</AppText>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {!!errorMsg && (
                    <View style={s.errorBox}>
                        <Ionicons name="alert-circle-outline" size={18} color="#8E3B3B" />
                        <AppText style={s.errorText}>{errorMsg}</AppText>
                    </View>
                )}

                {session.isHost ? (
                    <Pressable
                        accessibilityRole="button"
                        disabled={starting || !room}
                        onPress={handleStart}
                        style={({ pressed }) => [
                            s.startBtn,
                            (starting || !room) && { opacity: 0.55 },
                            pressed && s.pressed,
                        ]}
                    >
                        {starting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <AppText style={s.startBtnText}>Iniciar partida</AppText>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </>
                        )}
                    </Pressable>
                ) : (
                    <View style={s.waitingBox}>
                        <ActivityIndicator color="#1E3A5F" size="small" />
                        <AppText style={s.waitingText}>
                            Esperando a que el anfitrión inicie la partida…
                        </AppText>
                    </View>
                )}
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
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        padding: 20,
        gap: 16,
    },
    codeCard: {
        borderRadius: 28,
        padding: 24,
        backgroundColor: '#FBF2D0',
        alignItems: 'center',
        gap: 10,
    },
    codeEyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#8A6408',
    },
    codeValue: {
        fontSize: 40,
        fontWeight: '800',
        letterSpacing: 8,
        color: '#1B1E23',
    },
    shareBtn: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1E3A5F',
        paddingHorizontal: 18,
        paddingVertical: 11,
        borderRadius: 20,
    },
    shareBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    configCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 20,
        borderRadius: 26,
        backgroundColor: '#DCECE8',
    },
    themeTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1B1E23',
    },
    themeMeta: {
        fontSize: 13,
        color: '#34404A',
        marginTop: 4,
    },
    playersCard: {
        padding: 20,
        borderRadius: 24,
        backgroundColor: '#F6F8FA',
        gap: 12,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#2E6F65',
    },
    playersList: {
        gap: 10,
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
    },
    playerAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerInitial: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    playerName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1B1E23',
    },
    hostPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#D6E8F8',
    },
    hostPillText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    mePill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#DCECE8',
    },
    mePillText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#2E6F65',
    },
    errorBox: {
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#F7E6E6',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        color: '#8E3B3B',
    },
    startBtn: {
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    startBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    waitingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 22,
        backgroundColor: '#F6F8FA',
    },
    waitingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#5B6573',
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.92,
    },
});

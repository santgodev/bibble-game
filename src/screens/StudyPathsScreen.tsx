import React, { useState, useCallback } from 'react';
import {
    Pressable, ScrollView, StyleSheet, View, StatusBar, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components';
import { supabase } from '../lib/supabase';
import { STUDY_PATHS, StudyPath } from '../data/studyPaths';
import { EditorialDoodle, DoodleKind } from '../trivia/components/EditorialDoodle';
import { useSound } from '../context/SoundContext';

const BG = '#FFFFFF';
const SURFACE = '#F6F8FA';
const INK = '#1B1E23';
const MUTED = '#5B6573';
const NAVY = '#1E3A5F';
const EUCALIPTO = '#2E6F65';

const PATH_STYLES: { bg: string; doodle: DoodleKind; tint: string }[] = [
    { bg: '#DCECE8', doodle: 'scroll', tint: '#68AEEB' },
    { bg: '#D6E8F8', doodle: 'dove', tint: '#FFFFFF' },
    { bg: '#F5DA7C', doodle: 'crown', tint: '#FFFFFF' },
];

export const StudyPathsScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic } = useSound();
    const [completedMissions, setCompletedMissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadProgress();
        }, [])
    );

    const loadProgress = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: events } = await supabase
                .from('events')
                .select('description')
                .eq('user_id', user.id)
                .like('description', 'MISSION:%');

            if (events) {
                setCompletedMissions(events.map((e: any) => e.description.replace('MISSION:', '')));
            }
        } catch (err) {
            console.error('Error loading progress', err);
        } finally {
            setLoading(false);
        }
    };

    const getPathProgress = (path: StudyPath) => {
        const allNodes = path.weeks.flatMap(w => w.nodes);
        const done = allNodes.filter(n => completedMissions.includes(n.id)).length;
        return { done, total: allNodes.length, pct: done / allNodes.length || 0 };
    };

    const isPathLocked = (index: number) => {
        if (index === 0) return false;
        const prevProgress = getPathProgress(STUDY_PATHS[index - 1]);
        return prevProgress.pct < 1.0;
    };

    const totalXP = completedMissions.reduce((acc, id) => {
        for (const path of STUDY_PATHS) {
            const allNodes = path.weeks.flatMap(w => w.nodes);
            const n = allNodes.find(node => node.id === id);
            if (n) return acc + n.xpReward;
        }
        return acc;
    }, 0);

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                {/* Header editorial idéntico a TriviaHomeScreen */}
                <View style={s.header}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        onPress={() => {
                            playSound('tap');
                            navigation.goBack();
                        }}
                        style={({ pressed }) => [s.backBtn, pressed && s.pressed]}
                    >
                        <Ionicons name="arrow-back" size={20} color={INK} />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <AppText style={s.eyebrow}>ESTUDIO BÍBLICO</AppText>
                        <AppText style={s.title}>Rutas de estudio</AppText>
                    </View>
                </View>

                {/* Bloque compacto de avance (estilo progressCard de HomeScreen) */}
                <View style={s.summaryCard}>
                    <View style={s.summaryLeft}>
                        <AppText style={s.summaryTitle}>
                            {completedMissions.length} misiones · {totalXP} XP
                        </AppText>
                        <AppText style={s.summarySub}>
                            Avanza paso a paso en cada libro
                        </AppText>
                    </View>
                    <EditorialDoodle kind="olive" tint="#DCECE8" size={50} />
                </View>

                {loading && (
                    <ActivityIndicator size="small" color={NAVY} style={{ marginBottom: 16 }} />
                )}

                {/* Tarjetas hero por ruta (estilo TriviaHomeScreen) */}
                <View style={s.cardsColumn}>
                    {STUDY_PATHS.map((path, index) => {
                        const progress = getPathProgress(path);
                        const locked = isPathLocked(index);
                        const completed = progress.pct === 1.0;
                        const palette = PATH_STYLES[index % PATH_STYLES.length];

                        return (
                            <Pressable
                                key={path.id}
                                accessibilityRole="button"
                                accessibilityLabel={path.title}
                                onPress={() => {
                                    if (locked) return;
                                    playSound('select');
                                    playHaptic('selection');
                                    navigation.navigate('StudyMissions', { path });
                                }}
                                style={({ pressed }) => [
                                    s.pathCard,
                                    { backgroundColor: locked ? SURFACE : palette.bg },
                                    locked && s.lockedCard,
                                    !locked && pressed && s.pressed,
                                ]}
                            >
                                <View style={s.cardHeaderRow}>
                                    <View style={s.pillWhite}>
                                        <AppText style={s.pillWhiteText}>
                                            {path.book.toUpperCase()}
                                        </AppText>
                                    </View>
                                    <EditorialDoodle
                                        kind={palette.doodle}
                                        tint={locked ? '#D5DCE2' : palette.tint}
                                        size={58}
                                    />
                                </View>

                                <AppText style={[s.cardTitle, locked && { color: MUTED }]}>
                                    {path.title}
                                </AppText>

                                <View style={s.progressRow}>
                                    <View style={s.progressTrack}>
                                        <View
                                            style={[
                                                s.progressFill,
                                                {
                                                    width: `${progress.pct * 100}%` as any,
                                                    backgroundColor: locked ? '#C5CED6' : EUCALIPTO,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <AppText style={s.progressText}>
                                        {progress.done}/{progress.total}
                                    </AppText>
                                </View>

                                <View style={s.cardFooter}>
                                    <AppText style={[s.footerAction, locked && { color: MUTED }]}>
                                        {locked
                                            ? `Completa ${STUDY_PATHS[index - 1].title}`
                                            : completed
                                                ? 'Ruta completada'
                                                : 'Continuar ruta'}
                                    </AppText>
                                    <View style={[s.navyCircle, locked && { backgroundColor: '#D5DCE2' }]}>
                                        <Ionicons
                                            name={locked ? 'lock-closed' : completed ? 'checkmark' : 'arrow-forward'}
                                            size={16}
                                            color={locked ? MUTED : '#FFFFFF'}
                                        />
                                    </View>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    page: {
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 22,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.4,
        color: EUCALIPTO,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: INK,
        marginTop: 2,
    },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: SURFACE,
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 14,
        marginBottom: 20,
        gap: 12,
    },
    summaryLeft: { flex: 1 },
    summaryTitle: { fontSize: 16, fontWeight: '800', color: INK },
    summarySub: { fontSize: 13, color: MUTED, marginTop: 2 },
    cardsColumn: { gap: 16 },
    pathCard: {
        borderRadius: 28,
        padding: 22,
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
    lockedCard: {
        shadowOpacity: 0,
        elevation: 0,
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.94,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    pillWhite: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    pillWhiteText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
        color: NAVY,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: INK,
        marginBottom: 14,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    progressTrack: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.8)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '700',
        color: INK,
        minWidth: 32,
        textAlign: 'right',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerAction: {
        fontSize: 14,
        fontWeight: '700',
        color: NAVY,
    },
    navyCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: NAVY,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

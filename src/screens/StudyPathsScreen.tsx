import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { STUDY_PATHS, StudyPath } from '../data/studyPaths';

export const StudyPathsScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [completedMissions, setCompletedMissions] = useState<string[]>([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: userData } = await supabase
                .from('users').select('username').eq('id', user.id).single();
            if (userData) setUsername(userData.username);

            const { data: events } = await supabase
                .from('events').select('description')
                .eq('user_id', user.id).like('description', 'MISSION:%');

            if (events) {
                setCompletedMissions(events.map(e => e.description.replace('MISSION:', '')));
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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor="#050505" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>RUTAS DE ESTUDIO</Text>
                    {username ? (
                        <Text style={styles.headerSub}>Hola, {username}</Text>
                    ) : null}
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HERO STATS CARD */}
                <View style={styles.heroCard}>
                    <View style={styles.heroIconRow}>
                        <View style={styles.heroIconBg}>
                            <Ionicons name="library-outline" size={28} color="#D4AF37" />
                        </View>
                    </View>
                    <Text style={styles.heroTitle}>Aprende. Juega. Crece.</Text>
                    <Text style={styles.heroSub}>
                        Lee el pasaje del día, supera el reto bíblico y acumula XP para tu iglesia.
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#D4AF37" style={{ marginBottom: 4 }} />
                            <Text style={styles.statNum}>{completedMissions.length}</Text>
                            <Text style={styles.statLabel}>Misiones</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Ionicons name="flash-outline" size={18} color="#D4AF37" style={{ marginBottom: 4 }} />
                            <Text style={styles.statNum}>{totalXP}</Text>
                            <Text style={styles.statLabel}>XP ganados</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Ionicons name="map-outline" size={18} color="#D4AF37" style={{ marginBottom: 4 }} />
                            <Text style={styles.statNum}>{STUDY_PATHS.length}</Text>
                            <Text style={styles.statLabel}>Rutas</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>SELECCIONA UNA RUTA</Text>

                {STUDY_PATHS.map((path, index) => {
                    const progress = getPathProgress(path);
                    const locked = isPathLocked(index);
                    const completed = progress.pct === 1.0;

                    return (
                        <TouchableOpacity
                            key={path.id}
                            style={[
                                styles.pathCard,
                                { borderLeftColor: locked ? '#2A2A2A' : path.accentColor },
                            ]}
                            onPress={() => {
                                if (!locked) navigation.navigate('StudyMissions', { path });
                            }}
                            activeOpacity={locked ? 1 : 0.75}
                        >
                            {locked && (
                                <View style={styles.lockOverlay}>
                                    <View style={styles.lockIconBg}>
                                        <Ionicons name="lock-closed" size={22} color="#555" />
                                    </View>
                                    <Text style={styles.lockText}>
                                        Completa primero: {STUDY_PATHS[index - 1].title}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.pathContent}>
                                {/* Icon + Title row */}
                                <View style={styles.pathTop}>
                                    <View style={[styles.pathIconBg, { backgroundColor: path.accentColor + '22' }]}>
                                        <Ionicons
                                            name={path.iconName as any}
                                            size={22}
                                            color={locked ? '#444' : path.accentColor}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.pathTitle, locked && { color: '#444' }]}>
                                            {path.title}
                                        </Text>
                                        <Text style={[styles.pathBook, { color: locked ? '#333' : path.accentColor }]}>
                                            {path.book}
                                        </Text>
                                    </View>
                                    {completed ? (
                                        <View style={[styles.completedBadge, { backgroundColor: path.accentColor }]}>
                                            <Ionicons name="checkmark" size={14} color="#000" />
                                        </View>
                                    ) : (
                                        <Ionicons name="chevron-forward" size={18} color={locked ? '#333' : '#555'} />
                                    )}
                                </View>

                                <Text style={[styles.pathDesc, locked && { color: '#333' }]} numberOfLines={2}>
                                    {path.description}
                                </Text>

                                {/* Progress */}
                                <View style={styles.progressRow}>
                                    <View style={styles.progressBg}>
                                        <View style={[
                                            styles.progressFill,
                                            {
                                                width: `${progress.pct * 100}%` as any,
                                                backgroundColor: locked ? '#222' : path.accentColor,
                                            }
                                        ]} />
                                    </View>
                                    <Text style={[styles.progressText, locked && { color: '#333' }]}>
                                        {progress.done}/{progress.total}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#111',
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 3 },
    headerSub: { color: '#555', fontSize: 12, marginTop: 2, letterSpacing: 1 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#111', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#1A1A1A',
    },
    scrollContent: { padding: 20 },

    // Hero
    heroCard: {
        backgroundColor: '#0A0A0A', borderRadius: 20, padding: 24,
        marginBottom: 28, borderWidth: 1, borderColor: '#1A1A1A',
        alignItems: 'center',
    },
    heroIconRow: { marginBottom: 16 },
    heroIconBg: {
        width: 60, height: 60, borderRadius: 18,
        backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.3)', alignItems: 'center', justifyContent: 'center',
    },
    heroTitle: {
        color: '#fff', fontSize: 20, fontWeight: '800',
        letterSpacing: 0.5, textAlign: 'center', marginBottom: 8,
    },
    heroSub: {
        color: '#555', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24,
    },
    statsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    statBox: { alignItems: 'center', flex: 1 },
    statNum: { color: '#D4AF37', fontSize: 22, fontWeight: '900' },
    statLabel: { color: '#555', fontSize: 10, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
    statDivider: { width: 1, height: 40, backgroundColor: '#1A1A1A' },

    // Section
    sectionTitle: {
        color: '#444', fontSize: 10, fontWeight: '800',
        letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase',
    },

    // Path card
    pathCard: {
        backgroundColor: '#0A0A0A', borderRadius: 16,
        marginBottom: 14, borderWidth: 1, borderColor: '#1A1A1A',
        borderLeftWidth: 3, overflow: 'hidden', minHeight: 120,
    },
    pathContent: { padding: 18 },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject as any,
        backgroundColor: 'rgba(5,5,5,0.85)',
        alignItems: 'center', justifyContent: 'center', zIndex: 10, gap: 10,
    },
    lockIconBg: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: '#111', borderWidth: 1, borderColor: '#222',
        alignItems: 'center', justifyContent: 'center',
    },
    lockText: { color: '#444', fontSize: 12, textAlign: 'center', paddingHorizontal: 30 },
    pathTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
    pathIconBg: {
        width: 44, height: 44, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
    },
    pathTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
    pathBook: { fontSize: 11, fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1.5 },
    completedBadge: {
        width: 26, height: 26, borderRadius: 8,
        alignItems: 'center', justifyContent: 'center',
    },
    pathDesc: { color: '#555', fontSize: 13, lineHeight: 18, marginBottom: 14 },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    progressBg: { flex: 1, height: 4, backgroundColor: '#151515', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
    progressText: { color: '#555', fontSize: 11, fontWeight: '700', minWidth: 28 },
});

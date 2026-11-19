import React, { useEffect, useState } from 'react';
import {
    Pressable, ScrollView, StyleSheet, View, StatusBar, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { AppText } from '../components';
import { supabase } from '../lib/supabase';
import { StudyPath, StudyNode } from '../data/studyPaths';
import { useSound } from '../context/SoundContext';

const BG = '#FFFFFF';
const SURFACE = '#F6F8FA';
const INK = '#1B1E23';
const MUTED = '#5B6573';
const NAVY = '#1E3A5F';
const EUCALIPTO = '#2E6F65';
const EUCALIPTO_SOFT = '#DCECE8';
const ACUARELA_SOFT = '#D6E8F8';
const ORO = '#8A6408';
const ORO_SOFT = '#FBF2D0';

export const StudyMissionsScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { playSound, playHaptic } = useSound();
    const { path }: { path: StudyPath } = route.params;

    const [loading, setLoading] = useState(true);
    const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());

    const allNodes: StudyNode[] = path.weeks.flatMap(w => w.nodes);

    useEffect(() => {
        if (isFocused) {
            loadProgress();
        }
    }, [isFocused]);

    const loadProgress = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('events')
                    .select('description')
                    .eq('user_id', user.id)
                    .like('description', 'MISSION:%');

                if (!error && data) {
                    const ids = data.map((d: any) => d.description.replace('MISSION:', ''));
                    setCompletedSet(new Set(ids));
                }
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const isNodeUnlocked = (nodeId: string) => {
        const index = allNodes.findIndex(n => n.id === nodeId);
        if (index === 0) return true;
        const prevNode = allNodes[index - 1];
        return completedSet.has(prevNode.id);
    };

    const handlePressNode = (node: StudyNode) => {
        if (!isNodeUnlocked(node.id)) return;
        playSound('select');
        playHaptic('selection');
        navigation.navigate('StudyDevotional', { node, path });
    };

    const getNodeStyle = (type: string) => {
        switch (type) {
            case 'intro':
                return { bg: EUCALIPTO_SOFT, fg: EUCALIPTO, icon: 'book-outline' as const };
            case 'devotional':
                return { bg: ACUARELA_SOFT, fg: NAVY, icon: 'sunny-outline' as const };
            case 'practice':
                return { bg: EUCALIPTO_SOFT, fg: EUCALIPTO, icon: 'compass-outline' as const };
            case 'quiz':
                return { bg: ORO_SOFT, fg: ORO, icon: 'trophy-outline' as const };
            default:
                return { bg: SURFACE, fg: NAVY, icon: 'ellipse-outline' as const };
        }
    };

    if (loading) {
        return (
            <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color={NAVY} />
            </View>
        );
    }

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
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
                        <AppText style={s.eyebrow}>{path.book.toUpperCase()}</AppText>
                        <AppText style={s.title} numberOfLines={1}>{path.title}</AppText>
                    </View>
                </View>

                {path.weeks.map((week) => (
                    <View key={week.id} style={s.weekContainer}>
                        <View style={s.weekHeader}>
                            <View style={s.weekPill}>
                                <AppText style={s.weekPillText}>UNIDAD {week.weekNumber}</AppText>
                            </View>
                            <AppText style={s.weekTitle}>{week.title}</AppText>
                        </View>

                        <View style={{ gap: 12 }}>
                            {week.nodes.map((node) => {
                                const isDone = completedSet.has(node.id);
                                const isUnlocked = isNodeUnlocked(node.id);
                                const tone = getNodeStyle(node.type);

                                return (
                                    <Pressable
                                        key={node.id}
                                        accessibilityRole="button"
                                        accessibilityLabel={node.title}
                                        onPress={() => handlePressNode(node)}
                                        style={({ pressed }) => [
                                            s.nodeCard,
                                            { backgroundColor: isUnlocked ? tone.bg : SURFACE },
                                            !isUnlocked && s.lockedCard,
                                            isUnlocked && pressed && s.pressed,
                                        ]}
                                    >
                                        <View style={s.nodeIconBox}>
                                            <Ionicons
                                                name={isDone ? 'checkmark-circle' : (isUnlocked ? tone.icon : 'lock-closed-outline')}
                                                size={22}
                                                color={isDone ? EUCALIPTO : (isUnlocked ? tone.fg : MUTED)}
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <AppText style={[s.nodeTitle, !isUnlocked && { color: MUTED }]} numberOfLines={2}>
                                                {node.title}
                                            </AppText>
                                            <AppText style={s.nodeMeta}>
                                                +{node.xpReward} XP · +{node.trophyReward} T
                                            </AppText>
                                        </View>

                                        {isUnlocked && (
                                            <View style={[s.circleBtn, { backgroundColor: isDone ? '#FFFFFF' : NAVY }]}>
                                                <Ionicons
                                                    name={isDone ? 'checkmark' : 'arrow-forward'}
                                                    size={16}
                                                    color={isDone ? EUCALIPTO : '#FFFFFF'}
                                                />
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                ))}
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
        marginBottom: 24,
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
        fontSize: 24,
        fontWeight: '800',
        color: INK,
        marginTop: 2,
    },
    weekContainer: { marginBottom: 28 },
    weekHeader: { marginBottom: 12, gap: 6, alignItems: 'flex-start' },
    weekPill: {
        backgroundColor: SURFACE,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    weekPillText: {
        color: NAVY,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    weekTitle: {
        color: INK,
        fontSize: 20,
        fontWeight: '800',
    },
    nodeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 22,
        padding: 18,
        gap: 14,
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 2,
    },
    lockedCard: {
        shadowOpacity: 0,
        elevation: 0,
        opacity: 0.72,
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.94,
    },
    nodeIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeTitle: { color: INK, fontSize: 16, fontWeight: '800', lineHeight: 22 },
    nodeMeta: { color: MUTED, fontSize: 12, fontWeight: '600', marginTop: 3 },
    circleBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { StudyPath, StudyWeek, StudyNode } from '../data/studyPaths';
import { useIsFocused } from '@react-navigation/native';

export const StudyMissionsScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { path }: { path: StudyPath } = route.params;

    const [loading, setLoading] = useState(true);
    const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());

    // Flatten logic to easily know prev/next
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
                    const ids = data.map(d => d.description.replace('MISSION:', ''));
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
        if (index === 0) return true; // First node always unlocked
        const prevNode = allNodes[index - 1];
        return completedSet.has(prevNode.id);
    };

    const handlePressNode = (node: StudyNode) => {
        if (!isNodeUnlocked(node.id)) return;
        navigation.navigate('StudyDevotional', { node, path });
    };

    const getNodeColor = (type: string) => {
        switch (type) {
            case 'intro': return '#9B59B6';
            case 'devotional': return '#E67E22';
            case 'practice': return '#3498DB';
            case 'quiz': return '#F1C40F';
            default: return path.accentColor;
        }
    };

    const getNodeIcon = (type: string) => {
        switch (type) {
            case 'intro': return 'book';
            case 'devotional': return 'sunny';
            case 'practice': return 'color-palette';
            case 'quiz': return 'trophy';
            default: return 'ellipse';
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={path.accentColor} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor="#050505" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 16 }}>
                    <Text style={[styles.headerSub, { color: path.accentColor }]}>{path.book}</Text>
                    <Text style={styles.headerTitle} numberOfLines={1}>{path.title}</Text>
                </View>
                <View style={styles.iconBtn}>
                    <Ionicons name={path.iconName as any} size={20} color={path.accentColor} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {path.weeks.map((week, wIndex) => (
                    <View key={week.id} style={styles.weekContainer}>
                        {/* Week Header */}
                        <View style={styles.weekHeader}>
                            <View style={[styles.weekLabelBox, { backgroundColor: path.accentColor + '20' }]}>
                                <Text style={[styles.weekLabel, { color: path.accentColor }]}>
                                    UNIDAD {week.weekNumber}
                                </Text>
                            </View>
                            <Text style={styles.weekTitle}>{week.title}</Text>
                            <Text style={styles.weekTheme}>{week.theme}</Text>
                        </View>

                        {/* Nodes Line Map */}
                        <View style={styles.mapContainer}>
                            {week.nodes.map((node, i) => {
                                const isDone = completedSet.has(node.id);
                                const isUnlocked = isNodeUnlocked(node.id);
                                const isLastInWeek = i === week.nodes.length - 1;
                                const isFirstInWeek = i === 0;

                                const nColor = getNodeColor(node.type);
                                const activeColor = isDone ? nColor : (isUnlocked ? nColor : '#222');
                                const bgOpacity = isUnlocked && !isDone ? '20' : '00';
                                const ringBorder = isUnlocked && !isDone ? activeColor : 'transparent';

                                // Zig Zag Logic
                                const isLeftAlign = i % 2 === 0;

                                return (
                                    <View key={node.id} style={styles.nodeWrapper}>
                                        {/* Connector Line UP */}
                                        {!(wIndex === 0 && isFirstInWeek) && (
                                            <View style={[styles.connector, {
                                                backgroundColor: isUnlocked ? '#333' : '#111',
                                                top: -24, left: 35
                                            }]} />
                                        )}

                                        <TouchableOpacity
                                            style={styles.nodeItemContainer}
                                            activeOpacity={isUnlocked ? 0.7 : 1}
                                            onPress={() => handlePressNode(node)}
                                        >
                                            {/* Node Bubble */}
                                            <View style={[
                                                styles.nodeBubbleOut,
                                                { borderColor: ringBorder, opacity: isUnlocked ? 1 : 0.5 }
                                            ]}>
                                                <View style={[styles.nodeBubble, { backgroundColor: activeColor }]}>
                                                    <Ionicons
                                                        name={isDone ? 'checkmark' : (isUnlocked ? getNodeIcon(node.type) as any : 'lock-closed')}
                                                        size={24}
                                                        color={isDone ? '#000' : (isUnlocked ? '#fff' : '#666')}
                                                    />
                                                </View>
                                            </View>

                                            {/* Node Info Box */}
                                            <View style={[
                                                styles.nodeInfoCard,
                                                { opacity: isUnlocked ? 1 : 0.4 }
                                            ]}>
                                                <Text style={[styles.nodeSubtitle, { color: nColor }]}>{node.subtitle}</Text>
                                                <Text style={styles.nodeTitle} numberOfLines={2}>{node.title}</Text>

                                                <View style={styles.rewardsRow}>
                                                    <View style={[styles.miniPill, { backgroundColor: '#111' }]}>
                                                        <Text style={styles.miniPillText}>+{node.xpReward} XP</Text>
                                                    </View>
                                                    <View style={[styles.miniPill, { backgroundColor: 'rgba(212,175,55,0.1)' }]}>
                                                        <Text style={[styles.miniPillText, { color: '#FFD700' }]}>+{node.trophyReward} T</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ))}

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#111',
    },
    headerSub: { fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
    iconBtn: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: '#151515', alignItems: 'center', justifyContent: 'center',
    },
    scrollContent: { paddingHorizontal: 20, paddingTop: 30 },

    weekContainer: { marginBottom: 40 },
    weekHeader: { marginBottom: 20, alignItems: 'flex-start' },
    weekLabelBox: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 8 },
    weekLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
    weekTitle: { color: '#fff', fontSize: 24, fontWeight: '900' },
    weekTheme: { color: '#777', fontSize: 14, marginTop: 4, fontWeight: '600' },

    mapContainer: {
        paddingLeft: 10,
    },
    nodeWrapper: {
        position: 'relative',
        marginBottom: 30, // Space between nodes vertically
    },
    connector: {
        position: 'absolute',
        width: 3,
        height: 60,
        zIndex: -1,
    },
    nodeItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    nodeBubbleOut: {
        width: 74, height: 74, borderRadius: 37,
        borderWidth: 3, alignItems: 'center', justifyContent: 'center',
        marginRight: 16,
    },
    nodeBubble: {
        width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center',
    },

    nodeInfoCard: {
        flex: 1, backgroundColor: '#0A0A0A',
        borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#1A1A1A',
        justifyContent: 'center',
    },
    nodeSubtitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
    nodeTitle: { color: '#fff', fontSize: 15, fontWeight: '700', lineHeight: 20, marginBottom: 10 },
    rewardsRow: { flexDirection: 'row', gap: 6 },
    miniPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    miniPillText: { color: '#aaa', fontSize: 10, fontWeight: '800' },
});

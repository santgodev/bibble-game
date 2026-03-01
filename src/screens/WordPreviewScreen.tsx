import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity,
    Platform, UIManager, Animated
} from 'react-native';
import { AppText } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CharadaCard } from '../data/categories';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Design tokens ────────────────────────────────────────
const GOLD = '#D4AF37';
const BG = '#06060E';
const SURFACE = '#0E0E1C';
const BORDER = 'rgba(255,255,255,0.07)';

export const WordPreviewScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
    const { category, categoryObj, totalPool } = route.params || { category: 'Mock', categoryObj: {}, totalPool: [] };

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    const [displayedWords, setDisplayedWords] = useState<(string | CharadaCard)[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [gameDuration, setGameDuration] = useState(60);

    const [members, setMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [showMembers, setShowMembers] = useState(false);

    // Shimmer animation for word chips
    const shimmerAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
                Animated.timing(shimmerAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: userData } = await supabase.from('users').select('church_id').eq('id', user.id).single();
                    if (userData?.church_id) {
                        const { data: churchMembers } = await supabase.from('users')
                            .select('id, username').eq('church_id', userData.church_id).order('username');
                        if (churchMembers) setMembers(churchMembers);
                    }
                }
            } catch (e) { console.error('Error fetching members', e); }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        shuffleAndPick(gameDuration);
    }, [gameDuration, totalPool]);

    const toggleMember = (id: string) => {
        setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
    };

    const getWordsCount = (dur: number) => {
        if (dur <= 60) return 15;
        if (dur <= 90) return 20;
        if (dur <= 120) return 25;
        return 35;
    };

    const shuffleAndPick = (dur?: number) => {
        if (!totalPool || totalPool.length === 0) return;
        const activeDuration = dur ?? gameDuration;
        const pool = [...totalPool];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        // Use all available if pool smaller than target
        const target = Math.min(getWordsCount(activeDuration), pool.length);
        setDisplayedWords(pool.slice(0, target));
    };

    const startGame = () => {
        if (hasStarted) return;
        setHasStarted(true);
        navigation.navigate('Game', {
            category, categoryObj, words: displayedWords,
            duration: gameDuration, playingMembers: selectedMembers
        });
    };

    const durations = [
        { seconds: 60, label: '1 MIN' },
        { seconds: 90, label: '1:30' },
        { seconds: 120, label: '2 MIN' },
        { seconds: 180, label: '3 MIN' },
    ];

    return (
        <View style={s.container}>
            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ───────────────────────── */}
                <LinearGradient colors={['#0D0D22', BG]} style={s.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <AppText style={s.categoryName} numberOfLines={1}>{category}</AppText>
                        <AppText style={s.categoryMeta}>{displayedWords.length} PALABRAS LISTAS</AppText>
                    </View>
                    <TouchableOpacity onPress={() => shuffleAndPick(gameDuration)} style={s.shuffleBtn}>
                        <Ionicons name="shuffle" size={22} color={GOLD} />
                    </TouchableOpacity>
                </LinearGradient>

                {/* ── Duration selector ────────────── */}
                <View style={s.section}>
                    <AppText style={s.sectionLabel}>⏱ DURACIÓN DEL JUEGO</AppText>
                    <View style={s.durationRow}>
                        {durations.map(({ seconds, label }) => (
                            <TouchableOpacity
                                key={seconds}
                                style={[s.durBtn, gameDuration === seconds && s.durBtnActive]}
                                onPress={() => {
                                    setGameDuration(seconds);
                                    shuffleAndPick(seconds);
                                }}
                                activeOpacity={0.75}
                            >
                                {gameDuration === seconds
                                    ? <LinearGradient colors={[GOLD, '#B8860B']} style={s.durBtnGrad}>
                                        <AppText style={s.durTextActive}>{label}</AppText>
                                    </LinearGradient>
                                    : <AppText style={s.durText}>{label}</AppText>
                                }
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ── Word chips ───────────────────── */}
                <View style={s.section}>
                    <View style={s.wordsHeader}>
                        <AppText style={s.sectionLabel}>🎯 PALABRAS DE ESTA RONDA</AppText>
                        <AppText style={s.wordsCount}>{displayedWords.length}</AppText>
                    </View>
                    <View style={s.wordsGrid}>
                        {displayedWords.map((item, index) => {
                            const wordText = typeof item === 'string' ? item : item.word;
                            // Alternate subtle styles for variety
                            const isEven = index % 3 === 0;
                            const isOdd = index % 3 === 1;
                            return (
                                <View
                                    key={index}
                                    style={[
                                        s.wordChip,
                                        isEven && s.wordChipAccent,
                                        isOdd && s.wordChipMid,
                                    ]}
                                >
                                    <AppText style={[
                                        s.wordText,
                                        isEven && { color: GOLD },
                                    ]} numberOfLines={1}>
                                        {wordText}
                                    </AppText>
                                </View>
                            );
                        })}
                        {displayedWords.length === 0 && (
                            <View style={s.emptyWords}>
                                <Ionicons name="alert-circle-outline" size={32} color="#444" />
                                <AppText style={s.emptyText}>Sin palabras disponibles</AppText>
                            </View>
                        )}
                    </View>
                </View>

                {/* ── Who's playing ────────────────── */}
                {members.length > 0 && (
                    <View style={s.section}>
                        <TouchableOpacity
                            style={s.membersToggle}
                            onPress={() => setShowMembers(!showMembers)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="people" size={18} color={GOLD} style={{ marginRight: 8 }} />
                            <AppText style={s.sectionLabel}>¿QUIÉN JUEGA?</AppText>
                            <Ionicons
                                name={showMembers ? "chevron-up" : "chevron-down"}
                                size={16} color="#555" style={{ marginLeft: 'auto' }}
                            />
                        </TouchableOpacity>

                        {showMembers && (
                            <View style={s.membersGrid}>
                                {members.map(member => (
                                    <TouchableOpacity
                                        key={member.id}
                                        style={[s.memberChip, selectedMembers.includes(member.id) && s.memberChipActive]}
                                        onPress={() => toggleMember(member.id)}
                                        activeOpacity={0.8}
                                    >
                                        {selectedMembers.includes(member.id) && (
                                            <Ionicons name="checkmark-circle" size={14} color={GOLD} style={{ marginRight: 4 }} />
                                        )}
                                        <AppText style={[
                                            s.memberText,
                                            selectedMembers.includes(member.id) && { color: GOLD }
                                        ]}>
                                            {member.username}
                                        </AppText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* ── Fixed bottom CTA ─────────────────── */}
            <View style={s.footer}>
                <TouchableOpacity style={s.startBtn} onPress={startGame} activeOpacity={0.85}>
                    <LinearGradient colors={[GOLD, '#B8860B']} style={s.startBtnInner}>
                        <Ionicons name="play" size={22} color="#000" style={{ marginRight: 10 }} />
                        <AppText style={s.startBtnText}>
                            JUGAR {gameDuration >= 60 ? `${gameDuration / 60}:${gameDuration % 60 === 0 ? '00' : gameDuration % 60}` : `${gameDuration}s`}
                        </AppText>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    scroll: { paddingBottom: 40 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingTop: 54, paddingBottom: 20, paddingHorizontal: 16,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },
    categoryName: {
        color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 0.5,
    },
    categoryMeta: {
        color: '#555', fontSize: 11, fontWeight: '700', marginTop: 2, letterSpacing: 1,
    },
    shuffleBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(212,175,55,0.1)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    },

    section: {
        marginHorizontal: 16, marginTop: 16,
        backgroundColor: SURFACE, borderRadius: 20,
        padding: 16, borderWidth: 1, borderColor: BORDER,
    },
    sectionLabel: {
        color: '#555', fontSize: 11, fontWeight: '800',
        letterSpacing: 1.5, marginBottom: 12,
    },

    // Duration
    durationRow: { flexDirection: 'row', gap: 8 },
    durBtn: {
        flex: 1, borderRadius: 14, overflow: 'hidden',
        borderWidth: 1, borderColor: BORDER,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    durBtnActive: { borderColor: GOLD },
    durBtnGrad: { paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    durText: { color: '#666', fontWeight: '800', fontSize: 13, textAlign: 'center', paddingVertical: 12 },
    durTextActive: { color: '#000', fontWeight: '900', fontSize: 13 },

    // Words
    wordsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    wordsCount: {
        marginLeft: 'auto', color: GOLD, fontWeight: '900', fontSize: 14,
        backgroundColor: 'rgba(212,175,55,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
    },
    wordsGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    },
    wordChip: {
        paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    },
    wordChipAccent: {
        backgroundColor: 'rgba(212,175,55,0.07)',
        borderColor: 'rgba(212,175,55,0.2)',
    },
    wordChipMid: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.1)',
    },
    wordText: { color: '#ccc', fontSize: 13, fontWeight: '600' },
    emptyWords: { alignItems: 'center', width: '100%', paddingVertical: 30, gap: 10 },
    emptyText: { color: '#444', fontSize: 14 },

    // Members
    membersToggle: {
        flexDirection: 'row', alignItems: 'center',
    },
    membersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    memberChip: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1, borderColor: BORDER,
    },
    memberChipActive: {
        backgroundColor: 'rgba(212,175,55,0.1)',
        borderColor: 'rgba(212,175,55,0.4)',
    },
    memberText: { color: '#888', fontSize: 13, fontWeight: '700' },

    // Footer CTA
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 16, paddingBottom: 36, paddingTop: 12,
        backgroundColor: BG,
        borderTopWidth: 1, borderTopColor: BORDER,
    },
    startBtn: { borderRadius: 18, overflow: 'hidden' },
    startBtnInner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 18,
    },
    startBtnText: { color: '#000', fontSize: 17, fontWeight: '900', letterSpacing: 1.5 },
});

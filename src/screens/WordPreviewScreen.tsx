import React, { useState, useEffect, useRef } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity,
    Platform, UIManager, Animated, Easing, Dimensions
} from 'react-native';
import { AppText } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CharadaCard } from '../data/categories';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GOLD = '#D4AF37';
const GOLD2 = '#F5D76E';
const PURPLE = '#7C3AED';
const PURPLE2 = '#A855F7';
const BG = '#08081A';
const SURFACE = 'rgba(255,255,255,0.05)';
const BORDER = 'rgba(255,255,255,0.08)';

const { width: SW } = Dimensions.get('window');

// Chip color presets cycling through 3 styles
const CHIP_STYLES = [
    { bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.35)', text: GOLD },
    { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)', text: PURPLE2 },
    { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', text: '#ccc' },
];

export const WordPreviewScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();
    const { category, categoryObj, totalPool } = route.params || { category: 'Mock', categoryObj: {}, totalPool: [] };

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    const [displayedWords, setDisplayedWords] = useState<(string | CharadaCard)[]>([]);
    const [hasStarted, setHasStarted] = useState(false);
    const [gameDuration, setGameDuration] = useState(60);
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [showMembers, setShowMembers] = useState(false);

    // Glow pulse animation
    const glowAnim = useRef(new Animated.Value(0.5)).current;
    const shuffleSpin = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
                Animated.timing(glowAnim, { toValue: 0.5, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
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
        const target = Math.min(getWordsCount(activeDuration), pool.length);
        setDisplayedWords(pool.slice(0, target));

        // Spin shuffle icon
        shuffleSpin.setValue(0);
        Animated.timing(shuffleSpin, {
            toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.ease)
        }).start();
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

    const spinDeg = shuffleSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const glowOpacity = glowAnim.interpolate({ inputRange: [0.5, 1], outputRange: [0.4, 0.9] });

    const formatDuration = (s: number) =>
        s >= 60 ? `${Math.floor(s / 60)}:${s % 60 === 0 ? '00' : String(s % 60).padStart(2, '0')}` : `${s}s`;

    return (
        <View style={s.root}>
            {/* ── Hero gradient background ── */}
            <LinearGradient
                colors={['#0D0520', '#080818', BG]}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Decorative glow orb */}
            <Animated.View style={[s.glowOrb, { opacity: glowOpacity }]} />

            <ScrollView
                contentContainerStyle={[s.scroll, { paddingTop: insets.top + 8 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Hero Header ── */}
                <View style={s.heroRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>

                    <View style={s.heroCenter}>
                        <LinearGradient
                            colors={[PURPLE2, GOLD]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={s.categoryGradientText}
                        >
                            <AppText style={s.categoryName} numberOfLines={1}>{category}</AppText>
                        </LinearGradient>
                        <View style={s.wordCountBadge}>
                            <Ionicons name="layers" size={12} color={GOLD} />
                            <AppText style={s.wordCountText}>{displayedWords.length} PALABRAS</AppText>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => shuffleAndPick(gameDuration)}
                        style={s.shuffleBtn}
                        activeOpacity={0.8}
                    >
                        <Animated.View style={{ transform: [{ rotate: spinDeg }] }}>
                            <Ionicons name="shuffle" size={20} color={GOLD} />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                {/* ── Duration selector ── */}
                <View style={s.section}>
                    <View style={s.sectionHead}>
                        <Ionicons name="timer" size={14} color={PURPLE2} />
                        <AppText style={s.sectionLabel}>DURACIÓN DEL JUEGO</AppText>
                    </View>
                    <View style={s.durationRow}>
                        {durations.map(({ seconds, label }) => {
                            const active = gameDuration === seconds;
                            return (
                                <TouchableOpacity
                                    key={seconds}
                                    style={[s.durBtn, active && s.durBtnActive]}
                                    onPress={() => {
                                        setGameDuration(seconds);
                                        shuffleAndPick(seconds);
                                    }}
                                    activeOpacity={0.75}
                                >
                                    {active ? (
                                        <LinearGradient colors={[GOLD, '#9B6F00']} style={s.durBtnGrad}>
                                            <AppText style={s.durTextActive}>{label}</AppText>
                                        </LinearGradient>
                                    ) : (
                                        <AppText style={s.durText}>{label}</AppText>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ── Words grid ── */}
                <View style={s.section}>
                    <View style={s.sectionHead}>
                        <Ionicons name="game-controller" size={14} color={PURPLE2} />
                        <AppText style={s.sectionLabel}>PALABRAS DE ESTA RONDA</AppText>
                        <View style={s.countBadge}>
                            <AppText style={s.countBadgeText}>{displayedWords.length}</AppText>
                        </View>
                    </View>
                    <View style={s.wordsGrid}>
                        {displayedWords.map((item, index) => {
                            const wordText = typeof item === 'string' ? item : item.word;
                            const cs = CHIP_STYLES[index % 3];
                            return (
                                <View
                                    key={index}
                                    style={[s.chip, { backgroundColor: cs.bg, borderColor: cs.border }]}
                                >
                                    <AppText style={[s.chipText, { color: cs.text }]} numberOfLines={1}>
                                        {wordText}
                                    </AppText>
                                </View>
                            );
                        })}
                        {displayedWords.length === 0 && (
                            <View style={s.emptyWords}>
                                <Ionicons name="alert-circle-outline" size={32} color="#333" />
                                <AppText style={s.emptyText}>Sin palabras disponibles</AppText>
                            </View>
                        )}
                    </View>
                </View>

                {/* ── Who's playing ── */}
                {members.length > 0 && (
                    <View style={s.section}>
                        <TouchableOpacity
                            style={s.membersToggle}
                            onPress={() => setShowMembers(!showMembers)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="people" size={14} color={PURPLE2} />
                            <AppText style={[s.sectionLabel, { flex: 1 }]}>¿QUIÉN JUEGA?</AppText>
                            <Ionicons
                                name={showMembers ? 'chevron-up' : 'chevron-down'}
                                size={16} color="#444"
                            />
                        </TouchableOpacity>

                        {showMembers && (
                            <View style={[s.wordsGrid, { marginTop: 12 }]}>
                                {members.map(member => {
                                    const active = selectedMembers.includes(member.id);
                                    return (
                                        <TouchableOpacity
                                            key={member.id}
                                            style={[s.memberChip, active && s.memberChipActive]}
                                            onPress={() => toggleMember(member.id)}
                                            activeOpacity={0.8}
                                        >
                                            {active && <Ionicons name="checkmark-circle" size={13} color={GOLD} style={{ marginRight: 4 }} />}
                                            <AppText style={[s.memberText, active && { color: GOLD }]}>
                                                {member.username}
                                            </AppText>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 130 }} />
            </ScrollView>

            {/* ── Fixed CTA ── */}
            <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={[s.startBtn, hasStarted && { opacity: 0.6 }]}
                    onPress={startGame}
                    activeOpacity={0.88}
                    disabled={hasStarted}
                >
                    <LinearGradient
                        colors={[GOLD2, GOLD, '#9B6F00']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={s.startBtnInner}
                    >
                        <Ionicons name="play-circle" size={26} color="#000" />
                        <View>
                            <AppText style={s.startBtnText}>JUGAR  {formatDuration(gameDuration)}</AppText>
                            <AppText style={s.startBtnSub}>{displayedWords.length} palabras · ¡A actuar!</AppText>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },
    scroll: { paddingHorizontal: 16, paddingBottom: 20 },

    // Glow orb
    glowOrb: {
        position: 'absolute', top: -80, left: SW / 2 - 150,
        width: 300, height: 300, borderRadius: 150,
        backgroundColor: PURPLE,
        // RN doesn't have blur, so we stack translucent layers for soft glow effect
        opacity: 0.18,
    },

    // Hero
    heroRow: {
        flexDirection: 'row', alignItems: 'center',
        marginBottom: 24, paddingTop: 8,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },
    heroCenter: { flex: 1, alignItems: 'center' },
    categoryGradientText: {
        borderRadius: 8, paddingHorizontal: 4,
    },
    categoryName: {
        fontSize: 22, fontWeight: '900', letterSpacing: 0.5,
        color: '#fff', // overridden visually by gradient bg on text
        includeFontPadding: false,
        lineHeight: 28,
        paddingTop: 2,
    },
    wordCountBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        marginTop: 4,
    },
    wordCountText: {
        color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.5,
    },
    shuffleBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(212,175,55,0.1)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)',
    },

    // Sections
    section: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 22, padding: 16,
        borderWidth: 1, borderColor: BORDER,
        marginBottom: 14,
    },
    sectionHead: {
        flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14,
    },
    sectionLabel: {
        color: '#666', fontSize: 10, fontWeight: '800', letterSpacing: 1.5,
    },
    countBadge: {
        marginLeft: 'auto',
        backgroundColor: 'rgba(212,175,55,0.12)',
        paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)',
    },
    countBadgeText: { color: GOLD, fontSize: 12, fontWeight: '900' },

    // Duration
    durationRow: { flexDirection: 'row', gap: 8 },
    durBtn: {
        flex: 1, borderRadius: 14, overflow: 'hidden',
        borderWidth: 1, borderColor: BORDER,
        backgroundColor: 'rgba(255,255,255,0.03)',
        minHeight: 46, alignItems: 'center', justifyContent: 'center',
    },
    durBtnActive: { borderColor: GOLD },
    durBtnGrad: { width: '100%', paddingVertical: 13, alignItems: 'center' },
    durText: { color: '#555', fontWeight: '800', fontSize: 12 },
    durTextActive: { color: '#000', fontWeight: '900', fontSize: 12 },

    // Words
    wordsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        paddingVertical: 8, paddingHorizontal: 13, borderRadius: 12,
        borderWidth: 1,
    },
    chipText: { fontSize: 13, fontWeight: '700' },
    emptyWords: { alignItems: 'center', width: '100%', paddingVertical: 30, gap: 10 },
    emptyText: { color: '#333', fontSize: 14 },

    // Members
    membersToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    memberChip: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 8, paddingHorizontal: 13, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1, borderColor: BORDER,
    },
    memberChipActive: {
        backgroundColor: 'rgba(212,175,55,0.08)',
        borderColor: 'rgba(212,175,55,0.35)',
    },
    memberText: { color: '#777', fontSize: 13, fontWeight: '700' },

    // Footer CTA
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 16, paddingTop: 12,
        backgroundColor: 'rgba(8,8,26,0.96)',
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
    },
    startBtn: { borderRadius: 20, overflow: 'hidden' },
    startBtnInner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 18, gap: 14,
    },
    startBtnText: { color: '#000', fontSize: 18, fontWeight: '900', letterSpacing: 1.5, includeFontPadding: false },
    startBtnSub: { color: 'rgba(0,0,0,0.55)', fontSize: 11, fontWeight: '700', textAlign: 'center', marginTop: 2 },
});

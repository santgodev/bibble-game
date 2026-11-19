import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Animated, Image, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { getEvolutionaryAvatar } from '../utils/avatarUtils';
import { EditorialDoodle } from '../trivia/components/EditorialDoodle';

// ─── Paleta oficial Berea (- es +) ────────────────────────
const BG = '#FFFFFF';
const SURFACE = '#F6F8FA';
const INK = '#1B1E23';
const MUTED = '#5B6573';
const ZAFIRO = '#1E3A5F';
const EUCALIPTO = '#2E6F65';
const EUCALIPTO_SOFT = '#DCECE8';
const ACUARELA_SOFT = '#D6E8F8';
const ORO = '#8A6408';
const ORO_SOFT = '#FBF2D0';
const ERROR = '#9E3A3A';
const ERROR_SOFT = '#F7E6E6';

// ─── Helper: Level from XP ────────────────────────────────
const getLevel = (xp: number) => Math.floor(Math.sqrt(xp / 50)) + 1;
const getLevelProgress = (xp: number) => {
    const level = getLevel(xp);
    const xpForLevel = (level - 1) ** 2 * 50;
    const xpForNext = level ** 2 * 50;
    return ((xp - xpForLevel) / (xpForNext - xpForLevel)) * 100;
};

// ─── Rank badge (sin emojis, sin bordes) ──────────────────
const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) {
        return (
            <View style={[badges.wrapper, { backgroundColor: '#F5DA7C' }]}>
                <Ionicons name="trophy" size={18} color={ORO} />
            </View>
        );
    }
    if (rank === 2) {
        return (
            <View style={[badges.wrapper, { backgroundColor: ACUARELA_SOFT }]}>
                <Ionicons name="medal" size={18} color={ZAFIRO} />
            </View>
        );
    }
    if (rank === 3) {
        return (
            <View style={[badges.wrapper, { backgroundColor: EUCALIPTO_SOFT }]}>
                <Ionicons name="ribbon" size={18} color={EUCALIPTO} />
            </View>
        );
    }
    return (
        <View style={[badges.wrapper, { backgroundColor: '#FFFFFF' }]}>
            <Text style={badges.num}>{rank}</Text>
        </View>
    );
};

const badges = StyleSheet.create({
    wrapper: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    num: {
        color: MUTED,
        fontWeight: '800',
        fontSize: 13,
    },
});

// ─── Profile Hero Card ────────────────────────────────────
const ProfileHeroCard = ({ userStats, church, onNavigate }: any) => {
    const level = getLevel(userStats?.total_xp || 0);
    const progress = getLevelProgress(userStats?.total_xp || 0);
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 900,
            delay: 200,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const avatarUri = getEvolutionaryAvatar(userStats?.username || 'jugador', userStats?.total_xp || 0);

    return (
        <View style={card.container}>
            <View style={card.topRow}>
                <View style={card.avatarWrap}>
                    <Image
                        source={{ uri: avatarUri }}
                        style={card.avatar}
                        defaultSource={require('../../assets/icon-light.png')}
                    />
                    <View style={card.levelChip}>
                        <Text style={card.levelChipText}>Nv {level}</Text>
                    </View>
                </View>

                <View style={card.identity}>
                    <Text style={card.username} numberOfLines={1}>
                        @{userStats?.username || 'Jugador'}
                    </Text>
                    {church ? (
                        <Text style={card.churchName} numberOfLines={1}>
                            {church.name}
                        </Text>
                    ) : null}
                </View>

                <TouchableOpacity onPress={onNavigate} style={card.profileBtn} activeOpacity={0.8}>
                    <Ionicons name="person-outline" size={18} color={ZAFIRO} />
                </TouchableOpacity>
            </View>

            <View style={card.xpSection}>
                <View style={card.xpRow}>
                    <Text style={card.xpLabel}>Nivel {level} → {level + 1}</Text>
                    <Text style={card.xpVal}>{Math.round(progress)}%</Text>
                </View>
                <View style={card.progressBg}>
                    <Animated.View
                        style={[
                            card.progressFill,
                            { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }
                        ]}
                    />
                </View>
            </View>

            <View style={card.statsRow}>
                <View style={card.statBox}>
                    <Text style={card.statNum}>{(userStats?.total_xp || 0).toLocaleString()}</Text>
                    <Text style={card.statLabel}>XP</Text>
                </View>
                <View style={card.statBox}>
                    <Text style={[card.statNum, { color: EUCALIPTO }]}>{userStats?.total_trophies || 0}</Text>
                    <Text style={card.statLabel}>Trofeos</Text>
                </View>
                <View style={card.statBox}>
                    <Text style={[card.statNum, { color: ZAFIRO }]}>{userStats?.level || level}</Text>
                    <Text style={card.statLabel}>Nivel</Text>
                </View>
            </View>
        </View>
    );
};

const card = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        borderRadius: 24,
        backgroundColor: EUCALIPTO_SOFT,
        marginBottom: 24,
        padding: 20,
    },
    topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    avatarWrap: { position: 'relative', marginRight: 14 },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#FFFFFF',
    },
    levelChip: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: ZAFIRO,
        borderRadius: 12,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    levelChipText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
    identity: { flex: 1 },
    username: { color: INK, fontSize: 19, fontWeight: '800' },
    churchName: { color: EUCALIPTO, fontSize: 13, fontWeight: '600', marginTop: 2 },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    xpSection: { marginBottom: 16 },
    xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    xpLabel: { color: MUTED, fontSize: 12, fontWeight: '600' },
    xpVal: { color: EUCALIPTO, fontSize: 12, fontWeight: '800' },
    progressBg: { height: 6, backgroundColor: '#FFFFFF', borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3, backgroundColor: EUCALIPTO },
    statsRow: { flexDirection: 'row', gap: 10 },
    statBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    statNum: { color: INK, fontSize: 18, fontWeight: '800' },
    statLabel: { color: MUTED, fontSize: 11, fontWeight: '600', marginTop: 2 },
});

// ─── Rank Item ────────────────────────────────────────────
const RankRow = ({ item, index, isMe, isGlobal }: any) => {
    const label = isGlobal ? item.church_name : item.username;
    const sub = isGlobal ? (item.city || '') : `Nivel ${Math.floor(Math.sqrt((item.total_xp || 0) / 50)) + 1}`;
    const score = isGlobal ? (item.total_church_trophies || 0) : (item.total_trophies || 0);
    const avatarUri = getEvolutionaryAvatar(
        isGlobal ? item.church_name : item.username,
        isGlobal ? 0 : item.total_xp || 0
    );

    const rowBg = isMe
        ? EUCALIPTO_SOFT
        : index === 0
            ? ORO_SOFT
            : index === 1
                ? ACUARELA_SOFT
                : SURFACE;

    return (
        <View style={[row.container, { backgroundColor: rowBg }]}>
            <RankBadge rank={index + 1} />

            <Image source={{ uri: avatarUri }} style={row.avatar} />

            <View style={row.info}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[row.name, isMe && { color: EUCALIPTO }]} numberOfLines={1}>
                        {label}
                    </Text>
                    {isMe && (
                        <View style={row.meBadge}>
                            <Text style={row.meBadgeText}>TÚ</Text>
                        </View>
                    )}
                </View>
                {sub ? <Text style={row.sub}>{sub}</Text> : null}
            </View>

            <View style={row.scoreBox}>
                <Ionicons name="trophy" size={14} color={index === 0 ? ORO : EUCALIPTO} />
                <Text style={row.scoreVal}>{score}</Text>
            </View>
        </View>
    );
};

const row = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
        marginBottom: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
    },
    info: { flex: 1 },
    name: { color: INK, fontSize: 15, fontWeight: '700' },
    sub: { color: MUTED, fontSize: 12, marginTop: 2 },
    meBadge: {
        backgroundColor: EUCALIPTO,
        borderRadius: 8,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    meBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
    scoreBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    scoreVal: { color: INK, fontWeight: '800', fontSize: 14 },
});

// ─── Main Screen ──────────────────────────────────────────
export const RankingDashboardScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'LOCAL' | 'GLOBAL'>('LOCAL');
    const [localRanking, setLocalRanking] = useState([]);
    const [globalRanking, setGlobalRanking] = useState([]);
    const [userStats, setUserStats] = useState<any>(null);
    const [church, setChurch] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigation.replace('Auth'); return; }

            const { data: fetchedUser } = await supabase.from('users').select('*').eq('id', user.id).single();
            if (fetchedUser) {
                setUserStats(fetchedUser);
                if (fetchedUser.church_id) {
                    const { data: churchData } = await supabase.from('churches').select('*').eq('id', fetchedUser.church_id).single();
                    if (churchData) setChurch(churchData);

                    const { data: localData } = await supabase.from('users')
                        .select('*').eq('church_id', fetchedUser.church_id)
                        .order('total_trophies', { ascending: false });
                    if (localData) setLocalRanking(localData as never[]);
                }
            }

            const { data: globalData } = await supabase.from('church_global_ranking')
                .select('*').order('total_church_trophies', { ascending: false });
            if (globalData) setGlobalRanking(globalData as never[]);
        } catch (e) {
            console.error('Error loading dashboard:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color={ZAFIRO} />
            </View>
        );
    }

    const activeList = activeTab === 'LOCAL' ? localRanking : globalRanking;

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={[s.header, { paddingTop: insets.top + 12 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn} activeOpacity={0.8}>
                        <Ionicons name="chevron-back" size={22} color={INK} />
                    </TouchableOpacity>
                    <Text style={s.headerTitle}>Ranking</Text>
                    <TouchableOpacity
                        onPress={async () => { await supabase.auth.signOut(); navigation.replace('Home'); }}
                        style={[s.iconBtn, { backgroundColor: ERROR_SOFT }]}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="log-out-outline" size={20} color={ERROR} />
                    </TouchableOpacity>
                </View>

                {/* Profile Hero */}
                {userStats && (
                    <ProfileHeroCard
                        userStats={userStats}
                        church={church}
                        onNavigate={() => navigation.navigate('Profile')}
                    />
                )}

                {/* Tab Switcher (máx 2 botones) */}
                <View style={s.tabBar}>
                    {(['LOCAL', 'GLOBAL'] as const).map(tab => {
                        const active = activeTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[s.tab, active && s.tabActive]}
                                onPress={() => setActiveTab(tab)}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={tab === 'LOCAL' ? 'people-outline' : 'earth-outline'}
                                    size={16}
                                    color={active ? '#FFFFFF' : MUTED}
                                />
                                <Text style={[s.tabText, active && s.tabTextActive]}>
                                    {tab === 'LOCAL' ? 'Mi iglesia' : 'Global'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* No church warning */}
                {activeTab === 'LOCAL' && !userStats?.church_id && (
                    <View style={s.emptyBox}>
                        <EditorialDoodle kind="dove" size={56} tint="#68AEEB" />
                        <Text style={s.emptyTitle}>Sin iglesia asignada</Text>
                        <Text style={s.emptySub}>
                            Únete o crea una iglesia en tu perfil para ver la clasificación local.
                        </Text>
                        <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.navigate('Profile')} activeOpacity={0.85}>
                            <Text style={s.emptyBtnText}>Ir a perfil</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Ranking list */}
                <View style={{ paddingHorizontal: 20 }}>
                    {activeList.length > 0 ? (
                        activeList.map((item: any, index: number) => (
                            <RankRow
                                key={activeTab === 'LOCAL' ? item.id : item.church_id}
                                item={item}
                                index={index}
                                isMe={activeTab === 'LOCAL' ? item.id === userStats?.id : item.church_id === userStats?.church_id}
                                isGlobal={activeTab === 'GLOBAL'}
                            />
                        ))
                    ) : (
                        activeTab === 'LOCAL' && userStats?.church_id ? (
                            <View style={s.emptyBox}>
                                <Text style={s.emptyTitle}>Sin registros aún</Text>
                                <Text style={s.emptySub}>Juega una partida para estrenar el ranking.</Text>
                            </View>
                        ) : activeTab === 'GLOBAL' ? (
                            <View style={s.emptyBox}>
                                <Text style={s.emptyTitle}>Sin iglesias registradas</Text>
                                <Text style={s.emptySub}>Crea una iglesia para aparecer aquí.</Text>
                            </View>
                        ) : null
                    )}
                </View>

                {/* Guide link */}
                <TouchableOpacity style={s.guideBtn} onPress={() => navigation.navigate('SystemGuide')} activeOpacity={0.8}>
                    <Ionicons name="help-circle-outline" size={22} color={ZAFIRO} />
                    <Text style={s.guideTitle}>Cómo ganar XP y trofeos</Text>
                    <Ionicons name="chevron-forward" size={18} color={MUTED} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 18,
    },
    headerTitle: { color: INK, fontSize: 18, fontWeight: '800' },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: SURFACE,
        borderRadius: 16,
        padding: 4,
        gap: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 11,
        borderRadius: 12,
    },
    tabActive: { backgroundColor: ZAFIRO },
    tabText: { color: MUTED, fontWeight: '700', fontSize: 14 },
    tabTextActive: { color: '#FFFFFF', fontWeight: '700' },
    emptyBox: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 8,
        padding: 28,
        borderRadius: 22,
        backgroundColor: SURFACE,
        gap: 8,
    },
    emptyTitle: { color: INK, fontSize: 17, fontWeight: '800', marginTop: 4 },
    emptySub: { color: MUTED, fontSize: 14, textAlign: 'center', lineHeight: 20 },
    emptyBtn: {
        marginTop: 10,
        backgroundColor: ZAFIRO,
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 14,
    },
    emptyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
    guideBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 18,
        borderRadius: 18,
        backgroundColor: ACUARELA_SOFT,
        gap: 12,
    },
    guideTitle: { flex: 1, color: ZAFIRO, fontSize: 15, fontWeight: '700' },
});

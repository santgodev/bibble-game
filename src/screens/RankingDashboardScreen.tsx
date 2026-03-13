import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Animated, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

// ─── Design tokens ────────────────────────────────────────
const GOLD = '#D4AF37';
const SILVER = '#C0C0C0';
const BRONZE = '#CD7F32';
const BG = '#06060E';
const SURFACE = '#0E0E1C';
const BORDER = 'rgba(255,255,255,0.07)';

// ─── Helper: Level from XP ────────────────────────────────
const getLevel = (xp: number) => Math.floor(Math.sqrt(xp / 50)) + 1;
const getLevelProgress = (xp: number) => {
    const level = getLevel(xp);
    const xpForLevel = (level - 1) ** 2 * 50;
    const xpForNext = level ** 2 * 50;
    return ((xp - xpForLevel) / (xpForNext - xpForLevel)) * 100;
};

// ─── Medal component ──────────────────────────────────────
const Medal = ({ rank }: { rank: number }) => {
    const colors: Record<number, string[]> = {
        1: ['#FFD700', '#D4AF37', '#B8860B'],
        2: ['#E8E8E8', '#C0C0C0', '#A8A8A8'],
        3: ['#E8A060', '#CD7F32', '#A0602A'],
    };
    const labels: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

    if (rank <= 3) {
        return (
            <View style={medals.wrapper}>
                <Text style={{ fontSize: 22 }}>{labels[rank]}</Text>
            </View>
        );
    }
    return (
        <View style={[medals.wrapper, medals.plain]}>
            <Text style={medals.num}>#{rank}</Text>
        </View>
    );
};

const medals = StyleSheet.create({
    wrapper: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    plain: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: BORDER },
    num: { color: '#888', fontWeight: '800', fontSize: 14 },
});

// ─── Profile Hero Card ─────────────────────────────────────
const ProfileHeroCard = ({ userStats, church, onNavigate }: any) => {
    const level = getLevel(userStats?.total_xp || 0);
    const progress = getLevelProgress(userStats?.total_xp || 0);
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 1000,
            delay: 300,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const avatarSeed = userStats?.username || 'default';
    const avatarUri = `https://api.dicebear.com/7.x/bottts/png?seed=${avatarSeed}&backgroundColor=transparent`;

    return (
        <LinearGradient
            colors={['#0E0E24', '#0A0A18', '#06060E']}
            style={card.container}
        >
            {/* Decorative glow */}
            <View style={card.glow} />

            {/* Avatar + Identity */}
            <View style={card.topRow}>
                <View style={card.avatarShell}>
                    <LinearGradient colors={[GOLD, '#B8860B']} style={card.avatarGradientBorder}>
                        <View style={card.avatarInner}>
                            <Image
                                source={{ uri: avatarUri }}
                                style={card.avatar}
                                defaultSource={require('../../assets/logo.png')}
                            />
                        </View>
                    </LinearGradient>
                    <View style={card.levelChip}>
                        <Text style={card.levelChipText}>Lv {level}</Text>
                    </View>
                </View>

                <View style={card.identity}>
                    <Text style={card.username}>@{userStats?.username || 'Jugador'}</Text>
                    {church && (
                        <View style={card.churchRow}>
                            <Ionicons name="home" size={12} color={GOLD} />
                            <Text style={card.churchName} numberOfLines={1}>{church.name}</Text>
                        </View>
                    )}
                    <View style={card.roleChip}>
                        <Text style={card.roleText}>{userStats?.role || 'GUERRERO'}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={onNavigate} style={card.settingsBtn}>
                    <Ionicons name="settings-outline" size={20} color={GOLD} />
                </TouchableOpacity>
            </View>

            {/* XP Progress Bar */}
            <View style={card.xpSection}>
                <View style={card.xpRow}>
                    <Text style={card.xpLabel}>NIVEL {level} → {level + 1}</Text>
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

            {/* Stats row */}
            <View style={card.statsRow}>
                <View style={card.statBox}>
                    <LinearGradient colors={['rgba(212,175,55,0.15)', 'rgba(212,175,55,0.03)']} style={card.statGrad}>
                        <Ionicons name="flash" size={18} color={GOLD} />
                        <Text style={card.statNum}>{(userStats?.total_xp || 0).toLocaleString()}</Text>
                        <Text style={card.statLabel}>XP TOTAL</Text>
                    </LinearGradient>
                </View>
                <View style={card.statBox}>
                    <LinearGradient colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.03)']} style={card.statGrad}>
                        <Ionicons name="trophy" size={18} color="#FFD700" />
                        <Text style={[card.statNum, { color: '#FFD700' }]}>{userStats?.total_trophies || 0}</Text>
                        <Text style={card.statLabel}>TROFEOS</Text>
                    </LinearGradient>
                </View>
                <View style={card.statBox}>
                    <LinearGradient colors={['rgba(94,22,181,0.2)', 'rgba(94,22,181,0.04)']} style={card.statGrad}>
                        <Ionicons name="medal" size={18} color="#9B59B6" />
                        <Text style={[card.statNum, { color: '#9B59B6' }]}>{userStats?.level || level}</Text>
                        <Text style={card.statLabel}>NIVEL</Text>
                    </LinearGradient>
                </View>
            </View>
        </LinearGradient>
    );
};

const card = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.2)',
        overflow: 'hidden',
        marginBottom: 28,
        padding: 20,
    },
    glow: {
        position: 'absolute', top: -40, right: -40,
        width: 150, height: 150, borderRadius: 75,
        backgroundColor: 'rgba(212,175,55,0.06)',
    },
    topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    avatarShell: { position: 'relative', marginRight: 14 },
    avatarGradientBorder: {
        width: 72, height: 72, borderRadius: 36,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarInner: {
        width: 66, height: 66, borderRadius: 33,
        backgroundColor: '#0A0A18', overflow: 'hidden',
    },
    avatar: { width: '100%', height: '100%' },
    levelChip: {
        position: 'absolute', bottom: -4, right: -4,
        backgroundColor: '#1a1a2e', borderRadius: 20,
        borderWidth: 1.5, borderColor: GOLD,
        paddingHorizontal: 6, paddingVertical: 2,
    },
    levelChipText: { color: GOLD, fontSize: 10, fontWeight: '900' },
    identity: { flex: 1 },
    username: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 4, letterSpacing: 0.5 },
    churchRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
    churchName: { color: GOLD, fontSize: 12, fontWeight: '600', maxWidth: 150 },
    roleChip: {
        backgroundColor: 'rgba(255,255,255,0.07)', alignSelf: 'flex-start',
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    roleText: { color: '#aaa', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    settingsBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(212,175,55,0.1)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    },
    xpSection: { marginBottom: 18 },
    xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    xpLabel: { color: '#666', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    xpVal: { color: GOLD, fontSize: 11, fontWeight: '900' },
    progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' },
    progressFill: {
        height: '100%', borderRadius: 3,
        backgroundColor: GOLD,
    },
    statsRow: { flexDirection: 'row', gap: 10 },
    statBox: { flex: 1 },
    statGrad: {
        borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8,
        alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    statNum: { color: GOLD, fontSize: 18, fontWeight: '900', marginTop: 4 },
    statLabel: { color: '#555', fontSize: 9, fontWeight: '700', letterSpacing: 1, marginTop: 2 },
});

// ─── Rank Item ─────────────────────────────────────────────
const RankRow = ({ item, index, isMe, isGlobal }: any) => {
    const scaleAnim = useRef(new Animated.Value(0.96)).current;
    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1, delay: index * 60, friction: 8, tension: 100, useNativeDriver: true
        }).start();
    }, []);

    const isTop3 = index < 3;
    const rankColors = [
        ['rgba(212,175,55,0.12)', 'rgba(212,175,55,0.03)', GOLD],
        ['rgba(192,192,192,0.1)', 'rgba(192,192,192,0.02)', SILVER],
        ['rgba(205,127,50,0.1)', 'rgba(205,127,50,0.02)', BRONZE],
    ];
    const [c1, c2, border] = isTop3 ? rankColors[index] : ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)', 'rgba(255,255,255,0.06)'];

    const label = isGlobal ? item.church_name : item.username;
    const sub = isGlobal && item.city ? item.city : (isGlobal ? '' : '');
    const score = isGlobal ? (item.total_church_trophies || 0) : (item.total_trophies || 0);
    const xp = !isGlobal ? (item.total_xp || 0) : null;
    const level = !isGlobal ? getLevel(item.total_xp || 0) : null;

    const avatarSeed = isGlobal ? item.church_name : item.username;
    const avatarUri = `https://api.dicebear.com/7.x/bottts/png?seed=${avatarSeed}`;

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <LinearGradient
                colors={isMe
                    ? ['rgba(212,175,55,0.22)', 'rgba(212,175,55,0.08)']
                    : [c1 as string, c2 as string]
                }
                style={[
                    row.container,
                    isMe && row.meHighlight,
                    { borderColor: isMe ? GOLD : border as string },
                ]}
            >
                {/* Barra lateral izquierda para 'Yo' */}
                {isMe && <View style={row.meBar} />}

                <Medal rank={index + 1} />

                {/* Avatar */}
                <View style={row.avatarWrap}>
                    <Image source={{ uri: avatarUri }} style={[row.avatar, isMe && row.avatarMe]} />
                    {isMe && <View style={row.meDot} />}
                </View>

                {/* Name + meta */}
                <View style={row.info}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[row.name, isMe && row.nameMe]} numberOfLines={1}>{label}</Text>
                        {isMe && (
                            <View style={row.meBadge}>
                                <Text style={row.meBadgeText}>YO</Text>
                            </View>
                        )}
                    </View>
                    {sub ? <Text style={row.sub}>{sub}</Text> : null}
                    {level && <Text style={row.sub}>Nivel {level} · {xp?.toLocaleString()} XP</Text>}
                </View>

                {/* Score */}
                <View style={[row.scoreBox, isMe && row.scoreBoxMe]}>
                    <Text style={[row.scoreVal, isMe && { fontSize: 18 }]}>{score}</Text>
                    <Ionicons name="trophy" size={14} color="#FFD700" />
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const row = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 18,
        marginBottom: 10, paddingVertical: 12, paddingHorizontal: 14,
        borderWidth: 1, gap: 10, overflow: 'hidden',
    },
    meHighlight: {
        borderColor: GOLD,
        borderWidth: 1.5,
    },
    // Barra de acento izquierda — el indicador más fácil de distinguir
    meBar: {
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 4, backgroundColor: GOLD, borderTopLeftRadius: 18, borderBottomLeftRadius: 18,
    },
    avatarWrap: { position: 'relative' },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a1a2e' },
    avatarMe: { borderWidth: 2, borderColor: GOLD },
    meDot: {
        position: 'absolute', bottom: 0, right: 0,
        width: 12, height: 12, borderRadius: 6,
        backgroundColor: GOLD, borderWidth: 1.5, borderColor: BG,
    },
    info: { flex: 1 },
    name: { color: '#fff', fontSize: 15, fontWeight: '800' },
    nameMe: { color: GOLD, fontSize: 16, fontWeight: '900' },
    sub: { color: '#666', fontSize: 11, marginTop: 2 },
    meBadge: {
        backgroundColor: GOLD, borderRadius: 6,
        paddingHorizontal: 7, paddingVertical: 2,
    },
    meBadgeText: { color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
    // Legacy (kept for compat)
    meTag: {
        backgroundColor: GOLD, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1,
        color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 1,
    },
    scoreBox: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10,
        paddingVertical: 6, borderRadius: 12,
    },
    scoreBoxMe: {
        backgroundColor: 'rgba(212,175,55,0.15)',
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)',
    },
    scoreVal: { color: '#FFD700', fontWeight: '900', fontSize: 16 },
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
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => { loadData(); }, []);

    const switchTab = (tab: 'LOCAL' | 'GLOBAL') => {
        Animated.timing(slideAnim, { toValue: tab === 'LOCAL' ? 0 : 1, duration: 200, useNativeDriver: true }).start();
        setActiveTab(tab);
    };

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
                <ActivityIndicator size="large" color={GOLD} />
            </View>
        );
    }

    const activeList = activeTab === 'LOCAL' ? localRanking : globalRanking;

    return (
        <View style={s.container}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <LinearGradient colors={[BG, 'transparent']} style={[s.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <View style={s.headerCenter}>
                        <Text style={s.headerTitle}>RANKING</Text>
                        <Text style={s.headerSub}>ADN Impact System</Text>
                    </View>
                    <TouchableOpacity onPress={async () => { await supabase.auth.signOut(); navigation.replace('Home'); }} style={s.iconBtn}>
                        <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
                    </TouchableOpacity>
                </LinearGradient>

                {/* Profile Hero */}
                {userStats && (
                    <ProfileHeroCard
                        userStats={userStats}
                        church={church}
                        onNavigate={() => navigation.navigate('Profile')}
                    />
                )}

                {/* Tab Switcher */}
                <View style={s.tabBar}>
                    {(['LOCAL', 'GLOBAL'] as const).map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[s.tab, activeTab === tab && s.tabActive]}
                            onPress={() => switchTab(tab)}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={tab === 'LOCAL' ? 'people' : 'earth'}
                                size={16}
                                color={activeTab === tab ? GOLD : '#555'}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                                {tab === 'LOCAL' ? 'MI IGLESIA' : 'GLOBAL'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Section label */}
                <View style={s.sectionHeader}>
                    <View style={s.sectionLine} />
                    <Text style={s.sectionTitle}>
                        {activeTab === 'LOCAL' ? '🏠 Clasificación Local' : '🌍 Ranking Mundial'}
                    </Text>
                    <View style={s.sectionLine} />
                </View>

                {/* No church warning */}
                {activeTab === 'LOCAL' && !userStats?.church_id && (
                    <View style={s.emptyBox}>
                        <Ionicons name="home-outline" size={40} color={GOLD} style={{ marginBottom: 12 }} />
                        <Text style={s.emptyTitle}>Sin Iglesia Registrada</Text>
                        <Text style={s.emptySub}>Ve a tu perfil, crea una iglesia o pide que te inviten para aparecer en el ranking local.</Text>
                        <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.navigate('Profile')}>
                            <Text style={s.emptyBtnText}>Ir a Perfil →</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Ranking list */}
                <View style={{ paddingHorizontal: 16 }}>
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
                                <Text style={s.emptyTitle}>Ranking vacío</Text>
                                <Text style={s.emptySub}>¡Juega para ser el primero!</Text>
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
                    <LinearGradient colors={['rgba(212,175,55,0.12)', 'rgba(212,175,55,0.04)']} style={s.guideBtnInner}>
                        <Ionicons name="information-circle" size={22} color={GOLD} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={s.guideTitle}>¿Cómo ganar XP y Trofeos?</Text>
                            <Text style={s.guideSub}>Guía completa del sistema de impacto</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#444" />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingBottom: 16,
    },
    headerCenter: { alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
    headerSub: { color: '#444', fontSize: 10, fontWeight: '600', letterSpacing: 1 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },
    tabBar: {
        flexDirection: 'row', marginHorizontal: 16, marginBottom: 24,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16, padding: 4, borderWidth: 1, borderColor: BORDER,
    },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 11, borderRadius: 12,
    },
    tabActive: { backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)' },
    tabText: { color: '#555', fontWeight: '700', fontSize: 13 },
    tabTextActive: { color: GOLD, fontWeight: '900' },
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, marginBottom: 16, gap: 12,
    },
    sectionLine: { flex: 1, height: 1, backgroundColor: BORDER },
    sectionTitle: { color: '#fff', fontSize: 14, fontWeight: '800' },
    emptyBox: {
        alignItems: 'center', marginHorizontal: 16, marginTop: 20,
        padding: 30, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1, borderColor: BORDER,
    },
    emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptySub: { color: '#666', fontSize: 14, textAlign: 'center', lineHeight: 20 },
    emptyBtn: {
        marginTop: 16, backgroundColor: GOLD, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12,
    },
    emptyBtnText: { color: '#000', fontWeight: '900', fontSize: 14 },
    guideBtn: { marginHorizontal: 16, marginTop: 32 },
    guideBtnInner: {
        flexDirection: 'row', alignItems: 'center', padding: 18,
        borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)',
    },
    guideTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
    guideSub: { color: '#555', fontSize: 12, marginTop: 2 },
});

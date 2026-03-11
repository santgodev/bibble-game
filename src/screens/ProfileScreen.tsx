import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Alert, Image, Animated, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

// ─── Design tokens ────────────────────────────────────────
const GOLD = '#F3C623';
const SILVER = '#BDC3C7';
const BRONZE = '#CD7F32';
const BG = '#050510';
const SURFACE = '#0F0F25';
const ACCENT = '#3498DB';
const PURPLE = '#8E44AD';
const BORDER = 'rgba(255,255,255,0.08)';

// ─── Leveling Logic ───────────────────────────────────────
const LEVEL_TITLES = [
    'Semilla', 'Buscador', 'Discípulo', 'Guerrero', 'Vencedor', 'Maestro', 'Anciano', 'Leyenda'
];

const getLevelInfo = (xp: number) => {
    // Escalamiento: Level 1 (0), Level 2 (100), Level 3 (300), Level 4 (600)...
    let level = 1;
    let xpForNext = 100;
    let xpCurrentLevelStart = 0;
    
    while (xp >= xpForNext && level < 100) {
        xpCurrentLevelStart = xpForNext;
        level++;
        xpForNext += level * 100;
    }

    const titleIdx = Math.min(Math.floor((level - 1) / 3), LEVEL_TITLES.length - 1);
    const progress = ((xp - xpCurrentLevelStart) / (xpForNext - xpCurrentLevelStart)) * 100;

    return { level, title: LEVEL_TITLES[titleIdx], progress, xpForNext, nextLevelTitle: LEVEL_TITLES[Math.min(titleIdx + 1, LEVEL_TITLES.length - 1)] };
};

// ─── Badges Mock Logic ────────────────────────────────────
const BADGES = [
    { id: 'early', icon: 'leaf', color: '#2ECC71', label: 'Primeros Pasos', desc: 'Completaste tu primer devocional' },
    { id: 'trivia', icon: 'extension-puzzle', color: ACCENT, label: 'Sabio de Trivia', desc: 'Responde 20 preguntas correctamente' },
    { id: 'streak', icon: 'flame', color: '#E67E22', label: 'Incombustible', desc: 'Racha de 7 días activa' },
    { id: 'church', icon: 'business', color: GOLD, label: 'Pilar de Iglesia', desc: 'Ayudaste a tu iglesia a subir de rango' },
    { id: 'master', icon: 'trophy', color: PURPLE, label: 'Maestro Bíblico', desc: 'Alcanza el nivel 10' },
];

// ─── Labelled Input ───────────────────────────────────────
const LabelInput = ({ label, icon, value, onChangeText, placeholder, keyboard }: any) => (
    <View style={inp.wrapper}>
        <Text style={inp.label}>{label}</Text>
        <View style={inp.row}>
            <Ionicons name={icon} size={16} color="#555" style={{ marginRight: 10 }} />
            <TextInput
                style={inp.field}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#444"
                keyboardType={keyboard || 'default'}
                autoCapitalize="words"
            />
        </View>
    </View>
);

const inp = StyleSheet.create({
    wrapper: { marginBottom: 14 },
    label: { color: '#888', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, textTransform: 'uppercase' },
    row: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1, borderColor: BORDER,
        borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
    },
    field: { flex: 1, color: '#fff', fontSize: 16 },
});

export const ProfileScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState<any>(null);
    const [church, setChurch] = useState<any>(null);

    const [churchName, setChurchName] = useState('');
    const [churchCity, setChurchCity] = useState('');
    const [churchAddress, setChurchAddress] = useState('');
    const [churchPhone, setChurchPhone] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigation.replace('Auth'); return; }

            const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
            if (userData) {
                setUserStats(userData);
                if (userData.church_id) {
                    const { data: churchData } = await supabase.from('churches').select('*').eq('id', userData.church_id).single();
                    if (churchData) setChurch(churchData);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChurch = async () => {
        if (!churchName) { Alert.alert('Aviso', 'El nombre de la iglesia es obligatorio para fundarla.'); return; }
        setActionLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado');

            const { data: newChurch, error: createError } = await supabase
                .from('churches').insert([{ name: churchName, city: churchCity || null, address: churchAddress || null, phone: churchPhone || null }])
                .select().single();
            if (createError) throw createError;

            // Vincular usuario
            const { error: updateError } = await supabase.from('users').update({ church_id: newChurch.id }).eq('id', user.id);
            if (updateError) throw updateError;

            Alert.alert('¡Iglesia Fundada!', `Felicidades, @${userStats.username}. Ahora lideras "${newChurch.name}".`);
            setChurch(newChurch);
            setUserStats({ ...userStats, church_id: newChurch.id });
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally { setActionLoading(false); }
    };

    const handleInviteUser = async () => {
        if (!inviteUsername) return;
        setActionLoading(true);
        try {
            const clean = inviteUsername.replace('@', '').trim();
            const { data: targets } = await supabase.from('users').select('id, username, church_id').ilike('username', clean).limit(1);
            
            if (!targets || targets.length === 0) throw new Error('Jugador no encontrado.');
            const target = targets[0];

            if (target.church_id === church.id) throw new Error('Ya está en tu iglesia.');

            const { error: updErr } = await supabase.from('users').update({ church_id: church.id }).eq('id', target.id);
            if (updErr) throw updErr;

            Alert.alert('¡Miembro Añadido!', `@${target.username} se ha unido a las filas de ${church.name}.`);
            setInviteUsername('');
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally { setActionLoading(false); }
    };

    if (loading) {
        return (
            <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={GOLD} />
            </View>
        );
    }

    const { level, title, progress, xpForNext } = getLevelInfo(userStats?.total_xp || 0);
    const avatarUri = `https://api.dicebear.com/7.x/bottts/png?seed=${userStats?.username || 'berea'}`;

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    return (
        <View style={s.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header Flotante */}
            <Animated.View style={[s.floatingHeader, { opacity: headerOpacity, paddingTop: insets.top }]}>
                <Text style={s.floatingTitle}>@{userStats?.username}</Text>
            </Animated.View>

            <Animated.ScrollView
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Top Identity Section ────────────────── */}
                <LinearGradient colors={['#1A1A3F', BG]} style={[s.hero, { paddingTop: insets.top + 20 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={s.avatarContainer}>
                        <LinearGradient colors={[GOLD, '#FF9900']} style={s.levelBadge}>
                            <Text style={s.levelBadgeText}>{level}</Text>
                        </LinearGradient>
                        <View style={s.avatarWrapper}>
                            <Image source={{ uri: avatarUri }} style={s.avatar} />
                        </View>
                        <View style={s.statusDot} />
                    </View>

                    <Text style={s.displayName}>{userStats?.full_name || 'Guerrero de la Fe'}</Text>
                    <Text style={s.displayUsername}>@{userStats?.username}</Text>
                    
                    <View style={s.titleChip}>
                        <Ionicons name="sparkles" size={14} color={GOLD} />
                        <Text style={s.titleChipText}>{title.toUpperCase()}</Text>
                    </View>

                    <View style={s.mainStatsRow}>
                        <View style={s.mainStatItem}>
                            <Text style={s.mainStatVal}>{userStats?.total_xp || 0}</Text>
                            <Text style={s.mainStatLabel}>EXPERIENCIA</Text>
                        </View>
                        <View style={s.statDivider} />
                        <View style={s.mainStatItem}>
                            <Text style={[s.mainStatVal, { color: '#FFD700' }]}>{userStats?.total_trophies || 0}</Text>
                            <Text style={s.mainStatLabel}>TROFEOS</Text>
                        </View>
                        <View style={s.statDivider} />
                        <View style={s.mainStatItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="flame" size={20} color="#E67E22" />
                                <Text style={[s.mainStatVal, { color: '#E67E22', marginLeft: 4 }]}>{userStats?.streak_count || 1}</Text>
                            </View>
                            <Text style={s.mainStatLabel}>RACHA DÍAS</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* ── XP Progress Bar ─────────────────── */}
                <View style={s.xpSection}>
                    <View style={s.xpInfo}>
                        <Text style={s.xpLabel}>Nivel {level}</Text>
                        <Text style={s.xpTarget}>{userStats?.total_xp} / {xpForNext} XP</Text>
                    </View>
                    <View style={s.barBg}>
                        <LinearGradient 
                            colors={[GOLD, '#FF9900']} 
                            start={{x:0, y:0.5}} end={{x:1, y:0.5}}
                            style={[s.barFill, { width: `${progress}%` }]} 
                        />
                    </View>
                </View>

                {/* ── Badges Section ──────────────────── */}
                <View style={s.sectionContainer}>
                    <Text style={s.sectionHeader}>MIS INSIGNIAS</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.badgeScroll}>
                        {BADGES.map((b, i) => {
                            const isUnlocked = i < 3; // Mocking first 3 as unlocked
                            return (
                                <View key={b.id} style={[s.badgeCard, !isUnlocked && s.lockedBadge]}>
                                    <View style={[s.badgeIconBg, { backgroundColor: b.color + '20' }]}>
                                        <Ionicons name={b.icon as any} size={28} color={isUnlocked ? b.color : '#444'} />
                                    </View>
                                    <Text style={[s.badgeLabel, !isUnlocked && { color: '#555' }]}>{b.label}</Text>
                                    {!isUnlocked && (
                                        <View style={s.lockIconWrap}>
                                            <Ionicons name="lock-closed" size={10} color="#000" />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* ── Guild / Church Section ───────────── */}
                <View style={s.sectionContainer}>
                    <Text style={s.sectionHeader}>MI CLAN / IGLESIA</Text>
                    {!church ? (
                        <View style={s.glassCard}>
                            <Text style={s.cardHeadline}>Únete a un equipo</Text>
                            <Text style={s.cardBody}>No estás en ninguna iglesia. Crea una nueva para que otros jugadores de tu grupo se unan a ti.</Text>
                            
                            <LabelInput label="Nombre del Clan" icon="shield-outline" value={churchName} onChangeText={setChurchName} placeholder="Ej. El Ejercito de David" />
                            <LabelInput label="Ubicación" icon="location-outline" value={churchCity} onChangeText={setChurchCity} placeholder="Ciudad" />

                            <TouchableOpacity style={s.actionBtn} onPress={handleCreateChurch} disabled={actionLoading}>
                                <LinearGradient colors={[ACCENT, '#2980B9']} style={s.actionBtnInner}>
                                    {actionLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.actionBtnText}>FUNDAR CLAN</Text>}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={s.glassCard}>
                            <View style={s.guildHeader}>
                                <View style={s.guildAvatar}>
                                    <Ionicons name="home" size={24} color={GOLD} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.guildName}>{church.name}</Text>
                                    <Text style={s.guildMeta}>{church.city || 'Ubicación desconocida'}</Text>
                                </View>
                                <View style={s.rankPill}>
                                    <Text style={s.rankPillText}>LÍDER</Text>
                                </View>
                            </View>

                            <View style={s.divider} />
                            
                            <Text style={s.subLabel}>AÑADIR GUERRERO</Text>
                            <View style={s.inviteRow}>
                                <TextInput 
                                    style={s.minimalInput}
                                    placeholder="@gamertag..."
                                    placeholderTextColor="#555"
                                    value={inviteUsername}
                                    onChangeText={setInviteUsername}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity style={s.miniBtn} onPress={handleInviteUser}>
                                    <Ionicons name="add" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                {/* ── Danger Zone ─────────────────────── */}
                <TouchableOpacity 
                    style={s.logoutBtn}
                    onPress={() => {
                        Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
                            { text: 'No', style: 'cancel' },
                            { text: 'Sí, Salir', style: 'destructive', onPress: async () => { await supabase.auth.signOut(); navigation.replace('Auth'); } }
                        ]);
                    }}
                >
                    <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
                    <Text style={s.logoutText}>CERRAR SESIÓN</Text>
                </TouchableOpacity>

            </Animated.ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    floatingHeader: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: SURFACE, borderBottomWidth: 1, borderBottomColor: BORDER,
        alignItems: 'center', paddingBottom: 15,
    },
    floatingTitle: { color: GOLD, fontWeight: '900', fontSize: 16 },
    hero: {
        alignItems: 'center', paddingHorizontal: 20, paddingBottom: 30,
        borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    },
    backBtn: { alignSelf: 'flex-start', padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
    avatarContainer: { marginVertical: 20, position: 'relative' },
    avatarWrapper: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: SURFACE, borderWidth: 4, borderColor: GOLD,
        padding: 10, overflow: 'hidden', elevation: 20, shadowColor: GOLD, shadowOpacity: 0.3, shadowRadius: 20
    },
    avatar: { width: '100%', height: '100%' },
    levelBadge: {
        position: 'absolute', top: -5, right: -5, zIndex: 5,
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: BG
    },
    levelBadgeText: { color: '#000', fontWeight: '900', fontSize: 16 },
    statusDot: {
        position: 'absolute', bottom: 10, right: 10,
        width: 18, height: 18, borderRadius: 9,
        backgroundColor: '#2ECC71', borderWidth: 3, borderColor: BG
    },
    displayName: { color: '#fff', fontSize: 24, fontWeight: '900' },
    displayUsername: { color: '#888', fontSize: 16, marginTop: 4 },
    titleChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(243, 198, 35, 0.1)', paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, marginTop: 15, borderWidth: 1, borderColor: 'rgba(243, 198, 35, 0.2)'
    },
    titleChipText: { color: GOLD, fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
    mainStatsRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
        width: '100%', marginTop: 30, backgroundColor: 'rgba(255,255,255,0.03)',
        paddingVertical: 20, borderRadius: 24, borderWidth: 1, borderColor: BORDER
    },
    mainStatItem: { alignItems: 'center' },
    mainStatVal: { color: '#fff', fontSize: 20, fontWeight: '900' },
    mainStatLabel: { color: '#666', fontSize: 10, fontWeight: '800', marginTop: 4, letterSpacing: 0.8 },
    statDivider: { width: 1, height: 30, backgroundColor: BORDER },

    xpSection: { marginTop: -25, paddingHorizontal: 25 },
    xpInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    xpLabel: { color: '#fff', fontWeight: '800', fontSize: 12 },
    xpTarget: { color: GOLD, fontWeight: '900', fontSize: 12 },
    barBg: { height: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: BORDER },
    barFill: { height: '100%', borderRadius: 6 },

    sectionContainer: { marginTop: 35, paddingHorizontal: 20 },
    sectionHeader: { color: '#555', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
    badgeScroll: { paddingRight: 40, gap: 15 },
    badgeCard: {
        width: 110, height: 140, backgroundColor: SURFACE, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center', padding: 10,
        borderWidth: 1, borderColor: BORDER
    },
    badgeIconBg: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    badgeLabel: { color: '#fff', fontSize: 11, fontWeight: '800', textAlign: 'center' },
    lockedBadge: { opacity: 0.5, backgroundColor: 'rgba(0,0,0,0.2)' },
    lockIconWrap: { position: 'absolute', top: 10, right: 10, backgroundColor: GOLD, padding: 2, borderRadius: 4 },

    glassCard: {
        backgroundColor: SURFACE, borderRadius: 28, padding: 22,
        borderWidth: 1, borderColor: BORDER
    },
    cardHeadline: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 8 },
    cardBody: { color: '#888', fontSize: 14, lineHeight: 22, marginBottom: 20 },
    actionBtn: { marginTop: 10, borderRadius: 16, overflow: 'hidden' },
    actionBtnInner: { paddingVertical: 16, alignItems: 'center' },
    actionBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },

    guildHeader: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    guildAvatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: 'rgba(243, 198, 35, 0.1)', alignItems: 'center', justifyContent: 'center' },
    guildName: { color: '#fff', fontSize: 18, fontWeight: '900' },
    guildMeta: { color: '#555', fontSize: 13, marginTop: 2 },
    rankPill: { backgroundColor: GOLD, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    rankPillText: { color: '#000', fontSize: 10, fontWeight: '900' },
    divider: { height: 1, backgroundColor: BORDER, marginVertical: 20 },
    subLabel: { color: '#444', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 15 },
    inviteRow: { flexDirection: 'row', gap: 10 },
    minimalInput: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, paddingHorizontal: 15, color: '#fff', height: 48, borderWidth: 1, borderColor: BORDER },
    miniBtn: { width: 48, height: 48, backgroundColor: GOLD, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 40, marginHorizontal: 20, paddingVertical: 18,
        borderWidth: 1, borderColor: 'rgba(231,76,60,0.2)', borderRadius: 20, gap: 10
    },
    logoutText: { color: '#e74c3c', fontWeight: '900', letterSpacing: 1 },
});

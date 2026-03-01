import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Alert, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

// ─── Design tokens ────────────────────────────────────────
const GOLD = '#D4AF37';
const BG = '#06060E';
const SURFACE = '#0E0E1C';
const BORDER = 'rgba(255,255,255,0.07)';

const getLevel = (xp: number) => Math.floor(Math.sqrt(xp / 50)) + 1;
const getLevelProgress = (xp: number) => {
    const level = getLevel(xp);
    const xpForL = (level - 1) ** 2 * 50;
    const xpForN = level ** 2 * 50;
    return ((xp - xpForL) / (xpForN - xpForL)) * 100;
};

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
    label: { color: '#555', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
    row: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1, borderColor: BORDER,
        borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14,
    },
    field: { flex: 1, color: '#fff', fontSize: 15 },
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
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCreateChurch = async () => {
        if (!churchName) { Alert.alert('Error', 'Ingresa el nombre de la iglesia'); return; }
        setActionLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado');

            const { data: newChurch, error: createError } = await supabase
                .from('churches').insert([{ name: churchName, city: churchCity || null, address: churchAddress || null, phone: churchPhone || null }])
                .select().single();
            if (createError) throw createError;

            if (userStats?.id) {
                const { error: updateError } = await supabase.from('users').update({ church_id: newChurch.id }).eq('id', userStats.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase.from('users').insert({
                    id: user.id, email: user.email,
                    username: user.user_metadata?.username || user.email?.split('@')[0],
                    full_name: user.user_metadata?.full_name || 'Gamer',
                    church_id: newChurch.id, role: 'USER', total_xp: 0, total_trophies: 0, level: 1
                });
                if (insertError) throw insertError;
            }

            Alert.alert('¡Iglesia Creada!', `"${newChurch.name}" ya está en el sistema.`);
            setChurch(newChurch);
            setUserStats({ ...userStats, church_id: newChurch.id, id: user.id });
        } catch (err: any) {
            Alert.alert('Error', err.message || 'No se pudo crear la iglesia');
        } finally { setActionLoading(false); }
    };

    const handleInviteUser = async () => {
        if (!inviteUsername) { Alert.alert('Error', 'Ingresa el nombre de usuario'); return; }
        setActionLoading(true);
        try {
            const cleanUsername = inviteUsername.replace(/^@/, '').trim();
            const { data: targetUsers, error: findError } = await supabase.from('users')
                .select('*').ilike('username', `%${cleanUsername}%`).limit(1);
            if (findError) throw new Error('Hubo un problema buscando al usuario.');
            if (!targetUsers || targetUsers.length === 0) throw new Error('Usuario no encontrado.');

            const targetUser = targetUsers[0];
            if (targetUser.church_id === church.id) {
                Alert.alert('Info', 'Este usuario ya está en tu iglesia');
                setActionLoading(false); return;
            }

            const { error: updateError } = await supabase.from('users').update({ church_id: church.id }).eq('id', targetUser.id);
            if (updateError) throw updateError;

            Alert.alert('¡Éxito!', `@${targetUser.username} se ha unido a ${church.name}.`);
            setInviteUsername('');
        } catch (err: any) {
            Alert.alert('Error', err.message || 'No se pudo invitar al usuario');
        } finally { setActionLoading(false); }
    };

    if (loading) {
        return (
            <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={GOLD} />
            </View>
        );
    }

    const level = getLevel(userStats?.total_xp || 0);
    const progress = getLevelProgress(userStats?.total_xp || 0);
    const avatarSeed = userStats?.username || 'default';
    const avatarUri = `https://api.dicebear.com/7.x/bottts/png?seed=${avatarSeed}`;

    return (
        <View style={s.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header gradient ─────────────────── */}
                <LinearGradient colors={['#0d0d24', BG]} style={[s.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <Text style={s.headerTitle}>MI PERFIL</Text>
                    <View style={{ width: 40 }} />
                </LinearGradient>

                {/* ── Profile Identity Card ───────────── */}
                {userStats && (
                    <View style={s.identityCard}>
                        {/* Avatar */}
                        <LinearGradient colors={[GOLD, '#B8860B']} style={s.avatarBorder}>
                            <View style={s.avatarInner}>
                                <Image source={{ uri: avatarUri }} style={s.avatar} />
                            </View>
                        </LinearGradient>

                        {/* Name & role */}
                        <Text style={s.username}>@{userStats.username}</Text>
                        {userStats.full_name && <Text style={s.fullName}>{userStats.full_name}</Text>}

                        <View style={s.roleChip}>
                            <Ionicons name="shield-checkmark" size={12} color={GOLD} style={{ marginRight: 4 }} />
                            <Text style={s.roleText}>{userStats.role || 'GUERRERO BÍBLICO'}</Text>
                        </View>

                        {/* Stat pills */}
                        <View style={s.statsRow}>
                            <LinearGradient colors={['rgba(212,175,55,0.15)', 'rgba(212,175,55,0.04)']} style={s.statPill}>
                                <Ionicons name="flash" size={14} color={GOLD} />
                                <Text style={s.statNum}>{(userStats.total_xp || 0).toLocaleString()}</Text>
                                <Text style={s.statLabel}>XP</Text>
                            </LinearGradient>
                            <LinearGradient colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.04)']} style={s.statPill}>
                                <Ionicons name="trophy" size={14} color="#FFD700" />
                                <Text style={[s.statNum, { color: '#FFD700' }]}>{userStats.total_trophies || 0}</Text>
                                <Text style={s.statLabel}>TROFEOS</Text>
                            </LinearGradient>
                            <LinearGradient colors={['rgba(94,22,181,0.2)', 'rgba(94,22,181,0.05)']} style={s.statPill}>
                                <Ionicons name="medal" size={14} color="#9B59B6" />
                                <Text style={[s.statNum, { color: '#9B59B6' }]}>{level}</Text>
                                <Text style={s.statLabel}>NIVEL</Text>
                            </LinearGradient>
                        </View>

                        {/* XP Bar */}
                        <View style={s.xpBarContainer}>
                            <View style={s.xpBarRow}>
                                <Text style={s.xpBarLabel}>Progreso al nivel {level + 1}</Text>
                                <Text style={s.xpBarPct}>{Math.round(progress)}%</Text>
                            </View>
                            <View style={s.xpBarBg}>
                                <View style={[s.xpBarFill, { width: `${progress}%` }]} />
                            </View>
                        </View>
                    </View>
                )}

                {/* ── Church Section ──────────────────── */}
                <View style={s.sectionHeader}>
                    <View style={s.sectionLine} />
                    <Text style={s.sectionTitle}>🏛 MI IGLESIA</Text>
                    <View style={s.sectionLine} />
                </View>

                {!church ? (
                    /* Create church form */
                    <View style={s.card}>
                        <View style={s.cardTitleRow}>
                            <View style={s.cardIconBg}>
                                <Ionicons name="add-circle" size={22} color={GOLD} />
                            </View>
                            <Text style={s.cardTitle}>Fundar Iglesia</Text>
                        </View>
                        <Text style={s.cardDesc}>
                            Aún no formas parte de una iglesia. Crea la tuya para competir en el ranking junto a tu equipo.
                        </Text>

                        <LabelInput label="NOMBRE DE LA IGLESIA *" icon="home-outline" value={churchName} onChangeText={setChurchName} placeholder="Ej: Iglesia Berea Central" />
                        <LabelInput label="CIUDAD" icon="location-outline" value={churchCity} onChangeText={setChurchCity} placeholder="Ej: Bogotá" />
                        <LabelInput label="DIRECCIÓN (OPCIONAL)" icon="map-outline" value={churchAddress} onChangeText={setChurchAddress} placeholder="Calle 123 #45-67" />
                        <LabelInput label="TELÉFONO (OPCIONAL)" icon="call-outline" value={churchPhone} onChangeText={setChurchPhone} placeholder="+57 300..." keyboard="phone-pad" />

                        <TouchableOpacity style={s.primaryBtn} onPress={handleCreateChurch} disabled={actionLoading} activeOpacity={0.8}>
                            <LinearGradient colors={[GOLD, '#B8860B']} style={s.primaryBtnInner}>
                                {actionLoading
                                    ? <ActivityIndicator color="#000" />
                                    : <>
                                        <Ionicons name="flag" size={18} color="#000" style={{ marginRight: 8 }} />
                                        <Text style={s.primaryBtnText}>FUNDAR IGLESIA</Text>
                                    </>
                                }
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Manage church */
                    <View style={s.card}>
                        <LinearGradient colors={['rgba(212,175,55,0.1)', 'transparent']} style={s.churchBanner}>
                            <View style={s.churchIconBg}>
                                <Ionicons name="home" size={28} color={GOLD} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.churchName}>{church.name}</Text>
                                {church.city && <Text style={s.churchMeta}>{church.city}</Text>}
                            </View>
                            <View style={s.verifiedBadge}>
                                <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                                <Text style={s.verifiedTxt}>ACTIVA</Text>
                            </View>
                        </LinearGradient>

                        <Text style={s.cardDesc}>
                            Como líder, puedes añadir miembros buscando su nombre de usuario (GameTag). Ellos quedarán enlazados a tu iglesia y competirán en el ranking local.
                        </Text>

                        <View style={s.divider} />

                        <Text style={s.miniLabel}>INVITAR MIEMBRO</Text>
                        <View style={s.inviteRow}>
                            <View style={s.inviteInputWrap}>
                                <Ionicons name="at" size={16} color="#555" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={s.inviteInput}
                                    value={inviteUsername}
                                    onChangeText={setInviteUsername}
                                    placeholder="username del jugador"
                                    placeholderTextColor="#444"
                                    autoCapitalize="none"
                                />
                            </View>
                            <TouchableOpacity style={s.inviteBtn} onPress={handleInviteUser} disabled={actionLoading} activeOpacity={0.85}>
                                <LinearGradient colors={[GOLD, '#B8860B']} style={s.inviteBtnInner}>
                                    {actionLoading
                                        ? <ActivityIndicator color="#000" size="small" />
                                        : <Ionicons name="person-add" size={18} color="#000" />
                                    }
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* ── Danger Zone ─────────────────────── */}
                <View style={s.sectionHeader}>
                    <View style={s.sectionLine} />
                    <Text style={s.sectionTitle}>⚙ CUENTA</Text>
                    <View style={s.sectionLine} />
                </View>

                <TouchableOpacity
                    style={s.dangerBtn}
                    onPress={() => Alert.alert(
                        'Cerrar Sesión',
                        '¿Estás seguro que deseas salir?',
                        [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Salir', style: 'destructive', onPress: async () => { await supabase.auth.signOut(); navigation.replace('Auth'); } }
                        ]
                    )}
                    activeOpacity={0.8}
                >
                    <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
                    <Text style={s.dangerText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingBottom: 20,
    },
    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },
    headerTitle: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },

    // Identity card
    identityCard: {
        alignItems: 'center', marginHorizontal: 16, marginBottom: 32,
        backgroundColor: SURFACE, borderRadius: 28, padding: 24,
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)',
    },
    avatarBorder: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    avatarInner: { width: 82, height: 82, borderRadius: 41, backgroundColor: '#0a0a18', overflow: 'hidden' },
    avatar: { width: '100%', height: '100%' },
    username: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 4, letterSpacing: 0.5 },
    fullName: { color: '#666', fontSize: 14, marginBottom: 10 },
    roleChip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(212,175,55,0.1)', paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', marginBottom: 20,
    },
    roleText: { color: GOLD, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, width: '100%' },
    statPill: {
        flex: 1, alignItems: 'center', paddingVertical: 12,
        borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 2,
    },
    statNum: { color: GOLD, fontSize: 18, fontWeight: '900' },
    statLabel: { color: '#555', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
    xpBarContainer: { width: '100%' },
    xpBarRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    xpBarLabel: { color: '#555', fontSize: 11, fontWeight: '700' },
    xpBarPct: { color: GOLD, fontSize: 11, fontWeight: '900' },
    xpBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
    xpBarFill: { height: '100%', backgroundColor: GOLD, borderRadius: 3 },

    // Section headers
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 16, marginBottom: 16, gap: 12,
    },
    sectionLine: { flex: 1, height: 1, backgroundColor: BORDER },
    sectionTitle: { color: '#555', fontSize: 11, fontWeight: '800', letterSpacing: 1 },

    // Card
    card: {
        backgroundColor: SURFACE, marginHorizontal: 16,
        borderRadius: 24, padding: 22, borderWidth: 1, borderColor: BORDER,
        marginBottom: 28,
    },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    cardIconBg: {
        width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(212,175,55,0.1)',
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
    cardDesc: { color: '#666', fontSize: 14, lineHeight: 22, marginBottom: 20 },

    // Primary btn
    primaryBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
    primaryBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
    primaryBtnText: { color: '#000', fontSize: 15, fontWeight: '900', letterSpacing: 1 },

    // Church banner
    churchBanner: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 16,
        padding: 16, marginBottom: 16, gap: 12, borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)',
    },
    churchIconBg: {
        width: 50, height: 50, borderRadius: 14,
        backgroundColor: 'rgba(212,175,55,0.1)', alignItems: 'center', justifyContent: 'center',
    },
    churchName: { color: '#fff', fontSize: 16, fontWeight: '900' },
    churchMeta: { color: '#888', fontSize: 12, marginTop: 2 },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    verifiedTxt: { color: '#2ecc71', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    divider: { height: 1, backgroundColor: BORDER, marginVertical: 16 },
    miniLabel: { color: '#555', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
    inviteRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    inviteInputWrap: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14,
        borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 14,
    },
    inviteInput: { flex: 1, color: '#fff', fontSize: 15 },
    inviteBtn: { borderRadius: 14, overflow: 'hidden' },
    inviteBtnInner: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },

    // Danger
    dangerBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginHorizontal: 16, paddingVertical: 16, borderRadius: 16,
        backgroundColor: 'rgba(231,76,60,0.07)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.2)',
        gap: 10,
    },
    dangerText: { color: '#e74c3c', fontSize: 15, fontWeight: '800' },
});

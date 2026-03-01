import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';

export const RankingDashboardScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'LOCAL' | 'GLOBAL'>('LOCAL');
    const [localRanking, setLocalRanking] = useState([]);
    const [globalRanking, setGlobalRanking] = useState([]);
    const [userStats, setUserStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigation.replace('Auth');
                return;
            }

            // Fetch current user stats first to know their church
            let userData = null;
            const { data: fetchedUser, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!userError && fetchedUser) {
                userData = fetchedUser;
                setUserStats(fetchedUser as any);
            }

            // Fetch LOCAL ranking (players within the same church)
            if (userData?.church_id) {
                const { data: localData, error: localError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('church_id', userData.church_id)
                    .order('total_trophies', { ascending: false });

                if (!localError && localData) {
                    setLocalRanking(localData as never[]);
                }
            }

            // Fetch GLOBAL ranking (Churches against Churches)
            const { data: globalData, error: globalError } = await supabase
                .from('church_global_ranking')
                .select('*')
                .order('total_church_trophies', { ascending: false });

            if (!globalError && globalData) {
                setGlobalRanking(globalData as never[]);
            }

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.replace('Home');
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: insets.top + 20 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Impact Dashboard</Text>
                    <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                        <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>

                {/* Profile Section */}
                <View style={styles.profileContainer}>
                    <View style={styles.profileCard}>
                        <View style={styles.avatarGlow}>
                            <Ionicons name="person" size={32} color={theme.colors.textSecondary} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.username}>{userStats?.username || 'Gamer Nuevo'}</Text>
                            <View style={styles.xpBadge}>
                                <Ionicons name="star" size={14} color={theme.colors.primary} />
                                <Text style={styles.xpText}>{userStats?.total_xp || 0} XP Total</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.explicitProfileBtn}
                        onPress={() => navigation.navigate('Profile')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="settings-outline" size={20} color="#000" />
                        <Text style={styles.explicitProfileBtnText}>AJUSTES DE IGLESIA Y PERFIL</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'LOCAL' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('LOCAL')}
                    >
                        <Text style={[styles.tabText, activeTab === 'LOCAL' && styles.tabTextActive]}>MI IGLESIA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'GLOBAL' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('GLOBAL')}
                    >
                        <Text style={[styles.tabText, activeTab === 'GLOBAL' && styles.tabTextActive]}>GLOBAL (IGLESIAS)</Text>
                    </TouchableOpacity>
                </View>

                {/* Ranking List */}
                <View style={styles.rankingList}>
                    {activeTab === 'LOCAL' && !userStats?.church_id && (
                        <Text style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
                            Aún no formas parte de una iglesia. ¡Ve a tu Perfil y crea una o pide que te inviten para competir!
                        </Text>
                    )}

                    {activeTab === 'LOCAL' ? (
                        localRanking.map((item: any, index: number) => {
                            const isTop1 = index === 0;
                            const isTop2 = index === 1;
                            const isTop3 = index === 2;
                            let rankColor = theme.colors.border;
                            if (isTop1) rankColor = '#FFB800';
                            if (isTop2) rankColor = '#C0C0C0';
                            if (isTop3) rankColor = '#CD7F32';

                            return (
                                <View key={item.id} style={[styles.rankItem, userStats?.id === item.id && styles.rankItemActive]}>
                                    <View style={[styles.rankBadge, { borderColor: rankColor }]}>
                                        <Text style={[styles.rankNum, { color: rankColor }]}>#{index + 1}</Text>
                                    </View>
                                    <Text style={styles.rankName}>{item.username}</Text>
                                    <View style={styles.trophyScore}>
                                        <Text style={styles.trophiesVal}>{item.total_trophies || 0}</Text>
                                        <Ionicons name="trophy" size={16} color="#FFB800" />
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        globalRanking.map((item: any, index: number) => {
                            const isTop1 = index === 0;
                            const isTop2 = index === 1;
                            const isTop3 = index === 2;
                            let rankColor = theme.colors.border;
                            if (isTop1) rankColor = '#FFB800';
                            if (isTop2) rankColor = '#C0C0C0';
                            if (isTop3) rankColor = '#CD7F32';

                            return (
                                <View key={item.church_id} style={[styles.rankItem, userStats?.church_id === item.church_id && styles.rankItemActive]}>
                                    <View style={[styles.rankBadge, { borderColor: rankColor }]}>
                                        <Text style={[styles.rankNum, { color: rankColor }]}>#{index + 1}</Text>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.rankName}>{item.church_name}</Text>
                                        {item.city && <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{item.city}</Text>}
                                    </View>
                                    <View style={styles.trophyScore}>
                                        <Text style={styles.trophiesVal}>{item.total_church_trophies || 0}</Text>
                                        <Ionicons name="trophy" size={16} color="#FFB800" />
                                    </View>
                                </View>
                            );
                        })
                    )}

                    {activeTab === 'LOCAL' && userStats?.church_id && localRanking.length === 0 && (
                        <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 20 }}>
                            Aún no hay puntos en el ranking de tu iglesia. ¡Juega para ser el primero!
                        </Text>
                    )}

                    {activeTab === 'GLOBAL' && globalRanking.length === 0 && (
                        <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 20 }}>
                            El ranking global está vacío. ¡Crea una iglesia primero!
                        </Text>
                    )}
                </View>

                {/* Gamification Guide Link */}
                <TouchableOpacity
                    style={styles.guideButton}
                    onPress={() => navigation.navigate('SystemGuide')}
                    activeOpacity={0.8}
                >
                    <View style={styles.guideIconBg}>
                        <Ionicons name="information" size={24} color={theme.colors.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={styles.guideTitle}>¿Cómo ganar puntos y subir?</Text>
                        <Text style={styles.guideSub}>Ver guía jerárquica de XP y Trofeos</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    backgroundColor: theme.colors.primary,
                    padding: 18,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 5,
                }}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.9}
            >
                <Ionicons name="settings" size={24} color="#000" style={{ marginRight: 10 }} />
                <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>ENTRAR A MI PERFIL E IGLESIA</Text>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    iconBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    profileContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 20,
        borderRadius: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    explicitProfileBtn: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
    },
    explicitProfileBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
        marginLeft: 8,
    },
    avatarGlow: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInfo: {
        marginLeft: 16,
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(206, 172, 92, 0.1)', // Primary tint
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    xpText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    tabBtnActive: {
        backgroundColor: 'rgba(206, 172, 92, 0.15)',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
        fontSize: 14,
    },
    tabTextActive: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginRight: 8,
    },
    rankingList: {
        paddingHorizontal: 20,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    rankItemActive: {
        backgroundColor: 'rgba(206, 172, 92, 0.1)',
        borderColor: theme.colors.primary,
    },
    rankBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    rankNum: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    rankName: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    trophyScore: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    trophiesVal: {
        color: '#FFB800',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 4,
    },
    guideButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A0A0A',
        marginHorizontal: 20, marginTop: 40, marginBottom: 20, padding: 18,
        borderRadius: 20, borderWidth: 1, borderColor: '#1A1A1A',
    },
    guideIconBg: {
        width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(206, 172, 92, 0.1)',
        alignItems: 'center', justifyContent: 'center',
    },
    guideTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
    guideSub: { color: '#888', fontSize: 12, marginTop: 4, fontWeight: '500' },
});

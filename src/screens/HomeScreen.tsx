import React, { useCallback, useEffect, useState } from 'react';
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText } from '../components';
import { supabase } from '../lib/supabase';
import { NotificationService } from '../services/NotificationService';
import { EditorialDoodle } from '../trivia/components/EditorialDoodle';

type Icon = React.ComponentProps<typeof Ionicons>['name'];

const levelInfo = (xp: number) => {
    let level = 1;
    let next = 100;
    let start = 0;
    while (xp >= next && level < 100) {
        start = next;
        level++;
        next += level * 100;
    }
    return {
        level,
        next,
        progress: Math.min(100, Math.max(0, ((xp - start) / (next - start)) * 100)),
    };
};

export const HomeScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [userData, setUserData] = useState<any>(null);
    const lv = levelInfo(userData?.total_xp || 0);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            const load = async () => {
                try {
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) {
                        if (active) setUserData(null);
                        return;
                    }
                    const { data } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                    if (active) setUserData(data);
                } catch {
                    /* Guests can still play with local content. */
                }
            };
            load();
            return () => {
                active = false;
            };
        }, [])
    );

    useEffect(() => {
        if (Platform.OS === 'web') return;
        NotificationService.registerForPushNotificationsAsync().catch(() => {});
    }, []);

    const openMemberScreen = (screen: 'Profile' | 'RankingDashboard') => {
        if (userData) navigation.navigate(screen);
        else {
            navigation.navigate('AuthRequired', {
                title:
                    screen === 'Profile'
                        ? 'Tu historia empieza aquí'
                        : 'Cada reto te lleva más alto',
                desc: 'Crea tu cuenta para guardar tu progreso, ganar insignias y compartir tus logros con la comunidad.',
            });
        }
    };

    const dockItems: { icon: Icon; label: string; action: () => void; active: boolean }[] = [
        { icon: 'grid-outline', label: 'Inicio', action: () => {}, active: true },
        {
            icon: 'book-outline',
            label: 'Estudio',
            action: () => navigation.navigate('StudyPaths'),
            active: false,
        },
        {
            icon: 'trophy-outline',
            label: 'Ranking',
            action: () => openMemberScreen('RankingDashboard'),
            active: false,
        },
    ];

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 112 }]}
            >
                {/* Top Bar minimalista */}
                <View style={s.topbar}>
                    <View style={s.brand}>
                        <View style={s.brandMark} accessibilityElementsHidden>
                            <View style={s.brandBlob} />
                            <View style={s.brandPageLeft} />
                            <View style={s.brandPageRight} />
                            <View style={s.brandSpark} />
                        </View>
                        <AppText style={s.brandName}>
                            berea<AppText style={s.brandDot}>.</AppText>
                        </AppText>
                    </View>

                    <View style={s.headerActions}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Abrir ajustes"
                            onPress={() => navigation.navigate('Settings')}
                            style={({ pressed }) => [s.iconButton, pressed && s.pressed]}
                        >
                            <Ionicons name="options-outline" size={20} color="#1B1E23" />
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Abrir mi perfil"
                            onPress={() => openMemberScreen('Profile')}
                            style={({ pressed }) => [s.avatar, pressed && s.pressed]}
                        >
                            <AppText style={s.avatarText}>
                                {(userData?.username || 'B').slice(0, 1).toUpperCase()}
                            </AppText>
                        </Pressable>
                    </View>
                </View>

                {/* Saludo limpio */}
                <View style={s.greetingBlock}>
                    <AppText style={s.eyebrow}>
                        HOLA, {(userData?.username || 'EXPLORADOR').toUpperCase()}
                    </AppText>
                    <AppText style={s.headline}>¿A qué jugamos hoy?</AppText>
                </View>

                {/* Máximo 3 botones de juego: Trivia (hero salvia) + Charadas (oro) + El impostor (acuarela) */}
                <View style={s.gamesStack}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Jugar Trivia bíblica"
                        onPress={() => navigation.navigate('Trivia')}
                        style={({ pressed }) => [s.heroGameCard, pressed && s.pressed]}
                    >
                        <View style={s.heroGameTop}>
                            <AppText style={s.heroGameTitle}>Trivia bíblica</AppText>
                            <EditorialDoodle kind="scroll" tint="#FFFFFF" size={64} />
                        </View>
                        <View style={s.heroGameFooter}>
                            <AppText style={s.heroGameAction}>Jugar</AppText>
                            <View style={s.navyCircle}>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </View>
                        </View>
                    </Pressable>

                    <View style={s.gridRow}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Jugar Charadas"
                            onPress={() =>
                                navigation.navigate('CategorySelection', { targetGame: 'charadas' })
                            }
                            style={({ pressed }) => [s.tileGold, pressed && s.pressed]}
                        >
                            <View style={s.tileTop}>
                                <EditorialDoodle kind="charades" tint="#FFFFFF" size={54} />
                            </View>
                            <AppText style={s.tileTitle}>Charadas</AppText>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Jugar El impostor"
                            onPress={() => navigation.navigate('ImpostorConfig')}
                            style={({ pressed }) => [s.tileBlue, pressed && s.pressed]}
                        >
                            <View style={s.tileTop}>
                                <EditorialDoodle kind="impostor" tint="#FFFFFF" size={54} />
                            </View>
                            <AppText style={s.tileTitle}>El impostor</AppText>
                        </Pressable>
                    </View>
                </View>

                {/* Bloque compacto de avance personal */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Ver mi perfil y nivel"
                    onPress={() => openMemberScreen('Profile')}
                    style={({ pressed }) => [s.progressCard, pressed && s.pressed]}
                >
                    <View style={s.progressRow}>
                        <View style={{ flex: 1, gap: 8 }}>
                            <View style={s.progressHeader}>
                                <AppText style={s.progressTitle}>Nivel {lv.level}</AppText>
                                <AppText style={s.progressXp}>
                                    {userData?.total_xp || 0} / {lv.next} XP
                                </AppText>
                            </View>
                            <View
                                accessibilityRole="progressbar"
                                accessibilityValue={{
                                    min: 0,
                                    max: 100,
                                    now: Math.round(lv.progress),
                                }}
                                accessibilityLabel="Progreso al siguiente nivel"
                                style={s.progressTrack}
                            >
                                <View
                                    style={[s.progressFill, { width: `${lv.progress}%` }]}
                                />
                            </View>
                        </View>
                        <EditorialDoodle kind="olive" tint="#DCECE8" size={48} />
                    </View>
                </Pressable>
            </ScrollView>

            {/* Dock inferior con máximo 3 botones */}
            <View style={[s.dockWrap, { bottom: Math.max(insets.bottom, 16) }]}>
                <View style={s.dock}>
                    {dockItems.map(item => (
                        <Pressable
                            key={item.label}
                            accessibilityRole="button"
                            accessibilityState={{ selected: item.active }}
                            accessibilityLabel={item.label}
                            onPress={item.action}
                            style={({ pressed }) => [
                                s.dockItem,
                                item.active && s.dockActive,
                                pressed && s.pressed,
                            ]}
                        >
                            <Ionicons
                                name={item.icon}
                                size={20}
                                color={item.active ? '#1E3A5F' : '#6E7785'}
                            />
                            <AppText
                                style={[
                                    s.dockLabel,
                                    item.active && { color: '#1E3A5F', fontWeight: '800' },
                                ]}
                            >
                                {item.label}
                            </AppText>
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    page: {
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingTop: 14,
    },
    topbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 26,
    },
    brand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    brandMark: {
        width: 34,
        height: 32,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandBlob: {
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#DCECE8',
        top: 5,
        right: 1,
    },
    brandPageLeft: {
        position: 'absolute',
        width: 14,
        height: 18,
        left: 3,
        top: 8,
        borderWidth: 2.2,
        borderColor: '#1B1E23',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 3,
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        transform: [{ skewY: '6deg' }],
    },
    brandPageRight: {
        position: 'absolute',
        width: 14,
        height: 18,
        right: 3,
        top: 8,
        borderWidth: 2.2,
        borderLeftWidth: 0,
        borderColor: '#1B1E23',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 3,
        transform: [{ skewY: '-6deg' }],
    },
    brandSpark: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F5DA7C',
        top: 2,
        alignSelf: 'center',
    },
    brandName: {
        fontSize: 26,
        lineHeight: 30,
        fontWeight: '800',
        letterSpacing: -1,
        color: '#1B1E23',
    },
    brandDot: {
        fontSize: 26,
        fontWeight: '800',
        color: '#3D8A7B',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DCECE8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    greetingBlock: {
        marginBottom: 22,
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#3D8A7B',
        marginBottom: 6,
    },
    headline: {
        fontSize: 30,
        lineHeight: 36,
        fontWeight: '800',
        letterSpacing: -0.8,
        color: '#1B1E23',
    },
    gamesStack: {
        gap: 14,
    },
    heroGameCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: '#DCECE8',
        gap: 20,
    },
    heroGameTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    heroGameTitle: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
        color: '#1B1E23',
    },
    heroGameFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroGameAction: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    navyCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridRow: {
        flexDirection: 'row',
        gap: 12,
    },
    tileGold: {
        flex: 1,
        borderRadius: 26,
        padding: 18,
        minHeight: 148,
        justifyContent: 'space-between',
        backgroundColor: '#F5DA7C',
    },
    tileBlue: {
        flex: 1,
        borderRadius: 26,
        padding: 18,
        minHeight: 148,
        justifyContent: 'space-between',
        backgroundColor: '#D6E8F8',
    },
    tileTop: {
        alignSelf: 'flex-end',
    },
    tileTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1B1E23',
    },
    progressCard: {
        marginTop: 18,
        borderRadius: 24,
        padding: 18,
        backgroundColor: '#F4F7F9',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1B1E23',
    },
    progressXp: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6E7785',
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E3E9F0',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: '#1E3A5F',
    },
    dockWrap: {
        position: 'absolute',
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    dock: {
        flexDirection: 'row',
        padding: 6,
        width: '100%',
        maxWidth: 360,
        borderRadius: 26,
        backgroundColor: '#F6F8FA',
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
    },
    dockItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 11,
        borderRadius: 20,
    },
    dockActive: {
        backgroundColor: '#DCECE8',
    },
    dockLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6E7785',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
});

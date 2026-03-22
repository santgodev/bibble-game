import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { AppText } from '../components';
import { supabase } from '../lib/supabase';
import { NotificationService } from '../services/NotificationService';

export const HomeScreen = ({ navigation }: any) => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const [userData, setUserData] = useState<any>(null);

    const goldPulse = useRef(new Animated.Value(0.4)).current;
    const redPulse = useRef(new Animated.Value(0.4)).current;
    const purplePulse = useRef(new Animated.Value(0.4)).current;
    const bluePulseValue = useRef(new Animated.Value(0.4)).current; // Fixed naming collision

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
            setUserData(data);
        }
    };

    const getLevelInfo = (xp: number) => {
        let level = 1;
        let xpForNext = 100;
        let xpCurrentLevelStart = 0;
        while (xp >= xpForNext && level < 100) {
            xpCurrentLevelStart = xpForNext;
            level++;
            xpForNext += level * 100;
        }
        const progress = ((xp - xpCurrentLevelStart) / (xpForNext - xpCurrentLevelStart)) * 100;
        return { level, progress, xpForNext };
    };

    const lv = getLevelInfo(userData?.total_xp || 0);

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    useEffect(() => {
        const goldLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(goldPulse, { toValue: 1, duration: 1600, useNativeDriver: false }), // Must be false for color interpolation
                Animated.timing(goldPulse, { toValue: 0.4, duration: 1600, useNativeDriver: false }),
            ])
        );
        const redLoop = Animated.loop(
            Animated.sequence([
                Animated.delay(800),
                Animated.timing(redPulse, { toValue: 1, duration: 1600, useNativeDriver: false }),
                Animated.timing(redPulse, { toValue: 0.4, duration: 1600, useNativeDriver: false }),
            ])
        );
        const purpleLoop = Animated.loop(
            Animated.sequence([
                Animated.delay(400),
                Animated.timing(purplePulse, { toValue: 1, duration: 1600, useNativeDriver: false }),
                Animated.timing(purplePulse, { toValue: 0.4, duration: 1600, useNativeDriver: false }),
            ])
        );
        const blueLoop = Animated.loop(
            Animated.sequence([
                Animated.delay(1200),
                Animated.timing(bluePulseValue, { toValue: 1, duration: 1600, useNativeDriver: false }),
                Animated.timing(bluePulseValue, { toValue: 0.4, duration: 1600, useNativeDriver: false }),
            ])
        );

        goldLoop.start();
        redLoop.start();
        purpleLoop.start();
        blueLoop.start();

        // Register Notifications
        NotificationService.registerForPushNotificationsAsync().then(() => {
            console.log('Notifications Registered');
            // Schedule a curiosity gap notification in 10 seconds for testing/wow effect
            NotificationService.scheduleCuriosityNotification(
                "¡Ojo al saldo! 😳",
                "Revisamos tu cuenta y alguien pagó el 100% de tu deuda de hoy. Tetelestai.",
                10
            );
        });
        
        return () => { goldLoop.stop(); redLoop.stop(); purpleLoop.stop(); blueLoop.stop(); };
    }, []);

    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

    const goldBorderColor = goldPulse.interpolate({
        inputRange: [0.4, 1],
        outputRange: ['rgba(212, 175, 55, 0.4)', 'rgba(212, 175, 55, 1)'], // Matches #D4AF37
    });

    const redBorderColor = redPulse.interpolate({
        inputRange: [0.4, 1],
        outputRange: ['rgba(231, 76, 60, 0.4)', 'rgba(231, 76, 60, 1)'],
    });

    const purpleBorderColor = purplePulse.interpolate({
        inputRange: [0.4, 1],
        outputRange: ['rgba(155, 89, 182, 0.4)', 'rgba(155, 89, 182, 1)'], // Matches #9B59B6
    });

    const blueBorderColor = bluePulseValue.interpolate({
        inputRange: [0.4, 1],
        outputRange: ['rgba(52, 152, 219, 0.4)', 'rgba(52, 152, 219, 1)'], // Blue for Trivia
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050505" />

            <LinearGradient
                colors={['#050505', '#0A0A1F', '#050505']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Background Glow Effects */}
            <View style={styles.glowContainer}>
                <Animated.View style={[styles.glow, {
                    backgroundColor: theme.colors.primary,
                    opacity: 0.08,
                    width: width * 1.2,
                    height: width * 1.2,
                    borderRadius: width,
                    top: -width * 0.4,
                    right: -width * 0.4,
                    transform: [{ scale: goldPulse }]
                }]} />
                <Animated.View style={[styles.glow, {
                    backgroundColor: '#E74C3C',
                    opacity: 0.06,
                    width: width * 0.8,
                    height: width * 0.8,
                    borderRadius: width,
                    bottom: height * 0.1,
                    left: -width * 0.2,
                    transform: [{ scale: redPulse }]
                }]} />
                <Animated.View style={[styles.glow, {
                    backgroundColor: '#3498DB',
                    opacity: 0.05,
                    width: width * 1.0,
                    height: width * 1.0,
                    borderRadius: width,
                    bottom: -width * 0.5,
                    right: -width * 0.2,
                    transform: [{ scale: bluePulseValue }]
                }]} />
            </View>

            {/* ── HEADER COMPACTO ── */}
            <View style={[styles.compactHeader, { paddingTop: insets.top + 10, paddingHorizontal: 20 }]}>
                <View style={styles.headerTopRow}>
                    <View style={styles.userInfoMini}>
                        <AppText style={styles.userNameMini}>¡HOLA, {userData?.username?.toUpperCase() || 'GUERRERO'}!</AppText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                             <AppText style={styles.userLevelMini}>NIVEL {lv.level}</AppText>
                             <View style={styles.xpBarContainer}>
                                 <View style={[styles.xpBarFill, { width: `${lv.progress}%` }]} />
                             </View>
                             <AppText style={[styles.userLevelMini, { opacity: 1 }]}>{userData?.total_xp || 0} XP</AppText>
                        </View>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {/* Racha Compacta pero Vibrante */}
                        <TouchableOpacity 
                            style={styles.streakPill}
                            onPress={() => navigation.navigate('Profile')}
                            activeOpacity={0.8}
                        >
                            <Animated.View style={{ transform: [{ scale: goldPulse }] }}>
                                <Ionicons name="flame" size={18} color="#FF4500" />
                            </Animated.View>
                            <AppText style={styles.streakValuePill}>{userData?.streak_count || 1}</AppText>
                            <AppText style={styles.streakLabelPill}>DÍAS</AppText>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Ionicons name="person-circle-outline" size={32} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botones de acción flotantes (Config, Ranking) */}
                <View style={styles.floatingActions}>
                    <TouchableOpacity
                        style={styles.actionPill}
                        onPress={() => {
                            if (userData) {
                                navigation.navigate('RankingDashboard');
                            } else {
                                navigation.navigate('AuthRequired', {
                                    title: "Ranking Mundial 🔥",
                                    desc: "Regístrate para ver tu posición mundial, comparar tus trofeos con otros guerreros y defender el honor de tu iglesia."
                                });
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trophy-outline" size={14} color="#FFB800" />
                        <AppText style={styles.actionPillText}>RANKING</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionPill}
                        onPress={() => {
                            if (userData) {
                                navigation.navigate('Profile');
                            } else {
                                navigation.navigate('AuthRequired', {
                                    title: "Perfil Maestro 👤",
                                    desc: "Crea tu perfil para evolucionar tu avatar, ganar insignias exclusivas y fundar tu propio clan bíblico."
                                });
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings-outline" size={14} color="rgba(255,255,255,0.6)" />
                        <AppText style={styles.actionPillText}>AJUSTES</AppText>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Season Countdown Header */}
                <View style={styles.seasonContentHeader}>
                    <View style={styles.seasonInfoRow}>
                        <AppText style={styles.seasonTitle}>TEMPORADA 1: REDENCIÓN</AppText>
                        <AppText style={styles.seasonTimer}>5D 12H</AppText>
                    </View>
                    <View style={styles.seasonBarBg}>
                        <LinearGradient 
                            colors={['#3498DB', '#2ECC71']} 
                            start={{x:0, y:0}} end={{x:1, y:0}}
                            style={[styles.seasonBarFill, { width: '65%' }]} 
                        />
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <AppText style={styles.bereaBrand}>BEREA</AppText>
                    <AppText style={styles.titleTop}>ADN</AppText>
                    <AppText style={styles.titleBottom}>JUEGOS</AppText>
                    <View style={styles.divider} />
                    <AppText style={styles.subtitle}>Aprende Jugando</AppText>
                </View>

                {/* Charadas Button with pulsing gold border */}
                <View style={styles.btnWrapper}>
                    <AnimatedTouchableOpacity
                        style={[styles.playButton, { borderColor: goldBorderColor }]}
                        onPress={() => navigation.navigate('CategorySelection', { targetGame: 'charadas' })}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="mic" size={20} color={theme.colors.primary} style={{ marginRight: 10 }} />
                        <AppText style={styles.playButtonText}>CHARADAS</AppText>
                    </AnimatedTouchableOpacity>
                </View>

                {/* Impostor Button with pulsing red border */}
                <View style={[styles.btnWrapper, { marginTop: 14 }]}>
                    <AnimatedTouchableOpacity
                        style={[styles.playButton, { borderColor: redBorderColor, backgroundColor: 'rgba(231, 76, 60, 0.05)' }]}
                        onPress={() => navigation.navigate('ImpostorConfig')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="eye-off" size={20} color="#e74c3c" style={{ marginRight: 10 }} />
                        <AppText style={[styles.playButtonText, { color: '#e74c3c' }]}>EL IMPOSTOR</AppText>
                    </AnimatedTouchableOpacity>
                </View>

                {/* Trivia Button with pulsing blue border and NEW badge */}
                <View style={[styles.btnWrapper, { marginTop: 14 }]}>
                    <AnimatedTouchableOpacity
                        style={[styles.playButton, { borderColor: blueBorderColor, backgroundColor: 'rgba(52, 152, 219, 0.05)' }]}
                        onPress={() => navigation.navigate('CategorySelection', { targetGame: 'trivia' })}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="help-buoy" size={20} color="#3498DB" style={{ marginRight: 10 }} />
                        <AppText style={[styles.playButtonText, { color: '#3498DB' }]}>TRIVIA BÍBLICA</AppText>
                        
                        <View style={styles.newBadge}>
                            <AppText style={styles.newBadgeText}>NUEVO</AppText>
                        </View>
                    </AnimatedTouchableOpacity>
                </View>

                {/* Study Paths Button */}
                <View style={[styles.btnWrapper, { marginTop: 14 }]}>
                    <AnimatedTouchableOpacity
                        style={[styles.playButton, { borderColor: purpleBorderColor, backgroundColor: 'rgba(155, 89, 182, 0.05)' }]}
                        onPress={() => navigation.navigate('StudyPaths')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="library" size={20} color="#9B59B6" style={{ marginRight: 10 }} />
                        <AppText style={[styles.playButtonText, { color: '#9B59B6' }]}>RUTAS DE ESTUDIO</AppText>
                    </AnimatedTouchableOpacity>
                </View>

                {/* Próxima Recompensa Card */}
                <View style={styles.rewardUnlockCard}>
                    <View style={styles.unlockIconBg}>
                        <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.3)" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <AppText style={styles.unlockTitle}>PRÓXIMO DESBLOQUEO</AppText>
                        <AppText style={styles.unlockDesc}>
                            Avatar "Guerrero Neón" • Nivel {lv.level + 1}
                        </AppText>
                        <View style={styles.miniProgressLine}>
                            <View style={[styles.miniProgressFill, { width: `${lv.progress}%` }]} />
                        </View>
                    </View>
                    <View style={styles.xpToNextLabel}>
                        <AppText style={styles.xpToNextText}>Faltan {lv.xpForNext - (userData?.total_xp || 0)} XP</AppText>
                    </View>
                </View>
            </View>

            {/* Footer — Branding */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <AppText style={styles.brandName}>BEREA GAMES</AppText>
                <AppText style={styles.brandSub}>Seminario Bíblico Berea • v2.0</AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    glowContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', zIndex: 0 },
    glow: { position: 'absolute' },
    compactHeader: { backgroundColor: 'rgba(0,0,0,0.3)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
    headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    userInfoMini: { flex: 1 },
    userNameMini: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
    userLevelMini: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '800' },
    xpBarContainer: { width: 60, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
    xpBarFill: { height: '100%', backgroundColor: '#FFD700', borderRadius: 2 },
    streakPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,69,0,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, gap: 4, borderWidth: 1, borderColor: 'rgba(255,69,0,0.2)' },
    streakValuePill: { color: '#FF4500', fontWeight: '900', fontSize: 14 },
    streakLabelPill: { color: 'rgba(255,69,0,0.6)', fontWeight: '900', fontSize: 8 },
    floatingActions: { flexDirection: 'row', gap: 10, marginTop: 15 },
    actionPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    actionPillText: { color: '#888', fontWeight: '900', fontSize: 10, letterSpacing: 1 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10, paddingHorizontal: 20 },
    seasonContentHeader: { alignSelf: 'stretch', marginBottom: 25, backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    seasonInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    seasonTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    seasonTimer: { color: '#3498DB', fontSize: 11, fontWeight: '900' },
    seasonBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
    seasonBarFill: { height: '100%', borderRadius: 3 },
    titleContainer: { alignItems: 'center', marginBottom: 30 },
    bereaBrand: { fontSize: 10, fontWeight: '900', color: theme.colors.primary, letterSpacing: 5, marginBottom: 5 },
    titleTop: { fontSize: 32, fontWeight: '300', color: '#fff', letterSpacing: 8, marginBottom: -5 },
    titleBottom: { fontSize: 48, fontWeight: '700', color: '#B8860B', letterSpacing: 2 },
    divider: { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
    subtitle: { fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' },
    btnWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
    playButton: { backgroundColor: 'transparent', borderWidth: 1, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, minWidth: 240, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
    playButtonText: { fontWeight: '900', letterSpacing: 1.5, fontSize: 14, textTransform: 'uppercase' },
    newBadge: { position: 'absolute', top: -10, right: -10, backgroundColor: '#E74C3C', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, transform: [{ rotate: '10deg' }], elevation: 5 },
    newBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
    rewardUnlockCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', marginTop: 30, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 15, width: '100%' },
    unlockIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
    unlockTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
    unlockDesc: { color: '#fff', fontSize: 13, fontWeight: '800', marginTop: 2 },
    miniProgressLine: { height: 4, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 2, marginTop: 10, overflow: 'hidden' },
    miniProgressFill: { height: '100%', backgroundColor: '#D4AF37', borderRadius: 2 },
    xpToNextLabel: { backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    xpToNextText: { color: '#D4AF37', fontSize: 10, fontWeight: '900' },
    footer: { alignItems: 'center', paddingVertical: 20 },
    brandName: { fontSize: 13, fontWeight: '800', color: '#4A90D9', letterSpacing: 4, textTransform: 'uppercase' },
    brandSub: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 },
});

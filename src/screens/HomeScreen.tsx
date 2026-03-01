import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { AppText } from '../components';

export const HomeScreen = ({ navigation }: any) => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Pulsating glow animations
    const goldPulse = useRef(new Animated.Value(0.4)).current;
    const redPulse = useRef(new Animated.Value(0.4)).current;
    const purplePulse = useRef(new Animated.Value(0.4)).current;

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
        goldLoop.start();
        redLoop.start();
        purpleLoop.start();
        return () => { goldLoop.stop(); redLoop.stop(); purpleLoop.stop(); };
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

            {/* Background Glow Effect */}
            <View style={styles.glowContainer}>
                <View style={[styles.glow, {
                    backgroundColor: theme.colors.primary,
                    opacity: 0.05,
                    width: width * 1.5,
                    height: width * 1.5,
                    borderRadius: width,
                    top: -width * 0.5,
                    left: -width * 0.25,
                }]} />
            </View>

            {/* Header / Config & Ranking & Profile */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                {/* PROFILE BUTTON */}
                <TouchableOpacity
                    style={[styles.settingsButton, { marginRight: 12, backgroundColor: 'rgba(212, 175, 55, 0.2)', borderWidth: 1, borderColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('Profile')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="person" size={20} color={theme.colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.settingsButton, { marginRight: 12 }]}
                    onPress={() => navigation.navigate('RankingDashboard')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trophy-outline" size={24} color="#FFB800" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Settings')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="settings-outline" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
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
                        onPress={() => navigation.navigate('CategorySelection')}
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
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    glowContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        zIndex: 0,
    },
    glow: {
        position: 'absolute',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: theme.spacing.l,
        zIndex: 10,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        paddingHorizontal: theme.spacing.xl,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxxl,
    },
    titleTop: {
        ...theme.typography.display,
        fontSize: 32,
        fontWeight: '300',
        color: theme.colors.text,
        letterSpacing: 8,
        marginBottom: -5,
    },
    titleBottom: {
        ...theme.typography.display,
        fontSize: 48,
        fontWeight: '700',
        color: theme.colors.primary,
        letterSpacing: 2,
    },
    divider: {
        width: 40,
        height: 2,
        backgroundColor: theme.colors.textSecondary,
        marginVertical: theme.spacing.l,
    },
    subtitle: {
        ...theme.typography.caption,
        fontSize: 14,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: theme.colors.textSecondary,
    },
    playButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.xxl,
        borderRadius: theme.borderRadius.s,
        minWidth: 220,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    playButtonText: {
        ...theme.typography.button,
        color: theme.colors.primary,
    },
    studyButton: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: '#1E1E1E',
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.xxl,
        borderRadius: theme.borderRadius.s,
        minWidth: 200,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 14,
    },
    studyButtonText: {
        ...theme.typography.button,
        color: '#fff',
        fontSize: 14,
        letterSpacing: 2,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.m,
    },
    versionText: {
        ...theme.typography.caption,
        color: theme.colors.surfaceHighlight,
    },
    btnWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Footer branding
    brandName: {
        fontSize: 13,
        fontWeight: '800',
        color: '#4A90D9',          // Azul Berea
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    brandSub: {
        fontSize: 10,
        color: '#444',
        letterSpacing: 1.5,
        marginTop: 4,
    },
    bereaBrand: {
        fontSize: 11,
        fontWeight: '700',
        color: '#4A90D9',
        letterSpacing: 6,
        textTransform: 'uppercase',
        marginBottom: 4,
        opacity: 0.8,
    },
});

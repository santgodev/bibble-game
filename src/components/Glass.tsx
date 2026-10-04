import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';

// Static light fields avoid continuous GPU animations during gameplay.
export const GlassBackground = () => (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.background}>
        <LinearGradient colors={['#F0E7DD', '#E6E2E5', '#DDE9E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={[styles.halo, styles.lilac]} />
        <View style={[styles.halo, styles.mint]} />
        <View style={[styles.halo, styles.peach]} />
        <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(240,235,230,0.5)', 'rgba(255,255,255,0.12)']} style={StyleSheet.absoluteFill} />
    </View>
);

// Android uses layered translucency to keep scrolling and gameplay inexpensive.
export const GlassSheen = ({ tint = 'neutral', blur = false }: { tint?: 'neutral' | 'violet' | 'mint' | 'rose'; blur?: boolean }) => {
    const colors: [string, string, string] = tint === 'violet'
        ? ['rgba(255,255,255,0.76)', 'rgba(180,245,200,0.30)', 'rgba(137,223,160,0.32)']
        : tint === 'mint'
        ? ['rgba(255,255,255,0.8)', 'rgba(177,231,222,0.24)', 'rgba(131,210,207,0.34)']
        : tint === 'rose'
        ? ['rgba(255,255,255,0.8)', 'rgba(239,198,207,0.28)', 'rgba(211,181,227,0.28)']
        : ['rgba(255,255,255,0.48)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.26)'];
    return (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: 28, overflow: 'hidden' }]}>
            {blur && Platform.OS !== 'android' && <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />}
            <LinearGradient colors={colors} locations={[0, 0.48, 1]} start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.edge} />
        </View>
    );
};
export const GlassPanel = ({ children, style, tint, blur = false }: {
    children: React.ReactNode; style?: StyleProp<ViewStyle>;
    tint?: 'neutral' | 'violet' | 'mint' | 'rose'; blur?: boolean;
}) => (
    <View style={[styles.panel, style]}>
        <GlassSheen tint={tint} blur={blur} />
        {children}
    </View>
);
const styles = StyleSheet.create({
    background: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
    halo: { position: 'absolute', borderRadius: 500, ...(Platform.OS === 'web' ? { filter: 'blur(70px)' } as ViewStyle : {}) },
    lilac: { width: 540, height: 540, right: -190, top: -190, backgroundColor: '#68A877', opacity: 0.12 },
    mint: { width: 450, height: 450, right: -140, bottom: -180, backgroundColor: '#45834D', opacity: 0.12 },
    peach: { width: 400, height: 400, left: -200, top: '35%', backgroundColor: '#044D32', opacity: 0.1 },
    panel: { borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', backgroundColor: 'rgba(255,255,255,0.16)', ...theme.shadows.default },
    edge: { ...StyleSheet.absoluteFill, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'rgba(255,255,255,0.95)', borderLeftColor: 'rgba(255,255,255,0.7)' },
});

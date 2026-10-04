import React from 'react';
import { Pressable, StyleSheet, ViewStyle, ActivityIndicator, StyleProp, TextStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { AppText } from './AppText';

interface ButtonProps {
    title: string; onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    disabled?: boolean; loading?: boolean;
    style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle>;
}
export const Button = ({ title, onPress, variant = 'primary', disabled, loading, style, textStyle }: ButtonProps) => {
    const { colors, theme } = useTheme();
    const solid = variant !== 'outline';
    const ink = disabled ? colors.textSecondary : solid ? '#FFFFFF' : colors.primary;
    const gradient: [string, string, string] = disabled ? ['#DDDAE4', '#D4D0DB', '#E0DDE5']
        : variant === 'secondary' ? ['#64BCB5', '#187D80', '#21918F']
        : variant === 'danger' ? ['#D17D94', '#AC3D5D', '#BC5876']
        : variant === 'outline' ? ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.22)', 'rgba(255,255,255,0.55)']
        : ['#AEDBB8', '#8FCA97', '#68A877'];
    return (
        <Pressable accessibilityRole="button" accessibilityLabel={title}
            accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
            disabled={disabled || loading}
            onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onPress();
            }}
            style={({ pressed }) => [styles.button, theme.shadows.soft, { opacity: disabled ? 0.65 : pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>
            <LinearGradient pointerEvents="none" colors={gradient} style={[StyleSheet.absoluteFill, { borderRadius: 26 }]} />
            {loading ? <ActivityIndicator color={ink} /> : <AppText variant="button" centered style={[{ color: ink }, textStyle]}>{title}</AppText>}
        </Pressable>
    );
};
const styles = StyleSheet.create({
    button: { paddingVertical: 15, paddingHorizontal: 24, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', minHeight: 52 },
});

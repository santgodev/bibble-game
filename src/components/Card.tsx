import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, StyleProp } from 'react-native';
import { theme } from '../theme';
import { GlassSheen } from './Glass';

interface CardProps {
    children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void;
    variant?: 'elevated' | 'outlined' | 'flat';
}
export const Card = ({ children, style, onPress, variant = 'elevated' }: CardProps) => {
    const cardStyle = [styles.card, variant === 'elevated' && theme.shadows.default, style];
    const content = <><GlassSheen />{children}</>;
    return onPress
        ? <TouchableOpacity accessibilityRole="button" style={cardStyle} onPress={onPress} activeOpacity={0.85}>{content}</TouchableOpacity>
        : <View style={cardStyle}>{content}</View>;
};
const styles = StyleSheet.create({
    card: { borderRadius: 28, padding: 20, marginVertical: 8, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: 'rgba(255,255,255,0.18)' },
});

import React from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme';

interface AppTextProps extends TextProps {
    variant?: keyof typeof typography;
    color?: string;
    centered?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({
    children,
    variant = 'body',
    style,
    color,
    centered,
    ...props
}) => {
    const { colors } = useTheme();

    const baseStyle = typography[variant];
    const flattenedStyle = StyleSheet.flatten(style);

    const clearLineHeight = Boolean(flattenedStyle?.fontSize && !flattenedStyle?.lineHeight);

    const textStyle: TextStyle = {
        ...baseStyle,
        color: color || colors.text,
        textAlign: centered ? 'center' : 'auto',
        ...(clearLineHeight ? { lineHeight: undefined } : {}),
    };

    return (
        <Text style={[textStyle, style]} {...props}>
            {children}
        </Text>
    );
};

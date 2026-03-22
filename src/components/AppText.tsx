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

    const textStyle: TextStyle = {
        ...baseStyle,
        color: color || colors.text,
        textAlign: centered ? 'center' : 'auto',
    };

    // If a custom fontSize is provided but no custom lineHeight is provided,
    // we unset the base variant's lineHeight to prevent vertical clipping.
    if (flattenedStyle?.fontSize && !flattenedStyle?.lineHeight) {
        textStyle.lineHeight = undefined;
    }

    return (
        <Text style={[textStyle, style]} {...props}>
            {children}
        </Text>
    );
};

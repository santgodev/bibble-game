import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components';
import { theme } from '../../theme';

interface TriviaHeaderProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    onBack: () => void;
    backLabel?: string;
    rightBadge?: string;
    variant?: 'glass' | 'clean';
}

export const TriviaHeader = ({
    eyebrow = 'TRIVIA BÍBLICA',
    title,
    subtitle,
    onBack,
    backLabel = 'Volver',
    rightBadge,
    variant = 'glass',
}: TriviaHeaderProps) => {
    const isClean = variant === 'clean';
    return (
        <View style={s.wrapper}>
            <View style={s.row}>
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={backLabel}
                    onPress={onBack}
                    style={[s.backButton, isClean && s.backButtonClean]}
                    activeOpacity={0.75}
                >
                    <Ionicons
                        name={isClean ? 'chevron-back' : 'arrow-back'}
                        size={22}
                        color={isClean ? '#1C1917' : theme.colors.text}
                    />
                </TouchableOpacity>
                <View style={s.titleBox}>
                    {!!eyebrow && (
                        <AppText style={[s.eyebrow, isClean && s.eyebrowClean]}>
                            {eyebrow}
                        </AppText>
                    )}
                    <AppText
                        variant="header"
                        style={[s.title, isClean && { color: '#1C1917' }]}
                        numberOfLines={2}
                    >
                        {title}
                    </AppText>
                </View>
                {!!rightBadge && (
                    <View style={[s.badge, isClean && s.badgeClean]}>
                        <AppText style={[s.badgeText, isClean && s.badgeTextClean]}>
                            {rightBadge}
                        </AppText>
                    </View>
                )}
            </View>
            {!!subtitle && (
                <AppText style={[s.subtitle, isClean && { color: '#6B655E' }]}>
                    {subtitle}
                </AppText>
            )}
        </View>
    );
};

const s = StyleSheet.create({
    wrapper: {
        marginBottom: 18,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonClean: {
        backgroundColor: '#F3F7F6',
        borderWidth: 0,
    },
    titleBox: {
        flex: 1,
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: theme.colors.secondary,
        marginBottom: 2,
    },
    eyebrowClean: {
        color: '#2E6F65',
    },
    title: {
        fontSize: 25,
        lineHeight: 30,
        letterSpacing: -0.6,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.65)',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    badgeClean: {
        backgroundColor: '#EAF3F1',
        borderWidth: 0,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: theme.colors.textSecondary,
    },
    badgeTextClean: {
        color: '#1E3A5F',
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 10,
        marginLeft: 56,
        fontSize: 13,
        lineHeight: 19,
        color: theme.colors.textSecondary,
    },
});

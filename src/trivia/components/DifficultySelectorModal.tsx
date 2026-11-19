import React from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components';
import {
    DIFFICULTY_LEVELS,
    DifficultyLevel,
    ThemeProgressRecord,
    TriviaCatalogThemeNode,
} from '../types';
import { EditorialDoodle, getDoodleForThemeId } from './EditorialDoodle';

interface DifficultySelectorModalProps {
    visible: boolean;
    themeNode: TriviaCatalogThemeNode | null;
    themeProgress?: ThemeProgressRecord;
    onClose: () => void;
    onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

const LEVEL_CARDS: Record<
    DifficultyLevel,
    { cardBg: string; iconBg: string; accent: string; tag: string }
> = {
    1: {
        cardBg: '#DCECE8',
        iconBg: 'rgba(255,255,255,0.65)',
        accent: '#2E6F65',
        tag: 'Básico',
    },
    2: {
        cardBg: '#D6E8F8',
        iconBg: 'rgba(255,255,255,0.65)',
        accent: '#1E3A5F',
        tag: 'Intermedio',
    },
    3: {
        cardBg: '#F5DA7C',
        iconBg: 'rgba(255,255,255,0.58)',
        accent: '#6F5207',
        tag: 'Avanzado',
    },
};

export const DifficultySelectorModal = ({
    visible,
    themeNode,
    themeProgress,
    onClose,
    onSelectDifficulty,
}: DifficultySelectorModalProps) => {
    if (!themeNode) return null;

    const levels: DifficultyLevel[] = [1, 2, 3];
    const doodle = getDoodleForThemeId(themeNode.id);

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
            <View style={s.overlay}>
                <View style={s.sheet}>
                    <View style={s.header}>
                        <EditorialDoodle kind={doodle.kind} tint={doodle.tint} size={44} />
                        <View style={{ flex: 1 }}>
                            <AppText variant="subheader" style={s.title} numberOfLines={2}>
                                {themeNode.title}
                            </AppText>
                        </View>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="Cerrar selector de nivel"
                            onPress={onClose}
                            style={s.closeBtn}
                        >
                            <Ionicons name="close" size={18} color="#1B1E23" />
                        </TouchableOpacity>
                    </View>

                    <View style={s.body}>
                        {levels.map(lvl => {
                            const meta = DIFFICULTY_LEVELS[lvl];
                            const tone = LEVEL_CARDS[lvl];
                            const isOpen = themeNode.counts.total > 0;
                            const record = themeProgress?.levels[lvl];
                            const completed = Boolean(record?.completed);

                            return (
                                <Pressable
                                    key={lvl}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Nivel ${meta.name}`}
                                    disabled={!isOpen}
                                    onPress={() => onSelectDifficulty(lvl)}
                                    style={({ pressed }) => [
                                        s.optionCard,
                                        { backgroundColor: tone.cardBg },
                                        !isOpen && s.optionDisabled,
                                        pressed && s.pressed,
                                    ]}
                                >
                                    <View style={[s.levelBadge, { backgroundColor: tone.iconBg }]}>
                                        <Ionicons name={meta.icon as any} size={20} color={tone.accent} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={s.optionTitleRow}>
                                            <AppText style={s.optionTitle}>{meta.name}</AppText>
                                            {completed && (
                                                <View style={s.donePill}>
                                                    <Ionicons name="checkmark" size={12} color="#2E6F65" />
                                                </View>
                                            )}
                                        </View>
                                        <AppText style={[s.optionSub, { color: tone.accent }]}>
                                            {completed && record
                                                ? `${record.bestScore}/${record.totalQuestions} aciertos`
                                                : tone.tag}
                                        </AppText>
                                    </View>
                                    <View style={[s.arrowCircle, { backgroundColor: tone.iconBg }]}>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={16}
                                            color={tone.accent}
                                        />
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const s = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(27, 30, 35, 0.36)',
        justifyContent: 'center',
        padding: 22,
    },
    sheet: {
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        padding: 20,
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.14,
        shadowRadius: 28,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
    },
    title: {
        fontSize: 19,
        fontWeight: '800',
        color: '#1B1E23',
    },
    closeBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        gap: 12,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 22,
        paddingVertical: 15,
        paddingHorizontal: 16,
    },
    optionDisabled: {
        opacity: 0.45,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.985 }],
    },
    levelBadge: {
        width: 42,
        height: 42,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    optionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1B1E23',
    },
    donePill: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionSub: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 2,
    },
    arrowCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

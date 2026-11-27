import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Confetti } from '../../components';
import { useSound } from '../../context/SoundContext';
import { calculateCharadasRewards } from '../../lib/gamification/pointsSystem';
import { EditorialDoodle, getDoodleForThemeId } from '../components/EditorialDoodle';
import { getThemeById } from '../data/catalog';
import { TriviaStackParamList } from '../navigation/types';
import {
    formatCompletedLevelsIndicator,
    getCompletedLevelsCount,
    getNextPendingLevel,
    loadPersonalProgress,
} from '../storage/progressStorage';
import { DIFFICULTY_LEVELS, DifficultyLevel } from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaSoloResults'>;
    route: RouteProp<TriviaStackParamList, 'TriviaSoloResults'>;
};

export const TriviaSoloResultsScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const {
        themeId,
        difficulty,
        score,
        total,
        answeredCount,
        duration,
        levelCompleted,
    } = route.params;

    const { playSound, playHaptic } = useSound();
    const themeNode = getThemeById(themeId);
    const rewards = calculateCharadasRewards(score, total, true, duration);
    const doodle = getDoodleForThemeId(themeId);

    const [completedCount, setCompletedCount] = useState(0);
    const [nextLevel, setNextLevel] = useState<DifficultyLevel | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        let active = true;

        loadPersonalProgress().then(state => {
            if (!active) return;
            setCompletedCount(getCompletedLevelsCount(state, themeId));
            setNextLevel(getNextPendingLevel(state, themeId));
        });

        const accuracy = total > 0 ? score / total : 0;
        if (accuracy >= 0.5) {
            const timer = setTimeout(() => {
                playSound('win');
                playHaptic('victory');
                setShowConfetti(true);
            }, 350);
            const hide = setTimeout(() => setShowConfetti(false), 3200);
            return () => {
                active = false;
                clearTimeout(timer);
                clearTimeout(hide);
            };
        }

        return () => {
            active = false;
        };
    }, [themeId, score, total]);

    const levelMeta = DIFFICULTY_LEVELS[difficulty];

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <Confetti visible={showConfetti} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <EditorialDoodle
                    kind={levelCompleted ? 'trophy' : doodle.kind}
                    tint={levelCompleted ? '#F2CF66' : doodle.tint}
                    size={84}
                />

                <AppText variant="header" centered style={s.title}>
                    {themeNode?.title || 'Trivia bíblica'}
                </AppText>
                <AppText centered style={s.subtitle}>
                    {levelCompleted ? levelMeta.name : `${levelMeta.name} · Tiempo agotado`}
                </AppText>

                <View style={s.scoreCard}>
                    <AppText style={s.scoreValue}>
                        {score}
                        <AppText style={s.scoreSlash}>/{total}</AppText>
                    </AppText>

                    <View style={s.badgesRow}>
                        <View style={s.rewardChip}>
                            <Ionicons name="flash" size={15} color="#1E3A5F" />
                            <AppText style={s.rewardText}>+{rewards.xp} XP</AppText>
                        </View>
                        {rewards.trophies > 0 && (
                            <View style={[s.rewardChip, { backgroundColor: '#F5DA7C' }]}>
                                <Ionicons name="trophy" size={15} color="#6F5207" />
                                <AppText style={[s.rewardText, { color: '#6F5207' }]}>
                                    +{rewards.trophies}
                                </AppText>
                            </View>
                        )}
                    </View>
                </View>

                <View style={s.actions}>
                    {nextLevel ? (
                        <Pressable
                            accessibilityRole="button"
                            onPress={() =>
                                navigation.replace('TriviaSoloGame', {
                                    themeId,
                                    difficulty: nextLevel,
                                })
                            }
                            style={({ pressed }) => [s.primaryBtn, pressed && s.pressed]}
                        >
                            <AppText style={s.primaryBtnText}>
                                Siguiente nivel: {DIFFICULTY_LEVELS[nextLevel].name}
                            </AppText>
                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                        </Pressable>
                    ) : (
                        <Pressable
                            accessibilityRole="button"
                            onPress={() =>
                                navigation.replace('TriviaSoloGame', {
                                    themeId,
                                    difficulty,
                                })
                            }
                            style={({ pressed }) => [s.primaryBtn, pressed && s.pressed]}
                        >
                            <AppText style={s.primaryBtnText}>Jugar otra vez</AppText>
                        </Pressable>
                    )}

                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.popTo('TriviaProgress')}
                        style={({ pressed }) => [s.secondaryBtn, pressed && s.pressed]}
                    >
                        <AppText style={s.secondaryBtnText}>Volver a Mi progreso</AppText>
                    </Pressable>
                </View>
            </ScrollView>
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
        maxWidth: 560,
        alignSelf: 'center',
        alignItems: 'center',
        padding: 24,
        paddingTop: 28,
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.8,
        color: '#2E6F65',
        marginTop: 10,
        marginBottom: 4,
    },
    title: {
        fontSize: 27,
        color: '#1B1E23',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#5B6573',
        marginTop: 4,
    },
    scoreCard: {
        width: '100%',
        borderRadius: 28,
        backgroundColor: '#DCECE8',
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 22,
        marginBottom: 14,
    },
    scoreValue: {
        fontSize: 54,
        lineHeight: 62,
        fontWeight: '900',
        color: '#1B1E23',
    },
    scoreSlash: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4E5B66',
    },
    scoreLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#2E6F65',
        marginTop: 2,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    rewardChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
    },
    rewardText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#2E6F65',
    },
    progressPanel: {
        width: '100%',
        padding: 16,
        borderRadius: 22,
        backgroundColor: '#F6F8FA',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 22,
    },
    progressIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1B1E23',
    },
    progressMeta: {
        fontSize: 12,
        color: '#5B6573',
        marginTop: 2,
    },
    actions: {
        width: '100%',
        gap: 10,
    },
    primaryBtn: {
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    secondaryBtn: {
        height: 52,
        borderRadius: 26,
        backgroundColor: '#DCECE8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        color: '#1B1E23',
        fontSize: 15,
        fontWeight: '800',
    },
    ghostBtn: {
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F6F8FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ghostBtnText: {
        color: '#4E5B66',
        fontSize: 14,
        fontWeight: '700',
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.92,
    },
});

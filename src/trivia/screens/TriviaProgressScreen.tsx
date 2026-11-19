import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { DifficultySelectorModal } from '../components/DifficultySelectorModal';
import { EditorialDoodle, getDoodleForThemeId } from '../components/EditorialDoodle';
import { TriviaHeader } from '../components/TriviaHeader';
import {
    getPlayableThemes,
    getThemeById,
    MEZCLA_BIBLICA_THEME,
} from '../data/catalog';
import { TriviaStackParamList } from '../navigation/types';
import {
    formatCompletedLevelsIndicator,
    getCompletedLevelsCount,
    loadPersonalProgress,
    resolveContinuationTarget,
} from '../storage/progressStorage';
import {
    DIFFICULTY_LEVELS,
    DifficultyLevel,
    TriviaCatalogThemeNode,
    TriviaPersonalProgressState,
} from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaProgress'>;
};

const POPULAR_IDS = [
    'reino_dividido',
    'evangelios_general',
    'origenes_patriarcas_general',
    'exodo_desierto',
];

export const TriviaProgressScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();
    const [progress, setProgress] = useState<TriviaPersonalProgressState>({
        version: 1,
        lastPlayedThemeId: null,
        themes: {},
    });
    const [selectedTheme, setSelectedTheme] = useState<TriviaCatalogThemeNode | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            loadPersonalProgress().then(loaded => {
                if (active) setProgress(loaded);
            });
            return () => {
                active = false;
            };
        }, [])
    );

    const continuation = resolveContinuationTarget(progress);
    const playableThemes = getPlayableThemes();
    const mezclaCompleted = getCompletedLevelsCount(progress, MEZCLA_BIBLICA_THEME.id);
    const totalCompletedLevels = playableThemes.reduce(
        (acc, item) => acc + getCompletedLevelsCount(progress, item.id),
        0
    );
    const totalPossibleLevels = playableThemes.length * 3;

    const openDifficultyForTheme = (themeNode: TriviaCatalogThemeNode) => {
        setSelectedTheme(themeNode);
        setModalVisible(true);
    };

    const handleContinue = () => {
        if (continuation.type === 'resume_theme') {
            navigation.navigate('TriviaSoloGame', {
                themeId: continuation.theme.id,
                difficulty: continuation.nextDifficulty,
            });
            return;
        }
        navigation.navigate('TriviaCatalog', { mode: 'explore' });
    };

    const handleSelectDifficulty = (difficulty: DifficultyLevel) => {
        if (!selectedTheme) return;
        setModalVisible(false);
        navigation.navigate('TriviaSoloGame', {
            themeId: selectedTheme.id,
            difficulty,
        });
    };

    const isResuming = continuation.type === 'resume_theme';
    const activeTheme = isResuming ? continuation.theme : null;
    const heroDoodle = activeTheme
        ? getDoodleForThemeId(activeTheme.id)
        : { kind: 'sage' as const, tint: '#FFFFFF' };
    const activeCompletedCount = isResuming ? continuation.completedLevels : 0;
    const progressPct = Math.round((activeCompletedCount / 3) * 100);
    const levelPillColors: Record<DifficultyLevel, { dot: string; bg: string }> = {
        1: { dot: '#3D8A7B', bg: '#DCECE8' },
        2: { dot: '#2B6CB0', bg: '#D6E8F8' },
        3: { dot: '#B6891B', bg: '#F5DA7C' },
    };
    const popularThemes = POPULAR_IDS.map(id => getThemeById(id)).filter(
        (node): node is TriviaCatalogThemeNode => Boolean(node && node.isPlayable)
    );

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <TriviaHeader
                    eyebrow="PARA MÍ"
                    title="Mi progreso"
                    onBack={() => navigation.goBack()}
                    backLabel="Volver a Trivia bíblica"
                    rightBadge={`${totalCompletedLevels}/${totalPossibleLevels}`}
                    variant="clean"
                />

                {/* Hero card limpio con camino visual guiado Semilla -> Discípulo -> Maestro */}
                <View style={s.heroCard}>
                    <View style={s.heroTop}>
                        <View style={{ flex: 1 }}>
                            <AppText style={s.heroTitle} numberOfLines={2}>
                                {activeTheme ? activeTheme.title : 'Elige un tema'}
                            </AppText>
                        </View>
                        <EditorialDoodle
                            kind={heroDoodle.kind}
                            tint={activeTheme ? heroDoodle.tint : '#DCECE8'}
                            size={62}
                        />
                    </View>

                    {/* Barra de avance guiada */}
                    <View style={s.progressTrack}>
                        <View style={[s.progressFill, { width: `${progressPct}%` }]} />
                    </View>

                    <View style={s.stepsTrack}>
                        {([1, 2, 3] as DifficultyLevel[]).map((lvl, idx) => {
                            const meta = DIFFICULTY_LEVELS[lvl];
                            const pillTone = levelPillColors[lvl];
                            const done = activeTheme
                                ? Boolean(progress.themes[activeTheme.id]?.levels[lvl]?.completed)
                                : false;
                            const current = isResuming && continuation.nextDifficulty === lvl;

                            return (
                                <React.Fragment key={lvl}>
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel={`Jugar nivel ${meta.name}`}
                                        onPress={() => {
                                            if (activeTheme) {
                                                navigation.navigate('TriviaSoloGame', {
                                                    themeId: activeTheme.id,
                                                    difficulty: lvl,
                                                });
                                            }
                                        }}
                                        style={({ pressed }) => [
                                            s.stepPill,
                                            done && { backgroundColor: pillTone.bg },
                                            !done && current && s.stepPillCurrent,
                                            pressed && s.pressed,
                                        ]}
                                    >
                                        {done ? (
                                            <Ionicons name="checkmark-circle" size={14} color={pillTone.dot} />
                                        ) : (
                                            <View
                                                style={[
                                                    s.levelColorDot,
                                                    { backgroundColor: current ? pillTone.dot : '#C4CCD6' },
                                                ]}
                                            />
                                        )}
                                        <AppText
                                            style={[
                                                s.stepLabel,
                                                (done || current) && { color: '#1B1E23', fontWeight: '800' },
                                            ]}
                                        >
                                            {meta.name}
                                        </AppText>
                                    </Pressable>
                                    {idx < 2 && (
                                        <Ionicons name="chevron-forward" size={13} color="#A6B0BC" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Continuar"
                        onPress={handleContinue}
                        style={({ pressed }) => [s.continueBtn, pressed && s.pressed]}
                    >
                        <AppText style={s.continueBtnText}>Continuar</AppText>
                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </Pressable>
                </View>

                {/* Dos tarjetas asimétricas limpias sin bordes toscos */}
                <View style={s.gridRow}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Explorar categorías"
                        onPress={() => navigation.navigate('TriviaCatalog', { mode: 'explore' })}
                        style={({ pressed }) => [s.tileGold, pressed && s.pressed]}
                    >
                        <View style={s.tileTop}>
                            <EditorialDoodle kind="scroll" tint="#FFFFFF" size={50} />
                        </View>
                        <AppText style={s.tileTitle}>Explorar categorías</AppText>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Mezcla bíblica"
                        onPress={() => openDifficultyForTheme(MEZCLA_BIBLICA_THEME)}
                        style={({ pressed }) => [s.tileMint, pressed && s.pressed]}
                    >
                        <View style={s.tileTop}>
                            <EditorialDoodle kind="dove" tint="#FFFFFF" size={50} />
                        </View>
                        <AppText style={s.tileTitle}>Mezcla bíblica</AppText>
                    </Pressable>
                </View>

                {/* Populares con muñecos lineales y manchas de color */}
                <View style={s.popHeader}>
                    <AppText style={s.popTitle}>Populares</AppText>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate('TriviaCatalog', { mode: 'explore' })}
                    >
                        <AppText style={s.popLink}>Ver todo</AppText>
                    </Pressable>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={s.popScroll}
                >
                    {popularThemes.map(node => {
                        const doodle = getDoodleForThemeId(node.id);
                        return (
                            <Pressable
                                key={node.id}
                                accessibilityRole="button"
                                onPress={() => openDifficultyForTheme(node)}
                                style={({ pressed }) => [s.popCard, pressed && s.pressed]}
                            >
                                <View style={s.popDoodleWrap}>
                                    <EditorialDoodle kind={doodle.kind} tint={doodle.tint} size={56} />
                                </View>
                                <AppText style={s.popCardTitle} numberOfLines={2}>
                                    {node.title}
                                </AppText>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </ScrollView>

            <DifficultySelectorModal
                visible={modalVisible}
                themeNode={selectedTheme}
                themeProgress={selectedTheme ? progress.themes[selectedTheme.id] : undefined}
                onClose={() => setModalVisible(false)}
                onSelectDifficulty={handleSelectDifficulty}
            />
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
        maxWidth: 720,
        alignSelf: 'center',
        padding: 20,
    },
    heroCard: {
        backgroundColor: '#F4F7F9',
        borderRadius: 28,
        padding: 22,
        gap: 16,
    },
    progressTrack: {
        height: 5,
        borderRadius: 3,
        backgroundColor: '#E3E9F0',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: '#1E3A5F',
    },
    heroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    heroEyebrow: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.2,
        color: '#2E6F65',
        marginBottom: 4,
    },
    heroTitle: {
        fontSize: 21,
        lineHeight: 26,
        fontWeight: '800',
        color: '#1B1E23',
    },
    heroSub: {
        fontSize: 13,
        color: '#34404A',
        marginTop: 3,
    },
    stepsTrack: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    stepPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 9,
        paddingHorizontal: 6,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.62)',
    },
    stepPillCurrent: {
        backgroundColor: '#FFFFFF',
    },
    levelColorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4E5B66',
    },
    continueBtn: {
        height: 52,
        borderRadius: 26,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    continueBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    gridRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },
    tileGold: {
        flex: 1,
        borderRadius: 26,
        padding: 18,
        minHeight: 148,
        justifyContent: 'space-between',
        backgroundColor: '#F5DA7C',
    },
    tileMint: {
        flex: 1,
        borderRadius: 26,
        padding: 18,
        minHeight: 148,
        justifyContent: 'space-between',
        backgroundColor: '#D6E8F8',
    },
    tileTop: {
        alignSelf: 'flex-end',
    },
    tileTitle: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '800',
        color: '#1B1E23',
    },
    tileSub: {
        fontSize: 12,
        color: '#34404A',
        marginTop: 3,
    },
    popHeader: {
        marginTop: 26,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    popTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1B1E23',
    },
    popLink: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    popScroll: {
        gap: 12,
        paddingRight: 10,
        paddingBottom: 8,
    },
    popCard: {
        width: 158,
        height: 156,
        borderRadius: 24,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: '#F6F8FA',
    },
    popDoodleWrap: {
        alignSelf: 'flex-start',
    },
    popCardTitle: {
        fontSize: 15,
        lineHeight: 19,
        fontWeight: '800',
        color: '#1B1E23',
    },
    popCardMeta: {
        fontSize: 11,
        fontWeight: '700',
        color: '#5B6573',
        marginTop: 4,
    },
    pressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.93,
    },
});

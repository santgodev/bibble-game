import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { DifficultySelectorModal } from '../components/DifficultySelectorModal';
import { EditorialDoodle, getDoodleForThemeId } from '../components/EditorialDoodle';
import { TriviaHeader } from '../components/TriviaHeader';
import {
    getCatalogChildren,
    getCatalogNodeById,
    getNodeBreadcrumb,
} from '../data/catalog';
import { TriviaStackParamList } from '../navigation/types';
import {
    getCompletedLevelsCount,
    loadPersonalProgress,
} from '../storage/progressStorage';
import {
    DifficultyLevel,
    TriviaCatalogNode,
    TriviaCatalogThemeNode,
    TriviaPersonalProgressState,
} from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaCatalog'>;
    route: RouteProp<TriviaStackParamList, 'TriviaCatalog'>;
};

const ACCENTS = [
    { color: '#1E3A5F', soft: '#E1EEF9' },
    { color: '#2E6F65', soft: '#DCECE8' },
    { color: '#7A5B0B', soft: '#F8E8AE' },
    { color: '#2B5B84', soft: '#DCEAF7' },
];

export const TriviaCatalogScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const parentId = route.params?.parentId ?? null;
    const mode = route.params?.mode ?? 'explore';
    const currentGroup = parentId ? getCatalogNodeById(parentId) : null;
    const nodes = getCatalogChildren(parentId);
    const breadcrumb = getNodeBreadcrumb(parentId);

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
            if (mode === 'explore') {
                loadPersonalProgress().then(loaded => {
                    if (active) setProgress(loaded);
                });
            }
            return () => {
                active = false;
            };
        }, [mode])
    );

    const handleNodePress = (node: TriviaCatalogNode) => {
        if (node.kind === 'group') {
            navigation.push('TriviaCatalog', { parentId: node.id, mode });
            return;
        }
        if (!node.isPlayable) return;

        if (mode === 'picker') {
            navigation.popTo('TriviaCreateRoom', { pickedThemeId: node.id });
            return;
        }
        setSelectedTheme(node);
        setModalVisible(true);
    };

    const handleSelectDifficulty = (difficulty: DifficultyLevel) => {
        if (!selectedTheme) return;
        setModalVisible(false);
        navigation.navigate('TriviaSoloGame', {
            themeId: selectedTheme.id,
            difficulty,
        });
    };

    const headerTitle = currentGroup
        ? currentGroup.title
        : mode === 'picker'
        ? 'Elegir tema'
        : 'Explorar categorías';

    const headerEyebrow =
        mode === 'picker' ? 'CREAR SALA · TEMA' : 'CATÁLOGO';

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <TriviaHeader
                    eyebrow={headerEyebrow}
                    title={headerTitle}
                    onBack={() => navigation.goBack()}
                    rightBadge={`${nodes.length}`}
                    variant="clean"
                />

                {breadcrumb.length > 0 && (
                    <View style={s.breadcrumbRow}>
                        <AppText style={s.breadcrumbText}>
                            {['Catálogo', ...breadcrumb.map(b => b.title)].join(' / ')}
                        </AppText>
                    </View>
                )}

                <View style={s.list}>
                    {nodes.map((node) => {
                        const doodle = getDoodleForThemeId(node.id);

                        if (node.kind === 'group') {
                            return (
                                <Pressable
                                    key={node.id}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Sección ${node.title}`}
                                    onPress={() => handleNodePress(node)}
                                    style={({ pressed }) => [s.whiteCard, pressed && s.pressed]}
                                >
                                    <EditorialDoodle kind={doodle.kind} tint={doodle.tint} size={46} />
                                    <View style={{ flex: 1 }}>
                                        <AppText style={s.cardTitle}>{node.title}</AppText>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#9AA3AE" />
                                </Pressable>
                            );
                        }

                        const completedCount = getCompletedLevelsCount(progress, node.id);

                        return (
                            <Pressable
                                key={node.id}
                                accessibilityRole="button"
                                accessibilityLabel={`Tema ${node.title}`}
                                onPress={() => handleNodePress(node)}
                                style={({ pressed }) => [s.whiteCard, pressed && s.pressed]}
                            >
                                <EditorialDoodle kind={doodle.kind} tint={doodle.tint} size={46} />
                                <View style={{ flex: 1 }}>
                                    <AppText style={s.cardTitle}>{node.title}</AppText>
                                </View>
                                {mode !== 'picker' && completedCount > 0 && (
                                    <View style={s.progressPill}>
                                        <AppText style={s.progressPillText}>{completedCount}/3</AppText>
                                    </View>
                                )}
                                <Ionicons
                                    name={mode === 'picker' ? 'checkmark' : 'chevron-forward'}
                                    size={18}
                                    color={mode === 'picker' ? '#2E6F65' : '#9AA3AE'}
                                />
                            </Pressable>
                        );
                    })}
                </View>
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
    breadcrumbRow: {
        marginBottom: 14,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: '#F3F7F6',
    },
    breadcrumbText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4E5B66',
    },
    list: {
        gap: 12,
    },
    whiteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        borderRadius: 24,
        backgroundColor: '#F7F9FB',
    },
    iconBox: {
        width: 46,
        height: 46,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1B1E23',
    },
    cardSub: {
        fontSize: 12,
        color: '#5B6573',
        marginTop: 2,
    },
    progressPill: {
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#DCECE8',
    },
    progressPillText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#2E6F65',
    },
    soonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 22,
        backgroundColor: '#F4F5F7',
    },
    soonIconBox: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#E8EBEF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    soonTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#5B6573',
    },
    soonSub: {
        fontSize: 11,
        color: '#86909C',
        marginTop: 2,
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.93,
    },
});

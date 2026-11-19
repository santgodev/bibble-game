import React, { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { TriviaHeader } from '../components/TriviaHeader';
import { getThemeById, MEZCLA_BIBLICA_THEME } from '../data/catalog';
import { validateRoomConfig } from '../gameLogic';
import { TriviaStackParamList } from '../navigation/types';
import {
    DEFAULT_QUESTIONS_PER_TEAM,
    DIFFICULTY_LEVELS,
    DifficultyLevel,
    TEAM_QUESTIONS_OPTIONS,
    TriviaMatchType,
    TriviaRoomConfig,
    TriviaTeamConfig,
} from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaCreateRoom'>;
    route: RouteProp<TriviaStackParamList, 'TriviaCreateRoom'>;
};

export const TriviaCreateRoomScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [matchType, setMatchType] = useState<TriviaMatchType>('mezcla');
    const [pickedThemeId, setPickedThemeId] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
    const [questionsPerTeam, setQuestionsPerTeam] = useState<number>(DEFAULT_QUESTIONS_PER_TEAM);
    const [teams, setTeams] = useState<TriviaTeamConfig[]>([
        { id: 'team-1', name: 'Equipo 1' },
        { id: 'team-2', name: 'Equipo 2' },
    ]);
    const [nextTeamCounter, setNextTeamCounter] = useState(3);

    useEffect(() => {
        const chosenId = route.params?.pickedThemeId;
        if (chosenId && getThemeById(chosenId)) {
            setPickedThemeId(chosenId);
            setMatchType('tema');
        }
    }, [route.params?.pickedThemeId]);

    const activeTheme =
        matchType === 'mezcla'
            ? MEZCLA_BIBLICA_THEME
            : pickedThemeId
            ? getThemeById(pickedThemeId)
            : null;

    const roomConfig: TriviaRoomConfig = {
        matchType,
        themeId: activeTheme?.id || MEZCLA_BIBLICA_THEME.id,
        difficulty,
        teams,
        questionsPerTeam,
    };

    const validation = validateRoomConfig(roomConfig, activeTheme);
    const needsPickedTheme = matchType === 'tema' && !activeTheme;
    const isCreateDisabled = needsPickedTheme || !validation.isValid;

    const handleSelectMezcla = () => {
        setMatchType('mezcla');
    };

    const handleOpenThemePicker = () => {
        navigation.navigate('TriviaCatalog', { mode: 'picker' });
    };

    const handleTeamNameChange = (id: string, name: string) => {
        setTeams(prev => prev.map(t => (t.id === id ? { ...t, name } : t)));
    };

    const handleAddTeam = () => {
        const existingNames = new Set(teams.map(t => t.name.trim().toLocaleLowerCase()));
        let num = nextTeamCounter;
        while (existingNames.has(`equipo ${num}`)) {
            num += 1;
        }
        setTeams(prev => [...prev, { id: `team-${Date.now()}-${num}`, name: `Equipo ${num}` }]);
        setNextTeamCounter(num + 1);
    };

    const handleRemoveTeam = (id: string) => {
        if (teams.length <= 2) return;
        setTeams(prev => prev.filter(t => t.id !== id));
    };

    const handleCreateRoom = () => {
        if (isCreateDisabled || !activeTheme) return;
        navigation.navigate('TriviaRoomLobby', {
            roomConfig: {
                ...roomConfig,
                themeId: activeTheme.id,
                teams: teams.map(t => ({ id: t.id, name: t.name.trim() })),
            },
        });
    };

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 42 }]}
                keyboardShouldPersistTaps="handled"
            >
                <TriviaHeader
                    eyebrow="CON AMIGOS"
                    title="Crear sala"
                    onBack={() => navigation.goBack()}
                    backLabel="Volver a Con amigos"
                    variant="clean"
                />

                {/* 1. Tema */}
                <View style={s.block}>
                    <AppText style={s.blockTitle}>Tema</AppText>
                    <View style={s.segmentRow}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={{ selected: matchType === 'mezcla' }}
                            onPress={handleSelectMezcla}
                            style={[
                                s.choiceCard,
                                matchType === 'mezcla' && s.choiceCardActive,
                            ]}
                        >
                            <Ionicons
                                name="shuffle-outline"
                                size={20}
                                color={matchType === 'mezcla' ? '#FFFFFF' : '#5B6573'}
                            />
                            <AppText
                                style={[
                                    s.choiceTitle,
                                    matchType === 'mezcla' && { color: '#FFFFFF' },
                                ]}
                            >
                                Mezcla bíblica
                            </AppText>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={{ selected: matchType === 'tema' }}
                            onPress={handleOpenThemePicker}
                            style={[
                                s.choiceCard,
                                matchType === 'tema' && s.choiceCardActive,
                            ]}
                        >
                            <Ionicons
                                name="folder-open-outline"
                                size={20}
                                color={matchType === 'tema' ? '#FFFFFF' : '#5B6573'}
                            />
                            <AppText
                                style={[
                                    s.choiceTitle,
                                    matchType === 'tema' && { color: '#FFFFFF' },
                                ]}
                                numberOfLines={1}
                            >
                                {pickedThemeId ? getThemeById(pickedThemeId)?.title : 'Elegir tema'}
                            </AppText>
                        </Pressable>
                    </View>
                </View>

                {/* 2. Nivel */}
                <View style={s.block}>
                    <AppText style={s.blockTitle}>Nivel</AppText>
                    <View style={s.diffRow}>
                        {([1, 2, 3] as DifficultyLevel[]).map(lvl => {
                            const meta = DIFFICULTY_LEVELS[lvl];
                            const active = difficulty === lvl;
                            const activeBg = lvl === 1 ? '#DCECE8' : lvl === 2 ? '#D6E8F8' : '#F5DA7C';
                            return (
                                <Pressable
                                    key={lvl}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: active }}
                                    onPress={() => setDifficulty(lvl)}
                                    style={[
                                        s.diffChip,
                                        active && { backgroundColor: activeBg },
                                    ]}
                                >
                                    <Ionicons
                                        name={meta.icon as any}
                                        size={18}
                                        color={active ? '#1B1E23' : '#5B6573'}
                                    />
                                    <AppText style={[s.diffChipText, active && { color: '#1B1E23', fontWeight: '800' }]}>
                                        {meta.name}
                                    </AppText>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* 3. Equipos */}
                <View style={s.block}>
                    <View style={s.blockHeaderRow}>
                        <AppText style={s.blockTitle}>Equipos</AppText>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="Añadir equipo"
                            onPress={handleAddTeam}
                            style={s.addTeamBtn}
                        >
                            <Ionicons name="add" size={18} color="#FFFFFF" />
                            <AppText style={s.addTeamText}>Añadir</AppText>
                        </TouchableOpacity>
                    </View>

                    <View style={s.teamsList}>
                        {teams.map((team, idx) => {
                            const error = validation.teamErrors[team.id];
                            return (
                                <View key={team.id} style={s.teamRowWrap}>
                                    <View style={[s.teamRow, error && s.teamRowError]}>
                                        <View style={s.teamIndex}>
                                            <AppText style={s.teamIndexText}>{idx + 1}</AppText>
                                        </View>
                                        <TextInput
                                            accessibilityLabel={`Nombre del equipo ${idx + 1}`}
                                            value={team.name}
                                            onChangeText={val => handleTeamNameChange(team.id, val)}
                                            placeholder={`Equipo ${idx + 1}`}
                                            placeholderTextColor="#9AA3AE"
                                            style={s.teamInput}
                                            maxLength={28}
                                        />
                                        <TouchableOpacity
                                            accessibilityRole="button"
                                            accessibilityLabel={`Quitar ${team.name || `Equipo ${idx + 1}`}`}
                                            disabled={teams.length <= 2}
                                            onPress={() => handleRemoveTeam(team.id)}
                                            style={[s.removeBtn, teams.length <= 2 && { opacity: 0.3 }]}
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#C94A4A" />
                                        </TouchableOpacity>
                                    </View>
                                    {!!error && <AppText style={s.errorText}>{error}</AppText>}
                                </View>
                            );
                        })}
                    </View>

                    <View style={s.perTeamBox}>
                        <AppText style={s.perTeamLabel}>Preguntas por equipo</AppText>
                        <View style={s.perTeamPills}>
                            {TEAM_QUESTIONS_OPTIONS.map(opt => {
                                const selected = questionsPerTeam === opt;
                                return (
                                    <Pressable
                                        key={opt}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected }}
                                        onPress={() => setQuestionsPerTeam(opt)}
                                        style={[s.qtyPill, selected && s.qtyPillActive]}
                                    >
                                        <AppText style={[s.qtyPillText, selected && { color: '#FFFFFF' }]}>
                                            {opt}
                                        </AppText>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {(needsPickedTheme || validation.questionsError || Object.keys(validation.teamErrors).length > 0) && (
                    <View style={s.warningBox}>
                        <Ionicons name="alert-circle-outline" size={18} color="#C94A4A" />
                        <AppText style={s.warningText}>
                            {needsPickedTheme
                                ? 'Elige un tema del catálogo para completar la configuración.'
                                : validation.questionsError
                                ? validation.questionsError
                                : 'Corrige los nombres de equipo vacíos o repetidos antes de continuar.'}
                        </AppText>
                    </View>
                )}

                <Pressable
                    accessibilityRole="button"
                    disabled={isCreateDisabled}
                    onPress={handleCreateRoom}
                    style={({ pressed }) => [
                        s.createBtn,
                        isCreateDisabled && s.createBtnDisabled,
                        !isCreateDisabled && pressed && s.pressed,
                    ]}
                >
                    <AppText style={s.createBtnText}>Crear sala</AppText>
                </Pressable>
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
        maxWidth: 720,
        alignSelf: 'center',
        padding: 20,
        gap: 14,
    },
    block: {
        padding: 18,
        borderRadius: 24,
        backgroundColor: '#F6F8FA',
    },
    summaryBlock: {
        padding: 20,
        borderRadius: 26,
        backgroundColor: '#DCECE8',
    },
    blockHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    blockTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1B1E23',
    },
    blockHint: {
        fontSize: 12,
        color: '#5B6573',
        marginTop: 2,
    },
    segmentRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    choiceCard: {
        flex: 1,
        padding: 15,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        gap: 4,
    },
    choiceCardActive: {
        backgroundColor: '#1E3A5F',
    },
    choiceTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1B1E23',
        marginTop: 4,
    },
    choiceSub: {
        fontSize: 12,
        color: '#5B6573',
    },
    changeThemeLink: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    changeThemeText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E3A5F',
    },
    diffRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    diffChip: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        gap: 3,
    },
    diffChipActive: {
        backgroundColor: '#2E6F65',
    },
    diffChipText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1B1E23',
    },
    diffCountText: {
        fontSize: 11,
        color: '#86909C',
    },
    addTeamBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 18,
        backgroundColor: '#1E3A5F',
    },
    addTeamText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    teamsList: {
        marginTop: 12,
        gap: 10,
    },
    teamRowWrap: {
        gap: 4,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
    },
    teamRowError: {
        borderWidth: 1,
        borderColor: '#C94A4A',
    },
    teamIndex: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#D6E8F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamIndexText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    teamInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1B1E23',
        minHeight: 36,
    },
    removeBtn: {
        padding: 6,
    },
    errorText: {
        fontSize: 12,
        color: '#C94A4A',
        marginLeft: 6,
    },
    perTeamBox: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E8ECF0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    perTeamLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4E5B66',
    },
    perTeamPills: {
        flexDirection: 'row',
        gap: 8,
    },
    qtyPill: {
        width: 40,
        height: 36,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyPillActive: {
        backgroundColor: '#1E3A5F',
    },
    qtyPillText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1B1E23',
    },
    summaryGrid: {
        marginTop: 10,
        gap: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    summaryKey: {
        fontSize: 13,
        color: '#34404A',
    },
    summaryVal: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1B1E23',
        textAlign: 'right',
        flexShrink: 1,
    },
    warningBox: {
        marginTop: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#FDECEC',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '600',
        color: '#C94A4A',
    },
    createBtn: {
        marginTop: 16,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createBtnDisabled: {
        opacity: 0.45,
    },
    createBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.92,
    },
});

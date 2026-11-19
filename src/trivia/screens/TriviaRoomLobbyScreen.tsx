import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { EditorialDoodle, getDoodleForThemeId } from '../components/EditorialDoodle';
import { TriviaHeader } from '../components/TriviaHeader';
import { getThemeById } from '../data/catalog';
import { TriviaStackParamList } from '../navigation/types';
import { DIFFICULTY_LEVELS } from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaRoomLobby'>;
    route: RouteProp<TriviaStackParamList, 'TriviaRoomLobby'>;
};

export const TriviaRoomLobbyScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const { roomConfig } = route.params;
    const themeNode = getThemeById(roomConfig.themeId);
    const levelMeta = DIFFICULTY_LEVELS[roomConfig.difficulty];
    const totalQuestions = roomConfig.teams.length * roomConfig.questionsPerTeam;
    const doodle = getDoodleForThemeId(roomConfig.themeId);

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <TriviaHeader
                    eyebrow="SALA LOCAL"
                    title="Sala lista"
                    onBack={() => navigation.goBack()}
                    backLabel="Volver a Crear sala"
                    variant="clean"
                />

                <View style={s.configCard}>
                    <View style={s.configTop}>
                        <View style={{ flex: 1 }}>
                            <AppText style={s.themeTitle}>{themeNode?.title || roomConfig.themeId}</AppText>
                            <AppText style={s.themeMeta}>
                                {levelMeta.name} · {totalQuestions} preguntas
                            </AppText>
                        </View>
                        <EditorialDoodle kind={doodle.kind} tint="#FFFFFF" size={58} />
                    </View>
                </View>

                <View style={s.teamsCard}>
                    <AppText style={s.sectionLabel}>
                        EQUIPOS PARTICIPANTES ({roomConfig.teams.length})
                    </AppText>
                    <View style={s.teamsList}>
                        {roomConfig.teams.map((team, index) => (
                            <View key={team.id} style={s.teamBadgeRow}>
                                <View style={s.teamNum}>
                                    <AppText style={s.teamNumText}>{index + 1}</AppText>
                                </View>
                                <AppText style={s.teamName}>{team.name}</AppText>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={s.actions}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                            navigation.navigate('TriviaTeamGame', {
                                roomConfig,
                                previousSessionIds: [],
                            })
                        }
                        style={({ pressed }) => [s.primaryBtn, pressed && s.pressed]}
                    >
                        <AppText style={s.primaryBtnText}>Iniciar partida</AppText>
                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.goBack()}
                        style={({ pressed }) => [s.secondaryBtn, pressed && s.pressed]}
                    >
                        <AppText style={s.secondaryBtnText}>Editar configuración</AppText>
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
        maxWidth: 720,
        alignSelf: 'center',
        padding: 20,
        gap: 16,
    },
    configCard: {
        padding: 20,
        borderRadius: 26,
        backgroundColor: '#DCECE8',
    },
    configTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#2E6F65',
        marginBottom: 4,
    },
    themeTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1B1E23',
    },
    themeMeta: {
        fontSize: 13,
        color: '#34404A',
        marginTop: 4,
    },
    teamsCard: {
        padding: 20,
        borderRadius: 24,
        backgroundColor: '#F6F8FA',
        gap: 10,
    },
    teamsList: {
        gap: 10,
    },
    teamBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 13,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
    },
    teamNum: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#D6E8F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamNumText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    teamName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1B1E23',
    },
    actions: {
        gap: 10,
        marginTop: 4,
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
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    secondaryBtn: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E3A5F',
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.92,
    },
});

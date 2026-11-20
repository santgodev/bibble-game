import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { useSound } from '../../context/SoundContext';
import { TriviaHeader } from '../components/TriviaHeader';
import { getThemeById, MEZCLA_BIBLICA_THEME } from '../data/catalog';
import { TriviaStackParamList } from '../navigation/types';
import { createTriviaRoom, loadDefaultDisplayName } from '../online/triviaRoomService';
import {
    DEFAULT_ONLINE_QUESTION_COUNT,
    DEFAULT_ONLINE_SECONDS_PER_QUESTION,
    DIFFICULTY_LEVELS,
    DifficultyLevel,
    ONLINE_QUESTION_COUNT_OPTIONS,
    TriviaMatchType,
} from '../types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaCreateRoom'>;
    route: RouteProp<TriviaStackParamList, 'TriviaCreateRoom'>;
};

export const TriviaCreateRoomScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const { playSound } = useSound();

    const [displayName, setDisplayName] = useState('');
    const [matchType, setMatchType] = useState<TriviaMatchType>('mezcla');
    const [pickedThemeId, setPickedThemeId] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
    const [questionCount, setQuestionCount] = useState<number>(DEFAULT_ONLINE_QUESTION_COUNT);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        loadDefaultDisplayName().then(name => {
            if (name) setDisplayName(prev => prev || name);
        });
    }, []);

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

    const cleanName = displayName.trim();
    const needsTheme = matchType === 'tema' && !activeTheme;
    const themeHasEnough = !!activeTheme && activeTheme.counts.total >= 3;
    const isCreateDisabled = loading || !cleanName || needsTheme || !themeHasEnough;

    const handleCreateRoom = async () => {
        if (isCreateDisabled || !activeTheme) return;
        setLoading(true);
        setErrorMsg(null);
        try {
            const effectiveCount = Math.min(questionCount, activeTheme.counts.total);
            const session = await createTriviaRoom({
                displayName: cleanName,
                matchType,
                themeId: activeTheme.id,
                difficulty,
                questionCount: effectiveCount,
                secondsPerQuestion: DEFAULT_ONLINE_SECONDS_PER_QUESTION,
            });
            playSound('unlock');
            navigation.replace('TriviaOnlineLobby', { session });
        } catch (err: any) {
            setErrorMsg(err?.message || 'No se pudo crear la sala.');
        } finally {
            setLoading(false);
        }
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

                {/* 1. Nombre */}
                <View style={s.block}>
                    <AppText style={s.blockTitle}>Tu nombre</AppText>
                    <TextInput
                        accessibilityLabel="Tu nombre"
                        value={displayName}
                        onChangeText={val => {
                            setDisplayName(val);
                            if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="Ej. David"
                        placeholderTextColor="#9AA3AE"
                        style={s.input}
                        maxLength={28}
                        autoCorrect={false}
                    />
                </View>

                {/* 2. Tema */}
                <View style={s.block}>
                    <AppText style={s.blockTitle}>Tema</AppText>
                    <View style={s.segmentRow}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={{ selected: matchType === 'mezcla' }}
                            onPress={() => {
                                playSound('tap');
                                setMatchType('mezcla');
                            }}
                            style={[s.choiceCard, matchType === 'mezcla' && s.choiceCardActive]}
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
                            onPress={() => {
                                playSound('tap');
                                navigation.navigate('TriviaCatalog', { mode: 'picker' });
                            }}
                            style={[s.choiceCard, matchType === 'tema' && s.choiceCardActive]}
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

                {/* 3. Nivel */}
                <View style={s.block}>
                    <AppText style={s.blockTitle}>Nivel</AppText>
                    <View style={s.diffRow}>
                        {([1, 2, 3] as DifficultyLevel[]).map(lvl => {
                            const meta = DIFFICULTY_LEVELS[lvl];
                            const active = difficulty === lvl;
                            const activeBg =
                                lvl === 1 ? '#DCECE8' : lvl === 2 ? '#D6E8F8' : '#F5DA7C';
                            return (
                                <Pressable
                                    key={lvl}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: active }}
                                    onPress={() => {
                                        playSound('tap');
                                        setDifficulty(lvl);
                                    }}
                                    style={[s.diffChip, active && { backgroundColor: activeBg }]}
                                >
                                    <Ionicons
                                        name={meta.icon as any}
                                        size={18}
                                        color={active ? '#1B1E23' : '#5B6573'}
                                    />
                                    <AppText
                                        style={[
                                            s.diffChipText,
                                            active && { color: '#1B1E23', fontWeight: '800' },
                                        ]}
                                    >
                                        {meta.name}
                                    </AppText>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* 4. Cantidad de preguntas */}
                <View style={s.block}>
                    <View style={s.perRow}>
                        <AppText style={s.blockTitle}>Preguntas</AppText>
                        <View style={s.perPills}>
                            {ONLINE_QUESTION_COUNT_OPTIONS.map(opt => {
                                const selected = questionCount === opt;
                                return (
                                    <Pressable
                                        key={opt}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected }}
                                        onPress={() => {
                                            playSound('tap');
                                            setQuestionCount(opt);
                                        }}
                                        style={[s.qtyPill, selected && s.qtyPillActive]}
                                    >
                                        <AppText
                                            style={[s.qtyPillText, selected && { color: '#FFFFFF' }]}
                                        >
                                            {opt}
                                        </AppText>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {!!errorMsg && (
                    <View style={s.errorBox}>
                        <Ionicons name="alert-circle-outline" size={18} color="#8E3B3B" />
                        <AppText style={s.errorText}>{errorMsg}</AppText>
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
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <AppText style={s.createBtnText}>Crear sala</AppText>
                    )}
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
        gap: 12,
    },
    blockTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1B1E23',
    },
    input: {
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontWeight: '700',
        color: '#1B1E23',
    },
    segmentRow: {
        flexDirection: 'row',
        gap: 10,
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
    diffRow: {
        flexDirection: 'row',
        gap: 8,
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
    diffChipText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1B1E23',
    },
    perRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    perPills: {
        flexDirection: 'row',
        gap: 8,
    },
    qtyPill: {
        width: 44,
        height: 38,
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
    errorBox: {
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#F7E6E6',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        color: '#8E3B3B',
    },
    createBtn: {
        marginTop: 8,
        height: 54,
        borderRadius: 27,
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

import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppText } from '../../components';
import { Category, getCategories } from '../../data/categories';
import { supabase } from '../../lib/supabase';
import { EditorialDoodle } from '../../trivia/components/EditorialDoodle';

const STORAGE_KEY_PLAYERS = '@impostor_players_v1';
const STORAGE_KEY_ANON = '@impostor_anon_v1';
const STORAGE_KEY_DURATION = '@impostor_duration_v1';
const STORAGE_KEY_IMPOSTORS = '@impostor_count_v1';
const STORAGE_KEY_HINTS = '@impostor_hints_v1';
const STORAGE_KEY_DIFF = '@impostor_diff_v1';
const STORAGE_KEY_CATEGORIES = '@impostor_cats_v1';

export const ImpostorConfigScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const [impostors, setImpostors] = useState(1);
    const [hintEnabled, setHintEnabled] = useState(true);
    const [durationMinutes, setDurationMinutes] = useState(5);
    const [difficulty, setDifficulty] = useState(1);

    const [churchMembers, setChurchMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [anonPlayersList, setAnonPlayersList] = useState<{ id: string; name: string }[]>([]);

    const totalPlayers = selectedMembers.length + anonPlayersList.length;

    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);

    const loadConfig = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            let membersData: any[] = [];
            if (user) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('church_id')
                    .eq('id', user.id)
                    .single();
                if (userData?.church_id) {
                    const { data: churchMembersRows } = await supabase
                        .from('users')
                        .select('id, username')
                        .eq('church_id', userData.church_id)
                        .order('username');
                    if (churchMembersRows) {
                        setChurchMembers(churchMembersRows);
                        membersData = churchMembersRows;
                    }
                }
            }

            const [
                storedSelected,
                storedAnon,
                storedDur,
                storedImp,
                storedHints,
                storedDiff,
                storedCats,
            ] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY_PLAYERS),
                AsyncStorage.getItem(STORAGE_KEY_ANON),
                AsyncStorage.getItem(STORAGE_KEY_DURATION),
                AsyncStorage.getItem(STORAGE_KEY_IMPOSTORS),
                AsyncStorage.getItem(STORAGE_KEY_HINTS),
                AsyncStorage.getItem(STORAGE_KEY_DIFF),
                AsyncStorage.getItem(STORAGE_KEY_CATEGORIES),
            ]);

            if (storedSelected && membersData.length > 0) {
                const parsed = JSON.parse(storedSelected);
                const valid = parsed.filter((sm: any) => membersData.some(m => m.id === sm.id));
                setSelectedMembers(valid);
            }
            if (storedAnon) setAnonPlayersList(JSON.parse(storedAnon));
            if (storedDur) setDurationMinutes(parseInt(storedDur, 10));
            if (storedImp) setImpostors(parseInt(storedImp, 10));
            if (storedHints) setHintEnabled(storedHints === 'true');
            if (storedDiff) setDifficulty(parseInt(storedDiff, 10));
            if (storedCats && !route.params?.selectedCategories) {
                const valid = await getCategories('impostor');
                const fresh = (JSON.parse(storedCats) as Category[])
                    .map(sc => valid.find(v => v.id === sc.id))
                    .filter((c): c is Category => !!c);
                setSelectedCategories(fresh);
                AsyncStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(fresh));
            }

            setIsConfigLoaded(true);
        } catch (error) {
            console.error('Error in loadConfig', error);
            setIsConfigLoaded(true);
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    useEffect(() => {
        if (route.params?.selectedCategories) {
            setSelectedCategories(route.params.selectedCategories);
            AsyncStorage.setItem(
                STORAGE_KEY_CATEGORIES,
                JSON.stringify(route.params.selectedCategories)
            );
        }
    }, [route.params?.selectedCategories]);

    useEffect(() => {
        if (!isConfigLoaded) return;
        AsyncStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(selectedMembers));
    }, [selectedMembers, isConfigLoaded]);

    useEffect(() => {
        if (!isConfigLoaded) return;
        AsyncStorage.setItem(STORAGE_KEY_ANON, JSON.stringify(anonPlayersList));
    }, [anonPlayersList, isConfigLoaded]);

    useEffect(() => {
        if (!isConfigLoaded) return;
        AsyncStorage.setItem(STORAGE_KEY_DURATION, durationMinutes.toString());
    }, [durationMinutes, isConfigLoaded]);

    useEffect(() => {
        if (!isConfigLoaded) return;
        AsyncStorage.setItem(STORAGE_KEY_IMPOSTORS, impostors.toString());
    }, [impostors, isConfigLoaded]);

    useEffect(() => {
        if (!isConfigLoaded) return;
        AsyncStorage.setItem(STORAGE_KEY_HINTS, hintEnabled.toString());
    }, [hintEnabled, isConfigLoaded]);

    useEffect(() => {
        if (!isConfigLoaded) return;
        AsyncStorage.setItem(STORAGE_KEY_DIFF, difficulty.toString());
    }, [difficulty, isConfigLoaded]);

    const toggleMember = (member: any) => {
        if (selectedMembers.some(m => m.id === member.id)) {
            setSelectedMembers(prev => prev.filter(m => m.id !== member.id));
        } else {
            setSelectedMembers(prev => [...prev, member]);
        }
    };

    const addAnonPlayer = () => {
        const newId = `anon_${Date.now()}`;
        setAnonPlayersList(prev => [...prev, { id: newId, name: `Jugador ${prev.length + 1}` }]);
    };

    const removeAnonPlayer = (id: string) => {
        setAnonPlayersList(prev => prev.filter(p => p.id !== id));
    };

    const updateAnonName = (id: string, newName: string) => {
        setAnonPlayersList(prev => prev.map(p => (p.id === id ? { ...p, name: newName } : p)));
    };

    const handleStartGame = () => {
        if (selectedCategories.length === 0) {
            Alert.alert('Falta tema', 'Selecciona al menos un paquete de palabras.');
            return;
        }

        if (totalPlayers < 3) {
            Alert.alert('Faltan jugadores', 'Se necesitan al menos 3 participantes.');
            return;
        }

        const actualImpostors = Math.min(impostors, Math.floor(totalPlayers / 2));

        const playerDetails = [
            ...selectedMembers.map(m => ({
                id: m.id,
                username: m.username,
                avatar: m.avatar_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${m.username}`,
                isRegistered: true,
            })),
            ...anonPlayersList.map(a => ({
                id: a.id,
                username: a.name,
                avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${a.id}`,
                isRegistered: false,
            })),
        ];

        const shuffledPlayers = [...playerDetails].sort(() => Math.random() - 0.5);

        navigation.navigate('ImpostorPass', {
            players: totalPlayers,
            playerDetails: shuffledPlayers,
            impostors: actualImpostors,
            hintEnabled,
            duration: durationMinutes * 60,
            selectedCategories,
            difficulty,
        });
    };

    const maxImpostors = Math.floor(Math.max(3, totalPlayers) / 2);

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 110 }]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={s.header}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        onPress={() => navigation.goBack()}
                        style={s.backBtn}
                    >
                        <Ionicons name="chevron-back" size={20} color="#1B1E23" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <AppText style={s.eyebrow}>EL IMPOSTOR</AppText>
                        <AppText style={s.title}>Configurar sala</AppText>
                    </View>
                    <EditorialDoodle kind="impostor" tint="#D6E8F8" size={46} />
                </View>

                {/* Paquetes */}
                <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                        navigation.navigate('ImpostorCategories', {
                            selectedIds: selectedCategories.map(c => c.id),
                        })
                    }
                    style={({ pressed }) => [s.packagesCard, pressed && s.pressed]}
                >
                    <View style={s.rowLeft}>
                        <View style={s.iconBoxWhite}>
                            <Ionicons name="albums-outline" size={20} color="#1E3A5F" />
                        </View>
                        <AppText style={s.packagesTitle}>Paquetes</AppText>
                    </View>
                    <View style={s.rowRight}>
                        <View style={s.countBadge}>
                            <AppText style={s.countBadgeText}>
                                {selectedCategories.length === 0 ? 'Elegir' : `${selectedCategories.length}`}
                            </AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#1E3A5F" />
                    </View>
                </Pressable>

                {/* Participantes */}
                <View style={s.block}>
                    <View style={s.blockHeader}>
                        <AppText style={s.blockTitle}>Participantes ({totalPlayers})</AppText>
                        <TouchableOpacity
                            accessibilityRole="button"
                            onPress={addAnonPlayer}
                            style={s.addBtn}
                        >
                            <Ionicons name="add" size={16} color="#FFFFFF" />
                            <AppText style={s.addBtnText}>Añadir</AppText>
                        </TouchableOpacity>
                    </View>

                    {churchMembers.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={s.membersScroll}
                        >
                            {churchMembers.map(member => {
                                const isSelected = selectedMembers.some(m => m.id === member.id);
                                return (
                                    <TouchableOpacity
                                        key={member.id}
                                        style={[s.memberTag, isSelected && s.memberTagSelected]}
                                        onPress={() => toggleMember(member)}
                                    >
                                        <AppText
                                            style={[
                                                s.memberText,
                                                isSelected && { color: '#1B1E23', fontWeight: '800' },
                                            ]}
                                        >
                                            {member.username}
                                        </AppText>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}

                    <View style={{ gap: 8 }}>
                        {anonPlayersList.map(anon => (
                            <View key={anon.id} style={s.anonRow}>
                                <TextInput
                                    style={s.anonInput}
                                    value={anon.name}
                                    onChangeText={val => updateAnonName(anon.id, val)}
                                    placeholder="Nombre"
                                    placeholderTextColor="#8B94A1"
                                    selectTextOnFocus
                                    maxLength={20}
                                />
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    onPress={() => removeAnonPlayer(anon.id)}
                                    style={s.removeBtn}
                                >
                                    <Ionicons name="close" size={16} color="#9E3A3A" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Impostores */}
                <View style={s.settingRow}>
                    <AppText style={s.settingLabel}>Impostores</AppText>
                    <View style={s.stepper}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            onPress={() => setImpostors(Math.max(1, impostors - 1))}
                            style={s.stepBtn}
                        >
                            <Ionicons
                                name="remove"
                                size={18}
                                color={impostors <= 1 ? '#B8C1CC' : '#1E3A5F'}
                            />
                        </TouchableOpacity>
                        <AppText style={s.stepperVal}>{impostors}</AppText>
                        <TouchableOpacity
                            accessibilityRole="button"
                            onPress={() => setImpostors(Math.min(maxImpostors, impostors + 1))}
                            style={s.stepBtn}
                        >
                            <Ionicons
                                name="add"
                                size={18}
                                color={impostors >= maxImpostors ? '#B8C1CC' : '#1E3A5F'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Pista */}
                <View style={s.settingRow}>
                    <AppText style={s.settingLabel}>Pista para impostores</AppText>
                    <TouchableOpacity
                        accessibilityRole="switch"
                        accessibilityState={{ checked: hintEnabled }}
                        style={[s.toggle, hintEnabled ? s.toggleOn : s.toggleOff]}
                        onPress={() => setHintEnabled(!hintEnabled)}
                    >
                        <View
                            style={[
                                s.toggleThumb,
                                { transform: [{ translateX: hintEnabled ? 20 : 0 }] },
                            ]}
                        />
                    </TouchableOpacity>
                </View>

                {/* Duración */}
                <View style={s.settingRow}>
                    <AppText style={s.settingLabel}>Duración</AppText>
                    <View style={s.stepper}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            onPress={() => setDurationMinutes(Math.max(1, durationMinutes - 1))}
                            style={s.stepBtn}
                        >
                            <Ionicons
                                name="remove"
                                size={18}
                                color={durationMinutes <= 1 ? '#B8C1CC' : '#1E3A5F'}
                            />
                        </TouchableOpacity>
                        <AppText style={s.stepperVal}>{durationMinutes} min</AppText>
                        <TouchableOpacity
                            accessibilityRole="button"
                            onPress={() => setDurationMinutes(Math.min(15, durationMinutes + 1))}
                            style={s.stepBtn}
                        >
                            <Ionicons
                                name="add"
                                size={18}
                                color={durationMinutes >= 15 ? '#B8C1CC' : '#1E3A5F'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <Pressable
                    accessibilityRole="button"
                    onPress={handleStartGame}
                    style={({ pressed }) => [s.startBtn, pressed && s.pressed]}
                >
                    <AppText style={s.startBtnText}>Iniciar partida</AppText>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
            </View>
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
        paddingHorizontal: 20,
        paddingTop: 14,
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#2B6CB0',
        marginBottom: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -0.5,
    },
    packagesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderRadius: 24,
        backgroundColor: '#D6E8F8',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBoxWhite: {
        width: 38,
        height: 38,
        borderRadius: 13,
        backgroundColor: 'rgba(255,255,255,0.75)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    packagesTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1B1E23',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.78)',
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    block: {
        borderRadius: 24,
        padding: 18,
        backgroundColor: '#F6F8FA',
        gap: 12,
    },
    blockHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    blockTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1B1E23',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 14,
        backgroundColor: '#1E3A5F',
    },
    addBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    membersScroll: {
        gap: 8,
    },
    memberTag: {
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
    },
    memberTagSelected: {
        backgroundColor: '#DCECE8',
    },
    memberText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#5B6573',
    },
    anonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingLeft: 14,
        paddingRight: 8,
        height: 46,
    },
    anonInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#1B1E23',
    },
    removeBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F7E6E6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 15,
        borderRadius: 22,
        backgroundColor: '#F6F8FA',
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1B1E23',
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperVal: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1B1E23',
        minWidth: 44,
        textAlign: 'center',
    },
    toggle: {
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 3,
        justifyContent: 'center',
    },
    toggleOn: {
        backgroundColor: '#1E3A5F',
    },
    toggleOff: {
        backgroundColor: '#D6DDE6',
    },
    toggleThumb: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#FFFFFF',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        backgroundColor: 'rgba(255,255,255,0.92)',
    },
    startBtn: {
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    startBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
});

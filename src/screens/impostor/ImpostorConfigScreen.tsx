import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Container, AppText, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Category } from '../../data/categories';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PLAYERS = '@impostor_players_v1';
const STORAGE_KEY_ANON = '@impostor_anon_v1';
const STORAGE_KEY_DURATION = '@impostor_duration_v1';
const STORAGE_KEY_IMPOSTORS = '@impostor_count_v1';
const STORAGE_KEY_HINTS = '@impostor_hints_v1';
const STORAGE_KEY_DIFF = '@impostor_diff_v1';
const STORAGE_KEY_CATEGORIES = '@impostor_cats_v1';

export const ImpostorConfigScreen = ({ navigation, route }: any) => {
    const [impostors, setImpostors] = useState(1);
    const [hintEnabled, setHintEnabled] = useState(true);
    const [durationMinutes, setDurationMinutes] = useState(5);
    const [difficulty, setDifficulty] = useState(1); // 1: Semilla, 2: Discípulo, 3: Apóstol

    // Church and Anonymous Players
    const [churchMembers, setChurchMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [anonPlayersList, setAnonPlayersList] = useState<{ id: string, name: string }[]>([]);

    const totalPlayers = selectedMembers.length + anonPlayersList.length;

    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);

    const loadConfig = async () => {
        try {
            // 1. Fetch Church members first
            const { data: { user } } = await supabase.auth.getUser();
            let membersData: any[] = [];
            if (user) {
                const { data: userData } = await supabase.from('users').select('church_id').eq('id', user.id).single();
                if (userData?.church_id) {
                    const { data: churchMembersRows } = await supabase.from('users')
                        .select('id, username')
                        .eq('church_id', userData.church_id)
                        .order('username');
                    if (churchMembersRows) {
                        setChurchMembers(churchMembersRows);
                        membersData = churchMembersRows;
                    }
                }
            }

            // 2. Load stored config
            const [storedSelected, storedAnon, storedDur, storedImp, storedHints, storedDiff, storedCats] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY_PLAYERS),
                AsyncStorage.getItem(STORAGE_KEY_ANON),
                AsyncStorage.getItem(STORAGE_KEY_DURATION),
                AsyncStorage.getItem(STORAGE_KEY_IMPOSTORS),
                AsyncStorage.getItem(STORAGE_KEY_HINTS),
                AsyncStorage.getItem(STORAGE_KEY_DIFF),
                AsyncStorage.getItem(STORAGE_KEY_CATEGORIES)
            ]);

            if (storedSelected && membersData.length > 0) {
                const parsed = JSON.parse(storedSelected);
                const valid = parsed.filter((sm: any) => membersData.some(m => m.id === sm.id));
                setSelectedMembers(valid);
            }
            if (storedAnon) setAnonPlayersList(JSON.parse(storedAnon));
            if (storedDur) setDurationMinutes(parseInt(storedDur));
            if (storedImp) setImpostors(parseInt(storedImp));
            if (storedHints) setHintEnabled(storedHints === 'true');
            if (storedDiff) setDifficulty(parseInt(storedDiff));
            if (storedCats && !route.params?.selectedCategories) {
                setSelectedCategories(JSON.parse(storedCats));
            }

            setIsConfigLoaded(true);
        } catch (error) {
            console.error('Error in loadConfig', error);
            setIsConfigLoaded(true); // Allow saving even if load fails to avoid blocking the user
        }
    };

    // Load only once on mount
    useEffect(() => {
        loadConfig();
    }, []);

    // Also handle category updates from navigation
    useEffect(() => {
        if (route.params?.selectedCategories) {
            setSelectedCategories(route.params.selectedCategories);
            // Immediately save categories when they come back from selection
            AsyncStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(route.params.selectedCategories));
        }
    }, [route.params?.selectedCategories]);

    // Robust saving: Only save if initial load is finished
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
        setAnonPlayersList(prev => [...prev, { id: newId, name: `Anónimo ${prev.length + 1}` }]);
    };

    const removeAnonPlayer = (id: string) => {
        setAnonPlayersList(prev => prev.filter(p => p.id !== id));
    };

    const updateAnonName = (id: string, newName: string) => {
        setAnonPlayersList(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const handleStartGame = () => {
        if (selectedCategories.length === 0) {
            alert("Por favor selecciona al menos un paquete de palabras.");
            return;
        }

        if (totalPlayers < 3) {
            alert("Se necesitan al menos 3 participantes en total.");
            return;
        }

        const actualImpostors = Math.min(impostors, Math.floor(totalPlayers / 2));

        const playerDetails = [
            ...selectedMembers.map(m => ({
                id: m.id,
                username: m.username,
                avatar: m.avatar_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${m.username}`,
                isRegistered: true
            })),
            ...anonPlayersList.map(a => ({
                id: a.id,
                username: a.name,
                avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${a.id}`,
                isRegistered: false
            }))
        ];

        // Shuffle player details so roles are completely randomized
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

    return (
        <View style={styles.container}>
            <Container style={{ paddingTop: 60 }} noPadding>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="glasses" size={32} color="#ff4d4d" />
                        </View>
                        <AppText variant="display" style={styles.mainTitle}>Impostor</AppText>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Paquetes Section */}
                    <TouchableOpacity
                        style={styles.menuRow}
                        onPress={() => navigation.navigate('ImpostorCategories', { selectedIds: selectedCategories.map(c => c.id) })}
                    >
                        <View style={styles.rowLeft}>
                            <Ionicons name="albums" size={24} color="#e74c3c" />
                            <AppText style={styles.rowLabel}>Paquetes</AppText>
                        </View>
                        <View style={styles.rowRight}>
                            <AppText style={styles.rowValue}>
                                {selectedCategories.length === 0 ? "Ninguno" : `${selectedCategories.length} Paquetes`}
                            </AppText>
                            <Ionicons name="chevron-forward" size={20} color="#666" style={{ marginLeft: 10 }} />
                        </View>
                    </TouchableOpacity>

                    {/* Players config */}
                    <View style={styles.menuRowCol}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="people" size={24} color="#e74c3c" />
                            <AppText style={styles.rowLabel}>Participantes</AppText>
                        </View>
                        <AppText style={styles.helpText}>Selecciona quiénes van a jugar de tu iglesia:</AppText>

                        {churchMembers.length > 0 ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersScroll}>
                                {churchMembers.map(member => {
                                    const isSelected = selectedMembers.some(m => m.id === member.id);
                                    return (
                                        <TouchableOpacity
                                            key={member.id}
                                            style={[styles.memberTag, isSelected && styles.memberTagSelected]}
                                            onPress={() => toggleMember(member)}
                                        >
                                            <AppText style={[styles.memberText, isSelected && styles.memberTextSelected]}>{member.username}</AppText>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        ) : (
                            <AppText style={styles.noMembers}>No hay miembros en tu iglesia.</AppText>
                        )}

                        <View style={styles.anonHeaderRow}>
                            <AppText style={styles.anonLabel}>Compañeros Anónimos</AppText>
                            <TouchableOpacity style={styles.addAnonBtn} onPress={addAnonPlayer}>
                                <Ionicons name="person-add" size={16} color="#fff" />
                                <AppText style={styles.addAnonText}>Agregar</AppText>
                            </TouchableOpacity>
                        </View>

                        {anonPlayersList.map(anon => (
                            <View key={anon.id} style={styles.anonEditRow}>
                                <View style={styles.anonAvatarPlaceholder}>
                                    <Ionicons name="person" size={16} color="#aaa" />
                                </View>
                                <TextInput
                                    style={styles.anonInput}
                                    value={anon.name}
                                    onChangeText={(val) => updateAnonName(anon.id, val)}
                                    placeholder="Nombre del jugador"
                                    placeholderTextColor="#666"
                                    selectTextOnFocus
                                    maxLength={20}
                                />
                                <TouchableOpacity onPress={() => removeAnonPlayer(anon.id)} style={styles.removeAnonBtn}>
                                    <Ionicons name="close-circle" size={24} color="#e74c3c" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <AppText style={styles.totalPlayersLabel}>Total de Jugadores: {totalPlayers}</AppText>
                    </View>

                    {/* Impostors config */}
                    <View style={styles.menuRow}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="person-outline" size={24} color="#e74c3c" />
                            <AppText style={styles.rowLabel}>Impostores</AppText>
                        </View>
                        <View style={styles.stepper}>
                            <TouchableOpacity onPress={() => setImpostors(Math.max(1, impostors - 1))}>
                                <Ionicons name="remove-circle" size={30} color={impostors <= 1 ? '#333' : '#e74c3c'} />
                            </TouchableOpacity>
                            <AppText style={styles.stepperValue}>{impostors}</AppText>
                            <TouchableOpacity onPress={() => setImpostors(Math.min(Math.floor(Math.max(3, totalPlayers) / 2), impostors + 1))}>
                                <Ionicons name="add-circle" size={30} color={impostors >= Math.floor(Math.max(3, totalPlayers) / 2) ? '#333' : '#e74c3c'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Pistas config */}
                    <View style={styles.menuRow}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="search" size={24} color="#f1c40f" />
                            <AppText style={styles.rowLabel}>Pista Impostores</AppText>
                        </View>
                        <TouchableOpacity
                            style={[styles.toggle, hintEnabled ? styles.toggleOn : styles.toggleOff]}
                            onPress={() => setHintEnabled(!hintEnabled)}
                        >
                            <View style={[styles.toggleThumb, hintEnabled ? styles.thumbOn : styles.thumbOff, { backgroundColor: '#fff' }]} />
                        </TouchableOpacity>
                    </View>

                    {/* Duración */}
                    <View style={styles.menuRow}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="time" size={24} color="#95a5a6" />
                            <AppText style={styles.rowLabel}>Duración</AppText>
                        </View>
                        <View style={styles.stepper}>
                            <TouchableOpacity onPress={() => setDurationMinutes(Math.max(1, durationMinutes - 1))}>
                                <Ionicons name="remove-circle" size={30} color={durationMinutes <= 1 ? '#333' : '#e74c3c'} />
                            </TouchableOpacity>
                            <AppText style={styles.stepperValue}>{durationMinutes} min</AppText>
                            <TouchableOpacity onPress={() => setDurationMinutes(Math.min(15, durationMinutes + 1))}>
                                <Ionicons name="add-circle" size={30} color={durationMinutes >= 15 ? '#333' : '#e74c3c'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Dificultad */}
                    <View style={styles.menuRowCol}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="ribbon" size={24} color="#f1c40f" />
                            <AppText style={styles.rowLabel}>Dificultad</AppText>
                        </View>
                        <View style={styles.difficultyContainer}>
                            <TouchableOpacity 
                                style={[styles.diffTab, difficulty === 1 && styles.diffTabActive]} 
                                onPress={() => setDifficulty(1)}
                            >
                                <AppText style={[styles.diffTabText, difficulty === 1 && styles.diffTabTextActive]}>Semilla</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.diffTab, difficulty === 2 && styles.diffTabActive]} 
                                onPress={() => setDifficulty(2)}
                            >
                                <AppText style={[styles.diffTabText, difficulty === 2 && styles.diffTabTextActive]}>Discípulo</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.diffTab, difficulty === 3 && styles.diffTabActive]} 
                                onPress={() => setDifficulty(3)}
                            >
                                <AppText style={[styles.diffTabText, difficulty === 3 && styles.diffTabTextActive]}>Apóstol</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <LinearGradient
                            colors={['#ff6b6b', '#e74c3c', '#9b1c1c']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.startButtonInner}
                        >
                            <Ionicons name="play-circle" size={24} color="#fff" style={{ marginRight: 10 }} />
                            <AppText style={styles.startButtonText}>Iniciar Juego</AppText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </Container>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0f',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    backBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20
    },
    titleContainer: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255, 77, 77, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: -5
    },
    mainTitle: {
        color: '#ff4d4d',
        fontSize: 36,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 140
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: 18,
        borderRadius: 22,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)'
    },
    menuRowCol: {
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: 18,
        borderRadius: 22,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)'
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowLabel: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 12,
        fontWeight: '600'
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowValue: {
        fontSize: 14,
        color: '#ccc',
    },
    helpText: {
        color: '#888',
        fontSize: 13,
        marginTop: 10,
        marginBottom: 10
    },
    membersScroll: {
        gap: 8,
        paddingBottom: 5
    },
    memberTag: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#555',
    },
    memberTagSelected: {
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        borderColor: '#e74c3c',
    },
    memberText: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: 'bold',
    },
    memberTextSelected: {
        color: '#ff6b6b',
    },
    noMembers: {
        color: '#555',
        fontStyle: 'italic',
        fontSize: 13
    },
    anonHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#222',
        paddingTop: 15,
        marginBottom: 10
    },
    anonLabel: {
        color: '#ccc',
        fontSize: 15,
        fontWeight: 'bold'
    },
    addAnonBtn: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 15,
        alignItems: 'center',
        gap: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    addAnonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12
    },
    anonEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a35', // Un gris oscuro más elegante
        borderRadius: 20,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3
    },
    anonAvatarPlaceholder: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#16161c',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    anonInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingVertical: 10,
        fontWeight: 'bold',
        fontFamily: 'Outfit-Regular'
    },
    removeAnonBtn: {
        padding: 5
    },
    totalPlayersLabel: {
        color: '#e74c3c',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center'
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepperValue: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        width: 50,
        textAlign: 'center',
    },
    toggle: {
        width: 48,
        height: 26,
        borderRadius: 13,
        padding: 2,
        justifyContent: 'center',
    },
    toggleOn: {
        backgroundColor: '#e74c3c',
    },
    toggleOff: {
        backgroundColor: '#555',
    },
    toggleThumb: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#fff',
        position: 'absolute'
    },
    thumbOn: {
        right: 2,
    },
    thumbOff: {
        left: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: 20,
        paddingBottom: 40,
        backgroundColor: 'rgba(10, 10, 15, 0.9)'
    },
    startButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    startButtonInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 18,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2
    },
    difficultyContainer: {
        flexDirection: 'row',
        marginTop: 15,
        backgroundColor: '#0a0a0f',
        borderRadius: 12,
        padding: 4,
    },
    diffTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    diffTabActive: {
        backgroundColor: '#e74c3c',
    },
    diffTabText: {
        color: '#666',
        fontSize: 13,
        fontWeight: 'bold',
    },
    diffTabTextActive: {
        color: '#fff',
    }
});

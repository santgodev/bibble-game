import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated, TextInput } from 'react-native';
import { Container, AppText, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Category } from '../../data/categories';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';

export const ImpostorConfigScreen = ({ navigation, route }: any) => {
    const [impostors, setImpostors] = useState(1);
    const [hintEnabled, setHintEnabled] = useState(true);
    const [durationMinutes, setDurationMinutes] = useState(5);

    // Church and Anonymous Players
    const [churchMembers, setChurchMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [anonPlayersList, setAnonPlayersList] = useState<{ id: string, name: string }[]>([]);

    const totalPlayers = selectedMembers.length + anonPlayersList.length;

    // The selected categories from the ImpostorCategoriesScreen
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: userData } = await supabase.from('users').select('church_id').eq('id', user.id).single();
                    if (userData?.church_id) {
                        const { data: churchMembers } = await supabase.from('users')
                            .select('id, username')
                            .eq('church_id', userData.church_id)
                            .order('username');
                        if (churchMembers) {
                            setChurchMembers(churchMembers);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching members', error);
            }
        };
        fetchMembers();
    }, []);

    // If categories were selected in the other screen and passed back
    useEffect(() => {
        if (route.params?.selectedCategories) {
            setSelectedCategories(route.params.selectedCategories);
        }
    }, [route.params?.selectedCategories]);

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
                            <Ionicons name="albums" size={24} color="#8e44ad" />
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
                            <Ionicons name="people" size={24} color="#3498db" />
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
                                <Ionicons name="person-add" size={16} color="#000" />
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
                                <Ionicons name="remove-circle" size={30} color={impostors <= 1 ? '#555' : '#2ecc71'} />
                            </TouchableOpacity>
                            <AppText style={styles.stepperValue}>{impostors}</AppText>
                            <TouchableOpacity onPress={() => setImpostors(Math.min(Math.floor(Math.max(3, totalPlayers) / 2), impostors + 1))}>
                                <Ionicons name="add-circle" size={30} color={impostors >= Math.floor(Math.max(3, totalPlayers) / 2) ? '#555' : '#2ecc71'} />
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
                            <View style={[styles.toggleThumb, hintEnabled ? styles.thumbOn : styles.thumbOff]} />
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
                                <Ionicons name="remove-circle" size={30} color={durationMinutes <= 1 ? '#555' : '#2ecc71'} />
                            </TouchableOpacity>
                            <AppText style={styles.stepperValue}>{durationMinutes} min</AppText>
                            <TouchableOpacity onPress={() => setDurationMinutes(Math.min(15, durationMinutes + 1))}>
                                <Ionicons name="add-circle" size={30} color={durationMinutes >= 15 ? '#555' : '#2ecc71'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <Ionicons name="play" size={20} color="#000" style={{ marginRight: 10 }} />
                        <AppText style={styles.startButtonText}>Iniciar Juego</AppText>
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
        paddingHorizontal: 20,
        marginBottom: 20,
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
        fontSize: 32,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 100
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#16161c',
        padding: 16,
        borderRadius: 15,
        marginBottom: 10,
    },
    menuRowCol: {
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#16161c',
        padding: 16,
        borderRadius: 15,
        marginBottom: 10,
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
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        borderColor: '#2ecc71',
    },
    memberText: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: 'bold',
    },
    memberTextSelected: {
        color: '#2ecc71',
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
        backgroundColor: '#2ecc71',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        alignItems: 'center',
        gap: 5
    },
    addAnonText: {
        color: '#000',
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
        color: '#2ecc71',
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
        backgroundColor: '#2ecc71',
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
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#2ecc71',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: "#2ecc71",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    startButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1
    }
});

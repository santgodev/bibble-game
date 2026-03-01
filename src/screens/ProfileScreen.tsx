import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';

export const ProfileScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState<any>(null);
    const [church, setChurch] = useState<any>(null);

    // Forms
    const [churchName, setChurchName] = useState('');
    const [churchCity, setChurchCity] = useState('');
    const [churchAddress, setChurchAddress] = useState('');
    const [churchPhone, setChurchPhone] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigation.replace('Auth');
                return;
            }

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (userData) {
                setUserStats(userData);

                if (userData.church_id) {
                    const { data: churchData } = await supabase
                        .from('churches')
                        .select('*')
                        .eq('id', userData.church_id)
                        .single();
                    if (churchData) setChurch(churchData);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChurch = async () => {
        if (!churchName) {
            Alert.alert('Error', 'Ingresa el nombre de la iglesia');
            return;
        }
        setActionLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado');

            // 1. Create church
            const { data: newChurch, error: createError } = await supabase
                .from('churches')
                .insert([{
                    name: churchName,
                    city: churchCity || null,
                    address: churchAddress || null,
                    phone: churchPhone || null,
                }])
                .select()
                .single();

            if (createError) throw createError;

            // 2. Update or Create user
            if (userStats?.id) {
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ church_id: newChurch.id })
                    .eq('id', userStats.id);
                if (updateError) throw updateError;
            } else {
                // Rescue: User registered but has no public.users row
                const { error: insertError } = await supabase.from('users').insert({
                    id: user.id,
                    email: user.email,
                    username: user.user_metadata?.username || user.email?.split('@')[0],
                    full_name: user.user_metadata?.full_name || 'Gamer',
                    church_id: newChurch.id,
                    role: 'USER',
                    total_xp: 0,
                    total_trophies: 0,
                    level: 1
                });
                if (insertError) throw insertError;
            }

            Alert.alert('¡Iglesia Creadada!', 'Ya tienes tu propia iglesia.');
            setChurch(newChurch);
            setUserStats({ ...userStats, church_id: newChurch.id, id: user.id });

        } catch (err: any) {
            Alert.alert('Error', err.message || 'No se pudo crear la iglesia');
        } finally {
            setActionLoading(false);
        }
    };

    const handleInviteUser = async () => {
        if (!inviteUsername) {
            Alert.alert('Error', 'Ingresa el nombre de usuario');
            return;
        }
        setActionLoading(true);
        try {
            // Clean the username: remove leading '@' and trim spaces
            const cleanUsername = inviteUsername.replace(/^@/, '').trim();

            // Find user securely
            const { data: targetUsers, error: findError } = await supabase
                .from('users')
                .select('*')
                .ilike('username', `%${cleanUsername}%`)
                .limit(1);

            if (findError) {
                console.log('Error finding user:', findError);
                throw new Error('Hubo un problema buscando al usuario.');
            }

            if (!targetUsers || targetUsers.length === 0) {
                throw new Error('Usuario no encontrado. Asegúrate de escribirlo exactamente igual.');
            }

            const targetUser = targetUsers[0];

            if (targetUser.church_id === church.id) {
                Alert.alert('Info', 'Este usuario ya está en tu iglesia');
                setActionLoading(false);
                return;
            }

            // Update user
            const { error: updateError } = await supabase
                .from('users')
                .update({ church_id: church.id })
                .eq('id', targetUser.id);

            if (updateError) throw updateError;

            Alert.alert('¡Invitación Exitosa!', `@${inviteUsername} ha sido unido a la iglesia ${church.name}.`);
            setInviteUsername('');

        } catch (err: any) {
            Alert.alert('Error', err.message || 'No se pudo invitar al usuario');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 20, paddingTop: insets.top + 20 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Profile Brief */}
            {userStats && (
                <View style={styles.profileHeader}>
                    <View style={styles.avatarGlow}>
                        <Ionicons name="person" size={40} color={theme.colors.textSecondary} />
                    </View>
                    <Text style={styles.username}>@{userStats.username}</Text>
                    <View style={styles.xpBadge}>
                        <Ionicons name="star" size={14} color={theme.colors.primary} />
                        <Text style={styles.xpText}>{userStats.total_xp} XP Total</Text>
                    </View>
                </View>
            )}

            {/* Church Section */}
            <View style={styles.sectionContainer}>
                {!church ? (
                    // Create Church Area
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="home" size={20} color={theme.colors.text} />
                            <Text style={styles.cardTitle}>Crear Nueva Iglesia</Text>
                        </View>
                        <Text style={styles.cardDesc}>Aún no formas parte de una iglesia. Crea una para competir en conjunto.</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la Iglesia"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={churchName}
                            onChangeText={setChurchName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Ciudad"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={churchCity}
                            onChangeText={setChurchCity}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Dirección (Opcional)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={churchAddress}
                            onChangeText={setChurchAddress}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Teléfono (Opcional)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={churchPhone}
                            onChangeText={setChurchPhone}
                            keyboardType="phone-pad"
                        />

                        <TouchableOpacity style={styles.submitBtn} onPress={handleCreateChurch} disabled={actionLoading}>
                            {actionLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitBtnText}>FUNDAR IGLESIA</Text>}
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Manage Church Area
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="home" size={20} color={theme.colors.primary} />
                            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>{church.name}</Text>
                        </View>
                        <Text style={styles.cardDesc}>Esta es tu iglesia actual. Si eres líder, puedes agregar a tus amigos buscando sus usuarios (Gamer Tags).</Text>

                        <View style={styles.separator} />

                        <Text style={styles.miniLabel}>Invitar Usuario al Equipo</Text>
                        <View style={styles.inlineForm}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                placeholder="@username"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={inviteUsername}
                                onChangeText={setInviteUsername}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity style={styles.inviteBtn} onPress={handleInviteUser} disabled={actionLoading}>
                                {actionLoading ? <ActivityIndicator color="#000" /> : <Ionicons name="person-add" size={20} color="#000" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    iconBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarGlow: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(206, 172, 92, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    xpText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 6,
    },
    sectionContainer: {
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginLeft: 8,
    },
    cardDesc: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        padding: 16,
        color: theme.colors.text,
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginBottom: 12,
    },
    submitBtn: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 20,
    },
    miniLabel: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    inlineForm: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    inviteBtn: {
        backgroundColor: theme.colors.primary,
        width: 54,
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

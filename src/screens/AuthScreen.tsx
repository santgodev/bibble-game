import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { EditorialDoodle } from '../trivia/components/EditorialDoodle';

const BG = '#FFFFFF';
const SURFACE = '#F6F8FA';
const INK = '#1B1E23';
const MUTED = '#5B6573';
const ZAFIRO = '#1E3A5F';
const EUCALIPTO_SOFT = '#DCECE8';

export const AuthScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const [isLogin, setIsLogin] = useState(route?.params?.mode !== 'signup');
    const [loading, setLoading] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos requeridos.');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password: password.trim(),
                });
                if (error) throw error;
                navigation.replace('RankingDashboard');
            } else {
                if (!fullName || !username) {
                    Alert.alert('Error', 'Completa tu nombre y usuario.');
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password: password.trim(),
                    options: {
                        data: {
                            full_name: fullName.trim(),
                            username: username.trim(),
                            phone: phone.trim(),
                        }
                    }
                });

                if (error) throw error;

                if (data.user) {
                    await supabase.from('users').insert({
                        id: data.user.id,
                        email: data.user.email,
                        username: username.trim(),
                        full_name: fullName.trim(),
                        role: 'USER',
                        total_xp: 0,
                        total_trophies: 0,
                        level: 1
                    });
                }

                Alert.alert('Éxito', 'Registro completado. Por favor inicia sesión.');
                setIsLogin(true);
            }
        } catch (error: any) {
            Alert.alert('Error de autenticación', error.message || 'Algo salió mal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        >
            <StatusBar barStyle="dark-content" />

            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={22} color={INK} />
                </TouchableOpacity>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 36 }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.heroCard}>
                        <EditorialDoodle kind="dove" size={56} tint="#8CC4B8" />
                        <Text style={styles.title}>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</Text>
                        <Text style={styles.subtitle}>
                            {isLogin
                                ? 'Ingresa para ver tu progreso y ranking'
                                : 'Guarda tus logros y participa con tu iglesia'}
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@correo.com"
                            placeholderTextColor={MUTED}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={MUTED}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={password}
                            onChangeText={setPassword}
                        />

                        {!isLogin && (
                            <>
                                <Text style={styles.label}>Nombre completo</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. David Pérez"
                                    placeholderTextColor={MUTED}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />

                                <Text style={styles.label}>Usuario</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. David2026"
                                    placeholderTextColor={MUTED}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={username}
                                    onChangeText={setUsername}
                                />

                                <Text style={styles.label}>Teléfono (opcional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Tu número"
                                    placeholderTextColor={MUTED}
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleAuth}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitBtnText}>
                                    {isLogin ? 'Entrar' : 'Crear cuenta'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.switchBtn}
                        onPress={() => setIsLogin(!isLogin)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.switchBtnText}>
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    content: {
        width: '100%',
        maxWidth: 460,
        alignSelf: 'center',
        gap: 18,
    },
    heroCard: {
        backgroundColor: EUCALIPTO_SOFT,
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 24,
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: INK,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: MUTED,
        textAlign: 'center',
        lineHeight: 20,
    },
    form: {
        gap: 10,
    },
    label: {
        color: MUTED,
        fontSize: 13,
        fontWeight: '700',
        marginTop: 4,
    },
    input: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 15,
        color: INK,
        fontSize: 16,
        backgroundColor: SURFACE,
    },
    submitBtn: {
        backgroundColor: ZAFIRO,
        paddingVertical: 17,
        borderRadius: 18,
        alignItems: 'center',
        marginTop: 10,
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    switchBtn: {
        backgroundColor: SURFACE,
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
    },
    switchBtnText: {
        color: INK,
        fontSize: 14,
        fontWeight: '700',
    },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';

export const AuthScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [isLogin, setIsLogin] = useState(true);
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

                // After successful registration, forcefully create their row in public.users
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
            Alert.alert('Error de Autenticación', error.message || 'Algo salió mal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 20}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingTop: insets.top + 20, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registro'}</Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? 'Bienvenido de nuevo al ranking Impact' : 'Únete al ranking y suma puntos'}
                    </Text>

                    <View style={styles.form}>
                        {/* Always show Email and Password first for better UX */}
                        <Text style={styles.label}>Correo Electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@correo.com"
                            placeholderTextColor={theme.colors.textSecondary}
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
                            placeholderTextColor={theme.colors.textSecondary}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={password}
                            onChangeText={setPassword}
                        />

                        {!isLogin && (
                            <>
                                <Text style={styles.label}>Nombre Completo</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: David Pérez"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />

                                <Text style={styles.label}>Usuario (Gamer Tag)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: David2026"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={username}
                                    onChangeText={setUsername}
                                />

                                <Text style={styles.label}>Teléfono</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Tu número"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </>
                        )}

                        <TouchableOpacity style={styles.submitBtn} onPress={handleAuth} disabled={loading}>
                            {loading ? <ActivityIndicator color={theme.colors.background} /> : (
                                <Text style={styles.submitBtnText}>{isLogin ? 'INGRESAR' : 'CREAR CUENTA'}</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLogin(!isLogin)}>
                        <Text style={styles.switchBtnText}>
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.skipBtnText}>Omitir por ahora (Jugar sin ranking)</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 32,
    },
    form: {
        gap: 12,
    },
    label: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: -4,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        padding: 16,
        color: theme.colors.text,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 8,
    },
    submitBtn: {
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    submitBtnText: {
        color: theme.colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchBtn: {
        marginTop: 24,
        alignItems: 'center',
    },
    switchBtnText: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    skipBtn: {
        marginTop: 32,
        alignItems: 'center',
    },
    skipBtnText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});

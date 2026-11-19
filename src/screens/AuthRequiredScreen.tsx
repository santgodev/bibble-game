import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components';
import { EditorialDoodle } from '../trivia/components/EditorialDoodle';

const BG = '#FFFFFF';
const SURFACE = '#F6F8FA';
const INK = '#1B1E23';
const MUTED = '#5B6573';
const ZAFIRO = '#1E3A5F';
const ACUARELA_SOFT = '#D6E8F8';

export const AuthRequiredScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const title = route?.params?.title || 'Cada reto te lleva más alto';
    const desc =
        route?.params?.desc ||
        'Crea tu cuenta para guardar tu progreso y participar en el ranking.';

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.topBar}>
                <View style={{ width: 40 }} />
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="close" size={20} color={INK} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.heroCard}>
                    <EditorialDoodle kind="trophy" size={76} tint="#68AEEB" />
                    <AppText style={styles.title}>{title}</AppText>
                    <AppText style={styles.desc}>{desc}</AppText>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
                        activeOpacity={0.85}
                    >
                        <AppText style={styles.primaryBtnText}>Crear cuenta</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => navigation.navigate('Auth', { mode: 'login' })}
                        activeOpacity={0.8}
                    >
                        <AppText style={styles.secondaryBtnText}>Ya tengo cuenta</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        width: '100%',
        maxWidth: 460,
        alignSelf: 'center',
        gap: 20,
    },
    heroCard: {
        backgroundColor: ACUARELA_SOFT,
        borderRadius: 28,
        paddingHorizontal: 24,
        paddingVertical: 34,
        alignItems: 'center',
        gap: 14,
    },
    title: {
        color: INK,
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 30,
    },
    desc: {
        color: MUTED,
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
    actions: {
        gap: 10,
    },
    primaryBtn: {
        backgroundColor: ZAFIRO,
        borderRadius: 18,
        paddingVertical: 17,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 16,
    },
    secondaryBtn: {
        backgroundColor: SURFACE,
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: INK,
        fontWeight: '700',
        fontSize: 15,
    },
});

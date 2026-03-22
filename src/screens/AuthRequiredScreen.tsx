import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

export const AuthRequiredScreen = ({ navigation, route }: any) => {
    const title = route?.params?.title || "MÓDULO BLOQUEADO";
    const desc = route?.params?.desc || "Regístrate para guardar tu progreso, competir en el ranking mundial y unirte a un clan.";

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#050510', '#0a0a20', '#050510']} style={StyleSheet.absoluteFillObject} />

            {/* Background Glows */}
            <View style={styles.glow} />

            <View style={styles.content}>
                <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <LinearGradient colors={['rgba(212, 175, 55, 0.1)', 'transparent']} style={styles.lockIconBg}>
                        <Ionicons name="lock-closed" size={60} color="#D4AF37" />
                    </LinearGradient>

                    <AppText style={styles.title}>{title.toUpperCase()}</AppText>
                    <AppText style={styles.desc}>{desc}</AppText>

                    <View style={styles.featureList}>
                        <View style={styles.featureItem}>
                            <Ionicons name="trophy-outline" size={20} color="#D4AF37" />
                            <AppText style={styles.featureText}>Ranking Global en tiempo real</AppText>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#3498DB" />
                            <AppText style={styles.featureText}>Crea o únete a un Clan bíblico</AppText>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="cloud-upload-outline" size={20} color="#2ECC71" />
                            <AppText style={styles.featureText}>Tu progreso en la nube</AppText>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.primaryBtn} 
                        onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
                        activeOpacity={0.8}
                    >
                        <LinearGradient colors={['#D4AF37', '#B8860B']} style={styles.btnInner}>
                            <AppText style={styles.btnText}>¡UNIRME AHORA!</AppText>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.secondaryBtn} 
                        onPress={() => navigation.navigate('Auth', { mode: 'login' })}
                        activeOpacity={0.7}
                    >
                        <AppText style={styles.secondaryBtnText}>YA TENGO CUENTA</AppText>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity 
                    style={styles.closeBtn} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close" size={24} color="#555" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    glow: {
        position: 'absolute', top: height * 0.1, right: -width * 0.2,
        width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4,
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
    },
    content: { flex: 1, justifyContent: 'center', paddingHorizontal: 25 },
    card: {
        backgroundColor: '#0F0F25', borderRadius: 32, padding: 30,
        borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)',
        alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5, shadowRadius: 20, elevation: 15,
    },
    lockIconBg: {
        width: 100, height: 100, borderRadius: 50,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    title: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 2, marginBottom: 12, textAlign: 'center' },
    desc: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    featureList: { alignSelf: 'stretch', marginBottom: 35 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 16 },
    featureText: { color: '#ccc', fontSize: 13, fontWeight: '600' },
    primaryBtn: { alignSelf: 'stretch', borderRadius: 18, overflow: 'hidden', elevation: 10 },
    btnInner: { paddingVertical: 18, alignItems: 'center' },
    btnText: { color: '#000', fontWeight: '900', letterSpacing: 1.5, fontSize: 15 },
    secondaryBtn: { marginTop: 20 },
    secondaryBtnText: { color: '#555', fontWeight: '800', letterSpacing: 1 },
    closeBtn: { position: 'absolute', top: 60, right: 30, padding: 10 },
});

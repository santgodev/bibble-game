import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { EditorialDoodle } from '../components/EditorialDoodle';
import { TriviaHeader } from '../components/TriviaHeader';
import { TriviaStackParamList } from '../navigation/types';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaHome'>;
};

export const TriviaHomeScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();

    const goHome = () => {
        const parent = navigation.getParent();
        if (parent) parent.goBack();
        else navigation.goBack();
    };

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 32 }]}
            >
                <TriviaHeader
                    eyebrow="MODO DE JUEGO"
                    title="Trivia bíblica"
                    subtitle="Elige cómo quieres jugar hoy."
                    onBack={goHome}
                    backLabel="Volver al inicio"
                    variant="clean"
                />

                <View style={s.cardsColumn}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Para mí"
                        onPress={() => navigation.navigate('TriviaProgress')}
                        style={({ pressed }) => [s.sageHeroCard, pressed && s.cardPressed]}
                    >
                        <View style={s.cardHeaderRow}>
                            <View style={s.pillSoft}>
                                <AppText style={s.pillSoftText}>MODO PERSONAL</AppText>
                            </View>
                            <EditorialDoodle kind="sage" tint="#68AEEB" size={64} />
                        </View>
                        <AppText style={s.cardTitle}>Para mí</AppText>
                        <AppText style={s.cardDesc}>
                            Retoma tu avance, explora temas y supera los tres niveles.
                        </AppText>
                        <View style={s.cardFooter}>
                            <AppText style={s.footerAction}>Abrir Mi progreso</AppText>
                            <View style={s.navyCircle}>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </View>
                        </View>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Con amigos"
                        onPress={() => navigation.navigate('TriviaFriends')}
                        style={({ pressed }) => [s.goldCard, pressed && s.cardPressed]}
                    >
                        <View style={s.cardHeaderRow}>
                            <View style={s.pillGold}>
                                <AppText style={s.pillGoldText}>SALA CON CÓDIGO</AppText>
                            </View>
                            <EditorialDoodle kind="dove" tint="#FFFFFF" size={64} />
                        </View>
                        <AppText style={s.cardTitle}>Con amigos</AppText>
                        <AppText style={s.cardDesc}>
                            Crea o únete con un código desde cada teléfono.
                        </AppText>
                        <View style={s.cardFooter}>
                            <AppText style={s.footerAction}>Jugar con amigos</AppText>
                            <View style={s.navyCircle}>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </View>
                        </View>
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
    },
    cardsColumn: {
        gap: 16,
    },
    sageHeroCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: '#DCECE8',
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
    goldCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: '#F5DA7C',
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
    lockedCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: '#F6F8FA',
        opacity: 0.85,
    },
    pillMuted: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
    },
    pillMutedText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.9,
        color: '#5B6573',
    },
    lockedCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#E8EDF2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardPressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.94,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    pillSoft: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.75)',
    },
    pillSoftText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.9,
        color: '#2E6F65',
    },
    pillGold: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.68)',
    },
    pillGoldText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.9,
        color: '#1E3A5F',
    },
    cardTitle: {
        fontSize: 25,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -0.5,
    },
    cardDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#34404A',
        marginTop: 6,
    },
    cardFooter: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerAction: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    navyCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

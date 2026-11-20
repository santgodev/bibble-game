import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { EditorialDoodle } from '../components/EditorialDoodle';
import { TriviaHeader } from '../components/TriviaHeader';
import { TriviaStackParamList } from '../navigation/types';
import { useSound } from '../../context/SoundContext';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaFriends'>;
};

export const TriviaFriendsScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();
    const { playSound } = useSound();

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <TriviaHeader
                    eyebrow="TRIVIA BÍBLICA"
                    title="Con amigos"
                    onBack={() => {
                        playSound('tap');
                        navigation.goBack();
                    }}
                    backLabel="Volver a Trivia bíblica"
                    variant="clean"
                />

                <View style={s.cardsColumn}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Crear sala"
                        onPress={() => {
                            playSound('select');
                            navigation.navigate('TriviaCreateRoom');
                        }}
                        style={({ pressed }) => [s.createCard, pressed && s.pressed]}
                    >
                        <View style={s.topRow}>
                            <View style={s.pill}>
                                <AppText style={s.pillText}>ANFITRIÓN</AppText>
                            </View>
                            <EditorialDoodle kind="crown" tint="#FFFFFF" size={62} />
                        </View>
                        <AppText style={s.title}>Crear sala</AppText>
                        <View style={s.footer}>
                            <AppText style={s.footerText}>Generar código</AppText>
                            <View style={s.navyCircle}>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </View>
                        </View>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Unirme con código"
                        onPress={() => {
                            playSound('select');
                            navigation.navigate('TriviaJoinRoom');
                        }}
                        style={({ pressed }) => [s.joinCard, pressed && s.pressed]}
                    >
                        <View style={s.topRow}>
                            <View style={s.pill}>
                                <AppText style={s.pillText}>INVITADO</AppText>
                            </View>
                            <EditorialDoodle kind="dove" tint="#FFFFFF" size={62} />
                        </View>
                        <AppText style={s.title}>Unirme con código</AppText>
                        <View style={s.footer}>
                            <AppText style={s.footerText}>Entrar a una partida</AppText>
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
    createCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: '#F5DA7C',
    },
    joinCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: '#D6E8F8',
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.93,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.78)',
    },
    pillText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        color: '#1E3A5F',
    },
    title: {
        fontSize: 25,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -0.5,
    },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerText: {
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

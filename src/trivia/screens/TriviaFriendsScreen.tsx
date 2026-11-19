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
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaFriends'>;
};

export const TriviaFriendsScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <TriviaHeader
                    eyebrow="TRIVIA BÍBLICA"
                    title="Con amigos"
                    onBack={() => navigation.goBack()}
                    backLabel="Volver a Trivia bíblica"
                    variant="clean"
                />

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Crear sala"
                    onPress={() => navigation.navigate('TriviaCreateRoom')}
                    style={({ pressed }) => [s.createCard, pressed && s.pressed]}
                >
                    <View style={s.topRow}>
                        <AppText style={s.title}>Crear sala</AppText>
                        <EditorialDoodle kind="dove" tint="#FFFFFF" size={64} />
                    </View>

                    <View style={s.footer}>
                        <AppText style={s.footerText}>Jugar por equipos</AppText>
                        <View style={s.navyCircle}>
                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                        </View>
                    </View>
                </Pressable>
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
    createCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: '#F5DA7C',
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
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
        backgroundColor: 'rgba(255,255,255,0.72)',
    },
    pillText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        color: '#1E3A5F',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: '#34404A',
        marginTop: 5,
    },
    footer: {
        marginTop: 22,
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
    stepsPanel: {
        marginTop: 18,
        padding: 20,
        borderRadius: 24,
        backgroundColor: '#F6F8FA',
        gap: 12,
    },
    stepsTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1B1E23',
        marginBottom: 2,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    stepText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 19,
        color: '#4E5B66',
    },
});

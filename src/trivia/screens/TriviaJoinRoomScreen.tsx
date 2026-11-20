import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { useSound } from '../../context/SoundContext';
import { TriviaHeader } from '../components/TriviaHeader';
import { TriviaStackParamList } from '../navigation/types';
import { joinTriviaRoomByCode, loadDefaultDisplayName } from '../online/triviaRoomService';

type Props = {
    navigation: StackNavigationProp<TriviaStackParamList, 'TriviaJoinRoom'>;
};

export const TriviaJoinRoomScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();
    const { playSound } = useSound();

    const [roomCode, setRoomCode] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        loadDefaultDisplayName().then(name => {
            if (name) setDisplayName(prev => prev || name);
        });
    }, []);

    const cleanCode = roomCode.trim().toUpperCase();
    const cleanName = displayName.trim();
    const isDisabled = loading || cleanCode.length < 4 || !cleanName;

    const handleJoin = async () => {
        if (isDisabled) return;
        setLoading(true);
        setErrorMsg(null);
        try {
            const session = await joinTriviaRoomByCode({
                roomCode: cleanCode,
                displayName: cleanName,
            });
            playSound('unlock');
            navigation.replace('TriviaOnlineLobby', { session });
        } catch (err: any) {
            setErrorMsg(err?.message || 'No se pudo entrar a la sala.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
                keyboardShouldPersistTaps="handled"
            >
                <TriviaHeader
                    eyebrow="CON AMIGOS"
                    title="Unirme con código"
                    onBack={() => {
                        playSound('tap');
                        navigation.goBack();
                    }}
                    backLabel="Volver a Con amigos"
                    variant="clean"
                />

                <View style={s.block}>
                    <AppText style={s.blockTitle}>Código de sala</AppText>
                    <TextInput
                        accessibilityLabel="Código de sala"
                        value={roomCode}
                        onChangeText={val => {
                            setRoomCode(val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
                            if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="Ej. A7K9P2"
                        placeholderTextColor="#9AA3AE"
                        autoCapitalize="characters"
                        autoCorrect={false}
                        maxLength={6}
                        style={s.codeInput}
                    />
                </View>

                <View style={s.block}>
                    <AppText style={s.blockTitle}>Tu nombre</AppText>
                    <TextInput
                        accessibilityLabel="Tu nombre"
                        value={displayName}
                        onChangeText={val => {
                            setDisplayName(val);
                            if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="Ej. María"
                        placeholderTextColor="#9AA3AE"
                        maxLength={28}
                        autoCorrect={false}
                        style={s.nameInput}
                    />
                </View>

                {!!errorMsg && (
                    <View style={s.errorBox}>
                        <Ionicons name="alert-circle-outline" size={18} color="#8E3B3B" />
                        <AppText style={s.errorText}>{errorMsg}</AppText>
                    </View>
                )}

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Entrar a la sala"
                    disabled={isDisabled}
                    onPress={handleJoin}
                    style={({ pressed }) => [
                        s.joinBtn,
                        isDisabled && s.joinBtnDisabled,
                        !isDisabled && pressed && s.pressed,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <AppText style={s.joinBtnText}>Entrar a la sala</AppText>
                    )}
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
        gap: 14,
    },
    block: {
        padding: 18,
        borderRadius: 24,
        backgroundColor: '#F6F8FA',
        gap: 12,
    },
    blockTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1B1E23',
    },
    codeInput: {
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 6,
        textAlign: 'center',
        color: '#1E3A5F',
    },
    nameInput: {
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontWeight: '700',
        color: '#1B1E23',
    },
    errorBox: {
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#F7E6E6',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        color: '#8E3B3B',
    },
    joinBtn: {
        marginTop: 8,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    joinBtnDisabled: {
        opacity: 0.45,
    },
    joinBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.92,
    },
});

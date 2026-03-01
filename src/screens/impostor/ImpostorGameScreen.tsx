import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, AppText, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useGameTimer } from '../../hooks';
import { useSound } from '../../context/SoundContext';

export const ImpostorGameScreen = ({ navigation, route }: any) => {
    const { duration, impostorList, secretWord, secretCategory, players, playerDetails } = route.params;

    const [isFinished, setIsFinished] = useState(false);
    const [starterPlayer, setStarterPlayer] = useState('');
    const { pauseMusic, resumeMusic } = useSound();

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            pauseMusic();
            return () => resumeMusic();
        }, [])
    );

    const onTimeEnd = () => {
        setIsFinished(true);
    };

    const { timeLeft, startTimer, stopTimer } = useGameTimer(duration, onTimeEnd);

    useEffect(() => {
        startTimer();
        // Elegir jugador aleatorio para empezar
        if (playerDetails && playerDetails.length > 0) {
            const rIndex = Math.floor(Math.random() * playerDetails.length);
            setStarterPlayer(playerDetails[rIndex].username);
        } else {
            setStarterPlayer(`Jugador ${Math.floor(Math.random() * players) + 1}`);
        }
        return () => stopTimer();
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleVote = () => {
        stopTimer();
        navigation.navigate('ImpostorResults', {
            impostorList,
            secretWord,
            secretCategory,
            players,
            playerDetails
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconBtn}>
                    <Ionicons name="close" size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="help" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            <Container centered style={{ backgroundColor: 'transparent', flex: 1, paddingHorizontal: 20 }}>
                <View style={styles.chatIconWrapper}>
                    <Ionicons name="chatbubble-ellipses" size={45} color="#000" />
                </View>

                <AppText style={styles.title}>Debate</AppText>

                <AppText style={styles.instruction}>
                    Uno por uno, los jugadores dicen una palabra o frase relacionada con la palabra secreta.
                </AppText>

                <AppText style={styles.starterText}>
                    {starterPlayer} empieza.
                </AppText>

                <View style={styles.timerWrapper}>
                    <View style={styles.timerCircle}>
                        <AppText variant="display" style={[styles.timer, timeLeft <= 10 && { color: '#ff4d4d' }]}>
                            {formatTime(timeLeft)}
                        </AppText>
                    </View>
                </View>

                <AppText style={styles.bottomInstruction}>
                    {isFinished ? "¡El tiempo se acabó! Votación obligatoria." : "Para el cronómetro cuando estén listos para votar."}
                </AppText>
            </Container>

            <View style={styles.footerArea}>
                <TouchableOpacity
                    style={[styles.voteBtn, isFinished && { backgroundColor: '#e74c3c', borderColor: '#c0392b' }]}
                    onPress={handleVote}
                >
                    <AppText style={styles.voteBtnText}>
                        Votar
                    </AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a14',
        paddingTop: 50,
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    iconBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20
    },
    chatIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8
    },
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 15,
        lineHeight: 40,
        includeFontPadding: false
    },
    instruction: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
        lineHeight: 28,
        fontWeight: '500',
        includeFontPadding: false
    },
    starterText: {
        fontSize: 22,
        color: '#FFD700', // Amarillo fuerte
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        lineHeight: 30,
        includeFontPadding: false
    },
    timerWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    timerCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 8,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timer: {
        fontSize: 75,
        color: '#fff',
        fontWeight: '900',
        lineHeight: 85,
        includeFontPadding: false
    },
    bottomInstruction: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        lineHeight: 24,
        includeFontPadding: false
    },
    footerArea: {
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center'
    },
    voteBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#2ecc71',
        paddingVertical: 18,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 5,
        borderColor: '#27ae60'
    },
    voteBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'none'
    }
});

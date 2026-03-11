import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated, PanResponder, ScrollView } from 'react-native';
import { Container, AppText } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';

export const ImpostorPassScreen = ({ navigation, route }: any) => {
    const { players, playerDetails, impostors, hintEnabled, duration, selectedCategories } = route.params;

    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [hasPeeked, setHasPeeked] = useState(false);

    // Animación de deslizar la carta hacia arriba
    const panY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dy: panY }],
                { useNativeDriver: false } // dy coming from gestureState
            ),
            onPanResponderRelease: (e, gestureState) => {
                // Si la carta fue levantada suficiente, permitimos pasar al siguiente
                if (gestureState.dy < -60) {
                    setHasPeeked(true);
                }

                // Siempre retorna abajo suavemente al soltar (como resorte elástico)
                Animated.spring(panY, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 6,
                    speed: 12
                }).start();
            }
        })
    ).current;

    // Game Data
    const [secretWord, setSecretWord] = useState('');
    const [secretCategory, setSecretCategory] = useState('');
    const [impostorList, setImpostorList] = useState<number[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    // Contextual hint generator (Minimalist keywords as requested)
    const getImpostorHint = (catTitle: string, chapterTitle: string, wordPool: any[], currentWord: string): string => {
        // Find if the word already has a predefined hint
        const wordObj = wordPool.find(w => (typeof w === 'string' ? w : w.word) === currentWord);
        if (wordObj && typeof wordObj === 'object' && wordObj.hint) {
            return wordObj.hint;
        }

        const CHAPTER_TAGS: Record<string, string> = {
            'Jesús es Dios': 'Juan 1 • Verbo • Deidad • Origen',
            'Jesús da vida': 'Juan 2-4 • Caná • Agua • Espíritu • Vino',
            'Jesús sana': 'Juan 5-6 • Milagros • Pan • Estanque • Vida',
            'Jesús revela': 'Juan 7-10 • Luz • Pastor • Puerta • Templo',
            'Jesús ressucita': 'Juan 11-12 • Lázaro • Resurrección • Ungido',
            'Pasión': 'Juan 13-19 • Cruz • Cena • Sacrificio • Sangre',
            'Gloria': 'Juan 20-21 • Resucitado • Misión • Victoria',
        };

        // Match by chapter
        for (const [key, tag] of Object.entries(CHAPTER_TAGS)) {
            if (chapterTitle?.toLowerCase().includes(key.toLowerCase()) ||
                catTitle?.toLowerCase().includes(key.toLowerCase())) {
                return `${tag} • ${catTitle.split(':')[0]}`;
            }
        }

        // Fallback: Build short keywords from pool
        const contextWords = wordPool
            .map(w => typeof w === 'string' ? w : w.word)
            .filter(w => w && w !== currentWord)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);

        if (contextWords.length >= 2) {
            return `${chapterTitle || catTitle} • ${contextWords.join(' • ')}`;
        }

        return chapterTitle || catTitle || 'Biblia';
    };

    useEffect(() => {
        // Pick random category logic
        if (selectedCategories && selectedCategories.length > 0) {
            const randomCat = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
            const pool = randomCat.words;
            if (pool && pool.length > 0) {
                const randomItem = pool[Math.floor(Math.random() * pool.length)];
                setSecretWord(typeof randomItem === 'string' ? randomItem : randomItem.word);

                // Rich contextual hint for the impostor
                const chapterTitle = randomCat.capitulo || randomCat.title;
                const wordValue = typeof randomItem === 'string' ? randomItem : randomItem.word;
                const richHint = getImpostorHint(randomCat.title, chapterTitle, pool, wordValue);
                setSecretCategory(richHint);
            } else {
                setSecretWord("Error");
            }
        }

        const impSet = new Set<number>();
        while (impSet.size < impostors) {
            impSet.add(Math.floor(Math.random() * players));
        }
        setImpostorList(Array.from(impSet));
    }, []);

    const isCurrentImpostor = impostorList.includes(currentPlayer);
    const currentUser = playerDetails ? playerDetails[currentPlayer] : { username: `JUGADOR ${currentPlayer + 1}` };

    const handleNext = () => {
        setHasPeeked(false);
        if (currentPlayer + 1 < players) {
            setCurrentPlayer(prev => prev + 1);
        } else {
            navigation.replace('ImpostorGame', {
                duration, impostorList, secretWord, secretCategory, players, playerDetails
            });
        }
    };

    // Interpolation against sliding downward into the screen and limiting upward slide
    const clampedY = panY.interpolate({
        inputRange: [-250, 0, 500],
        outputRange: [-250, 0, 0], // Sube máximo 250px, no baja
        extrapolate: 'clamp'
    });

    const frontAnimatedStyle = { transform: [{ translateY: clampedY }] };

    const cardCovers = [
        require('../../../assets/impostor/card1.png'),
        require('../../../assets/impostor/card2.png'),
        require('../../../assets/impostor/card3.png'),
        require('../../../assets/impostor/card4.png'),
        require('../../../assets/impostor/card5.png'),
        require('../../../assets/impostor/card6.png'),
        require('../../../assets/impostor/card7.png'),
        require('../../../assets/impostor/card8.png'),
        require('../../../assets/impostor/card9.png'),
        require('../../../assets/impostor/card10.png'),
        require('../../../assets/impostor/card11.png'),
        require('../../../assets/impostor/card12.png'),
        require('../../../assets/impostor/card13.png'),
        require('../../../assets/impostor/card14.png'),
        require('../../../assets/impostor/card15.png'),
        require('../../../assets/impostor/card16.png'),
        require('../../../assets/impostor/card17.png')
    ];

    const getCardImage = () => {
        return cardCovers[currentPlayer % cardCovers.length];
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="close" size={28} color="#FFF" />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="help" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Turn Banner */}
            <View style={styles.turnBanner}>
                <AppText style={styles.turnLabel}>TURNO DE JUGAR PARA:</AppText>
                <AppText variant="display" style={styles.playerName} numberOfLines={1} adjustsFontSizeToFit>{currentUser.username}</AppText>
            </View>

            {/* Card Content */}
            <View style={styles.cardWrapper}>
                <View style={{ width: 320, height: 410, alignSelf: 'center' }}>

                    {/* REVERSO de la Tarjeta (Rol Revelado, oculto debajo) */}
                    <View style={[styles.cardReverso, { zIndex: 1, position: 'absolute', top: 0, left: 0 }]}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}
                            showsVerticalScrollIndicator={false}
                        >
                            {isCurrentImpostor ? (
                                <View style={styles.impRoleBox}>
                                    <Ionicons name="glasses" size={80} color="#e74c3c" style={{ marginBottom: 10 }} />
                                    <AppText style={styles.roleTitleImp}>Tú eres el</AppText>
                                    <AppText variant="display" style={styles.roleValueImp}>IMPOSTOR</AppText>
                                    <AppText style={styles.detailText}>Escucha y analiza las preguntas.</AppText>

                                    {hintEnabled && (
                                        <View style={styles.hintTag}>
                                            <Ionicons name="bulb" size={16} color="#f39c12" style={{ marginBottom: 4 }} />
                                            <AppText style={styles.hintLabel}>PISTA DEL IMÓSTOR</AppText>
                                            <AppText style={styles.hintValue} adjustsFontSizeToFit>{secretCategory}</AppText>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.citRoleBox}>
                                    <Ionicons name="shield-checkmark" size={80} color="#2ecc71" style={{ marginBottom: 10 }} />
                                    <AppText style={styles.roleTitle}>Tú eres un</AppText>
                                    <AppText variant="display" style={styles.roleValue}>CIUDADANO</AppText>

                                    <View style={styles.wordPlate}>
                                        <AppText style={styles.wordLabel}>PALABRA SECRETA</AppText>
                                        <AppText style={styles.wordSecret} numberOfLines={2} adjustsFontSizeToFit>{secretWord}</AppText>
                                    </View>
                                    <AppText style={styles.detailText}>Evita que el impostor descubra esta palabra.</AppText>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {/* FRENTE de la Tarjeta (Arrastrable con Spring) */}
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[styles.card, frontAnimatedStyle, { zIndex: 2, position: 'absolute', top: 0, left: 0 }]}
                    >
                        <Image
                            source={getCardImage()}
                            style={styles.cardImageCover}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.9)']}
                            style={styles.cardOverlayBase}
                        >
                            <Ionicons name="chevron-up-circle" size={36} color="#fff" style={{ marginBottom: 5 }} />
                            <AppText style={styles.cardTouchText}>Desliza para revelar</AppText>
                        </LinearGradient>
                    </Animated.View>

                </View>
            </View>

            {/* Instruction Bottom */}
            <View style={styles.bottomArea}>
                <View style={styles.instructionPill}>
                    {!hasPeeked ? (
                        <AppText style={styles.bottomInstruction}>
                            Arrastra la tarjeta hacia arriba sin que nadie mire.
                        </AppText>
                    ) : (
                        <AppText style={styles.bottomInstruction}>
                            Pasa el teléfono al siguiente jugador en secreto.
                        </AppText>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.nextBtn, !hasPeeked && { opacity: 0.5, backgroundColor: 'rgba(255,255,255,0.1)' }]}
                    onPress={handleNext}
                    disabled={!hasPeeked}
                >
                    <AppText style={styles.nextBtnText}>{currentPlayer + 1 === players ? '¡EMPEZAR DEBATE!' : 'JUGADOR SIGUIENTE'}</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5e16b5', // Morado intenso spyfall
        paddingTop: 50,
        paddingBottom: 30
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 5
    },
    iconBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20
    },
    turnBanner: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10
    },
    turnLabel: {
        color: '#f1c40f',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: -5
    },
    playerName: {
        color: '#fff',
        fontSize: 48,
        fontWeight: '900',
        lineHeight: 52,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10
    },
    cardWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 30
    },
    card: {
        width: 320,
        height: 410,
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    cardImageCover: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: '#1E1E1E'
    },
    cardOverlayBase: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '40%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 25
    },
    cardTouchText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowRadius: 5
    },
    cardReverso: {
        width: 320,
        height: 410,
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        paddingTop: 30,
        paddingBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    impRoleBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    citRoleBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    roleTitle: {
        fontSize: 20,
        color: '#ccc',
        marginBottom: -5
    },
    roleTitleImp: {
        fontSize: 20,
        color: '#ccc',
        marginBottom: -5
    },
    roleValue: {
        fontSize: 38,
        color: '#2ecc71',
        marginBottom: 12
    },
    roleValueImp: {
        fontSize: 42,
        color: '#e74c3c',
        marginBottom: 12
    },
    detailText: {
        color: '#888',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 10
    },
    hintTag: {
        backgroundColor: 'rgba(243,156,18,0.12)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(243,156,18,0.4)',
        width: '100%',
        marginTop: 4,
    },
    hintValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 20,
    },
    hintLabel: {
        color: '#f39c12',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    wordPlate: {
        backgroundColor: '#2ecc71',
        width: '100%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10
    },
    wordLabel: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        opacity: 0.7
    },
    wordSecret: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 30
    },
    bottomArea: {
        paddingHorizontal: 25,
        alignItems: 'center',
        width: '100%',
        marginTop: 10
    },
    instructionPill: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    bottomInstruction: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600'
    },
    nextBtn: {
        backgroundColor: '#2ecc71',
        paddingVertical: 20,
        height: 65,
        justifyContent: 'center',
        width: '100%',
        borderRadius: 35,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
    nextBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        includeFontPadding: false
    },
});

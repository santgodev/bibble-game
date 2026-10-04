import { GlassBackground } from '../../components/Glass';
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated, PanResponder, ScrollView } from 'react-native';
import { AppText } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ImpostorPassScreen = ({ navigation, route }: any) => {
    const { players, playerDetails, impostors, hintEnabled, duration, selectedCategories, difficulty } = route.params;

    // Theme values from first selected category
    const mainCategory = selectedCategories?.[0];
    const themeGradients = mainCategory?.gradientColors || ["#D1E2DA", '#68A877', "#D1E2DA"];
    const primaryColor = '#A25078';

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
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy < -60) {
                    setHasPeeked(true);
                }
                Animated.spring(panY, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 6,
                    speed: 12
                }).start();
            }
        })
    ).current;

    const [secretWord, setSecretWord] = useState('');
    const [secretCategory, setSecretCategory] = useState('');
    const [impostorList, setImpostorList] = useState<number[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    useEffect(() => {
        const SEEN_KEY = 'seen_impostor_words_v2';
        const setupGame = async () => {
            if (selectedCategories && selectedCategories.length > 0) {
                // Junta TODAS las palabras de las categorías elegidas (cada una con su categoría)
                const entries: { word: string; category: string }[] = [];
                selectedCategories.forEach((cat: any) => {
                    (cat.words || []).forEach((w: any) => {
                        const text = typeof w === 'string' ? w : w.word;
                        if (text) entries.push({ word: text, category: cat.title });
                    });
                });

                if (entries.length > 0) {
                    const keyOf = (e: { word: string; category: string }) => `${e.category}|${e.word}`;
                    const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
                    let chosen = pickRandom(entries);

                    // --- NO REPETICIÓN: historial persistente de palabras ya jugadas ---
                    try {
                        const seenStr = await AsyncStorage.getItem(SEEN_KEY);
                        let seen: string[] = seenStr ? JSON.parse(seenStr) : [];

                        let available = entries.filter(e => !seen.includes(keyOf(e)));
                        if (available.length === 0) {
                            // Ya se jugaron todas las de esta selección: reinicia solo ese grupo
                            const poolKeys = new Set(entries.map(keyOf));
                            seen = seen.filter(k => !poolKeys.has(k));
                            available = entries;
                        }

                        chosen = pickRandom(available);
                        seen.push(keyOf(chosen));
                        await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(seen.slice(-1000)));
                    } catch (e) {
                        console.error('Error with word history', e);
                    }

                    setSecretWord(chosen.word);
                    setSecretCategory(chosen.category);
                }
            }
            const impSet = new Set<number>();
            while (impSet.size < impostors) {
                impSet.add(Math.floor(Math.random() * players));
            }
            setImpostorList(Array.from(impSet));
        };
        setupGame();
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

    const clampedY = panY.interpolate({
        inputRange: [-250, 0, 500],
        outputRange: [-250, 0, 0],
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
    ];

    return (
        <View style={styles.container}>
            <GlassBackground />



            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="close" size={24} color="#2D3043" />
                </TouchableOpacity>
                <AppText style={styles.turnLabel}>PASSA EL TELÉFONO</AppText>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.turnBanner}>
                <AppText style={styles.turnSubLabel}>TURNO DE:</AppText>
                <AppText variant="header" style={styles.playerName} numberOfLines={1} adjustsFontSizeToFit>{currentUser.username}</AppText>
            </View>

            <View style={styles.cardWrapper}>
                <View style={styles.cardContainer}>
                    {/* REVERSO (INFORMACIÓN SECRETA) */}
                    <View style={styles.cardReverso}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {isCurrentImpostor ? (
                                <View style={styles.roleBox}>
                                    <Ionicons name="glasses" size={80} color="#e74c3c" />
                                    <AppText style={styles.roleTitle}>Tú eres el</AppText>
                                    <AppText style={styles.roleValueImp} numberOfLines={1} adjustsFontSizeToFit>IMPOSTOR</AppText>
                                    <AppText style={styles.detailText}>Escucha bien y trata de no ser descubierto.</AppText>
                                    {hintEnabled && (
                                        <View style={styles.hintTag}>
                                            <AppText style={styles.hintLabel}>PISTA DE LA CATEGORÍA</AppText>
                                            <AppText style={styles.hintValue}>{secretCategory}</AppText>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.roleBox}>
                                    <Ionicons name="shield-checkmark" size={80} color="#68A877" />
                                    <AppText style={styles.roleTitle}>Tú eres un</AppText>
                                    <AppText style={styles.roleValueCit} numberOfLines={1} adjustsFontSizeToFit>CIUDADANO</AppText>

                                    <View style={styles.secretWordBox}>
                                         <AppText style={styles.secretWord} numberOfLines={1} adjustsFontSizeToFit>{secretWord}</AppText>
                                     </View>

                                    <View style={styles.catBox}>
                                        <AppText style={styles.catLabel}>CATEGORÍA:</AppText>
                                        <AppText style={styles.catValue}>{secretCategory}</AppText>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {/* FRENTE (PORTADA DESLIZABLE) */}
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[styles.card, frontAnimatedStyle, { zIndex: 10 }]}
                    >
                        <Image source={cardCovers[currentPlayer % cardCovers.length]} style={styles.cardImageCover} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardOverlayBase}>
                            <Ionicons name="chevron-up" size={32} color="#FFFFFF" />
                            <AppText style={[styles.cardTouchText, { color: "#FFFFFF" }]}>DESLIZA HACIA ARRIBA</AppText>
                        </LinearGradient>
                    </Animated.View>
                </View>

                {!hasPeeked && (
                    <AppText style={styles.hintPeekText}>
                        Desliza hacia arriba para ver tu rol en secreto.
                    </AppText>
                )}

                <TouchableOpacity
                    style={[styles.nextBtn, !hasPeeked && { opacity: 0.3 }, { backgroundColor: primaryColor }]}
                    onPress={handleNext}
                    disabled={!hasPeeked}
                >
                    <AppText style={styles.nextBtnText}>
                        {currentPlayer + 1 === players ? '¡EMPEZAR DEBATE!' : 'ENTENDIDO, SIGUIENTE'}
                    </AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, marginBottom: 10 },
    iconBtn: { padding: 8, backgroundColor: "rgba(255,255,255,0.48)", borderRadius: 12 },
    turnLabel: { color: "#636477", fontSize: 12, fontWeight: '900', letterSpacing: 2 },
    turnBanner: { alignItems: 'center', paddingHorizontal: 40, marginBottom: 20 },
    turnSubLabel: { color: "#68A877", fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
    playerName: { color: "#2D3043", fontSize: 42, textAlign: 'center', lineHeight: 50, fontWeight: '900' },
    cardWrapper: { flex: 1, alignItems: 'center', paddingHorizontal: 30 },
    cardContainer: { width: 320, height: 420, position: 'relative' },
    card: { width: '100%', height: '100%', backgroundColor: "rgba(255,255,255,0.52)", borderRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: "rgba(255,255,255,0.82)", shadowColor: "#3E4C45", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.12, shadowRadius: 30, elevation: 15 },
    cardImageCover: { width: '100%', height: '100%', resizeMode: 'cover' },
    cardOverlayBase: { position: 'absolute', bottom: 0, width: '100%', height: '50%', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30 },
    cardTouchText: { fontSize: 14, fontWeight: '900', letterSpacing: 2, marginTop: 10 },
    cardReverso: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(255,255,255,0.52)", borderRadius: 32, overflow: 'hidden', borderWidth: 2, borderColor: "#68A877" },
    scrollContent: { flexGrow: 1, padding: 25, alignItems: 'center', justifyContent: 'center' },
    roleBox: { alignItems: 'center', width: '100%' },
    roleTitle: { color: "#636477", fontSize: 16, fontWeight: '700', marginTop: 15 },
    roleValueImp: { color: '#E74C3C', fontSize: 44, fontWeight: '900', lineHeight: 52, textAlign: 'center' },
    roleValueCit: { color: '#68A877', fontSize: 44, fontWeight: '900', lineHeight: 52, width: '100%', textAlign: 'center' },
    detailText: { color: "#636477", textAlign: 'center', marginTop: 10, fontSize: 14 },
    hintTag: { backgroundColor: "rgba(11,138,94,0.1)", padding: 15, borderRadius: 16, marginTop: 25, width: '100%', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: "rgba(11,138,94,0.2)" },
    hintLabel: { color: "#68A877", fontSize: 10, fontWeight: '900', marginBottom: 5 },
    hintValue: { color: "#2D3043", fontSize: 20, fontWeight: '800' },
    secretWordBox: { marginTop: 20, paddingVertical: 15, width: '100%', alignItems: 'center' },
    secretWord: { color: "#2D3043", fontSize: 36, fontWeight: '900', textAlign: 'center', lineHeight: 44 },
    catBox: { marginTop: 15, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.48)" },
    catLabel: { color: "#636477", fontSize: 10, fontWeight: '900', textAlign: 'center' },
    catValue: { color: "#68A877", fontSize: 14, fontWeight: '800', textAlign: 'center' },
    hintPeekText: { color: "#636477", textAlign: 'center', fontSize: 13, marginTop: 20 },
    nextBtn: { width: '100%', height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
    nextBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: '900' }
});

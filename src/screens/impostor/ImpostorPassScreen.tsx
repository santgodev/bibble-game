import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated, PanResponder, ScrollView } from 'react-native';
import { AppText } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';

export const ImpostorPassScreen = ({ navigation, route }: any) => {
    const { players, playerDetails, impostors, hintEnabled, duration, selectedCategories, difficulty } = route.params;

    // Theme values from first selected category
    const mainCategory = selectedCategories?.[0];
    const themeGradients = mainCategory?.gradientColors || ['#0F172A', '#1E3A8A', '#0F172A'];
    const primaryColor = mainCategory?.color || '#D4AF37';

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
        const setupGame = async () => {
            if (selectedCategories && selectedCategories.length > 0) {
                let randomCat = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
                let pool = randomCat.words || [];
                if (pool.length > 0) {
                    // Filter pool if it contains WordItem objects with difficulty
                    let filteredPool = pool.filter((w: any) => {
                        if (typeof w === 'string') return true;
                        if (w.difficulty) return w.difficulty === (difficulty || 1);
                        return true;
                    });
                    if (filteredPool.length === 0) filteredPool = pool;

                    let wordObj = filteredPool[Math.floor(Math.random() * filteredPool.length)];
                    setSecretWord(typeof wordObj === 'string' ? wordObj : wordObj.word);
                    setSecretCategory(randomCat.title);
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
            <LinearGradient
                colors={themeGradients}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="close" size={24} color="#FFF" />
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
                                    <Ionicons name="shield-checkmark" size={80} color="#2ecc71" />
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
                            <Ionicons name="chevron-up" size={32} color={primaryColor} />
                            <AppText style={[styles.cardTouchText, { color: primaryColor }]}>DESLIZA HACIA ARRIBA</AppText>
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
    iconBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
    turnLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '900', letterSpacing: 2 },
    turnBanner: { alignItems: 'center', paddingHorizontal: 40, marginBottom: 20 },
    turnSubLabel: { color: '#D4AF37', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
    playerName: { color: '#fff', fontSize: 42, textAlign: 'center', lineHeight: 50, fontWeight: '900' },
    cardWrapper: { flex: 1, alignItems: 'center', paddingHorizontal: 30 },
    cardContainer: { width: 320, height: 420, position: 'relative' },
    card: { width: '100%', height: '100%', backgroundColor: '#1E1E1E', borderRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.6, shadowRadius: 30, elevation: 15 },
    cardImageCover: { width: '100%', height: '100%', resizeMode: 'cover' },
    cardOverlayBase: { position: 'absolute', bottom: 0, width: '100%', height: '50%', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30 },
    cardTouchText: { fontSize: 14, fontWeight: '900', letterSpacing: 2, marginTop: 10 },
    cardReverso: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0A0A0A', borderRadius: 32, overflow: 'hidden', borderWidth: 2, borderColor: '#D4AF37' },
    scrollContent: { flexGrow: 1, padding: 25, alignItems: 'center', justifyContent: 'center' },
    roleBox: { alignItems: 'center', width: '100%' },
    roleTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: '700', marginTop: 15 },
    roleValueImp: { color: '#E74C3C', fontSize: 44, fontWeight: '900', lineHeight: 52, textAlign: 'center' },
    roleValueCit: { color: '#2ECC71', fontSize: 44, fontWeight: '900', lineHeight: 52, width: '100%', textAlign: 'center' },
    detailText: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 10, fontSize: 14 },
    hintTag: { backgroundColor: 'rgba(212,175,55,0.1)', padding: 15, borderRadius: 16, marginTop: 25, width: '100%', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)' },
    hintLabel: { color: '#D4AF37', fontSize: 10, fontWeight: '900', marginBottom: 5 },
    hintValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
    secretWordBox: { marginTop: 20, paddingVertical: 15, width: '100%', alignItems: 'center' },
    secretWord: { color: '#fff', fontSize: 36, fontWeight: '900', textAlign: 'center', lineHeight: 44 },
    catBox: { marginTop: 15, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
    catLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', textAlign: 'center' },
    catValue: { color: '#D4AF37', fontSize: 14, fontWeight: '800', textAlign: 'center' },
    hintPeekText: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 13, marginTop: 20 },
    nextBtn: { width: '100%', height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
    nextBtnText: { color: '#000', fontSize: 18, fontWeight: '900' }
});

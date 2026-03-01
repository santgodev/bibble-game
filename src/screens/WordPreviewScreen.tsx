import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, LayoutAnimation, Platform, UIManager, TouchableOpacity, ImageBackground } from 'react-native';
import { Container, AppText, Button } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CharadaCard } from '../data/categories';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export const WordPreviewScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
    const { category, categoryObj, totalPool } = route.params || { category: 'Mock', categoryObj: {}, totalPool: [] };

    useFocusEffect(
        React.useCallback(() => {
            // Enforce Portrait when this screen is focused
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    const [displayedWords, setDisplayedWords] = useState<(string | CharadaCard)[]>([]);

    const [countdown, setCountdown] = useState(30);
    const [isPaused, setIsPaused] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    // Default game duration: 60 seconds
    const [gameDuration, setGameDuration] = useState(60);

    const [members, setMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [showMembers, setShowMembers] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: userData } = await supabase.from('users').select('church_id').eq('id', user.id).single();
                    if (userData?.church_id) {
                        const { data: churchMembers } = await supabase.from('users')
                            .select('id, username')
                            .eq('church_id', userData.church_id)
                            .order('username');
                        if (churchMembers) {
                            setMembers(churchMembers);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching members', error);
            }
        };
        fetchMembers();
    }, []);

    const toggleMember = (id: string) => {
        setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
    };

    useEffect(() => {
        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
        // Initial shuffle
        shuffleAndPick();
    }, [gameDuration]);

    useEffect(() => {
        if (countdown > 0 && !isPaused && !hasStarted) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !hasStarted) {
            startGame();
        }
    }, [countdown, isPaused, hasStarted]);

    const getWordsCount = (duration: number) => {
        if (duration <= 60) return 15;
        if (duration <= 90) return 20;
        if (duration <= 120) return 25;
        return 35; // 180s o más
    };

    const shuffleAndPick = () => {
        if (!totalPool || totalPool.length === 0) return;

        // Shuffle full pool
        const pool = [...totalPool];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const count = getWordsCount(gameDuration);
        setDisplayedWords(pool.slice(0, count));
    };

    const startGame = () => {
        if (hasStarted) return;
        setHasStarted(true);
        navigation.navigate('Game', { category, categoryObj, words: displayedWords, duration: gameDuration, playingMembers: selectedMembers });
    };

    const TimeOption = ({ seconds, label }: { seconds: number, label: string }) => (
        <TouchableOpacity
            style={[styles.timeOption, gameDuration === seconds && styles.timeOptionSelected]}
            onPress={() => setGameDuration(seconds)}
            activeOpacity={0.7}
        >
            <AppText style={[styles.timeText, gameDuration === seconds && styles.timeTextSelected]}>
                {label}
            </AppText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.backgroundContainer}>
            <Container style={styles.container}>
                <View style={styles.header}>
                    <AppText variant="subheader" centered style={styles.title}>{category}</AppText>
                    <View style={styles.countdownBox}>
                        <AppText style={styles.countdownNumber}>{countdown}</AppText>
                        <AppText style={styles.countdownSubtitle}>Segundos para iniciar</AppText>
                    </View>
                </View>

                <View style={styles.configContainer}>
                    <AppText style={styles.label}>{t('game_duration')}</AppText>
                    <View style={styles.timeSelector}>
                        <TimeOption seconds={60} label="60s" />
                        <TimeOption seconds={90} label="90s" />
                        <TimeOption seconds={120} label="120s" />
                        <TimeOption seconds={180} label="180s" />
                    </View>
                </View>

                <View style={[styles.previewContainer, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                    <AppText style={styles.previewLabel}>{t('words_round')}</AppText>
                    <ScrollView contentContainerStyle={styles.wordsGrid} showsVerticalScrollIndicator={false}>
                        {displayedWords.length === 0 ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                <AppText style={{ color: '#ccc', textAlign: 'center' }}>{t('no_words')}</AppText>
                            </View>
                        ) : (
                            displayedWords.map((item, index) => {
                                const wordText = typeof item === 'string' ? item : item.word;
                                return (
                                    <View key={index} style={styles.wordTag}>
                                        <AppText style={styles.wordText}>{wordText}</AppText>
                                    </View>
                                )
                            })
                        )}
                    </ScrollView>
                </View>

                {members.length > 0 && (
                    <View style={styles.configContainer}>
                        <TouchableOpacity
                            style={styles.accordionHeader}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setShowMembers(!showMembers);
                            }}
                            activeOpacity={0.7}
                        >
                            <AppText style={styles.label}>¿QUIÉN VA A JUGAR?</AppText>
                            <Ionicons name={showMembers ? "chevron-up" : "chevron-down"} size={20} color="#aaa" />
                        </TouchableOpacity>

                        {showMembers && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 10 }}>
                                {members.map(member => (
                                    <TouchableOpacity
                                        key={member.id}
                                        style={[styles.playerTag, selectedMembers.includes(member.id) && styles.playerTagSelected]}
                                        onPress={() => toggleMember(member.id)}
                                    >
                                        <AppText style={[styles.playerText, selectedMembers.includes(member.id) && styles.playerTextSelected]}>
                                            {member.username}
                                        </AppText>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                )}

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.premiumBtn, styles.premiumBtnSecondary, { marginBottom: 16 }]}
                        onPress={shuffleAndPick}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="shuffle" size={24} color="#D4AF37" style={{ marginRight: 10 }} />
                        <AppText style={styles.premiumBtnSecondaryText}>{t('shuffle')}</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.premiumBtn, styles.premiumBtnPrimary]}
                        onPress={startGame}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="play" size={24} color="#000" style={{ marginRight: 10 }} />
                        <AppText style={styles.premiumBtnPrimaryText}>{t('start', gameDuration)}</AppText>
                    </TouchableOpacity>
                </View>
            </Container>
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        backgroundColor: '#050505',
    },
    container: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: 'transparent',
    },
    header: {
        marginBottom: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        color: '#D4AF37', // Gold
        marginBottom: 10,
    },
    countdownBox: {
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        minWidth: 150
    },
    countdownNumber: {
        fontSize: 52,
        fontWeight: '900',
        color: '#D4AF37',
        lineHeight: 60,
        includeFontPadding: false,
    },
    countdownSubtitle: {
        fontSize: 12,
        color: '#D4AF37',
        opacity: 0.8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    configContainer: {
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 12,
    },
    label: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 8,
        textAlign: 'center'
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5,
    },
    timeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    timeOption: {
        flex: 1,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#555',
    },
    timeOptionSelected: {
        backgroundColor: '#D4AF37',
        borderColor: '#D4AF37',
    },
    timeText: {
        fontSize: 14,
        color: '#eee',
        fontWeight: 'bold',
    },
    timeTextSelected: {
        color: '#000',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    previewLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    wordTag: {
        backgroundColor: '#222',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    wordText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
    },
    actions: {
        justifyContent: 'flex-end',
    },
    playerTag: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#555',
    },
    playerTagSelected: {
        backgroundColor: 'rgba(206, 172, 92, 0.2)', // sublte gold
        borderColor: '#D4AF37', // Gold
    },
    playerText: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: 'bold',
    },
    playerTextSelected: {
        color: '#D4AF37',
    },
    premiumBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        minHeight: 60,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6
    },
    premiumBtnPrimary: {
        backgroundColor: '#D4AF37',
    },
    premiumBtnSecondary: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.5)'
    },
    premiumBtnPrimaryText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    premiumBtnSecondaryText: {
        color: '#D4AF37',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1
    }
});

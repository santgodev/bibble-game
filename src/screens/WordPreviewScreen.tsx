import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components';
import { CharadaCard } from '../data/categories';
import { supabase } from '../lib/supabase';
import { EditorialDoodle } from '../trivia/components/EditorialDoodle';

export const WordPreviewScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const { category, categoryObj, totalPool, difficulty } = route.params || {
        category: 'Charadas',
        categoryObj: {},
        totalPool: [],
        difficulty: null,
    };

    useFocusEffect(
        React.useCallback(() => {
            setHasStarted(false);
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    const [displayedWords, setDisplayedWords] = useState<(string | CharadaCard)[]>([]);
    const [hasStarted, setHasStarted] = useState(false);
    const [gameDuration, setGameDuration] = useState(60);
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [showMembers, setShowMembers] = useState(false);

    const shuffleSpin = useRef(new Animated.Value(0)).current;

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (user) {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('church_id')
                        .eq('id', user.id)
                        .single();
                    if (userData?.church_id) {
                        const { data: churchMembers } = await supabase
                            .from('users')
                            .select('id, username')
                            .eq('church_id', userData.church_id)
                            .order('username');
                        if (churchMembers) setMembers(churchMembers);
                    }
                }
            } catch (e) {
                console.error('Error fetching members', e);
            }
        };
        fetchMembers();
    }, []);

    const getWordsCount = (dur: number) => {
        if (dur <= 60) return 20;
        if (dur <= 90) return 30;
        return 45;
    };

    const shuffleAndPick = (dur?: number) => {
        const sourcePool =
            totalPool && totalPool.length > 0
                ? totalPool
                : categoryObj?.words || [];
        if (sourcePool.length === 0) return;
        const activeDuration = dur ?? gameDuration;

        let pool = [...sourcePool];
        if (difficulty) {
            pool = pool.filter((item: any) => {
                const itemDiff = typeof item === 'string' ? 1 : item.difficulty || 1;
                return itemDiff === difficulty;
            });
        }

        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        const targetCount = getWordsCount(activeDuration);
        const target = Math.min(targetCount, pool.length);
        setDisplayedWords(pool.slice(0, target));

        shuffleSpin.setValue(0);
        Animated.timing(shuffleSpin, {
            toValue: 1,
            duration: 380,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    useEffect(() => {
        shuffleAndPick(gameDuration);
    }, [totalPool, gameDuration]);

    const toggleMember = (id: string) => {
        setSelectedMembers(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const startGame = () => {
        if (hasStarted) return;
        setHasStarted(true);
        navigation.navigate('Game', {
            category,
            categoryObj,
            words: displayedWords,
            duration: gameDuration,
            playingMembers: selectedMembers,
        });
    };

    const durations = [
        { seconds: 60, label: '1 min' },
        { seconds: 90, label: '1:30' },
        { seconds: 120, label: '2 min' },
    ];

    const spinDeg = shuffleSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 110 }]}
            >
                {/* Header limpio */}
                <View style={s.topBar}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        onPress={() => navigation.goBack()}
                        style={s.navBtn}
                    >
                        <Ionicons name="chevron-back" size={20} color="#1B1E23" />
                    </TouchableOpacity>
                    <AppText style={s.topEyebrow}>CHARADAS</AppText>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Mezclar palabras"
                        onPress={() => shuffleAndPick(gameDuration)}
                        style={s.shuffleBtn}
                    >
                        <Animated.View style={{ transform: [{ rotate: spinDeg }] }}>
                            <Ionicons name="shuffle" size={18} color="#1E3A5F" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                {/* Tarjeta principal oro champán */}
                <View style={s.heroCard}>
                    <View style={s.heroRow}>
                        <View style={{ flex: 1 }}>
                            <AppText style={s.heroTitle} numberOfLines={2}>
                                {category}
                            </AppText>
                            <AppText style={s.heroMeta}>
                                {displayedWords.length} palabras
                            </AppText>
                        </View>
                        <EditorialDoodle kind="charades" tint="#FFFFFF" size={60} />
                    </View>
                </View>

                {/* Duración (máximo 3 botones) */}
                <View style={s.section}>
                    <AppText style={s.sectionLabel}>Duración</AppText>
                    <View style={s.durationRow}>
                        {durations.map(({ seconds, label }) => {
                            const active = gameDuration === seconds;
                            return (
                                <Pressable
                                    key={seconds}
                                    accessibilityRole="button"
                                    onPress={() => {
                                        setGameDuration(seconds);
                                        shuffleAndPick(seconds);
                                    }}
                                    style={({ pressed }) => [
                                        s.durPill,
                                        active && s.durPillActive,
                                        pressed && s.pressed,
                                    ]}
                                >
                                    <AppText style={[s.durText, active && s.durTextActive]}>
                                        {label}
                                    </AppText>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Vista previa compacta de palabras */}
                <View style={s.section}>
                    <AppText style={s.sectionLabel}>Palabras</AppText>
                    <View style={s.wordsGrid}>
                        {displayedWords.map((item, index) => {
                            const wordText = typeof item === 'string' ? item : item.word;
                            return (
                                <View key={index} style={s.wordChip}>
                                    <AppText style={s.wordText} numberOfLines={1}>
                                        {wordText}
                                    </AppText>
                                </View>
                            );
                        })}
                        {displayedWords.length === 0 && (
                            <AppText style={s.emptyText}>Sin palabras disponibles</AppText>
                        )}
                    </View>
                </View>

                {/* Quién juega (solo si hay miembros) */}
                {members.length > 0 && (
                    <View style={s.section}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => setShowMembers(!showMembers)}
                            style={s.membersToggle}
                        >
                            <AppText style={s.sectionLabel}>Jugadores</AppText>
                            <Ionicons
                                name={showMembers ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color="#5B6573"
                            />
                        </Pressable>

                        {showMembers && (
                            <View style={s.wordsGrid}>
                                {members.map(member => {
                                    const active = selectedMembers.includes(member.id);
                                    return (
                                        <Pressable
                                            key={member.id}
                                            onPress={() => toggleMember(member.id)}
                                            style={[s.memberChip, active && s.memberChipActive]}
                                        >
                                            <AppText
                                                style={[
                                                    s.memberText,
                                                    active && { color: '#1B1E23', fontWeight: '800' },
                                                ]}
                                            >
                                                {member.username}
                                            </AppText>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* CTA fijo abajo */}
            <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <Pressable
                    accessibilityRole="button"
                    disabled={hasStarted || displayedWords.length === 0}
                    onPress={startGame}
                    style={({ pressed }) => [
                        s.startBtn,
                        (hasStarted || displayedWords.length === 0) && { opacity: 0.5 },
                        pressed && s.pressed,
                    ]}
                >
                    <AppText style={s.startBtnText}>Empezar</AppText>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
            </View>
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
        paddingHorizontal: 20,
        paddingTop: 12,
        gap: 20,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topEyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        color: '#3D8A7B',
    },
    shuffleBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#DCECE8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: '#DCECE8',
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    heroTitle: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -0.5,
    },
    heroMeta: {
        fontSize: 13,
        fontWeight: '700',
        color: '#3D8A7B',
        marginTop: 4,
    },
    section: {
        gap: 10,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1B1E23',
    },
    durationRow: {
        flexDirection: 'row',
        gap: 10,
    },
    durPill: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 18,
        backgroundColor: '#F6F8FA',
        alignItems: 'center',
    },
    durPillActive: {
        backgroundColor: '#1E3A5F',
    },
    durText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#5B6573',
    },
    durTextActive: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    wordChip: {
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: '#F6F8FA',
    },
    wordText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1B1E23',
    },
    emptyText: {
        color: '#6E7785',
        fontSize: 14,
    },
    membersToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    memberChip: {
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: '#F6F8FA',
    },
    memberChipActive: {
        backgroundColor: '#DCECE8',
    },
    memberText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#5B6573',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        backgroundColor: 'rgba(255,255,255,0.92)',
    },
    startBtn: {
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    startBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
});

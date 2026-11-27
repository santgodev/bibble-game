import React, { useCallback, useState } from 'react';
import {
    Pressable, ScrollView, StyleSheet, View, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components';
import { EditorialDoodle } from '../trivia/components/EditorialDoodle';
import { GOSPEL_BOOKS, GospelId } from '../data/gospelsNtv';
import { useSound } from '../context/SoundContext';

const HIGHLIGHTS_KEY = '@berea_bible_highlights_v1';
const LAST_READ_KEY = '@berea_bible_last_read_v1';

const BG = '#FFFFFF';
const SURFACE = '#F6F8FA';
const INK = '#1B1E23';
const MUTED = '#5B6573';
const NAVY = '#1E3A5F';
const EUCALIPTO = '#2E6F65';

export const StudyPathsScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic } = useSound();
    const [lastRead, setLastRead] = useState<Partial<Record<GospelId, number>>>({});
    const [highlightCount, setHighlightCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem(LAST_READ_KEY).then(raw => {
                if (raw) {
                    try {
                        setLastRead(JSON.parse(raw));
                    } catch {
                        // ignore
                    }
                }
            });
            AsyncStorage.getItem(HIGHLIGHTS_KEY).then(raw => {
                if (raw) {
                    try {
                        setHighlightCount(Object.keys(JSON.parse(raw)).length);
                    } catch {
                        // ignore
                    }
                }
            });
        }, [])
    );

    const orderedBooks = [
        ...GOSPEL_BOOKS.filter(b => b.available),
        ...GOSPEL_BOOKS.filter(b => !b.available),
    ];

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[s.page, { paddingBottom: insets.bottom + 36 }]}
            >
                <View style={s.header}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        onPress={() => {
                            playSound('tap');
                            navigation.goBack();
                        }}
                        style={({ pressed }) => [s.backBtn, pressed && s.pressed]}
                    >
                        <Ionicons name="arrow-back" size={20} color={INK} />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <AppText style={s.eyebrow}>BIBLIA NTV</AppText>
                        <AppText style={s.title}>Los Evangelios</AppText>
                    </View>
                </View>

                <View style={s.summaryCard}>
                    <View style={{ flex: 1 }}>
                        <AppText style={s.summaryTitle}>
                            {highlightCount === 1
                                ? '1 versículo subrayado'
                                : `${highlightCount} versículos subrayados`}
                        </AppText>
                        <AppText style={s.summarySub}>
                            Toca cualquier versículo al leer para subrayarlo
                        </AppText>
                    </View>
                    <EditorialDoodle kind="olive" tint="#DCECE8" size={48} />
                </View>

                <View style={s.cardsColumn}>
                    {orderedBooks.map(book => {
                        const currentCap = lastRead[book.id] || 1;
                        if (!book.available) {
                            return (
                                <View
                                    key={book.id}
                                    accessibilityLabel={`${book.title}, próximamente`}
                                    accessibilityState={{ disabled: true }}
                                    style={s.disabledCard}
                                >
                                    <View style={s.cardHeaderRow}>
                                        <View style={s.pillMuted}>
                                            <AppText style={s.pillMutedText}>PRÓXIMAMENTE</AppText>
                                        </View>
                                        <EditorialDoodle
                                            kind={book.doodle}
                                            tint="#DCE3EA"
                                            size={58}
                                        />
                                    </View>

                                    <AppText style={[s.cardTitle, { color: '#5B6573' }]}>
                                        {book.title}
                                    </AppText>
                                    <AppText style={[s.cardSub, { color: '#6E7785' }]}>
                                        {book.subtitle}
                                    </AppText>

                                    <View style={s.cardFooter}>
                                        <AppText style={[s.footerAction, { color: '#6E7785' }]}>
                                            Próximamente
                                        </AppText>
                                        <View style={s.disabledCircle}>
                                            <Ionicons name="time-outline" size={16} color="#5B6573" />
                                        </View>
                                    </View>
                                </View>
                            );
                        }
                        return (
                            <Pressable
                                key={book.id}
                                accessibilityRole="button"
                                accessibilityLabel={`Leer ${book.title}`}
                                onPress={() => {
                                    playHaptic('selection');
                                    navigation.navigate('BibleReader', {
                                        gospelId: book.id,
                                        chapter: currentCap,
                                    });
                                }}
                                style={({ pressed }) => [
                                    s.gospelCard,
                                    { backgroundColor: book.accentBg },
                                    pressed && s.pressed,
                                ]}
                            >
                                <View style={s.cardHeaderRow}>
                                    <View style={s.pillWhite}>
                                        <AppText style={s.pillWhiteText}>
                                            {book.chapters.length} CAPÍTULOS
                                        </AppText>
                                    </View>
                                    <EditorialDoodle
                                        kind={book.doodle}
                                        tint={book.doodleTint}
                                        size={58}
                                    />
                                </View>

                                <AppText style={s.cardTitle}>{book.title}</AppText>
                                <AppText style={s.cardSub}>{book.subtitle}</AppText>

                                <View style={s.cardFooter}>
                                    <AppText style={s.footerAction}>
                                        {lastRead[book.id] ? `Continuar · Cap. ${currentCap}` : 'Comenzar lectura'}
                                    </AppText>
                                    <View style={s.navyCircle}>
                                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                                    </View>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    page: {
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.4,
        color: EUCALIPTO,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: INK,
        marginTop: 2,
    },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: SURFACE,
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 14,
        marginBottom: 20,
        gap: 12,
    },
    summaryTitle: { fontSize: 15, fontWeight: '800', color: INK },
    summarySub: { fontSize: 13, color: MUTED, marginTop: 2 },
    cardsColumn: { gap: 16 },
    gospelCard: {
        borderRadius: 28,
        padding: 22,
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
    disabledCard: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: SURFACE,
        opacity: 0.86,
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.94,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    pillWhite: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    pillWhiteText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.9,
        color: NAVY,
    },
    pillMuted: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    pillMutedText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.9,
        color: MUTED,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: INK,
    },
    cardSub: {
        fontSize: 14,
        color: '#34404A',
        marginTop: 4,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerAction: {
        fontSize: 14,
        fontWeight: '700',
        color: NAVY,
    },
    navyCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: NAVY,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E8EDF2',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

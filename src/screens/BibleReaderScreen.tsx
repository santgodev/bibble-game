import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Image,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components';
import { getChapterSceneVisuals, getGospelById, GospelId } from '../data/gospelsNtv';
import { useSound } from '../context/SoundContext';

const HIGHLIGHTS_KEY = '@berea_bible_highlights_v1';
const LAST_READ_KEY = '@berea_bible_last_read_v1';

type HighlightColorId = 'sage' | 'sky' | 'gold';

const HIGHLIGHT_COLORS: { id: HighlightColorId; bg: string; dot: string; label: string }[] = [
    { id: 'sage', bg: '#DCECE8', dot: '#2E6F65', label: 'Eucalipto' },
    { id: 'sky', bg: '#D6E8F8', dot: '#68AEEB', label: 'Acuarela' },
    { id: 'gold', bg: '#FBF2D0', dot: '#F5DA7C', label: 'Oro' },
];

const BG = '#FFFFFF';
const SURFACE = '#F6F8FA';
const INK = '#1B1E23';
const MUTED = '#5B6573';
const NAVY = '#1E3A5F';
const EUCALIPTO = '#2E6F65';

export const BibleReaderScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic } = useSound();

    const gospelId: GospelId = route?.params?.gospelId || 'marcos';
    const initialChapter: number = route?.params?.chapter || 1;
    const book = getGospelById(gospelId);

    const [chapterNum, setChapterNum] = useState(initialChapter);
    const [fontSize, setFontSize] = useState(17);
    const [imageCollapsed, setImageCollapsed] = useState(false);
    const [chapterPickerOpen, setChapterPickerOpen] = useState(false);

    const [highlights, setHighlights] = useState<Record<string, HighlightColorId>>({});
    const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
    const [activeSceneIndex, setActiveSceneIndex] = useState(0);

    const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
    const sceneOffsetsRef = useRef<Record<number, number>>({});
    const targetSceneRef = useRef(0);
    const imageFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        AsyncStorage.getItem(HIGHLIGHTS_KEY).then(raw => {
            if (raw) {
                try {
                    setHighlights(JSON.parse(raw));
                } catch {
                    // ignore malformed cache
                }
            }
        });
    }, []);

    useEffect(() => {
        AsyncStorage.getItem(LAST_READ_KEY).then(raw => {
            const parsed = raw ? JSON.parse(raw) : {};
            parsed[gospelId] = chapterNum;
            AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify(parsed));
        }).catch(() => {});
        setSelectedVerse(null);
        setActiveSceneIndex(0);
        targetSceneRef.current = 0;
        sceneOffsetsRef.current = {};
        scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [gospelId, chapterNum]);

    const chapter =
        book.chapters.find(c => c.number === chapterNum) || book.chapters[0];

    const sceneVisuals = useMemo(
        () => getChapterSceneVisuals(gospelId, chapter.number),
        [gospelId, chapter.number]
    );
    const currentScene = sceneVisuals[activeSceneIndex] || sceneVisuals[0];

    const switchSceneWithFade = (nextIdx: number) => {
        if (nextIdx === targetSceneRef.current) return;
        targetSceneRef.current = nextIdx;
        setActiveSceneIndex(nextIdx);
        imageFade.stopAnimation();
        imageFade.setValue(0.55);
        Animated.timing(imageFade, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
        }).start();
    };

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (sceneVisuals.length <= 1) return;
        const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
        const clampedY = Math.max(0, contentOffset.y);
        const nearBottom =
            contentSize.height > layoutMeasurement.height + 40 &&
            clampedY + layoutMeasurement.height >= contentSize.height - 24;
        if (nearBottom) {
            switchSceneWithFade(sceneVisuals.length - 1);
            return;
        }
        const focusY = clampedY + layoutMeasurement.height * 0.38;
        let nextIdx = 0;
        for (let i = 0; i < sceneVisuals.length; i++) {
            const offset = sceneOffsetsRef.current[sceneVisuals[i].startVerse];
            if (typeof offset === 'number' && focusY >= offset) {
                nextIdx = i;
            }
        }
        switchSceneWithFade(nextIdx);
    };

    const verseKey = (v: number) => `${gospelId}:${chapter.number}:${v}`;

    const applyHighlight = async (colorId: HighlightColorId | null) => {
        if (selectedVerse === null) return;
        const key = verseKey(selectedVerse);
        const next = { ...highlights };
        if (colorId === null) {
            delete next[key];
        } else {
            next[key] = colorId;
            playHaptic('selection');
        }
        setHighlights(next);
        setSelectedVerse(null);
        await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(next));
    };

    const shareSelectedVerse = async () => {
        if (selectedVerse === null) return;
        const v = chapter.verses.find(item => item.verse === selectedVerse);
        if (!v) return;
        try {
            await Share.share({
                message: `"${v.text}" — ${book.title} ${chapter.number}:${v.verse} (NTV)`,
            });
        } catch {
            // user cancelled
        }
    };

    const goToChapter = (nextNum: number) => {
        if (nextNum < 1 || nextNum > book.chapters.length) return;
        playSound('page');
        playHaptic('selection');
        setChapterNum(nextNum);
    };

    const selectedHighlight =
        selectedVerse !== null ? highlights[verseKey(selectedVerse)] : undefined;

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            {/* Top Bar */}
            <View style={s.topBar}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Volver"
                    onPress={() => navigation.goBack()}
                    style={s.circleBtn}
                >
                    <Ionicons name="arrow-back" size={20} color={INK} />
                </Pressable>

                <View style={s.chapterNav}>
                    <Pressable
                        onPress={() => goToChapter(chapter.number - 1)}
                        disabled={chapter.number <= 1}
                        style={[s.miniNavBtn, chapter.number <= 1 && { opacity: 0.35 }]}
                    >
                        <Ionicons name="chevron-back" size={18} color={NAVY} />
                    </Pressable>

                    <Pressable
                        onPress={() => setChapterPickerOpen(true)}
                        style={s.chapterPill}
                    >
                        <AppText style={s.chapterPillText}>
                            {book.title} {chapter.number}
                        </AppText>
                        <Ionicons name="chevron-down" size={14} color={NAVY} />
                    </Pressable>

                    <Pressable
                        onPress={() => goToChapter(chapter.number + 1)}
                        disabled={chapter.number >= book.chapters.length}
                        style={[s.miniNavBtn, chapter.number >= book.chapters.length && { opacity: 0.35 }]}
                    >
                        <Ionicons name="chevron-forward" size={18} color={NAVY} />
                    </Pressable>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cambiar tamaño de letra"
                    onPress={() => setFontSize(prev => (prev >= 21 ? 15 : prev + 2))}
                    style={s.circleBtn}
                >
                    <AppText style={s.fontToggleText}>Aa</AppText>
                </Pressable>
            </View>

            {/* MITAD SUPERIOR: Ilustración dinámica por sección */}
            {!imageCollapsed ? (
                <View style={[s.topVisualPane, { backgroundColor: book.accentBg }]}>
                    <Animated.View style={[s.imageSurface, { opacity: imageFade }]}>
                        <Image
                            key={`${gospelId}-${chapter.number}-${currentScene.startVerse}`}
                            source={currentScene.image}
                            style={[
                                s.illustration,
                                { transform: [{ scale: currentScene.scale ?? 1.28 }] },
                            ]}
                            resizeMode="contain"
                        />
                    </Animated.View>
                    <View style={s.visualFooterRow}>
                        <View style={s.sceneTagPill}>
                            <AppText style={s.sceneTagText} numberOfLines={1}>
                                {currentScene.ref
                                    ? `${currentScene.label} · ${currentScene.ref}`
                                    : currentScene.label}
                            </AppText>
                        </View>
                        <Pressable
                            onPress={() => setImageCollapsed(true)}
                            style={s.collapsePill}
                        >
                            <Ionicons name="chevron-up" size={14} color={NAVY} />
                        </Pressable>
                    </View>
                </View>
            ) : (
                <Pressable
                    onPress={() => setImageCollapsed(false)}
                    style={[s.collapsedBar, { backgroundColor: book.accentBg }]}
                >
                    <Ionicons name="image-outline" size={15} color={NAVY} />
                    <AppText style={s.collapsedText}>{currentScene.label}</AppText>
                    <Ionicons name="chevron-down" size={14} color={NAVY} />
                </Pressable>
            )}

            {/* MITAD INFERIOR: Biblia NTV linda y subrayable */}
            <View style={s.readerPane}>
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={32}
                    contentContainerStyle={[
                        s.readerContent,
                        { paddingBottom: insets.bottom + (selectedVerse !== null ? 104 : 44) },
                    ]}
                >
                    <View style={s.chapterHeader}>
                        <AppText style={s.translationTag}>NUEVA TRADUCCIÓN VIVIENTE</AppText>
                        <AppText style={s.chapterHeading}>
                            {book.title} {chapter.number}
                        </AppText>
                    </View>

                    {chapter.verses.map(v => {
                        const hlId = highlights[verseKey(v.verse)];
                        const hl = HIGHLIGHT_COLORS.find(c => c.id === hlId);
                        const isSelected = selectedVerse === v.verse;
                        const isSceneStart = sceneVisuals.some(sc => sc.startVerse === v.verse);

                        return (
                            <View
                                key={v.verse}
                                onLayout={
                                    isSceneStart
                                        ? e => {
                                            sceneOffsetsRef.current[v.verse] = e.nativeEvent.layout.y;
                                        }
                                        : undefined
                                }
                            >
                                {v.heading ? (
                                    <AppText style={s.sectionHeading}>{v.heading}</AppText>
                                ) : null}

                                <Pressable
                                    onPress={() =>
                                        setSelectedVerse(prev => (prev === v.verse ? null : v.verse))
                                    }
                                    style={[
                                        s.verseBlock,
                                        hl && { backgroundColor: hl.bg },
                                        isSelected && s.verseSelected,
                                    ]}
                                >
                                    <AppText
                                        style={[
                                            s.verseText,
                                            { fontSize, lineHeight: Math.round(fontSize * 1.62) },
                                        ]}
                                    >
                                        <AppText style={s.verseNum}>{v.verse}  </AppText>
                                        {v.text}
                                    </AppText>
                                </Pressable>
                            </View>
                        );
                    })}

                    <View style={s.bottomChapterNav}>
                        {chapter.number > 1 && (
                            <Pressable
                                onPress={() => goToChapter(chapter.number - 1)}
                                style={s.chapterFooterBtn}
                            >
                                <Ionicons name="arrow-back" size={16} color={NAVY} />
                                <AppText style={s.chapterFooterText}>Cap. {chapter.number - 1}</AppText>
                            </Pressable>
                        )}
                        {chapter.number < book.chapters.length && (
                            <Pressable
                                onPress={() => goToChapter(chapter.number + 1)}
                                style={[s.chapterFooterBtn, s.chapterFooterPrimary]}
                            >
                                <AppText style={[s.chapterFooterText, { color: '#FFFFFF' }]}>
                                    Siguiente: Cap. {chapter.number + 1}
                                </AppText>
                                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                            </Pressable>
                        )}
                    </View>
                </ScrollView>

                {/* Barra flotante de subrayado */}
                {selectedVerse !== null && (
                    <View style={[s.highlightBarWrap, { bottom: Math.max(insets.bottom, 14) }]}>
                        <View style={s.highlightBar}>
                            <AppText style={s.hlLabel}>v.{selectedVerse}</AppText>

                            {HIGHLIGHT_COLORS.map(color => (
                                <Pressable
                                    key={color.id}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Subrayar en ${color.label}`}
                                    onPress={() => applyHighlight(color.id)}
                                    style={[
                                        s.colorDot,
                                        { backgroundColor: color.bg },
                                        selectedHighlight === color.id && {
                                            transform: [{ scale: 1.15 }],
                                        },
                                    ]}
                                >
                                    <View style={[s.colorInnerDot, { backgroundColor: color.dot }]} />
                                </Pressable>
                            ))}

                            {selectedHighlight && (
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Quitar subrayado"
                                    onPress={() => applyHighlight(null)}
                                    style={s.barIconBtn}
                                >
                                    <Ionicons name="trash-outline" size={17} color="#9E3A3A" />
                                </Pressable>
                            )}

                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Compartir versículo"
                                onPress={shareSelectedVerse}
                                style={s.barIconBtn}
                            >
                                <Ionicons name="share-outline" size={17} color={NAVY} />
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>

            {/* Selector rápido de capítulo */}
            <Modal
                visible={chapterPickerOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setChapterPickerOpen(false)}
            >
                <Pressable style={s.modalOverlay} onPress={() => setChapterPickerOpen(false)}>
                    <Pressable style={s.modalCard} onPress={() => {}}>
                        <View style={s.modalHeader}>
                            <AppText style={s.modalTitle}>{book.title} · Capítulos</AppText>
                            <Pressable
                                onPress={() => setChapterPickerOpen(false)}
                                style={s.circleBtn}
                            >
                                <Ionicons name="close" size={18} color={INK} />
                            </Pressable>
                        </View>
                        <ScrollView contentContainerStyle={s.chapterGrid}>
                            {book.chapters.map(c => {
                                const active = c.number === chapter.number;
                                return (
                                    <Pressable
                                        key={c.number}
                                        onPress={() => {
                                            setChapterPickerOpen(false);
                                            goToChapter(c.number);
                                        }}
                                        style={[s.chapterCell, active && s.chapterCellActive]}
                                    >
                                        <AppText style={[s.chapterCellText, active && { color: '#FFFFFF' }]}>
                                            {c.number}
                                        </AppText>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    circleBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fontToggleText: {
        fontSize: 13,
        fontWeight: '800',
        color: NAVY,
    },
    chapterNav: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    miniNavBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chapterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: SURFACE,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
    },
    chapterPillText: {
        fontSize: 14,
        fontWeight: '800',
        color: NAVY,
    },

    // Top Visual Pane
    topVisualPane: {
        marginHorizontal: 16,
        borderRadius: 24,
        padding: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    imageSurface: {
        width: '100%',
        height: 220,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    visualFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
        gap: 8,
    },
    sceneTagPill: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.86)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
    },
    sceneTagText: {
        fontSize: 12,
        fontWeight: '700',
        color: NAVY,
    },
    collapsePill: {
        width: 30,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.86)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    collapsedBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 14,
        marginBottom: 6,
    },
    collapsedText: {
        fontSize: 12,
        fontWeight: '700',
        color: NAVY,
    },

    // Bottom Bible Reader Pane
    readerPane: {
        flex: 1,
        position: 'relative',
    },
    readerContent: {
        width: '100%',
        maxWidth: 700,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    chapterHeader: {
        marginBottom: 14,
    },
    translationTag: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.3,
        color: EUCALIPTO,
    },
    chapterHeading: {
        fontSize: 26,
        fontWeight: '800',
        color: INK,
        marginTop: 2,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '800',
        color: NAVY,
        marginTop: 16,
        marginBottom: 6,
    },
    verseBlock: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 4,
    },
    verseSelected: {
        backgroundColor: '#EEF2F6',
    },
    verseText: {
        color: INK,
        fontWeight: '400',
    },
    verseNum: {
        fontSize: 12,
        fontWeight: '800',
        color: EUCALIPTO,
    },
    bottomChapterNav: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 24,
    },
    chapterFooterBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: SURFACE,
        borderRadius: 16,
        paddingVertical: 14,
    },
    chapterFooterPrimary: {
        backgroundColor: NAVY,
    },
    chapterFooterText: {
        fontSize: 14,
        fontWeight: '700',
        color: NAVY,
    },

    // Floating highlight bar
    highlightBarWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    highlightBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 26,
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 18,
        elevation: 8,
    },
    hlLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: MUTED,
        marginRight: 2,
    },
    colorDot: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorInnerDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    barIconBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Modal chapter picker
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(27,30,35,0.35)',
        justifyContent: 'center',
        padding: 20,
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        maxHeight: '72%',
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: INK,
    },
    chapterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chapterCell: {
        width: 50,
        height: 44,
        borderRadius: 12,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chapterCellActive: {
        backgroundColor: NAVY,
    },
    chapterCellText: {
        fontSize: 15,
        fontWeight: '700',
        color: INK,
    },
});

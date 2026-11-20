import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { StoryScene, StudyMap } from '../data/studyPaths';
import { useSound } from '../context/SoundContext';

const INK = '#1B1E23';
const MUTED = '#5B6573';
const NAVY = '#1E3A5F';
const EUCALIPTO = '#2E6F65';
const EUCALIPTO_SOFT = '#DCECE8';
const ACUARELA_SOFT = '#D6E8F8';
const WATER = '#68AEEB';
const SURFACE = '#F6F8FA';

export const StorySceneCarousel = ({ scenes }: { scenes: StoryScene[] }) => {
    const [index, setIndex] = useState(0);
    const { playSound, playHaptic } = useSound();

    if (!scenes || scenes.length === 0) return null;
    const current = scenes[index];

    const goTo = (next: number) => {
        if (next < 0 || next >= scenes.length) return;
        playSound('tap');
        playHaptic('selection');
        setIndex(next);
    };

    return (
        <View style={[s.storyCard, { backgroundColor: current.accentBg || SURFACE }]}>
            <View style={s.storyTopRow}>
                <View style={s.versePill}>
                    <Ionicons name="book-outline" size={13} color={NAVY} />
                    <AppText style={s.versePillText}>{current.bibleRef}</AppText>
                </View>
                <AppText style={s.stepCounter}>
                    {index + 1} / {scenes.length}
                </AppText>
            </View>

            {current.image ? (
                <View style={s.imageFrame}>
                    <Image source={current.image} style={s.sceneImage} resizeMode="contain" />
                </View>
            ) : null}

            <AppText style={s.sceneTitle}>{current.title}</AppText>
            <AppText style={s.sceneCaption}>{current.caption}</AppText>

            <View style={s.storyNavRow}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Escena anterior"
                    onPress={() => goTo(index - 1)}
                    disabled={index === 0}
                    style={[s.navBtn, index === 0 && s.navBtnDisabled]}
                >
                    <Ionicons name="chevron-back" size={18} color={index === 0 ? '#AEB7C2' : NAVY} />
                </Pressable>

                <View style={s.dotsRow}>
                    {scenes.map((_, i) => (
                        <Pressable
                            key={i}
                            onPress={() => goTo(i)}
                            style={[s.dot, i === index && s.dotActive]}
                        />
                    ))}
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Siguiente escena"
                    onPress={() => goTo(index + 1)}
                    disabled={index === scenes.length - 1}
                    style={[
                        s.navBtn,
                        index === scenes.length - 1 ? s.navBtnDisabled : s.navBtnPrimary,
                    ]}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={index === scenes.length - 1 ? '#AEB7C2' : '#FFFFFF'}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export const InteractiveBibleMap = ({ map }: { map: StudyMap }) => {
    const [selectedId, setSelectedId] = useState(map.stops[0]?.id);
    const { playSound, playHaptic } = useSound();

    if (!map.stops || map.stops.length === 0) return null;
    const selected = map.stops.find(st => st.id === selectedId) || map.stops[0];

    const handleSelect = (id: string) => {
        playSound('select');
        playHaptic('selection');
        setSelectedId(id);
    };

    return (
        <View style={s.mapWrap}>
            <View style={s.mapHeader}>
                <Ionicons name="map-outline" size={16} color={EUCALIPTO} />
                <AppText style={s.mapTitle}>{map.title}</AppText>
            </View>

            {/* Lienzo cartográfico editorial (Tierra Santa estilizada) */}
            <View style={s.mapCanvas}>
                {/* Mar Mediterráneo (costa izquierda) */}
                <View style={s.medSea} />
                {/* Mar de Galilea */}
                <View style={s.galileeSea} />
                {/* Río Jordán */}
                <View style={s.jordanRiver} />
                {/* Mar Muerto */}
                <View style={s.deadSea} />

                {/* Etiquetas geográficas discretas */}
                <AppText style={[s.geoLabel, { top: '12%', left: '54%' }]}>GALILEA</AppText>
                <AppText style={[s.geoLabel, { top: '44%', left: '46%' }]}>SAMARIA</AppText>
                <AppText style={[s.geoLabel, { top: '72%', left: '48%' }]}>JUDEA</AppText>

                {/* Pines interactivos */}
                {map.stops.map((stop, idx) => {
                    const active = stop.id === selected.id;
                    return (
                        <Pressable
                            key={stop.id}
                            accessibilityRole="button"
                            accessibilityLabel={`Ver ${stop.name}`}
                            onPress={() => handleSelect(stop.id)}
                            style={[
                                s.pinWrap,
                                {
                                    left: `${stop.xPct}%` as any,
                                    top: `${stop.yPct}%` as any,
                                },
                            ]}
                        >
                            <View style={[s.pinCircle, active && s.pinCircleActive]}>
                                <AppText style={[s.pinNum, active && { color: '#FFFFFF' }]}>
                                    {idx + 1}
                                </AppText>
                            </View>
                            <View style={[s.pinTag, active && s.pinTagActive]}>
                                <AppText style={[s.pinTagText, active && { color: '#FFFFFF' }]}>
                                    {stop.name}
                                </AppText>
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* Ficha del punto seleccionado */}
            <View style={s.stopDetailCard}>
                <View style={s.stopTopRow}>
                    <AppText style={s.stopName}>{selected.name}</AppText>
                    <View style={s.stopVersePill}>
                        <AppText style={s.stopVerseText}>{selected.bibleRef}</AppText>
                    </View>
                </View>
                <AppText style={s.stopRegion}>{selected.region}</AppText>
                <AppText style={s.stopSummary}>{selected.summary}</AppText>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    storyCard: {
        borderRadius: 24,
        padding: 18,
        marginBottom: 18,
    },
    storyTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    versePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
    },
    versePillText: {
        fontSize: 12,
        fontWeight: '700',
        color: NAVY,
    },
    stepCounter: {
        fontSize: 12,
        fontWeight: '700',
        color: MUTED,
    },
    imageFrame: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        height: 210,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        overflow: 'hidden',
        padding: 10,
    },
    sceneImage: {
        width: '100%',
        height: '100%',
    },
    sceneTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: INK,
        marginBottom: 4,
    },
    sceneCaption: {
        fontSize: 14,
        lineHeight: 21,
        color: '#34404A',
        marginBottom: 16,
    },
    storyNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navBtnPrimary: {
        backgroundColor: NAVY,
    },
    navBtnDisabled: {
        opacity: 0.45,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(30,58,95,0.2)',
    },
    dotActive: {
        width: 20,
        backgroundColor: NAVY,
    },

    // Interactive Map
    mapWrap: {
        backgroundColor: SURFACE,
        borderRadius: 24,
        padding: 16,
        marginBottom: 18,
        gap: 12,
    },
    mapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mapTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: INK,
    },
    mapCanvas: {
        height: 240,
        borderRadius: 20,
        backgroundColor: EUCALIPTO_SOFT,
        overflow: 'hidden',
        position: 'relative',
    },
    medSea: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '28%',
        backgroundColor: ACUARELA_SOFT,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 18,
    },
    galileeSea: {
        position: 'absolute',
        right: '16%',
        top: '16%',
        width: 24,
        height: 34,
        borderRadius: 14,
        backgroundColor: WATER,
        opacity: 0.65,
    },
    jordanRiver: {
        position: 'absolute',
        right: '20.5%',
        top: '29%',
        width: 4,
        height: '42%',
        backgroundColor: WATER,
        opacity: 0.55,
    },
    deadSea: {
        position: 'absolute',
        right: '14%',
        bottom: '8%',
        width: 24,
        height: 56,
        borderRadius: 12,
        backgroundColor: WATER,
        opacity: 0.65,
    },
    geoLabel: {
        position: 'absolute',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: 'rgba(46,111,101,0.55)',
    },
    pinWrap: {
        position: 'absolute',
        transform: [{ translateX: -16 }, { translateY: -16 }],
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    pinCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinCircleActive: {
        backgroundColor: NAVY,
    },
    pinNum: {
        fontSize: 12,
        fontWeight: '800',
        color: NAVY,
    },
    pinTag: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    pinTagActive: {
        backgroundColor: NAVY,
    },
    pinTagText: {
        fontSize: 11,
        fontWeight: '700',
        color: INK,
    },
    stopDetailCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        gap: 4,
    },
    stopTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    stopName: {
        fontSize: 16,
        fontWeight: '800',
        color: INK,
    },
    stopVersePill: {
        backgroundColor: ACUARELA_SOFT,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    stopVerseText: {
        fontSize: 11,
        fontWeight: '700',
        color: NAVY,
    },
    stopRegion: {
        fontSize: 12,
        fontWeight: '600',
        color: EUCALIPTO,
    },
    stopSummary: {
        fontSize: 13,
        lineHeight: 19,
        color: MUTED,
        marginTop: 2,
    },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';

export type DoodleKind =
    | 'sage'
    | 'dove'
    | 'crown'
    | 'scroll'
    | 'tablet'
    | 'olive'
    | 'temple'
    | 'mountain'
    | 'star'
    | 'trophy'
    | 'charades'
    | 'impostor';

interface EditorialDoodleProps {
    kind: DoodleKind;
    tint?: string;
    size?: number;
}

const INK = '#1B1E23';

export const getDoodleForThemeId = (id: string): { kind: DoodleKind; tint: string } => {
    const key = (id || '').toLocaleLowerCase();
    switch (key) {
        case 'antiguo_testamento':
        case 'antiguo_testamento_general':
        case 'personajes_at':
            return { kind: 'scroll', tint: '#F2CF66' };
        case 'origenes_patriarcas':
        case 'origenes_patriarcas_general':
        case 'origenes':
        case 'patriarcas':
        case 'comida':
            return { kind: 'olive', tint: '#8BBDB3' };
        case 'de_egipto_a_canaan':
        case 'exodo_desierto':
        case 'entrada_canaan':
        case 'objetos':
            return { kind: 'tablet', tint: '#68AEEB' };
        case 'epoca_jueces':
        case 'transicion_monarquia':
        case 'lugares':
            return { kind: 'mountain', tint: '#8BBDB3' };
        case 'historia_israel_juda':
        case 'monarquia_unida':
        case 'reino_dividido':
        case 'juda_tras_israel':
        case 'historias':
            return { kind: 'crown', tint: '#F2CF66' };
        case 'exilio_babilonico':
            return { kind: 'temple', tint: '#68AEEB' };
        case 'retorno_restauracion':
        case 'alabanzas':
            return { kind: 'temple', tint: '#8BBDB3' };
        case 'nuevo_testamento':
        case 'nt_todo':
        case 'evangelios':
        case 'evangelios_general':
        case 'nt_lucas':
        case 'nt_juan':
        case 'personajes_nt':
            return { kind: 'dove', tint: '#68AEEB' };
        case 'animales':
            return { kind: 'dove', tint: '#8BBDB3' };
        case 'nt_mateo':
        case 'nt_marcos':
        case 'navidad_pascua':
            return { kind: 'star', tint: '#F2CF66' };
        case 'nt_cartas':
            return { kind: 'scroll', tint: '#8BBDB3' };
        case 'personajes_biblicos':
            return { kind: 'sage', tint: '#68AEEB' };
        case 'biblia_general':
        case 'mezcla_biblica':
            return { kind: 'scroll', tint: '#68AEEB' };
        default:
            return { kind: 'charades', tint: '#F2CF66' };
    }
};

/**
 * Ilustración minimalista de trazo negro sobre mancha orgánica de color,
 * sin depender de librerías SVG externas.
 */
export const EditorialDoodle = ({
    kind,
    tint = '#68AEEB',
    size = 64,
}: EditorialDoodleProps) => {
    const scale = size / 64;

    return (
        <View
            pointerEvents="none"
            accessibilityElementsHidden
            style={[s.canvas, { width: size, height: size }]}
        >
            <View
                style={{
                    transform: [{ scale }],
                    width: 64,
                    height: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {kind === 'sage' && (
                    <>
                        <View style={[s.blob, { width: 42, height: 40, borderRadius: 20, backgroundColor: tint, top: 14, left: 10, transform: [{ rotate: '-10deg' }] }]} />
                        <View style={s.faceArch} />
                        <View style={s.faceHair} />
                        <View style={[s.eyeClosed, { left: 22, top: 28 }]} />
                        <View style={[s.eyeClosed, { left: 36, top: 28 }]} />
                        <View style={s.noseLine} />
                        <View style={s.smileArc} />
                        <View style={s.baseLine} />
                    </>
                )}

                {kind === 'dove' && (
                    <>
                        <View style={[s.blob, { width: 40, height: 34, borderRadius: 18, backgroundColor: tint, top: 18, left: 12, transform: [{ rotate: '-14deg' }] }]} />
                        <View style={s.birdBody} />
                        <View style={s.birdWing} />
                        <View style={s.birdBeak} />
                        <View style={s.birdEye} />
                        <View style={[s.birdLeg, { left: 28, transform: [{ rotate: '12deg' }] }]} />
                        <View style={[s.birdLeg, { left: 35, transform: [{ rotate: '-8deg' }] }]} />
                    </>
                )}

                {kind === 'crown' && (
                    <>
                        <View style={[s.blob, { width: 44, height: 32, borderRadius: 16, backgroundColor: tint, top: 20, left: 10, transform: [{ rotate: '-6deg' }] }]} />
                        <View style={s.crownBase} />
                        <View style={[s.crownPeak, { left: 15, transform: [{ rotate: '-14deg' }] }]} />
                        <View style={[s.crownPeak, { left: 29, height: 18, top: 17 }]} />
                        <View style={[s.crownPeak, { left: 43, transform: [{ rotate: '14deg' }] }]} />
                        <View style={[s.crownJewel, { left: 13.5, top: 18 }]} />
                        <View style={[s.crownJewel, { left: 29, top: 12 }]} />
                        <View style={[s.crownJewel, { left: 44.5, top: 18 }]} />
                    </>
                )}

                {kind === 'scroll' && (
                    <>
                        <View style={[s.blob, { width: 38, height: 42, borderRadius: 14, backgroundColor: tint, top: 12, left: 13, transform: [{ rotate: '6deg' }] }]} />
                        <View style={s.scrollSheet} />
                        <View style={[s.scrollRoll, { top: 12 }]} />
                        <View style={[s.scrollRoll, { bottom: 12 }]} />
                        <View style={[s.inkLine, { top: 26, width: 20 }]} />
                        <View style={[s.inkLine, { top: 32, width: 16 }]} />
                        <View style={[s.inkLine, { top: 38, width: 22 }]} />
                    </>
                )}

                {kind === 'tablet' && (
                    <>
                        <View style={[s.blob, { width: 44, height: 40, borderRadius: 16, backgroundColor: tint, top: 13, left: 10, transform: [{ rotate: '-5deg' }] }]} />
                        <View style={[s.tabletStone, { left: 13, top: 16 }]} />
                        <View style={[s.tabletStone, { left: 31, top: 14 }]} />
                        <View style={[s.inkLine, { top: 26, left: 18, width: 9 }]} />
                        <View style={[s.inkLine, { top: 32, left: 18, width: 9 }]} />
                        <View style={[s.inkLine, { top: 24, left: 36, width: 9 }]} />
                        <View style={[s.inkLine, { top: 30, left: 36, width: 9 }]} />
                    </>
                )}

                {kind === 'olive' && (
                    <>
                        <View style={[s.blob, { width: 36, height: 42, borderRadius: 18, backgroundColor: tint, top: 12, left: 14, transform: [{ rotate: '8deg' }] }]} />
                        <View style={s.oliveStem} />
                        <View style={[s.leaf, { top: 18, left: 17, transform: [{ rotate: '-35deg' }] }]} />
                        <View style={[s.leaf, { top: 18, right: 17, transform: [{ rotate: '35deg' }] }]} />
                        <View style={[s.leaf, { top: 30, left: 17, transform: [{ rotate: '-35deg' }] }]} />
                        <View style={[s.leaf, { top: 30, right: 17, transform: [{ rotate: '35deg' }] }]} />
                        <View style={[s.leaf, { top: 9, left: 27, width: 10, height: 12 }]} />
                    </>
                )}

                {kind === 'temple' && (
                    <>
                        <View style={[s.blob, { width: 44, height: 34, borderRadius: 12, backgroundColor: tint, top: 18, left: 10 }]} />
                        <View style={s.templeRoof} />
                        <View style={s.templeBase} />
                        <View style={[s.pillar, { left: 18 }]} />
                        <View style={[s.pillar, { left: 28 }]} />
                        <View style={[s.pillar, { left: 38 }]} />
                        <View style={[s.pillar, { left: 46 }]} />
                    </>
                )}

                {kind === 'mountain' && (
                    <>
                        <View style={[s.blob, { width: 44, height: 32, borderRadius: 16, backgroundColor: tint, top: 22, left: 10 }]} />
                        <View style={s.mtnBig} />
                        <View style={s.mtnSmall} />
                        <View style={s.mtnSun} />
                        <View style={s.baseLine} />
                    </>
                )}

                {kind === 'star' && (
                    <>
                        <View style={[s.blob, { width: 36, height: 36, borderRadius: 18, backgroundColor: tint, top: 14, left: 14 }]} />
                        <View style={s.starV} />
                        <View style={s.starH} />
                        <View style={[s.starDiag, { transform: [{ rotate: '45deg' }] }]} />
                        <View style={[s.starDiag, { transform: [{ rotate: '-45deg' }] }]} />
                        <View style={s.starCenter} />
                    </>
                )}

                {kind === 'trophy' && (
                    <>
                        <View style={[s.blob, { width: 40, height: 40, borderRadius: 20, backgroundColor: tint, top: 12, left: 12 }]} />
                        <View style={s.cupBowl} />
                        <View style={[s.cupHandle, { left: 13 }]} />
                        <View style={[s.cupHandle, { right: 13 }]} />
                        <View style={s.cupStem} />
                        <View style={s.cupFoot} />
                    </>
                )}

                {kind === 'charades' && (
                    <>
                        <View style={[s.blob, { width: 40, height: 40, borderRadius: 20, backgroundColor: tint, top: 13, left: 13 }]} />
                        <View style={s.maskOutline} />
                        <View style={[s.maskEye, { left: 22 }]} />
                        <View style={[s.maskEye, { left: 36 }]} />
                        <View style={s.maskSmile} />
                    </>
                )}

                {kind === 'impostor' && (
                    <>
                        <View style={[s.blob, { width: 38, height: 38, borderRadius: 19, backgroundColor: tint, top: 10, left: 11 }]} />
                        <View style={s.lensOuter} />
                        <View style={s.lensEye} />
                        <View style={s.lensPupil} />
                        <View style={s.lensHandle} />
                    </>
                )}
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    canvas: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    blob: {
        position: 'absolute',
        opacity: 0.78,
    },
    // Sage
    faceArch: {
        position: 'absolute',
        width: 34,
        height: 36,
        top: 16,
        left: 15,
        borderLeftWidth: 2.2,
        borderRightWidth: 2.2,
        borderBottomWidth: 2.2,
        borderColor: INK,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
    faceHair: {
        position: 'absolute',
        width: 30,
        height: 14,
        top: 8,
        left: 18,
        borderTopWidth: 2.2,
        borderRightWidth: 2.2,
        borderColor: INK,
        borderTopRightRadius: 14,
        borderTopLeftRadius: 10,
    },
    eyeClosed: {
        position: 'absolute',
        width: 8,
        height: 5,
        borderBottomWidth: 2.2,
        borderColor: INK,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    noseLine: {
        position: 'absolute',
        width: 5,
        height: 9,
        top: 30,
        left: 30,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: INK,
        borderBottomRightRadius: 4,
    },
    smileArc: {
        position: 'absolute',
        width: 10,
        height: 5,
        top: 42,
        left: 27,
        borderBottomWidth: 2.2,
        borderColor: INK,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    baseLine: {
        position: 'absolute',
        width: 44,
        height: 2.2,
        bottom: 10,
        left: 10,
        backgroundColor: INK,
        borderRadius: 2,
    },
    // Dove
    birdBody: {
        position: 'absolute',
        width: 30,
        height: 20,
        top: 24,
        left: 16,
        borderWidth: 2.2,
        borderColor: INK,
        borderRadius: 14,
    },
    birdWing: {
        position: 'absolute',
        width: 16,
        height: 12,
        top: 17,
        left: 18,
        borderTopWidth: 2.2,
        borderLeftWidth: 2.2,
        borderColor: INK,
        borderTopLeftRadius: 10,
        transform: [{ rotate: '-18deg' }],
    },
    birdBeak: {
        position: 'absolute',
        width: 8,
        height: 6,
        top: 27,
        right: 11,
        borderTopWidth: 2.2,
        borderRightWidth: 2.2,
        borderColor: INK,
        transform: [{ rotate: '45deg' }],
    },
    birdEye: {
        position: 'absolute',
        width: 3.5,
        height: 3.5,
        borderRadius: 2,
        backgroundColor: INK,
        top: 28,
        right: 20,
    },
    birdLeg: {
        position: 'absolute',
        width: 2.2,
        height: 9,
        top: 44,
        backgroundColor: INK,
    },
    // Crown
    crownBase: {
        position: 'absolute',
        width: 36,
        height: 12,
        bottom: 14,
        left: 14,
        borderWidth: 2.2,
        borderColor: INK,
        borderRadius: 4,
    },
    crownPeak: {
        position: 'absolute',
        width: 2.2,
        height: 16,
        top: 22,
        backgroundColor: INK,
    },
    crownJewel: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: INK,
        backgroundColor: '#FFFFFF',
    },
    // Scroll
    scrollSheet: {
        position: 'absolute',
        width: 28,
        height: 34,
        top: 15,
        left: 18,
        borderLeftWidth: 2.2,
        borderRightWidth: 2.2,
        borderColor: INK,
    },
    scrollRoll: {
        position: 'absolute',
        width: 34,
        height: 8,
        left: 15,
        borderRadius: 4,
        borderWidth: 2.2,
        borderColor: INK,
        backgroundColor: '#FFFFFF',
    },
    inkLine: {
        position: 'absolute',
        height: 2,
        backgroundColor: INK,
        borderRadius: 1,
    },
    // Tablet
    tabletStone: {
        position: 'absolute',
        width: 19,
        height: 32,
        borderWidth: 2.2,
        borderColor: INK,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    },
    // Olive
    oliveStem: {
        position: 'absolute',
        width: 2.2,
        height: 34,
        top: 19,
        left: 31,
        backgroundColor: INK,
    },
    leaf: {
        position: 'absolute',
        width: 14,
        height: 9,
        borderWidth: 2,
        borderColor: INK,
        borderRadius: 8,
    },
    // Temple
    templeRoof: {
        position: 'absolute',
        width: 40,
        height: 10,
        top: 15,
        left: 12,
        borderWidth: 2.2,
        borderColor: INK,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    templeBase: {
        position: 'absolute',
        width: 44,
        height: 6,
        bottom: 12,
        left: 10,
        borderWidth: 2.2,
        borderColor: INK,
        borderRadius: 3,
    },
    pillar: {
        position: 'absolute',
        width: 2.4,
        height: 21,
        top: 25,
        backgroundColor: INK,
    },
    // Mountain
    mtnBig: {
        position: 'absolute',
        width: 26,
        height: 26,
        top: 24,
        left: 14,
        borderTopWidth: 2.2,
        borderLeftWidth: 2.2,
        borderColor: INK,
        transform: [{ rotate: '45deg' }],
    },
    mtnSmall: {
        position: 'absolute',
        width: 18,
        height: 18,
        top: 30,
        left: 31,
        borderTopWidth: 2.2,
        borderLeftWidth: 2.2,
        borderColor: INK,
        transform: [{ rotate: '45deg' }],
    },
    mtnSun: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: INK,
        top: 12,
        right: 13,
    },
    // Star
    starV: {
        position: 'absolute',
        width: 2.4,
        height: 36,
        top: 14,
        left: 31,
        backgroundColor: INK,
        borderRadius: 2,
    },
    starH: {
        position: 'absolute',
        width: 36,
        height: 2.4,
        top: 31,
        left: 14,
        backgroundColor: INK,
        borderRadius: 2,
    },
    starDiag: {
        position: 'absolute',
        width: 24,
        height: 2,
        top: 31,
        left: 20,
        backgroundColor: INK,
        borderRadius: 1,
    },
    starCenter: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2.2,
        borderColor: INK,
        backgroundColor: '#FFFFFF',
    },
    // Trophy
    cupBowl: {
        position: 'absolute',
        width: 26,
        height: 22,
        top: 14,
        left: 19,
        borderWidth: 2.2,
        borderColor: INK,
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    cupHandle: {
        position: 'absolute',
        width: 8,
        height: 12,
        top: 17,
        borderWidth: 2,
        borderColor: INK,
        borderRadius: 6,
    },
    cupStem: {
        position: 'absolute',
        width: 2.4,
        height: 10,
        top: 36,
        left: 31,
        backgroundColor: INK,
    },
    cupFoot: {
        position: 'absolute',
        width: 20,
        height: 4,
        bottom: 13,
        left: 22,
        borderWidth: 2,
        borderColor: INK,
        borderRadius: 2,
    },
    // Charades (mask)
    maskOutline: {
        position: 'absolute',
        width: 34,
        height: 36,
        top: 14,
        left: 15,
        borderWidth: 2.2,
        borderColor: INK,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
    maskEye: {
        position: 'absolute',
        width: 7,
        height: 5,
        top: 25,
        borderTopWidth: 2.2,
        borderColor: INK,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    maskSmile: {
        position: 'absolute',
        width: 14,
        height: 7,
        top: 34,
        left: 25,
        borderBottomWidth: 2.2,
        borderColor: INK,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    // Impostor (magnifying lens + secret eye)
    lensOuter: {
        position: 'absolute',
        width: 32,
        height: 32,
        top: 12,
        left: 13,
        borderRadius: 16,
        borderWidth: 2.3,
        borderColor: INK,
    },
    lensEye: {
        position: 'absolute',
        width: 16,
        height: 10,
        top: 23,
        left: 21,
        borderRadius: 8,
        borderWidth: 1.8,
        borderColor: INK,
    },
    lensPupil: {
        position: 'absolute',
        width: 4,
        height: 4,
        top: 26,
        left: 27,
        borderRadius: 2,
        backgroundColor: INK,
    },
    lensHandle: {
        position: 'absolute',
        width: 15,
        height: 3.2,
        bottom: 14,
        right: 11,
        borderRadius: 2,
        backgroundColor: INK,
        transform: [{ rotate: '45deg' }],
    },
});

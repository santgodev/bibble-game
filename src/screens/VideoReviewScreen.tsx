import { GlassBackground } from '../components/Glass';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { AppText } from '../components';
import * as MediaLibrary from 'expo-media-library/legacy';
import { useSound } from '../context/SoundContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const GOLD = "#68A877";

interface WordEntry {
    word: string;
    timestamp: number;
    result: 'correct' | 'pass' | 'pending';
}

export const VideoReviewScreen = ({ navigation, route }: any) => {
    const {
        videoUri,
        category,
        wordHistory = [],
    }: { videoUri: string; category: string; wordHistory: WordEntry[] } = route.params || {};

    const insets = useSafeAreaInsets();
    const { pauseMusic, resumeMusic } = useSound();
    const [position, setPosition] = useState(0);
    const player = useVideoPlayer(videoUri, player => {
        player.loop = true;
        player.play();
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (player?.playing) {
                setPosition(player.currentTime * 1000);
            }
        }, 200);
        return () => clearInterval(interval);
    }, [player]);

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        pauseMusic();
        return () => { resumeMusic(); };
    }, []);

    const handlePlayPause = () => {
        if (!player) return;
        if (player.playing) {

            player.pause();
        } else {
            player.play();
        }
    };




    const handleSave = async () => {
        if (!videoUri) {
            setSaveMessage({ text: 'No hay video para guardar.', ok: false });
            setTimeout(() => setSaveMessage(null), 3000);
            return;
        }
        try {
            setIsSaving(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                setSaveMessage({ text: 'Permiso de galería denegado. Actívalo en Ajustes.', ok: false });
                setTimeout(() => setSaveMessage(null), 4000);
                return;
            }

            let uriToSave = videoUri;
            if (!uriToSave.startsWith('file://') && !uriToSave.startsWith('content://')) {
                uriToSave = `file://${uriToSave}`;
            }

            const asset = await MediaLibrary.createAssetAsync(uriToSave);
            const albums = await MediaLibrary.getAlbumsAsync();
            const existing = albums.find(a => a.title === 'Berea');
            if (existing) {
                await MediaLibrary.addAssetsToAlbumAsync([asset], existing, false);
            } else {
                await MediaLibrary.createAlbumAsync('Berea', asset, false);
            }

            setSaveMessage({ text: '¡Video guardado en álbum "Berea"! 🎉', ok: true });
            setTimeout(() => setSaveMessage(null), 3500);
        } catch (error: any) {
            console.error('Save video error:', error);
            setSaveMessage({ text: 'Error al guardar. Revisa los permisos.', ok: false });
            setTimeout(() => setSaveMessage(null), 4000);
        } finally {
            setIsSaving(false);
        }
    };

    const isPlaying = player?.playing;
    const duration = (player?.duration || 0) * 1000 || 1;

    const progress = Math.min(position / duration, 1);

    const withResult = wordHistory.filter(w => w.result !== 'pending');
    const correctCount = withResult.filter(w => w.result === 'correct').length;
    const passCount = withResult.filter(w => w.result === 'pass').length;
    const accuracy = (correctCount + passCount) > 0
        ? Math.round((correctCount / (correctCount + passCount)) * 100)
        : 0;

    const formatTime = (ms: number) => {
        const s = Math.floor(ms / 1000);
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <GlassBackground />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                    <Ionicons name="arrow-back" size={20} color="#2D3043" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <AppText style={styles.headerLabel}>REVISIÓN DE PARTIDA</AppText>
                    <AppText style={styles.headerCategory} numberOfLines={1}>{category}</AppText>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Video Player */}
            <View style={styles.videoArea}>
                <View style={styles.videoCard}>
                    <VideoView
                        style={styles.video}
                        player={player}
                        fullscreenOptions={{ enable: false }}
                        allowsPictureInPicture={false}
                    />




                    {/* Play/Pause tap */}
                    <TouchableOpacity
                        style={styles.playTapArea}
                        onPress={handlePlayPause}
                        activeOpacity={1}
                    >
                        {!isPlaying && (
                            <View style={styles.playIconCircle}>
                                <Ionicons name="play" size={36} color="#2D3043" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Progress bar scrubber */}
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <View style={styles.timeRow}>
                    <AppText style={styles.timeText}>{formatTime(position)}</AppText>
                    <AppText style={styles.timeText}>{formatTime(duration)}</AppText>
                </View>
            </View>

            {/* Quick stats */}
            {withResult.length > 0 && (
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
                        <AppText style={[styles.statNum, { color: '#27AE60' }]}>{correctCount}</AppText>
                        <AppText style={styles.statLabel}>CORRECTAS</AppText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="close-circle" size={20} color="#E74C3C" />
                        <AppText style={[styles.statNum, { color: '#E74C3C' }]}>{passCount}</AppText>
                        <AppText style={styles.statLabel}>PASADAS</AppText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="trophy" size={20} color={GOLD} />
                        <AppText style={[styles.statNum, { color: GOLD }]}>{accuracy}%</AppText>
                        <AppText style={styles.statLabel}>PRECISIÓN</AppText>
                    </View>
                </View>
            )}

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            {/* Actions */}
            <View style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
                {saveMessage && (
                    <View style={[styles.toast, saveMessage.ok ? styles.toastOk : styles.toastErr]}>
                        <Ionicons
                            name={saveMessage.ok ? 'checkmark-circle' : 'alert-circle'}
                            size={18}
                            color={saveMessage.ok ? '#27AE60' : '#E74C3C'}
                        />
                        <AppText style={[styles.toastText, { color: saveMessage.ok ? '#27AE60' : '#E74C3C' }]}>
                            {saveMessage.text}
                        </AppText>
                    </View>
                )}

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-back" size={18} color="#2D3043" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
                        onPress={handleSave}
                        disabled={isSaving}
                        activeOpacity={0.85}
                    >
                        <LinearGradient colors={[GOLD, "#6145A1"]} style={styles.saveBtnGrad}>
                            <Ionicons
                                name={isSaving ? 'hourglass-outline' : 'download-outline'}
                                size={20}
                                color="#FFFFFF"
                            />
                            <AppText style={styles.saveBtnText}>
                                {isSaving ? 'GUARDANDO...' : 'DESCARGAR VIDEO'}
                            </AppText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#EAE5E0" },

    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
    },
    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.48)",
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: "rgba(255,255,255,0.82)",
    },
    headerLabel: { fontSize: 10, color: "#636477", letterSpacing: 2, marginBottom: 2 },
    headerCategory: { fontSize: 15, fontWeight: '800', color: GOLD, textAlign: 'center', maxWidth: 200 },

    videoArea: { paddingHorizontal: 16, marginBottom: 12 },
    videoCard: {
        width: '100%', aspectRatio: 9 / 16,
        backgroundColor: '#16131D', borderRadius: 20, overflow: 'hidden',
        borderWidth: 1, borderColor: "rgba(11,138,94,0.25)",
        maxHeight: 340,
    },
    video: { width: '100%', height: '100%' },
    playTapArea: {
        ...StyleSheet.absoluteFill as any,
        justifyContent: 'center', alignItems: 'center',
    },
    playIconCircle: {
        width: 70, height: 70, borderRadius: 35,
        backgroundColor: "rgba(255,255,255,0.55)",
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: "rgba(255,255,255,0.82)",
    },
    progressTrack: {
        height: 3, backgroundColor: "rgba(255,255,255,0.48)",
        borderRadius: 2, marginTop: 10,
    },
    progressFill: { height: 3, backgroundColor: GOLD, borderRadius: 2 },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    timeText: { fontSize: 11, color: "#636477", letterSpacing: 0.5 },

    statsRow: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 16, paddingVertical: 14,
        backgroundColor: "rgba(255,255,255,0.48)",
        borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.82)",
    },
    statItem: { flex: 1, alignItems: 'center', gap: 4 },
    statNum: { fontSize: 22, fontWeight: '900', includeFontPadding: false },
    statLabel: { fontSize: 9, color: "#636477", letterSpacing: 1.5, fontWeight: '800' },
    statDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.48)" },

    actions: { paddingHorizontal: 16 },
    actionsRow: { flexDirection: 'row', gap: 12 },
    backBtn: {
        width: 52, height: 52, borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.48)",
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: "rgba(255,255,255,0.82)",
    },
    saveBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
    saveBtnGrad: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 16, gap: 10,
    },
    saveBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14, letterSpacing: 1.5, includeFontPadding: false },

    toast: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1,
    },
    toastOk: { backgroundColor: 'rgba(39,174,96,0.08)', borderColor: 'rgba(39,174,96,0.25)' },
    toastErr: { backgroundColor: 'rgba(231,76,60,0.08)', borderColor: 'rgba(231,76,60,0.25)' },
    toastText: { flex: 1, fontSize: 13, fontWeight: '700' },
});

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Alert, Modal,
    ScrollView, Platform, Animated, Dimensions
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { AppText } from '../components';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WordEntry {
    word: string;
    timestamp: number; // ms from game start
    result: 'correct' | 'pass' | 'pending';
}

export const VideoReviewScreen = ({ navigation, route }: any) => {
    const { videoUri, category, wordHistory = [] }: { videoUri: string; category: string; wordHistory: WordEntry[] } = route.params || {};
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();
    const {
        pauseMusic, resumeMusic, enableMusic, toggleMusic,
        availableTracks, setInternalTrack, setLocalTrack, currentTrack
    } = useSound();

    const videoRef = useRef<Video>(null);
    const [playbackStatus, setPlaybackStatus] = useState<any>({});
    const [showMusicPicker, setShowMusicPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Current word overlay state (synced with playback)
    const [currentWord, setCurrentWord] = useState<string>('');
    const [currentResult, setCurrentResult] = useState<'correct' | 'pass' | 'pending' | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    // Animations
    const wordScaleAnim = useRef(new Animated.Value(0.8)).current;
    const wordOpacityAnim = useRef(new Animated.Value(0)).current;
    const resultScaleAnim = useRef(new Animated.Value(0)).current;
    const prevWordRef = useRef<string>('');

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        pauseMusic();
        return () => { resumeMusic(); };
    }, []);

    // Animate word change
    const animateWordIn = useCallback((word: string, result: 'correct' | 'pass' | 'pending') => {
        if (word === prevWordRef.current) return;
        prevWordRef.current = word;

        // Reset anims
        wordScaleAnim.setValue(0.75);
        wordOpacityAnim.setValue(0);
        resultScaleAnim.setValue(0);

        setCurrentWord(word);
        setCurrentResult(result);
        setShowOverlay(true);

        Animated.parallel([
            Animated.spring(wordScaleAnim, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
            Animated.timing(wordOpacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();

        setTimeout(() => {
            Animated.spring(resultScaleAnim, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
        }, 150);
    }, [wordScaleAnim, wordOpacityAnim, resultScaleAnim]);

    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        setPlaybackStatus(status);

        if (!status.isLoaded || !wordHistory || wordHistory.length === 0) {
            setShowOverlay(false);
            return;
        }

        const currentTime = status.positionMillis;

        // Binary search for the active word
        let activeWord: WordEntry | null = null;
        for (let i = 0; i < wordHistory.length; i++) {
            if (wordHistory[i].timestamp <= currentTime) {
                activeWord = wordHistory[i];
            } else {
                break;
            }
        }

        if (activeWord) {
            animateWordIn(activeWord.word, activeWord.result);
        } else if (currentTime < (wordHistory[0]?.timestamp ?? 0)) {
            // Before first word
            setShowOverlay(false);
        }
    }, [wordHistory, animateWordIn]);

    const handlePlayPause = async () => {
        if (!videoRef.current) return;
        if (playbackStatus.isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
    };

    const handleSave = async () => {
        if (!videoUri) {
            Alert.alert('Sin video', 'No hay video grabado para guardar.');
            return;
        }

        try {
            setIsSaving(true);

            // Request FULL (read+write) permissions — NOT writeOnly which breaks createAssetAsync
            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                if (!canAskAgain) {
                    Alert.alert(
                        'Permiso bloqueado',
                        'El permiso de galería está bloqueado. Ve a Ajustes → Apps → ADN Juegos → Permisos → Fotos/Archivos y actívalo manualmente.'
                    );
                } else {
                    Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para guardar el video. Acepta el permiso cuando se solicite.');
                }
                return;
            }

            // Smart URI normalization
            let uriToSave = videoUri;
            if (!uriToSave.startsWith('file://') && !uriToSave.startsWith('content://')) {
                uriToSave = `file://${uriToSave}`;
            }

            const asset = await MediaLibrary.createAssetAsync(uriToSave);

            // Create or get album
            const albums = await MediaLibrary.getAlbumsAsync();
            const existing = albums.find(a => a.title === 'ADN Juegos');
            if (existing) {
                await MediaLibrary.addAssetsToAlbumAsync([asset], existing, false);
            } else {
                await MediaLibrary.createAlbumAsync('ADN Juegos', asset, false);
            }

            Alert.alert('✅ ¡Video guardado!', 'Encontrarás el video en tu galería en el álbum "ADN Juegos".');
        } catch (error: any) {
            console.error('Save video error:', error);
            const msg: string = error?.message || '';
            const isPermErr = msg.includes('permission') || msg.includes('MEDIA_LIBRARY') || msg.includes('granted');
            Alert.alert(
                'Error al guardar',
                isPermErr
                    ? 'El sistema bloqueó el permiso de galería. Cierra la app, ve a Ajustes → Apps → ADN Juegos → Permisos y activa Fotos/Archivos.'
                    : `No se pudo guardar el video.\n\n${msg}`
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handlePickLocal = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
            if (!res.canceled && res.assets && res.assets.length > 0) {
                const file = res.assets[0];
                setLocalTrack(file.uri, file.name);
                if (!enableMusic) toggleMusic();
                resumeMusic();
                setShowMusicPicker(false);
            }
        } catch (err) { console.log('Picker Error', err); }
    };

    const selectTrack = (index: number) => {
        setInternalTrack(index);
        if (!enableMusic) toggleMusic();
        resumeMusic();
        setShowMusicPicker(false);
    };

    const handleSilence = () => {
        pauseMusic();
        setShowMusicPicker(false);
    };

    const isPlaying = playbackStatus?.isPlaying;
    const duration = playbackStatus?.durationMillis || 1;
    const position = playbackStatus?.positionMillis || 0;
    const progress = Math.min(position / duration, 1);

    const formatTime = (ms: number) => {
        const total = Math.floor(ms / 1000);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const wordHistoryWithResult = wordHistory.filter(w => w.result !== 'pending');
    const correctCount = wordHistoryWithResult.filter(w => w.result === 'correct').length;
    const passCount = wordHistoryWithResult.filter(w => w.result === 'pass').length;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <AppText style={styles.headerLabel}>REVISIÓN</AppText>
                    <AppText style={styles.headerCategory} numberOfLines={1}>{category}</AppText>
                </View>
                <TouchableOpacity style={styles.iconBtn} onPress={() => setShowMusicPicker(true)} activeOpacity={0.8}>
                    <Ionicons name="musical-notes" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {/* ── Video Player ── */}
            <View style={styles.videoArea}>
                <View style={styles.videoCard}>
                    <Video
                        ref={videoRef}
                        style={styles.video}
                        source={{ uri: videoUri }}
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        shouldPlay
                        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                    />

                    {/* Word Overlay */}
                    {showOverlay && currentWord ? (
                        <Animated.View style={[
                            styles.wordOverlay,
                            {
                                opacity: wordOpacityAnim,
                                transform: [{ scale: wordScaleAnim }],
                                borderColor: currentResult === 'correct'
                                    ? 'rgba(46,204,113,0.6)'
                                    : currentResult === 'pass'
                                        ? 'rgba(231,76,60,0.5)'
                                        : 'rgba(212,175,55,0.4)',
                            }
                        ]}>
                            {/* Result icon */}
                            <Animated.View style={[styles.resultIcon, { transform: [{ scale: resultScaleAnim }] }]}>
                                {currentResult === 'correct' && (
                                    <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
                                )}
                                {currentResult === 'pass' && (
                                    <Ionicons name="close-circle" size={20} color="#e74c3c" />
                                )}
                            </Animated.View>
                            <AppText style={[
                                styles.overlayWord,
                                currentResult === 'correct' && { color: '#2ecc71' },
                                currentResult === 'pass' && { color: '#e74c3c' },
                            ]} numberOfLines={2} adjustsFontSizeToFit>
                                {currentWord}
                            </AppText>
                        </Animated.View>
                    ) : null}

                    {/* Play/Pause tap overlay */}
                    <TouchableOpacity
                        style={styles.playTapArea}
                        onPress={handlePlayPause}
                        activeOpacity={1}
                    >
                        {!isPlaying && (
                            <View style={styles.playIconCircle}>
                                <Ionicons name="play" size={36} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    {wordHistory.map((w, i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressDot,
                                {
                                    left: `${(w.timestamp / duration) * 100}%`,
                                    backgroundColor: w.result === 'correct' ? '#2ecc71' : w.result === 'pass' ? '#e74c3c' : '#888',
                                }
                            ]}
                        />
                    ))}
                </View>

                {/* Time */}
                <View style={styles.timeRow}>
                    <AppText style={styles.timeText}>{formatTime(position)}</AppText>
                    <AppText style={styles.timeText}>{formatTime(duration)}</AppText>
                </View>
            </View>

            {/* ── Stats Row ── */}
            {wordHistoryWithResult.length > 0 && (
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                        <AppText style={[styles.statValue, { color: '#2ecc71' }]}>{correctCount}</AppText>
                        <AppText style={styles.statLabel}>CORRECTAS</AppText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="close-circle" size={16} color="#e74c3c" />
                        <AppText style={[styles.statValue, { color: '#e74c3c' }]}>{passCount}</AppText>
                        <AppText style={styles.statLabel}>PASADAS</AppText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="trophy" size={16} color={theme.colors.primary} />
                        <AppText style={[styles.statValue, { color: theme.colors.primary }]}>
                            {correctCount + passCount > 0 ? Math.round((correctCount / (correctCount + passCount)) * 100) : 0}%
                        </AppText>
                        <AppText style={styles.statLabel}>PRECISIÓN</AppText>
                    </View>
                </View>
            )}

            {/* ── Word History Timeline ── */}
            {wordHistoryWithResult.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.timelineScroll}
                    contentContainerStyle={styles.timelineContent}
                >
                    {wordHistoryWithResult.map((entry, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.timelineChip,
                                entry.result === 'correct' ? styles.chipCorrect : styles.chipPass,
                            ]}
                            onPress={async () => {
                                if (videoRef.current) {
                                    await videoRef.current.setPositionAsync(entry.timestamp);
                                    await videoRef.current.playAsync();
                                }
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={entry.result === 'correct' ? 'checkmark' : 'close'}
                                size={10}
                                color={entry.result === 'correct' ? '#2ecc71' : '#e74c3c'}
                            />
                            <AppText style={[
                                styles.chipText,
                                { color: entry.result === 'correct' ? '#2ecc71' : '#e74c3c' }
                            ]} numberOfLines={1}>
                                {entry.word}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* ── Actions ── */}
            <View style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
                    onPress={handleSave}
                    disabled={isSaving}
                    activeOpacity={0.8}
                >
                    <Ionicons name={isSaving ? 'hourglass' : 'download'} size={20} color="#000" />
                    <AppText style={styles.saveBtnText}>{isSaving ? 'GUARDANDO...' : 'GUARDAR EN GALERÍA'}</AppText>
                </TouchableOpacity>
            </View>

            {/* ── Music Picker Modal ── */}
            <Modal animationType="slide" transparent visible={showMusicPicker} onRequestClose={() => setShowMusicPicker(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeader}>
                            <AppText style={styles.modalTitle}>Música de fondo</AppText>
                            <TouchableOpacity onPress={() => setShowMusicPicker(false)} style={styles.modalClose}>
                                <Ionicons name="close" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ maxHeight: 320, width: '100%' }} showsVerticalScrollIndicator={false}>
                            <TouchableOpacity style={styles.trackItem} onPress={handleSilence}>
                                <Ionicons name="volume-mute" size={16} color="#888" style={{ marginRight: 12 }} />
                                <AppText style={styles.trackName}>Sin música</AppText>
                            </TouchableOpacity>

                            <View style={styles.modalDivider} />
                            <AppText style={styles.modalSectionHeader}>Desde tu dispositivo</AppText>

                            <TouchableOpacity style={styles.trackItem} onPress={handlePickLocal}>
                                <Ionicons name="folder-open" size={16} color={theme.colors.primary} style={{ marginRight: 12 }} />
                                <AppText style={styles.trackName}>Elegir archivo local</AppText>
                            </TouchableOpacity>

                            <View style={styles.modalDivider} />
                            <AppText style={styles.modalSectionHeader}>Pistas incluidas</AppText>

                            {availableTracks.map((track, index) => (
                                <TouchableOpacity
                                    key={track.id}
                                    style={[styles.trackItem, currentTrack?.id === track.id && styles.trackSelected]}
                                    onPress={() => selectTrack(index)}
                                >
                                    <Ionicons
                                        name={currentTrack?.id === track.id ? 'musical-note' : 'musical-notes-outline'}
                                        size={16}
                                        color={currentTrack?.id === track.id ? theme.colors.primary : '#888'}
                                        style={{ marginRight: 12 }}
                                    />
                                    <AppText style={[styles.trackName, currentTrack?.id === track.id && { color: theme.colors.primary }]}>
                                        {track.name}
                                    </AppText>
                                    {currentTrack?.id === track.id && (
                                        <Ionicons name="checkmark" size={16} color={theme.colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerLabel: {
        fontSize: 10,
        color: '#555',
        letterSpacing: 3,
        marginBottom: 2,
    },
    headerCategory: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.primary,
        maxWidth: 180,
        textAlign: 'center',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    // Video
    videoArea: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    videoCard: {
        width: '100%',
        aspectRatio: 9 / 16,  // Portrait (camera facing the player)
        backgroundColor: '#000',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.3)',
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        maxHeight: 340,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    playTapArea: {
        ...StyleSheet.absoluteFillObject as any,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },

    // Word Overlay
    wordOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(5,5,5,0.85)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderTopWidth: 1,
    },
    resultIcon: {
        width: 24,
        alignItems: 'center',
    },
    overlayWord: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 1,
        lineHeight: 26,
        includeFontPadding: false,
    },

    // Progress
    progressBar: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginTop: 10,
        position: 'relative',
        overflow: 'visible',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 2,
    },
    progressDot: {
        position: 'absolute',
        top: -3,
        width: 9,
        height: 9,
        borderRadius: 5,
        marginLeft: -4,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    timeText: {
        fontSize: 11,
        color: '#555',
        letterSpacing: 1,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        paddingVertical: 12,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 9,
        color: '#555',
        letterSpacing: 1.5,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },

    // Timeline
    timelineScroll: {
        flexGrow: 0,
        marginBottom: 10,
    },
    timelineContent: {
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 4,
    },
    timelineChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        maxWidth: 130,
    },
    chipCorrect: {
        backgroundColor: 'rgba(46,204,113,0.08)',
        borderColor: 'rgba(46,204,113,0.3)',
    },
    chipPass: {
        backgroundColor: 'rgba(231,76,60,0.08)',
        borderColor: 'rgba(231,76,60,0.3)',
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
    },

    // Actions
    actions: {
        paddingHorizontal: 16,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 14,
        gap: 10,
    },
    saveBtnText: {
        color: '#000',
        fontWeight: '800',
        fontSize: 14,
        letterSpacing: 2,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#0f0f1a',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#333',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    modalClose: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.07)',
        marginVertical: 10,
    },
    modalSectionHeader: {
        fontSize: 10,
        color: '#555',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    trackSelected: {
        backgroundColor: 'rgba(212,175,55,0.08)',
    },
    trackName: {
        color: '#ccc',
        fontSize: 15,
        flex: 1,
        fontWeight: '500',
    },
});

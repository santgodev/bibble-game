import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface Track {
    id: string;
    name: string;
    source: any;
    isLocal?: boolean;
}

export type SoundEffect =
    | 'correct'
    | 'wrong'
    | 'tick'
    | 'end'
    | 'win'
    | 'unlock'
    | 'tap'
    | 'select';

export type HapticEffect = 'success' | 'impact' | 'selection' | 'victory';

const BACKGROUND_TRACKS: Track[] = [
    { id: 'ancient_arpeggios', name: 'Paz Bíblica (Arpegios)', source: require('../../assets/sounds/main-screan.mp3') },
];

const SFX_SOURCES: Record<SoundEffect, any> = {
    tap: require('../../assets/sounds/sfx_tap.wav'),
    select: require('../../assets/sounds/sfx_select.wav'),
    tick: require('../../assets/sounds/sfx_tick.wav'),
    end: require('../../assets/sounds/sfx_end.wav'),
    correct: require('../../assets/sounds/sfx_correct.wav'),
    wrong: require('../../assets/sounds/sfx_wrong.wav'),
    win: require('../../assets/sounds/sfx_win.wav'),
    unlock: require('../../assets/sounds/sfx_unlock.wav'),
};

const SFX_VOLUME_SCALE: Record<SoundEffect, number> = {
    tap: 0.55,
    select: 0.65,
    tick: 0.5,
    end: 0.85,
    correct: 0.9,
    wrong: 0.8,
    win: 1.0,
    unlock: 0.9,
};

interface SoundContextType {
    playSound: (type: SoundEffect) => Promise<void>;
    playHaptic: (type: HapticEffect) => void;
    enableMusic: boolean;
    toggleMusic: () => void;
    pauseMusic: () => void;
    resumeMusic: () => void;

    enableSFX: boolean;
    toggleSFX: () => void;
    enableVibration: boolean;
    toggleVibration: () => void;

    currentTrack: Track | null;
    availableTracks: Track[];
    setInternalTrack: (index: number) => void;
    setLocalTrack: (uri: string, name: string) => void;
    shuffleMusic: () => void;

    enableMusicInVideo: boolean;
    toggleMusicInVideo: () => void;

    musicVolume: number;
    setMusicVolume: (val: number) => void;
    sfxVolume: number;
    setSFXVolume: (val: number) => void;
    setVolumeModifier: (val: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
    const [enableMusic, setEnableMusic] = useState(false);
    const [enableSFX, setEnableSFX] = useState(true);
    const [enableVibration, setEnableVibration] = useState(true);
    const [enableMusicInVideo, setEnableMusicInVideo] = useState(true);

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [localTrack, setLocalTrackState] = useState<Track | null>(null);
    const [isTemporarilyPaused, setIsTemporarilyPaused] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    const [musicVolume, setMusicVolume] = useState(0.65);
    const [sfxVolume, setSFXVolume] = useState(0.95);
    const [volumeModifier, setVolumeModifier] = useState(1.0);

    const musicSound = useRef<AudioPlayer | null>(null);
    const sfxPlayers = useRef<Partial<Record<SoundEffect, AudioPlayer>>>({});

    const enableMusicRef = useRef(enableMusic);
    const isPausedRef = useRef(isTemporarilyPaused);

    useEffect(() => { enableMusicRef.current = enableMusic; }, [enableMusic]);
    useEffect(() => { isPausedRef.current = isTemporarilyPaused; }, [isTemporarilyPaused]);

    useEffect(() => {
        setCurrentTrackIndex(Math.floor(Math.random() * BACKGROUND_TRACKS.length));

        let settled = false;
        const timeout = setTimeout(() => {
            if (!settled) {
                settled = true;
                console.warn('Settings load timeout, forcing defaults');
                setSettingsLoaded(true);
            }
        }, 5000);

        const init = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    shouldPlayInBackground: false,
                    interruptionMode: 'duckOthers',
                });
                await loadSettings();
            } finally {
                if (!settled) {
                    settled = true;
                    clearTimeout(timeout);
                    setSettingsLoaded(true);
                }
            }
        };
        init();

        return () => {
            clearTimeout(timeout);
            unloadAll();
        };
    }, []);

    const unloadAll = () => {
        if (musicSound.current) {
            musicSound.current.remove();
            musicSound.current = null;
        }
        for (const key of Object.keys(sfxPlayers.current) as SoundEffect[]) {
            sfxPlayers.current[key]?.remove();
        }
        sfxPlayers.current = {};
    };

    useEffect(() => {
        if (!settingsLoaded) return;
        loadBackgroundMusic();
    }, [currentTrackIndex, localTrack, settingsLoaded]);

    useEffect(() => {
        if (!musicSound.current) return;
        if (enableMusic && !isTemporarilyPaused) {
            musicSound.current.play();
        } else {
            musicSound.current.pause();
        }
    }, [enableMusic, isTemporarilyPaused]);

    useEffect(() => {
        if (musicSound.current) {
            musicSound.current.volume = musicVolume * volumeModifier;
        }
    }, [musicVolume, volumeModifier]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active' && enableMusic && !isTemporarilyPaused) {
                musicSound.current?.play();
            } else if (nextAppState.match(/inactive|background/)) {
                musicSound.current?.pause();
            }
        });
        return () => subscription.remove();
    }, [enableMusic, isTemporarilyPaused]);

    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_music', String(enableMusic)); }, [enableMusic, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_sfx', String(enableSFX)); }, [enableSFX, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_vibration', String(enableVibration)); }, [enableVibration, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_music_rec', String(enableMusicInVideo)); }, [enableMusicInVideo, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_music_vol', String(musicVolume)); }, [musicVolume, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_sfx_vol', String(sfxVolume)); }, [sfxVolume, settingsLoaded]);

    const loadSettings = async () => {
        try {
            const [music, sfx, vib, rec, musVol, sfxVol] = await Promise.all([
                AsyncStorage.getItem('setting_music'),
                AsyncStorage.getItem('setting_sfx'),
                AsyncStorage.getItem('setting_vibration'),
                AsyncStorage.getItem('setting_music_rec'),
                AsyncStorage.getItem('setting_music_vol'),
                AsyncStorage.getItem('setting_sfx_vol'),
            ]);

            setEnableMusic(music !== null ? music === 'true' : true);
            if (sfx !== null) setEnableSFX(sfx === 'true');
            if (vib !== null) setEnableVibration(vib === 'true');
            if (rec !== null) setEnableMusicInVideo(rec === 'true');
            if (musVol !== null && !Number.isNaN(Number(musVol))) setMusicVolume(Number(musVol));
            if (sfxVol !== null && !Number.isNaN(Number(sfxVol))) setSFXVolume(Number(sfxVol));

            loadSFX();
        } catch (e) {
            console.error('Error loading settings', e);
        }
    };

    const loadBackgroundMusic = async () => {
        if (musicSound.current) {
            musicSound.current.remove();
            musicSound.current = null;
        }

        const source = localTrack
            ? { uri: localTrack.source }
            : BACKGROUND_TRACKS[currentTrackIndex].source;

        try {
            const shouldPlay = enableMusicRef.current && !isPausedRef.current;
            const player = createAudioPlayer(source);
            player.loop = true;
            player.volume = musicVolume * volumeModifier;
            if (shouldPlay) player.play();
            musicSound.current = player;
        } catch (e) {
            console.warn('Error loading bg music', e);
        }
    };

    const loadSFX = () => {
        for (const key of Object.keys(SFX_SOURCES) as SoundEffect[]) {
            try {
                sfxPlayers.current[key]?.remove();
                sfxPlayers.current[key] = createAudioPlayer(SFX_SOURCES[key]);
            } catch {
                // Ignore individual SFX load failure
            }
        }
    };

    const playSound = async (type: SoundEffect) => {
        if (!enableSFX) return;
        try {
            let player = sfxPlayers.current[type];
            if (!player) {
                player = createAudioPlayer(SFX_SOURCES[type]);
                sfxPlayers.current[type] = player;
            }
            player.volume = Math.max(0, Math.min(1, sfxVolume * (SFX_VOLUME_SCALE[type] ?? 1)));
            await player.seekTo(0);
            player.play();
        } catch {
            // Ignore transient playback errors
        }
    };

    const playHaptic = (type: HapticEffect) => {
        if (!enableVibration) return;
        try {
            switch (type) {
                case 'success':
                case 'victory':
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    break;
                case 'impact':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    break;
                case 'selection':
                    Haptics.selectionAsync();
                    break;
            }
        } catch {
            // Haptics unsupported on some web/desktop environments
        }
    };

    const toggleMusic = () => setEnableMusic(prev => !prev);
    const pauseMusic = () => setIsTemporarilyPaused(true);
    const resumeMusic = () => setIsTemporarilyPaused(false);

    const toggleSFX = () => setEnableSFX(prev => !prev);
    const toggleVibration = () => setEnableVibration(prev => !prev);
    const toggleMusicInVideo = () => setEnableMusicInVideo(prev => !prev);

    const shuffleMusic = () => {
        setLocalTrackState(null);
        let newIndex = Math.floor(Math.random() * BACKGROUND_TRACKS.length);
        if (newIndex === currentTrackIndex && BACKGROUND_TRACKS.length > 1) {
            newIndex = (newIndex + 1) % BACKGROUND_TRACKS.length;
        }
        setCurrentTrackIndex(newIndex);
    };

    const setInternalTrack = (index: number) => {
        setLocalTrackState(null);
        setCurrentTrackIndex(index);
    };

    const setLocalTrack = (uri: string, name: string) => {
        setLocalTrackState({ id: 'local', name, source: uri, isLocal: true });
    };

    const currentTrack = localTrack || BACKGROUND_TRACKS[currentTrackIndex];

    return (
        <SoundContext.Provider value={{
            playSound, playHaptic,
            enableMusic, toggleMusic, pauseMusic, resumeMusic,
            enableSFX, toggleSFX,
            enableVibration, toggleVibration,
            currentTrack, availableTracks: BACKGROUND_TRACKS,
            setInternalTrack, setLocalTrack, shuffleMusic,
            enableMusicInVideo, toggleMusicInVideo,
            musicVolume, setMusicVolume,
            sfxVolume, setSFXVolume,
            setVolumeModifier,
        }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) throw new Error('useSound must be used within a SoundProvider');
    return context;
};

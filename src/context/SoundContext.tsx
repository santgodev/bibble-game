import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
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
    | 'select'
    | 'page';

export type HapticEffect = 'success' | 'impact' | 'selection' | 'victory';

const SFX_SOURCES: Record<SoundEffect, any> = {
    tap: require('../../assets/sounds/sfx_tap.wav'),
    select: require('../../assets/sounds/sfx_select.wav'),
    tick: require('../../assets/sounds/sfx_tick.wav'),
    end: require('../../assets/sounds/sfx_end.wav'),
    correct: require('../../assets/sounds/sfx_correct.wav'),
    wrong: require('../../assets/sounds/sfx_wrong.wav'),
    win: require('../../assets/sounds/sfx_win.wav'),
    unlock: require('../../assets/sounds/sfx_unlock.wav'),
    page: require('../../assets/sounds/sfx_page.wav'),
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
    page: 0.78,
};

const noop = () => { };

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
    const [enableSFX, setEnableSFX] = useState(true);
    const [enableVibration, setEnableVibration] = useState(true);
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [sfxVolume, setSFXVolume] = useState(0.95);

    const sfxPlayers = useRef<Partial<Record<SoundEffect, AudioPlayer>>>({});

    useEffect(() => {
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
        for (const key of Object.keys(sfxPlayers.current) as SoundEffect[]) {
            sfxPlayers.current[key]?.remove();
        }
        sfxPlayers.current = {};
    };

    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_sfx', String(enableSFX)); }, [enableSFX, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_vibration', String(enableVibration)); }, [enableVibration, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_sfx_vol', String(sfxVolume)); }, [sfxVolume, settingsLoaded]);

    const loadSettings = async () => {
        try {
            const [sfx, vib, sfxVol] = await Promise.all([
                AsyncStorage.getItem('setting_sfx'),
                AsyncStorage.getItem('setting_vibration'),
                AsyncStorage.getItem('setting_sfx_vol'),
            ]);

            if (sfx !== null) setEnableSFX(sfx === 'true');
            if (vib !== null) setEnableVibration(vib === 'true');
            if (sfxVol !== null && !Number.isNaN(Number(sfxVol))) setSFXVolume(Number(sfxVol));

            loadSFX();
        } catch (e) {
            console.error('Error loading settings', e);
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

    const toggleSFX = () => setEnableSFX(prev => !prev);
    const toggleVibration = () => setEnableVibration(prev => !prev);

    return (
        <SoundContext.Provider value={{
            playSound, playHaptic,
            enableMusic: false, toggleMusic: noop, pauseMusic: noop, resumeMusic: noop,
            enableSFX, toggleSFX,
            enableVibration, toggleVibration,
            currentTrack: null, availableTracks: [],
            setInternalTrack: noop, setLocalTrack: noop, shuffleMusic: noop,
            enableMusicInVideo: false, toggleMusicInVideo: noop,
            musicVolume: 0, setMusicVolume: noop,
            sfxVolume, setSFXVolume,
            setVolumeModifier: noop,
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

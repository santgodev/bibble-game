/**
 * useAccelerometer.ts
 * Detects phone tilt when held vertically on forehead in landscape:
 * - Tilting screen DOWN toward floor (z > +threshold) -> 'DOWN' (Correct)
 * - Tilting screen UP toward ceiling (z < -threshold) -> 'UP' (Pass)
 *
 * Handles:
 * - Proper listener cleanup via ref (no leaked subscriptions)
 * - Grace period + requiring an initial NEUTRAL position before arming
 * - Light low-pass smoothing to avoid false triggers from hand jitter
 */
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export interface AccelerometerConfig {
    updateInterval?: number;
    triggerThreshold?: number;
    resetThreshold?: number;
    gracePeriodMs?: number;
}

export const useAccelerometer = (enabled: boolean = true, config: AccelerometerConfig = {}) => {
    const {
        updateInterval = 80,
        triggerThreshold = 0.62,
        resetThreshold = 0.32,
        gracePeriodMs = 1200,
    } = config;

    const [data, setData] = useState({ x: 0, y: 0, z: 0 });
    const [tilt, setTilt] = useState<'NEUTRAL' | 'UP' | 'DOWN'>('NEUTRAL');

    const subRef = useRef<{ remove: () => void } | null>(null);
    const readyRef = useRef(false);
    const hasSeenNeutralRef = useRef(false);
    const smoothedZRef = useRef(0);
    const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const cleanup = () => {
            if (graceTimerRef.current) {
                clearTimeout(graceTimerRef.current);
                graceTimerRef.current = null;
            }
            if (subRef.current) {
                subRef.current.remove();
                subRef.current = null;
            }
            readyRef.current = false;
            hasSeenNeutralRef.current = false;
            smoothedZRef.current = 0;
            setTilt('NEUTRAL');
        };

        if (!enabled || Platform.OS === 'web') {
            cleanup();
            return cleanup;
        }

        readyRef.current = false;
        hasSeenNeutralRef.current = false;
        smoothedZRef.current = 0;

        graceTimerRef.current = setTimeout(() => {
            readyRef.current = true;
        }, gracePeriodMs);

        Accelerometer.setUpdateInterval(updateInterval);
        subRef.current = Accelerometer.addListener(sensorData => {
            setData(sensorData);

            // Light low-pass filter to ignore micro-shakes
            const z = smoothedZRef.current * 0.45 + sensorData.z * 0.55;
            smoothedZRef.current = z;

            if (!readyRef.current) return;

            // Require phone to pass through upright/neutral once before accepting tilts
            if (!hasSeenNeutralRef.current) {
                if (Math.abs(z) < resetThreshold) {
                    hasSeenNeutralRef.current = true;
                }
                return;
            }

            setTilt(currentTilt => {
                if (currentTilt === 'NEUTRAL') {
                    if (z < -triggerThreshold) return 'UP';
                    if (z > triggerThreshold) return 'DOWN';
                    return 'NEUTRAL';
                }
                if (Math.abs(z) < resetThreshold) {
                    return 'NEUTRAL';
                }
                return currentTilt;
            });
        });

        return cleanup;
    }, [enabled, updateInterval, triggerThreshold, resetThreshold, gracePeriodMs]);

    return { data, tilt };
};

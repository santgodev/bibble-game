/**
 * useAccelerometer.ts
 * Detects phone tilt (UP = face-up/inclined forward, DOWN = face-down/tilted back).
 * 
 * Fix: Added a "warm-up" grace period (1.5s) after activation so that the
 * initial phone position (often face-up when handing the phone to forehead)
 * doesn't immediately trigger a false action.
 */
import { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Platform } from 'react-native';

export interface AccelerometerConfig {
    updateInterval?: number;
    triggerThreshold?: number;
    resetThreshold?: number;
    /** Grace period in ms before tilt triggers are accepted (default 1500ms) */
    gracePeriodMs?: number;
}

export const useAccelerometer = (enabled: boolean = true, config: AccelerometerConfig = {}) => {
    const {
        updateInterval = 100,
        triggerThreshold = 0.65,
        resetThreshold = 0.35,
        gracePeriodMs = 1500, // 1.5 seconds grace before tilt counts
    } = config;

    const [data, setData] = useState({ x: 0, y: 0, z: 0 });
    const [tilt, setTilt] = useState<'NEUTRAL' | 'UP' | 'DOWN'>('NEUTRAL');
    const [subscription, setSubscription] = useState<any>(null);

    // Grace period: don't accept tilt actions for gracePeriodMs after enabling
    const readyRef = useRef(false);
    const graceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const processingData = (sensorData: { x: number, y: number, z: number }) => {
        setData(sensorData);

        // During grace period just update data but don't fire tilt events
        if (!readyRef.current) return;

        const { z } = sensorData;

        setTilt((currentTilt) => {
            if (currentTilt === 'NEUTRAL') {
                if (z < -triggerThreshold) return 'UP';
                if (z > triggerThreshold) return 'DOWN';
                return 'NEUTRAL';
            } else {
                // Must come ALL the way back to near-center to reset
                if (Math.abs(z) < resetThreshold) return 'NEUTRAL';
                return currentTilt;
            }
        });
    };

    const _subscribe = () => {
        // Reset ready flag and start grace period
        readyRef.current = false;
        if (graceTimerRef.current) clearTimeout(graceTimerRef.current);

        graceTimerRef.current = setTimeout(() => {
            readyRef.current = true;
        }, gracePeriodMs);

        const sub = Accelerometer.addListener(processingData);
        setSubscription(sub);
        Accelerometer.setUpdateInterval(updateInterval);
    };

    const _unsubscribe = () => {
        // Clear grace timer on unsub
        if (graceTimerRef.current) {
            clearTimeout(graceTimerRef.current);
            graceTimerRef.current = null;
        }
        readyRef.current = false;

        subscription && subscription.remove();
        setSubscription(null);
        setTilt('NEUTRAL');
    };

    useEffect(() => {
        if (enabled) {
            _subscribe();
        } else {
            _unsubscribe();
        }

        return () => _unsubscribe();
    }, [enabled]);

    return { data, tilt };
};

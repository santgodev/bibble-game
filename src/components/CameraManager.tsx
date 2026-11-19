import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';

export interface CameraManagerHandle {
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<boolean>;
}

interface CameraManagerProps {
    onRecordingStart?: () => void;
    onRecordingFinished?: (uri: string) => void;
    onRecordingError?: (error: unknown) => void;
}

export const CameraManager = forwardRef<CameraManagerHandle, CameraManagerProps>((props, ref) => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

    const cameraRef = useRef<CameraView>(null);
    const isRecordingRef = useRef(false);
    const isCameraReadyRef = useRef(false);
    const pendingRecordingRef = useRef(false);
    const recordingStartTimeRef = useRef(0);
    const stopRequestedRef = useRef(false);

    const [hasPermissions, setHasPermissions] = useState(false);

    const onRecordingFinishedRef = useRef(props.onRecordingFinished);
    const onRecordingStartRef = useRef(props.onRecordingStart);
    const onRecordingErrorRef = useRef(props.onRecordingError);

    useEffect(() => {
        onRecordingFinishedRef.current = props.onRecordingFinished;
        onRecordingStartRef.current = props.onRecordingStart;
        onRecordingErrorRef.current = props.onRecordingError;
    });

    useEffect(() => {
        const granted = Boolean(cameraPermission?.granted && microphonePermission?.granted);
        setHasPermissions(granted);
    }, [cameraPermission?.granted, microphonePermission?.granted]);

    useEffect(() => {
        if (Platform.OS === 'web') return;
        let active = true;
        (async () => {
            try {
                if (!cameraPermission?.granted) await requestCameraPermission();
                if (!active) return;
                if (!microphonePermission?.granted) await requestMicrophonePermission();
            } catch (e) {
                console.warn('[CameraManager] Permission request error:', e);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState.match(/inactive|background/)) {
                pendingRecordingRef.current = false;
                if (isRecordingRef.current && cameraRef.current) {
                    try {
                        cameraRef.current.stopRecording();
                    } catch (e) {
                        console.warn('[CameraManager] Background stopRecording error:', e);
                    }
                    isRecordingRef.current = false;
                }
            }
        });

        return () => {
            subscription.remove();
            pendingRecordingRef.current = false;
            if (isRecordingRef.current && cameraRef.current) {
                try {
                    cameraRef.current.stopRecording();
                } catch {
                    // Ignore unmount stop errors
                }
                isRecordingRef.current = false;
            }
        };
    }, []);

    const startRecordingInternal = async () => {
        if (Platform.OS === 'web') {
            onRecordingErrorRef.current?.(new Error('Recording unsupported on web'));
            return;
        }
        if (!cameraRef.current || isRecordingRef.current || stopRequestedRef.current) {
            return;
        }

        try {
            isRecordingRef.current = true;
            recordingStartTimeRef.current = Date.now();
            onRecordingStartRef.current?.();

            const data = await cameraRef.current.recordAsync({
                maxDuration: 300,
            });

            isRecordingRef.current = false;

            if (data?.uri) {
                onRecordingFinishedRef.current?.(data.uri);
            } else {
                onRecordingErrorRef.current?.(new Error('No video URI returned'));
            }
        } catch (error) {
            isRecordingRef.current = false;
            console.warn('[CameraManager] Recording failed:', error);
            onRecordingErrorRef.current?.(error);
        }
    };

    useImperativeHandle(ref, () => ({
        startRecording: async () => {
            if (Platform.OS === 'web') return;
            stopRequestedRef.current = false;
            if (!hasPermissions) {
                pendingRecordingRef.current = true;
                return;
            }
            if (isCameraReadyRef.current && cameraRef.current && !isRecordingRef.current) {
                await startRecordingInternal();
            } else {
                pendingRecordingRef.current = true;
            }
        },
        stopRecording: async () => {
            stopRequestedRef.current = true;
            pendingRecordingRef.current = false;

            if (!cameraRef.current || !isRecordingRef.current) {
                return false;
            }

            // expo-camera throws if stopRecording is called immediately (< 450ms) after recordAsync starts
            const elapsed = Date.now() - recordingStartTimeRef.current;
            if (elapsed < 450) {
                await new Promise(resolve => setTimeout(resolve, 450 - elapsed));
            }

            try {
                cameraRef.current?.stopRecording();
                return true;
            } catch (e) {
                console.warn('[CameraManager] stopRecording error:', e);
                isRecordingRef.current = false;
                return false;
            }
        },
    }));

    const handleCameraReady = () => {
        isCameraReadyRef.current = true;
        if (pendingRecordingRef.current && !stopRequestedRef.current) {
            pendingRecordingRef.current = false;
            startRecordingInternal();
        }
    };

    if (Platform.OS === 'web' || !hasPermissions) {
        return null;
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="front"
                mode="video"
                mute={false}
                onCameraReady={handleCameraReady}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#1B1E23',
    },
    camera: {
        flex: 1,
    },
});

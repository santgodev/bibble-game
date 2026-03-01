/**
 * Confetti.tsx
 * Premium particle celebration component.
 * Renders N particles with randomized physics using React Native Animated.
 * No external dependencies — pure Animated + Math.random().
 */
import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const COLORS = [
    '#D4AF37', // Gold
    '#FFD700', // Bright Gold
    '#ffffff', // White
    '#E8D5A3', // Sandy
    '#C0A96E', // Dark Gold
    '#2ecc71', // Green
    '#3498db', // Blue
    '#e74c3c', // Red
];

const PARTICLE_COUNT = 40;

interface Particle {
    x: Animated.Value;
    y: Animated.Value;
    opacity: Animated.Value;
    scale: Animated.Value;
    rotate: Animated.Value;
    color: string;
    size: number;
    shape: 'circle' | 'square' | 'line';
}

interface ConfettiProps {
    visible: boolean;
    duration?: number; // How long to run the animation (ms)
    originX?: number;  // X origin (default: screen center)
    originY?: number;  // Y origin (default: top third)
}

export const Confetti: React.FC<ConfettiProps> = ({
    visible,
    duration = 2500,
    originX = W / 2,
    originY = H * 0.2,
}) => {
    const particles = useMemo<Particle[]>(() =>
        Array.from({ length: PARTICLE_COUNT }, () => ({
            x: new Animated.Value(0),
            y: new Animated.Value(0),
            opacity: new Animated.Value(0),
            scale: new Animated.Value(0),
            rotate: new Animated.Value(0),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: 6 + Math.random() * 10,
            shape: (['circle', 'square', 'line'] as const)[Math.floor(Math.random() * 3)],
        })),
        []);

    const animationsRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        if (!visible) return;

        // Reset all particles
        particles.forEach(p => {
            p.x.setValue(0);
            p.y.setValue(0);
            p.opacity.setValue(0);
            p.scale.setValue(0);
            p.rotate.setValue(0);
        });

        // Fire animations
        const anims = particles.map(p => {
            const angle = (Math.random() * 360 * Math.PI) / 180;
            const speed = 80 + Math.random() * 220;
            const targetX = Math.cos(angle) * speed;
            const targetY = -80 - Math.random() * 280; // shoot upward
            const gravity = 350 + Math.random() * 200;
            const rotations = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 4);
            const delay = Math.random() * 400;

            return Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    // Fade in quickly, then fade out
                    Animated.sequence([
                        Animated.timing(p.opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
                        Animated.timing(p.opacity, { toValue: 0, duration: duration - delay - 100, delay: 200, useNativeDriver: true }),
                    ]),
                    // Scale up then stay
                    Animated.spring(p.scale, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }),
                    // Move horizontally
                    Animated.timing(p.x, { toValue: targetX, duration: duration - delay, useNativeDriver: true }),
                    // Move vertically with gravity effect
                    Animated.timing(p.y, {
                        toValue: targetY + gravity,
                        duration: duration - delay,
                        useNativeDriver: true,
                    }),
                    // Rotate
                    Animated.timing(p.rotate, {
                        toValue: rotations,
                        duration: duration - delay,
                        useNativeDriver: true,
                    }),
                ]),
            ]);
        });

        animationsRef.current = Animated.parallel(anims);
        animationsRef.current.start();

        return () => {
            animationsRef.current?.stop();
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map((p, i) => {
                const rotate = p.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                });

                const particleStyle = p.shape === 'circle'
                    ? { borderRadius: p.size / 2 }
                    : p.shape === 'line'
                        ? { borderRadius: 1, width: p.size * 2.5, height: p.size * 0.4 }
                        : { borderRadius: 2 };

                return (
                    <Animated.View
                        key={i}
                        style={[
                            styles.particle,
                            {
                                left: originX,
                                top: originY,
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                opacity: p.opacity,
                                transform: [
                                    { translateX: p.x },
                                    { translateY: p.y },
                                    { scale: p.scale },
                                    { rotate },
                                ],
                                ...particleStyle,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject as any,
        zIndex: 999,
    },
    particle: {
        position: 'absolute',
    },
});

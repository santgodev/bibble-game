import { useState, useEffect, useCallback, useRef } from 'react';

export const useGameTimer = (initialTime: number, onTimeEnd?: () => void) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const onTimeEndRef = useRef(onTimeEnd);

    useEffect(() => {
        onTimeEndRef.current = onTimeEnd;
    }, [onTimeEnd]);

    const stopTimer = useCallback(() => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const resetTimer = useCallback(() => {
        stopTimer();
        setTimeLeft(initialTime);
    }, [initialTime, stopTimer]);

    // FIX: allow start even after timeLeft hit 0 (after a reset)
    const startTimer = useCallback(() => {
        setIsRunning(true);
    }, []);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft <= 0 && isRunning) {
            // Time is up!
            setIsRunning(false);
            if (onTimeEndRef.current) onTimeEndRef.current();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, timeLeft]);

    return { timeLeft, isRunning, startTimer, stopTimer, resetTimer, setTimeLeft };
};

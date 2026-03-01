import React from 'react';
import { Trophy } from 'lucide-react';
import styles from './TrophyCounter.module.css';

interface TrophyCounterProps {
    amount: number;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const TrophyCounter: React.FC<TrophyCounterProps> = ({ amount, label = "Trophies", size = 'md' }) => {
    return (
        <div className={`${styles.container} ${styles[size]}`}>
            <div className={styles.iconContainer}>
                <Trophy className={styles.icon} size={size === 'sm' ? 16 : size === 'md' ? 24 : 36} />
            </div>
            <div className={styles.data}>
                <span className={styles.amount}>{amount.toLocaleString()}</span>
                <span className={styles.label}>{label}</span>
            </div>
        </div>
    );
};

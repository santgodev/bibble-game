import React, { useEffect, useState } from 'react';
import styles from './XPBar.module.css';

interface XPBarProps {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    totalXp: number;
}

export const XPBar: React.FC<XPBarProps> = ({ level, currentXp, nextLevelXp, totalXp }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // Animate bar width smoothly on mount or update
        const percent = Math.min((currentXp / nextLevelXp) * 100, 100);
        setTimeout(() => setWidth(percent), 100);
    }, [currentXp, nextLevelXp]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.levelBadge}>LVL {level}</div>
                <div className={styles.xpText}>
                    <span className={styles.xpValue}>{currentXp.toLocaleString()}</span> / {nextLevelXp.toLocaleString()} XP
                </div>
            </div>
            <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${width}%` }} />
            </div>
            <div className={styles.totalXp}>
                Total Progress: {totalXp.toLocaleString()} XP
            </div>
        </div>
    );
};

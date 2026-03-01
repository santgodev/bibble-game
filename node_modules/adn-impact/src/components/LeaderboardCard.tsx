import React from 'react';
import { User as UserIcon, Trophy, Star } from 'lucide-react';
import styles from './LeaderboardCard.module.css';

interface LeaderboardCardProps {
    rank: number;
    username: string;
    trophies: number;
    level: number;
    isCurrentUser?: boolean;
    avatarUrl?: string;
    highlightTop3?: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
    rank, username, trophies, level, isCurrentUser = false, avatarUrl, highlightTop3 = true
}) => {
    let rankClass = '';
    if (highlightTop3) {
        if (rank === 1) rankClass = styles.gold;
        else if (rank === 2) rankClass = styles.silver;
        else if (rank === 3) rankClass = styles.bronze;
    }

    return (
        <div className={`${styles.card} ${rankClass} ${isCurrentUser ? styles.current : ''} animate-slide-up`} style={{ animationDelay: `${rank * 0.05}s` }}>
            <div className={styles.rankBadge}>#{rank}</div>
            <div className={styles.avatarWrapper}>
                {avatarUrl ? (
                    <img src={avatarUrl} alt={username} className={styles.avatar} />
                ) : (
                    <div className={styles.avatarFallback}><UserIcon size={20} /></div>
                )}
            </div>
            <div className={styles.userInfo}>
                <div className={styles.username}>{username}</div>
                <div className={styles.levelInfo}>
                    <Star size={12} className={styles.levelIcon} />
                    <span>Lvl {level}</span>
                </div>
            </div>
            <div className={styles.score}>
                <span className={styles.trophyAmount}>{trophies.toLocaleString()}</span>
                <Trophy size={16} className={styles.trophyIcon} />
            </div>
        </div>
    );
};

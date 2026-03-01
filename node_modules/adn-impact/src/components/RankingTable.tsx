import React from 'react';
import { User, Trophy, Star } from 'lucide-react';
import styles from './RankingTable.module.css';

interface TableUser {
    id: string;
    rank: number;
    username: string;
    trophies: number;
    level: number;
    avatarUrl?: string;
}

interface RankingTableProps {
    users: TableUser[];
    onSelectUser?: (userId: string) => void;
    selectedIds?: string[];
    isAdmin?: boolean;
}

export const RankingTable: React.FC<RankingTableProps> = ({ users, onSelectUser, selectedIds = [], isAdmin = false }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {isAdmin && <th className={styles.checkboxCol}></th>}
                        <th>Rnk</th>
                        <th>Jugador</th>
                        <th>Nivel</th>
                        <th className={styles.rightAlign}>Trofeos</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, idx) => {
                        const isTop3 = user.rank <= 3;
                        const rankStyle = isTop3 ? styles[`top${user.rank}`] : '';
                        const isSelected = selectedIds.includes(user.id);

                        return (
                            <tr
                                key={user.id}
                                className={`${styles.row} ${rankStyle} ${isSelected ? styles.selected : ''}`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                                onClick={() => isAdmin && onSelectUser && onSelectUser(user.id)}
                            >
                                {isAdmin && (
                                    <td className={styles.checkboxCol}>
                                        <div className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`} />
                                    </td>
                                )}
                                <td className={styles.rankCol}>
                                    <div className={styles.rankBadge}>#{user.rank}</div>
                                </td>
                                <td>
                                    <div className={styles.userCol}>
                                        <div className={styles.avatarWrapper}>
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt="" className={styles.avatar} />
                                            ) : (
                                                <User size={16} />
                                            )}
                                        </div>
                                        <span className={styles.username}>{user.username}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.levelBadge}>
                                        <Star size={10} />
                                        <span>{user.level}</span>
                                    </div>
                                </td>
                                <td className={styles.rightAlign}>
                                    <div className={styles.scoreBadge}>
                                        <span>{user.trophies}</span>
                                        <Trophy size={14} className={styles.trophyIcon} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

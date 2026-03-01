import React from 'react';
import { Trophy, Star, Clock, UserPlus, Gamepad2, Award, Zap } from 'lucide-react';
import { EventAction } from '../types';
import styles from './EventTimeline.module.css';

interface EventTimelineProps {
    events: EventAction[];
}

const getEventIcon = (type: string) => {
    switch (type) {
        case 'PARTICIPATION': return <Clock size={16} />;
        case 'PUNCTUALITY': return <Zap size={16} />;
        case 'GUEST': return <UserPlus size={16} />;
        case 'GAME_WON': return <Gamepad2 size={16} />;
        case 'MVP': return <Award size={16} />;
        case 'BIBLE_ANSWER': return <Star size={16} />;
        default: return <Zap size={16} />;
    }
};

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
    if (events.length === 0) {
        return <div className={styles.empty}>No hay actividad reciente.</div>;
    }

    return (
        <div className={styles.timeline}>
            {events.map((event, index) => (
                <div key={event.id} className={styles.itemContainer} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={styles.connector}>
                        <div className={styles.line} />
                        <div className={styles.dot}>
                            {getEventIcon(event.type)}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <h4 className={styles.title}>{event.description}</h4>
                            <span className={styles.time}>
                                {new Intl.DateTimeFormat('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(event.timestamp))}
                            </span>
                        </div>

                        <div className={styles.rewards}>
                            <div className={styles.rewardPillGold}>
                                <Trophy size={12} />
                                <span>+{event.trophiesAwarded}</span>
                            </div>
                            <div className={styles.rewardPillBlue}>
                                <Star size={12} />
                                <span>+{event.xpAwarded} XP</span>
                            </div>
                            {event.activityName && (
                                <div className={styles.tag}>{event.activityName}</div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

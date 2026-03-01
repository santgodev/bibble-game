import React from 'react';
import { User, Shield, Compass, LogOut } from 'lucide-react';
import { EventTimeline } from '../components/EventTimeline';
import styles from './UserProfile.module.css';

const mockProfile = {
    username: "Emanuel2026",
    email: "emanuel@church.com",
    role: "USER",
    createdAt: new Date("2025-01-15"),
    badges: ["🏆 MVP Setiembre", "🔥 Fuego Continente", "📖 Sabio"],
};

const mockEvents = [
    { id: '1', type: 'MVP', description: 'MVP del mes', xpAwarded: 20, trophiesAwarded: 10, timestamp: new Date(), activityName: 'Charadas' },
] as any[];

export const UserProfile: React.FC = () => {
    return (
        <div className={`${styles.page} animate-slide-up`}>
            <div className={styles.header}>
                <div className={styles.avatarCtn}>
                    <User size={48} className={styles.avatarIcon} />
                </div>
                <div className={styles.info}>
                    <h1 className={styles.username}>{mockProfile.username}</h1>
                    <p className={styles.email}>{mockProfile.email}</p>
                    <div className={styles.roleBadge}>
                        <Shield size={12} />
                        <span>{mockProfile.role}</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                    <Compass size={18} className={styles.blue} />
                    Insignias Desbloqueadas
                </h3>
                <div className={styles.badgesGrid}>
                    {mockProfile.badges.map((badge, idx) => (
                        <div key={idx} className={styles.badgeCard}>
                            {badge}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Gráfico de Progreso</h3>
                <div className={`glass-panel ${styles.graphPlaceholder}`}>
                    {/* Simple CSS bars to simulate a chart */}
                    <div className={styles.bar} style={{ height: '40%' }} title="Ene" />
                    <div className={styles.bar} style={{ height: '60%' }} title="Feb" />
                    <div className={styles.bar} style={{ height: '80%' }} title="Mar" />
                    <div className={styles.bar} style={{ height: '100%' }} title="Abr" />
                    <div className={styles.barGold} style={{ height: '90%' }} title="May" />
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Historial Completo</h3>
                <EventTimeline events={mockEvents} />
            </div>

            <button className={styles.logoutBtn}>
                <LogOut size={16} /> Cerrar Sesión
            </button>
        </div>
    );
};

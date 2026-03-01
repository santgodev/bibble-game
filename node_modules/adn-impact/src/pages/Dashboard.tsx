import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { XPBar } from '../components/XPBar';
import { TrophyCounter } from '../components/TrophyCounter';
import { EventTimeline } from '../components/EventTimeline';
import styles from './Dashboard.module.css';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [userStats, setUserStats] = useState<any>(null);
    const [userRank, setUserRank] = useState<number>(0);
    const [totalRank, setTotalRank] = useState<number>(0);
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Fetch user info
            const { data: fetchedUser } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (fetchedUser) setUserStats(fetchedUser);

            // Calculate current rank roughly
            if (fetchedUser?.church_id) {
                const { data: rankingData } = await supabase
                    .from('users')
                    .select('id')
                    .eq('church_id', fetchedUser.church_id)
                    .order('total_trophies', { ascending: false });

                if (rankingData) {
                    setTotalRank(rankingData.length);
                    const rankIndex = rankingData.findIndex(u => u.id === fetchedUser.id);
                    setUserRank(rankIndex >= 0 ? rankIndex + 1 : 0);
                }
            }

            // Fetch recent events
            const { data: events } = await supabase
                .from('events')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (events) {
                const formattedEvents = events.map(e => ({
                    id: e.id,
                    type: e.event_type,
                    description: e.description || 'Actividad',
                    xpAwarded: e.points_awarded,
                    trophiesAwarded: 0, // In this schema points are XP basically
                    timestamp: new Date(e.created_at)
                }));
                setRecentEvents(formattedEvents);
            }

        } catch (error) {
            console.error('Error fetching dashboard', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ color: 'white', padding: 20 }}>Cargando perfil...</div>;

    // Simple XP curve calculation for the bar
    const totalXp = userStats?.total_xp || 0;
    const currentLevel = userStats?.level || 1;
    // Formula mock: each level requires level * 1000 XP roughly (just for UI)
    const currentXp = totalXp % (currentLevel * 1000);
    const nextLevelXp = currentLevel * 1000;

    return (
        <div className={`${styles.page} animate-slide-up`}>
            <div className={styles.header}>
                <div className={styles.avatarContainer}>
                    <div className={styles.avatarFrame} />
                    <div className={styles.avatarInner}>
                        <User size={40} className={styles.avatarIcon} />
                    </div>
                    <div className={styles.levelBadge}>{currentLevel}</div>
                </div>

                <div className={styles.userInfo}>
                    <h1 className={styles.username}>{userStats?.username || 'Usuario'}</h1>
                    <div className={styles.rankStatus}>
                        Posición en la Iglesia: <span className={styles.rankValue}>#{userRank || '?'}</span> de {totalRank || '?'}
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>PROGRESO TOTAL (XP)</h3>
                <XPBar
                    level={currentLevel}
                    currentXp={currentXp}
                    nextLevelXp={nextLevelXp}
                    totalXp={totalXp}
                />
            </div>

            <div className={styles.statsGrid}>
                <TrophyCounter amount={userStats?.total_trophies || 0} label="Trofeos Mensuales" size="lg" />

                <div className={styles.activityCard}>
                    <div className={styles.cardGlow} />
                    <h4>¡Sigue así!</h4>
                    <p className={styles.highlightText}>Participa en los próximos eventos para escalar en el ranking.</p>
                </div>
            </div>

            <div className={styles.sectionHeader}>
                <h2>Historial Reciente</h2>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
                {recentEvents.length > 0 ? (
                    <EventTimeline events={recentEvents} />
                ) : (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No hay actividad reciente. ¡Empieza a sumar puntos!</p>
                )}
            </div>
        </div>
    );
};

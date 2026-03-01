import React, { useState, useEffect } from 'react';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { Filter, Calendar, Users, Globe } from 'lucide-react';
import styles from './MonthlyRanking.module.css';
import { supabase } from '../lib/supabase';
import { Trophy, Star } from 'lucide-react';

export const MonthlyRanking: React.FC = () => {
    const [month, setMonth] = useState('Mes Actual');
    const [activeTab, setActiveTab] = useState<'LOCAL' | 'GLOBAL'>('LOCAL');
    const [localRanking, setLocalRanking] = useState<any[]>([]);
    const [globalRanking, setGlobalRanking] = useState<any[]>([]);
    const [userStats, setUserStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            let currentUserStats = null;
            if (user) {
                const { data: fetchedUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (fetchedUser) {
                    currentUserStats = fetchedUser;
                    setUserStats(fetchedUser);
                }
            }

            // Fetch LOCAL 
            if (currentUserStats?.church_id) {
                const { data: localData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('church_id', currentUserStats.church_id)
                    .order('total_trophies', { ascending: false });
                if (localData) setLocalRanking(localData);
            }

            // Fetch GLOBAL 
            const { data: globalData } = await supabase
                .from('church_global_ranking')
                .select('*')
                .order('total_church_trophies', { ascending: false });
            if (globalData) setGlobalRanking(globalData);

        } catch (error) {
            console.error('Error fetching rankings', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.page} animate-slide-up`}>
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <h1 className="title-glow">Ranking Mensual</h1>
                    <p className={styles.subtitle}>Compite, crece e impacta</p>
                </div>
            </div>

            {/* Gamification Short Guide via Banner */}
            <div className={styles.gamificationBanner}>
                <div className={styles.gamiItem}>
                    <Star size={18} color="var(--accent-gold)" /> <span>XP Permanente: Entra a jugar y sé constante.</span>
                </div>
                <div className={styles.gamiItem}>
                    <Trophy size={18} color="#FFB800" /> <span>Trofeos: ¡Vence y domina el mes! Se reinicia cada 30 días.</span>
                </div>
            </div>

            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'LOCAL' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('LOCAL')}
                >
                    <Users size={16} /> MI IGLESIA
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'GLOBAL' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('GLOBAL')}
                >
                    <Globe size={16} /> GLOBAL
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>Cargando leyendas...</div>
            ) : (
                <div className={styles.rankingList}>
                    {activeTab === 'LOCAL' && !userStats?.church_id && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent-gold)', background: 'rgba(206,172,92,0.1)', borderRadius: '16px', border: '1px solid rgba(206,172,92,0.3)' }}>
                            <h3>No tienes iglesia</h3>
                            <p style={{ marginTop: '10px' }}>Debes unirte a una iglesia desde tu perfil en la App para ver a tus amigos aquí.</p>
                        </div>
                    )}

                    {activeTab === 'LOCAL' && userStats?.church_id && localRanking.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No hay puntos en tu iglesia aún.</div>
                    )}

                    {activeTab === 'GLOBAL' && globalRanking.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No hay iglesias compitiendo.</div>
                    )}

                    {activeTab === 'LOCAL' && localRanking.map((user, index) => (
                        <LeaderboardCard
                            key={user.id}
                            rank={index + 1}
                            username={user.username}
                            trophies={user.total_trophies || 0}
                            level={user.level || 1}
                            isCurrentUser={userStats?.id === user.id}
                        />
                    ))}

                    {activeTab === 'GLOBAL' && globalRanking.map((church, index) => (
                        <LeaderboardCard
                            key={church.church_id}
                            rank={index + 1}
                            username={church.church_name}
                            trophies={church.total_church_trophies || 0}
                            level={church.member_count} // Display members as level info
                            isCurrentUser={userStats?.church_id === church.church_id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

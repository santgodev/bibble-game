import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Users } from 'lucide-react';
import { RankingTable } from '../components/RankingTable';
import { AddPointsModal } from '../components/AddPointsModal';
import styles from './LeaderAdmin.module.css';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const LeaderAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [leaderChurchId, setLeaderChurchId] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Fetch current leader info to get church_id and verify role
            const { data: currentUser } = await supabase
                .from('users')
                .select('role, church_id')
                .eq('id', user.id)
                .single();

            if (!currentUser || (currentUser.role !== 'LEADER' && currentUser.role !== 'ADMIN')) {
                alert("Acceso denegado: Necesitas ser Líder de una Iglesia.");
                navigate('/dashboard');
                return;
            }

            setLeaderChurchId(currentUser.church_id);

            if (currentUser.church_id) {
                const { data: churchUsers } = await supabase
                    .from('users')
                    .select('*')
                    .eq('church_id', currentUser.church_id)
                    .order('total_trophies', { ascending: false });

                if (churchUsers) {
                    // map to match RankingTable keys
                    const formatted = churchUsers.map((u, i) => ({
                        id: u.id,
                        rank: i + 1,
                        username: u.username,
                        trophies: u.total_trophies || 0,
                        xp: u.total_xp || 0,
                        level: u.level || 1
                    }));
                    setUsers(formatted);
                }
            }
        } catch (error) {
            console.error('Error loading admin users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const handleAddPoints = async (type: string, customDesc?: string, xpToAward: number = 0, trophiesToAward: number = 0, activityName?: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || selectedIds.length === 0) return;

            // 1. Log the events
            const eventPayloads = selectedIds.map(uid => ({
                user_id: uid,
                event_type: type,
                description: customDesc || `Evento de iglesia en ${activityName || 'actividad general'}`,
                points_awarded: xpToAward,
                leader_id: user.id
            }));

            const { error: eventError } = await supabase.from('events').insert(eventPayloads);
            if (eventError) throw eventError;

            // 2. Actualizar XP y Trofeos con RPC atómica
            for (const uid of selectedIds) {
                const { error: rpcError } = await supabase.rpc('increment_user_rewards', {
                    p_user_id: uid,
                    p_xp: xpToAward,
                    p_trophies: trophiesToAward,
                });

                // Fallback al método anterior si la RPC no responde
                if (rpcError) {
                    console.warn('[LeaderAdmin] Fallback activo para uid:', uid, rpcError.message);
                    const targetUser = users.find(u => u.id === uid);
                    if (targetUser) {
                        await supabase.from('users')
                            .update({
                                total_xp: targetUser.xp + xpToAward,
                                total_trophies: targetUser.trophies + trophiesToAward
                            })
                            .eq('id', uid);
                    }
                }
            }

            // 3. Reload UI
            loadUsers();
            setIsModalOpen(false);
            setSelectedIds([]);
            alert('¡Puntos asignados exitosamente!');
        } catch (error: any) {
            alert('Hubo un error asignando los puntos.');
            console.error(error);
        }
    };

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={`${styles.page} animate-slide-up`}>
            <div className={styles.header}>
                <div>
                    <h1 className="title-glow">Panel de Líder</h1>
                    <p className={styles.subtitle}>Gestión del ranking mensual de mi iglesia</p>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar participante..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className={styles.actionBtn}>
                    <Filter size={18} />
                </button>

                <button
                    className={styles.addBtn}
                    onClick={() => setIsModalOpen(true)}
                    disabled={selectedIds.length === 0}
                >
                    <Plus size={18} /> Asignar Puntos
                </button>
            </div>

            {selectedIds.length > 0 && (
                <div className={styles.selectionBar}>
                    <Users size={16} />
                    <span>{selectedIds.length} seleccionados</span>
                    <button className={styles.clearBtn} onClick={() => setSelectedIds([])}>Limpiar</button>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>Cargando miembros...</div>
            ) : filteredUsers.length > 0 ? (
                <RankingTable
                    users={filteredUsers}
                    isAdmin={true}
                    onSelectUser={handleSelectUser}
                    selectedIds={selectedIds}
                />
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    {searchTerm ? 'No se encontró ningún jugador.' : 'Aún no hay jugadores en tu iglesia.'}
                </div>
            )}

            <AddPointsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddPoints}
                selectedUserIds={selectedIds}
            />
        </div>
    );
};

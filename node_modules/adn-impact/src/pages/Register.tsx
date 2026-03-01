import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
import styles from './Auth.module.css';
import { supabase } from '../lib/supabase';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [churches, setChurches] = useState<any[]>([]);
    const [selectedChurch, setSelectedChurch] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchChurches = async () => {
            const { data } = await supabase.from('churches').select('id, name').order('name');
            if (data) setChurches(data);
        };
        fetchChurches();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedChurch) {
            setErrorMsg('Por favor selecciona una iglesia.');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            // First check if username exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('username')
                .eq('username', username.trim())
                .maybeSingle();

            if (existingUser) {
                throw new Error("El username ya está en uso.");
            }

            // Sign Up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            // Insert into users table
            if (authData.user) {
                const { error: insertError } = await supabase.from('users').insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    username: username.trim(),
                    full_name: fullName.trim(),
                    role: 'USER',
                    total_xp: 0,
                    total_trophies: 0,
                    level: 1,
                    church_id: selectedChurch
                });

                if (insertError) throw insertError;
            }

            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.glowBg} />

            <div className={styles.card}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.brandTitle}>Únete a Impact</h1>
                    <p className={styles.brandSubtitle}>Crea tu Gamer Tag</p>
                </div>

                <form onSubmit={handleRegister} className={styles.form}>
                    {errorMsg && <div style={{ color: 'var(--accent-red)', fontSize: 14, textAlign: 'center', marginBottom: 12 }}>{errorMsg}</div>}

                    <div className={styles.inputGroup}>
                        <label>Iglesia</label>
                        <select
                            className={styles.input}
                            value={selectedChurch}
                            onChange={(e) => setSelectedChurch(e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecciona tu iglesia</option>
                            {churches.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Ej: David Pérez"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Gamer Username</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Ej: David2026"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="tucorreo@ejemplo.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        <UserPlus size={20} />
                        {loading ? 'Creando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <span>¿Ya tienes cuenta?</span>
                    <button className={styles.linkBtn} type="button" onClick={() => navigate('/login')}>
                        Inicia Sesión <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

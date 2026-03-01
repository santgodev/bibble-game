import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import styles from './Auth.module.css';
import { supabase } from '../lib/supabase';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            let emailLogin = identifier.trim();

            // If the user typed a username (no @), we fetch the email from DB
            if (!emailLogin.includes('@')) {
                const { data: userRecord, error: findError } = await supabase
                    .from('users')
                    .select('email')
                    .ilike('username', emailLogin)
                    .maybeSingle();

                if (findError || !userRecord || !userRecord.email) {
                    throw new Error('Usuario no encontrado o sin email registrado.');
                }
                emailLogin = userRecord.email;
            }

            const { error: authError } = await supabase.auth.signInWithPassword({
                email: emailLogin,
                password
            });

            if (authError) throw authError;

            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.glowBg} />

            <div className={styles.card}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoLogo}>ADN</div>
                    <h1 className={styles.brandTitle}>Impact</h1>
                    <p className={styles.brandSubtitle}>Compite. Crece. Impacta.</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    {errorMsg && <div style={{ color: 'var(--accent-red)', fontSize: 14, textAlign: 'center', marginBottom: 12 }}>{errorMsg}</div>}

                    <div className={styles.inputGroup}>
                        <label>Username o Email</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Ej: david2026 o correo@..."
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        <LogIn size={20} />
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <span>¿No tienes cuenta?</span>
                    <button className={styles.linkBtn} onClick={() => navigate('/register')}>
                        Regístrate aquí <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

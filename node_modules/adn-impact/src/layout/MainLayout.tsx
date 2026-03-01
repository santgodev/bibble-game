import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, User, ShieldAlert } from 'lucide-react';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: <Home size={24} />, label: 'Inicio' },
        { path: '/ranking', icon: <Trophy size={24} />, label: 'Ranking' },
        { path: '/profile', icon: <User size={24} />, label: 'Perfil' },
        { path: '/admin', icon: <ShieldAlert size={24} />, label: 'Admin' },
    ];

    return (
        <div className={styles.appWrapper}>
            <header className={styles.header}>
                <div className={styles.brand}>
                    <span className={styles.title}>ADN Impact</span>
                </div>
                <div className={styles.churchBadge}>Iglesia Central</div>
            </header>

            <main className={styles.mainContent}>
                <Outlet />
            </main>

            <nav className={styles.bottomNav}>
                {navItems.map(item => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
                    >
                        <div className={styles.iconWrapper}>{item.icon}</div>
                        <span className={styles.navLabel}>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

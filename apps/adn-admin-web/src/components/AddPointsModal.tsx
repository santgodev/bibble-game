import React, { useState } from 'react';
import { X, Trophy, Star } from 'lucide-react';
import { EventType } from '../types';
import styles from './AddPointsModal.module.css';

interface AddPointsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (type: EventType, customDesc?: string, customXp?: number, customTrophies?: number, activityId?: string) => void;
    selectedUserIds: string[];
}

const PRESETS: { type: EventType; label: string; xp: number; trophies: number }[] = [
    { type: 'PARTICIPATION', label: 'Participación', xp: 10, trophies: 5 },
    { type: 'PUNCTUALITY', label: 'Puntualidad', xp: 5, trophies: 3 },
    { type: 'GUEST', label: 'Invitado', xp: 20, trophies: 10 },
    { type: 'GAME_WON', label: 'Juego Ganado', xp: 30, trophies: 15 },
    { type: 'MVP', label: 'MVP', xp: 20, trophies: 10 },
    { type: 'BIBLE_ANSWER', label: 'Respuesta Bíblica', xp: 15, trophies: 8 },
];

export const AddPointsModal: React.FC<AddPointsModalProps> = ({ isOpen, onClose, onAdd, selectedUserIds }) => {
    const [selectedType, setSelectedType] = useState<EventType | null>(null);
    const [activity, setActivity] = useState('Charadas');

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Asignar Puntos ({selectedUserIds.length} users)</h3>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <div className={styles.body}>
                    <div className={styles.field}>
                        <label>Actividad</label>
                        <select value={activity} onChange={e => setActivity(e.target.value)} className={styles.select}>
                            <option value="Charadas">Charadas</option>
                            <option value="Impostor">Impostor</option>
                            <option value="General">General / Evento</option>
                        </select>
                    </div>

                    <label className={styles.label}>Seleccionar Evento Rápido</label>
                    <div className={styles.grid}>
                        {PRESETS.map(preset => (
                            <button
                                key={preset.type}
                                className={`${styles.presetBtn} ${selectedType === preset.type ? styles.active : ''}`}
                                onClick={() => setSelectedType(preset.type)}
                            >
                                <div className={styles.presetLabel}>{preset.label}</div>
                                <div className={styles.presetRewards}>
                                    <span className={styles.gold}><Trophy size={14} /> +{preset.trophies}</span>
                                    <span className={styles.blue}><Star size={14} /> +{preset.xp} XP</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button
                        className={styles.submitBtn}
                        disabled={!selectedType || selectedUserIds.length === 0}
                        onClick={() => {
                            if (selectedType) {
                                const preset = PRESETS.find(p => p.type === selectedType);
                                if (preset) {
                                    onAdd(selectedType, preset.label, preset.xp, preset.trophies, activity);
                                }
                            }
                        }}
                    >
                        Confirmar Puntos
                    </button>
                </div>
            </div>
        </div>
    );
};

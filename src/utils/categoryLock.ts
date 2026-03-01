/**
 * categoryLock.ts
 * Single source of truth for category locking logic.
 * Used in CategorySelectionScreen AND ImpostorCategoriesScreen.
 */

import { Category } from '../data/categories';

export type LockReason = 'path' | 'quiz' | 'unstarted' | null;

export interface LockStatus {
    locked: boolean;
    reason: LockReason;
}

export const getCategoryLockStatus = (
    category: Category,
    completedMissions: string[]
): LockStatus => {
    // Free categories — always unlocked
    if (category.id === 'biblia_basica' || category.id === 'promo_2026') {
        return { locked: false, reason: null };
    }

    // Must have AT LEAST started the corresponding week's intro to take the quiz or unlock it
    if (category.id === 'bib_juan1' && !completedMissions.includes('jr-w1-intro')) {
        return { locked: true, reason: 'unstarted' };
    }
    if (category.id === 'bib_juan2' && !completedMissions.includes('jr-w2-intro')) {
        return { locked: true, reason: 'unstarted' };
    }
    if (category.id === 'bib_juan3' && !completedMissions.includes('jr-w3-intro')) {
        return { locked: true, reason: 'unstarted' };
    }
    if (category.id === 'bib_juan4' && !completedMissions.includes('jr-w4-intro')) {
        return { locked: true, reason: 'unstarted' };
    }

    // Sequential path lock ("Jesús Real" progression)
    if (category.id === 'bib_juan2' && !completedMissions.includes('jr-w1-quiz')) {
        return { locked: true, reason: 'path' };
    }
    if (category.id === 'bib_juan3' && !completedMissions.includes('jr-w2-quiz')) {
        return { locked: true, reason: 'path' };
    }
    if (category.id === 'bib_juan4' && !completedMissions.includes('jr-w3-quiz')) {
        return { locked: true, reason: 'path' };
    }

    // Unleash Quiz lock
    if (category.unleashQuiz && category.unleashQuiz.length > 0) {
        if (!completedMissions.includes(`UNLEASHED_${category.id}`)) {
            return { locked: true, reason: 'quiz' };
        }
    }

    return { locked: false, reason: null };
};

export const isCategoryLocked = (
    category: Category,
    completedMissions: string[]
): boolean => getCategoryLockStatus(category, completedMissions).locked;

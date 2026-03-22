/**
 * Utility to generate an evolutionary avatar based on user XP/Level
 * Inspired by game character progression.
 */

export const getEvolutionaryAvatar = (username: string, xp: number) => {
    // Level logic (consistent with ProfileScreen)
    let level = 1;
    let xpForNext = 100;
    while (xp >= xpForNext && level < 100) {
        level++;
        xpForNext += level * 100;
    }

    const seed = `${username}_v${level}`;
    
    // DiceBear styles for progression
    // 1-10: bottts-neutral (Industrial)
    // 11-30: bottts (Detailed)
    // 31-60: adventurer (Warrior)
    // 61-90: avataaars (Human)
    // 91+: lorelei (Majestic)
    
    let style = 'bottts-neutral';
    let bgColor = 'b6e3f4'; // Light Blue

    if (level > 90) {
        style = 'lorelei';
        bgColor = 'f3c623'; // Gold
    } else if (level > 60) {
        style = 'avataaars';
        bgColor = '9b59b6'; // Purple
    } else if (level > 30) {
        style = 'adventurer';
        bgColor = 'e67e22'; // Orange
    } else if (level > 10) {
        style = 'bottts';
        bgColor = '3498db'; // Royal Blue
    }

    return `https://api.dicebear.com/7.x/${style}/png?seed=${seed}&backgroundColor=${bgColor}&radius=50`;
};

export const getLevelTitle = (level: number) => {
    if (level > 90) return 'LEYENDA BEREANA';
    if (level > 70) return 'ANCIANO';
    if (level > 50) return 'MAESTRO';
    if (level > 35) return 'VENCEDOR';
    if (level > 20) return 'GUERRERO';
    if (level > 10) return 'DISCÍPULO';
    if (level > 5) return 'BUSCADOR';
    return 'SEMILLA';
};

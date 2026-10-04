import React, { createContext, useContext } from 'react';
import { theme, Theme, palette } from '../theme';
type ThemeContextType = { theme: Theme; isDark: boolean; colors: typeof palette };
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const value: ThemeContextType = { theme, isDark: false, colors: palette };
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

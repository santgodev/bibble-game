import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { theme as defaultTheme, Theme, palette } from '../theme';

type ThemeContextType = {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    colors: {
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        primary: string;
        secondary: string;
        // ... extend as needed from palette or dynamic
    } & typeof palette;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    useEffect(() => {
        setIsDark(systemScheme === 'dark');
    }, [systemScheme]);

    const toggleTheme = useCallback(() => {
        setIsDark((prev) => !prev);
    }, []);

    const themeContextValue = useMemo(() => {
        // Enforce Premium Dark Theme always for this edition
        const isDark = true;

        const dynamicColors = {
            ...palette,
            background: palette.background,
            surface: palette.surface,
            text: palette.text,
            textSecondary: palette.textSecondary,
        };

        const computedTheme = {
            ...defaultTheme,
            colors: dynamicColors,
        };

        return {
            theme: computedTheme,
            isDark,
            toggleTheme,
            colors: dynamicColors,
        };
    }, [isDark, toggleTheme]);

    return (
        <ThemeContext.Provider value={themeContextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

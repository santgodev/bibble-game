export const palette = {
    // Brand Colors (Premium Biblical)
    primary: '#D4AF37', // Gold (Divine/Premium)
    secondary: '#1A1A1A', // Dark Elegant Grey
    accent: '#FFFFFF', // White (Purity/Highlight)

    // Game State Colors
    success: '#4CAF50', // Ethereal Green
    successBg: '#1B5E20', // Dark Green Bg
    error: '#B71C1C', // Deep Red
    errorBg: '#4A0D0D', // Dark Red Bg

    // Backgrounds (Dark Mode Focus)
    background: '#050505', // Almost Pure Black
    surface: '#121212', // Very Dark Grey
    surfaceHighlight: '#252525', // Lighter Grey for interactions

    // Text
    text: '#FAFAFA', // Off-white for better readability
    textSecondary: '#AAAAAA', // Silver/Grey
    textMuted: '#666666',

    // UI Elements
    border: '#333333', // Subtle borders
    lightGray: '#424242', // Disabled state
};

export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64, // For large vertical spacing
};

export const typography = {
    display: {
        fontSize: 42,
        fontWeight: '300' as '300', // Thinner, more elegant
        lineHeight: 52,
        letterSpacing: 2,
    },
    header: {
        fontSize: 28,
        fontWeight: '600' as '600',
        lineHeight: 34,
        letterSpacing: 0.5,
    },
    subheader: {
        fontSize: 20,
        fontWeight: '500' as '500',
        lineHeight: 28,
        letterSpacing: 0.5,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as '400',
        lineHeight: 24,
        letterSpacing: 0.5,
    },
    button: {
        fontSize: 16,
        fontWeight: '600' as '600',
        letterSpacing: 2, // Wide spacing for buttons
        textTransform: 'uppercase' as 'uppercase',
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as '400',
        color: palette.textMuted,
        letterSpacing: 1,
    }
};

export const theme = {
    colors: {
        ...palette,
    },
    spacing,
    typography,
    borderRadius: {
        s: 4,  // Sharper corners for modern feel
        m: 8,
        l: 12,
        xl: 20,
    },
    shadows: {
        default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
        },
        soft: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        glow: {
            shadowColor: palette.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 25,
            elevation: 15,
        }
    },
};

export type Theme = typeof theme;

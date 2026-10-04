// Liquid Glass: warm canvas, cool refractions and high-contrast ink.
export const palette = {
    primary: '#68A877', secondary: '#157F80', accent: '#8FCA97',
    success: '#217A59', successBg: '#D8EEE3', error: '#B34360', errorBg: '#F8DDE4',
    background: '#EAE5E0', surface: 'rgba(255,255,255,0.48)',
    surfaceHighlight: 'rgba(255,255,255,0.72)',
    text: '#2D3043', textSecondary: '#636477', textMuted: '#717183',
    border: 'rgba(255,255,255,0.78)', lightGray: '#D3DED8',
};
export const spacing = { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48, xxxl: 64 };
export const typography = {
    display: { fontSize: 42, fontWeight: '700' as const, lineHeight: 50, letterSpacing: -1.8 },
    header: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36, letterSpacing: -0.8 },
    subheader: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28, letterSpacing: -0.3 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, letterSpacing: 0 },
    button: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.1 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 18, letterSpacing: 0.3 },
};
export const theme = {
    colors: palette, spacing, typography,
    borderRadius: { s: 12, m: 18, l: 24, xl: 32 },
    shadows: {
        default: { boxShadow: '0 14px 30px rgba(45,60,52,0.12), inset 0 2px 2px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(255,255,255,0.5)', shadowColor: '#3E4C45', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.13, shadowRadius: 22, elevation: 5 },
        soft: { boxShadow: '0 8px 18px rgba(45,60,52,0.09), inset 0 1px 2px rgba(255,255,255,0.95)', shadowColor: '#3E4C45', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 },
        glow: { shadowColor: '#68A877', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 22, elevation: 6 },
    },
};
export type Theme = typeof theme;

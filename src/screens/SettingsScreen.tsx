import React from 'react';
import { View, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Container, AppText, Button, GlassPanel } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { theme } from '../theme';

const ToggleRow = ({ label, value, onToggle, icon }: {
    label: string; value: boolean; onToggle: () => void;
    icon: React.ComponentProps<typeof Ionicons>['name'];
}) => (
    <View style={styles.toggleRow}>
        <View style={styles.rowIcon}><Ionicons name={icon} size={21} color={theme.colors.primary} /></View>
        <AppText style={styles.toggleLabel}>{label}</AppText>
        <Switch accessibilityLabel={label} value={value} onValueChange={onToggle}
            trackColor={{ false: '#CBC5D6', true: '#9C86CF' }} thumbColor="#FFFFFF" ios_backgroundColor="#CBC5D6" />
    </View>
);
export const SettingsScreen = ({ navigation }: any) => {
    const { language, setLanguage, t } = useLanguage();
    const { enableMusic, toggleMusic, enableSFX, toggleSFX, enableVibration, toggleVibration,
        enableMusicInVideo, toggleMusicInVideo, musicVolume, setMusicVolume, sfxVolume, setSFXVolume } = useSound();
    const volume = (label: string, value: number, onChange: (value: number) => void) => (
        <View style={styles.volume}>
            <View style={styles.volumeLabel}><AppText style={styles.subLabel}>{label}</AppText><AppText style={styles.volumeValue}>{Math.round(value * 100)}%</AppText></View>
            <Slider accessibilityLabel={label} style={{ width: '100%', height: 40 }} minimumValue={0} maximumValue={1} step={0.05}
                minimumTrackTintColor="#9879CD" maximumTrackTintColor="#DAD4E2" thumbTintColor="#805BB9" value={value} onValueChange={onChange} />
        </View>
    );
    return (
        <Container noPadding>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={22} color={theme.colors.text} /></Pressable>
                    <View><AppText style={styles.eyebrow}>A TU MANERA</AppText><AppText variant="header">{t('settings')}</AppText></View>
                </View>
                <AppText style={styles.intro}>Pequeños detalles para disfrutar más cada partida.</AppText>
                <GlassPanel style={styles.section}>
                    <AppText style={styles.sectionTitle}>Sonido y sensaciones</AppText>
                    <ToggleRow icon="musical-notes-outline" label={t('music')} value={enableMusic} onToggle={toggleMusic} />
                    {enableMusic && volume(t('volume_music'), musicVolume, setMusicVolume)}
                    <View style={styles.divider} />
                    <ToggleRow icon="videocam-outline" label={t('music_in_video')} value={enableMusicInVideo} onToggle={toggleMusicInVideo} />
                    <View style={styles.divider} />
                    <ToggleRow icon="volume-medium-outline" label={t('sound_effects')} value={enableSFX} onToggle={toggleSFX} />
                    {enableSFX && volume(t('volume_sfx'), sfxVolume, setSFXVolume)}
                    <View style={styles.divider} />
                    <ToggleRow icon="phone-portrait-outline" label={t('vibration')} value={enableVibration} onToggle={toggleVibration} />
                </GlassPanel>
                <GlassPanel style={styles.section}>
                    <AppText style={styles.sectionTitle}>{t('language')}</AppText>
                    <View style={styles.languages}>
                        {(['es', 'en'] as const).map(code => (
                            <Pressable key={code} accessibilityRole="button" accessibilityState={{ selected: language === code }} onPress={() => setLanguage(code)} style={[styles.language, language === code && styles.languageSelected]}>
                                <AppText style={[styles.languageText, language === code && { color: theme.colors.primary }]}>{code === 'es' ? 'Español' : 'English'}</AppText>
                                {language === code && <Ionicons name="checkmark-circle" size={19} color={theme.colors.primary} />}
                            </Pressable>
                        ))}
                    </View>
                </GlassPanel>
                <Button title={t('back')} variant="outline" onPress={() => navigation.goBack()} />
            </ScrollView>
        </Container>
    );
};
const styles = StyleSheet.create({
    content: { padding: 22, paddingBottom: 45, width: '100%', maxWidth: 640, alignSelf: 'center' },
    header: { flexDirection: 'row', gap: 15, alignItems: 'center', marginTop: 10 },
    back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF88', borderWidth: 1, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
    eyebrow: { fontSize: 9, letterSpacing: 1.8, color: theme.colors.primary, fontWeight: '700' },
    intro: { color: theme.colors.textSecondary, marginTop: 18, marginBottom: 25, fontSize: 14 },
    section: { padding: 22, marginBottom: 22 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
    toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
    rowIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: '#CDBDEB44', alignItems: 'center', justifyContent: 'center' },
    toggleLabel: { flex: 1, fontSize: 14, lineHeight: 20 },
    volume: { paddingLeft: 47, paddingBottom: 10 },
    volumeLabel: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 }, subLabel: { fontSize: 11, color: theme.colors.textSecondary }, volumeValue: { fontSize: 11, fontWeight: '600', color: theme.colors.primary },
    divider: { height: 1, backgroundColor: '#FFFFFFBB' },
    languages: { flexDirection: 'row', gap: 12 },
    language: { flex: 1, minHeight: 50, borderRadius: 19, backgroundColor: '#FFFFFF44', borderWidth: 1, borderColor: '#FFFFFF99', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    languageSelected: { backgroundColor: '#F2EBFFA0', borderColor: '#BAA4DF' }, languageText: { fontSize: 14, color: theme.colors.textSecondary },
});

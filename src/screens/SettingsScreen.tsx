import React from 'react';
import { View, StyleSheet, ScrollView, Switch, Pressable, StatusBar } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';

const BG = '#FFFFFF';
const SURFACE = '#F6F8FA';
const INK = '#1B1E23';
const MUTED = '#5B6573';
const ZAFIRO = '#1E3A5F';
const EUCALIPTO = '#2E6F65';
const EUCALIPTO_SOFT = '#DCECE8';
const ACUARELA_SOFT = '#D6E8F8';

const ToggleRow = ({ label, value, onToggle, icon }: {
    label: string;
    value: boolean;
    onToggle: () => void;
    icon: React.ComponentProps<typeof Ionicons>['name'];
}) => (
    <View style={styles.toggleRow}>
        <View style={styles.rowIcon}>
            <Ionicons name={icon} size={20} color={EUCALIPTO} />
        </View>
        <AppText style={styles.toggleLabel}>{label}</AppText>
        <Switch
            accessibilityLabel={label}
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#D5DCE2', true: EUCALIPTO }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D5DCE2"
        />
    </View>
);

export const SettingsScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { language, setLanguage, t } = useLanguage();
    const {
        enableSFX,
        toggleSFX,
        enableVibration,
        toggleVibration,
        sfxVolume,
        setSFXVolume,
    } = useSound();

    const volume = (label: string, value: number, onChange: (value: number) => void) => (
        <View style={styles.volume}>
            <View style={styles.volumeLabel}>
                <AppText style={styles.subLabel}>{label}</AppText>
                <AppText style={styles.volumeValue}>{Math.round(value * 100)}%</AppText>
            </View>
            <Slider
                accessibilityLabel={label}
                style={{ width: '100%', height: 36 }}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                minimumTrackTintColor={ZAFIRO}
                maximumTrackTintColor="#DCE3EA"
                thumbTintColor={ZAFIRO}
                value={value}
                onValueChange={onChange}
            />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('back')}
                    onPress={() => navigation.goBack()}
                    style={styles.back}
                >
                    <Ionicons name="chevron-back" size={22} color={INK} />
                </Pressable>
                <AppText style={styles.headerTitle}>{t('settings')}</AppText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 36 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>Sonido</AppText>
                    <ToggleRow icon="volume-medium-outline" label={t('sound_effects')} value={enableSFX} onToggle={toggleSFX} />
                    {enableSFX && volume(t('volume_sfx'), sfxVolume, setSFXVolume)}
                    <View style={styles.divider} />
                    <ToggleRow icon="phone-portrait-outline" label={t('vibration')} value={enableVibration} onToggle={toggleVibration} />
                </View>

                <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>{t('language')}</AppText>
                    <View style={styles.languages}>
                        {(['es', 'en'] as const).map(code => {
                            const selected = language === code;
                            return (
                                <Pressable
                                    key={code}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected }}
                                    onPress={() => setLanguage(code)}
                                    style={[styles.language, selected && styles.languageSelected]}
                                >
                                    <AppText style={[styles.languageText, selected && { color: ZAFIRO, fontWeight: '800' }]}>
                                        {code === 'es' ? 'Español' : 'English'}
                                    </AppText>
                                    {selected && <Ionicons name="checkmark-circle" size={18} color={ZAFIRO} />}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    back: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: SURFACE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: INK,
        fontSize: 18,
        fontWeight: '800',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        width: '100%',
        maxWidth: 640,
        alignSelf: 'center',
        gap: 16,
    },
    section: {
        backgroundColor: SURFACE,
        borderRadius: 22,
        padding: 18,
    },
    sectionTitle: {
        color: INK,
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 10,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
    },
    rowIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: EUCALIPTO_SOFT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleLabel: {
        flex: 1,
        fontSize: 15,
        color: INK,
        fontWeight: '600',
    },
    volume: {
        paddingLeft: 50,
        paddingBottom: 10,
    },
    volumeLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    subLabel: {
        fontSize: 12,
        color: MUTED,
        fontWeight: '600',
    },
    volumeValue: {
        fontSize: 12,
        fontWeight: '800',
        color: ZAFIRO,
    },
    divider: {
        height: 1,
        backgroundColor: '#FFFFFF',
    },
    languages: {
        flexDirection: 'row',
        gap: 10,
    },
    language: {
        flex: 1,
        minHeight: 48,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    languageSelected: {
        backgroundColor: ACUARELA_SOFT,
    },
    languageText: {
        fontSize: 14,
        color: MUTED,
        fontWeight: '600',
    },
});

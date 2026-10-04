import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, useWindowDimensions, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Container, AppText, Button, GlassPanel, GlassSheen } from '../components';
import { theme } from '../theme';
import { supabase } from '../lib/supabase';
import { NotificationService } from '../services/NotificationService';

type Icon = React.ComponentProps<typeof Ionicons>['name'];
const games: { title: string; description: string; icon: Icon; tint: 'violet' | 'mint' | 'rose'; color: string; meta: string; route: string; params?: object }[] = [
    { title: 'Charadas', description: 'Dale vida a las historias con tus gestos.', icon: 'hand-left-outline', tint: 'mint', color: '#68A877', meta: 'ACTÚA Y ADIVINA', route: 'CategorySelection', params: { targetGame: 'charadas' } },
    { title: 'Trivia bíblica', description: 'Pon a prueba lo que sabes de la Biblia.', icon: 'bulb-outline', tint: 'mint', color: '#197D7F', meta: 'PONTE A PRUEBA', route: 'CategorySelection', params: { targetGame: 'trivia' } },
    { title: 'El impostor', description: 'Alguien guarda un secreto. Descúbrelo.', icon: 'finger-print-outline', tint: 'rose', color: '#A25078', meta: 'OBSERVA Y DESCUBRE', route: 'ImpostorConfig' },
];
const levelInfo = (xp: number) => {
    let level = 1, next = 100, start = 0;
    while (xp >= next && level < 100) { start = next; level++; next += level * 100; }
    return { level, next, progress: Math.min(100, Math.max(0, ((xp - start) / (next - start)) * 100)) };
};

export const HomeScreen = ({ navigation }: any) => {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const desktop = width >= 940;
    const compact = width < 600;
    const [userData, setUserData] = useState<any>(null);
    const lv = levelInfo(userData?.total_xp || 0);
    useFocusEffect(useCallback(() => {
        let active = true;
        const load = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { if (active) setUserData(null); return; }
                const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
                if (active) setUserData(data);
            } catch { /* Guests can still play with local content. */ }
        };
        load();
        return () => { active = false; };
    }, []));
    useEffect(() => {
        if (Platform.OS === 'web') return;
        NotificationService.registerForPushNotificationsAsync().catch(() => {});
    }, []);
    const openMemberScreen = (screen: 'Profile' | 'RankingDashboard') => {
        if (userData) navigation.navigate(screen);
        else navigation.navigate('AuthRequired', {
            title: screen === 'Profile' ? 'Tu historia empieza aquí' : 'Cada reto te lleva más alto',
            desc: 'Crea tu cuenta para guardar tu progreso, ganar insignias y compartir tus logros con la comunidad.',
        });
    };
    return (
        <Container noPadding>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.page, compact && s.pageCompact]}>
                <View style={s.topbar}>
                    <View style={s.brand}>
                        <View style={s.brandIcon}>
                            <Image source={require('../../assets/icon-light.png')} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <View><AppText style={s.brandName}>berea<AppText style={s.brandDot}>.</AppText></AppText><AppText style={s.brandCaption}>FE. CONEXIÓN. DIVERSIÓN.</AppText></View>
                    </View>
                    <View style={s.headerActions}>
                        {!compact && <AppText style={s.greeting}>Hola, {userData?.username || 'explorador'}</AppText>}
                        <Pressable accessibilityRole="button" accessibilityLabel="Abrir ajustes" onPress={() => navigation.navigate('Settings')} style={s.iconButton}>
                            <Ionicons name="options-outline" size={20} color={theme.colors.text} />
                        </Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel="Abrir mi perfil" onPress={() => openMemberScreen('Profile')} style={s.avatar}>
                            <AppText style={s.avatarText}>{(userData?.username || 'B').slice(0, 1).toUpperCase()}</AppText>
                        </Pressable>
                    </View>
                </View>

                <View style={[s.main, desktop && s.mainDesktop]}>
                    <View style={s.mainColumn}>
                        <GlassPanel style={[s.hero, compact && s.heroCompact]} blur>
                            <View style={s.heroCopy}>
                                <View style={s.eyebrow}><View style={s.liveDot} /><AppText style={s.eyebrowText}>UN MOMENTO PARA CONECTAR</AppText></View>
                                <AppText style={[s.headline, compact && s.headlineCompact]}>Tu fe también{'\n'}se vive <AppText style={[s.headline, s.headlineAccent, compact && s.headlineCompact]}>jugando.</AppText></AppText>
                                <AppText style={s.heroDescription}>Descubre la Biblia, comparte una sonrisa{!compact ? '\n' : ' '}y crece con cada reto.</AppText>
                                <Button title="Vamos a jugar  ↗" onPress={() => navigation.navigate('CategorySelection', { targetGame: 'charadas' })} style={s.heroButton} />
                                <View style={s.heroFootnote}><Ionicons name="people-outline" size={15} color={theme.colors.textSecondary} /><AppText style={s.footnoteText}>Mejor cuando lo compartes.</AppText></View>
                            </View>
                            {!compact && <View style={s.art} pointerEvents="none" accessibilityElementsHidden>
                                <View style={s.orbitOuter} /><View style={s.orbitInner} />
                                <LinearGradient colors={['#FFFFFF', '#B0E9C5', '#80CFC8']} style={s.orb} />
                                <View style={s.bookShadow} />
                                <LinearGradient colors={['rgba(255,255,255,0.92)', 'rgba(213,246,223,0.85)', 'rgba(124,204,153,0.62)']} style={s.book}>
                                    <View style={s.bookSpine} /><View style={s.crossV} /><View style={s.crossH} />
                                    <AppText style={s.bookLabel}>LA PALABRA{ '\n' }COBRA VIDA</AppText>
                                    <View style={s.bookLine} />
                                </LinearGradient>
                                <GlassPanel tint="mint" style={s.floatingSpark}><Ionicons name="sparkles-outline" color="#267F80" size={27} /></GlassPanel>
                                <GlassPanel style={s.floatingHeart}><Ionicons name="heart-outline" color="#68A877" size={23} /></GlassPanel>
                            </View>}
                        </GlassPanel>

                        <View style={s.sectionHeader}>
                            <View><AppText style={s.sectionLabel}>ENCUENTRA TU PRÓXIMO RETO</AppText><AppText style={s.sectionTitle}>¿A qué jugamos hoy?</AppText></View>
                            {!compact && <AppText style={s.sectionMeta}>3 formas de aprender juntos</AppText>}
                        </View>
                        <View style={[s.games, compact && s.gamesCompact]}>
                            {games.map((game, index) => (
                                <Pressable key={game.title} accessibilityRole="button" accessibilityLabel={'Jugar ' + game.title}
                                    onPress={() => navigation.navigate(game.route, game.params)}
                                    style={({ pressed }) => [s.gameCard, compact && s.gameCardCompact, { transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.85 : 1 }]}>
                                    <GlassSheen tint={game.tint} />
                                    <View style={[s.gameTop, compact && { marginBottom: 0 }]}><View style={[s.gameIcon, { backgroundColor: game.color + '14', borderColor: game.color + '20' }]}><Ionicons name={game.icon} size={28} color={game.color} /></View>{!compact && <AppText style={s.gameNumber}>0{index + 1}</AppText>}</View>
                                    <View style={compact ? { flex: 1 } : undefined}>
                                        <AppText style={s.gameTitle}>{game.title}</AppText>
                                        <AppText style={s.gameDescription}>{game.description}</AppText>
                                        {!compact && <AppText style={[s.gameMeta, { color: game.color }]}>{game.meta}</AppText>}
                                    </View>
                                    <View style={[s.gameArrow, compact && s.gameArrowCompact]}><Ionicons name="arrow-forward" size={18} color={game.color} /></View>
                                </Pressable>
                            ))}
                        </View>

                        <Pressable accessibilityRole="button" accessibilityLabel="Explorar rutas de estudio" onPress={() => navigation.navigate('StudyPaths')} style={({ pressed }) => [s.studyCard, { opacity: pressed ? 0.8 : 1 }]}>
                            <GlassSheen tint="mint" />
                            <View style={s.studyIcon}><Ionicons name="leaf-outline" size={28} color="#287D77" /></View>
                            <View style={{ flex: 1 }}><AppText style={s.studyEyebrow}>UN POCO CADA DÍA</AppText><AppText style={s.studyTitle}>Haz espacio para crecer.</AppText><AppText style={s.studyDescription}>Descubre tus rutas de estudio.</AppText></View>
                            <View style={s.roundArrow}><Ionicons name="arrow-forward" size={20} color="#287D77" /></View>
                        </Pressable>
                    </View>

                    <View style={[s.aside, desktop && s.asideDesktop]}>
                        <GlassPanel style={s.progressCard}>
                            <View style={s.progressHeader}><AppText style={s.panelTitle}>Tu camino</AppText><Ionicons name="sparkles-outline" size={20} color={theme.colors.primary} /></View>
                            <View style={s.levelRing}><View style={s.levelRingInner}><AppText style={s.levelLabel}>NIVEL</AppText><AppText style={s.levelNumber}>{lv.level}</AppText><AppText style={s.levelName}>{lv.level < 5 ? 'Semilla' : 'En crecimiento'}</AppText></View><View style={s.leafBadge}><Ionicons name="leaf" size={18} color="#32776A" /></View></View>
                            <AppText centered style={s.progressMessage}>Cada paso cuenta.</AppText>
                            <AppText centered style={s.progressSubtitle}>Sigue aprendiendo, sigue creciendo.</AppText>
                            <View style={s.xpLabels}><AppText style={s.xpCurrent}>{userData?.total_xp || 0} XP</AppText><AppText style={s.xpNext}>{lv.next} XP</AppText></View>
                            <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(lv.progress) }} accessibilityLabel="Progreso al siguiente nivel" style={s.progressTrack}><LinearGradient colors={['#8FCA97', '#7FCFC7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${lv.progress}%`, height: '100%', borderRadius: 6 }} /></View>
                            <AppText centered style={s.nextLevel}>A {Math.max(0, lv.next - (userData?.total_xp || 0))} XP de tu siguiente nivel</AppText>
                            <View style={s.progressDivider} />
                            <View style={s.streak}><View style={s.streakIcon}><Ionicons name="flame-outline" color="#B86C4A" size={22} /></View><View style={{ flex: 1 }}><AppText style={s.streakTitle}>{userData?.current_streak || 0} días de racha</AppText><AppText style={s.streakSub}>Hoy es un buen día para continuar.</AppText></View></View>
                        </GlassPanel>
                        <GlassPanel tint="mint" style={s.communityCard}>
                            <View style={s.communityTop}><Ionicons name="trophy-outline" size={26} color="#68A877" /><View style={s.communityPill}><AppText style={s.communityPillText}>COMUNIDAD</AppText></View></View>
                            <AppText style={s.communityTitle}>Crecer juntos{ '\n' }llega más lejos.</AppText>
                            <AppText style={s.communityDescription}>Comparte tus logros y encuentra tu lugar en el ranking.</AppText>
                            <Button title="Ver ranking  ↗" variant="outline" onPress={() => openMemberScreen('RankingDashboard')} style={{ marginTop: 20 }} />
                        </GlassPanel>
                    </View>
                </View>

                <View style={s.footer}><AppText style={s.footerBrand}>BEREA GAMES</AppText><AppText style={s.footerText}>Aprende. Comparte. Crece.</AppText></View>
            </ScrollView>
            <View style={[s.dockWrap, { bottom: Math.max(insets.bottom, 18) }]}>
                <GlassPanel blur style={s.dock}>
                    {([
                        { icon: 'grid-outline', label: 'Inicio', action: () => {}, active: true },
                        { icon: 'book-outline', label: 'Estudio', action: () => navigation.navigate('StudyPaths'), active: false },
                        { icon: 'trophy-outline', label: 'Ranking', action: () => openMemberScreen('RankingDashboard'), active: false },
                        { icon: 'person-outline', label: 'Mi perfil', action: () => openMemberScreen('Profile'), active: false },
                    ] as { icon: Icon; label: string; action: () => void; active: boolean }[]).map(item => (
                        <Pressable key={item.label} accessibilityRole="button" accessibilityState={{ selected: item.active }} accessibilityLabel={item.label} onPress={item.action} style={[s.dockItem, item.active && s.dockActive]}>
                            <Ionicons name={item.icon} size={20} color={item.active ? theme.colors.primary : theme.colors.textSecondary} /><AppText style={[s.dockLabel, item.active && { color: theme.colors.primary }]}>{item.label}</AppText>
                        </Pressable>
                    ))}
                </GlassPanel>
            </View>
        </Container>
    );
};
const s = StyleSheet.create({
    page: { width: '100%', maxWidth: 1240, alignSelf: 'center', paddingHorizontal: 42, paddingTop: 28, paddingBottom: 120 },
    pageCompact: { paddingHorizontal: 20, paddingTop: 18 },
    topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
    brand: { flexDirection: 'row', gap: 11, alignItems: 'center' },
    brandIcon: { width: 46, height: 46, borderRadius: 16, borderWidth: 1, borderColor: '#FFFFFFAA', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...theme.shadows.soft },
    brandName: { fontSize: 30, lineHeight: 34, fontWeight: '800', letterSpacing: -1.5 },
    brandDot: { color: '#68A877', fontSize: 30, fontWeight: '800' },
    brandCaption: { fontSize: 8, letterSpacing: 1.5, color: theme.colors.textSecondary, fontWeight: '600' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    greeting: { fontSize: 13, color: theme.colors.textSecondary, marginRight: 8 },
    iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF55', borderWidth: 1, borderColor: '#FFFFFFBB', borderRadius: 22 },
    avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#CBD8D0', borderRadius: 22, borderWidth: 2, borderColor: '#FFFFFFBB' },
    avatarText: { fontWeight: '700', color: '#2D4A3E' },
    main: { gap: 24 }, mainDesktop: { flexDirection: 'row', alignItems: 'flex-start' }, mainColumn: { flex: 1, minWidth: 0 },
    hero: { minHeight: 330, padding: 32, flexDirection: 'row', overflow: 'hidden' },
    heroCompact: { padding: 25, minHeight: 330 }, heroCopy: { flex: 1, zIndex: 2 },
    eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 22 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3F9B8B' },
    eyebrowText: { fontSize: 9, fontWeight: '700', letterSpacing: 1.3, color: '#666373' },
    headline: { fontSize: 43, lineHeight: 49, letterSpacing: -1.8, fontWeight: '700' },
    headlineCompact: { fontSize: 36, lineHeight: 42, letterSpacing: -1.5 }, headlineAccent: { color: '#68A877' },
    heroDescription: { fontSize: 13, lineHeight: 21, color: theme.colors.textSecondary, marginTop: 15 },
    heroButton: { alignSelf: 'flex-start', marginTop: 23, minWidth: 179 },
    heroFootnote: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 17 },
    footnoteText: { fontSize: 10, color: theme.colors.textSecondary },
    art: { width: 205, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', marginRight: -14 },
    orbitOuter: { position: 'absolute', width: 245, height: 245, borderRadius: 130, borderWidth: 1, borderColor: '#FFFFFF66' },
    orbitInner: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: '#FFFFFF66' },
    orb: { position: 'absolute', width: 66, height: 66, borderRadius: 33, top: 16, right: -9, borderWidth: 1, borderColor: '#FFFFFFDD', ...theme.shadows.soft },
    bookShadow: { position: 'absolute', width: 125, height: 22, borderRadius: 50, bottom: 23, backgroundColor: '#829A8D22', transform: [{ rotate: '-10deg' }] },
    book: { width: 140, height: 183, borderRadius: 16, borderWidth: 2, borderColor: '#FFFFFFBB', transform: [{ rotate: '-13deg' }], ...theme.shadows.default, alignItems: 'center', justifyContent: 'center' },
    bookSpine: { position: 'absolute', width: 9, left: 5, top: 7, bottom: 7, borderRadius: 7, backgroundColor: '#FFFFFF44' },
    crossV: { width: 7, height: 46, backgroundColor: '#FFFFFFCC', borderRadius: 3, marginBottom: 18 },
    crossH: { width: 30, height: 7, backgroundColor: '#FFFFFFCC', borderRadius: 3, position: 'absolute', top: 53 },
    bookLabel: { fontSize: 9, lineHeight: 15, letterSpacing: 2, textAlign: 'center', fontWeight: '600', color: '#527C64' },
    bookLine: { position: 'absolute', bottom: 10, left: 15, right: 7, height: 3, backgroundColor: '#FFFFFF99', borderRadius: 2 },
    floatingSpark: { position: 'absolute', bottom: 16, right: -5, width: 62, height: 62, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '12deg' }] },
    floatingHeart: { position: 'absolute', top: 27, left: -2, width: 49, height: 49, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] },
    sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 32, marginBottom: 17 },
    sectionLabel: { fontSize: 9, letterSpacing: 1.4, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 5 },
    sectionTitle: { fontSize: 23, fontWeight: '600', letterSpacing: -0.7 }, sectionMeta: { fontSize: 10, color: theme.colors.textSecondary, marginBottom: 3 },
    games: { flexDirection: 'row', gap: 14 }, gamesCompact: { flexDirection: 'column', gap: 12 },
    gameCard: { flex: 1, padding: 20, paddingBottom: 23, minHeight: 226, borderRadius: 28, borderWidth: 1, borderColor: '#FFFFFFDD', ...theme.shadows.soft },
    gameCardCompact: { flexDirection: 'row', alignItems: 'center', gap: 15, minHeight: 112, padding: 17, paddingBottom: 17 },
    gameTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 19 },
    gameIcon: { width: 49, height: 49, alignItems: 'center', justifyContent: 'center', borderRadius: 17, borderWidth: 1 },
    gameNumber: { fontSize: 11, color: '#718478' }, gameTitle: { fontSize: 18, fontWeight: '600', letterSpacing: -0.5 },
    gameDescription: { fontSize: 12, lineHeight: 18, color: '#617366', marginTop: 7, maxWidth: 175 },
    gameMeta: { fontSize: 8, letterSpacing: 0.8, fontWeight: '700', marginTop: 24 },
    gameArrow: { position: 'absolute', right: 14, bottom: 14, width: 29, height: 29, backgroundColor: '#FFFFFF66', borderRadius: 15, borderWidth: 1, borderColor: '#FFFFFFAA', alignItems: 'center', justifyContent: 'center' },
    gameArrowCompact: { position: 'relative', right: 0, bottom: 0 },
    studyCard: { marginTop: 20, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 17, borderRadius: 28, borderWidth: 1, borderColor: '#FFFFFFCC', ...theme.shadows.soft },
    studyIcon: { width: 49, height: 55, justifyContent: 'center', alignItems: 'center' },
    studyEyebrow: { fontSize: 8, letterSpacing: 1.4, color: '#477B77', fontWeight: '700', marginBottom: 3 },
    studyTitle: { fontSize: 18, fontWeight: '600', letterSpacing: -0.4 }, studyDescription: { fontSize: 12, color: '#5B7373', marginTop: 3 },
    roundArrow: { width: 37, height: 37, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFFFFF', backgroundColor: '#FFFFFF44' },
    aside: { gap: 20 }, asideDesktop: { width: 280 }, progressCard: { padding: 25 },
    progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, panelTitle: { fontSize: 16, fontWeight: '600' },
    levelRing: { width: 139, height: 139, borderRadius: 75, borderWidth: 5, borderColor: '#C4E8D1', borderTopColor: '#8FCA97', borderRightColor: '#A3CFC9', alignSelf: 'center', marginVertical: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF55' },
    levelRingInner: { width: 113, height: 113, borderRadius: 60, borderWidth: 1, borderColor: '#FFFFFFCC', alignItems: 'center', justifyContent: 'center' },
    levelLabel: { fontSize: 8, letterSpacing: 2, color: '#6C8574' }, levelNumber: { fontSize: 43, lineHeight: 50, fontWeight: '600', color: '#68A877' },
    levelName: { fontSize: 11, color: '#62796D' }, leafBadge: { position: 'absolute', right: -3, bottom: 5, width: 32, height: 32, borderRadius: 16, backgroundColor: '#D6EDE5', borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
    progressMessage: { fontSize: 16, fontWeight: '600' }, progressSubtitle: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 5 },
    xpLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, marginBottom: 8 }, xpCurrent: { fontSize: 11, fontWeight: '700', color: '#68A877' }, xpNext: { fontSize: 10, color: theme.colors.textSecondary },
    progressTrack: { height: 7, borderRadius: 5, backgroundColor: '#BEC5D344', overflow: 'hidden' }, nextLevel: { fontSize: 10, color: theme.colors.textSecondary, marginTop: 10 },
    progressDivider: { height: 1, backgroundColor: '#FFFFFFAA', marginVertical: 22 }, streak: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    streakIcon: { width: 37, height: 39, borderRadius: 14, backgroundColor: '#E6C4AF44', alignItems: 'center', justifyContent: 'center' }, streakTitle: { fontSize: 12, fontWeight: '600' }, streakSub: { fontSize: 9, color: theme.colors.textSecondary, marginTop: 2 },
    communityCard: { padding: 25 }, communityTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    communityPill: { paddingVertical: 4, paddingHorizontal: 9, backgroundColor: '#FFFFFF55', borderRadius: 10 }, communityPillText: { fontSize: 7, fontWeight: '700', letterSpacing: 1, color: '#68A877' },
    communityTitle: { fontSize: 23, lineHeight: 29, fontWeight: '600', letterSpacing: -0.6 }, communityDescription: { fontSize: 12, lineHeight: 19, color: '#60816E', marginTop: 10 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 31 }, footerBrand: { fontSize: 9, letterSpacing: 2, color: '#738277', fontWeight: '600' }, footerText: { fontSize: 10, color: '#738277' },
    dockWrap: { position: 'absolute', bottom: 18, left: 18, right: 18, alignItems: 'center' },
    dock: { flexDirection: 'row', padding: 6, width: '100%', maxWidth: 410, borderRadius: 28, backgroundColor: '#EEE9E580' },
    dockItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, borderRadius: 22, minHeight: 52 },
    dockActive: { backgroundColor: '#FFFFFF99', borderWidth: 1, borderColor: '#FFFFFFCC' }, dockLabel: { fontSize: 10, fontWeight: '500', color: theme.colors.textSecondary },
});

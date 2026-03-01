import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const SystemGuideScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    const GuidelineCard = ({ icon, title, description, color, tasks }: any) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBg, { backgroundColor: color + '15' }]}>
                    <Ionicons name={icon} size={28} color={color} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDesc}>{description}</Text>
                </View>
            </View>

            <View style={styles.tasksContainer}>
                {tasks.map((task: any, idx: number) => (
                    <View key={idx} style={styles.taskRow}>
                        <View style={styles.dot} />
                        <Text style={styles.taskText}>{task.text}</Text>
                        <View style={[styles.rewardBadge, { backgroundColor: color + '20' }]}>
                            <Text style={[styles.rewardText, { color }]}>{task.reward}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor="#050505" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>CÓMO GANAR PUNTOS</Text>
                    <Text style={styles.headerSub}>Guía Oficial del Sistema</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.introBox}>
                    <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
                    <Text style={styles.introText}>
                        El sistema mide tu experiencia permanente (XP) que define tu Nivel Histórico, y tus Trofeos que definen el Ranking y se renuevan cada mes.
                    </Text>
                </View>

                <GuidelineCard
                    icon="trophy-outline"
                    title="Trofeos (Copas)"
                    color="#FFB800"
                    description="Definen tu posición mensual. Se consiguen ganando y teniendo disciplina en tus misiones."
                    tasks={[
                        { text: 'Ganar charadas en grupo', reward: '+10 Trofeos' },
                        { text: 'Actividad sabatina en iglesia', reward: '+8 Trofeos' },
                        { text: 'Completar 1 devocional', reward: '+5 Trofeos' },
                        { text: '1er Lugar en torneos', reward: '+30 Trofeos' }
                    ]}
                />

                <GuidelineCard
                    icon="flash-outline"
                    title="Experiencia (XP)"
                    color={theme.colors.primary}
                    description="Es el nivel permanente de tu historia como jugador. Siempre suma, nunca resta."
                    tasks={[
                        { text: 'Completar tu semana de estudio', reward: '+30 XP' },
                        { text: 'Invitar amigos la iglesia (Red)', reward: '+200 XP' },
                        { text: 'Entrar a la app diariamente', reward: '+50 XP' },
                        { text: 'Participar y jugar (sin importar si ganas)', reward: '+10 XP' }
                    ]}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#111',
    },
    headerTitleContainer: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 3 },
    headerSub: { color: theme.colors.primary, fontSize: 11, marginTop: 4, fontWeight: '600' },
    iconBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#111', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#1A1A1A',
    },
    scrollContent: { padding: 20 },
    introBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A0A0A',
        borderRadius: 16, padding: 20, marginBottom: 24,
        borderWidth: 1, borderColor: '#1A1A1A',
    },
    introText: {
        color: '#888', flex: 1, marginLeft: 16, fontSize: 13, lineHeight: 22,
    },
    card: {
        backgroundColor: '#0A0A0A', borderRadius: 20, padding: 24,
        marginBottom: 20, borderWidth: 1, borderColor: '#1A1A1A',
    },
    cardHeader: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    },
    iconBg: {
        width: 56, height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
    },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
    cardDesc: { color: '#666', fontSize: 12, marginTop: 6, lineHeight: 18 },
    tasksContainer: {
        gap: 12, borderTopWidth: 1, borderTopColor: '#151515', paddingTop: 20,
    },
    taskRow: {
        flexDirection: 'row', alignItems: 'center',
    },
    dot: {
        width: 6, height: 6, borderRadius: 3, backgroundColor: '#333', marginRight: 12,
    },
    taskText: {
        color: '#ddd', fontSize: 14, flex: 1, fontWeight: '600',
    },
    rewardBadge: {
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    },
    rewardText: {
        fontSize: 12, fontWeight: '800',
    }
});

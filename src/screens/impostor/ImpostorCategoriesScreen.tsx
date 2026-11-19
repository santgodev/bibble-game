import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { Category, getCategories } from '../../data/categories';
import { supabase } from '../../lib/supabase';
import { getCategoryLockStatus } from '../../utils/categoryLock';
import { EditorialDoodle, getDoodleForThemeId } from '../../trivia/components/EditorialDoodle';

const formatCategoryTitle = (raw: string): string => {
    const trimmed = (raw || '').trim();
    if (!trimmed) return '';
    if (trimmed !== trimmed.toLocaleUpperCase()) return trimmed;
    const lower = trimmed.toLocaleLowerCase();
    return (lower.charAt(0).toLocaleUpperCase() + lower.slice(1))
        .replace(/\bantiguo testamento\b/gi, 'Antiguo Testamento')
        .replace(/\bnuevo testamento\b/gi, 'Nuevo Testamento')
        .replace(/\bnavidad\b/gi, 'Navidad')
        .replace(/\bpascua\b/gi, 'Pascua');
};

export const ImpostorCategoriesScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();

    const [categories, setCategories] = useState<Category[]>([]);
    const [completedMissions, setCompletedMissions] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [unleashModalVisible, setUnleashModalVisible] = useState(false);
    const [currentQuizCategory, setCurrentQuizCategory] = useState<Category | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizMistakes, setQuizMistakes] = useState(0);

    useEffect(() => {
        if (route.params?.selectedIds) {
            setSelectedIds(route.params.selectedIds);
        }
    }, [route.params?.selectedIds]);

    const loadData = async () => {
        const data = await getCategories('impostor');
        setCategories(data.filter(c => c.words && c.words.length > 0));

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: events } = await supabase
                    .from('events')
                    .select('description')
                    .eq('user_id', user.id)
                    .like('description', 'MISSION:%');

                if (events) {
                    setCompletedMissions(events.map((e: any) => e.description.replace('MISSION:', '')));
                }
            }
        } catch (err) {
            console.error('Error loading progress:', err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const isCategoryLocked = (category: Category): boolean =>
        getCategoryLockStatus(category, completedMissions).locked;

    const toggleSelection = (category: Category) => {
        const lockStatus = getCategoryLockStatus(category, completedMissions);
        if (lockStatus.locked) {
            if (lockStatus.reason === 'unstarted') {
                Alert.alert(
                    'Devocional pendiente',
                    'Inicia primero el devocional de la unidad en Estudio.'
                );
                return;
            }

            if (lockStatus.reason === 'path') {
                Alert.alert(
                    'Plan de Estudio',
                    'Completa primero la unidad anterior de tu ruta.'
                );
                return;
            }

            if (lockStatus.reason === 'quiz' && category.unleashQuiz && category.unleashQuiz.length > 0) {
                setCurrentQuizCategory(category);
                setCurrentQuestionIndex(0);
                setQuizMistakes(0);
                setUnleashModalVisible(true);
                return;
            }

            Alert.alert('Paquete bloqueado', 'Completa el devocional para usar este paquete.');
            return;
        }

        setSelectedIds(prev =>
            prev.includes(category.id)
                ? prev.filter(id => id !== category.id)
                : [...prev, category.id]
        );
    };

    const handleAnswerUnleash = async (selectedIndex: number) => {
        if (!currentQuizCategory || !currentQuizCategory.unleashQuiz) return;
        const q = currentQuizCategory.unleashQuiz[currentQuestionIndex];

        if (selectedIndex === q.correctIndex) {
            if (currentQuestionIndex < currentQuizCategory.unleashQuiz.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const newEvent = `MISSION:UNLEASHED_${currentQuizCategory.id}`;
                    if (user) {
                        await supabase.from('events').insert({
                            user_id: user.id,
                            description: newEvent,
                        });
                    }
                    setCompletedMissions(prev => [...prev, newEvent.replace('MISSION:', '')]);
                    Alert.alert('Módulo desbloqueado', 'Ya puedes usar este paquete en El impostor.');
                    setUnleashModalVisible(false);
                } catch (e) {
                    console.error('Error Unleashing:', e);
                    Alert.alert('Error', 'No se pudo guardar el progreso.');
                }
            }
        } else {
            const currentMistakes = quizMistakes + 1;
            setQuizMistakes(currentMistakes);
            if (currentMistakes >= 3) {
                Alert.alert('Intenta de nuevo', 'Regresa a leer el devocional respectivo.');
                setUnleashModalVisible(false);
            } else {
                Alert.alert('Incorrecto', `Te quedan ${3 - currentMistakes} intentos.`);
            }
        }
    };

    const handleConfirm = () => {
        const selectedObj = categories.filter(c => selectedIds.includes(c.id));
        navigation.navigate({
            name: 'ImpostorConfig',
            params: { selectedCategories: selectedObj },
            merge: true,
        });
    };

    const renderItem = ({ item }: { item: Category }) => {
        const locked = isCategoryLocked(item);
        const selected = selectedIds.includes(item.id);
        const doodle = getDoodleForThemeId(item.id);
        const displayTitle = formatCategoryTitle(item.title);

        return (
            <Pressable
                accessibilityRole="button"
                onPress={() => toggleSelection(item)}
                style={({ pressed }) => [
                    s.rowCard,
                    selected && !locked && s.rowCardSelected,
                    locked && { opacity: 0.65 },
                    pressed && !locked && s.pressed,
                ]}
            >
                {locked ? (
                    <View style={s.lockBadge}>
                        <Ionicons name="lock-closed-outline" size={20} color="#6E7785" />
                    </View>
                ) : (
                    <EditorialDoodle kind={doodle.kind} tint={doodle.tint} size={46} />
                )}

                <View style={{ flex: 1 }}>
                    <AppText style={s.cardTitle} numberOfLines={2}>
                        {displayTitle}
                    </AppText>
                </View>

                {!locked && (
                    <View style={[s.checkBadge, !selected && s.checkBadgeEmpty]}>
                        {selected && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
                    </View>
                )}
            </Pressable>
        );
    };

    const renderUnleashModal = () => {
        if (!currentQuizCategory || !currentQuizCategory.unleashQuiz) return null;
        const q = currentQuizCategory.unleashQuiz[currentQuestionIndex];

        return (
            <Modal
                onRequestClose={() => setUnleashModalVisible(false)}
                visible={unleashModalVisible}
                animationType="fade"
                transparent
            >
                <View style={s.modalOverlay}>
                    <View style={s.modalSheet}>
                        <View style={s.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <AppText style={s.modalEyebrow}>DESBLOQUEAR</AppText>
                                <AppText style={s.modalTitle}>{currentQuizCategory.title}</AppText>
                            </View>
                            <TouchableOpacity
                                accessibilityRole="button"
                                onPress={() => setUnleashModalVisible(false)}
                                style={s.closeBtn}
                            >
                                <Ionicons name="close" size={18} color="#1B1E23" />
                            </TouchableOpacity>
                        </View>

                        <View style={s.modalMetaRow}>
                            <AppText style={s.modalMeta}>
                                {currentQuestionIndex + 1}/{currentQuizCategory.unleashQuiz.length}
                            </AppText>
                            <View style={s.livesRow}>
                                {[0, 1, 2].map(i => (
                                    <Ionicons
                                        key={i}
                                        name={i < 3 - quizMistakes ? 'heart' : 'heart-outline'}
                                        size={15}
                                        color="#C96A6A"
                                    />
                                ))}
                            </View>
                        </View>

                        <AppText style={s.modalQuestion}>{q.q}</AppText>

                        <View style={{ gap: 10 }}>
                            {q.options.map((opt, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={s.modalOptionBtn}
                                    onPress={() => handleAnswerUnleash(i)}
                                    activeOpacity={0.82}
                                >
                                    <View style={s.modalOptionLetter}>
                                        <AppText style={s.modalOptionLetterText}>
                                            {['A', 'B', 'C', 'D'][i]}
                                        </AppText>
                                    </View>
                                    <AppText style={s.modalOptionText}>{opt}</AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <View style={s.inner}>
                <View style={s.header}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        onPress={() => navigation.goBack()}
                        style={s.backBtn}
                    >
                        <Ionicons name="chevron-back" size={20} color="#1B1E23" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <AppText style={s.eyebrow}>EL IMPOSTOR</AppText>
                        <AppText style={s.title}>Paquetes</AppText>
                    </View>
                    <View style={s.countPill}>
                        <AppText style={s.countText}>{selectedIds.length}</AppText>
                    </View>
                </View>

                <FlatList
                    data={categories}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 110 }]}
                    showsVerticalScrollIndicator={false}
                />

                <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={handleConfirm}
                        style={({ pressed }) => [s.confirmBtn, pressed && s.pressed]}
                    >
                        <AppText style={s.confirmText}>Confirmar ({selectedIds.length})</AppText>
                    </Pressable>
                </View>

                {renderUnleashModal()}
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    inner: {
        flex: 1,
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 16,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.4,
        color: '#2B6CB0',
        marginBottom: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1B1E23',
        letterSpacing: -0.5,
    },
    countPill: {
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: '#D6E8F8',
    },
    countText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    list: {
        paddingTop: 4,
        paddingHorizontal: 20,
        gap: 11,
    },
    rowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderRadius: 24,
        backgroundColor: '#F7F9FB',
    },
    rowCardSelected: {
        backgroundColor: '#D6E8F8',
    },
    checkBadge: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBadgeEmpty: {
        backgroundColor: '#FFFFFF',
    },
    lockBadge: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        color: '#1B1E23',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        backgroundColor: 'rgba(255,255,255,0.92)',
    },
    confirmBtn: {
        height: 54,
        borderRadius: 27,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(27, 30, 35, 0.36)',
        justifyContent: 'center',
        padding: 22,
    },
    modalSheet: {
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        padding: 22,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    modalEyebrow: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.3,
        color: '#2B6CB0',
        marginBottom: 2,
    },
    modalTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#1B1E23',
    },
    closeBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F3F7F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalMeta: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6E7785',
    },
    livesRow: {
        flexDirection: 'row',
        gap: 4,
    },
    modalQuestion: {
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '800',
        color: '#1B1E23',
        marginBottom: 18,
    },
    modalOptionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#F6F8FA',
    },
    modalOptionLetter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#D6E8F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOptionLetterText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    modalOptionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1B1E23',
    },
});

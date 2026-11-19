import React from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components';
import { Category, getCategories, TriviaQuestion, WordItem } from '../data/categories';
import { supabase } from '../lib/supabase';
import { getCategoryLockStatus } from '../utils/categoryLock';
import { useSound } from '../context/SoundContext';
import { EditorialDoodle, getDoodleForThemeId } from '../trivia/components/EditorialDoodle';

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

export const CategorySelectionScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();

    const [search, setSearch] = React.useState('');
    const { playSound, playHaptic } = useSound();
    const subcategories = route?.params?.subcategories;
    const parentTitle = route?.params?.parentTitle;
    const targetGame = route?.params?.targetGame || 'charadas';

    const [categories, setCategories] = React.useState<Category[]>([]);
    const [completedMissions, setCompletedMissions] = React.useState<string[]>([]);

    const [unleashModalVisible, setUnleashModalVisible] = React.useState(false);
    const [currentQuizCategory, setCurrentQuizCategory] = React.useState<Category | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [quizMistakes, setQuizMistakes] = React.useState(0);

    const [difficultyModalVisible, setDifficultyModalVisible] = React.useState(false);
    const [categoryForTrivia, setCategoryForTrivia] = React.useState<Category | null>(null);

    const loadCategoriesAndProgress = async () => {
        if (subcategories) {
            setCategories(subcategories);
        } else {
            const data = await getCategories(targetGame);
            setCategories(data);
        }

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
            console.error('Error loading progress for categories:', err);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCategoriesAndProgress();
        }, [])
    );

    const isCategoryLocked = (category: Category): boolean =>
        getCategoryLockStatus(category, completedMissions).locked;

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
                    playSound('unlock');
                    playHaptic('victory');

                    Alert.alert('Módulo desbloqueado', `"${currentQuizCategory.title}" ya está disponible.`);
                    setUnleashModalVisible(false);
                } catch (e) {
                    console.error('Error Unleashing:', e);
                    Alert.alert('Error', 'No se pudo guardar el progreso de desbloqueo.');
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

    const renderItem = ({ item }: { item: Category }) => {
        const locked = isCategoryLocked(item);
        const doodle = getDoodleForThemeId(item.id);
        const displayTitle = formatCategoryTitle(item.title);

        const proceedToGame = async (categoryWithData: Category) => {
            if (targetGame === 'trivia') {
                setCategoryForTrivia(categoryWithData);
                setDifficultyModalVisible(true);
            } else {
                navigation.navigate('WordPreview', {
                    category: categoryWithData.title,
                    categoryObj: categoryWithData,
                    totalPool: categoryWithData.words,
                    canEarnTrophies: true,
                });
            }
        };

        const loadContentAndStart = async () => {
            if (targetGame === 'trivia' && item.trivia && item.trivia.length > 0) {
                proceedToGame(item);
                return;
            }
            if ((targetGame === 'charadas' || targetGame === 'impostor') && item.words && item.words.length > 0) {
                proceedToGame(item);
                return;
            }

            try {
                if (targetGame === 'trivia') {
                    const { data: qs } = await supabase
                        .from('trivia_questions')
                        .select('*')
                        .eq('category_id', item.id);

                    if (qs && qs.length > 0) {
                        const mappedQs: TriviaQuestion[] = qs.map((q: any) => ({
                            id: q.id,
                            question: q.question,
                            options: q.options,
                            correctIndex: q.correct_index,
                            difficulty: q.difficulty_level,
                            explanation: q.explanation,
                            verseSupport: q.verse_support,
                        }));
                        proceedToGame({ ...item, trivia: mappedQs });
                    } else {
                        Alert.alert('Próximamente', 'Esta categoría aún no tiene preguntas.');
                    }
                } else {
                    const { data: ws } = await supabase
                        .from('words')
                        .select('*')
                        .eq('category_id', item.id);

                    if (ws && ws.length > 0) {
                        const mappedWords: WordItem[] = ws.map((w: any) => ({
                            id: w.id,
                            word: w.word,
                            difficulty: w.difficulty_level,
                            impostorHints: w.impostor_hints,
                        }));
                        proceedToGame({ ...item, words: mappedWords });
                    } else {
                        Alert.alert('Próximamente', 'Esta categoría aún no tiene palabras.');
                    }
                }
            } catch (err) {
                console.error('Error fetching dynamic content:', err);
                Alert.alert('Error', 'No se pudo cargar el contenido de esta categoría.');
            }
        };

        return (
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.title + (locked ? ', bloqueado' : '')}
                onPress={() => {
                    if (locked) {
                        const lockStatus = getCategoryLockStatus(item, completedMissions);

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

                        if (lockStatus.reason === 'quiz' && item.unleashQuiz && item.unleashQuiz.length > 0) {
                            setCurrentQuizCategory(item);
                            setCurrentQuestionIndex(0);
                            setQuizMistakes(0);
                            setUnleashModalVisible(true);
                            return;
                        }
                    }

                    if (item.subcategories && item.subcategories.length > 0 && targetGame === 'trivia') {
                        navigation.push('CategorySelection', {
                            subcategories: item.subcategories,
                            parentTitle: item.title,
                            targetGame,
                        });
                    } else {
                        loadContentAndStart();
                    }
                }}
                style={({ pressed }) => [
                    s.rowCard,
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

                <Ionicons
                    name={locked ? 'lock-closed-outline' : 'chevron-forward'}
                    size={18}
                    color="#9AA3AE"
                />
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
                                accessibilityLabel="Cerrar examen"
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

    const renderDifficultyModal = () => {
        if (!categoryForTrivia) return null;

        const startTrivia = (diff: number) => {
            setDifficultyModalVisible(false);
            if (targetGame === 'trivia') {
                navigation.navigate('TriviaGame', {
                    categoryObj: categoryForTrivia,
                    questions: categoryForTrivia.trivia,
                    duration: 90,
                    difficulty: diff,
                    limit: 15,
                    canEarnTrophies: true,
                });
            } else {
                navigation.navigate('WordPreview', {
                    category: categoryForTrivia.title,
                    categoryObj: categoryForTrivia,
                    totalPool: categoryForTrivia.words,
                    difficulty: diff,
                    canEarnTrophies: true,
                });
            }
        };

        const levels = [
            { lvl: 1, name: 'Semilla', tag: 'Básico', bg: '#DCECE8', color: '#2E6F65', icon: 'leaf-outline' },
            { lvl: 2, name: 'Discípulo', tag: 'Intermedio', bg: '#D6E8F8', color: '#1E3A5F', icon: 'compass-outline' },
            { lvl: 3, name: 'Maestro', tag: 'Avanzado', bg: '#F5DA7C', color: '#6F5207', icon: 'ribbon-outline' },
        ];

        return (
            <Modal
                onRequestClose={() => setDifficultyModalVisible(false)}
                visible={difficultyModalVisible}
                animationType="fade"
                transparent
            >
                <View style={s.modalOverlay}>
                    <View style={s.modalSheet}>
                        <View style={s.modalHeader}>
                            <AppText style={[s.modalTitle, { flex: 1 }]}>
                                {categoryForTrivia.title}
                            </AppText>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityLabel="Cerrar niveles"
                                onPress={() => setDifficultyModalVisible(false)}
                                style={s.closeBtn}
                            >
                                <Ionicons name="close" size={18} color="#1B1E23" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ gap: 12 }}>
                            {levels.map(item => (
                                <Pressable
                                    key={item.lvl}
                                    accessibilityRole="button"
                                    onPress={() => startTrivia(item.lvl)}
                                    style={({ pressed }) => [
                                        s.levelCard,
                                        { backgroundColor: item.bg },
                                        pressed && s.pressed,
                                    ]}
                                >
                                    <View style={s.levelIconBox}>
                                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <AppText style={s.levelName}>{item.name}</AppText>
                                        <AppText style={[s.levelTag, { color: item.color }]}>{item.tag}</AppText>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={item.color} />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const filtered = categories.filter(item =>
        item.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
    );

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            <View style={s.inner}>
                <View style={s.headerRow}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        onPress={() => navigation.goBack()}
                        style={s.backBtn}
                    >
                        <Ionicons name="chevron-back" size={20} color="#1B1E23" />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                        <AppText style={s.eyebrow}>
                            {targetGame === 'trivia' ? 'TRIVIA BÍBLICA' : 'CHARADAS'}
                        </AppText>
                        <AppText style={s.headerTitle} numberOfLines={1}>
                            {parentTitle || 'Elige un tema'}
                        </AppText>
                    </View>

                    <View style={s.countPill}>
                        <AppText style={s.countText}>{categories.length}</AppText>
                    </View>
                </View>

                <View style={s.searchBox}>
                    <Ionicons name="search-outline" size={18} color="#6E7785" />
                    <TextInput
                        accessibilityLabel="Buscar tema"
                        placeholder="Buscar tema..."
                        placeholderTextColor="#8B94A1"
                        value={search}
                        onChangeText={setSearch}
                        style={s.searchInput}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="Limpiar búsqueda"
                            onPress={() => setSearch('')}
                            style={{ padding: 6 }}
                        >
                            <Ionicons name="close" size={17} color="#6E7785" />
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <AppText centered style={s.emptyText}>
                            No encontramos temas con ese nombre.
                        </AppText>
                    }
                    contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 36 }]}
                    showsVerticalScrollIndicator={false}
                />

                {renderUnleashModal()}
                {renderDifficultyModal()}
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
    headerRow: {
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
        color: '#3D8A7B',
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
        color: '#1B1E23',
    },
    countPill: {
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: '#F3F7F6',
    },
    countText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E3A5F',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 20,
        backgroundColor: '#F6F8FA',
        marginHorizontal: 20,
        marginBottom: 18,
    },
    searchInput: {
        flex: 1,
        color: '#1B1E23',
        fontSize: 15,
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
    emptyText: {
        padding: 32,
        color: '#6E7785',
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
        color: '#3D8A7B',
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
        backgroundColor: '#DCECE8',
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
    levelCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 22,
        padding: 16,
    },
    levelIconBox: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.68)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelName: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1B1E23',
    },
    levelTag: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 2,
    },
});

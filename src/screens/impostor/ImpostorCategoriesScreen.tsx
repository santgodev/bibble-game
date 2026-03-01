import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Dimensions, Modal } from 'react-native';
import { Container, AppText, Button } from '../../components';
import { getCategories, Category, UnleashQuestion } from '../../data/categories';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { getCategoryLockStatus } from '../../utils/categoryLock';

const { width } = Dimensions.get('window');
const SPACING = 20;
const GAP = 16;
const CARD_SIZE = (width - (SPACING * 2) - GAP) / 2;

export const ImpostorCategoriesScreen = ({ navigation, route }: any) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [completedMissions, setCompletedMissions] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Unleash Quiz state
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
        // Flatten categories strictly for multiple selection
        const data = await getCategories();
        const flatList: Category[] = [];
        data.forEach(c => {
            if (c.subcategories && c.subcategories.length > 0) {
                flatList.push(...c.subcategories);
            } else {
                flatList.push(c);
            }
        });
        // Remove empty folders
        const cleanList = flatList.filter(c => c.words && c.words.length > 0);
        setCategories(cleanList);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: events } = await supabase
                    .from('events')
                    .select('description')
                    .eq('user_id', user.id)
                    .like('description', 'MISSION:%');

                if (events) {
                    setCompletedMissions(events.map(e => e.description.replace('MISSION:', '')));
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
                    'Devocional no iniciado 🔒',
                    `Para hacer el examen y usar este paquete en el Impostor, primero debes iniciar el devocional de la unidad en la sección "Rutas de Estudio".`
                );
                return;
            }

            if (lockStatus.reason === 'path') {
                Alert.alert(
                    'Falta Plan de Estudio 🔒',
                    'Completa primero la unidad anterior del plan "Jesús Real" en tu ruta.'
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

            Alert.alert(
                'Paquete Bloqueado 🔒',
                'Debes completar el requisito de devocional para usar este paquete.'
            );
            return;
        }

        setSelectedIds(prev => prev.includes(category.id)
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
                // All questions answered correctly — unlock!
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const newEvent = `MISSION:UNLEASHED_${currentQuizCategory.id}`;
                    if (user) {
                        await supabase.from('events').insert({
                            user_id: user.id,
                            description: newEvent
                        });
                    }
                    setCompletedMissions(prev => [...prev, newEvent.replace('MISSION:', '')]);
                    Alert.alert('¡Módulo Desbloqueado!', 'Superaste la prueba. ¡Ya puedes usar este paquete en el Impostor!');
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
                Alert.alert('¡Reprobaste!', 'Regresa a leer el devocional respectivo. Te equivocaste 3 veces.');
                setUnleashModalVisible(false);
            } else {
                Alert.alert('❌ Incorrecto', `Pierdes 1 vida. Te quedan ${3 - currentMistakes} vidas.`);
            }
        }
    };

    const handleConfirm = () => {
        const selectedObj = categories.filter(c => selectedIds.includes(c.id));
        navigation.navigate('ImpostorConfig', { selectedCategories: selectedObj });
    };

    const renderItem = ({ item }: { item: Category }) => {
        const locked = isCategoryLocked(item);
        const selected = selectedIds.includes(item.id);

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    locked && { borderColor: '#333', borderWidth: 1 },
                    selected && { borderColor: '#2ecc71', borderWidth: 2 }
                ]}
                onPress={() => toggleSelection(item)}
                activeOpacity={locked ? 1 : 0.8}
            >
                <View style={[styles.minimalistCover, { backgroundColor: locked ? '#111' : (item.color || '#1A1A1A') }]}>
                    <AppText style={[styles.minimalistTitle, locked && { color: '#555' }]} numberOfLines={2} adjustsFontSizeToFit>{item.title.toUpperCase()}</AppText>
                    {item.capitulo && <AppText style={[styles.minimalistSubtitle, locked && { color: '#444' }]} numberOfLines={1}>{item.capitulo}</AppText>}
                </View>

                {selected && (
                    <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={16} color="#000" />
                    </View>
                )}

                {locked && (
                    <View style={styles.lockOverlayAbsolute}>
                        <View style={styles.lockCircle}>
                            <Ionicons name="lock-closed" size={24} color="#888" />
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <AppText variant="subheader" style={styles.mainTitle}>Seleccionar Paquetes</AppText>
                <View style={{ width: 34 }} />
            </View>

            <AppText style={styles.subtitle}>Selecciona los temas de los que se tomarán las palabras.</AppText>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
            />

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.confirmBtn, selectedIds.length === 0 && { backgroundColor: '#555', shadowOpacity: 0 }]}
                    onPress={handleConfirm}
                    disabled={selectedIds.length === 0}
                >
                    <AppText style={styles.confirmBtnText}>
                        Confirmar {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Unleash Quiz Modal */}
            {currentQuizCategory && currentQuizCategory.unleashQuiz && (
                <Modal visible={unleashModalVisible} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <AppText variant="subheader" style={{ color: '#000' }}>Examen: {currentQuizCategory.title}</AppText>
                                <TouchableOpacity onPress={() => setUnleashModalVisible(false)} style={{ padding: 5 }}>
                                    <Ionicons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <View style={{ padding: 20 }}>
                                <AppText style={{ color: '#000', marginBottom: 5 }}>
                                    Pregunta {currentQuestionIndex + 1} de {currentQuizCategory.unleashQuiz.length}
                                </AppText>
                                <AppText style={{ color: '#333', fontSize: 13, marginBottom: 20 }}>
                                    Vidas: {Array(3 - quizMistakes).fill('❤️').join(' ')}
                                </AppText>

                                <AppText style={{ color: theme.colors.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
                                    {currentQuizCategory.unleashQuiz[currentQuestionIndex].q}
                                </AppText>

                                {currentQuizCategory.unleashQuiz[currentQuestionIndex].options.map((opt, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={styles.modalOptionBtn}
                                        onPress={() => handleAnswerUnleash(i)}
                                    >
                                        <View style={styles.modalOptionLetter}>
                                            <AppText style={{ color: '#000' }}>{['A', 'B', 'C', 'D'][i]}</AppText>
                                        </View>
                                        <AppText style={{ color: '#000', flex: 1 }}>{opt}</AppText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0f', paddingTop: 60 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    backBtn: { padding: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
    mainTitle: { color: '#fff' },
    subtitle: {
        color: '#ccc',
        textAlign: 'center',
        paddingHorizontal: 30,
        marginBottom: 20,
        fontSize: 14
    },
    list: { paddingBottom: 100 },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        marginBottom: GAP,
        alignItems: 'center',
        width: CARD_SIZE,
        height: CARD_SIZE,
        overflow: 'hidden'
    },
    minimalistCover: {
        width: '100%', height: '100%',
        justifyContent: 'center', alignItems: 'center', padding: 10,
    },
    minimalistTitle: {
        color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center',
    },
    minimalistSubtitle: {
        color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4, textAlign: 'center'
    },
    lockOverlayAbsolute: {
        ...StyleSheet.absoluteFillObject as any,
        backgroundColor: 'rgba(5,5,5,0.7)',
        justifyContent: 'center', alignItems: 'center',
    },
    lockCircle: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#333',
        justifyContent: 'center', alignItems: 'center',
    },
    checkCircle: {
        position: 'absolute', top: 10, right: 10,
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: '#2ecc71',
        justifyContent: 'center', alignItems: 'center'
    },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, paddingBottom: 40,
        backgroundColor: 'rgba(10, 10, 15, 0.9)'
    },
    confirmBtn: {
        backgroundColor: '#2ecc71', paddingVertical: 18, borderRadius: 30, alignItems: 'center',
    },
    confirmBtnText: {
        color: '#000', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        gap: 12,
    },
    modalOptionLetter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

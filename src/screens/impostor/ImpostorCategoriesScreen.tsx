import { GlassBackground, GlassSheen } from '../../components/Glass';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Dimensions, Modal, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Container, AppText, Button } from '../../components';
import { getCategories, Category, UnleashQuestion } from '../../data/categories';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { getCategoryLockStatus } from '../../utils/categoryLock';



export const ImpostorCategoriesScreen = ({ navigation, route }: any) => {
    const { width } = useWindowDimensions();
    const columns = width >= 800 ? 3 : 2;
    const cardSize = (Math.min(width, 1040) - 40 - (columns - 1) * 16) / columns;
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
        navigation.navigate({
            name: 'ImpostorConfig',
            params: { selectedCategories: selectedObj },
            merge: true
        });
    };

    const renderItem = ({ item }: { item: Category }) => {
        const locked = isCategoryLocked(item);
        const selected = selectedIds.includes(item.id);

        return (
            <TouchableOpacity
                style={[
                    styles.card, { width: cardSize },
                    locked && { borderColor: "rgba(255,255,255,0.82)", borderWidth: 1 },
                    selected && { borderColor: '#68A877', borderWidth: 2 }
                ]}
                accessibilityRole="button" accessibilityLabel={item.title} accessibilityState={{ selected }}
                onPress={() => toggleSelection(item)}
                activeOpacity={locked ? 1 : 0.8}
            >
                <View style={styles.minimalistCover}>
                    <GlassSheen tint={selected ? 'mint' : 'rose'} />
                    {item.icon && !locked && (
                        <Ionicons
                            name={item.icon as any}
                            size={30}
                            color="#A25078"
                            style={styles.floatingIcon}
                        />
                    )}
                    <AppText style={[styles.minimalistTitle, locked && { color: "#636477" }]} numberOfLines={2} adjustsFontSizeToFit>{item.title.toUpperCase()}</AppText>
                    {item.capitulo ? (
                        <AppText style={[styles.minimalistSubtitle, locked && { color: "#636477" }]} numberOfLines={1}>{item.capitulo}</AppText>
                    ) : (
                        <AppText style={[styles.minimalistSubtitle, locked && { color: "#636477" }]}>
                            {(item.words?.length || 0) + ' palabras'}
                        </AppText>
                    )}
                </View>

                {selected && (
                    <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={16} color="#2D3043" />
                    </View>
                )}

                {locked && (
                    <View style={styles.lockOverlayAbsolute}>
                        <View style={styles.lockCircle}>
                            <Ionicons name="lock-closed" size={24} color="#636477" />
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <GlassBackground />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#2D3043" />
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
                numColumns={columns}
                key={columns}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
            />

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.confirmBtn, selectedIds.length === 0 && { backgroundColor: "rgba(255,255,255,0.52)", shadowOpacity: 0 }]}
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
                                <AppText variant="subheader" style={{ color: "#2D3043" }}>Examen: {currentQuizCategory.title}</AppText>
                                <TouchableOpacity onPress={() => setUnleashModalVisible(false)} style={{ padding: 5 }}>
                                    <Ionicons name="close" size={24} color="#2D3043" />
                                </TouchableOpacity>
                            </View>

                            <View style={{ padding: 20 }}>
                                <AppText style={{ color: "#2D3043", marginBottom: 5 }}>
                                    Pregunta {currentQuestionIndex + 1} de {currentQuizCategory.unleashQuiz.length}
                                </AppText>
                                <AppText style={{ color: "#636477", fontSize: 13, marginBottom: 20 }}>
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
                                            <AppText style={{ color: "#2D3043" }}>{['A', 'B', 'C', 'D'][i]}</AppText>
                                        </View>
                                        <AppText style={{ color: "#2D3043", flex: 1 }}>{opt}</AppText>
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
    container: { flex: 1, backgroundColor: "rgba(255,255,255,0.52)", paddingTop: 60 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    backBtn: { padding: 5, backgroundColor: "rgba(255,255,255,0.48)", borderRadius: 20 },
    mainTitle: { color: "#2D3043" },
    subtitle: {
        color: "#636477",
        textAlign: 'center',
        paddingHorizontal: 30,
        marginBottom: 20,
        fontSize: 14
    },
    list: { paddingBottom: 100 },
    card: {
        backgroundColor: "rgba(255,255,255,0.52)",
        borderRadius: 26,
        marginBottom: 16,
        alignItems: 'center',
        width: '100%',
        height: 130,
        overflow: 'hidden'
    },
    minimalistCover: {
        flex: 1, width: '100%',
        justifyContent: 'center', alignItems: 'center', padding: 10,
    },
    floatingIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    minimalistTitle: {
        color: "#2D3043", fontSize: 18, fontWeight: 'bold', textAlign: 'center',
    },
    minimalistSubtitle: {
        color: "#636477", fontSize: 12, marginTop: 4, textAlign: 'center'
    },
    lockOverlayAbsolute: {
        ...StyleSheet.absoluteFill as any,
        backgroundColor: "rgba(255,255,255,0.55)",
        justifyContent: 'center', alignItems: 'center',
    },
    lockCircle: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: "rgba(255,255,255,0.52)", borderWidth: 1, borderColor: "rgba(255,255,255,0.82)",
        justifyContent: 'center', alignItems: 'center',
    },
    checkCircle: {
        position: 'absolute', top: 10, right: 10,
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: '#68A877',
        justifyContent: 'center', alignItems: 'center'
    },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, paddingBottom: 40,
        backgroundColor: "rgba(229,224,233,0.94)"
    },
    confirmBtn: {
        backgroundColor: '#68A877', paddingVertical: 18, borderRadius: 30, alignItems: 'center',
    },
    confirmBtnText: {
        color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.55)",
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
        borderBottomColor: "rgba(255,255,255,0.82)",
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
        backgroundColor: "#68A877",
        justifyContent: 'center',
        alignItems: 'center',
    },
});

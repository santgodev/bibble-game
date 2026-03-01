import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Dimensions, ImageBackground, Platform, Modal } from 'react-native';
import { Container, AppText, Button } from '../components';
import { getCategories, deleteCategory, Category, UnleashQuestion } from '../data/categories';
import { useFocusEffect } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryLockStatus } from '../utils/categoryLock';
import { useSound } from '../context/SoundContext';

const { width } = Dimensions.get('window');
const SPACING = 20; // Padding horizontal del container
const GAP = 16; // Espacio entre columnas
const NUM_COLUMNS = 2;
// Ancho total disponible = width - (SPACING * 2) - GAP
const CARD_SIZE = (width - (SPACING * 2) - GAP) / NUM_COLUMNS;

export const CategorySelectionScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
    const { playSound, playHaptic } = useSound();
    const subcategories = route?.params?.subcategories;
    const parentTitle = route?.params?.parentTitle;

    const [categories, setCategories] = React.useState<Category[]>([]);
    const [completedMissions, setCompletedMissions] = React.useState<string[]>([]);

    // Unleash Quiz State
    const [unleashModalVisible, setUnleashModalVisible] = React.useState(false);
    const [currentQuizCategory, setCurrentQuizCategory] = React.useState<Category | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [quizMistakes, setQuizMistakes] = React.useState(0);

    const loadCategoriesAndProgress = async () => {
        if (subcategories) {
            setCategories(subcategories);
        } else {
            const data = await getCategories();
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
                    setCompletedMissions(events.map(e => e.description.replace('MISSION:', '')));
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

    const handleDelete = (category: Category) => {
        Alert.alert(
            t('delete_category'),
            t('delete_confirm', category.title),
            [
                { text: t('cancel'), style: "cancel" },
                {
                    text: t('delete'),
                    style: "destructive",
                    onPress: async () => {
                        await deleteCategory(category.id);
                        loadCategoriesAndProgress();
                    }
                }
            ]
        );
    };

    const isCategoryLocked = (category: Category): boolean =>
        getCategoryLockStatus(category, completedMissions).locked;


    const handleAnswerUnleash = async (selectedIndex: number) => {
        if (!currentQuizCategory || !currentQuizCategory.unleashQuiz) return;
        const q = currentQuizCategory.unleashQuiz[currentQuestionIndex];

        if (selectedIndex === q.correctIndex) {
            if (currentQuestionIndex < currentQuizCategory.unleashQuiz.length - 1) {
                // Next question
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // WON! Unlocked
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const newEvent = `MISSION:UNLEASHED_${currentQuizCategory.id}`;
                    if (user) {
                        await supabase.from('events').insert({
                            user_id: user.id,
                            description: newEvent
                        });
                    }

                    // Update Local State so UI updates instantly
                    setCompletedMissions(prev => [...prev, newEvent.replace('MISSION:', '')]);

                    // Celebrate unlock!
                    playSound('unlock');
                    playHaptic('victory');

                    Alert.alert('✅ ¡Módulo Desbloqueado!', `"${currentQuizCategory.title}" ya está disponible. ¡A jugar!`);
                    setUnleashModalVisible(false);
                } catch (e) {
                    console.error('Error Unleashing:', e);
                    Alert.alert('Error', 'No se pudo guardar el progreso de desbloqueo.');
                }
            }
        } else {
            // WRONG
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

    const renderItem = ({ item }: { item: Category }) => {
        const locked = isCategoryLocked(item);

        return (
            <TouchableOpacity
                style={[styles.card, styles.gridCard, locked && { borderColor: '#333', borderWidth: 1 }]}
                onPress={() => {
                    if (locked) {
                        const lockStatus = getCategoryLockStatus(item, completedMissions);

                        if (lockStatus.reason === 'unstarted') {
                            Alert.alert(
                                'Devocional no iniciado 🔒',
                                `Para hacer el examen y desbloquear este paquete, primero debes iniciar el devocional de la unidad en la sección de "Rutas de Estudio".`
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

                        if (lockStatus.reason === 'quiz' && item.unleashQuiz && item.unleashQuiz.length > 0) {
                            setCurrentQuizCategory(item);
                            setCurrentQuestionIndex(0);
                            setQuizMistakes(0);
                            setUnleashModalVisible(true);
                            return;
                        }
                    }
                    if (item.subcategories && item.subcategories.length > 0) {
                        navigation.push('CategorySelection', { subcategories: item.subcategories, parentTitle: item.title });
                    } else {
                        // Determinar si puede ganar trofeos.
                        // Solo evaluamos los paths que tienen validación nativa `jr-w...-quiz`
                        let userHasCompletedDevotional = true;
                        if (item.id === 'bib_juan2' && !completedMissions.includes('jr-w1-quiz')) userHasCompletedDevotional = false;
                        if (item.id === 'bib_juan3' && !completedMissions.includes('jr-w2-quiz')) userHasCompletedDevotional = false;
                        if (item.id === 'bib_juan4' && !completedMissions.includes('jr-w3-quiz')) userHasCompletedDevotional = false;
                        if (item.id === 'promo_2026') userHasCompletedDevotional = false;
                        if (item.id === 'biblia_basica') userHasCompletedDevotional = false;

                        navigation.navigate('WordPreview', {
                            category: item.title,
                            categoryObj: item,
                            totalPool: item.words,
                            canEarnTrophies: userHasCompletedDevotional
                        });
                    }
                }}
                activeOpacity={locked ? 1 : 0.8}
            >
                {item.image ? (
                    <Image
                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                        style={{ width: CARD_SIZE, height: CARD_SIZE }}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={[styles.minimalistCover, { backgroundColor: locked ? '#111' : (item.color || '#1A1A1A') }]}>
                        <AppText style={[styles.minimalistTitle, locked && { color: '#555' }]}>{item.title.toUpperCase()}</AppText>
                        {item.capitulo && <AppText style={[styles.minimalistSubtitle, locked && { color: '#444' }]}>{item.capitulo}</AppText>}
                    </View>
                )}

                {item.image && (
                    <View style={styles.textOverlay}>
                        <AppText variant="subheader" style={styles.gridTitle} numberOfLines={2}>
                            {item.title}
                        </AppText>
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

    const renderHeader = () => null;

    const renderUnleashModal = () => {
        if (!currentQuizCategory || !currentQuizCategory.unleashQuiz) return null;
        const q = currentQuizCategory.unleashQuiz[currentQuestionIndex];

        return (
            <Modal visible={unleashModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Dark Header */}
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <AppText style={{ color: '#aaa', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>EXAMEN DE DESBLOQUEO</AppText>
                                <AppText variant="subheader" style={{ color: '#fff', fontSize: 17 }}>{currentQuizCategory.title}</AppText>
                            </View>
                            <TouchableOpacity onPress={() => setUnleashModalVisible(false)} style={{ padding: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 }}>
                                <Ionicons name="close" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 20 }}>
                            {/* Progress */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                                <AppText style={{ color: '#aaa', fontSize: 13 }}>Pregunta {currentQuestionIndex + 1} / {currentQuizCategory.unleashQuiz.length}</AppText>
                                <AppText style={{ color: '#e74c3c', fontSize: 13, letterSpacing: 2 }}>{'❤️'.repeat(3 - quizMistakes)}</AppText>
                            </View>

                            {/* Question */}
                            <AppText style={{ color: theme.colors.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 24, lineHeight: 26 }}>
                                {q.q}
                            </AppText>

                            {/* Options */}
                            {q.options.map((opt, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.modalOptionBtn}
                                    onPress={() => handleAnswerUnleash(i)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.modalOptionLetter}>
                                        <AppText style={{ color: '#000', fontWeight: 'bold' }}>{['A', 'B', 'C', 'D'][i]}</AppText>
                                    </View>
                                    <AppText style={{ color: '#e0e0e0', flex: 1, fontSize: 15 }}>{opt}</AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <Container style={styles.innerContainer} noPadding>
                <View style={[styles.headerRow, { paddingHorizontal: 20, paddingTop: 20, justifyContent: 'space-between' }]}>
                    {subcategories ? (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 34 }} />
                    )}
                    <AppText variant="header" style={{ color: theme.colors.primary, textAlign: 'center', flex: 1 }}>
                        {parentTitle || t('choose_theme')}
                    </AppText>
                    <View style={{ width: 34 }} />
                </View>

                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    key={2} // Force re-render if we were switching dynamically
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
                />

                {renderUnleashModal()}
            </Container>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    innerContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    headerRow: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingBottom: 80, // Space for bottom
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 0,
        marginBottom: 16,
        alignItems: 'center',
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden'
    },
    gridCard: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        flexDirection: 'column',
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    // categoryImage is unused now, removed
    icon: {
        fontSize: 32,
        marginRight: 0,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    title: {
        color: '#FFFFFF',
        marginBottom: 4,
    },
    desc: {
        color: '#aaa',
        marginBottom: 0,
    },
    arrow: {
        paddingLeft: 10,
    },
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridTitle: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    createCard: {
        flexDirection: 'row',
        padding: 20,
        borderLeftColor: '#FFF',
        borderLeftWidth: 2,
        borderStyle: 'dashed',
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
    },
    minimalistCover: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#111', // Default dark
    },
    minimalistTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '300', // Light font for elegance
        letterSpacing: 4, // Spacing for "CINEMATIC" look
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light', // Attempt to use a lighter font
        marginBottom: 4,
    },
    minimalistSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    lockOverlayAbsolute: {
        ...StyleSheet.absoluteFillObject as any,
        backgroundColor: 'rgba(5,5,5,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockCircle: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#333',
        justifyContent: 'center', alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#0f0f1a',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    modalHeader: {
        backgroundColor: '#0a0a14',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    },
    modalOptionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 12,
    },
    modalOptionLetter: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: '#D4AF37',
        justifyContent: 'center', alignItems: 'center',
    }
});


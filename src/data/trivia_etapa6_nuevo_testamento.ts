import { TriviaQuestion } from './categories';

/**
 * Etapa 6: Nuevo Testamento (Evangelios e Iglesia Primitiva)
 * Enfoque histórico-geográfico verificado en Nuevo-testamento/*.txt.
 */

export const TRIVIA_ETAPA6_MATEO: TriviaQuestion[] = [
    {
        id: 'e6_mat_1_1',
        difficulty: 1,
        question: '¿En qué ciudad junto al mar, en la región de Zabulón y Neftalí, se estableció Jesús al dejar Nazaret?',
        options: ['Capernaum', 'Caná de Galilea', 'Betsaida', 'Tiberias'],
        correctIndex: 0,
        verseSupport: 'Mateo 4:13',
        explanation: 'Jesús dejó Nazaret y habitó en Capernaum, cumpliendo la profecía de Isaías.'
    },
    {
        id: 'e6_mat_1_2',
        difficulty: 1,
        question: '¿A qué país huyó José de noche con el niño Jesús y su madre para escapar de Herodes?',
        options: ['A Siria', 'A Egipto', 'A Babilonia', 'A Galilea'],
        correctIndex: 1,
        verseSupport: 'Mateo 2:13-14',
        explanation: 'Un ángel avisó a José en sueños que huyera a Egipto hasta la muerte de Herodes.'
    },
    {
        id: 'e6_mat_2_1',
        difficulty: 2,
        question: '¿En qué región preguntó Jesús a sus discípulos quién decían los hombres que era el Hijo del Hombre, donde Pedro confesó que era el Cristo?',
        options: ['Tiberias de Galilea', 'Decápolis oriental', 'Cesarea de Filipo', 'Judea montañosa'],
        correctIndex: 2,
        verseSupport: 'Mateo 16:13-16',
        explanation: 'En la región de Cesarea de Filipo Pedro confesó: "Tú eres el Cristo, el Hijo del Dios viviente".'
    },
    {
        id: 'e6_mat_2_2',
        difficulty: 2,
        question: '¿Qué hombre de Cirene fue obligado por los soldados a cargar la cruz de Jesús camino al Gólgota?',
        options: ['José de Arimatea', 'Lázaro de Betania', 'Nicodemo el maestro', 'Simón'],
        correctIndex: 3,
        verseSupport: 'Mateo 27:32',
        explanation: 'Al salir hallaron a un hombre de Cirene llamado Simón, a quien obligaron a llevar la cruz.'
    },
    {
        id: 'e6_mat_3_1',
        difficulty: 3,
        question: '¿Cómo se llamaba el campo comprado con las treinta piezas de plata de Judas para sepultar a los extranjeros?',
        options: ['Campo de Sangre', 'Campo de la Alfarería', 'Campo de Cedrón', 'Campo de Hinnom'],
        correctIndex: 0,
        verseSupport: 'Mateo 27:7-8',
        explanation: 'Los sacerdotes compraron el campo del alfarero, por lo cual fue llamado Campo de Sangre.'
    },
    {
        id: 'e6_mat_3_2',
        difficulty: 3,
        question: '¿Qué región de diez ciudades al oriente del Jordán dio origen a grandes multitudes que siguieron a Jesús junto con Galilea y Judea?',
        options: ['Capernaum', 'Decápolis', 'Alejandría', 'Traconite'],
        correctIndex: 1,
        verseSupport: 'Mateo 4:25',
        explanation: 'Multitudes de Galilea, Decápolis, Jerusalén, Judea y del otro lado del Jordán seguían a Jesús.'
    },
];

export const TRIVIA_ETAPA6_MARCOS: TriviaQuestion[] = [
    {
        id: 'e6_mar_1_1',
        difficulty: 1,
        question: '¿En qué ciudad entró Jesús en la sinagoga en el día de reposo y reprendió a un espíritu inmundo que atormentaba a un hombre?',
        options: ['En Jerusalén', 'En Nazaret', 'En Capernaum', 'En Belén de Judá'],
        correctIndex: 2,
        verseSupport: 'Marcos 1:21-25',
        explanation: 'En la sinagoga de Capernaum Jesús enseñaba con autoridad y echó fuera al espíritu inmundo.'
    },
    {
        id: 'e6_mar_1_2',
        difficulty: 1,
        question: '¿Cómo bajaron cuatro hombres a un paralítico hasta donde estaba Jesús en una casa llena de gente en Capernaum?',
        options: ['Por la ventana alta', 'Por el patio lateral', 'Por la puerta trasera', 'Por el techo'],
        correctIndex: 3,
        verseSupport: 'Marcos 2:3-4',
        explanation: 'Descubrieron el techo de donde estaba Jesús y bajaron el lecho en que yacía el paralítico.'
    },
    {
        id: 'e6_mar_2_1',
        difficulty: 2,
        question: '¿Cómo respondió el espíritu inmundo de la región de los gadarenos cuando Jesús le preguntó su nombre?',
        options: ['Legión', 'Beelzebú', 'Abadón', 'Asmodeo'],
        correctIndex: 0,
        verseSupport: 'Marcos 5:9',
        explanation: 'Respondió diciendo: "Legión me llamo; porque somos muchos".'
    },
    {
        id: 'e6_mar_2_2',
        difficulty: 2,
        question: '¿Cómo se llamaba el ciego que gritaba junto al camino al salir Jesús de Jericó diciendo: "Jesús, Hijo de David, ten misericordia de mí"?',
        options: ['Zaqueo de Jericó', 'Bartimeo', 'Cleofas de Emaús', 'Jairo el principal'],
        correctIndex: 1,
        verseSupport: 'Marcos 10:46-47',
        explanation: 'Bartimeo hijo de Timeo mendigaba junto al camino de Jericó y recobró la vista por su fe.'
    },
    {
        id: 'e6_mar_3_1',
        difficulty: 3,
        question: '¿Por qué ciudad fenicia pasó Jesús antes de venir por Sidón al mar de Galilea pasando por la región de Decápolis?',
        options: ['Por Antioquía', 'Por Damasco', 'Por Tiro', 'Por Cesarea'],
        correctIndex: 2,
        verseSupport: 'Marcos 7:31',
        explanation: 'Volviendo a salir de la región de Tiro, vino por Sidón al mar de Galilea por Decápolis.'
    },
    {
        id: 'e6_mar_3_2',
        difficulty: 3,
        question: '¿En casa de quién estaba Jesús en Betania cuando una mujer derramó perfume de nardo puro sobre su cabeza?',
        options: ['De Lázaro el resucitado', 'De Nicodemo el fariseo', 'De José de Arimatea', 'De Simón el leproso'],
        correctIndex: 3,
        verseSupport: 'Marcos 14:3',
        explanation: 'Estando en Betania en casa de Simón el leproso, una mujer rompió el vaso de alabastro.'
    },
];

export const TRIVIA_ETAPA6_LUCAS: TriviaQuestion[] = [
    {
        id: 'e6_luc_1_1',
        difficulty: 1,
        question: '¿En qué ciudad de Galilea vivían José y María antes de subir a Belén para ser empadronados?',
        options: ['Nazaret', 'Capernaum', 'Jerusalén', 'Jericó'],
        correctIndex: 0,
        verseSupport: 'Lucas 2:4',
        explanation: 'José subió de Galilea, de la ciudad de Nazaret, a Judea, a la ciudad de David llamada Belén.'
    },
    {
        id: 'e6_luc_1_2',
        difficulty: 1,
        question: '¿Qué publicano de baja estatura subió a un árbol sicómoro en Jericó para poder ver a Jesús?',
        options: ['Mateo Leví', 'Zaqueo', 'Bartimeo', 'Cornelio'],
        correctIndex: 1,
        verseSupport: 'Lucas 19:1-4',
        explanation: 'Zaqueo, jefe de los publicanos y rico, corrió delante y subió a un sicómoro para ver a Jesús.'
    },
    {
        id: 'e6_luc_2_1',
        difficulty: 2,
        question: '¿A qué ciudad se acercaba Jesús cuando resucitó al hijo único de una viuda que llevaban a enterrar?',
        options: ['A Betania', 'A Capernaum', 'A Naín', 'A Samaria'],
        correctIndex: 2,
        verseSupport: 'Lucas 7:11-15',
        explanation: 'Al llegar cerca de la puerta de la ciudad de Naín, Jesús tocó el féretro y levantó al joven.'
    },
    {
        id: 'e6_luc_2_2',
        difficulty: 2,
        question: '¿Hacia qué aldea, situada a sesenta estadios de Jerusalén, caminaban dos discípulos el día de la resurrección?',
        options: ['Hacia Betania', 'Hacia Betfagé', 'Hacia Belén', 'Hacia Emaús'],
        correctIndex: 3,
        verseSupport: 'Lucas 24:13',
        explanation: 'Jesús mismo se acercó y caminó con ellos rumbo a Emaús explicándoles las Escrituras.'
    },
    {
        id: 'e6_luc_3_1',
        difficulty: 3,
        question: '¿Quién era gobernador de Siria cuando se hizo el primer censo ordenado por Augusto César?',
        options: ['Cirenio', 'Poncio Pilato', 'Félix Antonio', 'Gayo Galión'],
        correctIndex: 0,
        verseSupport: 'Lucas 2:1-2',
        explanation: 'Este primer censo se hizo siendo Cirenio gobernador de Siria.'
    },
    {
        id: 'e6_luc_3_2',
        difficulty: 3,
        question: 'De los diez leprosos que Jesús sanó entre Samaria y Galilea, ¿de qué origen era el único que volvió a dar gloria a Dios?',
        options: ['Galileo', 'Samaritano', 'Alejandrino', 'Fenicio'],
        correctIndex: 1,
        verseSupport: 'Lucas 17:11-16',
        explanation: 'Solo uno volvió alabando a Dios a gran voz y se postró a los pies de Jesús: era samaritano.'
    },
];

export const TRIVIA_ETAPA6_JUAN: TriviaQuestion[] = [
    {
        id: 'e6_jua_1_1',
        difficulty: 1,
        question: '¿En qué población de Galilea realizó Jesús su primera señal convirtiendo el agua en vino durante unas bodas?',
        options: ['En Capernaum', 'En Betsaida', 'En Caná', 'En Tiberias'],
        correctIndex: 2,
        verseSupport: 'Juan 2:1-11',
        explanation: 'Este principio de señales hizo Jesús en Caná de Galilea, y sus discípulos creyeron en él.'
    },
    {
        id: 'e6_jua_1_2',
        difficulty: 1,
        question: '¿Qué ciudad de Samaria visitó Jesús, donde habló con la mujer samaritana junto al pozo de Jacob?',
        options: ['Capernaum', 'Jerusalén', 'Betsaida', 'Sicar'],
        correctIndex: 3,
        verseSupport: 'Juan 4:5-7',
        explanation: 'Vino a una ciudad de Samaria llamada Sicar, junto a la heredad que Jacob dio a su hijo José.'
    },
    {
        id: 'e6_jua_2_1',
        difficulty: 2,
        question: '¿Qué estanque de Jerusalén, que tenía cinco pórticos, fue escenario de la sanidad del paralítico que llevaba treinta y ocho años enfermo?',
        options: ['Betesda', 'En-rogel', 'Jerusalén', 'Cedrón'],
        correctIndex: 0,
        verseSupport: 'Juan 5:2-5',
        explanation: 'Junto a la puerta de las ovejas había un estanque llamado en hebreo Betesda.'
    },
    {
        id: 'e6_jua_2_2',
        difficulty: 2,
        question: '¿A qué estanque envió Jesús al ciego de nacimiento a lavarse después de untarle lodo en los ojos?',
        options: ['Al de Betesda', 'Al de Siloé', 'Al de Gihón', 'Al de En-rogel'],
        correctIndex: 1,
        verseSupport: 'Juan 9:7',
        explanation: 'Le dijo: "Ve a lavarte en el estanque de Siloé" (que traducido es, Enviado).'
    },
    {
        id: 'e6_jua_3_1',
        difficulty: 3,
        question: '¿De qué ciudad de Galilea eran originarios Felipe, Andrés y Pedro según el evangelio de Juan?',
        options: ['De Capernaum', 'De Tiberias', 'De Betsaida', 'De Corazín'],
        correctIndex: 2,
        verseSupport: 'Juan 1:44',
        explanation: 'Felipe era de Betsaida, la ciudad de Andrés y Pedro.'
    },
    {
        id: 'e6_jua_3_2',
        difficulty: 3,
        question: '¿Qué fiesta judía se celebraba en Jerusalén en tiempo de invierno cuando Jesús paseaba por el pórtico de Salomón?',
        options: ['Los Tabernáculos', 'El Pentecostés', 'La Pascua anual', 'La Dedicación'],
        correctIndex: 3,
        verseSupport: 'Juan 10:22-23',
        explanation: 'Se celebraba en Jerusalén la fiesta de la Dedicación y era invierno.'
    },
];

export const TRIVIA_ETAPA6_IGLESIA_PRIMITIVA: TriviaQuestion[] = [
    {
        id: 'e6_igl_1_1',
        difficulty: 1,
        question: '¿En qué ciudad fueron llamados cristianos los discípulos por primera vez tras la predicación de Bernabé y Saulo?',
        options: ['Antioquía', 'Jerusalén', 'Tesalónica', 'Cesarea'],
        correctIndex: 0,
        verseSupport: 'Hechos 11:25-26',
        explanation: 'Bernabé trajo a Saulo de Tarso a Antioquía y allí se les llamó cristianos por primera vez.'
    },
    {
        id: 'e6_igl_1_2',
        difficulty: 1,
        question: '¿Hacia qué ciudad viajaba Saulo cuando una luz del cielo lo rodeó y oyó la voz del Señor?',
        options: ['Hacia Antioquía', 'Hacia Damasco', 'Hacia Jerusalén', 'Hacia Cesarea'],
        correctIndex: 1,
        verseSupport: 'Hechos 9:3-4',
        explanation: 'Al acercarse a Damasco, Saulo cayó en tierra al resplandor de una luz del cielo.'
    },
    {
        id: 'e6_igl_2_1',
        difficulty: 2,
        question: '¿Qué ciudad de Macedonia fue la primera donde Pablo predicó en Europa y bautizó a Lidia, vendedora de púrpura?',
        options: ['Tesalónica', 'Corinto', 'Filipos', 'Antioquía'],
        correctIndex: 2,
        verseSupport: 'Hechos 16:12-15',
        explanation: 'Pablo llegó a Filipos, primera ciudad de la provincia de Macedonia, donde Lidia abrió su corazón.'
    },
    {
        id: 'e6_igl_2_2',
        difficulty: 2,
        question: '¿Por qué elogiaban a los judíos de Berea comparados con los de Tesalónica?',
        options: ['Por su hospitalidad diaria', 'Por sus ofrendas generosas', 'Por su canto en la sinagoga', 'Por estudiar la Escritura'],
        correctIndex: 3,
        verseSupport: 'Hechos 17:11',
        explanation: 'Recibieron la palabra con toda solicitud, escudriñando cada día las Escrituras.'
    },
    {
        id: 'e6_igl_3_1',
        difficulty: 3,
        question: '¿En qué colina o consejo de Atenas pronunció Pablo su discurso sobre el "Dios no conocido"?',
        options: ['Areópago', 'Acrópolis', 'Anfipolis', 'Corinto'],
        correctIndex: 0,
        verseSupport: 'Hechos 17:22-23',
        explanation: 'Pablo, puesto en pie en medio del Areópago, anunció al Dios que los atenienses adoraban sin conocerlo.'
    },
    {
        id: 'e6_igl_3_2',
        difficulty: 3,
        question: '¿En qué isla del mar Egeo estuvo desterrado el apóstol Juan por causa de la palabra de Dios y el testimonio de Jesús?',
        options: ['En Chipre', 'En Patmos', 'En Creta', 'En Samotracia'],
        correctIndex: 1,
        verseSupport: 'Apocalipsis 1:9',
        explanation: 'Juan estaba en la isla llamada Patmos cuando recibió la revelación del Apocalipsis.'
    },
];

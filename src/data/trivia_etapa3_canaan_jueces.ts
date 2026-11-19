import { TriviaQuestion } from './categories';

export const TRIVIA_ETAPA3_CANAAN: TriviaQuestion[] = [
    // Nivel 1 (Semilla)
    {
        id: 'e3_can_1_1',
        difficulty: 1,
        question: '¿Quién ocultó en el terrado de su casa a los dos espías enviados por Josué a Jericó?',
        options: ['Débora', 'Rahab', 'Jael', 'Abigail'],
        correctIndex: 1,
        verseSupport: 'Josué 2:4-6',
        explanation: 'Rahab escondió a los mensajeros entre manojos de lino en el terrado de su casa.'
    },
    {
        id: 'e3_can_1_2',
        difficulty: 1,
        question: '¿Qué llevaron los sacerdotes delante del pueblo al cruzar el río Jordán en seco?',
        options: ['Las tablas de bronce', 'Las siete trompetas', 'El arca del pacto', 'La vara de Moisés'],
        correctIndex: 2,
        verseSupport: 'Josué 3:14-17',
        explanation: 'Cuando los pies de los sacerdotes que llevaban el arca tocaron el Jordán, las aguas se detuvieron.'
    },
    {
        id: 'e3_can_1_3',
        difficulty: 1,
        question: '¿Cuántos días rodearon los israelitas la ciudad de Jericó antes de que cayeran sus muros?',
        options: ['Tres días', 'Cinco días', 'Doce días', 'Siete días'],
        correctIndex: 3,
        verseSupport: 'Josué 6:15-20',
        explanation: 'Durante seis días dieron una vuelta diaria, y al séptimo día dieron siete vueltas.'
    },
    // Nivel 2 (Discípulo)
    {
        id: 'e3_can_2_1',
        difficulty: 2,
        question: '¿En qué ciudad se reunió toda la congregación para levantar el tabernáculo en Canaán?',
        options: ['En Silo', 'En Gilgal', 'En Bet-el', 'En Hebrón'],
        correctIndex: 0,
        verseSupport: 'Josué 18:1',
        explanation: 'Toda la congregación de Israel se reunió en Silo y erigió allí el tabernáculo de reunión.'
    },
    {
        id: 'e3_can_2_2',
        difficulty: 2,
        question: '¿Qué ciudad fue la primera en celebrar la Pascua en Canaán, donde levantaron las doce piedras?',
        options: ['Jericó', 'Gilgal', 'Siquem', 'Gabaón'],
        correctIndex: 1,
        verseSupport: 'Josué 5:10',
        explanation: 'Los hijos de Israel acamparon en Gilgal y celebraron la Pascua en los llanos de Jericó.'
    },
    {
        id: 'e3_can_2_3',
        difficulty: 2,
        question: '¿Qué ciudades servían en Canaán para proteger al que mataba a alguien sin intención?',
        options: ['Ciudades reales de Judá', 'Ciudades amuralladas', 'Ciudades de refugio', 'Ciudades sacerdotales'],
        correctIndex: 2,
        verseSupport: 'Josué 20:2-6',
        explanation: 'Se señalaron seis ciudades de refugio para proteger al homicida involuntario hasta su juicio.'
    },
    {
        id: 'e3_can_2_4',
        difficulty: 2,
        question: '¿Qué hombre de Judá provocó la derrota en Hai al tomar oro y un manto del anatema de Jericó?',
        options: ['Otoniel', 'Caleb', 'Finees', 'Acán'],
        correctIndex: 3,
        verseSupport: 'Josué 7:20-21',
        explanation: 'Acán confesó haber escondido un manto babilónico, doscientos siclos de plata y un lingote de oro.'
    },
    // Nivel 3 (Maestro)
    {
        id: 'e3_can_3_1',
        difficulty: 3,
        question: '¿En qué valle fue apedreado Acán junto con sus bienes tras la derrota en Hai?',
        options: ['Valle de Acor', 'Valle de Elah', 'Valle de Cedrón', 'Valle de Jezreel'],
        correctIndex: 0,
        verseSupport: 'Josué 7:24-26',
        explanation: 'Por el trastorno causado a Israel, aquel lugar fue llamado valle de Acor.'
    },
    {
        id: 'e3_can_3_2',
        difficulty: 3,
        question: '¿Junto a qué aguas del norte venció Josué a Jabín rey de Hazor y a la coalición cananea?',
        options: ['Aguas de Siloé', 'Aguas de Merom', 'Aguas de Mara', 'Aguas de En-gadi'],
        correctIndex: 1,
        verseSupport: 'Josué 11:5-7',
        explanation: 'Los reyes acamparon junto a las aguas de Merom, donde Josué cayó sobre ellos de repente.'
    },
    {
        id: 'e3_can_3_3',
        difficulty: 3,
        question: '¿Qué ciudad recibió Josué como heredad propia en el monte de Efraín al terminar el reparto?',
        options: ['Quiriat-arba', 'Bet-horón', 'Timnat-sera', 'Quiriat-jearim'],
        correctIndex: 2,
        verseSupport: 'Josué 19:50',
        explanation: 'Por palabra del Señor le dieron la ciudad que pidió: Timnat-sera, en el monte de Efraín.'
    },
];

export const TRIVIA_ETAPA3_JUECES: TriviaQuestion[] = [
    // Nivel 1 (Semilla)
    {
        id: 'e3_jue_1_1',
        difficulty: 1,
        question: '¿Bajo qué árbol juzgaba Débora a Israel en la región montañosa de Efraín?',
        options: ['Bajo un olivo', 'Bajo un cedro', 'Bajo una higuera', 'Bajo una palmera'],
        correctIndex: 3,
        verseSupport: 'Jueces 4:5',
        explanation: 'Débora se sentaba bajo la palmera de Débora entre Ramá y Bet-el.'
    },
    {
        id: 'e3_jue_1_2',
        difficulty: 1,
        question: '¿Qué pidió Gedeón a Dios en su primera prueba con el vellón de lana sobre la era?',
        options: ['Rocío en el vellón', 'Fuego en la piedra', 'Lluvia en el monte', 'Viento del oriente'],
        correctIndex: 0,
        verseSupport: 'Jueces 6:37-38',
        explanation: 'La primera noche el vellón quedó empapado de rocío mientras toda la tierra estaba seca.'
    },
    {
        id: 'e3_jue_1_3',
        difficulty: 1,
        question: '¿De qué país era originaria Rut antes de acompañar a su suegra Noemí hacia Belén?',
        options: ['De Egipto', 'De Moab', 'De Siria', 'De Filistea'],
        correctIndex: 1,
        verseSupport: 'Rut 1:4-6',
        explanation: 'Rut era moabita y decidió seguir a Noemí y al Dios de Israel hasta Belén.'
    },
    // Nivel 2 (Discípulo)
    {
        id: 'e3_jue_2_1',
        difficulty: 2,
        question: '¿De qué aldea de la tribu de Manasés era originario Gedeón, donde edificó un altar al Señor?',
        options: ['De Silo', 'De Mizpa', 'De Ofra', 'De Ramá'],
        correctIndex: 2,
        verseSupport: 'Jueces 6:11-24',
        explanation: 'Gedeón edificó un altar en Ofra y lo llamó Jehová-salom («El Señor es paz»).'
    },
    {
        id: 'e3_jue_2_2',
        difficulty: 2,
        question: '¿Junto a qué fuente acampó Gedeón cuando Dios redujo su ejército a trescientos hombres?',
        options: ['Fuente de Siloé', 'Fuente de Gihón', 'Fuente de En-gadi', 'Fuente de Harod'],
        correctIndex: 3,
        verseSupport: 'Jueces 7:1-7',
        explanation: 'Acamparon junto a la fuente de Harod frente al campamento de Madián en el valle.'
    },
    {
        id: 'e3_jue_2_3',
        difficulty: 2,
        question: '¿Qué ciudad gobernó Jefté tras ser llamado por los ancianos de Galaad para enfrentar a Amón?',
        options: ['Mizpa', 'Hebrón', 'Betel', 'Jericó'],
        correctIndex: 0,
        verseSupport: 'Jueces 11:11',
        explanation: 'Jefté habló todas sus palabras delante del Señor en Mizpa de Galaad.'
    },
    {
        id: 'e3_jue_2_4',
        difficulty: 2,
        question: '¿Cómo se llamaba el esposo de Noemí que emigró de Belén de Judá hacia Moab por el hambre?',
        options: ['Obed-edom', 'Elimelec', 'Mahlón', 'Salmón'],
        correctIndex: 1,
        verseSupport: 'Rut 1:1-2',
        explanation: 'Elimelec emigró con su mujer Noemí y sus hijos Mahlón y Quelión a los campos de Moab.'
    },
    // Nivel 3 (Maestro)
    {
        id: 'e3_jue_3_1',
        difficulty: 3,
        question: '¿En qué valle entre Siquem y Bet-el fueron derrotados los carros de hierro de Sísara?',
        options: ['Torrente de Besor', 'Torrente de Arnón', 'Torrente de Cisón', 'Torrente de Cedrón'],
        correctIndex: 2,
        verseSupport: 'Jueces 4:7-13',
        explanation: 'Dios atrajo a Sísara con sus novecientos carros de hierro al arroyo de Cisón.'
    },
    {
        id: 'e3_jue_3_2',
        difficulty: 3,
        question: '¿Sobre qué monte pronunció Jotam la parábola de los árboles para denunciar a Abimelec?',
        options: ['Monte Ebal', 'Monte Tabor', 'Monte Carmelo', 'Monte Gerizim'],
        correctIndex: 3,
        verseSupport: 'Jueces 9:7',
        explanation: 'Jotam se puso en la cumbre del monte Gerizim y alzó su voz contra los de Siquem.'
    },
    {
        id: 'e3_jue_3_3',
        difficulty: 3,
        question: '¿En qué valle habitaba Dalila, la mujer de quien se enamoró Sansón?',
        options: ['Valle de Sorec', 'Valle de Ajalón', 'Valle de Escol', 'Valle de Sidim'],
        correctIndex: 0,
        verseSupport: 'Jueces 16:4',
        explanation: 'Después de esto se enamoró de una mujer en el valle de Sorec, llamada Dalila.'
    },
];

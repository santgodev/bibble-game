import { TriviaQuestion } from './categories';

/**
 * Etapa 5: Exilio y Retorno (Jeremías, Lamentaciones, Ezequiel, Daniel, Esdras, Nehemías, Ester, Hageo, Zacarías)
 * Enfoque histórico-geográfico verificado en Antiguo-testamento/*.txt.
 */

export const TRIVIA_ETAPA5_EXILIO: TriviaQuestion[] = [
    {
        id: 'e5_exi_1_1',
        difficulty: 1,
        question: '¿En qué campo o llanura de la provincia de Babilonia levantó Nabucodonosor la estatua de oro de sesenta codos?',
        options: ['Campo de Dura', 'Valle de Sinar', 'Monte de Elam', 'Campo de Ur'],
        correctIndex: 0,
        verseSupport: 'Daniel 3:1',
        explanation: 'Sadrac, Mesac y Abed-nego se negaron a postrarse ante la estatua en el campo de Dura.'
    },
    {
        id: 'e5_exi_1_2',
        difficulty: 1,
        question: '¿Junto a qué río de los caldeos estaba Ezequiel entre los cautivos cuando recibió su primera visión de la gloria de Dios?',
        options: ['Río Éufrates', 'Río Quebar', 'Río Tigris', 'Río Ahava'],
        correctIndex: 1,
        verseSupport: 'Ezequiel 1:1-3',
        explanation: 'Ezequiel recibió la visión de los cuatro seres vivientes junto al río Quebar.'
    },
    {
        id: 'e5_exi_2_1',
        difficulty: 2,
        question: '¿En qué ciudad capital de la provincia de Elam se encontraba Daniel en visión junto al río Ulai?',
        options: ['En Nínive', 'En Babilonia', 'En Susa', 'En Persépolis'],
        correctIndex: 2,
        verseSupport: 'Daniel 8:2',
        explanation: 'Daniel tuvo la visión del carnero y el macho cabrío en Susa, junto al río Ulai.'
    },
    {
        id: 'e5_exi_2_2',
        difficulty: 2,
        question: '¿Qué nombre babilónico recibió Daniel cuando fue puesto al servicio del palacio real?',
        options: ['Azarías-el', 'Abed-nego', 'Nabuzaradán', 'Beltsasar'],
        correctIndex: 3,
        verseSupport: 'Daniel 1:7',
        explanation: 'El jefe de los eunucos puso a Daniel por nombre Beltsasar en la corte de Babilonia.'
    },
    {
        id: 'e5_exi_3_1',
        difficulty: 3,
        question: '¿Qué lugar específico entre los cautivos junto al río Quebar visitó Ezequiel, donde permaneció atónito siete días?',
        options: ['Tel-abib', 'Carquemis', 'Babilonia', 'Persépolis'],
        correctIndex: 0,
        verseSupport: 'Ezequiel 3:15',
        explanation: 'Ezequiel se sentó siete días entre los desterrados en Tel-abib antes de recibir el encargo de atalaya.'
    },
    {
        id: 'e5_exi_3_2',
        difficulty: 3,
        question: '¿A qué ciudad en tierra de Hamat llevaron preso al rey Sedequías ante Nabucodonosor tras la caída de Jerusalén?',
        options: ['A Carquemis', 'A Ribla', 'A Damasco', 'A Nínive'],
        correctIndex: 1,
        verseSupport: 'Jeremías 39:5-6',
        explanation: 'Alcanzaron a Sedequías en los llanos de Jericó y lo llevaron a Ribla ante el rey de Babilonia.'
    },
];

export const TRIVIA_ETAPA5_RETORNO: TriviaQuestion[] = [
    {
        id: 'e5_ret_1_1',
        difficulty: 1,
        question: '¿Qué rey de Persia emitió el decreto en su primer año permitiendo a los judíos volver a Jerusalén para edificar el templo?',
        options: ['Artajerjes', 'Nabucodonosor', 'Ciro', 'Asuero'],
        correctIndex: 2,
        verseSupport: 'Esdras 1:1-2',
        explanation: 'Dios despertó el espíritu de Ciro rey de Persia para proclamar el regreso y la reconstrucción del templo.'
    },
    {
        id: 'e5_ret_1_2',
        difficulty: 1,
        question: '¿En cuántos días quedó terminado el muro de Jerusalén bajo el liderazgo de Nehemías?',
        options: ['Ciento veinte días', 'Cuarenta y cinco días', 'Setenta y tres días', 'Cincuenta y dos días'],
        correctIndex: 3,
        verseSupport: 'Nehemías 6:15',
        explanation: 'El muro fue terminado el veinticinco del mes de Elul, en cincuenta y dos días.'
    },
    {
        id: 'e5_ret_2_1',
        difficulty: 2,
        question: '¿Junto a qué río reunió Esdras a los exiliados durante tres días y proclamó ayuno antes de partir hacia Jerusalén?',
        options: ['Río Ahava', 'Río Quebar', 'Río Éufrates', 'Río Tigris'],
        correctIndex: 0,
        verseSupport: 'Esdras 8:15-21',
        explanation: 'Esdras proclamó ayuno junto al río Ahava para pedir a Dios un camino seguro sin escolta militar.'
    },
    {
        id: 'e5_ret_2_2',
        difficulty: 2,
        question: '¿Qué dos profetas animaron a Zorobabel y a los ancianos de los judíos para reanudar y prosperar en la obra del templo?',
        options: ['Jeremías y Daniel', 'Hageo y Zacarías', 'Ezequiel y Malaquías', 'Isaías y Sofonías'],
        correctIndex: 1,
        verseSupport: 'Esdras 5:1-2; 6:14',
        explanation: 'La predicación de Hageo y Zacarías impulsó a Zorobabel y a Jesúa a terminar la casa de Dios.'
    },
    {
        id: 'e5_ret_3_1',
        difficulty: 3,
        question: '¿Qué puerta de la muralla de Jerusalén fue la primera en ser reedificada y santificada por el sumo sacerdote Eliasib y los sacerdotes?',
        options: ['Puerta del Pescado', 'Puerta de las Aguas', 'Puerta de las Ovejas', 'Puerta de los Caballos'],
        correctIndex: 2,
        verseSupport: 'Nehemías 3:1',
        explanation: 'Eliasib y los sacerdotes levantaron y consagraron la Puerta de las Ovejas hasta la torre de Mea.'
    },
    {
        id: 'e5_ret_3_2',
        difficulty: 3,
        question: '¿Qué fiesta judía fue instituida en tiempos de Ester y Mardoqueo para conmemorar la liberación del pueblo en el imperio persa?',
        options: ['Tabernáculos', 'Pentecostés', 'Dedicación', 'Purim'],
        correctIndex: 3,
        verseSupport: 'Ester 9:26-28',
        explanation: 'Llamaron a aquellos días Purim, por el nombre de Pur, la suerte echada por Amán.'
    },
];

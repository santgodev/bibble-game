import { TriviaQuestion } from './categories';

export const TRIVIA_ETAPA1_ORIGENES: TriviaQuestion[] = [
    // Nivel 1 (Semilla)
    {
        id: 'e1_org_1_1',
        difficulty: 1,
        question: '¿Qué separó Dios en el primer día de la creación después de decir «Sea la luz»?',
        options: ['El mar de la tierra seca', 'La luz de las tinieblas', 'El sol de la luna llena', 'Las aves de los peces'],
        correctIndex: 1,
        verseSupport: 'Génesis 1:3-5',
        explanation: 'Dios llamó a la luz Día y a las tinieblas Noche en el primer día.'
    },
    {
        id: 'e1_org_1_2',
        difficulty: 1,
        question: '¿De qué formó Dios a la mujer después de hacer caer sueño profundo sobre Adán?',
        options: ['Del polvo del campo', 'De una rama de olivo', 'De una costilla suya', 'De agua del manantial'],
        correctIndex: 2,
        verseSupport: 'Génesis 2:21-22',
        explanation: 'De la costilla que tomó del hombre hizo una mujer y la trajo a Adán.'
    },
    {
        id: 'e1_org_1_3',
        difficulty: 1,
        question: '¿Qué ofrenda presentó Abel delante del Señor que fue mirada con agrado?',
        options: ['Frutos de la vid y olivas', 'Grano de trigo y cebada', 'Incienso y mirra aromática', 'Primogénitos de sus ovejas'],
        correctIndex: 3,
        verseSupport: 'Génesis 4:4',
        explanation: 'Abel era pastor de ovejas y trajo lo mejor de los primogénitos de su rebaño.'
    },
    {
        id: 'e1_org_1_4',
        difficulty: 1,
        question: '¿Qué tres hijos de Noé entraron con él en el arca junto con sus esposas?',
        options: ['Sem, Cam y Jafet', 'Caín, Abel y Set', 'Abram, Nacor y Harán', 'Rubén, Simeón y Leví'],
        correctIndex: 0,
        verseSupport: 'Génesis 7:13',
        explanation: 'En total entraron ocho personas al arca: Noé, su esposa, sus tres hijos y sus nueras.'
    },
    {
        id: 'e1_org_1_5',
        difficulty: 1,
        question: '¿Por qué confundió Dios el lenguaje de toda la tierra en Babel?',
        options: ['Para que aprendieran nuevos idiomas', 'Para dispersarlos por toda la tierra', 'Para que construyeran un templo nuevo', 'Para cambiar el curso del gran río'],
        correctIndex: 1,
        verseSupport: 'Génesis 11:7-9',
        explanation: 'Al confundir su lengua dejaron de edificar la ciudad y se esparcieron por toda la tierra.'
    },

    // Nivel 2 (Discípulo)
    {
        id: 'e1_org_2_1',
        difficulty: 2,
        question: '¿En qué día creó Dios el sol, la luna y las estrellas para señalar estaciones, días y años?',
        options: ['En el segundo día', 'En el tercer día', 'En el cuarto día', 'En el quinto día'],
        correctIndex: 2,
        verseSupport: 'Génesis 1:14-19',
        explanation: 'Dios puso las lumbreras en la expansión de los cielos en el cuarto día.'
    },
    {
        id: 'e1_org_2_2',
        difficulty: 2,
        question: '¿Hacia qué región al oriente del Edén salió Caín desterrado tras matar a su hermano?',
        options: ['Tierra de Sinar', 'Tierra de Gosén', 'Tierra de Madián', 'Tierra de Nod'],
        correctIndex: 3,
        verseSupport: 'Génesis 4:16',
        explanation: 'Salió Caín de delante del Señor y habitó en tierra de Nod, al oriente del Edén.'
    },
    {
        id: 'e1_org_2_3',
        difficulty: 2,
        question: '¿Qué edad tenía Noé cuando comenzó el diluvio de aguas sobre la tierra?',
        options: ['Seiscientos años', 'Quinientos años', 'Setecientos años', 'Cuatrocientos años'],
        correctIndex: 0,
        verseSupport: 'Génesis 7:6',
        explanation: 'Era Noé de seiscientos años cuando las aguas del diluvio vinieron sobre la tierra.'
    },
    {
        id: 'e1_org_2_4',
        difficulty: 2,
        question: '¿Qué fue lo primero que hizo Noé al salir del arca cuando se secó la tierra?',
        options: ['Plantó un huerto de olivos', 'Edificó un altar al Señor', 'Construyó una casa nueva', 'Cavó un pozo en el valle'],
        correctIndex: 1,
        verseSupport: 'Génesis 8:20',
        explanation: 'Noé edificó un altar y ofreció de todo animal limpio y de toda ave limpia en holocausto.'
    },
    {
        id: 'e1_org_2_5',
        difficulty: 2,
        question: '¿Qué dos árboles especiales menciona Génesis 2 en medio del huerto de Edén?',
        options: ['El olivo verde y la higuera seca', 'El cedro del Líbano y la palmera', 'Árbol de la vida y del bien y mal', 'El almendro blanco y la vid dulce'],
        correctIndex: 2,
        verseSupport: 'Génesis 2:9',
        explanation: 'Dios mandó al hombre que podía comer de todo árbol del huerto, excepto del árbol de la ciencia del bien y del mal.'
    },

    // Nivel 3 (Maestro)
    {
        id: 'e1_org_3_1',
        difficulty: 3,
        question: '¿Qué puso Dios al oriente del huerto de Edén para guardar el camino del árbol de la vida?',
        options: ['Dos leones y una muralla alta', 'Una columna de fuego y humo denso', 'Un río caudaloso y rocas altas', 'Querubines y espada encendida'],
        correctIndex: 3,
        verseSupport: 'Génesis 3:24',
        explanation: 'Los puso Dios al oriente del Edén para guardar el camino del árbol de la vida.'
    },
    {
        id: 'e1_org_3_2',
        difficulty: 3,
        question: '¿Qué nombre puso Caín a la primera ciudad que edificó, según Génesis 4:17?',
        options: ['Enoc', 'Babel', 'Nínive', 'Sinar'],
        correctIndex: 0,
        verseSupport: 'Génesis 4:17',
        explanation: 'Caín edificó una ciudad y la llamó del nombre de su hijo, Enoc.'
    },
    {
        id: 'e1_org_3_3',
        difficulty: 3,
        question: '¿Cuántos codos subieron las aguas del diluvio por encima de los montes más altos?',
        options: ['Treinta codos', 'Quince codos', 'Cincuenta codos', 'Siete codos'],
        correctIndex: 1,
        verseSupport: 'Génesis 7:20',
        explanation: 'Quince codos más alto subieron las aguas después que fueron cubiertos los montes.'
    },
    {
        id: 'e1_org_3_4',
        difficulty: 3,
        question: '¿Qué brazo del río del Edén rodeaba toda la tierra de Cus según Génesis 2:13?',
        options: ['El río Pisón', 'El río Hidekel', 'El río Gihón', 'El río Éufrates'],
        correctIndex: 2,
        verseSupport: 'Génesis 2:13',
        explanation: 'El segundo río se llamaba Gihón y rodeaba toda la tierra de Cus.'
    },
    {
        id: 'e1_org_3_5',
        difficulty: 3,
        question: '¿Cuántos días esperó Noé entre el primer envío de la paloma y la segunda vez que la soltó?',
        options: ['Tres días', 'Catorce días', 'Cuarenta días', 'Siete días'],
        correctIndex: 3,
        verseSupport: 'Génesis 8:10',
        explanation: 'Esperó aún otros siete días y volvió a enviar la paloma, que regresó con la hoja de olivo.'
    },
];

export const TRIVIA_ETAPA1_PATRIARCAS: TriviaQuestion[] = [
    // Nivel 1 (Semilla)
    {
        id: 'e1_pat_1_1',
        difficulty: 1,
        question: '¿Qué edad tenía Abram cuando salió de Harán hacia la tierra de Canaán?',
        options: ['75 años', '50 años', '99 años', '100 años'],
        correctIndex: 0,
        verseSupport: 'Génesis 12:4',
        explanation: 'Abram partió conforme al llamado del Señor a los setenta y cinco años.'
    },
    {
        id: 'e1_pat_1_2',
        difficulty: 1,
        question: '¿Qué ciudad pequeña pidió Lot que le dejaran salvar para refugiarse cuando huyó de Sodoma?',
        options: ['Bet-el', 'Zoar', 'Hebrón', 'Gaza'],
        correctIndex: 1,
        verseSupport: 'Génesis 19:20-23',
        explanation: 'Lot pidió huir a aquella ciudad pequeña y por eso fue llamada Zoar.'
    },
    {
        id: 'e1_pat_1_3',
        difficulty: 1,
        question: '¿En qué lugar descansó Jacob con una piedra por cabecera y soñó la escalera al cielo?',
        options: ['Beerseba', 'Siquem', 'Bet-el', 'Hebrón'],
        correctIndex: 2,
        verseSupport: 'Génesis 28:11-19',
        explanation: 'Jacob llamó a aquel lugar Bet-el («Casa de Dios»), aunque antes se llamaba Luz.'
    },
    {
        id: 'e1_pat_1_4',
        difficulty: 1,
        question: '¿En qué lugar echaron sus hermanos a José en una cisterna antes de venderlo?',
        options: ['En Mamre', 'En Beerseba', 'En Gosén', 'En Dotán'],
        correctIndex: 3,
        verseSupport: 'Génesis 37:17-24',
        explanation: 'José fue tras sus hermanos hasta Dotán, donde lo despojaron de su túnica y lo echaron en una cisterna vacía.'
    },
    {
        id: 'e1_pat_1_5',
        difficulty: 1,
        question: '¿En qué fértil región de Egipto permitió Faraón que se asentara Jacob con toda su familia?',
        options: ['En Gosén', 'En Ur', 'En Sinaí', 'En Hebrón'],
        correctIndex: 0,
        verseSupport: 'Génesis 47:5-6',
        explanation: 'Faraón ofreció lo mejor de la tierra de Egipto, en Gosén, para que pastorearan sus rebaños.'
    },

    // Nivel 2 (Discípulo)
    {
        id: 'e1_pat_2_1',
        difficulty: 2,
        question: '¿Cuál fue el primer lugar en Canaán donde el Señor se apareció a Abram y este edificó un altar?',
        options: ['Jericó y el Jordán', 'Siquem y More', 'Beerseba y Gerar', 'Gaza y Hebrón'],
        correctIndex: 1,
        verseSupport: 'Génesis 12:6-7',
        explanation: 'Abram atravesó la tierra hasta Siquem y allí edificó altar al Señor que se le había aparecido.'
    },
    {
        id: 'e1_pat_2_2',
        difficulty: 2,
        question: '¿Junto a qué encinar en Hebrón habitó Abraham cuando recibió la visita de los tres varones?',
        options: ['El encinar de More', 'El bosque de Efraín', 'El encinar de Mamre', 'El valle de Escol'],
        correctIndex: 2,
        verseSupport: 'Génesis 18:1',
        explanation: 'El Señor se le apareció en el encinar de Mamre mientras Abraham estaba sentado a la puerta de su tienda.'
    },
    {
        id: 'e1_pat_2_3',
        difficulty: 2,
        question: '¿Qué pozo juramentado abrió Abraham y luego volvió a habitar Isaac en el límite sur de Canaán?',
        options: ['Bet-semes', 'Kiriat-jearim', 'En-gadi', 'Beerseba'],
        correctIndex: 3,
        verseSupport: 'Génesis 21:31',
        explanation: 'Abraham y Abimelec hicieron pacto allí, por lo que el lugar se llamó Beerseba («Pozo del juramento»).'
    },
    {
        id: 'e1_pat_2_4',
        difficulty: 2,
        question: '¿Junto a qué arroyo luchó Jacob toda la noche hasta el alba y recibió el nombre de Israel?',
        options: ['El vado de Jaboc', 'El torrente de Cisón', 'El arroyo de Querit', 'El río de Egipto'],
        correctIndex: 0,
        verseSupport: 'Génesis 32:22-30',
        explanation: 'Jacob llamó a aquel lugar Peniel porque vio a Dios cara a cara y fue librada su alma.'
    },
    {
        id: 'e1_pat_2_5',
        difficulty: 2,
        question: '¿A quién vendieron los hermanos de José por veinte piezas de plata en Dotán?',
        options: ['A soldados filisteos', 'A mercaderes ismaelitas', 'A viajeros de Nínive', 'A escribas de Babilonia'],
        correctIndex: 1,
        verseSupport: 'Génesis 37:28',
        explanation: 'Lo sacaron de la cisterna y lo vendieron por veinte piezas de plata a los ismaelitas que bajaban a Egipto.'
    },

    // Nivel 3 (Maestro)
    {
        id: 'e1_pat_3_1',
        difficulty: 3,
        question: '¿Cómo se llamaban los dos pozos por los que los pastores de Gerar riñeron con los de Isaac antes de hallar paz en Rehobot?',
        options: ['Beerseba y Cades', 'Elim y Mara', 'Esek y Sitna', 'Siquem y Bet-el'],
        correctIndex: 2,
        verseSupport: 'Génesis 26:20-22',
        explanation: 'Isaac llamó al primero Esek («Contienda») y al segundo Sitna («Enemistad»), hasta lograr paz en Rehobot.'
    },
    {
        id: 'e1_pat_3_2',
        difficulty: 3,
        question: '¿Qué cueva compró Abraham a Efrón el heteo por cuatrocientos siclos de plata para sepultar a Sara?',
        options: ['La cueva de Adulam', 'La cueva de En-gadi', 'La gruta de Bet-el', 'La cueva de Macpela'],
        correctIndex: 3,
        verseSupport: 'Génesis 23:16-19',
        explanation: 'En la cueva de Macpela fueron sepultados Sara, Abraham, Isaac, Rebeca, Lea y Jacob.'
    },
    {
        id: 'e1_pat_3_3',
        difficulty: 3,
        question: '¿Cómo se llamaba el rey de Salem y sacerdote del Dios Altísimo que salió al encuentro de Abram con pan y vino?',
        options: ['Melquisedec', 'Abimelec', 'Quedorlaomer', 'Bera'],
        correctIndex: 0,
        verseSupport: 'Génesis 14:18-20',
        explanation: 'Melquisedec bendijo a Abram y Abram le dio los diezmos de todo.'
    },
    {
        id: 'e1_pat_3_4',
        difficulty: 3,
        question: '¿Qué nombre egipcio puso Faraón a José al nombrarlo gobernador sobre toda la tierra de Egipto?',
        options: ['Nabucodonosor', 'Zafnat-panea', 'Potifera', 'Gosén'],
        correctIndex: 1,
        verseSupport: 'Génesis 41:45',
        explanation: 'Faraón le dio su anillo, le puso por nombre Zafnat-panea y le dio por mujer a Asenat.'
    },
    {
        id: 'e1_pat_3_5',
        difficulty: 3,
        question: '¿A quién puso Jacob su mano derecha al cruzar las manos para bendecir a los hijos de José?',
        options: ['Sobre Manasés', 'Sobre Benjamín', 'Sobre Efraín', 'Sobre Rubén'],
        correctIndex: 2,
        verseSupport: 'Génesis 48:14-19',
        explanation: 'Jacob explicó a José que el hermano menor (Efraín) sería más grande y su descendencia formaría multitud de naciones.'
    },
];

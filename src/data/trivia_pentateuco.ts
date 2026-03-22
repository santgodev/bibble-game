import { TriviaQuestion } from './categories';

export const TRIVIA_PENTATEUCO: TriviaQuestion[] = [
    // --- GÉNESIS: NIVEL SEMILLA (BÁSICO) ---
    {
        id: 'gen_001',
        question: '¿Qué creó Dios en el primer día según el Génesis?',
        options: ['Las plantas', 'El sol y la luna', 'La luz', 'Los animales'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Dios separó la luz de las tinieblas en el primer día.',
        verseSupport: 'Génesis 1:3-5'
    },
    {
        id: 'gen_002',
        question: '¿Quién fue la primera mujer creada por Dios?',
        options: ['Sara', 'Eva', 'Agar', 'Rebeca'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Eva fue formada de una costilla de Adán para ser su ayuda idónea.',
        verseSupport: 'Génesis 2:22'
    },
    {
        id: 'gen_003',
        question: '¿Cuál fue la señal del pacto de Dios con Noé de no volver a destruir la tierra con un diluvio?',
        options: ['Una paloma', 'Un altar', 'El arcoíris', 'Una rama de olivo'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Dios puso su arco en las nubes como señal del pacto perpetuo.',
        verseSupport: 'Génesis 9:13'
    },
    {
        id: 'gen_004',
        question: '¿Cuántos hijos tuvo Jacob, que luego dieron nombre a las tribus de Israel?',
        options: ['7', '10', '12', '3'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Jacob tuvo 12 hijos varones de quienes descendieron las doce tribus.',
        verseSupport: 'Génesis 35:23-26'
    },
    {
        id: 'gen_005',
        question: '¿De qué material estaba hecha el arca de Noé?',
        options: ['Madera de roble', 'Madera de gofer', 'Piedra pómez', 'Oro y plata'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Jehová le indicó a Noé las dimensiones y el material (gofer) para el arca.',
        verseSupport: 'Génesis 6:14'
    },
    {
        id: 'gen_006',
        question: '¿Cuál era el pecado de la ciudad de Babel?',
        options: ['Idolatría extrema', 'El orgullo de querer llegar al cielo por su cuenta', 'Robar el templo', 'No querer trabajar'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Los hombres buscaban hacerse un nombre en lugar de glorificar a Dios.',
        verseSupport: 'Génesis 11:4'
    },
    {
        id: 'gen_007',
        question: '¿Quién fue el hijo de la promesa nacido a Abraham en su vejez?',
        options: ['Ismael', 'Isaac', 'Judá', 'José'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Isaac nació cuando Abraham tenía 100 años y Sara 90.',
        verseSupport: 'Génesis 21:1-3'
    },
    {
        id: 'gen_008',
        question: '¿Cuántas personas se salvaron en el arca junto a Noé?',
        options: ['2', '12', '8', '14'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Noé, su esposa, sus tres hijos y sus tres nueras.',
        verseSupport: 'Génesis 7:13'
    },
    {
        id: 'gen_009',
        question: '¿Cómo se llamó al jardín de abundancia donde Dios colocó a la primera pareja?',
        options: ['Paraíso Terrenal', 'Edén', 'Canaán', 'Gólgota'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Significa deleite o placer.',
        verseSupport: 'Génesis 2:8'
    },
    {
        id: 'gen_010',
        question: '¿A quién le pidió Dios que saliera de su tierra y de su parentela?',
        options: ['Jacob', 'José', 'Abraham', 'Lot'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Abraham obedeció sin saber a dónde iba.',
        verseSupport: 'Génesis 12:1'
    },
    {
        id: 'gen_011',
        question: '¿Quién fue el primer hijo de Adán y Eva?',
        options: ['Abel', 'Set', 'Caín', 'Enoc'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Caín fue el primogénito de la humanidad.',
        verseSupport: 'Génesis 4:1'
    },
    {
        id: 'gen_012',
        question: '¿Cuántos días y noches llovió durante el diluvio?',
        options: ['7 días', '40 días', '150 días', '12 días'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Llovió sobre la tierra cuarenta días y cuarenta noches.',
        verseSupport: 'Génesis 7:12'
    },
    {
        id: 'gen_013',
        question: '¿Quién fue el hombre más viejo mencionado en la Biblia?',
        options: ['Noé', 'Abraham', 'Matusalén', 'Adán'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Matusalén vivió 969 años.',
        verseSupport: 'Génesis 5:27'
    },
    {
        id: 'gen_014',
        question: '¿Qué le regaló Jacob a su hijo José que causó envidia en sus hermanos?',
        options: ['Un anillo de oro', 'Una túnica de muchos colores', 'Un báculo de mando', 'Una espada'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Fue una señal de favoritismo que desató el conflicto familiar.',
        verseSupport: 'Génesis 37:3'
    },
    {
        id: 'gen_015',
        question: '¿En qué día creó Dios al hombre?',
        options: ['Día quinto', 'Día sexto', 'Día séptimo', 'Día tercero'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Dios creó al hombre el sexto día antes de reposar.',
        verseSupport: 'Génesis 1:31'
    },

    // --- GÉNESIS: NIVEL DISCÍPULO (INTERMEDIO) ---
    {
        id: 'gen_101',
        question: '¿Cómo se llamaron los tres hijos de Noé que salieron con él en el arca?',
        options: ['Caín, Abel y Set', 'Sem, Cam y Jafet', 'Abraham, Isaac y Jacob', 'Gomer, Magog y Madai'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'De estos tres hijos se pobló toda la tierra después del diluvio.',
        verseSupport: 'Génesis 9:18-19'
    },
    {
        id: 'gen_102',
        question: '¿En qué ciudad nació Abraham antes de ser llamado por Dios?',
        options: ['Harán', 'Canaán', 'Ur de los caldeos', 'Egipto'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Abraham salió de Ur de los caldeos con su padre Taré.',
        verseSupport: 'Génesis 11:31'
    },
    {
        id: 'gen_103',
        question: '¿Por qué cantidad de lentejas vendió Esaú su primogenitura a Jacob?',
        options: ['Un plato de lentejas y pan', 'Treinta piezas de plata', 'Siete corderas', 'Una viña'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Esaú menospreció su primogenitura por el hambre del momento.',
        verseSupport: 'Génesis 25:34'
    },
    {
        id: 'gen_104',
        question: '¿Qué nombre le puso Dios a Jacob después de que este luchara con un ángel en Peniel?',
        options: ['Abraham', 'Israel', 'Edom', 'Isaac'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Israel significa "El que lucha con Dios".',
        verseSupport: 'Génesis 32:28'
    },
    {
        id: 'gen_105',
        question: '¿Cómo se llamaba la mujer de Lot que se convirtió en estatua de sal?',
        options: ['Sara', 'Lea', 'No se menciona su nombre', 'Raquel'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'La Biblia se refiere a ella simplemente como "la mujer de Lot".',
        verseSupport: 'Génesis 19:26'
    },
    {
        id: 'gen_106',
        question: '¿Qué objeto vio Jacob en su sueño en Bet-el?',
        options: ['Una espada de fuego', 'Una escalera que llegaba al cielo', 'Un mar de cristal', 'Un león rampante'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Jacob vio ángeles de Dios que subían y descendían por ella.',
        verseSupport: 'Génesis 28:12'
    },
    {
        id: 'gen_107',
        question: '¿Quién interpretó los sueños del panadero y el copero en la cárcel de Egipto?',
        options: ['Moisés', 'José', 'Daniel', 'Salomón'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'José recibió de Dios el don de interpretar sueños.',
        verseSupport: 'Génesis 40:5-19'
    },
    {
        id: 'gen_108',
        question: '¿Quién fue el primer polígamo mencionado en la Biblia?',
        options: ['Matusalén', 'Lamec', 'Caín', 'Taré'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Lamec de la descendencia de Caín tomó para sí dos mujeres.',
        verseSupport: 'Génesis 4:19'
    },
    {
        id: 'gen_109',
        question: '¿Cómo se llamaban los dos hijos de José nacidos en Egipto?',
        options: ['Fares y Zara', 'Efraín y Manasés', 'Simón y Leví', 'Dan y Neftalí'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Jacob los bendijo dándole la primogenitura al menor (Efraín).',
        verseSupport: 'Génesis 48:1'
    },
    {
        id: 'gen_110',
        question: '¿Qué edad tenía Abraham cuando nació su hijo Isaac?',
        options: ['75 años', '99 años', '100 años', '120 años'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'La promesa se cumplió en la vejez absoluta de Abraham.',
        verseSupport: 'Génesis 21:5'
    },

    // --- GÉNESIS: NIVEL APÓSTOL (AVANZADO) ---
    {
        id: 'gen_201',
        question: 'En el contexto teológico de Génesis 3:15, ¿cómo se conoce tradicionalmente este versículo?',
        options: ['La Gran Comisión', 'El Protoevangelio', 'El Pacto Abrahámico', 'La Ley de Talión'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Se considera la primera profecía mesiánica, donde la simiente de la mujer herirá la cabeza de la serpiente.',
        verseSupport: 'Génesis 3:15'
    },
    {
        id: 'gen_202',
        question: '¿Quién era Melquisedec y qué ofreció a Abraham tras su victoria?',
        options: ['Rey de Sodoma; oro y plata', 'Rey de Salem y sacerdote; pan y vino', 'Un profeta de Ur; una becerra', 'El hijo de Lot; una herestad'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Melquisedec es un tipo de Cristo por su sacerdocio eterno y el ofrecimiento de pan y vino.',
        verseSupport: 'Génesis 14:18-20'
    },
    {
        id: 'gen_203',
        question: '¿Qué significa teológicamente que a Abraham "le fue contado por justicia" por creer a Dios?',
        options: ['Que Abraham era un hombre sin pecado', 'La base de la justificación por la fe', 'Que las obras de Abraham lo salvaron', 'El inicio de la ley de Moisés'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Este versículo es fundamental en el Nuevo Testamento para explicar la salvación por gracia mediante la fe.',
        verseSupport: 'Génesis 15:6; Romanos 4:3'
    },
    {
        id: 'gen_204',
        question: '¿Cuál fue el nombre original del lugar donde Jacob tuvo su visión de la escalera?',
        options: ['Bet-el', 'Luz', 'Siquem', 'Beerseba'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Jacob cambió el nombre de Luz a Bet-el (Casa de Dios).',
        verseSupport: 'Génesis 28:19'
    },
    {
        id: 'gen_205',
        question: '¿Cuántos años vivió en total José en Egipto desde su llegada hasta su muerte?',
        options: ['80 años', '93 años', '110 años', '70 años'],
        correctIndex: 1,
        difficulty: 3, // Fue a los 17, murió a los 110. 110-17=93.
        explanation: 'José llegó como esclavo a los 17 años y murió a los 110.',
        verseSupport: 'Génesis 37:2, 50:26'
    },
    {
        id: 'gen_206',
        question: '¿Cómo se llamó el cuarto río que salía de Edén después del Pisón, Gihón e Hidekel?',
        options: ['Nilo', 'Jordán', 'Éufrates', 'Tigris'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'La geografía bíblica menciona estos cuatro brazos principales.',
        verseSupport: 'Génesis 2:14'
    },

    // --- ÉXODO: NIVEL SEMILLA (BÁSICO) ---
    {
        id: 'exo_001',
        question: '¿Cómo salvó la madre de Moisés a su hijo de la orden de Faraón de matar a los niños?',
        options: ['Lo escondió en un sótano', 'Lo puso en una arquilla de juncos en el río Nilo', 'Lo envió a otro país', 'Le pidió ayuda a Faraón'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Moisés fue rescatado por la hija de Faraón.',
        verseSupport: 'Éxodo 2:3'
    },
    {
        id: 'exo_002',
        question: '¿Qué le dijo Dios a Moisés desde la zarza ardiente?',
        options: ['"Sube a la montaña"', '"Quita el calzado de tus pies"', '"Construye un templo"', '"Pide perdón"'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Porque el lugar que pisaba era tierra santa.',
        verseSupport: 'Éxodo 3:5'
    },
    {
        id: 'exo_003',
        question: '¿Cuál fue la primera plaga que cayó sobre Egipto?',
        options: ['Ranas', 'Langostas', 'El agua se convirtió en sangre', 'Muerte de primogénitos'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Aarón golpeó el Nilo con su vara y se convirtió en sangre.',
        verseSupport: 'Éxodo 7:20'
    },
    {
        id: 'exo_004',
        question: '¿Cuántos mandamientos entregó Dios a Moisés en el monte Sinaí?',
        options: ['12', '10', '7', '100'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Grabados por el dedo de Dios en tablas de piedra.',
        verseSupport: 'Éxodo 20'
    },
    {
        id: 'exo_005',
        question: '¿Cómo cruzaron los israelitas el Mar Rojo?',
        options: ['En botes', 'Nadando', 'Dios dividió las aguas y pasaron por lo seco', 'Por un puente milagroso'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Jehová hizo que el mar se retirara por un fuerte viento oriental.',
        verseSupport: 'Éxodo 14:21'
    },
    {
        id: 'exo_006',
        question: '¿Qué comida les enviaba Dios del cielo cada mañana en el desierto?',
        options: ['Pan de trigo', 'Maná', 'Fruta fresca', 'Minitortas'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Era como semilla de culantro, blanco, y su sabor como de hojuelas con miel.',
        verseSupport: 'Éxodo 16:14-15'
    },
    {
        id: 'exo_007',
        question: '¿Quién ayudaba a Moisés a hablar ante Faraón porque Moisés era "tardo de habla"?',
        options: ['Josué', 'Aarón', 'Jetro', 'Miriam'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Aarón era su hermano y primer sumo sacerdote.',
        verseSupport: 'Éxodo 4:14'
    },

    // --- ÉXODO: NIVEL DISCÍPULO (INTERMEDIO) ---
    {
        id: 'exo_101',
        question: '¿Cuál era el nombre del suegro de Moisés, sacerdote de Madián?',
        options: ['Melquisedec', 'Jetro', 'Balac', 'Lot'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'También llamado Reuel. Aconsejó a Moisés sobre el liderazgo.',
        verseSupport: 'Éxodo 3:1, 18:17'
    },
    {
        id: 'exo_102',
        question: '¿Qué señal debían poner los israelitas en sus casas para que el ángel de la muerte no entrara?',
        options: ['Una marca de tiza', 'Sangre de un cordero en los postes de las puertas', 'Una rama de olivo', 'Una lámpara encendida'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Fue la institución de la Pascua.',
        verseSupport: 'Éxodo 12:7'
    },
    {
        id: 'exo_103',
        question: '¿Cómo se llamó el lugar donde Moisés golpeó la peña y salió agua después de que el pueblo se quejara?',
        options: ['Mara', 'Sinaí', 'Masa y Meriba', 'Elim'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Significa "Prueba" y "Rencilla" por la actitud del pueblo.',
        verseSupport: 'Éxodo 17:7'
    },
    {
        id: 'exo_104',
        question: '¿Qué ídolo fabricaron los israelitas mientras Moisés estaba en la montaña?',
        options: ['Un becerro de oro', 'Una serpiente de bronce', 'Un altar a Baal', 'Una torre'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Aarón cedió ante la presión del pueblo impaciente.',
        verseSupport: 'Éxodo 32:4'
    },
    {
        id: 'exo_105',
        question: '¿Cómo guiaba Dios al pueblo de Israel durante la noche en el desierto?',
        options: ['Con una brújula', 'Con una columna de nube', 'Con una columna de fuego', 'Moisés conocía el camino'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'De día con nube y de noche con fuego para alumbrarles.',
        verseSupport: 'Éxodo 13:21'
    },
    {
        id: 'exo_106',
        question: '¿Cuál fue la décima y última plaga contra Egipto?',
        options: ['Muerte de los primogénitos', 'Tinieblas', 'Granizo', 'Úlceras'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Esta plaga finalmente obligó a Faraón a dejar ir al pueblo.',
        verseSupport: 'Éxodo 12:29'
    },

    // --- ÉXODO: NIVEL APÓSTOL (AVANZADO) ---
    {
        id: 'exo_201',
        question: '¿De qué material estaba revestido el Arca del Pacto por dentro y por fuera?',
        options: ['Plata pura', 'Oro puro', 'Bronce pulido', 'Madera de cedro'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Simbolizaba la gloria y majestad divina.',
        verseSupport: 'Éxodo 25:11'
    },
    {
        id: 'exo_202',
        question: '¿Cómo se llamaba el artesano principal lleno del Espíritu de Dios para construir el Tabernáculo?',
        options: ['Josué', 'Bezaleel', 'Uría', 'Coré'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'De la tribu de Judá, dotado de habilidades artísticas divinas.',
        verseSupport: 'Éxodo 31:2-3'
    },
    {
        id: 'exo_203',
        question: '¿Cuál era el orden de las tres capas de las cortinas del Tabernáculo (de adentro hacia afuera)?',
        options: ['Lino, pelo de cabra, pieles de carnero/tejón', 'Oro, plata y bronce', 'Lana, lino y seda', 'Pieles, lino y algodón'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'El diseño iba de lo más rico y simbólico a lo más resistente externamente.',
        verseSupport: 'Éxodo 26'
    },
    {
        id: 'exo_204',
        question: '¿Qué nombre reveló Dios a Moisés al enviarlo a Egipto?',
        options: ['El Shaddai', 'Jehová Jireh', 'YO SOY EL QUE SOY', 'Adonai'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Reveló su autoexistencia y eternidad.',
        verseSupport: 'Éxodo 3:14'
    },
    {
        id: 'exo_205',
        question: '¿Cuántos años habitaron los hijos de Israel en Egipto según el registro de Éxodo?',
        options: ['400 años', '430 años', '215 años', '500 años'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Se cumplió el tiempo exacto profetizado por Dios.',
        verseSupport: 'Éxodo 12:40'
    },

    // --- LEVÍTICO: NIVEL SEMILLA (BÁSICO) ---
    {
        id: 'lev_001',
        question: '¿Qué tema principal se repite en todo el libro de Levítico?',
        options: ['La guerra', 'La santidad de Dios y de su pueblo', 'La construcción del templo', 'Los viajes'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Porque Jehová es santo, su pueblo debe serlo.',
        verseSupport: 'Levítico 19:2'
    },
    {
        id: 'lev_002',
        question: '¿Quiénes fueron los únicos que podían entrar al Lugar Santísimo?',
        options: ['Los ancianos de las tribus', 'Moisés y Josué', 'El Sumo Sacerdote una vez al año', 'Cualquier israelita que pecara'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'El acceso estaba restringido por la pureza ritual.',
        verseSupport: 'Levítico 16'
    },
    {
        id: 'lev_003',
        question: '¿Qué animal no debían comer los israelitas según las leyes dietéticas?',
        options: ['Vaca', 'Cordero', 'Cerdo', 'Pescado con escamas'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Se consideraba un animal inmundo para los hebreos.',
        verseSupport: 'Levítico 11:7'
    },

    // --- LEVÍTICO: NIVEL DISCÍPULO (INTERMEDIO) ---
    {
        id: 'lev_101',
        question: '¿Cómo se llama la ofrenda que era quemada completamente por fuego?',
        options: ['Ofrenda por el pecado', 'Holocausto', 'Ofrenda vegetal', 'Ofrenda de paz'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Significa "ascensión" porque subía como olor grato a Dios.',
        verseSupport: 'Levítico 1'
    },
    {
        id: 'lev_102',
        question: '¿Qué les sucedió a Nadab y Abiú por ofrecer "fuego extraño" ante Jehová?',
        options: ['Fueron expulsados', 'Se quedaron ciegos', 'Salieron llamas de Jehová y los consumieron', 'Perdieron el habla'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'No siguieron las instrucciones sagradas del sacerdocio.',
        verseSupport: 'Levítico 10:2'
    },
    {
        id: 'lev_103',
        question: '¿Qué se celebraba el día décimo del séptimo mes?',
        options: ['La Pascua', 'El Día de la Expiación (Yom Kippur)', 'Pentecostés', 'Año Nuevo'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Día de ayuno y arrepentimiento nacional.',
        verseSupport: 'Levítico 23:27'
    },

    // --- LEVÍTICO: NIVEL APÓSTOL (AVANZADO) ---
    {
        id: 'lev_201',
        question: '¿Qué simbolizaba el macho cabrío sobre el cual se ponían los pecados para enviarlo al desierto?',
        options: ['El castigo eterno', 'La eliminación total de la culpa (Azazel)', 'Una trampa para demonios', 'Un regalo para las naciones'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Simbolizaba que los pecados eran llevados lejos de la presencia de Dios.',
        verseSupport: 'Levítico 16:21'
    },
    {
        id: 'lev_202',
        question: '¿Cada cuántos años se celebraba el Año del Jubileo en Israel?',
        options: ['Cada 7 años', 'Cada 12 años', 'Cada 50 años', 'Cada 100 años'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Se liberaban esclavos y se devolvían las tierras a sus dueños originales.',
        verseSupport: 'Levítico 25:10'
    },
    {
        id: 'lev_203',
        question: '¿Cuál era el propósito de la "Sal del Pacto" en las ofrendas?',
        options: ['Dar mejor sabor', 'Preservación y lealtad eterna del pacto', 'Evitar la descomposición', 'Ahuyentar animales'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'La sal simbolizaba incorruptibilidad y permanencia.',
        verseSupport: 'Levítico 2:13'
    },

    // --- NÚMEROS: NIVEL SEMILLA (BÁSICO) ---
    {
        id: 'num_001',
        question: '¿Por qué se llama así el libro de Números?',
        options: ['Porque habla de matemáticas', 'Por los censos del pueblo de Israel', 'Porque tiene muchos capítulos', 'Porque Moisés sabía contar'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Cuenta la cantidad de guerreros y tribus al salir y entrar a la tierra.',
        verseSupport: 'Números 1, 26'
    },
    {
        id: 'num_002',
        question: '¿Cuántos espías envió Moisés a explorar la tierra de Canaán?',
        options: ['2', '10', '12', '7'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Uno por cada tribu de Israel.',
        verseSupport: 'Números 13:2'
    },
    {
        id: 'num_003',
        question: '¿Qué remedio milagroso dio Dios contra las picaduras de serpientes ardientes?',
        options: ['Un ungüento de hierbas', 'Una serpiente de bronce en un asta', 'Lavar los pies con sal', 'Beber agua de la peña'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Quien miraba a la serpiente de bronce vivía.',
        verseSupport: 'Números 21:9'
    },

    // --- NÚMEROS: NIVEL DISCÍPULO (INTERMEDIO) ---
    {
        id: 'num_101',
        question: '¿Quiénes fueron los únicos dos espías que dieron un reporte positivo y confiaron en Dios?',
        options: ['Aarón y Miriam', 'Josué y Caleb', 'Coré y Datán', 'Judá y Benjamín'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Los otros 10 desanimaron al pueblo con su falta de fe.',
        verseSupport: 'Números 14:6-9'
    },
    {
        id: 'num_102',
        question: '¿Qué animal habló para reprender al profeta Balaam?',
        options: ['Un perro', 'Un buey', 'Su asna', 'Un águila'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Dios abrió la boca del asna para salvar a Balaam de un ángel.',
        verseSupport: 'Números 22:28'
    },
    {
        id: 'num_103',
        question: '¿Cuál fue el castigo de Dios para Israel por quejarse y no querer entrar a la tierra?',
        options: ['Un diluvio', 'Vagar 40 años por el desierto', 'Volver a ser esclavos en Egipto', 'Fuego del cielo'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Un año por cada día que los espías estuvieron en Canaán.',
        verseSupport: 'Números 14:34'
    },

    // --- NÚMEROS: NIVEL APÓSTOL (AVANZADO) ---
    {
        id: 'num_201',
        question: '¿Qué confirmación milagrosa dio Dios para validar el liderazgo de Aarón frente a la rebelión?',
        options: ['Un trueno', 'Su vara floreció y dio almendras', 'Llovió oro', 'Se quedó mudo'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Confirmó que solo la casa de Leví debía ejercer el sacerdocio.',
        verseSupport: 'Números 17:8'
    },
    {
        id: 'num_202',
        question: '¿Cómo se llamaron los líderes de la rebelión que fueron tragados por la tierra?',
        options: ['Balaam y Balac', 'Coré, Datán y Abiram', 'Zimri y Cozbi', 'Sihón y Og'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Desafiaron el liderazgo de Moisés y Aarón.',
        verseSupport: 'Números 16:31-32'
    },
    {
        id: 'num_203',
        question: '¿Por qué no pudo Moisés entrar a la Tierra Prometida según Números 20?',
        options: ['Por su vejez', 'Porque golpeó la peña en lugar de hablarle con ira', 'Porque se perdió en el camino', 'Porque Josué tomó el mando'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Mostró falta de santidad y honra a Dios ante el pueblo.',
        verseSupport: 'Números 20:12'
    },

    // --- DEUTERONOMIO: NIVEL SEMILLA (BÁSICO) ---
    {
        id: 'deu_001',
        question: '¿Qué significa el nombre "Deuteronomio"?',
        options: ['El fin del viaje', 'Segunda Ley o repetición de la Ley', 'Los últimos días', 'Cántico de Moisés'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Moisés repitió la Ley a la nueva generación antes de entrar a Canaán.',
        verseSupport: 'Deuteronomio 1'
    },
    {
        id: 'deu_002',
        question: '¿Dónde murió Moisés después de ver la Tierra Prometida de lejos?',
        options: ['Monte Sinaí', 'Monte Nebo', 'Monte de los Olivos', 'Mar Rojo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Jehová le mostró toda la tierra desde la cumbre del Pisga.',
        verseSupport: 'Deuteronomio 34:1'
    },

    // --- DEUTERONOMIO: NIVEL DISCÍPULO (INTERMEDIO) ---
    {
        id: 'deu_101',
        question: '¿Cuál es el mandamiento más grande que Moisés enfatiza en Deuteronomio 6:5?',
        options: ['"No matarás"', '"Amarás a Jehová tu Dios con todo tu corazón"', '"Harás sacrificios diarios"', '"Honrarás a tu padre"'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Es la base del Shemá, central en la fe judía y cristiana.',
        verseSupport: 'Deuteronomio 6:5'
    },
    {
        id: 'deu_102',
        question: '¿Qué debían hacer los israelitas con la Ley de Dios en sus casas?',
        options: ['Guardarla en un cofre', 'Escribirla en los postes de sus casas y puertas', 'Memorizarla y no escribir nada', 'Esconderla de los niños'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Para que siempre estuviera presente en su vida diaria.',
        verseSupport: 'Deuteronomio 6:9'
    },

    // --- DEUTERONOMIO: NIVEL APÓSTOL (AVANZADO) ---
    {
        id: 'deu_201',
        question: '¿Qué eligió Dios que pusieran delante de ellos como testimonio, según el capítulo 30?',
        options: ['Plata o Bronce', 'La Vida y la Muerte, la Bendición y la Maldición', 'Egipto o Canaán', 'El Nilo o el Jordán'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Un llamado a la obediencia consciente.',
        verseSupport: 'Deuteronomio 30:19'
    },
    {
        id: 'deu_202',
        question: '¿Cómo se llaman los dos montes donde se debían pronunciar las bendiciones y las maldiciones?',
        options: ['Sinaí y Horeb', 'Gerizim y Ebal', 'Ararat y Carmelo', 'Tabor y Hermón'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Gerizim para bendiciones y Ebal para maldiciones.',
        verseSupport: 'Deuteronomio 27:12-13'
    },
    {
        id: 'deu_203',
        question: '¿Cuál fue la profecía sobre un futuro líder que se encuentra en Deuteronomio 18:15?',
        options: ['Dios enviará un ángel', 'Profeta de en medio de ti, como yo, te levantará Jehová', 'Vendrá un rey guerrero', 'No habrá más profetas'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Considerada una profecía de la venida de Jesucristo.',
        verseSupport: 'Deuteronomio 18:15'
    }
];

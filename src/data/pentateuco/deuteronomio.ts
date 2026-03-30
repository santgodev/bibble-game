import type { TriviaQuestion } from '../categories';

export const TRIVIA_DEUTERONOMIO: TriviaQuestion[] = [
    // --- NIVEL 1: SEMILLA (25 Preguntas) ---
    {
        id: 'deut_001',
        question: '¿Qué significa el nombre "Deuteronomio"?',
        options: ['Primera ley', 'Segunda ley (o copia de la ley)', 'Leyes del desierto', 'Libro de cantos'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Es la repetición o segunda entrega de la ley a la nueva generación.',
        verseSupport: 'Deuteronomio 17:18'
    },
    {
        id: 'deut_002',
        question: '¿Quién pronunció la mayoría de los discursos que forman Deuteronomio?',
        options: ['Aarón', 'Josué', 'Moisés', 'Caleb'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Moisés pronunció estos sermones de despedida al pueblo.',
        verseSupport: 'Deuteronomio 1:1'
    },
    {
        id: 'deut_003',
        question: '¿A quién debían amar con todo el corazón, toda el alma y todas las fuerzas?',
        options: ['A su prójimo', 'A los ángeles', 'A Jehová su Dios', 'A Moisés'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Este es el mandamiento principal y más grande (El Shemá).',
        verseSupport: 'Deuteronomio 6:5'
    },
    {
        id: 'deut_004',
        question: '¿Cómo debía el pueblo enseñar la ley de Dios a sus hijos?',
        options: ['Una vez al año', 'Repitiéndosela constantemente', 'Sólo los sábados', 'Solo el sumo sacerdote podía'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Debían hablar de ellas en casa, andando, al acostarse y levantarse.',
        verseSupport: 'Deuteronomio 6:7'
    },
    {
        id: 'deut_005',
        question: 'Al relatar los Diez Mandamientos, ¿quién dijo Dios que los escribió en las tablas?',
        options: ['Moisés', 'Josué', 'Dios mismo con su dedo', 'Aarón'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Las tablas de piedra fueron escritas con el dedo de Dios.',
        verseSupport: 'Deuteronomio 9:10'
    },
    {
        id: 'deut_006',
        question: '¿De qué material Moisés hizo un arca para guardar las segundas tablas de la ley?',
        options: ['Madera de acacia', 'Oro puro', 'Piedra esculpida', 'Hierro'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Moisés hizo un arca de madera de acacia según la orden divina.',
        verseSupport: 'Deuteronomio 10:3'
    },
    {
        id: 'deut_007',
        question: '¿Qué dos montes fueron designados para pronunciar las bendiciones y las maldiciones?',
        options: ['Sinaí y Horeb', 'Gerizim y Ebal', 'Carmelo y Tabor', 'Moriah y Sion'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'En Gerizim las bendiciones y en Ebal las maldiciones.',
        verseSupport: 'Deuteronomio 11:29'
    },
    {
        id: 'deut_008',
        question: '¿Con qué alimento manaba "leche y miel" la Tierra Prometida?',
        options: ['Maná', 'Frutos exquisitos y abundancia', 'Ríos literales', 'Rocío del cielo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Es una expresión de gran fertilidad y excelente producción natural.',
        verseSupport: 'Deuteronomio 8:7-8'
    },
    {
        id: 'deut_009',
        question: '¿Qué parte de los animales limpios no debían comer bajo ninguna circunstancia?',
        options: ['Los cuernos', 'La piel', 'La grasa y la sangre', 'Los huesos grandes'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'La sangre es la vida, y debía ser derramada en tierra como agua.',
        verseSupport: 'Deuteronomio 12:23-24'
    },
    {
        id: 'deut_010',
        question: '¿Moisés recordó al pueblo que la vestimenta de ellos en 40 años de desierto nunca se...?',
        options: ['Mojó', 'Envegeció (no se desgastó)', 'Puso blanca', 'Perdió en batalla'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'El vestido nunca se envejeció sobre ellos ni sus pies se hincharon.',
        verseSupport: 'Deuteronomio 8:4'
    },
    {
        id: 'deut_011',
        question: 'Frente a un falso profeta que hiciera señales pero invitara a seguir otros dioses, ¿qué debían hacer?',
        options: ['No escucharle', 'Seguirle un mes', 'Pedir más señales', 'Rezar por él'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Aquel profeta debía morir porque aconsejaba rebelión contra Jehová.',
        verseSupport: 'Deuteronomio 13:3-5'
    },
    {
        id: 'deut_012',
        question: '¿Qué rasgo animal hace limpia a un ave o bestia marina para comer?',
        options: ['Tener aletas y escamas', 'Volar muy alto', 'Ser mansas', 'Ser de cuello largo'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Cualquier pez sin aletas o escamas era abominación.',
        verseSupport: 'Deuteronomio 14:9-10'
    },
    {
        id: 'deut_013',
        question: 'Cada séptimo año había remisión (descanso). ¿Qué ocurría con las deudas?',
        options: ['Se duplicaban', 'Se perdonaban al hermano', 'Había que pagar el doble', 'Se pagaban con tierras'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'El año de remisión exigía perdonar las deudas al prójimo israelita.',
        verseSupport: 'Deuteronomio 15:1-2'
    },
    {
        id: 'deut_014',
        question: 'Si un esclavo hebreo servía 6 años, ¿qué pasaba en el séptimo año?',
        options: ['Servía para siempre', 'Le pagaban más', 'Salía libre y con provisiones', 'Recibía tierras de su amo'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Se le daba la libertad gratuitamente, abastecido de ovejas y vino.',
        verseSupport: 'Deuteronomio 15:12-14'
    },
    {
        id: 'deut_015',
        question: 'Jehová había prometido enviar un profeta mayor para Israel; este sería similar a...',
        options: ['Moisés', 'Aarón', 'Josué', 'Elias'],
        correctIndex: 0,
        difficulty: 1,
        explanation: '"Profeta de en medio de ti, de tus hermanos, como yo".',
        verseSupport: 'Deuteronomio 18:15'
    },
    {
        id: 'deut_016',
        question: 'Si alguien golpeaba a alguien con odio intencional y este moría, no podía esconderse. ¿Quién cobraba venganza?',
        options: ['Los reyes', 'El vengador de la sangre (familiar)', 'Josué', 'El sumo sacerdote'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'El vengador de sangre tenía el deber de hacer justicia.',
        verseSupport: 'Deuteronomio 19:11-12'
    },
    {
        id: 'deut_017',
        question: 'En la ley del castigo exacto, Dios dictó: "Ojo por ojo, y..."',
        options: ['Mano por pierna', 'Diente por diente', 'Vida por castigo', 'Dinero por sangre'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Diente por diente, mano por mano, pie por pie. Ley de la retaliación.',
        verseSupport: 'Deuteronomio 19:21'
    },
    {
        id: 'deut_018',
        question: 'No se debía entregar al opresor aquel siervo o esclavo que...',
        options: ['Fuera muy útil', 'Huyera hacia Israel buscando refugio', 'Tuviera hijos', 'Pagase oro'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Se le debía dar asilo sin entregarle a su amo.',
        verseSupport: 'Deuteronomio 23:15'
    },
    {
        id: 'deut_019',
        question: 'Para divorciarse, ¿qué documento legal debía escribir el varón y entregar a la mujer?',
        options: ['Un papiro de deuda', 'Carta de divorcio', 'Letra de oro', 'Placa de bronce'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Con la carta de repudio formal la dejaba ir libre.',
        verseSupport: 'Deuteronomio 24:1'
    },
    {
        id: 'deut_020',
        question: 'Para la siega, no debían rebuscar todo el campo. Lo olvidado quedaba para...',
        options: ['Los pájaros', 'El extranjero, el huérfano y la viuda', 'Quemarlo después', 'Los reyes'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Era una medida de caridad obligatoria para los más necesitados.',
        verseSupport: 'Deuteronomio 24:19'
    },
    {
        id: 'deut_021',
        question: 'Moisés puso delante de Israel un trato final a elegir: "La vida y el bien, o..."',
        options: ['La luz y sombra', 'La muerte y el mal', 'La paz y amor', 'Guerra y luto'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Los exhortó: "escoge, pues, la vida, para que vivas tú y tu descendencia".',
        verseSupport: 'Deuteronomio 30:15'
    },
    {
        id: 'deut_022',
        question: '¿Quién escribió el "Cántico Temible" que serviría como testigo contra Israel si pecaban?',
        options: ['Caleb', 'Moisés', 'Aarón', 'Josué'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Moisés escribió el cántico aquel día para enseñarlo a los hijos de Israel.',
        verseSupport: 'Deuteronomio 31:22'
    },
    {
        id: 'deut_023',
        question: 'Al bendecir Moisés a las 12 tribus antes de morir, ¿qué tribu fue omitida?',
        options: ['Simeón', 'Rubén', 'Leví', 'Zabulón'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'La tribu de Simeón no recibió mención en esta bendición final.',
        verseSupport: 'Deuteronomio 33'
    },
    {
        id: 'deut_024',
        question: 'Moisés contempló toda la tierra de Canaán, pero Dios le reafirmó: "Yo te la he hecho ver... mas..."',
        options: ['No entrarás allá', 'Entrarás a los 120 años', 'Serás sepultado en ella', 'Pelearás por ella'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Por el evento en Meriba, solo la vio de lejos sin cruzar el Jordán.',
        verseSupport: 'Deuteronomio 34:4'
    },
    {
        id: 'deut_025',
        question: '¿Cuántos días lloraron los hijos de Israel la muerte de Moisés en los campos de Moab?',
        options: ['12 días', '7 días', '30 días', '40 días'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Guardaron 30 días de luto formal antes de iniciar la conquista con Josué.',
        verseSupport: 'Deuteronomio 34:8'
    },

    // --- NIVEL 2: DISCÍPULO (20 Preguntas) ---
    {
        id: 'deut_101',
        question: '¿Cuáles reyes famosos amorreos recién abatidos repasa Moisés en su primer discurso?',
        options: ['Faraón y Abimelec', 'Sehón rey de Hesbón y Og rey de Basán', 'Agag y Goliat', 'Jalín y Sísara'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Eran los reyes que obstaculizaron territorialmente el paso judío en Transjordania.',
        verseSupport: 'Deuteronomio 1:4'
    },
    {
        id: 'deut_102',
        question: '¿Qué mandó Dios tallar explícitamente y atarlos por señal en la mano humana?',
        options: ['Los ídolos', 'Las palabras o leyes divinas', 'Lazos de colores', 'Campanillas'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Debían ser enseñadas, atadas a las manos y en las frentes como "filacterias".',
        verseSupport: 'Deuteronomio 6:8'
    },
    {
        id: 'deut_103',
        question: '"No tentaréis a Jehová vuestro Dios, como lo tentasteis en... "',
        options: ['Sinaí', 'Massah (Masah)', 'Egipto', 'El Mar Rojo'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Masah significa "tentación" por exigir milagros irritados sin paciencia.',
        verseSupport: 'Deuteronomio 6:16'
    },
    {
        id: 'deut_104',
        question: 'Al hablar de las naciones cananeas a conquistar, Dios ordenó exterminarlas sin hacer...',
        options: ['Guerras de noche', 'Pactos ni tenerles misericordia (Alianza)', 'Daño a sus templos', 'Hacer un censo nuevo'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Tolerarlos destruiría la fe pura del pueblo a causa del sincretismo idólatra.',
        verseSupport: 'Deuteronomio 7:2'
    },
    {
        id: 'deut_105',
        question: 'El maná les enseñó que "No solo de pan vivirá el hombre, sino de..."',
        options: ['Todo lo que sale de la boca de Jehová', 'La tierra que fluye leche', 'El agua de las peñas', 'El aire del desierto'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Cita emblemática que Jesús luego usaría en su ayuno del desierto.',
        verseSupport: 'Deuteronomio 8:3'
    },
    {
        id: 'deut_106',
        question: 'Según el testimonio de Moisés, luego de adorar el becerro de oro, ¿cuántos días ayunó él pidiendo perdón?',
        options: ['3 días', '70 días', '40 días y 40 noches (sin pan ni agua)', '21 días'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Oró fervorosamente tendido y ayunando para aplacar el enojo divino.',
        verseSupport: 'Deuteronomio 9:18'
    },
    {
        id: 'deut_107',
        question: 'Solo en Israel existía un lugar o santuario designado inamovible donde debían...',
        options: ['Pagar los soldados', 'Jugar a la suerte', 'Llevar diezmos, ofrendas y sacrificios al Único lugar elegido', 'Elegir reyes cananeos'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Descentralizar los altares llevaba al pueblo al paganismo rural.',
        verseSupport: 'Deuteronomio 12:5-6'
    },
    {
        id: 'deut_108',
        question: '¿Qué insecto de dieta estaba explícitamente permitido para ser comido?',
        options: ['Las hormigas largas', 'Las avispas rojas', 'La langosta saltarina', 'Los escorpiones'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Las aves limpias e insectos saltadores como la langosta eran lícitos.',
        verseSupport: 'Deuteronomio 14:19-20 / Levítico 11'
    },
    {
        id: 'deut_109',
        question: 'Durante la Pascua de panes sin levadura en el mes de Abib. ¿Qué gran prohibición se extendía fuera del templo?',
        options: ['Vestir ropas negras', 'Cantar himnos altos', 'Que restara nada de carne del sacrificio hasta la mañana', 'Nadie podía salir de su cuarto'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'La Pascua debía comerse apuradamente de noche toda completa (o quemarse sobras).',
        verseSupport: 'Deuteronomio 16:4'
    },
    {
        id: 'deut_110',
        question: 'Moisés reglamenta tempranamente el reino (si piden rey), este rey futuro NO debe aumentar para sí...',
        options: ['Los altares al sol', 'Caballos, múltiples mujeres ni mucha plata y oro', 'Banderas foráneas', 'Las tropas mercenarias'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Estas 3 cosas desviarían el corazón del rey, como luego le ocurrió a Salomón.',
        verseSupport: 'Deuteronomio 17:16-17'
    },
    {
        id: 'deut_111',
        question: 'Previo a una guerra, ¿quién era el primero en hablar con los soldados para animarlos y recordar a Dios?',
        options: ['Un sacerdote', 'El trompetero', 'El general de división', 'El rey directamente'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'El sacerdote inspiraba confianza en Jehová "porque Él pelea por vosotros".',
        verseSupport: 'Deuteronomio 20:2-4'
    },
    {
        id: 'deut_112',
        question: 'Un soldado era eximido y mandado a casa por los oficiales si recientemente había construido una casa, viña y qué más?',
        options: ['Era hijo único', 'Tenía menos de 30 años', 'Estaba desposado y aún no se había casado con ella', 'Si le temía a las arañas'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Se le daba tregua para que gozara de su vida antes de morir o quedar truncada su estirpe.',
        verseSupport: 'Deuteronomio 20:7'
    },
    {
        id: 'deut_113',
        question: 'La ley castigaba apedreando a un "hijo contumaz" o rebelde incurable que tuviera vicios incorregibles de ser...',
        options: ['Perezoso y terco mentiroso', 'Glotón y borracho perverso', 'Mudo rebelde ciego', 'Fuerte malcriado'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Los padres avisaban a los ancianos extirpando así el mal del pueblo asombrándolos.',
        verseSupport: 'Deuteronomio 21:20'
    },
    {
        id: 'deut_114',
        question: 'En la ley de vestiduras, ¿qué prohíbe Dios mezclar textilmente en el hilo de la ropa?',
        options: ['Lana con lino', 'Seda y oro', 'Pieles de cordero con león', 'Algodón y lino azul'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Esta regla enseñaba indirectamente a no "mezclar" santidad y mundo.',
        verseSupport: 'Deuteronomio 22:11'
    },
    {
        id: 'deut_115',
        question: 'A los recién casados se les daba dispensa libre (sin reclutamientos bélicos) por plazo de...',
        options: ['40 días', '7 años de jubileo', 'Un mes', 'Un año completo para alegrar a su mujer'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Se mantenía libre de todo servicio público para fomentar fuerte arraigo en su nuevo hogar.',
        verseSupport: 'Deuteronomio 24:5'
    },
    {
        id: 'deut_116',
        question: 'En un castigo penal ordenado por jueces mediante azotes (latigazos), ¿cuál era el límite máximo estricto tolerado?',
        options: ['Cuarenta azotes', 'Siete latigazos grandes', 'Treinta azotes', 'Límite de lepra'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Para que el hermano no quedara "envilecido" o asesinado, no podían exceder 40. (Normalmente daban 39).',
        verseSupport: 'Deuteronomio 25:3'
    },
    {
        id: 'deut_117',
        question: 'En las maldiciones del Monte Ebal, "Bendito serás tú en la ciudad..." y completaba luego...',
        options: ['Y en el templo de piedra', 'Y bendito serás en el campo', 'Y rico entre forasteros', 'Sano de todo pie'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Abarcaba a un judío obediente en todo aspecto terrenal exterior habitual de trabajo.',
        verseSupport: 'Deuteronomio 28:3'
    },
    {
        id: 'deut_118',
        question: 'Moisés subió a la cumbre de un monte específico en Pisga para morir. ¿Cuál fue el nombre del gran monte?',
        options: ['Monte Carmelo', 'Abarim o monte Nebo', 'Sion', 'Sinaí Mayor'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Allí Jehová le mostró la inmensa extensión terrenal de la tierra lejana y sus fronteras.',
        verseSupport: 'Deuteronomio 34:1'
    },
    {
        id: 'deut_119',
        question: 'Moisés murió de viejo asombrosamente. Tenía 120 años; pero su vista y vigor estaban...',
        options: ['Completamente desgastados y ciego', 'Alegremente cantando himnos', 'Sus ojos sin oscurecerse y no perdió el vigor físico', 'Sordos y ancianamente rotos'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Fue vigoroso hasta su último minuto físico. Su visión seguía perfecta.',
        verseSupport: 'Deuteronomio 34:7'
    },
    {
        id: 'deut_120',
        question: '¿Por qué ninguna persona en la historia ha sabido el sepulcro exacto de Moisés?',
        options: ['Fue quemado', 'Los ángeles borraron el recuerdo', 'Fue enterrado por Jehová mismo en un valle de Moab', 'Caleb y Josué escondieron las cenizas en arena'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Dios en persona sepultó en secreto su cuerpo para prevenir que Israel le adorara como reliquia.',
        verseSupport: 'Deuteronomio 34:6'
    },

    // --- NIVEL 3: APÓSTOL (15 Preguntas) ---
    {
        id: 'deut_201',
        question: 'Al hablar del rey Og (de Basán), Moisés cita curiosamente el inmenso tamaño de la cama del gigante. ¿Cuánto medía (en codos)?',
        options: ['Siete codos de largo', 'Nueve codos de longitud y cuatro de anchura', 'Tres codos altos', 'Doce codos colosales'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Cama enorme de hierro con dimensiones gigantes (aprox. 4 por 1.8 metros) atestiguando su raza de "refaítas".',
        verseSupport: 'Deuteronomio 3:11'
    },
    {
        id: 'deut_202',
        question: 'A las "Diez Palabras" (Mandamientos), Dios las comunicó hablando desde el fuego en... ¿cómo se llama a ese monte en Deuteronomio muchas veces?',
        options: ['El Abarim calizo', 'El cerro de Amorreos', 'Horeb (asimilado a Sinaí)', 'El collado de Gad'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'El texto nombra repetidas veces a Horeb como punto focal de la aparición estruendosa del fuego y nube teofánica.',
        verseSupport: 'Deuteronomio 4:10-15'
    },
    {
        id: 'deut_203',
        question: 'Mandamiento a los padres: al escribir las leyes, ¿en qué punto físico exacto de sus viviendas debían rotularlas permanentemente?',
        options: ['En camas de hierro y pozos de lluvia', 'En los postes de sus casas, y en sus puertas', 'Bajo los cimientos de basalto de las entradas', 'En placas de bronce en techos asamblearios'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'De estas inscripciones provino la "Mezuzá" o rollito pegado a las entradas de hogares judíos.',
        verseSupport: 'Deuteronomio 6:9'
    },
    {
        id: 'deut_204',
        question: '¿Qué pueblo habitaba antes los montes de Seír ("Edom") que Esaú (los edomitas) expulsó para habitar allí históricamente antes que Israel?',
        options: ['Amorreos', 'Filisteos del occidente', 'Horeos', 'Moabitas altos'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Era una estirpe aborigen troglodita cueva ("Horeos" de las montanas seíriticas).',
        verseSupport: 'Deuteronomio 2:12'
    },
    {
        id: 'deut_205',
        question: 'En la prescripción del año de Jubileo / Remisión agraria; el siervo que por amor rechaza irse libre, ¿qué estigma ritual irreversible recibía?',
        options: ['Tatuaje formal facial en tinta', 'Le cortaban el meñique del pie', 'Le horadaban/perforaban la oreja en la puerta con una lesna', 'Anillo de oro esclavo sellado en la nariz recia'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Esta perforación visible indicaba pertenencia legal amorosa de servicio perpetuo.',
        verseSupport: 'Deuteronomio 15:17'
    },
    {
        id: 'deut_206',
        question: 'Al hablar de los animales impuros (Deut 14). Da el ejemplo de un animal que rumia pero no tiene pezuña hendida limpia:',
        options: ['El tejón rayado', 'El hipopótamo veloz', 'El camello, la liebre y el conejo', 'El reptil serpenteante'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Carecen de hendidura de pezuñas y fueron descartados como alimento levítico explícitamente.',
        verseSupport: 'Deuteronomio 14:7'
    },
    {
        id: 'deut_207',
        question: 'Según la justicia procesal rigurosa: un hombre solo podía ser condenado a muerte en un tribunal a partir de cuántos testigos?',
        options: ['Confiando en un vidente fiel', 'Por dicho de dos o tres testigos afines obligatorios', 'Siete sacerdotes unánimes', 'Con uno de familia de linaje cívica probada'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'En ningún juzgado de sangre valía un único testigo testimonial para impedir perjurios letales o sobornados mortificantes cívicos.',
        verseSupport: 'Deuteronomio 17:6'
    },
    {
        id: 'deut_208',
        question: 'En guerra de asedio, un israelita tenía estrictamente prohibido cortar o talar un grupo específico y peculiar de flora silvestre. ¿Cuál era?',
        options: ['Palmeras del sur', 'Árboles florales sin frutas', 'Árboles frutales útiles del campo', 'Los rosales sagrados'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'No destruirían comida futura, podían comer frutos pero no derribar la especie viva.',
        verseSupport: 'Deuteronomio 20:19'
    },
    {
        id: 'deut_209',
        question: 'Con la ley repulsiva del infame linaje: Ningún bastardo e hijos adulterinos se mezclarían en familia ni asamblea judía hasta la...',
        options: ['Tercera generación de nietos', 'Décima generación (para siempre social)', 'Siete lunas rojas completadas por sacerdotes', 'Año dorado jubilar'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'El castigo moral generacional afectaba hasta la décima, extirpando raíces corrompidas ilegítimas o paganas mixtas indeseadas comunitarias.',
        verseSupport: 'Deuteronomio 23:2'
    },
    {
        id: 'deut_210',
        question: 'Si un prestamista iba a cobrar empeño, le estaba sumamente vetado entrar a la casa por fuerza judía y tomar... ¿Qué objeto del molino no se empeñaba?',
        options: ['Ni las tablas ni la cama', 'La piedra del molino (la muela de arriba ni suela de abajo)', 'Bolsos de paja secos', 'Mantos viejos lamentosos'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Era el utensilio para comer o panificar, embargar la máquina era usurpar la vida misma literal.',
        verseSupport: 'Deuteronomio 24:6'
    },
    {
        id: 'deut_211',
        question: 'Ley del Levirato matrimonial: Si su cuñado viudo se negaba formalmente a revivir descendencia procreada, ¿qué le hacía ella ceremonialmente humillándolo frente a los ancianos?',
        options: ['Quita zapato de su pie, y escupe en su rostro frente al tribunal', 'Le arroja flechas despuntadas en la túnica superior', 'Desgarra velos solemnemente rompiendo cinturones dorados', 'Jura sin alzar rostro sollozando que nunca verá paz legal formal'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Ese hombre desposeído del deber y humillado pasaría a llamarse en Israel el "descalzado".',
        verseSupport: 'Deuteronomio 25:9'
    },
    {
        id: 'deut_212',
        question: 'En la ofrenda simbólico-histórica del sacerdote levita primicial, ¿cuál frase recitaba el adorador obligatoriamente sobre su antepasado Jacob?',
        options: ['Judío errante de Ur fui', 'Un arameo a punto de perecer fue mi padre y descendió a Egipto', 'Rey y sabio nacido en Canaán libre y fuerte', 'Guerrero sin mancha fue mi raza'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Recordaba todo su inicio rústico humilde transhumante antes de volverse numeroso y asentado agrariamente como ahora próspero dador.',
        verseSupport: 'Deuteronomio 26:5'
    },
    {
        id: 'deut_213',
        question: 'Moisés les indica erigir piedras grandísimas encalándolas con yeso liso al pasar el Jordán por los montes... ¿Con qué motivo o propósito?',
        options: ['Quemar inciensos perennes en fogones lisos de cal blanda', 'Escribir literales leyes o palabras claras fuertemente legibles de la Ley allí encima en Ebal', 'Efigies humanas talladas de jefes antiguos como Aarón', 'Pilares defensivos bélicos cananeos adaptados formalmente'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Servía de gran monumento cívico con la Torá plasmada visible gigante y pintorescamente en el mismo monte Ebal formal.',
        verseSupport: 'Deuteronomio 27:2-4'
    },
    {
        id: 'deut_214',
        question: 'Entre las maldiciones dadas (Capítulo 28), si desobedecían caerían en las famosas de Egipto cívicamente. ¿Cuáles de ellas cita?',
        options: ['Lluvia roja y serpientes', 'Úlcera de Egipto, tumores, sarna, comezón pestilencial ciego y demente incurable', 'Sequía eterna mortal que secaba ríos enteros de faraones impíos asombrosos', 'Hambre de hierro forjante pesado cananeo rudo'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Fueron afecciones médicas epidérmicas psíquicas letales recordadas de las plagas fustigantes faraónicas imborrables.',
        verseSupport: 'Deuteronomio 28:27'
    },
    {
        id: 'deut_215',
        question: 'La alabanza poética inspiradísima de Moisés describe el accionar del Altísimo guiando a bendecir o amparar a Israel con un ave precisa silvestre protectora...',
        options: ['Como la perdiz alerta llamando a sus crías', 'Como el águila que excita su nidada y revolotea sobre sus pollos llevándolos', 'Como la paloma inmaculada blanca pacífica y dócil', 'Como el halcón fiero veloz atacante del enemigo'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'La figura del poder e íntimo amparo de Dios portando su ala firme debajo a la cría inexperta resalta vívidamente.',
        verseSupport: 'Deuteronomio 32:11'
    }
];

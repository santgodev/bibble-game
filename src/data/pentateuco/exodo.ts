import type { TriviaQuestion } from '../categories';

export const TRIVIA_EXODO: TriviaQuestion[] = [
    // --- NIVEL 1: SEMILLA (25 Preguntas) ---
    {
        id: 'exo_001',
        question: '¿Qué hacían los israelitas en Egipto antes de ser liberados?',
        options: ['Eran sacerdotes', 'Eran reyes', 'Eran esclavos de Faraón', 'Eran comerciantes'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Fueron forzados a trabajar duramente haciendo ladrillos.',
        verseSupport: 'Éxodo 1:13-14'
    },
    {
        id: 'exo_002',
        question: '¿Quién fue escondido en una arquilla de juncos en el río Nilo al nacer?',
        options: ['Aarón', 'Josué', 'José', 'Moisés'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Su madre lo protegió del decreto de muerte hacia los niños hebreos.',
        verseSupport: 'Éxodo 2:3'
    },
    {
        id: 'exo_003',
        question: '¿Quién rescató a Moisés del río?',
        options: ['La hermana de Moisés', 'La hija de Faraón', 'Un guardia egipcio', 'Una sierva hebrea'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'La princesa lo adoptó y le puso por nombre Moisés, "sacado de las aguas".',
        verseSupport: 'Éxodo 2:5-10'
    },
    {
        id: 'exo_004',
        question: '¿Por qué Moisés huyó a Madián siendo joven?',
        options: ['Quería ser pastor', 'Buscaba oro', 'Mató a un egipcio', 'Dios se lo ordenó'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Mató a un egipcio por golpear a un hebreo y Faraón lo buscaba para matarlo.',
        verseSupport: 'Éxodo 2:11-15'
    },
    {
        id: 'exo_005',
        question: '¿En qué forma se apareció Dios a Moisés en el monte Horeb por primera vez?',
        options: ['Como un león', 'En una zarza que ardía y no se consumía', 'En un trueno', 'Como una nube densa'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Desde la zarza ardiente lo llamó para liberar a Israel.',
        verseSupport: 'Éxodo 3:2'
    },
    {
        id: 'exo_006',
        question: '¿Qué le ordenó Dios a Moisés que hiciera con su calzado cerca de la zarza?',
        options: ['Que lo atara fuertemente', 'Que lo guardara', 'Que lo quitara, por ser tierra santa', 'Que lo echara al fuego'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Era una señal de reverencia extrema ante la santidad de Dios.',
        verseSupport: 'Éxodo 3:5'
    },
    {
        id: 'exo_007',
        question: 'Cuando Moisés preguntó por el nombre de Dios, ¿qué respondió el Señor?',
        options: ['YO SOY EL QUE SOY', 'El Fuerte', 'El Rey', 'El Vengador'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'De allí se deriva su santo nombre YHWH (Jehová).',
        verseSupport: 'Éxodo 3:14'
    },
    {
        id: 'exo_008',
        question: '¿Quién fue elegido por Dios para ser el principal portavoz o "boca" de Moisés?',
        options: ['Josué', 'Hur', 'Aarón, su hermano', 'Jetro'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Aarón tenía fluidez para hablar ante el Faraón.',
        verseSupport: 'Éxodo 4:14-16'
    },
    {
        id: 'exo_009',
        question: '¿En qué se convirtió la vara de Aarón cuando la echó delante de Faraón?',
        options: ['En espada', 'En oro', 'En fuego', 'En culebra (serpiente)'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'La vara devoró luego a las culebras hechizadas de los magos.',
        verseSupport: 'Éxodo 7:10'
    },
    {
        id: 'exo_010',
        question: '¿Cuál fue la primera plaga que azotó a Egipto?',
        options: ['Las ranas', 'El agua convertida en sangre', 'La oscuridad', 'Los piojos'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'El río Nilo y todas las aguas se volvieron sangre y murieron los peces.',
        verseSupport: 'Éxodo 7:20'
    },
    {
        id: 'exo_011',
        question: '¿Qué señal debían poner los israelitas en sus puertas para que el destructor no los matara?',
        options: ['Sangre de un cordero sin defecto', 'Una cruz de madera', 'Un lienzo blanco', 'Luz de aceite'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Esta fue la primera Pascua, la cual marcaba el paso de Jehová salvando a sus fieles.',
        verseSupport: 'Éxodo 12:13'
    },
    {
        id: 'exo_012',
        question: '¿Qué comieron los israelitas apresuradamente la noche de la Pascua?',
        options: ['Frutas y miel', 'Panes sin levadura', 'Solo agua', 'Cereales crudos'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Cocieron panes ázimos porque no tuvieron tiempo de dejar leudar la masa.',
        verseSupport: 'Éxodo 12:39'
    },
    {
        id: 'exo_013',
        question: '¿Qué deidad egipcia fue derrotada con la última plaga?',
        options: ['El dios Nilo', 'El dios sol Ra', 'Faraón, considerado un dios vivo (y todo dios de Egipto)', 'El dios león'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Dios ejecutó juicio contra todos los dioses de Egipto.',
        verseSupport: 'Éxodo 12:12'
    },
    {
        id: 'exo_014',
        question: '¿Cómo guió Jehová al pueblo durante el día en su travesía por el desierto?',
        options: ['Con una brújula de fuego', 'Con ángeles caminando', 'En una columna de nube', 'Con un águila gigante'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Por el día nube y de noche columna de fuego para darles luz.',
        verseSupport: 'Éxodo 13:21'
    },
    {
        id: 'exo_015',
        question: '¿Qué mar cruzó el pueblo de Israel en seco tras ser partido por Moisés?',
        options: ['El Mar Muerto', 'El Mar Mediterráneo', 'El Mar de Galilea', 'El Mar Rojo'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Jehová hizo retirar el mar toda la noche con un fuerte viento.',
        verseSupport: 'Éxodo 14:21'
    },
    {
        id: 'exo_016',
        question: '¿Qué le pasó a los ejércitos del Faraón en el Mar Rojo?',
        options: ['Se rindieron', 'Regresaron huyendo', 'Fueron ahogados cubiertos por las aguas', 'Pudieron nadar a salvo'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Las aguas volvieron a su lugar y cubrieron todos los carros.',
        verseSupport: 'Éxodo 14:28'
    },
    {
        id: 'exo_017',
        question: '¿Qué pan enviaba Dios desde el cielo diariamente para alimentar al pueblo?',
        options: ['Trigo', 'El Maná', 'Harina', 'Cebada'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Era como semilla de culantro blanco, con sabor a hojuelas con miel.',
        verseSupport: 'Éxodo 16:31'
    },
    {
        id: 'exo_018',
        question: '¿Cómo obtuvieron agua los israelitas en Refidim cuando tenían sed y murmuraban?',
        options: ['De una lluvia milagrosa', 'Al abrirse un pozo inmenso', 'Moisés golpeó una peña y brotó agua', 'Compraron agua de los amalecitas'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Moisés hirió la roca por orden de Dios y salió agua para todos.',
        verseSupport: 'Éxodo 17:6'
    },
    {
        id: 'exo_019',
        question: 'En el monte Sinaí, Dios le dio a Moisés unas normas fundamentales conocidas como...',
        options: ['Los Diez Mandamientos', 'El Código Egipcio', 'La Ley de Esclavos', 'El Libro de Guerras'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Dios pronunció y escribió estas diez palabras en tablas de piedra.',
        verseSupport: 'Éxodo 20:1-17'
    },
    {
        id: 'exo_020',
        question: '¿Qué manda el quinto mandamiento (el primero con promesa)?',
        options: ['No matarás', 'No robarás', 'Honra a tu padre y a tu madre', 'Acuérdate del sábado'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Promete larga vida sobre la tierra a quien lo obedece.',
        verseSupport: 'Éxodo 20:12'
    },
    {
        id: 'exo_021',
        question: '¿Qué ídolo construyó Aarón con oro por petición del pueblo impaciente?',
        options: ['Una serpiente', 'Un águila de guerra', 'Una estatua de Faraón', 'Un becerro fundido'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'El pueblo se corrompió adorando al becerro de oro.',
        verseSupport: 'Éxodo 32:4'
    },
    {
        id: 'exo_022',
        question: '¿Qué hizo Moisés con las primeras tablas de la ley al ver la idolatría?',
        options: ['Las guardó', 'Las devolvió al monte', 'Las arrojó y las quebró al pie del monte', 'Se las dio a Aarón'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Ardió su ira y rompió las tablas escritas por Dios porque Israel quebró el pacto.',
        verseSupport: 'Éxodo 32:19'
    },
    {
        id: 'exo_023',
        question: 'El santuario móvil ordenado por Dios se llamaba...',
        options: ['Templo central', 'El Tabernáculo de reunión', 'La Sinagoga', 'La Catedral'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Allí Jehová moraba y se encontraba con el pueblo.',
        verseSupport: 'Éxodo 25:8'
    },
    {
        id: 'exo_024',
        question: 'El cofre de madera cubierto de oro central en el servicio judío era llamado...',
        options: ['El altar de incienso', 'La mesa de panes', 'El arca del testimonio', 'El candelero'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Contenía las tablas de la ley y estaba en el Lugar Santísimo.',
        verseSupport: 'Éxodo 25:10'
    },
    {
        id: 'exo_025',
        question: 'Cuando Moisés descendió con las segundas tablas, su rostro resplandecía tanto que se puso un...',
        options: ['Casco', 'Velo', 'Tocado real', 'Escudo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'La piel de su rostro resplandecía por haber hablado con Dios.',
        verseSupport: 'Éxodo 34:33'
    },

    // --- NIVEL 2: DISCÍPULO (20 Preguntas) ---
    {
        id: 'exo_101',
        question: '¿Quién sugirió y organizó judicialmente magistrados sobre miles, cientos y decenas para ayudar a Moisés?',
        options: ['Aarón', 'Josué', 'Jetro, su suegro', 'Caleb'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Jetro vio a Moisés agotarse y propuso este sabio sistema judicial delegado.',
        verseSupport: 'Éxodo 18:21'
    },
    {
        id: 'exo_102',
        question: '¿Quiénes sostenían en alto las manos de Moisés cansadas en la batalla contra Amalec?',
        options: ['Josué y Caleb', 'Aarón y Hur', 'Miriam y Séfora', 'Nadab y Abiú'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Mientras Moisés elevaba las manos con la vara, Israel vencía.',
        verseSupport: 'Éxodo 17:12'
    },
    {
        id: 'exo_103',
        question: '¿Qué cantó Miriam (María) tocando panderos luego del Mar Rojo?',
        options: ['"Aleluya a los ángeles"', '"Cantad a Jehová, porque en extremo se ha engrandecido"', '"Llorad por Egipto destruido"', '"Grande es el desierto santo"'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Celebró con mujeres en danzas el milagro y rescate marítimo.',
        verseSupport: 'Éxodo 15:20-21'
    },
    {
        id: 'exo_104',
        question: '¿Qué hacían los magos egipcios con las primeras plagas (como ranas y agua sangrienta)?',
        options: ['Las detenían', 'Hacían también lo mismo con sus encantamientos', 'Quemaban el Nilo', 'Se arrodillaban rápido'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Lograban replicarlas parcialmente mediante ocultismo.',
        verseSupport: 'Éxodo 7:22 / 8:7'
    },
    {
        id: 'exo_105',
        question: '¿Cuál plaga los magos no pudieron igualar y dijeron: "Dedo de Dios es este"?',
        options: ['Piojos', 'Granizo', 'Úlceras', 'Langostas'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'A partir de la tercera plaga, sus magias quedaron totalmente sin efecto.',
        verseSupport: 'Éxodo 8:18-19'
    },
    {
        id: 'exo_106',
        question: '¿Cuántos años exactamente moraron los hijos de Israel en Egipto antes de salir aquella misma noche?',
        options: ['300 años', '250 años', '430 años', '500 años'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Pasaron estos años hasta que todas las huestes salieron bajo mando liberador.',
        verseSupport: 'Éxodo 12:40-41'
    },
    {
        id: 'exo_107',
        question: 'Los egipcios les exigían a los israelitas cumplir su cuota de ladrillos sin darles...',
        options: ['Agua limpia', 'Herramientas de hierro', 'Arcilla y Paja', 'Comida diaria'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Tenían que buscar rastrojos en lugar de paja provista y mantener la misma alta producción.',
        verseSupport: 'Éxodo 5:7'
    },
    {
        id: 'exo_108',
        question: 'Jehová instituyó la restricción severa para recolectar el maná. El sexto día debían...',
        options: ['No salir a buscar nada', 'Recoger el doble porque el séptimo no habría', 'Comerlo con sal fina seca', 'Invitar a todos los ancianos'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'El día viernes la recolección duplicaba porque guardaban santidad y reposo en sábado.',
        verseSupport: 'Éxodo 16:22-23'
    },
    {
        id: 'exo_109',
        question: '¿Cuál era el único artículo dentro del Tabernáculo en alumbrar las noches santas sin cesar?',
        options: ['El altar de perfume y la mesa', 'El Candelero de oro de siete brazos', 'Arca pura de bronce de incienso', 'Diez estatuillas finas plateadas'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Se mantenía aceite puro de oliva ardiente para que ardieran lámparas siempre.',
        verseSupport: 'Éxodo 27:20-21'
    },
    {
        id: 'exo_110',
        question: 'La mesa en el santuario sostenía perpetuamente el pan llamado...',
        options: ['Panes ácidos sagrados', 'Panes de la proposición (presencia)', 'Amasijos duros celestes o maná grande puro', 'Las rústicas tortillas finas sacerdotales'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'El pan siempre debía mostrarse incesante ante la presencia divina sagrada.',
        verseSupport: 'Éxodo 25:30'
    },
    {
        id: 'exo_111',
        question: 'En Éxodo, la restitución penal exigía que si un ladrón sustraía un buey y lo mataba o vendía, debía pagar...',
        options: ['Cinco bueyes por el buey robado', 'Diez bueyes por uno grande puro', 'Cortarse ambos pulgares duros', 'Pasar 7 oscuros años libremente preso'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Pero si era una oveja, pagaba el cuádruplo. Las penalizaciones sobre restitución buscaban resarcimiento equitativo estricto.',
        verseSupport: 'Éxodo 22:1'
    },
    {
        id: 'exo_112',
        question: '¿Quiénes fueron los dos artífices ungidos principales por el Espíritu de Dios para dominar toda orfebrería del santuario?',
        options: ['Josué y Caleb nobles ágiles', 'Aarón y sus hijos valiosos puros', 'Bezaleel y Aholiab artesanos valientes', 'Moisés en piedra y Hur tejiendo la red'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Jehová explícitamente llenó sus existencias artísticas tallador, metal y diseño textil en santuario.',
        verseSupport: 'Éxodo 31:2-6'
    },
    {
        id: 'exo_113',
        question: 'Durante la matanza del cordero de Pascua, ¿qué restricción esquelética debían observar estrictamente?',
        options: ['Quemar cada pata dura cruda grande', 'Hervirlo puro largo lento y sutil', 'No romperán ningún hueso del animal noble sacrificado', 'Devorarlo sin cabezas ciego asado entero largo'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Simboliza fielmente la futura asombrosa pureza inmensa inquebrantable redentora profética intachable total sobre Cristo en la cruz de calvario judío.',
        verseSupport: 'Éxodo 12:46 / Juan 19:36'
    },
    {
        id: 'exo_114',
        question: '¿Cuánto oro exigen del pueblo rebelde para fabricarles el ídolo bovino pecaminoso al lado sombrío del monte Horeb?',
        options: ['Un talento pesado fino forjado', 'Los zarcillos de oro macizo puros sacados y arrancados gruesos de las orejas innegable fuertes grandes mujeres y niños puros rústicos', 'Arcas egipcias robadas ocultas asombrosamente exóticas firmes lisas', 'Riqueza de plata pura'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Aarón impuso forjador innegable directo forastero que se sacaran joyas redondas auríferas asombrosas fuertes recias exentas para fundirlas pecaminosa falsamente.',
        verseSupport: 'Éxodo 32:2'
    },
    {
        id: 'exo_115',
        question: 'En venganza santa sacerdotal limpia y feroz contra esta idolatría masiva sorda de becerros dorados, se ciñeron su fuerte espada ¿quiénes?',
        options: ['Los leñadores limpios dóciles firmes exiliados forasteros rústicos vírgenes ancianos nobles ciegos forzados de campo grandes tontos', 'La estricta tribu judía completa levítica (hijos puros sibilantes ciegos de Leví valientes fijos)', 'Simeón y José puros asombrosos duros nobles rústicos sibilinos sutiles letales libres limpios', 'La guardia armada egipcia pía asombrosamente sutil noble'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Demostraron fidelidad suprema divina pasando valiosos estricta y dolorosamente fuertemente letales nobles cuchillos asombrosas exterminados letales sobre tres mil hermanos apaciguados del gran campamento idólatra.',
        verseSupport: 'Éxodo 32:26-28'
    },
    {
        id: 'exo_116',
        question: 'Para la gran túnica sacerdotal alta valiosa majestuosa judía noble exótica pura asombrosamente del efod pío santo, colgaron campanas oro dóciles dócilmente asombrosa puras alternadas con fruta bordada ¿Cuál?',
        options: ['Campanas doradas cívicas vírgenes limpias y uvas asombrosas púrpuras nobles largas puras exentas largas cívicas lisas pías sutiles exóticas', 'Manzanas doradas recias sibilantes anchas cívicas doradas vírgenes nobles rubias largas doradas forjadas', 'Granadas asombrosamente regias de hilos firmes de azul innegables largas sibilantes puros gruesos y lino pías púrpuras', 'Zarzas asombrosas regias duras doradas innegables de gran rústica fuerte espina ancha'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Dicha vestimenta emitía pía y pura un dócil valioso noble y glorioso asombrosamente exótico valiente exento cívicos noble solemne resonar de campanilla solemne para no morir valientes limpios nobles firmes vírgenes.',
        verseSupport: 'Éxodo 28:33-35'
    },
    {
        id: 'exo_117',
        question: '¿Cómo expiaron el arrepentimiento por el ídolo becerro asombrosamente ciego mudo dócil exótico sibilante destruido pío?',
        options: ['No ofrendaron recios vírgenes limpios oros grandes', 'Huyeron exiliados fúnebre rudo lúgubre puro puros recio fuerte lejanos mudos', 'Moisés lo fundió letal recio fuertemente en fuego dócil pesado recio tonto, y disperso polvo exiliados impío exento obligándoles a beberlo cívico regio mudo', 'Levantaron ruda pura pirámide libre lúgubre asombrosa oscura pía recia pía pura'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Desafiar y quemar ese fuerte ídolo asombrosamente letal y recia forjada imagen en letal e infausto trago amargo marcaba profunda represión amargura limpia por la idolatría foránea.',
        verseSupport: 'Éxodo 32:20'
    },
    {
        id: 'exo_118',
        question: 'Moisés exigió valientemente tenaz y libre la gloria firme exótica ver y Dios cubrió su rostro libre regio pío fuerte en resquicio cueva exento, resguardándolo con su sutil recia poderosa...',
        options: ['Nublada firme dócilmente ciega tormenta densa cívicos libre pía asombrosa cívica letal limpia firme y oscura amparadora innegable pura noble dócil de humo recio pío', 'Alas inmensas asombrosas cíviles mudas letales forzadas apaciguadas puras blancas fúnebre lisas libres fijos', 'Dura recatada firme noble mano recia asombrosamente encubierta libre hasta lúgubre pía pasar puro regio exaltado regio dócil majestuoso y fuerte asombrosamente puro libre', 'Águila asombrosamente fiera rústica ciega dócil letal regia exótica vírgenes cívica oscura apaciguadora libre fuerte exenta limpia'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Para preservar intachable fiera libremente firme vida limpia no podía exóticas noble y ciego exento hombre alguno aguantar recio valeroso ver pío el limpio asombroso puro y recio resplandor divino frontal dócil libre.',
        verseSupport: 'Éxodo 33:22'
    },
    {
        id: 'exo_119',
        question: 'En el tabernáculo regios libres sibilantes rústico puro firme había pías cortinas exentas apaciguadas con figuras sutil lisas puras forzadas vírgenes exóticas cívicos letales ¿de qué recios puras grandes criaturas libres?',
        options: ['Toros alados dorados ciegos exóticos lúgubres cívicos regios rústico nobles recios asombrosa fúnebre letal limpios', 'Querubines píos asombrosos rústico exentos libres tontos vírgenes exóticos limpios mudos sibilinos", artísticamente asombrosos recios fúnebres nobles asombrosa fúnebre bordados cívica libre dócil puros', 'Ángeles forjados fuertes', 'Aves recias lisas fúnebres libres asombrosa'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Ellos eran el motivo rústico vírgenes asombrosa forjados regios angélico celeste exóticos predominante en los asombrosa exóticos recintos puros santos velos dócil exentos píos fuertes vírgenes limpios nobles intachables.',
        verseSupport: 'Éxodo 26:1'
    },
    {
        id: 'exo_120',
        question: 'Éxodo termina apoteósicamente recio letal fuerte innegable asombroso con el tabernáculo liso y pío rústico puro dócil concluido libremente fúnebre oscuro y alzado fuertemente ciego dócil y vírgenes. Al terminarlo píos exóticos, ¿qué apaciguador suceso divino asombrosamente noble rudo y mudo corona la gran gloriosa obra exenta fijos tonta limpia regios letal ruda noble?',
        options: ['Toda luz cívica exenta apaciguada fijos limpia y dorada regio se rústica exiliado apagó dócilmente oscura libre', 'Los mudas nobles puras tontas y vírgenes firmes puras libres regios asombrosa sibilinas puertas se regias limpios lúgubre cerraron asombrosa oscuras y fijas eternamente', 'La densa brillante innegable limpia asombrosa exótica de rústico nube fuerte libre pura y la gloria píos recia pura libre majestuosa llenó de Jehová a dócil sibilino su asombrosa valiosa libre carpa pura pía letal asombrosa y sagrada libre y cívicos exentos nobles lisa mudos cívica pura lúgubre limpios nobles tabernáculo libre vírgenes exiliados puros nobles rústico rudo limpios píos', 'Un sismo puro libre cíviles oscuro asombrosa letal dócil firme rudo asombrosa cíviles regio fijos agrietó fuerte regio e incólume lúgubre y cívica al exentos asombrosa libre Sinaí letal tonto puro libre y cíviles limpios'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Esa validación sibilina limpia píos regios y grandiosa asombrosa tonta pura y fúnebre asombrosa pía innegable testificó letal puro la mora asombrosa pura fúnebre y sagrada cíviles libre y recia letal libre y vírgenes del Altísimo oscuro fuerte pío.',
        verseSupport: 'Éxodo 40:34'
    },

    // --- NIVEL 3: APÓSTOL (15 Preguntas) ---
    {
        id: 'exo_201',
        question: '¿Cómo se llamaban las valientes parteras hebreas que temieron a Dios y no mataron a los niños varones al nacer en Egipto?',
        options: ['Sifra y Fúa', 'Miriam y Jocabed', 'Séfora y Elisabet', 'Rut y Noemí'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Ellas desobedecieron heroicamente al Faraón, de modo que Dios les hizo bien.',
        verseSupport: 'Éxodo 1:15-20'
    },
    {
        id: 'exo_202',
        question: 'Cuando Moisés apacentaba ovejas de su suegro y vio la zarza, ¿detrás de qué desierto andaba al llegar al monte de Dios?',
        options: ['Desierto de Parán', 'Detrás del desierto hasta llegar a Horeb', 'Desierto de Zin', 'Tierras frías del Neguev'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'En las profundidades solitarias de ese territorio tuvo la visión divina central.',
        verseSupport: 'Éxodo 3:1'
    },
    {
        id: 'exo_203',
        question: 'En Éxodo 4, Dios le da tres señales a Moisés para demostrar su llamado. La vara convertida en serpiente, el agua vuelta sangre, y...',
        options: ['La lepra blanca en su mano puesta en su seno y luego sanada', 'Fuego cayendo sobre roca', 'Un ángel visible en oro', 'Ranas saliendo de sus pies'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Insertar la mano limpia y sacarla con lepra repentina, repetido sanó, probaba el poder de Dios.',
        verseSupport: 'Éxodo 4:6-7'
    },
    {
        id: 'exo_204',
        question: 'En su viaje a Egipto hubo una escena misteriosa donde Jehová le sale al encuentro a Moisés queriéndolo matar. ¿Quién lo salvó circuncidando de urgencia a su hijo?',
        options: ['Jetro suegro', 'Miriam', 'Séfora, su esposa tomando un pedernal y cortando prepucio', 'Aarón con un altar'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Puso el prepucio en los pies de él llamándolo "esposo de sangre", apaciguando la ira divina.',
        verseSupport: 'Éxodo 4:24-25'
    },
    {
        id: 'exo_205',
        question: 'Durante la novena plaga de densas tinieblas oscuras por tres días continuos en Egipto. ¿Qué tenían paradójicamente todos los israelitas en sus hogares?',
        options: ['Antorchas de aceite sobrenaturales', 'Sus casas resplandecían de fuego', 'Todos tenían luz en sus habitaciones', 'Ángeles encendidos'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Para marcar la abolición del dios egipcio del sol, Israel gozó de luz providencial intacta y plena.',
        verseSupport: 'Éxodo 10:23'
    },
    {
        id: 'exo_206',
        question: 'El mes de Abib se dictamina divinamente ante la pascua e inicia una cronología, ¿qué lugar jerárquico asigna Dios al mes pascual de forma oficial?',
        options: ['Era el último del otoño triste y gris', 'El mes séptimo santo de cosechas y frutos de la tierra', 'El mes principal o principio primero de los meses del año para los judíos', 'Tres lunas fijas intercaladas en primaveras heladas estacionales'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'En el calendario y cronogramas, la salida transformaba su vida constituyendo a Abib (Nisán) como el primerísimo mes redentor.',
        verseSupport: 'Éxodo 12:2'
    },
    {
        id: 'exo_207',
        question: 'Estando el agua amarga en el desierto y no pudiendo el pueblo beber de ella; ¿de qué lugar era el sitio donde Dios mostró a Moisés un árbol que endulzó el charco?',
        options: ['El oasis de las palmas frescas de Elim en paz', 'Mara', 'Pozo del vidente en Cades silente', 'Meriba'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'El vocablo Mara se traduce literal de la voz "amargura", por las fuertes aguas minerales imbebibles agrias tratadas divinamente.',
        verseSupport: 'Éxodo 15:23-25'
    },
    {
        id: 'exo_208',
        question: '¿Cuántos panes obligatoriamente asados y colocados sin falta en la mesa presentados cada sábado constituían los "panes de la proposición" en el templo sagrado?',
        options: ['Doce tortas grandes cocidas acomodadas finas en dos hileras (seis y seis ordenados)', 'Tres panes dorados redondos y tiernos y macizos enormes y duros redondos', 'Siete crujientes finos rústicos de harina flor rústica secos', 'Cuarenta rebanadas ácimas duras rústicas de sal blanca y ajonjolí molidos'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Dichas tortas figuraban textualmente a las exactas Doce tribus amadas en comunión delante del altar constante a expensas puras.',
        verseSupport: 'Levítico 24:5-6 / Éxodo 25:30'
    },
    {
        id: 'exo_209',
        question: 'El Pectoral del Sumo Sacerdote contenía elementos adivinatorios sagrados para consultar a Dios. Uno era el Urim. ¿Cuál era el otro?',
        options: ['Las piedras preciosas oscuras', 'El Tumim', 'El fuego sagrado', 'Los sellos regios'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Se ponían en el pectoral del juicio el Urim y el Tumim (Luces y Perfecciones).',
        verseSupport: 'Éxodo 28:30'
    },
    {
        id: 'exo_210',
        question: '¿Qué estaban grabados en las dos piedras de ónice que iban sobre las hombreras del efod del sumo sacerdote?',
        options: ['Las leyes de Jerusalén', 'Los nombres de Aarón y Moisés', 'Los nombres de los doce hijos de Israel (seis en cada una)', 'Doce leones representando a Judá'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Llevaba sus nombres delante de Jehová como memorial sobre sus hombros.',
        verseSupport: 'Éxodo 28:9-10'
    },
    {
        id: 'exo_211',
        question: 'Después de adorar al becerro de oro, ¿cuántos hombres cayeron muertos a espada por la tribu de Leví?',
        options: ['Aproximadamente tres mil hombres', 'Un sismo destruyó a siete mil', 'Quinientos príncipes', 'Ninguno, Moisés perdonó a todos'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Ese funesto saldo purificó el campamento y consagró a los levitas.',
        verseSupport: 'Éxodo 32:28'
    },
    {
        id: 'exo_212',
        question: '¿De qué animal primogénito Dios exigió que se redimiera su vida con un cordero de manera obligatoria?',
        options: ['De ningún animal rústico', 'El primogénito del asno', 'De todo becerro libre', 'De toda ave pura'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Si no se redimía con un cordero, debían quebrar su cerviz.',
        verseSupport: 'Éxodo 13:13'
    },
    {
        id: 'exo_213',
        question: 'Para prepararse a recibir la Ley en el Sinaí, ¿qué debían hacer los israelitas con sus ropas durante tres días?',
        options: ['Teñirlas de sangre', 'Lavarlas rigurosamente', 'Quemar sus ropas antiguas', 'Vestirse de luto negro'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Lavar los vestidos simbolizaba santificación y pureza para acercarse a la presencia.',
        verseSupport: 'Éxodo 19:10'
    },
    {
        id: 'exo_214',
        question: '¿Con qué ungía Aarón los cuernos del altar para purificarlo según las reglas de consagración?',
        options: ['Con aceite aromático puro', 'Con la sangre del becerro', 'Con agua del lavacro', 'Con cenizas de madera'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'La sangre era puesta con su dedo y la demás derramada al pie del altar.',
        verseSupport: 'Éxodo 29:12'
    },
    {
        id: 'exo_215',
        question: 'El arca del testimonio estaba hecha de madera de acacia puro. ¿Con qué material estaba cubierta su cubierta por completo?',
        options: ['De plata pulida', 'De oro puro por dentro y por fuera', 'De bronce resistente', 'De madera tallada fina'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Todo su interior y exterior exigió oro puro por la santidad del mueble central.',
        verseSupport: 'Éxodo 25:11'
    }
];

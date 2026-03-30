import type { TriviaQuestion } from '../categories';

export const TRIVIA_NUMEROS: TriviaQuestion[] = [
    // --- NIVEL 1: SEMILLA (25 Preguntas) ---
    {
        id: 'num_001',
        question: '¿Qué gran actividad ordenó Dios a Moisés realizar al comienzo del libro de Números?',
        options: ['Construir murallas', 'Hacer un censo (contar al pueblo)', 'Luchar contra los egipcios', 'Cavar pozos de agua'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Dios mandó tomar la suma o censo de toda la congregación de Israel.',
        verseSupport: 'Números 1:2'
    },
    {
        id: 'num_002',
        question: 'En el censo, ¿a partir de qué edad se contaba a los hombres que podían ir a la guerra?',
        options: ['12 años', '18 años', '20 años para arriba', '30 años o más'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Fueron contados todos los varones de 20 años en adelante aptos para la guerra.',
        verseSupport: 'Números 1:3'
    },
    {
        id: 'num_003',
        question: '¿A qué tribu excluyó Dios de ser contada para ir a la guerra militar?',
        options: ['Judá', 'Simeón', 'Leví', 'Efraín'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'La tribu de Leví fue destinada exclusivamente al cuidado del tabernáculo.',
        verseSupport: 'Números 1:47'
    },
    {
        id: 'num_004',
        question: '¿Qué nube cubría el tabernáculo de día y cómo se veía de noche?',
        options: ['Nube de agua / Estrella fugaz', 'Nube normal / Tormenta eléctrica', 'Nube de día / Apariencia de fuego de noche', 'Nube negra / Como de hielo'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'La presencia de Jehová guiaba y daba sombra al campamento continuamente.',
        verseSupport: 'Números 9:15-16'
    },
    {
        id: 'num_005',
        question: '¿De qué material mandó Dios a Moisés hacer dos trompetas para convocar a la congregación?',
        options: ['Madera', 'Oro puro', 'Plata', 'Cobre'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Las dos trompetas de plata daban aviso unificado para levantar el campamento.',
        verseSupport: 'Números 10:2'
    },
    {
        id: 'num_006',
        question: 'Cuando el pueblo se quejó en el desierto por falta de carne, ¿qué ave les envió Dios en abundancia?',
        options: ['Codornices', 'Palomas', 'Pelícanos', 'Tórtolas'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Llegaron vientos del mar que trajeron codornices masivamente al campamento.',
        verseSupport: 'Números 11:31'
    },
    {
        id: 'num_007',
        question: '¿Qué familiar de Moisés murmuró contra él y fue castigado temporalmente con lepra?',
        options: ['Su padre Amram', 'Su esposa Séfora', 'Su hermana María', 'Su suegro Jetro'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'María y Aarón murmuraron contra él, y ella quedó blanca de lepra por siete días.',
        verseSupport: 'Números 12:10'
    },
    {
        id: 'num_008',
        question: '¿Cuántos hombres en total fueron enviados por Moisés a explorar o espiar la tierra de Canaán?',
        options: ['Dos', 'Cien', 'Doce', 'Siete'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Un príncipe de cada una de las doce tribus de Israel fue escogido.',
        verseSupport: 'Números 13:2-3'
    },
    {
        id: 'num_009',
        question: '¿Cómo describieron los espías la tierra después de explorarla?',
        options: ['Tierra seca y sin agua', 'Tierra que fluye leche y miel', 'Ciudad de oro', 'Oscura y llena de lobos'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Regresaron diciendo que verdaderamente fluía leche y miel, y mostraron sus frutos.',
        verseSupport: 'Números 13:27'
    },
    {
        id: 'num_010',
        question: '¿Quiénes fueron los únicos dos espías que animaron al pueblo a intentar conquistar la tierra?',
        options: ['Rubén y Gad', 'Caleb y Josué', 'Coré y Datán', 'Moisés y Aarón'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Mientras los otros diez atemorizaron al pueblo, ellos mantuvieron su fe en Dios.',
        verseSupport: 'Números 14:6-9'
    },
    {
        id: 'num_011',
        question: '¿Cuántos años castigó Dios a esa generación a vagar por el desierto por su incredulidad?',
        options: ['12 años', '40 años', '70 años', '7 años'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Un año por cada uno de los cuarenta días que usaron para espiar la tierra.',
        verseSupport: 'Números 14:34'
    },
    {
        id: 'num_012',
        question: '¿Qué líder, junto a Datán y Abiram, se rebeló abiertamente contra Moisés y Aarón?',
        options: ['Abol', 'Coré', 'Balac', 'Balaam'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Coré y sus seguidores quisieron tomar el sacerdocio por la fuerza.',
        verseSupport: 'Números 16:1-3'
    },
    {
        id: 'num_013',
        question: '¿Qué milagro usó Dios para confirmar a Aarón delante del pueblo, usando su vara personal?',
        options: ['Su vara se convirtió en agua', 'Su vara floreció y dio almendras', 'Su vara brilló', 'Su vara quemó el suelo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Brotaron renuevos, dio flores y arrojó almendras en el tabernáculo.',
        verseSupport: 'Números 17:8'
    },
    {
        id: 'num_014',
        question: 'Para purificar cosas inmundas, se ordenó usar cenizas de una becerra de color...',
        options: ['Blanca pura', 'Manchada de negro', 'Roja (alazana)', 'Gris clara'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Era la célebre becerra roja (alazana), sin defecto.',
        verseSupport: 'Números 19:2'
    },
    {
        id: 'num_015',
        question: 'Al faltarles agua, Dios le dijo a Moisés que hablara a la roca. En su enojo, ¿qué hizo él en realidad?',
        options: ['La ignoró', 'La golpeó dos veces con su vara', 'La rompió a la fuerza', 'Lloró sobre ella'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Este acto de desobediencia le costó la entrada a la Tierra Prometida.',
        verseSupport: 'Números 20:11'
    },
    {
        id: 'num_016',
        question: '¿A qué monte subió Aarón para morir y entregar sus vestiduras a su hijo Eleazar?',
        options: ['Al monte Carmelo', 'Al monte Hor', 'Al monte Moriah', 'Al monte Ebal'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Aarón murió en la cumbre del Monte Hor.',
        verseSupport: 'Números 20:25-28'
    },
    {
        id: 'num_017',
        question: 'Cuando el pueblo murmuró amargamente, ¿qué envió Jehová a morder al pueblo?',
        options: ['Leones del campo', 'Serpientes ardientes', 'Langostas', 'Osos enormes'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Las serpientes mortales mordieron a Israel en el desierto.',
        verseSupport: 'Números 21:6'
    },
    {
        id: 'num_018',
        question: 'Para que los heridos sanaran, Moisés levantó un estandarte. ¿Qué figura tenía colgada arriba?',
        options: ['Un ángel', 'Una estrella', 'Una serpiente de bronce', 'Un manto de fuego'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Cualquier mordido que miraba a la serpiente de bronce, vivía.',
        verseSupport: 'Números 21:9'
    },
    {
        id: 'num_019',
        question: '¿Qué rey de los moabitas, asustado por los israelitas, mandó llamar a un adivino?',
        options: ['Balac', 'Faraón', 'Sehón', 'Og'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Balac hijo de Zipor vio todo lo que Israel había hecho.',
        verseSupport: 'Números 22:2'
    },
    {
        id: 'num_020',
        question: '¿Cómo se llamaba el profeta adivino que fue sobornado para maldecir a Israel?',
        options: ['Balaam', 'Madián', 'Zimri', 'Caleb'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Balac le ofreció honores por maldecir al pueblo.',
        verseSupport: 'Números 22:5'
    },
    {
        id: 'num_021',
        question: 'Mientras viajaba hacia Balac, ¿qué animal de Balaam vio un ángel y le habló milagrosamente?',
        options: ['Su caballo', 'Su perro', 'Un león', 'Su asna'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Dios abrió la boca del asna para reprochar a Balaam.',
        verseSupport: 'Números 22:28'
    },
    {
        id: 'num_022',
        question: 'Al intentar maldecir a Israel, ¿qué puso Dios en la boca de Balaam repetidas veces?',
        options: ['Palabras de lluvia', 'Silencio', 'Terribles condenas', 'Palabras de gran bendición'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Dios no permitió la maldición y tuvo que bendecirlos tres veces seguidas.',
        verseSupport: 'Números 23:11'
    },
    {
        id: 'num_023',
        question: '¿Para qué servían las "Ciudades de Refugio"?',
        options: ['Almacenar tesoros', 'Guardar granos', 'Para refugiar al homicida involuntario', 'Eran mercados fuertes'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Eran lugares amparados para quien hubiese matado por accidente.',
        verseSupport: 'Números 35:11'
    },
    {
        id: 'num_024',
        question: '¿Quién fue señalado e investido oficialmente por Moisés para ser su sucesor?',
        options: ['Eleazar', 'Josué', 'Caleb', 'Gedeón'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Josué tenía el espíritu y Moisés impuso sobre él sus manos.',
        verseSupport: 'Números 27:18'
    },
    {
        id: 'num_025',
        question: '¿Qué dos tribus pidieron heredad en la orilla oriental del Jordán?',
        options: ['Rubén y Gad', 'José y Efraín', 'Aser y Neftalí', 'Amalec y Judá'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Junto a la media tribu de Manasés, se instalaron al oriente por la abundancia de sus rebaños.',
        verseSupport: 'Números 32:2'
    },

    // --- NIVEL 2: DISCÍPULO (20 Preguntas) ---
    {
        id: 'num_101',
        question: 'Al organizar el campamento, ¿qué tribu fue delegada al frente, hacia el oriente por donde sale el sol?',
        options: ['Dan', 'Efraín', 'Simeón', 'Judá'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Judá encabezaba la marcha como tribu principal hacia la salida del sol.',
        verseSupport: 'Números 2:3'
    },
    {
        id: 'num_102',
        question: 'El voto de los Nazareos prohibía tomar vino fuerte, rapar la cabeza y...',
        options: ['Tocar un cuerpo muerto', 'Usar telas finas', 'Comer cordero', 'Convivir con extranjeros'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Ni aún por la muerte de sus padres podía contaminarse tocando un cadáver.',
        verseSupport: 'Números 6:6-7'
    },
    {
        id: 'num_103',
        question: 'La famosa Bendición Sacerdotal inicia diciendo: "Jehová te bendiga, y..."',
        options: ['Te dé riqueza', 'Te guarde', 'Te libre de los enemigos', 'Te dé gran paz'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Esta es la llamada "Bendición Aarónica": "Jehová te bendiga y te guarde".',
        verseSupport: 'Números 6:24'
    },
    {
        id: 'num_104',
        question: '¿Qué le rogó Moisés a su suegro Hobab (madianita)?',
        options: ['Que fuera su guía en el desierto', 'Que enseñara tácticas', 'Que cocinara para ellos', 'Que leyera mapas'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Moisés reconocía que los conocimientos nómadas de Hobab ayudarían a situar los campamentos.',
        verseSupport: 'Números 10:31'
    },
    {
        id: 'num_105',
        question: '¿A cuántos ancianos reunió Moisés para que recibieran de Su Espíritu y lo ayudaran a juzgar?',
        options: ['Doscientos', 'Sesenta', 'Ciento veinte', 'Setenta ancianos'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'El número 70 consolidaba el consejo, derivando luego en el "Sanedrín".',
        verseSupport: 'Números 11:16'
    },
    {
        id: 'num_106',
        question: '¿Qué par de ancianos no acudieron a la cita pero terminaron profetizando públicamente en el campamento?',
        options: ['Uri y Caleb', 'Eldad y Medad', 'Hilel y Sadoc', 'Og y Sehón'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'El Espíritu posó repentinamente sobre estos dos varones que se quedaron en sus tiendas.',
        verseSupport: 'Números 11:26-27'
    },
    {
        id: 'num_107',
        question: 'Cuando Aarón y María hablaron contra Moisés, la Escritura dice que Moisés era muy...',
        options: ['Fuerte en la batalla', 'Manso, más que todos', 'Severo en sus juicios', 'Sabio como ninguno'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Esta nota ensalza la humildad y serenidad de Moisés ante la calumnia.',
        verseSupport: 'Números 12:3'
    },
    {
        id: 'num_108',
        question: 'Del valle de Canaán, los espías trajeron una fruta montada en un palo entre dos hombres. ¿Qué era?',
        options: ['Una sandía inmensa', 'Manzanas de oro', 'Un racimo de uvas', 'Higos gigantes'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Del arroyo de Escol cortaron este sarmiento singular tan grande.',
        verseSupport: 'Números 13:23'
    },
    {
        id: 'num_109',
        question: '¿A qué tribu de gigantes observaron espantados los espías en Canaán?',
        options: ['Los romanos', 'Los hijos de Anac (anaceos)', 'Los pigmeos', 'Los heteos'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Al contemplarlos, los diez espías desleales dijeron sentirse a su lado como "langostas".',
        verseSupport: 'Números 13:33'
    },
    {
        id: 'num_110',
        question: 'A la rebelión liderada por Coré, Datán y Abiram; ¿qué letal e instantáneo castigo les sobrevino?',
        options: ['Moscas los invadieron', 'Fueron quemados antes de hablar', 'La tierra abrió su boca y se los tragó vivos', 'Fueron decapitados'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Israel presenció perplejo cómo el suelo mismo descendió engulléndolos.',
        verseSupport: 'Números 16:32'
    },
    {
        id: 'num_111',
        question: 'En las "Aguas de Meriba", ¿cuál fue la acusación de Dios contra Moisés?',
        options: ['Por tirar el agua', 'Por pelear con el pueblo', 'Por no creer ni honrar a Dios', 'Por robar ofrendas'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Moisés no reverenció el accionar glorioso de Dios, sino que se enojó al darles el agua.',
        verseSupport: 'Números 20:12'
    },
    {
        id: 'num_112',
        question: 'Previo a cruzar el Jordán, Israel derrotó a algunos reyes famosos. ¿Cuál era el nombre del gigantesco rey de Basán?',
        options: ['Og', 'Sehón', 'Goliat', 'Agag'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Og de Basán, rey amorreo, fue derrotado y su territorio conquistado.',
        verseSupport: 'Números 21:33'
    },
    {
        id: 'num_113',
        question: 'Sabiendo que no podía maldecir a Israel, ¿qué construyó Balaam por los cerros para ofrecer sacrificios repetidas veces?',
        options: ['Cien fosas de piedra', 'Tres torres de madera', 'Siete altares', 'Una gran hoguera'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Balaam pedía altares esperando que sus sacrificios paganos torcieran el favor divino.',
        verseSupport: 'Números 23:1'
    },
    {
        id: 'num_114',
        question: 'Balac se enfureció tremendamente viendo su derrota ritual. ¿Cuántas veces en total bendijo Balaam indirectamente a Israel?',
        options: ['Diez veces', 'Tres veces', 'Siete veces', 'Continuamente'],
        correctIndex: 1,
        difficulty: 2,
        explanation: '"Ya lo has bendecido tres veces", se quejó Balac viendo su enorme revés.',
        verseSupport: 'Números 24:10'
    },
    {
        id: 'num_115',
        question: 'Con la apostasía en Baal-peor, ¿quién atravesó con su lanza a un judío y una madianita?',
        options: ['Aarón', 'Josué', 'Finees', 'Moisés'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'La justicia celosa impetuosa de Finees cortó de raíz el pecado general de fornicación.',
        verseSupport: 'Números 25:7-8'
    },
    {
        id: 'num_116',
        question: 'En el segundo gran censo (Números 26), ¿quiénes eran los únicos líderes sobrevivientes varones del primer censo?',
        options: ['Josué y Hur', 'Aarón y Moisés', 'Solo Moisés', 'Caleb y Josué'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Por quejarse, todos los mayores de la generación anterior murieron excepto ellos dos por su fe.',
        verseSupport: 'Números 26:65'
    },
    {
        id: 'num_117',
        question: 'Cinco hermanas cuyos padres murieron sin dejarles hermanos varones reclamaron herencia de tierras. Eran las famosas hijas de...',
        options: ['Jetro', 'Moisés', 'Zelofehad', 'Coré'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Sentaron jurisprudencia pionera cívica formal para la sucesión hereditaria femenina en Israel.',
        verseSupport: 'Números 27:1'
    },
    {
        id: 'num_118',
        question: 'Para la guerra contra los madianitas, ¿cuántos soldados se alistaron por cada tribu?',
        options: ['10,000 hombres', '100 hombres', '1,000 hombres (12,000 total)', '30,000 hombres'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Casi simbólico, fue un ejército uniforme enviado a ejecutar la santa venganza de Jehová sobre Madián.',
        verseSupport: 'Números 31:4'
    },
    {
        id: 'num_119',
        question: 'En la "Ciudad de Refugio", el homicida debía vivir allí amparado hasta...',
        options: ['El año de Jubileo', 'Pagar su deuda', 'La muerte del sumo sacerdote', 'Cumplir cinco años'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Solo con el fallecimiento del sumo sacerdote se abría la amnistía que le permitía regresar a su propia casa.',
        verseSupport: 'Números 35:28'
    },
    {
        id: 'num_120',
        question: 'Para completar el mapa de fronteras territoriales de Canaán hacia el occidente, ¿cuál famoso mar cerraba la frontera?',
        options: ['El Éufrates', 'El Mar Rojo', 'Los grandes lagos', 'El Mar Grande (Mediterráneo)'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Literalmente "el mar Grande y su costa" les serviría de límite hacia el oeste.',
        verseSupport: 'Números 34:6'
    },

    // --- NIVEL 3: APÓSTOL (15 Preguntas) ---
    {
        id: 'num_201',
        question: 'Con respecto a los levitas en sustitución de los primogénitos de Israel. Al contar a todos los levitas de un mes en adelante, ¿cuál fue su total inicial?',
        options: ['22,000 levitas', '35,000 levitas', '15,000 levitas', '12,000 levitas'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Los primogénitos sumaron 22,273, dejando 273 levitas faltantes para cubrir el total, por los cuales se pagó redención.',
        verseSupport: 'Números 3:39'
    },
    {
        id: 'num_202',
        question: 'Los tres grandes linajes levíticos tenían oficios pesados distintos. ¿A qué casa correspondía cargar las cortinas y tapices del tabernáculo?',
        options: ['Hijos de Coré', 'Descendientes de Coat', 'Descendientes de Gersón', 'Hijos de Merari'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Gersón operaba la tela, Coat los muebles sagrados, y Merari la madera y tablones.',
        verseSupport: 'Números 4:24-25'
    },
    {
        id: 'num_203',
        question: 'Para las personas inmundas por tocar muerto que no podían celebrar la Pascua, se les habilitó una "Pascua aplazada". ¿En qué mes?',
        options: ['El cuarto mes', 'El segundo mes (día 14)', 'Al otro año', 'El tercer mes'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Celebraban la misma fiesta, pero retrasados en el mes segundo.',
        verseSupport: 'Números 9:11'
    },
    {
        id: 'num_204',
        question: 'Cuando el Arca del Pacto partía. ¿Qué exclamaba Moisés de manera solemne?',
        options: ['Alégrate nación', 'Canten oh hijos de Judá', 'Cierra los ojos impíos', 'Levántate, Jehová, y sean dispersados tus enemigos'],
        correctIndex: 3,
        difficulty: 3,
        explanation: 'Invocaba que la presencia de Dios marchara al frente abriendo camino.',
        verseSupport: 'Números 10:35'
    },
    {
        id: 'num_205',
        question: 'Debido a sus incesantes quejas, el fuego de Jehová encendió un extremo de campamento. ¿Cómo se llamó aquel sitio?',
        options: ['Meriba', 'Mara', 'Tabera', 'Masah'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Tabera significa "Fuego" o "Incendio".',
        verseSupport: 'Números 11:3'
    },
    {
        id: 'num_206',
        question: '¿De qué origen era la mujer de Moisés por la que Aarón y María hablaron contra él?',
        options: ['Cusita (de Cus)', 'Filistea', 'Moabita', 'Cananea'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Su matrimonio con una mujer cusita detonó celos y crítica de sus hermanos.',
        verseSupport: 'Números 12:1'
    },
    {
        id: 'num_207',
        question: 'En su informe, los espías dijeron qué pueblos vivían arriba en "el monte" de Canaán:',
        options: ['Madianitas y Amalequitas', 'Heteos, Jebuseos y Amorreos', 'Filisteos y Sidonios', 'Sirios y Moabitas'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Fueron específicos sobre las zonas: amalecitas al Neguev, y estos tres pueblos en el monte.',
        verseSupport: 'Números 13:29'
    },
    {
        id: 'num_208',
        question: 'Junto al levita Coré se rebelaron Datán y Abiram. ¿De qué tribu nativa principal eran estos dos?',
        options: ['Judá', 'Simeón', 'Dan', 'Rubén'],
        correctIndex: 3,
        difficulty: 3,
        explanation: 'Eran "Datán y Abiram, hijos de Eliab, descendientes de Rubén".',
        verseSupport: 'Números 16:1'
    },
    {
        id: 'num_209',
        question: 'Tras morir calcinados los rebeldes, con sus incensarios de bronce se elaboró algo para el sacerdocio. ¿Qué fue?',
        options: ['Copas sagradas', 'Planchas para cubrir el altar', 'Anillos para transportar el arca', 'Una nueva fuente de bronce'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Se usaron como plancha de recubrimiento visible para el altar, sirviendo de advertencia.',
        verseSupport: 'Números 16:39'
    },
    {
        id: 'num_210',
        question: 'Cuando la vara de Aarón floreció almendras, Jehová mandó que se guardara por señal. ¿Dónde exactamente?',
        options: ['En un sepulcro externo', 'Delante del Testimonio', 'Encima del altar', 'Junto a la fuente de agua'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Se guardó delante de las tablas para señal a los rebeldes.',
        verseSupport: 'Números 17:10'
    },
    {
        id: 'num_211',
        question: 'Balac contrató a Balaam para maldecir. ¿De qué ciudad lejana provenía este adivino?',
        options: ['Tiro', 'Petor (junto al río)', 'Jericó', 'Babilonia'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Balaam era originario de Petor, hacia Mesopotamia.',
        verseSupport: 'Números 22:5'
    },
    {
        id: 'num_212',
        question: 'El israelita muerto por Finees por fornicar con una madianita (Cozbi) se llamaba Zimri. ¿A qué tribu pertenecía?',
        options: ['Aser', 'Simeón', 'Rubén', 'Zabulón'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Zimri, hijo de Salu, regente de una familia ancestral simeonita.',
        verseSupport: 'Números 25:14'
    },
    {
        id: 'num_213',
        question: '¿Cuántas ciudades, junto con sus pastos o ejidos, debían apartar todas las tribus en suma para los levitas?',
        options: ['12 ciudades', '100 ciudades', '48 ciudades', '14 villas'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Fueron ordenadas 48 en total, las cuales incluían las 6 de refugio.',
        verseSupport: 'Números 35:7'
    },
    {
        id: 'num_214',
        question: 'Las herederas, hijas de Zelofehad, consiguieron heredar tierras. ¿Qué condición de boda se les impuso?',
        options: ['Casarse con extranjeros', 'Que se casaran únicamente con varones de su propia tribu mater', 'Mucha riqueza', 'Casarse con soldados'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Era para que la porción de tierra no pasara legalmente de una tribu hebrea a otra.',
        verseSupport: 'Números 36:6'
    },
    {
        id: 'num_215',
        question: 'Moisés les advirtió qué sucedería si por flojera dejaban vivos a los moradores paganos de Canaán. Ellos les serían por...',
        options: ['Hijos de trabajo', 'Aguijones para los ojos y espinas para los costados', 'Siervos dedicados', 'Nación dividida'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Serían constante molestia, llevándolos a pecar e idolatrar letalmente.',
        verseSupport: 'Números 33:55'
    }
];

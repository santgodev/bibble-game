import type { TriviaQuestion } from '../categories';

export const TRIVIA_LEVITICO: TriviaQuestion[] = [
    // --- NIVEL 1: SEMILLA (25 Preguntas) ---
    {
        id: 'lev_001',
        question: 'Al comienzo de Levítico, ¿desde dónde llamó Jehová a Moisés?',
        options: ['El monte Sinaí', 'El tabernáculo', 'Una nube fugaz', 'El desierto'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Dios comenzó a dar sus instrucciones litúrgicas desde su propia morada entre ellos, el tabernáculo de reunión.',
        verseSupport: 'Levítico 1:1'
    },
    {
        id: 'lev_002',
        question: '¿Qué característica indispensable debía tener un animal para el holocausto?',
        options: ['Macho sin defecto', 'Nacido en sábado', 'De color blanco', 'Sin cuernos'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Representando la perfección y la santidad que Dios exige en el sacrificio.',
        verseSupport: 'Levítico 1:3'
    },
    {
        id: 'lev_003',
        question: '¿Cuál era el condimento que nunca debía faltar en las ofrendas a Jehová?',
        options: ['Canela dulce', 'Sal', 'Pimienta', 'Miel'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Representaba lo incorruptible y duradero del pacto de Dios.',
        verseSupport: 'Levítico 2:13'
    },
    {
        id: 'lev_004',
        question: '¿Quiénes eran los hijos de Aarón que ofrecieron fuego extraño a Jehová?',
        options: ['Finees y Elí', 'Nadab y Abiú', 'Eleazar e Itamar', 'Coré y Datán'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Fueron consumidos por el fuego de Jehová al desobedecer.',
        verseSupport: 'Levítico 10:1'
    },
    {
        id: 'lev_005',
        question: 'Entre los animales terrestres, ¿cuáles eran considerados limpios para comer?',
        options: ['Los que se arrastraban', 'Cualquier mamífero', 'Rumiantes de pezuña hendida', 'Felinos salvajes'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Debían cumplir con ambas características físicas a la vez.',
        verseSupport: 'Levítico 11:3'
    },
    {
        id: 'lev_006',
        question: '¿Qué animal se menciona como inmundo por tener pezuña hendida pero no rumiar?',
        options: ['El caballo', 'El camello', 'El león', 'El cerdo'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Por esta causa la carne de cerdo es prohibida en el antiguo pacto.',
        verseSupport: 'Levítico 11:7'
    },
    {
        id: 'lev_007',
        question: 'Para comer peces, ¿qué características debían tener para ser limpios?',
        options: ['Caparazón duro', 'Aletas y escamas', 'Gran tamaño', 'Estar vivos'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Todo ser acuático sin aletas o escamas era considerado abominación.',
        verseSupport: 'Levítico 11:9'
    },
    {
        id: 'lev_008',
        question: '¿Quién era la autoridad responsable de determinar si una persona tenía lepra?',
        options: ['El adivino', 'El sacerdote', 'El médico', 'El anciano'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Era deber pastoral y sanitario del sacerdote examinar la llaga.',
        verseSupport: 'Levítico 13:2'
    },
    {
        id: 'lev_009',
        question: '¿Dónde debía vivir el leproso declarado inmundo mientras duraba su mal?',
        options: ['Cerca al altar', 'Fuera del campamento', 'En tiendas blancas', 'En un pozo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Debía vivir solo, cubrirse hasta el labio y gritar: "¡Inmundo!".',
        verseSupport: 'Levítico 13:46'
    },
    {
        id: 'lev_010',
        question: '¿Quién entraba solo una vez al año detrás del velo al Lugar Santísimo?',
        options: ['El rey', 'Moisés', 'Josué', 'El sumo sacerdote'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Aarón entraba con temor llevando incienso y sangre para no morir.',
        verseSupport: 'Levítico 16:2'
    },
    {
        id: 'lev_011',
        question: 'En la Expiación, ¿hacia dónde era enviado el macho cabrío vivo (el emisario)?',
        options: ['Al desierto', 'Al pueblo enemigo', 'Al ganado', 'Al río Jordán'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Cargaba todas las transgresiones de los hijos de Israel y se enviaba allí.',
        verseSupport: 'Levítico 16:21'
    },
    {
        id: 'lev_012',
        question: '¿Por qué prohibió Jehová el consumo de la sangre de los animales a su pueblo?',
        options: ['Era algo corruptible', 'La vida está en la sangre', 'Causaba enfermedades', 'Era costumbre egipcia'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Dado su valor sagrado de expiación sobre el altar.',
        verseSupport: 'Levítico 17:11'
    },
    {
        id: 'lev_013',
        question: '¿Cuál mandamiento sobre el prójimo en Levítico 19 es citado después por Jesús?',
        options: ['Ignorar al vecino', 'Amar al prójimo como a ti mismo', 'Odiar al enemigo', 'Saludar al extranjero'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Era el cierre de una ley de justicia social estricta.',
        verseSupport: 'Levítico 19:18'
    },
    {
        id: 'lev_014',
        question: 'A la hora de segar o cosechar los campos, ¿para quién se debían dejar los rebuscos?',
        options: ['Los sacerdotes', 'El pobre y el extranjero', 'El rey', 'Aves del campo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'No debían segar hasta el último rincón por misericordia.',
        verseSupport: 'Levítico 19:9-10'
    },
    {
        id: 'lev_015',
        question: '¿En qué mes caía la fiesta solemne de la Pascua israelita?',
        options: ['El primer mes', 'El séptimo mes', 'El doceavo mes', 'El tercer mes'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'El día 14 del primer mes marcaba el principio del calendario festivo.',
        verseSupport: 'Levítico 23:5'
    },
    {
        id: 'lev_016',
        question: 'El primer día del séptimo mes, ¿con qué sonido se convocaba una fiesta solemne?',
        options: ['Campanas doradas', 'Cánticos alegres', 'Trompetas', 'Platillos'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Fue conocida después como la fiesta de las Trompetas.',
        verseSupport: 'Levítico 23:24'
    },
    {
        id: 'lev_017',
        question: '¿Qué se exigía al pueblo en el Día de la Expiación bajo pena de muerte?',
        options: ['Orar cantando', 'Afligir su alma (ayuno)', 'Ofrecer tres corderos', 'Viajar al desierto'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Día solemne de perdón absoluto pero riguroso humillamiento interior.',
        verseSupport: 'Levítico 23:27-29'
    },
    {
        id: 'lev_018',
        question: '¿Con qué aceite debían arder continuamente las lámparas en el tabernáculo?',
        options: ['Grasa de animal', 'Aceite de oliva puro', 'Aceite con canela', 'Brea encendida'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Los hijos de Israel lo aportaban sin descansar.',
        verseSupport: 'Levítico 24:2'
    },
    {
        id: 'lev_019',
        question: '¿Cuántos panes se ponían semanalmente sobre la mesa del tabernáculo a Jehová?',
        options: ['10', '12', '7 exactos', '140'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Eran doce panes en representación a cada una de las tribus judías.',
        verseSupport: 'Levítico 24:5-8'
    },
    {
        id: 'lev_020',
        question: '¿Qué castigo estricto impuso Dios a quien blasfemara Su Nombre?',
        options: ['El destierro', 'Perder una mano', 'La lapidación', 'Aislamiento radical'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Así sucedió con el hijo de una mujer israelita y padre egipcio atrevido.',
        verseSupport: 'Levítico 24:16'
    },
    {
        id: 'lev_021',
        question: '¿Qué principio jurídico de justa compensación quedó fijado en Levítico 24?',
        options: ['Venganza libre', 'Doble pago por robo', 'Ojo por ojo, diente por diente', 'El exilio permanente'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Era una norma que limitaba castigos y evitaba venganzas excesivas.',
        verseSupport: 'Levítico 24:20'
    },
    {
        id: 'lev_022',
        question: '¿Cada cuántos años debía guardar exactamente toda la tierra el Año de Reposo?',
        options: ['Siete', 'Cinco', 'Cincuenta', 'Doce'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Se trabajaba la tierra seis años y el séptimo descansaba absolutamente.',
        verseSupport: 'Levítico 25:4'
    },
    {
        id: 'lev_023',
        question: '¿Qué año de celebración y libertad se declaraba al pasar 49 años formales (7x7)?',
        options: ['La Gran Expansión', 'El Año Restaurador', 'El Año del Jubileo', 'Las Bodas de Oro'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Con el año cincuenta se pregonaba libertad en toda la comarca a sus habitantes.',
        verseSupport: 'Levítico 25:10'
    },
    {
        id: 'lev_024',
        question: 'Si obedecían Sus estatutos, ¿qué enviaría Dios a la tierra?',
        options: ['Lluvias a su tiempo', 'Armamento de oro', 'Ciudades invencibles', 'Cataratas gigantes'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Las lluvias justas generaban grandes cosechas de trigo y pasto para el ganado.',
        verseSupport: 'Levítico 26:4'
    },
    {
        id: 'lev_025',
        question: '¿Dónde entregó todos estos detallados estatutos Moisés oficial y públicamente?',
        options: ['Junto al río Jordán', 'En el desierto de Zin', 'En el monte Sinaí', 'Adentro de Canaán'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Estos son los mandamientos ordenados antes de reanudar su marcha migratoria.',
        verseSupport: 'Levítico 27:34'
    },

    // --- NIVEL 2: DISCÍPULO (20 Preguntas) ---
    {
        id: 'lev_101',
        question: 'En la ofrenda de paz, ¿qué partes del animal se quemaban siempre sobre el altar?',
        options: ['Pezuñas y cuernos', 'Piel exterior', 'La sangre', 'Toda la grosura (grasa)'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'La grasa interna pertenecía con exclusividad a Jehová como porción sagrada quemada.',
        verseSupport: 'Levítico 3:14-16'
    },
    {
        id: 'lev_102',
        question: 'Si toda la congregación pecaba por ignorancia, al darse cuenta, debían sacrificar...',
        options: ['Un becerro', 'Un cordero chico', 'Un carnero', 'Dos tórtolas'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Los ancianos ponían sus manos sobre su cabeza para trasladar la culpa comunitaria y lo sacrificaban.',
        verseSupport: 'Levítico 4:13-14'
    },
    {
        id: 'lev_103',
        question: 'Si un pecador no tenía los recursos para un cordero, ¿qué aves podía ofrecer en su lugar?',
        options: ['Una paloma blanca', 'Dos pollos', 'Dos tórtolas o palominos', 'Dos perdices'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Dios proveía esta flexibilidad para que todos, incluyendo los más pobres, tuvieran expiación.',
        verseSupport: 'Levítico 5:7'
    },
    {
        id: 'lev_104',
        question: '¿A quiénes correspondió mantener el fuego perpetuo del altar encendido toda la noche?',
        options: ['A los levitas menores', 'A los hijos de Aarón', 'A Moisés mismo', 'A setenta nobles'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Reponían su hoguera ceremonial de modo constante como instrucción absoluta matutina.',
        verseSupport: 'Levítico 6:12'
    },
    {
        id: 'lev_105',
        question: 'Para su consagración, ¿quién vistió y lavó directamente a Aarón y a sus hijos?',
        options: ['Josué', 'Hur', 'Moisés', 'Eleazar'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Moisés ofició toda la investidura general a cargo del sacerdocio futuro de la ley mosaica.',
        verseSupport: 'Levítico 8:6'
    },
    {
        id: 'lev_106',
        question: 'En su asombroso primer culto intercesor frente al pueblo, ¿cómo recibió Dios el sacrificio a Aarón?',
        options: ['Un rayo abrió la tierra', 'Salió fuego y consumió el holocausto', 'El cielo brilló azul', 'Brotó agua del altar'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Al ver al fuego vivo descender de la faz de Jehová, todos cayeron de bruces alabar asombrados.',
        verseSupport: 'Levítico 9:24'
    },
    {
        id: 'lev_107',
        question: '¿Qué aves específicas prohíbe comer Levítico 11 mencionándolas extensivamente en grupo?',
        options: ['Aves canoras puras', 'Aves carroñeras y rapaces', 'Pájaros nocturnos pequeños', 'Gaviotas marinas limpias'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Milanos, buitres, halcones y búhos, aves principalmente que consumían cadáveres de otros animales.',
        verseSupport: 'Levítico 11:13-19'
    },
    {
        id: 'lev_108',
        question: 'La ley permitía comer el insecto volador menor o saltamontes. ¿Un ejemplo textual legal es?',
        options: ['La langosta', 'La mosca de arena', 'El grillo lunar', 'La hormiga'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Esta excepción incluía variedades biológicas de estos saltamontes grandes permitidos a la dieta.',
        verseSupport: 'Levítico 11:21-22'
    },
    {
        id: 'lev_109',
        question: 'Para un leproso sanado milagrosamente, la curación ritual usaba madera de cedro, grana e...',
        options: ['Hiedra fina', 'Hisopo', 'Hierbabuena', 'Ceniza gris'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Se bañaba un avecilla viva en la sangre muerta de otra, mezclado con hisopo y cedro ardiente.',
        verseSupport: 'Levítico 14:4'
    },
    {
        id: 'lev_110',
        question: '¿Qué sucedía si un clérigo entraba al Lugar Santísimo el día incorrecto al azar o atrevido?',
        options: ['Era cegado', 'Pagaba dinero oro', 'Moría castigado', 'Se manchaba su ropa blanca'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'La presencia de Dios estaba allí en la nube de gloria y no admitía irreverencia cronológica ni profana.',
        verseSupport: 'Levítico 16:2'
    },
    {
        id: 'lev_111',
        question: 'En Levítico 19 se prohíbe severamente evocar a los muertos y también prohibe el uso de...',
        options: ['Joyas de plata real', 'Adivinación y magia agorera', 'Cuchillos extraños sirios', 'Maderas cortadas impuras'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Cualquier forma de ocultismo corrompía el vínculo especial demandado santísimo y firme por Jehová hacia Israel.',
        verseSupport: 'Levítico 19:26'
    },
    {
        id: 'lev_112',
        question: 'Para la elección matrimonial libre del Sumo Sacerdote mayor solemne en función, este debía casarse solo con:',
        options: ['Mujer rica vecina', 'Cualquier judía buena', 'Viuda noble antigua', 'Una mujer virgen de su pueblo'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Esta regla no era tan estricta para los clérigos ordinarios y comunes levitas ayudantes.',
        verseSupport: 'Levítico 21:13-14'
    },
    {
        id: 'lev_113',
        question: '¿Si alguien de linaje de sacerdotes Aarónicos presentaba una condición física visible de ceguera?',
        options: ['Oficiaba normal', 'No presentaba las ofrendas del altar', 'Cobraban multa dura a él siempre', 'Ayudaba quemando las maderas pesadas de la afueras'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Aunque poseía manutención del linaje puro, no ministraba ante el altar del velo como ministro del fuego.',
        verseSupport: 'Levítico 21:21-22'
    },
    {
        id: 'lev_114',
        question: 'Al hablar del dolor en la muerte ajena de parientes comunes, una regla prohíbe explícitamente hacerse:',
        options: ['Trenzas complejas raras', 'Tatuajes o incisiones en la piel', 'Manchones de cenizas oscuras mudas', 'Sellar o coser prendas oscuras grises tristes'],
        correctIndex: 1,
        difficulty: 2,
        explanation: '"No imprimiréis en vosotros marca alguna", las sajaduras mortales eran prácticas y duelo general en países fronterizos crueles y rudos.',
        verseSupport: 'Levítico 19:28'
    },
    {
        id: 'lev_115',
        question: 'Cuando prestabas o fiabas dinero solidario a hebreos por necesidad vital y pobreza, Dios vedaba qué proceder agiotista duro:',
        options: ['Firmar papel', 'Cobrar usura o intereses ventajosos', 'Regalar sin juez', 'Mirar al cielo libre jurando la deuda'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'En el marco de gracia fraterna pactante de hermanos sacados redimidos por gracia inmerecida egipcia dura y trágica antigua.',
        verseSupport: 'Levítico 25:36'
    },
    {
        id: 'lev_116',
        question: 'Para hornear los dos pesados y perfumados panes rústicos grandes y sagrados en el mes de las festividades ¿cuál cereal era base o receta?',
        options: ['Avena del norte', 'Cebada fina mansa y noble antigua', 'Flor de harina pura estricta', 'Mijo picado extra blanco del occidente seco rural cálido gris'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Se exigía lo más puro o costoso en especie vegetal y harina panadera molida del trigo.',
        verseSupport: 'Levítico 24:5'
    },
    {
        id: 'lev_117',
        question: 'Levítico estipula el diezmo real al dueño de todo, y la entrega es sin excepciones eximentes ni privilegios a:',
        options: ['Solo ganado varonil oscuro duro tonto ciego firme rojo negro', 'Granos, frutos o semillas y también al ganado del campo', 'Unicamente metales dorados y pesados exiliados', 'Frutas silvestres amargas extrañas o envenenadas y secas'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'El diezmo agrario del pacto mosaico amparaba cereales de labranza así como al incremento pecuario formal de los apriscos ovejeros nobles y fuertes hebreos limpios judios.',
        verseSupport: 'Levítico 27:30'
    },
    {
        id: 'lev_118',
        question: 'Si al venderse heredades, no llegaba el precio del familiar para redimir de modo temprano ¿En qué año festivo inmenso recobraban todo derecho la casa y granja sin costo alguno general gratuito libre?',
        options: ['El año séptimo', 'Año de Jubileo comercial tierno general hermoso legal de libertad', 'El año duodécimo', 'Cada lustro nuevo'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Ese año quincuagésimo servía como reajuste general socioeconómico para el patrimonio inalienable distribuido por líneas patriarcales o geográficas cananeas.',
        verseSupport: 'Levítico 25:28'
    },
    {
        id: 'lev_119',
        question: 'Según Levítico 26, el castigo extremo de Dios ante toda desobediencia prolongada dura resultaría y obligaba a:',
        options: ['Inundar su ciudad noble santa judía limpia', 'Quedarse mudos de la noche a la mañana extraña fría sibilante pálida oscura y ruda clara letal', 'Dispersarlos exiliados ex-profeso entre las naciones bárbaras fronterizas', 'Morir quemados instantáneo'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Cuyos desiertos trágicos y conquistas cumplieron con lúgubre similitud babilónica, asiria, romana y helénica histórica sangrienta posterior triste general del mundo eterno e intermitente exilio judío inmenso claro.',
        verseSupport: 'Levítico 26:33'
    },
    {
        id: 'lev_120',
        question: 'A lo largo de todo el texto litúrgico el libro concluye frases con esta firma y nombre legal moral tajante de Jehová Dios solemne:',
        options: ['Yo Jehová', 'El Rey de Judá te manda obedecer pronto firme regio fiero y noble dulce santo hermoso claro', 'Acepta mi ley', 'Firma con fuego divino la piedra egipcia extraña celta judía sutil clara dura gélida sorda y mítica oscura'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Era como el sello legal sagrado que aseguraba y dictaminaba veracidad en las estipulaciones y leyes de santidad pura dictadas por voz soberana a Moisés profeta sabio maduro divino amparador.',
        verseSupport: 'Levítico 19:3'
    },

    // --- NIVEL 3: APÓSTOL (15 Preguntas) ---
    {
        id: 'lev_201',
        question: 'En el sacrificio por el pecado del sumo sacerdote, ¿qué se quemaba fuera del campamento?',
        options: ['Los cuernos', 'Las pezuñas', 'La carne viva del toro', 'La piel, cabeza y estiércol'],
        correctIndex: 3,
        difficulty: 3,
        explanation: 'Se quemaba fuera por ser el animal cargado expresamente del pecado.',
        verseSupport: 'Levítico 4:11-12'
    },
    {
        id: 'lev_202',
        question: 'Para purificar a la mujer luego de dar a luz un niño, ¿cuánto tiempo duraba su purificación?',
        options: ['14 días', '40 días totales (7 y 33)', '3 días exactos', '15 semanas'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Para una niña el tiempo se duplicaba (14 y 66 sumados).',
        verseSupport: 'Levítico 12:2-4'
    },
    {
        id: 'lev_203',
        question: 'Cuando un individuo comía involuntariamente cosas sagradas, ¿qué recargo añadía a su pago de restitución?',
        options: ['El 20% (la quinta parte)', 'Una décima parte', 'El 50%', 'No añadía recargo'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Debía saldar el error por no discernir las estipulaciones sagradas.',
        verseSupport: 'Levítico 5:16'
    },
    {
        id: 'lev_204',
        question: 'Al morir Nadab y Abiú al instante, ¿a quién mandó Dios no lamentar formalmente rasgando sus vestidos?',
        options: ['A Aarón, Eleazar e Itamar', 'A los jefes de tribus', 'A la asamblea armada', 'A Moisés y Josué'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Eran los sacerdotes ungidos; hacer luto los profanaría en su santidad oficial.',
        verseSupport: 'Levítico 10:6'
    },
    {
        id: 'lev_205',
        question: 'Si un reptil como un lagarto caía muerto dentro de una vasija de barro, ¿qué ordenaba la ley hacer?',
        options: ['Lavar la vasija en el río', 'Quebrarla', 'Llenarla de aceite', 'Dejarla tapada siete días'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Todo lo de adentro sería inmundo y la vasija defectuosa ceremonialmente no tenía redención.',
        verseSupport: 'Levítico 11:33'
    },
    {
        id: 'lev_206',
        question: 'Si un caso de "lepra" (moho) en una prenda tejida seguía incrustado tras lavarlo intensamente repetidas veces...',
        options: ['Debía quemarse al fuego', 'Se enterraba lejos', 'Se pintaba el parche', 'Se mojaba en sangre'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Al ser una plaga persistente se arrojaba la ropa al fuego para evitar contagios.',
        verseSupport: 'Levítico 13:55'
    },
    {
        id: 'lev_207',
        question: '¿Cuántas veces esparcía el sumo sacerdote sangre con el dedo hacia el oriente del propiciatorio en la expiación?',
        options: ['Tres veces', 'Siete veces', 'Cincuenta veces', 'Doce veces'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Este número repetitivo denotaba el sello expiatorio exacto sobre el Arca.',
        verseSupport: 'Levítico 16:14'
    },
    {
        id: 'lev_208',
        question: '¿A qué deidad falsa advertía explícitamente la ley no "dar un hijo para pasarlo por fuego"?',
        options: ['Amón', 'Zeus', 'Moloc', 'Dagón'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Deidad moabita o amonita asociada con espeluznantes ofrendas de infantes.',
        verseSupport: 'Levítico 18:21'
    },
    {
        id: 'lev_209',
        question: '¿Por cuántos años sería visto como intocable e prohibido el fruto recién plantado de un árbol joven?',
        options: ['Tres años', 'Diez semanas', 'Siete meses', 'Mil días'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'La ley exigía esa paciencia agrícola para santificar al cuarto año su primera cosecha.',
        verseSupport: 'Levítico 19:23'
    },
    {
        id: 'lev_210',
        question: 'Para la tasación varonil (5 a 20 años de edad) se pagaba estimación de 20 siclos. ¿Cuánto cobraban a la niña o joven?',
        options: ['Mil pesos plata', 'Diez siclos', 'No permitía cobros', 'Un cordero'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'La escala tarifaria de redención de votos era acorde al género y edad.',
        verseSupport: 'Levítico 27:5'
    },
    {
        id: 'lev_211',
        question: 'A diferencia de los campos libres territoriales, ¿cuánto plazo formal tenía alguien para redimir una casa en ciudad amurallada vendida?',
        options: ['Siete meses enteros', 'Un año completo (entero)', 'Tres años fijos', 'Hasta el año de jubileo general'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Pasado el año, los muros le quitaban el derecho de regresarla a su dueño antiguo originario irrevocablemente.',
        verseSupport: 'Levítico 25:29'
    },
    {
        id: 'lev_212',
        question: 'Levítico profetiza una superioridad militar divina asintótica: "¿_____ de vosotros perseguirán a cien?"',
        options: ['Diez', 'Cien mil', 'Cinco', 'Cuarenta nobles'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Una inmensa promesa de victoria para grupos sumamente infimos obedientes y valientes combatiendo unidos.',
        verseSupport: 'Levítico 26:8'
    },
    {
        id: 'lev_213',
        question: 'El blasfemador extranjero muerto por castigo era hijo de madre israelita (Shelomit). ¿De qué tribu descendía genéticamente esta familia?',
        options: ['De Judá', 'De Dan', 'De la tribu de Efraín', 'Zabulón fiero'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'El texto nombra tajantemente que su origen matriarcal recaía genético desde esta tribu singular clara.',
        verseSupport: 'Levítico 24:11'
    },
    {
        id: 'lev_214',
        question: 'Al contar "bajo la vara" los diezmos ovino-caprinos o bovinos vivos pecuarios ¿Qué número de animal pasaba inmutable a ser sacratísimo?',
        options: ['El primero limpio macho sin taras', 'El de más grasa y carne', 'El décimo que la vara toca aleatoriamente en línea de paso', 'Aquel más tierno chivo joven'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Sería un verdadero azar sagrado provisto donde lo tocado divino sería puramente inmutable e in-canjeable.',
        verseSupport: 'Levítico 27:32'
    },
    {
        id: 'lev_215',
        question: '¿Qué obligaba con gran ceremonia solemne acampar bajo enramadas fijos el día 15 del mes séptimo (Tishri)?',
        options: ['Expiación letal cruda lúgubre', 'La Fiesta solemne de los Tabernáculos (Cabañas)', 'Las hermosas y vivas Pascuas', 'Purim estival exótico'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Siete días habitarán en tabernáculos para entender la travesía ardua antigua histórica pasada peregrina libre de rescate de sus ancestros en los trágicos ecos del arduo Egipto y largo trayecto hacia su ansiada bendición.',
        verseSupport: 'Levítico 23:34'
    }
];

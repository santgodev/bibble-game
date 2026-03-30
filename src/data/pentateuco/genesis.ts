import type { TriviaQuestion } from '../categories';

export const TRIVIA_GENESIS: TriviaQuestion[] = [
    // --- NIVEL 1: SEMILLA (25 Preguntas) ---
    {
        id: 'gen_001',
        question: '¿Qué creó Dios en el primer día?',
        options: ['Las plantas', 'El sol y la luna', 'La luz', 'Los animales'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Dios separó la luz de las tinieblas llamando a la luz Día.',
        verseSupport: 'Génesis 1:3'
    },
    {
        id: 'gen_002',
        question: '¿De qué material formó Dios al primer hombre?',
        options: ['Del agua', 'Del polvo de la tierra', 'De madera', 'De piedra'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Jehová Dios formó al hombre del polvo de la tierra.',
        verseSupport: 'Génesis 2:7'
    },
    {
        id: 'gen_003',
        question: '¿Quién fue la primera mujer creada por Dios?',
        options: ['Sara', 'Agar', 'Rebeca', 'Eva'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Formada de una costilla de Adán para ser su ayuda idónea.',
        verseSupport: 'Génesis 2:22'
    },
    {
        id: 'gen_004',
        question: '¿A qué animal engañador escuchó Eva en el huerto del Edén?',
        options: ['Un león', 'Un zorro', 'La serpiente', 'Un ave'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'La serpiente era más astuta que todos los animales del campo.',
        verseSupport: 'Génesis 3:1'
    },
    {
        id: 'gen_005',
        question: '¿Quién mató a su hermano Abel por envidia?',
        options: ['Enós', 'Set', 'Tubal', 'Caín'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Caín lo mató porque su ofrenda no fue mirada con agrado divino.',
        verseSupport: 'Génesis 4:8'
    },
    {
        id: 'gen_006',
        question: '¿Qué construyó Noé por mandato divino para salvarse del diluvio?',
        options: ['Una torre alta', 'Una cueva', 'Un arca', 'Un altar'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Dios ordenó hacer el arca para salvar a su familia y animales.',
        verseSupport: 'Génesis 6:14'
    },
    {
        id: 'gen_007',
        question: '¿Cuántos días y noches continuas llovió durante el diluvio?',
        options: ['7 días', '40 días y noches', '12 días', '100 días'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Fueron cuarenta días ininterrumpidos de intensa lluvia global.',
        verseSupport: 'Génesis 7:12'
    },
    {
        id: 'gen_008',
        question: '¿Cuál fue la señal del pacto para no volver a destruir la tierra con agua?',
        options: ['El arcoíris', 'Una paloma', 'Un trueno', 'Una roca blanca'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Puso su arco en las nubes como señal perpetua.',
        verseSupport: 'Génesis 9:13'
    },
    {
        id: 'gen_009',
        question: '¿Qué torre quisieron construir los hombres para llegar al cielo?',
        options: ['La Torre de Jericó', 'La Torre del Rey', 'La Torre de Babel', 'El Gran Templo'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Allí Dios confundió las lenguas de toda la humanidad.',
        verseSupport: 'Génesis 11:9'
    },
    {
        id: 'gen_010',
        question: '¿A quién le pidió Dios salir de su tierra y de su parentela?',
        options: ['Abraham', 'Lot', 'Isaac', 'Jacob'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Salió hacia Canaán obedeciendo y sin saber a dónde iba exactamente.',
        verseSupport: 'Génesis 12:1'
    },
    {
        id: 'gen_011',
        question: '¿Cuál era el nombre de la esposa principal de Abraham?',
        options: ['Lea', 'Rebeca', 'Sara', 'Agar'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Se le cambió el nombre de Sarai a Sara.',
        verseSupport: 'Génesis 17:15'
    },
    {
        id: 'gen_012',
        question: '¿A qué sobrino de Abraham sacaron los ángeles de Sodoma?',
        options: ['Moisés', 'Lot', 'Isaac', 'Esaú'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Fue rescatado justo antes de la lluvia de fuego.',
        verseSupport: 'Génesis 19:15'
    },
    {
        id: 'gen_013',
        question: '¿En qué se convirtió la mujer de Lot al mirar hacia atrás?',
        options: ['En estatua de oro', 'En árbol', 'En estatua de sal', 'En ceniza'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Desobedeció la orden directa de no mirar atrás.',
        verseSupport: 'Génesis 19:26'
    },
    {
        id: 'gen_014',
        question: '¿Cómo se llamó el hijo de la promesa nacido en la vejez de Abraham y Sara?',
        options: ['Ismael', 'Isaac', 'Judá', 'Jacob'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Nació cuando Abraham tenía 100 años.',
        verseSupport: 'Génesis 21:3'
    },
    {
        id: 'gen_015',
        question: '¿Quiénes eran los dos hijos gemelos de Isaac y Rebeca?',
        options: ['Efraín y Manasés', 'Esaú y Jacob', 'Pérez y Zera', 'Ismael e Isaac'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Ambos luchaban incluso desde el vientre materno.',
        verseSupport: 'Génesis 25:24'
    },
    {
        id: 'gen_016',
        question: '¿Por qué vendió Esaú su primogenitura a su hermano Jacob?',
        options: ['Por un campo', 'Por ovejas', 'Por ropa', 'Por un guisado de lentejas'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Menospreció la primogenitura al llegar muy hambriento.',
        verseSupport: 'Génesis 25:34'
    },
    {
        id: 'gen_017',
        question: '¿Quién engañó a Isaac cuando estaba ciego para robar la bendición primaria?',
        options: ['Esaú', 'Labán', 'Lot', 'Jacob'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'Jacob usó pieles en sus brazos para aparentar ser velludo.',
        verseSupport: 'Génesis 27:19'
    },
    {
        id: 'gen_018',
        question: 'Jacob vio en sueños una escalera que tocaba el cielo. ¿Quiénes subían y bajaban?',
        options: ['Soldados', 'Estrellas', 'Ángeles de Dios', 'Profetas'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Sucedió en Bet-el mientras dormía sobre una piedra.',
        verseSupport: 'Génesis 28:12'
    },
    {
        id: 'gen_019',
        question: '¿Cuántos hijos varones tuvo Jacob en total?',
        options: ['7', '12', '10', '15'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'De esos 12 varones surgieron las doce tribus de Israel.',
        verseSupport: 'Génesis 35:22'
    },
    {
        id: 'gen_020',
        question: '¿A quién le regaló Jacob una túnica colorida causando gran envidia?',
        options: ['A Benjamín', 'A Rubén', 'A José', 'A Judá'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'José era el favorito por ser hijo de su amada Raquel en su vejez.',
        verseSupport: 'Génesis 37:3'
    },
    {
        id: 'gen_021',
        question: '¿A dónde fue vendido y llevado José como esclavo por sus hermanos?',
        options: ['Babilonia', 'Asiria', 'Egipto', 'Siria'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Fue comprado en Egipto por Potifar, oficial de Faraón.',
        verseSupport: 'Génesis 37:36'
    },
    {
        id: 'gen_022',
        question: '¿Quién acusó falsamente a José en Egipto mandándolo a la cárcel?',
        options: ['El copero', 'La esposa de Potifar', 'Faraón', 'El panadero'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Al no poder doblegar la pureza de José, ella lo incriminó.',
        verseSupport: 'Génesis 39:17'
    },
    {
        id: 'gen_023',
        question: 'En prisión, José interpretó correctamente los sueños del copero y del...',
        options: ['Sacerdote', 'Guardia', 'Soldado real', 'Panadero'],
        correctIndex: 3,
        difficulty: 1,
        explanation: 'El panadero terminó perdiendo la vida como soñó.',
        verseSupport: 'Génesis 40:16'
    },
    {
        id: 'gen_024',
        question: '¿Qué interpretó José en el sueño que tuvo Faraón sobre 7 vacas y 7 espigas?',
        options: ['Guerra y paz', 'Siete años de abundancia seguidos de siete de hambre', 'Plagas y muerte', 'Nacimientos de gemelos'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Salvó a todo Egipto gracias a esta revelación.',
        verseSupport: 'Génesis 41:29-30'
    },
    {
        id: 'gen_025',
        question: '¿Al final del libro, a dónde se muda Jacob (Israel) con todos sus hijos para sobrevivir?',
        options: ['Hacia Egipto (Gosén)', 'A Sodoma', 'Regresan a Ur', 'Cruzan el Mar Rojo'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'José los instaló en la rica tierra de Gosén en Egipto.',
        verseSupport: 'Génesis 47:4'
    },

    // --- NIVEL 2: DISCÍPULO (20 Preguntas) ---
    {
        id: 'gen_101',
        question: '¿Qué hizo Dios el séptimo día de la creación?',
        options: ['Hizo el arcoíris', 'Creó al hombre', 'Reposó de su obra', 'Renovó el sol'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Y reposó el séptimo día separando el principio del día de descanso.',
        verseSupport: 'Génesis 2:2'
    },
    {
        id: 'gen_102',
        question: '¿Qué árbol prohíbe Dios tocar en medio del Edén?',
        options: ['El del oro y plata', 'El árbol de la vida', 'El del conocimiento del bien y del mal', 'La zarza ardiente'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Esa fue la única restricción expresa.',
        verseSupport: 'Génesis 2:17'
    },
    {
        id: 'gen_103',
        question: '¿Quién fue el hijo otorgado a Adán y Eva en lugar del asesinado Abel?',
        options: ['Enós', 'Set', 'Tubal', 'Elias'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Set tomó la posta espiritual de Abel.',
        verseSupport: 'Génesis 4:25'
    },
    {
        id: 'gen_104',
        question: '¿Quién "caminó con Dios y desapareció" al ser arrebatado sin morir?',
        options: ['Noé', 'Lamec', 'Matusalén', 'Enoc'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Dios se lo llevó vivo en un arrebato misterioso.',
        verseSupport: 'Génesis 5:24'
    },
    {
        id: 'gen_105',
        question: '¿Cuánto tiempo aproximó Dios como edad máxima biológica normal para el hombre pre-diluviano?',
        options: ['Cien años', 'Ochocientos', 'Ciento veinte años', 'Un milenio'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Decretó el tope etario general en 120 años al acortarles el vigor.',
        verseSupport: 'Génesis 6:3'
    },
    {
        id: 'gen_106',
        question: '¿Dónde se asentó firmemente el arca de Noé tras menguar las aguas?',
        options: ['Babel', 'Montes de Ararat', 'Monte Sinaí', 'Jericó'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Reposo en los montes orientales de la cordillera de Ararat.',
        verseSupport: 'Génesis 8:4'
    },
    {
        id: 'gen_107',
        question: '¿Cómo se llamaban los tres hijos de Noé?',
        options: ['Sem, Cam y Jafet', 'Set, Anás y Enós', 'Caín, Abel y Set', 'Gad, Aser y Dan'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Estos conformaron posteriormente la familia humana poblacional post-diluvio.',
        verseSupport: 'Génesis 9:18'
    },
    {
        id: 'gen_108',
        question: 'Cuando Dios le prometió un hijo a la anciana Sara, ella reaccionó...',
        options: ['Llorando', 'Desmayándose', 'Riéndose', 'Corriendo al desierto'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Incrédula en sí misma y ante su extrema vejez.',
        verseSupport: 'Génesis 18:12'
    },
    {
        id: 'gen_109',
        question: '¿Qué intercesión insistente y atrevida hizo Abraham delante de Dios antes del fuego de Sodoma?',
        options: ['Rogó perdón por 10 hombres justos', 'Pidió fuego más grande', 'Huyó callado', 'Mandó matar a Lot'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Rogó repetidas veces bajando la cuota hasta pedir clemencia si había siquiera diez justos.',
        verseSupport: 'Génesis 18:32'
    },
    {
        id: 'gen_110',
        question: '¿Qué sacrificó Abraham en lugar de su hijo Isaac como provisión divina?',
        options: ['Un becerro', 'Un cabrito', 'Una tórtola', 'Un carnero trabado en una zarza'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Dios preparó un sustituto literal enseñando a la vez que Jehová Jireh "provee".',
        verseSupport: 'Génesis 22:13'
    },
    {
        id: 'gen_111',
        question: '¿A quién engañó Jacob primero por indicaciones de su madre Rebeca?',
        options: ['A Labán', 'A Esaú o su cazador ciego padre Isaac', 'Al rey', 'A Faraón'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Engañó la ceguera de Isaac para tomar la gran bendición patriarcal.',
        verseSupport: 'Génesis 27:19'
    },
    {
        id: 'gen_112',
        question: '¿Por cuál mujer acordó trabajar Jacob inicialmente a su suegro Labán por siete años?',
        options: ['Lea', 'Bilha', 'Zilpa', 'Raquel'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Trabajó por ella, pero fue burlado y luego laboró otros 7 años.',
        verseSupport: 'Génesis 29:18'
    },
    {
        id: 'gen_113',
        question: '¿Qué patriarca luchó físicamente toda la noche contra un Varón divino hasta que despuntó el alba?',
        options: ['Moisés', 'Abraham', 'Jacob', 'José'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Al finalizar la refriega pidió gran bendición cojeando eternamente por la cadera descoyuntada.',
        verseSupport: 'Génesis 32:24'
    },
    {
        id: 'gen_114',
        question: 'Por el episodio de violencia desatada en Siquem, ¿cuáles de los hermanos de José masacraron varones en venganza?',
        options: ['Simeón y Leví', 'Judá y Rubén', 'Dan y Gad', 'José e Isaac'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'La brutal reacción vengativa recayó por deshonrar a su hermana Dina.',
        verseSupport: 'Génesis 34:25'
    },
    {
        id: 'gen_115',
        question: 'José soñó dos sueños molestos de supremacía. Uno era de gavillas y el otro de...',
        options: ['Espadas', 'Siete espigas rubias', 'Árboles doblandose', 'El sol, la luna y once estrellas'],
        correctIndex: 3,
        difficulty: 2,
        explanation: 'Anunciando a sus familiares que reinaría por sobre todos ellos provocando muchísima ira.',
        verseSupport: 'Génesis 37:9'
    },
    {
        id: 'gen_116',
        question: 'Antes del ascenso de José, una mujer lo sedujo y agarró su manto huyendo él de ella puro. Fue...',
        options: ['Rebeca', 'La esposa del jefe Potifar', 'Asenat de Faraón', 'La adivina de Gosén'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Al librarse sin pecar, ella usó rencorosamente la acusación del manto para encarcelarle.',
        verseSupport: 'Génesis 39:12'
    },
    {
        id: 'gen_117',
        question: 'José ocultó un objeto preciado en el costal menor de Benjamín para forzarlos a reaccionar, ¿qué era?',
        options: ['Un ídolo de plata', 'Una copa grande de plata', 'Diez denarios', 'El sello mágico'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Esa copa actuaba forzadamente como objeto adivinatorio falso para retener la pureza fraterna.',
        verseSupport: 'Génesis 44:2'
    },
    {
        id: 'gen_118',
        question: '¿A quién puso Jacob por cabecera y heredó la estirpe principal y el "bastón/cetro" real prometiendo llegar Siloh?',
        options: ['Rubén', 'José', 'Judá', 'Leví'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'De él vendrían los príncipes, sellando ahí el futuro trono de Cristo.',
        verseSupport: 'Génesis 49:10'
    },
    {
        id: 'gen_119',
        question: '¿Cuántos años tenía José varón excelso al fallecer?',
        options: ['120 años', '80 años', '110 años', '100 años puros'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Lo conservaron fiel tras jurar todos que sacarían de allí sus embalsamados huesos exiliados.',
        verseSupport: 'Génesis 50:26'
    },
    {
        id: 'gen_120',
        question: 'El Génesis termina en Egipto. El último versículo formal de este primer libro menciona qué depositario mortuorio...',
        options: ['Un sepulcro de roca', 'Cenizas lanzadas al mar', 'Un ataúd egipcio rústico (José fue puesto en un ataúd en Egipto)', 'Altares de pirámides'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Finaliza textualmente con "...y lo pusieron en un ataúd en Egipto".',
        verseSupport: 'Génesis 50:26'
    },

    // --- NIVEL 3: APÓSTOL (15 Preguntas) ---
    {
        id: 'gen_201',
        question: '¿Qué rey de Salem y sacerdote del Dios Altísimo bendijo a Abraham trayendo pan y vino?',
        options: ['Balac', 'Melquisedec', 'Faraón', 'Amrafel'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'A Melquisedec Abraham le pagó los diezmos de todo el botín.',
        verseSupport: 'Génesis 14:18'
    },
    {
        id: 'gen_202',
        question: 'De la abundancia del Edén salía un río que se dividía en cuatro brazos. ¿Cuáles eran?',
        options: ['Jordán, Nilo, Mar Rojo y Sirio', 'Pisón, Gihón, Hidequel y Éufrates', 'Sidón, Éufrates, Mar salado, Babilonia', 'Horeb, Cedrón, Nilo, Pisón'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Estos fueron los cuatro ríos originales del primigenio huerto.',
        verseSupport: 'Génesis 2:11-14'
    },
    {
        id: 'gen_203',
        question: 'Según las instrucciones dadas a Noé, ¿qué tipo de madera debía usar para fabricar el arca?',
        options: ['Madera de acacia', 'Madera de olivo blanco', 'Madera de roble oriental', 'Madera de gofer'],
        correctIndex: 3,
        difficulty: 3,
        explanation: 'Esta madera robusta fue calafateada con brea para resistir el agua.',
        verseSupport: 'Génesis 6:14'
    },
    {
        id: 'gen_204',
        question: 'En un sueño profético, Jehová ratificó el pacto a Abraham pasando entre los animales partidos como...',
        options: ['Luz de estrella matutina', 'Un horno humeando y una antorcha de fuego', 'Un ángel blanco luminoso', 'Un remolino de viento ardiente'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Ese pacto selló firmemente la promesa divina para su descendencia.',
        verseSupport: 'Génesis 15:17'
    },
    {
        id: 'gen_205',
        question: 'Cuando la turba de la ciudad de Sodoma intentó forzar la casa de Lot, ¿cómo los detuvieron los ángeles?',
        options: ['Quemando sus pies', 'Hiriendo a todos con ceguera', 'Abriendo la tierra', 'Arrojando truenos continuos'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Esa debilidad los agotó tratando de encontrar la puerta, salvando así a Lot.',
        verseSupport: 'Génesis 19:11'
    },
    {
        id: 'gen_206',
        question: 'Respecto a Ismael, el hijo mayor de Abraham, ¿cuántos príncipes prometió Dios engendrar de su linaje?',
        options: ['Siete', 'Cinco ejércitos', 'Doce príncipes', 'Diez reyes fuertes'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Aislando esto como una bendición particular de origen nacional.',
        verseSupport: 'Génesis 17:20'
    },
    {
        id: 'gen_207',
        question: '¿A quién y por cuánto compró Abraham la cueva de Macpela para sepultar a su esposa Sara?',
        options: ['Al rey Balac por oro', 'A un pastor de Siquem', 'Al heteo Efrón por 400 siclos de plata', 'Al Faraón egipcio'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Pagó el precio de tasación justa y pública para asegurarse ese lugar funerario familiar.',
        verseSupport: 'Génesis 23:16-17'
    },
    {
        id: 'gen_208',
        question: 'Para incrementar sus ovejas manchadas frente a las de Labán, Jacob colocó varas de álamo y avellano en...',
        options: ['Los canales de los abrevaderos', 'Altares sagrados', 'Bosques lejanos', 'Las cimas más altas'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Usó esta estrategia delante de los animales robustos al momento de concebir.',
        verseSupport: 'Génesis 30:37'
    },
    {
        id: 'gen_209',
        question: 'El pecado del hombre llamado Onán, condenado a muerte, consistió en...',
        options: ['Asesinar a un heteo rico', 'Robar el rebaño principal de Judá', 'Derramar su simiente en tierra para no dejar descendencia a su hermano', 'Venerar la estatua de Asera en el monte'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Desobedeció deliberadamente una norma moral obligatoria de honor familiar.',
        verseSupport: 'Génesis 38:9'
    },
    {
        id: 'gen_210',
        question: 'Cuando el Faraón nombra a José gobernador, ¿qué mujer egipcia le otorga como esposa legítima?',
        options: ['A la sobrina de Faraón', 'A la hija de su carcelero real', 'A Asenat, hija de Potifera, sacerdote de On', 'A Agar la menor'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Ella fue madre en Egipto de Manasés y Efraín.',
        verseSupport: 'Génesis 41:45'
    },
    {
        id: 'gen_211',
        question: 'En la bendición final de Israel (Jacob), figura una tribu guerrera comparada a "una serpiente junto al camino, que muerde...". ¿Qué tribu?',
        options: ['Tribu de Judá', 'Tribu de Dan', 'Tribu de Benjamín', 'Tribu de Rubén'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Esta aludió a la ferocidad engañosa e impacto certero de sus tropas.',
        verseSupport: 'Génesis 49:17'
    },
    {
        id: 'gen_212',
        question: 'Al bendecir a Judá prediciendo reyes, menciona que su cetro de autoridad no será quitado hasta que venga...',
        options: ['El Mesías profeta', 'Siloh', 'El león rey', 'El Ungido Sacerdote'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Siloh figura la llegada totalitaria redentora del Cristo pacificador de la tierra.',
        verseSupport: 'Génesis 49:10'
    },
    {
        id: 'gen_213',
        question: 'Para el grandísimo luto nacional brindado al difunto Jacob en Egipto, ¿cuántos días duró estricto el proceso médico de embalsamamiento?',
        options: ['Doce años luctuosos', 'Cuarenta días de la preparación científica', 'Ochenta semanas', 'Doce días santos'],
        correctIndex: 1,
        difficulty: 3,
        explanation: '40 días embalsamando, más un duelo formal egipcio exigido por otros 70 días.',
        verseSupport: 'Génesis 50:3'
    },
    {
        id: 'gen_214',
        question: 'En su lecho pre-mortal, ¿qué hizo jurar el anciano José inexorablemente a los hijos de Israel sobre el exilio futuro?',
        options: ['Sacrificios ocultos diarios eternos', 'No luchar con reinos asirios jamás', 'Que llevarían sus huesos desde Egipto', 'Construir grandes tumbas en Gosén'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Confesaba fuertemente que Dios los sacaría y debían llevar esos sagrados huesos a Canaán.',
        verseSupport: 'Génesis 50:25'
    },
    {
        id: 'gen_215',
        question: 'Jacob en poesía alaba al patriarca Isacar comparándolo alegórica y fielmente con un...',
        options: ['Un asno fuerte que se recuesta entre los apriscos', 'Un camello de desierto veloz ciego', 'Un caballo firme alado', 'León salvaje domado de monte'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Símbolo rústico claro de una clase robusta dispuesta al humilde pesado e intenso laboreo rural sirviente.',
        verseSupport: 'Génesis 49:14'
    }
];

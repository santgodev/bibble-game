import { TriviaQuestion } from './categories';

export const TRIVIA_ORIGENES_EXTRA: TriviaQuestion[] = [
    // Nivel 2 (Discípulo) — +5
    {
        id: 'org_ex_2_1',
        difficulty: 2,
        question: '¿Cómo se llamaban los cuatro ríos que salían del Edén según Génesis 2?',
        options: ['Pisón, Gihón, Hidekel y Éufrates', 'Jordán, Nilo, Jaboc y Cisón', 'Ararat, Éufrates, Tigris y Siloé', 'Querit, Cedrón, Gihón y Jordán'],
        correctIndex: 0,
        verseSupport: 'Génesis 2:10-14',
        explanation: 'Un río salía de Edén para regar el huerto y de allí se repartía en cuatro brazos.'
    },
    {
        id: 'org_ex_2_2',
        difficulty: 2,
        question: '¿Qué hijo de Adán y Eva nació en lugar de Abel después de su muerte?',
        options: ['Set', 'Enós', 'Cainán', 'Lamec'],
        correctIndex: 0,
        verseSupport: 'Génesis 4:25',
        explanation: 'Eva llamó Set al niño diciendo: «Dios me ha sustituido otro hijo en lugar de Abel».'
    },
    {
        id: 'org_ex_2_3',
        difficulty: 2,
        question: '¿Qué patriarca anterior al diluvio caminó con Dios y fue traspuesto sin ver muerte?',
        options: ['Enoc', 'Matusalén', 'Jared', 'Mahalaleel'],
        correctIndex: 0,
        verseSupport: 'Génesis 5:24',
        explanation: 'Enoc caminó con Dios trescientos años después de engendrar a Matusalén, y Dios se lo llevó.'
    },
    {
        id: 'org_ex_2_4',
        difficulty: 2,
        question: '¿Qué señal puso Dios en las nubes como pacto de no volver a destruir la tierra con diluvio?',
        options: ['El arco iris', 'Una estrella brillante', 'Una columna de fuego', 'Una nube blanca'],
        correctIndex: 0,
        verseSupport: 'Génesis 9:13',
        explanation: 'Dios estableció el arco en las nubes como señal del pacto perpetuo con toda criatura.'
    },
    {
        id: 'org_ex_2_5',
        difficulty: 2,
        question: '¿Qué materiales usaron los constructores de la torre de Babel en lugar de piedra y mezcla?',
        options: ['Ladrillo y asfalto', 'Madera de cedro y cal', 'Barro crudo y paja', 'Bronce y arena'],
        correctIndex: 0,
        verseSupport: 'Génesis 11:3',
        explanation: 'Dijeron unos a otros: «Hagamos ladrillo y cozámoslo con fuego», y usaron asfalto en lugar de mezcla.'
    },

    // Nivel 3 (Maestro) — +9
    {
        id: 'org_ex_3_1',
        difficulty: 3,
        question: '¿Quién fue el primer hombre mencionado en Génesis 4 como padre de los que tocan arpa y flauta?',
        options: ['Jubal', 'Jabal', 'Tubal-caín', 'Enós'],
        correctIndex: 0,
        verseSupport: 'Génesis 4:21',
        explanation: 'Jubal, hijo de Lamec y Ada, fue padre de todos los que tocan arpa y flauta.'
    },
    {
        id: 'org_ex_3_2',
        difficulty: 3,
        question: '¿Quién fue artífice de toda obra de bronce y de hierro en la genealogía de Caín?',
        options: ['Tubal-caín', 'Jabal', 'Irad', 'Mehujael'],
        correctIndex: 0,
        verseSupport: 'Génesis 4:22',
        explanation: 'Zila dio a luz a Tubal-caín, forjador de herramientas cortantes de bronce y hierro.'
    },
    {
        id: 'org_ex_3_3',
        difficulty: 3,
        question: '¿En tiempos de qué hijo de Set comenzaron los hombres a invocar el nombre del Señor?',
        options: ['Enós', 'Cainán', 'Jared', 'Lamec'],
        correctIndex: 0,
        verseSupport: 'Génesis 4:26',
        explanation: 'A Set le nació un hijo llamado Enós, y entonces se comenzó a invocar el nombre del Señor.'
    },
    {
        id: 'org_ex_3_4',
        difficulty: 3,
        question: '¿Cuántos años vivió Matusalén, el hombre más longevo registrado en la Biblia?',
        options: ['969 años', '930 años', '950 años', '912 años'],
        correctIndex: 0,
        verseSupport: 'Génesis 5:27',
        explanation: 'Todos los días de Matusalén fueron novecientos sesenta y nueve años.'
    },
    {
        id: 'org_ex_3_5',
        difficulty: 3,
        question: '¿Cuántos codos de largo tenía el arca de Noé según las instrucciones de Dios?',
        options: ['300 codos', '150 codos', '200 codos', '400 codos'],
        correctIndex: 0,
        verseSupport: 'Génesis 6:15',
        explanation: 'Las medidas del arca eran trescientos codos de largo, cincuenta de ancho y treinta de alto.'
    },
    {
        id: 'org_ex_3_6',
        difficulty: 3,
        question: '¿Cuántos días y noches llovió sobre la tierra al comenzar el diluvio?',
        options: ['Cuarenta días y cuarenta noches', 'Treinta días y treinta noches', 'Cincuenta días', 'Setenta días'],
        correctIndex: 0,
        verseSupport: 'Génesis 7:12',
        explanation: 'Hubo lluvia sobre la tierra cuarenta días y cuarenta noches.'
    },
    {
        id: 'org_ex_3_7',
        difficulty: 3,
        question: '¿En qué llanura se asentaron los descendientes antes de edificar la ciudad y torre de Babel?',
        options: ['Llanura de Sinar', 'Llanura de Mamre', 'Valle de Sidim', 'Tierra de Nod'],
        correctIndex: 0,
        verseSupport: 'Génesis 11:2',
        explanation: 'Al partir de oriente hallaron una llanura en la tierra de Sinar y se establecieron allí.'
    },
    {
        id: 'org_ex_3_8',
        difficulty: 3,
        question: '¿Qué poderoso cazador delante del Señor fundó Babel, Erec, Acad y Nínive?',
        options: ['Nimrod', 'Cus', 'Mizraim', 'Asur'],
        correctIndex: 0,
        verseSupport: 'Génesis 10:8-11',
        explanation: 'Nimrod hijo de Cus llegó a ser el primer poderoso en la tierra y el principio de su reino fue Babel.'
    },
    {
        id: 'org_ex_3_9',
        difficulty: 3,
        question: '¿Cuál fue el nombre del padre de Abram que salió de Ur de los caldeos hasta Harán?',
        options: ['Taré', 'Nacor', 'Serug', 'Peleg'],
        correctIndex: 0,
        verseSupport: 'Génesis 11:31',
        explanation: 'Taré tomó a Abram, a Lot y a Sarai y salieron de Ur hacia Canaán, quedándose en Harán.'
    },
];

export const TRIVIA_ENTRADA_CANAAN_EXTRA: TriviaQuestion[] = [
    // Nivel 1 (Semilla) — +13
    {
        id: 'can_ex_1_1',
        difficulty: 1,
        question: '¿Quién sucedió a Moisés como líder de Israel para entrar en la tierra prometida?',
        options: ['Josué', 'Caleb', 'Aarón', 'Eleazar'],
        correctIndex: 0,
        verseSupport: 'Josué 1:1-2',
        explanation: 'Después de la muerte de Moisés, Dios llamó a Josué hijo de Nun a cruzar el Jordán.'
    },
    {
        id: 'can_ex_1_2',
        difficulty: 1,
        question: '¿Qué mandato repitió Dios tres veces a Josué al darle la misión de liderar a Israel?',
        options: ['«Esfuérzate y sé valiente»', '«Construye un altar»', '«Ayuna cuarenta días»', '«Envía doce espías»'],
        correctIndex: 0,
        verseSupport: 'Josué 1:6-9',
        explanation: 'El Señor animó a Josué a esforzarse y ser muy valiente sin temer ni desmayar.'
    },
    {
        id: 'can_ex_1_3',
        difficulty: 1,
        question: '¿Qué río cruzó Israel en seco para entrar en Canaán?',
        options: ['El río Jordán', 'El río Nilo', 'El río Jaboc', 'El arroyo de Querit'],
        correctIndex: 0,
        verseSupport: 'Josué 3:14-17',
        explanation: 'Cuando los pies de los sacerdotes que llevaban el arca tocaron el Jordán, las aguas se detuvieron.'
    },
    {
        id: 'can_ex_1_4',
        difficulty: 1,
        question: '¿Qué mujer de Jericó protegió a los dos espías enviados por Josué?',
        options: ['Rahab', 'Débora', 'Rut', 'Jael'],
        correctIndex: 0,
        verseSupport: 'Josué 2:1-6',
        explanation: 'Rahab los ocultó en su terrado entre manojos de lino y confió en el Dios de Israel.'
    },
    {
        id: 'can_ex_1_5',
        difficulty: 1,
        question: '¿Qué señal ató Rahab en su ventana para que su familia fuera salvada?',
        options: ['Un cordón de grana (rojo)', 'Una rama de olivo', 'Un paño blanco', 'Una cinta azul'],
        correctIndex: 0,
        verseSupport: 'Josué 2:18',
        explanation: 'Los espías le indicaron atar el cordón de grana en la ventana por donde los había bajado.'
    },
    {
        id: 'can_ex_1_6',
        difficulty: 1,
        question: '¿Cuántas vueltas dieron los israelitas alrededor de Jericó el séptimo día?',
        options: ['Siete vueltas', 'Una vuelta', 'Tres vueltas', 'Doce vueltas'],
        correctIndex: 0,
        verseSupport: 'Josué 6:15',
        explanation: 'Rodeaban la ciudad una vez los seis días, y el séptimo día la rodearon siete veces.'
    },
    {
        id: 'can_ex_1_7',
        difficulty: 1,
        question: '¿Qué ocurrió con los muros de Jericó tras el toque de bocinas y el grito del pueblo?',
        options: ['Se derrumbaron por completo', 'Se abrieron solo las puertas', 'Fueron incendiados', 'Quedaron intactos'],
        correctIndex: 0,
        verseSupport: 'Josué 6:20',
        explanation: 'Cuando el pueblo gritó con gran estruendo, el muro se derrumbó y cada uno subió derecho.'
    },
    {
        id: 'can_ex_1_8',
        difficulty: 1,
        question: '¿Qué tomaron doce hombres del medio del Jordán como monumento de recuerdo?',
        options: ['Doce piedras', 'Doce ramas de palma', 'Doce vasijas de agua', 'Doce espigas de trigo'],
        correctIndex: 0,
        verseSupport: 'Josué 4:3-8',
        explanation: 'Cada representante de una tribu tomó una piedra del lecho seco del Jordán.'
    },
    {
        id: 'can_ex_1_9',
        difficulty: 1,
        question: '¿Qué alimento dejó de caer del cielo al día siguiente de comer del fruto de Canaán?',
        options: ['El maná', 'Las codornices', 'La lluvia temprana', 'El rocío'],
        correctIndex: 0,
        verseSupport: 'Josué 5:12',
        explanation: 'Después de celebrar la Pascua y comer del grano de la tierra, cesó el maná.'
    },
    {
        id: 'can_ex_1_10',
        difficulty: 1,
        question: '¿Qué veterano compañero de Josué pidió el monte Hebrón como heredad a los 85 años?',
        options: ['Caleb', 'Otoniel', 'Finees', 'Acán'],
        correctIndex: 0,
        verseSupport: 'Josué 14:10-12',
        explanation: 'Caleb había seguido fielmente al Señor y pidió conquistar la región montañosa que se le prometió.'
    },
    {
        id: 'can_ex_1_11',
        difficulty: 1,
        question: '¿Qué famosa declaración hizo Josué al final de su vida ante las tribus en Siquem?',
        options: ['«Yo y mi casa serviremos al Señor»', '«El Señor es mi pastor»', '«Todo lo puedo en Dios»', '«La tierra es nuestra»'],
        correctIndex: 0,
        verseSupport: 'Josué 24:15',
        explanation: 'Josué desafió al pueblo a escoger a quién servir y afirmó la decisión de su propia casa.'
    },
    {
        id: 'can_ex_1_12',
        difficulty: 1,
        question: '¿Qué pidió Josué que se detuviera en el cielo durante la batalla en Gabaón?',
        options: ['El sol y la luna', 'Las nubes de lluvia', 'Las estrellas', 'El viento del este'],
        correctIndex: 0,
        verseSupport: 'Josué 10:12-13',
        explanation: 'El sol se detuvo en medio del cielo y la luna se paró hasta que el pueblo venció.'
    },
    {
        id: 'can_ex_1_13',
        difficulty: 1,
        question: '¿Qué hombre pecó tomando del anatema escondido en Jericó, provocando la derrota en Hai?',
        options: ['Acán', 'Giezi', 'Coré', 'Nadab'],
        correctIndex: 0,
        verseSupport: 'Josué 7:1-21',
        explanation: 'Acán escondió un manto babilónico, plata y un lingote de oro debajo de su tienda.'
    },

    // Nivel 2 (Discípulo) — +10
    {
        id: 'can_ex_2_1',
        difficulty: 2,
        question: '¿En qué lugar acampó Israel tras cruzar el Jordán y erigió las doce piedras?',
        options: ['Gilgal', 'Silo', 'Betel', 'Siquem'],
        correctIndex: 0,
        verseSupport: 'Josué 4:19-20',
        explanation: 'El pueblo subió del Jordán el día diez del mes primero y acampó en Gilgal.'
    },
    {
        id: 'can_ex_2_2',
        difficulty: 2,
        question: '¿Quién se apareció a Josué cerca de Jericó con una espada desenvainada en la mano?',
        options: ['El Príncipe del ejército del Señor', 'El profeta Samuel', 'Un anciano de Moab', 'El ángel Gabriel'],
        correctIndex: 0,
        verseSupport: 'Josué 5:13-15',
        explanation: 'Josué se postró y recibió la orden de quitarse el calzado porque el lugar era santo.'
    },
    {
        id: 'can_ex_2_3',
        difficulty: 2,
        question: '¿Qué pueblo engañó a Josué presentándose con odres rotos, pan mohoso y calzado viejo?',
        options: ['Los gabaonitas', 'Los amorreos', 'Los filisteos', 'Los madianitas'],
        correctIndex: 0,
        verseSupport: 'Josué 9:3-15',
        explanation: 'Los moradores de Gabaón fingieron venir de tierras muy lejanas para lograr un tratado de paz.'
    },
    {
        id: 'can_ex_2_4',
        difficulty: 2,
        question: '¿Dónde fue establecido el tabernáculo de reunión una vez sometida la tierra de Canaán?',
        options: ['En Silo', 'En Jericó', 'En Hebrón', 'En Gaza'],
        correctIndex: 0,
        verseSupport: 'Josué 18:1',
        explanation: 'Toda la congregación de Israel se reunió en Silo y erigió allí el tabernáculo.'
    },
    {
        id: 'can_ex_2_5',
        difficulty: 2,
        question: '¿Qué tribu no recibió territorio propio como las demás porque el Señor era su heredad?',
        options: ['La tribu de Leví', 'La tribu de Benjamín', 'La tribu de Judá', 'La tribu de Dan'],
        correctIndex: 0,
        verseSupport: 'Josué 13:33',
        explanation: 'A la tribu de Leví no se les dio heredad territorial, sino ciudades para habitar y los sacrificios.'
    },
    {
        id: 'can_ex_2_6',
        difficulty: 2,
        question: '¿Para qué servían las seis ciudades de refugio designadas en Canaán?',
        options: ['Proteger al homicida involuntario hasta su juicio', 'Almacenar el grano del diezmo', 'Celebrar las fiestas anuales', 'Alojar a los reyes extranjeros'],
        correctIndex: 0,
        verseSupport: 'Josué 20:2-6',
        explanation: 'Quien matara a alguien sin intención podía huir allí para quedar a salvo del vengador.'
    },
    {
        id: 'can_ex_2_7',
        difficulty: 2,
        question: '¿Sobre qué montes se leyeron las bendiciones y maldiciones de la ley ante Israel?',
        options: ['Gerizim y Ebal', 'Carmelo y Tabor', 'Sinaí y Horeb', 'Nebo y Pisga'],
        correctIndex: 0,
        verseSupport: 'Josué 8:33-34',
        explanation: 'La mitad del pueblo estaba frente al monte Gerizim y la otra mitad frente al monte Ebal.'
    },
    {
        id: 'can_ex_2_8',
        difficulty: 2,
        question: '¿Qué tribus edificaron un gran altar junto al Jordán que casi provoca una guerra civil hasta aclarar su propósito?',
        options: ['Rubén, Gad y media tribu de Manasés', 'Efraín, Dan y Neftalí', 'Judá, Simeón y Benjamín', 'Zabulón, Isacar y Aser'],
        correctIndex: 0,
        verseSupport: 'Josué 22:10-27',
        explanation: 'Explicaron que el altar era solo un testimonio de unidad con el resto de Israel y no para sacrificios.'
    },
    {
        id: 'can_ex_2_9',
        difficulty: 2,
        question: '¿Qué huesos que Israel trajo desde Egipto fueron sepultados finalmente en Siquem?',
        options: ['Los huesos de José', 'Los huesos de Jacob', 'Los huesos de Aarón', 'Los huesos de Abraham'],
        correctIndex: 0,
        verseSupport: 'Josué 24:32',
        explanation: 'Cumpliendo el juramento hecho en Génesis, sepultaron a José en la heredad de Siquem.'
    },
    {
        id: 'can_ex_2_10',
        difficulty: 2,
        question: '¿Cuál fue el error de los líderes de Israel antes de pactar con los gabaonitas?',
        options: ['No consultaron al Señor', 'No llevaron suficientes armas', 'Olvidaron contar los días', 'Dejaron atrás el arca'],
        correctIndex: 0,
        verseSupport: 'Josué 9:14',
        explanation: 'Tomaron de sus provisiones y cerraron paz sin consultar la boca del Señor.'
    },

    // Nivel 3 (Maestro) — +15
    {
        id: 'can_ex_3_1',
        difficulty: 3,
        question: '¿Qué distancia mínima debía guardar el pueblo respecto al arca del pacto al cruzar el Jordán?',
        options: ['Dos mil codos', 'Quinientos codos', 'Cien codos', 'Cinco mil codos'],
        correctIndex: 0,
        verseSupport: 'Josué 3:4',
        explanation: 'Debían mantener unos dos mil codos de distancia para poder ver el camino por donde ir.'
    },
    {
        id: 'can_ex_3_2',
        difficulty: 3,
        question: '¿En qué valle fue ejecutado Acán después de confesar su pecado en Jericó?',
        options: ['Valle de Acor', 'Valle de Elah', 'Valle de Cedrón', 'Valle de Jezreel'],
        correctIndex: 0,
        verseSupport: 'Josué 7:24-26',
        explanation: 'Por el trastorno causado a Israel, aquel lugar fue llamado valle de Acor.'
    },
    {
        id: 'can_ex_3_3',
        difficulty: 3,
        question: '¿Qué estratega de conquista usó Josué en el segundo ataque contra Hai?',
        options: ['Una emboscada detrás de la ciudad', 'Un cerco de siete días', 'Un ataque nocturno por el río', 'Torres de madera'],
        correctIndex: 0,
        verseSupport: 'Josué 8:3-8',
        explanation: 'Josué apostó hombres emboscados detrás de Hai y simuló huir para sacar al enemigo de la ciudad.'
    },
    {
        id: 'can_ex_3_4',
        difficulty: 3,
        question: '¿Qué ciudad era llamada antes Quiriat-arba y fue entregada a Caleb?',
        options: ['Hebrón', 'Debir', 'Laquis', 'Hazor'],
        correctIndex: 0,
        verseSupport: 'Josué 14:15',
        explanation: 'El nombre antiguo de Hebrón era Quiriat-arba, pues Arba fue un hombre grande entre los anaceos.'
    },
    {
        id: 'can_ex_3_5',
        difficulty: 3,
        question: '¿A quién dio Caleb a su hija Acsa por mujer tras conquistar Quiriat-séfer (Debir)?',
        options: ['A Otoniel', 'A Barac', 'A Ehúd', 'A Samgar'],
        correctIndex: 0,
        verseSupport: 'Josué 15:16-17',
        explanation: 'Otoniel hijo de Cenaz tomó la ciudad y más tarde fue el primer juez de Israel.'
    },
    {
        id: 'can_ex_3_6',
        difficulty: 3,
        question: '¿Qué rey de Jerusalén encabezó la coalición de cinco reyes amorreos contra Gabaón?',
        options: ['Adonisedec', 'Jabín', 'Sehón', 'Og'],
        correctIndex: 0,
        verseSupport: 'Josué 10:1-5',
        explanation: 'Adonisedec rey de Jerusalén convocó a los reyes de Hebrón, Jarmut, Laquis y Eglón.'
    },
    {
        id: 'can_ex_3_7',
        difficulty: 3,
        question: '¿Qué cayó del cielo sobre los enemigos mientras huían por la bajada de Bet-horón?',
        options: ['Grandes piedras de granizo', 'Brasas de fuego', 'Lluvia torrencial', 'Densa niebla'],
        correctIndex: 0,
        verseSupport: 'Josué 10:11',
        explanation: 'Fueron más los que murieron por las piedras de granizo que los muertos a filo de espada.'
    },
    {
        id: 'can_ex_3_8',
        difficulty: 3,
        question: '¿Qué ciudad del norte, cabeza de todos aquellos reinos, fue quemada por Josué tras vencer junto a las aguas de Merom?',
        options: ['Hazor', 'Meguido', 'Taanac', 'Cedes'],
        correctIndex: 0,
        verseSupport: 'Josué 11:10-13',
        explanation: 'De todas las ciudades sobre colinas, Israel quemó únicamente a Hazor.'
    },
    {
        id: 'can_ex_3_9',
        difficulty: 3,
        question: '¿Cuál era el nombre antiguo de la ciudad de Betel mencionado en Josué?',
        options: ['Luz', 'Jebús', 'Baala', 'Efrata'],
        correctIndex: 0,
        verseSupport: 'Josué 18:13',
        explanation: 'El límite pasaba hacia la ladera de Luz, que es Betel.'
    },
    {
        id: 'can_ex_3_10',
        difficulty: 3,
        question: '¿Cuántos reyes derrotaron Josué y los hijos de Israel al occidente del Jordán?',
        options: ['Treinta y un reyes', 'Doce reyes', 'Veinticuatro reyes', 'Cuarenta reyes'],
        correctIndex: 0,
        verseSupport: 'Josué 12:24',
        explanation: 'Josué 12 enumera treinta y un reyes vencidos en la conquista al oeste del Jordán.'
    },
    {
        id: 'can_ex_3_11',
        difficulty: 3,
        question: '¿Qué ciudad pidieron y recibieron las hijas de Zelofehad al distribuirse la tierra de Manasés?',
        options: ['Su propia heredad entre los hermanos de su padre', 'La ciudad de Jericó', 'El puerto de Jope', 'La llanura de Sarón'],
        correctIndex: 0,
        verseSupport: 'Josué 17:3-4',
        explanation: 'Josué les dio heredad conforme al mandamiento dado antes a Moisés.'
    },
    {
        id: 'can_ex_3_12',
        difficulty: 3,
        question: '¿Cuántos años tenía Josué cuando murió y fue sepultado en Timnat-sera?',
        options: ['110 años', '120 años', '100 años', '95 años'],
        correctIndex: 0,
        verseSupport: 'Josué 24:29-30',
        explanation: 'Murió Josué siervo del Señor a la edad de ciento diez años.'
    },
    {
        id: 'can_ex_3_13',
        difficulty: 3,
        question: '¿Qué ciudad recibió Josué como su propia heredad en los montes de Efraín?',
        options: ['Timnat-sera', 'Siló', 'Bet-el', 'Guibea'],
        correctIndex: 0,
        verseSupport: 'Josué 19:50',
        explanation: 'Según la palabra del Señor, le dieron la ciudad que pidió: Timnat-sera.'
    },
    {
        id: 'can_ex_3_14',
        difficulty: 3,
        question: '¿Qué sacerdote hijo de Eleazar encabezó la delegación enviada a las tribus del oriente por el altar?',
        options: ['Finees', 'Itamar', 'Abiathar', 'Sadoc'],
        correctIndex: 0,
        verseSupport: 'Josué 22:13',
        explanation: 'Finees hijo del sacerdote Eleazar fue con diez príncipes a dialogar pacíficamente.'
    },
    {
        id: 'can_ex_3_15',
        difficulty: 3,
        question: '¿Qué levantó Josué debajo de la encina junto al santuario en Siquem como testigo del pacto?',
        options: ['Una gran piedra', 'Un pilar de bronce', 'Una tienda blanca', 'Un árbol de cedro'],
        correctIndex: 0,
        verseSupport: 'Josué 24:26-27',
        explanation: 'Josué dijo al pueblo que aquella piedra sería testigo porque había oído todas las palabras del Señor.'
    },
];

export const TRIVIA_EPOCA_JUECES_EXTRA: TriviaQuestion[] = [
    // Nivel 1 (Semilla) — +12
    {
        id: 'jue_ex_1_1',
        difficulty: 1,
        question: '¿Qué mujer profetisa fue jueza de Israel y animó a Barac a ir a la batalla?',
        options: ['Débora', 'Rut', 'Noemí', 'Ana'],
        correctIndex: 0,
        verseSupport: 'Jueces 4:4-6',
        explanation: 'Débora juzgaba a Israel bajo una palmera entre Ramá y Bet-el.'
    },
    {
        id: 'jue_ex_1_2',
        difficulty: 1,
        question: '¿Con cuántos hombres escogidos venció Gedeón al enorme ejército de Madián?',
        options: ['Trescientos hombres', 'Tres mil hombres', 'Mil hombres', 'Diez mil hombres'],
        correctIndex: 0,
        verseSupport: 'Jueces 7:7',
        explanation: 'Dios redujo el ejército a trescientos hombres para que Israel supiera que la victoria era suya.'
    },
    {
        id: 'jue_ex_1_3',
        difficulty: 1,
        question: '¿En qué residía el secreto de la fuerza sobrenatural de Sansón como nazareo?',
        options: ['Nunca pasaba navaja por su cabeza', 'Bebía solo agua de manantial', 'Llevaba un cinturón de bronce', 'Ayunaba cada semana'],
        correctIndex: 0,
        verseSupport: 'Jueces 16:17',
        explanation: 'Sansón estaba consagrado a Dios desde el vientre y su cabello largo era señal de su voto nazareo.'
    },
    {
        id: 'jue_ex_1_4',
        difficulty: 1,
        question: '¿Qué mujer filistea sonsacó a Sansón el secreto de su fuerza?',
        options: ['Dalila', 'Rahab', 'Jezabel', 'Atalía'],
        correctIndex: 0,
        verseSupport: 'Jueces 16:4-18',
        explanation: 'Dalila insistió día tras día hasta que Sansón le descubrió todo su corazón.'
    },
    {
        id: 'jue_ex_1_5',
        difficulty: 1,
        question: '¿Qué joven moabita dijo a su suegra Noemí: «Tu pueblo será mi pueblo, y tu Dios mi Dios»?',
        options: ['Rut', 'Orfa', 'Raquel', 'Tamar'],
        correctIndex: 0,
        verseSupport: 'Rut 1:16',
        explanation: 'Rut decidió quedarse fielmente junto a Noemí y regresar con ella a Belén.'
    },
    {
        id: 'jue_ex_1_6',
        difficulty: 1,
        question: '¿Quién fue el pariente redentor que se casó con Rut en Belén?',
        options: ['Booz', 'Elimelec', 'Mahlón', 'Salmón'],
        correctIndex: 0,
        verseSupport: 'Rut 4:13',
        explanation: 'Booz tomó a Rut por mujer y de ellos nació Obed, abuelo del rey David.'
    },
    {
        id: 'jue_ex_1_7',
        difficulty: 1,
        question: '¿Qué arma improvisada usó Sansón para derrotar a mil filisteos en Lehi?',
        options: ['Una quijada de asno fresca', 'Un bastón de hierro', 'Una lanza de bronce', 'Una honda de cuero'],
        correctIndex: 0,
        verseSupport: 'Jueces 15:15',
        explanation: 'Hallando una quijada de asno fresca, Sansón extendió la mano y mató con ella a mil hombres.'
    },
    {
        id: 'jue_ex_1_8',
        difficulty: 1,
        question: '¿Qué frase resume la situación espiritual de Israel al final del libro de Jueces?',
        options: ['«Cada uno hacía lo que bien le parecía»', '«Todos buscaban al Señor de corazón»', '«No había falta de profetas»', '«El reino estaba en paz»'],
        correctIndex: 0,
        verseSupport: 'Jueces 21:25',
        explanation: 'En aquellos días no había rey en Israel y cada uno hacía lo que bien le parecía.'
    },
    {
        id: 'jue_ex_1_9',
        difficulty: 1,
        question: '¿Dónde estaba Gedeón escondido trillar trigo cuando se le apareció el ángel del Señor?',
        options: ['En el lagar', 'En la cueva de Adulam', 'En el monte Tabor', 'Junto al río Cisón'],
        correctIndex: 0,
        verseSupport: 'Jueces 6:11',
        explanation: 'Gedeón sacudía trigo en el lagar para esconderlo de los madianitas.'
    },
    {
        id: 'jue_ex_1_10',
        difficulty: 1,
        question: '¿Qué hizo Sansón al final de su vida cuando fue llevado al templo de Dagón?',
        options: ['Derribó las dos columnas principales del templo', 'Huyó por una ventana secreta', 'Venció a un león ante el rey', 'Rompió las puertas de bronce'],
        correctIndex: 0,
        verseSupport: 'Jueces 16:28-30',
        explanation: 'Sansón clamó a Dios por fuerza, empujó las dos columnas centrales y cayó el templo.'
    },
    {
        id: 'jue_ex_1_11',
        difficulty: 1,
        question: '¿Qué hacía Rut en los campos de Booz para sostener a Noemí y a sí misma?',
        options: ['Espigaba detrás de los segadores', 'Pastoreaba ovejas', 'Tejía mantos de lino', 'Vendía aceite'],
        correctIndex: 0,
        verseSupport: 'Rut 2:2-7',
        explanation: 'Según la ley de Israel para los pobres y extranjeros, Rut recogía las espigas caídas.'
    },
    {
        id: 'jue_ex_1_12',
        difficulty: 1,
        question: '¿Qué gran rey de Israel descendió directamente de Rut y Booz?',
        options: ['El rey David', 'El rey Saúl', 'El rey Josafat', 'El rey Ezequías'],
        correctIndex: 0,
        verseSupport: 'Rut 4:17-22',
        explanation: 'Booz engendró a Obed, Obed a Isaí, e Isaí engendró al rey David.'
    },

    // Nivel 2 (Discípulo) — +8
    {
        id: 'jue_ex_2_1',
        difficulty: 2,
        question: '¿Qué prueba usó Dios junto al agua para elegir a los trescientos hombres de Gedeón?',
        options: ['Lamer el agua con la lengua llevándola en la mano a la boca', 'Cruzar el arroyo nadando con armadura', 'Beber de rodillas sin soltar la lanza', 'Llenar un cántaro en silencio'],
        correctIndex: 0,
        verseSupport: 'Jueces 7:5-6',
        explanation: 'Solo trescientos hombres llevaron el agua en su mano a la boca manteniéndose alerta.'
    },
    {
        id: 'jue_ex_2_2',
        difficulty: 2,
        question: '¿Cómo dio muerte Jael al comandante enemigo Sísara después de darle refugio en su tienda?',
        options: ['Con una estaca de la tienda y un mazo', 'Con una espada oculta', 'Con veneno en la leche', 'Llamando a Barac'],
        correctIndex: 0,
        verseSupport: 'Jueces 4:21',
        explanation: 'Mientras Sísara dormía agotado, Jael tomó una estaca de la tienda y un mazo.'
    },
    {
        id: 'jue_ex_2_3',
        difficulty: 2,
        question: '¿Qué juez zurdo libró a Israel del rey Eglón de Moab?',
        options: ['Aod (Ehúd)', 'Otoniel', 'Tola', 'Jair'],
        correctIndex: 0,
        verseSupport: 'Jueces 3:15-21',
        explanation: 'Aod era zurdo y llevó un puñal de dos filos ceñido sobre su muslo derecho.'
    },
    {
        id: 'jue_ex_2_4',
        difficulty: 2,
        question: '¿Qué nombre pidió Noemí que le pusieran al regresar amargada y viuda a Belén?',
        options: ['Mara', 'Sará', 'Hulda', 'Ester'],
        correctIndex: 0,
        verseSupport: 'Rut 1:20',
        explanation: '«No me llaméis Noemí, sino llamadme Mara; porque en grande amargura me ha puesto el Todopoderoso».'
    },
    {
        id: 'jue_ex_2_5',
        difficulty: 2,
        question: '¿Qué otro nombre recibió Gedeón después de derribar el altar de Baal?',
        options: ['Jerobaal', 'Abimelec', 'Barac', 'Galaad'],
        correctIndex: 0,
        verseSupport: 'Jueces 6:32',
        explanation: 'Su padre Joás dijo: «Contienda Baal contra él, por cuanto derribó su altar».'
    },
    {
        id: 'jue_ex_2_6',
        difficulty: 2,
        question: '¿Con qué objeto destruyó Samgar a seiscientos filisteos para librar a Israel?',
        options: ['Una aguijada de bueyes', 'Una hoz de hierro', 'Una maza de piedra', 'Un arco de bronce'],
        correctIndex: 0,
        verseSupport: 'Jueces 3:31',
        explanation: 'Samgar hijo de Anat hirió a seiscientos hombres de los filisteos con una aguijada de bueyes.'
    },
    {
        id: 'jue_ex_2_7',
        difficulty: 2,
        question: '¿Qué hizo Jefté antes de salir a pelear contra los hijos de Amón que le trajo gran dolor al volver?',
        options: ['Hizo un voto precipitado de ofrecer lo primero que saliera de su casa', 'Dividió su ejército sin avisar', 'Quemó la ciudad de Mizpa', 'Huyó al desierto'],
        correctIndex: 0,
        verseSupport: 'Jueces 11:30-35',
        explanation: 'Al volver victorioso, su única hija salió a recibirlo con panderos y danzas.'
    },
    {
        id: 'jue_ex_2_8',
        difficulty: 2,
        question: '¿Qué acertijo propuso Sansón a los treinta compañeros en su fiesta de bodas?',
        options: ['«Del devorador salió comida, y del fuerte salió dulzura»', '«¿Qué vuela sin alas y ruge sin boca?»', '«Más fuerte que el león y más suave que el aceite»', '«Siete lámparas en un campo oscuro»'],
        correctIndex: 0,
        verseSupport: 'Jueces 14:14',
        explanation: 'El enigma aludía al león que Sansón había matado y al panal de miel que encontró en él.'
    },

    // Nivel 3 (Maestro) — +8
    {
        id: 'jue_ex_3_1',
        difficulty: 3,
        question: '¿Qué palabra usaban los hombres de Galaad en los vados del Jordán para identificar a los de Efraín?',
        options: ['Shibolet', 'Eben-ezer', 'Maranata', 'Hosanna'],
        correctIndex: 0,
        verseSupport: 'Jueces 12:6',
        explanation: 'Los de Efraín no podían pronunciar correctamente «Shibolet» y decían «Sibolet».'
    },
    {
        id: 'jue_ex_3_2',
        difficulty: 3,
        question: '¿Qué hijo de Gedeón proclamó ser rey en Siquem tras matar a sus setenta hermanos sobre una piedra?',
        options: ['Abimelec', 'Jotam', 'Zebul', 'Gaal'],
        correctIndex: 0,
        verseSupport: 'Jueces 9:5-6',
        explanation: 'Solo Jotam, el hijo menor, escapó escondiéndose y pronunció la fábula de los árboles.'
    },
    {
        id: 'jue_ex_3_3',
        difficulty: 3,
        question: '¿Qué le dio Booz a Rut de madrugada en la era para que llevara a Noemí?',
        options: ['Seis medidas de cebada en su manto', 'Treinta siclos de plata', 'Dos corderos y pan', 'Un odre de vino'],
        correctIndex: 0,
        verseSupport: 'Rut 3:15',
        explanation: 'Booz midió seis medidas de cebada y las puso sobre el manto de Rut.'
    },
    {
        id: 'jue_ex_3_4',
        difficulty: 3,
        question: '¿Qué se entregaba antiguamente en Israel en señal de confirmación al ceder un derecho de redención?',
        options: ['El zapato (sandalia)', 'El anillo de sello', 'El manto exterior', 'Una vara de madera'],
        correctIndex: 0,
        verseSupport: 'Rut 4:7-8',
        explanation: 'El pariente más cercano se quitó su zapato y lo dio a Booz para confirmar el trato ante los ancianos.'
    },
    {
        id: 'jue_ex_3_5',
        difficulty: 3,
        question: '¿Qué objeto de oro hizo Gedeón tras la victoria que terminó convirtiéndose en tropiezo e idolatría para Israel?',
        options: ['Un efod', 'Un becerro', 'Una corona', 'Un altar alto'],
        correctIndex: 0,
        verseSupport: 'Jueces 8:27',
        explanation: 'Gedeón lo puso en su ciudad de Ofra y todo Israel se prostituyó tras él.'
    },
    {
        id: 'jue_ex_3_6',
        difficulty: 3,
        question: '¿Qué arroyo se desbordó y barrió a los carros de hierro de Sísara en la batalla de Débora y Barac?',
        options: ['El arroyo de Cisón', 'El arroyo de Cedrón', 'El río Arnón', 'El arroyo de Besor'],
        correctIndex: 0,
        verseSupport: 'Jueces 5:21',
        explanation: 'El cántico de Débora celebra que «los barrió el torrente de Cisón, el antiguo torrente».'
    },
    {
        id: 'jue_ex_3_7',
        difficulty: 3,
        question: '¿Quién fue el primer juez que levantó el Señor tras la muerte de Josué, librando a Israel de Cusan-risataim?',
        options: ['Otoniel', 'Aod', 'Samgar', 'Barac'],
        correctIndex: 0,
        verseSupport: 'Jueces 3:9-10',
        explanation: 'El Espíritu del Señor vino sobre Otoniel hijo de Cenaz y juzgó a Israel.'
    },
    {
        id: 'jue_ex_3_8',
        difficulty: 3,
        question: '¿Dónde quedó asentado el pariente de Noemí y Elimelec originalmente antes de emigrar a Moab?',
        options: ['Belén de Judá', 'Nazaret de Galilea', 'Hebrón', 'Jericó'],
        correctIndex: 0,
        verseSupport: 'Rut 1:1-2',
        explanation: 'Elimelec, Noemí y sus hijos Mahlón y Quelión eran efrateos de Belén de Judá.'
    },
];

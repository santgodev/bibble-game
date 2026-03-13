import { TriviaQuestion } from './categories';

export const TRIVIA_NUEVO: TriviaQuestion[] = [
    // --- NIVEL SEMILLA (20) ---
    {
        id: 'nt1',
        question: '¿Cuántos evangelios hay en el Nuevo Testamento?',
        options: ['3', '4', '5', '12'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Los evangelios son Mateo, Marcos, Lucas y Juan.',
        verseSupport: '-'
    },
    {
        id: 'nt2',
        question: '¿Quién nació en un pesebre en Belén?',
        options: ['Juan el Bautista', 'Pedro', 'Jesús', 'Pablo'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Jesús nació en un establo porque no había lugar en el mesón.',
        verseSupport: 'Lucas 2:7'
    },
    {
        id: 'nt3',
        question: '¿En qué río fue bautizado Jesús?',
        options: ['Río Nilo', 'Río Jordán', 'Río Éufrates', 'Mar Rojo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Juan el Bautista bautizó a Jesús en el río Jordán.',
        verseSupport: 'Mateo 3:13'
    },
    {
        id: 'nt4',
        question: '¿Quién caminó sobre el agua hacia Jesús?',
        options: ['Juan', 'Santiago', 'Pedro', 'Andrés'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Pedro salió de la barca y caminó hacia Jesús sobre el mar.',
        verseSupport: 'Mateo 14:29'
    },
    {
        id: 'nt5',
        question: '¿Quién traicionó a Jesús por 30 piezas de plata?',
        options: ['Pedro', 'Judas Iscariote', 'Tomás', 'Bartolomé'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Judas fue uno de los doce apóstoles que traicionó al Señor.',
        verseSupport: 'Mateo 26:14-15'
    },
    {
        id: 'nt6',
        question: '¿Quién fue el primer apóstol en negar a Jesús tres veces?',
        options: ['Juan', 'Mateo', 'Pedro', 'Tadeo'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Pedro prometió no negarlo, pero lo hizo antes de que el gallo cantara.',
        verseSupport: 'Mateo 26:75'
    },
    {
        id: 'nt7',
        question: '¿Qué ciudad fue el hogar de Jesús durante su niñez y juventud?',
        options: ['Jerusalén', 'Nazaret', 'Capernaúm', 'Jericó'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Jesús fue conocido como el Nazareno.',
        verseSupport: 'Mateo 2:23'
    },
    {
        id: 'nt8',
        question: '¿Cuántos panes y peces usó Jesús para alimentar a 5,000 hombres?',
        options: ['7 panes y 2 peces', '5 panes y 2 peces', '12 panes y 1 pez', '3 panes y 3 peces'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Con cinco panes y dos peces alimentó a la multitud y sobraron doce cestas.',
        verseSupport: 'Mateo 14:17-20'
    },
    {
        id: 'nt9',
        question: '¿Quién fue el hombre que resucitó Jesús tras cuatro días de muerto?',
        options: ['Bartimeo', 'Lázaro', 'Zaqueo', 'Nicodemo'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Lázaro era el hermano de Marta y María.',
        verseSupport: 'Juan 11:43-44'
    },
    {
        id: 'nt10',
        question: '¿Quién escribió el libro de Apocalipsis?',
        options: ['Pablo', 'Juan el apóstol', 'Lucas', 'Pedro'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Juan recibió las visiones estando en la isla de Patmos.',
        verseSupport: 'Apocalipsis 1:1'
    },
    {
        id: 'nt11',
        question: '¿En qué ciudad tuvo lugar la venida del Espíritu Santo en Pentecostés?',
        options: ['Antioquía', 'Jerusalén', 'Roma', 'Éfeso'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Los discípulos estaban todos juntos en el aposento alto.',
        verseSupport: 'Hechos 2:1'
    },
    {
        id: 'nt12',
        question: '¿Quién era el perseguidor de cristianos que se convirtió en apóstol?',
        options: ['Bernabé', 'Saulo (Pablo)', 'Cornelio', 'Agripa'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Jesús se le apareció camino a Damasco.',
        verseSupport: 'Hechos 9:3-5'
    },
    {
        id: 'nt13',
        question: '¿Qué significa la palabra "Evangelio"?',
        options: ['Buenas Nuevas', 'Moisés', 'Salvación', 'Historia de Dios'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Proviene del griego "euangelion".',
        verseSupport: '-'
    },
    {
        id: 'nt14',
        question: '¿Cuántas veces dijo Jesús que debemos perdonar?',
        options: ['7 veces', 'Hasta 70 veces 7', '3 veces', '100 veces'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Esto indica un perdón ilimitado.',
        verseSupport: 'Mateo 18:22'
    },
    {
        id: 'nt15',
        question: '¿Qué usaron los soldados romanos para burlarse de Jesús llamándolo Rey?',
        options: ['Una corona de oro', 'Una corona de espinas', 'Un cetro de plata', 'Un manto de seda'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Le pusieron una corona de espinas y una caña como cetro.',
        verseSupport: 'Mateo 27:29'
    },
    {
        id: 'nt16',
        question: '¿Quién pidió el cuerpo de Jesús para enterrarlo?',
        options: ['Nicodemo', 'Simón Pedro', 'José de Arimatea', 'Juan'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'José de Arimatea era un discípulo rico y secreto.',
        verseSupport: 'Mateo 27:57'
    },
    {
        id: 'nt17',
        question: '¿Quién vio a Jesús primero después de su resurrección?',
        options: ['Pedro', 'María Magdalena', 'Juan', 'Santiago'],
        correctIndex: 1,
        difficulty: 1,
        explanation: 'Jesús se le apareció cerca del sepulcro vacío.',
        verseSupport: 'Juan 20:14-16'
    },
    {
        id: 'nt18',
        question: '¿Qué instrumento tocó un ángel al aparecer ante los pastores en Navidad?',
        options: ['Arpa', 'Trompeta', 'Ninguno, cantaron', 'Flauta'],
        correctIndex: 2,
        difficulty: 1,
        explanation: 'Apareció una multitud de las huestes celestiales alabando a Dios y diciendo: ¡Gloria a Dios en las alturas!',
        verseSupport: 'Lucas 2:13-14'
    },
    {
        id: 'nt19',
        question: '¿A qué mar se refieren cuando dicen "Mar de Galilea"?',
        options: ['Lago de Genesaret', 'Mar Muerto', 'Mar Mediterráneo', 'Océano'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'También se le conoce como Mar de Tiberias o Lago de Genesaret.',
        verseSupport: 'Lucas 5:1'
    },
    {
        id: 'nt20',
        question: '¿Qué apóstol era recaudador de impuestos?',
        options: ['Mateo', 'Lucas', 'Pedro', 'Juan'],
        correctIndex: 0,
        difficulty: 1,
        explanation: 'Mateo (también llamado Leví) estaba en el banco de los tributos.',
        verseSupport: 'Mateo 9:9'
    },

    // --- NIVEL DISCÍPULO (20) ---
    {
        id: 'nt21',
        question: '¿Cuál es el capítulo conocido como el "Himno al Amor"?',
        options: ['Romanos 8', '1 Corintios 13', 'Efesios 6', 'Mateo 5'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Describe las características del amor cristiano ágape.',
        verseSupport: '1 Corintios 13'
    },
    {
        id: 'nt22',
        question: '¿Quién era el eunuco etíope que bautizó Felipe?',
        options: ['Un soldado', 'Un funcionario de Candace', 'Un rey', 'Un sacerdote'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Felipe le explicó la profecía de Isaías.',
        verseSupport: 'Hechos 8:27-38'
    },
    {
        id: 'nt23',
        question: '¿Cómo se llama la carta que Pablo escribió sobre la armadura de Dios?',
        options: ['Colosenses', 'Filipenses', 'Efesios', 'Gálatas'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Efesios 6 detalla cada parte de la armadura espiritual.',
        verseSupport: 'Efesios 6:10-18'
    },
    {
        id: 'nt24',
        question: '¿Qué apóstol fue arrojado en una isla llamada Patmos?',
        options: ['Pablo', 'Pedro', 'Juan', 'Andrés'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Juan fue desterrado por causa de la palabra de Dios.',
        verseSupport: 'Apocalipsis 1:9'
    },
    {
        id: 'nt25',
        question: '¿Quién era el compañero de Pablo en la cárcel de Filipos que cantaba himnos a medianoche?',
        options: ['Bernabé', 'Silas', 'Timoteo', 'Lucas'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Hubo un gran terremoto y las puertas se abrieron.',
        verseSupport: 'Hechos 16:25-26'
    },
    {
        id: 'nt26',
        question: '¿A qué iglesia escribió Pablo su carta más extensa sobre la doctrina de la justificación?',
        options: ['Corintios', 'Romanos', 'Gálatas', 'Hebreos'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'La epístola a los Romanos es fundamental para entender la salvación.',
        verseSupport: 'Romanos 3:24-28'
    },
    {
        id: 'nt27',
        question: '¿Quién escribió el libro de Santiago?',
        options: ['Santiago el mayor', 'Santiago el hermano de Jesús', 'Juan', 'Pedro'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Se cree que fue Jacobo (Santiago), líder de la iglesia en Jerusalén.',
        verseSupport: '-'
    },
    {
        id: 'nt28',
        question: '¿Qué significa la frase "Anatema Maranata"?',
        options: ['Maldito, el Señor viene', 'Bendición eterna', 'Paz de Dios', 'No lo sé'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Anatema significa apartado para destrucción y Maranata es el Señor viene.',
        verseSupport: '1 Corintios 16:22'
    },
    {
        id: 'nt29',
        question: '¿Quién fue el primer mártir cristiano?',
        options: ['Santiago', 'Pedro', 'Esteban', 'Andrés'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Esteban fue apedreado mientras veía los cielos abiertos.',
        verseSupport: 'Hechos 7:59-60'
    },
    {
        id: 'nt30',
        question: '¿Cuántas iglesias son mencionadas al inicio del libro de Apocalipsis?',
        options: ['3', '7', '12', '10'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Son las siete iglesias de Asia Menor.',
        verseSupport: 'Apocalipsis 1:11'
    },
    {
        id: 'nt31',
        question: '¿Qué apóstol era médico?',
        options: ['Mateo', 'Lucas', 'Juan', 'Tomás'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Pablo le llama "Lucas, el médico amado".',
        verseSupport: 'Colosenses 4:14'
    },
    {
        id: 'nt32',
        question: '¿A quién fue dirigida la carta de Filemón?',
        options: ['A una iglesia', 'A un esclavo', 'A un amo cristiano', 'A Timoteo'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Pablo intercedió por Onésimo ante Filemón.',
        verseSupport: 'Filemón 1:1'
    },
    {
        id: 'nt33',
        question: '¿Quién era la mujer que vendía púrpura en Filipos y se convirtió?',
        options: ['Priscila', 'Lidia', 'Dorcas', 'Pebbe'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Lidia abrió su casa para hospedar a Pablo.',
        verseSupport: 'Hechos 16:14-15'
    },
    {
        id: 'nt34',
        question: '¿Cuál es el tema central de la carta a los Hebreos?',
        options: ['La ley', 'La superioridad de Cristo', 'El fin del mundo', 'La sabiduría'],
        correctIndex: 1,
        difficulty: 2,
        explanation: 'Muestra a Jesús como superior a ángeles, a Moisés y al antiguo sacerdocio.',
        verseSupport: 'Hebreos 1:3-4'
    },
    {
        id: 'nt35',
        question: '¿Cuántos viajes misioneros principales de Pablo narra el libro de Hechos?',
        options: ['1', '2', '3', '5'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Hechos detalla tres viajes antes de su arresto y viaje a Roma.',
        verseSupport: 'Hechos 13-21'
    },
    {
        id: 'nt36',
        question: '¿En qué ciudad fueron llamados "cristianos" por primera vez?',
        options: ['Jerusalén', 'Roma', 'Antioquía', 'Éfeso'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Ocurrió durante el ministerio de Bernabé y Saulo allí.',
        verseSupport: 'Hechos 11:26'
    },
    {
        id: 'nt37',
        question: '¿Qué milagro realizó Jesús en las bodas de Caná?',
        options: ['Convertir el agua en vino', 'Resucitar a un niño', 'Sanar a un leproso', 'Multiplicar panes'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Fue la primera manifestación de su gloria ante sus discípulos.',
        verseSupport: 'Juan 2:1-11'
    },
    {
        id: 'nt38',
        question: '¿Qué autor del Nuevo Testamento era recaudador de impuestos?',
        options: ['Marcos', 'Juan', 'Mateo', 'Pablo'],
        correctIndex: 2,
        difficulty: 2,
        explanation: 'Mateo Leví dejó su mesa de recaudación para seguir a Jesús.',
        verseSupport: 'Mateo 9:9'
    },
    {
        id: 'nt39',
        question: '¿Cuál es la fruta mencionada en Gálatas 5:22 como fruto del Espíritu?',
        options: ['Amor, gozo, paz...', 'Uvas y higos', 'Manzanas y peras', 'Dones y talentos'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Es un solo fruto con múltiples características.',
        verseSupport: 'Gálatas 5:22-23'
    },
    {
        id: 'nt40',
        question: '¿En qué lugar fue crucificado Jesús?',
        options: ['Gólgota', 'Monte de los Olivos', 'Dentro del templo', 'Belén'],
        correctIndex: 0,
        difficulty: 2,
        explanation: 'Gólgota significa lugar de la calavera.',
        verseSupport: 'Juan 19:17'
    },

    // --- NIVEL APÓSTOL (20) ---
    {
        id: 'nt41',
        question: '¿Quién escribió la epístola de Judas?',
        options: ['Judas Iscariote', 'Judas el hermano de Jacobo y Jesús', 'Judas Tadeo apóstol', 'Ninguno'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Se presenta como siervo de Jesucristo y hermano de Jacobo.',
        verseSupport: 'Judas 1:1'
    },
    {
        id: 'nt42',
        question: '¿Qué significa el nombre griego "Paracleto" aplicado al Espíritu Santo?',
        options: ['El que es Santo', 'Consolador / Ayudador', 'Fuego purificador', 'Viento fuerte'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Proviene de "parakletos", alguien llamado al lado de otro para ayudar.',
        verseSupport: 'Juan 14:16'
    },
    {
        id: 'nt43',
        question: '¿Cuál es el misterio que Pablo menciona en Efesios respecto a los gentiles?',
        options: ['Que se salvarán por obras', 'Que son coherederos con los judíos', 'Que no deben circuncidarse', 'Que tendrán su propio reino'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'El misterio antes oculto era la unión de judíos y gentiles en un solo cuerpo.',
        verseSupport: 'Efesios 3:6'
    },
    {
        id: 'nt44',
        question: '¿Cuántos ancianos ve Juan alrededor del trono de Dios en Apocalipsis 4?',
        options: ['12', '24', '144,000', '7'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Juan vio veinticuatro tronos con veinticuatro ancianos sentados.',
        verseSupport: 'Apocalipsis 4:4'
    },
    {
        id: 'nt45',
        question: '¿Quién era el sumo sacerdote cuando Pablo compareció ante el Sanedrín en Jerusalén?',
        options: ['Caifás', 'Ananías', 'Anás', 'Alejandro'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Ananías mandó golpear a Pablo en la boca.',
        verseSupport: 'Hechos 23:2'
    },
    {
        id: 'nt46',
        question: '¿Qué emperador romano menciona Lucas al datar el nacimiento de Jesús?',
        options: ['Julio César', 'César Augusto', 'Tiberio César', 'Nerón'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Augusto promulgó un edicto para censar a todo el imperio.',
        verseSupport: 'Lucas 2:1'
    },
    {
        id: 'nt47',
        question: '¿Cuál es el nombre del lugar donde se llevará a cabo la gran batalla mencionada en Apocalipsis 16?',
        options: ['Valle de Josafat', 'Armagedón', 'Monte Sion', 'Éufrates'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Los reyes de la tierra son reunidos allí.',
        verseSupport: 'Apocalipsis 16:16'
    },
    {
        id: 'nt48',
        question: '¿A qué autor del Nuevo Testamento se le atribuye el concepto de "Kenosis" (El despojo de Cristo)?',
        options: ['Pedro', 'Juan', 'Pablo', 'Mateo'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Se desarrolla en el himno de Filipenses 2:7.',
        verseSupport: 'Filipenses 2:7'
    },
    {
        id: 'nt49',
        question: '¿Qué profecía del Antiguo Testamento citó Pedro en el día de Pentecostés?',
        options: ['Isaías 53', 'Joel 2:28-32', 'Amós 9', 'Miqueas 5'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Pedro explicó que el derramamiento del Espíritu era lo dicho por Joel.',
        verseSupport: 'Hechos 2:16-21'
    },
    {
        id: 'nt50',
        question: '¿Quién era el procónsul de Acaya que se negó a juzgar a Pablo por cuestiones religiosas?',
        options: ['Galión', 'Félix', 'Festo', 'Pilato'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Galión era hermano del filósofo Séneca.',
        verseSupport: 'Hechos 18:12-16'
    },
    {
        id: 'nt51',
        question: '¿Cuál de estos siete diáconos elegidos se convirtió después en un evangelista itinerante?',
        options: ['Esteban', 'Prócoro', 'Felipe', 'Parmenas'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Felipe evangelizó Samaria y al eunuco etíope.',
        verseSupport: 'Hechos 8:5, 21:8'
    },
    {
        id: 'nt52',
        question: '¿En qué libro se menciona la doctrina del Melquisedec superior a Leví?',
        options: ['Romanos', 'Gálatas', 'Hebreos', 'Apocalipsis'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'El autor de Hebreos lo usa para elevar el sacerdocio de Jesús.',
        verseSupport: 'Hebreos 7:4-10'
    },
    {
        id: 'nt53',
        question: '¿Quién fue el primer converso gentil en Europa según Hechos de los Apóstoles?',
        options: ['Lidia', 'El carcelero de Filipos', 'Dionisio', 'Damaris'],
        correctIndex: 0,
        difficulty: 3,
        explanation: 'Lidia era una vendedora de púrpura en Filipos.',
        verseSupport: 'Hechos 16:14'
    },
    {
        id: 'nt54',
        question: '¿A qué ciudad estaba dirigida la carta que menciona el concepto del "Arrebatamiento"?',
        options: ['Tesalónica', 'Corinto', 'Éfeso', 'Colosas'],
        correctIndex: 0,
        difficulty: 3,
        explanation: '1 Tesalonicenses 4:17 usa la palabra "arrebatados".',
        verseSupport: '1 Tesalonicenses 4:17'
    },
    {
        id: 'nt55',
        question: '¿Cuál fue la última carta que escribió Pablo antes de su martirio?',
        options: ['Tito', '1 Timoteo', '2 Timoteo', 'Romanos'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Escribió "He peleado la buena batalla".',
        verseSupport: '2 Timoteo 4:7'
    },
    {
        id: 'nt56',
        question: '¿En qué evangelio se encuentran los siete discursos "Yo soy" de Jesús?',
        options: ['Mateo', 'Marcos', 'Lucas', 'Juan'],
        correctIndex: 3,
        difficulty: 3,
        explanation: 'Incluyen: Yo soy el pan de vida, la luz del mundo, etc.',
        verseSupport: '-'
    },
    {
        id: 'nt57',
        question: '¿Qué significa la palabra "Apostasía" mencionada en 2 Tesalonicenses?',
        options: ['Caída en pecado', 'Rebelión o abandono de la fe', 'Persecución extrema', 'Segunda venida'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Se refiere al alejamiento deliberado de la verdad de Dios.',
        verseSupport: '2 Tesalonicenses 2:3'
    },
    {
        id: 'nt58',
        question: '¿A quién fue dirigida la tercera epístola de Juan?',
        options: ['A la señora elegida', 'A Gayo', 'A Diótrefes', 'A Demetrio'],
        correctIndex: 1,
        difficulty: 3,
        explanation: 'Juan felicita a Gayo por su hospitalidad.',
        verseSupport: '3 Juan 1:1'
    },
    {
        id: 'nt59',
        question: '¿Cuántos son los sellos que abre el Cordero en Apocalipsis capítulos 6 al 8?',
        options: ['12', '10', '7', '4'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'El séptimo sello da lugar a las siete trompetas.',
        verseSupport: 'Apocalipsis 6:1'
    },
    {
        id: 'nt60',
        question: '¿Cuál es la última frase de la Biblia?',
        options: ['Amén.', 'Vengo pronto.', 'La gracia del Señor Jesús sea con todos. Amén.', 'Gloria a Dios.'],
        correctIndex: 2,
        difficulty: 3,
        explanation: 'Apocalipsis cierra con esta bendición apostólica.',
        verseSupport: 'Apocalipsis 22:21'
    },
];

import { WordItem } from './categories';

/**
 * Palabras del Nuevo Testamento Expandidas.
 * Incluye descripciones y pistas para el juego del Impostor.
 */
export const WORDS_NUEVO: WordItem[] = [
    // --- MATEO (mat) ---
    { id: 'mat01', word: 'Genealogía', difficulty: 2, description: 'La lista de los antepasados de Jesús desde Abraham.', impostorHints: ['Es una lista larga', 'Empieza el evangelio', 'Menciona a David'] },
    { id: 'mat02', word: 'Magos', difficulty: 1, description: 'Sabios de oriente que trajeron regalos al niño Jesús.', impostorHints: ['Siguen una estrella', 'Traen regalos', 'Son tres'] },
    { id: 'mat03', word: 'Herodes', difficulty: 2, description: 'Rey que intentó matar al niño Jesús.', impostorHints: ['Es un rey malvado', 'Mandó matar niños', 'Tenía miedo del Mesías'] },
    { id: 'mat04', word: 'Sermón del Monte', difficulty: 2, description: 'La gran enseñanza de Jesús sobre el Reino en una montaña.', impostorHints: ['Ocurre en una elevación', 'Tiene muchas enseñanzas', 'Incluye bienaventuranzas'] },
    { id: 'mat05', word: 'Bienaventuranzas', difficulty: 2, description: 'Dichos de Jesús que empiezan con "Bienaventurados".', impostorHints: ['Significa felicidad', 'Son promesas', 'Empiezan con "Dichosos"'] },
    { id: 'mat06', word: 'Sal de la Tierra', difficulty: 1, description: 'Metáfora sobre la influencia de los cristianos.', impostorHints: ['Es un condimento', 'Da sabor', 'Preserva'] },
    { id: 'mat07', word: 'Luz del Mundo', difficulty: 1, description: 'Jesús dice que sus seguidores deben brillar.', impostorHints: ['Alumbra todo', 'No se puede esconder', 'Está en un candelero'] },
    { id: 'mat08', word: 'Puerta Estrecha', difficulty: 2, description: 'El camino difícil que lleva a la vida eterna.', impostorHints: ['Es difícil entrar', 'Pocos la hallan', 'No es la ancha'] },
    { id: 'mat09', word: 'Centurión', difficulty: 2, description: 'Oficial romano con gran fe en Jesús.', impostorHints: ['Es un militar', 'Tiene soldados a su mando', 'Tenía un siervo enfermo'] },
    { id: 'mat10', word: 'Parábola', difficulty: 1, description: 'Historia terrenal con un significado espiritual.', impostorHints: ['Es un cuento con mensaje', 'Jesús las usaba mucho', 'Es una comparación'] },
    { id: 'mat11', word: 'Sembrador', difficulty: 1, description: 'El hombre que sale a esparcir la palabra.', impostorHints: ['Usa semillas', 'Hay diferentes suelos', 'Busca fruto'] },
    { id: 'mat12', word: 'Cizaña', difficulty: 2, description: 'Planta que crece junto al trigo.', impostorHints: ['Se parece al trigo', 'Es mala hierba', 'Se separa al final'] },
    { id: 'mat13', word: 'Perla Grande', difficulty: 2, description: 'El tesoro por el cual se vende todo lo demás.', impostorHints: ['Es joya preciosa', 'Es un comerciante', 'Vale mucho'] },
    { id: 'mat14', word: 'Caminando sobre el mar', difficulty: 1, description: 'Milagro de Jesús y Pedro sobre las aguas.', impostorHints: ['No se hundió', 'Hubo viento fuerte', 'Pedro tuvo miedo'] },
    { id: 'mat15', word: 'Transfiguración', difficulty: 3, description: 'Jesús mostró su gloria en el monte.', impostorHints: ['Su ropa brilló', 'Aparecieron Moisés y Elías', 'Hubo una nube'] },
    { id: 'mat16', word: 'Perdón', difficulty: 1, description: 'Setenta veces siete.', impostorHints: ['Es olvidar la falta', 'Jesús lo pide siempre', 'No guardar rencor'] },
    { id: 'mat17', word: 'Talentos', difficulty: 2, description: 'Monedas dadas a siervos según su capacidad.', impostorHints: ['Es dinero', 'Uno lo enterró', 'Hay que multiplicarlos'] },
    { id: 'mat18', word: 'Ovejas y Cabritos', difficulty: 2, description: 'Juicio final separando a unos de otros.', impostorHints: ['Son animales', 'Unos van a la derecha', 'Otros a la izquierda'] },
    { id: 'mat19', word: 'Getsemaní', difficulty: 2, description: 'Huerto donde Jesús oró antes de su muerte.', impostorHints: ['Es un lugar de olivos', 'Hubo mucha angustia', 'Los discípulos durmieron'] },
    { id: 'mat20', word: 'Gran Comisión', difficulty: 2, description: 'Mandato final de ir por todo el mundo.', impostorHints: ['Es un envío', 'Bautizar naciones', 'Hasta el fin del mundo'] },

    // --- MARCOS (mar) ---
    { id: 'mar01', word: 'Siervo', difficulty: 2, description: 'Enfoque de Marcos sobre Jesús como servidor.', impostorHints: ['No vino a ser servido', 'Es alguien que obedece', 'Es humilde'] },
    { id: 'mar02', word: 'Al Instante', difficulty: 3, description: 'La rapidez con la que Jesús sanaba y llamaba.', impostorHints: ['Es muy rápido', 'Sucede de inmediato', 'No hay espera'] },
    { id: 'mar03', word: 'Marcos', difficulty: 1, description: 'El autor del evangelio más corto.', impostorHints: ['Acompañó a Pedro', 'Escribió para romanos', 'Se fue de un viaje con Pablo'] },
    { id: 'mar04', word: 'Legión', difficulty: 2, description: 'Nombre de los demonios en el endemoniado gadareno.', impostorHints: ['Significa "muchos"', 'Usa término militar', 'Fueron a los cerdos'] },
    { id: 'mar05', word: 'Cerdos', difficulty: 1, description: 'Animales donde entraron los demonios de Gadara.', impostorHints: ['Son animales impuros', 'Se lanzaron al mar', 'Corrieron por el despeñadero'] },
    { id: 'mar06', word: 'Levántate Niña', difficulty: 3, description: 'Milagro donde Jesús resucita a la hija de Jairo.', impostorHints: ['Se dijo a alguien que dormía', 'Es un milagro de vida', 'La hija de un principal'] },
    { id: 'mar07', word: 'Abrir los Oídos', difficulty: 3, description: 'Jesús sana a un sordo tartamudo diciendo "Efata".', impostorHints: ['Se tocó la lengua', 'Se puso los dedos en los oídos', 'Significa apertura'] },

    // --- LUCAS (luc) ---
    { id: 'luc01', word: 'Zacarías', difficulty: 2, description: 'Sacerdote, padre de Juan el Bautista.', impostorHints: ['Se quedó mudo', 'Esposo de Elisabet', 'Era anciano'] },
    { id: 'luc02', word: 'Elisabet', difficulty: 2, description: 'Madre de Juan el Bautista.', impostorHints: ['Pariente de María', 'Era estéril', 'Saltó el bebé en su vientre'] },
    { id: 'luc03', word: 'Cántico de María', difficulty: 3, description: 'Expresión de gozo de María al saber que sería madre del Mesías.', impostorHints: ['Es una canción', 'Habla de humildad', 'Dios hizo grandes cosas'] },
    { id: 'luc04', word: 'Pesebre', difficulty: 1, description: 'Lugar donde los animales comen, cuna de Jesús.', impostorHints: ['Hay paja', 'Se usa en graneros', 'No hubo lugar en el mesón'] },
    { id: 'luc05', word: 'Pastores', difficulty: 1, description: 'Primeros en recibir la noticia del nacimiento.', impostorHints: ['Cuidan ovejas', 'Estaban en el campo', 'Vieron ángeles'] },
    { id: 'luc06', word: 'Simeón', difficulty: 3, description: 'Anciano que esperaba ver al Mesías.', impostorHints: ['Estaba en el templo', 'Vio al niño Jesús', 'Dijo que podía morir en paz'] },
    { id: 'luc07', word: 'Nazaret', difficulty: 1, description: 'Ciudad donde creció Jesús.', impostorHints: ['Es una ciudad humilde', 'Lugar de origen de Jesús', 'Está en Galilea'] },
    { id: 'luc08', word: 'Buen Samaritano', difficulty: 1, description: 'Hombre que ayudó al herido en el camino.', impostorHints: ['Venía de Samaria', 'Pagó en un mesón', 'Amó a su prójimo'] },
    { id: 'luc09', word: 'Hijo Pródigo', difficulty: 1, description: 'Hijo que regresó al padre tras perderlo todo.', impostorHints: ['Pidió su parte', 'Comía con cerdos', 'Papá hizo fiesta'] },
    { id: 'luc10', word: 'Zaqueo', difficulty: 1, description: 'Recaudador pequeño que subió a un árbol.', impostorHints: ['Era bajito', 'Cobraba impuestos', 'Devolvió lo robado'] },
    { id: 'luc11', word: 'Emaús', difficulty: 2, description: 'Camino donde dos discípulos vieron a Jesús resucitado.', impostorHints: ['Están caminando', 'No lo reconocieron', 'Partió el pan'] },
    { id: 'luc12', word: 'Ascensión', difficulty: 2, description: 'Jesús subiendo al cielo ante sus discípulos.', impostorHints: ['Fue hacia arriba', 'En una nube', 'En el monte de los Olivos'] },

    // --- JUAN (jua) ---
    { id: 'jua01', word: 'Verbo', difficulty: 2, description: 'Jesús como la Palabra eterna de Dios.', impostorHints: ['Era en el principio', 'Es con Dios', 'Es Dios'] },
    { id: 'jua02', word: 'Vino', difficulty: 1, description: 'Milagro en las bodas de Caná.', impostorHints: ['Fue el primero', 'Agua en tinajas', 'Era del bueno'] },
    { id: 'jua03', word: 'Nicodemo', difficulty: 2, description: 'Fariseo que vino a Jesús de noche.', impostorHints: ['Es un maestro', 'Nacer de nuevo', 'Vino en secreto'] },
    { id: 'jua04', word: 'Samaritana', difficulty: 2, description: 'Mujer en el pozo de Jacob.', impostorHints: ['Sacaba agua', 'Tuvo 5 maridos', 'Agua viva'] },
    { id: 'jua05', word: 'Betesda', difficulty: 2, description: 'Estanque con cinco pórticos para enfermos.', impostorHints: ['Se movía el agua', 'Había un ángel', 'Cama o lecho'] },
    { id: 'jua06', word: 'Pan de Vida', difficulty: 1, description: 'Jesús dice que es el alimento espiritual.', impostorHints: ['No tendrán hambre', 'Bajó del cielo', 'Es uno de los "Yo Soy"'] },
    { id: 'jua07', word: 'Buen Pastor', difficulty: 1, description: 'Jesús cuida a sus ovejas y da su vida.', impostorHints: ['Llama por nombre', 'Entra por la puerta', 'Conoce a las suyas'] },
    { id: 'jua08', word: 'Vid Verdadera', difficulty: 2, description: 'Metáfora de Jesús y sus discípulos (pámpanos).', impostorHints: ['Da frutos', 'Hay que permanecer', 'Tiene ramas'] },
    { id: 'jua09', word: 'Lázaro', difficulty: 1, description: 'Amigo de Jesús resucitado tras 4 días.', impostorHints: ['Estaba muerto', 'Salió con vendas', 'Betania'] },
    { id: 'jua10', word: 'Lavamiento', difficulty: 2, description: 'Jesús lavó los pies de los discípulos.', impostorHints: ['Es un acto humilde', 'Usó una toalla', 'Pedro se opuso'] },
    { id: 'jua11', word: 'Consolador', difficulty: 2, description: 'Promesa del Espíritu Santo enviada por el Padre.', impostorHints: ['Viene después', 'Nos enseña', 'Es el Espíritu'] },
    { id: 'jua12', word: 'Gólgota', difficulty: 2, description: 'Lugar de la Calavera donde fue la crucifixión.', impostorHints: ['Es una colina', 'Afuera de la ciudad', 'Cruz'] },

    // --- HECHOS Y CARTAS (hch) ---
    { id: 'nt_hch_01', word: 'Pentecostés', difficulty: 2, description: 'Venida del Espíritu con lenguas de fuego.', impostorHints: ['Un estruendo', 'Cincuenta días después', 'Hablaron lenguas'] },
    { id: 'nt_hch_02', word: 'Esteban', difficulty: 2, description: 'Primer mártir de la iglesia cristiana.', impostorHints: ['Fue apedreado', 'Vio el cielo abierto', 'Era un diácono'] },
    { id: 'nt_hch_03', word: 'Damasco', difficulty: 2, description: 'Camino donde Saulo tuvo su encuentro con Jesús.', impostorHints: ['Hubo una luz fuerte', 'Saulo cayó', 'Se quedó ciego'] },
    { id: 'nt_hch_04', word: 'Cornelio', difficulty: 3, description: 'Primer gentil bautizado por Pedro.', impostorHints: ['Era un centurión', 'Vio una visión', 'Cesarea'] },
    { id: 'nt_hch_05', word: 'Antioquía', difficulty: 3, description: 'Lugar donde se llamó "Cristianos" por primera vez.', impostorHints: ['Es una ciudad', 'Bernabé y Saulo', 'Base misionera'] },
    { id: 'nt_hch_06', word: 'Macedonia', difficulty: 3, description: 'Visión de Pablo de un varón pidiendo ayuda.', impostorHints: ['Pasa a nosotros', 'Es una región', 'En Filipos'] },
    { id: 'nt_hch_07', word: 'Predicación en la Colina', difficulty: 3, description: 'Pablo predica a los filósofos sobre el Dios no conocido.', impostorHints: ['Ocurrió en Atenas', 'Había muchos sabios', 'En un lugar alto'] },
    { id: 'nt_hch_08', word: 'Armadura', difficulty: 2, description: 'Metáfora de Efesios sobre la defensa espiritual.', impostorHints: ['El escudo de la fe', 'El casco', 'La verdad'] },
    { id: 'nt_hch_09', word: 'Amor', difficulty: 1, description: 'El camino más excelente (1 Corintios 13).', impostorHints: ['Nunca deja de ser', 'Es sufrido', 'No es jactancioso'] },
    { id: 'nt_hch_10', word: 'Apocalipsis', difficulty: 2, description: 'Revelación final dada a Juan en Patmos.', impostorHints: ['Visiones del futuro', 'Siete sellos', 'Victoria final'] },
    { id: 'nt_hch_11', word: 'Patmos', difficulty: 3, description: 'Isla de exilio donde Juan recibió revelación.', impostorHints: ['Rodeada de mar', 'Es una isla', 'Juan estaba preso'] },
    { id: 'nt_hch_12', word: 'Nueva Jerusalén', difficulty: 2, description: 'Ciudad celestial descendiendo de Dios.', impostorHints: ['Calles de oro', 'No hay sol', 'Doce puertas'] },

    // --- MÁS EVANGELIOS (EXTRAS) ---
    { id: 'nt_ext_01', word: 'Publicano', difficulty: 2, description: 'Recaudador de impuestos odiado por los judíos.', impostorHints: ['Maneja dinero', 'Levemente traidor', 'Mateo lo era'] },
    { id: 'nt_ext_02', word: 'Sinagoga', difficulty: 1, description: 'Lugar de reunión y enseñanza de los judíos.', impostorHints: ['Hay un rabino', 'Se leen rollos', 'Sábado'] },
    { id: 'nt_ext_03', word: 'Luz de Verdad', difficulty: 3, description: 'El conocimiento espiritual que libera al creyente.', impostorHints: ['Es entendimiento', 'Viene de Dios', 'Alumbra el alma'] },
    { id: 'nt_ext_04', word: 'Incienso', difficulty: 2, description: 'Resina aromática para la adoración.', impostorHints: ['Humo perfumado', 'Oraciones de santos', 'Tabernáculo'] },
    { id: 'nt_ext_05', word: 'Misterio', difficulty: 3, description: 'Verdad revelada por Dios en su tiempo.', impostorHints: ['Estaba oculto', 'Ahora es claro', 'Secreto divino'] },
    { id: 'nt_ext_06', word: 'Alfolí', difficulty: 2, description: 'Lugar de depósito de los diezmos.', impostorHints: ['Granero espiritual', 'Haya alimento', 'Para la casa de Dios'] },
    { id: 'nt_ext_07', word: 'Mecedora', difficulty: 1, description: 'No estrictamente bíblica pero recordada en parábolas.', impostorHints: ['No es bíblico por sí mismo', 'Tradición'] }, // Filtro descartado
    { id: 'nt_ext_08', word: 'Cuerda de tres dobleces', difficulty: 2, description: 'Metáfora de unión y fortaleza.', impostorHints: ['No se rompe', 'Eclesiastés', 'Matrimonio'] },

    // NIVEL 1 (Semilla) - 20 más
    { id: 's01', word: 'Jesús', difficulty: 1, description: 'El Mesías, el Salvador del mundo.', impostorHints: ['Es el camino', 'El hijo de Dios', 'Carpintero'] },
    { id: 's02', word: 'Estrella', difficulty: 1, description: 'Señal en el cielo para los magos.', impostorHints: ['Brilla de noche', 'Guía', 'Apareció en oriente'] },
    { id: 's03', word: 'Cruz', difficulty: 1, description: 'Donde Jesús murió por los pecados.', impostorHints: ['Madera', 'Madero', 'Símbolo cristiano'] },
    { id: 's04', word: 'Oveja', difficulty: 1, description: 'Metáfora del seguidor de Cristo.', impostorHints: ['Dice beee', 'Pierde el camino', 'Tiene pastor'] },
    { id: 's05', word: 'Pan', difficulty: 1, description: 'Símbolo del cuerpo de Cristo.', impostorHints: ['Se come', 'Hecho de harina', 'Se parte'] },
    { id: 's06', word: 'Pescador', difficulty: 1, description: 'Oficio de los apóstoles.', impostorHints: ['Usa redes', 'En el mar', 'Saca peces'] },
    { id: 's07', word: 'Cielo', difficulty: 1, description: 'Lugar donde mora Dios.', impostorHints: ['Arriba', 'Azul', 'Eterno'] },
    { id: 's08', word: 'Paloma', difficulty: 1, description: 'Símbolo del Espíritu Santo.', impostorHints: ['Es un ave', 'Blanca', 'Descendió'] },
    { id: 's09', word: 'Corazón', difficulty: 1, description: 'Donde debe habitar la Palabra.', impostorHints: ['Late', 'Sentimientos', 'Centro del alma'] },
    { id: 's10', word: 'Biblia', difficulty: 1, description: 'La Palabra escrita de Dios.', impostorHints: ['Libro sagrado', 'Tiene dos testamentos', 'Espada del Espíritu'] }
];

import rawGospels from './gospelsNtv.json';
import { DoodleKind } from '../trivia/components/EditorialDoodle';

export type GospelId = 'mateo' | 'marcos' | 'lucas' | 'juan';

export interface BibleVerse {
    verse: number;
    text: string;
    heading?: string;
}

export interface BibleChapter {
    number: number;
    verses: BibleVerse[];
}

export interface GospelBookMeta {
    id: GospelId;
    title: string;
    subtitle: string;
    accentBg: string;
    accentText: string;
    doodle: DoodleKind;
    doodleTint: string;
    coverImage: any;
    available: boolean;
    chapters: BibleChapter[];
}

const data = rawGospels as Record<GospelId, { id: GospelId; title: string; chapters: BibleChapter[] }>;

const JUAN_SCENES = [
    require('../../assets/study/juan/cap-01/verbo_1_eternidad.jpg'),
    require('../../assets/study/juan/cap-01/verbo_2_creacion.jpg'),
    require('../../assets/study/juan/cap-01/verbo_3_encarnacion.jpg'),
];

export const GOSPEL_BOOKS: GospelBookMeta[] = [
    {
        id: 'mateo',
        title: 'Mateo',
        subtitle: 'El Rey prometido',
        accentBg: '#DCECE8',
        accentText: '#2E6F65',
        doodle: 'crown',
        doodleTint: '#FFFFFF',
        coverImage: require('../../assets/study/covers/gospel_mateo.jpg'),
        available: false,
        chapters: data.mateo.chapters,
    },
    {
        id: 'marcos',
        title: 'Marcos',
        subtitle: 'El Siervo en acción',
        accentBg: '#D6E8F8',
        accentText: '#1E3A5F',
        doodle: 'dove',
        doodleTint: '#FFFFFF',
        coverImage: require('../../assets/study/covers/gospel_marcos.jpg'),
        available: true,
        chapters: data.marcos.chapters,
    },
    {
        id: 'lucas',
        title: 'Lucas',
        subtitle: 'El Salvador cercano',
        accentBg: '#F5DA7C',
        accentText: '#8A6408',
        doodle: 'olive',
        doodleTint: '#FFFFFF',
        coverImage: require('../../assets/study/covers/gospel_lucas.jpg'),
        available: false,
        chapters: data.lucas.chapters,
    },
    {
        id: 'juan',
        title: 'Juan',
        subtitle: 'El Verbo hecho vida',
        accentBg: '#DCECE8',
        accentText: '#2E6F65',
        doodle: 'scroll',
        doodleTint: '#68AEEB',
        coverImage: JUAN_SCENES[0],
        available: false,
        chapters: data.juan.chapters,
    },
];

export const getGospelById = (id: GospelId): GospelBookMeta =>
    GOSPEL_BOOKS.find(b => b.id === id) || GOSPEL_BOOKS[0];

export const getGospelChapterImage = (gospelId: GospelId, chapterNumber: number): any => {
    if (gospelId === 'juan') {
        return JUAN_SCENES[(chapterNumber - 1) % JUAN_SCENES.length];
    }
    return getGospelById(gospelId).coverImage;
};

export interface ChapterSceneVisual {
    startVerse: number;
    label: string;
    ref?: string;
    image: any;
    scale?: number;
}

const MARCOS_CH1_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Juan el Bautista en el desierto',
        ref: 'v.1–8',
        image: require('../../assets/study/marcos/cap-01/marcos_1_bautista.jpg'),
    },
    {
        startVerse: 9,
        label: 'Bautismo y tentación de Jesús',
        ref: 'v.9–15',
        image: require('../../assets/study/marcos/cap-01/marcos_1_bautismo.jpg'),
    },
    {
        startVerse: 16,
        label: 'Llamado a los primeros discípulos',
        ref: 'v.16–20',
        image: require('../../assets/study/marcos/cap-01/marcos_1_discipulos.jpg'),
    },
    {
        startVerse: 21,
        label: 'Enseñanza y autoridad en Capernaum',
        ref: 'v.21–28',
        image: require('../../assets/study/marcos/cap-01/marcos_1_sinagoga.jpg'),
    },
    {
        startVerse: 29,
        label: 'Jesús sana a mucha gente',
        ref: 'v.29–34',
        image: require('../../assets/study/marcos/cap-01/marcos_1_sanidad.jpg'),
    },
    {
        startVerse: 35,
        label: 'Oración antes del alba',
        ref: 'v.35–39',
        image: require('../../assets/study/marcos/cap-01/marcos_1_oracion.jpg'),
    },
    {
        startVerse: 40,
        label: 'Jesús sana a un leproso',
        ref: 'v.40–45',
        image: require('../../assets/study/marcos/cap-01/marcos_1_leproso.jpg'),
    },
];

const MARCOS_CH2_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús sana a un paralítico',
        ref: 'v.1–12',
        image: require('../../assets/study/marcos/cap-02/marcos_2_paralitico.jpg'),
    },
    {
        startVerse: 13,
        label: 'Jesús llama a Leví (Mateo)',
        ref: 'v.13–17',
        image: require('../../assets/study/marcos/cap-02/marcos_2_levi.jpg'),
    },
    {
        startVerse: 18,
        label: 'Vino nuevo en odres nuevos',
        ref: 'v.18–22',
        image: require('../../assets/study/marcos/cap-02/marcos_2_odres.jpg'),
    },
    {
        startVerse: 23,
        label: 'El Señor del día de descanso',
        ref: 'v.23–28',
        image: require('../../assets/study/marcos/cap-02/marcos_2_espigas.jpg'),
    },
];

const MARCOS_CH3_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús sana en el día de descanso',
        ref: 'v.1–6',
        image: require('../../assets/study/marcos/cap-03/marcos_3_mano.jpg'),
    },
    {
        startVerse: 7,
        label: 'La multitud sigue a Jesús',
        ref: 'v.7–12',
        image: require('../../assets/study/marcos/cap-03/marcos_3_multitud.jpg'),
    },
    {
        startVerse: 13,
        label: 'Jesús escoge a los doce apóstoles',
        ref: 'v.13–19',
        image: require('../../assets/study/marcos/cap-03/marcos_3_doce.jpg'),
    },
    {
        startVerse: 20,
        label: 'Una casa dividida no permanece',
        ref: 'v.20–30',
        image: require('../../assets/study/marcos/cap-03/marcos_3_casa_dividida.jpg'),
    },
    {
        startVerse: 31,
        label: 'La verdadera familia de Jesús',
        ref: 'v.31–35',
        image: require('../../assets/study/marcos/cap-03/marcos_3_familia.jpg'),
    },
];

const MARCOS_CH4_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Parábola del sembrador',
        ref: 'v.1–20',
        image: require('../../assets/study/marcos/cap-04/marcos_4_sembrador.jpg'),
    },
    {
        startVerse: 21,
        label: 'Parábola de la lámpara',
        ref: 'v.21–25',
        image: require('../../assets/study/marcos/cap-04/marcos_4_lampara.jpg'),
    },
    {
        startVerse: 35,
        label: 'Jesús calma la tormenta',
        ref: 'v.35–41',
        image: require('../../assets/study/marcos/cap-04/marcos_4_tormenta.jpg'),
    },
];

const MARCOS_CH5_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús libera al endemoniado geraseno',
        ref: 'v.1–20',
        image: require('../../assets/study/marcos/cap-05/marcos_5_geraseno.jpg'),
    },
    {
        startVerse: 21,
        label: 'La mujer toca el manto de Jesús',
        ref: 'v.21–34',
        image: require('../../assets/study/marcos/cap-05/marcos_5_manto.jpg'),
    },
    {
        startVerse: 35,
        label: 'Talita cum: Jesús levanta a la niña',
        ref: 'v.35–43',
        image: require('../../assets/study/marcos/cap-05/marcos_5_talita.jpg'),
    },
];

const MARCOS_CH6_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús es rechazado en Nazaret',
        ref: 'v.1–6',
        image: require('../../assets/study/marcos/cap-06/marcos_6_nazaret.jpg'),
    },
    {
        startVerse: 7,
        label: 'Jesús envía a los doce de dos en dos',
        ref: 'v.7–13',
        image: require('../../assets/study/marcos/cap-06/marcos_6_envio.jpg'),
    },
    {
        startVerse: 14,
        label: 'Muerte de Juan el Bautista',
        ref: 'v.14–29',
        image: require('../../assets/study/marcos/cap-06/marcos_6_juan.jpg'),
    },
    {
        startVerse: 30,
        label: 'Jesús alimenta a cinco mil',
        ref: 'v.30–44',
        image: require('../../assets/study/marcos/cap-06/marcos_6_cinco_mil.jpg'),
    },
    {
        startVerse: 45,
        label: 'Jesús camina sobre el agua',
        ref: 'v.45–52',
        image: require('../../assets/study/marcos/cap-06/marcos_6_agua.jpg'),
    },
    {
        startVerse: 53,
        label: 'Sanidades en Genesaret',
        ref: 'v.53–56',
        image: require('../../assets/study/marcos/cap-06/marcos_6_genesaret.jpg'),
    },
];

const MARCOS_CH7_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús enseña sobre la pureza interior',
        ref: 'v.1–15',
        image: require('../../assets/study/marcos/cap-07/marcos_7_tradicion.jpg'),
    },
    {
        startVerse: 17,
        label: 'Lo que sale del corazón',
        ref: 'v.17–23',
        image: require('../../assets/study/marcos/cap-07/marcos_7_corazon.jpg'),
    },
    {
        startVerse: 24,
        label: 'La fe de la mujer sirofenicia',
        ref: 'v.24–30',
        image: require('../../assets/study/marcos/cap-07/marcos_7_sirofenicia.jpg'),
    },
    {
        startVerse: 31,
        label: 'Efatá: Jesús sana a un sordo',
        ref: 'v.31–37',
        image: require('../../assets/study/marcos/cap-07/marcos_7_sordo.jpg'),
    },
];

const MARCOS_CH8_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús alimenta a cuatro mil',
        ref: 'v.1–10',
        image: require('../../assets/study/marcos/cap-08/marcos_8_cuatro_mil.jpg'),
    },
    {
        startVerse: 11,
        label: 'Los fariseos exigen una señal milagrosa',
        ref: 'v.11–13',
        image: require('../../assets/study/marcos/cap-08/marcos_8_senal.jpg'),
    },
    {
        startVerse: 14,
        label: 'La levadura de los fariseos y de Herodes',
        ref: 'v.14–21',
        image: require('../../assets/study/marcos/cap-08/marcos_8_levadura.jpg'),
    },
    {
        startVerse: 22,
        label: 'Jesús sana a un ciego en Betsaida',
        ref: 'v.22–26',
        image: require('../../assets/study/marcos/cap-08/marcos_8_ciego.jpg'),
    },
    {
        startVerse: 27,
        label: 'Declaración de Pedro: Tú eres el Mesías',
        ref: 'v.27–30',
        image: require('../../assets/study/marcos/cap-08/marcos_8_mesias.jpg'),
    },
    {
        startVerse: 31,
        label: 'Jesús predice su muerte y llama a seguirlo',
        ref: 'v.31–38',
        image: require('../../assets/study/marcos/cap-08/marcos_8_cruz.jpg'),
    },
];

const MARCOS_CH9_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'La transfiguración',
        ref: 'v.1–13',
        image: require('../../assets/study/marcos/cap-09/marcos_9_transfiguracion.jpg'),
    },
    {
        startVerse: 14,
        label: 'Jesús sana a un muchacho endemoniado',
        ref: 'v.14–29',
        image: require('../../assets/study/marcos/cap-09/marcos_9_muchacho.jpg'),
    },
    {
        startVerse: 30,
        label: 'Jesús predice otra vez su muerte',
        ref: 'v.30–32',
        image: require('../../assets/study/marcos/cap-09/marcos_9_camino.jpg'),
    },
    {
        startVerse: 33,
        label: 'El más importante en el reino',
        ref: 'v.33–37',
        image: require('../../assets/study/marcos/cap-09/marcos_9_nino.jpg'),
    },
    {
        startVerse: 38,
        label: 'Un vaso de agua en nombre de Jesús',
        ref: 'v.38–41',
        image: require('../../assets/study/marcos/cap-09/marcos_9_agua.jpg'),
    },
    {
        startVerse: 42,
        label: 'Tengan sal y vivan en paz',
        ref: 'v.42–50',
        image: require('../../assets/study/marcos/cap-09/marcos_9_sal.jpg'),
    },
];

const MARCOS_CH10_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Discusión sobre el divorcio y el matrimonio',
        ref: 'v.1–12',
        image: require('../../assets/study/marcos/cap-10/marcos_10_matrimonio.jpg'),
    },
    {
        startVerse: 13,
        label: 'Jesús bendice a los niños',
        ref: 'v.13–16',
        image: require('../../assets/study/marcos/cap-10/marcos_10_ninos.jpg'),
    },
    {
        startVerse: 17,
        label: 'El joven rico',
        ref: 'v.17–31',
        image: require('../../assets/study/marcos/cap-10/marcos_10_rico.jpg'),
    },
    {
        startVerse: 32,
        label: 'Camino a Jerusalén',
        ref: 'v.32–34',
        image: require('../../assets/study/marcos/cap-10/marcos_10_jerusalen.jpg'),
    },
    {
        startVerse: 35,
        label: 'Jesús enseña sobre el servicio',
        ref: 'v.35–45',
        image: require('../../assets/study/marcos/cap-10/marcos_10_servicio.jpg'),
    },
    {
        startVerse: 46,
        label: 'Jesús sana al ciego Bartimeo',
        ref: 'v.46–52',
        image: require('../../assets/study/marcos/cap-10/marcos_10_bartimeo.jpg'),
    },
];

const MARCOS_CH11_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Entrada triunfal de Jesús',
        ref: 'v.1–11',
        image: require('../../assets/study/marcos/cap-11/marcos_11_entrada.jpg'),
    },
    {
        startVerse: 12,
        label: 'Jesús maldice la higuera',
        ref: 'v.12–14',
        image: require('../../assets/study/marcos/cap-11/marcos_11_higuera.jpg'),
    },
    {
        startVerse: 15,
        label: 'Jesús despeja el templo',
        ref: 'v.15–25',
        image: require('../../assets/study/marcos/cap-11/marcos_11_templo.jpg'),
    },
    {
        startVerse: 27,
        label: 'Desafían la autoridad de Jesús',
        ref: 'v.27–33',
        image: require('../../assets/study/marcos/cap-11/marcos_11_autoridad.jpg'),
    },
];

const MARCOS_CH12_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Parábola de los agricultores malvados',
        ref: 'v.1–12',
        image: require('../../assets/study/marcos/cap-12/marcos_12_vinedo.jpg'),
    },
    {
        startVerse: 13,
        label: 'Los impuestos para el César',
        ref: 'v.13–17',
        image: require('../../assets/study/marcos/cap-12/marcos_12_cesar.jpg'),
    },
    {
        startVerse: 18,
        label: 'Discusión sobre la resurrección',
        ref: 'v.18–27',
        image: require('../../assets/study/marcos/cap-12/marcos_12_resurreccion.jpg'),
    },
    {
        startVerse: 28,
        label: 'El mandamiento más importante',
        ref: 'v.28–34',
        image: require('../../assets/study/marcos/cap-12/marcos_12_mandamiento.jpg'),
    },
    {
        startVerse: 35,
        label: '¿De quién es hijo el Mesías?',
        ref: 'v.35–40',
        image: require('../../assets/study/marcos/cap-12/marcos_12_mesias.jpg'),
    },
    {
        startVerse: 41,
        label: 'La ofrenda de la viuda',
        ref: 'v.41–44',
        image: require('../../assets/study/marcos/cap-12/marcos_12_viuda.jpg'),
    },
];

const MARCOS_CH13_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús enseña en el monte de los Olivos',
        ref: 'v.1–23',
        image: require('../../assets/study/marcos/cap-13/marcos_13_olivos.jpg'),
    },
    {
        startVerse: 24,
        label: 'La venida del Hijo del Hombre',
        ref: 'v.24–27',
        image: require('../../assets/study/marcos/cap-13/marcos_13_venida.jpg'),
    },
    {
        startVerse: 28,
        label: 'La lección de la higuera',
        ref: 'v.28–31',
        image: require('../../assets/study/marcos/cap-13/marcos_13_higuera.jpg'),
    },
    {
        startVerse: 32,
        label: 'Manténganse alerta y velando',
        ref: 'v.32–37',
        image: require('../../assets/study/marcos/cap-13/marcos_13_alerta.jpg'),
    },
];

const MARCOS_CH14_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Jesús es ungido en Betania',
        ref: 'v.1–9',
        image: require('../../assets/study/marcos/cap-14/marcos_14_betania.jpg'),
    },
    {
        startVerse: 10,
        label: 'Judas acuerda traicionar a Jesús',
        ref: 'v.10–11',
        image: require('../../assets/study/marcos/cap-14/marcos_14_judas_acuerdo.jpg'),
    },
    {
        startVerse: 12,
        label: 'Preparación de la Pascua',
        ref: 'v.12–16',
        image: require('../../assets/study/marcos/cap-14/marcos_14_pascua.jpg'),
    },
    {
        startVerse: 17,
        label: 'Jesús anuncia la traición',
        ref: 'v.17–21',
        image: require('../../assets/study/marcos/cap-14/marcos_14_anuncio_traicion.jpg'),
    },
    {
        startVerse: 22,
        label: 'La última cena: el pan',
        ref: 'v.22',
        image: require('../../assets/study/marcos/cap-14/marcos_14_pan.jpg'),
    },
    {
        startVerse: 23,
        label: 'La última cena: la copa del pacto',
        ref: 'v.23–26',
        image: require('../../assets/study/marcos/cap-14/marcos_14_copa.jpg'),
    },
    {
        startVerse: 27,
        label: 'Jesús predice la negación de Pedro',
        ref: 'v.27–31',
        image: require('../../assets/study/marcos/cap-14/marcos_14_promesa_pedro.jpg'),
    },
    {
        startVerse: 32,
        label: 'Jesús ora en Getsemaní',
        ref: 'v.32–36',
        image: require('../../assets/study/marcos/cap-14/marcos_14_getsemani.jpg'),
    },
    {
        startVerse: 37,
        label: 'Velen y oren en Getsemaní',
        ref: 'v.37–42',
        image: require('../../assets/study/marcos/cap-14/marcos_14_velen.jpg'),
    },
    {
        startVerse: 43,
        label: 'El beso de Judas',
        ref: 'v.43–45',
        image: require('../../assets/study/marcos/cap-14/marcos_14_beso.jpg'),
    },
    {
        startVerse: 46,
        label: 'Arresto de Jesús',
        ref: 'v.46–52',
        image: require('../../assets/study/marcos/cap-14/marcos_14_arresto.jpg'),
    },
    {
        startVerse: 53,
        label: 'Testigos falsos ante el Concilio',
        ref: 'v.53–59',
        image: require('../../assets/study/marcos/cap-14/marcos_14_testigos.jpg'),
    },
    {
        startVerse: 60,
        label: 'Jesús ante el Concilio',
        ref: 'v.60–65',
        image: require('../../assets/study/marcos/cap-14/marcos_14_concilio.jpg'),
    },
    {
        startVerse: 66,
        label: 'Pedro niega a Jesús junto a la fogata',
        ref: 'v.66–71',
        image: require('../../assets/study/marcos/cap-14/marcos_14_fogata.jpg'),
    },
    {
        startVerse: 72,
        label: 'Canta el gallo y Pedro llora',
        ref: 'v.72',
        image: require('../../assets/study/marcos/cap-14/marcos_14_gallo.jpg'),
    },
];

const MARCOS_CH15_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Juicio de Jesús ante Pilato',
        ref: 'v.1–5',
        image: require('../../assets/study/marcos/cap-15/marcos_15_pilato.jpg'),
    },
    {
        startVerse: 6,
        label: 'Pilato libera a Barrabás',
        ref: 'v.6–15',
        image: require('../../assets/study/marcos/cap-15/marcos_15_barrabas.jpg'),
    },
    {
        startVerse: 16,
        label: 'Los soldados se burlan de Jesús',
        ref: 'v.16–20',
        image: require('../../assets/study/marcos/cap-15/marcos_15_burla.jpg'),
    },
    {
        startVerse: 21,
        label: 'Simón de Cirene carga la cruz',
        ref: 'v.21–22',
        image: require('../../assets/study/marcos/cap-15/marcos_15_simon.jpg'),
    },
    {
        startVerse: 23,
        label: 'Jesús rechaza el vino con mirra',
        ref: 'v.23',
        image: require('../../assets/study/marcos/cap-15/marcos_15_mirra.jpg'),
    },
    {
        startVerse: 24,
        label: 'Los soldados reparten su ropa',
        ref: 'v.24–25',
        image: require('../../assets/study/marcos/cap-15/marcos_15_suertes.jpg'),
    },
    {
        startVerse: 26,
        label: 'El Rey de los judíos en el Gólgota',
        ref: 'v.26–27',
        image: require('../../assets/study/marcos/cap-15/marcos_15_crucifixion.jpg'),
    },
    {
        startVerse: 29,
        label: 'Burlas al pie de la cruz',
        ref: 'v.29–32',
        image: require('../../assets/study/marcos/cap-15/marcos_15_espectadores.jpg'),
    },
    {
        startVerse: 33,
        label: 'Tinieblas sobre la tierra',
        ref: 'v.33–35',
        image: require('../../assets/study/marcos/cap-15/marcos_15_oscuridad.jpg'),
    },
    {
        startVerse: 36,
        label: 'El último suspiro de Jesús',
        ref: 'v.36–37',
        image: require('../../assets/study/marcos/cap-15/marcos_15_esponja.jpg'),
    },
    {
        startVerse: 38,
        label: 'El velo del templo se rasga en dos',
        ref: 'v.38',
        image: require('../../assets/study/marcos/cap-15/marcos_15_velo.jpg'),
    },
    {
        startVerse: 39,
        label: 'Confesión del oficial romano',
        ref: 'v.39',
        image: require('../../assets/study/marcos/cap-15/marcos_15_centurion.jpg'),
    },
    {
        startVerse: 40,
        label: 'Las mujeres miran desde lejos',
        ref: 'v.40–41',
        image: require('../../assets/study/marcos/cap-15/marcos_15_mujeres.jpg'),
    },
    {
        startVerse: 42,
        label: 'José de Arimatea pide el cuerpo',
        ref: 'v.42–45',
        image: require('../../assets/study/marcos/cap-15/marcos_15_jose_pilato.jpg'),
    },
    {
        startVerse: 46,
        label: 'Entierro de Jesús',
        ref: 'v.46',
        image: require('../../assets/study/marcos/cap-15/marcos_15_entierro.jpg'),
    },
    {
        startVerse: 47,
        label: 'La tumba sellada antes del reposo',
        ref: 'v.47',
        image: require('../../assets/study/marcos/cap-15/marcos_15_tumba.jpg'),
    },
];

const MARCOS_CH16_SCENES: ChapterSceneVisual[] = [
    {
        startVerse: 1,
        label: 'Las mujeres compran especias',
        ref: 'v.1',
        image: require('../../assets/study/marcos/cap-16/marcos_16_especias.jpg'),
    },
    {
        startVerse: 2,
        label: 'Camino a la tumba al amanecer',
        ref: 'v.2–3',
        image: require('../../assets/study/marcos/cap-16/marcos_16_amanecer.jpg'),
    },
    {
        startVerse: 4,
        label: 'La piedra ya estaba corrida',
        ref: 'v.4',
        image: require('../../assets/study/marcos/cap-16/marcos_16_piedra.jpg'),
    },
    {
        startVerse: 5,
        label: '¡Ha resucitado!',
        ref: 'v.5–6',
        image: require('../../assets/study/marcos/cap-16/marcos_16_angel.jpg'),
    },
    {
        startVerse: 7,
        label: 'Cuéntenles a sus discípulos y a Pedro',
        ref: 'v.7',
        image: require('../../assets/study/marcos/cap-16/marcos_16_anuncio_pedro.jpg'),
    },
    {
        startVerse: 8,
        label: 'Las mujeres salen asombradas',
        ref: 'v.8',
        image: require('../../assets/study/marcos/cap-16/marcos_16_huida.jpg'),
    },
    {
        startVerse: 9,
        label: 'Jesús se aparece a María Magdalena',
        ref: 'v.9',
        image: require('../../assets/study/marcos/cap-16/marcos_16_maria.jpg'),
    },
    {
        startVerse: 10,
        label: 'María anuncia que Jesús vive',
        ref: 'v.10–11',
        image: require('../../assets/study/marcos/cap-16/marcos_16_incredulidad.jpg'),
    },
    {
        startVerse: 12,
        label: 'Jesús camina con dos seguidores',
        ref: 'v.12',
        image: require('../../assets/study/marcos/cap-16/marcos_16_viajeros.jpg'),
    },
    {
        startVerse: 13,
        label: 'Testimonio de los dos seguidores',
        ref: 'v.13',
        image: require('../../assets/study/marcos/cap-16/marcos_16_encuentro.jpg'),
    },
    {
        startVerse: 14,
        label: 'Jesús se aparece a los once',
        ref: 'v.14',
        image: require('../../assets/study/marcos/cap-16/marcos_16_once.jpg'),
    },
    {
        startVerse: 15,
        label: 'La Gran Comisión',
        ref: 'v.15',
        image: require('../../assets/study/marcos/cap-16/marcos_16_comision.jpg'),
    },
    {
        startVerse: 16,
        label: 'Prediquen la Buena Noticia a todos',
        ref: 'v.16',
        image: require('../../assets/study/marcos/cap-16/marcos_16_envio.jpg'),
    },
    {
        startVerse: 17,
        label: 'Anuncio con poder en su nombre',
        ref: 'v.17',
        image: require('../../assets/study/marcos/cap-16/marcos_16_predicacion.jpg'),
    },
    {
        startVerse: 18,
        label: 'Oración y sanidad por los enfermos',
        ref: 'v.18',
        image: require('../../assets/study/marcos/cap-16/marcos_16_sanidad.jpg'),
    },
    {
        startVerse: 19,
        label: 'Ascensión de Jesús al cielo',
        ref: 'v.19',
        image: require('../../assets/study/marcos/cap-16/marcos_16_ascension.jpg'),
    },
    {
        startVerse: 20,
        label: 'La Buena Noticia se extiende',
        ref: 'v.20',
        image: require('../../assets/study/marcos/cap-16/marcos_16_buena_noticia.jpg'),
    },
];

export const getChapterSceneVisuals = (
    gospelId: GospelId,
    chapterNumber: number
): ChapterSceneVisual[] => {
    if (gospelId === 'marcos' && chapterNumber === 1) {
        return MARCOS_CH1_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 2) {
        return MARCOS_CH2_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 3) {
        return MARCOS_CH3_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 4) {
        return MARCOS_CH4_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 5) {
        return MARCOS_CH5_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 6) {
        return MARCOS_CH6_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 7) {
        return MARCOS_CH7_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 8) {
        return MARCOS_CH8_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 9) {
        return MARCOS_CH9_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 10) {
        return MARCOS_CH10_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 11) {
        return MARCOS_CH11_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 12) {
        return MARCOS_CH12_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 13) {
        return MARCOS_CH13_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 14) {
        return MARCOS_CH14_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 15) {
        return MARCOS_CH15_SCENES;
    }
    if (gospelId === 'marcos' && chapterNumber === 16) {
        return MARCOS_CH16_SCENES;
    }
    return [
        {
            startVerse: 1,
            label: getGospelById(gospelId).subtitle,
            image: getGospelChapterImage(gospelId, chapterNumber),
        },
    ];
};

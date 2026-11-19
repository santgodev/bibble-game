import type { TriviaQuestion } from '../../data/categories';
import {
    TriviaCatalogGroupNode,
    TriviaCatalogNode,
    TriviaCatalogThemeNode,
} from '../types';
import {
    ADAPTED_BANKS,
    computeLevelCounts,
    isThemePlayable,
} from './questionBankAdapter';

const makeTheme = (params: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    parentId: string | null;
    questions: TriviaQuestion[];
}): TriviaCatalogThemeNode => {
    const counts = computeLevelCounts(params.questions);
    return {
        id: params.id,
        kind: 'theme',
        title: params.title,
        subtitle: params.subtitle,
        description: params.description,
        icon: params.icon,
        color: params.color,
        parentId: params.parentId,
        questions: params.questions,
        counts,
        isPlayable: isThemePlayable(counts),
    };
};

const makeGroup = (params: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    parentId: string | null;
    children: TriviaCatalogNode[];
}): TriviaCatalogGroupNode => ({
    id: params.id,
    kind: 'group',
    title: params.title,
    subtitle: params.subtitle,
    description: params.description,
    icon: params.icon,
    color: params.color,
    parentId: params.parentId,
    children: params.children,
});

export const MEZCLA_BIBLICA_THEME: TriviaCatalogThemeNode = makeTheme({
    id: 'mezcla_biblica',
    title: 'Mezcla bíblica',
    subtitle: 'Todo el banco disponible',
    description: 'Partida variada con preguntas de toda la Escritura sin repetir.',
    icon: 'shuffle-outline',
    color: '#197D7F',
    parentId: null,
    questions: ADAPTED_BANKS.mezcla_biblica,
});

export const TRIVIA_CATALOG_TREE: TriviaCatalogNode[] = [
    makeGroup({
        id: 'antiguo_testamento',
        title: 'Antiguo Testamento',
        subtitle: 'De la creación al retorno',
        description: 'Historia del pueblo de Dios desde Génesis hasta los profetas.',
        icon: 'library-outline',
        color: '#B86C4A',
        parentId: null,
        children: [
            makeGroup({
                id: 'origenes_patriarcas',
                title: 'Génesis',
                subtitle: 'Orígenes y patriarcas',
                description: 'Creación, diluvio, Abraham, Isaac, Jacob y José.',
                icon: 'planet-outline',
                color: '#217A59',
                parentId: 'antiguo_testamento',
                children: [
                    makeTheme({
                        id: 'origenes_patriarcas_general',
                        title: 'Todo Génesis',
                        subtitle: 'Génesis 1–50',
                        description: 'Recorre todo el libro de Génesis en los tres niveles.',
                        icon: 'book-outline',
                        color: '#217A59',
                        parentId: 'origenes_patriarcas',
                        questions: ADAPTED_BANKS.origenes_patriarcas_general,
                    }),
                    makeTheme({
                        id: 'origenes',
                        title: 'Orígenes',
                        subtitle: 'Génesis 1–11',
                        description: 'Creación, caída, diluvio y torre de Babel.',
                        icon: 'sunny-outline',
                        color: '#68A877',
                        parentId: 'origenes_patriarcas',
                        questions: ADAPTED_BANKS.origenes,
                    }),
                    makeTheme({
                        id: 'patriarcas',
                        title: 'Patriarcas',
                        subtitle: 'Génesis 12–50',
                        description: 'El llamado de Abraham y las generaciones de la promesa.',
                        icon: 'people-outline',
                        color: '#197D7F',
                        parentId: 'origenes_patriarcas',
                        questions: ADAPTED_BANKS.patriarcas,
                    }),
                ],
            }),
            makeGroup({
                id: 'de_egipto_a_canaan',
                title: 'De Egipto a Canaán',
                subtitle: 'Liberación, ley y conquista',
                description: 'Del Éxodo por el desierto hasta los jueces en la tierra prometida.',
                icon: 'compass-outline',
                color: '#197D7F',
                parentId: 'antiguo_testamento',
                children: [
                    makeTheme({
                        id: 'exodo_desierto',
                        title: 'Éxodo y desierto',
                        subtitle: 'Éxodo, Levítico, Números y Deuteronomio',
                        description: 'Salida de Egipto, alianza en el Sinaí y travesía hacia Canaán.',
                        icon: 'trail-sign-outline',
                        color: '#197D7F',
                        parentId: 'de_egipto_a_canaan',
                        questions: ADAPTED_BANKS.exodo_desierto,
                    }),
                    makeTheme({
                        id: 'entrada_canaan',
                        title: 'Entrada en Canaán',
                        subtitle: 'Libro de Josué',
                        description: 'Cruce del Jordán, Jericó y reparto de la tierra.',
                        icon: 'flag-outline',
                        color: '#B86C4A',
                        parentId: 'de_egipto_a_canaan',
                        questions: ADAPTED_BANKS.entrada_canaan,
                    }),
                    makeTheme({
                        id: 'epoca_jueces',
                        title: 'Época de los jueces',
                        subtitle: 'Jueces y Rut',
                        description: 'Libertadores de Israel y fidelidad en tiempos difíciles.',
                        icon: 'shield-outline',
                        color: '#68A877',
                        parentId: 'de_egipto_a_canaan',
                        questions: ADAPTED_BANKS.epoca_jueces,
                    }),
                ],
            }),
            makeGroup({
                id: 'historia_israel_juda',
                title: 'Historia de Israel y Judá',
                subtitle: 'Reyes, profetas y exilio',
                description: 'Desde Samuel y la monarquía hasta el retorno después del exilio.',
                icon: 'ribbon-outline',
                color: '#B86C4A',
                parentId: 'antiguo_testamento',
                children: [
                    makeTheme({
                        id: 'transicion_monarquia',
                        title: 'Transición a la monarquía',
                        subtitle: 'Samuel y petición de rey',
                        description: 'Ministerio de Samuel y establecimiento de la monarquía.',
                        icon: 'megaphone-outline',
                        color: '#B86C4A',
                        parentId: 'historia_israel_juda',
                        questions: ADAPTED_BANKS.transicion_monarquia,
                    }),
                    makeTheme({
                        id: 'monarquia_unida',
                        title: 'Monarquía unida',
                        subtitle: 'Saúl, David y Salomón',
                        description: 'Los tres reyes sobre todo Israel y la construcción del templo.',
                        icon: 'ribbon-outline',
                        color: '#D4882E',
                        parentId: 'historia_israel_juda',
                        questions: ADAPTED_BANKS.monarquia_unida,
                    }),
                    makeTheme({
                        id: 'reino_dividido',
                        title: 'Reino dividido',
                        subtitle: 'Israel al norte y Judá al sur',
                        description: 'Desde Roboam y Jeroboam I hasta la caída de Samaria.',
                        icon: 'git-branch-outline',
                        color: '#197D7F',
                        parentId: 'historia_israel_juda',
                        questions: ADAPTED_BANKS.reino_dividido,
                    }),
                    makeTheme({
                        id: 'juda_tras_israel',
                        title: 'Judá después de la caída de Israel',
                        subtitle: 'De Ezequías a Sedequías',
                        description: 'Últimos reyes de Judá hasta la caída de Jerusalén.',
                        icon: 'flame-outline',
                        color: '#B34360',
                        parentId: 'historia_israel_juda',
                        questions: ADAPTED_BANKS.juda_tras_israel,
                    }),
                    makeTheme({
                        id: 'exilio_babilonico',
                        title: 'Exilio babilónico',
                        subtitle: 'Deportaciones y cautiverio',
                        description: 'Vida y fidelidad del pueblo durante el exilio en Babilonia.',
                        icon: 'hourglass-outline',
                        color: '#636477',
                        parentId: 'historia_israel_juda',
                        questions: ADAPTED_BANKS.exilio_babilonico,
                    }),
                    makeTheme({
                        id: 'retorno_restauracion',
                        title: 'Retorno y restauración',
                        subtitle: 'Esdras, Nehemías y profetas',
                        description: 'Decreto de Ciro, reconstrucción del templo y los muros.',
                        icon: 'leaf-outline',
                        color: '#217A59',
                        parentId: 'historia_israel_juda',
                        questions: ADAPTED_BANKS.retorno_restauracion,
                    }),
                ],
            }),
            makeTheme({
                id: 'antiguo_testamento_general',
                title: 'Antiguo Testamento general',
                subtitle: 'Banco general del Antiguo Testamento',
                description: 'Recorrido amplio por ley, historia, poesía y profetas.',
                icon: 'book-outline',
                color: '#B86C4A',
                parentId: 'antiguo_testamento',
                questions: ADAPTED_BANKS.antiguo_testamento_general,
            }),
        ],
    }),

    makeGroup({
        id: 'nuevo_testamento',
        title: 'Nuevo Testamento',
        subtitle: 'Jesús y la Iglesia primitiva',
        description: 'Evangelios, Hechos de los apóstoles y cartas del Nuevo Testamento.',
        icon: 'flame-outline',
        color: '#197D7F',
        parentId: null,
        children: [
            makeGroup({
                id: 'evangelios',
                title: 'Evangelios',
                subtitle: 'Vida y ministerio de Jesús',
                description: 'Los cuatro relatos de la vida, muerte y resurrección de Cristo.',
                icon: 'heart-outline',
                color: '#197D7F',
                parentId: 'nuevo_testamento',
                children: [
                    makeTheme({
                        id: 'evangelios_general',
                        title: 'Todos los Evangelios',
                        subtitle: 'Mateo, Marcos, Lucas y Juan',
                        description: 'Preguntas combinadas de los cuatro evangelios.',
                        icon: 'bookmarks-outline',
                        color: '#197D7F',
                        parentId: 'evangelios',
                        questions: ADAPTED_BANKS.evangelios_general,
                    }),
                    makeTheme({
                        id: 'nt_mateo',
                        title: 'Mateo',
                        subtitle: 'El Rey prometido',
                        description: 'El Sermón del Monte y el cumplimiento de las profecías.',
                        icon: 'book-outline',
                        color: '#D4882E',
                        parentId: 'evangelios',
                        questions: ADAPTED_BANKS.nt_mateo,
                    }),
                    makeTheme({
                        id: 'nt_marcos',
                        title: 'Marcos',
                        subtitle: 'El Siervo en acción',
                        description: 'Milagros y camino hacia la cruz en relato breve.',
                        icon: 'flash-outline',
                        color: '#B34360',
                        parentId: 'evangelios',
                        questions: ADAPTED_BANKS.nt_marcos,
                    }),
                    makeTheme({
                        id: 'nt_lucas',
                        title: 'Lucas',
                        subtitle: 'El Salvador compasivo',
                        description: 'Parábolas de misericordia y ministerio del Espíritu.',
                        icon: 'heart-outline',
                        color: '#217A59',
                        parentId: 'evangelios',
                        questions: ADAPTED_BANKS.nt_lucas,
                    }),
                    makeTheme({
                        id: 'nt_juan',
                        title: 'Juan',
                        subtitle: 'El Verbo hecho carne',
                        description: 'Señales, discursos «Yo soy» y vida eterna.',
                        icon: 'water-outline',
                        color: '#197D7F',
                        parentId: 'evangelios',
                        questions: ADAPTED_BANKS.nt_juan,
                    }),
                ],
            }),
            makeTheme({
                id: 'nt_cartas',
                title: 'Hechos y Cartas',
                subtitle: 'Iglesia primitiva y epístolas',
                description: 'Expansión del evangelio y enseñanza apostólica.',
                icon: 'mail-outline',
                color: '#68A877',
                parentId: 'nuevo_testamento',
                questions: ADAPTED_BANKS.nt_cartas,
            }),
            makeTheme({
                id: 'nt_todo',
                title: 'Nuevo Testamento general',
                subtitle: 'Banco general del Nuevo Testamento',
                description: 'Desde los Evangelios hasta Apocalipsis en los tres niveles.',
                icon: 'flame-outline',
                color: '#B34360',
                parentId: 'nuevo_testamento',
                questions: ADAPTED_BANKS.nt_todo,
            }),
        ],
    }),

    makeGroup({
        id: 'otros_temas',
        title: 'Otros temas',
        subtitle: 'Temáticas y banco general',
        description: 'Personajes, fundamentos generales y colecciones temáticas.',
        icon: 'grid-outline',
        color: '#68A877',
        parentId: null,
        children: [
            makeTheme({
                id: 'personajes_biblicos',
                title: 'Personajes',
                subtitle: 'Héroes, profetas y apóstoles',
                description: 'Hombres y mujeres de fe a lo largo de toda la Biblia.',
                icon: 'people-outline',
                color: '#197D7F',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.personajes_biblicos,
            }),
            makeTheme({
                id: 'biblia_general',
                title: 'Biblia General',
                subtitle: 'Fundamentos esenciales',
                description: 'Preguntas clave de toda la Escritura para crecer en lo básico y más.',
                icon: 'book-outline',
                color: '#217A59',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.biblia_general,
            }),
            makeTheme({
                id: 'comida',
                title: 'Comidas',
                subtitle: 'Alimentos y banquetes bíblicos',
                description: 'Pan, miel, maná, peces y comidas mencionadas en la Biblia.',
                icon: 'restaurant-outline',
                color: '#B86C4A',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.comida,
            }),
            makeTheme({
                id: 'lugares',
                title: 'Lugares',
                subtitle: 'Ciudades, montes y ríos',
                description: 'Geografía bíblica desde Ur hasta Jerusalén y Roma.',
                icon: 'map-outline',
                color: '#D4882E',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.lugares,
            }),
            makeTheme({
                id: 'animales',
                title: 'Animales',
                subtitle: 'Fauna en los relatos bíblicos',
                description: 'Leones, cuervos, ovejas y señales en la creación.',
                icon: 'paw-outline',
                color: '#68A877',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.animales,
            }),
            makeTheme({
                id: 'objetos',
                title: 'Cosas y objetos',
                subtitle: 'Símbolos e instrumentos',
                description: 'Arca, honda, trompetas y objetos clave de las Escrituras.',
                icon: 'cube-outline',
                color: '#797080',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.objetos,
            }),
            makeTheme({
                id: 'historias',
                title: 'Historias famosas',
                subtitle: 'Relatos memorables',
                description: 'Episodios clásicos narrados en el Antiguo y Nuevo Testamento.',
                icon: 'sparkles-outline',
                color: '#197D7F',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.historias,
            }),
            makeTheme({
                id: 'navidad_pascua',
                title: 'Navidad y Pascua',
                subtitle: 'Nacimiento, cruz y resurrección',
                description: 'Acontecimientos centrales del evangelio y su cumplimiento.',
                icon: 'star-outline',
                color: '#D4882E',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.navidad_pascua,
            }),
            makeTheme({
                id: 'alabanzas',
                title: 'Alabanzas famosas',
                subtitle: 'Cantos e himnos de fe',
                description: 'Temática musical en formato Trivia.',
                icon: 'musical-notes-outline',
                color: '#B34360',
                parentId: 'otros_temas',
                questions: ADAPTED_BANKS.alabanzas,
            }),
        ],
    }),
];

const nodeIndex = new Map<string, TriviaCatalogNode>();
const themeIndex = new Map<string, TriviaCatalogThemeNode>();

themeIndex.set(MEZCLA_BIBLICA_THEME.id, MEZCLA_BIBLICA_THEME);
nodeIndex.set(MEZCLA_BIBLICA_THEME.id, MEZCLA_BIBLICA_THEME);

const indexTree = (nodes: TriviaCatalogNode[]) => {
    for (const node of nodes) {
        nodeIndex.set(node.id, node);
        if (node.kind === 'theme') {
            themeIndex.set(node.id, node);
        } else {
            indexTree(node.children);
        }
    }
};

indexTree(TRIVIA_CATALOG_TREE);

export const getRootCatalogNodes = (): TriviaCatalogNode[] => TRIVIA_CATALOG_TREE;

export const getCatalogChildren = (parentId?: string | null): TriviaCatalogNode[] => {
    if (!parentId) return TRIVIA_CATALOG_TREE;
    const node = nodeIndex.get(parentId);
    if (!node || node.kind !== 'group') return [];
    return node.children;
};

export const getCatalogNodeById = (id: string): TriviaCatalogNode | null =>
    nodeIndex.get(id) || null;

export const getThemeById = (id: string): TriviaCatalogThemeNode | null =>
    themeIndex.get(id) || null;

export const getAllThemes = (): TriviaCatalogThemeNode[] =>
    Array.from(themeIndex.values());

export const getPlayableThemes = (): TriviaCatalogThemeNode[] =>
    Array.from(themeIndex.values()).filter(t => t.isPlayable);

export const getNodeBreadcrumb = (nodeId?: string | null): TriviaCatalogNode[] => {
    const trail: TriviaCatalogNode[] = [];
    let currentId = nodeId || null;
    while (currentId) {
        const node = nodeIndex.get(currentId);
        if (!node) break;
        trail.unshift(node);
        currentId = node.parentId;
    }
    return trail;
};

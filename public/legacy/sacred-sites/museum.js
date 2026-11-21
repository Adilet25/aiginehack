import * as THREE from 'three';
import { OrbitControls } from '../vendor/controls/OrbitControls.js';
import { sacredFraming } from '../sacred-framing.js';

const embedded = window.parent !== window;
if (embedded) document.documentElement.dataset.embedded = 'true';

// =========================================================================
// МОДУЛЬ 1: НАСТРОЙКИ КАЧЕСТВА ГРАФИКИ (GraphicsSettings)
// =========================================================================
const GRAPHICS_PRESETS = {
  low: {
    segX: 300,
    segZ: 150,
    texW: 1536,
    texH: 768,
    pixelRatio: 1.0,
    shadows: false,
    shadowMapSize: 1024,
  },
  medium: {
    segX: 460,
    segZ: 230,
    texW: 2560,
    texH: 1280,
    pixelRatio: 1.5,
    shadows: true,
    shadowMapSize: 2048,
  },
};

const currentGraphicsPreset = matchMedia("(max-width: 700px)").matches
  ? GRAPHICS_PRESETS.low : GRAPHICS_PRESETS.medium;

// =========================================================================
// МОДУЛЬ 2: БАЗА ЗНАНИЙ 9 САКРАЛЬНЫХ МЕСТ И ПРАВИЛА ПОСЕЩЕНИЯ (SacredSiteRules)
// =========================================================================
const GENERAL_RULES = {
  allowed: [
    'Посещать открытые для туристов и паломников территории в установленные часы.',
    'Фотографировать и вести видеосъёмку в разрешённых зонах без вспышки у древних росписей.',
    'Изучать историю, археологию и культурное наследие с экскурсоводом или аудиогидом.',
    'Передвигаться по обозначенным туристическим тропам и смотровым настилам.',
    'Уважать местные обычаи, молитвенное уединение паломников и традиции народа.',
    'Поддерживать чистоту и уносить весь мусор с собой до ближайших контейнеров.',
    'Следовать указаниям сотрудников заповедников, музейных смотрителей и гидов.'
  ],
  forbidden: [
    'Повреждать, царапать или прикасаться к петроглифам и древним архитектурным элементам.',
    'Оставлять современные надписи, рисунки или наклейки на камнях и стенах памятников.',
    'Забирать фрагменты горных пород, керамики, камни или любые исторические предметы.',
    'Разводить костры и использовать открытый огонь на территории памятников.',
    'Оставлять бытовой или пластиковый мусор в ущельях, у родников и на тропах.',
    'Заходить за ограждения на закрытые археологические или аварийные участки.',
    'Повреждать природные объекты, ломать ветви священных деревьев и срывать редкие растения.',
    'Нарушать религиозные и культурные традиции, шуметь в местах поклонения.'
  ]
};

const SACRED_SITES = [
  {
    id: 'sulayman-too',
    num: 1,
    nameRu: 'Сулайман-Тоо',
    nameEn: 'Sulayman-Too',
    region: 'Юго-запад (г. Ош)',
    lon: 72.790,
    lat: 40.535,
    freq: 293.66,
    artifactTitle: 'Трехмерный массив Сулайман-Тоо и павильон Тахт-и-Сулейман',
    artifactCaption: 'Пятиглавая священная известняковая гора со скальными выступами, священными гротами и каменными тропами паломников.',
    hook: '«Пятиглавая гора, где каждый грот исцеляет недуг, а каменные плиты хранят следы древней солнечной обсерватории.»',
    era: 'Бронзовый век — Средневековье (II тыс. до н. э. — XVI в.)',
    elevation: '1 175 м над уровнем моря',
    description: 'Единственный в Кыргызстане объект Всемирного наследия ЮНЕСКО. На протяжении трёх тысячелетий священная гора в центре Оша служила местом поклонения небу, солнцу и духам предков. На её склонах обнаружены сотни петроглифов, ритуальные лунки-чашечники для астрономических наблюдений и легенды о пророке Сулеймане и полководце Бабуре.',
    siteRules: {
      allowed: [
        'Подниматься по благоустроенным каменным лестницам к гроту Тахт-и-Сулейман и музею в скале.',
        'Рекомендация: выбирать удобную нескользящую обувь для подъёма по отполированным известняковым склонам.'
      ],
      forbidden: [
        'Сходить с оборудованных троп на крутые скальные обрывы и древние петроглифические плиты.',
        'Запрещено оставлять надписи и краску на стенах священных гротов Чакка-Тамар и Тепеункур.'
      ]
    }
  },
  {
    id: 'saimaluu-tash',
    num: 2,
    nameRu: 'Саймалуу-Таш',
    nameEn: 'Saimaluu-Tash',
    region: 'Ферганский хребет (Джалал-Абадская обл.)',
    lon: 73.795,
    lat: 41.182,
    freq: 329.63,
    artifactTitle: 'Базальтовый валун с солнцеголовым божеством Тенгри',
    artifactCaption: 'Тёмный глянцевый базальт с выбитыми в эпоху бронзы солярными знаками и горными козлами-архарами.',
    hook: '«Галерея из 10 000 чёрных базальтовых камней на высоте 3 200 метров, открытая людям всего один месяц в году.»',
    era: 'Энеолит, бронзовый и ранний железный век (III–I тыс. до н. э.)',
    elevation: '3 000 — 3 200 м над уровнем моря',
    description: 'Крупнейшее в Центральной Азии высокогорное святилище наскального искусства, скрытое в ледниковом цирке у перевала Кугарт. Большую часть года камни укрыты глубоким снегом. Древние художники выбили на блестящем тёмном базальте солнцеголовых божеств Тенгри, ритуальные пляски, колесницы, снежных барсов и стада горных козлов-архаров.',
    siteRules: {
      allowed: [
        'Посещать урочище в составе организованной группы или в сопровождении егеря природного парка (обычно в июле–августе).',
        'Рекомендация: иметь при себе тёплую ветрозащитную одежду и треккинговую обувь из-за резкой смены погоды на высоте 3 200 м.'
      ],
      forbidden: [
        'Переворачивать, сдвигать или становиться ногами на базальтовые валуны с петроглифами.',
        'Обводить контуры наскальных рисунков мелом, камнем или смачивать их водой для контраста.'
      ]
    }
  },
  {
    id: 'manas-ordo',
    num: 3,
    nameRu: 'Манас Ордо',
    nameEn: 'Manas Ordo',
    region: 'Таласская долина',
    lon: 72.375,
    lat: 42.525,
    freq: 392.00,
    artifactTitle: 'Гумбез Манаса и священная вершина Кароол-Чоку',
    artifactCaption: 'Реконструкция портально-купольного мавзолея XIV века с шатровым сводом и терракотовым геометрическим декором.',
    hook: '«Духовное сердце кыргызского народа у подножия дозорной горы Кароол-Чоку, где оживает величайший эпос мира.»',
    era: 'XIV век (мавзолей) и сакральный ландшафт древнетюркской эпохи',
    elevation: '1 320 м над уровнем моря',
    description: 'Культурно-исторический комплекс в Таласской долине, связанный с именем легендарного богатыря Манаса Великодушного. Центром святилища является уникальный купольный мавзолей XIV века с тончайшей терракотовой резьбой, окружённый каменными изваяниями-балбалами, петроглифами и священной вершиной Кароол-Чоку.',
    siteRules: {
      allowed: [
        'Осматривать мемориальный парк, музей эпоса «Манас», сад балбалов и совершать восхождение на гору Кароол-Чоку.',
        'Рекомендация: соблюдать тишину и скромный дресс-код при входе в мавзолей Гумбез Манаса.'
      ],
      forbidden: [
        'Прикасаться к подлинной терракотовой резьбе XIV века на фасаде мавзолея.',
        'Подниматься на каменные изваяния-балбалы и архитектурные элементы комплекса.'
      ]
    }
  },
  {
    id: 'cholpon-ata',
    num: 4,
    nameRu: 'Петроглифы Чолпон-Аты',
    nameEn: 'Cholpon-Ata',
    region: 'Северный берег Иссык-Куля',
    lon: 77.080,
    lat: 42.668,
    freq: 440.00,
    artifactTitle: 'Ледниковый валун в сакском «зверином стиле»',
    artifactCaption: 'Гранитный монолит с рельефными силуэтами благородных оленей и снежных барсов VIII–III вв. до н. э.',
    hook: '«Каменный сад под открытым небом между снежными пиками Кунгей Ала-Тоо и синей бездной Иссык-Куля.»',
    era: 'Бронзовый век и сако-усуньский период (II тыс. до н. э. — I в. н. э.)',
    elevation: '1 650 м над уровнем моря',
    description: 'Огромное скопление гигантских ледниковых валунов площадью более 42 гектаров, превращённое кочевниками сакской эпохи в храм под открытым небом. Главная особенность — монументальные изображения снежных барсов, оленей и сцен охоты в знаменитом «зверином стиле», ориентированные по сторонам света и точкам солнцестояний.',
    siteRules: {
      allowed: [
        'Передвигаться по размеченным экскурсионным маршрутам между каменными кругами и валунами.',
        'Рекомендация: посещать музей под открытым небом в утренние или предзакатные часы, когда косые лучи солнца лучше всего проявляют рельеф.'
      ],
      forbidden: [
        'Забираться на крупные валуны ради фотографий и стирать древний пустынный загар камня.',
        'Выгуливать животных или ездить на велосипедах/мототранспорте по территории заповедника.'
      ]
    }
  },
  {
    id: 'manjyly-ata',
    num: 5,
    nameRu: 'Манжылы-Ата',
    nameEn: 'Manjyly-Ata',
    region: 'Южный берег Иссык-Куля',
    lon: 77.025,
    lat: 42.155,
    freq: 493.88,
    artifactTitle: 'Священный родник Умай-Эне среди охристых холмов',
    artifactCaption: 'Композиция целебного источника в терракотовом каньоне и священной ивы с ритуальными лентами чүпүрөк.',
    hook: '«Лабиринт глиняных холмов, где из-под земли бьют двенадцать священных родников с разным вкусом и силой.»',
    era: 'Доисламская тенгрианская традиция — Средневековье',
    elevation: '1 720 м над уровнем моря',
    description: 'Уникальная долина в Тонском районе, известная как «Долина священных источников». Среди охристых и терракотовых каньонов здесь бьют целебные ключи, каждый из которых носит имя духовного покровителя и связан с древними культами воды, Матери-Оленихи и Умай-Эне. Старые ивы вокруг родников повязаны белыми лентами чүпүрөк.',
    siteRules: {
      allowed: [
        'Набирать чистую родниковую воду для питья и омовения рук в специально оборудованных местах.',
        'Рекомендация: перед посещением источников обратиться к хранителю комплекса (шыйык) для получения благословения и маршрута.'
      ],
      forbidden: [
        'Загрязнять родники моющими средствами, бросать в воду монеты или посторонние предметы.',
        'Повязывать пластиковые пакеты вместо натуральных хлопковых лент или ломать ветви старых ив.'
      ]
    }
  },
  {
    id: 'burana-tower',
    num: 6,
    nameRu: 'Башня Бурана и Балбалы',
    nameEn: 'Burana Tower',
    region: 'Чуйская долина (г. Токмок)',
    lon: 75.250,
    lat: 42.746,
    freq: 587.33,
    artifactTitle: 'Минарет XI века и каменный воин-балбал',
    artifactCaption: 'Детализированная модель минарета древнего Баласагуна с орнаментальной кирпичной кладкой и изваянием воина с чашей.',
    hook: '«Одинокий минарет XI века на Великом Шёлковом пути, окружённый молчаливой стражей каменных воинов.»',
    era: 'VI–X вв. (балбалы) и XI век (эпоха Караханидов)',
    elevation: '1 100 м над уровнем моря',
    description: 'Остатки древнего города Баласагун — северной столицы государства Караханидов и родины мыслителя Юсуфа Баласагуни. Рядом с 24-метровой кирпичной башней с орнаментальной кладкой собран впечатляющий сад балбалов — древнетюркских каменных изваяний воинов, держащих в правой руке ритуальную чашу.',
    siteRules: {
      allowed: [
        'Подниматься по внутренней винтовой лестнице на смотровую площадку башни и осматривать сад балбалов.',
        'Рекомендация: соблюдать осторожность на крутых и узких каменных ступенях внутри минарета.'
      ],
      forbidden: [
        'Вынимать кирпичи из исторической кладки XI века или садиться на каменные изваяния балбалов.',
        'Подниматься на неогороженные края валов городища в сырую погоду.'
      ]
    }
  },
  {
    id: 'tash-rabat',
    num: 7,
    nameRu: 'Таш-Рабат',
    nameEn: 'Tash-Rabat',
    region: 'Внутренний Тянь-Шань (Ат-Башы)',
    lon: 75.292,
    lat: 40.822,
    freq: 293.66,
    artifactTitle: 'Каменная цитадель Таш-Рабат в ущелье Кара-Коюн',
    artifactCaption: 'Суровое сланцевое сооружение XV века с монументальным порталом, центральным куполом и лабиринтом залов.',
    hook: '«Суровая каменная цитадель с 31 залом в безлюдном ущелье на высоте 3 200 метров, чьё истинное назначение до сих пор вызывает споры.»',
    era: 'X–XV века',
    elevation: '3 200 м над уровнем моря',
    description: 'Уникальный памятник средневекового каменного зодчества в ущелье Кара-Коюн. Сложенное из тёмного сланца здание с центральным купольным залом и лабиринтом келий служило либо укреплённым караван-сараем на Шёлковом пути, либо древним несторианским или буддийским монастырём, укрытым от ветров Тянь-Шаня.',
    siteRules: {
      allowed: [
        'Осматривать центральный купольный зал и боковые каменные кельи с фонариком или в сопровождении смотрителя.',
        'Рекомендация: взять тёплую одежду даже летом — внутри толстых каменных стен сохраняется низкая температура.'
      ],
      forbidden: [
        'Подниматься на земляную кровлю и купола караван-сарая во избежание обрушения сводов.',
        'Использовать открытый огонь или свечи внутри закрытых каменных помещений.'
      ]
    }
  },
  {
    id: 'arslanbob',
    num: 8,
    nameRu: 'Арсланбоб',
    nameEn: 'Arslanbob',
    region: 'Склоны Ферганского хребта',
    lon: 72.935,
    lat: 41.338,
    freq: 329.63,
    artifactTitle: 'Священный грот и каскад водопада в реликтовом лесу',
    artifactCaption: 'Скальный уступ с бирюзовым потоком водопада в окружении вековых грецких орехов.',
    hook: '«Крупнейший на планете реликтовый ореховый лес, хранящий священные гроты, водопады и память о суфийских отшельниках.»',
    era: 'Античность — Средневековье (XI–XII вв.)',
    elevation: '1 600 — 2 200 м над уровнем моря',
    description: 'Заповедный горный оазис с орехово-плодовыми лесами возрастом в миллионы лет. Согласно преданиям, плоды отсюда вывозил ещё Александр Македонский, а в скальных гротах у Большого и Малого водопадов молился мудрец Арсланбоб-Ата, сделавший долину одним из главных центров паломничества.',
    siteRules: {
      allowed: [
        'Совершать пешие и конные прогулки к Большому и Малому водопадам и священным гротам.',
        'Рекомендация: пользоваться услугами местных проводников при подъёме к высокогорным смотровым площадкам.'
      ],
      forbidden: [
        'Рубить деревья, ломать ветви реликтовых ореховых лесов и разводить костры в лесной зоне.',
        'Подходить вплотную к краю обрывов у Большого водопада на скользких от брызг камнях.'
      ]
    }
  },
  {
    id: 'safid-bulan',
    num: 9,
    nameRu: 'Сафид-Булан / Шах-Фазиль',
    nameEn: 'Safid-Bulan',
    region: 'Ала-Букинский район',
    lon: 71.405,
    lat: 41.435,
    freq: 392.00,
    artifactTitle: 'Белоснежный мавзолей Шах-Фазиль с 27-метровым куполом',
    artifactCaption: 'Шедевр караханидского зодчества XI века с резным ганчевым декором и конусовидным ребристым куполом.',
    hook: '«Белоснежный мавзолей с 27-метровым куполом, стены которого покрыты каменным кружевом древних каллиграфов.»',
    era: 'XI–XII века (эпоха Караханидов)',
    elevation: '1 250 м над уровнем моря',
    description: 'Сакральный мемориальный комплекс на северном краю Ферганской долины. Жемчужиной ансамбля является мавзолей Шах-Фазиль с уникальной резной ганчевой отделкой интерьера, сочетающей куфическую каллиграфию, геометрические звёзды и древние солярные мотивы.',
    siteRules: {
      allowed: [
        'Осматривать мемориальный комплекс, священную скалу и архитектурный ансамбль мавзолея Шах-Фазиль.',
        'Рекомендация: соблюдать правила посещения действующих мусульманских святынь (покрытая голова и закрытая одежда).'
      ],
      forbidden: [
        'Прикасаться руками к хрупкой резной ганчевой штукатурке XI–XII веков внутри мавзолея.',
        'Использовать фотовспышку внутри интерьера для сохранности исторической отделки.'
      ]
    }
  }
];

// =========================================================================
// МОДУЛЬ 3: ГЕОГРАФИЧЕСКИЕ ДАННЫЕ И ГИДРОГРАФИЯ КЫРГЫЗСТАНА
// =========================================================================
const KYRGYZSTAN_BORDER = [
  [70.92, 42.26], [70.82, 42.44], [70.88, 42.58], [71.10, 42.70],
  [71.38, 42.80], [71.72, 42.86], [72.12, 42.86], [72.52, 42.81],
  [72.92, 42.74], [73.28, 42.63],
  [73.48, 42.80], [73.68, 42.98], [73.96, 43.12], [74.30, 43.22],
  [74.66, 43.26], [75.02, 43.24], [75.34, 43.13], [75.62, 42.96],
  [75.76, 42.78], [75.88, 42.58], [76.04, 42.64], [76.22, 42.84],
  [76.52, 42.96], [76.95, 42.97], [77.45, 42.95], [77.95, 42.93],
  [78.48, 42.90], [78.98, 42.86], [79.32, 42.76], [79.52, 42.62],
  [79.82, 42.50], [80.06, 42.36],
  [80.24, 42.25], [80.28, 42.18], [80.14, 42.02], [79.86, 41.86],
  [79.42, 41.72], [78.98, 41.58], [78.56, 41.42], [78.16, 41.24],
  [77.78, 41.06], [77.38, 40.94], [76.98, 40.88], [76.58, 40.72],
  [76.18, 40.54], [75.82, 40.40],
  [75.40, 40.32], [75.02, 40.26], [74.68, 40.14], [74.38, 39.96],
  [74.08, 39.80],
  [73.92, 39.64], [73.72, 39.45], [73.40, 39.34], [73.02, 39.28],
  [72.64, 39.22], [72.26, 39.24], [71.92, 39.33], [71.64, 39.46],
  [71.38, 39.62], [71.08, 39.60], [70.78, 39.56], [70.48, 39.48],
  [70.18, 39.40],
  [69.88, 39.32], [69.58, 39.22], [69.36, 39.22], [69.26, 39.38],
  [69.28, 39.60], [69.36, 39.80], [69.56, 39.96], [69.86, 40.06],
  [70.18, 40.14], [70.52, 40.16], [70.82, 40.08], [71.08, 39.98],
  [71.36, 40.02], [71.62, 40.12],
  [71.92, 40.18], [72.24, 40.26], [72.56, 40.36], [72.76, 40.48],
  [72.88, 40.58], [73.05, 40.66], [73.32, 40.76], [73.12, 40.88],
  [72.92, 40.94], [72.68, 41.02], [72.42, 41.12], [72.22, 41.24],
  [72.10, 41.36], [71.88, 41.40],
  [71.62, 41.34], [71.42, 41.36], [71.22, 41.34], [70.96, 41.38],
  [70.68, 41.38], [70.42, 41.48],
  [70.24, 41.66], [70.32, 41.84], [70.50, 41.98], [70.72, 42.12],
  [70.92, 42.26]
];

const OBLAST_BORDERS = [
  [[70.92, 42.26], [71.55, 42.18], [72.25, 42.22], [72.95, 42.28], [73.28, 42.63]],
  [[73.28, 42.63], [73.75, 42.32], [74.45, 42.28], [75.25, 42.32], [75.88, 42.58]],
  [[75.88, 42.58], [76.05, 42.05], [76.55, 41.75], [77.25, 41.55], [77.78, 41.06]],
  [[72.95, 42.28], [73.45, 41.95], [73.95, 41.68], [74.25, 41.32], [74.55, 40.85], [74.68, 40.14]],
  [[73.32, 40.76], [73.65, 40.76], [74.05, 40.78], [74.55, 40.85]],
  [[71.92, 40.18], [71.85, 39.85], [71.64, 39.46]]
];

const LON_MIN = 69.0;
const LON_MAX = 80.6;
const LAT_MIN = 39.0;
const LAT_MAX = 43.5;

const MAP_WIDTH = 24.0;
const MAP_DEPTH = 12.2;
const MAX_RELIEF_HEIGHT = 2.05;
const PLINTH_BASE_Y = -0.32;

function geoToWorld(lon, lat) {
  const u = (lon - LON_MIN) / (LON_MAX - LON_MIN);
  const v = (lat - LAT_MIN) / (LAT_MAX - LAT_MIN);
  const x = (u - 0.5) * MAP_WIDTH;
  const z = (0.5 - v) * MAP_DEPTH;
  return { x, z, u, v };
}

function worldToGeo(x, z) {
  const u = x / MAP_WIDTH + 0.5;
  const v = 0.5 - z / MAP_DEPTH;
  const lon = LON_MIN + u * (LON_MAX - LON_MIN);
  const lat = LAT_MIN + v * (LAT_MAX - LAT_MIN);
  return { lon, lat, u, v };
}

function pointInPolygon(lon, lat, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lon < (xj - xi) * (lat - yi) / (yj - yi + 1e-12) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function closestPointOnBorder(lon, lat, polygon) {
  let minDist = Infinity;
  let bestLon = lon;
  let bestLat = lat;
  for (let i = 0; i < polygon.length - 1; i++) {
    const ax = polygon[i][0], ay = polygon[i][1];
    const bx = polygon[i + 1][0], by = polygon[i + 1][1];
    const dx = bx - ax, dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    let t = lenSq > 0 ? ((lon - ax) * dx + (lat - ay) * dy) / lenSq : 0;
    t = Math.max(0, Math.min(1, t));
    const px = ax + t * dx;
    const py = ay + t * dy;
    const d = Math.hypot((lon - px) * 0.76, lat - py);
    if (d < minDist) {
      minDist = d;
      bestLon = px;
      bestLat = py;
    }
  }
  return { lon: bestLon, lat: bestLat, dist: minDist };
}

function distanceToBorder(lon, lat, polygon) {
  return closestPointOnBorder(lon, lat, polygon).dist;
}

// =========================================================================
// МОДУЛЬ 4: СГЛАЖЕННЫЙ ОРОГРАФИЧЕСКИЙ РЕЛЬЕФ (БЕЗ ОСТРЫХ ТРЕУГОЛЬНЫХ АРТЕФАКТОВ)
// =========================================================================
function hash2D(ix, iy) {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  // Квинтическая интерполяция (6t^5 - 15t^4 + 10t^3) полностью убирает сеточные изломы!
  const ux = fx * fx * fx * (fx * (fx * 6.0 - 15.0) + 10.0);
  const uy = fy * fy * fy * (fy * (fy * 6.0 - 15.0) + 10.0);

  const a = hash2D(ix, iy);
  const b = hash2D(ix + 1, iy);
  const c = hash2D(ix, iy + 1);
  const d = hash2D(ix + 1, iy + 1);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

// Естественный горный шум с мягко скруглёнными гребнями (без резких пирамидальных шипов)
function naturalMountainNoise(x, y, octaves = 6) {
  const warpX = valueNoise(x * 0.55 + 3.1, y * 0.55 + 7.4) * 0.65;
  const warpY = valueNoise(x * 0.55 + 9.2, y * 0.55 + 1.8) * 0.65;
  let px = x + warpX;
  let py = y + warpY;

  let sum = 0;
  let freq = 1.0;
  let amp = 0.52;
  let weight = 1.0;

  for (let i = 0; i < octaves; i++) {
    const raw = valueNoise(px * freq, py * freq) * 2.0 - 1.0;
    // Плавный модуль sqrt(raw^2 + eps) сглаживает вершину гребня, исключая треугольные шипы
    let n = 1.0 - Math.sqrt(raw * raw + 0.035);
    n = n * n * weight;
    weight = Math.max(0.15, Math.min(1.0, n * 1.65));
    sum += n * amp;
    freq *= 2.06;
    amp *= 0.47;
  }
  return sum;
}

function fbm(x, y, octaves = 4) {
  let sum = 0;
  let freq = 1.0;
  let amp = 0.5;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise(x * freq, y * freq) * amp;
    freq *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

function distToSegment(lon, lat, lon1, lat1, lon2, lat2) {
  const dx = lon2 - lon1;
  const dy = lat2 - lat1;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq > 0 ? ((lon - lon1) * dx + (lat - lat1) * dy) / lenSq : 0;
  t = Math.max(0, Math.min(1, t));
  const px = lon1 + t * dx;
  const py = lat1 + t * dy;
  return Math.hypot((lon - px) * 0.78, lat - py);
}

const MOUNTAIN_RIDGES = [
  [78.65, 41.88, 80.22, 42.20, 0.52, 1.00], // Хан-Тенгри и Пик Победы (7 439 м)
  [75.55, 40.50, 79.45, 41.78, 0.44, 0.85], // Какшаал-Тоо
  [75.85, 42.00, 79.15, 42.45, 0.34, 0.82], // Терскей Ала-Тоо
  [76.15, 42.78, 79.05, 42.88, 0.26, 0.72], // Кунгей Ала-Тоо
  [71.60, 42.54, 75.70, 42.58, 0.31, 0.78], // Кыргызский Ала-Тоо
  [70.85, 42.16, 73.45, 42.28, 0.29, 0.69], // Таласский Ала-Тоо
  [73.25, 42.02, 75.15, 42.12, 0.27, 0.66], // Суусамыр-Тоо
  [74.35, 41.66, 75.85, 41.70, 0.23, 0.63], // Молдо-Тоо
  [76.35, 41.62, 78.35, 41.82, 0.38, 0.79], // Ак-Шыйрак
  [74.85, 41.05, 76.95, 41.32, 0.32, 0.73], // Ат-Башы и Нарын-Тоо
  [74.15, 41.15, 75.45, 41.22, 0.27, 0.65], // Джаман-Тоо
  [72.65, 41.86, 74.65, 40.52, 0.38, 0.78], // Ферганский хребет
  [71.65, 39.40, 73.85, 39.55, 0.32, 0.93], // Заалайский хребет (Пик Ленина)
  [70.85, 39.75, 73.55, 39.95, 0.30, 0.75], // Алайский хребет
  [69.35, 39.42, 71.15, 39.68, 0.30, 0.74], // Туркестанский хребет
  [70.30, 41.55, 71.95, 41.98, 0.32, 0.70]  // Чаткальский хребет
];

const LAKE_POLYGONS = [
  {
    name: 'Issyk-Kul',
    depthFactor: 1.0,
    pts: [
      [76.19, 42.45], [76.35, 42.54], [76.68, 42.60], [77.08, 42.62],
      [77.48, 42.64], [77.88, 42.66], [78.22, 42.71], [78.38, 42.67],
      [78.24, 42.56], [78.32, 42.48], [78.02, 42.40], [77.62, 42.30],
      [77.22, 42.22], [76.82, 42.23], [76.46, 42.31], [76.24, 42.39]
    ]
  },
  {
    name: 'Son-Kol',
    depthFactor: 0.78,
    pts: [
      [74.93, 41.84], [75.02, 41.91], [75.18, 41.93], [75.32, 41.88],
      [75.34, 41.79], [75.20, 41.75], [75.03, 41.77]
    ]
  },
  {
    name: 'Chatyr-Kol',
    depthFactor: 0.72,
    pts: [
      [75.15, 40.63], [75.26, 40.68], [75.42, 40.66], [75.47, 40.59],
      [75.34, 40.56], [75.19, 40.58]
    ]
  },
  {
    name: 'Toktogul',
    depthFactor: 0.85,
    pts: [
      [72.68, 41.76], [72.78, 41.86], [72.88, 41.92], [72.95, 41.84],
      [73.06, 41.81], [73.02, 41.73], [72.88, 41.70], [72.74, 41.68]
    ]
  },
  {
    name: 'Sary-Chelek',
    depthFactor: 0.88,
    pts: [
      [71.95, 41.94], [71.99, 41.93], [72.01, 41.86], [71.98, 41.82],
      [71.94, 41.85]
    ]
  },
  {
    name: 'Orto-Tokoy',
    depthFactor: 0.68,
    pts: [
      [75.88, 42.34], [75.96, 42.37], [76.04, 42.34], [75.96, 42.31]
    ]
  },
  {
    name: 'Kirov',
    depthFactor: 0.68,
    pts: [
      [71.50, 42.64], [71.58, 42.67], [71.66, 42.63], [71.57, 42.60]
    ]
  }
];

for (const lake of LAKE_POLYGONS) {
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const [x, y] of lake.pts) {
    if (x < minLon) minLon = x;
    if (x > maxLon) maxLon = x;
    if (y < minLat) minLat = y;
    if (y > maxLat) maxLat = y;
  }
  lake.bbox = { minLon: minLon - 0.08, maxLon: maxLon + 0.08, minLat: minLat - 0.08, maxLat: maxLat + 0.08 };
  lake.closedPts = [...lake.pts, lake.pts[0]];
}

const RIVERS = [
  {
    width: 1.15, carve: 0.22,
    pts: [
      [78.25, 41.90], [77.75, 41.76], [77.20, 41.62], [76.60, 41.48],
      [76.00, 41.42], [75.40, 41.44], [74.80, 41.40], [74.20, 41.46],
      [73.65, 41.62], [73.15, 41.74], [72.72, 41.72], [72.35, 41.52],
      [72.10, 41.22]
    ]
  },
  { width: 0.72, carve: 0.15, pts: [[73.75, 42.18], [74.12, 42.06], [74.18, 41.82], [74.12, 41.48]] },
  { width: 0.65, carve: 0.13, pts: [[76.25, 41.18], [75.75, 41.14], [75.25, 41.22], [74.85, 41.40]] },
  { width: 0.78, carve: 0.16, pts: [[79.75, 42.16], [79.25, 41.96], [78.92, 41.72], [78.68, 41.46]] },
  {
    width: 0.95, carve: 0.18,
    pts: [
      [75.55, 42.20], [75.95, 42.34], [75.88, 42.56], [75.72, 42.78],
      [75.25, 42.90], [74.72, 43.08], [74.22, 43.16], [73.78, 43.04]
    ]
  },
  { width: 0.80, carve: 0.15, pts: [[73.18, 42.44], [72.58, 42.52], [71.98, 42.60], [71.45, 42.72]] },
  { width: 0.72, carve: 0.15, pts: [[71.68, 41.96], [71.18, 41.78], [70.68, 41.58], [70.35, 41.48]] },
  { width: 0.85, carve: 0.16, pts: [[74.05, 40.50], [73.55, 40.72], [73.05, 40.78], [72.55, 40.74]] },
  { width: 0.78, carve: 0.15, pts: [[73.60, 39.65], [72.90, 39.62], [72.20, 39.58], [71.65, 39.52]] }
];

function sampleSmoothRiver(pts, subdivisions = 14) {
  const result = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    for (let s = 0; s < subdivisions; s++) {
      const t = s / subdivisions;
      const t2 = t * t;
      const t3 = t2 * t;

      const lon = 0.5 * (
        (2 * p1[0]) +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
      );
      const lat = 0.5 * (
        (2 * p1[1]) +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
      );
      const meander = (fbm(lon * 14.0, lat * 14.0, 3) - 0.5) * 0.03;
      result.push([lon + meander * 0.6, lat + meander]);
    }
  }
  result.push(pts[pts.length - 1]);
  return result;
}

const SMOOTH_RIVERS = RIVERS.map((r) => ({
  ...r,
  smoothPts: sampleSmoothRiver(r.pts, 14)
}));

function getLakeInfo(lon, lat) {
  let maxFactor = 0;
  let maxDepth = 0;
  const jLon = lon + (fbm(lon * 18.0, lat * 18.0, 3) - 0.5) * 0.028;
  const jLat = lat + (fbm(lon * 18.0 + 5.2, lat * 18.0 + 3.1, 3) - 0.5) * 0.022;

  for (const lake of LAKE_POLYGONS) {
    if (
      jLon < lake.bbox.minLon || jLon > lake.bbox.maxLon ||
      jLat < lake.bbox.minLat || jLat > lake.bbox.maxLat
    ) {
      continue;
    }
    const inside = pointInPolygon(jLon, jLat, lake.pts);
    const edgeDist = closestPointOnBorder(jLon, jLat, lake.closedPts).dist;
    const shoreBand = 0.032;

    if (inside) {
      const factor = Math.min(1.0, 0.55 + (edgeDist / shoreBand) * 0.45);
      const depth = Math.min(1.0, Math.pow(edgeDist / 0.16, 0.68)) * lake.depthFactor;
      if (factor > maxFactor) {
        maxFactor = factor;
        maxDepth = depth;
      }
    } else if (edgeDist < shoreBand * 0.55) {
      const factor = Math.max(0, 0.55 * (1.0 - edgeDist / (shoreBand * 0.55)));
      if (factor > maxFactor) {
        maxFactor = factor;
        maxDepth = 0.04;
      }
    }
  }
  return { factor: maxFactor, depth: maxDepth };
}

function getLakeFactor(lon, lat) {
  return getLakeInfo(lon, lat).factor;
}

function getRiverValleyFactor(lon, lat) {
  let maxCarve = 0;
  for (const river of SMOOTH_RIVERS) {
    const pts = river.smoothPts;
    for (let i = 0; i < pts.length - 1; i += 2) {
      const d = distToSegment(lon, lat, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      if (d < 0.18) {
        const c = Math.exp(-(d * d) / (2.0 * 0.062 * 0.062)) * river.carve;
        if (c > maxCarve) maxCarve = c;
      }
    }
  }
  return maxCarve;
}

// Raw функция высоты
function rawSampleElevation(lon, lat) {
  let ridgeBase = 0.13;
  for (const [lon1, lat1, lon2, lat2, halfW, peakH] of MOUNTAIN_RIDGES) {
    const d = distToSegment(lon, lat, lon1, lat1, lon2, lat2);
    if (d < halfW * 2.4) {
      const influence = Math.exp(-(d * d) / (2.0 * halfW * halfW)) * peakH;
      ridgeBase = Math.max(ridgeBase, ridgeBase * 0.32 + influence * 0.86);
    }
  }

  const chuiValley = Math.exp(-Math.pow((lon - 74.6) / 1.15, 2) - Math.pow((lat - 42.98) / 0.24, 2));
  const talasValley = Math.exp(-Math.pow((lon - 72.1) / 0.85, 2) - Math.pow((lat - 42.58) / 0.18, 2));
  const ferganaEdge = Math.exp(-Math.pow((lon - 72.3) / 1.25, 2) - Math.pow((lat - 40.75) / 0.45, 2));
  const alayValley = Math.exp(-Math.pow((lon - 72.5) / 0.95, 2) - Math.pow((lat - 39.62) / 0.11, 2));
  const suusamyrValley = Math.exp(-Math.pow((lon - 73.9) / 0.45, 2) - Math.pow((lat - 42.16) / 0.11, 2));

  ridgeBase *= (1.0 - chuiValley * 0.76);
  ridgeBase *= (1.0 - talasValley * 0.70);
  ridgeBase *= (1.0 - ferganaEdge * 0.72);
  ridgeBase *= (1.0 - alayValley * 0.50);
  ridgeBase *= (1.0 - suusamyrValley * 0.44);

  const nx = (lon - LON_MIN) * 1.75;
  const ny = (lat - LAT_MIN) * 2.25;
  const ridgeNoise = naturalMountainNoise(nx, ny, 6);
  const subRidge = naturalMountainNoise(nx * 1.9 + 4.2, ny * 1.9 + 1.9, 4);
  const detailNoise = fbm(nx * 2.6, ny * 2.6, 4);

  let h = ridgeBase * (0.54 + 0.48 * ridgeNoise + 0.12 * subRidge) + detailNoise * 0.05;

  const valleyCarve = getRiverValleyFactor(lon, lat);
  h *= (1.0 - valleyCarve);

  const issykBasin = Math.exp(-Math.pow((lon - 77.26) / 1.25, 2) - Math.pow((lat - 42.45) / 0.36, 2));
  h = h * (1.0 - issykBasin * 0.82) + issykBasin * 0.165;

  const lakeInfo = getLakeInfo(lon, lat);
  if (lakeInfo.factor > 0) {
    const lakeLevel = lon < 76.0 ? (lon < 74.0 ? 0.125 : 0.32) : 0.175;
    h = h * (1.0 - lakeInfo.factor) + lakeLevel * lakeInfo.factor;
  }

  const borderDist = distanceToBorder(lon, lat, KYRGYZSTAN_BORDER);
  const borderTaper = Math.min(1.0, Math.max(0.22, borderDist / 0.24));
  h *= (0.48 + 0.52 * borderTaper);

  return Math.max(0.03, Math.min(1.0, h));
}

// Предвычисленная сглаженная матрица высот (Gaussian-сглаживание исключает треугольные зазубрины)
const DEM_W = 800;
const DEM_H = 400;
const DEM_ELEV = new Float32Array(DEM_W * DEM_H);
const DEM_LAKE_FACTOR = new Float32Array(DEM_W * DEM_H);
const DEM_LAKE_DEPTH = new Float32Array(DEM_W * DEM_H);

(function buildSmoothedDEM() {
  const temp = new Float32Array(DEM_W * DEM_H);
  for (let gy = 0; gy < DEM_H; gy++) {
    const v = 1.0 - gy / (DEM_H - 1);
    const lat = LAT_MIN + v * (LAT_MAX - LAT_MIN);
    for (let gx = 0; gx < DEM_W; gx++) {
      const u = gx / (DEM_W - 1);
      const lon = LON_MIN + u * (LON_MAX - LON_MIN);
      const idx = gy * DEM_W + gx;
      temp[idx] = rawSampleElevation(lon, lat);
      const lInfo = getLakeInfo(lon, lat);
      DEM_LAKE_FACTOR[idx] = lInfo.factor;
      DEM_LAKE_DEPTH[idx] = lInfo.depth;
    }
  }

  // 2 прохода мягкого гауссова размытия для естественных горных склонов без треугольных изломов
  let src = temp;
  let dst = DEM_ELEV;
  for (let pass = 0; pass < 2; pass++) {
    for (let gy = 0; gy < DEM_H; gy++) {
      for (let gx = 0; gx < DEM_W; gx++) {
        const idx = gy * DEM_W + gx;
        if (DEM_LAKE_FACTOR[idx] > 0.35) {
          dst[idx] = src[idx];
          continue;
        }
        let sum = 0;
        let wSum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const ny = Math.max(0, Math.min(DEM_H - 1, gy + dy));
          for (let dx = -1; dx <= 1; dx++) {
            const nx = Math.max(0, Math.min(DEM_W - 1, gx + dx));
            const w = (dx === 0 && dy === 0) ? 4 : (dx === 0 || dy === 0) ? 2 : 1;
            sum += src[ny * DEM_W + nx] * w;
            wSum += w;
          }
        }
        dst[idx] = sum / wSum;
      }
    }
    if (pass === 0) {
      src = DEM_ELEV;
      dst = temp;
    } else {
      DEM_ELEV.set(temp);
    }
  }
})();

function sampleBilinearDEM(grid, lon, lat) {
  const u = Math.max(0, Math.min(1, (lon - LON_MIN) / (LON_MAX - LON_MIN)));
  const v = Math.max(0, Math.min(1, (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)));
  const gx = Math.max(0, Math.min(DEM_W - 1.001, u * (DEM_W - 1)));
  const gy = Math.max(0, Math.min(DEM_H - 1.001, (1.0 - v) * (DEM_H - 1)));
  const ix = Math.floor(gx);
  const iy = Math.floor(gy);
  const fx = gx - ix;
  const fy = gy - iy;
  const e00 = grid[iy * DEM_W + ix];
  const e10 = grid[iy * DEM_W + ix + 1];
  const e01 = grid[(iy + 1) * DEM_W + ix];
  const e11 = grid[(iy + 1) * DEM_W + ix + 1];
  return (e00 * (1 - fx) + e10 * fx) * (1 - fy) + (e01 * (1 - fx) + e11 * fx) * fy;
}

function sampleElevation(lon, lat) {
  return sampleBilinearDEM(DEM_ELEV, lon, lat);
}

function getTerrainHeightAtWorld(x, z) {
  const { lon, lat } = worldToGeo(x, z);
  if (!pointInPolygon(lon, lat, KYRGYZSTAN_BORDER)) {
    return PLINTH_BASE_Y;
  }
  return sampleElevation(lon, lat) * MAX_RELIEF_HEIGHT;
}

// =========================================================================
// МОДУЛЬ 5: ПРОЦЕДУРНЫЕ ТЕКСТУРЫ LANDSCAPE & NORMAL MAPS (TerrainRenderer)
// =========================================================================
function generateProceduralTextures(W, H) {
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = W;
  colorCanvas.height = H;
  const colorCtx = colorCanvas.getContext('2d');

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = W;
  normalCanvas.height = H;
  const normalCtx = normalCanvas.getContext('2d');

  const waterCanvas = document.createElement('canvas');
  waterCanvas.width = W;
  waterCanvas.height = H;
  const waterCtx = waterCanvas.getContext('2d');

  const imgData = colorCtx.createImageData(W, H);
  const normData = normalCtx.createImageData(W, H);
  const waterData = waterCtx.createImageData(W, H);

  const data = imgData.data;
  const nData = normData.data;
  const wData = waterData.data;

  // Естественные природные переходы по высоте: долины -> предгорья -> альпийские луга -> скалы -> снег
  const stops = [
    { t: 0.00, r: 30,  g: 74,  b: 54  },
    { t: 0.16, r: 52,  g: 100, b: 66  },
    { t: 0.30, r: 106, g: 118, b: 74  },
    { t: 0.45, r: 142, g: 114, b: 82  },
    { t: 0.60, r: 96,  g: 98,  b: 110 },
    { t: 0.74, r: 150, g: 162, b: 180 },
    { t: 0.87, r: 214, g: 228, b: 244 },
    { t: 1.00, r: 238, g: 244, b: 251 }
  ];

  const dLon = (LON_MAX - LON_MIN) / (DEM_W - 1);
  const dLat = (LAT_MAX - LAT_MIN) / (DEM_H - 1);
  const normalStrength = 0.075;
  const lightDirX = -0.58;
  const lightDirY = 0.58;
  const lightDirZ = 0.57;

  for (let py = 0; py < H; py++) {
    const v = 1.0 - py / (H - 1);
    const lat = LAT_MIN + v * (LAT_MAX - LAT_MIN);
    for (let px = 0; px < W; px++) {
      const u = px / (W - 1);
      const lon = LON_MIN + u * (LON_MAX - LON_MIN);

      const e = sampleBilinearDEM(DEM_ELEV, lon, lat);
      const lFactor = sampleBilinearDEM(DEM_LAKE_FACTOR, lon, lat);
      const lDepth = sampleBilinearDEM(DEM_LAKE_DEPTH, lon, lat);

      const eL = sampleBilinearDEM(DEM_ELEV, lon - dLon, lat);
      const eR = sampleBilinearDEM(DEM_ELEV, lon + dLon, lat);
      const eD = sampleBilinearDEM(DEM_ELEV, lon, lat - dLat);
      const eU = sampleBilinearDEM(DEM_ELEV, lon, lat + dLat);

      const dhdx = (eR - eL) * 0.5;
      const dhdy = (eU - eD) * 0.5;
      const slope = Math.hypot(dhdx, dhdy) * 34.0;

      let nx = -dhdx / normalStrength;
      let ny = -dhdy / normalStrength;
      let nz = 1.0;
      if (lFactor > 0.35) {
        nx *= 0.03;
        ny *= 0.03;
      }
      const invLen = 1.0 / Math.hypot(nx, ny, nz);
      nx *= invLen;
      ny *= invLen;
      nz *= invLen;

      const hillshade = Math.max(0.78, Math.min(1.15, 0.89 + (nx * lightDirX + ny * lightDirY + nz * lightDirZ) * 0.32));
      const strata = Math.sin(e * 62.0 + fbm(u * 20.0, v * 10.0, 3) * 2.8) * 2.5;

      let r = 238, g = 244, b = 251;
      for (let s = 0; s < stops.length - 1; s++) {
        if (e >= stops[s].t && e <= stops[s + 1].t) {
          const localT = (e - stops[s].t) / (stops[s + 1].t - stops[s].t);
          const smoothT = localT * localT * (3.0 - 2.0 * localT);
          r = stops[s].r + (stops[s + 1].r - stops[s].r) * smoothT;
          g = stops[s].g + (stops[s + 1].g - stops[s].g) * smoothT;
          b = stops[s].b + (stops[s + 1].b - stops[s].b) * smoothT;
          break;
        }
      }

      // Обнажение горной породы на крутых склонах (материалы в зависимости от наклона)
      if (e > 0.55 && slope > 0.34) {
        const cliffFactor = Math.min(0.70, (slope - 0.34) * 1.15);
        r = r * (1 - cliffFactor) + 80 * cliffFactor;
        g = g * (1 - cliffFactor) + 84 * cliffFactor;
        b = b * (1 - cliffFactor) + 96 * cliffFactor;
      }

      // Ледниковый голубой оттенок в пологих высокогорных цирках
      if (e > 0.78 && slope < 0.28) {
        const glacierT = Math.min(1.0, (e - 0.78) * 4.5) * (1.0 - slope * 2.5);
        r = r * (1 - glacierT * 0.30) + 188 * (glacierT * 0.30);
        g = g * (1 - glacierT * 0.18) + 226 * (glacierT * 0.18);
        b = b * (1 - glacierT * 0.08) + 248 * (glacierT * 0.08);
      }

      if (lFactor < 0.5) {
        r = r * hillshade + strata;
        g = g * hillshade + strata;
        b = b * hillshade + strata;
      }

      // Батиметрия озёр (узнаваемый Иссык-Куль, Сон-Көл, Сары-Челек)
      if (lFactor > 0.02) {
        const d = lDepth;
        let lr, lg, lb;
        if (d < 0.18) {
          const st = d / 0.18;
          lr = 165 * (1 - st) + 46 * st;
          lg = 152 * (1 - st) + 196 * st;
          lb = 118 * (1 - st) + 228 * st;
        } else {
          const dt = (d - 0.18) / 0.82;
          lr = 46 * (1 - dt) + 12 * dt;
          lg = 196 * (1 - dt) + 116 * dt;
          lb = 228 * (1 - dt) + 184 * dt;
        }
        r = r * (1 - lFactor) + lr * lFactor;
        g = g * (1 - lFactor) + lg * lFactor;
        b = b * (1 - lFactor) + lb * lFactor;
      }

      const idx = (py * W + px) * 4;
      data[idx]     = Math.max(0, Math.min(255, r));
      data[idx + 1] = Math.max(0, Math.min(255, g));
      data[idx + 2] = Math.max(0, Math.min(255, b));
      data[idx + 3] = 255;

      nData[idx]     = Math.round((nx * 0.5 + 0.5) * 255);
      nData[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      nData[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      nData[idx + 3] = 255;

      const wVal = Math.round(lFactor * 255);
      wData[idx] = wVal;
      wData[idx + 1] = wVal;
      wData[idx + 2] = wVal;
      wData[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(imgData, 0, 0);
  normalCtx.putImageData(normData, 0, 0);
  waterCtx.putImageData(waterData, 0, 0);

  // Реки
  function strokeSmoothRivers(ctx, isWaterMask) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const scaleW = W / 3072;

    for (const river of SMOOTH_RIVERS) {
      const pts = river.smoothPts;
      const total = pts.length - 1;
      for (let i = 0; i < total; i++) {
        const taper = 0.42 + 0.68 * (i / total);
        const x1 = ((pts[i][0] - LON_MIN) / (LON_MAX - LON_MIN)) * W;
        const y1 = (1.0 - (pts[i][1] - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
        const x2 = ((pts[i + 1][0] - LON_MIN) / (LON_MAX - LON_MIN)) * W;
        const y2 = (1.0 - (pts[i + 1][1] - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;

        if (isWaterMask) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
          ctx.lineWidth = 5.4 * river.width * taper * scaleW;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(14, 116, 144, 0.36)';
          ctx.lineWidth = 8.2 * river.width * taper * scaleW;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.78)';
          ctx.lineWidth = 4.2 * river.width * taper * scaleW;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.92)';
          ctx.lineWidth = 1.7 * river.width * taper * scaleW;
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  strokeSmoothRivers(colorCtx, false);
  strokeSmoothRivers(waterCtx, true);

  // Картографическая гравировка внутри контура
  colorCtx.save();
  colorCtx.beginPath();
  KYRGYZSTAN_BORDER.forEach(([lon, lat], idx) => {
    const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
    const y = (1.0 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
    if (idx === 0) colorCtx.moveTo(x, y);
    else colorCtx.lineTo(x, y);
  });
  colorCtx.closePath();
  colorCtx.clip();

  colorCtx.strokeStyle = 'rgba(246, 196, 83, 0.30)';
  colorCtx.lineWidth = 2.0 * (W / 3072);
  colorCtx.setLineDash([8, 6]);
  for (const bLine of OBLAST_BORDERS) {
    colorCtx.beginPath();
    bLine.forEach(([lon, lat], idx) => {
      const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
      const y = (1.0 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
      if (idx === 0) colorCtx.moveTo(x, y);
      else colorCtx.lineTo(x, y);
    });
    colorCtx.stroke();
  }
  colorCtx.setLineDash([]);

  const fontScale = W / 3072;
  const mapLabels = [
    { text: 'ОЗ. ИССЫК-КУЛЬ', lon: 77.26, lat: 42.43, angle: -0.09, size: 22, color: 'rgba(224, 242, 254, 0.85)' },
    { text: 'ОЗ. СОН-КӨЛ', lon: 75.13, lat: 41.84, angle: 0.08, size: 15, color: 'rgba(224, 242, 254, 0.82)' },
    { text: 'ПИК ПОБЕДЫ 7 439 м', lon: 79.68, lat: 42.06, angle: -0.18, size: 15, color: 'rgba(255, 244, 214, 0.88)' },
    { text: 'Т Е Р С К Е Й   А Л А - Т О О', lon: 77.45, lat: 42.16, angle: -0.12, size: 16, color: 'rgba(237, 231, 220, 0.65)' },
    { text: 'К А К Ш А А Л - Т О О', lon: 77.35, lat: 41.05, angle: -0.25, size: 16, color: 'rgba(237, 231, 220, 0.65)' },
    { text: 'В Н У Т Р Е Н Н И Й   Т Я Н Ь - Ш А Н Ь', lon: 75.85, lat: 41.48, angle: -0.05, size: 17, color: 'rgba(237, 231, 220, 0.62)' },
    { text: 'Ч У Й С К А Я   Д О Л И Н А', lon: 74.55, lat: 42.96, angle: -0.04, size: 16, color: 'rgba(246, 196, 83, 0.72)' },
    { text: 'Т А Л А С С К А Я   Д О Л И Н А', lon: 72.15, lat: 42.58, angle: -0.08, size: 15, color: 'rgba(246, 196, 83, 0.70)' },
    { text: 'Ф Е Р Г А Н С К И Й   Х Р Е Б Е Т', lon: 73.55, lat: 41.22, angle: 0.45, size: 16, color: 'rgba(237, 231, 220, 0.65)' },
    { text: 'А Л А Й С К А Я   Д О Л И Н А', lon: 72.65, lat: 39.62, angle: -0.04, size: 15, color: 'rgba(246, 196, 83, 0.72)' },
    { text: 'З А А Л А Й С К И Й   Х Р Е Б Е Т', lon: 72.75, lat: 39.38, angle: -0.04, size: 14, color: 'rgba(255, 244, 214, 0.75)' }
  ];

  colorCtx.textAlign = 'center';
  colorCtx.textBaseline = 'middle';
  for (const lbl of mapLabels) {
    const lx = ((lbl.lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
    const ly = (1.0 - (lbl.lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
    colorCtx.save();
    colorCtx.translate(lx, ly);
    colorCtx.rotate(lbl.angle);
    colorCtx.font = `600 ${Math.round(lbl.size * fontScale)}px "Cinzel", "Cormorant Garamond", serif`;
    colorCtx.fillStyle = 'rgba(7, 9, 15, 0.65)';
    colorCtx.fillText(lbl.text, 1.5, 1.5);
    colorCtx.fillStyle = lbl.color;
    colorCtx.fillText(lbl.text, 0, 0);
    colorCtx.restore();
  }
  colorCtx.restore();

  // Карта наскальных петроглифов
  const runeCanvas = document.createElement('canvas');
  runeCanvas.width = W;
  runeCanvas.height = H;
  const rCtx = runeCanvas.getContext('2d');
  rCtx.fillStyle = '#000000';
  rCtx.fillRect(0, 0, W, H);
  rCtx.strokeStyle = '#FFFFFF';
  rCtx.lineCap = 'round';
  rCtx.lineJoin = 'round';

  function drawIbex(ctx, x, y, scale, flip = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * flip * fontScale, scale * fontScale);
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-14, -4); ctx.lineTo(0, 0); ctx.lineTo(14, -5);
    ctx.lineTo(14, 5); ctx.lineTo(0, 0); ctx.lineTo(-14, 4);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-11, 4); ctx.lineTo(-13, 14);
    ctx.moveTo(-7, 3);  ctx.lineTo(-7, 14);
    ctx.moveTo(10, 4);  ctx.lineTo(10, 14);
    ctx.moveTo(13, 4);  ctx.lineTo(15, 14);
    ctx.moveTo(13, -4); ctx.lineTo(18, -11); ctx.lineTo(22, -10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(6, -12, 13, -0.2, Math.PI * 1.15, true);
    ctx.stroke();
    ctx.restore();
  }

  function drawSunDeity(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * fontScale, scale * fontScale);
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, -14, 7, 0, Math.PI * 2);
    ctx.stroke();
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 9, -14 + Math.sin(a) * 9);
      ctx.lineTo(Math.cos(a) * 14, -14 + Math.sin(a) * 14);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, -7); ctx.lineTo(0, 10);
    ctx.moveTo(-12, -8); ctx.lineTo(-7, -2); ctx.lineTo(7, -2); ctx.lineTo(12, -8);
    ctx.moveTo(0, 10); ctx.lineTo(-7, 20);
    ctx.moveTo(0, 10); ctx.lineTo(7, 20);
    ctx.stroke();
    ctx.restore();
  }

  function drawSpiral(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * fontScale, scale * fontScale);
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let t = 0; t < Math.PI * 5; t += 0.15) {
      const r = t * 1.1;
      const px = Math.cos(t) * r;
      const py = Math.sin(t) * r;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  let seed = 42;
  function seededRand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  for (const site of SACRED_SITES) {
    const u = (site.lon - LON_MIN) / (LON_MAX - LON_MIN);
    const v = (site.lat - LAT_MIN) / (LAT_MAX - LAT_MIN);
    const cx = u * W;
    const cy = (1.0 - v) * H;
    for (let k = 0; k < 14; k++) {
      const ang = seededRand() * Math.PI * 2;
      const dist = (18 + seededRand() * 82) * fontScale;
      const px = cx + Math.cos(ang) * dist;
      const py = cy + Math.sin(ang) * dist * 0.7;
      const sc = 0.75 + seededRand() * 0.5;
      if (k % 3 === 0) drawIbex(rCtx, px, py, sc, seededRand() > 0.5 ? 1 : -1);
      else if (k % 3 === 1) drawSunDeity(rCtx, px, py, sc * 0.9);
      else drawSpiral(rCtx, px, py, sc * 0.85);
    }
  }

  for (let i = 0; i < 290; i++) {
    const lon = LON_MIN + 0.5 + seededRand() * (LON_MAX - LON_MIN - 1.0);
    const lat = LAT_MIN + 0.25 + seededRand() * (LAT_MAX - LAT_MIN - 0.5);
    if (!pointInPolygon(lon, lat, KYRGYZSTAN_BORDER)) continue;
    if (getLakeFactor(lon, lat) > 0.08) continue;
    const u = (lon - LON_MIN) / (LON_MAX - LON_MIN);
    const v = (lat - LAT_MIN) / (LAT_MAX - LAT_MIN);
    const px = u * W;
    const py = (1.0 - v) * H;
    const sc = 0.65 + seededRand() * 0.5;
    const r = seededRand();
    if (r < 0.45) drawIbex(rCtx, px, py, sc, seededRand() > 0.5 ? 1 : -1);
    else if (r < 0.78) drawSpiral(rCtx, px, py, sc * 0.85);
    else drawSunDeity(rCtx, px, py, sc * 0.85);
  }

  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.colorSpace = THREE.SRGBColorSpace;
  colorTexture.anisotropy = 8;

  const normalTexture = new THREE.CanvasTexture(normalCanvas);
  normalTexture.anisotropy = 8;

  const waterTexture = new THREE.CanvasTexture(waterCanvas);
  waterTexture.anisotropy = 4;

  const runeTexture = new THREE.CanvasTexture(runeCanvas);
  runeTexture.anisotropy = 4;

  return { colorTexture, normalTexture, waterTexture, runeTexture };
}

// =========================================================================
// МОДУЛЬ 6: ПОСТРОЕНИЕ 3D-ПЛАКЕТКИ КЫРГЫЗСТАНА (TerrainRenderer)
// =========================================================================
function buildKyrgyzstanPlaque(textures, segX, segZ) {
  const group = new THREE.Group();

  const positions = [];
  const uvs = [];
  const indices = [];

  const cols = segX + 1;
  const rows = segZ + 1;
  const insideGrid = new Uint8Array(cols * rows);
  const validGrid = new Uint8Array(cols * rows);
  const lonGrid = new Float32Array(cols * rows);
  const latGrid = new Float32Array(cols * rows);
  const heightGrid = new Float32Array(cols * rows);
  const vertIndexGrid = new Int32Array(cols * rows).fill(-1);

  for (let rz = 0; rz < rows; rz++) {
    const v = 1.0 - rz / segZ;
    const lat = LAT_MIN + v * (LAT_MAX - LAT_MIN);
    for (let cx = 0; cx < cols; cx++) {
      const u = cx / segX;
      const lon = LON_MIN + u * (LON_MAX - LON_MIN);
      const idx = rz * cols + cx;
      lonGrid[idx] = lon;
      latGrid[idx] = lat;
      const inside = pointInPolygon(lon, lat, KYRGYZSTAN_BORDER);
      insideGrid[idx] = inside ? 1 : 0;
      if (inside) {
        validGrid[idx] = 1;
        heightGrid[idx] = sampleElevation(lon, lat) * MAX_RELIEF_HEIGHT;
      }
    }
  }

  for (let rz = 1; rz < rows - 1; rz++) {
    for (let cx = 1; cx < cols - 1; cx++) {
      const idx = rz * cols + cx;
      if (insideGrid[idx] === 1) continue;

      let hasInsideNeighbor = false;
      for (let dz = -1; dz <= 1 && !hasInsideNeighbor; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (insideGrid[(rz + dz) * cols + (cx + dx)] === 1) {
            hasInsideNeighbor = true;
            break;
          }
        }
      }

      if (hasInsideNeighbor) {
        const snapped = closestPointOnBorder(lonGrid[idx], latGrid[idx], KYRGYZSTAN_BORDER);
        validGrid[idx] = 1;
        lonGrid[idx] = snapped.lon;
        latGrid[idx] = snapped.lat;
        heightGrid[idx] = sampleElevation(snapped.lon, snapped.lat) * MAX_RELIEF_HEIGHT;
      }
    }
  }

  for (let rz = 0; rz < rows; rz++) {
    for (let cx = 0; cx < cols; cx++) {
      const idx = rz * cols + cx;
      if (validGrid[idx]) {
        const { x, z, u, v } = geoToWorld(lonGrid[idx], latGrid[idx]);
        vertIndexGrid[idx] = positions.length / 3;
        positions.push(x, heightGrid[idx], z);
        uvs.push(u, v);
      }
    }
  }

  for (let rz = 0; rz < segZ; rz++) {
    for (let cx = 0; cx < segX; cx++) {
      const i00 = rz * cols + cx;
      const i10 = i00 + 1;
      const i01 = (rz + 1) * cols + cx;
      const i11 = i01 + 1;

      if (
        insideGrid[i00] === 0 &&
        insideGrid[i10] === 0 &&
        insideGrid[i01] === 0 &&
        insideGrid[i11] === 0
      ) {
        continue;
      }

      const v00 = vertIndexGrid[i00];
      const v10 = vertIndexGrid[i10];
      const v01 = vertIndexGrid[i01];
      const v11 = vertIndexGrid[i11];

      if (v00 !== -1 && v10 !== -1 && v01 !== -1 && v11 !== -1) {
        indices.push(v00, v01, v10);
        indices.push(v10, v01, v11);
      } else if (v00 !== -1 && v01 !== -1 && v11 !== -1) {
        indices.push(v00, v01, v11);
      } else if (v00 !== -1 && v01 !== -1 && v10 !== -1) {
        indices.push(v00, v01, v10);
      } else if (v10 !== -1 && v01 !== -1 && v11 !== -1) {
        indices.push(v10, v01, v11);
      } else if (v00 !== -1 && v10 !== -1 && v11 !== -1) {
        indices.push(v00, v10, v11);
      }
    }
  }

  const terrainGeo = new THREE.BufferGeometry();
  terrainGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  terrainGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  terrainGeo.setIndex(indices);
  terrainGeo.computeVertexNormals();

  const shaderUniforms = {
    uTime: { value: 0 },
    uTorchPos: { value: new THREE.Vector3(0, 1.0, 0) },
    uTorchActive: { value: 0.0 },
    uXrayMode: { value: 0.0 },
    uWaterMap: { value: textures.waterTexture },
    uRuneMap: { value: textures.runeTexture }
  };

  const terrainMat = new THREE.MeshStandardMaterial({
    map: textures.colorTexture,
    normalMap: textures.normalTexture,
    normalScale: new THREE.Vector2(0.95, 0.95),
    roughness: 0.80,
    metalness: 0.03
  });

  terrainMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = shaderUniforms.uTime;
    shader.uniforms.uTorchPos = shaderUniforms.uTorchPos;
    shader.uniforms.uTorchActive = shaderUniforms.uTorchActive;
    shader.uniforms.uXrayMode = shaderUniforms.uXrayMode;
    shader.uniforms.uWaterMap = shaderUniforms.uWaterMap;
    shader.uniforms.uRuneMap = shaderUniforms.uRuneMap;

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWorldPosition;
        varying float vElevNorm;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vec4 customWorldPos = modelMatrix * vec4(transformed, 1.0);
        vWorldPosition = customWorldPos.xyz;
        vElevNorm = transformed.y / ${MAX_RELIEF_HEIGHT.toFixed(2)};`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWorldPosition;
        varying float vElevNorm;
        uniform float uTime;
        uniform vec3 uTorchPos;
        uniform float uTorchActive;
        uniform float uXrayMode;
        uniform sampler2D uWaterMap;
        uniform sampler2D uRuneMap;`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        vec2 waterRoughUv = vec2(
          clamp(vWorldPosition.x / ${MAP_WIDTH.toFixed(2)} + 0.5, 0.0, 1.0),
          clamp(0.5 - vWorldPosition.z / ${MAP_DEPTH.toFixed(2)}, 0.0, 1.0)
        );
        float wMaskRough = texture2D(uWaterMap, waterRoughUv).r;
        roughnessFactor = mix(roughnessFactor, 0.07, smoothstep(0.15, 0.85, wMaskRough));`
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        vec2 waterNormUv = vec2(
          clamp(vWorldPosition.x / ${MAP_WIDTH.toFixed(2)} + 0.5, 0.0, 1.0),
          clamp(0.5 - vWorldPosition.z / ${MAP_DEPTH.toFixed(2)}, 0.0, 1.0)
        );
        float wMaskNorm = texture2D(uWaterMap, waterNormUv).r;
        if (wMaskNorm > 0.1) {
          float w1 = sin(vWorldPosition.x * 28.0 + uTime * 2.2) * cos(vWorldPosition.z * 26.0 - uTime * 1.8);
          float w2 = cos((vWorldPosition.x + vWorldPosition.z) * 42.0 - uTime * 2.9);
          float w3 = sin((vWorldPosition.x * 1.4 - vWorldPosition.z) * 55.0 + uTime * 3.4);
          vec3 wavePerturb = vec3((w1 + w2 * 0.6) * 0.065, (w2 + w3 * 0.6) * 0.065, 0.0);
          normal = normalize(normal + wavePerturb * wMaskNorm);
        }`
      )
      .replace(
        '#include <dithering_fragment>',
        `
        vec2 mapUv = vec2(
          clamp(vWorldPosition.x / ${MAP_WIDTH.toFixed(2)} + 0.5, 0.0, 1.0),
          clamp(0.5 - vWorldPosition.z / ${MAP_DEPTH.toFixed(2)}, 0.0, 1.0)
        );

        float waterMask = texture2D(uWaterMap, mapUv).r;

        // Деликатные картографические изогипсы на суше
        if (waterMask < 0.15) {
          float cMinor = abs(fract(vElevNorm * 18.0 - 0.5) - 0.5) / max(0.0001, fwidth(vElevNorm * 18.0));
          float cMajor = abs(fract(vElevNorm * 4.5 - 0.5) - 0.5) / max(0.0001, fwidth(vElevNorm * 4.5));
          float lineMinor = 1.0 - smoothstep(0.0, 1.2, cMinor);
          float lineMajor = 1.0 - smoothstep(0.0, 1.4, cMajor);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 0.76, lineMinor * 0.18);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.96, 0.77, 0.33), lineMajor * 0.20);
        }

        // Реалистичная водная гладь: каустика, глубокий сапфир, солнечные блики и береговой прибой
        if (waterMask > 0.04) {
          float ripple1 = sin(vWorldPosition.x * 18.0 + uTime * 2.1) * cos(vWorldPosition.z * 21.0 - uTime * 1.7);
          float ripple2 = sin((vWorldPosition.x - vWorldPosition.z) * 34.0 - uTime * 2.6);
          float ripple3 = cos((vWorldPosition.x * 0.7 + vWorldPosition.z * 1.3) * 48.0 + uTime * 3.1);
          float caustics = smoothstep(0.25, 0.95, ripple1 * 0.45 + ripple2 * 0.35 + ripple3 * 0.20 + 0.5);
          float sparkle = pow(max(0.0, ripple1 * 0.5 + ripple3 * 0.5), 6.0);

          // Береговая кромка мелководья и лёгкий прибой
          float shoreEdge = smoothstep(0.05, 0.32, waterMask) * (1.0 - smoothstep(0.32, 0.72, waterMask));
          float surfWave = 0.5 + 0.5 * sin(waterMask * 26.0 - uTime * 2.8);

          vec3 deepSapphire = vec3(0.02, 0.32, 0.56);
          vec3 glacialTurquoise = vec3(0.14, 0.74, 0.92);
          vec3 waterBody = mix(deepSapphire, glacialTurquoise, caustics * 0.65 + (1.0 - waterMask) * 0.35);

          gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 0.55 + waterBody * 0.62, waterMask * 0.85);
          gl_FragColor.rgb += vec3(0.72, 0.95, 1.0) * shoreEdge * surfWave * 0.26;
          gl_FragColor.rgb += vec3(1.0, 0.98, 0.92) * sparkle * waterMask * 0.45;
        }

        // Петроглифы и Луч факела
        float runeMask = texture2D(uRuneMap, mapUv).r;
        float distToTorch = distance(vWorldPosition.xz, uTorchPos.xz);
        float torchSpot = exp(-(distToTorch * distToTorch) / 3.8) * uTorchActive;

        vec3 warmFire = vec3(0.96, 0.72, 0.28);
        gl_FragColor.rgb += warmFire * torchSpot * 0.22;

        float runeVisibility = max(torchSpot * 1.35, uXrayMode * (0.75 + 0.25 * sin(uTime * 2.5 + vWorldPosition.x * 1.5)));
        if (runeMask > 0.1 && runeVisibility > 0.01) {
          vec3 goldRuneColor = vec3(1.05, 0.78, 0.28);
          gl_FragColor.rgb += goldRuneColor * runeMask * runeVisibility * 1.25;
        }

        #include <dithering_fragment>`
      );
  };

  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;
  terrainMesh.name = 'KyrgyzstanTerrain';
  group.add(terrainMesh);

  // Слоистый базальтовый цоколь плакетки
  const borderPoints3D = [];
  const wallPositions = [];
  const wallNormals = [];
  const wallUvs = [];

  const denseBorder = [];
  for (let i = 0; i < KYRGYZSTAN_BORDER.length - 1; i++) {
    const [lon1, lat1] = KYRGYZSTAN_BORDER[i];
    const [lon2, lat2] = KYRGYZSTAN_BORDER[i + 1];
    const steps = 6;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      denseBorder.push([lon1 + (lon2 - lon1) * t, lat1 + (lat2 - lat1) * t]);
    }
  }
  denseBorder.push(denseBorder[0]);

  let cumPerimeter = 0;
  for (let i = 0; i < denseBorder.length; i++) {
    const [lon, lat] = denseBorder[i];
    const { x, z } = geoToWorld(lon, lat);
    const topY = sampleElevation(lon, lat) * MAX_RELIEF_HEIGHT;
    borderPoints3D.push(new THREE.Vector3(x, topY + 0.015, z));
  }

  for (let i = 0; i < borderPoints3D.length - 1; i++) {
    const p1 = borderPoints3D[i];
    const p2 = borderPoints3D[i + 1];
    const b1 = new THREE.Vector3(p1.x, PLINTH_BASE_Y, p1.z);
    const b2 = new THREE.Vector3(p2.x, PLINTH_BASE_Y, p2.z);

    const segLen = p1.distanceTo(p2);
    const u1 = cumPerimeter * 0.25;
    cumPerimeter += segLen;
    const u2 = cumPerimeter * 0.25;

    const edge = new THREE.Vector3().subVectors(p2, p1);
    const normal = new THREE.Vector3(-edge.z, 0, edge.x).normalize();

    wallPositions.push(
      p1.x, p1.y - 0.01, p1.z,
      b1.x, b1.y, b1.z,
      p2.x, p2.y - 0.01, p2.z,
      p2.x, p2.y - 0.01, p2.z,
      b1.x, b1.y, b1.z,
      b2.x, b2.y, b2.z
    );

    for (let k = 0; k < 6; k++) {
      wallNormals.push(normal.x, normal.y, normal.z);
    }
    wallUvs.push(u1, 1, u1, 0, u2, 1, u2, 1, u1, 0, u2, 0);
  }

  const strataCanvas = document.createElement('canvas');
  strataCanvas.width = 512;
  strataCanvas.height = 256;
  const sCtx = strataCanvas.getContext('2d');
  sCtx.fillStyle = '#302218';
  sCtx.fillRect(0, 0, 512, 256);
  for (let y = 0; y < 256; y += 2) {
    const wave = Math.sin(y * 0.18) * 10 + Math.cos(y * 0.07) * 8;
    sCtx.fillStyle = y % 14 === 0 ? 'rgba(224, 165, 98, 0.19)' : `rgba(40, 29, 26, ${0.16 + (y % 8) * 0.04})`;
    sCtx.fillRect(0, y + wave * 0.1, 512, 1.5);
  }
  const strataTex = new THREE.CanvasTexture(strataCanvas);
  strataTex.wrapS = THREE.RepeatWrapping;
  strataTex.wrapT = THREE.ClampToEdgeWrapping;
  strataTex.colorSpace = THREE.SRGBColorSpace;

  const wallGeo = new THREE.BufferGeometry();
  wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
  wallGeo.setAttribute('normal', new THREE.Float32BufferAttribute(wallNormals, 3));
  wallGeo.setAttribute('uv', new THREE.Float32BufferAttribute(wallUvs, 2));

  const wallMat = new THREE.MeshStandardMaterial({
    map: strataTex,
    roughness: 0.74,
    metalness: 0.17,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(wallGeo, wallMat));

  const shape = new THREE.Shape();
  denseBorder.forEach(([lon, lat], idx) => {
    const { x, z } = geoToWorld(lon, lat);
    if (idx === 0) shape.moveTo(x, -z);
    else shape.lineTo(x, -z);
  });
  const baseGeo = new THREE.ShapeGeometry(shape);
  baseGeo.rotateX(-Math.PI / 2);
  const baseMesh = new THREE.Mesh(
    baseGeo,
    new THREE.MeshStandardMaterial({ color: '#281b16', roughness: 0.9, metalness: 0.1, side: THREE.DoubleSide })
  );
  baseMesh.position.y = PLINTH_BASE_Y;
  group.add(baseMesh);

  const borderLineGeo = new THREE.BufferGeometry().setFromPoints(borderPoints3D);
  const borderLineMat = new THREE.LineBasicMaterial({
    color: 0xF6C453,
    transparent: true,
    opacity: 0.85
  });
  group.add(new THREE.Line(borderLineGeo, borderLineMat));

  return { group, terrainMesh, shaderUniforms };
}

// =========================================================================
// МОДУЛЬ 7: УНИКАЛЬНЫЕ ДЕТАЛИЗИРОВАННЫЕ 3D-МОДЕЛИ 9 СВЯТИЛИЩ (SacredSiteModel & ModelLoader)
//           С КАСТОМНЫМИ ПРОЦЕДУРНЫМИ ТЕКСТУРАМИ, INSTANCEDMESH И КЭШИРОВАНИЕМ
// =========================================================================
class SacredSiteModelFactory {
  constructor() {
    this.cache = new Map();
    this.sharedTextures = this._createSharedMaterialsAndTextures();
  }

  _createSharedMaterialsAndTextures() {
    // 1. Детализированная кирпичная кладка Караханидов с геометрическими поясами (Бурана и Манас Ордо)
    const brickCanvas = document.createElement('canvas');
    brickCanvas.width = 512;
    brickCanvas.height = 512;
    const bCtx = brickCanvas.getContext('2d');
    bCtx.fillStyle = '#a3573e';
    bCtx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 16) {
      const bandRow = Math.floor(y / 64);
      if (y % 64 < 16) {
        bCtx.fillStyle = '#d99b38';
        bCtx.fillRect(0, y, 512, 16);
        bCtx.strokeStyle = '#5e2c1d';
        bCtx.lineWidth = 2;
        for (let x = 0; x < 512; x += 32) {
          bCtx.beginPath();
          if (bandRow % 2 === 0) {
            bCtx.moveTo(x + 16, y);
            bCtx.lineTo(x + 32, y + 8);
            bCtx.lineTo(x + 16, y + 16);
            bCtx.lineTo(x, y + 8);
            bCtx.closePath();
          } else {
            bCtx.moveTo(x, y + 16);
            bCtx.lineTo(x + 16, y);
            bCtx.lineTo(x + 32, y + 16);
          }
          bCtx.stroke();
        }
      } else {
        bCtx.fillStyle = 'rgba(42, 20, 13, 0.42)';
        bCtx.fillRect(0, y, 512, 2);
        const offset = ((y / 16) % 2) * 16;
        for (let x = offset; x < 512; x += 32) {
          bCtx.fillStyle = (x + y) % 64 === 0 ? 'rgba(218, 148, 72, 0.25)' : 'rgba(55, 25, 16, 0.22)';
          bCtx.fillRect(x + 2, y + 2, 28, 12);
          bCtx.fillStyle = 'rgba(42, 20, 13, 0.45)';
          bCtx.fillRect(x, y, 2, 16);
        }
      }
    }
    const brickTex = new THREE.CanvasTexture(brickCanvas);
    brickTex.wrapS = THREE.RepeatWrapping;
    brickTex.wrapT = THREE.RepeatWrapping;
    brickTex.colorSpace = THREE.SRGBColorSpace;

    // 2. Текстура тёмного базальта с петроглифами (солнцеголовое божество Тенгри, архары и колесница)
    const petroCanvas = document.createElement('canvas');
    petroCanvas.width = 512;
    petroCanvas.height = 512;
    const pCtx = petroCanvas.getContext('2d');
    pCtx.fillStyle = '#171b26';
    pCtx.fillRect(0, 0, 512, 512);
    // Микрозернистость базальта
    for (let i = 0; i < 1800; i++) {
      const rx = (i * 73) % 512;
      const ry = (i * 137) % 512;
      pCtx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.18)';
      pCtx.fillRect(rx, ry, 2, 2);
    }
    pCtx.strokeStyle = '#F6C453';
    pCtx.lineCap = 'round';
    pCtx.lineJoin = 'round';
    pCtx.lineWidth = 6;
    // Солнцеголовый Тенгри
    pCtx.beginPath();
    pCtx.arc(256, 150, 42, 0, Math.PI * 2);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      pCtx.moveTo(256 + Math.cos(a) * 50, 150 + Math.sin(a) * 50);
      pCtx.lineTo(256 + Math.cos(a) * 76, 150 + Math.sin(a) * 76);
    }
    pCtx.moveTo(256, 192); pCtx.lineTo(256, 305);
    pCtx.moveTo(190, 225); pCtx.lineTo(322, 225);
    pCtx.moveTo(256, 305); pCtx.lineTo(205, 375);
    pCtx.moveTo(256, 305); pCtx.lineTo(307, 375);
    pCtx.stroke();
    // Сакский архар рядом
    pCtx.lineWidth = 5;
    pCtx.beginPath();
    pCtx.moveTo(95, 390); pCtx.lineTo(155, 390);
    pCtx.moveTo(105, 390); pCtx.lineTo(100, 440);
    pCtx.moveTo(145, 390); pCtx.lineTo(150, 440);
    pCtx.moveTo(155, 390); pCtx.lineTo(175, 365);
    pCtx.arc(135, 360, 32, -0.3, Math.PI * 1.1, true);
    pCtx.stroke();

    const petroTex = new THREE.CanvasTexture(petroCanvas);
    petroTex.colorSpace = THREE.SRGBColorSpace;

    // 3. Текстура резного ганча и куфической каллиграфии (Сафид-Булан)
    const ganchCanvas = document.createElement('canvas');
    ganchCanvas.width = 512;
    ganchCanvas.height = 512;
    const gCtx = ganchCanvas.getContext('2d');
    gCtx.fillStyle = '#F2EDE2';
    gCtx.fillRect(0, 0, 512, 512);
    gCtx.strokeStyle = '#C89B3C';
    gCtx.lineWidth = 4;
    gCtx.strokeRect(18, 18, 476, 476);
    gCtx.strokeRect(34, 34, 444, 444);
    for (let i = 0; i < 8; i++) {
      gCtx.save();
      gCtx.translate(256, 256);
      gCtx.rotate((i * Math.PI) / 4);
      gCtx.strokeRect(-110, -110, 220, 220);
      gCtx.restore();
    }
    const ganchTex = new THREE.CanvasTexture(ganchCanvas);
    ganchTex.colorSpace = THREE.SRGBColorSpace;

    // 4. Осадочная слоистая текстура известняка и сланца (Сулайман-Тоо, Таш-Рабат)
    const rockCanvas = document.createElement('canvas');
    rockCanvas.width = 256;
    rockCanvas.height = 256;
    const rkCtx = rockCanvas.getContext('2d');
    rkCtx.fillStyle = '#7d7569';
    rkCtx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 6) {
      rkCtx.fillStyle = y % 18 === 0 ? 'rgba(52, 46, 38, 0.35)' : 'rgba(165, 155, 140, 0.22)';
      rkCtx.fillRect(0, y, 256, 3);
    }
    const rockTex = new THREE.CanvasTexture(rockCanvas);
    rockTex.wrapS = THREE.RepeatWrapping;
    rockTex.wrapT = THREE.RepeatWrapping;
    rockTex.colorSpace = THREE.SRGBColorSpace;

    return {
      goldMat: new THREE.MeshStandardMaterial({
        color: 0xF6C453,
        emissive: 0xD4942A,
        emissiveIntensity: 0.32,
        roughness: 0.28,
        metalness: 0.78
      }),
      limestoneMat: new THREE.MeshStandardMaterial({
        map: rockTex,
        color: 0x8a8173,
        roughness: 0.84,
        metalness: 0.05
      }),
      darkRockMat: new THREE.MeshStandardMaterial({
        map: rockTex,
        color: 0x343a48,
        roughness: 0.76,
        metalness: 0.14
      }),
      petroBasaltMat: new THREE.MeshStandardMaterial({
        color: 0x161a24,
        roughness: 0.30,
        metalness: 0.25,
        emissive: 0xF6C453,
        emissiveMap: petroTex,
        emissiveIntensity: 0.95
      }),
      brickMat: new THREE.MeshStandardMaterial({
        map: brickTex,
        roughness: 0.70,
        metalness: 0.08
      }),
      terracottaMat: new THREE.MeshStandardMaterial({
        color: 0xC86D51,
        roughness: 0.65,
        metalness: 0.12
      }),
      ganchMat: new THREE.MeshStandardMaterial({
        map: ganchTex,
        color: 0xF5F1E8,
        roughness: 0.42,
        metalness: 0.08
      }),
      glassArchMat: new THREE.MeshStandardMaterial({
        color: 0x38BDF8,
        emissive: 0x0EA5E9,
        emissiveIntensity: 0.35,
        roughness: 0.12,
        metalness: 0.65
      }),
      waterMat: new THREE.MeshStandardMaterial({
        color: 0x38BDF8,
        emissive: 0x0EA5E9,
        emissiveIntensity: 0.48,
        roughness: 0.10,
        metalness: 0.2
      }),
      foamMat: new THREE.MeshStandardMaterial({
        color: 0xE0F2FE,
        roughness: 0.35
      }),
      foliageMat: new THREE.MeshStandardMaterial({
        color: 0x2d6a4f,
        roughness: 0.78
      }),
      woodMat: new THREE.MeshStandardMaterial({
        color: 0x5c3d28,
        roughness: 0.85
      }),
      earthPlinthMat: new THREE.MeshStandardMaterial({
        color: 0x45413b,
        roughness: 0.90
      })
    };
  }

  // Создаёт архитектурный цоколь-юбку, плавно врезающуюся в наклонный склон рельефа без зазоров
  _createTerrainFoundation(radiusX, radiusZ, mat) {
    const geo = new THREE.CylinderGeometry(radiusX, radiusX * 1.16, 0.12, 32);
    geo.scale(1, 1, radiusZ / radiusX);
    const mesh = new THREE.Mesh(geo, mat || this.sharedTextures.earthPlinthMat);
    mesh.position.y = -0.045;
    mesh.receiveShadow = true;
    return mesh;
  }

  // Скульптурный скальный массив с естественной слоистостью
  _createSculptedRock(rx, ry, rz, seedOffset, mat) {
    const geo = new THREE.IcosahedronGeometry(1.0, 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i);
      let vy = pos.getY(i);
      let vz = pos.getZ(i);
      if (vy < 0) vy *= 0.22;
      const n = fbm(vx * 2.6 + seedOffset, vz * 2.6 - seedOffset, 3);
      const ridge = 1.0 - Math.abs(vx * 0.42);
      vx *= rx * (0.84 + n * 0.36);
      vy *= ry * (0.78 + n * 0.44) * Math.max(0.42, ridge);
      vz *= rz * (0.84 + n * 0.36);
      pos.setXYZ(i, vx, vy, vz);
    }
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // Антропоморфная скульптура воина-балбала (голова, плечи, руки с ритуальной чашей)
  _createDetailedBalbal(mat) {
    const g = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.056, 0.018), mat);
    torso.position.y = 0.028;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 8), mat);
    head.scale.set(0.95, 1.15, 0.9);
    head.position.y = 0.068;
    const arms = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.010, 0.022), mat);
    arms.position.set(0, 0.036, 0.004);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.004, 0.008, 8), this.sharedTextures.goldMat);
    cup.position.set(0, 0.042, 0.013);
    g.add(torso, head, arms, cup);
    return g;
  }

  // Построение детализированной 3D-модели (tier: 'high' для карты/просмотрщика, 'mid' для средней дистанции)
  buildModel(siteId, tier = 'high') {
    const key = `${siteId}:${tier}`;
    if (this.cache.has(key)) {
      return this.cache.get(key).clone();
    }

    const root = new THREE.Group();
    const M = this.sharedTextures;

    switch (siteId) {
      case 'sulayman-too': {
        // Пятиглавый массив Сулайман-Тоо: Буура-Тоо, Шор-Тоо, Рушан-Тоо, Ээр-Тоо, Кескен-Таш
        root.add(this._createTerrainFoundation(0.45, 0.28, M.limestoneMat));

        const peaks = [
          { x: -0.02, z:  0.00, rx: 0.21, ry: 0.36, rz: 0.14, s: 1.1 }, // Буура-Тоо (главная вершина)
          { x: -0.24, z:  0.03, rx: 0.16, ry: 0.25, rz: 0.12, s: 2.7 }, // Западный гребень
          { x:  0.20, z: -0.02, rx: 0.17, ry: 0.29, rz: 0.12, s: 4.3 }, // Восточный гребень
          { x: -0.12, z: -0.08, rx: 0.13, ry: 0.20, rz: 0.10, s: 6.1 }, // Четвёртая глава
          { x:  0.11, z:  0.08, rx: 0.13, ry: 0.22, rz: 0.10, s: 8.4 }  // Пятая глава
        ];
        peaks.forEach((p) => {
          const rock = this._createSculptedRock(p.rx, p.ry, p.rz, p.s, M.limestoneMat);
          rock.position.set(p.x, 0.01, p.z);
          root.add(rock);
        });

        // Белокаменная мечеть Тахт-и-Сулейман (Домик Бабура) на вершине Буура-Тоо
        const mosqueGroup = new THREE.Group();
        const mPlinth = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.014, 0.068), M.ganchMat);
        const mWall = new THREE.Mesh(new THREE.BoxGeometry(0.066, 0.046, 0.054), M.ganchMat);
        mWall.position.y = 0.028;
        const mPortal = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.052, 0.016), M.terracottaMat);
        mPortal.position.set(0, 0.030, 0.026);
        const mDome = new THREE.Mesh(new THREE.SphereGeometry(0.030, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.goldMat);
        mDome.position.y = 0.051;
        mosqueGroup.add(mPlinth, mWall, mPortal, mDome);
        mosqueGroup.position.set(-0.02, 0.315, 0.0);
        root.add(mosqueGroup);

        // Знаменитый круглый арочный фасад пещерного музея в скале
        const museumFacade = new THREE.Group();
        const archRing = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.008, 10, 24, Math.PI), M.ganchMat);
        const archGlass = new THREE.Mesh(new THREE.CircleGeometry(0.042, 20, 0, Math.PI), M.glassArchMat);
        museumFacade.add(archRing, archGlass);
        museumFacade.position.set(0.16, 0.15, 0.095);
        museumFacade.rotation.y = 0.25;
        root.add(museumFacade);

        if (tier === 'high') {
          // Священные гроты Чакка-Тамар и Тепеункур
          [[-0.08, 0.16, 0.105], [0.05, 0.12, 0.115], [-0.21, 0.11, 0.095]].forEach(([gx, gy, gz]) => {
            const grotto = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), M.darkRockMat);
            grotto.scale.set(1.25, 0.85, 0.65);
            grotto.position.set(gx, gy, gz);
            root.add(grotto);
          });

          // Извилистая каменная лестница паломников с золотыми поручнями
          const pathCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.28, 0.018, 0.16),
            new THREE.Vector3(0.15, 0.09, 0.13),
            new THREE.Vector3(0.05, 0.19, 0.09),
            new THREE.Vector3(-0.01, 0.28, 0.045),
            new THREE.Vector3(-0.02, 0.32, 0.025)
          ]);
          const pathMesh = new THREE.Mesh(new THREE.TubeGeometry(pathCurve, 32, 0.008, 6, false), M.goldMat);
          root.add(pathMesh);
        }
        break;
      }

      case 'saimaluu-tash': {
        // Высокогорный ледниковый цирк с чёрными базальтовыми валунами и петроглифами
        root.add(this._createTerrainFoundation(0.42, 0.36, M.darkRockMat));

        // Моренные гряды ледникового цирка Кугарт
        const rim1 = this._createSculptedRock(0.28, 0.21, 0.13, 3.2, M.limestoneMat);
        rim1.position.set(-0.09, 0.01, -0.20);
        const rim2 = this._createSculptedRock(0.24, 0.18, 0.13, 7.5, M.limestoneMat);
        rim2.position.set(0.15, 0.01, -0.17);
        root.add(rim1, rim2);

        // Монументальный центральный базальтовый алтарь с петроглифами
        const heroBoulders = [
          { x:  0.00, z:  0.01, rx: 0.125, ry: 0.105, rz: 0.095, s: 1.4 },
          { x: -0.15, z:  0.07, rx: 0.095, ry: 0.075, rz: 0.080, s: 4.1 },
          { x:  0.14, z:  0.06, rx: 0.100, ry: 0.080, rz: 0.082, s: 6.8 },
          { x: -0.04, z: -0.09, rx: 0.085, ry: 0.070, rz: 0.075, s: 8.2 }
        ];
        heroBoulders.forEach((b) => {
          const rock = this._createSculptedRock(b.rx, b.ry, b.rz, b.s, M.petroBasaltMat);
          rock.position.set(b.x, 0.01, b.z);
          root.add(rock);
        });

        if (tier === 'high') {
          // Талый ледниковый ручей, петляющий среди камней
          const streamCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.05, 0.012, -0.16),
            new THREE.Vector3(0.02, 0.011, -0.05),
            new THREE.Vector3(-0.06, 0.010, 0.10),
            new THREE.Vector3(0.04, 0.009, 0.26)
          ]);
          const stream = new THREE.Mesh(new THREE.TubeGeometry(streamCurve, 24, 0.016, 6, false), M.waterMat);
          stream.scale.y = 0.25;
          root.add(stream);

          // InstancedMesh для 34 окружающих чёрных базальтовых валунов
          const stoneGeo = new THREE.DodecahedronGeometry(0.030, 1);
          const inst = new THREE.InstancedMesh(stoneGeo, M.darkRockMat, 34);
          const dummy = new THREE.Object3D();
          for (let i = 0; i < 34; i++) {
            const ang = (i / 34) * Math.PI * 2 + (i % 3) * 0.35;
            const rad = 0.13 + ((i * 41) % 100) * 0.0022;
            dummy.position.set(Math.cos(ang) * rad, 0.016, Math.sin(ang) * rad + 0.02);
            dummy.rotation.set(i * 0.5, i * 1.1, i * 0.3);
            dummy.scale.set(1.25, 0.65 + (i % 4) * 0.12, 0.95);
            dummy.updateMatrix();
            inst.setMatrixAt(i, dummy.matrix);
          }
          inst.castShadow = true;
          inst.receiveShadow = true;
          root.add(inst);
        }
        break;
      }

      case 'manas-ordo': {
        // Мемориальный комплекс Манас Ордо: Гумбез Манаса XIV в., аллея балбалов, ворота и гора Кароол-Чоку
        root.add(this._createTerrainFoundation(0.45, 0.38, M.earthPlinthMat));

        // Дозорная гора Кароол-Чоку с обзорной беседкой на вершине
        const karool = this._createSculptedRock(0.24, 0.36, 0.19, 5.2, M.limestoneMat);
        karool.position.set(-0.14, 0.01, -0.15);
        root.add(karool);

        // Мавзолей Гумбез Манаса
        const mausoleum = new THREE.Group();
        const stepBase = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.016, 0.17), M.ganchMat);
        stepBase.position.y = 0.008;

        const mBody = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.135, 0.145), M.brickMat);
        mBody.position.y = 0.082;
        mBody.castShadow = true;

        // Монументальный портал-пештак со стрельчатой нишей
        const portalFrame = new THREE.Mesh(new THREE.BoxGeometry(0.086, 0.168, 0.036), M.terracottaMat);
        portalFrame.position.set(0, 0.095, 0.078);
        const portalNiche = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.115, 0.018), M.darkRockMat);
        portalNiche.position.set(0, 0.072, 0.089);

        // Восьмигранный барабан и 16-гранный ребристый шатровый купол
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.073, 0.038, 16), M.brickMat);
        drum.position.y = 0.168;

        const tentDome = new THREE.Mesh(new THREE.ConeGeometry(0.076, 0.125, 16), M.terracottaMat);
        tentDome.position.y = 0.248;
        tentDome.castShadow = true;

        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 10), M.goldMat);
        finial.position.y = 0.318;

        mausoleum.add(stepBase, mBody, portalFrame, portalNiche, drum, tentDome, finial);
        mausoleum.position.set(0.07, 0.0, 0.01);
        root.add(mausoleum);

        if (tier === 'high') {
          // Церемониальная мраморная аллея и входной портал комплекса
          const walk = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.008, 0.24), M.ganchMat);
          walk.position.set(0.07, 0.006, 0.21);
          const gateArch = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.022), M.brickMat);
          gateArch.position.set(0.07, 0.03, 0.32);
          root.add(walk, gateArch);

          // Кипарисы и каменные балбалы вдоль аллеи
          for (const side of [-1, 1]) {
            for (let k = 0; k < 4; k++) {
              const tree = new THREE.Mesh(new THREE.ConeGeometry(0.020, 0.078, 8), M.foliageMat);
              tree.position.set(0.07 + side * 0.082, 0.042, 0.11 + k * 0.052);
              root.add(tree);
            }
            const balbal = this._createDetailedBalbal(M.limestoneMat);
            balbal.position.set(0.07 + side * 0.045, 0.008, 0.16);
            root.add(balbal);
          }
        }
        break;
      }

      case 'cholpon-ata': {
        // Каменный сад под открытым небом между горами Кунгей Ала-Тоо и озером Иссык-Куль
        root.add(this._createTerrainFoundation(0.42, 0.36, M.earthPlinthMat));

        // Крупные ледниковые валуны с гравировкой сакского звериного стиля
        const boulders = [
          { x:  0.00, z:  0.00, rx: 0.115, ry: 0.090, rz: 0.085, s: 2.1 },
          { x: -0.15, z: -0.06, rx: 0.088, ry: 0.072, rz: 0.075, s: 4.9 },
          { x:  0.14, z:  0.05, rx: 0.096, ry: 0.076, rz: 0.070, s: 7.3 },
          { x: -0.05, z:  0.13, rx: 0.082, ry: 0.066, rz: 0.070, s: 9.1 }
        ];
        boulders.forEach((b) => {
          const stone = this._createSculptedRock(b.rx, b.ry, b.rz, b.s, M.petroBasaltMat);
          stone.position.set(b.x, 0.01, b.z);
          root.add(stone);
        });

        if (tier === 'high') {
          // Двойной сакский каменный круг (астрономический кромлех) из 16 камней
          const ringStoneGeo = new THREE.DodecahedronGeometry(0.023, 1);
          const inst = new THREE.InstancedMesh(ringStoneGeo, M.limestoneMat, 16);
          const dummy = new THREE.Object3D();
          for (let i = 0; i < 16; i++) {
            const ang = (i / 16) * Math.PI * 2;
            dummy.position.set(Math.cos(ang) * 0.24, 0.018, Math.sin(ang) * 0.20);
            dummy.rotation.set(0.2, ang, 0.1);
            dummy.scale.set(1.15, 0.9, 0.9);
            dummy.updateMatrix();
            inst.setMatrixAt(i, dummy.matrix);
          }
          inst.castShadow = true;
          root.add(inst);

          // Древний сакский балбал-страж у входа в святилище
          const guardian = this._createDetailedBalbal(M.limestoneMat);
          guardian.position.set(0.18, 0.008, 0.18);
          guardian.rotation.y = -0.4;
          root.add(guardian);
        }
        break;
      }

      case 'manjyly-ata': {
        // Лабиринт терракотово-охристых глиняных холмов и 12 целебных родников
        root.add(this._createTerrainFoundation(0.42, 0.36, M.terracottaMat));

        // Главный священный источник и каменный колодец
        const springPool = new THREE.Mesh(new THREE.CircleGeometry(0.115, 28), M.waterMat);
        springPool.rotation.x = -Math.PI / 2;
        springPool.position.y = 0.015;
        const wellRim = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.012, 8, 28), M.limestoneMat);
        wellRim.rotation.x = Math.PI / 2;
        wellRim.position.y = 0.016;
        root.add(springPool, wellRim);

        // Охристые и терракотовые холмы вокруг каньона
        const hills = [
          { x: -0.17, z: -0.11, rx: 0.14, ry: 0.18, rz: 0.11, s: 1.8 },
          { x:  0.17, z: -0.09, rx: 0.15, ry: 0.20, rz: 0.12, s: 3.4 },
          { x: -0.15, z:  0.13, rx: 0.13, ry: 0.15, rz: 0.11, s: 5.7 },
          { x:  0.16, z:  0.12, rx: 0.14, ry: 0.17, rz: 0.11, s: 8.2 }
        ];
        hills.forEach((h) => {
          const hill = this._createSculptedRock(h.rx, h.ry, h.rz, h.s, M.terracottaMat);
          hill.position.set(h.x, 0.008, h.z);
          root.add(hill);
        });

        if (tier === 'high') {
          // Священные плакучие ивы с белыми и золотыми лентами чүпүрөк у родников
          [[-0.08, 0.06], [0.09, -0.05], [0.02, 0.11]].forEach(([tx, tz]) => {
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.015, 0.085, 7), M.woodMat);
            trunk.position.set(tx, 0.042, tz);
            const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.044, 1), M.foliageMat);
            crown.position.set(tx, 0.088, tz);
            const ribbonWhite = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.004, 6, 16), M.ganchMat);
            ribbonWhite.rotation.x = Math.PI / 2.3;
            ribbonWhite.position.set(tx, 0.076, tz);
            const ribbonGold = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.003, 6, 16), M.goldMat);
            ribbonGold.rotation.y = Math.PI / 2.2;
            ribbonGold.position.set(tx, 0.080, tz);
            root.add(trunk, crown, ribbonWhite, ribbonGold);
          });
        }
        break;
      }

      case 'burana-tower': {
        // Аутентичный минарет Бурана XI века: квадратный стилобат, восьмигранный цоколь с нишами,
        // сужающийся ствол с 6 орнаментальными поясами, приставная лестница и сад балбалов
        root.add(this._createTerrainFoundation(0.44, 0.38, M.earthPlinthMat));

        // Квадратный каменный подиум
        const podium = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.022, 0.21), M.limestoneMat);
        podium.position.y = 0.011;
        podium.receiveShadow = true;

        // Восьмигранный кирпичный цоколь
        const octBase = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.092, 0.068, 8), M.brickMat);
        octBase.position.y = 0.055;
        octBase.castShadow = true;

        // Стрельчатые ниши на гранях восьмерика
        for (let n = 0; n < 8; n++) {
          const ang = (n / 8) * Math.PI * 2;
          const niche = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.042, 0.012), M.darkRockMat);
          niche.position.set(Math.sin(ang) * 0.082, 0.055, Math.cos(ang) * 0.082);
          niche.rotation.y = ang;
          root.add(niche);
        }

        // Сужающийся цилиндрический ствол башни Бурана
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.069, 0.32, 24), M.brickMat);
        shaft.position.y = 0.245;
        shaft.castShadow = true;

        // 6 рельефных орнаментальных кирпичных поясов
        [0.12, 0.175, 0.23, 0.285, 0.34, 0.385].forEach((by, idx) => {
          const r = 0.066 - idx * 0.0042;
          const band = new THREE.Mesh(new THREE.TorusGeometry(r, 0.0045, 8, 28), M.goldMat);
          band.rotation.x = Math.PI / 2;
          band.position.y = by;
          root.add(band);
        });

        // Верхний парапет смотровой площадки
        const crownRim = new THREE.Mesh(new THREE.TorusGeometry(0.046, 0.006, 8, 24), M.brickMat);
        crownRim.rotation.x = Math.PI / 2;
        crownRim.position.y = 0.405;

        // Внешняя приставная башня-лестница ко входу на высоте 6.5 м
        const stairTower = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.145, 0.042), M.terracottaMat);
        stairTower.position.set(0.072, 0.09, 0);

        root.add(podium, octBase, shaft, crownRim, stairTower);

        if (tier === 'high') {
          // Сад каменных воинов-балбалов вокруг башни (12 детализированных изваяний с чашами)
          for (let i = 0; i < 12; i++) {
            const row = Math.floor(i / 6);
            const col = i % 6;
            const balbal = this._createDetailedBalbal(M.limestoneMat);
            balbal.position.set(-0.18 + col * 0.072, 0.008, 0.16 + row * 0.075);
            balbal.rotation.y = ((i % 3) - 1) * 0.18;
            const sc = 0.85 + (i % 3) * 0.14;
            balbal.scale.set(sc, sc, sc);
            root.add(balbal);
          }
        }
        break;
      }

      case 'tash-rabat': {
        // Каменный караван-сарай Таш-Рабат XV в. в суровом ущелье Кара-Коюн
        root.add(this._createTerrainFoundation(0.45, 0.38, M.darkRockMat));

        // Скалистые склоны ущелья Кара-Коюн по бокам
        const gorgeL = this._createSculptedRock(0.15, 0.26, 0.25, 2.3, M.limestoneMat);
        gorgeL.position.set(-0.26, 0.01, -0.02);
        const gorgeR = this._createSculptedRock(0.15, 0.24, 0.25, 6.7, M.limestoneMat);
        gorgeR.position.set(0.26, 0.01, -0.02);
        root.add(gorgeL, gorgeR);

        // Монументальный каменный корпус из тёмного сланца
        const mainHall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.105, 0.22), M.darkRockMat);
        mainHall.position.set(0, 0.055, 0);
        mainHall.castShadow = true;

        // Входной портал со стрельчатой аркой и двумя угловыми минаретоподобными башенками
        const portal = new THREE.Mesh(new THREE.BoxGeometry(0.092, 0.148, 0.052), M.darkRockMat);
        portal.position.set(0, 0.078, 0.118);
        const portalArch = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.056, 14), M.goldMat);
        portalArch.rotation.x = Math.PI / 2;
        portalArch.position.set(0, 0.068, 0.122);

        const turretL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.020, 0.16, 12), M.darkRockMat);
        turretL.position.set(-0.125, 0.082, 0.11);
        const turretR = turretL.clone();
        turretR.position.set(0.125, 0.082, 0.11);

        // Центральный сферический купол главного зала
        const centerDome = new THREE.Mesh(
          new THREE.SphereGeometry(0.072, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
          M.goldMat
        );
        centerDome.position.set(0, 0.108, -0.015);

        root.add(mainHall, portal, portalArch, turretL, turretR, centerDome);

        if (tier === 'high') {
          // Малые купола боковых келий на плоской кровле
          [
            [-0.08, -0.06], [0.08, -0.06],
            [-0.08,  0.04], [0.08,  0.04],
            [ 0.00, -0.08], [0.00,  0.06]
          ].forEach(([dx, dz]) => {
            const subDome = new THREE.Mesh(
              new THREE.SphereGeometry(0.028, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
              M.limestoneMat
            );
            subDome.position.set(dx, 0.108, dz);
            root.add(subDome);
          });
        }
        break;
      }

      case 'arslanbob': {
        // Скальный уступ с каскадным водопадом, гротом отшельника и реликтовым ореховым лесом
        root.add(this._createTerrainFoundation(0.45, 0.38, M.foliageMat));

        // Многоуровневый скальный массив
        const cliff = this._createSculptedRock(0.26, 0.31, 0.15, 3.9, M.limestoneMat);
        cliff.position.set(0, 0.01, -0.10);
        const sideCliff = this._createSculptedRock(0.16, 0.22, 0.13, 6.2, M.limestoneMat);
        sideCliff.position.set(-0.18, 0.01, -0.06);
        root.add(cliff, sideCliff);

        // Каскад бирюзового водопада с пенным гребнем и чашей у подножия
        const cascade = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.26, 0.022), M.waterMat);
        cascade.position.set(0, 0.14, 0.018);
        const foamStreak = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.25, 0.026), M.foamMat);
        foamStreak.position.set(0, 0.14, 0.020);

        const pool = new THREE.Mesh(new THREE.CircleGeometry(0.095, 24), M.waterMat);
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(0, 0.015, 0.07);
        const foamRing = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 8, 20), M.foamMat);
        foamRing.rotation.x = Math.PI / 2;
        foamRing.position.set(0, 0.017, 0.05);

        root.add(cascade, foamStreak, pool, foamRing);

        // Вековые деревья реликтового грецкого ореха (стволы + раскидистые кроны)
        const treeCount = tier === 'high' ? 16 : 8;
        for (let i = 0; i < treeCount; i++) {
          const ang = (i / treeCount) * Math.PI * 1.45 - 0.22;
          const rad = 0.15 + (i % 3) * 0.068;
          const tx = Math.cos(ang) * rad;
          const tz = Math.sin(ang) * rad + 0.04;
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.014, 0.055, 6), M.woodMat);
          trunk.position.set(tx, 0.028, tz);
          const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.048, 1), M.foliageMat);
          crown.scale.set(1.2, 0.85, 1.2);
          crown.position.set(tx, 0.068 + (i % 2) * 0.012, tz);
          crown.castShadow = true;
          root.add(trunk, crown);
        }
        break;
      }

      case 'safid-bulan':
      default: {
        // Белоснежный мавзолей Шах-Фазиль с 27-метровым ребристым конусовидным куполом
        root.add(this._createTerrainFoundation(0.44, 0.36, M.earthPlinthMat));

        // Терраса и кубический объём мавзолея с резным ганчевым декором
        const terrace = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.018, 0.22), M.ganchMat);
        terrace.position.y = 0.009;

        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.165, 0.155, 0.165), M.ganchMat);
        cube.position.set(0, 0.095, 0);
        cube.castShadow = true;

        // Стрельчатый входной портал
        const portal = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.125, 0.025), M.goldMat);
        portal.position.set(0, 0.08, 0.085);
        const archDoor = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.088, 0.030), M.darkRockMat);
        archDoor.position.set(0, 0.062, 0.086);

        // Высокий гранёный барабан
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.074, 0.065, 16), M.ganchMat);
        drum.position.set(0, 0.205, 0);

        // Конусовидный ребристый 27-метровый купол с золотым навершием
        const coneDome = new THREE.Mesh(new THREE.ConeGeometry(0.072, 0.175, 16), M.goldMat);
        coneDome.position.set(0, 0.325, 0);
        coneDome.castShadow = true;

        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.006, 0.045, 8), M.goldMat);
        spire.position.set(0, 0.43, 0);

        root.add(terrace, cube, portal, archDoor, drum, coneDome, spire);

        if (tier === 'high') {
          // Священная скала Аламбердар и мемориальный двор мечети
          const sacredRock = this._createSculptedRock(0.095, 0.12, 0.085, 4.5, M.limestoneMat);
          sacredRock.position.set(-0.18, 0.01, -0.05);
          const courtyard = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.065, 0.125), M.ganchMat);
          courtyard.position.set(0.18, 0.04, 0.04);
          const courtDome = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.goldMat);
          courtDome.position.set(0.18, 0.072, 0.04);
          root.add(sacredRock, courtyard, courtDome);
        }
        break;
      }
    }

    // Гарантируем корректный frustum culling для всех дочерних мешей
    root.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = true;
        if (child.geometry && !child.geometry.boundingSphere) {
          child.geometry.computeBoundingSphere();
        }
      }
    });

    this.cache.set(key, root);
    return root.clone();
  }
}

const siteModelFactory = new SacredSiteModelFactory();

// =========================================================================
// МОДУЛЬ 8: ПРОСМОТРЩИК 3D-АРТЕФАКТОВ (ArtifactViewer — 360°, зум, сброс)
// =========================================================================
class ArtifactViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1.8, 0.05, 30);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    const hemi = new THREE.HemisphereLight(0xfff5e0, 0x1a2238, 1.35);
    const keyLight = new THREE.DirectionalLight(0xFFE6A3, 2.3);
    keyLight.position.set(2.5, 4.0, 3.0);
    const rimLight = new THREE.DirectionalLight(0x38BDF8, 0.9);
    rimLight.position.set(-3.0, 1.5, -2.5);
    this.scene.add(hemi, keyLight, rimLight);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.54, 0.60, 0.05, 36),
      new THREE.MeshStandardMaterial({ color: 0x0d1220, roughness: 0.35, metalness: 0.7 })
    );
    pedestal.position.y = -0.34;
    const goldRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.008, 8, 48),
      new THREE.MeshStandardMaterial({ color: 0xF6C453, emissive: 0xD4942A, emissiveIntensity: 0.45 })
    );
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = -0.315;
    this.scene.add(pedestal, goldRing);

    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    this.defaultSpherical = new THREE.Spherical(1.42, Math.PI * 0.36, 0.45);
    this.spherical = this.defaultSpherical.clone();
    this.autoRotate = true;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;

    this._bindEvents();
    this._updateCameraPosition();
  }

  _bindEvents() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.spherical.theta -= dx * 0.012;
      this.spherical.phi = Math.max(0.22, Math.min(Math.PI * 0.48, this.spherical.phi - dy * 0.01));
      this._updateCameraPosition();
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.spherical.radius = Math.max(0.75, Math.min(2.6, this.spherical.radius + e.deltaY * 0.0012));
      this._updateCameraPosition();
    }, { passive: false });

    this.canvas.addEventListener('dblclick', () => {
      this.resetView();
    });
  }

  _updateCameraPosition() {
    this.camera.position.setFromSpherical(this.spherical);
    this.camera.lookAt(0, -0.04, 0);
  }

  resetView() {
    this.spherical.copy(this.defaultSpherical);
    this.autoRotate = true;
    this._updateCameraPosition();
  }

  setModel(siteId) {
    while (this.pivot.children.length > 0) {
      this.pivot.remove(this.pivot.children[0]);
    }
    const model = siteModelFactory.buildModel(siteId, 'high');
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 0.86 / maxDim;
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -box.min.y * scale - 0.31, -center.z * scale);

    this.pivot.add(model);
    this.resetView();
  }

  render() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (w === 0 || h === 0) return;

    if (this.canvas.width !== Math.round(w * this.renderer.getPixelRatio()) ||
        this.canvas.height !== Math.round(h * this.renderer.getPixelRatio())) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    if (this.autoRotate && !this.isDragging) {
      this.spherical.theta += 0.0055;
      this._updateCameraPosition();
    }
    this.renderer.render(this.scene, this.camera);
  }
}

const sideArtifactViewer = new ArtifactViewer(document.getElementById('artifact-canvas'));
const modalArtifactViewer = new ArtifactViewer(document.getElementById('artifact-modal-canvas'));
const artifactModal = document.getElementById('artifact-modal');
let isArtifactModalOpen = false;

document.getElementById('btn-artifact-reset').addEventListener('click', () => sideArtifactViewer.resetView());
document.getElementById('btn-modal-reset').addEventListener('click', () => modalArtifactViewer.resetView());

document.getElementById('btn-artifact-fullscreen').addEventListener('click', () => {
  if (activeSiteIndex < 0) return;
  const site = SACRED_SITES[activeSiteIndex];
  document.getElementById('modal-artifact-title').textContent = site.artifactTitle;
  document.getElementById('modal-artifact-caption').textContent = site.artifactCaption;
  modalArtifactViewer.setModel(site.id);
  artifactModal.classList.remove('hidden');
  isArtifactModalOpen = true;
});

document.getElementById('btn-modal-close').addEventListener('click', () => {
  artifactModal.classList.add('hidden');
  isArtifactModalOpen = false;
});

// =========================================================================
// МОДУЛЬ 9: ВКЛАДКИ «ПРАВИЛА ПОСЕЩЕНИЯ» (SacredSiteRules)
// =========================================================================
const tabAllowed = document.getElementById('tab-rules-allowed');
const tabForbidden = document.getElementById('tab-rules-forbidden');
const listAllowed = document.getElementById('rules-allowed-list');
const listForbidden = document.getElementById('rules-forbidden-list');

function setRulesTab(mode) {
  if (mode === 'allowed') {
    listAllowed.classList.remove('hidden');
    listForbidden.classList.add('hidden');
    tabAllowed.className = 'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    tabForbidden.className = 'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 text-lunar/65 hover:text-rose-300 border border-transparent';
  } else {
    listAllowed.classList.add('hidden');
    listForbidden.classList.remove('hidden');
    tabForbidden.className = 'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40';
    tabAllowed.className = 'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 text-lunar/65 hover:text-emerald-300 border border-transparent';
  }
}

tabAllowed.addEventListener('click', () => setRulesTab('allowed'));
tabForbidden.addEventListener('click', () => setRulesTab('forbidden'));

function renderSiteRules(site) {
  const allowedItems = [...(site.siteRules?.allowed || []), ...GENERAL_RULES.allowed];
  const forbiddenItems = [...(site.siteRules?.forbidden || []), ...GENERAL_RULES.forbidden];

  listAllowed.innerHTML = allowedItems.map((txt, idx) => {
    const isSpecific = idx < (site.siteRules?.allowed?.length || 0);
    return `
      <li class="flex items-start gap-2 leading-snug ${isSpecific ? 'text-emerald-200 font-medium' : 'text-lunar/80'}">
        <span class="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
        <span>${txt}</span>
      </li>
    `;
  }).join('');

  listForbidden.innerHTML = forbiddenItems.map((txt, idx) => {
    const isSpecific = idx < (site.siteRules?.forbidden?.length || 0);
    return `
      <li class="flex items-start gap-2 leading-snug ${isSpecific ? 'text-rose-200 font-medium' : 'text-lunar/80'}">
        <span class="w-4 h-4 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">✕</span>
        <span>${txt}</span>
      </li>
    `;
  }).join('');

  setRulesTab('allowed');
}

// =========================================================================
// МОДУЛЬ 10: ГЕНЕРАТИВНЫЙ ЗВУК ГОР И ОБЕРТОНЫ КОМУЗА (Web Audio API)
// =========================================================================
class MountainSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0;
    this.masterGain.connect(this.ctx.destination);

    // Процедурный эмбиент высокогорного ветра Тянь-Шаня
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      output[i] = (b0 + b1 + b2) * 0.45;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 340;
    windFilter.Q.value = 2.4;

    const windLfo = this.ctx.createOscillator();
    windLfo.frequency.value = 0.11;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 160;
    windLfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.28;

    whiteNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);

    whiteNoise.start();
    windLfo.start();
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    this.enabled = !this.enabled;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.enabled ? 0.55 : 0.0, now + 0.8);
    return this.enabled;
  }

  playKomuzPluck(baseFreq = 293.66) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const ratios = [1, 1.5, 2.0];

    ratios.forEach((ratio, idx) => {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now + idx * 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now + idx * 0.08);
      filter.frequency.exponentialRampToValueAtTime(320, now + idx * 0.08 + 2.2);

      noteGain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      noteGain.gain.linearRampToValueAtTime(0.14 / (idx + 1), now + idx * 0.08 + 0.025);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.6);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.7);
    });
  }
}

// =========================================================================
// МОДУЛЬ 11: ИНИЦИАЛИЗАЦИЯ ГЛАВНОЙ 3D-СЦЕНЫ, СТОЛА МАКЕТА, КАМЕРЫ И LOD-СВЯТИЛИЩ
// =========================================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
if (!embedded) scene.background = new THREE.Color('#151923');

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(sacredFraming.fov(aspect), aspect, 0.04, 220);
const mapOrigin = new THREE.Vector3(...sacredFraming.origin);
const toMapSpace = point => new THREE.Vector3(...point).sub(mapOrigin).divideScalar(sacredFraming.scale);
const OVERVIEW_CAM_POS = toMapSpace(sacredFraming.camera);
const OVERVIEW_TARGET = toMapSpace(sacredFraming.target);
camera.position.copy(OVERVIEW_CAM_POS);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: embedded, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, currentGraphicsPreset.pixelRatio));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .98;
renderer.shadowMap.enabled = currentGraphicsPreset.shadows;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 0.72;
controls.zoomSpeed = 0.85;
controls.panSpeed = 0.75;
controls.minDistance = 0.95;
controls.maxDistance = 30.0;
controls.maxPolarAngle = Math.PI * 0.46;
controls.target.copy(OVERVIEW_TARGET);

// Студийное музейное освещение для макета на столе
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd8dce6, 1.45);
scene.add(hemiLight);

const sunMoonLight = new THREE.DirectionalLight(0xfff8ee, 2.35);
sunMoonLight.position.set(-10, 19, 11);
sunMoonLight.castShadow = true;
sunMoonLight.shadow.mapSize.width = currentGraphicsPreset.shadowMapSize;
sunMoonLight.shadow.mapSize.height = currentGraphicsPreset.shadowMapSize;
sunMoonLight.shadow.camera.near = 2;
sunMoonLight.shadow.camera.far = 48;
const dShadow = 16;
sunMoonLight.shadow.camera.left = -dShadow;
sunMoonLight.shadow.camera.right = dShadow;
sunMoonLight.shadow.camera.top = dShadow;
sunMoonLight.shadow.camera.bottom = -dShadow;
sunMoonLight.shadow.bias = -0.0004;
scene.add(sunMoonLight);

const warmRimLight = new THREE.DirectionalLight(0xF6C453, 0.55);
warmRimLight.position.set(12, 9, -10);
scene.add(warmRimLight);

const torchLight = new THREE.PointLight(0xF6C453, 2.6, 6.5, 1.6);
torchLight.position.set(0, 2.2, 0);
scene.add(torchLight);

// Инициализация рельефа
const currentTextures = generateProceduralTextures(currentGraphicsPreset.texW, currentGraphicsPreset.texH);
const plaqueData = buildKyrgyzstanPlaque(currentTextures, currentGraphicsPreset.segX, currentGraphicsPreset.segZ);
scene.add(plaqueData.group);

// =========================================================================
// МОДУЛЬ 12: МЕТКИ СВЯТИЛИЩ
// =========================================================================
const beaconsGroup = new THREE.Group();
scene.add(beaconsGroup);

const leyLinesGroup = new THREE.Group();
leyLinesGroup.visible = false;
scene.add(leyLinesGroup);

const badgesLayer = document.getElementById('badges-layer');
const siteObjects = [];

SACRED_SITES.forEach((site, idx) => {
  const { x, z } = geoToWorld(site.lon, site.lat);
  const y = sampleElevation(site.lon, site.lat) * MAX_RELIEF_HEIGHT;
  const pos3D = new THREE.Vector3(x, y, z);

  const holder = new THREE.Group();
  holder.position.copy(pos3D);

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xF6C453 })
  );
  marker.position.y = 0.09;
  holder.add(marker);

  // Невидимая сфера-хитбокс для клика
  const hitMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 12, 12),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitMesh.position.y = 0.22;
  hitMesh.userData = { siteIndex: idx };
  holder.add(hitMesh);

  beaconsGroup.add(holder);

  // Выносной бейдж в HTML HUD
  const badgeEl = document.createElement('button');
  badgeEl.type = 'button';
  badgeEl.setAttribute('aria-label', site.nameRu);
  badgeEl.setAttribute('aria-pressed', 'false');
  badgeEl.className = 'site-badge';
  badgeEl.innerHTML = `
    <span>${site.num}</span>
    <div class="leading-tight">
      <div class="text-[11px] sm:text-xs font-semibold text-lunar whitespace-nowrap">${site.nameRu}</div>
      <div class="text-[9px] font-cinzel tracking-wider text-gold/70 uppercase whitespace-nowrap">${site.nameEn}</div>
    </div>
  `;
  badgeEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (activeSiteIndex === idx) closeSiteCard(true);
    else selectSite(idx, true);
  });
  badgesLayer.appendChild(badgeEl);

  siteObjects.push({
    pos3D,
    marker,
    badgeEl,
    hitMesh
  });
});

// Энергетические лей-линии («Рентген рун»)
const leyConnections = [
  [8, 0], [0, 7], [7, 1], [1, 6], [6, 4], [4, 3], [3, 5], [5, 2], [2, 8], [1, 5]
];
const leyPulses = [];
leyConnections.forEach(([aIdx, bIdx]) => {
  const pA = siteObjects[aIdx].pos3D.clone().add(new THREE.Vector3(0, 0.08, 0));
  const pB = siteObjects[bIdx].pos3D.clone().add(new THREE.Vector3(0, 0.08, 0));
  const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
  mid.y += pA.distanceTo(pB) * 0.18 + 0.35;

  const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
  const pts = curve.getPoints(48);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
  leyLinesGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
    color: 0xF6C453, transparent: true, opacity: 0.75
  })));

  const pulseMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xFFE699 })
  );
  leyLinesGroup.add(pulseMesh);
  leyPulses.push({ curve, mesh: pulseMesh, offset: Math.random() });
});

// =========================================================================
// МОДУЛЬ 13: УПРАВЛЕНИЕ КАМЕРОЙ, КАРТОЧКОЙ И РЕЖИМАМИ (CameraController)
// =========================================================================
const soundEngine = new MountainSoundEngine();
let activeSiteIndex = -1;
let xrayEnabled = false;
let tourActive = false;
let tourInterval = null;
let tourStep = 0;

let isCameraFlying = false;
const targetCamPos = OVERVIEW_CAM_POS.clone();
const targetLookAt = OVERVIEW_TARGET.clone();
const focusDistance = OVERVIEW_CAM_POS.clone().sub(OVERVIEW_TARGET).multiplyScalar(0.43);
const viewOffset = new THREE.Vector2();

const sitesDock = document.getElementById('sites-dock');
const dockButtons = [];

SACRED_SITES.forEach((site, idx) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-gold/20 bg-obsidian/65 hover:border-gold/60 text-left transition-all flex items-center gap-2 shrink-0 group active:scale-95';
  btn.innerHTML = `
    <span class="dock-num text-gold font-cinzel text-xs font-bold">
      ${site.num}
    </span>
    <span class="dock-title text-[11px] sm:text-xs font-medium text-lunar/85 group-hover:text-gold whitespace-nowrap transition-colors">
      ${site.nameRu}
    </span>
  `;
  btn.addEventListener('click', () => {
    if (activeSiteIndex === idx) closeSiteCard(true);
    else selectSite(idx, true);
  });
  sitesDock.appendChild(btn);
  dockButtons.push(btn);
});

function updateDockHighlight() {
  dockButtons.forEach((btn, i) => {
    const isSelected = i === activeSiteIndex;
    const titleEl = btn.querySelector('.dock-title');
    if (isSelected) {
      btn.classList.add('border-gold', 'bg-gold/15', 'gold-glow-active');
      btn.classList.remove('border-gold/20', 'bg-obsidian/65');
      titleEl.classList.add('text-gold', 'font-semibold');
    } else {
      btn.classList.remove('border-gold', 'bg-gold/15', 'gold-glow-active');
      btn.classList.add('border-gold/20', 'bg-obsidian/65');
      titleEl.classList.remove('text-gold', 'font-semibold');
    }
  });

  siteObjects.forEach((obj, i) => {
    const selected = i === activeSiteIndex;
    obj.badgeEl.setAttribute('aria-pressed', String(selected));
    obj.marker.material.color.setHex(selected ? 0xffe8a1 : 0xf6c453);
    obj.marker.scale.setScalar(selected ? 1.35 : 0.85);
  });
}

const siteCard = document.getElementById('site-card');

function openSiteCard(idx) {
  const site = SACRED_SITES[idx];
  document.getElementById('card-number').textContent = site.num;
  document.getElementById('card-region').textContent = site.region;
  document.getElementById('card-title-ru').textContent = site.nameRu;
  document.getElementById('card-title-en').textContent = site.nameEn;
  document.getElementById('artifact-title').textContent = site.artifactTitle;
  document.getElementById('artifact-caption').textContent = site.artifactCaption;
  document.getElementById('card-hook').textContent = site.hook;
  document.getElementById('card-era').textContent = site.era;
  document.getElementById('card-elevation').textContent = site.elevation;
  document.getElementById('card-description').textContent = site.description;
  document.getElementById('card-coords').textContent = `${site.lat.toFixed(3)}°N, ${site.lon.toFixed(3)}°E`;

  sideArtifactViewer.setModel(site.id);
  renderSiteRules(site);

  siteCard.classList.remove('translate-x-[120%]', 'opacity-0', 'pointer-events-none');
  siteCard.classList.add('translate-x-0', 'opacity-100', 'pointer-events-auto');
}

function closeSiteCard(returnToOverview = true) {
  if (tourActive) stopAutoTour();
  activeSiteIndex = -1;
  updateDockHighlight();
  siteCard.classList.add('translate-x-[120%]', 'opacity-0', 'pointer-events-none');
  siteCard.classList.remove('translate-x-0', 'opacity-100', 'pointer-events-auto');

  if (returnToOverview) {
    targetLookAt.copy(OVERVIEW_TARGET);
    targetCamPos.copy(OVERVIEW_CAM_POS);
    isCameraFlying = true;
  }
}

function selectSite(idx, stopTour = false) {
  if (stopTour && tourActive) stopAutoTour();
  activeSiteIndex = idx;
  updateDockHighlight();
  openSiteCard(idx);

  targetLookAt.copy(siteObjects[idx].pos3D);
  targetLookAt.y += 0.1;
  targetCamPos.copy(targetLookAt).add(focusDistance);
  isCameraFlying = true;
  soundEngine.playKomuzPluck(SACRED_SITES[idx].freq);
}

function resetMapView() {
  if (isMap2DOpen) toggleMap2D(false);
  closeSiteCard(true);
}
document.getElementById('btn-overview').addEventListener('click', resetMapView);
document.getElementById('compass-reset').addEventListener('click', resetMapView);

// Кнопка «Рентген рун»
const btnXray = document.getElementById('btn-xray');
const xrayBadge = document.getElementById('xray-badge');
btnXray.addEventListener('click', () => {
  xrayEnabled = !xrayEnabled;
  leyLinesGroup.visible = xrayEnabled;
  if (xrayEnabled) {
    btnXray.classList.add('border-gold', 'text-gold', 'gold-glow-active');
    xrayBadge.classList.remove('bg-lunar/30');
    xrayBadge.classList.add('bg-gold', 'shadow-[0_0_8px_#F6C453]');
  } else {
    btnXray.classList.remove('border-gold', 'text-gold', 'gold-glow-active');
    xrayBadge.classList.add('bg-lunar/30');
    xrayBadge.classList.remove('bg-gold', 'shadow-[0_0_8px_#F6C453]');
  }
});

// Кнопка «Авто-экспедиция»
const btnTour = document.getElementById('btn-tour');
const tourLabel = document.getElementById('tour-label');
const tourProgressBar = document.getElementById('tour-progress-bar');
const tourStatusText = document.getElementById('tour-status-text');
const tourProgressFill = document.getElementById('tour-progress-fill');

function updateTourUI(step) {
  const site = SACRED_SITES[step];
  tourStatusText.textContent = `Экспедиция: ${site.num} / ${SACRED_SITES.length} — ${site.nameRu}`;
  tourProgressFill.style.width = `${((step + 1) / SACRED_SITES.length) * 100}%`;
}

function startAutoTour() {
  if (isMap2DOpen) toggleMap2D(false);
  tourActive = true;
  tourStep = activeSiteIndex >= 0 ? activeSiteIndex : 0;
  btnTour.classList.add('border-gold', 'text-gold', 'gold-glow-active');
  tourLabel.textContent = 'Экспедиция идёт...';
  tourProgressBar.classList.remove('hidden');

  selectSite(tourStep, false);
  updateTourUI(tourStep);

  tourInterval = setInterval(() => {
    if (!tourActive) return;
    tourStep++;
    if (tourStep >= SACRED_SITES.length) {
      stopAutoTour();
      closeSiteCard(true);
      return;
    }
    selectSite(tourStep, false);
    updateTourUI(tourStep);
  }, 6500);
}

function stopAutoTour() {
  tourActive = false;
  if (tourInterval) {
    clearInterval(tourInterval);
    tourInterval = null;
  }
  btnTour.classList.remove('border-gold', 'text-gold', 'gold-glow-active');
  tourLabel.textContent = 'Авто-экспедиция';
  tourProgressBar.classList.add('hidden');
}

btnTour.addEventListener('click', () => {
  if (tourActive) stopAutoTour();
  else startAutoTour();
});
document.getElementById('btn-tour-stop').addEventListener('click', stopAutoTour);

// Кнопка «Звук гор»
const btnAudio = document.getElementById('btn-audio');
const audioWaves = document.getElementById('audio-waves');
const audioLabel = document.getElementById('audio-label');
btnAudio.addEventListener('click', () => {
  const isOn = soundEngine.toggle();
  if (isOn) {
    btnAudio.classList.add('border-gold', 'text-gold', 'gold-glow-active');
    audioWaves.classList.remove('opacity-40');
    audioWaves.classList.add('opacity-100');
    audioLabel.textContent = 'Звук гор: Вкл';
    soundEngine.playKomuzPluck(activeSiteIndex >= 0 ? SACRED_SITES[activeSiteIndex].freq : 293.66);
  } else {
    btnAudio.classList.remove('border-gold', 'text-gold', 'gold-glow-active');
    audioWaves.classList.add('opacity-40');
    audioWaves.classList.remove('opacity-100');
    audioLabel.textContent = 'Звук гор';
  }
});

document.getElementById('btn-close-card').addEventListener('click', () => closeSiteCard(true));
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isArtifactModalOpen) {
      artifactModal.classList.add('hidden');
      isArtifactModalOpen = false;
    } else if (activeSiteIndex >= 0) {
      closeSiteCard(true);
    }
  }
});
document.getElementById('btn-prev-site').addEventListener('click', () => {
  const prev = (activeSiteIndex - 1 + SACRED_SITES.length) % SACRED_SITES.length;
  selectSite(prev, true);
});
document.getElementById('btn-next-site').addEventListener('click', () => {
  const next = (activeSiteIndex + 1) % SACRED_SITES.length;
  selectSite(next, true);
});

controls.addEventListener('start', () => {
  isCameraFlying = false;
  if (tourActive) stopAutoTour();
});

// =========================================================================
// МОДУЛЬ 14: ПОЛНОЦЕННАЯ 2D-КАРТА И ПЛАНИРОВЩИК МАРШРУТОВ (Map2D & RoutePlanner)
// =========================================================================
const KYRGYZSTAN_CITIES = [
  { name: 'г. Бишкек (центр)', lat: 42.8746, lon: 74.5698 },
  { name: 'Аэропорт «Манас»', lat: 43.0536, lon: 74.4694 },
  { name: 'г. Ош', lat: 40.5283, lon: 72.7985 },
  { name: 'г. Каракол', lat: 42.4907, lon: 78.3936 },
  { name: 'г. Нарын', lat: 41.4287, lon: 75.9911 },
  { name: 'г. Талас', lat: 42.5228, lon: 72.2427 },
  { name: 'г. Джалал-Абад', lat: 40.9333, lon: 73.0000 },
  { name: 'г. Баткен', lat: 40.0626, lon: 70.8194 },
  { name: 'г. Токмок', lat: 42.8419, lon: 75.3015 },
  { name: 'г. Чолпон-Ата', lat: 42.6494, lon: 77.0823 },
  { name: 'г. Балыкчы', lat: 42.4602, lon: 76.1871 }
];

let isMap2DOpen = false;
let leafletMap = null;
let pointA = { name: 'г. Бишкек (центр)', lat: 42.8746, lon: 74.5698 };
let pointB = KYRGYZSTAN_CITIES.find(city => city.name === 'г. Токмок');
let markerA = null;
let markerB = null;
let routeLayer = null;
let routeRequest;
const routeStops = [];
const routeStopSelect = document.getElementById('route-stop-select');
const routeStopAdd = document.getElementById('route-stop-add');
const routeStopList = document.getElementById('route-stop-list');
const routeSuggestions = document.getElementById('route-suggestions');
let mapClickTarget = null; // 'A' | 'B' | null

const map2dView = document.getElementById('map2d-view');
const btnMap2d = document.getElementById('btn-map2d');
const map2dLabel = document.getElementById('map2d-label');

// Заполняем выпадающие списки городов и святилищ
const presetSelectA = document.getElementById('preset-point-a');
const presetSelectB = document.getElementById('preset-point-b');
const inputA = document.getElementById('input-point-a');
const inputB = document.getElementById('input-point-b');
const tripOptions = document.querySelector('.trip-options');
const pickHint = document.getElementById('route-pick-hint');
const routeSummary = document.getElementById('route-summary-header');
const zoomRoute = document.getElementById('btn-zoom-route');
const clearRoute = document.getElementById('btn-clear-route');

function syncPreset(select, point) {
  select.querySelector('[data-custom]')?.remove();
  const matching = Array.from(select.options).find(option => {
    const optionPoint = JSON.parse(option.value);
    return optionPoint.lat === point.lat && optionPoint.lon === point.lon;
  });
  if (matching) {
    select.value = matching.value;
  } else {
    const option = new Option(point.name, JSON.stringify(point), false, true);
    option.dataset.custom = '';
    select.prepend(option);
    select.value = option.value;
  }
}

function populateLocationSelects() {
  const optGroupCities = document.createElement('optgroup');
  optGroupCities.label = 'Города и транспортные узлы';
  KYRGYZSTAN_CITIES.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = JSON.stringify(c);
    opt.textContent = c.name;
    optGroupCities.appendChild(opt);
  });

  const optGroupSites = document.createElement('optgroup');
  optGroupSites.label = 'Сакральные места Кыргызстана';
  SACRED_SITES.forEach((s) => {
    const opt = document.createElement('option');
    opt.value = JSON.stringify({ name: `${s.num}. ${s.nameRu}`, lat: s.lat, lon: s.lon });
    opt.textContent = `${s.num}. ${s.nameRu} (${s.region})`;
    optGroupSites.appendChild(opt);
  });

  presetSelectA.appendChild(optGroupCities.cloneNode(true));
  presetSelectA.appendChild(optGroupSites.cloneNode(true));
  presetSelectB.appendChild(optGroupSites.cloneNode(true));
  presetSelectB.appendChild(optGroupCities.cloneNode(true));

  inputA.value = pointA.name;
  inputB.value = pointB.name;
  syncPreset(presetSelectA, pointA);
  syncPreset(presetSelectB, pointB);
}
populateLocationSelects();

function createPinIcon(label, bgHex, borderHex, textHex) {
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:999px;background:${bgHex};border:2px solid ${borderHex};color:${textHex};font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.75);">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function initLeafletMap() {
  if (leafletMap || typeof L === 'undefined') return;

  leafletMap = L.map('leaflet-map', {
    center: [41.45, 74.8],
    zoom: 7,
    zoomControl: false
  });

  L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 19,
  }).addTo(leafletMap);

  // Local borders and lakes remain visible while street tiles load.
  const baseMap = leafletMap;
  baseMap.createPane('localGeography').style.zIndex = 190;
  fetch(new URL('../assets/atlas-geography.json', import.meta.url)).then(response => {
    if (!response.ok) throw new Error('Local map data unavailable');
    return response.json();
  }).then(data => {
    L.geoJSON(data, {
      pane: 'localGeography', interactive: false,
      style: ({ properties }) => properties.water
        ? { color: '#52758a', weight: 1, fillColor: '#28485d', fillOpacity: .75 }
        : { color: '#565f68', weight: 1, fillColor: '#252c37', fillOpacity: .7 },
    }).addTo(baseMap);
    baseMap.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/">Natural Earth</a>');
  }).catch(() => { /* The lightweight border below remains available. */ });

  // Контур границы Кыргызстана
  const borderLatLngs = KYRGYZSTAN_BORDER.map(([lon, lat]) => [lat, lon]);
  L.polygon(borderLatLngs, {
    color: '#F6C453',
    weight: 1.8,
    opacity: 0.55,
    fillColor: '#F6C453',
    fillOpacity: 0.03
  }).addTo(leafletMap);

  // Все 9 сакральных мест на 2D-карте
  SACRED_SITES.forEach((site, idx) => {
    const marker = L.marker([site.lat, site.lon], {
      icon: L.divIcon({ className: 'route-site-number', html: String(site.num), iconSize: [28, 28], iconAnchor: [14, 14] })
    }).addTo(leafletMap);

    const popupHtml = `
      <div style="min-width:210px;padding:2px;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.14em;color:#38BDF8;">${site.region}</div>
        <div style="font-size:15px;font-weight:700;color:#EDE7DC;margin:2px 0;">${site.num}. ${site.nameRu}</div>
        <div style="font-size:11px;color:rgba(237,231,220,0.75);margin-bottom:8px;">${site.elevation}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button onclick="window.__setRoutePointFromMap('A', ${idx})" style="flex:1;padding:4px 6px;border-radius:8px;background:rgba(16,185,129,0.2);border:1px solid #34d399;color:#6ee7b7;font-size:11px;cursor:pointer;">Точка А</button>
          <button onclick="window.__setRoutePointFromMap('B', ${idx})" style="flex:1;padding:4px 6px;border-radius:8px;background:rgba(246,196,83,0.2);border:1px solid #F6C453;color:#F6C453;font-size:11px;cursor:pointer;">Точка Б</button>
          <button type="button" class="route-popup-stop" onclick="window.__addSacredStop(${idx})">Заехать по пути</button>
        </div>
      </div>
    `;
    marker.bindPopup(popupHtml);
  });

  // Клик по карте для выбора точки А или Б
  leafletMap.on('click', (e) => {
    if (!mapClickTarget) return;
    const { lat, lng } = e.latlng;
    const label = `Точка на карте (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`;
    if (mapClickTarget === 'A') {
      setPointA({ name: label, lat, lon: lng });
    } else {
      setPointB({ name: label, lat, lon: lng });
    }
    mapClickTarget = null;
    pickHint.hidden = true;
  });

  updateRouteMarkers();
}

window.__setRoutePointFromMap = (which, siteIdx) => {
  const s = SACRED_SITES[siteIdx];
  const obj = { name: `${s.num}. ${s.nameRu}`, lat: s.lat, lon: s.lon };
  if (which === 'A') setPointA(obj);
  else setPointB(obj);
  if (leafletMap) leafletMap.closePopup();
};

function isTripEndpoint(site) {
  return [pointA, pointB].some(point => Math.hypot(site.lat - point.lat, site.lon - point.lon) < .0001);
}

function invalidateRoute() {
  routeRequest?.abort();
  routeRequest = undefined;
  routeLayer?.remove();
  routeLayer = null;
  routeSuggestions.hidden = true;
  routeSummary.hidden = true;
  zoomRoute.hidden = true;
  clearRoute.hidden = !routeStops.length;
  document.getElementById('route-status-box').classList.add('hidden');
}

function renderStops() {
  routeStopSelect.replaceChildren(new Option('Выберите остановку', ''));
  SACRED_SITES.forEach((site, index) => {
    if (!isTripEndpoint(site) && !routeStops.includes(site)) {
      routeStopSelect.add(new Option(site.nameRu, String(index)));
    }
  });
  routeStopAdd.disabled = true;
  clearRoute.hidden = !routeStops.length && !routeLayer;
  routeStopList.replaceChildren(...routeStops.map((site, index) => {
    const row = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = site.nameRu;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Убрать';
    remove.setAttribute('aria-label', `Убрать ${site.nameRu} из маршрута`);
    remove.onclick = () => {
      routeStops.splice(index, 1);
      invalidateRoute();
      renderStops();
      (routeStopList.querySelector('button') ?? routeStopSelect).focus();
    };
    row.append(name, remove);
    return row;
  }));
}

function addSacredStop(index) {
  const site = SACRED_SITES[index];
  if (!site || isTripEndpoint(site) || routeStops.includes(site)) return;
  routeStops.push(site);
  invalidateRoute();
  renderStops();
  leafletMap?.closePopup();
}

window.__addSacredStop = addSacredStop;
routeStopSelect.addEventListener('change', () => { routeStopAdd.disabled = !routeStopSelect.value; });
routeStopAdd.addEventListener('click', () => {
  if (routeStopSelect.value) addSacredStop(Number(routeStopSelect.value));
  routeStopSelect.focus();
});
renderStops();

function showNearbyStops(line) {
  const mapPoint = ([lat, lon]) => leafletMap.project([lat, lon], 7);
  const path = line.map(mapPoint);
  const candidates = SACRED_SITES.flatMap((site, index) => {
    if (routeStops.includes(site) || isTripEndpoint(site)) return [];
    const target = mapPoint([site.lat, site.lon]);
    let nearest = Infinity;
    for (let i = 1; i < path.length; i++) {
      const closest = L.LineUtil.closestPointOnSegment(target, path[i - 1], path[i]);
      nearest = Math.min(nearest, leafletMap.distance([site.lat, site.lon], leafletMap.unproject(closest, 7)));
    }
    return nearest <= 25000 ? [{ site, index, nearest }] : [];
  });
  routeSuggestions.replaceChildren();
  routeSuggestions.hidden = !candidates.length;
  if (!candidates.length) return;
  const title = document.createElement('p');
  title.textContent = 'Рядом с маршрутом (расстояние по прямой)';
  routeSuggestions.append(title);
  candidates.sort((a, b) => a.nearest - b.nearest).forEach(({ site, index, nearest }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `+ ${site.nameRu} · ${Math.max(1, Math.round(nearest / 1000))} км`;
    button.onclick = () => { addSacredStop(index); buildRoadRoute(); };
    routeSuggestions.append(button);
  });
}

function updateRouteMarkers() {
  if (!leafletMap) return;
  if (markerA) leafletMap.removeLayer(markerA);
  if (markerB) leafletMap.removeLayer(markerB);

  if (pointA) {
    markerA = L.marker([pointA.lat, pointA.lon], {
      icon: createPinIcon('А', '#065f46', '#34d399', '#ecfdf5'),
      zIndexOffset: 900
    }).addTo(leafletMap).bindTooltip(routePointLabel('А', pointA), { direction: 'top' });
  }
  if (pointB) {
    markerB = L.marker([pointB.lat, pointB.lon], {
      icon: createPinIcon('Б', '#78350f', '#F6C453', '#fef3c7'),
      zIndexOffset: 900
    }).addTo(leafletMap).bindTooltip(routePointLabel('Б', pointB), { direction: 'top' });
  }
}

function routePointLabel(letter, point) {
  const label = document.createElement('span');
  label.textContent = letter + ': ' + point.name;
  return label;
}

function setPointA(pt) {
  pointA = pt;
  inputA.value = pt.name;
  syncPreset(presetSelectA, pt);
  for (let i = routeStops.length - 1; i >= 0; i--) {
    if (isTripEndpoint(routeStops[i])) routeStops.splice(i, 1);
  }
  invalidateRoute();
  renderStops();
  updateRouteMarkers();
}

function setPointB(pt) {
  pointB = pt;
  inputB.value = pt.name;
  syncPreset(presetSelectB, pt);
  for (let i = routeStops.length - 1; i >= 0; i--) {
    if (isTripEndpoint(routeStops[i])) routeStops.splice(i, 1);
  }
  invalidateRoute();
  renderStops();
  updateRouteMarkers();
}

presetSelectA.addEventListener('change', (e) => {
  if (!e.target.value) return;
  setPointA(JSON.parse(e.target.value));
});

presetSelectB.addEventListener('change', (e) => {
  if (!e.target.value) return;
  setPointB(JSON.parse(e.target.value));
});

function pickEndpoint(which) {
  mapClickTarget = which;
  tripOptions.open = false;
  pickHint.hidden = false;
  pickHint.textContent = `Укажите точку ${which === 'A' ? 'А' : 'Б'} на карте.`;
  tripOptions.querySelector('summary').focus();
}

document.getElementById('btn-pick-a').addEventListener('click', () => pickEndpoint('A'));
document.getElementById('btn-pick-b').addEventListener('click', () => pickEndpoint('B'));

document.getElementById('btn-swap-points').addEventListener('click', () => {
  const temp = pointA;
  setPointA(pointB);
  setPointB(temp);
  routeStops.reverse();
  renderStops();
  if (pointA && pointB) buildRoadRoute();
});

// Геолокация пользователя для Точки А
document.getElementById('btn-geo-a').addEventListener('click', () => {
  const statusBox = document.getElementById('route-status-box');
  const msgEl = document.getElementById('route-message');
  statusBox.classList.remove('hidden');
  msgEl.textContent = 'Определение текущего местоположения...';

  if (!navigator.geolocation) {
    msgEl.textContent = 'Геолокация не поддерживается вашим браузером.';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setPointA({ name: `Моё местоположение (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`, lat: latitude, lon: longitude });
      if (leafletMap) leafletMap.setView([latitude, longitude], 10);
      msgEl.textContent = 'Текущее местоположение установлено как Точка А.';
    },
    () => {
      msgEl.textContent = 'Не удалось получить доступ к геолокации. Выберите город из списка или укажите точку на карте.';
    },
    { timeout: 7000 }
  );
});

// Геокодирование адреса через Nominatim OpenStreetMap
async function geocodePlace(query, which) {
  const q = query.trim();
  if (!q) return;
  const statusBox = document.getElementById('route-status-box');
  const msgEl = document.getElementById('route-message');
  statusBox.classList.remove('hidden');
  msgEl.textContent = `Поиск «${q}»...`;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kg&q=${encodeURIComponent(q)}`;
    const resp = await fetch(url, { headers: { 'Accept-Language': 'ru' } });
    const data = await resp.json();
    if (data && data.length > 0) {
      const item = data[0];
      const pt = {
        name: item.display_name.split(',').slice(0, 2).join(', '),
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      };
      if (which === 'A') setPointA(pt);
      else setPointB(pt);
      if (leafletMap) leafletMap.setView([pt.lat, pt.lon], 10);
      msgEl.textContent = `Найдено: ${pt.name}`;
    } else {
      msgEl.textContent = `Объект «${q}» не найден в Кыргызстане. Попробуйте уточнить название или кликните по карте.`;
    }
  } catch {
    msgEl.textContent = 'Ошибка соединения со службой поиска адресов. Выберите точку из списка или на карте.';
  }
}

document.getElementById('btn-search-a').addEventListener('click', () => geocodePlace(inputA.value, 'A'));
document.getElementById('btn-search-b').addEventListener('click', () => geocodePlace(inputB.value, 'B'));

function formatDuration(seconds) {
  const totalMins = Math.round(seconds / 60);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs === 0) return `${mins} мин`;
  return `${hrs} ч ${mins} мин`;
}

// Построение реального автомобильного маршрута по дорогам (OSRM Routing API)
async function buildRoadRoute() {
  if (!pointA || !pointB) return;
  initLeafletMap();
  if (!leafletMap) return;
  invalidateRoute();
  const request = new AbortController();
  routeRequest = request;
  const points = [pointA, ...routeStops, pointB];

  const statusBox = document.getElementById('route-status-box');
  const distEl = document.getElementById('route-distance');
  const durEl = document.getElementById('route-duration');
  const msgEl = document.getElementById('route-message');

  statusBox.classList.remove('hidden');
  distEl.textContent = '...';
  durEl.textContent = '...';
  msgEl.textContent = 'Строим маршрут…';

  try {
    const coordinates = points.map(point => `${point.lon},${point.lat}`).join(';');
    const radiuses = points.map((_, index) => index === 0 || index === points.length - 1 ? 'unlimited' : 2500).join(';');
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&radiuses=${radiuses}`;
    const response = await fetch(osrmUrl, { signal: AbortSignal.any([request.signal, AbortSignal.timeout(12000)]) });
    const json = await response.json();
    if (request.signal.aborted) return;
    if (['NoRoute', 'NoSegment'].includes(json.code) || (response.ok && !json.routes?.length)) {
      distEl.textContent = 'Недоступно';
      durEl.textContent = '—';
      msgEl.textContent = 'Для одной из точек не найден подъезд. Уберите эту остановку или выберите другую точку.';
      return;
    }
    if (!response.ok) throw new Error('OSRM network error');

    const route = json.routes[0];
    const distKm = (route.distance / 1000).toFixed(1);
    const durationStr = formatDuration(route.duration);

    const latLngCoords = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);

    // Двухслойная подсветка дорожного маршрута на карте
    const glowLine = L.polyline(latLngCoords, { color: '#38BDF8', weight: 8, opacity: 0.28 });
    const mainLine = L.polyline(latLngCoords, { color: '#F6C453', weight: 4, opacity: 0.95 });
    const stopMarkers = points.slice(1, -1).map((point, index) =>
      L.marker([point.lat, point.lon], {
        icon: createPinIcon(String(index + 1), '#154e58', '#87d8d2', '#fff'),
        zIndexOffset: 500,
        interactive: false,
      }));
    routeLayer = L.featureGroup([glowLine, mainLine, ...stopMarkers]).addTo(leafletMap);

    leafletMap.fitBounds(routeLayer.getBounds(), { padding: [55, 55] });

    routeSummary.hidden = false;
    zoomRoute.hidden = false;
    clearRoute.hidden = false;
    distEl.textContent = `${distKm} км`;
    durEl.textContent = durationStr;
    msgEl.textContent = points.map(point => point.nameRu ?? point.name).join(' → ');
    if (json.waypoints?.slice(1, -1).some(point => point.distance > 250)) {
      msgEl.textContent += '. Для некоторых остановок показан ближайший подъезд.';
    }
    showNearbyStops(latLngCoords);
    statusBox.scrollIntoView({ block: 'nearest' });
  } catch {
    if (request.signal.aborted) return;
    distEl.textContent = 'Ошибка';
    durEl.textContent = '—';
    msgEl.textContent = 'Не удалось получить данные дорожного графа. Проверьте подключение к интернету и повторите попытку.';
  }
}

document.getElementById('btn-build-route').addEventListener('click', buildRoadRoute);

document.getElementById('btn-clear-route').addEventListener('click', () => {
  invalidateRoute();
  routeStops.length = 0;
  renderStops();
});

document.getElementById('btn-zoom-route').addEventListener('click', () => {
  if (routeLayer && leafletMap) {
    leafletMap.fitBounds(routeLayer.getBounds(), { padding: [55, 55] });
  }
});

function toggleMap2D(forceState) {
  isMap2DOpen = typeof forceState === 'boolean' ? forceState : !isMap2DOpen;
  document.documentElement.toggleAttribute('data-map2d', isMap2DOpen);
  if (isMap2DOpen) {
    if (tourActive) stopAutoTour();
    map2dView.classList.remove('hidden');
    badgesLayer.classList.add('hidden');
    document.getElementById('bottom-hud').classList.add('hidden');
    btnMap2d.classList.add('border-gold', 'text-gold', 'gold-glow-active');
    map2dLabel.textContent = '3D-карта';
    initLeafletMap();
    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 60);
  } else {
    map2dView.classList.add('hidden');
    badgesLayer.classList.remove('hidden');
    document.getElementById('bottom-hud').classList.remove('hidden');
    btnMap2d.classList.remove('border-gold', 'text-gold', 'gold-glow-active');
    map2dLabel.textContent = 'Маршрут';
  }
}

btnMap2d.addEventListener('click', () => toggleMap2D());
document.getElementById('btn-back-to-3d').addEventListener('click', () => toggleMap2D(false));

// Добавление промежуточной остановки из карточки святилища.
document.getElementById('btn-card-route').addEventListener('click', () => {
  if (activeSiteIndex < 0) return;
  toggleMap2D(true);
  addSacredStop(activeSiteIndex);
});

// =========================================================================
// МОДУЛЬ 15: RAYCASTING («ЛУЧ ФАКЕЛА» И ВЫБОР 3D-СВЯТИЛИЩ)
// =========================================================================
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2(-99, -99);
const torchTargetPos = new THREE.Vector3(0, 1.5, 0);
let torchTargetIntensity = 0.0;

function updatePointerRay(clientX, clientY) {
  if (isMap2DOpen) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointerNDC, camera);
  const terrainHits = raycaster.intersectObject(plaqueData.terrainMesh, false);
  if (terrainHits.length > 0) {
    const pt = terrainHits[0].point;
    torchTargetPos.set(pt.x, pt.y + 0.9, pt.z);
    torchTargetIntensity = 1.0;

  } else {
    torchTargetIntensity = 0.0;
  }
}

let pointerDownX = 0;
let pointerDownY = 0;

renderer.domElement.addEventListener('pointerdown', (e) => {
  pointerDownX = e.clientX;
  pointerDownY = e.clientY;
});

renderer.domElement.addEventListener('pointermove', (e) => {
  if (isMap2DOpen) return;
  updatePointerRay(e.clientX, e.clientY);
  const hitMeshes = siteObjects.map((o) => o.hitMesh);
  const beaconHits = raycaster.intersectObjects(hitMeshes, false);
  renderer.domElement.style.cursor = beaconHits.length > 0 ? 'pointer' : 'grab';
});

renderer.domElement.addEventListener('pointerup', (e) => {
  if (isMap2DOpen) return;
  const moved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
  if (moved > 6) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);

  const hitMeshes = siteObjects.map((o) => o.hitMesh);
  const hits = raycaster.intersectObjects(hitMeshes, false);
  if (hits.length > 0) {
    const idx = hits[0].object.userData.siteIndex;
    if (activeSiteIndex === idx) closeSiteCard(true);
    else selectSite(idx, true);
  }
});

// =========================================================================
// МОДУЛЬ 16: ПРОЕКЦИЯ 3D-БЕЙДЖЕЙ, РОЗА ВЕТРОВ И ГЛАВНЫЙ ЦИКЛ РЕНДЕРА
// =========================================================================
const compassRose = document.getElementById('compass-rose');
const compassDeg = document.getElementById('compass-deg');
const projVec = new THREE.Vector3();

function frameSiteBesideCard() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  let x = 0;
  let y = 0;
  if (activeSiteIndex >= 0) {
    if (width >= 640) {
      x = Math.min(0.37, (siteCard.offsetWidth + 24) / (2 * width));
    } else {
      const cardTop = siteCard.getBoundingClientRect().top / height;
      y = 0.5 - THREE.MathUtils.clamp((cardTop + 0.15) / 2, 0.23, 0.42);
    }
  }

  viewOffset.x = THREE.MathUtils.lerp(viewOffset.x, x, 0.12);
  viewOffset.y = THREE.MathUtils.lerp(viewOffset.y, y, 0.12);
  if (Math.abs(viewOffset.x - x) < 0.001) viewOffset.x = x;
  if (Math.abs(viewOffset.y - y) < 0.001) viewOffset.y = y;
  if (viewOffset.x || viewOffset.y) {
    camera.setViewOffset(width, height, width * viewOffset.x, height * viewOffset.y, width, height);
  } else if (camera.view?.enabled) {
    camera.clearViewOffset();
  }
}

function updateBadgesAndCompass() {
  if (isMap2DOpen) return;
  const width = window.innerWidth;
  const height = window.innerHeight;

  siteObjects.forEach((obj, idx) => {
    projVec.copy(obj.pos3D);
    projVec.y += idx === activeSiteIndex ? 0.09 : 0.27;
    projVec.project(camera);

    const isBehind = projVec.z > 1.0;
    const sx = (projVec.x * 0.5 + 0.5) * width;
    const sy = (-projVec.y * 0.5 + 0.5) * height;

    const outOfView = isBehind || sx < 35 || sx > width - 35 || sy < 60 || sy > height - 65;

    if (outOfView) {
      obj.badgeEl.style.opacity = '0';
      obj.badgeEl.style.pointerEvents = 'none';
    } else {
      const isSelected = idx === activeSiteIndex;
      obj.badgeEl.style.opacity = isSelected ? '1' : '0.92';
      obj.badgeEl.style.pointerEvents = 'auto';
      const scale = isSelected ? 1.05 : 0.96;
      obj.badgeEl.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, -100%) scale(${scale})`;
      obj.badgeEl.style.zIndex = isSelected ? '25' : '12';
    }
  });

  const dx = camera.position.x - controls.target.x;
  const dz = camera.position.z - controls.target.z;
  const azimuthRad = Math.atan2(dx, dz);
  const deg = ((Math.round((azimuthRad * 180) / Math.PI) % 360) + 360) % 360;

  compassRose.style.transform = `rotate(${-deg}deg)`;
  const dirs = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const dirLabel = dirs[Math.round(deg / 45) % 8];
  compassDeg.textContent = `${String(deg).padStart(3, '0')}° ${dirLabel}`;
}

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.fov = sacredFraming.fov(camera.aspect);
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  if (!frame) animate();
});

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  if (!isMap2DOpen) {
    const shaderUniforms = plaqueData.shaderUniforms;
    shaderUniforms.uTime.value = elapsed;
    torchLight.position.lerp(torchTargetPos, 0.14);
    shaderUniforms.uTorchPos.value.copy(torchLight.position);
    shaderUniforms.uTorchActive.value += (torchTargetIntensity - shaderUniforms.uTorchActive.value) * 0.1;
    torchLight.intensity = shaderUniforms.uTorchActive.value * 3.2;

    const targetXray = xrayEnabled ? 1.0 : 0.0;
    shaderUniforms.uXrayMode.value += (targetXray - shaderUniforms.uXrayMode.value) * 0.08;

    if (leyLinesGroup.visible) {
      leyPulses.forEach((p, i) => {
        const t = (elapsed * 0.24 + p.offset + i * 0.05) % 1.0;
        p.mesh.position.copy(p.curve.getPoint(t));
      });
    }

    if (isCameraFlying) {
      camera.position.lerp(targetCamPos, 0.06);
      controls.target.lerp(targetLookAt, 0.07);
      if (
        camera.position.distanceTo(targetCamPos) < 0.025 &&
        controls.target.distanceTo(targetLookAt) < 0.025
      ) {
        camera.position.copy(targetCamPos);
        controls.target.copy(targetLookAt);
        isCameraFlying = false;
      }
    }

    controls.update();

    // Защита от проваливания камеры и цели взгляда под рельеф гор и цоколь карты
    const targetGroundY = getTerrainHeightAtWorld(controls.target.x, controls.target.z);
    if (controls.target.y < targetGroundY + 0.04) {
      controls.target.y = targetGroundY + 0.04;
    }
    const camGroundY = getTerrainHeightAtWorld(camera.position.x, camera.position.z);
    if (camera.position.y < camGroundY + 0.32) {
      camera.position.y = camGroundY + 0.32;
    }

    frameSiteBesideCard();
    updateBadgesAndCompass();
    renderer.render(scene, camera);
  }

  // Рендеринг 3D-просмотрщика артефакта в боковой карточке и в модальном окне
  if (activeSiteIndex >= 0) {
    sideArtifactViewer.render();
  }
  if (isArtifactModalOpen) {
    modalArtifactViewer.render();
  }
}

let frame = 0;

function presentLift(lift) {
  const offset = (1 - lift) * sacredFraming.lift / sacredFraming.scale;
  camera.position.copy(OVERVIEW_CAM_POS);
  camera.position.y += offset;
  controls.target.copy(OVERVIEW_TARGET);
  controls.target.y += offset;
  animate();
}

function tick() {
  animate();
  frame = requestAnimationFrame(tick);
}

function send(type) {
  if (embedded) window.parent.postMessage({ type }, location.origin);
}

const returnButton = document.getElementById('return-yurt');
returnButton.addEventListener('click', () => {
  if (embedded) send('aigine:sacred-return');
  else location.href = '../../#inside';
});

addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent) return;
  if (event.data?.type === 'aigine:sacred-lift' && !frame) presentLift(event.data.lift);
  if (event.data?.type === 'aigine:sacred-play' && !frame) {
    document.documentElement.dataset.arrived = 'true';
    tick();
  }
  if (event.data?.type === 'aigine:sacred-focus') returnButton.focus({ preventScroll: true });
  if (event.data?.type === 'aigine:sacred-pause') {
    cancelAnimationFrame(frame);
    frame = 0;
    delete document.documentElement.dataset.arrived;
    if (isMap2DOpen) toggleMap2D(false);
    if (isArtifactModalOpen) {
      artifactModal.classList.add('hidden');
      isArtifactModalOpen = false;
    }
    closeSiteCard(false);
    isCameraFlying = false;
    if (soundEngine.enabled) btnAudio.click();
  }
});

animate();
send('aigine:sacred-ready');
if (!embedded) frame = requestAnimationFrame(tick);


const ru = {
  modes: ['Узнай', 'Создай', 'Найди'], back: 'К скале', yurt: 'В бозуй', choose: 'Выбери путь', skip: 'Пропустить',
  steps: ['Что такое петроглиф', 'Как выбивали', 'Сколько им лет', 'Сюжеты', 'Где искать', 'Как беречь'],
  facts: ['Петроглиф — изображение, выбитое или вырезанное на камне.', 'Каждый удар оставляет точку. Множество точек складываются в контур.', 'Ранние рисунки Саймалуу-Таша относят к III — началу II тысячелетия до н. э.', 'На камнях встречаются горные козлы, охотники и фигуры с лучами вокруг головы.', 'Саймалуу-Таш лежит в Ферганском хребте, Чолпон-Ата — у Иссык-Куля.', 'Рассматривай рисунки без прикосновений. Не обводи их и не царапай камень.'],
  symbols: ['Горный козёл', 'Солнце', 'Охотник', 'Спираль'], meanings: ['Козлов изображали с длинными изогнутыми рогами.', 'Лучи вокруг головы напоминают солнечный диск. Значение трактуют по-разному.', 'Сцены охоты показывают людей рядом с животными.'],
  source: 'Источник', light: 'Без затемнения', age: 'Возраст поверхности', protect: 'Укрыть рисунок', protected: 'Рисунок укрыт', strike: 'Ударить по камню', final: 'Теперь твоя очередь оставить след.', create: 'Создай свой', model: 'Рассмотреть камень в 3D',
  time: ['1000 до н. э.', '0', '1000', 'Сегодня'],
  prompt: 'Нарисуй знак, который скажет о тебе', tools: ['Кисть', 'Ластик', 'Отменить', 'Очистить'],
  nick: 'Ник', caption: 'Подпись (до 40 символов)', publish: 'Опубликовать', share: 'Поделиться', report: 'Пожаловаться',
  feeds: ['Новые', 'Топ недели', 'Топ за всё время'], local: 'Лента на этом устройстве', empty: 'Здесь появятся рисунки.', like: 'Поставить отметку',
  blank: 'Сначала добавь рисунок.', limit: 'На сегодня доступно до пяти публикаций.', privateText: 'Убери ссылки и контактные данные.', saved: 'Сохранено на этом устройстве.', storage: 'Не удалось сохранить. Проверь свободное место в браузере.', shared: 'Картинка готова.', reported: 'Жалоба отмечена на этом устройстве.',
  point: 'Наведи на петроглиф', privacy: 'Кадры камеры и загруженные фото остаются в браузере.', camera: 'Включить камеру', upload: 'Загрузить фото', sample: 'Фото для демо', scan: 'Сканировать', collection: 'Коллекция', add: 'Сохранить в коллекцию', details: 'Подробнее', unrecognized: 'Для этого фото совпадение не определено. Попробуй демонстрационный снимок.', cameraError: 'Камера недоступна. Загрузи фото или открой демо.', imageError: 'Не удалось открыть фото.', demo: 'Демо на известном снимке', place: 'Чолпон-Ата', uncertain: 'Возраст и значение отдельного знака по этому кадру не определены.', firstPost: 'Первый пост', old: 'Тысячи лет назад', nextPost: 'Теперь твой пост',
};
const ky = {
  modes: ['Бил', 'Жарат', 'Тап'], back: 'Аскага', yurt: 'Боз үйгө', choose: 'Жолду танда', skip: 'Өткөрүү',
  steps: ['Петроглиф деген эмне', 'Кантип чегишкен', 'Канча жыл болгон', 'Сюжеттер', 'Кайдан көрүүгө болот', 'Кантип сактоо керек'],
  facts: ['Петроглиф — ташка чегилген же оюлган сүрөт.', 'Ар бир соккудан чекит калат. Чекиттер кошулуп, сүрөттүн сызыгын түзөт.', 'Саймалуу-Таштагы алгачкы сүрөттөр б.з.ч. III — II миң жылдыктын башына таандык.', 'Таштарда тоо текелер, мергенчилер жана башынан нур чачыраган элестер кездешет.', 'Саймалуу-Таш Фергана кырка тоолорунда, Чолпон-Ата Ысык-Көлдүн жээгинде.', 'Сүрөттү кармабай кара. Сызыктарын бастырба жана ташты чийбе.'],
  symbols: ['Тоо теке', 'Күн', 'Мергенчи', 'Спираль'], meanings: ['Тоо текенин узун ийри мүйүздөрү тартылган.', 'Баштын тегерегиндеги нурлар күндү элестетет. Мааниси ар башкача чечмеленет.', 'Аңчылык көрүнүштөрүндө адамдар менен жаныбарлар чогуу тартылган.'],
  source: 'Булак', light: 'Караңгылатпай көрсөтүү', age: 'Таштын эскириши', protect: 'Сүрөттү калкалоо', protected: 'Сүрөт калкаланды', strike: 'Ташты чегүү', final: 'Эми из калтыруу кезеги сенде.', create: 'Өзүң жарат', model: 'Ташты 3D форматта көрүү',
  time: ['б.з.ч. 1000', '0', '1000', 'Бүгүн'],
  prompt: 'Өзүң жөнүндө айтып бере турган белги тарт', tools: ['Кыл калем', 'Өчүргүч', 'Артка', 'Тазалоо'],
  nick: 'Ылакап ат', caption: 'Жазуу (40 тамгага чейин)', publish: 'Жарыялоо', share: 'Бөлүшүү', report: 'Даттануу',
  feeds: ['Жаңы', 'Аптанын мыктылары', 'Бардык убактагы мыктылар'], local: 'Бул түзмөктөгү тасма', empty: 'Сүрөттөр бул жерде чыгат.', like: 'Жакты деп белгилөө',
  blank: 'Адегенде сүрөт тарт.', limit: 'Күнүнө беш сүрөткө чейин жарыяласа болот.', privateText: 'Шилтемелерди жана байланыш маалыматын алып сал.', saved: 'Бул түзмөктө сакталды.', storage: 'Сакталган жок. Браузерде бош орунду текшер.', shared: 'Сүрөт даяр.', reported: 'Даттануу бул түзмөктө белгиленди.',
  point: 'Камераны петроглифке багытта', privacy: 'Камеранын кадрлары жана жүктөлгөн сүрөттөр браузерде калат.', camera: 'Камераны күйгүзүү', upload: 'Сүрөт жүктөө', sample: 'Демо сүрөт', scan: 'Скандоо', collection: 'Коллекция', add: 'Коллекцияга сактоо', details: 'Толугураак', unrecognized: 'Бул сүрөт боюнча дал келүү табылган жок. Демо сүрөттү колдонуп көр.', cameraError: 'Камера жеткиликсиз. Сүрөт жүктө же демону ач.', imageError: 'Сүрөт ачылган жок.', demo: 'Белгилүү сүрөт менен демо', place: 'Чолпон-Ата', uncertain: 'Бул кадрдан белгинин жашы менен мааниси аныкталган жок.', firstPost: 'Биринчи пост', old: 'Миңдеген жыл мурун', nextPost: 'Эми сенин постуң',
};
const en = {
  modes: ['Learn', 'Create', 'Find'], back: 'Back to the rock', yurt: 'Back to the yurt', choose: 'Choose a path', skip: 'Skip',
  steps: ['What is a petroglyph?', 'How they were made', 'How old are they?', 'Motifs', 'Where to look', 'How to protect them'],
  facts: ['A petroglyph is an image pecked or carved into a rock.', 'Each strike leaves a mark. Many small marks form an outline.', 'The earliest Saimaluu-Tash carvings date from the third to early second millennium BCE.', 'Rocks show ibex, hunters and figures with rays around their heads.', 'Saimaluu-Tash lies in the Fergana Range. Cholpon-Ata is on Lake Issyk-Kul.', 'Look without touching. Leave carvings unmarked and keep the stone intact.'],
  symbols: ['Ibex', 'Sun', 'Hunter', 'Spiral'], meanings: ['Ibex are shown with long curved horns.', 'Rays around the head look like a sun disk. Interpretations differ.', 'Hunting scenes show people alongside animals.'],
  source: 'Source', light: 'Keep the scene lit', age: 'Surface age', protect: 'Shield the carving', protected: 'Carving shielded', strike: 'Strike the stone', final: 'Now it’s your turn to leave a mark.', create: 'Make your own', model: 'Explore the stone in 3D',
  time: ['1000 BCE', '0', '1000', 'Today'],
  prompt: 'Draw a mark that says something about you', tools: ['Brush', 'Eraser', 'Undo', 'Clear'],
  nick: 'Nickname', caption: 'Caption (40 characters max)', publish: 'Publish', share: 'Share', report: 'Report',
  feeds: ['Recent', 'Top this week', 'All-time top'], local: 'Feed on this device', empty: 'Your drawings will appear here.', like: 'Like',
  blank: 'Add a drawing first.', limit: 'You can publish up to five drawings today.', privateText: 'Remove links and contact details.', saved: 'Saved on this device.', storage: 'Could not save. Check your browser storage.', shared: 'Image ready.', reported: 'Report recorded on this device.',
  point: 'Point at a petroglyph', privacy: 'Camera frames and uploaded photos stay in your browser.', camera: 'Enable camera', upload: 'Upload photo', sample: 'Demo photo', scan: 'Scan', collection: 'Collection', add: 'Save to collection', details: 'Learn more', unrecognized: 'No match was identified for this photo. Try the demo sample.', cameraError: 'Camera unavailable. Upload a photo or open the demo.', imageError: 'Could not open this photo.', demo: 'Known photo demo', place: 'Cholpon-Ata', uncertain: 'This photo does not establish the age or meaning of an individual carving.', firstPost: 'The first post', old: 'Thousands of years ago', nextPost: 'Now make your post',
};
export const stoneCopy = { ru, ky, en };
for (const [copy, site, controls] of [
  [ru, 'Саймалуу-Таш', ['Влево', 'Вправо', 'Отдалить', 'Приблизить']],
  [ky, 'Саймалуу-Таш', ['Солго', 'Оңго', 'Алыстатуу', 'Жакындатуу']],
  [en, 'Saimaluu-Tash', ['Turn left', 'Turn right', 'Zoom out', 'Zoom in']],
]) {
  copy.site = site;
  copy.modelControls = controls;
}
export const sources = [
  'https://whc.unesco.org/en/tentativelists/1512/',
  'https://aigine.kg/?lang=en&page_id=14947',
  'https://aigine.kg/?lang=en&page_id=15297',
];

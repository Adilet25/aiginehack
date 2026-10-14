// Editorial copy deliberately avoids unsupported historical interpretations or dates.
const en = {
  kyrgyzstan: 'Kyrgyzstan · Cultural heritage', eyebrow: 'A living heritage. A new perspective.',
  title: 'Kyrgyz heritage,', titleAccent: 'alive in the present.',
  intro: 'Explore Kyrgyzstan through sacred places, rock art, and the rhythms of the traditional calendar. Let curiosity lead the way.',
  explore: 'Explore the map', create: 'Enter the Stone Workshop', discover: 'Begin the journey',
  heroAlt: 'Yurts under the night sky near Song-Köl, Kyrgyzstan', heroCaption: 'Song-Köl, Kyrgyzstan · Thomas Depenbusch',
  chapterOne: '01 / Explore the heritage', themesTitle: 'Land. Stone. Sky.', themesIntro: 'Three ways into the cultural heritage of Kyrgyzstan. Start with a place, a carved line, or a question about the seasons.',
  themes: [
    { title: 'Sacred places', description: 'Discover places of cultural significance, and approach them with curiosity and respect.', to: '/map', action: 'Explore the cultural map' },
    { title: 'Petroglyphs', description: 'Look closely at rock art. Explore the places where images remain carved into stone.', to: '/map', action: 'Find rock-art locations' },
    { title: 'Traditional calendar', description: 'Explore traditional knowledge of time, nature, and seasonal cycles.', to: '/calendar', action: 'Explore the calendar' },
  ],
  closeLook: 'A closer look / Rock art', stoneTitle: 'Pause. Look closer.', stoneIntro: 'A line, a shape, a surface marked by time. This photograph from the petroglyph museum in Cholpon-Ata invites you to start with observation.',
  stoneAlt: 'Carved animal figures on a boulder at the petroglyph museum in Cholpon-Ata', stoneCaption: 'Petroglyph museum · Cholpon-Ata',
  respect: 'Look without leaving a mark. Do not scratch, trace, or damage rock art. Respect the site and local guidance.',
  openMap: 'Continue to the cultural map', mapNote: 'Map prototype: includes generated demonstration locations. Do not use these as verified travel destinations.',
  chapterTwo: '02 / Take part', experiencesTitle: 'Make curiosity your own.', experiencesIntro: 'Try a creative tool, discover a playful connection, or explore work inspired by rock art.',
  experiences: [
    { title: 'Stone Workshop', description: 'Try digital carving and create your own rock-art-inspired drawing.', action: 'Start creating', to: '/stone-workshop' },
    { title: 'Which petroglyph are you?', description: 'A playful personality quiz inspired by petroglyph motifs. Follow your curiosity.', action: 'Take the quiz', to: '/petroglyph-quiz' },
    { title: 'Community gallery', description: 'Explore contemporary creations and share your response through a vote.', action: 'Visit the gallery', to: '/community-gallery' },
  ],
  communityNote: 'Community features are a local prototype with sample artwork and voting.', leaderboard: 'View the leaderboard', yourJourney: 'Your exploration', journeyTitle: 'Every discovery is a beginning.', profile: 'Open your profile', level: 'Level', points: 'Points', artifacts: 'Collected artifacts', footer: 'Discover. Understand. Care for cultural heritage.', credits: 'Photography & credits', photoTreatment: 'Documentary photographs are cropped for display. The hero is an artistic illustration.',
};
type HomeCopy = typeof en;
const ru: HomeCopy = {
  kyrgyzstan: 'Кыргызстан · Культурное наследие', eyebrow: 'Люди · Места · Живое наследие', title: 'Наследие Кыргызстана.', titleAccent: 'Живое сегодня.',
  intro: 'Откройте Кыргызстан через сакральные места, наскальное искусство и ритмы традиционного календаря. Пусть любопытство станет вашим проводником.',
  explore: 'Исследовать карту', create: 'Войти в мастерскую', discover: 'Начать путешествие', heroAlt: 'Юрты под ночным небом у Сон-Куля, Кыргызстан', heroCaption: 'Сон-Куль, Кыргызстан · Thomas Depenbusch',
  chapterOne: '01 / Знакомство с наследием', themesTitle: 'Земля. Камень. Небо.', themesIntro: 'Три пути к культурному наследию Кыргызстана. Начните с места, линии на камне или вопроса о смене времён года.',
  themes: [
    { title: 'Сакральные места', description: 'Откройте места культурного значения. Знакомьтесь с ними внимательно и с уважением.', to: '/map', action: 'Исследовать культурную карту' },
    { title: 'Петроглифы', description: 'Присмотритесь к наскальному искусству и найдите места, где сохранились изображения на камне.', to: '/map', action: 'Найти места с петроглифами' },
    { title: 'Традиционный календарь', description: 'Познакомьтесь с традиционными знаниями о времени, природе и сезонных циклах.', to: '/calendar', action: 'Открыть календарь' },
  ],
  closeLook: 'В деталях / Наскальное искусство', stoneTitle: 'Остановитесь. Присмотритесь.', stoneIntro: 'Линия, силуэт, поверхность со следами времени. Фотография из музея петроглифов в Чолпон-Ате приглашает начать с простого наблюдения.',
  stoneAlt: 'Изображения животных на камне в музее петроглифов Чолпон-Аты', stoneCaption: 'Музей петроглифов · Чолпон-Ата', respect: 'Наблюдайте, не оставляя следов. Не царапайте, не обводите и не повреждайте петроглифы. Уважайте место и местные рекомендации.',
  openMap: 'Перейти к культурной карте', mapNote: 'Карта — прототип: содержит сгенерированные демонстрационные места. Не используйте их как проверенные цели поездки.',
  chapterTwo: '02 / Участвуйте', experiencesTitle: 'От любопытства к творчеству.', experiencesIntro: 'Попробуйте творческий инструмент, пройдите игровой тест или познакомьтесь с работами, вдохновлёнными наскальным искусством.',
  experiences: [
    { title: 'Каменная мастерская', description: 'Попробуйте цифровую резьбу и создайте свой рисунок по мотивам наскального искусства.', action: 'Начать творить', to: '/stone-workshop' },
    { title: 'Какой ты петроглиф?', description: 'Развлекательный тест по мотивам петроглифов. Следуйте своему любопытству.', action: 'Пройти тест', to: '/petroglyph-quiz' },
    { title: 'Галерея сообщества', description: 'Откройте современные творческие работы и поддержите понравившиеся своим голосом.', action: 'Открыть галерею', to: '/community-gallery' },
  ],
  communityNote: 'Функции сообщества — локальный прототип с примерами работ и голосования.', leaderboard: 'Рейтинг работ', yourJourney: 'Ваше путешествие', journeyTitle: 'Каждое открытие — начало.', profile: 'Открыть профиль', level: 'Уровень', points: 'Очки', artifacts: 'Артефакты', footer: 'Открывать. Понимать. Беречь культурное наследие.', credits: 'Фотографии и авторы', photoTreatment: 'Документальные фотографии кадрированы для показа. Главный экран использует художественную иллюстрацию.',
};
const kg: HomeCopy = {
  kyrgyzstan: 'Кыргызстан · Маданий мурас', eyebrow: 'Адамдар · Жерлер · Жандуу мурас', title: 'Кыргыз мурасы.', titleAccent: 'Бүгүн да жандуу.',
  intro: 'Кыргызстанды ыйык жерлер, аскадагы сүрөттөр жана салттуу календарь аркылуу тааныңыз. Кызыгууңуз сизге жол көрсөтсүн.',
  explore: 'Картаны изилдөө', create: 'Таш устаканасына кирүү', discover: 'Саякатты баштоо', heroAlt: 'Соң-Көлдөгү түнкү асман астындагы боз үйлөр, Кыргызстан', heroCaption: 'Соң-Көл, Кыргызстан · Thomas Depenbusch',
  chapterOne: '01 / Мурас менен таанышуу', themesTitle: 'Жер. Таш. Асман.', themesIntro: 'Кыргызстандын маданий мурасына үч жол. Бир жерден, таштагы сызыктан же жыл мезгилдери жөнүндө суроодон баштаңыз.',
  themes: [
    { title: 'Ыйык жерлер', description: 'Маданий мааниси бар жерлерди тааныңыз. Аларга кызыгуу жана урмат менен мамиле кылыңыз.', to: '/map', action: 'Маданий картаны изилдөө' },
    { title: 'Петроглифтер', description: 'Аскадагы сүрөттөрдү жакындан карап, ташка чегилген сүрөттөр сакталган жерлерди табыңыз.', to: '/map', action: 'Петроглифтерди картадан табуу' },
    { title: 'Салттуу календарь', description: 'Убакыт, жаратылыш жана мезгилдик айлампалар тууралуу салттуу билим менен таанышыңыз.', to: '/calendar', action: 'Календарды ачуу' },
  ],
  closeLook: 'Жакындан кароо / Аскадагы сүрөттөр', stoneTitle: 'Токтоңуз. Көңүл коюп караңыз.', stoneIntro: 'Сызык, сөлөкөт, убакыттын изи калган таш. Чолпон-Атадагы петроглифтер музейинен тартылган бул сүрөт байкоодон баштоого чакырат.',
  stoneAlt: 'Чолпон-Атадагы петроглифтер музейиндеги ташка чегилген жаныбарлардын сүрөттөрү', stoneCaption: 'Петроглифтер музейи · Чолпон-Ата', respect: 'Из калтырбай байкаңыз. Петроглифтерди тырмабаңыз, үстүнөн чийбеңиз жана бузбаңыз. Жерди жана жергиликтүү эрежелерди урматтаңыз.',
  openMap: 'Маданий картага өтүү', mapNote: 'Карта — прототип: анда жасалма көрсөтмө жерлер бар. Аларды текшерилген саякат багыттары катары колдонбоңуз.',
  chapterTwo: '02 / Катышыңыз', experiencesTitle: 'Кызыгуудан чыгармачылыкка.', experiencesIntro: 'Чыгармачылык куралды сынаңыз, көңүл ачуучу тесттен өтүңүз же аскадагы сүрөттөрдөн шыктанган иштерди көрүңүз.',
  experiences: [
    { title: 'Таш устаканасы', description: 'Санарип чегүүнү сынап, аскадагы сүрөттөрдөн шыктанган өз сүрөтүңүздү жаратыңыз.', action: 'Жаратууну баштоо', to: '/stone-workshop' },
    { title: 'Сиз кайсы петроглифсиз?', description: 'Петроглифтердин образдарына негизделген көңүл ачуучу тест. Кызыгууңузду ээрчиңиз.', action: 'Тесттен өтүү', to: '/petroglyph-quiz' },
    { title: 'Коомчулуктун галереясы', description: 'Заманбап чыгармачылык иштерди көрүп, жактырган ишиңизге добуш бериңиз.', action: 'Галереяны ачуу', to: '/community-gallery' },
  ],
  communityNote: 'Коомчулук функциялары — үлгү иштер жана добуш берүү камтылган жергиликтүү прототип.', leaderboard: 'Иштердин рейтинги', yourJourney: 'Сиздин саякатыңыз', journeyTitle: 'Ар бир ачылыш — башталыш.', profile: 'Профилди ачуу', level: 'Деңгээл', points: 'Упайлар', artifacts: 'Артефакттар', footer: 'Ачуу. Түшүнүү. Маданий мурасты сактоо.', credits: 'Сүрөттөр жана авторлор', photoTreatment: 'Документалдык сүрөттөр көрсөтүү үчүн кесилген. Башкы бетте көркөм иллюстрация колдонулган.',
};
export const homeCopy = { en, ru, kg };

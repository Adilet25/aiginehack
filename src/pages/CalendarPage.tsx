import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoonStar,
  Trophy,
  //   Sparkles,
  //   RotateCcw,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import KyrgyzCalendarWheel from "../components/calendar/KyrgyzCalendarWheel";

type KyrgyzMonthInfo = {
  month: number;
  russianName: string;
  kyrgyzName: string;
  togool: string;
  explanation: string;
  funFact: string;
  color: string;
};

type DayMarker = {
  label: string;
  type: "togool" | "cold" | "season" | "sky";
};

const months = [
  {
    month: 0,
    russianName: "Январь",
    kyrgyzName: "Бирдин айы",
    togool: "9 тогоол",
    explanation:
      "Январь в этой системе связан с моментом, когда после обновления Луны проходит 9 дней, и Луна приближается к Үркөр. Поэтому месяц и называется “Бирдин айы 9 тогоол”. Это одна из самых суровых зимних фаз.",
    monthMeaning:
      "Смысл месяца — глубокая зима, тяжёлый холод, выносливость людей и скота.",
    practicalUse:
      "Это период наблюдения за морозами, состоянием скота и переживания самого тяжёлого отрезка зимы.",
    guideText:
      "Если человек знает только “Январь”, ему нужно запомнить простую связку: Январь = Бирдин айы = 9 тогоол = тяжёлая зима.",
    funFact:
      "В документе также сказано, что если новолуние приходится на 9–19 января, может наступать “Арсар ай”, а если на 20–31 января — начинается “Жалган куран 7 тогоол”.",
    color: "from-cyan-500/20 to-sky-500/10",
  },
  {
    month: 1,
    russianName: "Февраль",
    kyrgyzName: "Жалган куран",
    togool: "7 тогоол",
    explanation:
      "Название связано с тем, что в этот период охотникам было трудно различать самцов и самок косули: внешне они были похожи, поэтому месяц называли “ложным кураном”.",
    monthMeaning:
      "Смысл месяца — суровая зима, переход к новому циклу и трудность распознавания природы.",
    practicalUse:
      "Период осознания смены года в традиционной системе; связан с мүчөл и началом нового годового цикла.",
    guideText:
      "Чтобы запомнить: Февраль = Жалган куран = “ложный куран” = ещё зимний, ещё обманчивый период.",
    funFact:
      "В источнике говорится, что без “Жалган куран 7 тогоол” кыргызский новый год по этой системе не начинается. ",
    color: "from-sky-500/20 to-blue-500/10",
  },
  {
    month: 2,
    russianName: "Март",
    kyrgyzName: "Чын куран",
    togool: "5 тогоол",
    explanation:
      "После “Жалган куран” охотники уже могли ясно различать куран и элик. Поэтому март становится “истинным кураном” — Чын куран.",
    monthMeaning:
      "Смысл месяца — переход от зимней неопределённости к ясности и весеннему обновлению.",
    practicalUse:
      "Завершение токсона, уход сильных холодов, весенний поворот года.",
    guideText:
      "Связка для памяти: Март = Чын куран = уже “настоящий”, уже ясно, уже весна начинает побеждать.",
    funFact:
      "В документе сказано, что 13 марта завершается токсон, а 21 марта наступает весеннее равноденствие и Нооруз. ",
    color: "from-emerald-500/20 to-lime-500/10",
  },
  {
    month: 3,
    russianName: "Апрель",
    kyrgyzName: "Бугу",
    togool: "3 тогоол",
    explanation:
      "Апрель объясняется через цикл животных: бугу, марал, куран, элик и других. Также месяц тесно связан с Үркөр и посевной логикой.",
    monthMeaning:
      "Смысл месяца — начало активной земной жизни, наблюдение за животными и земледелием.",
    practicalUse:
      "Важно для понимания сроков посева и того, какие культуры сеять на растущую и убывающую Луну.",
    guideText: "Чтобы запомнить: Апрель = Бугу = животные + посев + Үркөр.",
    funFact:
      "В источнике отдельно объясняется, что после полнолуния лучше сеять корнеплоды, а при новолунии — культуры, дающие урожай над землёй.",
    color: "from-green-500/20 to-emerald-500/10",
  },
  {
    month: 4,
    russianName: "Май",
    kyrgyzName: "Кулжа",
    togool: "1 тогоол",
    explanation:
      "Название связано с циклом архаров и кулжа. Это время, когда природа набирает силу, а Үркөр “опускается на землю” в традиционном понимании.",
    monthMeaning:
      "Смысл месяца — расцвет, зелень, молочность, жизнь и питание.",
    practicalUse:
      "Связан с кымызом, лекарственными травами и укреплением здоровья.",
    guideText: "Простая связка: Май = Кулжа = зелёный, живой, сильный месяц.",
    funFact:
      "В тексте подчёркивается ценность “ууз кымыза” и связь этого периода с укреплением здоровья. ",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    month: 5,
    russianName: "Июнь",
    kyrgyzName: "Теке",
    togool: "23 тогоол",
    explanation:
      "Название июня связано с циклом горных козлов и тоо теке. Это время длинных дней, горной жизни и наблюдения за природой.",
    monthMeaning: "Смысл месяца — высота, горы, сила, длинный день.",
    practicalUse:
      "Показывает, как через животных и солнце наши предки понимали годовой ритм.",
    guideText: "Для запоминания: Июнь = Теке = горы, козлы, длинный день.",
    funFact:
      "В источнике сказано, что 22 июня — самый длинный день и самая короткая ночь.",
    color: "from-amber-500/20 to-yellow-500/10",
  },
  {
    month: 6,
    russianName: "Июль",
    kyrgyzName: "Баш оона",
    togool: "21 тогоол",
    explanation:
      "“Баш оона” означает начало смещения, начало убывания длины дня. С этого момента день понемногу сокращается.",
    monthMeaning: "Смысл месяца — начало поворота лета к осени.",
    practicalUse:
      "В этот период важны наблюдения за Сумбула и условиями на жайлоо.",
    guideText: "Запоминай так: Июль = Баш оона = начало уменьшения дня.",
    funFact: "В материале отдельно выделяются дни Сумбула — с 19 по 25 июля. ",
    color: "from-orange-500/20 to-amber-500/10",
  },
  {
    month: 7,
    russianName: "Август",
    kyrgyzName: "Аяк оона",
    togool: "19 тогоол",
    explanation:
      "Если “Баш оона” — начало смещения, то “Аяк оона” — дальнейшее смещение. Это объясняется даже через то, как солнечный луч падает в боз үй.",
    monthMeaning:
      "Смысл месяца — движение солнца и постепенный отход от летнего пика.",
    practicalUse:
      "Помогает понимать сезонный поворот и ритм жизни в юрте и на пастбищах.",
    guideText:
      "Для памяти: Август = Аяк оона = луч солнца уже ушёл дальше, лето уходит.",
    funFact:
      "Источник связывает название с тем, как солнечный свет через түндүк смещается от очага и “уходит к ногам”.",
    color: "from-orange-500/20 to-red-500/10",
  },
  {
    month: 8,
    russianName: "Сентябрь",
    kyrgyzName: "Тогуздун айы",
    togool: "17 тогоол",
    explanation:
      "Это месяц достатка, зрелости природы и хорошего состояния скота. Он связан с идеей полноты и богатства.",
    monthMeaning: "Смысл месяца — молчулук, токчулук, береке.",
    practicalUse:
      "Показывает, как календарь связан не только с небом, но и с хозяйственной жизнью.",
    guideText:
      "Связка для памяти: Сентябрь = Тогуздун айы = богатство, девятки, достаток.",
    funFact:
      "В источнике говорится, что в сентябре скот и имущество часто дарили “девятками”. ",
    color: "from-yellow-500/20 to-orange-500/10",
  },
  {
    month: 9,
    russianName: "Октябрь",
    kyrgyzName: "Жетинин айы",
    togool: "15 тогоол",
    explanation:
      "Октябрь — это момент, когда уже ощущается дыхание зимы: появляется первый снег и лёд, а человек должен готовиться.",
    monthMeaning: "Смысл месяца — подготовка, осторожность, дисциплина.",
    practicalUse:
      "Это месяц, когда календарь прямо становится руководством к действию: нужно думать о зиме.",
    guideText: "Запоминание: Октябрь = Жетинин айы = уже чувствуется кыш.",
    funFact:
      "В источнике приводятся строки о том, что нельзя плохо готовиться к зиме, иначе она “спросит строго”.",
    color: "from-stone-500/20 to-orange-500/10",
  },
  {
    month: 10,
    russianName: "Ноябрь",
    kyrgyzName: "Бештин айы",
    togool: "13 тогоол",
    explanation:
      "В ноябре день становится заметно короче, а зима уже по-настоящему входит в жизнь.",
    monthMeaning:
      "Смысл месяца — сжатие света, холод, необходимость серьёзной подготовки.",
    practicalUse: "Период поздней осени и начала тяжёлой зимней логики.",
    guideText: "Для памяти: Ноябрь = Бештин айы = света меньше, зима ближе.",
    funFact:
      "Источник связывает этот месяц с усилением ветра, холодом и кыш камылгасы. ",
    color: "from-stone-500/20 to-zinc-500/10",
  },
  {
    month: 11,
    russianName: "Декабрь",
    kyrgyzName: "Үчтүн айы",
    togool: "11 тогоол",
    explanation:
      "Это полностью зимний месяц. Именно с него, 13 декабря, начинается токсон — 90-дневный тяжёлый период.",
    monthMeaning: "Смысл месяца — вход в сердце зимы.",
    practicalUse:
      "Даёт начало самому важному зимнему циклу традиционного календаря.",
    guideText: "Связка: Декабрь = Үчтүн айы = начинается токсон.",
    funFact:
      "Источник прямо объясняет, что токсон длится с 13 декабря до 13 марта. ",
    color: "from-cyan-500/20 to-slate-500/10",
  },
];

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const totalDays = getDaysInMonth(year, month);

  let startDay = firstDay.getDay();
  if (startDay === 0) startDay = 7;

  const days: Array<{
    date: Date | null;
    dayNumber: number | null;
    markers: DayMarker[];
  }> = [];

  for (let i = 1; i < startDay; i++) {
    days.push({ date: null, dayNumber: null, markers: [] });
  }

  for (let day = 1; day <= totalDays; day++) {
    const markers: DayMarker[] = [];
    const date = new Date(year, month, day);

    const isTokson =
      (month === 11 && day >= 13) ||
      month === 0 ||
      month === 1 ||
      (month === 2 && day <= 13);

    const isKyshChilde =
      (month === 0 && day >= 8) || (month === 1 && day <= 18);

    const isNauryz = month === 2 && day === 21;
    const isSumbula = month === 6 && day >= 19 && day <= 25;
    const isTogool = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23].includes(day);

    if (isTokson) markers.push({ label: "Токсон", type: "cold" });
    if (isKyshChilde) markers.push({ label: "Кыш чилде", type: "cold" });
    if (isNauryz) markers.push({ label: "Нооруз", type: "season" });
    if (isSumbula) markers.push({ label: "Сумбула", type: "sky" });
    if (isTogool) markers.push({ label: "Тогоол", type: "togool" });

    days.push({
      date,
      dayNumber: day,
      markers,
    });
  }

  while (days.length % 7 !== 0) {
    days.push({ date: null, dayNumber: null, markers: [] });
  }

  return days;
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

const markerStyles = {
  togool: "bg-amber-500/15 text-amber-100 border-amber-400/20",
  cold: "bg-cyan-500/15 text-cyan-100 border-cyan-400/20",
  season: "bg-emerald-500/15 text-emerald-100 border-emerald-400/20",
  sky: "bg-violet-500/15 text-violet-100 border-violet-400/20",
};

const calendarGlossary = [
  {
    term: "Тогоол",
    meaning:
      "Максимально близкое расположение Луны и Үркөр (Плеяд) в традиционном понимании календаря.",
    simple:
      "Проще: особый момент сближения Ай и Үркөр, по которому назывались месяцы.",
  },
  {
    term: "Үркөр",
    meaning:
      "Скопление звёзд Плеяды, очень важное для кыргызского календаря и сезонных наблюдений.",
    simple:
      "Проще: звёздная группа, по которой предки понимали время года и ритм природы.",
  },
  {
    term: "Токсон",
    meaning: "90-дневный зимний период с 13 декабря по 13 марта.",
    simple: "Проще: длинный тяжёлый зимний цикл.",
  },
  {
    term: "Кыш чилде",
    meaning:
      "Сорокадневный период самого сурового зимнего холода с 8 января по 18 февраля.",
    simple: "Проще: самая жёсткая часть зимы.",
  },
  {
    term: "Арсар ай",
    meaning: "Особый месяц, который может появляться в январе не каждый год.",
    simple:
      "Проще: дополнительное редкое название месяца внутри январского цикла.",
  },
  {
    term: "Сумбула",
    meaning:
      "Звезда/небесный знак, появление которого связывали с изменениями погоды и жизни на жайлоо.",
    simple: "Проще: важный небесный знак середины лета.",
  },
  {
    term: "Мүчөл",
    meaning: "Возрастной цикл, повторяющийся каждые 12 лет.",
    simple: "Проще: традиционный жизненный цикл по 12-летним этапам.",
  },
  {
    term: "Ай арасы",
    meaning:
      "Период обновления Луны, связанный с началом нового лунного цикла.",
    simple: "Проще: момент, когда начинается новый лунный месяц.",
  },
];

const calendarGuide = [
  "Сначала смотри на привычный месяц: Январь, Февраль, Март.",
  "Потом рядом смотри кыргызское название этого месяца.",
  "Дальше читай короткое объяснение: почему месяц называется именно так.",
  "После этого обращай внимание на термины: Үркөр, тогоол, токсон, кыш чилде.",
  "В конце смотри практический смысл: что этот месяц значил для жизни, природы, скота или посева.",
];

// const seasonalPhases = [
//   {
//     id: 'winter-childe',
//     title: 'Кыш чилде',
//     period: '8 января — 18 февраля',
//     startMonth: 0, // January
//     startDay: 8,
//     endMonth: 1, // February
//     endDay: 18,
//     color: 'from-cyan-500/30 to-blue-500/20',
//     border: 'border-cyan-400/20',
//     text: 'text-cyan-100',
//     description:
//       'Сорокадневный период самого сурового зимнего холода. В традиционном календаре это одна из самых тяжёлых фаз года.',
//   },
//   {
//     id: 'summer-childe',
//     title: 'Жай чилде',
//     period: '8 июля — 18 августа',
//     startMonth: 6, // July
//     startDay: 8,
//     endMonth: 7, // August
//     endDay: 18,
//     color: 'from-amber-500/30 to-orange-500/20',
//     border: 'border-amber-400/20',
//     text: 'text-amber-100',
//     description:
//       'Сорокадневный период летней жары. Это время пика тепла, активной жизни на жайлоо и важного сезонного поворота.',
//   },
// ]

// function getDayOfYear(month: number, day: number) {
//   const date = new Date(2026, month, day)
//   const start = new Date(2026, 0, 1)
//   const diff = date.getTime() - start.getTime()
//   return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
// }

// function getPercentOfYear(month: number, day: number) {
//   return (getDayOfYear(month, day) / 365) * 100
// }

export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [quizMonth, setQuizMonth] = useState(() => {
    return months[Math.floor(Math.random() * months.length)];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthInfo = months[month];
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const selectedMonthInfo = months[selectedDate.getMonth()];

  const quizOptions = useMemo(() => {
    const shuffled = [...months]
      .sort(() => Math.random() - 0.5)
      .filter((m) => m.month !== quizMonth.month)
      .slice(0, 3);

    return [...shuffled, quizMonth].sort(() => Math.random() - 0.5);
  }, [quizMonth]);

  const nextQuiz = () => {
    setShowAnswer(false);
    setQuizMonth(months[Math.floor(Math.random() * months.length)]);
  };

  const handleQuizAnswer = (option: KyrgyzMonthInfo) => {
    if (showAnswer) return;

    if (option.month === quizMonth.month) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setShowAnswer(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kyrgyz Sky Calendar"
        subtitle="Привычный календарь + кыргызские названия месяцев + интерактивное обучение."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="glow-card panel-ornament rounded-3xl p-5 md:p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Calendar view
                </p>
                <h2 className="mt-1 text-3xl font-black text-white">
                  {monthInfo.russianName} {year}
                </h2>
                <p className="mt-2 text-sm text-amber-200">
                  Кыргызча: {monthInfo.kyrgyzName} • {monthInfo.togool}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={() => {
                    setCurrentDate(
                      new Date(today.getFullYear(), today.getMonth(), 1),
                    );
                    setSelectedDate(today);
                  }}
                  className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20"
                >
                  Today
                </button>

                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div
              className={`mb-6 rounded-3xl border border-white/10 bg-gradient-to-br ${monthInfo.color} p-5`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-black/20 p-3">
                  <MoonStar size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {monthInfo.russianName} = {monthInfo.kyrgyzName}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-amber-100">
                    {monthInfo.togool}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                    {monthInfo.explanation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-7 gap-2">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white/55"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((item, index) => {
                const isToday = item.date
                  ? isSameDate(item.date, today)
                  : false;
                const isSelected = item.date
                  ? isSameDate(item.date, selectedDate)
                  : false;

                return (
                  <button
                    key={index}
                    disabled={!item.date}
                    onClick={() => item.date && setSelectedDate(item.date)}
                    className={`min-h-[110px] rounded-3xl border p-3 text-left transition-all ${
                      !item.date
                        ? "cursor-default border-transparent bg-transparent opacity-0"
                        : isSelected
                          ? "border-amber-400/30 bg-amber-500/10 shadow-[0_0_20px_rgba(197,139,72,0.10)]"
                          : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    {item.date && (
                      <div className="flex h-full flex-col">
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`text-sm font-bold ${isToday ? "text-emerald-300" : "text-white"}`}
                          >
                            {item.dayNumber}
                          </span>

                          {isToday && (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-100">
                              Today
                            </span>
                          )}
                        </div>

                        <div className="mt-auto flex flex-col gap-1">
                          {item.markers.slice(0, 2).map((marker, i) => (
                            <span
                              key={`${marker.label}-${i}`}
                              className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${markerStyles[marker.type]}`}
                            >
                              {marker.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <KyrgyzCalendarWheel />

          <div className="glow-card panel-ornament rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500/15 p-3">
                <Trophy size={18} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Learn & Play</h3>
                <p className="text-sm text-white/60">
                  Угадай кыргызское название месяца и запоминай через игру.
                </p>
              </div>
            </div>

            <div className="mb-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Russian month
                </p>
                <p className="mt-2 text-lg font-bold text-white">
                  {quizMonth.russianName}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                <p className="text-xs uppercase tracking-wide text-amber-100/60">
                  Score
                </p>
                <p className="mt-2 text-lg font-bold text-amber-100">{score}</p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-100/60">
                  Streak
                </p>
                <p className="mt-2 text-lg font-bold text-emerald-100">
                  {streak}
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {quizOptions.map((option) => (
                <button
                  key={option.month}
                  onClick={() => handleQuizAnswer(option)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    showAnswer && option.month === quizMonth.month
                      ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-50"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <p className="text-base font-semibold">{option.kyrgyzName}</p>
                  <p className="mt-1 text-xs text-white/50">{option.togool}</p>
                </button>
              ))}
            </div>

            {showAnswer && (
              <div className="mt-5 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5">
                <p className="text-xs uppercase tracking-wide text-blue-100/60">
                  Correct answer
                </p>
                <h4 className="mt-2 text-xl font-bold text-blue-50">
                  {quizMonth.russianName} = {quizMonth.kyrgyzName}
                </h4>
                <p className="mt-3 text-sm leading-7 text-blue-50/90">
                  {quizMonth.funFact}
                </p>

                <button
                  onClick={nextQuiz}
                  className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Next round
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glow-card panel-ornament rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Selected date
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              {selectedDate.getDate()}{" "}
              {months[selectedDate.getMonth()].russianName}
            </h2>
            <p className="mt-2 text-sm font-semibold text-amber-200">
              Кыргызча: {selectedMonthInfo.kyrgyzName} •{" "}
              {selectedMonthInfo.togool}
            </p>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-wide text-white/40">
                Easy explanation
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {selectedMonthInfo.explanation}
              </p>
            </div>

            {/* <div className="mt-4 rounded-3xl border border-violet-400/20 bg-violet-500/10 p-5">
              <div className="flex items-center gap-2 text-violet-100">
                <Sparkles size={16} />
                <p className="text-xs uppercase tracking-wide">How to remember</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-violet-50/90">
                Сначала человек видит привычный месяц, например <b>{selectedMonthInfo.russianName}</b>.
                Потом рядом постоянно повторяется кыргызское название — <b>{selectedMonthInfo.kyrgyzName}</b>.
                Через календарь, клики и quiz мозг начинает запоминать это естественно, а не через зубрежку.
              </p>
            </div> */}
          </div>

          <div className="glow-card panel-ornament rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white">
              Guide to the calendar
            </h3>
            <div className="mt-4 space-y-3">
              {calendarGuide.map((step, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white/75"
                >
                  <span className="mr-2 font-bold text-amber-300">
                    {index + 1}.
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="glow-card panel-ornament rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white">Glossary</h3>
            <div className="mt-4 space-y-3">
              {calendarGlossary.map((item) => (
                <div
                  key={item.term}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <h4 className="text-base font-bold text-amber-200">
                    {item.term}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    {item.meaning}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/55">
                    <span className="font-semibold text-white/70">Просто:</span>{" "}
                    {item.simple}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="glow-card panel-ornament rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-white/5 p-3">
                <RotateCcw size={18} />
              </div>
              <h3 className="text-xl font-bold text-white">Why this works</h3>
            </div>

            <div className="space-y-3 text-sm leading-7 text-white/70">
              <p>1. Человек не теряется, потому что сначала видит русский месяц.</p>
              <p>2. Кыргызское название всё время рядом и повторяется.</p>
              <p>3. Календарь даёт визуальную привычку.</p>
              <p>4. Quiz превращает обучение в игру.</p>
              <p>5. Очки и streak дают удовольствие и мотивацию.</p>
            </div>
          </div>

          <div className="glow-card panel-ornament rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white">Why it matters</h3>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Такой формат лучше обычной справки: он помогает человеку сравнивать
              современный календарь с кыргызским, понимать названия месяцев,
              тогоол, цикличность и сезонность. Это прямо соответствует задаче
              хакатона по традиционному календарю. 
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

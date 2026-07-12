import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoonStar,
  Trophy,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { useLang } from "../app/providers/LanguageProvider";
import KyrgyzCalendarWheel from "../components/calendar/KyrgyzCalendarWheel";
import type { Lang } from "../types";

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

function getMonths(lang: Lang) {
  if (lang === "en") {
    return [
      {
        month: 0,
        russianName: "January",
        kyrgyzName: "Birdin aiy",
        togool: "9 togool",
        explanation:
          "January in this system is tied to the moment when, after the Moon renews, 9 days pass and the Moon approaches Ürkör. That is why the month is called “Birdin aiy 9 togool”. This is one of the harshest winter phases.",
        funFact:
          "The document also says that if the new moon falls on January 9–19, “Arsar ai” may begin, and if it falls on January 20–31, “Zhalgan kuran 7 togool” begins.",
        color: "from-cyan-500/20 to-sky-500/10",
      },
      {
        month: 1,
        russianName: "February",
        kyrgyzName: "Zhalgan kuran",
        togool: "7 togool",
        explanation:
          "The name comes from the fact that during this period hunters had difficulty telling male and female roe deer apart: they looked alike, so the month was called the “false kuran”.",
        funFact:
          "The source says that without “Zhalgan kuran 7 togool” the Kyrgyz new year in this system does not begin.",
        color: "from-sky-500/20 to-blue-500/10",
      },
      {
        month: 2,
        russianName: "March",
        kyrgyzName: "Chyn kuran",
        togool: "5 togool",
        explanation:
          "After “Zhalgan kuran”, hunters could clearly tell kuran and elik apart. That is why March becomes the “true kuran” — Chyn kuran.",
        funFact:
          "The document says that tokson ends on March 13, and the spring equinox and Nooruz fall on March 21.",
        color: "from-emerald-500/20 to-lime-500/10",
      },
      {
        month: 3,
        russianName: "April",
        kyrgyzName: "Bugu",
        togool: "3 togool",
        explanation:
          "April is explained through the cycle of animals: bugu, maral, kuran, elik and others. The month is also closely tied to Ürkör and sowing logic.",
        funFact:
          "The source explicitly explains that after the full moon it is better to sow root crops, and at the new moon — crops that yield above the ground.",
        color: "from-green-500/20 to-emerald-500/10",
      },
      {
        month: 4,
        russianName: "May",
        kyrgyzName: "Kulja",
        togool: "1 togool",
        explanation:
          "The name is connected with the cycle of arkhars and kulja. This is the time when nature gains strength, and Ürkör “descends to the earth” in the traditional understanding.",
        funFact:
          "The text emphasizes the value of “uuz kymyz” and the connection of this period with strengthening health.",
        color: "from-emerald-500/20 to-teal-500/10",
      },
      {
        month: 5,
        russianName: "June",
        kyrgyzName: "Teke",
        togool: "23 togool",
        explanation:
          "The name of June is tied to the cycle of mountain goats and too teke. This is a time of long days, mountain life and observation of nature.",
        funFact:
          "The source says that June 22 is the longest day and the shortest night.",
        color: "from-amber-500/20 to-yellow-500/10",
      },
      {
        month: 6,
        russianName: "July",
        kyrgyzName: "Bash oona",
        togool: "21 togool",
        explanation:
          "“Bash oona” means the beginning of the shift, the beginning of the decrease in day length. From this moment, the day gradually shortens.",
        funFact: "The material separately highlights the days of Sumbula — from July 19 to 25.",
        color: "from-orange-500/20 to-amber-500/10",
      },
      {
        month: 7,
        russianName: "August",
        kyrgyzName: "Ayak oona",
        togool: "19 togool",
        explanation:
          "If “Bash oona” is the beginning of the shift, then “Ayak oona” is the further shift. This is explained even through how the sunbeam falls in a boz uy.",
        funFact:
          "The source connects the name with how sunlight through the tündük shifts away from the hearth and “moves toward the feet”.",
        color: "from-orange-500/20 to-red-500/10",
      },
      {
        month: 8,
        russianName: "September",
        kyrgyzName: "Toguzdun aiy",
        togool: "17 togool",
        explanation:
          "This is a month of abundance, maturity of nature and good condition of livestock. It is connected with the idea of fullness and wealth.",
        funFact:
          "The source says that in September, livestock and property were often given in “nines”.",
        color: "from-yellow-500/20 to-orange-500/10",
      },
      {
        month: 9,
        russianName: "October",
        kyrgyzName: "Zhetinin aiy",
        togool: "15 togool",
        explanation:
          "October is the moment when the breath of winter is already felt: the first snow and ice appear, and a person must prepare.",
        funFact:
          "The source includes lines about how one should not prepare poorly for winter, otherwise it will “ask strictly”.",
        color: "from-stone-500/20 to-orange-500/10",
      },
      {
        month: 10,
        russianName: "November",
        kyrgyzName: "Beshtin aiy",
        togool: "13 togool",
        explanation:
          "In November, the day becomes noticeably shorter, and winter truly enters life.",
        funFact:
          "The source connects this month with stronger wind, cold and kysh kamyldasy.",
        color: "from-stone-500/20 to-zinc-500/10",
      },
      {
        month: 11,
        russianName: "December",
        kyrgyzName: "Üchtün aiy",
        togool: "11 togool",
        explanation:
          "This is a fully winter month. It is from it, on December 13, that tokson begins — the 90-day harsh period.",
        funFact:
          "The source directly explains that tokson lasts from December 13 to March 13.",
        color: "from-cyan-500/20 to-slate-500/10",
      },
    ];
  }

  return [
    {
      month: 0,
      russianName: "Январь",
      kyrgyzName: "Бирдин айы",
      togool: "9 тогоол",
      explanation:
        "Январь в этой системе связан с моментом, когда после обновления Луны проходит 9 дней, и Луна приближается к Үркөр. Поэтому месяц и называется “Бирдин айы 9 тогоол”. Это одна из самых суровых зимних фаз.",
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
      funFact:
        "В источнике говорится, что без “Жалган куран 7 тогоол” кыргызский новый год по этой системе не начинается.",
      color: "from-sky-500/20 to-blue-500/10",
    },
    {
      month: 2,
      russianName: "Март",
      kyrgyzName: "Чын куран",
      togool: "5 тогоол",
      explanation:
        "После “Жалган куран” охотники уже могли ясно различать куран и элик. Поэтому март становится “истинным кураном” — Чын куран.",
      funFact:
        "В документе сказано, что 13 марта завершается токсон, а 21 марта наступает весеннее равноденствие и Нооруз.",
      color: "from-emerald-500/20 to-lime-500/10",
    },
    {
      month: 3,
      russianName: "Апрель",
      kyrgyzName: "Бугу",
      togool: "3 тогоол",
      explanation:
        "Апрель объясняется через цикл животных: бугу, марал, куран, элик и других. Также месяц тесно связан с Үркөр и посевной логикой.",
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
      funFact:
        "В тексте подчёркивается ценность “ууз кымыза” и связь этого периода с укреплением здоровья.",
      color: "from-emerald-500/20 to-teal-500/10",
    },
    {
      month: 5,
      russianName: "Июнь",
      kyrgyzName: "Теке",
      togool: "23 тогоол",
      explanation:
        "Название июня связано с циклом горных козлов и тоо теке. Это время длинных дней, горной жизни и наблюдения за природой.",
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
      funFact: "В материале отдельно выделяются дни Сумбула — с 19 по 25 июля.",
      color: "from-orange-500/20 to-amber-500/10",
    },
    {
      month: 7,
      russianName: "Август",
      kyrgyzName: "Аяк оона",
      togool: "19 тогоол",
      explanation:
        "Если “Баш оона” — начало смещения, то “Аяк оона” — дальнейшее смещение. Это объясняется даже через то, как солнечный луч падает в боз үй.",
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
      funFact:
        "В источнике говорится, что в сентябре скот и имущество часто дарили “девятками”.",
      color: "from-yellow-500/20 to-orange-500/10",
    },
    {
      month: 9,
      russianName: "Октябрь",
      kyrgyzName: "Жетинин айы",
      togool: "15 тогоол",
      explanation:
        "Октябрь — это момент, когда уже ощущается дыхание зимы: появляется первый снег и лёд, а человек должен готовиться.",
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
      funFact:
        "Источник связывает этот месяц с усилением ветра, холодом и кыш камылгасы.",
      color: "from-stone-500/20 to-zinc-500/10",
    },
    {
      month: 11,
      russianName: "Декабрь",
      kyrgyzName: "Үчтүн айы",
      togool: "11 тогоол",
      explanation:
        "Это полностью зимний месяц. Именно с него, 13 декабря, начинается токсон — 90-дневный тяжёлый период.",
      funFact:
        "Источник прямо объясняет, что токсон длится с 13 декабря до 13 марта.",
      color: "from-cyan-500/20 to-slate-500/10",
    },
  ];
}

function getWeekdays(lang: Lang) {
  return lang === "en"
    ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    : ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
}

function getDayMarkers(month: number, day: number, lang: Lang): DayMarker[] {
  const markers: DayMarker[] = [];

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

  if (isTokson) markers.push({ label: lang === "en" ? "Tokson" : "Токсон", type: "cold" });
  if (isKyshChilde) markers.push({ label: lang === "en" ? "Kysh childe" : "Кыш чилде", type: "cold" });
  if (isNauryz) markers.push({ label: lang === "en" ? "Nooruz" : "Нооруз", type: "season" });
  if (isSumbula) markers.push({ label: lang === "en" ? "Sumbula" : "Сумбула", type: "sky" });
  if (isTogool) markers.push({ label: lang === "en" ? "Togool" : "Тогоол", type: "togool" });

  return markers;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getCalendarDays(year: number, month: number, lang: Lang) {
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
    const date = new Date(year, month, day);
    const markers = getDayMarkers(month, day, lang);

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
  togool: "bg-amber-500/15 text-stone-900 dark:text-white border-amber-400/20",
  cold: "bg-cyan-500/15 text-cyan-100 border-cyan-400/20",
  season:
    "bg-emerald-500/15 text-stone-900 dark:text-white border-emerald-400/20",
  sky: "bg-violet-500/15 text-violet-100 border-violet-400/20",
};

function getCalendarGlossary(lang: Lang) {
  if (lang === "en") {
    return [
      {
        term: "Togool",
        meaning:
          "The closest approach of the Moon and Ürkör (Pleiades) in the traditional understanding of the calendar.",
        simple:
          "Simply: a special moment of approach between Ai and Ürkör, by which months were named.",
      },
      {
        term: "Ürkör",
        meaning:
          "The Pleiades star cluster, very important for the Kyrgyz calendar and seasonal observations.",
        simple:
          "Simply: a star group by which ancestors understood the season and the rhythm of nature.",
      },
      {
        term: "Tokson",
        meaning: "The 90-day winter period from December 13 to March 13.",
        simple: "Simply: a long, harsh winter cycle.",
      },
      {
        term: "Kysh childe",
        meaning:
          "A forty-day period of the harshest winter cold from January 8 to February 18.",
        simple: "Simply: the toughest part of winter.",
      },
      {
        term: "Arsar ai",
        meaning: "A special month that may appear in January, not every year.",
        simple:
          "Simply: an additional rare month name within the January cycle.",
      },
      {
        term: "Sumbula",
        meaning:
          "A star/heavenly sign whose appearance was linked to changes in weather and life on the jailoo.",
        simple: "Simply: an important mid-summer heavenly sign.",
      },
      {
        term: "Müchöl",
        meaning: "An age cycle that repeats every 12 years.",
        simple: "Simply: a traditional 12-year life cycle.",
      },
      {
        term: "Ai arasy",
        meaning:
          "The period of Moon renewal, associated with the beginning of a new lunar cycle.",
        simple: "Simply: the moment when a new lunar month begins.",
      },
    ];
  }

  return [
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
}

function getCalendarGuide(lang: Lang) {
  if (lang === "en") {
    return [
      "First look at the familiar month: January, February, March.",
      "Then look next to it at the Kyrgyz name of this month.",
      "Next read the short explanation: why the month is called that.",
      "After that, pay attention to the terms: Ürkör, togool, tokson, kysh childe.",
      "Finally, look at the practical meaning: what this month meant for life, nature, livestock or sowing.",
    ];
  }

  return [
    "Сначала смотри на привычный месяц: Январь, Февраль, Март.",
    "Потом рядом смотри кыргызское название этого месяца.",
    "Дальше читай короткое объяснение: почему месяц называется именно так.",
    "После этого обращай внимание на термины: Үркөр, тогоол, токсон, кыш чилде.",
    "В конце смотри практический смысл: что этот месяц значил для жизни, природы, скота или посева.",
  ];
}

export default function CalendarPage() {
  const { t, lang } = useLang();
  const months = useMemo(() => getMonths(lang), [lang]);
  const weekdays = useMemo(() => getWeekdays(lang), [lang]);

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

  // Re-roll quiz month when language changes
  useEffect(() => {
    setQuizMonth(months[Math.floor(Math.random() * months.length)]);
    setShowAnswer(false);
  }, [months]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthInfo = months[month];
  const days = useMemo(() => getCalendarDays(year, month, lang), [year, month, lang]);

  const selectedMonthInfo = months[selectedDate.getMonth()];

  const quizOptions = useMemo(() => {
    const shuffled = [...months]
      .sort(() => Math.random() - 0.5)
      .filter((m) => m.month !== quizMonth.month)
      .slice(0, 3);

    return [...shuffled, quizMonth].sort(() => Math.random() - 0.5);
  }, [quizMonth, months]);

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

  const calendarGlossary = useMemo(() => getCalendarGlossary(lang), [lang]);
  const calendarGuide = useMemo(() => getCalendarGuide(lang), [lang]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.calendarTitle}
        subtitle={t.calendarSubtitle}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="glow-card panel-ornament rounded-3xl p-5 md:p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-900 dark:text-white/40">
                  {t.calendarView}
                </p>
                <h2 className="mt-1 text-3xl font-black text-stone-900 dark:text-white">
                  {monthInfo.russianName} {year}
                </h2>
                <p className="mt-2 text-sm text-amber-700 dark:text-amber-200">
                  {lang === "en" ? "Kyrgyz" : "Кыргызча"}: {monthInfo.kyrgyzName} • {monthInfo.togool}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-stone-900 dark:text-white transition hover:bg-white/10"
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
                  className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white transition hover:bg-amber-500/20"
                >
                  {t.today}
                </button>

                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-stone-900 dark:text-white transition hover:bg-white/10"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div
              className={`mb-6 rounded-3xl border border-white/10 bg-gradient-to-br ${monthInfo.color} p-5`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-stone-100 dark:bg-black/20 p-3">
                  <MoonStar size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                    {monthInfo.russianName} = {monthInfo.kyrgyzName}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-stone-900 dark:text-white">
                    {monthInfo.togool}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-900 dark:text-white/85">
                    {monthInfo.explanation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-7 gap-2">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-900 dark:text-white/55"
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
                          ? "border-amber-400/30 bg-amber-100 shadow-[0_0_20px_rgba(197,139,72,0.10)] dark:bg-amber-500/10"
                          : "border-stone-200 bg-white/60 hover:border-stone-300 hover:bg-stone-50 dark:border-white/10 dark:bg-black/20 dark:hover:border-white/20 dark:hover:bg-white/5"
                    }`}
                  >
                    {item.date && (
                      <div className="flex h-full flex-col">
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`text-sm font-bold ${isToday ? "text-emerald-300" : "text-stone-900 dark:text-white"}`}
                          >
                            {item.dayNumber}
                          </span>

                          {isToday && (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase text-stone-900 dark:text-white">
                              {t.today}
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
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                  {t.learnPlay}
                </h3>
                <p className="text-sm text-stone-900 dark:text-white/60">
                  {t.learnPlayDesc}
                </p>
              </div>
            </div>

            <div className="mb-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-white/10 dark:bg-black/20">
                <p className="text-xs uppercase tracking-wide text-stone-900 dark:text-white/40">
                  {t.russianMonth}
                </p>
                <p className="mt-2 text-lg font-bold text-stone-900 dark:text-white">
                  {quizMonth.russianName}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-50 p-4 dark:bg-amber-500/10">
                <p className="text-xs uppercase tracking-wide text-stone-900 dark:text-white/60">
                  {t.score}
                </p>
                <p className="mt-2 text-lg font-bold text-stone-900 dark:text-white">
                  {score}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-50 p-4 dark:bg-emerald-500/10">
                <p className="text-xs uppercase tracking-wide text-stone-900 dark:text-white/60">
                  {t.streak}
                </p>
                <p className="mt-2 text-lg font-bold text-stone-900 dark:text-white">
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
                      : "border-white/10 bg-white/5 text-stone-900 dark:text-white hover:bg-white/10"
                  }`}
                >
                  <p className="text-base font-semibold">{option.kyrgyzName}</p>
                  <p className="mt-1 text-xs text-stone-900 dark:text-white/50">
                    {option.togool}
                  </p>
                </button>
              ))}
            </div>

            {showAnswer && (
              <div className="mt-5 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5">
                <p className="text-xs uppercase tracking-wide text-blue-100/60">
                  {t.correctAnswer}
                </p>
                <h4 className="mt-2 text-xl font-bold text-blue-50">
                  {quizMonth.russianName} = {quizMonth.kyrgyzName}
                </h4>
                <p className="mt-3 text-sm leading-7 text-blue-50/90">
                  {quizMonth.funFact}
                </p>

                <button
                  onClick={nextQuiz}
                  className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white transition hover:bg-white/20"
                >
                  {t.nextRound}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glow-card panel-ornament rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-900 dark:text-white/40">
              {t.selectedDate}
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-900 dark:text-white">
              {selectedDate.getDate()}{" "}
              {months[selectedDate.getMonth()].russianName}
            </h2>
            <p className="mt-2 text-sm font-semibold text-amber-700 dark:text-amber-200">
              {lang === "en" ? "Kyrgyz" : "Кыргызча"}: {selectedMonthInfo.kyrgyzName} •{" "}
              {selectedMonthInfo.togool}
            </p>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-wide text-stone-900 dark:text-white/40">
                {t.easyExplanation}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-900 dark:text-white/80">
                {selectedMonthInfo.explanation}
              </p>
            </div>
          </div>

          <div className="glow-card panel-ornament rounded-3xl p-6">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              {t.guideTitle}
            </h3>
            <div className="mt-4 space-y-3">
              {calendarGuide.map((step, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-900 dark:border-white/10 dark:bg-black/20 dark:text-white/75"
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
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              {t.glossaryTitle}
            </h3>
            <div className="mt-4 space-y-3">
              {calendarGlossary.map((item) => (
                <div
                  key={item.term}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-white/10 dark:bg-black/20"
                >
                  <h4 className="text-base font-bold text-amber-700 dark:text-amber-200">
                    {item.term}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-stone-900 dark:text-white/75">
                    {item.meaning}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-stone-900 dark:text-white/55">
                    <span className="font-semibold text-stone-900 dark:text-white/70">
                      {t.simply}
                    </span>{" "}
                    {item.simple}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

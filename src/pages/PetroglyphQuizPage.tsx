import { useMemo, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useLang } from "../app/providers/LanguageProvider";
import type { Lang } from "../types";

type Archetype = "goat" | "deer" | "hunter" | "rider" | "sun" | "ritual";

type Option = {
  text: string;
  image: string;
  scores: Partial<Record<Archetype, number>>;
};

type Question = {
  id: number;
  text: string;
  options: Option[];
};

function getQuestions(lang: Lang): Question[] {
  if (lang === "en") {
    return [
      {
        id: 1,
        text: "Which landscape is closer to you?",
        options: [
          { text: "High mountains and cliffs", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2, deer: 1 } },
          { text: "Open steppe and movement", image: "/petroglyph-quiz/mountains.jpg", scores: { rider: 2, hunter: 1 } },
          { text: "A stone with a sign and a symbol", image: "/petroglyph-quiz/mountains.jpg", scores: { sun: 2, ritual: 1 } },
          { text: "A place where history is felt", image: "/petroglyph-quiz/mountains.jpg", scores: { deer: 1, ritual: 2 } },
        ],
      },
      {
        id: 2,
        text: "What is closer to your character?",
        options: [
          { text: "Persistence and strength", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2 } },
          { text: "Sensitivity and beauty", image: "/petroglyph-quiz/mountains.jpg", scores: { deer: 2 } },
          { text: "Precision and strategy", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 2 } },
          { text: "Leadership and movement", image: "/petroglyph-quiz/mountains.jpg", scores: { rider: 2 } },
        ],
      },
      {
        id: 3,
        text: "Which image on stone catches you more?",
        options: [
          { text: "Animal on a slope", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2, deer: 1 } },
          { text: "Hunting scene", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 2 } },
          { text: "Rider in motion", image: "/petroglyph-quiz/mountains.jpg", scores: { rider: 2 } },
          { text: "Solar or circular sign", image: "/petroglyph-quiz/mountains.jpg", scores: { sun: 2 } },
        ],
      },
      {
        id: 4,
        text: "What is closer to you in life?",
        options: [
          { text: "Climbing higher and not giving up", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2 } },
          { text: "Searching for hidden meaning", image: "/petroglyph-quiz/mountains.jpg", scores: { sun: 2, deer: 1 } },
          { text: "Being in action", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 1, rider: 2 } },
          { text: "Conveying atmosphere and energy", image: "/petroglyph-quiz/mountains.jpg", scores: { ritual: 2 } },
        ],
      },
      {
        id: 5,
        text: "Which role do you play more often?",
        options: [
          { text: "Quiet support", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2, deer: 1 } },
          { text: "Observer and feeler", image: "/petroglyph-quiz/mountains.jpg", scores: { deer: 2, sun: 1 } },
          { text: "The one who goes first", image: "/petroglyph-quiz/mountains.jpg", scores: { rider: 2 } },
          { text: "The one who catches the moment", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 2 } },
        ],
      },
      {
        id: 6,
        text: "What would you like to see in person?",
        options: [
          { text: "Tootoke and animals", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2, deer: 1 } },
          { text: "Deer and flowing lines", image: "/petroglyph-quiz/mountains.jpg", scores: { deer: 2 } },
          { text: "Hunters and an action scene", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 2 } },
          { text: "Ritual, sign or sun", image: "/petroglyph-quiz/mountains.jpg", scores: { ritual: 1, sun: 2 } },
        ],
      },
    ];
  }

  return [
    {
      id: 1,
      text: "Какой пейзаж тебе ближе?",
      options: [
        { text: "Высокие горы и скалы", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2, deer: 1 } },
        { text: "Открытая степь и движение", image: "/petroglyph-quiz/mountains.jpg", scores: { rider: 2, hunter: 1 } },
        { text: "Камень со знаком и символом", image: "/petroglyph-quiz/mountains.jpg", scores: { sun: 2, ritual: 1 } },
        { text: "Место, где чувствуется история", image: "/petroglyph-quiz/mountains.jpg", scores: { deer: 1, ritual: 2 } },
      ],
    },
    {
      id: 2,
      text: "Что тебе ближе по характеру?",
      options: [
        { text: "Упорство и сила", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2 } },
        { text: "Чуткость и красота", image: "/petroglyph-quiz/mountains.jpg", scores: { deer: 2 } },
        { text: "Точность и стратегия", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 2 } },
        { text: "Лидерство и движение", image: "/petroglyph-quiz/mountains.jpg", scores: { rider: 2 } },
      ],
    },
    {
      id: 3,
      text: "Какой образ на камне тебя больше цепляет?",
      options: [
        { text: "Животное на склоне", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2, deer: 1 } },
        { text: "Сцена охоты", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 2 } },
        { text: "Всадник в движении", image: "/petroglyph-quiz/mountains.jpg", scores: { rider: 2 } },
        { text: "Солнечный или круговой знак", image: "/petroglyph-quiz/mountains.jpg", scores: { sun: 2 } },
      ],
    },
    {
      id: 4,
      text: "Что тебе ближе в жизни?",
      options: [
        { text: "Подниматься выше и не сдаваться", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2 } },
        { text: "Искать скрытый смысл", image: "/petroglyph-quiz/mountains.jpg", scores: { sun: 2, deer: 1 } },
        { text: "Быть в действии", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 1, rider: 2 } },
        { text: "Передавать атмосферу и энергию", image: "/petroglyph-quiz/mountains.jpg", scores: { ritual: 2 } },
      ],
    },
    {
      id: 5,
      text: "Какую роль ты чаще играешь?",
      options: [
        { text: "Тихая опора", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2, deer: 1 } },
        { text: "Наблюдатель и чувствующий", image: "/petroglyph-quiz/mountains.jpg", scores: { deer: 2, sun: 1 } },
        { text: "Тот, кто идёт первым", image: "/petroglyph-quiz/mountains.jpg", scores: { rider: 2 } },
        { text: "Тот, кто ловит момент", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 2 } },
      ],
    },
    {
      id: 6,
      text: "Что бы ты хотел увидеть вживую?",
      options: [
        { text: "Тоотеке и животных", image: "/petroglyph-quiz/mountains.jpg", scores: { goat: 2, deer: 1 } },
        { text: "Оленя и плавные линии", image: "/petroglyph-quiz/mountains.jpg", scores: { deer: 2 } },
        { text: "Охотников и сцену действия", image: "/petroglyph-quiz/mountains.jpg", scores: { hunter: 2 } },
        { text: "Ритуал, знак или солнце", image: "/petroglyph-quiz/mountains.jpg", scores: { ritual: 1, sun: 2 } },
      ],
    },
  ];
}

type ResultInfo = {
  title: string;
  subtitle: string;
  description: string;
  recommendation: string;
  why: string;
  placeTag: string;
};

function getResults(lang: Lang): Record<Archetype, ResultInfo> {
  if (lang === "en") {
    return {
      goat: {
        title: "You are — Arkhar / Mountain goat",
        subtitle: "Strength, height, endurance",
        description:
          "You hold yourself confidently even in difficult terrain. You are about stability, the upward path and inner strength.",
        recommendation: "You should visit Besh-Tash-Koroo.",
        why: "This image fits well with the motifs of mountain animals and hunting scenes mentioned for Kyrgyz complexes.",
        placeTag: "Besh-Tash-Koroo",
      },
      deer: {
        title: "You are — Deer",
        subtitle: "Sensitivity, beauty, memory",
        description:
          "You subtly feel space and notice symbols that others miss.",
        recommendation: "You should visit Cholpon-Ata.",
        why: "Cholpon-Ata is well suited for a first live encounter with petroglyphs and animal imagery.",
        placeTag: "Cholpon-Ata",
      },
      hunter: {
        title: "You are — Hunter",
        subtitle: "Focus, precision, strategy",
        description:
          "You can see the goal, keep concentration and act at the right moment.",
        recommendation: "You should visit Cholpon-Ata.",
        why: "Hunting scenes and dynamic human figures are especially readable there.",
        placeTag: "Cholpon-Ata",
      },
      rider: {
        title: "You are — Rider",
        subtitle: "Movement, impulse, leadership",
        description:
          "You don't like standing still. You create movement around you and often lead others.",
        recommendation: "You should visit Cholpon-Ata.",
        why: "This complex fits well with the archetype of movement, human and path.",
        placeTag: "Cholpon-Ata",
      },
      sun: {
        title: "You are — Solar sign",
        subtitle: "Meaning, symbol, scale",
        description:
          "You are about the idea, inner light and the desire to see a deeper meaning behind the form.",
        recommendation: "You should visit Cholpon-Ata.",
        why: "It is especially fitting to look for symbolic motifs and circular signs there.",
        placeTag: "Cholpon-Ata",
      },
      ritual: {
        title: "You are — Ritual dancer",
        subtitle: "Energy, expression, cultural power",
        description:
          "You bring the space around you to life. Rhythm, community and living action are close to you.",
        recommendation: "You should visit Besh-Tash-Koroo.",
        why: "This archetype fits well with ritual and human imagery.",
        placeTag: "Besh-Tash-Koroo",
      },
    };
  }

  return {
    goat: {
      title: "Ты — Архар / Горный козёл",
      subtitle: "Сила, высота, выносливость",
      description:
        "Ты держишься уверенно даже в сложной местности. Ты про устойчивость, путь вверх и внутреннюю силу.",
      recommendation: "Тебе стоит посмотреть Беш-Таш-Короо.",
      why: "Этот образ хорошо сочетается с мотивами горных животных и охотничьих сцен, которые упоминаются для кыргызских комплексов.",
      placeTag: "Besh-Tash-Koroo",
    },
    deer: {
      title: "Ты — Олень",
      subtitle: "Чуткость, красота, память",
      description:
        "Ты тонко чувствуешь пространство и замечаешь символы, которые другие пропускают.",
      recommendation: "Тебе стоит посмотреть Чолпон-Ата.",
      why: "Чолпон-Ата хорошо подходит для первого живого знакомства с петроглифами и образами животных.",
      placeTag: "Cholpon-Ata",
    },
    hunter: {
      title: "Ты — Охотник",
      subtitle: "Фокус, точность, стратегия",
      description:
        "Ты умеешь видеть цель, держать концентрацию и действовать в нужный момент.",
      recommendation: "Тебе стоит посмотреть Чолпон-Ата.",
      why: "Там особенно хорошо считываются сцены охоты и динамичные человеческие образы.",
      placeTag: "Cholpon-Ata",
    },
    rider: {
      title: "Ты — Всадник",
      subtitle: "Движение, импульс, лидерство",
      description:
        "Ты не любишь стоять на месте. Ты создаёшь движение вокруг себя и часто ведёшь других.",
      recommendation: "Тебе стоит посмотреть Чолпон-Ата.",
      why: "Этот комплекс хорошо подходит под архетип движения, человека и пути.",
      placeTag: "Cholpon-Ata",
    },
    sun: {
      title: "Ты — Солнечный знак",
      subtitle: "Смысл, символ, масштаб",
      description:
        "Ты про идею, внутренний свет и желание видеть за формой более глубокий смысл.",
      recommendation: "Тебе стоит посмотреть Чолпон-Ата.",
      why: "Там особенно уместно искать символические мотивы и круговые знаки.",
      placeTag: "Cholpon-Ata",
    },
    ritual: {
      title: "Ты — Ритуальный танцор",
      subtitle: "Энергия, выражение, культурная сила",
      description:
        "Ты оживляешь пространство вокруг себя. Тебе близки ритм, общность и живое действие.",
      recommendation: "Тебе стоит посмотреть Беш-Таш-Короо.",
      why: "Этот архетип хорошо сочетается с ритуальными и человеческими образами.",
      placeTag: "Besh-Tash-Koroo",
    },
  };
}

function ArharLoader() {
  const { t } = useLang();
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 px-6 py-12 text-center">
      <div className="relative mb-6 h-28 w-28">
        <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/10" />
        <div className="absolute inset-0 rounded-full border border-amber-300/20" />
        <div className="absolute inset-0 flex items-center justify-center text-6xl animate-[bounce_1.1s_infinite]">
          🐏
        </div>
      </div>

      <h3 className="text-2xl font-black text-stone-900 dark:text-white">
        {t.quizAnalyzing}
      </h3>
      <p className="mt-3 max-w-lg text-sm leading-7 text-stone-900 dark:text-white/70">
        {t.quizAnalyzingDesc}
      </p>

      <div className="mt-6 h-3 w-full max-w-md overflow-hidden rounded-full bg-white/10">
        <div className="h-full animate-[loader_5s_linear_forwards] rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
      </div>
    </div>
  );
}

export default function PetroglyphQuizPage() {
  const { t, lang } = useLang();
  const questions = useMemo(() => getQuestions(lang), [lang]);
  const results = useMemo(() => getResults(lang), [lang]);

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState<Record<Archetype, number>>({
    goat: 0,
    deer: 0,
    hunter: 0,
    rider: 0,
    sun: 0,
    ritual: 0,
  });

  const currentQuestion = questions[step];

  const resultKey = useMemo(() => {
    return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "deer") as Archetype;
  }, [scores]);

  const result = results[resultKey];

  const handleAnswer = (option: Option) => {
    setScores((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(option.scores)) {
        next[key as Archetype] += value ?? 0;
      }
      return next;
    });

    const isLast = step === questions.length - 1;

    if (isLast) {
      setIsLoading(true);
      window.setTimeout(() => {
        setIsLoading(false);
        setStep((prev) => prev + 1);
      }, 5000);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setIsLoading(false);
    setScores({
      goat: 0,
      deer: 0,
      hunter: 0,
      rider: 0,
      sun: 0,
      ritual: 0,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.quizTitle}
        subtitle={t.quizSubtitle}
      />

      {isLoading ? (
        <ArharLoader />
      ) : step < questions.length ? (
        <div className="mx-auto max-w-5xl glow-card panel-ornament rounded-3xl p-6">
          <div className="mb-4 text-sm text-stone-900 dark:text-white/50">
            {t.quizQuestion} {step + 1} {t.quizOf} {questions.length}
          </div>

          <h2 className="text-2xl font-black text-stone-900 dark:text-white">
            {currentQuestion.text}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option)}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left transition hover:border-amber-400/30 hover:bg-amber-500/5"
              >
                <div className="overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.text}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="p-4">
                  <p className="text-base font-semibold text-stone-900 dark:text-white">
                    {option.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl glow-card panel-ornament rounded-3xl p-6">
          <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-6">
            <div className="text-sm uppercase tracking-[0.2em] text-amber-200">
              {t.quizResult}
            </div>
            <h2 className="mt-2 text-4xl font-black text-stone-900 dark:text-white">
              {result.title}
            </h2>
            <p className="mt-2 text-lg text-stone-900 dark:text-white">
              {result.subtitle}
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5 dark:border-white/10 dark:bg-black/20">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                {t.quizCharacter}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-900 dark:text-white/75">
                {result.description}
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                {t.quizWhereTo}
              </h3>
              <p className="mt-3 text-sm leading-7 text-emerald-50">
                {result.recommendation}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-900 dark:text-white/85">
                {result.why}
              </p>
              <div className="mt-4 inline-flex rounded-full border border-emerald-300/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-50">
                {result.placeTag}
              </div>
            </div>
          </div>

          <button
            onClick={restart}
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-stone-900 dark:text-white transition hover:bg-white/10"
          >
            {t.quizRestart}
          </button>
        </div>
      )}
    </div>
  );
}

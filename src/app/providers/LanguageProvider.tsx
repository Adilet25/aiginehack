import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "../../types";

const dictionary = {
  ru: {
    // Nav
    home: "Главная",
    map: "Карта",
    museum: "Музей",
    lootbox: "Чүко",
    profile: "Профиль",
    calendar: "Календарь",
    petroQuiz: "Петро Квиз",
    stoneLab: "Каменная лаба",
    gallery: "Галерея",
    leaderboard: "Рейтинг",
    groupExplore: "Исследовать",
    groupPlay: "Играть",
    groupCommunity: "Сообщество",
    account: "Аккаунт",
    menu: "Меню",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    tagline: "Технологии сакральных мест",

    // Map / scanning
    scanStone: "Сканировать камень",
    selectedPlace: "Выбранное место",
    noPlace: "Выберите объект на карте",
    nearbyWarning: "Вы вошли в охранную зону",
    sacredRules: "Правила поведения",
    collect: "Собрать",
    startExploring: "Начать исследование",

    // Home hero
    heroBadge: "Игровая платформа культуры",
    heroTitleLine1: "Исследуй",
    heroTitleLine2: "Кыргызское наследие",
    heroDesc:
      "Интерактивная платформа, которая делает культуру Кыргызстана интересной через карту, петроглифы, сакральные места, цифровые артефакты и геймификацию.",
    openStoneLab: "Открыть каменную лабу",
    statLevel: "Уровень",
    statPoints: "Очки",
    statArtifacts: "Артефакты",
    mapCardTitle: "Карта",
    mapCardDesc: "Находи сакральные места",
    challengeCardTitle: "Челлендж",
    challengeCardDesc: "Соревнуйся работами",
    playCardTitle: "Играть",
    playCardDesc: "Учись через игру",
    discoverCultureTitle: "Открой культуру",
    discoverCultureDesc:
      "Изучай сакральные места, петроглифы и культурные объекты на карте.",
    readSymbolsTitle: "Читай символы",
    readSymbolsDesc:
      "Интерпретируй рисунки, учись читать древние знаки и смыслы.",
    createCompeteTitle: "Создавай и соревнуйся",
    createCompeteDesc:
      "Создавай свои петроглифы, публикуй их и соревнуйся с другими.",
  },
  en: {
    // Nav
    home: "Home",
    map: "Map",
    museum: "Museum",
    lootbox: "Chüko",
    profile: "Profile",
    calendar: "Calendar",
    petroQuiz: "Petro Quiz",
    stoneLab: "Stone Lab",
    gallery: "Gallery",
    leaderboard: "Leaderboard",
    groupExplore: "Explore",
    groupPlay: "Play",
    groupCommunity: "Community",
    account: "Account",
    menu: "Menu",
    themeLight: "Light",
    themeDark: "Dark",
    tagline: "Sacred Tech Platform",

    // Map / scanning
    scanStone: "Scan stone",
    selectedPlace: "Selected place",
    noPlace: "Select a place on the map",
    nearbyWarning: "You entered a protected zone",
    sacredRules: "Respect guidelines",
    collect: "Collect",
    startExploring: "Start exploring",

    // Home hero
    heroBadge: "Cultural gaming platform",
    heroTitleLine1: "Explore",
    heroTitleLine2: "Kyrgyz Heritage",
    heroDesc:
      "An interactive platform that makes Kyrgyz culture engaging through maps, petroglyphs, sacred sites, digital artifacts and gamification.",
    openStoneLab: "Open Stone Lab",
    statLevel: "Level",
    statPoints: "Points",
    statArtifacts: "Artifacts",
    mapCardTitle: "Map",
    mapCardDesc: "Discover sacred places",
    challengeCardTitle: "Challenge",
    challengeCardDesc: "Compete with artworks",
    playCardTitle: "Play",
    playCardDesc: "Learn through interaction",
    discoverCultureTitle: "Discover Culture",
    discoverCultureDesc:
      "Explore sacred sites, petroglyphs and cultural landmarks on the map.",
    readSymbolsTitle: "Read the Symbols",
    readSymbolsDesc:
      "Interpret ancient drawings and learn to read their meaning.",
    createCompeteTitle: "Create & Compete",
    createCompeteDesc:
      "Create your own petroglyphs, publish them and compete with others.",
  },
};

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof dictionary.ru;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = window.localStorage.getItem("lang");
    return stored === "en" ? "en" : "ru";
  });

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("lang", next);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: dictionary[lang],
    }),
    [lang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

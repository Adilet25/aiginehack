import type { HeritageLocation } from "../types";
import type { Lang } from "../types";

// регионы Кыргызстана
const regions = [
  { name: { ru: "Ысык-Көл", en: "Issyk-Kul" }, lat: 42.5, lng: 77.5 },
  { name: { ru: "Ош", en: "Osh" }, lat: 40.5, lng: 72.8 },
  { name: { ru: "Нарын", en: "Naryn" }, lat: 41.4, lng: 75.9 },
  { name: { ru: "Талас", en: "Talas" }, lat: 42.5, lng: 72.2 },
  { name: { ru: "Жалал-Абад", en: "Jalal-Abad" }, lat: 41.0, lng: 73.0 },
  { name: { ru: "Чуй", en: "Chuy" }, lat: 42.8, lng: 74.6 },
];

// названия для генерации
const sacredNames = ["Ата", "Булагы", "Таш", "Мазар", "Көл", "Сай", "Тоо"];
const sacredNamesEn = ["Ata", "Bulagy", "Tash", "Mazar", "Kol", "Say", "Too"];

const petroglyphNames = ["Петроглиф", "Таш", "Скала", "Жазуу", "Белги"];
const petroglyphNamesEn = ["Petroglyph", "Tash", "Cliff", "Zhazuu", "Belgi"];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(type: "sacred" | "petroglyph", lang: Lang) {
  if (lang === "en") {
    const base = type === "sacred" ? sacredNamesEn : petroglyphNamesEn;
    return `${pick(base)} ${Math.floor(Math.random() * 200)}`;
  }
  const base = type === "sacred" ? sacredNames : petroglyphNames;
  return `${pick(base)} ${Math.floor(Math.random() * 200)}`;
}

function generateLocation(id: number, lang: Lang): HeritageLocation {
  const region = pick(regions);
  const type = Math.random() > 0.5 ? "sacred" : "petroglyph";

  const description =
    type === "sacred"
      ? lang === "en"
        ? "Sacred site used for spiritual practices and pilgrimage."
        : "Сакральное место, используемое для духовных практик и паломничества."
      : lang === "en"
        ? "Petroglyph complex with depictions of animals, hunting and symbols."
        : "Комплекс петроглифов с изображениями животных, охоты и символов.";

  const culturalNote =
    type === "sacred"
      ? lang === "en"
        ? "Respectful behavior and observance of traditions are recommended."
        : "Рекомендуется уважительное поведение и соблюдение традиций."
      : lang === "en"
        ? "You may study, photograph and interpret the drawings."
        : "Можно изучать, фотографировать и интерпретировать рисунки.";

  return {
    id,
    name: generateName(type, lang),
    shortName: `LOC-${id}`,
    kind: type,
    description,
    culturalNote,
    district: region.name[lang],

    lat: region.lat + random(-0.6, 0.6),
    lng: region.lng + random(-0.6, 0.6),

    radiusMeters: type === "sacred" ? 250 : 180,

    rules:
      type === "sacred"
        ? lang === "en"
          ? [
              { id: "r1", text: "Do not make noise" },
              { id: "r2", text: "Do not litter" },
            ]
          : [
              { id: "r1", text: "Не шуметь" },
              { id: "r2", text: "Не мусорить" },
            ]
        : undefined,

    sourceLabel: lang === "en" ? "MVP generated dataset" : "MVP сгенерированный набор",
  };
}

// ===== РЕАЛЬНЫЕ ЯДРОВЫЕ ЛОКАЦИИ =====
function getCoreLocations(lang: Lang): HeritageLocation[] {
  if (lang === "en") {
    return [
      {
        id: 1,
        name: "Sulaiman-Too",
        shortName: "Sulaiman-Too",
        kind: "sacred",
        description: "Sacred mountain in Osh.",
        culturalNote: "UNESCO World Heritage Site.",
        district: "Osh",
        lat: 40.5311,
        lng: 72.7828,
        radiusMeters: 350,
        rules: [{ id: "r1", text: "Keep silence" }],
        sourceLabel: "Real",
      },
      {
        id: 2,
        name: "Manjyly-Ata",
        shortName: "Manjyly-Ata",
        kind: "sacred",
        description: "Sacred springs.",
        culturalNote: "Pilgrimage site.",
        district: "Issyk-Kul",
        lat: 42.146,
        lng: 77.095,
        radiusMeters: 320,
        rules: [{ id: "r1", text: "Do not pollute the water" }],
        sourceLabel: "Real",
      },
      {
        id: 3,
        name: "Cholpon-Ata Petroglyphs",
        shortName: "Cholpon-Ata",
        kind: "petroglyph",
        description: "A major petroglyph complex.",
        district: "Issyk-Kul",
        lat: 42.651,
        lng: 77.092,
        radiusMeters: 220,
        sourceLabel: "Real",
      },
    ];
  }

  return [
    {
      id: 1,
      name: "Сулайман-Тоо",
      shortName: "Sulaiman-Too",
      kind: "sacred",
      description: "Священная гора в Оше.",
      culturalNote: "Объект ЮНЕСКО.",
      district: "Ош",
      lat: 40.5311,
      lng: 72.7828,
      radiusMeters: 350,
      rules: [{ id: "r1", text: "Соблюдать тишину" }],
      sourceLabel: "Real",
    },
    {
      id: 2,
      name: "Манжылы-Ата",
      shortName: "Manjyly-Ata",
      kind: "sacred",
      description: "Священные источники.",
      culturalNote: "Паломничество.",
      district: "Ысык-Көл",
      lat: 42.146,
      lng: 77.095,
      radiusMeters: 320,
      rules: [{ id: "r1", text: "Не загрязнять воду" }],
      sourceLabel: "Real",
    },
    {
      id: 3,
      name: "Чолпон-Ата петроглифы",
      shortName: "Cholpon-Ata",
      kind: "petroglyph",
      description: "Крупный комплекс петроглифов.",
      district: "Ысык-Көл",
      lat: 42.651,
      lng: 77.092,
      radiusMeters: 220,
      sourceLabel: "Real",
    },
  ];
}

export function getLocations(lang: Lang): HeritageLocation[] {
  const core = getCoreLocations(lang);
  const generated = Array.from({ length: 97 }, (_, i) => generateLocation(i + 4, lang));
  return [...core, ...generated];
}

// Backwards-compatible export (Russian by default)
export const locations: HeritageLocation[] = getLocations("ru");

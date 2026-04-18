import type { HeritageLocation } from "../types";

// регионы Кыргызстана
const regions = [
  { name: "Ысык-Көл", lat: 42.5, lng: 77.5 },
  { name: "Ош", lat: 40.5, lng: 72.8 },
  { name: "Нарын", lat: 41.4, lng: 75.9 },
  { name: "Талас", lat: 42.5, lng: 72.2 },
  { name: "Жалал-Абад", lat: 41.0, lng: 73.0 },
  { name: "Чуй", lat: 42.8, lng: 74.6 },
];

// названия для генерации
const sacredNames = ["Ата", "Булагы", "Таш", "Мазар", "Көл", "Сай", "Тоо"];

const petroglyphNames = ["Петроглиф", "Таш", "Скала", "Жазуу", "Белги"];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(type: "sacred" | "petroglyph") {
  const base = type === "sacred" ? sacredNames : petroglyphNames;
  return `${pick(base)} ${Math.floor(Math.random() * 200)}`;
}

function generateLocation(id: number): HeritageLocation {
  const region = pick(regions);
  const type = Math.random() > 0.5 ? "sacred" : "petroglyph";

  return {
    id,
    name: generateName(type),
    shortName: `LOC-${id}`,
    kind: type,
    description:
      type === "sacred"
        ? "Сакральное место, используемое для духовных практик и паломничества."
        : "Комплекс петроглифов с изображениями животных, охоты и символов.",
    culturalNote:
      type === "sacred"
        ? "Рекомендуется уважительное поведение и соблюдение традиций."
        : "Можно изучать, фотографировать и интерпретировать рисунки.",
    district: region.name,

    lat: region.lat + random(-0.6, 0.6),
    lng: region.lng + random(-0.6, 0.6),

    radiusMeters: type === "sacred" ? 250 : 180,

    rules:
      type === "sacred"
        ? [
            { id: "r1", text: "Не шуметь" },
            { id: "r2", text: "Не мусорить" },
          ]
        : undefined,

    sourceLabel: "MVP generated dataset",
  };
}

// ===== РЕАЛЬНЫЕ ЯДРОВЫЕ ЛОКАЦИИ =====
const coreLocations: HeritageLocation[] = [
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

// ===== ГЕНЕРАЦИЯ ДО 100 =====
const generated = Array.from({ length: 97 }, (_, i) => generateLocation(i + 4));

export const locations: HeritageLocation[] = [...coreLocations, ...generated];

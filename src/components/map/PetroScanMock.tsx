import { useState } from "react";
import { Camera, ScanSearch } from "lucide-react";
import { useLang } from "../../app/providers/LanguageProvider";
import { useGame } from "../../app/providers/GameProvider";
import type { PetroSubmission } from "../../types";

const mockResults = [
  {
    isPetroglyph: true,
    title: "Possible petroglyph",
    summary:
      "Контурные линии напоминают древнюю гравировку. Возможна сцена охоты или изображение животного.",
    suggestedType: "animal" as const,
  },
  {
    isPetroglyph: true,
    title: "Possible symbol",
    summary:
      "Обнаружены формы, похожие на символический или сакральный знак. Требуется проверка администратором.",
    suggestedType: "symbol" as const,
  },
  {
    isPetroglyph: false,
    title: "Low confidence",
    summary:
      "Изображение не выглядит как уверенный пример петроглифа. Рекомендуется повторить съемку.",
    suggestedType: "unknown" as const,
  },
];

export default function PetroScanMock() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { t } = useLang();
  const { addSubmission } = useGame();

  const handleFile = (file?: File) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setIsAnalyzing(true);
    setMessage(null);

    setTimeout(() => {
      const result = file.name.toLowerCase().includes("petro")
        ? mockResults[0]
        : mockResults[Math.floor(Math.random() * mockResults.length)];

      const submission: PetroSubmission = {
        id: Date.now(),
        imageUrl,
        title: `User submission ${new Date().toLocaleTimeString()}`,
        aiSummary: result.summary,
        suggestedType: result.suggestedType,
        status: "pending",
        createdAt: new Date().toISOString(),
        lat: 42.87 + Math.random() * 0.02,
        lng: 74.6 + Math.random() * 0.02,
      };

      addSubmission(submission);
      setMessage("Фото загружено и отправлено на проверку администратору.");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="glow-card panel-ornament rounded-3xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-amber-500/15 p-3">
          <ScanSearch size={18} />
        </div>
        <div>
          <h3 className="text-lg font-bold">{t.scanStone}</h3>
          <p className="text-sm text-muted">
            Пользователь загружает фото, дальше его проверяет админ.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm hover:bg-white/5">
        <Camera size={18} />
        <span>Открыть камеру / выбрать фото</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      {preview && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <img
            src={preview}
            alt="Stone preview"
            className="h-52 w-full object-cover"
          />
        </div>
      )}

      {isAnalyzing && (
        <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          Анализируем фото и создаем заявку на модерацию...
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-stone-900">
          {message}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Camera, ScanSearch } from "lucide-react";
import { useLang } from "../../app/providers/LanguageProvider";
import { useGame } from "../../app/providers/GameProvider";
import type { PetroSubmission } from "../../types";

export default function PetroScanMock() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { t } = useLang();
  const { addSubmission } = useGame();

  const mockResults = [
    {
      isPetroglyph: true,
      title: t.possiblePetroglyph,
      summary: t.petroglyphSummary,
      suggestedType: "animal" as const,
    },
    {
      isPetroglyph: true,
      title: t.possibleSymbol,
      summary: t.symbolSummary,
      suggestedType: "symbol" as const,
    },
    {
      isPetroglyph: false,
      title: t.lowConfidence,
      summary: t.lowConfSummary,
      suggestedType: "unknown" as const,
    },
  ];

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
        title: `${t.userSubmission} ${new Date().toLocaleTimeString()}`,
        aiSummary: result.summary,
        suggestedType: result.suggestedType,
        status: "pending",
        createdAt: new Date().toISOString(),
        lat: 42.87 + Math.random() * 0.02,
        lng: 74.6 + Math.random() * 0.02,
      };

      addSubmission(submission);
      setMessage(t.photoUploaded);
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
            {t.scanStoneDesc}
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-black/20 px-4 py-4 text-sm hover:bg-white/80 dark:bg-white/5">
        <Camera size={18} />
        <span>{t.openCamera}</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      {preview && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 dark:border-white/10">
          <img
            src={preview}
            alt={t.stonePreview}
            className="h-52 w-full object-cover"
          />
        </div>
      )}

      {isAnalyzing && (
        <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          {t.analyzingPhoto}
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-stone-900 dark:text-white">
          {message}
        </div>
      )}
    </div>
  );
}

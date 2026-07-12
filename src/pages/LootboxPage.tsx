import { useMemo, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import GlowButton from "../components/shared/GlowButton";
import { artifacts } from "../data/artifacts";
import { rollLootbox } from "../utils/loot";
import { useGame } from "../app/providers/GameProvider";
import type { Artifact } from "../types";

const rarityStyles = {
  common: "border-white/10 bg-white/5 text-stone-900/80",
  rare: "border-sky-400/30 bg-sky-500/10 text-sky-200",
  epic: "border-purple-400/30 bg-purple-500/10 text-purple-200",
};

export default function LootboxPage() {
  const { addArtifact } = useGame();

  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<Artifact | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const chances = useMemo(
    () => [
      { label: "Common", value: "60%" },
      { label: "Rare", value: "30%" },
      { label: "Epic", value: "10%" },
    ],
    [],
  );

  const handleOpen = () => {
    if (isOpening) return;

    setIsOpening(true);
    setResult(null);
    setIsDuplicate(false);

    setTimeout(() => {
      const loot = rollLootbox(artifacts);

      if (!loot) {
        setIsOpening(false);
        return;
      }

      const response = addArtifact(loot.artifact);

      setResult(loot.artifact);
      setIsDuplicate(response.duplicate);
      setIsOpening(false);
    }, 1400);
  };

  return (
    <div>
      <PageHeader
        title="Chüko Lootbox"
        subtitle="Открывай чүко, получай случайные артефакты и усиливай свой цифровой музей."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div
              className={`mb-6 flex h-52 w-52 items-center justify-center rounded-[2rem] border text-center transition-all duration-500 ${
                isOpening
                  ? "scale-105 border-emerald-300/60 bg-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.35)]"
                  : "border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
              }`}
            >
              <span
                className={`text-xl font-black tracking-wide text-stone-900 ${isOpening ? "animate-pulse" : ""}`}
              >
                {isOpening ? "OPENING..." : "CHÜKO BOX"}
              </span>
            </div>

            <p className="max-w-md text-sm leading-7 text-stone-900/65">
              Открывай коробку и получай случайный культурный артефакт. Если
              предмет уже есть в коллекции, ты получишь компенсацию очками.
            </p>

            <div className="mt-6">
              <GlowButton
                onClick={handleOpen}
                disabled={isOpening}
                className={isOpening ? "cursor-not-allowed opacity-70" : ""}
              >
                {isOpening ? "Opening..." : "Open Chuko"}
              </GlowButton>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-stone-900">Drop Chances</h3>
            <div className="mt-4 space-y-3">
              {chances.map((chance) => (
                <div
                  key={chance.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <span className="text-sm text-stone-900/75">
                    {chance.label}
                  </span>
                  <span className="text-sm font-bold text-emerald-300">
                    {chance.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glow-card min-h-[240px] rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-stone-900">Latest Reward</h3>

            {!result ? (
              <p className="mt-4 text-sm text-stone-900/55">
                Здесь появится результат открытия чүко.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xl font-black text-stone-900">
                        {result.name}
                      </h4>
                      <p className="mt-2 text-sm text-stone-900/65">
                        {result.description}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
                        rarityStyles[result.rarity]
                      }`}
                    >
                      {result.rarity}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-stone-900/45">Points</p>
                      <p className="mt-1 text-lg font-bold text-stone-900">
                        {result.points}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-stone-900/45">Income</p>
                      <p className="mt-1 text-lg font-bold text-stone-900">
                        +{result.income}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    isDuplicate
                      ? "border-amber-400/25 bg-amber-500/10 text-amber-200"
                      : "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                  }`}
                >
                  {isDuplicate
                    ? "Duplicate item: artifact already exists in your collection. Compensation points were added."
                    : "New artifact collected successfully and added to your museum."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

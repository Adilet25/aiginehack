import { Link } from 'react-router-dom';
import BrandMark from '../components/shared/BrandMark';
import { useInterfaceCopy } from '../data/interface';
import { useMemo, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import GlowButton from "../components/shared/GlowButton";
import { artifacts } from "../data/artifacts";
import { rollLootbox } from "../utils/loot";
import { useGame } from "../app/providers/GameProvider";
import type { Artifact } from "../types";
import { useLang } from "../app/providers/LanguageProvider";

const rarityStyles = {
  common: "border-line bg-surface text-ink ",
  rare: "border-sky bg-sky-soft text-sky",
  epic: "border-sky bg-sky-soft text-sky",
};

export default function LootboxPage() {
  const { t } = useLang();
  const c = useInterfaceCopy();
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
    <div className="muras-loot">
      <PageHeader
        title={t.lootboxTitle}
        subtitle={t.lootboxSubtitle}
        action={{ to: "/museum", label: c.viewCollection }}
      />

      <div className="muras-reward-layout">
        <div className="muras-reward-stage">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div
              className={`heritage-loot-stone mb-6 flex h-52 w-52 items-center justify-center rounded-[2rem] border text-center transition-all duration-500 ${
                isOpening
                  ? "scale-105 border-sage bg-sage-soft shadow-sm"
                  : "border-sage bg-gradient-to-br from-sage-soft to-sky-soft shadow-sm"
              }`}
            >
              <BrandMark className="muras-reward-mark" />
              <span
                className={`text-xl font-black tracking-wide text-ink  ${isOpening ? "animate-pulse" : ""}`}
              >
                {isOpening ? t.opening : t.lootbox}
              </span>
            </div>

            <p className="max-w-md text-sm leading-7 text-ink ">
              {c.rewardHint}
            </p>

            <div className="mt-6">
              <GlowButton
                onClick={handleOpen}
                disabled={isOpening}
                className={isOpening ? "cursor-not-allowed opacity-70" : ""}
              >
                {isOpening ? t.opening : t.openChuko}
              </GlowButton>
            </div>
          </div>
        </div>

        <div className="muras-reward-side">
          <div className="muras-reward-odds">
            <h3 className="text-lg font-bold text-ink ">
              {t.dropChances}
            </h3>
            <div className="mt-4 space-y-3">
              {chances.map((chance) => (
                <div
                  key={chance.label}
                  className="flex items-center justify-between rounded-2xl border border-line bg-wash px-4 py-3"
                >
                  <span className="text-sm text-ink ">
                    {chance.label}
                  </span>
                  <span className="text-sm font-bold text-sage">
                    {chance.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="muras-reward-result" aria-live="polite" aria-busy={isOpening}>
            <h3 className="text-lg font-bold text-ink ">
              {t.latestReward}
            </h3>

            {!result ? (
              <p className="mt-4 text-sm text-ink ">
                {t.noRewardYet}
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl border border-sage bg-gradient-to-br from-sage-soft to-sky-soft p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xl font-black text-ink ">
                        {result.name}
                      </h4>
                      <p className="mt-2 text-sm text-ink ">
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
                    <div className="rounded-2xl border border-line bg-wash p-4">
                      <p className="text-xs text-ink ">
                        {t.points}
                      </p>
                      <p className="mt-1 text-lg font-bold text-ink ">
                        {result.points}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-line bg-wash p-4">
                      <p className="text-xs text-ink ">
                        {t.income}
                      </p>
                      <p className="mt-1 text-lg font-bold text-ink ">
                        +{result.income}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    isDuplicate
                      ? "border-gold bg-gold-soft text-gold"
                      : "border-sage bg-sage-soft text-sage"
                  }`}
                >
                  {isDuplicate
                    ? t.duplicateMsg
                    : t.newArtifactMsg}
                </div>
                <Link className="muras-link" to="/museum">{c.viewCollection} →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import PageHeader from "../components/shared/PageHeader";
import { useGame } from "../app/providers/GameProvider";

const rarityStyles = {
  common: "border-white/10 bg-white/5 text-stone-900/80",
  rare: "border-sky-400/30 bg-sky-500/10 text-sky-200",
  epic: "border-purple-400/30 bg-purple-500/10 text-purple-200",
};

export default function MuseumPage() {
  const { collection } = useGame();

  return (
    <div>
      <PageHeader
        title="Digital Museum"
        subtitle="Твоя собранная коллекция артефактов."
      />

      {collection.length === 0 ? (
        <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h3 className="text-xl font-bold text-stone-900">Museum is empty</h3>
          <p className="mt-3 text-sm text-stone-900/60">
            Пока ты не собрал ни одного артефакта. Перейди на карту или открой
            чүко.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collection.map((artifact) => (
            <div
              key={artifact.id}
              className="glow-card rounded-3xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {artifact.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-900/55">
                    {artifact.description}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
                    rarityStyles[artifact.rarity]
                  }`}
                >
                  {artifact.rarity}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-stone-900/45">Points</p>
                  <p className="mt-1 text-lg font-bold">{artifact.points}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-stone-900/45">Income</p>
                  <p className="mt-1 text-lg font-bold">+{artifact.income}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

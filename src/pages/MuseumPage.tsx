import PageHeader from "../components/shared/PageHeader";
import { useGame } from "../app/providers/GameProvider";
import { useLang } from "../app/providers/LanguageProvider";

const rarityStyles = {
  common: "border-line bg-surface text-ink ",
  rare: "border-sky bg-sky-soft text-sky",
  epic: "border-sky bg-sky-soft text-sky",
};

export default function MuseumPage() {
  const { t } = useLang();
  const { collection } = useGame();

  return (
    <div>
      <PageHeader
        title={t.museumTitle}
        subtitle={t.museumSubtitle}
      />

      {collection.length === 0 ? (
        <div className="glow-card rounded-3xl border border-line bg-surface p-8 text-center">
          <h3 className="text-xl font-bold text-ink ">
            {t.museumEmpty}
          </h3>
          <p className="mt-3 text-sm text-ink ">
            {t.museumEmptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collection.map((artifact) => (
            <div
              key={artifact.id}
              className="glow-card rounded-3xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sage"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-ink ">
                    {artifact.name}
                  </h3>
                  <p className="mt-1 text-sm text-ink ">
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
                <div className="rounded-2xl border border-line bg-wash p-4">
                  <p className="text-xs text-ink ">
                    {t.points}
                  </p>
                  <p className="mt-1 text-lg font-bold">{artifact.points}</p>
                </div>

                <div className="rounded-2xl border border-line bg-wash p-4">
                  <p className="text-xs text-ink ">
                    {t.income}
                  </p>
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

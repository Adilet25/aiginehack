import PageHeader from "../components/shared/PageHeader";
import { useGame } from "../app/providers/GameProvider";
import { useLang } from "../app/providers/LanguageProvider";
import { Link } from 'react-router-dom';
import BrandMark from '../components/shared/BrandMark';
import EmptyState from '../components/shared/EmptyState';
import { useInterfaceCopy } from '../data/interface';

const rarityStyles = {
  common: "border-line bg-surface text-ink ",
  rare: "border-sky bg-sky-soft text-sky",
  epic: "border-sky bg-sky-soft text-sky",
};

export default function MuseumPage() {
  const { t } = useLang();
  const c = useInterfaceCopy();
  const { collection } = useGame();

  return (
    <div className="muras-museum">
      <PageHeader
        title={t.museumTitle}
        subtitle={t.museumSubtitle}
        action={{ to: '/lootbox', label: t.openChuko }}
      />
      <p className="muras-caption">{c.collectionNote}</p>
      {collection.length === 0 ? (
        <EmptyState title={t.museumEmpty} description={t.museumEmptyDesc}><Link className="heritage-button" to="/lootbox">{c.emptyCollectionAction}</Link></EmptyState>
      ) : (
        <div className="muras-collection-grid">
          {collection.map((artifact, index) => (
            <div
              key={artifact.id}
              className="muras-collection-item"
            >
              <div className="muras-collection-seal" aria-hidden="true"><BrandMark /><span>{String(index + 1).padStart(2, '0')}</span></div>
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

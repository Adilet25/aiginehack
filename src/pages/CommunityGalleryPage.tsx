import { useMemo, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import ArtworkImage from "../components/shared/ArtworkImage";
import PrototypeNotice from "../components/shared/PrototypeNotice";
import { useGame } from "../app/providers/GameProvider";
import { useLang } from "../app/providers/LanguageProvider";
import type { ArtworkCategory, WorkshopArtwork } from "../types";

function getCategoryLabels(t: {
  categoryGoat: string;
  categoryDeer: string;
  categoryHunter: string;
  categorySun: string;
  categoryAbstract: string;
}): Record<ArtworkCategory, string> {
  return {
    goat: t.categoryGoat,
    deer: t.categoryDeer,
    hunter: t.categoryHunter,
    sun: t.categorySun,
    abstract: t.categoryAbstract,
  };
}

function VoteStars({ onVote }: { artwork: WorkshopArtwork; onVote: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1,2,3,4,5].map((star) => (
        <button key={star} onClick={() => onVote(star)} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink hover:bg-wash    ">
          {star}★
        </button>
      ))}
    </div>
  );
}

export default function CommunityGalleryPage() {
  const { artworks, voteArtwork } = useGame();
  const { t } = useLang();
  const categoryLabels = useMemo(() => getCategoryLabels(t), [t]);
  const [filter, setFilter] = useState<"all" | ArtworkCategory>("all");

  const filtered = useMemo(() => {
    const published = artworks.filter((a) => a.isPublished);
    if (filter === "all") return published;
    return published.filter((a) => a.category === filter);
  }, [artworks, filter]);

  return (
    <div className="space-y-6">
      <PageHeader title={t.galleryTitle} subtitle={t.gallerySubtitle} />
      <PrototypeNotice kind="community" />

      <div className="glow-card panel-ornament rounded-3xl p-5">
        <div className="flex flex-wrap gap-3">
          {(["all", "goat", "deer", "hunter", "sun", "abstract"] as const).map((item) => (
            <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${filter === item ? "border-gold bg-gold-soft text-gold  " : "border-line bg-surface text-ink hover:bg-wash    "}`}>
              {item === "all" ? t.filterAll : categoryLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((artwork) => (
          <div key={artwork.id} className="glow-card panel-ornament overflow-hidden rounded-3xl">
            <ArtworkImage src={artwork.imageUrl} title={artwork.title} className="heritage-gallery-image" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-ink ">{artwork.title}</h3>
                  <p className="mt-1 text-sm text-muted ">{t.byAuthor} {artwork.author}</p>
                </div>
                <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold uppercase text-ink   ">
                  {categoryLabels[artwork.category]}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted ">{artwork.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[{ label: t.votes, val: artwork.votes }, { label: t.rating, val: artwork.rating || "—" }, { label: t.voters, val: artwork.voters }].map(({ label, val }) => (
                  <div key={label} className="rounded-2xl border border-line bg-surface p-3  ">
                    <p className="text-xs text-muted ">{label}</p>
                    <p className="mt-1 text-lg font-bold text-ink ">{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-ink ">{t.rateArtwork}</p>
                <VoteStars artwork={artwork} onVote={(v) => voteArtwork(artwork.id, v)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

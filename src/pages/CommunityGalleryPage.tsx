import { useMemo, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
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
        <button key={star} onClick={() => onVote(star)} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-700 hover:bg-stone-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
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

      <div className="glow-card panel-ornament rounded-3xl p-5">
        <div className="flex flex-wrap gap-3">
          {(["all", "goat", "deer", "hunter", "sun", "abstract"] as const).map((item) => (
            <button key={item} onClick={() => setFilter(item)}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${filter === item ? "border-amber-400/30 bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-white" : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"}`}>
              {item === "all" ? t.filterAll : categoryLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((artwork) => (
          <div key={artwork.id} className="glow-card panel-ornament overflow-hidden rounded-3xl">
            <img src={artwork.imageUrl} alt={artwork.title} className="h-56 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">{artwork.title}</h3>
                  <p className="mt-1 text-sm text-stone-500 dark:text-white/55">{t.byAuthor} {artwork.author}</p>
                </div>
                <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                  {categoryLabels[artwork.category]}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-white/70">{artwork.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[{ label: t.votes, val: artwork.votes }, { label: t.rating, val: artwork.rating || "—" }, { label: t.voters, val: artwork.voters }].map(({ label, val }) => (
                  <div key={label} className="rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-white/10 dark:bg-black/20">
                    <p className="text-xs text-stone-400 dark:text-white/40">{label}</p>
                    <p className="mt-1 text-lg font-bold text-stone-900 dark:text-white">{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-stone-900 dark:text-white">{t.rateArtwork}</p>
                <VoteStars artwork={artwork} onVote={(v) => voteArtwork(artwork.id, v)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useGame } from "../app/providers/GameProvider";
import type { WorkshopArtwork } from "../types";

const categoryLabels = {
  goat: "Goat",
  deer: "Deer",
  hunter: "Hunter",
  sun: "Sun",
  abstract: "Abstract",
};

function VoteStars({
  //   artwork,
  onVote,
}: {
  artwork: WorkshopArtwork;
  onVote: (value: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onVote(star)}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-stone-900 dark:text-white hover:bg-white/10"
        >
          {star}★
        </button>
      ))}
    </div>
  );
}

export default function CommunityGalleryPage() {
  const { artworks, voteArtwork } = useGame();
  const [filter, setFilter] = useState<"all" | keyof typeof categoryLabels>(
    "all",
  );

  const filtered = useMemo(() => {
    const published = artworks.filter((a) => a.isPublished);
    if (filter === "all") return published;
    return published.filter((a) => a.category === filter);
  }, [artworks, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Community Gallery"
        subtitle="Публикуй петроглифы, собирай оценки и соревнуйся с другими авторами."
      />

      <div className="glow-card panel-ornament rounded-3xl p-5">
        <div className="flex flex-wrap gap-3">
          {(["all", "goat", "deer", "hunter", "sun", "abstract"] as const).map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  filter === item
                    ? "border-amber-400/30 bg-amber-500/10 text-stone-900 dark:text-white"
                    : "border-white/10 bg-white/5 text-stone-900 dark:text-white/80 hover:bg-white/10"
                }`}
              >
                {item === "all" ? "All" : categoryLabels[item]}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((artwork) => (
          <div
            key={artwork.id}
            className="glow-card panel-ornament overflow-hidden rounded-3xl"
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                    {artwork.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-900 dark:text-white/55">
                    by {artwork.author}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase text-stone-900 dark:text-white/75">
                  {categoryLabels[artwork.category]}
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-stone-900 dark:text-white/70">
                {artwork.description}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-stone-900 dark:text-white/40">
                    Votes
                  </p>
                  <p className="mt-1 text-lg font-bold text-stone-900 dark:text-white">
                    {artwork.votes}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-stone-900 dark:text-white/40">
                    Rating
                  </p>
                  <p className="mt-1 text-lg font-bold text-stone-900 dark:text-white">
                    {artwork.rating || "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-stone-900 dark:text-white/40">
                    Voters
                  </p>
                  <p className="mt-1 text-lg font-bold text-stone-900 dark:text-white">
                    {artwork.voters}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-stone-900 dark:text-white">
                  Rate this artwork
                </p>
                <VoteStars
                  artwork={artwork}
                  onVote={(value) => voteArtwork(artwork.id, value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

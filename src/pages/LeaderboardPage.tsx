import { useMemo } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useGame } from "../app/providers/GameProvider";

export default function LeaderboardPage() {
  const { artworks } = useGame();

  const topArtworks = useMemo(() => {
    return [...artworks]
      .filter((a) => a.isPublished)
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        if (b.votes !== a.votes) return b.votes - a.votes;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .slice(0, 10);
  }, [artworks]);

  const topAuthors = useMemo(() => {
    const map = new Map<
      string,
      {
        author: string;
        works: number;
        totalVotes: number;
        avgRating: number;
        ratingSum: number;
        ratingCount: number;
      }
    >();

    artworks
      .filter((a) => a.isPublished)
      .forEach((art) => {
        const existing = map.get(art.author);
        if (!existing) {
          map.set(art.author, {
            author: art.author,
            works: 1,
            totalVotes: art.votes,
            avgRating: art.rating,
            ratingSum: art.rating,
            ratingCount: art.rating > 0 ? 1 : 0,
          });
          return;
        }

        existing.works += 1;
        existing.totalVotes += art.votes;
        if (art.rating > 0) {
          existing.ratingSum += art.rating;
          existing.ratingCount += 1;
        }
        existing.avgRating =
          existing.ratingCount > 0
            ? Number((existing.ratingSum / existing.ratingCount).toFixed(2))
            : 0;
      });

    return [...map.values()]
      .sort((a, b) => {
        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
        return b.totalVotes - a.totalVotes;
      })
      .slice(0, 10);
  }, [artworks]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboard"
        subtitle="Лучшие работы и авторы сообщества."
      />

      <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-stone-900 dark:text-white">
        <div className="text-sm uppercase tracking-[0.2em] opacity-75">
          Grand Prize
        </div>
        <div className="mt-2 text-xl font-bold">
          1 место — шанс на физическое воплощение работы и процент от продажи по
          правилам конкурса
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glow-card panel-ornament rounded-3xl p-6">
          <h3 className="text-2xl font-black text-stone-900 dark:text-white">
            Top Petroglyphs
          </h3>

          <div className="mt-5 space-y-3">
            {topArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 font-black text-stone-900 dark:text-white">
                  #{index + 1}
                </div>

                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-stone-900 dark:text-white">
                    {artwork.title}
                  </h4>
                  <p className="text-sm text-stone-900 dark:text-white/55">
                    by {artwork.author}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-stone-900 dark:text-white">
                    {artwork.rating || "—"}★
                  </p>
                  <p className="text-xs text-stone-900 dark:text-white/50">
                    {artwork.votes} votes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glow-card panel-ornament rounded-3xl p-6">
          <h3 className="text-2xl font-black text-stone-900 dark:text-white">
            Top Artists
          </h3>

          <div className="mt-5 space-y-3">
            {topAuthors.map((author, index) => (
              <div
                key={author.author}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 font-black text-stone-900 dark:text-white">
                  #{index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-stone-900 dark:text-white">
                    {author.author}
                  </h4>
                  <p className="text-sm text-stone-900 dark:text-white/55">
                    {author.works} works published
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-stone-900 dark:text-white">
                    {author.avgRating || "—"}★
                  </p>
                  <p className="text-xs text-stone-900 dark:text-white/50">
                    {author.totalVotes} votes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

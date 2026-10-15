import { Link } from 'react-router-dom';
import EmptyState from '../components/shared/EmptyState';
import { useInterfaceCopy } from '../data/interface';
import { useMemo } from "react";
import PageHeader from "../components/shared/PageHeader";
import ArtworkImage from "../components/shared/ArtworkImage";
import PrototypeNotice from "../components/shared/PrototypeNotice";
import { useGame } from "../app/providers/GameProvider";
import { useLang } from "../app/providers/LanguageProvider";

export default function LeaderboardPage() {
  const { t } = useLang();
  const c = useInterfaceCopy();
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
    <div className="muras-leaderboard space-y-6">
      <PageHeader
        title={t.leaderboardTitle}
        subtitle={t.leaderboardSubtitle}
        action={{ to: "/community-gallery", label: c.browse }}
      />
      <PrototypeNotice kind="community" />

      <div className="muras-prize-note">
        <div className="text-sm uppercase tracking-[0.2em] opacity-75">
          {t.grandPrize}
        </div>
        <div className="mt-2 text-xl font-bold">
          {t.grandPrizeDesc}
        </div>
      </div>

      <div className="muras-rank-layout">
        <div className="muras-rank-section">
          <h3 className="text-2xl font-black text-ink ">
            {t.topPetroglyphs}
          </h3>

          <div className="mt-5 space-y-3">
            {topArtworks.length === 0 && <EmptyState title={c.noResults}><Link className="muras-link" to="/stone-workshop">{c.createWork}</Link></EmptyState>}
            {topArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className="muras-ranking-row"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft font-black text-ink ">
                  #{index + 1}
                </div>

                <ArtworkImage
                  src={artwork.imageUrl}
                  title={artwork.title}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-ink ">
                    {artwork.title}
                  </h4>
                  <p className="text-sm text-ink ">
                    {t.byAuthor} {artwork.author}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-ink ">
                    {artwork.rating || "—"}★
                  </p>
                  <p className="text-xs text-ink ">
                    {artwork.votes} {t.votes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="muras-rank-section">
          <h3 className="text-2xl font-black text-ink ">
            {t.topArtists}
          </h3>

          <div className="mt-5 space-y-3">
            {topAuthors.map((author, index) => (
              <div
                key={author.author}
                className="muras-ranking-row"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft font-black text-ink ">
                  #{index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-ink ">
                    {author.author}
                  </h4>
                  <p className="text-sm text-ink ">
                    {author.works} {t.worksPublished}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-ink ">
                    {author.avgRating || "—"}★
                  </p>
                  <p className="text-xs text-ink ">
                    {author.totalVotes} {t.votes}
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

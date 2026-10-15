import { useMemo, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import ArtworkImage from "../components/shared/ArtworkImage";
import PrototypeNotice from "../components/shared/PrototypeNotice";
import { useGame } from "../app/providers/GameProvider";
import { useLang } from "../app/providers/LanguageProvider";
import type { ArtworkCategory, WorkshopArtwork } from "../types";
import { Link } from 'react-router-dom';
import EmptyState from '../components/shared/EmptyState';
import { useInterfaceCopy } from '../data/interface';

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

function VoteStars({ artwork, onVote }: { artwork: WorkshopArtwork; onVote: (v: number) => void }) {
  const { t } = useLang();
  return (
    <div className="muras-vote-stars">
      {[1,2,3,4,5].map((star) => (
        <button key={star} aria-label={`${t.rateArtwork}: ${artwork.title}, ${star}/5`} onClick={() => onVote(star)}>
          {star}★
        </button>
      ))}
    </div>
  );
}

export default function CommunityGalleryPage() {
  const { artworks, voteArtwork } = useGame();
  const { t } = useLang();
  const c = useInterfaceCopy();
  const categoryLabels = useMemo(() => getCategoryLabels(t), [t]);
  const [filter, setFilter] = useState<"all" | ArtworkCategory>("all");
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [votedId, setVotedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return artworks.filter(a => a.isPublished && (filter === 'all' || a.category === filter) && `${a.title} ${a.author}`.toLocaleLowerCase().includes(query))
      .sort((a, b) => sort === 'rating' ? b.rating - a.rating || b.votes - a.votes : Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [artworks, filter, search, sort]);

  return (
    <div className="muras-gallery space-y-6">
      <PageHeader title={t.galleryTitle} subtitle={t.gallerySubtitle} action={{ to: '/stone-workshop', label: c.createWork }} />
      <PrototypeNotice kind="community" />

      <div className="muras-gallery-toolbar">
        <div className="muras-search-row"><input type="search" aria-label={c.searchWorks} placeholder={c.searchWorks} value={search} onChange={e => setSearch(e.target.value)} /><select aria-label={c.sort} value={sort} onChange={e => setSort(e.target.value)}><option value="newest">{c.newest}</option><option value="rating">{c.popular}</option></select></div>
        <div className="muras-filters">
          {(["all", "goat", "deer", "hunter", "sun", "abstract"] as const).map((item) => (
            <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${filter === item ? "border-gold bg-gold-soft text-gold  " : "border-line bg-surface text-ink hover:bg-wash    "}`}>
              {item === "all" ? t.filterAll : categoryLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <p className="muras-result-count" role="status">{c.results}: {filtered.length}</p>
      {filtered.length === 0 && <EmptyState title={c.noResults} description={c.tryAgain}><button className="muras-link" onClick={() => { setFilter('all'); setSearch(''); }}>{c.reset}</button><Link className="heritage-button" to="/stone-workshop">{c.createWork}</Link></EmptyState>}
      <div className="muras-gallery-grid">
        {filtered.map((artwork) => (
          <article key={artwork.id} className="muras-artwork">
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
              <div className="muras-artwork-stats">
                {[{ label: t.votes, val: artwork.votes }, { label: t.rating, val: artwork.rating || "—" }, { label: t.voters, val: artwork.voters }].map(({ label, val }) => (
                  <div key={label} className="rounded-2xl border border-line bg-surface p-3  ">
                    <p className="text-xs text-muted ">{label}</p>
                    <p className="mt-1 text-lg font-bold text-ink ">{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-ink ">{t.rateArtwork}</p>
                <VoteStars artwork={artwork} onVote={(v) => { voteArtwork(artwork.id, v); setVotedId(artwork.id); }} />
                <p className="muras-vote-feedback" role="status">{votedId === artwork.id ? c.voteThanks : ''}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

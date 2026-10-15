import PageHeader from "../components/shared/PageHeader";
import StatCard from "../components/shared/StatCard";
import { useGame } from "../app/providers/GameProvider";
import { getXpProgress } from "../utils/level";
import { useLang } from "../app/providers/LanguageProvider";
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useInterfaceCopy } from '../data/interface';

export default function ProfilePage() {
  const { t } = useLang();
  const c = useInterfaceCopy();
  const { level, points, achievements, collection, xp } = useGame();
  const xpProgress = getXpProgress(xp);

  return (
    <div className="muras-profile">
      <PageHeader
        title={t.profileTitle}
        subtitle={t.profileSubtitle}
        action={{ to: '/museum', label: c.viewCollection }}
      />

      <section className="muras-passport">
      <div className="muras-passport-stats">
        <StatCard
          label={t.statLevel}
          value={<span className="text-sage">{level}</span>}
        />
        <StatCard label={t.statPoints} value={points} />
        <StatCard label={t.statArtifacts} value={collection.length} />
      </div>

      <div className="muras-passport-progress">
        <div>
          <h3 className="text-lg font-bold text-ink ">
            {t.xpProgress}
          </h3>
          <div role="progressbar" aria-label={t.xpProgress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={xpProgress} className="mt-4 h-2 overflow-hidden rounded-full heritage-progress">
            <div
              className="h-full rounded-full heritage-progress-fill transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-ink ">
            {xpProgress}/100 XP {t.xpUntilNext}
          </p>
        </div>
      </div>
      </section>
      <div className="muras-profile-body">
        <section className="muras-panel">
          <h3 className="text-lg font-bold text-ink ">
            {t.achievements}
          </h3>
          {achievements.length === 0 ? (
            <p className="mt-3 text-sm text-ink ">
              {t.noAchievements}
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <span
                  key={achievement}
                  className="rounded-full border border-sage bg-sage-soft px-3 py-1 text-sm text-sage"
                >
                  {achievement}
                </span>
              ))}
            </div>
          )}
        </section>
        <section className="muras-next-steps"><h2>{c.next}</h2>{[{ to: '/map', label: t.map }, { to: '/stone-workshop', label: t.stoneLab }, { to: '/museum', label: t.museum }].map((item, i) => <Link to={item.to} key={item.to}><span>0{i + 1}</span>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}</section>
      </div>
    </div>
  );
}

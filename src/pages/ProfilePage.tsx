import PageHeader from "../components/shared/PageHeader";
import StatCard from "../components/shared/StatCard";
import { useGame } from "../app/providers/GameProvider";
import { getXpProgress } from "../utils/level";
import { useLang } from "../app/providers/LanguageProvider";

export default function ProfilePage() {
  const { t } = useLang();
  const { level, points, achievements, collection, xp } = useGame();
  const xpProgress = getXpProgress(xp);

  return (
    <div>
      <PageHeader
        title={t.profileTitle}
        subtitle={t.profileSubtitle}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={t.statLevel}
          value={<span className="text-sage">{level}</span>}
        />
        <StatCard label={t.statPoints} value={points} />
        <StatCard label={t.statArtifacts} value={collection.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glow-card rounded-3xl border border-line bg-surface p-6">
          <h3 className="text-lg font-bold text-ink ">
            {t.xpProgress}
          </h3>
          <div className="mt-4 h-2 overflow-hidden rounded-full heritage-progress">
            <div
              className="h-full rounded-full heritage-progress-fill transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-ink ">
            {xpProgress}/100 XP {t.xpUntilNext}
          </p>
        </div>

        <div className="glow-card rounded-3xl border border-line bg-surface p-6">
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
        </div>
      </div>
    </div>
  );
}

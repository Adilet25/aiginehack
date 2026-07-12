import PageHeader from "../components/shared/PageHeader";
import StatCard from "../components/shared/StatCard";
import { useGame } from "../app/providers/GameProvider";
import { getXpProgress } from "../utils/level";

export default function ProfilePage() {
  const { level, points, achievements, collection, xp } = useGame();
  const xpProgress = getXpProgress(xp);

  return (
    <div>
      <PageHeader
        title="Player Profile"
        subtitle="Уровень, очки, достижения и общий прогресс игрока."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Level"
          value={<span className="text-emerald-400">{level}</span>}
        />
        <StatCard label="Points" value={points} />
        <StatCard label="Artifacts" value={collection.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            XP Progress
          </h3>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-stone-900 dark:text-white/60">
            {xpProgress}/100 XP до следующего уровня
          </p>
        </div>

        <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            Achievements
          </h3>
          {achievements.length === 0 ? (
            <p className="mt-3 text-sm text-stone-900 dark:text-white/55">
              Пока достижений нет. Начни исследование карты и собирай артефакты.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <span
                  key={achievement}
                  className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200"
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

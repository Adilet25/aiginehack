import { Link } from "react-router-dom";
import { Gamepad2, MapPinned, Sparkles, Trophy } from "lucide-react";
import GlowButton from "../components/shared/GlowButton";
import { useGame } from "../app/providers/GameProvider";
import { useLang } from "../app/providers/LanguageProvider";

function PetroSun() {
  return (
    <div className="relative mx-auto flex h-[360px] w-[360px] items-center justify-center md:h-[420px] md:w-[420px]">
      <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />

      {/* Outer rotating ring */}
      <div className="petro-rotate absolute h-[300px] w-[300px] rounded-full border border-amber-700/20 dark:border-amber-400/20 md:h-[360px] md:w-[360px]">
        <div className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2 bg-amber-700/40 dark:bg-amber-400/30" />
        <div className="absolute bottom-0 left-1/2 h-8 w-[2px] -translate-x-1/2 bg-amber-700/40 dark:bg-amber-400/30" />
        <div className="absolute left-0 top-1/2 h-[2px] w-8 -translate-y-1/2 bg-amber-700/40 dark:bg-amber-400/30" />
        <div className="absolute right-0 top-1/2 h-[2px] w-8 -translate-y-1/2 bg-amber-700/40 dark:bg-amber-400/30" />
        <div className="absolute left-[14%] top-[14%] h-6 w-[2px] rotate-[-45deg] bg-amber-700/30 dark:bg-amber-400/20" />
        <div className="absolute right-[14%] top-[14%] h-6 w-[2px] rotate-[45deg] bg-amber-700/30 dark:bg-amber-400/20" />
        <div className="absolute bottom-[14%] left-[14%] h-6 w-[2px] rotate-[45deg] bg-amber-700/30 dark:bg-amber-400/20" />
        <div className="absolute bottom-[14%] right-[14%] h-6 w-[2px] rotate-[-45deg] bg-amber-700/30 dark:bg-amber-400/20" />
      </div>

      {/* Middle ring */}
      <div className="absolute h-[210px] w-[210px] rounded-full border border-amber-600/25 bg-gradient-to-br from-amber-100/60 to-orange-100/60 shadow-[0_0_50px_rgba(180,120,40,0.14)] dark:border-amber-400/25 dark:from-amber-900/30 dark:to-black/20 dark:shadow-[0_0_50px_rgba(217,150,50,0.18)] md:h-[250px] md:w-[250px]">
        <div className="absolute inset-[18px] rounded-full border border-amber-400/20" />
        <div className="absolute inset-[34px] rounded-full border border-amber-500/20" />
      </div>

      {/* Center */}
      <div className="absolute flex h-[120px] w-[120px] items-center justify-center rounded-full border border-amber-600/30 bg-amber-50/80 shadow-[0_0_30px_rgba(180,120,40,0.12)] dark:border-amber-400/30 dark:bg-black/50 dark:shadow-[0_0_30px_rgba(217,150,50,0.16)] md:h-[140px] md:w-[140px]">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-700/60 dark:text-amber-400/60">
            Stone
          </div>
          <div className="mt-2 text-xl font-black text-amber-900 dark:text-white md:text-2xl">
            ТАМГА
          </div>
        </div>
      </div>

      {/* Floating stars */}
      <div className="absolute left-[12%] top-[18%] text-amber-600/70 dark:text-amber-400/60 petro-float">
        ✦
      </div>
      <div className="absolute right-[10%] top-[28%] text-amber-600/55 dark:text-amber-400/45 petro-float-delayed">
        ✦
      </div>
      <div className="absolute bottom-[18%] left-[18%] text-amber-600/55 dark:text-amber-400/45 petro-float-delayed">
        ✦
      </div>
      <div className="absolute bottom-[14%] right-[18%] text-amber-600/70 dark:text-amber-400/60 petro-float">
        ✦
      </div>

      {/* Labels */}
      <div className="absolute left-[5%] top-[46%] rounded-full border border-sage/30 bg-green-50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-green-800 dark:border-emerald-400/20 dark:bg-emerald-950/50 dark:text-emerald-300">
        Үркөр
      </div>
      <div className="absolute right-[2%] top-[58%] rounded-full border border-amber-400/30 bg-amber-50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-800 dark:border-amber-400/20 dark:bg-amber-950/50 dark:text-amber-300">
        Тогоол
      </div>
    </div>
  );
}

export default function HomePage() {
  const { level, points, collection } = useGame();
  const { t } = useLang();

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-amber-500/10 dark:bg-black/30 md:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,146,79,0.10),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(90,122,82,0.08),transparent_40%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(217,150,50,0.16),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(217,150,50,0.08),transparent_40%)]" />
        </div>

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          {/* Left: text + stats */}
          <div>
            <p className="mb-3 inline-flex rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-400">
              {t.heroBadge}
            </p>

            <h1 className="text-4xl font-black leading-tight text-stone-900 dark:text-white md:text-6xl">
              {t.heroTitleLine1}
              <span className="block text-amber-700 dark:text-amber-400">
                {t.heroTitleLine2}
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 dark:text-white/60 md:text-base">
              {t.heroDesc}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/map">
                <GlowButton>{t.startExploring}</GlowButton>
              </Link>
              <Link to="/stone-workshop">
                <GlowButton className="border-stone-300 bg-stone-100 text-stone-700 shadow-none hover:bg-stone-200 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10">
                  {t.openStoneLab}
                </GlowButton>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                {
                  label: t.statLevel,
                  value: level,
                  color: "text-amber-800 dark:text-amber-400",
                },
                {
                  label: t.statPoints,
                  value: points,
                  color: "text-stone-900 dark:text-white",
                },
                {
                  label: t.statArtifacts,
                  value: collection.length,
                  color: "text-stone-900 dark:text-white",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-xs uppercase tracking-wide text-stone-400 dark:text-white/40">
                    {label}
                  </p>
                  <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: decorative sun + feature cards */}
          <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/60 p-6 dark:border-amber-500/10 dark:bg-gradient-to-br dark:from-amber-950/30 dark:to-black/20">
            <PetroSun />

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: MapPinned, title: t.mapCardTitle, desc: t.mapCardDesc },
                {
                  icon: Trophy,
                  title: t.challengeCardTitle,
                  desc: t.challengeCardDesc,
                },
                {
                  icon: Gamepad2,
                  title: t.playCardTitle,
                  desc: t.playCardDesc,
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-stone-200 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <Icon
                    className="mb-3 text-amber-700 dark:text-amber-400"
                    size={20}
                  />
                  <h3 className="font-semibold text-stone-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 dark:text-white/50">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: MapPinned,
            title: t.discoverCultureTitle,
            desc: t.discoverCultureDesc,
            accent:
              "bg-amber-50 border-amber-300/40 text-amber-700 dark:bg-amber-500/10 dark:border-amber-400/20 dark:text-amber-400",
          },
          {
            icon: Sparkles,
            title: t.readSymbolsTitle,
            desc: t.readSymbolsDesc,
            accent:
              "bg-green-50 border-green-300/40 text-green-700 dark:bg-emerald-500/10 dark:border-emerald-400/20 dark:text-emerald-400",
          },
          {
            icon: Trophy,
            title: t.createCompeteTitle,
            desc: t.createCompeteDesc,
            accent:
              "bg-orange-50 border-orange-300/40 text-orange-700 dark:bg-orange-500/10 dark:border-orange-400/20 dark:text-orange-400",
          },
        ].map(({ icon: Icon, title, desc, accent }) => (
          <div
            key={title}
            className="rounded-3xl border border-stone-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:shadow-amber-500/5"
          >
            <div
              className={`mb-3 inline-flex rounded-2xl border p-3 ${accent}`}
            >
              <Icon size={18} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-stone-500 dark:text-white/50">
              {desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

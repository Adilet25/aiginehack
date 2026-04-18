import { Link } from "react-router-dom";
import { Gamepad2, MapPinned, Sparkles, Trophy } from "lucide-react";
import GlowButton from "../components/shared/GlowButton";
import { useGame } from "../app/providers/GameProvider";

function PetroSun() {
  return (
    <div className="relative mx-auto flex h-[360px] w-[360px] items-center justify-center md:h-[420px] md:w-[420px]">
      <div className="absolute inset-0 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="petro-rotate absolute h-[300px] w-[300px] rounded-full border border-amber-300/15 md:h-[360px] md:w-[360px]">
        <div className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2 bg-amber-300/40" />
        <div className="absolute bottom-0 left-1/2 h-8 w-[2px] -translate-x-1/2 bg-amber-300/40" />
        <div className="absolute left-0 top-1/2 h-[2px] w-8 -translate-y-1/2 bg-amber-300/40" />
        <div className="absolute right-0 top-1/2 h-[2px] w-8 -translate-y-1/2 bg-amber-300/40" />

        <div className="absolute left-[14%] top-[14%] h-6 w-[2px] rotate-[-45deg] bg-amber-300/35" />
        <div className="absolute right-[14%] top-[14%] h-6 w-[2px] rotate-[45deg] bg-amber-300/35" />
        <div className="absolute bottom-[14%] left-[14%] h-6 w-[2px] rotate-[45deg] bg-amber-300/35" />
        <div className="absolute bottom-[14%] right-[14%] h-6 w-[2px] rotate-[-45deg] bg-amber-300/35" />
      </div>

      <div className="absolute h-[210px] w-[210px] rounded-full border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 shadow-[0_0_50px_rgba(245,158,11,0.16)] md:h-[250px] md:w-[250px]">
        <div className="absolute inset-[18px] rounded-full border border-white/5" />
        <div className="absolute inset-[34px] rounded-full border border-amber-300/20" />
      </div>

      <div className="absolute flex h-[120px] w-[120px] items-center justify-center rounded-full border border-amber-300/25 bg-black/30 shadow-[0_0_30px_rgba(245,158,11,0.12)] md:h-[140px] md:w-[140px]">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-white/45">
            Stone
          </div>
          <div className="mt-2 text-xl font-black text-amber-100 md:text-2xl">
            ТАМГА
          </div>
        </div>
      </div>

      <div className="absolute left-[12%] top-[18%] text-amber-200/70 petro-float">
        ✦
      </div>
      <div className="absolute right-[10%] top-[28%] text-amber-200/60 petro-float-delayed">
        ✦
      </div>
      <div className="absolute bottom-[18%] left-[18%] text-amber-200/60 petro-float-delayed">
        ✦
      </div>
      <div className="absolute bottom-[14%] right-[18%] text-amber-200/70 petro-float">
        ✦
      </div>

      <div className="absolute left-[5%] top-[46%] rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
        Үркөр
      </div>

      <div className="absolute right-[2%] top-[58%] rounded-full border border-amber-300/20 bg-amber-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-100">
        Тогоол
      </div>
    </div>
  );
}

export default function HomePage() {
  const { level, points, collection } = useGame();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glow-card rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="stone-noise absolute inset-0 opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_28%)]" />
          <div className="petro-lines absolute inset-0 opacity-25" />
        </div>

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Cultural gaming platform
            </p>

            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              Explore
              <span className="glow-text block text-amber-400">
                Kyrgyz Heritage
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
              Интерактивная платформа, которая делает культуру Кыргызстана
              интересной через карту, петроглифы, сакральные места, цифровые
              артефакты и геймификацию.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/map">
                <GlowButton>Start Exploring</GlowButton>
              </Link>

              <Link to="/stone-workshop">
                <GlowButton className="border-white/15 bg-white/5 shadow-none hover:bg-white/10">
                  Open Stone Lab
                </GlowButton>
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Level
                </p>
                <p className="mt-2 text-2xl font-black text-amber-100">
                  {level}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Points
                </p>
                <p className="mt-2 text-2xl font-black text-white">{points}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Artifacts
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {collection.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6">
            <PetroSun />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <MapPinned className="mb-3 text-amber-300" size={20} />
                <h3 className="font-semibold text-white">Map</h3>
                <p className="mt-1 text-xs text-white/55">
                  Discover sacred places
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <Trophy className="mb-3 text-amber-300" size={20} />
                <h3 className="font-semibold text-white">Challenge</h3>
                <p className="mt-1 text-xs text-white/55">
                  Compete with artworks
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <Gamepad2 className="mb-3 text-amber-300" size={20} />
                <h3 className="font-semibold text-white">Play</h3>
                <p className="mt-1 text-xs text-white/55">
                  Learn through interaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1">
          <div className="mb-3 inline-flex rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-amber-200">
            <MapPinned size={18} />
          </div>
          <h3 className="text-lg font-bold">Discover Culture</h3>
          <p className="mt-2 text-sm text-white/65">
            Изучай сакральные места, петроглифы и культурные объекты на карте.
          </p>
        </div>

        <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1">
          <div className="mb-3 inline-flex rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-amber-200">
            <Sparkles size={18} />
          </div>
          <h3 className="text-lg font-bold">Read the Symbols</h3>
          <p className="mt-2 text-sm text-white/65">
            Интерпретируй рисунки, учись читать древние знаки и смыслы.
          </p>
        </div>

        <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1">
          <div className="mb-3 inline-flex rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-amber-200">
            <Trophy size={18} />
          </div>
          <h3 className="text-lg font-bold">Create & Compete</h3>
          <p className="mt-2 text-sm text-white/65">
            Создавай свои петроглифы, публикуй их и соревнуйся с другими.
          </p>
        </div>
      </section>
    </div>
  );
}

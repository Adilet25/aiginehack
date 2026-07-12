import { Link } from "react-router-dom";
import { Gamepad2, MapPinned, Sparkles, Trophy } from "lucide-react";
import GlowButton from "../components/shared/GlowButton";
import { useGame } from "../app/providers/GameProvider";

function PetroSun() {
  return (
    <div className="relative mx-auto flex h-[360px] w-[360px] items-center justify-center md:h-[420px] md:w-[420px]">
      <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-3xl" />

      {/* Outer rotating ring */}
      <div className="petro-rotate absolute h-[300px] w-[300px] rounded-full border border-amber-700/20 md:h-[360px] md:w-[360px]">
        <div className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2 bg-amber-700/40" />
        <div className="absolute bottom-0 left-1/2 h-8 w-[2px] -translate-x-1/2 bg-amber-700/40" />
        <div className="absolute left-0 top-1/2 h-[2px] w-8 -translate-y-1/2 bg-amber-700/40" />
        <div className="absolute right-0 top-1/2 h-[2px] w-8 -translate-y-1/2 bg-amber-700/40" />
        <div className="absolute left-[14%] top-[14%] h-6 w-[2px] rotate-[-45deg] bg-amber-700/30" />
        <div className="absolute right-[14%] top-[14%] h-6 w-[2px] rotate-[45deg] bg-amber-700/30" />
        <div className="absolute bottom-[14%] left-[14%] h-6 w-[2px] rotate-[45deg] bg-amber-700/30" />
        <div className="absolute bottom-[14%] right-[14%] h-6 w-[2px] rotate-[-45deg] bg-amber-700/30" />
      </div>

      {/* Middle ring */}
      <div className="absolute h-[210px] w-[210px] rounded-full border border-amber-600/25 bg-gradient-to-br from-amber-100/60 to-orange-100/60 shadow-[0_0_50px_rgba(180,120,40,0.14)] md:h-[250px] md:w-[250px]">
        <div className="absolute inset-[18px] rounded-full border border-amber-400/20" />
        <div className="absolute inset-[34px] rounded-full border border-amber-500/20" />
      </div>

      {/* Center */}
      <div className="absolute flex h-[120px] w-[120px] items-center justify-center rounded-full border border-amber-600/30 bg-amber-50/80 shadow-[0_0_30px_rgba(180,120,40,0.12)] md:h-[140px] md:w-[140px]">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-700/60">Stone</div>
          <div className="mt-2 text-xl font-black text-amber-900 md:text-2xl">ТАМГА</div>
        </div>
      </div>

      {/* Floating stars */}
      <div className="absolute left-[12%] top-[18%] text-amber-600/70 petro-float">✦</div>
      <div className="absolute right-[10%] top-[28%] text-amber-600/55 petro-float-delayed">✦</div>
      <div className="absolute bottom-[18%] left-[18%] text-amber-600/55 petro-float-delayed">✦</div>
      <div className="absolute bottom-[14%] right-[18%] text-amber-600/70 petro-float">✦</div>

      {/* Labels */}
      <div className="absolute left-[5%] top-[46%] rounded-full border border-sage/30 bg-green-50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-green-800">
        Үркөр
      </div>
      <div className="absolute right-[2%] top-[58%] rounded-full border border-amber-400/30 bg-amber-50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-800">
        Тогоол
      </div>
    </div>
  );
}

export default function HomePage() {
  const { level, points, collection } = useGame();

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white/60 p-6 shadow-sm backdrop-blur md:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,146,79,0.10),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(90,122,82,0.08),transparent_40%)]" />
        </div>

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          {/* Left: text + stats */}
          <div>
            <p className="mb-3 inline-flex rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Cultural gaming platform
            </p>

            <h1 className="text-4xl font-black leading-tight text-stone-900 md:text-6xl">
              Explore
              <span className="block text-amber-700">Kyrgyz Heritage</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 md:text-base">
              Интерактивная платформа, которая делает культуру Кыргызстана
              интересной через карту, петроглифы, сакральные места, цифровые
              артефакты и геймификацию.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/map">
                <GlowButton>Start Exploring</GlowButton>
              </Link>
              <Link to="/stone-workshop">
                <GlowButton className="border-stone-300 bg-stone-100 text-stone-700 shadow-none hover:bg-stone-200">
                  Open Stone Lab
                </GlowButton>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                { label: "Level",     value: level,            color: "text-amber-800" },
                { label: "Points",    value: points,           color: "text-stone-900" },
                { label: "Artifacts", value: collection.length, color: "text-stone-900" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-stone-400">{label}</p>
                  <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: decorative sun + feature cards */}
          <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/60 p-6">
            <PetroSun />

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: MapPinned, title: "Map",       desc: "Discover sacred places"   },
                { icon: Trophy,    title: "Challenge",  desc: "Compete with artworks"    },
                { icon: Gamepad2,  title: "Play",       desc: "Learn through interaction" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-stone-200 bg-white/70 p-4 shadow-sm">
                  <Icon className="mb-3 text-amber-700" size={20} />
                  <h3 className="font-semibold text-stone-900">{title}</h3>
                  <p className="mt-1 text-xs text-stone-500">{desc}</p>
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
            title: "Discover Culture",
            desc: "Изучай сакральные места, петроглифы и культурные объекты на карте.",
            accent: "bg-amber-50 border-amber-300/40 text-amber-700",
          },
          {
            icon: Sparkles,
            title: "Read the Symbols",
            desc: "Интерпретируй рисунки, учись читать древние знаки и смыслы.",
            accent: "bg-green-50 border-green-300/40 text-green-700",
          },
          {
            icon: Trophy,
            title: "Create & Compete",
            desc: "Создавай свои петроглифы, публикуй их и соревнуйся с другими.",
            accent: "bg-orange-50 border-orange-300/40 text-orange-700",
          },
        ].map(({ icon: Icon, title, desc, accent }) => (
          <div key={title} className="rounded-3xl border border-stone-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className={`mb-3 inline-flex rounded-2xl border p-3 ${accent}`}>
              <Icon size={18} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">{title}</h3>
            <p className="mt-2 text-sm text-stone-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

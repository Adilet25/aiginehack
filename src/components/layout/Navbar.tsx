import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Compass,
  House,
  User,
  CalendarDays,
  Sparkles,
  Hammer,
  Images,
  Medal,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { useLang } from "../../app/providers/LanguageProvider";

const groupedNav = [
  {
    label: "Explore",
    items: [
      { to: "/", label: "Home", icon: House },
      { to: "/map", label: "Map", icon: Compass },
      { to: "/calendar", label: "Calendar", icon: CalendarDays },
    ],
  },
  {
    label: "Play",
    items: [
      { to: "/petroglyph-quiz", label: "Petro Quiz", icon: Sparkles },
      { to: "/stone-workshop", label: "Stone Lab", icon: Hammer },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/community-gallery", label: "Gallery", icon: Images },
      { to: "/leaderboard", label: "Leaderboard", icon: Medal },
    ],
  },
];

const singleNav = [{ to: "/profile", label: "Profile", icon: User }];

const languageLabels = { kg: "Кыргызча", ru: "Русский", en: "English" };

type DropdownProps = {
  label: string;
  items: {
    to: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[];
};

function NavDropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const openMenu = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  };
  const closeMenu = () => {
    closeTimeoutRef.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onFocusCapture={openMenu}
      onBlurCapture={closeMenu}
    >
      <button
        type="button"
        className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-stone-100/70 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-400/60 hover:bg-amber-50 hover:text-amber-800"
      >
        <span>{label}</span>
        <ChevronDown
          size={16}
          className={clsx(
            "transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      <div
        className={clsx(
          "absolute left-0 top-full z-50 pt-2 transition-all duration-200",
          open
            ? "pointer-events-auto visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="absolute left-0 right-0 top-0 h-3" />
        <div className="w-60 rounded-3xl border border-stone-200 bg-white/95 p-2 shadow-xl backdrop-blur-xl">
          {items.map(({ to, label: itemLabel, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  isActive
                    ? "bg-amber-100 text-amber-900 font-medium"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                )
              }
            >
              <Icon size={16} />
              <span>{itemLabel}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const initialTheme = stored === "dark" ? "dark" : "light";
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/85 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="block">
          <div className="text-lg font-black tracking-wide text-stone-900 md:text-xl">
            KYRGYZ
            <span className="ml-2 text-amber-700">HERITAGE</span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone-400">
            Sacred Tech Platform
          </p>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 xl:flex">
          {groupedNav.map((group) => (
            <NavDropdown
              key={group.label}
              label={group.label}
              items={group.items}
            />
          ))}
          {singleNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "border-amber-500/40 bg-amber-100 text-amber-900 shadow-sm"
                    : "border-stone-300 bg-stone-100/70 text-stone-700 hover:border-amber-400/60 hover:bg-amber-50 hover:text-amber-800",
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Language selector + mobile toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "kg" | "ru" | "en")}
              className="appearance-none rounded-2xl border border-stone-300 bg-stone-100/70 px-4 py-2 pr-10 text-sm font-medium text-stone-700 outline-none transition hover:bg-amber-50"
            >
              {Object.entries(languageLabels).map(([k, v]) => (
                <option key={k} value={k} className="bg-white text-stone-900">
                  {v}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
            />
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-stone-100/70 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-400/60 hover:bg-amber-50 hover:text-amber-800"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            className="xl:hidden rounded-2xl border border-stone-300 bg-stone-100/70 px-4 py-2 text-sm text-stone-700"
          >
            Menu
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((p) => !p)}
          className="rounded-2xl border border-stone-300 bg-stone-100/70 px-4 py-2 text-sm text-stone-700 xl:hidden"
        >
          Menu
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "overflow-hidden border-t border-stone-200/60 px-3 transition-all duration-300 xl:hidden",
          mobileOpen ? "max-h-[700px] py-3" : "max-h-0 py-0",
        )}
      >
        <div className="mb-4 flex justify-end">
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "kg" | "ru" | "en")}
              className="appearance-none rounded-2xl border border-stone-300 bg-stone-100/70 px-4 py-2 pr-10 text-sm font-medium text-stone-700 outline-none"
            >
              {Object.entries(languageLabels).map(([k, v]) => (
                <option key={k} value={k} className="bg-white text-stone-900">
                  {v}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
            />
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-3 flex items-center gap-2 rounded-2xl border border-stone-300 bg-stone-100/70 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-400/60 hover:bg-amber-50 hover:text-amber-800"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>

        <div className="space-y-4">
          {groupedNav.map((group) => (
            <div
              key={group.label}
              className="rounded-3xl border border-stone-200 bg-white/70 p-3"
            >
              <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                {group.label}
              </div>
              <div className="grid gap-2">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                        isActive
                          ? "border border-amber-400/40 bg-amber-100 text-amber-900 font-medium"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                      )
                    }
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-stone-200 bg-white/70 p-3">
            <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              Account
            </div>
            <div className="grid gap-2">
              {singleNav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                      isActive
                        ? "border border-amber-400/40 bg-amber-100 text-amber-900 font-medium"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                    )
                  }
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

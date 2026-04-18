import { useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Compass,
  House,
  User,
  CalendarDays,
  Sparkles,
  Hammer,
  Images,
  Medal,
  ChevronDown,
} from 'lucide-react'
import clsx from 'clsx'
import { useLang } from '../../app/providers/LanguageProvider'


const groupedNav = [
  {
    label: 'Explore',
    items: [
      { to: '/', label: 'Home', icon: House },
      { to: '/map', label: 'Map', icon: Compass },
      { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    ],
  },
  {
    label: 'Play',
    items: [
      { to: '/petroglyph-quiz', label: 'Petro Quiz', icon: Sparkles },
      { to: '/stone-workshop', label: 'Stone Lab', icon: Hammer },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/community-gallery', label: 'Gallery', icon: Images },
      { to: '/leaderboard', label: 'Leaderboard', icon: Medal },
    ],
  },
]

const singleNav = [{ to: '/profile', label: 'Profile', icon: User }]

const languageLabels = {
  kg: 'Кыргызча',
  ru: 'Русский',
  en: 'English',
}

type DropdownProps = {
  label: string
  items: {
    to: string
    label: string
    icon: React.ComponentType<{ size?: number; className?: string }>
  }[]
}

function NavDropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)

  const openMenu = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpen(true)
  }

  const closeMenu = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false)
    }, 120)
  }

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
        className={clsx(
          'flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition',
          'hover:border-white/20 hover:bg-white/10 hover:text-white'
        )}
      >
        <span>{label}</span>
        <ChevronDown
          size={16}
          className={clsx(
            'transition-transform duration-200',
            open ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      <div
        className={clsx(
          'absolute left-0 top-full z-50 pt-2 transition-all duration-200',
          open
            ? 'pointer-events-auto visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible -translate-y-1 opacity-0'
        )}
      >
        {/* invisible hover bridge */}
        <div className="absolute left-0 right-0 top-0 h-3" />

        <div className="w-60 rounded-3xl border border-white/10 bg-black/80 p-2 shadow-2xl backdrop-blur-xl">
          {items.map(({ to, label: itemLabel, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                  isActive
                    ? 'bg-amber-500/15 text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
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
  )
}

export default function Navbar() {
  const { lang, setLang } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="block">
          <div className="text-lg font-black tracking-wide text-white md:text-xl">
            KYRGYZ
            <span className="ml-2 text-amber-300">HERITAGE</span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
            Sacred Tech Platform
          </p>
        </Link>

        <nav className="hidden items-center gap-3 xl:flex">
          {groupedNav.map((group) => (
            <NavDropdown key={group.label} label={group.label} items={group.items} />
          ))}

          {singleNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'border-amber-400/40 bg-amber-500/15 text-white shadow-[0_0_20px_rgba(197,139,72,0.15)]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'kg' | 'ru' | 'en')}
              className="appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-2 pr-10 text-sm font-medium text-white outline-none transition hover:bg-white/10"
            >
              <option value="kg" className="bg-neutral-900 text-white">
                {languageLabels.kg}
              </option>
              <option value="ru" className="bg-neutral-900 text-white">
                {languageLabels.ru}
              </option>
              <option value="en" className="bg-neutral-900 text-white">
                {languageLabels.en}
              </option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="xl:hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
          >
            Menu
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white xl:hidden"
        >
          Menu
        </button>
      </div>

      <div
        className={clsx(
          'overflow-hidden border-t border-white/5 px-3 transition-all duration-300 xl:hidden',
          mobileOpen ? 'max-h-[700px] py-3' : 'max-h-0 py-0'
        )}
      >
        <div className="mb-4 flex justify-end">
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'kg' | 'ru' | 'en')}
              className="appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-2 pr-10 text-sm font-medium text-white outline-none transition hover:bg-white/10"
            >
              <option value="kg" className="bg-neutral-900 text-white">
                {languageLabels.kg}
              </option>
              <option value="ru" className="bg-neutral-900 text-white">
                {languageLabels.ru}
              </option>
              <option value="en" className="bg-neutral-900 text-white">
                {languageLabels.en}
              </option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            />
          </div>
        </div>

        <div className="space-y-4">
          {groupedNav.map((group) => (
            <div
              key={group.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-3"
            >
              <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
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
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                        isActive
                          ? 'border border-amber-400/30 bg-amber-500/15 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
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

          <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
            <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
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
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                      isActive
                        ? 'border border-amber-400/30 bg-amber-500/15 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
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
  )
}
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/lib/context'
import { Language } from '@/types'
import { Moon, Sun, Menu, X, GraduationCap, Compass, LayoutDashboard, Shield, BookOpen, Map, Library, LogOut, User as UserIcon, FileText } from 'lucide-react'

const NAV = [
  { href: '/opportunities', key: 'nav.opportunities', icon: Compass },
  { href: '/courses', key: 'nav.courses', icon: BookOpen },
  { href: '/knowledge', key: 'nav.knowledge', icon: Library },
  { href: '/essays', key: 'nav.essays', icon: FileText },
  { href: '/roadmap', key: 'nav.roadmap', icon: Map },
  { href: '/dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/admin', key: 'nav.admin', icon: Shield },
]

const LANGS: { code: Language; label: string }[] = [
  { code: 'ru', label: 'РУ' },
  { code: 'en', label: 'EN' },
  { code: 'kz', label: 'ҚАЗ' },
]

export default function Navbar() {
  const { t, lang, setLang, user, logout } = useApp()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setVisible(y < 80 || y < lastScrollY.current)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <header className={`sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-lg transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="section flex h-12 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span
            className="grid size-7 place-items-center rounded-lg text-white shadow-md shadow-brand/30"
            style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-2))' }}
          >
            <GraduationCap size={16} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-ink">
            Mentoria<span className="text-brand"> Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map(({ href, key, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? 'bg-brand/10 text-brand' : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
                }`}
              >
                <Icon size={16} /> {t(key)}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="hidden items-center rounded-lg border border-line p-0.5 sm:flex">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`rounded-md px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  lang === l.code ? 'bg-brand text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Сменить тему"
            className="grid size-8 place-items-center rounded-lg border border-line text-ink-soft hover:text-ink cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth */}
          {user ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg bg-brand/10 px-2.5 py-1.5 text-xs font-bold text-brand">
                <UserIcon size={14} /> {(user as any).username || t('nav.dashboard')}
              </Link>
              <button onClick={logout} className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:text-red-400 cursor-pointer" title="Выйти">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link href="/auth/login" className="btn-ghost !py-1.5 !px-3 text-xs">Войти</Link>
              <Link href="/auth/register" className="btn-primary !py-1.5 !px-3 text-xs">Регистрация</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid size-8 place-items-center rounded-lg border border-line text-ink lg:hidden cursor-pointer"
            aria-label="Меню"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="section flex flex-col gap-1 py-3">
            {NAV.map(({ href, key, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    active ? 'bg-brand/10 text-brand' : 'text-ink-soft'
                  }`}
                >
                  <Icon size={18} /> {t(key)}
                </Link>
              )
            })}
            <Link href={user ? '/dashboard' : '/onboarding'} onClick={() => setOpen(false)} className="btn-primary mt-2">
              {user ? t('nav.dashboard') : t('hero.cta.join')}
            </Link>
            <div className="mt-2 flex gap-1">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={lang === l.code ? 'chip-on' : 'chip'}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

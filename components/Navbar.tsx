'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useApp } from '@/lib/context'
import { Language } from '@/types'

export default function Navbar() {
  const { t, lang, setLang, user } = useApp()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/opportunities', label: t('nav.opportunities') },
    { href: '/courses', label: t('nav.courses') },
    { href: '/dashboard', label: t('nav.dashboard') },
    { href: '/roadmap', label: t('nav.roadmap') },
  ]

  const langs: Language[] = ['ru', 'kz', 'en']

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      height: '64px',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--gradient-accent)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: '800', color: 'white',
          }}>M</div>
          <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--text-primary)' }}>
            Mentoria <span className="gradient-text">Hub</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${pathname.startsWith(l.href) ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/admin" className="nav-link" style={{ marginLeft: '4px' }}>
            {t('nav.admin')}
          </Link>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language switcher */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            {langs.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: lang === l ? 'var(--accent)' : 'transparent',
                  color: lang === l ? 'white' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Dashboard btn */}
          <Link href="/dashboard" className="btn-primary btn-sm" style={{ display: 'flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {user ? t('nav.dashboard') : t('hero.cta.join')}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px', display: 'none' }}
            className="mobile-menu-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
          padding: '16px',
        }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', marginBottom: '4px', padding: '10px 12px' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

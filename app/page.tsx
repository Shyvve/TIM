'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const stats = [
  { value: '31%', key: 'stats.seeking', color: 'var(--accent-light)' },
  { value: '35%', key: 'stats.abandoned', color: '#f87171' },
  { value: '2×', key: 'stats.complete', color: '#4ade80' },
]

const features = [
  {
    icon: '🎯',
    title: 'Каталог возможностей',
    desc: 'Олимпиады, хакатоны, стипендии и летние школы для школьников ЦА — всё в одном месте с фильтрами.'
  },
  {
    icon: '📋',
    title: 'Пайплайн заявок',
    desc: 'Канбан-трекер со статусами: Интересно → Готовлюсь → Подал → Результат. Никаких брошенных заявок.'
  },
  {
    icon: '🔗',
    title: 'Возможность → Курс',
    desc: 'Нашёл хакатон? Платформа сразу покажет, какой навык нужен и какой курс поможет его прокачать.'
  },
  {
    icon: '🗺️',
    title: 'Roadmap по классам',
    desc: 'Чёткий план: что делать в 9, 10, 11 и 12 классе, чтобы поступить в лучшие университеты.'
  },
]

export default function Home() {
  const { t, user } = useApp()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <div>
      {/* HERO */}
      <section className="hero-bg" style={{ padding: '100px 0 80px', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '760px', opacity: mounted ? 1 : 0, transition: 'opacity 0.5s' }}>
            {/* Badge */}
            <div style={{ marginBottom: '24px' }}>
              <span className="badge badge-accent" style={{ fontSize: '13px', padding: '6px 14px' }}>
                ✦ {t('hero.badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px' }}>
              <span style={{ color: 'var(--text-primary)' }}>{t('hero.title1')} </span>
              <span className="gradient-text">{t('hero.title2')} </span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>{t('hero.title3')}</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '600px', marginBottom: '40px' }}>
              {t('hero.subtitle')}
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
              <Link href="/opportunities" className="btn-primary" style={{ fontSize: '16px', padding: '14px 28px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                {t('hero.cta.opportunities')}
              </Link>
              <Link href="/courses" className="btn-secondary" style={{ fontSize: '16px', padding: '14px 28px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                {t('hero.cta.courses')}
              </Link>
              {!user && (
                <Link href="/onboarding" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 28px' }}>
                  {t('hero.cta.join')} →
                </Link>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {stats.map((s, i) => (
                <div key={i} className={`animate-fade-up stagger-${i + 1}`} style={{ opacity: 0 }}>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: s.color, lineHeight: '1' }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '160px', lineHeight: '1.4' }}>
                    {t(s.key)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating visual (right side on large screens) */}
          <div className="hero-visual" style={{
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '380px',
            display: 'none',
          }}>
            <div className="animate-float" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>Мои возможности</div>
              {[
                { title: 'STEM Хакатон NIS', status: 'Готовлюсь', color: '#fbbf24' },
                { title: 'Болашак-джуниор', status: 'Интересно', color: '#60a5fa' },
                { title: 'Junior Achievement', status: 'Подал', color: '#a78bfa' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.title}</span>
                  <span style={{ fontSize: '11px', color: item.color, fontWeight: '600', padding: '2px 8px', background: `${item.color}15`, borderRadius: '10px' }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1100px) {
            .hero-visual { display: block !important; }
          }
          .hero-bg { position: relative; }
        `}</style>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', marginBottom: '16px' }}>
              Как это работает
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              Весь путь от находки до результата — в одном месте
            </p>
          </div>

          {/* Flow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { step: '1', label: 'Найти', emoji: '🔍', desc: 'Каталог возможностей с фильтрами' },
              { step: '→', label: '', emoji: '', desc: '' },
              { step: '2', label: 'Сохранить', emoji: '📌', desc: 'Попадает в «Интересно»' },
              { step: '→', label: '', emoji: '', desc: '' },
              { step: '3', label: 'Подготовиться', emoji: '📚', desc: 'Курс по нужному навыку' },
              { step: '→', label: '', emoji: '', desc: '' },
              { step: '4', label: 'Подать', emoji: '🚀', desc: 'Двигай по пайплайну' },
              { step: '→', label: '', emoji: '', desc: '' },
              { step: '5', label: 'Результат', emoji: '🏆', desc: 'Фиксируй итог' },
            ].map((item, i) => {
              if (item.step === '→') {
                return <div key={i} style={{ color: 'var(--text-muted)', fontSize: '20px', fontWeight: '300', padding: '0 4px' }}>→</div>
              }
              return (
                <div key={i} style={{
                  textAlign: 'center',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px 16px',
                  minWidth: '120px',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', marginBottom: '16px' }}>
              Три вещи, которых нет нигде
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              Не просто каталог — движок доведения до результата
            </p>
          </div>

          <div className="grid-cards">
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: 'var(--gradient-accent)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '20px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM NUMBERS */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="badge badge-red" style={{ fontSize: '13px', padding: '6px 14px' }}>
              📊 Данные рынка
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: '800', marginBottom: '16px' }}>
            Проблема не в поиске — в доведении до действия
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            Возможностей полно в Telegram. Проблема — не бросить на полпути.
          </p>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { num: '31%', label: 'учеников активно ищут возможности', source: 'Sallie Mae, 2025', bad: false },
              { num: '35%', label: 'начатых заявок никогда не отправляются', source: 'NSPA, 2025', bad: true },
              { num: '69%', label: 'даже не начинают искать — не знают с чего', source: 'Оценка рынка', bad: true },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: `1px solid ${s.bad ? 'rgba(239,68,68,0.2)' : 'rgba(108,99,255,0.2)'}`,
                borderRadius: '20px',
                padding: '32px 28px',
                minWidth: '200px',
                flex: '1',
                maxWidth: '280px',
              }}>
                <div style={{ fontSize: '52px', fontWeight: '900', color: s.bad ? '#f87171' : 'var(--accent-light)', lineHeight: '1', marginBottom: '12px' }}>{s.num}</div>
                <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>{s.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '20px', display: 'inline-block' }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'var(--gradient-card)',
            border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: '24px',
            padding: '60px 40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}/>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', marginBottom: '16px', position: 'relative' }}>
              Начни сейчас — первая возможность ждёт
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '36px', position: 'relative' }}>
              Пройди онбординг за 2 минуты и получи персональные рекомендации
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link href="/onboarding" className="btn-primary" style={{ fontSize: '17px', padding: '16px 32px' }}>
                🚀 {t('hero.cta.join')}
              </Link>
              <Link href="/opportunities" className="btn-secondary" style={{ fontSize: '17px', padding: '16px 32px' }}>
                {t('hero.cta.opportunities')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

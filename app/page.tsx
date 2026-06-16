'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context'
import { useEffect, useState } from 'react'

const stats = [
  { value: '31%', key: 'stats.seeking', color: 'var(--accent-light)' },
  { value: '35%', key: 'stats.abandoned', color: '#f87171' },
  { value: '2×', key: 'stats.complete', color: '#4ade80' },
]

export default function Home() {
  const { t, user } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="ambient-glow"></div>
      
      {/* HERO */}
      <section style={{ padding: '120px 0 80px', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease-out' }}>
            
            {/* Badge */}
            <div className="animate-slide-up" style={{ marginBottom: '32px' }}>
              <span className="badge" style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: 'var(--text-secondary)',
                padding: '6px 16px',
                borderRadius: '99px',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ color: 'var(--accent)' }}>✦</span> {t('hero.badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-slide-up delay-100" style={{ 
              fontSize: 'clamp(48px, 8vw, 84px)', 
              fontWeight: '900', 
              lineHeight: '1.05', 
              marginBottom: '24px',
              letterSpacing: '-0.04em'
            }}>
              <span style={{ color: '#ffffff' }}>{t('hero.title1')} </span>
              <span className="gradient-text">{t('hero.title2')} </span>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('hero.title3')}</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-slide-up delay-200" style={{ 
              fontSize: '20px', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6', 
              maxWidth: '640px', 
              margin: '0 auto 48px',
              fontWeight: '400'
            }}>
              {t('hero.subtitle')}
            </p>

            {/* CTA buttons */}
            <div className="animate-slide-up delay-300" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/opportunities" className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                {t('hero.cta.opportunities')}
              </Link>
              <Link href="/courses" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                {t('hero.cta.courses')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID FEATURES */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>
              Designed to <span className="gradient-text">Execute</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              Не просто витрина. Мы строим пайплайн, который доводит тебя до результата.
            </p>
          </div>

          <div className="bento-grid">
            
            {/* Feature 1: Large Card */}
            <div className="bento-item bento-col-8 bento-row-2">
              <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
              <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Kanban Пайплайн</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '400px', marginBottom: '32px' }}>
                Мы знаем, что 35% начатых заявок никогда не отправляются. Наш дашборд превращает сохранённые олимпиады в чёткий трекер задач.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                {['Интересно', 'Готовлюсь', 'Подал', 'Результат'].map((status, i) => (
                  <div key={i} style={{
                    flex: 1, padding: '16px', background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i===3?'#4ade80':i===2?'#a855f7':i===1?'#eab308':'#3b82f6', marginBottom: '12px' }}></div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 2: Small Card */}
            <div className="bento-item bento-col-4">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>Навык → Курс</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Нашёл хакатон, но не хватает навыков? Мы сразу рекомендуем нужный мини-курс для подготовки.
              </p>
            </div>

            {/* Feature 3: Small Card */}
            <div className="bento-item bento-col-4">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🗺️</div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>Roadmap 9-12 кл</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Чёткий чек-лист действий для каждого года обучения, чтобы поступить в топовый университет.
              </p>
            </div>

            {/* Feature 4: Wide Card */}
            <div className="bento-item bento-col-12" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '48px' }}>
              <div style={{ position: 'absolute', top: '-100px', left: '20%', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(0,240,255,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
              <div style={{ maxWidth: '500px' }}>
                <h3 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '16px', color: '#fff' }}>Онбординг за 1 минуту</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                  Скажи нам свой класс и интересы, и мы автоматически соберём ленту релевантных конкурсов.
                </p>
              </div>
              <div className="animate-float d-md-block" style={{ display: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px', width: '300px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Бизнес', 'Программирование', 'IELTS', 'Хакатоны'].map(t => (
                    <span key={t} style={{ padding: '8px 16px', borderRadius: '99px', background: 'rgba(0,240,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,240,255,0.2)', fontSize: '14px', fontWeight: '500' }}>✓ {t}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <style>{`
          @media (min-width: 768px) {
            .d-md-block { display: block !important; }
          }
        `}</style>
      </section>

      {/* CTA SECTION */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', background: 'linear-gradient(180deg, var(--bg-primary) 0%, #080808 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', marginBottom: '24px', color: '#fff', letterSpacing: '-0.02em' }}>
            Готов начать?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '20px', marginBottom: '40px' }}>
            Первая возможность уже ждёт в твоём кабинете.
          </p>
          <Link href="/onboarding" className="btn-primary" style={{ padding: '16px 40px', fontSize: '18px' }}>
            Присоединиться к Mentoria Hub
          </Link>
        </div>
      </section>

    </div>
  )
}

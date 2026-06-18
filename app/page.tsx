'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context'
import {
  Compass, BookOpen, LayoutDashboard, Sparkles, ArrowRight, Search,
  BadgeCheck, CalendarClock, Globe, Bot, Award, Users,
} from 'lucide-react'

function FeatureCard({ icon: Icon, title, text, color }: { icon: any; title: string; text: string; color: string }) {
  return (
    <div className="card-hover p-6">
      <span className="grid size-12 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-soft">{text}</p>
    </div>
  )
}

function Stat({ value, label, color = 'var(--color-brand)' }: { value: string; label: string; color?: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  )
}

const STEPS = [
  { n: 1, t: 'Создай профиль', d: 'Выбери класс, интересы, предметы и цели за минуту.' },
  { n: 2, t: 'Получи рекомендации', d: 'Платформа подберёт возможности и курсы под твой профиль.' },
  { n: 3, t: 'Сохраняй и учись', d: 'Добавляй в избранное, отслеживай дедлайны и проходи уроки.' },
  { n: 4, t: 'Следи за прогрессом', d: 'Личный кабинет показывает прогресс и ближайшие дедлайны.' },
]

export default function Home() {
  const { t, user } = useApp()

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{ background: 'radial-gradient(60% 60% at 20% 0%, color-mix(in srgb, var(--color-brand) 22%, transparent), transparent), radial-gradient(50% 50% at 90% 10%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent)' }}
        />
        <div className="section grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="chip border-brand/30 bg-brand/10 text-brand">
              <Sparkles size={14} /> {t('hero.badge')}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] text-ink sm:text-5xl">
              {t('hero.title1')} {t('hero.title2')}<br />{t('hero.title3')}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">{t('hero.subtitle')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/opportunities" className="btn-primary text-base !px-5 !py-3">
                <Search size={18} /> {t('hero.cta.opportunities')}
              </Link>
              <Link href={user ? '/courses' : '/onboarding'} className="btn-outline text-base !px-5 !py-3">
                <BookOpen size={18} /> {t('hero.cta.courses')}
              </Link>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              <Stat value="12+" label="возможностей" />
              <Stat value="3" label="курса с тестами" color="var(--color-accent)" />
              <Stat value="6" label="направлений" color="#8b5cf6" />
            </div>
          </div>

          {/* Hero mockup card */}
          <div className="relative">
            <div className="card fadeup p-5 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-ink">Рекомендовано тебе</p>
                <span className="badge bg-brand/10 text-brand"><Bot size={12} /> AI</span>
              </div>
              {[
                { t: 'Mentoria AI Hackathon 2026', m: 'Хакатон · STEM', c: 'var(--color-brand)' },
                { t: 'Английский для академ. успеха', m: 'Курс · 3 урока', c: 'var(--color-accent)' },
                { t: 'Стипендия Bolashak', m: 'Стипендия · 11 кл.', c: '#8b5cf6' },
              ].map((x, i) => (
                <div key={i} className="mb-2 flex items-center gap-3 rounded-xl border border-line p-3">
                  <span className="size-9 shrink-0 rounded-lg" style={{ background: `color-mix(in srgb, ${x.c} 18%, transparent)` }} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{x.t}</p>
                    <p className="text-xs text-muted">{x.m}</p>
                  </div>
                </div>
              ))}
              <div className="mt-3 rounded-xl bg-surface-2 p-3">
                <div className="mb-1 flex justify-between text-xs text-muted"><span>Прогресс курса</span><span>66%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full" style={{ width: '66%', background: 'linear-gradient(90deg, var(--color-brand), var(--color-accent-soft))' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE CORE FUNCTIONS */}
      <section className="section py-12">
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard icon={Compass} color="var(--color-brand)" title="Находи возможности под свой профиль" text="Каталог олимпиад, хакатонов, стипендий и стажировок с умными фильтрами и сохранением в избранное." />
          <FeatureCard icon={BookOpen} color="var(--color-accent)" title="Учись в удобном темпе" text="Асинхронные курсы Mentoria с уроками, мини-тестами и прогресс-баром — учись без живых занятий." />
          <FeatureCard icon={LayoutDashboard} color="#8b5cf6" title="Всё под контролем" text="Личный кабинет с сохранёнными возможностями, прогрессом курсов и ближайшими дедлайнами." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section py-12">
        <h2 className="text-center text-3xl font-extrabold text-ink">Как это работает</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card relative p-6">
              <span className="absolute -top-3 left-6 grid size-8 place-items-center rounded-full bg-brand text-sm font-bold text-white">{s.n}</span>
              <h3 className="mt-3 font-bold text-ink">{s.t}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BONUS FEATURES */}
      <section className="section py-12">
        <div className="card overflow-hidden p-8">
          <h2 className="text-2xl font-extrabold text-ink">Не просто лендинг — настоящий продукт</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">Mentoria Hub масштабирует организацию за пределы Telegram: единая система возможностей, курсов и аналитики.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Bot, t: 'AI-ассистент', d: 'Рекомендации по профилю' },
              { i: CalendarClock, t: 'Календарь дедлайнов', d: 'Ничего не пропустишь' },
              { i: Award, t: 'Сертификаты', d: 'За завершённые курсы' },
              { i: Globe, t: '3 языка', d: 'RU · EN · ҚАЗ' },
              { i: BadgeCheck, t: 'Админ-панель', d: 'Контент без пересборки' },
              { i: Users, t: 'Лидерборд', d: 'Геймификация обучения' },
            ].map((x, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><x.i size={18} /></span>
                <div>
                  <p className="font-semibold text-ink">{x.t}</p>
                  <p className="text-sm text-muted">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-12">
        <div className="card relative overflow-hidden p-10 text-center" style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-2))' }}>
          <h2 className="text-3xl font-extrabold text-white">Готов начать свой путь?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/90">Создай профиль и получи персональные рекомендации возможностей и курсов уже сейчас.</p>
          <Link href="/onboarding" className="btn-accent mx-auto mt-6 text-base !px-6 !py-3">
            {t('hero.cta.join')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}

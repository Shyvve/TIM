'use client'

import { useApp } from '@/lib/context'
import Link from 'next/link'
import { Map, CheckCircle2 } from 'lucide-react'

const ROADMAP = [
  {
    grade: 9,
    color: '#0ea5e9',
    title: 'Фундамент и интересы',
    items: ['Пройти базовые курсы по любимым предметам', 'Участвовать в школьных олимпиадах', 'Попробовать разные направления (STEM, бизнес, наука)'],
  },
  {
    grade: 10,
    color: '#f59e0b',
    title: 'Углубление и опыт',
    items: ['Выбрать 2–3 приоритетных направления', 'Хакатоны, исследовательские программы, волонтёрство', 'Подготовка к SAT/IELTS'],
  },
  {
    grade: 11,
    color: '#8b5cf6',
    title: 'Тесты и лидерство',
    items: ['Сдать IELTS (7.0+) и SAT', 'Международные летние программы', 'Написать черновик Personal Statement'],
  },
  {
    grade: 12,
    color: '#16a34a',
    title: 'Заявки и поступление',
    items: ['Сформировать список из 10-15 вузов', 'Подать на стипендии (Болашак, NU, гранты)', 'Отправить заявки (Early Action / Regular Decision)'],
  },
]

export default function RoadmapPage() {
  const { t } = useApp()

  return (
    <div className="section py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><Map size={22} /></span>
        <div>
          <h1 className="text-3xl font-extrabold text-ink">{t('roadmap.title')}</h1>
          <p className="text-sm text-muted">{t('roadmap.subtitle')}</p>
        </div>
      </div>

      <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:h-full before:w-0.5 before:bg-line sm:before:left-1/2">
        {ROADMAP.map((stage, i) => (
          <div key={stage.grade} className={`relative sm:grid sm:grid-cols-2 sm:gap-8 ${i % 2 ? 'sm:[&>*:first-child]:col-start-2' : ''}`}>
            <div className={`relative pl-12 sm:pl-0 ${i % 2 ? '' : 'sm:text-right'}`}>
              <span
                className="absolute left-2 top-1 z-10 grid size-9 place-items-center rounded-full text-sm font-bold text-white ring-4 ring-bg sm:left-1/2 sm:-translate-x-1/2"
                style={{ background: stage.color }}
              >
                {stage.grade}
              </span>
              <div className="card-hover p-5">
                <div className={`mb-2 flex items-center gap-2 ${i % 2 ? '' : 'sm:justify-end'}`}>
                  <span className="badge" style={{ color: stage.color, background: `color-mix(in srgb, ${stage.color} 14%, transparent)` }}>{stage.grade} класс</span>
                </div>
                <h3 className="text-lg font-bold text-ink">{stage.title}</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                  {stage.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" /> <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/opportunities" className="btn-primary">Подобрать возможности для моего этапа</Link>
      </div>
    </div>
  )
}

'use client'

import { useApp } from '@/lib/context'
import Link from 'next/link'

const ROADMAP_DATA = [
  {
    grade: '9 класс',
    title: 'Исследование и База',
    color: '#3b82f6',
    desc: 'Время пробовать разное, подтягивать английский и математику. Оценки уже идут в транскрипт.',
    actions: [
      'Пройти курс "Основы математики"',
      'Сдать первый пробный IELTS/Duolingo',
      'Участвовать в школьных олимпиадах для опыта',
      'Начать волонтёрский проект',
    ],
    oppTypes: ['Летняя школа', 'Олимпиада (начальный уровень)'],
  },
  {
    grade: '10 класс',
    title: 'Фокус и Достижения',
    color: '#eab308',
    desc: 'Выбор направления (STEM, Бизнес, Гуманитарные). Участие в крупных конкурсах. Подготовка к SAT.',
    actions: [
      'Пройти курс "Подготовка к SAT/IELTS"',
      'Участвовать в республиканских олимпиадах/хакатонах',
      'Найти ментора или присоединиться к клубу',
      'Начать подготовку портфолио',
    ],
    oppTypes: ['Хакатон', 'Республиканская олимпиада'],
  },
  {
    grade: '11 класс',
    title: 'Тесты и Лидерство',
    color: '#f97316',
    desc: 'Пик активности. Сдача всех тестов, капитанство в клубах, международные программы.',
    actions: [
      'Сдать IELTS (7.0+) и SAT',
      'Подать на международные летние программы (YYGS, MIT Mites)',
      'Написать черновик Personal Statement',
      'Организовать свой проект/мероприятие',
    ],
    oppTypes: ['Международная программа', 'Лидерская программа'],
  },
  {
    grade: '12 класс / Gap Year',
    title: 'Заявки и Поступление',
    color: '#22c55e',
    desc: 'Только работа над эссе, финансовой помощью и отправка заявок. Никаких новых крупных проектов.',
    actions: [
      'Пройти курс "Английский для академического успеха" (эссе)',
      'Сформировать список из 10-15 вузов',
      'Подать на стипендии (Болашак, NU, гранты)',
      'Отправить заявки (Early Action / Regular Decision)',
    ],
    oppTypes: ['Стипендия', 'Грант'],
  },
]

export default function RoadmapPage() {
  const { t } = useApp()

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '12px' }}>🗺️ Путь</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '800', marginBottom: '16px' }}>{t('roadmap.title')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>{t('roadmap.subtitle')}</p>
        </div>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '24px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border)' }} className="timeline-line"/>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {ROADMAP_DATA.map((item, idx) => (
              <div key={idx} style={{ position: 'relative', paddingLeft: '64px' }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: '16px', top: '24px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: item.color, border: '4px solid var(--bg-primary)',
                  boxShadow: `0 0 10px ${item.color}80`
                }}/>
                
                <div className="card" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: item.color, marginBottom: '4px' }}>{item.grade}</div>
                      <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{item.title}</h2>
                    </div>
                  </div>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                    {item.desc}
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px' }}>КЛЮЧЕВЫЕ ДЕЙСТВИЯ:</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {item.actions.map((act, i) => (
                        <li key={i} style={{ fontSize: '14px', display: 'flex', gap: '8px' }}>
                          <span style={{ color: 'var(--accent)' }}>•</span> {act}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px' }}>ИСКАТЬ В КАТАЛОГЕ:</h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {item.oppTypes.map((type, i) => (
                        <Link key={i} href={`/opportunities?category=${type.split(' ')[0]}`} className="badge badge-gray" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                          {type} ↗
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 600px) {
          .timeline-line { display: none; }
          div[style*="paddingLeft: '64px'"] { padding-left: 0 !important; }
          div[style*="position: 'absolute', left: '16px'"] { display: none; }
        }
      `}</style>
    </div>
  )
}

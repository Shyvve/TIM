'use client'

import { useState } from 'react'
import { Library, ExternalLink, Search, BookOpen, GraduationCap, FileText, Users, Briefcase, Link2, MessageSquare, Award, Map, Download } from 'lucide-react'
import { useApp } from '@/lib/context'
import { materialsForSection } from '@/lib/materials'

const TABS = [
  { id: 'ielts', label: 'IELTS', icon: BookOpen },
  { id: 'sat', label: 'SAT', icon: GraduationCap },
  { id: 'essays', label: 'Essays', icon: FileText },
  { id: 'ecs', label: 'Activities', icon: Users },
  { id: 'research', label: 'Research', icon: Search },
  { id: 'cv', label: 'CV', icon: Briefcase },
  { id: 'linkedin', label: 'LinkedIn', icon: Link2 },
  { id: 'interviews', label: 'Interviews', icon: MessageSquare },
  { id: 'scholarships', label: 'Стипендии', icon: Award },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
]

interface Resource {
  name: string
  type?: string
  desc: string
  url: string
  free: boolean
  freeAlt?: { label: string; url: string }
}

interface SubSection {
  title: string
  items: Resource[]
}

interface Section {
  id: string
  title: string
  desc: string
  note: string
  subs: SubSection[]
}

const DATA: Section[] = [
  {
    id: 'ielts', title: '1 — IELTS', desc: 'Английский для учёбы. Топ-вузы: 7.0–7.5 overall.',
    note: 'США также принимают TOEFL и Duolingo (DET); многие вузы снимают тест при обучении на английском.',
    subs: [
      { title: 'Книги', items: [
        { name: 'Cambridge IELTS 19 (Academic)', type: 'Практика', desc: '4 реальных прошлых теста + аудио', url: 'https://www.amazon.com/s?k=Cambridge%20IELTS%2019%20Academic', free: false, freeAlt: { label: 'ielts.org Sample questions + British Council mock', url: 'https://ielts.org/take-a-test/preparation-resources/sample-test-questions' } },
        { name: 'The Official Cambridge Guide to IELTS', type: 'Гид', desc: 'Гид от создателей + 8 тестов', url: 'https://www.amazon.com/s?k=Official%20Cambridge%20Guide%20to%20IELTS', free: false, freeAlt: { label: 'ielts.org Sample questions', url: 'https://ielts.org/take-a-test/preparation-resources/sample-test-questions' } },
        { name: 'Barron\'s IELTS Superpack', type: 'Набор', desc: 'Учебник+практика+аудио, 5.5→7', url: 'https://www.amazon.com/s?k=Barron%27s%20IELTS%20Superpack', free: false, freeAlt: { label: 'ielts.org + British Council', url: 'https://ielts.org/take-a-test/preparation-resources/sample-test-questions' } },
        { name: 'Target Band 7 — S. Braverman', type: 'Стратегии', desc: 'Компактный гид на 7+', url: 'https://www.amazon.com/s?k=Target%20Band%207%20Simone%20Braverman', free: false, freeAlt: { label: 'IELTS Liz — стратегии на 7+', url: 'https://ieltsliz.com' } },
      ]},
      { title: 'Видео и каналы (бесплатно)', items: [
        { name: 'IELTS Liz (экс-экзаменатор)', desc: 'Все секции, Writing', url: 'https://www.youtube.com/user/ieltsliz', free: true },
        { name: 'IELTS Simon', desc: 'Writing T2, Speaking', url: 'https://www.ielts-simon.com', free: true },
        { name: 'E2 IELTS', desc: 'Все секции, mock', url: 'https://www.e2language.com', free: true },
        { name: 'BBC Learning English', desc: 'Listening, лексика', url: 'https://www.youtube.com/@bbclearningenglish', free: true },
        { name: 'British Council LearnEnglish', desc: 'База английского', url: 'https://learnenglish.britishcouncil.org', free: true },
      ]},
      { title: 'Курсы и пробники (бесплатно)', items: [
        { name: 'IELTS Ready (British Council)', desc: 'Mock-тесты + трекинг', url: 'https://takeielts.britishcouncil.org', free: true },
        { name: 'ielts.org — Sample questions', desc: 'Офиц. вопросы+ответы', url: 'https://ielts.org/take-a-test/preparation-resources/sample-test-questions', free: true },
        { name: 'IELTS Online Tests', desc: 'Большая база mock', url: 'https://ieltsonlinetests.com', free: true },
        { name: 'Magoosh IELTS', desc: 'Бюджетный курс', url: 'https://magoosh.com/ielts', free: true },
      ]},
    ]
  },
  {
    id: 'sat', title: '2 — SAT (Digital)', desc: 'Только цифровой формат (Bluebook, адаптивный). Цели: 1400+ / 1500+ / 1550+.',
    note: 'Khan Academy больше не даёт полные тесты — они в Bluebook; Khan остаётся для отработки навыков.',
    subs: [
      { title: 'Официальные ресурсы (бесплатно)', items: [
        { name: 'Bluebook (College Board)', desc: 'Офиц. приложение, полные адаптивные тесты', url: 'https://bluebook.collegeboard.org/students/download-bluebook', free: true },
        { name: 'Khan Academy Digital SAT', desc: 'Уроки, видео, тысячи вопросов', url: 'https://www.khanacademy.org/digital-sat', free: true },
        { name: 'Student Question Bank', desc: 'Тысячи официальных вопросов с фильтрами', url: 'https://satsuite.collegeboard.org/practice/practice-tests/bluebook', free: true },
        { name: 'Schoolhouse.world', desc: 'Бесплатный peer-тьюторинг по SAT', url: 'https://schoolhouse.world', free: true },
      ]},
      { title: 'Книги', items: [
        { name: 'The College Panda\'s SAT Math', type: 'Math', desc: 'Лучший разбор математики + 500+ задач', url: 'https://www.amazon.com/s?k=College%20Panda%20SAT%20Math', free: false, freeAlt: { label: 'Khan Academy Digital SAT (Math)', url: 'https://www.khanacademy.org/digital-sat' } },
        { name: 'The Critical Reader — Erica Meltzer', type: 'R&W', desc: 'Эталон по Reading & Writing', url: 'https://www.amazon.com/s?k=Critical%20Reader%20Erica%20Meltzer', free: false, freeAlt: { label: 'Bluebook + Khan Academy', url: 'https://bluebook.collegeboard.org/students/download-bluebook' } },
        { name: 'SAT Prep Black Book — Mike Barrett', type: 'Стратегии', desc: 'Лучшая книга по тактике теста', url: 'https://www.amazon.com/s?k=SAT%20Prep%20Black%20Book', free: false, freeAlt: { label: 'Bluebook + Khan Academy', url: 'https://bluebook.collegeboard.org/students/download-bluebook' } },
      ]},
    ]
  },
  {
    id: 'essays', title: '3 — College Essays', desc: 'Personal Statement, Common App, supplements.',
    note: 'Примеры — для разбора техники, НЕ для копирования: комиссии ловят клише и AI.',
    subs: [
      { title: 'Ресурсы и примеры', items: [
        { name: 'College Essay Guy — главный хаб', desc: 'Бесплатные гайды по всем типам эссе', url: 'https://www.collegeessayguy.com', free: true },
        { name: 'CEG — Free Personal Statement Guide', desc: 'Пошаговый гид + упражнения', url: 'https://www.collegeessayguy.com/get-the-free-guide-to-writing-the-personal-statement', free: true },
        { name: 'CEG — 27 примеров эссе с разбором', desc: 'Что делает эссе сильным', url: 'https://www.collegeessayguy.com/blog/college-essay-examples', free: true },
        { name: 'Common App — Essay prompts', desc: '7 тем главного эссе', url: 'https://www.commonapp.org/apply/essay-prompts', free: true },
      ]},
      { title: 'Типы эссе', items: [
        { name: 'Personal Statement / Common App', desc: 'Голос, история, ценности (650 слов)', url: 'https://www.collegeessayguy.com/how-to-write-a-personal-statement', free: true },
        { name: 'Why Us', desc: 'Конкретное исследование вуза, без клише', url: 'https://www.collegeessayguy.com/blog/why-this-college-essay', free: true },
        { name: 'Why Major', desc: 'Интерес → программа → цели', url: 'https://www.collegeessayguy.com/blog/why-this-major-college-essay', free: true },
        { name: 'Diversity / Community', desc: 'Бэкграунд и вклад в кампус', url: 'https://www.collegeessayguy.com/blog/diversity-essay', free: true },
        { name: 'Scholarship Essay', desc: 'Фокус на impact и нужде', url: 'https://www.collegeessayguy.com/blog/scholarship-essay-examples', free: true },
      ]},
    ]
  },
  {
    id: 'ecs', title: '4 — Extracurricular Activities', desc: 'Олимпиады, research, стартапы, волонтёрство. Главное — глубина (spike), не список.',
    note: 'Платные «research/leadership» программы комиссии ценят слабо. Качество > количество.',
    subs: [
      { title: 'Олимпиады (международные)', items: [
        { name: 'IMO — математика', desc: 'Math', url: 'https://www.imo-official.org', free: true },
        { name: 'IPhO — физика', desc: 'Physics', url: 'https://ipho-unofficial.org', free: true },
        { name: 'IOI — информатика', desc: 'CS', url: 'https://ioinformatics.org', free: true },
        { name: 'IChO — химия', desc: 'Chemistry', url: 'https://www.ichosc.org', free: true },
        { name: 'IBO — биология', desc: 'Biology', url: 'https://www.ibo-info.org', free: true },
      ]},
      { title: 'Конкурсы и research-соревнования', items: [
        { name: 'Regeneron ISEF', desc: 'Крупнейшая научная ярмарка школьников', url: 'https://www.societyforscience.org/isef/', free: true },
        { name: 'Conrad Challenge', desc: 'Инновации и предпринимательство', url: 'https://www.conradchallenge.org', free: true },
        { name: 'Diamond Challenge', desc: 'Стартап-конкурс для школьников', url: 'https://diamondchallenge.org', free: true },
        { name: 'Breakthrough Junior Challenge', desc: 'Видео-объяснение науки', url: 'https://breakthroughjuniorchallenge.org', free: true },
      ]},
      { title: 'Летние программы (топ, отбор 2–10%)', items: [
        { name: 'RSI (MIT/CEE)', desc: 'STEM-research, бесплатно', url: 'https://www.cee.org/programs/research-science-institute', free: true },
        { name: 'MITES (MIT)', desc: 'STEM, бесплатно', url: 'https://mites.mit.edu', free: true },
        { name: 'PROMYS (Boston U.)', desc: 'Математика', url: 'https://promys.org', free: true },
        { name: 'SSP (Summer Science Program)', desc: 'Астрофизика/биохимия', url: 'https://summerscience.org', free: true },
        { name: 'YYGS (Yale)', desc: 'Гуманитарные/междисциплинарные', url: 'https://globalscholars.yale.edu', free: true },
      ]},
    ]
  },
  {
    id: 'research', title: '5 — Research', desc: 'Как писать paper, literature review, цитирование, публикации.',
    note: 'Берегись predatory journals и pay-to-publish — комиссии их не ценят.',
    subs: [
      { title: 'Как писать и оформлять', items: [
        { name: 'Purdue OWL', desc: 'Структура paper, APA/MLA/Chicago', url: 'https://owl.purdue.edu', free: true },
        { name: 'Google Scholar', desc: 'Поиск источников для lit review', url: 'https://scholar.google.com', free: true },
        { name: 'Zotero', desc: 'Менеджер источников и цитат', url: 'https://www.zotero.org', free: true },
        { name: 'Connected Papers', desc: 'Карта связанных статей', url: 'https://www.connectedpapers.com', free: true },
      ]},
      { title: 'Где публиковаться школьнику', items: [
        { name: 'Journal of Emerging Investigators', desc: 'STEM, peer-review для школьников', url: 'https://emerginginvestigators.org', free: true },
        { name: 'The Concord Review', desc: 'История/гуманитарные эссе', url: 'https://tcr.org', free: true },
        { name: 'National HS Journal of Science', desc: 'Наука', url: 'https://nhsjs.com', free: true },
        { name: 'arXiv (с ментором)', desc: 'Препринты STEM', url: 'https://arxiv.org', free: true },
      ]},
    ]
  },
  {
    id: 'cv', title: '6 — CV / Resume', desc: 'Для школьника — 1 страница, результаты через цифры.',
    note: 'Action verbs + измеримый результат. Без фото/возраста для US-резюме.',
    subs: [
      { title: 'Гайды и шаблоны', items: [
        { name: 'Harvard — Resume Guide', desc: 'Эталонные шаблоны и правила', url: 'https://careerservices.fas.harvard.edu/resources/', free: true },
        { name: 'MIT CAPD — Resumes', desc: 'Шаблоны и примеры', url: 'https://capd.mit.edu/resources/', free: true },
        { name: 'Overleaf — LaTeX резюме', desc: 'Academic/research CV шаблоны', url: 'https://www.overleaf.com/gallery/tagged/cv', free: true },
        { name: 'Europass CV', desc: 'Стандарт для Европы', url: 'https://europa.eu/europass/en', free: true },
      ]},
    ]
  },
  {
    id: 'linkedin', title: '7 — LinkedIn', desc: 'Профиль, networking, поиск стажировок.',
    note: 'Для школьника LinkedIn = витрина проектов и нетворкинг с профессорами.',
    subs: [
      { title: 'Ресурсы', items: [
        { name: 'LinkedIn', desc: 'Создание профиля', url: 'https://www.linkedin.com', free: true },
        { name: 'LinkedIn Learning', desc: 'Курсы по профилю/карьере', url: 'https://www.linkedin.com/learning/', free: true },
        { name: 'Handshake', desc: 'Стажировки для студентов', url: 'https://joinhandshake.com', free: true },
      ]},
    ]
  },
  {
    id: 'interviews', title: '8 — Interviews', desc: 'University, Scholarship, Internship интервью. Метод STAR.',
    note: 'Готовь истории по схеме STAR; задавай встречные вопросы; репетируй вслух.',
    subs: [
      { title: 'Ресурсы', items: [
        { name: 'MindTools — STAR method', desc: 'Поведенческие интервью', url: 'https://www.mindtools.com/a5xse7w/star-method', free: true },
        { name: 'Big Interview', desc: 'Тренажёр интервью', url: 'https://biginterview.com', free: true },
        { name: 'LeetCode', desc: 'Технические (стажировки CS)', url: 'https://leetcode.com', free: true },
        { name: 'CollegeVine', desc: 'Университетские интервью', url: 'https://www.collegevine.com/blog', free: true },
      ]},
    ]
  },
  {
    id: 'scholarships', title: '9 — Scholarships', desc: 'USA / UK / Европа / Азия. Need-blind для иностранцев — ~10 вузов.',
    note: 'Need-blind для иностранцев (2026): Amherst, Bowdoin, Brown, Dartmouth, Harvard, MIT, Notre Dame, Princeton, Washington and Lee, Yale.',
    subs: [
      { title: 'США — financial aid (need-blind)', items: [
        { name: 'Harvard Financial Aid', desc: '100% need, need-blind для всех', url: 'https://college.harvard.edu/financial-aid', free: true },
        { name: 'MIT Financial Aid', desc: 'Need-blind для иностранцев', url: 'https://sfs.mit.edu', free: true },
        { name: 'Princeton Aid', desc: 'Гранты вместо кредитов', url: 'https://www.princeton.edu/admission-aid', free: true },
        { name: 'Yale Financial Aid', desc: 'Need-blind для иностранцев', url: 'https://finaid.yale.edu', free: true },
        { name: 'Brown Financial Aid', desc: 'Need-blind с Class of 2029', url: 'https://www.brown.edu/admission/undergraduate/explore/affordability-financial-aid', free: true },
        { name: '#YouAreWelcomeHere', desc: 'Стипендии в вузах-участниках', url: 'https://www.youarewelcomeherescholarship.org', free: true },
      ]},
      { title: 'UK / Европа', items: [
        { name: 'Chevening (UK)', desc: 'Магистратура', url: 'https://www.chevening.org', free: true },
        { name: 'Erasmus Mundus', desc: 'Магистратура', url: 'https://erasmus-plus.ec.europa.eu', free: true },
        { name: 'DAAD (Германия)', desc: 'Маг./нек. бакалавр', url: 'https://www.daad.de/en/', free: true },
        { name: 'Stipendium Hungaricum', desc: 'Бакалавр+', url: 'https://stipendiumhungaricum.hu', free: true },
        { name: 'Türkiye Burslari', desc: 'Бакалавр+', url: 'https://www.turkiyeburslari.gov.tr', free: true },
      ]},
      { title: 'Азия', items: [
        { name: 'MEXT (Япония)', desc: 'Полная стипендия', url: 'https://www.studyinjapan.go.jp', free: true },
        { name: 'GKS (Корея)', desc: 'Полная стипендия', url: 'https://www.studyinkorea.go.kr', free: true },
        { name: 'CSC (Китай)', desc: 'Полная стипендия', url: 'https://www.campuschina.org', free: true },
        { name: 'KAIST (Корея)', desc: 'STEM стипендия', url: 'https://www.kaist.ac.kr', free: true },
      ]},
    ]
  },
  {
    id: 'roadmap', title: '10 — Roadmap 8→12 класс', desc: 'План по годам: SAT, IELTS, олимпиады, research, лидерство.',
    note: 'Сильные кандидаты строят "spike" с 9–10 класса. Подача документов — осень 12 класса.',
    subs: [
      { title: 'План по классам', items: [
        { name: '8 класс — Фундамент', desc: 'Прокачка англ. + математики · Пробы школьных олимпиад · Найти 1–2 интереса · Вступить в клубы', url: '#', free: true },
        { name: '9 класс — Углубление', desc: 'Рост уровня английского · Участие в олимпиадах · Старт первого проекта · Роли в клубах', url: '#', free: true },
        { name: '10 класс — Опыт', desc: 'Старт подготовки SAT · Результаты на олимпиадах · Развитие проекта/research · Летняя программа', url: '#', free: true },
        { name: '11 класс — Тесты и лидерство', desc: 'Сдать SAT + IELTS · Пик олимпиад · Публикация/проект · Топ летние программы', url: '#', free: true },
        { name: '12 класс — Поступление', desc: 'Подача (осень) · Эссе · Интервью · Стипендии и гранты · Решения', url: '#', free: true },
      ]},
    ]
  },
]

export default function KnowledgePage() {
  const { t } = useApp()
  const [activeTab, setActiveTab] = useState('ielts')
  const [search, setSearch] = useState('')

  const section = DATA.find(s => s.id === activeTab)!

  const filteredSubs = section.subs.map(sub => ({
    ...sub,
    items: sub.items.filter(item =>
      !search || `${item.name} ${item.desc}`.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(sub => sub.items.length > 0)

  const materials = materialsForSection(activeTab).filter(m =>
    !search || `${m.name} ${m.desc}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="section py-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><Library size={22} /></span>
        <div>
          <h1 className="text-3xl font-extrabold text-ink">База знаний</h1>
          <p className="text-sm text-muted">Поступление в топ-вузы мира — бесплатные легальные источники</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch('') }}
              className={`flex items-center gap-1.5 ${activeTab === tab.id ? 'chip-on' : 'chip'}`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Section header */}
      <div className="card mb-6 p-5">
        <h2 className="text-xl font-bold text-ink">{section.title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{section.desc}</p>
        <div className="mt-3 rounded-lg border-l-2 border-brand/50 bg-brand/5 px-3 py-2 text-sm text-ink-soft">
          ⚠️ {section.note}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input !pl-10"
          placeholder="Поиск по ресурсам..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Скачиваемые материалы (PDF/DOCX) */}
      {materials.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
            <Download size={14} /> Материалы для скачивания
          </h3>
          <div className="space-y-2">
            {materials.map(m => (
              <div key={m.file} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{m.name}</span>
                      <span className="badge bg-surface-2 text-muted">{m.format} · {m.size}</span>
                      <span className="badge border-accent/20 bg-accent/10 text-accent" style={{ borderWidth: '1px' }}>бесплатно</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{m.desc}</p>
                  </div>
                  <a href={`/materials/${m.file}`} download className="btn-primary !px-3 !py-1.5 text-xs shrink-0">
                    Скачать <Download size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {filteredSubs.map(sub => (
        <div key={sub.title} className="mb-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">{sub.title}</h3>
          <div className="space-y-2">
            {sub.items.map(item => (
              <div key={item.name + item.url} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-ink">{item.name}</span>
                      {item.type && <span className="badge bg-surface-2 text-muted">{item.type}</span>}
                      <span className={`badge ${item.free ? 'bg-accent/10 text-accent border-accent/20' : 'bg-brand/10 text-brand border-brand/20'}`} style={{ borderWidth: '1px' }}>
                        {item.free ? 'бесплатно' : 'платно'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{item.desc}</p>
                    {item.freeAlt && (
                      <div className="mt-2 rounded-lg bg-accent/5 border border-accent/10 px-3 py-2 text-xs">
                        🆓 <span className="font-semibold text-accent">Бесплатная замена:</span>{' '}
                        <a href={item.freeAlt.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                          {item.freeAlt.label}
                        </a>
                      </div>
                    )}
                  </div>
                  {item.url !== '#' && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-primary !px-3 !py-1.5 text-xs shrink-0">
                      Открыть <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredSubs.length === 0 && materials.length === 0 && (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <Search className="text-muted" size={32} />
          <p className="font-semibold text-ink">Ничего не найдено</p>
          <p className="text-sm text-muted">Попробуй другой запрос</p>
        </div>
      )}
    </div>
  )
}

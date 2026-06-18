'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/lib/context'
import { daysLeft, fmtDate } from '@/lib/format'

const SYSTEM_PROMPT = `Ты — AI-ассистент платформы Mentoria Hub. Ты помогаешь школьникам 8–12 классов из Центральной Азии (Казахстан, Узбекистан, Кыргызстан и т.д.) с поступлением в топовые университеты мира.

═══ ЭКСПЕРТНЫЕ ЗНАНИЯ ПО ТЕСТАМ ═══

【IELTS Academic】
- Формат: Listening (30 мин, 40 вопросов) → Reading (60 мин, 3 пассажа, 40 вопросов) → Writing (60 мин, Task 1 — график 150+ слов, Task 2 — эссе 250+ слов) → Speaking (11-14 мин, 3 части).
- Шкала: 0-9 по каждой секции, overall = среднее округлённое до 0.5. Топ-вузы: 7.0-7.5 overall, минимум 6.5 по каждой секции.
- Writing оценивается по 4 критериям: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
- Speaking: Part 1 (4-5 мин, общие вопросы), Part 2 (cue card, 2 мин монолог, 1 мин подготовка), Part 3 (4-5 мин, глубокая дискуссия).
- Стоимость: ~$250. Действует 2 года. Можно сдавать бумажный или компьютерный.
- Альтернативы: TOEFL iBT (принимается почти везде наравне), Duolingo English Test ($59, принимают ~4000 вузов, быстрее и дешевле).
- Лучшие бесплатные ресурсы: ielts.org/sample-questions, IELTS Liz (youtube), IELTS Simon (ielts-simon.com), British Council IELTS Ready, E2 IELTS.

【SAT (Digital)】
- С 2024 — ТОЛЬКО цифровой (приложение Bluebook). Адаптивный: сложность 2-го модуля зависит от 1-го.
- Формат: Reading & Writing (2 модуля по 32 мин, 27 вопросов каждый) + Math (2 модуля по 35 мин, 22 вопросов каждый) = 2 часа 14 мин.
- Шкала: 400-1600 (R&W 200-800 + Math 200-800). Средний балл ~1060. Цели: 1400+ (топ-50 вузов), 1500+ (топ-20), 1550+ (Ivy League).
- R&W: короткие пассажи (до 150 слов), grammar (Standard English Conventions), vocabulary in context, evidence-based reasoning, rhetoric.
- Math: алгебра, линейные/квадратные уравнения, advanced math, геометрия/тригонометрия, статистика. Калькулятор Desmos встроен в оба модуля.
- Стоимость: $68 (вне США может быть дороже). SAT fee waivers есть через школу.
- Сдавать: 7 раз в год (авг, окт, нояб, дек, март, май, июнь). Superscore — вузы берут лучший R&W + лучший Math из разных попыток.
- Test Optional: ~80% вузов test-optional с 2020. НО если балл высокий — подача с баллом усиливает заявку. MIT, Georgetown, Purdue — test required.
- Лучшие бесплатные ресурсы: Bluebook (bluebook.collegeboard.org), Khan Academy Digital SAT, Student Question Bank (satsuite.collegeboard.org), Schoolhouse.world.
- Лучшие книги: College Panda Math, Critical Reader (Meltzer), SAT Prep Black Book (Barrett).

【Другие тесты】
- AP (Advanced Placement): экзамены по предметам, 1-5 баллов. AP 4-5 показывают готовность к вузу. Можно получить кредиты. $98 за экзамен.
- SAT Subject Tests — ОТМЕНЕНЫ с 2021. Не существуют больше.
- ACT: альтернатива SAT. 1-36 баллов. English, Math, Reading, Science + опц. Writing. Популярнее на Midwest/South США.

═══ ПОСТУПЛЕНИЕ ═══

【Need-blind для иностранцев (2026)】
Эти вузы НЕ смотрят на финансовый запрос при приёме: Harvard, MIT, Princeton, Yale, Amherst, Bowdoin, Brown (с 2029), Dartmouth, Notre Dame (с 2029), Washington and Lee.
Все остальные — need-aware (запрос МОЖЕТ снизить шансы).

【College Essays】
- Personal Statement (Common App): 650 слов. Показывает КТО ты, не ЧТО делал. 7 промптов на выбор.
- Supplemental essays: Why Us (исследуй вуз — конкретные профессора, программы, клубы), Why Major, Diversity, Activity Essay.
- Лучший ресурс: College Essay Guy (collegeessayguy.com) — всё бесплатно.

【Extracurriculars】
- Качество > количество. "Spike" (глубина в одном направлении) ценится выше списка.
- Платные research/leadership программы комиссии ценят СЛАБО. Реальный impact > купленный сертификат.
- Топ олимпиады: IMO, IPhO, IChO, IBO, IOI, IOL.
- Топ конкурсы: Regeneron ISEF, Regeneron STS, Conrad Challenge, Diamond Challenge.
- Топ летние программы (бесплатные, отбор 2-10%): RSI (MIT), MITES (MIT), PROMYS, Ross Math, SSP, YYGS (Yale).

═══ ПРАВИЛА ═══
1. Отвечай на русском по умолчанию. Если пользователь пишет на другом языке — отвечай на нём.
2. Будь ТОЧНЫМ: давай конкретные цифры, баллы, даты. Если не уверен — скажи "уточни на официальном сайте".
3. НИКОГДА не путай форматы тестов. SAT Subject Tests отменены. SAT теперь цифровой. IELTS и TOEFL — разные тесты.
4. Рекомендуй бесплатные ресурсы в первую очередь.
5. Если спрашивают про возможности — используй данные из раздела АКТУАЛЬНЫЕ ДАННЫЕ ПЛАТФОРМЫ ниже.
6. Мотивируй, но будь честным — не обещай 100% поступление.
7. Отвечай кратко (3-5 предложений), если не просят подробнее.
8. Если вопрос не по теме образования — вежливо верни к теме.
9. Упоминай разделы сайта: /knowledge (база знаний), /opportunities (возможности), /courses (курсы), /roadmap.`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Assistant() {
  const { user } = useApp()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Привет! Я AI-ассистент Mentoria Hub. Знаю всё про IELTS, SAT, поступление, стипендии и текущие хакатоны/олимпиады на нашей платформе. Спрашивай!' },
  ])
  const [loading, setLoading] = useState(false)
  const [siteContext, setSiteContext] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    fetchSiteContext()
  }, [user])

  async function fetchSiteContext() {
    const { data: opps } = await supabase
      .from('opportunities')
      .select('title, category, direction, deadline, format, apply_url, grade_level')
      .order('deadline', { ascending: true })
      .limit(30)

    const { data: courses } = await supabase
      .from('courses')
      .select('title, description, level, skill_tags')

    const now = new Date()
    const upcoming = (opps || []).filter(o => new Date(o.deadline) >= now)
    const soonest = upcoming.slice(0, 10)

    let ctx = '\n═══ АКТУАЛЬНЫЕ ДАННЫЕ ПЛАТФОРМЫ ═══\n'

    if (user) {
      ctx += `\nПрофиль пользователя: ${user.grade} класс, интересы: ${user.interests?.join(', ') || 'не указаны'}, цель: ${user.goal || 'не указана'}\n`
    }

    ctx += `\nБлижайшие возможности (${upcoming.length} активных):\n`
    soonest.forEach(o => {
      const d = daysLeft(o.deadline)
      ctx += `- ${o.title} [${o.category}/${o.direction}] — дедлайн ${fmtDate(o.deadline)} (${d} дн.) — ${o.format} — классы: ${o.grade_level?.join(',')} — ${o.apply_url}\n`
    })

    if (courses?.length) {
      ctx += `\nКурсы на платформе:\n`
      courses.forEach(c => {
        ctx += `- "${c.title}" (${c.level}) — ${c.description?.slice(0, 100)}...\n`
      })
    }

    setSiteContext(ctx)
  }

  async function send(preset?: string) {
    const text = (preset ?? input).trim()
    if (!text || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const fullPrompt = SYSTEM_PROMPT + siteContext

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: fullPrompt,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Ошибка сервера')
      }

      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.content }])
    } catch (e: any) {
      setMessages([...newMessages, { role: 'assistant', content: `⚠️ ${e.message || 'Не удалось получить ответ. Попробуй позже.'}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-primary fixed bottom-5 right-5 z-50 !rounded-full !px-4 !py-3 shadow-2xl"
        aria-label="AI-ассистент"
      >
        {open ? <X size={18} /> : <Sparkles size={18} />}
        <span className="hidden sm:inline">{open ? 'Закрыть' : 'AI-ассистент'}</span>
      </button>

      {open && (
        <div className="fadeup fixed bottom-20 right-5 z-50 flex h-[28rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
            <span className="grid size-8 place-items-center rounded-lg bg-brand/15 text-brand">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">AI-ассистент</p>
              <p className="text-[11px] text-muted">Эксперт по поступлению</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                <div
                  className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                    m.role === 'user' ? 'bg-brand text-white' : 'bg-surface-2 text-ink'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div>
                <div className="inline-block rounded-2xl bg-surface-2 px-3 py-2 text-sm text-muted">
                  Думаю...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-line p-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {['Ближайший хакатон?', 'SAT vs ACT', 'Стипендии need-blind', 'IELTS 7.0 план'].map((p) => (
                <button key={p} onClick={() => send(p)} className="chip !py-0.5 text-[11px]">
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Спроси про поступление…"
                className="input !py-2"
              />
              <button onClick={() => send()} disabled={loading} className="btn-primary !px-3 !py-2" aria-label="Отправить">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

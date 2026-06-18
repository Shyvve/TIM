'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/lib/context'
import { daysLeft, fmtDate } from '@/lib/format'
import React from 'react'

const MAX_MESSAGES = 20
const WINDOW_MS = 4 * 60 * 60 * 1000
const MAX_INPUT = 500
const ADMIN_PW_HASH = '533cfdb1f790424acd40168584a751052baeb627a79dd53f68058ae48bf5e7be'

const SYSTEM_PROMPT = `Ты — AI-ассистент платформы Mentoria Hub. Ты помогаешь школьникам 8–12 классов из Центральной Азии с поступлением в топовые университеты мира.

═══ ТЕСТЫ ═══

【IELTS Academic】
Listening (30м, 40 вопр.) → Reading (60м, 3 пассажа, 40 вопр.) → Writing (60м, Task1 график 150+ сл., Task2 эссе 250+ сл.) → Speaking (11-14м, 3 части). Шкала 0-9, overall = среднее ±0.5. Топ-вузы: 7.0-7.5, мин 6.5/секция. Writing: Task Achievement, Coherence, Lexical Resource, Grammar. Стоимость ~$250, действует 2 года. Альтернативы: TOEFL iBT, Duolingo ($59). Ресурсы: ielts.org, IELTS Liz (youtube), ielts-simon.com, British Council IELTS Ready, E2 IELTS.

【SAT Digital】
ТОЛЬКО цифровой (Bluebook). Адаптивный. R&W (2×32м, 27 вопр.) + Math (2×35м, 22 вопр.) = 2ч14м. Шкала 400-1600. Среднее ~1060. Цели: 1400+ (топ-50), 1500+ (топ-20), 1550+ (Ivy). Math: алгебра, квадратные ур., геометрия, статистика. Desmos встроен. $68. 7 раз/год. Superscore. ~80% вузов test-optional, но высокий балл усиливает заявку. MIT/Georgetown/Purdue — required. Ресурсы: Bluebook (bluebook.collegeboard.org), Khan Academy, Schoolhouse.world. Книги: College Panda Math, Meltzer, Black Book.

SAT Subject Tests ОТМЕНЕНЫ с 2021. AP: 1-5, $98/экзамен. ACT: 1-36, альтернатива SAT.

═══ ПОСТУПЛЕНИЕ ═══

Need-blind для иностранцев (2026): Harvard, MIT, Princeton, Yale, Amherst, Bowdoin, Brown, Dartmouth, Notre Dame, Washington and Lee. Остальные — need-aware.

Essays: Personal Statement 650 сл. — показывает КТО ты. Ресурс: collegeessayguy.com. Extracurriculars: spike > список. Топ: IMO, IPhO, IOI, ISEF, RSI, MITES, YYGS, SSP.

═══ ПРАВИЛА ═══
1. Русский по умолчанию. Другой язык — если пользователь пишет на нём.
2. Точные цифры, баллы, даты. Не уверен → "уточни на офиц. сайте".
3. НЕ путай форматы тестов.
4. Бесплатные ресурсы в первую очередь.
5. Используй данные платформы ниже для ответов про возможности.
6. Кратко (3-5 предложений). Подробнее — только по просьбе.
7. Ссылки: пиши полный URL (https://...) в тексте ответа.
8. ЭКОНОМЬ токены. Без длинных вступлений.
9. Не пиши за пользователя эссе/тексты целиком. НО ПОМОГАЙ со структурой, идеями, планом, обратной связью по черновику. Если просят написать эссе — предложи структуру, а не готовый текст.
10. Бессмысленные запросы (повторения, спам, не по теме) — вежливо откажи.
11. Упоминай: /knowledge, /opportunities, /courses, /roadmap.`

interface Message { role: 'user' | 'assistant'; content: string }

function renderMsg(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />
    const parts: (string | React.ReactElement)[] = []
    const re = /(https?:\/\/[^\s\)]+)/g
    let last = 0, m
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index))
      const url = m[1]
      parts.push(<a key={`${i}-${m.index}`} href={url} target="_blank" rel="noopener noreferrer" className="text-brand underline break-all">{url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]} ↗</a>)
      last = m.index + m[0].length
    }
    if (last < line.length) parts.push(line.slice(last))
    return <span key={i} className="block">{parts}</span>
  })
}

export default function Assistant() {
  const { user } = useApp()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [siteCtx, setSiteCtx] = useState('')
  const [remaining, setRemaining] = useState(MAX_MESSAGES)
  const [adminMode, setAdminMode] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const sessionId = typeof window !== 'undefined' ? (localStorage.getItem('mentoria_session_id') || 'anon') : 'anon'

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    if (open && !historyLoaded) {
      loadHistory()
      fetchSiteCtx()
      checkLimit()
    }
  }, [open])

  useEffect(() => {
    if (open && user) fetchSiteCtx()
  }, [user])

  async function loadHistory() {
    const { data } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(50)

    if (data && data.length > 0) {
      setMessages(data.map(d => ({ role: d.role as 'user' | 'assistant', content: d.content })))
    } else {
      setMessages([{ role: 'assistant', content: 'Привет! Я AI-ассистент Mentoria Hub.\nЗнаю всё про IELTS, SAT, поступление, стипендии и текущие возможности на платформе. Спрашивай!' }])
    }
    setHistoryLoaded(true)
  }

  async function saveMsg(role: string, content: string) {
    await supabase.from('chat_messages').insert({ session_id: sessionId, role, content })
  }

  async function checkLimit(): Promise<boolean> {
    const { data } = await supabase
      .from('chat_messages')
      .select('created_at')
      .eq('session_id', sessionId)
      .eq('role', 'user')
      .gte('created_at', new Date(Date.now() - WINDOW_MS).toISOString())
      .order('created_at', { ascending: false })

    const count = data?.length || 0
    setRemaining(Math.max(0, MAX_MESSAGES - count))
    return count < MAX_MESSAGES
  }

  async function resetLimit() {
    await supabase.from('chat_messages').delete().eq('session_id', sessionId)
    setMessages([{ role: 'assistant', content: 'Лимит сброшен. История очищена. Можешь продолжать!' }])
    setRemaining(MAX_MESSAGES)
    setAdminMode(false)
  }

  async function fetchSiteCtx() {
    const { data: opps } = await supabase
      .from('opportunities')
      .select('title, category, direction, deadline, format, apply_url, grade_level')
      .order('deadline', { ascending: true }).limit(30)
    const { data: courses } = await supabase.from('courses').select('title, description, level')
    const now = new Date()
    const upcoming = (opps || []).filter(o => new Date(o.deadline) >= now).slice(0, 10)
    let ctx = '\n═══ ДАННЫЕ ПЛАТФОРМЫ ═══\n'
    if (user) ctx += `Профиль: ${user.grade} кл., интересы: ${user.interests?.join(', ') || '-'}, цель: ${user.goal || '-'}\n`
    ctx += `Ближайшие возможности:\n`
    upcoming.forEach(o => {
      ctx += `• ${o.title} [${o.category}] дедлайн ${fmtDate(o.deadline)} (${daysLeft(o.deadline)}дн.) ${o.apply_url}\n`
    })
    if (courses?.length) { ctx += `Курсы:\n`; courses.forEach(c => { ctx += `• ${c.title} (${c.level})\n` }) }
    setSiteCtx(ctx)
  }

  async function send(preset?: string) {
    const text = (preset ?? input).trim()
    if (!text || loading) return

    if (adminMode) {
      const data = new TextEncoder().encode(text)
      const hash = await crypto.subtle.digest('SHA-256', data)
      const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
      if (hex === ADMIN_PW_HASH) { await resetLimit(); setInput(''); return }
      setMessages(prev => [...prev, { role: 'assistant', content: 'Неверный пароль.' }])
      setAdminMode(false); setInput(''); return
    }

    if (text.length > MAX_INPUT) {
      setMessages(prev => [...prev, { role: 'user', content: text.slice(0, 60) + '…' }, { role: 'assistant', content: `Макс. ${MAX_INPUT} символов.` }])
      setInput(''); return
    }

    const allowed = await checkLimit()
    if (!allowed) {
      setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: `Лимит (${MAX_MESSAGES} сообщений / 4 часа) исчерпан. Введи пароль администратора чтобы сбросить.` }])
      setAdminMode(true); setInput(''); return
    }

    setInput('')
    const userMsg: Message = { role: 'user', content: text }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setLoading(true)
    await saveMsg('user', text)
    setRemaining(r => Math.max(0, r - 1))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.slice(-12).map(m => ({ role: m.role, content: m.content })),
          systemPrompt: SYSTEM_PROMPT + siteCtx,
        }),
      })
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Ошибка') }
      const data = await res.json()
      const reply = data.content
      setMessages([...newMsgs, { role: 'assistant', content: reply }])
      await saveMsg('assistant', reply)
    } catch (e: any) {
      const errMsg = `⚠️ ${e.message || 'Ошибка'}`
      setMessages([...newMsgs, { role: 'assistant', content: errMsg }])
    } finally { setLoading(false) }
  }

  if (!user) return null

  return (
    <>
      <button onClick={() => setOpen(o => !o)} className="btn-primary fixed bottom-5 right-5 z-50 !rounded-full !px-4 !py-3 shadow-2xl" aria-label="AI">
        {open ? <X size={18} /> : <Sparkles size={18} />}
        <span className="hidden sm:inline">{open ? 'Закрыть' : 'AI-ассистент'}</span>
      </button>

      {open && (
        <div className="fadeup fixed bottom-20 right-5 z-50 flex h-[32rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-brand/15 text-brand"><Sparkles size={14} /></span>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink">AI-ассистент</p>
            </div>
            <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted">{remaining}/{MAX_MESSAGES}</span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                  m.role === 'user' ? 'bg-brand text-white' : 'bg-surface-2 text-ink'
                }`}>
                  {m.role === 'assistant' ? renderMsg(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-surface-2 px-3 py-2 text-[13px] text-muted">Думаю...</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-line p-2">
            {!adminMode && (
              <div className="mb-1.5 flex flex-wrap gap-1">
                {['Ближайший хакатон?', 'SAT план', 'Need-blind вузы', 'IELTS 7.0'].map(p => (
                  <button key={p} onClick={() => send(p)} className="chip !py-0 !px-2 text-[10px]">{p}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value.slice(0, MAX_INPUT))}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={adminMode ? 'Пароль администратора...' : 'Спроси про поступление…'}
                type={adminMode ? 'password' : 'text'}
                className="input !py-1.5 !text-[13px]"
              />
              <button onClick={() => send()} disabled={loading} className="btn-primary !px-2.5 !py-1.5"><Send size={14} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

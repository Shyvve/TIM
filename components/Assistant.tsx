'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send } from 'lucide-react'

const SYSTEM_PROMPT = `Ты — AI-ассистент платформы Mentoria Hub. Твоя задача — помогать школьникам 8–12 классов из Центральной Азии (Казахстан, Узбекистан, Кыргызстан и т.д.) с поступлением в топовые университеты мира.

Ты знаешь всё о:
- IELTS (цель 7.0–7.5), SAT (цель 1400–1550+), подготовке к тестам
- College Essays (Personal Statement, Common App, Why Us, Why Major, Diversity)
- Extracurricular Activities (олимпиады, research, стартапы, волонтёрство)
- Research (как писать paper, где публиковаться школьнику)
- CV/Resume для школьников и студентов
- LinkedIn профиль и networking
- Scholarship и financial aid (need-blind вузы: Harvard, MIT, Princeton, Yale, Amherst, Bowdoin, Brown, Dartmouth, Notre Dame, Washington and Lee)
- Roadmap по классам (8→12): что делать каждый год

Правила:
1. Отвечай на русском языке по умолчанию, но если пользователь пишет на другом языке — отвечай на нём.
2. Будь конкретным: давай ссылки на бесплатные ресурсы (Khan Academy, College Essay Guy, British Council, Bluebook).
3. Мотивируй, но будь честным — не обещай 100% поступление.
4. Если вопрос не по теме образования — вежливо верни к теме.
5. Отвечай кратко (2-4 предложения), если не просят подробнее.
6. Рекомендуй бесплатные ресурсы в первую очередь.
7. Упоминай разделы базы знаний Mentoria Hub (/knowledge) когда это уместно.`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Привет! Я AI-ассистент Mentoria Hub. Спроси меня про подготовку к IELTS/SAT, поступление, стипендии или что угодно про образование за рубежом.' },
  ])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  async function send(preset?: string) {
    const text = (preset ?? input).trim()
    if (!text || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: SYSTEM_PROMPT,
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
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
            <span className="grid size-8 place-items-center rounded-lg bg-brand/15 text-brand">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">AI-ассистент</p>
              <p className="text-[11px] text-muted">Помощь с поступлением</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                <div
                  className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
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

          {/* Quick prompts + input */}
          <div className="border-t border-line p-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {['Как готовиться к SAT?', 'Стипендии в США', 'IELTS 7.0'].map((p) => (
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

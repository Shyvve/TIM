'use client'

import { useState } from 'react'
import { useApp } from '@/lib/context'
import { supabase } from '@/lib/supabase'
import { FileText, Copy, Check, Sparkles } from 'lucide-react'

const TEMPLATES = [
  {
    id: 'montage',
    name: 'Montage',
    desc: 'Серия моментов/деталей, объединённых одной темой. Показывает разные грани тебя.',
    fields: [
      { key: 'theme', label: 'Общая тема / нить', placeholder: 'Что объединяет все моменты? (напр. "любопытство", "мосты между культурами")' },
      { key: 'moment1', label: 'Момент 1', placeholder: 'Конкретная сцена/деталь (кто, где, что делает)' },
      { key: 'moment2', label: 'Момент 2', placeholder: 'Другой момент, связанный с темой' },
      { key: 'moment3', label: 'Момент 3', placeholder: 'Третий момент — контраст или развитие' },
      { key: 'moment4', label: 'Момент 4 (опц.)', placeholder: 'Ещё один момент, если есть' },
      { key: 'insight', label: 'Вывод / рефлексия', placeholder: 'Что эти моменты говорят о тебе? Какую ценность раскрывают?' },
    ],
    generate: (f: Record<string, string>) => {
      const moments = [f.moment1, f.moment2, f.moment3, f.moment4].filter(Boolean)
      return `ТЕМА: ${f.theme || '___'}

${moments.map((m, i) => `[Сцена ${i + 1}] ${m}`).join('\n\n')}

[Рефлексия]
${f.insight || '(Что эти моменты говорят о тебе как о человеке?)'}

---
Совет: каждая сцена — 80-120 слов. Начинай с действия, не с «Я помню...». Тема должна ощущаться, но не называться напрямую.`
    },
  },
  {
    id: 'narrative',
    name: 'Narrative',
    desc: 'Одна история с чёткой трансформацией. Классическая арка: вызов → борьба → изменение.',
    fields: [
      { key: 'status_quo', label: 'Status Quo — как было раньше', placeholder: 'Кем ты был до этой истории? Что было «нормой»?' },
      { key: 'inciting', label: 'Inciting Incident — что случилось', placeholder: 'Какое событие/момент всё изменило?' },
      { key: 'rising', label: 'Rising Action — развитие', placeholder: 'Что ты делал? Какие трудности были? Конкретные детали.' },
      { key: 'climax', label: 'Climax — кульминация', placeholder: 'Момент наибольшего напряжения или осознания.' },
      { key: 'resolution', label: 'Resolution — что изменилось', placeholder: 'Кем ты стал? Что понял? Как это влияет на будущее?' },
    ],
    generate: (f: Record<string, string>) => {
      return `[Status Quo]
${f.status_quo || '(Опиши свою жизнь/мышление ДО ключевого момента)'}

[Inciting Incident]
${f.inciting || '(Что запустило изменения?)'}

[Rising Action]
${f.rising || '(Как развивалась ситуация? Конкретные действия и трудности)'}

[Climax]
${f.climax || '(Момент наибольшего напряжения или инсайта)'}

[Resolution]
${f.resolution || '(Кем ты стал? Как это формирует твоё будущее?)'}

---
Совет: начни с середины действия (in medias res). Покажи, не рассказывай — используй диалоги и сенсорные детали. Целься в 650 слов.`
    },
  },
  {
    id: 'why_us',
    name: 'Why Us',
    desc: 'Почему именно этот вуз. Нужно конкретное исследование: профессора, программы, клубы.',
    fields: [
      { key: 'university', label: 'Название вуза', placeholder: 'MIT, Stanford, Yale...' },
      { key: 'academic', label: 'Академический интерес', placeholder: 'Конкретный курс, профессор, лаборатория, программа' },
      { key: 'community', label: 'Сообщество / клуб', placeholder: 'Конкретный клуб, организация, традиция кампуса' },
      { key: 'connection', label: 'Твоя связь', placeholder: 'Как это связано с твоим прошлым опытом и будущими целями?' },
      { key: 'contribution', label: 'Что ты привнесёшь', placeholder: 'Что именно ты дашь кампусу?' },
    ],
    generate: (f: Record<string, string>) => {
      return `[Вуз: ${f.university || '___'}]

[Академический интерес]
${f.academic || '(Конкретный курс/профессор/лаб — НЕ "престижный университет")'}

[Сообщество]
${f.community || '(Конкретный клуб/организация/традиция)'}

[Твоя связь]
${f.connection || '(Почему это важно именно ТЕБЕ — свяжи с опытом)'}

[Вклад]
${f.contribution || '(Что ты привнесёшь в кампус?)'}

---
Совет: 70% эссе — про ВУЗ, 30% — про тебя. Используй названия курсов, имена профессоров. Никогда не пиши "престижный" или "один из лучших".`
    },
  },
]

export default function EssaysPage() {
  const { user } = useApp()
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0])
  const [fields, setFields] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  function setField(key: string, value: string) {
    setFields({ ...fields, [key]: value })
  }

  function switchTemplate(t: typeof TEMPLATES[0]) {
    setActiveTemplate(t)
    setFields({})
  }

  const output = activeTemplate.generate(fields)

  async function copyOutput() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function saveDraft() {
    if (!user) return
    setSaving(true)
    await supabase.from('essay_drafts').upsert({
      user_id: user.id,
      template_type: activeTemplate.id,
      fields,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,template_type' })
    setSaving(false)
  }

  return (
    <div className="section py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><FileText size={22} /></span>
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Шаблоны эссе</h1>
          <p className="text-sm text-muted">Заполни поля — получи структуру. Мы НЕ пишем за тебя, а помогаем организовать мысли.</p>
        </div>
      </div>

      {/* Template tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => switchTemplate(t)} className={activeTemplate.id === t.id ? 'chip-on' : 'chip'}>
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input fields */}
        <div>
          <div className="card p-5 mb-4">
            <h2 className="text-lg font-bold text-ink">{activeTemplate.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{activeTemplate.desc}</p>
          </div>

          <div className="space-y-4">
            {activeTemplate.fields.map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <textarea
                  className="input min-h-[80px]"
                  placeholder={f.placeholder}
                  value={fields[f.key] || ''}
                  onChange={e => setField(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Output preview */}
        <div>
          <div className="sticky top-16">
            <div className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink">Структура эссе</h3>
                <div className="flex gap-2">
                  {user && (
                    <button onClick={saveDraft} disabled={saving} className="btn-ghost text-xs">
                      {saving ? 'Сохранение...' : 'Сохранить черновик'}
                    </button>
                  )}
                  <button onClick={copyOutput} className="btn-outline text-xs">
                    {copied ? <><Check size={12} /> Скопировано</> : <><Copy size={12} /> Копировать</>}
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{output}</pre>
            </div>

            <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 p-4">
              <div className="flex items-start gap-2">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-brand" />
                <div className="text-xs text-ink-soft">
                  <p className="font-semibold text-ink">Подсказка</p>
                  <p className="mt-1">Это структура, не финальный текст. Используй её как каркас: заполни деталями, добавь диалоги и сенсорные образы. Проверь на <a href="https://www.collegeessayguy.com" target="_blank" rel="noopener" className="text-brand underline">College Essay Guy</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

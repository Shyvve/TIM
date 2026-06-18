'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/lib/context'
import { ArrowRight, ArrowLeft, Check, GraduationCap } from 'lucide-react'
import { DIRECTIONS } from '@/lib/format'

const GRADES = ['9', '10', '11', '12']
const GOALS = ['Поступление в университет', 'Победа в олимпиаде', 'Портфолио и опыт', 'Стипендия/грант', 'Новые навыки']

function MultiPick({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => toggle(o)} className={value.includes(o) ? 'chip-on' : 'chip'}>
          {value.includes(o) && <Check size={13} />} {o}
        </button>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const { t, user, setUser, sessionId } = useApp()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ grade: '', interests: [] as string[], goal: '' })
  const [saving, setSaving] = useState(false)

  const steps = [
    {
      title: t('onboard.title'),
      body: (
        <div className="space-y-5">
          <div>
            <label className="label">{t('onboard.grade')}</label>
            <div className="flex gap-2">
              {GRADES.map((g) => (
                <button key={g} onClick={() => setForm({ ...form, grade: g })} className={form.grade === g ? 'chip-on' : 'chip'}>
                  {g} класс
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: form.grade.length > 0,
    },
    {
      title: t('onboard.interests'),
      hint: 'Выбери направления — по ним подберём возможности.',
      body: <MultiPick options={DIRECTIONS} value={form.interests} onChange={(v) => setForm({ ...form, interests: v })} />,
      valid: form.interests.length > 0,
    },
    {
      title: t('onboard.goal'),
      hint: 'Ради чего ты ищешь возможности? Какая у тебя мечта?',
      body: (
        <div className="space-y-4">
          <MultiPick options={GOALS} value={form.goal ? [form.goal] : []} onChange={(v) => setForm({ ...form, goal: v[v.length - 1] || '' })} />
          <textarea
            className="input min-h-20"
            placeholder={t('onboard.goal.placeholder')}
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
          />
        </div>
      ),
      valid: form.goal.length > 0,
    },
  ]

  const cur = steps[step]

  async function finish() {
    setSaving(true)
    if (!user) {
      const { data } = await supabase.from('users').insert({
        session_id: sessionId,
        grade: form.grade,
        interests: form.interests,
        goal: form.goal,
        onboarding_done: true
      }).select().single()
      if (data) setUser(data)
    } else {
      const { data } = await supabase.from('users').update({
        grade: form.grade,
        interests: form.interests,
        goal: form.goal,
        onboarding_done: true
      }).eq('id', user.id).select().single()
      if (data) setUser(data)
    }
    setSaving(false)
    router.push('/dashboard')
  }

  return (
    <div className="section max-w-2xl py-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><GraduationCap size={22} /></span>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Создание профиля</h1>
          <p className="text-sm text-muted">Шаг {step + 1} из {steps.length}</p>
        </div>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>

      <div className="card p-7">
        <h2 className="text-xl font-bold text-ink">{cur.title}</h2>
        {'hint' in cur && cur.hint && <p className="mb-4 mt-1 text-sm text-muted">{cur.hint}</p>}
        <div className="mt-4">{cur.body}</div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-ghost">
          <ArrowLeft size={16} /> Назад
        </button>
        {step < steps.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} disabled={!cur.valid} className="btn-primary">
            Далее <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={finish} disabled={!cur.valid || saving} className="btn-accent">
            <Check size={16} /> {saving ? 'Сохранение...' : 'Готово — в кабинет'}
          </button>
        )}
      </div>
    </div>
  )
}

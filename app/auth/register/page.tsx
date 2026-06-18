'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context'
import { GraduationCap, Eye, EyeOff, Send as SendIcon, Check } from 'lucide-react'

const BOT_USERNAME = process.env.NEXT_PUBLIC_TG_BOT_USERNAME || 'MentoriaHubBot'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useApp()
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' })
  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [usernameOk, setUsernameOk] = useState<boolean | null>(null)

  async function checkUsername(name: string) {
    if (name.length < 3) { setUsernameOk(null); return }
    const { data } = await supabase.from('users').select('id').eq('username', name).maybeSingle()
    setUsernameOk(!data)
  }

  async function handleGetCode() {
    setError('')
    if (form.username.length < 3) { setError('Никнейм мин. 3 символа'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) { setError('Никнейм: буквы, цифры, _'); return }
    if (usernameOk === false) { setError('Никнейм занят'); return }
    if (form.password.length < 6) { setError('Пароль мин. 6 символов'); return }
    if (form.password !== form.confirmPassword) { setError('Пароли не совпадают'); return }

    setLoading(true)
    const res = await fetch('/api/auth/verify-code', { method: 'POST' })
    const data = await res.json()
    if (data.token) {
      setToken(data.token)
      setStep('code')
      window.open(`https://t.me/${BOT_USERNAME}?start=${data.token}`, '_blank')
    } else {
      setError('Ошибка получения кода')
    }
    setLoading(false)
  }

  async function handleVerify() {
    setError('')
    if (code.length !== 6) { setError('Введи 6-значный код'); return }

    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: form.username, password: form.password, code, token }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); setLoading(false); return }

    localStorage.setItem('mentoria_session_id', data.user.session_id)
    localStorage.setItem('mentoria_auth', JSON.stringify(data.user))

    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single()
    if (profile) setUser(profile)

    setLoading(false)
    router.push('/onboarding')
  }

  return (
    <div className="section flex min-h-[calc(100vh-48px)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl text-white shadow-lg shadow-brand/30" style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-2))' }}>
            <GraduationCap size={28} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Создать аккаунт</h1>
          <p className="mt-1 text-sm text-muted">Подтверждение через Telegram бота</p>
        </div>

        <div className="card p-6">
          {error && <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{error}</div>}

          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <label className="label">Никнейм</label>
                <input
                  className="input"
                  placeholder="ivan_2026"
                  value={form.username}
                  onChange={e => { setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }); checkUsername(e.target.value.toLowerCase()) }}
                  required
                />
                {usernameOk === true && <p className="mt-1 text-xs text-accent">✓ Свободен</p>}
                {usernameOk === false && <p className="mt-1 text-xs text-red-400">✗ Занят</p>}
              </div>

              <div>
                <label className="label">Пароль</label>
                <div className="relative">
                  <input className="input !pr-10" type={showPw ? 'text' : 'password'} placeholder="Мин. 6 символов" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted cursor-pointer">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Повторите пароль</label>
                <input className="input" type="password" placeholder="Ещё раз" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
              </div>

              <button onClick={handleGetCode} disabled={loading} className="btn-primary w-full">
                <SendIcon size={16} /> {loading ? 'Подождите...' : 'Получить код в Telegram'}
              </button>

              <p className="text-center text-xs text-muted">
                Откроется бот <strong>@{BOT_USERNAME}</strong> — нажми Start, получи 6-значный код
              </p>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-brand/5 border border-brand/20 p-4 text-center">
                <p className="text-sm text-ink">Мы открыли Telegram бота.</p>
                <p className="mt-1 text-xs text-muted">Нажми <strong>Start</strong> в боте и получи 6-значный код.</p>
                <a href={`https://t.me/${BOT_USERNAME}?start=${token}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-xs text-brand underline">
                  Открыть бота снова ↗
                </a>
              </div>

              <div>
                <label className="label">Код подтверждения</label>
                <input
                  className="input text-center text-2xl font-bold tracking-[0.5em]"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus
                />
              </div>

              <button onClick={handleVerify} disabled={loading || code.length !== 6} className="btn-primary w-full">
                <Check size={16} /> {loading ? 'Проверка...' : 'Подтвердить и создать аккаунт'}
              </button>

              <button onClick={() => setStep('form')} className="btn-ghost w-full text-sm">← Назад</button>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-muted">
            Уже есть аккаунт? <Link href="/auth/login" className="font-semibold text-brand">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

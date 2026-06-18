'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Check } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, phone, newPassword }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); setLoading(false); return }
    setLoading(false)
    setStep('done')
  }

  return (
    <div className="section flex min-h-[calc(100vh-48px)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
            <Lock size={28} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Сброс пароля</h1>
          <p className="mt-1 text-sm text-muted">Введи никнейм и номер телефона</p>
        </div>

        {step === 'done' ? (
          <div className="card p-6 text-center">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-accent/10 text-accent"><Check size={28} /></div>
            <h2 className="text-lg font-bold text-ink">Пароль изменён!</h2>
            <Link href="/auth/login" className="btn-primary mt-6 inline-flex">Войти</Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="card space-y-4 p-6">
            {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{error}</div>}

            <div>
              <label className="label">Никнейм</label>
              <input className="input" placeholder="ivan_2026" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>

            <div>
              <label className="label">Номер телефона</label>
              <input className="input" type="tel" placeholder="+7 777 123 4567" value={phone} onChange={e => setPhone(e.target.value)} required />
              <p className="mt-1 text-xs text-muted">Тот, который указывал при регистрации</p>
            </div>

            <div>
              <label className="label">Новый пароль</label>
              <input className="input" type="password" placeholder="Минимум 6 символов" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Сохранение...' : 'Сменить пароль'}
            </button>

            <p className="text-center text-sm text-muted">
              <Link href="/auth/login" className="text-brand">← Вернуться ко входу</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

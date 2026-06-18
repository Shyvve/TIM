'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login`,
    })

    if (err) { setError(err.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="section flex min-h-[calc(100vh-48px)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
            <Mail size={28} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Восстановление пароля</h1>
          <p className="mt-1 text-sm text-muted">Мы отправим ссылку для сброса</p>
        </div>

        {sent ? (
          <div className="card p-6 text-center">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-accent/10 text-accent">
              <Mail size={28} />
            </div>
            <h2 className="text-lg font-bold text-ink">Письмо отправлено!</h2>
            <p className="mt-2 text-sm text-muted">Проверь почту <strong className="text-ink">{email}</strong> и перейди по ссылке для сброса пароля.</p>
            <Link href="/auth/login" className="btn-primary mt-6 inline-flex">Вернуться ко входу</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4 p-6">
            {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{error}</div>}
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Отправка...' : 'Отправить ссылку'}
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

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [usernameOk, setUsernameOk] = useState<boolean | null>(null)

  async function checkUsername(name: string) {
    if (name.length < 3) { setUsernameOk(null); return }
    const { data } = await supabase.from('users').select('id').eq('username', name).maybeSingle()
    setUsernameOk(!data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.username.length < 3) { setError('Никнейм минимум 3 символа'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) { setError('Никнейм: только буквы, цифры, _'); return }
    if (usernameOk === false) { setError('Этот никнейм уже занят'); return }
    if (form.password.length < 6) { setError('Пароль минимум 6 символов'); return }
    if (form.password !== form.confirmPassword) { setError('Пароли не совпадают'); return }

    setLoading(true)

    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username } }
    })

    if (authErr) {
      setError(authErr.message === 'User already registered' ? 'Этот email уже зарегистрирован' : authErr.message)
      setLoading(false); return
    }

    if (authData.user) {
      const sid = localStorage.getItem('mentoria_session_id') || ''
      await supabase.from('users').upsert({
        auth_id: authData.user.id,
        session_id: sid,
        username: form.username,
        email: form.email,
        onboarding_done: false,
      }, { onConflict: 'session_id' })
    }

    setLoading(false)
    router.push('/auth/verify')
  }

  return (
    <div className="section flex min-h-[calc(100vh-48px)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl text-white shadow-lg shadow-brand/30" style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-2))' }}>
            <GraduationCap size={28} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Создать аккаунт</h1>
          <p className="mt-1 text-sm text-muted">Присоединяйся к Mentoria Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{error}</div>}

          <div>
            <label className="label">Никнейм</label>
            <input
              className="input"
              placeholder="ivan_2026"
              value={form.username}
              onChange={e => { setForm({ ...form, username: e.target.value.toLowerCase() }); checkUsername(e.target.value.toLowerCase()) }}
              required
            />
            {usernameOk === true && <p className="mt-1 text-xs text-accent">✓ Никнейм свободен</p>}
            {usernameOk === false && <p className="mt-1 text-xs text-red-400">✗ Никнейм занят</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div>
            <label className="label">Пароль</label>
            <div className="relative">
              <input className="input !pr-10" type={showPw ? 'text' : 'password'} placeholder="Минимум 6 символов" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted cursor-pointer">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Повторите пароль</label>
            <input className="input" type="password" placeholder="Ещё раз" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Создание...' : 'Зарегистрироваться'}
          </button>

          <p className="text-center text-sm text-muted">
            Уже есть аккаунт? <Link href="/auth/login" className="font-semibold text-brand">Войти</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

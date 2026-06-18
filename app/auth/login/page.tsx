'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useApp()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    let email = login
    if (!login.includes('@')) {
      const { data: u } = await supabase.from('users').select('email').eq('username', login).maybeSingle()
      if (!u?.email) { setError('Пользователь не найден'); setLoading(false); return }
      email = u.email
    }

    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    if (authErr) {
      setError(authErr.message === 'Invalid login credentials' ? 'Неверный логин или пароль' : authErr.message)
      setLoading(false); return
    }

    if (data.user) {
      const { data: profile } = await supabase.from('users').select('*').eq('auth_id', data.user.id).maybeSingle()
      if (profile) {
        setUser(profile)
        localStorage.setItem('mentoria_session_id', profile.session_id)
      }
    }

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="section flex min-h-[calc(100vh-48px)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl text-white shadow-lg shadow-brand/30" style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-2))' }}>
            <GraduationCap size={28} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Вход в Mentoria Hub</h1>
          <p className="mt-1 text-sm text-muted">Никнейм или email + пароль</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{error}</div>}

          <div>
            <label className="label">Никнейм или Email</label>
            <input className="input" placeholder="ivan_2026 или email@example.com" value={login} onChange={e => setLogin(e.target.value)} required />
          </div>

          <div>
            <label className="label">Пароль</label>
            <div className="relative">
              <input className="input !pr-10" type={showPw ? 'text' : 'password'} placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted cursor-pointer">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-sm text-brand">Забыли пароль?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Вход...' : 'Войти'}
          </button>

          <p className="text-center text-sm text-muted">
            Нет аккаунта? <Link href="/auth/register" className="font-semibold text-brand">Зарегистрироваться</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

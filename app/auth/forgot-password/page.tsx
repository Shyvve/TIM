'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Send as SendIcon, Check } from 'lucide-react'

const BOT_USERNAME = process.env.NEXT_PUBLIC_TG_BOT_USERNAME || 'MentoriaHubBot'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'username' | 'code' | 'newpw'>('username')
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGetCode() {
    setError('')
    if (!username) { setError('Введи никнейм'); return }

    const { data: user } = await supabase.from('users').select('id, telegram_chat_id').eq('username', username).maybeSingle()
    if (!user) { setError('Пользователь не найден'); return }
    if (!user.telegram_chat_id) { setError('У этого аккаунта нет привязанного Telegram'); return }

    setLoading(true)
    const res = await fetch('/api/auth/verify-code', { method: 'POST' })
    const data = await res.json()
    if (data.token) {
      setToken(data.token)
      setStep('code')
      window.open(`https://t.me/${BOT_USERNAME}?start=${data.token}`, '_blank')
    }
    setLoading(false)
  }

  async function handleVerifyAndReset() {
    setError('')
    if (code.length !== 6) { setError('Введи 6-значный код'); return }
    if (newPassword.length < 6) { setError('Пароль мин. 6 символов'); return }

    setLoading(true)

    // Verify code
    const { data: vc } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('token', token)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!vc) { setError('Неверный или просроченный код'); setLoading(false); return }

    // Hash new password via API
    const res = await fetch('/api/auth/register', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: newPassword, code, token }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Ошибка')
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('newpw')
  }

  return (
    <div className="section flex min-h-[calc(100vh-48px)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
            <Lock size={28} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Сброс пароля</h1>
          <p className="mt-1 text-sm text-muted">Через Telegram бота</p>
        </div>

        <div className="card p-6">
          {error && <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{error}</div>}

          {step === 'username' && (
            <div className="space-y-4">
              <div>
                <label className="label">Никнейм</label>
                <input className="input" placeholder="ivan_2026" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <button onClick={handleGetCode} disabled={loading} className="btn-primary w-full">
                <SendIcon size={16} /> {loading ? 'Подождите...' : 'Получить код в Telegram'}
              </button>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-brand/5 border border-brand/20 p-4 text-center text-sm">
                <p className="text-ink">Код отправлен в Telegram.</p>
                <a href={`https://t.me/${BOT_USERNAME}?start=${token}`} target="_blank" className="text-xs text-brand underline">Открыть бота ↗</a>
              </div>
              <div>
                <label className="label">Код</label>
                <input className="input text-center text-2xl font-bold tracking-[0.5em]" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} autoFocus />
              </div>
              <div>
                <label className="label">Новый пароль</label>
                <input className="input" type="password" placeholder="Мин. 6 символов" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <button onClick={handleVerifyAndReset} disabled={loading} className="btn-primary w-full">
                <Check size={16} /> {loading ? 'Сохранение...' : 'Сменить пароль'}
              </button>
            </div>
          )}

          {step === 'newpw' && (
            <div className="text-center space-y-4">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-accent/10 text-accent">
                <Check size={28} />
              </div>
              <h2 className="text-lg font-bold text-ink">Пароль изменён!</h2>
              <Link href="/auth/login" className="btn-primary inline-flex">Войти с новым паролем</Link>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-muted">
            <Link href="/auth/login" className="text-brand">← Вернуться ко входу</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

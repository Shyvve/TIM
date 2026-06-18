import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hashPassword } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { username, password, code, token } = await req.json()

  if (!username || !password || !code || !token) {
    return NextResponse.json({ error: 'Заполни все поля' }, { status: 400 })
  }
  if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json({ error: 'Никнейм: мин. 3 символа, буквы/цифры/_' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Пароль мин. 6 символов' }, { status: 400 })
  }

  // Check username uniqueness
  const { data: existing } = await supabase.from('users').select('id').eq('username', username).maybeSingle()
  if (existing) {
    return NextResponse.json({ error: 'Никнейм уже занят' }, { status: 400 })
  }

  // Verify code
  const { data: vc } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('token', token)
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (!vc) {
    return NextResponse.json({ error: 'Неверный или просроченный код' }, { status: 400 })
  }

  // Create user
  const hash = await hashPassword(password)
  const { data: user, error } = await supabase.from('users').insert({
    username,
    password_hash: hash,
    telegram_chat_id: vc.telegram_chat_id,
    session_id: crypto.randomUUID(),
    onboarding_done: false,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: 'Ошибка создания аккаунта' }, { status: 500 })
  }

  // Mark code as used
  await supabase.from('verification_codes').update({ used: true }).eq('id', vc.id)

  return NextResponse.json({ user: { id: user.id, username: user.username, session_id: user.session_id } })
}

// PATCH: reset password
export async function PATCH(req: NextRequest) {
  const { username, password, code, token } = await req.json()

  if (!username || !password || !code || !token) {
    return NextResponse.json({ error: 'Заполни все поля' }, { status: 400 })
  }

  const { data: vc } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('token', token)
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (!vc) return NextResponse.json({ error: 'Неверный или просроченный код' }, { status: 400 })

  const hash = await hashPassword(password)
  const { error } = await supabase.from('users').update({ password_hash: hash }).eq('username', username)
  if (error) return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })

  await supabase.from('verification_codes').update({ used: true }).eq('id', vc.id)
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hashPassword } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { username, password, phone } = await req.json()

  if (!username || !password || !phone) {
    return NextResponse.json({ error: 'Заполни все поля' }, { status: 400 })
  }
  if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json({ error: 'Никнейм: мин. 3 символа, буквы/цифры/_' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Пароль мин. 6 символов' }, { status: 400 })
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Неверный номер телефона' }, { status: 400 })
  }

  const { data: byName } = await supabase.from('users').select('id').eq('username', username).maybeSingle()
  if (byName) return NextResponse.json({ error: 'Никнейм уже занят' }, { status: 400 })

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  const { data: byPhone } = await supabase.from('users').select('id').eq('phone', cleanPhone).maybeSingle()
  if (byPhone) return NextResponse.json({ error: 'Этот номер уже зарегистрирован' }, { status: 400 })

  const hash = await hashPassword(password)
  const { data: user, error } = await supabase.from('users').insert({
    username,
    password_hash: hash,
    phone: cleanPhone,
    session_id: crypto.randomUUID(),
    onboarding_done: false,
  }).select().single()

  if (error) return NextResponse.json({ error: 'Ошибка создания аккаунта: ' + error.message }, { status: 500 })

  return NextResponse.json({ user: { id: user.id, username: user.username, session_id: user.session_id, onboarding_done: false } })
}

// PATCH: reset password by phone
export async function PATCH(req: NextRequest) {
  const { username, phone, newPassword } = await req.json()

  if (!username || !phone || !newPassword) {
    return NextResponse.json({ error: 'Заполни все поля' }, { status: 400 })
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Пароль мин. 6 символов' }, { status: 400 })
  }

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  const { data: user } = await supabase.from('users').select('id').eq('username', username).eq('phone', cleanPhone).maybeSingle()
  if (!user) return NextResponse.json({ error: 'Пользователь не найден или номер не совпадает' }, { status: 404 })

  const hash = await hashPassword(newPassword)
  await supabase.from('users').update({ password_hash: hash }).eq('id', user.id)

  return NextResponse.json({ ok: true })
}

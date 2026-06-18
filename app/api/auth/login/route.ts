import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyPassword } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { login, password } = await req.json()

  if (!login || !password) {
    return NextResponse.json({ error: 'Заполни все поля' }, { status: 400 })
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', login)
    .maybeSingle()

  if (!user || !user.password_hash) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 })
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      session_id: user.session_id,
      grade: user.grade,
      interests: user.interests,
      goal: user.goal,
      onboarding_done: user.onboarding_done,
    }
  })
}

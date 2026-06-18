import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateToken } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST: create a new verification token (user clicks "Get code")
export async function POST(req: NextRequest) {
  const token = generateToken()
  const { error } = await supabase.from('verification_codes').insert({
    token,
    code: '000000', // placeholder, bot will set real code
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  })

  if (error) {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 })
  }

  return NextResponse.json({ token })
}

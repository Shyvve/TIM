import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateCode } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const msg = body.message
  if (!msg?.text || !msg?.chat?.id) return NextResponse.json({ ok: true })

  const chatId = msg.chat.id
  const text = msg.text.trim()

  // /start VERIFY_TOKEN — generate code for this token
  if (text.startsWith('/start')) {
    const parts = text.split(' ')
    const token = parts[1]

    if (!token) {
      await sendMessage(chatId, '👋 Привет! Я бот <b>Mentoria Hub</b>.\n\nЧтобы зарегистрироваться, нажми кнопку «Получить код» на сайте — я отправлю тебе 6-значный код подтверждения.')
      return NextResponse.json({ ok: true })
    }

    // Check if token exists
    const { data: vc } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!vc) {
      await sendMessage(chatId, '❌ Ссылка устарела или недействительна. Попробуй заново на сайте.')
      return NextResponse.json({ ok: true })
    }

    // Generate code and update record
    const code = generateCode()
    await supabase.from('verification_codes').update({
      code,
      telegram_chat_id: chatId,
    }).eq('id', vc.id)

    await sendMessage(chatId, `🔑 Твой код подтверждения:\n\n<code>${code}</code>\n\nВведи его на сайте Mentoria Hub.\nКод действует 10 минут.`)
    return NextResponse.json({ ok: true })
  }

  // /reset TOKEN — for password reset
  if (text.startsWith('/reset')) {
    const parts = text.split(' ')
    const token = parts[1]

    if (!token) {
      await sendMessage(chatId, 'Используй ссылку с сайта для сброса пароля.')
      return NextResponse.json({ ok: true })
    }

    const { data: vc } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!vc) {
      await sendMessage(chatId, '❌ Ссылка устарела. Попробуй заново.')
      return NextResponse.json({ ok: true })
    }

    const code = generateCode()
    await supabase.from('verification_codes').update({ code, telegram_chat_id: chatId }).eq('id', vc.id)

    await sendMessage(chatId, `🔐 Код для сброса пароля:\n\n<code>${code}</code>\n\nВведи его на сайте.`)
    return NextResponse.json({ ok: true })
  }

  await sendMessage(chatId, 'Я бот Mentoria Hub. Используй кнопку на сайте для получения кода. 🎓')
  return NextResponse.json({ ok: true })
}

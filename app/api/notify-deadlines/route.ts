import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

async function sendTG(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') || ''
  if (secret !== (process.env.CRON_SECRET || 'mentoria-refresh-2026')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 })
  }

  const now = new Date()
  const in3 = new Date(now); in3.setDate(in3.getDate() + 3)
  const in7 = new Date(now); in7.setDate(in7.getDate() + 7)
  const today = now.toISOString().split('T')[0]
  const day3 = in3.toISOString().split('T')[0]
  const day7 = in7.toISOString().split('T')[0]

  // Get saved items with deadlines in 3 or 7 days
  const { data: items } = await supabase
    .from('saved_items')
    .select('user_id, opportunity:opportunities(title, deadline, apply_url, category)')
    .in('status', ['interested', 'preparing'])

  if (!items?.length) {
    return NextResponse.json({ sent: 0, message: 'No items to notify' })
  }

  // Get users with telegram_chat_id
  const userIds = [...new Set(items.map(i => i.user_id))]
  const { data: users } = await supabase
    .from('users')
    .select('id, username, telegram_chat_id')
    .in('id', userIds)
    .not('telegram_chat_id', 'is', null)

  if (!users?.length) {
    return NextResponse.json({ sent: 0, message: 'No users with TG linked' })
  }

  const userMap = new Map(users.map(u => [u.id, u]))
  let sent = 0

  for (const item of items) {
    const opp = item.opportunity as any
    if (!opp?.deadline) continue

    const deadline = opp.deadline.split('T')[0]
    const user = userMap.get(item.user_id)
    if (!user?.telegram_chat_id) continue

    let emoji = ''
    let urgency = ''

    if (deadline === day3) {
      emoji = '🔴'
      urgency = '3 дня'
    } else if (deadline === day7) {
      emoji = '🟡'
      urgency = '7 дней'
    } else {
      continue
    }

    const msg = `${emoji} <b>Дедлайн через ${urgency}!</b>\n\n` +
      `📌 ${opp.title}\n` +
      `📂 ${opp.category}\n` +
      `📅 ${deadline}\n` +
      (opp.apply_url ? `\n🔗 <a href="${opp.apply_url}">Подать заявку</a>` : '') +
      `\n\n💡 Не забудь подать заявку вовремя!`

    try {
      await sendTG(user.telegram_chat_id, msg)
      sent++
    } catch {}
  }

  return NextResponse.json({ sent, checked: items.length, timestamp: now.toISOString() })
}

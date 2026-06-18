import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface DevpostHackathon {
  title: string
  url: string
  submission_period_dates: string
  prize_amount: string
  themes: string[]
}

function parseDevpostDeadline(dates: string): string | null {
  const match = dates.match(/(\w+\s+\d+),?\s*(\d{4})$/) || dates.match(/-\s*(\w+)\s+(\d+),?\s*(\d{4})$/)
  if (!match) return null
  try {
    const raw = dates.includes('-') ? dates.split('-')[1].trim() : dates.trim()
    const d = new Date(raw)
    if (isNaN(d.getTime())) return null
    return d.toISOString().split('T')[0]
  } catch { return null }
}

function themesToDirection(themes: string[]): string {
  const t = themes.map(t => t.toLowerCase()).join(' ')
  if (t.includes('education')) return 'Социальное влияние'
  if (t.includes('social good') || t.includes('health')) return 'Социальное влияние'
  if (t.includes('machine learning') || t.includes('ai')) return 'Программирование'
  if (t.includes('web') || t.includes('mobile') || t.includes('devops')) return 'Программирование'
  if (t.includes('fintech') || t.includes('blockchain')) return 'Финансы'
  if (t.includes('design')) return 'Бизнес'
  return 'STEM'
}

async function fetchDevpost(status: 'open' | 'upcoming'): Promise<DevpostHackathon[]> {
  try {
    const res = await fetch(`https://devpost.com/api/hackathons?status=${status}&page=1`, {
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.hackathons || []
  } catch { return [] }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') || ''
  const envSecret = process.env.CRON_SECRET || 'mentoria-refresh-2026'
  if (secret !== envSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [open, upcoming] = await Promise.all([
    fetchDevpost('open'),
    fetchDevpost('upcoming'),
  ])

  const allHackathons = [...open, ...upcoming]
  let added = 0

  for (const h of allHackathons) {
    const deadline = parseDevpostDeadline(h.submission_period_dates)
    if (!deadline) continue
    if (new Date(deadline) < new Date()) continue

    const { data: existing } = await supabase
      .from('opportunities')
      .select('id')
      .eq('apply_url', h.url)
      .maybeSingle()

    if (existing) continue

    const themes = (h.themes || []).filter((t): t is string => typeof t === 'string')
    const beginner = themes.some(t => t.toLowerCase().includes('beginner'))
    const { error } = await supabase.from('opportunities').insert({
      title: h.title,
      category: 'Хакатон',
      direction: themesToDirection(themes),
      format: 'Онлайн',
      deadline,
      description: `${h.title}. ${h.prize_amount && h.prize_amount !== '$0' ? `Призы: ${h.prize_amount}. ` : ''}Темы: ${themes.join(', ')}.`,
      requirements: beginner ? 'Beginner friendly. Регистрация на Devpost.' : 'Регистрация на Devpost.',
      apply_url: h.url,
      grade_level: ['9', '10', '11', '12'],
      tags: themes.map(t => t.toLowerCase()),
      required_skill_tags: [],
    })

    if (!error) added++
  }

  // Remove expired opportunities (deadline in the past)
  const { data: expired } = await supabase
    .from('opportunities')
    .select('id, deadline')
    .lt('deadline', new Date().toISOString().split('T')[0])

  let removed = 0
  if (expired?.length) {
    const ids = expired.map(e => e.id)
    await supabase.from('saved_items').delete().in('opportunity_id', ids)
    const { error } = await supabase.from('opportunities').delete().in('id', ids)
    if (!error) removed = expired.length
  }

  return NextResponse.json({
    message: `Обновлено: +${added} новых, -${removed} просроченных`,
    added,
    removed,
    totalParsed: allHackathons.length,
    timestamp: new Date().toISOString(),
  })
}

// GET for easy manual trigger
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret') || ''
  const envSecret = process.env.CRON_SECRET || 'mentoria-refresh-2026'
  if (secret !== envSecret) {
    return NextResponse.json({ error: 'Add ?secret=mentoria-refresh-2026' }, { status: 401 })
  }

  // Redirect to POST logic
  const postReq = new NextRequest(req.url, {
    method: 'POST',
    headers: { 'x-cron-secret': secret },
  })
  return POST(postReq)
}

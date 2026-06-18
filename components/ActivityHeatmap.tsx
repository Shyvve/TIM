'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/lib/context'

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
const DAYS = ['Пн', '', 'Ср', '', 'Пт', '', '']
const LEVELS = ['bg-surface-2', 'bg-accent/20', 'bg-accent/40', 'bg-accent/70', 'bg-accent']

export default function ActivityHeatmap() {
  const { user } = useApp()
  const [data, setData] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (user) fetchActivity()
  }, [user])

  async function fetchActivity() {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: logs } = await supabase
      .from('activity_log')
      .select('date')
      .eq('user_id', user!.id)
      .gte('date', sixMonthsAgo.toISOString().split('T')[0])

    // Also count course_progress and saved_items as activity
    const { data: progress } = await supabase
      .from('course_progress')
      .select('completed_at')
      .eq('user_id', user!.id)
      .eq('completed', true)
      .gte('completed_at', sixMonthsAgo.toISOString())

    const { data: saves } = await supabase
      .from('saved_items')
      .select('created_at')
      .eq('user_id', user!.id)
      .gte('created_at', sixMonthsAgo.toISOString())

    const counts: Record<string, number> = {}

    ;(logs || []).forEach(l => {
      counts[l.date] = (counts[l.date] || 0) + 1
    })
    ;(progress || []).forEach(p => {
      const d = p.completed_at?.split('T')[0]
      if (d) counts[d] = (counts[d] || 0) + 1
    })
    ;(saves || []).forEach(s => {
      const d = s.created_at?.split('T')[0]
      if (d) counts[d] = (counts[d] || 0) + 1
    })

    setData(counts)
    setTotal(Object.values(counts).reduce((a, b) => a + b, 0))
  }

  // Generate grid: 26 weeks × 7 days
  const weeks: string[][] = []
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - (26 * 7) + (7 - start.getDay()))

  for (let w = 0; w < 26; w++) {
    const week: string[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      week.push(date.toISOString().split('T')[0])
    }
    weeks.push(week)
  }

  function level(date: string): string {
    const c = data[date] || 0
    if (c === 0) return LEVELS[0]
    if (c === 1) return LEVELS[1]
    if (c === 2) return LEVELS[2]
    if (c <= 4) return LEVELS[3]
    return LEVELS[4]
  }

  // Month labels
  const monthLabels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, i) => {
    const m = new Date(week[0]).getMonth()
    if (m !== lastMonth) {
      monthLabels.push({ label: MONTHS[m], col: i })
      lastMonth = m
    }
  })

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">{total} действий за 6 месяцев</h3>
      </div>

      {/* Month labels */}
      <div className="flex text-[10px] text-muted mb-1" style={{ paddingLeft: '28px' }}>
        {monthLabels.map((m, i) => (
          <span key={i} style={{ position: 'relative', left: `${m.col * 14}px`, width: 0, whiteSpace: 'nowrap' }}>
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 pr-1">
          {DAYS.map((d, i) => (
            <div key={i} className="h-[12px] text-[9px] leading-[12px] text-muted w-5 text-right">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((date, di) => {
                const isFuture = date > today.toISOString().split('T')[0]
                return (
                  <div
                    key={date}
                    className={`size-[12px] rounded-[2px] ${isFuture ? 'bg-transparent' : level(date)}`}
                    title={isFuture ? '' : `${date}: ${data[date] || 0} действий`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted">
        <span>Меньше</span>
        {LEVELS.map((l, i) => <div key={i} className={`size-[10px] rounded-[2px] ${l}`} />)}
        <span>Больше</span>
      </div>
    </div>
  )
}

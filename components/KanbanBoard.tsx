'use client'

import { useState } from 'react'
import { OpportunityStatus, SavedItem } from '@/types'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Props {
  items: SavedItem[]
  onItemUpdate: () => void
}

const COLUMNS: { id: OpportunityStatus; title: string; color: string }[] = [
  { id: 'interested', title: 'Интересно', color: '#3b82f6' },
  { id: 'preparing', title: 'Готовлюсь', color: '#eab308' },
  { id: 'applied', title: 'Подал', color: '#a855f7' },
  { id: 'result', title: 'Результат', color: '#22c55e' }
]

export default function KanbanBoard({ items, onItemUpdate }: Props) {
  const [activeItems, setActiveItems] = useState(items)

  if (items !== activeItems && items.length !== activeItems.length) {
    setActiveItems(items)
  }

  async function moveItem(itemId: string, newStatus: OpportunityStatus) {
    const itemToMove = activeItems.find(i => i.id === itemId)
    if (!itemToMove || itemToMove.status === newStatus) return

    setActiveItems(prev => prev.map(i => i.id === itemId ? { ...i, status: newStatus } : i))
    await supabase.from('saved_items').update({ status: newStatus }).eq('id', itemId)
    onItemUpdate()
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map(col => {
        const colItems = activeItems.filter(i => i.status === col.id)
        return (
          <div key={col.id} className="flex min-h-[300px] flex-col rounded-2xl border border-line bg-surface-2">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line p-4">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: col.color }} />
                <h3 className="text-sm font-bold text-ink">{col.title}</h3>
              </div>
              <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-muted">{colItems.length}</span>
            </div>

            {/* Items */}
            <div className="flex flex-1 flex-col gap-3 p-3">
              {colItems.length === 0 && (
                <div className="py-8 text-center text-xs text-muted">Перетащите сюда</div>
              )}
              {colItems.map(item => (
                <div key={item.id} className="card p-4">
                  <div className="mb-1 text-[11px] text-muted">{item.opportunity?.category}</div>
                  <Link href={`/opportunities`} className="text-sm font-semibold text-ink hover:text-brand">
                    {item.opportunity?.title}
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {COLUMNS.filter(c => c.id !== col.id).map(c => (
                      <button
                        key={c.id}
                        onClick={() => moveItem(item.id, c.id)}
                        className="chip !py-0.5 text-[10px]"
                      >
                        → {c.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

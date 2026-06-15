'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core'
import { OpportunityStatus, SavedItem } from '@/types'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useApp } from '@/lib/context'

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
  const { t } = useApp()
  const [activeItems, setActiveItems] = useState(items)

  // Sync state if props change
  if (items !== activeItems && items.length !== activeItems.length) {
    setActiveItems(items)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const itemId = active.id as string
    const newStatus = over.id as OpportunityStatus

    const itemToMove = activeItems.find(i => i.id === itemId)
    if (!itemToMove || itemToMove.status === newStatus) return

    // Optimistic update
    setActiveItems(prev => prev.map(i => i.id === itemId ? { ...i, status: newStatus } : i))

    // DB update
    await supabase.from('saved_items').update({ status: newStatus }).eq('id', itemId)
    onItemUpdate()
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="kanban-grid" style={{ marginTop: '24px' }}>
        {COLUMNS.map(col => {
          const colItems = activeItems.filter(i => i.status === col.id)
          return (
            <div key={col.id} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Column Header */}
              <div style={{
                padding: '16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }}/>
                  <h3 style={{ fontSize: '15px', fontWeight: '700' }}>{col.title}</h3>
                </div>
                <span style={{ fontSize: '12px', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-muted)' }}>
                  {colItems.length}
                </span>
              </div>

              {/* Droppable Area (simple simulation without useDroppable for less complex setup) */}
              <div id={col.id} className="droppable-col" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {colItems.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Перетащите сюда
                  </div>
                )}
                {colItems.map(item => (
                  <div key={item.id} className="card" style={{ padding: '16px', cursor: 'grab' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {item.opportunity?.category}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', lineHeight: '1.3' }}>
                      <Link href={`/opportunities/${item.opportunity?.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {item.opportunity?.title}
                      </Link>
                    </div>
                    
                    {/* Status change buttons (fallback for mobile/accessibility) */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {COLUMNS.map(c => c.id !== col.id && (
                        <button
                          key={c.id}
                          onClick={async () => {
                            setActiveItems(prev => prev.map(i => i.id === item.id ? { ...i, status: c.id } : i))
                            await supabase.from('saved_items').update({ status: c.id }).eq('id', item.id)
                            onItemUpdate()
                          }}
                          style={{
                            fontSize: '10px', padding: '4px 8px', borderRadius: '6px',
                            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                            color: 'var(--text-secondary)', cursor: 'pointer'
                          }}
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
    </DndContext>
  )
}

'use client'

import { Opportunity } from '@/types'
import { useApp } from '@/lib/context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useState } from 'react'

interface Props { opportunity: Opportunity }

const CATEGORY_COLORS: Record<string, string> = {
  'Олимпиада': 'badge-accent',
  'Хакатон': 'badge-orange',
  'Летняя школа': 'badge-green',
  'Стипендия': 'badge-yellow',
  'Программа': 'badge-blue',
}

const FORMAT_ICONS: Record<string, string> = {
  'Онлайн': '🌐',
  'Офлайн': '📍',
  'Гибрид': '🔀',
}

export default function OpportunityCard({ opportunity: opp }: Props) {
  const { t, user, savedIds, refreshSaved } = useApp()
  const isSaved = savedIds.has(opp.id)
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault()
    if (!user || saving) return
    setSaving(true)
    if (isSaved) {
      await supabase.from('saved_items').delete().eq('user_id', user.id).eq('opportunity_id', opp.id)
    } else {
      await supabase.from('saved_items').upsert({ user_id: user.id, opportunity_id: opp.id, status: 'interested' })
    }
    await refreshSaved()
    setSaving(false)
  }

  const deadline = opp.deadline ? new Date(opp.deadline) : null
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
  const isUrgent = daysLeft !== null && daysLeft <= 14 && daysLeft >= 0
  const isPast = daysLeft !== null && daysLeft < 0

  return (
    <Link href={`/opportunities/${opp.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
        {/* Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`badge ${CATEGORY_COLORS[opp.category] || 'badge-gray'}`}>{opp.category}</span>
            {opp.format && <span className="badge badge-gray">{FORMAT_ICONS[opp.format] || ''} {opp.format}</span>}
          </div>
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || !user}
            title={!user ? 'Войдите чтобы сохранить' : (isSaved ? 'Убрать из сохранённых' : 'Сохранить')}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: `1px solid ${isSaved ? 'var(--accent)' : 'transparent'}`,
              background: isSaved ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)',
              color: isSaved ? 'var(--accent)' : 'var(--text-muted)',
              cursor: user ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
          </button>
        </div>

        {/* Title */}
        <h3 className="heading-font" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: '1.3' }}>
          {opp.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px', flex: 1,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {opp.description}
        </p>

        {/* Direction */}
        {opp.direction && (
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📌 {opp.direction}</span>
          </div>
        )}

        {/* Grade levels */}
        {opp.grade_level?.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {opp.grade_level.map(g => (
              <span key={g} className="badge badge-gray" style={{ fontSize: '11px', padding: '2px 8px' }}>{g} кл</span>
            ))}
          </div>
        )}

        <hr className="divider" style={{ margin: '12px 0' }} />

        {/* Bottom: deadline + apply */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          {deadline ? (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{t('opp.deadline')}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: isPast ? 'var(--text-muted)' : isUrgent ? '#f87171' : '#4ade80' }}>
                {isPast ? 'Истёк' : deadline.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                {!isPast && daysLeft !== null && <span style={{ fontSize: '11px', fontWeight: '400', marginLeft: '6px' }}>({daysLeft}д)</span>}
              </div>
            </div>
          ) : <div/>}

          {opp.apply_url && (
            <a
              href={opp.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="btn-primary btn-sm"
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {t('opp.apply')} ↗
            </a>
          )}
        </div>
      </div>
    </Link>
  )
}

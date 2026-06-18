'use client'

import { Opportunity } from '@/types'
import { useApp } from '@/lib/context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useState } from 'react'
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, GraduationCap, Clock } from 'lucide-react'
import { daysLeft, fmtDate, dirColor } from '@/lib/format'

interface Props { opportunity: Opportunity }

export default function OpportunityCard({ opportunity: opp }: Props) {
  const { t, user, savedIds, refreshSaved } = useApp()
  const isSaved = savedIds.has(opp.id)
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
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

  const d = opp.deadline ? daysLeft(opp.deadline) : null
  const urgent = d !== null && d <= 7
  const soon = d !== null && d <= 21
  const deadlineColor = urgent ? '#dc2626' : soon ? '#f59e0b' : '#16a34a'
  const dc = dirColor(opp.direction)

  return (
    <article className="card-hover fadeup flex flex-col p-5">
      {/* Top: badges + save */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge bg-surface-2 text-ink-soft">{opp.category}</span>
          {opp.direction && (
            <span className="badge" style={{ color: dc, background: `color-mix(in srgb, ${dc} 14%, transparent)` }}>
              {opp.direction}
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !user}
          aria-label={isSaved ? t('opp.saved') : t('opp.save')}
          className={`grid size-9 shrink-0 place-items-center rounded-lg border transition-colors cursor-pointer ${
            isSaved ? 'border-brand bg-brand/10 text-brand' : 'border-line text-muted hover:text-brand'
          }`}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* Title + description */}
      <h3 className="text-base font-bold leading-snug text-ink">{opp.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{opp.description}</p>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
        {opp.grade_level?.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <GraduationCap size={14} /> {opp.grade_level.join(', ')} кл.
          </span>
        )}
        {opp.format && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} /> {opp.format}
          </span>
        )}
      </div>

      {/* Footer: deadline + apply */}
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <div className="flex items-center gap-2">
          {d !== null && (
            <span
              className="badge"
              title={fmtDate(opp.deadline)}
              style={{ color: deadlineColor, background: `color-mix(in srgb, ${deadlineColor} 14%, transparent)` }}
            >
              <Clock size={12} />
              {d > 0 ? `${d} дн.` : 'завершён'}
            </span>
          )}
          {opp.deadline && <span className="text-xs text-muted">{fmtDate(opp.deadline)}</span>}
        </div>
        {opp.apply_url && (
          <a
            href={opp.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-primary !px-3 !py-2 text-xs"
          >
            {t('opp.apply')} <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Opportunity, Course } from '@/types'
import { useApp } from '@/lib/context'
import Link from 'next/link'

export default function OpportunityDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t, user, savedIds, refreshSaved } = useApp()
  const [opp, setOpp] = useState<Opportunity | null>(null)
  const [matchedCourses, setMatchedCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const isSaved = opp ? savedIds.has(opp.id) : false

  useEffect(() => { if (id) fetchOpp() }, [id])

  async function fetchOpp() {
    setLoading(true)
    const { data } = await supabase.from('opportunities').select('*').eq('id', id).single()
    if (data) {
      setOpp(data)
      fetchMatchedCourses(data.required_skill_tags || [])
    }
    setLoading(false)
  }

  async function fetchMatchedCourses(requiredTags: string[]) {
    if (!requiredTags.length) return
    const { data } = await supabase.from('courses').select('*')
    if (data) {
      const matched = data.filter((c: Course) =>
        c.skill_tags?.some(tag => requiredTags.includes(tag))
      )
      setMatchedCourses(matched)
    }
  }

  async function handleSave() {
    if (!user || saving || !opp) return
    setSaving(true)
    if (isSaved) {
      await supabase.from('saved_items').delete().eq('user_id', user.id).eq('opportunity_id', opp.id)
    } else {
      await supabase.from('saved_items').upsert({ user_id: user.id, opportunity_id: opp.id, status: 'interested' })
    }
    await refreshSaved()
    setSaving(false)
  }

  if (loading) return (
    <div className="section container">
      <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}/>
    </div>
  )

  if (!opp) return (
    <div className="section container empty-state">
      <h2>Возможность не найдена</h2>
      <Link href="/opportunities" className="btn-secondary" style={{ marginTop: '16px', display:'inline-flex' }}>← Назад к каталогу</Link>
    </div>
  )

  const deadline = opp.deadline ? new Date(opp.deadline) : null
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="section">
      <div className="container">
        <Link href="/opportunities" className="btn-ghost" style={{ marginBottom: '24px', display: 'inline-flex' }}>
          ← {t('common.back')}
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
          {/* Main content */}
          <div>
            {/* Header */}
            <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span className="badge badge-accent">{opp.category}</span>
                {opp.format && <span className="badge badge-gray">{opp.format}</span>}
                {opp.direction && <span className="badge badge-blue">{opp.direction}</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
                {opp.title}
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
                {opp.description}
              </p>

              {/* Grade levels */}
              {opp.grade_level?.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('opp.grade')}:</span>
                  {opp.grade_level.map(g => <span key={g} className="badge badge-gray">{g} класс</span>)}
                </div>
              )}

              {/* Tags */}
              {opp.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {opp.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              )}
            </div>

            {/* Requirements */}
            {opp.requirements && (
              <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>📋 Требования</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{opp.requirements}</p>
              </div>
            )}

            {/* SKILL → COURSE MATCH (Differentiator #1!) */}
            {matchedCourses.length > 0 && (
              <div style={{
                background: 'rgba(108,99,255,0.08)',
                border: '1px solid rgba(108,99,255,0.3)',
                borderRadius: '16px',
                padding: '28px',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '24px' }}>🎯</span>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent-light)' }}>
                    {t('opp.readiness')}
                  </h2>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Для этой возможности нужны навыки: <strong style={{ color: 'var(--text-primary)' }}>{opp.required_skill_tags?.join(', ')}</strong>
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {matchedCourses.map(course => (
                    <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      >
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{course.title}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{course.level}</div>
                          <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {course.skill_tags?.map(tag => <span key={tag} className="tag" style={{ fontSize: '11px' }}>#{tag}</span>)}
                          </div>
                        </div>
                        <span className="btn-primary btn-sm">Начать →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '84px' }}>
            {/* Action card */}
            <div className="card" style={{ padding: '24px' }}>
              {/* Deadline */}
              {deadline && (
                <div style={{
                  background: daysLeft !== null && daysLeft <= 14 ? 'rgba(239,68,68,0.08)' : 'var(--bg-secondary)',
                  border: `1px solid ${daysLeft !== null && daysLeft <= 14 ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{t('opp.deadline')}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: daysLeft !== null && daysLeft <= 14 ? '#f87171' : '#4ade80' }}>
                    {deadline.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  {daysLeft !== null && daysLeft >= 0 && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Осталось {daysLeft} дней
                    </div>
                  )}
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving || !user}
                className={isSaved ? 'btn-secondary' : 'btn-primary'}
                style={{ width: '100%', marginBottom: '12px', justifyContent: 'center' }}
              >
                {isSaved ? '✓ ' + t('opp.saved') : '📌 ' + t('opp.save')}
              </button>

              {/* Apply button */}
              {opp.apply_url && (
                <a href={opp.apply_url} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                  {t('opp.apply')} ↗
                </a>
              )}

              {!user && (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
                  <Link href="/onboarding" style={{ color: 'var(--accent-light)' }}>Войдите</Link>, чтобы сохранить
                </p>
              )}
            </div>

            {/* Required skills */}
            {opp.required_skill_tags?.length > 0 && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>НУЖНЫЕ НАВЫКИ</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {opp.required_skill_tags.map(tag => <span key={tag} className="tag">🎯 {tag}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

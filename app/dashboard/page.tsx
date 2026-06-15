'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SavedItem, Course, Opportunity } from '@/types'
import { useApp } from '@/lib/context'
import Link from 'next/link'
import KanbanBoard from '@/components/KanbanBoard'

export default function DashboardPage() {
  const { t, user } = useApp()
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [courseProgress, setCourseProgress] = useState<any[]>([])
  const [recommended, setRecommended] = useState<Opportunity[]>([])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [user])

  async function fetchDashboardData() {
    setLoading(true)
    
    // 1. Fetch saved items
    const { data: items } = await supabase
      .from('saved_items')
      .select('*, opportunity:opportunities(*)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    
    if (items) setSavedItems(items)

    // 2. Fetch course progress
    const { data: progress } = await supabase
      .from('course_progress')
      .select('lesson_id, completed, lessons(course_id, courses(id, title, level, image_url))')
      .eq('user_id', user!.id)
      .eq('completed', true)

    if (progress) {
      // Group by course
      const courseMap = new Map()
      progress.forEach((p: any) => {
        const cId = p.lessons.course_id
        if (!courseMap.has(cId)) {
          courseMap.set(cId, { ...p.lessons.courses, completedLessons: 0 })
        }
        courseMap.get(cId).completedLessons++
      })
      setCourseProgress(Array.from(courseMap.values()))
    }

    // 3. Simple recommendations based on interests
    if (user!.interests && user!.interests.length > 0) {
      const { data: recs } = await supabase
        .from('opportunities')
        .select('*')
        // simple logic: return items where any tag matches user interests
        .limit(3)
      if (recs) setRecommended(recs)
    }

    setLoading(false)
  }

  if (!user && !loading) {
    return (
      <div className="section container empty-state" style={{ marginTop: '100px' }}>
        <h2>Войдите в систему</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Чтобы видеть свой кабинет, создайте профиль.</p>
        <Link href="/onboarding" className="btn-primary" style={{ display: 'inline-flex' }}>Создать профиль →</Link>
      </div>
    )
  }

  // Get upcoming deadlines
  const upcoming = savedItems
    .filter(i => i.opportunity?.deadline && i.status !== 'result')
    .map(i => ({ ...i.opportunity, status: i.status }))
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3)

  return (
    <div className="section">
      <div className="container">
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>{t('dash.title')}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Привет! Твоя цель: <span style={{ color: 'var(--text-primary)' }}>{user?.goal || 'Пока не указана'}</span>
        </p>

        {loading ? (
          <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}/>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
            
            {/* Main Area */}
            <div>
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{t('dash.pipeline')}</h2>
                  <Link href="/opportunities" className="btn-ghost">Искать ещё →</Link>
                </div>
                <KanbanBoard items={savedItems} onItemUpdate={fetchDashboardData} />
              </div>

              {/* My Courses */}
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>{t('dash.my_courses')}</h2>
                {courseProgress.length === 0 ? (
                  <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Вы ещё не начали ни один курс.
                    <br/><Link href="/courses" style={{ color: 'var(--accent-light)', marginTop: '8px', display: 'inline-block' }}>Посмотреть курсы</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {courseProgress.map(c => (
                      <Link key={c.id} href={`/courses/${c.id}`} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{c.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Пройдено уроков: {c.completedLessons}</div>
                          </div>
                          <span className="btn-secondary btn-sm">Продолжить</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Deadlines */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#f87171' }}>⏰</span> {t('dash.deadlines')}
                </h3>
                {upcoming.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Нет ближайших дедлайнов</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {upcoming.map(u => {
                      const days = Math.ceil((new Date(u.deadline!).getTime() - Date.now()) / (1000 * 3600 * 24))
                      return (
                        <div key={u.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '8px', textAlign: 'center', minWidth: '48px' }}>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: days <= 7 ? '#f87171' : 'var(--text-primary)' }}>{days}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>дней</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.3', marginBottom: '4px' }}>
                              <Link href={`/opportunities/${u.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                                {u.title}
                              </Link>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.category}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="card" style={{ padding: '24px', background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.2)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-light)' }}>✨</span> {t('dash.recommended')}
                </h3>
                {recommended.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Заполните профиль для рекомендаций</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recommended.map(r => (
                      <Link key={r.id} href={`/opportunities/${r.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--accent-light)', marginBottom: '4px' }}>{r.category}</div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{r.title}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

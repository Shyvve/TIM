'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SavedItem, Opportunity } from '@/types'
import { useApp } from '@/lib/context'
import Link from 'next/link'
import KanbanBoard from '@/components/KanbanBoard'
import ActivityHeatmap from '@/components/ActivityHeatmap'
import { Bookmark, BookOpen, CalendarClock, Sparkles, Pencil, GraduationCap } from 'lucide-react'
import { fmtDate, daysLeft } from '@/lib/format'

export default function DashboardPage() {
  const { t, user } = useApp()
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [courseProgress, setCourseProgress] = useState<any[]>([])
  const [recommended, setRecommended] = useState<Opportunity[]>([])

  useEffect(() => {
    if (user) fetchDashboardData()
    else setLoading(false)
  }, [user])

  async function fetchDashboardData() {
    setLoading(true)
    const { data: items } = await supabase
      .from('saved_items')
      .select('*, opportunity:opportunities(*)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    if (items) setSavedItems(items)

    const { data: progress } = await supabase
      .from('course_progress')
      .select('lesson_id, completed, lessons(course_id, courses(id, title, level, image_url))')
      .eq('user_id', user!.id)
      .eq('completed', true)

    if (progress) {
      const courseMap = new Map()
      progress.forEach((p: any) => {
        const cId = p.lessons.course_id
        if (!courseMap.has(cId)) courseMap.set(cId, { ...p.lessons.courses, completedLessons: 0 })
        courseMap.get(cId).completedLessons++
      })
      setCourseProgress(Array.from(courseMap.values()))
    }

    if (user!.interests?.length > 0) {
      const { data: recs } = await supabase.from('opportunities').select('*').limit(3)
      if (recs) setRecommended(recs)
    }
    setLoading(false)
  }

  if (!user && !loading) {
    return (
      <div className="section py-16">
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <GraduationCap className="text-muted" size={32} />
          <p className="font-semibold text-ink">Сначала создай профиль</p>
          <p className="max-w-sm text-sm text-muted">Пройди короткий онбординг — и кабинет наполнится персональными рекомендациями.</p>
        </div>
        <div className="mt-4 text-center">
          <Link href="/onboarding" className="btn-primary">Создать профиль</Link>
        </div>
      </div>
    )
  }

  const upcoming = savedItems
    .filter(i => i.opportunity?.deadline && i.status !== 'result')
    .map(i => ({ ...i.opportunity!, status: i.status }))
    .filter(o => daysLeft(o.deadline) >= 0)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

  return (
    <div className="section py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">{t('dash.title')} 👋</h1>
          <p className="mt-1 text-ink-soft">
            {user?.grade && `${user.grade} класс`}
            {user?.interests?.length ? ` · интересы: ${user.interests.join(', ')}` : ''}
          </p>
        </div>
        <Link href="/onboarding" className="btn-outline text-sm"><Pencil size={15} /> Изменить профиль</Link>
      </div>

      {/* Activity Heatmap */}
      <div className="mb-8">
        <ActivityHeatmap />
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: '400px' }} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {/* Kanban pipeline */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><Bookmark size={18} className="text-brand" /> {t('dash.pipeline')}</h2>
                <Link href="/opportunities" className="text-sm font-semibold text-brand">Каталог</Link>
              </div>
              <KanbanBoard items={savedItems} onItemUpdate={fetchDashboardData} />
            </div>

            {/* My courses */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><BookOpen size={18} className="text-brand" /> {t('dash.my_courses')}</h2>
                <Link href="/courses" className="text-sm font-semibold text-brand">Все курсы</Link>
              </div>
              {courseProgress.length === 0 ? (
                <div className="card flex flex-col items-center gap-2 p-10 text-center">
                  <BookOpen className="text-muted" size={32} />
                  <p className="font-semibold text-ink">Пока пусто</p>
                  <p className="max-w-sm text-sm text-muted">Запишись на курс — прогресс появится здесь.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courseProgress.map((c: any) => (
                    <Link key={c.id} href={`/courses/${c.id}`} className="card-hover flex items-center gap-4 p-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><BookOpen size={22} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-ink">{c.title}</p>
                        <p className="text-xs text-muted">Пройдено уроков: {c.completedLessons}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Deadlines */}
            <div className="card p-5">
              <div className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
                <CalendarClock size={18} className="text-brand" /> {t('dash.deadlines')}
              </div>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted">Нет ближайших дедлайнов.</p>
              ) : (
                <ul className="space-y-3">
                  {upcoming.map((o) => {
                    const d = daysLeft(o.deadline)
                    return (
                      <li key={o.id} className="flex items-center gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-center leading-none">
                          <span className="text-base font-extrabold text-ink">{new Date(o.deadline).getDate()}</span>
                          <span className="text-[10px] text-muted">{fmtDate(o.deadline).split(' ')[1]}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{o.title}</p>
                          <span className="text-xs text-muted">{d} дн.</span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Recommendations */}
            <div className="card p-5">
              <div className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
                <Sparkles size={18} className="text-brand" /> {t('dash.recommended')}
              </div>
              {recommended.length === 0 ? (
                <p className="text-sm text-muted">Заполните профиль для рекомендаций.</p>
              ) : (
                <div className="space-y-2">
                  {recommended.map((r) => (
                    <Link key={r.id} href={`/opportunities`} className="block rounded-xl border border-line bg-surface px-3 py-2 text-xs hover:border-brand">
                      <span className="font-semibold text-ink">{r.title}</span>
                      <span className="ml-1 text-muted">· {r.category}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

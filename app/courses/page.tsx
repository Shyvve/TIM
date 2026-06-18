'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Course } from '@/types'
import { useApp } from '@/lib/context'
import Link from 'next/link'
import { BookOpen, PlayCircle } from 'lucide-react'
import { dirColor } from '@/lib/format'

const LEVEL_TONE: Record<string, string> = {
  'Начальный': '#16a34a',
  'Средний': '#f59e0b',
  'Продвинутый': '#dc2626',
}

export default function CoursesPage() {
  const { t, user } = useApp()
  const [courses, setCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCourses() }, [])
  useEffect(() => { if (user && courses.length) fetchProgress() }, [user, courses])

  async function fetchCourses() {
    const { data } = await supabase.from('courses').select('*').order('created_at')
    if (data) {
      setCourses(data)
      const counts: Record<string, number> = {}
      await Promise.all(data.map(async (c: Course) => {
        const { count } = await supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('course_id', c.id)
        counts[c.id] = count || 0
      }))
      setLessonCounts(counts)
    }
    setLoading(false)
  }

  async function fetchProgress() {
    if (!user) return
    const { data: progressData } = await supabase
      .from('course_progress')
      .select('lesson_id, completed, lessons(course_id)')
      .eq('user_id', user.id)
      .eq('completed', true)

    const courseProgress: Record<string, number> = {}
    if (progressData) {
      progressData.forEach((p: any) => {
        const courseId = p.lessons?.course_id
        if (courseId) courseProgress[courseId] = (courseProgress[courseId] || 0) + 1
      })
    }

    const pct: Record<string, number> = {}
    Object.entries(courseProgress).forEach(([courseId, completed]) => {
      const total = lessonCounts[courseId] || 1
      pct[courseId] = Math.round((completed / total) * 100)
    })
    setProgress(pct)
  }

  return (
    <div className="section py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-ink">{t('courses.title')}</h1>
        <p className="mt-1 text-ink-soft">{t('courses.subtitle')}</p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: '360px' }} />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const pct = progress[course.id] || 0
            const lessonCount = lessonCounts[course.id] || 0
            const hasStarted = pct > 0
            const c1 = dirColor(course.skill_tags?.[0] || '')
            const levelColor = LEVEL_TONE[course.level] || '#64748b'
            return (
              <Link key={course.id} href={`/courses/${course.id}`} className="card-hover fadeup flex flex-col overflow-hidden">
                <div className="relative h-32" style={{ background: `linear-gradient(135deg, ${c1}, color-mix(in srgb, ${c1} 55%, #000))` }}>
                  <BookOpen className="absolute right-4 top-4 text-white/40" size={48} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="badge" style={{ color: levelColor, background: `color-mix(in srgb, ${levelColor} 14%, transparent)` }}>{course.level}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-ink">{course.title}</h3>
                  <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-ink-soft">{course.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><PlayCircle size={14} /> {lessonCount} {t('courses.lessons')}</span>
                  </div>
                  {user && hasStarted ? (
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold text-brand">{pct === 100 ? 'Завершён' : 'В процессе'}</span>
                        <span className="text-muted">{pct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                        <div className="bar-fill h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--color-brand), var(--color-accent-soft))' }} />
                      </div>
                    </div>
                  ) : (
                    <span className="btn-primary mt-4 w-full text-sm">{t('courses.start')}</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

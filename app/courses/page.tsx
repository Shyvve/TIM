'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Course, Lesson, CourseProgress } from '@/types'
import { useApp } from '@/lib/context'
import Link from 'next/link'

const LEVEL_COLOR: Record<string, string> = {
  'Начальный': 'badge-green',
  'Средний': 'badge-yellow',
  'Продвинутый': 'badge-orange',
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
      // Fetch lesson counts
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

  const COURSE_ICONS = ['📖', '🧮', '📝', '💻', '🌍', '🔬']

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '12px' }}>📚 Обучение</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '800', marginBottom: '12px' }}>{t('courses.title')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px' }}>{t('courses.subtitle')}</p>
        </div>

        {loading ? (
          <div className="grid-cards">
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '16px' }}/>)}
          </div>
        ) : (
          <div className="grid-cards">
            {courses.map((course, idx) => {
              const pct = progress[course.id] || 0
              const lessonCount = lessonCounts[course.id] || 0
              const hasStarted = pct > 0
              return (
                <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                    {/* Icon */}
                    <div style={{
                      width: '60px', height: '60px',
                      background: 'var(--gradient-accent)',
                      borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '28px', marginBottom: '20px',
                    }}>
                      {COURSE_ICONS[idx % COURSE_ICONS.length]}
                    </div>

                    {/* Level badge */}
                    <div style={{ marginBottom: '12px' }}>
                      <span className={`badge ${LEVEL_COLOR[course.level] || 'badge-gray'}`}>{course.level}</span>
                    </div>

                    <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', lineHeight: '1.3' }}>
                      {course.title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', flex: 1, marginBottom: '16px' }}>
                      {course.description}
                    </p>

                    {/* Skill tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {course.skill_tags?.map(tag => <span key={tag} className="tag" style={{ fontSize: '11px' }}>#{tag}</span>)}
                    </div>

                    {/* Progress */}
                    {user && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                          <span>{t('courses.progress')}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%` }}/>
                        </div>
                      </div>
                    )}

                    {/* Bottom */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        📝 {lessonCount} {t('courses.lessons')}
                      </span>
                      <span className="btn-primary btn-sm">
                        {hasStarted ? t('courses.continue') : t('courses.start')} →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

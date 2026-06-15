'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Course, Lesson } from '@/types'
import { useApp } from '@/lib/context'
import Link from 'next/link'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { t, user } = useApp()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({})
  const [testResult, setTestResult] = useState<Record<string, boolean>>({})
  const [completing, setCompleting] = useState(false)

  useEffect(() => { if (id) fetchCourseAndLessons() }, [id])
  useEffect(() => { if (user && lessons.length) fetchProgress() }, [user, lessons])

  async function fetchCourseAndLessons() {
    setLoading(true)
    const { data: c } = await supabase.from('courses').select('*').eq('id', id).single()
    if (c) {
      setCourse(c)
      const { data: l } = await supabase.from('lessons').select('*').eq('course_id', c.id).order('order_num')
      if (l) {
        setLessons(l)
        if (l.length > 0) setActiveLesson(l[0])
      }
    }
    setLoading(false)
  }

  async function fetchProgress() {
    if (!user) return
    const { data } = await supabase
      .from('course_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .in('lesson_id', lessons.map(l => l.id))
      .eq('completed', true)
    
    if (data) {
      const p: Record<string, boolean> = {}
      data.forEach((item: any) => p[item.lesson_id] = item.completed)
      setProgress(p)
    }
  }

  async function completeLesson() {
    if (!user || !activeLesson || completing) return
    
    // Check if test passed (if test exists)
    if (activeLesson.mini_test && activeLesson.mini_test.length > 0) {
      const isPassed = activeLesson.mini_test.every((q, i) => testAnswers[`${activeLesson.id}_${i}`] === q.correct)
      if (!isPassed) {
        setTestResult({ ...testResult, [activeLesson.id]: false })
        return
      }
      setTestResult({ ...testResult, [activeLesson.id]: true })
    }

    setCompleting(true)
    await supabase.from('course_progress').upsert({
      user_id: user.id,
      lesson_id: activeLesson.id,
      completed: true,
      completed_at: new Date().toISOString()
    })
    
    setProgress({ ...progress, [activeLesson.id]: true })
    setCompleting(false)
  }

  if (loading) return (
    <div className="section container">
      <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}/>
    </div>
  )

  if (!course) return (
    <div className="section container empty-state">
      <h2>Курс не найден</h2>
      <Link href="/courses" className="btn-secondary" style={{ marginTop: '16px', display:'inline-flex' }}>← К списку курсов</Link>
    </div>
  )

  const completedCount = Object.keys(progress).length
  const totalCount = lessons.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="section">
      <div className="container">
        <Link href="/courses" className="btn-ghost" style={{ marginBottom: '24px', display: 'inline-flex' }}>
          ← {t('common.back')}
        </Link>

        {/* Course Header */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span className="badge badge-accent">{course.level}</span>
            {course.skill_tags?.map(t => <span key={t} className="tag">#{t}</span>)}
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: '800', marginBottom: '12px' }}>{course.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '24px' }}>{course.description}</p>
          
          {user ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Прогресс: {completedCount} из {totalCount} уроков</span>
                <span style={{ fontWeight: '600', color: pct === 100 ? '#4ade80' : 'var(--text-primary)' }}>{pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? '#4ade80' : 'var(--gradient-accent)' }}/>
              </div>
            </div>
          ) : (
            <div className="info-box">
              <span style={{ fontSize: '20px' }}>💡</span>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Чтобы сохранять прогресс по курсу, <Link href="/onboarding" style={{ color: 'var(--accent-light)' }}>создайте профиль</Link>.
              </p>
            </div>
          )}
        </div>

        {/* Layout: Sidebar + Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
          
          {/* Lessons list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>ПРОГРАММА</h3>
            {lessons.map((lesson, idx) => {
              const isDone = progress[lesson.id]
              const isActive = activeLesson?.id === lesson.id
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  style={{
                    padding: '16px',
                    background: isActive ? 'var(--bg-card)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: isDone ? 'rgba(34,197,94,0.15)' : 'var(--bg-secondary)',
                    border: `1px solid ${isDone ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                    color: isDone ? '#4ade80' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '600',
                  }}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div style={{ fontWeight: isActive ? '600' : '500', fontSize: '14px', flex: 1 }}>{lesson.title}</div>
                </button>
              )
            })}
          </div>

          {/* Lesson content */}
          {activeLesson && (
            <div>
              <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>{activeLesson.title}</h2>
                
                {/* Video placeholder */}
                {activeLesson.video_placeholder && (
                  <div style={{
                    width: '100%', aspectRatio: '16/9',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)',
                  }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
                      <circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4V8z"/>
                    </svg>
                    <span>Видеоурок ({activeLesson.video_placeholder})</span>
                  </div>
                )}

                {/* Content text */}
                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '15px' }}>
                  {activeLesson.content}
                </div>
              </div>

              {/* Mini test */}
              {activeLesson.mini_test && activeLesson.mini_test.length > 0 && (
                <div className="card" style={{ padding: '32px', marginBottom: '24px', border: '1px solid rgba(108,99,255,0.3)', background: 'rgba(108,99,255,0.05)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: 'var(--accent-light)' }}>
                    📝 Проверь себя
                  </h3>
                  
                  {testResult[activeLesson.id] === false && (
                    <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                      Ответы неверны. Попробуй ещё раз.
                    </div>
                  )}
                  {testResult[activeLesson.id] === true && (
                    <div style={{ padding: '12px', background: 'rgba(34,197,94,0.1)', color: '#4ade80', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                      Всё верно! Урок пройден.
                    </div>
                  )}

                  {activeLesson.mini_test.map((q, qIdx) => (
                    <div key={qIdx} style={{ marginBottom: '24px' }}>
                      <p style={{ fontWeight: '600', marginBottom: '12px', fontSize: '15px' }}>{q.question}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {q.options.map((opt, oIdx) => {
                          const isSelected = testAnswers[`${activeLesson.id}_${qIdx}`] === oIdx
                          const isDoneAndCorrect = testResult[activeLesson.id] && q.correct === oIdx
                          
                          return (
                            <button
                              key={oIdx}
                              disabled={testResult[activeLesson.id]}
                              onClick={() => setTestAnswers({...testAnswers, [`${activeLesson.id}_${qIdx}`]: oIdx})}
                              style={{
                                padding: '12px 16px',
                                background: isDoneAndCorrect ? 'rgba(34,197,94,0.15)' : isSelected ? 'rgba(108,99,255,0.15)' : 'var(--bg-secondary)',
                                border: `1px solid ${isDoneAndCorrect ? '#4ade80' : isSelected ? 'var(--accent)' : 'var(--border)'}`,
                                borderRadius: '10px',
                                textAlign: 'left',
                                color: isDoneAndCorrect ? '#4ade80' : isSelected ? 'var(--accent-light)' : 'var(--text-secondary)',
                                cursor: testResult[activeLesson.id] ? 'default' : 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Complete button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-primary"
                  onClick={completeLesson}
                  disabled={!user || completing || progress[activeLesson.id] || (testResult[activeLesson.id] === true)}
                  style={{
                    opacity: (!user || progress[activeLesson.id]) ? 0.5 : 1,
                    cursor: (!user || progress[activeLesson.id]) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {progress[activeLesson.id] ? '✓ Урок завершён' : 'Завершить урок'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .container > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

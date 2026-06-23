'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Course, Lesson } from '@/types'
import { useApp } from '@/lib/context'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, Play, ExternalLink, Lock, Download } from 'lucide-react'
import { materialsForCourse } from '@/lib/materials'

function RichContent({ text }: { text: string }) {
  const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|\n)/g)
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink-soft">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return <br key={i} />
        const rendered = line.replace(
          /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand hover:underline font-medium">$1 ↗</a>'
        ).replace(
          /\*\*([^*]+)\*\*/g,
          '<strong class="text-ink font-semibold">$1</strong>'
        )
        return <p key={i} dangerouslySetInnerHTML={{ __html: rendered }} />
      })}
    </div>
  )
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const { t, user } = useApp()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({})
  const [testChecked, setTestChecked] = useState<Record<string, boolean>>({})
  const [completing, setCompleting] = useState(false)

  useEffect(() => { if (id) fetchData() }, [id])
  useEffect(() => { if (user && lessons.length) fetchProgress() }, [user, lessons])

  async function fetchData() {
    setLoading(true)
    const { data: c } = await supabase.from('courses').select('*').eq('id', id).single()
    if (c) {
      setCourse(c)
      const { data: l } = await supabase.from('lessons').select('*').eq('course_id', c.id).order('order_num')
      if (l) setLessons(l)
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
      data.forEach((item: any) => p[item.lesson_id] = true)
      setProgress(p)
    }
  }

  async function completeLesson() {
    if (!user || !lesson || completing) return
    const quiz = lesson.mini_test
    if (quiz?.length) {
      const allCorrect = quiz.every((q, i) => testAnswers[`${lesson.id}_${i}`] === q.correct)
      setTestChecked({ ...testChecked, [lesson.id]: allCorrect })
      if (!allCorrect) return
    }
    setCompleting(true)
    await supabase.from('course_progress').upsert({
      user_id: user.id, lesson_id: lesson.id, completed: true, completed_at: new Date().toISOString()
    })
    setProgress({ ...progress, [lesson.id]: true })
    setCompleting(false)
  }

  if (loading) return <div className="section py-10"><div className="skeleton" style={{ height: '400px' }} /></div>
  if (!course) return (
    <div className="section py-20 text-center">
      <p className="text-ink-soft">Курс не найден.</p>
      <Link href="/courses" className="btn-primary mt-4">К курсам</Link>
    </div>
  )

  const lesson = lessons[active]
  const completedCount = Object.keys(progress).length
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0
  const lessonDone = lesson ? progress[lesson.id] : false
  const materials = materialsForCourse(course.skill_tags)

  return (
    <div className="section py-8">
      <Link href="/courses" className="btn-ghost mb-4 text-sm"><ArrowLeft size={16} /> Все курсы</Link>

      {/* Header */}
      <div className="card overflow-hidden">
        <div className="p-6" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-brand) 16%, transparent), transparent)' }}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="badge bg-brand/10 text-brand">{course.level}</span>
            {course.skill_tags?.map(tag => <span key={tag} className="badge bg-surface-2 text-ink-soft">#{tag}</span>)}
          </div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">{course.description}</p>
          <div className="mt-5">
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-semibold text-ink">Прогресс: {completedCount} из {lessons.length}</span>
              <span className="text-muted">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="bar-fill h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#16a34a' : 'linear-gradient(90deg, var(--color-brand), var(--color-accent-soft))' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Lesson list */}
        <aside className="card h-fit p-3">
          <p className="px-2 py-2 text-sm font-bold text-ink">Уроки курса</p>
          {lessons.map((l, i) => {
            const done = progress[l.id]
            return (
              <button
                key={l.id}
                onClick={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  i === active ? 'bg-brand/10' : 'hover:bg-surface-2'
                }`}
              >
                {done ? <CheckCircle2 size={18} className="text-accent shrink-0" /> : <Circle size={18} className="text-muted shrink-0" />}
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm font-semibold ${i === active ? 'text-brand' : 'text-ink'}`}>{l.title}</span>
                </span>
              </button>
            )
          })}
        </aside>

        {/* Lesson content */}
        {lesson && (
          <section className="card p-6">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted">
              <span>Урок {active + 1} из {lessons.length}</span>
            </div>
            <h2 className="text-xl font-bold text-ink">{lesson.title}</h2>

            {/* Video — clickable link to resource */}
            {lesson.video_placeholder && (
              <a
                href={lesson.video_placeholder}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex aspect-video w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface-2 transition-all hover:border-brand hover:bg-brand/5 group cursor-pointer"
              >
                <div className="text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand/15 text-brand transition-transform group-hover:scale-110">
                    <Play size={28} className="ml-1" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">Открыть видео-ресурс</p>
                  <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted">
                    {lesson.video_placeholder.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    <ExternalLink size={10} />
                  </p>
                </div>
              </a>
            )}

            {/* Rich content with clickable links */}
            <div className="mt-6">
              <RichContent text={lesson.content} />
            </div>

            {/* Mini test */}
            {lesson.mini_test?.length > 0 && (
              <div className="mt-6 rounded-xl border border-brand/30 bg-brand/5 p-5">
                <p className="mb-4 text-sm font-bold text-ink">Мини-тест</p>
                {lesson.mini_test.map((q, qIdx) => (
                  <div key={qIdx} className="mb-4">
                    <p className="mb-3 text-sm font-semibold text-ink">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const key = `${lesson.id}_${qIdx}`
                        const picked = testAnswers[key] === oIdx
                        const checked = testChecked[lesson.id] !== undefined
                        const isCorrect = q.correct === oIdx
                        const state = checked
                          ? isCorrect ? 'border-accent bg-accent/10 text-ink' : picked ? 'border-red-400 bg-red-500/10 text-ink' : 'border-line text-ink-soft'
                          : picked ? 'border-brand bg-brand/10 text-ink' : 'border-line text-ink-soft hover:border-brand'
                        return (
                          <button
                            key={oIdx}
                            disabled={lessonDone}
                            onClick={() => { setTestAnswers({ ...testAnswers, [key]: oIdx }); setTestChecked(prev => { const n = { ...prev }; delete n[lesson.id]; return n }) }}
                            className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${state}`}
                          >
                            <span className="grid size-5 place-items-center rounded-full border border-current text-[11px]">{String.fromCharCode(65 + oIdx)}</span>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {testChecked[lesson.id] === false && <p className="text-sm font-semibold text-red-500">Неверно, попробуй ещё</p>}
                {testChecked[lesson.id] === true && <p className="text-sm font-semibold text-accent">Верно! Урок засчитан ✓</p>}
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex justify-between">
              <button onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0} className="btn-outline text-sm">
                <ArrowLeft size={16} /> Назад
              </button>
              {lessonDone ? (
                active < lessons.length - 1 ? (
                  <button onClick={() => setActive(a => a + 1)} className="btn-primary text-sm">Следующий урок</button>
                ) : (
                  <span className="btn-accent text-sm">Курс завершён ✓</span>
                )
              ) : (
                <button onClick={completeLesson} disabled={!user || completing} className="btn-primary text-sm">
                  {completing ? 'Сохранение...' : 'Завершить урок'}
                </button>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Материалы курса (PDF/DOCX для скачивания) */}
      {materials.length > 0 && (
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand"><Download size={18} /></span>
            <div>
              <h2 className="text-lg font-bold text-ink">Материалы курса</h2>
              <p className="text-xs text-muted">Бесплатные PDF и шаблоны для скачивания</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {materials.map(m => (
              <a
                key={m.file}
                href={`/materials/${m.file}`}
                download
                className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-brand hover:bg-brand/5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-bold text-brand">{m.format}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">{m.name}</span>
                  <span className="block truncate text-xs text-muted">{m.desc}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted">{m.size} <Download size={14} /></span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

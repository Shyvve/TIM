'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Opportunity } from '@/types'
import { useApp } from '@/lib/context'
import { Plus, Pencil, Trash2, X, Compass, ShieldCheck, Save, BarChart3, Users } from 'lucide-react'
import { fmtDate, dirColor, DIRECTIONS, CATEGORIES, FORMATS } from '@/lib/format'

export default function AdminPage() {
  const { t } = useApp()
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [editModal, setEditModal] = useState<Partial<Opportunity> | null>(null)
  const [tab, setTab] = useState<'opps' | 'users'>('opps')
  const [users, setUsers] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [coursesCount, setCoursesCount] = useState(0)

  useEffect(() => { if (auth) { fetchOpps(); fetchUsers() } }, [auth])

  async function fetchOpps() {
    setLoading(true)
    const { data } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false })
    if (data) setOpps(data)
    setLoading(false)
  }

  async function fetchUsers() {
    const { data } = await supabase.from('users').select('id, username, grade, interests, goal, onboarding_done, created_at, phone').order('created_at', { ascending: false })
    if (data) setUsers(data)
    const { count: sc } = await supabase.from('saved_items').select('id', { count: 'exact', head: true })
    setSavedCount(sc || 0)
    const { count: cc } = await supabase.from('courses').select('id', { count: 'exact', head: true })
    setCoursesCount(cc || 0)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const data = new TextEncoder().encode(password)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
    if (hex === '533cfdb1f790424acd40168584a751052baeb627a79dd53f68058ae48bf5e7be') setAuth(true)
    else alert('Неверный пароль')
  }

  function newOpp() {
    setEditModal({
      category: CATEGORIES[0],
      format: FORMATS[0],
      direction: DIRECTIONS[0],
      grade_level: ['9', '10', '11', '12'],
      tags: [],
      required_skill_tags: []
    })
  }

  async function saveOpp(form: Partial<Opportunity>) {
    setLoading(true)
    const dataToSave = { ...form }
    if (typeof dataToSave.tags === 'string') dataToSave.tags = (dataToSave.tags as unknown as string).split(',').map(s => s.trim()).filter(Boolean)
    if (typeof dataToSave.required_skill_tags === 'string') dataToSave.required_skill_tags = (dataToSave.required_skill_tags as unknown as string).split(',').map(s => s.trim()).filter(Boolean)
    if (typeof dataToSave.grade_level === 'string') dataToSave.grade_level = (dataToSave.grade_level as unknown as string).split(',').map(s => s.trim()).filter(Boolean)

    if (form.id) {
      await supabase.from('opportunities').update(dataToSave).eq('id', form.id)
    } else {
      await supabase.from('opportunities').insert(dataToSave)
    }
    setEditModal(null)
    fetchOpps()
  }

  async function deleteOpp(id: string) {
    if (!confirm('Точно удалить?')) return
    setLoading(true)
    await supabase.from('opportunities').delete().eq('id', id)
    fetchOpps()
  }

  if (!auth) return (
    <div className="section max-w-md py-16">
      <div className="card p-7">
        <h1 className="text-2xl font-extrabold text-ink mb-6">Админ-панель</h1>
        <form onSubmit={handleLogin}>
          <input className="input mb-4" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn-primary w-full">Войти</button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="section py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><ShieldCheck size={22} /></span>
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Админ-панель Mentoria</h1>
          <p className="text-sm text-muted">Управляйте возможностями без пересборки сайта.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold text-brand">{opps.length}</div>
          <div className="mt-1 text-xs text-muted">Возможностей</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold" style={{ color: 'var(--color-accent)' }}>{users.length}</div>
          <div className="mt-1 text-xs text-muted">Пользователей</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold" style={{ color: '#8b5cf6' }}>{savedCount}</div>
          <div className="mt-1 text-xs text-muted">Сохранений</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold" style={{ color: '#f59e0b' }}>{coursesCount}</div>
          <div className="mt-1 text-xs text-muted">Курсов</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex items-center gap-2">
        <button onClick={() => setTab('opps')} className={tab === 'opps' ? 'chip-on' : 'chip'}><Compass size={14} /> Возможности</button>
        <button onClick={() => setTab('users')} className={tab === 'users' ? 'chip-on' : 'chip'}><Users size={14} /> Пользователи ({users.length})</button>
        <div className="flex-1" />
        {tab === 'opps' && <button onClick={newOpp} className="btn-primary text-sm"><Plus size={16} /> Добавить</button>}
      </div>

      {/* Content */}
      {tab === 'opps' && (
        <div className="card divide-y divide-line overflow-hidden">
          {loading && opps.length === 0 ? (
            <div className="p-6 text-center text-muted">Загрузка...</div>
          ) : opps.map((o) => (
            <div key={o.id} className="flex items-center gap-3 p-4">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: dirColor(o.direction) }} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{o.title}</p>
                <p className="text-xs text-muted">{o.category} · {o.direction} · дедлайн {fmtDate(o.deadline)}</p>
              </div>
              <button onClick={() => setEditModal(o)} className="btn-ghost !p-2" aria-label="Редактировать"><Pencil size={16} /></button>
              <button onClick={() => deleteOpp(o.id)} className="btn-ghost !p-2 text-red-500" aria-label="Удалить"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="card divide-y divide-line overflow-hidden">
          <div className="flex items-center gap-3 p-3 text-xs font-bold text-muted bg-surface-2">
            <span className="w-32">Никнейм</span>
            <span className="w-16">Класс</span>
            <span className="flex-1">Интересы</span>
            <span className="w-24">Телефон</span>
            <span className="w-20">Статус</span>
            <span className="w-28">Дата</span>
          </div>
          {users.length === 0 ? (
            <div className="p-6 text-center text-muted">Нет пользователей</div>
          ) : users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3 text-sm">
              <span className="w-32 font-semibold text-ink truncate">{u.username || '—'}</span>
              <span className="w-16 text-muted">{u.grade || '—'}</span>
              <span className="flex-1 text-xs text-muted truncate">{u.interests?.join(', ') || '—'}</span>
              <span className="w-24 text-xs text-muted">{u.phone || '—'}</span>
              <span className="w-20">{u.onboarding_done ? <span className="pill done">Готов</span> : <span className="pill core">Новый</span>}</span>
              <span className="w-28 text-xs text-muted">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && <OppForm initial={editModal} onClose={() => setEditModal(null)} onSave={saveOpp} />}
    </div>
  )
}

function OppForm({ initial, onSave, onClose }: { initial: Partial<Opportunity>; onSave: (f: Partial<Opportunity>) => void; onClose: () => void }) {
  const [f, setF] = useState(initial)
  const set = (k: string, v: any) => setF({ ...f, [k]: v })

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="card fadeup w-full max-w-2xl overflow-y-auto p-6 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">{f.id ? 'Редактировать' : 'Новая'} возможность</h3>
          <button onClick={onClose} className="btn-ghost !p-2"><X size={18} /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Название</label>
            <input className="input" value={f.title || ''} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div>
            <label className="label">Категория</label>
            <select className="input" value={f.category || ''} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Направление</label>
            <select className="input" value={f.direction || ''} onChange={(e) => set('direction', e.target.value)}>
              {DIRECTIONS.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Формат</label>
            <select className="input" value={f.format || ''} onChange={(e) => set('format', e.target.value)}>
              {FORMATS.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Дедлайн</label>
            <input type="date" className="input" value={f.deadline || ''} onChange={(e) => set('deadline', e.target.value)} />
          </div>
          <div>
            <label className="label">Ссылка для заявки</label>
            <input className="input" value={f.apply_url || ''} onChange={(e) => set('apply_url', e.target.value)} />
          </div>
          <div>
            <label className="label">Классы (через запятую)</label>
            <input className="input" value={Array.isArray(f.grade_level) ? f.grade_level.join(', ') : f.grade_level || ''} onChange={(e) => set('grade_level', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Описание</label>
            <textarea className="input min-h-20" value={f.description || ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Требования</label>
            <textarea className="input min-h-20" value={f.requirements || ''} onChange={(e) => set('requirements', e.target.value)} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="btn-outline">Отмена</button>
          <button onClick={() => { if (f.title?.trim()) onSave(f) }} className="btn-primary"><Save size={16} /> Сохранить</button>
        </div>
      </div>
    </div>
  )
}

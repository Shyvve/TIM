'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Opportunity } from '@/types'

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)

  // Form state
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<Partial<Opportunity>>({})

  useEffect(() => {
    if (auth) fetchOpps()
  }, [auth])

  async function fetchOpps() {
    setLoading(true)
    const { data } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false })
    if (data) setOpps(data)
    setLoading(false)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === 'mentoria2025') setAuth(true)
    else alert('Неверный пароль')
  }

  function editOpp(opp: Opportunity) {
    setForm(opp)
    setIsEditing(true)
  }

  function newOpp() {
    setForm({
      category: 'Олимпиада',
      format: 'Онлайн',
      direction: 'Бизнес',
      grade_level: ['9', '10', '11', '12'],
      tags: [],
      required_skill_tags: []
    })
    setIsEditing(true)
  }

  async function saveOpp() {
    setLoading(true)
    
    // Convert comma strings to arrays for tags
    const dataToSave = { ...form }
    if (typeof dataToSave.tags === 'string') {
      dataToSave.tags = (dataToSave.tags as string).split(',').map(s => s.trim()).filter(Boolean)
    }
    if (typeof dataToSave.required_skill_tags === 'string') {
      dataToSave.required_skill_tags = (dataToSave.required_skill_tags as string).split(',').map(s => s.trim()).filter(Boolean)
    }
    if (typeof dataToSave.grade_level === 'string') {
      dataToSave.grade_level = (dataToSave.grade_level as string).split(',').map(s => s.trim()).filter(Boolean)
    }

    if (form.id) {
      await supabase.from('opportunities').update(dataToSave).eq('id', form.id)
    } else {
      await supabase.from('opportunities').insert(dataToSave)
    }
    
    setIsEditing(false)
    fetchOpps()
  }

  async function deleteOpp(id: string) {
    if (!confirm('Точно удалить?')) return
    setLoading(true)
    await supabase.from('opportunities').delete().eq('id', id)
    fetchOpps()
  }

  if (!auth) return (
    <div className="section container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <div className="card" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Админ-панель</h1>
        <form onSubmit={handleLogin}>
          <input
            className="input"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Войти</button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="section container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Управление контентом</h1>
        <button className="btn-primary" onClick={newOpp}>+ Добавить возможность</button>
      </div>

      {isEditing ? (
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>{form.id ? 'Редактировать' : 'Новая возможность'}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="label">Название</label>
              <input className="input" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="label">Ссылка (apply_url)</label>
              <input className="input" value={form.apply_url || ''} onChange={e => setForm({...form, apply_url: e.target.value})} />
            </div>
            <div>
              <label className="label">Категория</label>
              <select className="input" value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})}>
                <option>Олимпиада</option><option>Хакатон</option><option>Летняя школа</option><option>Стипендия</option><option>Программа</option>
              </select>
            </div>
            <div>
              <label className="label">Формат</label>
              <select className="input" value={form.format || ''} onChange={e => setForm({...form, format: e.target.value})}>
                <option>Онлайн</option><option>Офлайн</option><option>Гибрид</option>
              </select>
            </div>
            <div>
              <label className="label">Дедлайн</label>
              <input type="date" className="input" value={form.deadline || ''} onChange={e => setForm({...form, deadline: e.target.value})} />
            </div>
            <div>
              <label className="label">Направление</label>
              <select className="input" value={form.direction || ''} onChange={e => setForm({...form, direction: e.target.value})}>
                <option>Бизнес</option><option>STEM</option><option>Социальное влияние</option><option>Финансы</option><option>Программирование</option><option>Наука</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Описание</label>
              <textarea className="input" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Требования (requirements)</label>
              <textarea className="input" value={form.requirements || ''} onChange={e => setForm({...form, requirements: e.target.value})} />
            </div>
            <div>
              <label className="label">Классы (через запятую)</label>
              <input className="input" value={Array.isArray(form.grade_level) ? form.grade_level.join(', ') : form.grade_level || ''} onChange={e => setForm({...form, grade_level: e.target.value as any})} />
            </div>
            <div>
              <label className="label">Нужные навыки (связка с курсами, через запятую)</label>
              <input className="input" value={Array.isArray(form.required_skill_tags) ? form.required_skill_tags.join(', ') : form.required_skill_tags || ''} onChange={e => setForm({...form, required_skill_tags: e.target.value as any})} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => setIsEditing(false)}>Отмена</button>
            <button className="btn-primary" onClick={saveOpp} disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? <div style={{ color: 'var(--text-muted)' }}>Загрузка...</div> : opps.map(opp => (
            <div key={opp.id} className="card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-gray" style={{ fontSize: '10px' }}>{opp.category}</span>
                  <span className="badge badge-gray" style={{ fontSize: '10px' }}>{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Без дедлайна'}</span>
                </div>
                <div style={{ fontWeight: '600' }}>{opp.title}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary btn-sm" onClick={() => editOpp(opp)}>✎ Изменить</button>
                <button className="btn-secondary btn-sm" style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => deleteOpp(opp.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

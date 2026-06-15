'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Opportunity } from '@/types'
import { useApp } from '@/lib/context'
import OpportunityCard from '@/components/OpportunityCard'

const CATEGORIES = ['Все', 'Олимпиада', 'Хакатон', 'Летняя школа', 'Стипендия', 'Программа']
const FORMATS = ['Все', 'Онлайн', 'Офлайн', 'Гибрид']
const DIRECTIONS = ['Все', 'Бизнес', 'STEM', 'Социальное влияние', 'Финансы', 'Программирование', 'Наука']
const GRADES = ['Все', '9', '10', '11', '12']

export default function OpportunitiesPage() {
  const { t, user } = useApp()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filtered, setFiltered] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')
  const [format, setFormat] = useState('Все')
  const [direction, setDirection] = useState('Все')
  const [grade, setGrade] = useState('Все')

  useEffect(() => {
    fetchOpportunities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [opportunities, search, category, format, direction, grade])

  async function fetchOpportunities() {
    setLoading(true)
    const { data } = await supabase.from('opportunities').select('*').order('deadline', { ascending: true })
    setOpportunities(data || [])
    setLoading(false)
  }

  function applyFilters() {
    let result = [...opportunities]
    if (search) result = result.filter(o =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.description?.toLowerCase().includes(search.toLowerCase())
    )
    if (category !== 'Все') result = result.filter(o => o.category === category)
    if (format !== 'Все') result = result.filter(o => o.format === format)
    if (direction !== 'Все') result = result.filter(o => o.direction === direction)
    if (grade !== 'Все') result = result.filter(o => o.grade_level?.includes(grade))
    setFiltered(result)
  }

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '12px' }}>🎯 Каталог</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '800', marginBottom: '12px' }}>
            {t('opp.title')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px' }}>
            {t('opp.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="input"
              style={{ paddingLeft: '42px' }}
              placeholder={t('opp.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select className="input" style={{ flex: '1', minWidth: '140px' }} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="input" style={{ flex: '1', minWidth: '140px' }} value={format} onChange={e => setFormat(e.target.value)}>
              {FORMATS.map(f => <option key={f}>{f}</option>)}
            </select>
            <select className="input" style={{ flex: '1', minWidth: '160px' }} value={direction} onChange={e => setDirection(e.target.value)}>
              {DIRECTIONS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="input" style={{ flex: '1', minWidth: '100px' }} value={grade} onChange={e => setGrade(e.target.value)}>
              {GRADES.map(g => <option key={g}>{g === 'Все' ? 'Все классы' : `${g} класс`}</option>)}
            </select>
            {(search || category !== 'Все' || format !== 'Все' || direction !== 'Все' || grade !== 'Все') && (
              <button className="btn-ghost" onClick={() => { setSearch(''); setCategory('Все'); setFormat('Все'); setDirection('Все'); setGrade('Все') }}>
                ✕ Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Count */}
        <div style={{ marginBottom: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
          {loading ? '...' : `Найдено: ${filtered.length}`}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-cards">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '16px' }}/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{t('common.empty')}</h3>
            <p style={{ fontSize: '14px' }}>Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <div className="grid-cards">
            {filtered.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

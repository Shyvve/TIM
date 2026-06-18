'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Opportunity } from '@/types'
import { useApp } from '@/lib/context'
import OpportunityCard from '@/components/OpportunityCard'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { DIRECTIONS, CATEGORIES, FORMATS, GRADES } from '@/lib/format'

const SORTS = [
  { id: 'deadline', label: 'По дедлайну' },
  { id: 'title', label: 'По названию' },
]

function FilterGroup({ label, value, onChange, options, tAll, suffix = '' }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; tAll: string; suffix?: string
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => onChange('')} className={value === '' ? 'chip-on' : 'chip'}>{tAll}</button>
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)} className={value === o ? 'chip-on' : 'chip'}>
            {o}{suffix}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function OpportunitiesPage() {
  const { t, user } = useApp()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [dir, setDir] = useState('')
  const [category, setCategory] = useState('')
  const [format, setFormat] = useState('')
  const [grade, setGrade] = useState('')
  const [sort, setSort] = useState('deadline')
  const [showFilters, setShowFilters] = useState(false)
  const [profileApplied, setProfileApplied] = useState(false)

  useEffect(() => {
    fetchOpportunities()
  }, [])

  useEffect(() => {
    if (user && !profileApplied) {
      if (user.grade) setGrade(user.grade)
      if (user.interests?.length) {
        const match = DIRECTIONS.find(d => user.interests.includes(d))
        if (match) setDir(match)
      }
      setProfileApplied(true)
    }
  }, [user, profileApplied])

  async function fetchOpportunities() {
    setLoading(true)
    const { data } = await supabase.from('opportunities').select('*').order('deadline', { ascending: true })
    setOpportunities(data || [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    let list = opportunities.filter((o) => {
      if (dir && o.direction !== dir) return false
      if (category && o.category !== category) return false
      if (format && o.format !== format) return false
      if (grade && !o.grade_level?.includes(grade)) return false
      if (q) {
        const hay = `${o.title} ${o.description} ${o.direction}`.toLowerCase()
        if (!hay.includes(q.toLowerCase())) return false
      }
      return true
    })
    list = [...list].sort((a, b) =>
      sort === 'title' ? a.title.localeCompare(b.title) : new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )
    return list
  }, [opportunities, dir, category, format, grade, q, sort])

  const activeFilters = [dir, category, format, grade].filter(Boolean).length
  const clear = () => { setDir(''); setCategory(''); setFormat(''); setGrade(''); setQ('') }

  return (
    <div className="section py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-ink">{t('opp.title')}</h1>
        <p className="mt-1 text-ink-soft">{t('opp.subtitle')}</p>
      </div>

      {/* Search + filter toggle */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input !pl-10" placeholder={t('opp.search')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <button onClick={() => setShowFilters((v) => !v)} className="btn-outline">
          <SlidersHorizontal size={16} /> Фильтры
          {activeFilters > 0 && <span className="ml-1 rounded-full bg-brand px-1.5 text-xs text-white">{activeFilters}</span>}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card mb-6 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <FilterGroup label={t('opp.filter.direction')} value={dir} onChange={setDir} options={DIRECTIONS} tAll={t('opp.filter.all')} />
          <FilterGroup label={t('opp.filter.category')} value={category} onChange={setCategory} options={CATEGORIES} tAll={t('opp.filter.all')} />
          <FilterGroup label={t('opp.filter.format')} value={format} onChange={setFormat} options={FORMATS} tAll={t('opp.filter.all')} />
          <FilterGroup label={t('opp.grade')} value={grade} onChange={setGrade} options={GRADES} tAll={t('opp.filter.all')} suffix=" кл." />
          {activeFilters > 0 && (
            <button onClick={clear} className="btn-ghost justify-self-start text-sm"><X size={14} /> Сбросить</button>
          )}
        </div>
      )}

      <p className="mb-4 text-sm text-muted">Найдено: {loading ? '...' : filtered.length}</p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ height: '280px' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <Search className="text-muted" size={32} />
          <p className="font-semibold text-ink">{t('common.empty')}</p>
          <p className="max-w-sm text-sm text-muted">Попробуй убрать часть фильтров или изменить запрос.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  )
}

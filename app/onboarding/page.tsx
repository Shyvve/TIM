'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/lib/context'

const GRADES = ['9', '10', '11', '12']
const INTERESTS = ['Программирование', 'Бизнес', 'Математика', 'Английский', 'Робототехника', 'Биология', 'Медицина', 'Дизайн', 'Волонтерство']

export default function OnboardingPage() {
  const { t, user, setUser, sessionId } = useApp()
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  const [grade, setGrade] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [goal, setGoal] = useState('')
  const [saving, setSaving] = useState(false)

  const toggleInterest = (i: string) => {
    if (interests.includes(i)) setInterests(interests.filter(x => x !== i))
    else setInterests([...interests, i])
  }

  async function handleFinish() {
    setSaving(true)
    let finalUser = user

    if (!user) {
      // Create new user based on session ID
      const { data } = await supabase.from('users').insert({
        session_id: sessionId,
        grade,
        interests,
        goal,
        onboarding_done: true
      }).select().single()
      if (data) {
        setUser(data)
        finalUser = data
      }
    } else {
      // Update existing user
      const { data } = await supabase.from('users').update({
        grade,
        interests,
        goal,
        onboarding_done: true
      }).eq('id', user.id).select().single()
      if (data) {
        setUser(data)
        finalUser = data
      }
    }
    
    setSaving(false)
    router.push('/dashboard')
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px', width: '100%' }}>
        
        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: s <= step ? 'var(--accent)' : 'var(--border)'
            }}/>
          ))}
        </div>

        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          {step === 1 && (
            <div className="animate-fade-in">
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👋</span>
              <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>{t('onboard.title')}</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{t('onboard.subtitle')}</p>
              
              <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                <label className="label">{t('onboard.grade')}</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {GRADES.map(g => (
                    <button
                      key={g}
                      onClick={() => setGrade(g)}
                      style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '12px',
                        background: grade === g ? 'rgba(108,99,255,0.15)' : 'var(--bg-secondary)',
                        border: `1px solid ${grade === g ? 'var(--accent)' : 'var(--border)'}`,
                        color: grade === g ? 'var(--accent-light)' : 'var(--text-primary)',
                        fontSize: '18px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {g} класс
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={!grade} onClick={() => setStep(2)}>
                {t('onboard.next')} →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🎯</span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>{t('onboard.interests')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Выбери то, что тебе нравится. Мы подберём релевантные хакатоны и олимпиады.</p>
              
              <div className="checkbox-grid" style={{ justifyContent: 'center', marginBottom: '32px' }}>
                {INTERESTS.map(i => (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={`checkbox-chip ${interests.includes(i) ? 'selected' : ''}`}
                  >
                    {interests.includes(i) ? '✓ ' : '+ '}{i}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setStep(1)}>←</button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={interests.length === 0} onClick={() => setStep(3)}>
                  {t('onboard.next')} →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🚀</span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>{t('onboard.goal')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Ради чего ты ищешь возможности? Какая у тебя мечта?</p>
              
              <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                <textarea
                  className="input"
                  style={{ minHeight: '120px' }}
                  placeholder={t('onboard.goal.placeholder')}
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setStep(2)}>←</button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={!goal || saving} onClick={handleFinish}>
                  {saving ? 'Сохранение...' : t('onboard.finish')}
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}

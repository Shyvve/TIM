'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language } from '@/types'
import { t } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'

interface AppContextType {
  lang: Language
  setLang: (l: Language) => void
  t: (key: string) => string
  sessionId: string
  user: User | null
  setUser: (u: User | null) => void
  savedIds: Set<string>
  setSavedIds: (ids: Set<string>) => void
  refreshSaved: () => void
  logout: () => void
  authLoading: boolean
}

const AppContext = createContext<AppContextType | null>(null)

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('ru')
  const [sessionId, setSessionId] = useState<string>('')
  const [user, setUser] = useState<User | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let sid = localStorage.getItem('mentoria_session_id')
    if (!sid) {
      sid = generateSessionId()
      localStorage.setItem('mentoria_session_id', sid)
    }
    setSessionId(sid)

    const savedLang = localStorage.getItem('mentoria_lang') as Language
    if (savedLang) setLangState(savedLang)

    initAuth(sid)
  }, [])

  async function initAuth(sid: string) {
    setAuthLoading(true)

    // Check localStorage for saved auth
    try {
      const saved = localStorage.getItem('mentoria_auth')
      if (saved) {
        const authData = JSON.parse(saved)
        if (authData.id) {
          const { data: profile } = await supabase.from('users').select('*').eq('id', authData.id).maybeSingle()
          if (profile) {
            setUser(profile)
            if (profile.language) setLangState(profile.language)
            setAuthLoading(false)
            return
          }
        }
      }
    } catch {}

    // Fallback: load by session_id
    const { data } = await supabase.from('users').select('*').eq('session_id', sid).maybeSingle()
    if (data) {
      setUser(data)
      if (data.language) setLangState(data.language)
    }
    setAuthLoading(false)
  }

  async function refreshSaved() {
    if (!user) return
    const { data } = await supabase
      .from('saved_items')
      .select('opportunity_id')
      .eq('user_id', user.id)
    if (data) setSavedIds(new Set(data.map((d: any) => d.opportunity_id)))
  }

  useEffect(() => {
    if (user) refreshSaved()
  }, [user])

  function setLang(l: Language) {
    setLangState(l)
    localStorage.setItem('mentoria_lang', l)
    if (user) supabase.from('users').update({ language: l }).eq('id', user.id)
  }

  async function logout() {
    localStorage.removeItem('mentoria_auth')
    setUser(null)
    setSavedIds(new Set())
  }

  const translate = (key: string) => t(key, lang)

  return (
    <AppContext.Provider value={{
      lang, setLang, t: translate,
      sessionId, user, setUser,
      savedIds, setSavedIds, refreshSaved,
      logout, authLoading
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

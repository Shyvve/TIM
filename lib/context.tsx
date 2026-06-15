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

  useEffect(() => {
    // Initialize session
    let sid = localStorage.getItem('mentoria_session_id')
    if (!sid) {
      sid = generateSessionId()
      localStorage.setItem('mentoria_session_id', sid)
    }
    setSessionId(sid)

    // Load language preference
    const savedLang = localStorage.getItem('mentoria_lang') as Language
    if (savedLang) setLangState(savedLang)

    // Load user from DB
    loadUser(sid)
  }, [])

  async function loadUser(sid: string) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('session_id', sid)
      .single()
    if (data) {
      setUser(data)
      if (data.language) setLangState(data.language)
    }
  }

  async function refreshSaved() {
    if (!user) return
    const { data } = await supabase
      .from('saved_items')
      .select('opportunity_id')
      .eq('user_id', user.id)
    if (data) {
      setSavedIds(new Set(data.map((d: any) => d.opportunity_id)))
    }
  }

  useEffect(() => {
    if (user) refreshSaved()
  }, [user])

  function setLang(l: Language) {
    setLangState(l)
    localStorage.setItem('mentoria_lang', l)
    if (user) {
      supabase.from('users').update({ language: l }).eq('id', user.id)
    }
  }

  const translate = (key: string) => t(key, lang)

  return (
    <AppContext.Provider value={{
      lang, setLang, t: translate,
      sessionId, user, setUser,
      savedIds, setSavedIds, refreshSaved
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

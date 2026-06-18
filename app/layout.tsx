import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/context'
import Navbar from '@/components/Navbar'
import Assistant from '@/components/Assistant'

export const metadata: Metadata = {
  title: 'Mentoria Hub — от сохранил до сделал',
  description: 'Mentoria Hub ведёт школьника от "нашёл возможность" до "подал заявку" и даёт курсы, которые нужны чтобы пройти. Олимпиады, хакатоны, стипендии и летние школы для учеников 9–12 класса.',
  keywords: ['стипендии', 'олимпиады', 'хакатон', 'летняя школа', 'школьники', 'mentoria', 'казахстан'],
  openGraph: {
    title: 'Mentoria Hub — от сохранил до сделал',
    description: 'Платформа, которая доводит от "интересно" до "подал заявку"',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>
          <div className="min-h-screen">
            <Navbar />
            <main className="fadeup pb-20">
              {children}
            </main>
            <footer className="border-t border-line bg-surface">
              <div className="section flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
                <span className="text-lg font-extrabold tracking-tight text-ink">
                  Mentoria<span className="text-brand"> Hub</span>
                </span>
                <p className="text-center text-sm text-muted">
                  MVP для хакатона Mentoria · образовательные возможности + асинхронное обучение
                </p>
                <p className="text-xs text-muted">© 2026 Mentoria Hub</p>
              </div>
            </footer>
          </div>
          <Assistant />
        </AppProvider>
      </body>
    </html>
  )
}

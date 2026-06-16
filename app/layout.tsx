import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/context'
import Navbar from '@/components/Navbar'

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
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="noise-bg"></div>
        <AppProvider>
          <Navbar />
          <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
            {children}
          </main>
          <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '32px 0',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}>
            <div className="container">
              <p>© 2025 Mentoria Hub — <span className="gradient-text" style={{fontWeight:600}}>от сохранил до сделал</span></p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>Сделано для хакатона Mentoria Organization</p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  )
}

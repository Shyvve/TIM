'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function VerifyPage() {
  return (
    <div className="section flex min-h-[calc(100vh-48px)] items-center justify-center py-10">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-brand/10 text-brand">
          <Mail size={32} />
        </div>
        <h1 className="text-2xl font-extrabold text-ink">Проверь почту!</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Мы отправили письмо с кодом подтверждения. Перейди по ссылке в письме чтобы активировать аккаунт.
        </p>
        <p className="mt-4 text-xs text-muted">
          Не пришло? Проверь папку «Спам» или подожди пару минут.
        </p>
        <Link href="/auth/login" className="btn-primary mt-6 inline-flex">
          Перейти ко входу
        </Link>
      </div>
    </div>
  )
}

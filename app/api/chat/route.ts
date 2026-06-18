import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API ключ не настроен. Добавьте OPENAI_API_KEY в .env.local' },
      { status: 500 }
    )
  }

  const { messages, systemPrompt } = await req.json()

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10),
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json(
      { error: err.error?.message || 'Ошибка OpenAI API' },
      { status: res.status }
    )
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content || 'Не удалось получить ответ.'

  return NextResponse.json({ content })
}

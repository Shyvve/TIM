const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

export function fmtDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function daysLeft(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export const DIRECTION_COLORS: Record<string, string> = {
  STEM: '#4f46e5',
  'Программирование': '#0ea5e9',
  'Бизнес': '#f59e0b',
  'Финансы': '#16a34a',
  'Наука': '#8b5cf6',
  'Социальное влияние': '#ec4899',
}

export function dirColor(direction: string) {
  return DIRECTION_COLORS[direction] || '#4f46e5'
}

export const DIRECTIONS = ['STEM', 'Программирование', 'Бизнес', 'Финансы', 'Наука', 'Социальное влияние']
export const FORMATS = ['Онлайн', 'Офлайн', 'Гибрид']
export const CATEGORIES = ['Олимпиада', 'Хакатон', 'Стипендия', 'Стажировка', 'Летняя школа', 'Конкурс', 'Волонтёрство', 'Исследование']
export const GRADES = ['9', '10', '11', '12']

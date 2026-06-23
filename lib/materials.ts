// Скачиваемые PDF/DOCX материалы. Файлы лежат в public/materials/.
// Используется и в Базе знаний (/knowledge), и на странице курса (/courses/[id]).

export interface Material {
  name: string
  file: string // путь под /materials/
  desc: string
  size: string
  format: 'PDF' | 'DOCX'
  // ключи разделов Базы знаний, где показывать материал
  sections: ('ielts' | 'essays')[]
  // skill_tag курса, к которому относится материал (для /courses/[id])
  courseTag: 'ielts' | 'эссе' | null
}

export const MATERIALS: Material[] = [
  // ── IELTS / English ──────────────────────────────────────────────
  {
    name: "Barron's Essential Words for IELTS",
    file: 'barrons-essential-words-ielts.pdf',
    desc: '600 ключевых слов для IELTS с упражнениями и контекстом',
    size: '55 МБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'English Grammar in Use — R. Murphy (5-е изд.)',
    file: 'english-grammar-in-use-murphy.pdf',
    desc: 'Классический учебник грамматики с упражнениями (intermediate)',
    size: '18 МБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: '1000 English Collocations in 10 Minutes a Day',
    file: '1000-english-collocations.pdf',
    desc: 'Естественные сочетания слов для живой и точной речи',
    size: '1.4 МБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'IELTS Speaking — темы JAN–APR 2026',
    file: 'ielts-speaking-jan-apr-2026.pdf',
    desc: 'Актуальные cue cards и вопросы Speaking на январь–апрель 2026',
    size: '4.4 МБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'IELTS Speaking — темы MAY–AUG 2026',
    file: 'ielts-speaking-may-aug-2026.pdf',
    desc: 'Актуальные cue cards и вопросы Speaking на май–август 2026',
    size: '5.1 МБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'IELTS Band 9 Vocabulary Secrets',
    file: 'ielts-band9-vocab-secrets.pdf',
    desc: 'Лексика и связки для ответов на 9.0',
    size: '884 КБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'IELTS Reading Vocabulary (300–500 слов)',
    file: 'ielts-reading-300-500-words.pdf',
    desc: 'Частотная лексика Reading по Cambridge 10–20',
    size: '20 КБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'A Resource for Reading & Words',
    file: 'resource-for-reading-and-words.pdf',
    desc: 'Тексты и словарь для прокачки Reading',
    size: '928 КБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'IELTS Reading — практика',
    file: 'ielts-reading-practice.pdf',
    desc: 'Подборка тренировочных Reading-заданий',
    size: '44 КБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'IELTS Writing Task 1 — практика',
    file: 'ielts-writing-task1-practice.docx',
    desc: 'Шаблоны-заготовки для отработки Writing Task 1 (150+ слов)',
    size: '4.7 МБ', format: 'DOCX', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'Vocabulary: Thinking',
    file: 'vocabulary-thinking.pdf',
    desc: 'Лексика по теме «мышление и идеи» для Speaking/Writing',
    size: '5.8 МБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'Topic Vocabulary: AI & Technology',
    file: 'vocab-ai-technology.pdf',
    desc: 'Лексика и идеи для темы «искусственный интеллект и технологии»',
    size: '108 КБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'Topic Vocabulary: Technology',
    file: 'vocab-technology.pdf',
    desc: 'Лексика для темы «технологии» (Speaking Part 3)',
    size: '88 КБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'Topic Vocabulary: Food & Crops',
    file: 'vocab-food-crops.pdf',
    desc: 'Лексика и идиомы для темы «еда и сельское хозяйство»',
    size: '68 КБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },
  {
    name: 'Topic Vocabulary: Food & Marketing',
    file: 'food-x-marketing.pdf',
    desc: 'Лексика и идеи для темы «еда и маркетинг» (нейромаркетинг)',
    size: '308 КБ', format: 'PDF', sections: ['ielts'], courseTag: 'ielts',
  },

  // ── College Essays / Personal Statement ──────────────────────────
  {
    name: '150 Successful Harvard Application Essays',
    file: '150-successful-harvard-essays.pdf',
    desc: 'Сборник реальных эссе поступивших в Harvard — для разбора техники',
    size: '792 КБ', format: 'PDF', sections: ['essays'], courseTag: 'эссе',
  },
  {
    name: '50 Successful Ivy League Application Essays',
    file: '50-successful-ivy-league-essays.pdf',
    desc: 'Эссе поступивших в Ivy League с комментариями',
    size: '6.6 МБ', format: 'PDF', sections: ['essays'], courseTag: 'эссе',
  },
  {
    name: 'Free Guide to the Personal Statement (2024)',
    file: 'free-guide-personal-statement-2024.pdf',
    desc: 'Пошаговый гайд по написанию Personal Statement',
    size: '480 КБ', format: 'PDF', sections: ['essays'], courseTag: 'эссе',
  },
  {
    name: 'Personal Statement Mind Map',
    file: 'personal-statement-mind-map.pdf',
    desc: 'Карта идей для брейншторма Personal Statement',
    size: '2.6 МБ', format: 'PDF', sections: ['essays'], courseTag: 'эссе',
  },
  {
    name: 'UCAS Personal Statement Worksheet',
    file: 'ucas-personal-statement-worksheet.pdf',
    desc: 'Рабочий лист для британской заявки UCAS',
    size: '228 КБ', format: 'PDF', sections: ['essays'], courseTag: 'эссе',
  },
]

export function materialsForSection(sectionId: string): Material[] {
  return MATERIALS.filter((m) => m.sections.includes(sectionId as 'ielts' | 'essays'))
}

export function materialsForCourse(skillTags: string[] = []): Material[] {
  return MATERIALS.filter((m) => m.courseTag != null && skillTags.includes(m.courseTag))
}

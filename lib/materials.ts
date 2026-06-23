// Скачиваемые PDF/DOCX материалы. Файлы лежат в public/materials/.
// Используется и в Базе знаний (/knowledge), и на странице курса (/courses/[id]).
// Тяжёлые полные книги и сборники тестов не хранятся в репозитории —
// на них ведёт ссылка на Google Drive (DRIVE_FOLDER).

export type SectionId = 'ielts' | 'sat' | 'essays'

export interface Material {
  name: string
  file: string // путь под /materials/
  desc: string
  size: string
  format: 'PDF' | 'DOCX'
  group: string // подкатегория для группировки в UI
  sections: SectionId[]
  courseTag: 'ielts' | 'sat' | 'эссе' | null // skill_tag курса (для /courses/[id])
}

// Полная подборка материалов (включая тяжёлые книги и полные тесты)
export const DRIVE_FOLDER =
  'https://drive.google.com/drive/folders/1VGr58xA4Dr3W3Wjc5Tbe6uB8i4HWFhG7?usp=sharing'

export const MATERIALS: Material[] = [
  // ════════════════ IELTS / English ════════════════
  // ── Vocabulary ──
  { name: "Barron's Essential Words for IELTS", file: 'barrons-essential-words-ielts.pdf', desc: '600 ключевых слов для IELTS с упражнениями и контекстом', size: '55 МБ', format: 'PDF', group: 'Vocabulary', sections: ['ielts'], courseTag: 'ielts' },
  { name: '1000 English Collocations in 10 Minutes a Day', file: '1000-english-collocations.pdf', desc: 'Естественные сочетания слов для живой и точной речи', size: '1.4 МБ', format: 'PDF', group: 'Vocabulary', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'IELTS Band 9 Vocabulary Secrets', file: 'ielts-band9-vocab-secrets.pdf', desc: 'Лексика и связки для ответов на 9.0', size: '884 КБ', format: 'PDF', group: 'Vocabulary', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'Vocabulary: Thinking', file: 'vocabulary-thinking.pdf', desc: 'Лексика по теме «мышление и идеи» для Speaking/Writing', size: '5.8 МБ', format: 'PDF', group: 'Vocabulary', sections: ['ielts'], courseTag: 'ielts' },

  // ── Grammar ──
  { name: 'English Grammar in Use — R. Murphy (5-е изд.)', file: 'english-grammar-in-use-murphy.pdf', desc: 'Классический учебник грамматики с упражнениями (intermediate)', size: '18 МБ', format: 'PDF', group: 'Grammar', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'IELTS Liz — Grammar Workbook', file: 'ielts-liz-grammar-workbook.pdf', desc: 'Рабочая тетрадь по грамматике для IELTS', size: '8 МБ', format: 'PDF', group: 'Grammar', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'IELTS Liz — Grammar Workbook (ответы)', file: 'ielts-liz-grammar-workbook-answers.pdf', desc: 'Ключи к рабочей тетради по грамматике', size: '6.8 МБ', format: 'PDF', group: 'Grammar', sections: ['ielts'], courseTag: 'ielts' },

  // ── Reading ──
  { name: 'IELTS Reading Vocabulary (300–500 слов)', file: 'ielts-reading-300-500-words.pdf', desc: 'Частотная лексика Reading по Cambridge 10–20', size: '20 КБ', format: 'PDF', group: 'Reading', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'A Resource for Reading & Words', file: 'resource-for-reading-and-words.pdf', desc: 'Тексты и словарь для прокачки Reading', size: '928 КБ', format: 'PDF', group: 'Reading', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'IELTS Reading — практика', file: 'ielts-reading-practice.pdf', desc: 'Подборка тренировочных Reading-заданий', size: '44 КБ', format: 'PDF', group: 'Reading', sections: ['ielts'], courseTag: 'ielts' },

  // ── Writing ──
  { name: 'IELTS Writing Task 2 — Band 9 (Ryan)', file: 'ielts-writing-task2-band9-ryan.pdf', desc: 'Как писать эссе Task 2 на уровень Band 9', size: '1.3 МБ', format: 'PDF', group: 'Writing', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'IELTS Writing Task 1 — Ultimate Guide', file: 'ielts-writing-task1-ultimate-guide.pdf', desc: 'Полный гайд по Task 1 с практикой', size: '2.8 МБ', format: 'PDF', group: 'Writing', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'Writing Task 1 — Vocabulary (Describing a Graph)', file: 'ielts-writing-task1-graph-vocab.pdf', desc: 'Лексика для описания графиков и диаграмм', size: '0.9 МБ', format: 'PDF', group: 'Writing', sections: ['ielts'], courseTag: 'ielts' },
  { name: '230 IELTS Writing Samples', file: 'ielts-230-writing-samples.pdf', desc: 'Сборник образцовых эссе Task 1 и Task 2', size: '3.8 МБ', format: 'PDF', group: 'Writing', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'IELTS Linking Words', file: 'ielts-linking-words.pdf', desc: 'Слова-связки и переходы для письменной речи', size: '120 КБ', format: 'PDF', group: 'Writing', sections: ['ielts'], courseTag: 'ielts' },
  { name: "Liz's Ideas for Essay Topics", file: 'ielts-liz-essay-ideas.pdf', desc: 'Идеи и аргументы по частым темам эссе', size: '6.9 МБ', format: 'PDF', group: 'Writing', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'IELTS Writing Task 1 — практика', file: 'ielts-writing-task1-practice.docx', desc: 'Шаблоны-заготовки для отработки Writing Task 1 (150+ слов)', size: '4.7 МБ', format: 'DOCX', group: 'Writing', sections: ['ielts'], courseTag: 'ielts' },

  // ── Speaking (темы и topic-лексика) ──
  { name: 'IELTS Speaking — темы JAN–APR 2026', file: 'ielts-speaking-jan-apr-2026.pdf', desc: 'Актуальные cue cards и вопросы Speaking на январь–апрель 2026', size: '4.4 МБ', format: 'PDF', group: 'Speaking', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'IELTS Speaking — темы MAY–AUG 2026', file: 'ielts-speaking-may-aug-2026.pdf', desc: 'Актуальные cue cards и вопросы Speaking на май–август 2026', size: '5.1 МБ', format: 'PDF', group: 'Speaking', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'Topic Vocabulary: AI & Technology', file: 'vocab-ai-technology.pdf', desc: 'Лексика и идеи для темы «искусственный интеллект и технологии»', size: '108 КБ', format: 'PDF', group: 'Speaking', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'Topic Vocabulary: Technology', file: 'vocab-technology.pdf', desc: 'Лексика для темы «технологии» (Speaking Part 3)', size: '88 КБ', format: 'PDF', group: 'Speaking', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'Topic Vocabulary: Food & Crops', file: 'vocab-food-crops.pdf', desc: 'Лексика и идиомы для темы «еда и сельское хозяйство»', size: '68 КБ', format: 'PDF', group: 'Speaking', sections: ['ielts'], courseTag: 'ielts' },
  { name: 'Topic Vocabulary: Food & Marketing', file: 'food-x-marketing.pdf', desc: 'Лексика и идеи для темы «еда и маркетинг» (нейромаркетинг)', size: '308 КБ', format: 'PDF', group: 'Speaking', sections: ['ielts'], courseTag: 'ielts' },

  // ════════════════ SAT (Digital) ════════════════
  // ── Grammar ──
  { name: 'SAT Grammar Rules — Erica Meltzer', file: 'sat-grammar-rules-meltzer.pdf', desc: 'Полный свод грамматических правил SAT', size: '1.9 МБ', format: 'PDF', group: 'Grammar', sections: ['sat'], courseTag: 'sat' },
  { name: 'SAT Grammar Workbook — Meltzer (4-е изд.)', file: 'sat-grammar-workbook-meltzer.pdf', desc: 'Рабочая тетрадь по грамматике SAT', size: '5.3 МБ', format: 'PDF', group: 'Grammar', sections: ['sat'], courseTag: 'sat' },
  { name: 'Erica — Grammar for Digital SAT', file: 'sat-grammar-digital-erica.pdf', desc: 'Грамматика под формат цифрового SAT', size: '23 МБ', format: 'PDF', group: 'Grammar', sections: ['sat'], courseTag: 'sat' },

  // ── Math ──
  { name: 'The College Panda — SAT Math', file: 'sat-math-college-panda.pdf', desc: 'Лучший разбор математики SAT + задачи', size: '12 МБ', format: 'PDF', group: 'Math', sections: ['sat'], courseTag: 'sat' },
  { name: 'SAT Math — Facts & Formulas', file: 'sat-math-facts-and-formulas.pdf', desc: 'Шпаргалка ключевых формул и фактов', size: '0.1 МБ', format: 'PDF', group: 'Math', sections: ['sat'], courseTag: 'sat' },

  // ── Reading & Vocabulary ──
  { name: '6 Ways to Score Above 700 (Reading)', file: 'sat-reading-6-ways-700.pdf', desc: 'Стратегии для секции Reading на 700+', size: '0.1 МБ', format: 'PDF', group: 'Reading & Vocabulary', sections: ['sat'], courseTag: 'sat' },
  { name: 'Most Common SAT Roots', file: 'sat-most-common-roots.pdf', desc: 'Частотные корни слов для словарного запаса', size: '0.1 МБ', format: 'PDF', group: 'Reading & Vocabulary', sections: ['sat'], courseTag: 'sat' },
  { name: 'SAT Critical Reading — Meltzer (3-е изд.)', file: 'sat-critical-reading-meltzer.pdf', desc: 'Разбор Reading-секции по методике Меltzer', size: '11 МБ', format: 'PDF', group: 'Reading & Vocabulary', sections: ['sat'], courseTag: 'sat' },
  { name: 'SAT Reading Bible (23 техники)', file: 'sat-reading-bible.pdf', desc: 'Сборник техник для Reading', size: '16 МБ', format: 'PDF', group: 'Reading & Vocabulary', sections: ['sat'], courseTag: 'sat' },
  { name: 'SAT Vocabulary: A New Approach', file: 'sat-vocabulary-new-approach.pdf', desc: 'Лексика SAT (Meltzer & Krieger)', size: '7.2 МБ', format: 'PDF', group: 'Reading & Vocabulary', sections: ['sat'], courseTag: 'sat' },
  { name: 'SAT Suffixes — словарь', file: 'sat-suffixes.pdf', desc: 'Суффиксы для разбора незнакомых слов', size: '5.1 МБ', format: 'PDF', group: 'Reading & Vocabulary', sections: ['sat'], courseTag: 'sat' },

  // ── Practice tests ──
  { name: 'Digital SAT Prep 2025–2026', file: 'sat-digital-prep-2025-2026.pdf', desc: 'Актуальный prep-сборник под цифровой SAT', size: '20 МБ', format: 'PDF', group: 'Practice tests', sections: ['sat'], courseTag: 'sat' },
  { name: 'SAT Suite — официальный Question Bank', file: 'sat-official-question-bank.pdf', desc: 'Официальные вопросы College Board по всем темам', size: '5.3 МБ', format: 'PDF', group: 'Practice tests', sections: ['sat'], courseTag: 'sat' },
  { name: 'Digital SAT — Practice Test 1 (+ bubble sheet)', file: 'sat-practice-test-1.pdf', desc: 'Полный пробный тест с бланком ответов', size: '7.7 МБ', format: 'PDF', group: 'Practice tests', sections: ['sat'], courseTag: 'sat' },
  { name: 'Digital SAT — Practice Test 2 (+ bubble sheet)', file: 'sat-practice-test-2.pdf', desc: 'Полный пробный тест с бланком ответов', size: '8.2 МБ', format: 'PDF', group: 'Practice tests', sections: ['sat'], courseTag: 'sat' },

  // ════════════════ College Essays / Personal Statement ════════════════
  { name: '150 Successful Harvard Application Essays', file: '150-successful-harvard-essays.pdf', desc: 'Сборник реальных эссе поступивших в Harvard — для разбора техники', size: '792 КБ', format: 'PDF', group: 'Эссе и Personal Statement', sections: ['essays'], courseTag: 'эссе' },
  { name: '50 Successful Ivy League Application Essays', file: '50-successful-ivy-league-essays.pdf', desc: 'Эссе поступивших в Ivy League с комментариями', size: '6.6 МБ', format: 'PDF', group: 'Эссе и Personal Statement', sections: ['essays'], courseTag: 'эссе' },
  { name: 'Free Guide to the Personal Statement (2024)', file: 'free-guide-personal-statement-2024.pdf', desc: 'Пошаговый гайд по написанию Personal Statement', size: '480 КБ', format: 'PDF', group: 'Эссе и Personal Statement', sections: ['essays'], courseTag: 'эссе' },
  { name: 'Personal Statement Mind Map', file: 'personal-statement-mind-map.pdf', desc: 'Карта идей для брейншторма Personal Statement', size: '2.6 МБ', format: 'PDF', group: 'Эссе и Personal Statement', sections: ['essays'], courseTag: 'эссе' },
  { name: 'UCAS Personal Statement Worksheet', file: 'ucas-personal-statement-worksheet.pdf', desc: 'Рабочий лист для британской заявки UCAS', size: '228 КБ', format: 'PDF', group: 'Эссе и Personal Statement', sections: ['essays'], courseTag: 'эссе' },
]

export function materialsForSection(sectionId: string): Material[] {
  return MATERIALS.filter((m) => m.sections.includes(sectionId as SectionId))
}

export function materialsForCourse(skillTags: string[] = []): Material[] {
  return MATERIALS.filter((m) => m.courseTag != null && skillTags.includes(m.courseTag))
}

// Группировка с сохранением порядка появления групп
export function groupMaterials(items: Material[]): { group: string; items: Material[] }[] {
  const order: string[] = []
  const byGroup: Record<string, Material[]> = {}
  for (const m of items) {
    if (!byGroup[m.group]) { byGroup[m.group] = []; order.push(m.group) }
    byGroup[m.group].push(m)
  }
  return order.map((group) => ({ group, items: byGroup[group] }))
}

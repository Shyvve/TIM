export type Language = 'ru' | 'kz' | 'en'

type Translations = {
  [key: string]: { ru: string; kz: string; en: string }
}

export const translations: Translations = {
  // Nav
  'nav.opportunities': { ru: 'Возможности', kz: 'Мүмкіндіктер', en: 'Opportunities' },
  'nav.courses': { ru: 'Курсы', kz: 'Курстар', en: 'Courses' },
  'nav.dashboard': { ru: 'Кабинет', kz: 'Кабинет', en: 'Dashboard' },
  'nav.roadmap': { ru: 'Roadmap', kz: 'Roadmap', en: 'Roadmap' },
  'nav.admin': { ru: 'Админ', kz: 'Әкімші', en: 'Admin' },
  'nav.knowledge': { ru: 'База знаний', kz: 'Білім базасы', en: 'Knowledge Base' },
  'nav.essays': { ru: 'Эссе', kz: 'Эссе', en: 'Essays' },
  // Hero
  'hero.badge': { ru: 'Платформа для школьников ЦА', kz: 'ОА мектеп оқушыларына арналған платформа', en: 'Platform for Central Asian Students' },
  'hero.title1': { ru: 'Найти возможность', kz: 'Мүмкіндік табу', en: 'Finding opportunities' },
  'hero.title2': { ru: 'легко. Не бросить —', kz: 'оңай. Тастамау —', en: 'is easy. Not giving up —' },
  'hero.title3': { ru: 'вот задача.', kz: 'міне, міндет.', en: "that's the challenge." },
  'hero.subtitle': { ru: 'Mentoria Hub ведёт тебя от «интересно» до «подал заявку» и даёт курс, который нужен, чтобы пройти.', kz: 'Mentoria Hub сені «қызықты» деген сәттен «өтінімді жібердім» дегенге дейін апарады.', en: 'Mentoria Hub guides you from "interesting" to "applied" and provides the course you need to succeed.' },
  'hero.cta.opportunities': { ru: 'Найти возможности', kz: 'Мүмкіндіктерді табу', en: 'Find Opportunities' },
  'hero.cta.courses': { ru: 'Начать обучение', kz: 'Оқуды бастау', en: 'Start Learning' },
  'hero.cta.join': { ru: 'Присоединиться', kz: 'Қосылу', en: 'Join Now' },
  // Stats
  'stats.seeking': { ru: 'учеников активно ищут возможности', kz: 'оқушы белсенді мүмкіндік іздейді', en: 'of students actively seek opportunities' },
  'stats.abandoned': { ru: 'начатых заявок никогда не отправляются', kz: 'басталған өтінімдер ешқашан жіберілмейді', en: 'of started applications never submitted' },
  'stats.complete': { ru: 'больше заявок с трекингом статуса', kz: 'күй бақылауымен өтінімдер', en: 'more applications with status tracking' },
  // Opportunities
  'opp.title': { ru: 'Возможности', kz: 'Мүмкіндіктер', en: 'Opportunities' },
  'opp.subtitle': { ru: 'Олимпиады, хакатоны, стипендии и летние школы для школьников', kz: 'Мектеп оқушыларына арналған олимпиадалар, хакатондар, стипендиялар', en: 'Olympiads, hackathons, scholarships and summer schools for students' },
  'opp.save': { ru: 'Сохранить', kz: 'Сақтау', en: 'Save' },
  'opp.saved': { ru: 'Сохранено', kz: 'Сақталды', en: 'Saved' },
  'opp.apply': { ru: 'Подать заявку', kz: 'Өтінім беру', en: 'Apply Now' },
  'opp.deadline': { ru: 'Дедлайн', kz: 'Мерзімі', en: 'Deadline' },
  'opp.grade': { ru: 'Классы', kz: 'Сыныптар', en: 'Grades' },
  'opp.filter.all': { ru: 'Все', kz: 'Барлығы', en: 'All' },
  'opp.filter.category': { ru: 'Категория', kz: 'Санат', en: 'Category' },
  'opp.filter.format': { ru: 'Формат', kz: 'Формат', en: 'Format' },
  'opp.filter.direction': { ru: 'Направление', kz: 'Бағыт', en: 'Direction' },
  'opp.search': { ru: 'Поиск возможностей...', kz: 'Мүмкіндіктерді іздеу...', en: 'Search opportunities...' },
  'opp.readiness': { ru: 'Чтобы быть готовым — пройди:', kz: 'Дайын болу үшін — аяқта:', en: 'To be ready — complete:' },
  // Courses
  'courses.title': { ru: 'Курсы Mentoria', kz: 'Mentoria курстары', en: 'Mentoria Courses' },
  'courses.subtitle': { ru: 'Прокачай навыки, которые нужны для поступления', kz: 'Оқуға қажетті дағдыларды дамыт', en: 'Build skills you need for admission' },
  'courses.start': { ru: 'Начать курс', kz: 'Курсты бастау', en: 'Start Course' },
  'courses.continue': { ru: 'Продолжить', kz: 'Жалғастыру', en: 'Continue' },
  'courses.progress': { ru: 'Прогресс', kz: 'Прогресс', en: 'Progress' },
  'courses.lessons': { ru: 'уроков', kz: 'сабақ', en: 'lessons' },
  'courses.level': { ru: 'Уровень', kz: 'Деңгей', en: 'Level' },
  // Dashboard
  'dash.title': { ru: 'Личный кабинет', kz: 'Жеке кабинет', en: 'My Dashboard' },
  'dash.pipeline': { ru: 'Мои возможности', kz: 'Менің мүмкіндіктерім', en: 'My Opportunities' },
  'dash.interested': { ru: 'Интересно', kz: 'Қызықты', en: 'Interested' },
  'dash.preparing': { ru: 'Готовлюсь', kz: 'Дайындалуда', en: 'Preparing' },
  'dash.applied': { ru: 'Подал', kz: 'Жіберілді', en: 'Applied' },
  'dash.result': { ru: 'Результат', kz: 'Нәтиже', en: 'Result' },
  'dash.deadlines': { ru: 'Ближайшие дедлайны', kz: 'Жақындағы мерзімдер', en: 'Upcoming Deadlines' },
  'dash.recommended': { ru: 'Рекомендации', kz: 'Ұсыныстар', en: 'Recommendations' },
  'dash.my_courses': { ru: 'Мои курсы', kz: 'Менің курстарым', en: 'My Courses' },
  // Onboarding
  'onboard.title': { ru: 'Добро пожаловать в Mentoria Hub!', kz: 'Mentoria Hub-қа қош келдіңіз!', en: 'Welcome to Mentoria Hub!' },
  'onboard.subtitle': { ru: 'Расскажи о себе — мы подберём возможности и курсы именно для тебя', kz: 'Өзің туралы айт — біз саған сәйкес мүмкіндіктер таңдаймыз', en: 'Tell us about yourself — we\'ll match opportunities and courses for you' },
  'onboard.grade': { ru: 'В каком ты классе?', kz: 'Сен қай сыныпта оқисың?', en: 'What grade are you in?' },
  'onboard.interests': { ru: 'Что тебя интересует?', kz: 'Сені не қызықтырады?', en: 'What are you interested in?' },
  'onboard.goal': { ru: 'Твоя цель', kz: 'Сенің мақсатың', en: 'Your Goal' },
  'onboard.goal.placeholder': { ru: 'Например: поступить в NIS, выиграть олимпиаду...', kz: 'Мысалы: NIS-ке оқуға кіру, олимпиадада жеңу...', en: 'E.g.: get into NIS, win olympiad...' },
  'onboard.next': { ru: 'Далее', kz: 'Келесі', en: 'Next' },
  'onboard.finish': { ru: 'Начать', kz: 'Бастау', en: 'Get Started' },
  // Roadmap
  'roadmap.title': { ru: 'Roadmap по классам', kz: 'Сыныптар бойынша Roadmap', en: 'Grade-by-Grade Roadmap' },
  'roadmap.subtitle': { ru: 'Что делать в каждом классе, чтобы поступить в лучшие вузы', kz: 'Үздік университеттерге түсу үшін әр сыныпта не істеу керек', en: 'What to do in each grade to get into top universities' },
  // Common
  'common.loading': { ru: 'Загрузка...', kz: 'Жүктелуде...', en: 'Loading...' },
  'common.empty': { ru: 'Ничего не найдено', kz: 'Ештеңе табылмады', en: 'Nothing found' },
  'common.back': { ru: 'Назад', kz: 'Артқа', en: 'Back' },
  'common.save': { ru: 'Сохранить', kz: 'Сақтау', en: 'Save' },
  'common.cancel': { ru: 'Отмена', kz: 'Болдырмау', en: 'Cancel' },
  'common.edit': { ru: 'Редактировать', kz: 'Өңдеу', en: 'Edit' },
  'common.delete': { ru: 'Удалить', kz: 'Жою', en: 'Delete' },
  'common.add': { ru: 'Добавить', kz: 'Қосу', en: 'Add' },
  'common.online': { ru: 'Онлайн', kz: 'Онлайн', en: 'Online' },
  'common.offline': { ru: 'Офлайн', kz: 'Офлайн', en: 'Offline' },
  'common.hybrid': { ru: 'Гибрид', kz: 'Гибрид', en: 'Hybrid' },
}

export function t(key: string, lang: Language): string {
  const entry = translations[key]
  if (!entry) return key
  return entry[lang] || entry['ru'] || key
}

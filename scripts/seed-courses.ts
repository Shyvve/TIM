import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const courses = [
  {
    title: 'IELTS: подготовка к 7.0+',
    description: 'Полный курс подготовки к IELTS Academic. Стратегии по каждой секции, бесплатные ресурсы и mock-тесты. Цель — 7.0–7.5 overall для поступления в топ-вузы.',
    level: 'Средний',
    skill_tags: ['ielts', 'английский', 'тесты'],
    lessons: [
      {
        title: 'Обзор IELTS и стратегия подготовки',
        content: `IELTS Academic — один из двух главных тестов для поступления (наряду с TOEFL). Топ-вузы требуют 7.0–7.5 overall.\n\n**Структура:** Listening (40 мин) → Reading (60 мин) → Writing (60 мин) → Speaking (11–14 мин)\n\n**Бесплатные ресурсы для начала:**\n- [ielts.org — официальные примеры вопросов](https://ielts.org/take-a-test/preparation-resources/sample-test-questions)\n- [IELTS Ready (British Council) — mock-тесты](https://takeielts.britishcouncil.org)\n- [British Council — бесплатные пробники](https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests)\n- [IELTS Online Tests — большая база mock](https://ieltsonlinetests.com)\n\n**Лучшие YouTube-каналы:**\n- [IELTS Liz](https://www.youtube.com/user/ieltsliz) — экс-экзаменатор, все секции\n- [IELTS Simon](https://www.ielts-simon.com) — Writing T2, Speaking\n- [E2 IELTS](https://www.e2language.com) — все секции с mock`,
        video_placeholder: 'https://www.youtube.com/user/ieltsliz',
        order_num: 1,
        mini_test: [{ question: 'Какой балл IELTS обычно требуют топ-вузы?', options: ['5.5–6.0', '6.5–7.0', '7.0–7.5', '8.0+'], correct: 2 }],
      },
      {
        title: 'Reading & Listening: техники и ресурсы',
        content: `**Reading (60 мин, 40 вопросов):**\nСканирование → ключевые слова → точный ответ. Не читай весь текст!\n\n**Listening (40 мин, 40 вопросов):**\nПредугадывай ответы до записи. Пиши ответы карандашом.\n\n**Бесплатные материалы:**\n- [IELTS Buddy — пробники + калькулятор band](https://www.ieltsbuddy.com/ielts-practice-tests.html)\n- [BBC Learning English — улучшение Listening](https://www.youtube.com/@bbclearningenglish)\n- [British Council LearnEnglish — грамматика и лексика](https://learnenglish.britishcouncil.org)\n- [Oxford Online English — Speaking](https://www.youtube.com/@OxfordOnlineEnglish)\n\n**Книги (платные, но есть бесплатные альтернативы):**\n- Cambridge IELTS 19/18/17 — реальные тесты → бесплатная замена: [ielts.org Sample questions](https://ielts.org/take-a-test/preparation-resources/sample-test-questions)\n- Collins Reading/Listening — прокачка секций → бесплатная замена: [IELTS Liz](https://ieltsliz.com)`,
        video_placeholder: 'https://www.youtube.com/@bbclearningenglish',
        order_num: 2,
        mini_test: [{ question: 'Что лучше делать в Reading секции?', options: ['Читать весь текст подряд', 'Сканировать ключевые слова', 'Пропускать сложные вопросы', 'Начинать с конца'], correct: 1 }],
      },
      {
        title: 'Writing & Speaking: стратегии на 7+',
        content: `**Writing Task 1:** Описание графика/диаграммы. 150+ слов.\n**Writing Task 2:** Эссе-аргумент. 250+ слов. Это 2/3 оценки!\n\n**Speaking:** 3 части — intro → cue card (2 мин) → discussion.\n\n**Ключевые ресурсы:**\n- [IELTS Simon — модельные эссе Writing](https://www.ielts-simon.com) — лучший бесплатный ресурс по Writing\n- [IELTS Liz — стратегии на 7+](https://ieltsliz.com) — 300+ бесплатных страниц\n- [IELTS Advantage — Writing 7+](https://www.youtube.com/@Ieltsadvantage)\n- [Magoosh IELTS — бюджетный курс](https://magoosh.com/ielts)\n\n**Книги:**\n- Target Band 7 (Braverman) → бесплатно: [IELTS Liz](https://ieltsliz.com)\n- High Scoring Writing Model Answers → бесплатно: [IELTS Simon](https://www.ielts-simon.com)\n- Cambridge Grammar/Vocabulary for IELTS → бесплатно: [British Council](https://learnenglish.britishcouncil.org)`,
        video_placeholder: 'https://www.ielts-simon.com',
        order_num: 3,
        mini_test: [{ question: 'Какая часть Writing даёт больше баллов?', options: ['Task 1 (график)', 'Task 2 (эссе)', 'Обе одинаково', 'Зависит от экзаменатора'], correct: 1 }],
      },
    ],
  },
  {
    title: 'SAT Digital: от 1200 до 1500+',
    description: 'Подготовка к цифровому SAT. Официальные ресурсы, стратегии по Math и Reading & Writing. Всё бесплатно через Bluebook и Khan Academy.',
    level: 'Средний',
    skill_tags: ['sat', 'математика', 'тесты'],
    lessons: [
      {
        title: 'Digital SAT: формат и официальные ресурсы',
        content: `SAT теперь полностью цифровой и адаптивный (через приложение Bluebook).\n\n**Структура:** Reading & Writing (2 модуля по 32 мин) + Math (2 модуля по 35 мин) = ~2 часа 14 мин\n**Шкала:** 400–1600. Цели: 1400+ (топ-50), 1500+ (топ-20), 1550+ (Ivy League)\n\n**Официальные бесплатные ресурсы:**\n- [Bluebook — скачай приложение, полные адаптивные тесты](https://bluebook.collegeboard.org/students/download-bluebook)\n- [Khan Academy Digital SAT — уроки, видео, тысячи вопросов](https://www.khanacademy.org/digital-sat)\n- [Student Question Bank — тысячи вопросов с фильтрами](https://satsuite.collegeboard.org/practice/practice-tests/bluebook)\n- [SAT Suite — практика и стратегии](https://satsuite.collegeboard.org/practice)\n- [Schoolhouse.world — бесплатный peer-тьюторинг](https://schoolhouse.world)`,
        video_placeholder: 'https://www.youtube.com/@khanacademy',
        order_num: 1,
        mini_test: [{ question: 'Где скачать официальное приложение для SAT тестов?', options: ['Khan Academy', 'Bluebook (College Board)', 'Princeton Review', 'Kaplan'], correct: 1 }],
      },
      {
        title: 'SAT Math: стратегии и ресурсы',
        content: `**Math (200–800):** Алгебра, геометрия, статистика, advanced math. Калькулятор разрешён в обоих модулях.\n\n**Стратегия 700+:**\n1. Закрой базу через Khan Academy\n2. Отработай слабые темы в Student Question Bank\n3. Убери careless errors — проверяй каждый вопрос\n\n**Бесплатно:**\n- [Khan Academy Digital SAT (Math)](https://www.khanacademy.org/digital-sat) — основной ресурс\n- [UWorld College Prep — гайды и сравнения](https://collegeprep.uworld.com/sat/)\n\n**Книги (платные → бесплатные альтернативы):**\n- College Panda SAT Math (Nielson Phu) — лучший разбор → бесплатно: [Khan Academy](https://www.khanacademy.org/digital-sat)\n- PrepPros Complete Guide to SAT Math — для 800 → бесплатно: [Student Question Bank](https://satsuite.collegeboard.org/practice/practice-tests/bluebook)`,
        video_placeholder: 'https://www.khanacademy.org/digital-sat',
        order_num: 2,
        mini_test: [{ question: 'Разрешён ли калькулятор на Digital SAT Math?', options: ['Нет', 'Только в модуле 2', 'Да, в обоих модулях', 'Только графический'], correct: 2 }],
      },
      {
        title: 'SAT Reading & Writing: стратегии и книги',
        content: `**R&W (200–800):** Короткие пассажи + вопросы по грамматике, лексике, логике.\n\n**Стратегия:**\n1. Грамматика — выучи правила (это самые лёгкие баллы)\n2. Vocabulary in context — читай больше на английском\n3. Evidence-based questions — ищи доказательства в тексте\n\n**Книги (платные → бесплатные альтернативы):**\n- The Critical Reader (Erica Meltzer) — эталон по R&W → бесплатно: [Bluebook + Khan](https://bluebook.collegeboard.org/students/download-bluebook)\n- College Panda SAT Writing — грамматика → бесплатно: [Khan Academy](https://www.khanacademy.org/digital-sat)\n- SAT Prep Black Book (Mike Barrett) — тактика → бесплатно: [Bluebook](https://bluebook.collegeboard.org/students/download-bluebook)\n- Ultimate Guide to SAT Grammar (Meltzer) → бесплатно: [British Council Grammar](https://learnenglish.britishcouncil.org)\n\n**Видео:**\n- [Khan Academy SAT](https://www.youtube.com/@khanacademy)\n- [SAT Suite Practice](https://satsuite.collegeboard.org/practice)`,
        video_placeholder: 'https://www.youtube.com/@khanacademy',
        order_num: 3,
        mini_test: [{ question: 'Какой тип вопросов на SAT R&W даёт самые лёгкие баллы?', options: ['Vocabulary', 'Грамматика (правила)', 'Evidence-based', 'Tone/purpose'], correct: 1 }],
      },
    ],
  },
  {
    title: 'College Essays: от идеи до финала',
    description: 'Как написать Personal Statement, Why Us, Why Major и другие эссе для поступления. Примеры, гайды и пошаговый процесс.',
    level: 'Средний',
    skill_tags: ['эссе', 'поступление', 'writing'],
    lessons: [
      {
        title: 'Personal Statement: структура и примеры',
        content: `Personal Statement (Common App Essay) — главное эссе для поступления. 650 слов максимум.\n\n**Цель:** Показать КТО ты, а не ЧТО ты сделал. Голос, ценности, рефлексия.\n\n**4 типа эссе (по College Essay Guy):**\n1. Montage — серия моментов, объединённых темой\n2. Narrative — одна история с трансформацией\n3. Essence Object — предмет как метафора\n4. Problem-Solution — вызов и ответ\n\n**Бесплатные ресурсы:**\n- [College Essay Guy — главный хаб по эссе](https://www.collegeessayguy.com)\n- [CEG — Free Personal Statement Guide](https://www.collegeessayguy.com/get-the-free-guide-to-writing-the-personal-statement)\n- [CEG — 27 примеров эссе с разбором](https://www.collegeessayguy.com/blog/college-essay-examples)\n- [CEG — Personal Statement examples](https://www.collegeessayguy.com/blog/personal-statement-examples)\n- [Common App — 7 тем эссе](https://www.commonapp.org/apply/essay-prompts)\n\n⚠️ Примеры — для разбора техники, НЕ для копирования. Комиссии ловят клише и AI.`,
        video_placeholder: 'https://www.collegeessayguy.com',
        order_num: 1,
        mini_test: [{ question: 'Что главное показать в Personal Statement?', options: ['Список достижений', 'Кто ты как человек', 'Оценки и баллы', 'Рекомендации учителей'], correct: 1 }],
      },
      {
        title: 'Supplemental Essays: Why Us, Why Major, Diversity',
        content: `**Why Us (Why This College):**\nПокажи, что ты ИССЛЕДОВАЛ вуз. Конкретные профессора, программы, клубы.\n- [Гайд: Why This College Essay](https://www.collegeessayguy.com/blog/why-this-college-essay)\n\n**Why Major:**\nИнтерес (история) → Программа (конкретика) → Цели (будущее)\n- [Гайд: Why This Major Essay](https://www.collegeessayguy.com/blog/why-this-major-college-essay)\n\n**Diversity / Community:**\nТвой бэкграунд и что ты привнесёшь в кампус.\n- [Гайд: Diversity Essay](https://www.collegeessayguy.com/blog/diversity-essay)\n\n**Scholarship Essay:**\nФокус на impact и потребности. Конкретные цифры.\n- [Примеры Scholarship Essays](https://www.collegeessayguy.com/blog/scholarship-essay-examples)\n\n**Книги:**\n- College Essay Essentials (Ethan Sawyer) → бесплатно: [College Essay Guy](https://www.collegeessayguy.com)\n- On Writing the College Application Essay (Harry Bauld) — классика`,
        video_placeholder: 'https://www.collegeessayguy.com/blog/why-this-college-essay',
        order_num: 2,
        mini_test: [{ question: 'Что НЕЛЬЗЯ делать в Why Us эссе?', options: ['Упоминать конкретных профессоров', 'Писать общие фразы типа "престижный вуз"', 'Рассказывать о конкретных программах', 'Связывать вуз с карьерными целями'], correct: 1 }],
      },
    ],
  },
  {
    title: 'Research для школьников',
    description: 'Как начать исследование, написать paper, оформить цитирование и опубликоваться в проверенных журналах.',
    level: 'Продвинутый',
    skill_tags: ['research', 'публикации', 'наука'],
    lessons: [
      {
        title: 'Как написать research paper',
        content: `**Структура научной работы (IMRaD):**\nIntroduction → Methods → Results → Discussion\n\n**Инструменты:**\n- [Purdue OWL — структура paper, APA/MLA/Chicago](https://owl.purdue.edu)\n- [Google Scholar — поиск источников](https://scholar.google.com)\n- [Zotero — менеджер цитат (бесплатно)](https://www.zotero.org)\n- [Mendeley — менеджер ссылок](https://www.mendeley.com)\n- [Connected Papers — карта связанных статей](https://www.connectedpapers.com)\n\n**Стили цитирования:**\n- [APA — соц./естеств. науки](https://apastyle.apa.org)\n- [MLA — гуманитарные](https://style.mla.org)\n- [Chicago — история](https://www.chicagomanualofstyle.org)\n- [IEEE — инженерия/CS](https://ieeeauthorcenter.ieee.org)`,
        video_placeholder: 'https://owl.purdue.edu',
        order_num: 1,
        mini_test: [{ question: 'Что такое IMRaD?', options: ['Тип цитирования', 'Структура научной статьи', 'Журнал для школьников', 'Метод исследования'], correct: 1 }],
      },
      {
        title: 'Где публиковаться школьнику',
        content: `⚠️ Берегись predatory journals и pay-to-publish — комиссии их не ценят.\n\n**Проверенные журналы для школьников:**\n- [Journal of Emerging Investigators](https://emerginginvestigators.org) — STEM, peer-review для школьников\n- [The Concord Review](https://tcr.org) — история/гуманитарные эссе\n- [STEM Fellowship Journal](https://stemfellowship.org) — STEM\n- [National HS Journal of Science](https://nhsjs.com) — наука\n- [arXiv](https://arxiv.org) — препринты STEM (нужен ментор)\n\n**Научные соревнования:**\n- [Regeneron ISEF](https://www.societyforscience.org/isef/) — крупнейшая научная ярмарка\n- [Regeneron STS](https://www.societyforscience.org/regeneron-sts/) — престижный конкурс (США)\n- [Breakthrough Junior Challenge](https://breakthroughjuniorchallenge.org) — видео-объяснение науки`,
        video_placeholder: 'https://emerginginvestigators.org',
        order_num: 2,
        mini_test: [{ question: 'Какой журнал принимает STEM-работы школьников с peer-review?', options: ['arXiv', 'Journal of Emerging Investigators', 'Nature', 'IEEE'], correct: 1 }],
      },
    ],
  },
  {
    title: 'CV, LinkedIn и интервью',
    description: 'Как составить резюме, оформить LinkedIn и подготовиться к университетским и стипендиальным интервью. Метод STAR.',
    level: 'Начальный',
    skill_tags: ['cv', 'linkedin', 'интервью'],
    lessons: [
      {
        title: 'CV/Resume для школьника',
        content: `Для школьника CV = 1 страница. Action verbs + измеримый результат. Без фото/возраста для US.\n\n**Шаблоны и гайды:**\n- [Harvard — Resume & Cover Letter Guide](https://careerservices.fas.harvard.edu/resources/) — эталон\n- [MIT CAPD — Resumes](https://capd.mit.edu/resources/) — шаблоны и примеры\n- [Overleaf — LaTeX CV шаблоны](https://www.overleaf.com/gallery/tagged/cv) — для academic/research\n- [Europass CV](https://europa.eu/europass/en) — стандарт для Европы\n- [Novoresume](https://novoresume.com) — конструктор\n- [Canva Resume](https://www.canva.com/resumes/templates/) — простые шаблоны\n\n**Типы:**\n- Academic Resume — публикации, research, награды\n- Student Resume — учёба, активности, навыки\n- Internship Resume — проекты, навыки под роль`,
        video_placeholder: 'https://careerservices.fas.harvard.edu/resources/',
        order_num: 1,
        mini_test: [{ question: 'Сколько страниц должно быть в CV школьника?', options: ['2-3', '1', '4+', 'Не важно'], correct: 1 }],
      },
      {
        title: 'LinkedIn и Networking',
        content: `Для школьника LinkedIn = витрина проектов и нетворкинг с профессорами/рекрутерами.\n\n**Ресурсы:**\n- [LinkedIn — создание профиля](https://www.linkedin.com)\n- [LinkedIn Help — инструкции](https://www.linkedin.com/help/linkedin)\n- [LinkedIn Learning — курсы по карьере](https://www.linkedin.com/learning/)\n- [LinkedIn Jobs — стажировки](https://www.linkedin.com/jobs/)\n- [Handshake — стажировки для студентов](https://joinhandshake.com)\n\n**Чек-лист профиля:**\n- Headline: кто ты + цель (не просто "студент")\n- About: 2–3 абзаца — интересы, проекты, цель\n- Фото: чёткое, нейтральный фон\n- Networking: персональные сообщения, не спам`,
        video_placeholder: 'https://www.linkedin.com/learning/',
        order_num: 2,
        mini_test: [{ question: 'Что писать в Headline LinkedIn?', options: ['Просто "студент"', 'Кто ты + цель', 'Email', 'Ничего'], correct: 1 }],
      },
      {
        title: 'Подготовка к интервью (STAR)',
        content: `**Метод STAR:**\nSituation → Task → Action → Result\nГотовь 5-7 историй по этой схеме.\n\n**Типы интервью:**\n- University (alumni) — «Почему этот вуз? Расскажи о себе»\n- Scholarship — «Твои ценности, как используешь грант»\n- Internship — STAR: ситуация-задача-действие-результат\n\n**Ресурсы:**\n- [MindTools — STAR method](https://www.mindtools.com/a5xse7w/star-method) — лучший гайд\n- [Big Interview — тренажёр интервью](https://biginterview.com)\n- [LeetCode — технические интервью (CS)](https://leetcode.com)\n- [CollegeVine — университетские интервью](https://www.collegevine.com/blog)\n- [Glassdoor — реальные вопросы компаний](https://www.glassdoor.com)\n\n**Совет:** Репетируй вслух. Задавай встречные вопросы — это показывает интерес.`,
        video_placeholder: 'https://www.mindtools.com/a5xse7w/star-method',
        order_num: 3,
        mini_test: [{ question: 'Что означает буква A в методе STAR?', options: ['Analysis', 'Action', 'Achievement', 'Approach'], correct: 1 }],
      },
    ],
  },
  {
    title: 'Стипендии и Financial Aid',
    description: 'Полный гид по стипендиям: USA need-blind вузы, Европа, Азия. Как подавать на financial aid и что такое need-blind.',
    level: 'Начальный',
    skill_tags: ['стипендии', 'финансы', 'поступление'],
    lessons: [
      {
        title: 'Need-blind вузы США',
        content: `**Need-blind** = запрос финансовой помощи НЕ влияет на решение о приёме.\n\nНа 2026 год need-blind для иностранцев (~10 вузов):\n\n- [Harvard](https://college.harvard.edu/financial-aid) — 100% need\n- [MIT](https://sfs.mit.edu) — need-blind для иностранцев\n- [Princeton](https://www.princeton.edu/admission-aid) — гранты вместо кредитов\n- [Yale](https://finaid.yale.edu) — need-blind\n- [Amherst](https://www.amherst.edu/admission/financialaid) — need-blind\n- [Brown](https://www.brown.edu/admission/undergraduate/explore/affordability-financial-aid) — с Class of 2029\n- [Dartmouth](https://financialaid.dartmouth.edu) — need-blind\n- [Bowdoin](https://www.bowdoin.edu/aid/) — need-blind\n- [Notre Dame](https://financialaid.nd.edu) — с Class of 2029\n- Washington and Lee\n\nОстальные вузы — need-aware (запрос помощи МОЖЕТ влиять).\n\n- [#YouAreWelcomeHere Scholarship](https://www.youarewelcomeherescholarship.org) — стипендии в вузах-участниках`,
        video_placeholder: 'https://college.harvard.edu/financial-aid',
        order_num: 1,
        mini_test: [{ question: 'Что значит need-blind?', options: ['Стипендия за заслуги', 'Запрос помощи не влияет на приём', 'Бесплатное обучение', 'Только для граждан США'], correct: 1 }],
      },
      {
        title: 'Стипендии: Европа и Азия',
        content: `**Европа:**\n- [Chevening (UK)](https://www.chevening.org) — магистратура, полная стипендия\n- [Erasmus Mundus](https://erasmus-plus.ec.europa.eu) — магистратура, несколько стран\n- [DAAD (Германия)](https://www.daad.de/en/) — множество программ\n- [Stipendium Hungaricum](https://stipendiumhungaricum.hu) — бакалавр+, 100+ программ\n- [Holland Scholarship](https://www.studyinnl.org) — Нидерланды\n- [Türkiye Burslari](https://www.turkiyeburslari.gov.tr) — бакалавр+, 160+ вузов\n\n**Азия:**\n- [MEXT (Япония)](https://www.studyinjapan.go.jp) — полная стипендия\n- [GKS (Корея)](https://www.studyinkorea.go.kr) — полная стипендия + год языка\n- [CSC (Китай)](https://www.campuschina.org) — полная стипендия\n- [NUS/NTU (Сингапур)](https://www.nus.edu.sg) — стипендии\n- [KAIST (Корея)](https://www.kaist.ac.kr) — STEM стипендия\n\n⚠️ Chevening/Rhodes/Gates/Schwarzman — только магистратура, не бакалавриат.`,
        video_placeholder: 'https://www.chevening.org',
        order_num: 2,
        mini_test: [{ question: 'Какая стипендия в Турции покрывает бакалавриат полностью?', options: ['Chevening', 'DAAD', 'Türkiye Burslari', 'Erasmus Mundus'], correct: 2 }],
      },
    ],
  },
]

// Additional opportunities from knowledge_base_free.html
const extraOpportunities = [
  { title: 'IMO — Международная олимпиада по математике', category: 'Олимпиада', direction: 'STEM', format: 'Офлайн', deadline: '2027-03-01', description: 'Главная международная олимпиада по математике для школьников. Отбор через национальные этапы.', requirements: 'Национальный отбор, возраст до 19 лет.', apply_url: 'https://www.imo-official.org', grade_level: ['9','10','11','12'], tags: ['математика','олимпиада'], required_skill_tags: [] },
  { title: 'IPhO — Международная олимпиада по физике', category: 'Олимпиада', direction: 'STEM', format: 'Офлайн', deadline: '2027-03-01', description: 'Международная физическая олимпиада. Теоретические и экспериментальные задачи.', requirements: 'Национальный отбор.', apply_url: 'https://ipho-unofficial.org', grade_level: ['10','11','12'], tags: ['физика','олимпиада'], required_skill_tags: [] },
  { title: 'IChO — Международная олимпиада по химии', category: 'Олимпиада', direction: 'Наука', format: 'Офлайн', deadline: '2027-03-01', description: 'Международная олимпиада по химии.', requirements: 'Национальный отбор.', apply_url: 'https://www.ichosc.org', grade_level: ['10','11','12'], tags: ['химия','олимпиада'], required_skill_tags: [] },
  { title: 'IBO — Международная олимпиада по биологии', category: 'Олимпиада', direction: 'Наука', format: 'Офлайн', deadline: '2027-03-01', description: 'Международная олимпиада по биологии.', requirements: 'Национальный отбор.', apply_url: 'https://www.ibo-info.org', grade_level: ['10','11','12'], tags: ['биология','олимпиада'], required_skill_tags: [] },
  { title: 'IOL — Международная олимпиада по лингвистике', category: 'Олимпиада', direction: 'Социальное влияние', format: 'Офлайн', deadline: '2027-03-01', description: 'Олимпиада по лингвистике — логические задачи на незнакомых языках.', requirements: 'Национальный отбор.', apply_url: 'https://ioling.org', grade_level: ['9','10','11','12'], tags: ['лингвистика','логика'], required_skill_tags: [] },
  { title: 'Regeneron STS — Science Talent Search', category: 'Конкурс', direction: 'Наука', format: 'Онлайн', deadline: '2026-11-15', description: 'Престижнейший научный конкурс для школьников в США. Индивидуальный research проект.', requirements: 'Оригинальное исследование, school endorsement.', apply_url: 'https://www.societyforscience.org/regeneron-sts/', grade_level: ['11','12'], tags: ['research','наука','престиж'], required_skill_tags: [] },
  { title: 'Breakthrough Junior Challenge', category: 'Конкурс', direction: 'Наука', format: 'Онлайн', deadline: '2026-08-31', description: 'Создай видео-объяснение научной концепции. Приз: $250K стипендия + $50K учителю.', requirements: '13-18 лет, видео до 3 минут.', apply_url: 'https://breakthroughjuniorchallenge.org', grade_level: ['9','10','11','12'], tags: ['видео','наука','стипендия'], required_skill_tags: [] },
  { title: 'PROMYS — математика (Boston U.)', category: 'Летняя школа', direction: 'STEM', format: 'Офлайн', deadline: '2027-03-01', description: '6-недельная программа по продвинутой математике в Бостонском университете. Бесплатная.', requirements: 'Сильная мотивация к математике, отборочные задачи.', apply_url: 'https://promys.org', grade_level: ['10','11'], tags: ['математика','бесплатно'], required_skill_tags: [] },
  { title: 'Ross Mathematics Program', category: 'Летняя школа', direction: 'STEM', format: 'Офлайн', deadline: '2027-04-01', description: 'Интенсивная летняя программа по теории чисел. Бесплатная.', requirements: '15-18 лет, математические способности.', apply_url: 'https://rossprogram.org', grade_level: ['10','11'], tags: ['математика','теория чисел','бесплатно'], required_skill_tags: [] },
  { title: 'Pioneer Academics — Online Research', category: 'Летняя школа', direction: 'Наука', format: 'Онлайн', deadline: '2027-03-15', description: 'Онлайн-research программа с академическими кредитами. Индивидуальная работа с профессором.', requirements: '15-18 лет, мотивационное письмо.', apply_url: 'https://pioneeracademics.com', grade_level: ['10','11','12'], tags: ['research','онлайн','кредиты'], required_skill_tags: [] },
  { title: 'ISWEEEP / Genius Olympiad — экология', category: 'Конкурс', direction: 'Наука', format: 'Гибрид', deadline: '2027-02-01', description: 'Международный конкурс по экологии и устойчивому развитию для школьников.', requirements: 'Научный/инженерный проект.', apply_url: 'https://www.geniusolympiad.org', grade_level: ['9','10','11','12'], tags: ['экология','устойчивое развитие'], required_skill_tags: [] },
  { title: 'CSC — Chinese Government Scholarship', category: 'Стипендия', direction: 'STEM', format: 'Онлайн', deadline: '2027-03-01', description: 'Полная стипендия правительства Китая: обучение, проживание, стипендия. Все уровни.', requirements: 'Хорошие оценки, до 25 лет для бакалавриата.', apply_url: 'https://www.campuschina.org', grade_level: ['11','12'], tags: ['китай','полная стипендия'], required_skill_tags: [] },
  { title: 'Holland Scholarship — Нидерланды', category: 'Стипендия', direction: 'Наука', format: 'Онлайн', deadline: '2027-02-01', description: 'Стипендия €5000 для первого года обучения в голландских вузах. Бакалавр/магистр.', requirements: 'Не-EU студенты, мотивация.', apply_url: 'https://www.studyinnl.org', grade_level: ['11','12'], tags: ['нидерланды','европа'], required_skill_tags: [] },
]

async function main() {
  // 1. Delete old courses, lessons, course_progress
  console.log('Удаляем старые курсы...')
  await supabase.from('course_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // 2. Insert new courses
  for (const course of courses) {
    const { lessons, ...courseData } = course
    console.log(`  Курс: ${course.title}`)
    const { data: inserted, error } = await supabase.from('courses').insert(courseData).select().single()
    if (error) { console.error('  Ошибка курса:', error.message); continue }

    for (const lesson of lessons) {
      const { error: lessonErr } = await supabase.from('lessons').insert({
        course_id: inserted.id,
        title: lesson.title,
        content: lesson.content,
        video_placeholder: lesson.video_placeholder,
        mini_test: lesson.mini_test,
        order_num: lesson.order_num,
      })
      if (lessonErr) console.error('  Ошибка урока:', lessonErr.message)
    }
  }

  // 3. Add extra opportunities
  console.log(`\nДобавляем ${extraOpportunities.length} доп. возможностей...`)
  const { error: oppErr } = await supabase.from('opportunities').insert(extraOpportunities)
  if (oppErr) console.error('Ошибка возможностей:', oppErr.message)

  console.log('Готово!')
  process.exit(0)
}

main()

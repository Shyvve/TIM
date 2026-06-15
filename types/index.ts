export type OpportunityStatus = 'interested' | 'preparing' | 'applied' | 'result'
export type Language = 'ru' | 'kz' | 'en'

export interface Opportunity {
  id: string
  title: string
  category: string
  format: string
  deadline: string
  description: string
  requirements: string
  apply_url: string
  tags: string[]
  grade_level: string[]
  required_skill_tags: string[]
  direction: string
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  level: string
  skill_tags: string[]
  image_url: string
  created_at: string
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
  video_placeholder: string
  mini_test: MiniTestQuestion[]
  order_num: number
  created_at: string
}

export interface MiniTestQuestion {
  question: string
  options: string[]
  correct: number
}

export interface User {
  id: string
  session_id: string
  grade: string
  interests: string[]
  subjects: string[]
  goal: string
  language: Language
  onboarding_done: boolean
  created_at: string
}

export interface SavedItem {
  id: string
  user_id: string
  opportunity_id: string
  status: OpportunityStatus
  result_note: string
  created_at: string
  opportunity?: Opportunity
}

export interface CourseProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  test_score: number
  completed_at: string
}

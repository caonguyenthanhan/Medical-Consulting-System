export interface Question {
  id: string
  text: string
  options: { value: string; label: string; score: number }[]
}

export interface Assessment {
  id: string
  title: string
  description: string
  questions: Question[]
  interpretation: { min: number; max: number; level: string; description: string; recommendations: string[] }[]
}
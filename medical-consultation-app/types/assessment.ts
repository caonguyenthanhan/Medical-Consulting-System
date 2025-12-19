export type AssessmentOption = {
  value: string
  label: string
  score: number
}

export type AssessmentQuestion = {
  id: string
  text: string
  options: AssessmentOption[]
}

export type AssessmentInterpretation = {
  min: number
  max: number
  level: string
  description: string
  recommendations: string[]
}

export type Assessment = {
  id: string
  title: string
  description: string
  questions: AssessmentQuestion[]
  interpretation: AssessmentInterpretation[]
}

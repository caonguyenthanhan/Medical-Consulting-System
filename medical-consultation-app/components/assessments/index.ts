export { phq9Assessment } from './phq9'
export { gad7Assessment } from './gad7'
export { pcl5Assessment } from './pcl5'
export { mdqAssessment } from './mdq'
export { scoffAssessment } from './scoff'
export { asrsAssessment } from './asrs'

// Import assessments for array creation
import { phq9Assessment } from './phq9'
import { gad7Assessment } from './gad7'
import { pcl5Assessment } from './pcl5'
import { mdqAssessment } from './mdq'
import { scoffAssessment } from './scoff'
import { asrsAssessment } from './asrs'

// Export all assessments as an array for easy iteration
export const allAssessments = [
  phq9Assessment,
  gad7Assessment,
  pcl5Assessment,
  mdqAssessment,
  scoffAssessment,
  asrsAssessment,
]

// Export assessments by category
export const mentalHealthAssessments = [
  phq9Assessment,
  gad7Assessment,
  pcl5Assessment,
  mdqAssessment,
]

export const behavioralAssessments = [
  scoffAssessment,
  asrsAssessment,
]
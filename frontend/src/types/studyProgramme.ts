export type ProgrammeStatus = 'ACTIVE' | 'IN_REVIEW' | 'RETIRED' | 'DRAFT'

export type ProgrammeVersion = {
  version: number
  status: ProgrammeStatus
  validFrom?: string
  validTo?: string
  effectiveAcademicYear?: string
  plannedEffectiveAcademicYear?: string
}

export type StudyProgramme = {
  code: string
  name: string
  faculty: string
  degreeType: string
  activeVersion: number
  status: ProgrammeStatus
  validFrom: string
  nextReview: string
  openActions: number
  activeAccreditation: string
  currentPhase: string
  versions: ProgrammeVersion[]
  accreditationProcesses: AccreditationProcess[]
  qualityReview: QualityReview
  actions: ActionRecord[]
  documents: DocumentRecord[]
  history: HistoryEvent[]
}

export type AccreditationProcess = {
  period: string
  processType: string
  approvalRegime: string
  status: string
  decision: DecisionRecord
}

export type DecisionRecord = {
  authority: string
  decisionType: string
  decidedAt: string
  validUntil: string
}

export type QualityReview = {
  title: string
  year: string
  requirements: RequirementAssessment[]
}

export type AssessmentResult = 'FULFILLED' | 'PARTIALLY_FULFILLED' | 'NOT_FULFILLED' | 'NOT_ASSESSED'

export type RequirementAssessment = {
  code: string
  title: string
  result: AssessmentResult
  evidence: EvidenceItem[]
  finding?: FindingRecord
}

export type EvidenceItem = { title: string; type: string }

export type FindingRecord = { title: string; status: string }

export type ActionRecord = {
  title: string
  sourceFinding: string
  responsible: string
  dueDate: string
  status: 'OPEN' | 'OVERDUE' | 'COMPLETED'
  verification: 'PLANNED' | 'VERIFIED'
  closure: 'OPEN' | 'CLOSED'
}

export type DocumentRecord = { title: string; type: string; updatedAt: string }
export type HistoryEvent = { date: string; title: string; detail: string }
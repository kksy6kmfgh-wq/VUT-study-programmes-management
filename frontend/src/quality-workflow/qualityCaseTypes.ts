import type { AssessmentResult } from '../types/studyProgramme'

export type QualityCaseEvidence = { id: string; title: string; type: string; source: string; description: string; reference: string; createdAt: string }
export type QualityCaseAssessment = { result: AssessmentResult; comment: string; assessor: string; assessedAt: string } | null
export type QualityCaseFinding = { type: string; title: string; description: string; createdAt: string; author: string } | null
export type QualityCaseAction = { title: string; description: string; responsible: string; dueDate: string; status: 'OPEN' | 'COMPLETED'; createdAt: string; completedAt?: string } | null
export type QualityCaseVerification = { verifier: string; verifiedAt: string; implementationVerified: boolean; effectivenessVerified: boolean; comment: string }
export type QualityCaseHistory = { date: string; actor: string; event: string }
export type ClosureState = 'OPEN' | 'AWAITING_VERIFICATION' | 'CLOSED'
export type QualityCase = { id: string; studyProgrammeCode: string; programmeVersion: number; reviewTitle: string; requirement: { code: string; title: string }; evidence: QualityCaseEvidence[]; assessment: QualityCaseAssessment; finding: QualityCaseFinding; action: QualityCaseAction; verifications: QualityCaseVerification[]; history: QualityCaseHistory[] }
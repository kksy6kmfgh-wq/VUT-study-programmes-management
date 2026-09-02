import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { initialQualityCase } from './qualityCaseMock'
import type { ClosureState, QualityCase, QualityCaseAction, QualityCaseAssessment, QualityCaseEvidence, QualityCaseFinding, QualityCaseVerification } from './qualityCaseTypes'

type QualityCaseContextValue = { qualityCase: QualityCase; closureState: ClosureState; addEvidence: (evidence: Omit<QualityCaseEvidence, 'id' | 'createdAt'>, actor: string) => void; saveAssessment: (assessment: NonNullable<QualityCaseAssessment>, actor: string) => void; addFinding: (finding: Omit<NonNullable<QualityCaseFinding>, 'createdAt' | 'author'>, actor: string) => void; addAction: (action: Omit<NonNullable<QualityCaseAction>, 'createdAt' | 'status'>, actor: string) => void; completeAction: (actor: string) => void; addVerification: (verification: QualityCaseVerification) => void }
const QualityCaseContext = createContext<QualityCaseContextValue | null>(null)

export function QualityCaseProvider({ children }: { children: ReactNode }) {
  const [qualityCase, setQualityCase] = useState(initialQualityCase)
  const closureState: ClosureState = qualityCase.action?.status !== 'COMPLETED' ? 'OPEN' : qualityCase.verifications.some((item) => item.implementationVerified && item.effectivenessVerified) ? 'CLOSED' : 'AWAITING_VERIFICATION'
  const append = (event: string, actor: string) => ({ date: new Date().toISOString().slice(0, 10), actor, event })
  const value = useMemo<QualityCaseContextValue>(() => ({ qualityCase, closureState,
    addEvidence: (input, actor) => setQualityCase((current) => ({ ...current, evidence: [...current.evidence, { ...input, id: `evidence-${current.evidence.length + 1}`, createdAt: '2027-01-10' }], history: [...current.history, append(`doplnil důkaz „${input.title}“`, actor)] })),
    saveAssessment: (assessment, actor) => setQualityCase((current) => ({ ...current, assessment, history: [...current.history, append(`ohodnotil H11 jako ${assessment.result}`, actor)] })),
    addFinding: (input, actor) => setQualityCase((current) => ({ ...current, finding: { ...input, createdAt: '2027-01-15', author: actor }, history: [...current.history, append(`vytvořil zjištění „${input.title}“`, actor)] })),
    addAction: (input, actor) => setQualityCase((current) => ({ ...current, action: { ...input, status: 'OPEN', createdAt: '2027-02-01' }, history: [...current.history, append('vytvořil opatření', actor)] })),
    completeAction: (actor) => setQualityCase((current) => current.action ? ({ ...current, action: { ...current.action, status: 'COMPLETED', completedAt: '2027-06-28' }, history: [...current.history, append('označil opatření jako dokončené', actor)] }) : current),
    addVerification: (verification) => setQualityCase((current) => ({ ...current, verifications: [...current.verifications, verification], history: [...current.history, append('ověřil implementaci a účinnost', verification.verifier), ...(verification.implementationVerified && verification.effectivenessVerified ? [append('uzavřel cyklus kvality', verification.verifier)] : [])] })),
  }), [qualityCase, closureState])
  return <QualityCaseContext.Provider value={value}>{children}</QualityCaseContext.Provider>
}

export function useQualityCase() { const value = useContext(QualityCaseContext); if (!value) throw new Error('useQualityCase must be used inside QualityCaseProvider'); return value }
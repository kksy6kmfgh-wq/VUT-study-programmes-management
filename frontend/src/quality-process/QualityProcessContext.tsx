import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '../auth/roles'

export type ProcessParticipant = {
  personaId: string
  name: string
  email: string
  institution: string
  role: Role
  roleLabel: string
  external?: boolean
  access: string
}

export type ProcessFlowStep = {
  id: string
  title: string
  role: Role
  roleLabel: string
  personaId: string
  deadline: string
  canReturn: boolean
  locksAfterSubmit: boolean
  executionMode?: 'SEQUENTIAL' | 'PARALLEL'
  formCodes?: string[]
}

export type ProcessQuestionType = 'Krátký text' | 'Dlouhý text' | 'Rich text' | 'Ano / Ne' | 'Ano / částečně / ne / N/R' | 'Jedna možnost' | 'Více možností' | 'Číslo' | 'Datum' | 'Tabulka' | 'Dokument' | 'Odkaz'

export type ProcessQuestion = {
  id: string
  section: string
  question: string
  type: ProcessQuestionType
  required: boolean
  answerRole: Role
  answerRoleLabel: string
  maxCharacters?: number
  helpText?: string
  options?: string[]
  evidenceRequired?: boolean
}

export type ProcessFormState = 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED' | 'UNDER_REVIEW' | 'RETURNED' | 'CORRECTED' | 'ACCEPTED' | 'CLOSED'

export type ProcessForm = {
  id: string
  code: string
  title: string
  description: string
  role: Role
  roleLabel: string
  workflowStepId: string
  workflowStepIds?: string[]
  required: boolean
  source: string
  questionIds: string[]
  ownerPersonaId?: string
  collaboratorPersonaIds?: string[]
  submitterPersonaIds?: string[]
  state?: ProcessFormState
  rubricId?: string
  multiReviewerMode?: 'SINGLE_SHARED' | 'INDIVIDUAL' | 'ASSIGNED_SECTIONS'
}

export type RubricLevel = { code: string; label: string; descriptor: string }
export type ProcessRubric = { id: string; title: string; description: string; levels: RubricLevel[] }
export type ProcessReviewTask = { id: string; formId: string; reviewerPersonaId: string; title: string; dueDate: string; status: 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' }

export type ProcessDocument = {
  id: string
  title: string
  kind: string
  visibility: string
  required: boolean
  fileName?: string
}

export type AccreditationDecision = {
  authority: string
  meetingDate: string
  resolutionNumber: string
  outcome: 'SCHVALENO' | 'SCHVALENO_S_PODMINKOU' | 'VRACENO_K_DOPLNENI' | 'NESCHVALENO' | 'JINE'
  effectiveDate: string
  validFrom: string
  validTo: string
  conditions: string
  conditionsDeadline: string
  responsiblePerson: string
  note: string
  documentName?: string
  recordedAt: string
  recordedBy: string
}

export type ProgrammeAccreditationRecord = AccreditationDecision & {
  processId: string
  processTitle: string
  processType: string
  programmeCode: string
}

export type ProcessDraft = {
  title: string
  processType: string
  scope: string
  programmeCode: string
  programmeName?: string
  faculty?: string
  facultyName?: string
  cooperatingFaculties?: string[]
  academicYear?: string
  participants: ProcessParticipant[]
  workflow: ProcessFlowStep[]
  questions: ProcessQuestion[]
  forms?: ProcessForm[]
  rubrics?: ProcessRubric[]
  reviewTasks?: ProcessReviewTask[]
  documents: ProcessDocument[]
}

export type ProcessHistoryItem = {
  at: string
  actor: string
  event: string
  stepId?: string
  kind?: 'STARTED' | 'COMPLETED' | 'RETURNED' | 'DECISION' | 'PUBLISHED'
}

export type AnswerRevision = {
  at: string
  actor: string
  previousValue: string
  newValue: string
}

export type ReviewRequest = {
  id: string
  questionId: string
  targetPersonaId: string
  targetName: string
  requestedByPersonaId: string
  requestedByName: string
  comment: string
  dueDate: string
  createdAt: string
  status: 'OPEN' | 'RESOLVED'
  resolvedAt?: string
  resolutionComment?: string
}

export type QualityProcess = ProcessDraft & {
  id: string
  status: 'ACTIVE' | 'COMPLETED'
  currentStepIndex: number
  createdAt: string
  createdBy: string
  answers: Record<string, Record<string, string>>
  answerHistory: Record<string, Record<string, AnswerRevision[]>>
  stepComments: Record<string, string>
  reviewRequests: ReviewRequest[]
  history: ProcessHistoryItem[]
  decision?: AccreditationDecision
  decisionHistory?: AccreditationDecision[]
}

type ContextValue = {
  processes: QualityProcess[]
  publishProcess: (draft: ProcessDraft, actor: string) => QualityProcess
  deleteProcess: (processId: string) => void
  saveDecision: (processId: string, decision: Omit<AccreditationDecision, 'recordedAt' | 'recordedBy'>, actor: string) => void
  getProgrammeDecisionHistory: (programmeCode: string) => ProgrammeAccreditationRecord[]
  getCurrentAccreditation: (programmeCode: string) => ProgrammeAccreditationRecord | undefined
  saveAnswer: (processId: string, personaId: string, questionId: string, value: string, actorName?: string) => void
  saveStepComment: (processId: string, personaId: string, value: string) => void
  advanceProcess: (processId: string, actorPersonaId: string, actorName: string) => void
  returnProcess: (processId: string, actorPersonaId: string, actorName: string) => void
  addReviewRequest: (processId: string, input: Omit<ReviewRequest, 'id' | 'createdAt' | 'status'>) => void
  resolveReviewRequest: (processId: string, requestId: string, actorPersonaId: string, actorName: string, comment: string) => void
  processesForPersona: (personaId: string) => QualityProcess[]
  resetDemoProcesses: () => void
}

const STORAGE_KEY = 'vut-quality-process-demo-v11'
const QualityProcessContext = createContext<ContextValue | null>(null)

function nowLabel() {
  return new Date().toLocaleString('cs-CZ', { dateStyle: 'short', timeStyle: 'short' })
}

function normalizeProcess(process: QualityProcess): QualityProcess {
  const originalWorkflow = process.workflow ?? []
  const inferredFaculty = process.faculty || (process.scope?.match(/·\s*([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]{2,8})\s*$/)?.[1] ?? 'VUT')
  const inferredProgrammeName = process.programmeName || process.scope?.split('·')?.[1]?.trim() || process.programmeCode
  const hasSecretaryStep = originalWorkflow.some((step) => step.personaId === 'sofia-kovalevskaya')
  const lastStep = originalWorkflow.at(-1)
  const shouldMigrateLegacyFinalStep = !hasSecretaryStep && Boolean(lastStep) && (
    lastStep?.personaId === 'katherine-johnson' ||
    /Předání rektorovi|rozhodovacímu orgánu/i.test(lastStep?.title ?? '')
  )
  const workflow = shouldMigrateLegacyFinalStep
    ? [
        ...originalWorkflow.slice(0, -1),
        {
          ...lastStep!,
          title: 'Záznam rozhodnutí RVH a uzavření procesu',
          role: 'CLEN_RVH' as Role,
          roleLabel: 'Tajemník RVH',
          personaId: 'sofia-kovalevskaya',
          canReturn: true,
          locksAfterSubmit: true,
        },
      ]
    : originalWorkflow
  const hasSecretaryParticipant = (process.participants ?? []).some((participant) => participant.personaId === 'sofia-kovalevskaya')
  const participants = hasSecretaryParticipant ? process.participants : [
    ...(process.participants ?? []),
    {
      personaId: 'sofia-kovalevskaya',
      name: 'Sofia Kovalevskaya',
      email: 'sofia.kovalevskaya@vut-demo.cz',
      institution: 'VUT · Rada pro vnitřní hodnocení',
      role: 'CLEN_RVH' as Role,
      roleLabel: 'Tajemník RVH',
      access: 'Zápis rozhodnutí a uzavření procesu',
    },
  ]
  return {
    ...process,
    faculty: inferredFaculty,
    facultyName: process.facultyName || inferredFaculty,
    programmeName: inferredProgrammeName,
    cooperatingFaculties: process.cooperatingFaculties ?? [],
    academicYear: process.academicYear || '',
    workflow,
    participants,
    answerHistory: process.answerHistory ?? {},
    reviewRequests: process.reviewRequests ?? [],
    decisionHistory: process.decisionHistory ?? (process.decision ? [process.decision] : []),
  }
}

function loadProcesses(): QualityProcess[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(normalizeProcess) : []
  } catch {
    return []
  }
}

export function QualityProcessProvider({ children }: { children: ReactNode }) {
  const [processes, setProcesses] = useState<QualityProcess[]>(loadProcesses)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(processes))
  }, [processes])

  const value = useMemo<ContextValue>(() => ({
    processes,
    publishProcess: (draft, actor) => {
      const process: QualityProcess = {
        ...draft,
        id: `QP-${Date.now()}`,
        status: 'ACTIVE',
        currentStepIndex: 0,
        createdAt: nowLabel(),
        createdBy: actor,
        answers: {},
        answerHistory: {},
        stepComments: {},
        reviewRequests: [],
        history: [{ at: nowLabel(), actor, event: `vytvořil proces „${draft.title}“ a odeslal jej prvnímu příjemci`, stepId: draft.workflow[0]?.id, kind: 'PUBLISHED' }],
      }
      setProcesses((current) => [process, ...current])
      return process
    },
    deleteProcess: (processId) => {
      setProcesses((current) => current.filter((process) => process.id !== processId))
    },
    saveDecision: (processId, decision, actor) => {
      const recordedDecision: AccreditationDecision = { ...decision, recordedAt: nowLabel(), recordedBy: actor }
      setProcesses((current) => current.map((process) => process.id === processId ? {
        ...process,
        decision: recordedDecision,
        decisionHistory: [...(process.decisionHistory ?? (process.decision ? [process.decision] : [])), recordedDecision],
        history: [...process.history, { at: nowLabel(), actor, event: `zapsal rozhodnutí RVH: ${decision.outcome}; platnost ${decision.validFrom || '—'} – ${decision.validTo || '—'}; usnesení ${decision.resolutionNumber || 'bez čísla'}`, stepId: process.workflow[process.currentStepIndex]?.id, kind: 'DECISION' }],
      } : process))
    },
    getProgrammeDecisionHistory: (programmeCode) => processes
      .filter((process) => process.programmeCode === programmeCode)
      .flatMap((process) => (process.decisionHistory ?? (process.decision ? [process.decision] : [])).map((decision) => ({
        ...decision,
        processId: process.id,
        processTitle: process.title,
        processType: process.processType,
        programmeCode: process.programmeCode,
      })))
      .sort((a, b) => (b.effectiveDate || b.meetingDate || b.recordedAt).localeCompare(a.effectiveDate || a.meetingDate || a.recordedAt)),
    getCurrentAccreditation: (programmeCode) => {
      const records = processes
        .filter((process) => process.programmeCode === programmeCode)
        .flatMap((process) => (process.decisionHistory ?? (process.decision ? [process.decision] : [])).map((decision) => ({
          ...decision,
          processId: process.id,
          processTitle: process.title,
          processType: process.processType,
          programmeCode: process.programmeCode,
        })))
        .filter((record) => record.outcome === 'SCHVALENO' || record.outcome === 'SCHVALENO_S_PODMINKOU')
        .sort((a, b) => (b.effectiveDate || b.validFrom || b.meetingDate || b.recordedAt).localeCompare(a.effectiveDate || a.validFrom || a.meetingDate || a.recordedAt))
      return records[0]
    },
    saveAnswer: (processId, personaId, questionId, answer, actorName) => {
      setProcesses((current) => current.map((process) => {
        if (process.id !== processId) return process
        const question = process.questions.find((item) => item.id === questionId)
        const limitedAnswer = question?.maxCharacters && question.maxCharacters > 0
          ? answer.slice(0, question.maxCharacters)
          : answer
        const previousValue = process.answers[personaId]?.[questionId] ?? ''
        const revision: AnswerRevision = { at: nowLabel(), actor: actorName ?? personaId, previousValue, newValue: limitedAnswer }
        return {
          ...process,
          answers: {
            ...process.answers,
            [personaId]: {
              ...(process.answers[personaId] ?? {}),
              [questionId]: limitedAnswer,
            },
          },
          answerHistory: {
            ...process.answerHistory,
            [personaId]: {
              ...(process.answerHistory[personaId] ?? {}),
              [questionId]: [...(process.answerHistory[personaId]?.[questionId] ?? []), revision],
            },
          },
        }
      }))
    },
    saveStepComment: (processId, personaId, comment) => {
      setProcesses((current) => current.map((process) => process.id === processId ? {
        ...process,
        stepComments: { ...process.stepComments, [personaId]: comment },
      } : process))
    },
    advanceProcess: (processId, actorPersonaId, actorName) => {
      setProcesses((current) => current.map((process) => {
        if (process.id !== processId || process.status !== 'ACTIVE') return process
        const step = process.workflow[process.currentStepIndex]
        if (!step || step.personaId !== actorPersonaId) return process
        const isLast = process.currentStepIndex >= process.workflow.length - 1
        return {
          ...process,
          currentStepIndex: isLast ? process.currentStepIndex : process.currentStepIndex + 1,
          status: isLast ? 'COMPLETED' : 'ACTIVE',
          history: [...process.history, {
            at: nowLabel(),
            actor: actorName,
            event: isLast
              ? `uzavřel poslední krok „${step.title}“; proces je dokončen`
              : `uzavřel krok „${step.title}“ a předal proces roli „${process.workflow[process.currentStepIndex + 1]?.roleLabel ?? ''}“`,
            stepId: step.id,
            kind: 'COMPLETED',
          }],
        }
      }))
    },
    returnProcess: (processId, actorPersonaId, actorName) => {
      setProcesses((current) => current.map((process) => {
        if (process.id !== processId || process.status !== 'ACTIVE') return process
        const step = process.workflow[process.currentStepIndex]
        if (!step || step.personaId !== actorPersonaId || !step.canReturn || process.currentStepIndex === 0) return process
        const previous = process.workflow[process.currentStepIndex - 1]
        return {
          ...process,
          currentStepIndex: process.currentStepIndex - 1,
          history: [...process.history, {
            at: nowLabel(),
            actor: actorName,
            event: `vrátil krok „${step.title}“ zpět roli „${previous.roleLabel}“ k doplnění`,
          }],
        }
      }))
    },
    addReviewRequest: (processId, input) => {
      setProcesses((current) => current.map((process) => process.id === processId ? {
        ...process,
        reviewRequests: [...process.reviewRequests, {
          ...input,
          id: `RR-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: nowLabel(),
          status: 'OPEN',
        }],
        history: [...process.history, {
          at: nowLabel(),
          actor: input.requestedByName,
          event: `vrátil položku ${input.questionId} uživateli ${input.targetName} k doplnění; termín ${input.dueDate || 'bez termínu'}`,
        }],
      } : process))
    },
    resolveReviewRequest: (processId, requestId, actorPersonaId, actorName, comment) => {
      setProcesses((current) => current.map((process) => {
        if (process.id !== processId) return process
        const request = process.reviewRequests.find((item) => item.id === requestId)
        if (!request || request.targetPersonaId !== actorPersonaId || request.status !== 'OPEN') return process
        return {
          ...process,
          reviewRequests: process.reviewRequests.map((item) => item.id === requestId ? {
            ...item,
            status: 'RESOLVED',
            resolvedAt: nowLabel(),
            resolutionComment: comment,
          } : item),
          history: [...process.history, { at: nowLabel(), actor: actorName, event: `doplnil vrácenou položku ${request.questionId} a odeslal opravu ke kontrole` }],
        }
      }))
    },
    processesForPersona: (personaId) => processes.filter((process) =>
      process.participants.some((participant) => participant.personaId === personaId) ||
      process.reviewRequests.some((request) => request.targetPersonaId === personaId && request.status === 'OPEN')
    ),
    resetDemoProcesses: () => setProcesses([]),
  }), [processes])

  return <QualityProcessContext.Provider value={value}>{children}</QualityProcessContext.Provider>
}

export function useQualityProcesses() {
  const value = useContext(QualityProcessContext)
  if (!value) throw new Error('useQualityProcesses must be used inside QualityProcessProvider')
  return value
}

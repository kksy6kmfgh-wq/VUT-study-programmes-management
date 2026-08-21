import type { AssessmentResult, ProgrammeStatus } from '../types/studyProgramme'

export const programmeStatusLabels: Record<ProgrammeStatus, string> = {
  ACTIVE: 'Aktivní', IN_REVIEW: 'V hodnocení', RETIRED: 'Historická verze', DRAFT: 'Návrh',
}

export const processTypeLabels: Record<string, string> = {
  NEW_PROGRAMME: 'Nový studijní program', REACCREDITATION: 'Opětovné schválení / prodloužení oprávnění', PROGRAMME_CHANGE: 'Změna studijního programu',
}

export const approvalRegimeLabels: Record<string, string> = {
  INSTITUTIONAL: 'Institucionální oprávnění', EXTERNAL_NAU: 'Externí akreditační řízení NAÚ',
}

export const resultLabels: Record<AssessmentResult, string> = {
  FULFILLED: 'Splněno', PARTIALLY_FULFILLED: 'Částečně splněno', NOT_FULFILLED: 'Nesplněno', NOT_ASSESSED: 'Nehodnoceno',
}

export const statusLabels: Record<string, string> = {
  COMPLETED: 'Dokončeno', OPEN: 'Otevřeno', OVERDUE: 'Po termínu', SUBMITTED: 'Předloženo', IN_PREPARATION: 'V přípravě', COMPLETED_PENDING: 'Čeká na ověření', CLOSED: 'Uzavřeno',
}

export const verificationLabels: Record<string, string> = {
  PLANNED: 'Plánováno', VERIFIED: 'Ověřeno', NOT_VERIFIED: 'Neověřeno',
}
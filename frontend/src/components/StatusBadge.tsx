import type { ProgrammeStatus } from '../types/studyProgramme'

const labels: Record<ProgrammeStatus, string> = { ACTIVE: 'ACTIVE', IN_REVIEW: 'IN REVIEW', RETIRED: 'RETIRED', DRAFT: 'DRAFT' }

export function StatusBadge({ status }: { status: ProgrammeStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{labels[status]}</span>
}
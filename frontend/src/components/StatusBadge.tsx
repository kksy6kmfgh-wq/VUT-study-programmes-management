import type { ProgrammeStatus } from '../types/studyProgramme'
import { programmeStatusLabels } from '../presentation/labels'

export function StatusBadge({ status }: { status: ProgrammeStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{programmeStatusLabels[status]}</span>
}
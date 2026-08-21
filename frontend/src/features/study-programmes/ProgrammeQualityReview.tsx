import { useState } from 'react'
import type { StudyProgramme, RequirementAssessment } from '../../types/studyProgramme'
import { RequirementTraceability } from './RequirementTraceability'
import { resultLabels } from '../../presentation/labels'

export function ProgrammeQualityReview({ programme }: { programme: StudyProgramme }) {
  const [selectedCode, setSelectedCode] = useState('H11')
  const selected = programme.qualityReview.requirements.find((item) => item.code === selectedCode)
  return <div className="quality-review-layout"><section className="section-panel"><div className="section-panel-header"><div><span className="eyebrow">PROGRAMME QUALITY</span><h2>{programme.qualityReview.title}</h2><span className="section-caption">ProgrammeVersion {programme.activeVersion} · {programme.qualityReview.year}</span></div><span className="review-progress">3 / 6 doloženo</span></div><div className="requirement-list">{programme.qualityReview.requirements.map((requirement) => <RequirementRow key={requirement.code} requirement={requirement} selected={requirement.code === selectedCode} onSelect={() => setSelectedCode(requirement.code)} />)}</div></section>{selected && <RequirementTraceability requirement={selected} />}</div>
}

function RequirementRow({ requirement, selected, onSelect }: { requirement: RequirementAssessment; selected: boolean; onSelect: () => void }) { return <button type="button" className={`requirement-row ${selected ? 'selected' : ''}`} onClick={onSelect}><span className="requirement-code">{requirement.code}</span><span className="requirement-title">{requirement.title}</span><span className={`result-badge result-${requirement.result.toLowerCase()}`}>{resultLabels[requirement.result]}</span><span className="evidence-count">{requirement.evidence.length} důkazy</span><span className="finding-count">{requirement.finding ? '1 zjištění' : '0 zjištění'}</span><span className="requirement-arrow">→</span></button> }
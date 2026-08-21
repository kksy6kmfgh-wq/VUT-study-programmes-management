import { useMemo, useState } from 'react'
import { programmes } from '../../mock/programmes'
import type { StudyProgramme } from '../../types/studyProgramme'
import { StatusBadge } from '../../components/StatusBadge'
import { ProgrammeOverview } from './ProgrammeOverview'
import { ProgrammeVersions } from './ProgrammeVersions'
import { ProgrammeAccreditation } from './ProgrammeAccreditation'
import { ProgrammeQualityReview } from './ProgrammeQualityReview'
import { ProgrammeActions } from './ProgrammeActions'
import { ProgrammeDocuments } from './ProgrammeDocuments'
import { ProgrammeHistory } from './ProgrammeHistory'
import type { RoleAssignment } from '../../auth/roles'
import { can } from '../../auth/access'

const tabs = ['Přehled', 'Verze programu', 'Akreditace', 'Hodnocení kvality', 'Opatření', 'Dokumenty', 'Historie']

function ProgrammeList({ onSelect, assignment }: { onSelect: (programme: StudyProgramme) => void; assignment: RoleAssignment }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => programmes.filter((item) => `${item.code} ${item.name}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <div className="content-frame"><div className="page-heading"><div><span className="eyebrow">CENTRÁLNÍ EVIDENCE</span><h1>Studijní programy</h1><p className="page-description">Jednotná evidence programů, jejich verzí a aktuálního místa v životním cyklu.</p></div>{can(assignment, 'CREATE_PROGRAMME_VERSION') && <button className="primary-button" type="button"><span className="button-plus">+</span> Nová verze programu</button>}</div><div className="toolbar"><label className="search-wrap"><span className="search-icon" aria-hidden="true">⌕</span><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hledat podle názvu nebo kódu" aria-label="Hledat studijní program" /></label><span className="result-count">{filtered.length} programy v evidenci</span></div><div className="panel programme-table"><div className="table-head"><span>Program</span><span>Fakulta</span><span>Typ studia</span><span>Aktivní verze</span><span>Stav</span><span>Akce</span></div>{filtered.length ? filtered.map((programme) => <div className="programme-row" key={programme.code}><button type="button" className="programme-main" onClick={() => onSelect(programme)}><span className="programme-code">{programme.code}</span><span className="programme-name">{programme.name}</span></button><span className="cell-text">{programme.faculty}</span><span className="cell-text">{programme.degreeType}</span><span className="version-pill">Verze {programme.activeVersion}</span><StatusBadge status={programme.status} /><button type="button" className="text-button" onClick={() => onSelect(programme)}>Otevřít →</button></div>) : <div className="empty-state">Žádný program neodpovídá hledání.</div>}</div></div>
}

function ProgrammeDetail({ programme, onBack, assignment }: { programme: StudyProgramme; onBack: () => void; assignment: RoleAssignment }) {
  const [activeTab, setActiveTab] = useState('Přehled')
  const content = activeTab === 'Přehled' ? <ProgrammeOverview programme={programme} /> : activeTab === 'Verze programu' ? <ProgrammeVersions programme={programme} /> : activeTab === 'Akreditace' ? <ProgrammeAccreditation programme={programme} /> : activeTab === 'Hodnocení kvality' ? <ProgrammeQualityReview programme={programme} /> : activeTab === 'Opatření' ? <ProgrammeActions programme={programme} /> : activeTab === 'Dokumenty' ? <ProgrammeDocuments programme={programme} /> : <ProgrammeHistory programme={programme} />
  return <div className="content-frame"><button className="back-button" type="button" onClick={onBack}>← Zpět na seznam programů</button><div className="detail-header"><div><span className="eyebrow">STUDIJNÍ PROGRAM</span><h1>{programme.name}</h1><p className="detail-meta"><strong>{programme.code}</strong> · {programme.faculty} · {programme.degreeType}</p></div><div className="detail-status"><StatusBadge status={programme.status} /></div></div><div className="role-action-strip"><span>Perspektiva: {assignment.role === 'EXTERNI_AUDITOR' ? 'auditní rozsah' : 'role a scope určují dostupné akce'}</span>{can(assignment, 'EDIT_PROGRAMME') && <button type="button" className="text-button">Upravit program →</button>}{can(assignment, 'ADD_EVIDENCE') && <button type="button" className="text-button">Přidat důkaz →</button>}{can(assignment, 'CREATE_ASSESSMENT') && <button type="button" className="text-button">Vytvořit hodnocení →</button>}{can(assignment, 'CREATE_FINDING') && <button type="button" className="text-button">Vytvořit zjištění →</button>}{can(assignment, 'MAKE_RVH_DECISION') && <button type="button" className="primary-button">Rozhodnutí RVH</button>}</div><div className="tabs" role="tablist">{tabs.map((tab) => <button className={`tab ${activeTab === tab ? 'active' : ''}`} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div>{content}</div>
}

export function StudyProgrammesPage({ assignment }: { assignment: RoleAssignment }) {
  const [selectedProgramme, setSelectedProgramme] = useState<StudyProgramme | null>(null)
  return selectedProgramme ? <ProgrammeDetail programme={selectedProgramme} assignment={assignment} onBack={() => setSelectedProgramme(null)} /> : <ProgrammeList assignment={assignment} onSelect={setSelectedProgramme} />
}

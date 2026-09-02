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
import { GuarantorProgrammeHome } from './GuarantorProgrammeHome'
import { ProgrammeProfile } from './ProgrammeProfile'
import { ProgrammeEvidenceRegister } from './ProgrammeEvidenceRegister'
import { ProgrammeProcesses } from './ProgrammeProcesses'
import { ProgrammeCouncilMeetings } from './ProgrammeCouncilMeetings'
import { ProgrammeAnnualEvaluation } from './ProgrammeAnnualEvaluation'
import type { RoleAssignment } from '../../auth/roles'
import { can } from '../../auth/access'

const defaultTabs = ['Přehled', 'Verze programu', 'Akreditace', 'Hodnocení kvality', 'Opatření', 'Dokumenty', 'Historie']
const guarantorTabs = ['Přehled', 'Studijní program', 'Rada SP', 'Roční evaluace', 'Důkazy', 'Opatření', 'Procesy', 'Historie']

function ProgrammeList({ onSelect, assignment }: { onSelect: (programme: StudyProgramme) => void; assignment: RoleAssignment }) {
  const [query, setQuery] = useState('')
  const scopedProgrammes = assignment.role === 'GARANT_SP' && assignment.scopeId ? programmes.filter((item) => item.code === assignment.scopeId) : programmes
  const filtered = useMemo(() => scopedProgrammes.filter((item) => `${item.code} ${item.name}`.toLowerCase().includes(query.toLowerCase())), [query, scopedProgrammes])
  const isGuarantor = assignment.role === 'GARANT_SP'
  return <div className="content-frame"><div className="page-heading"><div><span className="eyebrow">{isGuarantor ? 'PŘÍPRAVA A SPRÁVA SP' : 'CENTRÁLNÍ EVIDENCE'}</span><h1>{isGuarantor ? 'Moje studijní programy' : 'Studijní programy'}</h1><p className="page-description">{isGuarantor ? 'Programy, za které nesete odbornou odpovědnost, a práce vyžadující vaši pozornost.' : 'Jednotná evidence programů, jejich verzí a aktuálního místa v životním cyklu.'}</p></div>{can(assignment, 'CREATE_PROGRAMME_VERSION') && <button className="primary-button" type="button"><span className="button-plus">+</span> Nová verze programu</button>}</div>{!isGuarantor && <div className="toolbar"><label className="search-wrap"><span className="search-icon" aria-hidden="true">⌕</span><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hledat podle názvu nebo kódu" aria-label="Hledat studijní program" /></label><span className="result-count">{filtered.length} programy v evidenci</span></div>}{isGuarantor && <section className="guarantor-list-attention"><div><span className="eyebrow">VYŽADUJE MOJI POZORNOST</span><strong>4 úkoly v programu N-PI</strong><span>G27 · důkaz · roční hodnocení · opatření</span></div><button type="button" className="text-button" onClick={() => filtered[0] && onSelect(filtered[0])}>Pokračovat v práci →</button></section>}<div className="panel programme-table"><div className="table-head"><span>Program</span><span>Fakulta</span><span>Typ studia</span><span>Aktivní verze</span><span>Stav</span><span>Akce</span></div>{filtered.length ? filtered.map((programme) => <div className="programme-row" key={programme.code}><button type="button" className="programme-main" onClick={() => onSelect(programme)}><span className="programme-code">{programme.code}</span><span className="programme-name">{programme.name}</span></button><span className="cell-text">{programme.faculty}</span><span className="cell-text">{programme.degreeType}</span><span className="version-pill">Verze {programme.activeVersion}</span><StatusBadge status={programme.status} /><button type="button" className="text-button" onClick={() => onSelect(programme)}>Otevřít →</button></div>) : <div className="empty-state">Žádný program neodpovídá hledání.</div>}</div></div>
}

function GuarantorDetailContent({ programme, activeTab, setActiveTab }: { programme: StudyProgramme; activeTab: string; setActiveTab: (tab: string) => void }) {
  if (activeTab === 'Přehled') return <GuarantorProgrammeHome programme={programme} onNavigate={setActiveTab} />
  if (activeTab === 'Studijní program') return <ProgrammeProfile programme={programme} />
  if (activeTab === 'Rada SP') return <ProgrammeCouncilMeetings />
  if (activeTab === 'Roční evaluace') return <ProgrammeAnnualEvaluation />
  if (activeTab === 'Důkazy') return <ProgrammeEvidenceRegister />
  if (activeTab === 'Opatření') return <ProgrammeActions programme={programme} />
  if (activeTab === 'Procesy') return <ProgrammeProcesses programme={programme} />
  return <ProgrammeHistory programme={programme} />
}

function ProgrammeDetail({ programme, onBack, assignment }: { programme: StudyProgramme; onBack: () => void; assignment: RoleAssignment }) {
  const isGuarantor = assignment.role === 'GARANT_SP'
  const tabs = isGuarantor ? guarantorTabs : defaultTabs
  const [activeTab, setActiveTab] = useState('Přehled')
  const content = isGuarantor ? <GuarantorDetailContent programme={programme} activeTab={activeTab} setActiveTab={setActiveTab} /> : activeTab === 'Přehled' ? <ProgrammeOverview programme={programme} /> : activeTab === 'Verze programu' ? <ProgrammeVersions programme={programme} /> : activeTab === 'Akreditace' ? <ProgrammeAccreditation programme={programme} /> : activeTab === 'Hodnocení kvality' ? <ProgrammeQualityReview programme={programme} /> : activeTab === 'Opatření' ? <ProgrammeActions programme={programme} /> : activeTab === 'Dokumenty' ? <ProgrammeDocuments programme={programme} /> : <ProgrammeHistory programme={programme} />
  return <div className="content-frame"><button className="back-button" type="button" onClick={onBack}>← Zpět na seznam programů</button><div className="detail-header"><div><span className="eyebrow">{isGuarantor ? 'DIGITÁLNÍ SPIS STUDIJNÍHO PROGRAMU' : 'STUDIJNÍ PROGRAM'}</span><h1>{programme.name}</h1><p className="detail-meta"><strong>{programme.code}</strong> · {programme.faculty} · {programme.degreeType} · Verze {programme.activeVersion}</p></div><div className="detail-status"><StatusBadge status={programme.status} /></div></div><div className="role-action-strip"><span>{isGuarantor ? 'Garant programu · odborná odpovědnost za obsah, rozvoj a sebehodnocení' : `Perspektiva: ${assignment.role === 'EXTERNI_AUDITOR' ? 'auditní rozsah' : 'role a scope určují dostupné akce'}`}</span>{can(assignment, 'EDIT_PROGRAMME') && <button type="button" className="text-button">Upravit program →</button>}{can(assignment, 'ADD_EVIDENCE') && <button type="button" className="text-button" onClick={() => isGuarantor && setActiveTab('Důkazy')}>Přidat důkaz →</button>}{!isGuarantor && can(assignment, 'CREATE_ASSESSMENT') && <button type="button" className="text-button">Vytvořit hodnocení →</button>}{!isGuarantor && can(assignment, 'CREATE_FINDING') && <button type="button" className="text-button">Vytvořit zjištění →</button>}{!isGuarantor && can(assignment, 'MAKE_RVH_DECISION') && <button type="button" className="primary-button">Rozhodnutí RVH</button>}</div><div className="tabs programme-file-tabs" role="tablist">{tabs.map((tab) => <button className={`tab ${activeTab === tab ? 'active' : ''}`} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div>{content}</div>
}

export function StudyProgrammesPage({ assignment }: { assignment: RoleAssignment }) {
  const [selectedProgramme, setSelectedProgramme] = useState<StudyProgramme | null>(null)
  return selectedProgramme ? <ProgrammeDetail programme={selectedProgramme} assignment={assignment} onBack={() => setSelectedProgramme(null)} /> : <ProgrammeList assignment={assignment} onSelect={setSelectedProgramme} />
}

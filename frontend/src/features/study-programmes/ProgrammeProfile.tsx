import { useMemo, useState } from 'react'
import type { StudyProgramme } from '../../types/studyProgramme'
import { gCriteria, evidenceRegister } from '../../content/methodologyCatalog'

const answerOptions = ['Ano', 'Částečně', 'Ne', 'N/R']

export function ProgrammeProfile({ programme }: { programme: StudyProgramme }) {
  const sections = useMemo(() => Array.from(new Set(gCriteria.map((item) => item.section))), [])
  const [section, setSection] = useState(sections[0])
  const [selectedId, setSelectedId] = useState(gCriteria[0]?.id ?? '')
  const selected = gCriteria.find((item) => item.id === selectedId) ?? gCriteria[0]
  const sectionCriteria = gCriteria.filter((item) => item.section === section)
  const isLocked = true

  const selectSection = (next: string) => {
    setSection(next)
    const first = gCriteria.find((item) => item.section === next)
    if (first) setSelectedId(first.id)
  }

  return <div className="programme-description-page">
    <section className="programme-version-banner locked">
      <div><span className="eyebrow">AUTORITATIVNÍ POPIS STUDIJNÍHO PROGRAMU</span><h2>Schválená verze {programme.activeVersion}</h2><p>Obsah programu a vyjádření garanta ke všem položkám metodiky „Studijní program budoucnosti“.</p></div>
      <div className="version-lock"><strong>🔒 Schváleno RVH</strong><span>14. 2. 2027 · obsah této verze je pouze pro čtení</span><button type="button" className="primary-button">Navrhnout změnu SP</button></div>
    </section>

    <div className="programme-description-summary">
      <div><span>Položky metodiky</span><strong>{gCriteria.length}</strong><small>G01–G{String(gCriteria.length).padStart(2,'0')}</small></div>
      <div><span>Vyjádření garanta</span><strong>79 / 79</strong><small>uzavřeno se schválenou verzí</small></div>
      <div><span>Důkazy</span><strong>{evidenceRegister.length}</strong><small>navázané na schválený snapshot</small></div>
      <div><span>Stav verze</span><strong>Schválená</strong><small>změny pouze novou verzí</small></div>
    </div>

    <div className="programme-description-layout">
      <aside className="programme-file-nav methodology-section-nav"><strong>Obsah podle metodiky</strong>{sections.map((item) => {
        const count = gCriteria.filter((criterion) => criterion.section === item).length
        return <button type="button" className={section === item ? 'active' : ''} onClick={() => selectSection(item)} key={item}><span>{item}</span><small>{count} položek</small></button>
      })}</aside>

      <main className="programme-description-main">
        <section className="section-panel programme-section-intro"><span className="eyebrow">OBLAST METODIKY</span><h2>{section}</h2><p className="section-caption">Garant se vyjadřuje ke každé položce. Po schválení RVH zůstává vyjádření, důkazy i vazby zachované jako neměnný podklad rozhodnutí.</p></section>
        <div className="programme-criteria-grid">
          <section className="section-panel programme-criterion-list"><div className="programme-criterion-list-head"><strong>Položky oblasti</strong><span>{sectionCriteria.length}</span></div>{sectionCriteria.map((criterion, index) => <button type="button" className={selected.id === criterion.id ? 'selected' : ''} onClick={() => setSelectedId(criterion.id)} key={criterion.id}><strong>{criterion.id}</strong><span>{criterion.question}</span><b>{criterion.classification}</b><small>{index % 6 === 0 ? 'Částečně' : 'Ano'}</small></button>)}</section>
          <section className="section-panel programme-criterion-detail">
            <div className="criterion-editor-heading"><div><span className="criterion-editor-code">{selected.id}</span><span className="criterion-editor-class">{selected.classification} · {selected.decisionEffect}</span></div><span className="locked-chip">🔒 uzamčeno</span></div>
            <h3>Požadavek / kontrolní otázka</h3><p className="criterion-question">{selected.question}</p>
            <h3>Vyjádření garanta</h3><div className="criterion-answer-options read-only">{answerOptions.map((answer, index) => <label key={answer}><input type="radio" name={`answer-${selected.id}`} checked={index === 0} readOnly disabled={isLocked} /> {answer}</label>)}</div>
            <label className="criterion-text-label">Odůvodnění<textarea readOnly value="Program naplňuje uvedený požadavek způsobem popsaným v digitálním spisu. Vyjádření bylo součástí podkladů schválených RVH; související důkazy jsou uvedeny níže." /></label>
            <h3>Důkazy a vazby</h3><div className="criterion-evidence-links">{evidenceRegister.slice(0,2).map((item) => <button type="button" key={item.id}><strong>{item.id}</strong><span>{item.title}</span><b>{item.strength}</b></button>)}</div>
            <div className="criterion-source-note"><strong>Očekávaný důkaz dle metodiky</strong><span>{selected.evidence}</span><strong>Návaznost</strong><span>{selected.links}</span></div>
          </section>
        </div>
      </main>
    </div>
  </div>
}

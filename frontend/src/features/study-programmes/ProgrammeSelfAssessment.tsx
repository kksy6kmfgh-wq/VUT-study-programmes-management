import { useMemo, useState } from 'react'
import { gCriteria, evidenceRegister } from '../../content/methodologyCatalog'

const statuses = ['Vše', 'P', 'E27', 'F', 'Nevyplněné', 'Bez důkazu']

export function ProgrammeSelfAssessment() {
  const [filter, setFilter] = useState('Vše')
  const [selectedId, setSelectedId] = useState('G27')
  const selected = gCriteria.find((item) => item.id === selectedId) ?? gCriteria[0]
  const shown = useMemo(() => gCriteria.filter((item, index) => {
    if (filter === 'Vše') return true
    if (filter === 'Nevyplněné') return index % 5 === 0
    if (filter === 'Bez důkazu') return index % 7 === 0
    return item.classification.includes(filter)
  }), [filter])

  return <div className="self-assessment-page">
    <div className="self-assessment-summary"><div><span>Celkem G kritérií</span><strong>{gCriteria.length}</strong></div><div><span>Posouzeno</span><strong>63</strong></div><div><span>Částečně</span><strong>11</strong></div><div><span>Nesplněno</span><strong>3</strong></div><div><span>Bez důkazu</span><strong>6</strong></div></div>
    <div className="self-assessment-filters">{statuses.map((item) => <button type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
    <div className="self-assessment-layout">
      <section className="section-panel criterion-browser"><div className="section-panel-header"><div><span className="eyebrow">SEBEHODNOCENÍ GARANTA</span><h2>Checklist G</h2><span className="section-caption">Přesné otázky metodiky, navázané na digitální spis a důkazy.</span></div><span className="review-progress">{shown.length} položek</span></div><div className="criterion-browser-list">{shown.map((criterion, index) => <button type="button" className={criterion.id === selectedId ? 'selected' : ''} onClick={() => setSelectedId(criterion.id)} key={criterion.id}><span className="criterion-browser-code">{criterion.id}</span><span><strong>{criterion.section}</strong><small>{criterion.question}</small></span><span className="criterion-browser-class">{criterion.classification}</span><span className={`criterion-browser-state ${index % 5 === 0 ? 'empty' : index % 4 === 0 ? 'partial' : 'done'}`}>{index % 5 === 0 ? 'Nevyplněno' : index % 4 === 0 ? 'Částečně' : 'Splněno'}</span></button>)}</div></section>
      <section className="criterion-editor">
        <div className="criterion-editor-main section-panel"><div className="criterion-editor-heading"><div><span className="criterion-editor-code">{selected.id}</span><span className="criterion-editor-class">{selected.classification} · {selected.decisionEffect}</span></div><span className="criterion-editor-save">Koncept uložen</span></div><h2>Kontrolní otázka</h2><p className="criterion-question">{selected.question}</p><h3>Odpověď garanta</h3><div className="criterion-answer-options"><label><input type="radio" name="answer" defaultChecked /> Ano</label><label><input type="radio" name="answer" /> Částečně</label><label><input type="radio" name="answer" /> Ne</label><label><input type="radio" name="answer" /> N/R</label></div><label className="criterion-text-label">Odůvodnění<textarea defaultValue="Program má definovanou návaznost výsledků učení na profil absolventa a jednotlivé části kurikula. U vybraných vazeb probíhá aktualizace důkazů." /></label><h3>Důkazy</h3><div className="criterion-evidence-links">{evidenceRegister.slice(0,2).map((item) => <button type="button" key={item.id}><strong>{item.id}</strong><span>{item.title}</span><b>{item.strength}</b></button>)}</div><div className="criterion-editor-actions"><button type="button" className="text-button">+ Připojit existující důkaz</button><button type="button" className="text-button">+ Vložit nový důkaz</button></div></div>
        <aside className="section-panel editorial-comments"><span className="eyebrow">REDAKČNÍ KOMUNIKACE</span><h3>Kontrola kvality</h3><div className="editorial-comment"><strong>Jana Nováková · Odbor kvality</strong><time>21. 8. 2027</time><p>Prosím doplňte, jak je toto systematicky ověřováno na úrovni programu a odkažte na aktuální důkaz.</p><button type="button" className="text-button">Odpovědět →</button></div><h3>Vazba na digitální spis</h3><div className="programme-usage-links"><button type="button">Profil absolventa</button><button type="button">Kurikulum</button><button type="button">Roční hodnocení</button></div><p className="section-caption">Vazby: {selected.links}</p></aside>
      </section>
    </div>
  </div>
}

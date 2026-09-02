import { useMemo, useState } from 'react'
import type { DemoPersona } from '../auth/demoPersonas'
import type { Role } from '../auth/roles'
import { useQualityProcesses } from '../quality-process/QualityProcessContext'

type Workspace = 'PREPARATION' | 'REVIEW' | 'QUALITY'

function workspaceRoles(workspace: Workspace): Role[] {
  if (workspace === 'REVIEW') return ['HODNOTITEL_PS', 'PREDSEDA_PS', 'EXTERNI_AUDITOR']
  if (workspace === 'QUALITY') return ['PRACOVNIK_ODBORU_KVALITY', 'VEDENI_UNIVERZITY', 'ADMIN']
  return ['GARANT_SP', 'KOORDINATOR_SP', 'VEDENI_FAKULTY']
}

export function AssignedProcessPage({ persona, workspace }: { persona: DemoPersona; workspace: Workspace }) {
  const { processesForPersona, saveAnswer, saveStepComment, advanceProcess, returnProcess, resolveReviewRequest } = useQualityProcesses()
  const relevant = processesForPersona(persona.id).filter(() => workspaceRoles(workspace).includes(persona.assignment.role))
  const [selectedId, setSelectedId] = useState<string | null>(relevant[0]?.id ?? null)
  const [resolutionComments, setResolutionComments] = useState<Record<string, string>>({})

  const selected = useMemo(() => relevant.find((item) => item.id === selectedId) ?? relevant[0], [relevant, selectedId])

  if (!relevant.length) {
    return <div className="content-frame assigned-process-page">
      <div className="quality-page-heading"><span>{workspace === 'REVIEW' ? 'HODNOCENÍ' : 'PŘÍPRAVA'}</span><h1>Moje přidělené procesy</h1><p>Pro tuto roli zatím není žádný proces. Vraťte se do role pracovníka kvality, vytvořte proces v Návrháři procesů a odešlete jej.</p></div>
      <div className="empty-process-state">Žádné aktivní zadání.</div>
    </div>
  }

  const step = selected.workflow[selected.currentStepIndex]
  const isMyTurn = selected.status === 'ACTIVE' && step?.personaId === persona.id
  const assignedForms = (selected.forms ?? []).filter((form) => form.role === persona.assignment.role || form.ownerPersonaId === persona.id || (form.collaboratorPersonaIds ?? []).includes(persona.id) || (form.submitterPersonaIds ?? []).includes(persona.id))
  const assignedQuestionIds = new Set(assignedForms.flatMap((form) => form.questionIds))
  const myQuestions = assignedQuestionIds.size
    ? selected.questions.filter((question) => assignedQuestionIds.has(question.id))
    : selected.questions.filter((question) => question.answerRole === persona.assignment.role)
  const activeFormCodes = new Set(step?.formCodes ?? [])
  const canCollaborateNow = selected.status === 'ACTIVE' && assignedForms.some((form) => activeFormCodes.has(form.code) && ((form.collaboratorPersonaIds ?? []).includes(persona.id) || form.ownerPersonaId === persona.id))
  const myOpenRequests = selected.reviewRequests.filter((request) => request.targetPersonaId === persona.id && request.status === 'OPEN')
  const requestedQuestionIds = new Set(myOpenRequests.map((request) => request.questionId))
  const allVisibleAnswers = selected.participants.flatMap((participant) => {
    const answers = selected.answers[participant.personaId] ?? {}
    return Object.entries(answers).map(([questionId, answer]) => ({ participant, questionId, answer }))
  })

  return <div className="content-frame assigned-process-page">
    <div className="quality-page-heading"><span>{workspace === 'REVIEW' ? 'HODNOCENÍ · PŘIDĚLENÉ ÚLOHY' : 'PŘÍPRAVA · PŘIDĚLENÉ ÚLOHY'}</span><h1>{workspace === 'REVIEW' ? 'Moje hodnocení' : 'Moje zadání'}</h1><p>Obsah se propisuje z procesu vytvořeného pracovníkem kvality. Aktivní krok určuje, kdo může právě zapisovat; konkrétní vrácená položka je editovatelná i mimo hlavní krok.</p></div>

    <div className="assigned-process-layout">
      <aside className="assigned-process-list">
        <strong>PŘIDĚLENÉ PROCESY</strong>
        {relevant.map((process) => {
          const current = process.workflow[process.currentStepIndex]
          const openRequests = process.reviewRequests.filter((request) => request.targetPersonaId === persona.id && request.status === 'OPEN').length
          return <button key={process.id} type="button" className={(selected?.id === process.id ? 'selected ' : '') + (current?.personaId === persona.id || openRequests ? 'my-turn' : '')} onClick={() => setSelectedId(process.id)}>
            <span>{process.programmeCode}</span>
            <b>{process.title}</b>
            <small>{process.processType}</small>
            <em>{openRequests ? `${openRequests} položka/y k doplnění` : process.status === 'COMPLETED' ? 'Dokončeno' : current?.personaId === persona.id ? 'Čeká na vás' : `U: ${current?.roleLabel ?? '—'}`}</em>
          </button>
        })}
      </aside>

      {selected && <section className="assigned-process-detail">
        <div className="process-detail-head">
          <div><span>{selected.processType}</span><h2>{selected.title}</h2><p>{selected.programmeCode} · {selected.scope}</p></div>
          <div className={isMyTurn || myOpenRequests.length ? 'turn-badge active' : 'turn-badge'}>{myOpenRequests.length ? `${myOpenRequests.length} položka/y vráceny k doplnění` : selected.status === 'COMPLETED' ? 'Proces dokončen' : isMyTurn ? 'Nyní jste na řadě' : `Aktuální krok: ${step?.roleLabel ?? '—'}`}</div>
        </div>

        <div className="mini-workflow">
          {selected.workflow.map((flowStep, index) => <div key={flowStep.id} className={index < selected.currentStepIndex ? 'done' : index === selected.currentStepIndex ? 'current' : ''}>
            <b>{index + 1}</b><span>{flowStep.title}</span><small>{flowStep.roleLabel}</small>
          </div>)}
        </div>

        {myOpenRequests.length > 0 && <section className="quality-office-panel returned-items-panel">
          <div className="quality-panel-header"><div><h2>Vráceno k doplnění</h2><p>Rektorátní kontrola požaduje opravu konkrétních položek. Po úpravě každou položku odešlete zpět ke kontrole.</p></div></div>
          {myOpenRequests.map((request) => {
            const question = selected.questions.find((item) => item.id === request.questionId)
            const value = selected.answers[persona.id]?.[request.questionId] ?? ''
            return <div className="returned-item" key={request.id}>
              <div className="returned-item-head"><div><b>{request.questionId}</b><strong>{question?.question ?? request.questionId}</strong></div><span>Termín {request.dueDate || '—'}</span></div>
              <div className="review-request-message"><strong>{request.requestedByName}</strong><p>{request.comment}</p></div>
              {question?.type === 'Ano / částečně / ne / N/R' ? <select value={value} onChange={(event) => saveAnswer(selected.id, persona.id, request.questionId, event.target.value, persona.name)}><option value="">— vyberte —</option><option>Ano</option><option>Částečně</option><option>Ne</option><option>N/R</option></select> : <><textarea rows={4} maxLength={question?.maxCharacters} value={value} onChange={(event) => saveAnswer(selected.id, persona.id, request.questionId, event.target.value, persona.name)} placeholder="Doplňte opravenou odpověď…" />{question?.maxCharacters && <small className="character-counter">{value.length} / {question.maxCharacters} znaků</small>}</>}
              <textarea rows={2} value={resolutionComments[request.id] ?? ''} onChange={(event) => setResolutionComments((current) => ({ ...current, [request.id]: event.target.value }))} placeholder="Poznámka k provedené opravě…" />
              <button className="vut-primary-button" type="button" onClick={() => resolveReviewRequest(selected.id, request.id, persona.id, persona.name, resolutionComments[request.id] ?? '')}>Odeslat opravu ke kontrole →</button>
            </div>
          })}
        </section>}

        <div className="process-document-strip">
          <strong>Podklady od rektorátu</strong>
          {selected.documents.length ? selected.documents.map((document) => <span key={document.id}>▤ {document.title}{document.fileName ? ` · ${document.fileName}` : ''}</span>) : <span>Bez přiložených podkladů</span>}
        </div>

        {assignedForms.length > 0 && <div className="assigned-form-summary">{assignedForms.map((form)=><div key={form.id}><b>{form.code}</b><span>{form.title}</span><small>{form.ownerPersonaId === persona.id ? 'Vlastník' : (form.collaboratorPersonaIds ?? []).includes(persona.id) ? 'Spolupracovník' : form.roleLabel} · {form.state ?? 'DRAFT'}</small></div>)}</div>}

        {myQuestions.length > 0 && <section className="quality-office-panel assigned-form-panel">
          <div className="assigned-form-identity"><b>{workspace === 'REVIEW' ? 'H' : persona.assignment.role === 'GARANT_SP' ? 'G' : 'F'}</b><div><span>{workspace === 'REVIEW' ? 'HODNOTICÍ FORMULÁŘ' : persona.assignment.role === 'GARANT_SP' ? 'FORMULÁŘ PŘÍPRAVY' : 'FORMULÁŘ KROKU'}</span><h2>{workspace === 'REVIEW' ? 'Nezávislé hodnocení studijního programu' : `Formulář pro roli: ${persona.title}`}</h2><p>{workspace === 'REVIEW' ? `Předpřipravené číslované H otázky z metodiky Studijní program budoucnosti · ${myQuestions.length} položek.` : `Předpřipravené otázky procesu · ${myQuestions.length} položek.`}</p></div></div>
          <div className="quality-panel-header"><div><p>{isMyTurn ? 'Položky jsou nyní editovatelné.' : myOpenRequests.length ? 'Editovat lze pouze položky vrácené k doplnění.' : 'Formulář je mimo váš aktivní krok pouze pro čtení.'}</p></div></div>
          {myQuestions.map((question) => {
            const value = selected.answers[persona.id]?.[question.id] ?? ''
            const editable = isMyTurn || canCollaborateNow || requestedQuestionIds.has(question.id)
            return <label className="assigned-question" key={question.id}><span><b>{question.id}</b> · {question.section}{question.required && <em>Povinné</em>}{requestedQuestionIds.has(question.id) && <em className="returned-chip">Vráceno</em>}</span><strong>{question.question}</strong>{question.helpText && <small className="question-help">{question.helpText}</small>}{question.evidenceRequired && <em className="evidence-required-chip">Vyžaduje důkaz</em>}{question.type === 'Ano / Ne' ? <select disabled={!editable} value={value} onChange={(event) => saveAnswer(selected.id, persona.id, question.id, event.target.value, persona.name)}><option value="">— vyberte —</option><option>Ano</option><option>Ne</option></select> : question.type === 'Jedna možnost' ? <select disabled={!editable} value={value} onChange={(event) => saveAnswer(selected.id, persona.id, question.id, event.target.value, persona.name)}><option value="">— vyberte —</option>{(question.options ?? []).map((option)=><option value={option} key={option}>{option}</option>)}</select> : question.type === 'Číslo' ? <input type="number" disabled={!editable} value={value} onChange={(event)=>saveAnswer(selected.id, persona.id, question.id, event.target.value, persona.name)}/> : question.type === 'Datum' ? <input type="date" disabled={!editable} value={value} onChange={(event)=>saveAnswer(selected.id, persona.id, question.id, event.target.value, persona.name)}/> : question.type === 'Ano / částečně / ne / N/R' ? <select disabled={!editable} value={value} onChange={(event) => saveAnswer(selected.id, persona.id, question.id, event.target.value, persona.name)}><option value="">— vyberte —</option><option>Ano</option><option>Částečně</option><option>Ne</option><option>N/R</option></select> : <><textarea disabled={!editable} rows={4} maxLength={question.maxCharacters} value={value} onChange={(event) => saveAnswer(selected.id, persona.id, question.id, event.target.value, persona.name)} placeholder="Vaše odpověď…" />{question.maxCharacters && <small className="character-counter">{value.length} / {question.maxCharacters} znaků</small>}</>}</label>
          })}
        </section>}

        {myQuestions.length === 0 && <section className="quality-office-panel"><div className="quality-panel-header"><div><h2>Kontrola podkladů</h2><p>Tato role nemá vlastní otázky. Může projít dosavadní odpovědi, připojit stanovisko a proces předat nebo vrátit.</p></div></div>{allVisibleAnswers.length ? <div className="review-answer-list">{allVisibleAnswers.map((row, index) => <div key={`${row.participant.personaId}-${row.questionId}-${index}`}><b>{row.questionId}</b><strong>{row.participant.name}</strong><p>{row.answer}</p></div>)}</div> : <p>Zatím nebyly uloženy žádné odpovědi.</p>}</section>}

        <section className="quality-office-panel process-step-comment">
          <div className="quality-panel-header"><div><h2>Stanovisko / komentář aktuální role</h2><p>Uloží se k procesu a bude viditelné v dalších krocích.</p></div></div>
          <textarea rows={4} disabled={!isMyTurn} value={selected.stepComments[persona.id] ?? ''} onChange={(event) => saveStepComment(selected.id, persona.id, event.target.value)} placeholder="Komentář, připomínky nebo stanovisko…" />
          {isMyTurn && <div className="process-step-actions">{step?.canReturn && selected.currentStepIndex > 0 && <button className="vut-secondary-button" type="button" onClick={() => returnProcess(selected.id, persona.id, persona.name)}>← Vrátit předchozí roli</button>}<button className="vut-primary-button" type="button" onClick={() => advanceProcess(selected.id, persona.id, persona.name)}>{selected.currentStepIndex === selected.workflow.length - 1 ? 'Uzavřít proces' : 'Odeslat dál →'}</button></div>}
        </section>

        <details className="process-history-details"><summary>Historie procesu</summary>{selected.history.map((item, index) => <div key={`${item.at}-${index}`}><time>{item.at}</time><strong>{item.actor}</strong><span>{item.event}</span></div>)}</details>
      </section>}
    </div>
  </div>
}

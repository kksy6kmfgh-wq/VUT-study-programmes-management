import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DemoPersona } from '../auth/demoPersonas'
import { demoPersonas } from '../auth/demoPersonas'
import type { Role } from '../auth/roles'
import { gCriteria, hCriteria, rCriteria, prCriteria } from '../content/methodologyCatalog'
import { useQualityProcesses, type ProcessDocument, type ProcessDraft, type ProcessFlowStep, type ProcessParticipant, type ProcessQuestion, type ProcessForm, type ProcessRubric, type ProcessReviewTask } from '../quality-process/QualityProcessContext'

type Props = { persona: DemoPersona; section: string }
type BuilderStep = 'Základní údaje' | 'Účastníci' | 'Formuláře' | 'Workflow' | 'Dokumenty' | 'Pravidla a výstupy'

const roleLabel: Record<string, string> = {
  GARANT_SP: 'Garant SP',
  KOORDINATOR_SP: 'Studijní oddělení',
  VEDENI_FAKULTY: 'Děkan / vedení fakulty',
  PRACOVNIK_ODBORU_KVALITY: 'Odbor kvality',
  HODNOTITEL_PS: 'Hodnotitel',
  PREDSEDA_PS: 'Předseda pracovní skupiny',
  VEDENI_UNIVERZITY: 'Rektor / vedení VUT',
  EXTERNI_AUDITOR: 'Externí hodnotitel',
  CLEN_RVH: 'Tajemník RVH',
}



type LibraryFormTemplate = {
  id: string
  code: string
  title: string
  description: string
  role: Role
  roleLabel: string
  source: string
  version: string
  status: 'ACTIVE' | 'DRAFT' | 'RETIRED'
  questions: ProcessQuestion[]
  system?: boolean
}

const FORM_LIBRARY_KEY = 'vut-form-library-v12'

const criterionQuestions = (criteria: typeof gCriteria, role: Role, label: string, type: ProcessQuestion['type']): ProcessQuestion[] => criteria.map((criterion) => ({
  id: criterion.id,
  section: criterion.section,
  question: criterion.question,
  type,
  required: true,
  answerRole: role,
  answerRoleLabel: label,
}))

const defaultFormLibrary = (): LibraryFormTemplate[] => [
  { id: 'lib-g-v2', code: 'G', title: 'Sebehodnocení garanta', description: 'Kompletní metodický formulář pro přípravu a sebehodnocení studijního programu.', role: 'GARANT_SP', roleLabel: 'Garant SP', source: 'Studijní program budoucnosti · G', version: '2.0', status: 'ACTIVE', questions: criterionQuestions(gCriteria, 'GARANT_SP', 'Garant SP', 'Dlouhý text'), system: true },
  { id: 'lib-h-v2', code: 'H', title: 'Hodnocení pracovní skupiny', description: 'Nezávislé posouzení podkladů a naplnění kritérií pracovní skupinou / externím hodnotitelem.', role: 'HODNOTITEL_PS', roleLabel: 'Hodnotitel', source: 'Studijní program budoucnosti · H', version: '2.0', status: 'ACTIVE', questions: criterionQuestions(hCriteria, 'HODNOTITEL_PS', 'Hodnotitel', 'Ano / částečně / ne / N/R'), system: true },
  { id: 'lib-r-v2', code: 'R', title: 'Podklad pro rozhodnutí RVH', description: 'Rektorátní rozhodovací a syntetický formulář pro přípravu podkladu RVH.', role: 'PRACOVNIK_ODBORU_KVALITY', roleLabel: 'Odbor kvality', source: 'Studijní program budoucnosti · R', version: '2.0', status: 'ACTIVE', questions: criterionQuestions(rCriteria as typeof gCriteria, 'PRACOVNIK_ODBORU_KVALITY', 'Odbor kvality', 'Dlouhý text'), system: true },
  { id: 'lib-pr-v2', code: 'PR', title: 'Procesní checklist', description: 'Procesní kontrola úplnosti, odpovědností a dodržení schváleného postupu.', role: 'PRACOVNIK_ODBORU_KVALITY', roleLabel: 'Odbor kvality', source: 'Studijní program budoucnosti · PR', version: '2.0', status: 'ACTIVE', questions: criterionQuestions(prCriteria as typeof gCriteria, 'PRACOVNIK_ODBORU_KVALITY', 'Odbor kvality', 'Ano / částečně / ne / N/R'), system: true },
  { id: 'lib-fk-v1', code: 'FK', title: 'Formální kontrola studijním oddělením', description: 'Kontrola formálních náležitostí před předáním vedení fakulty.', role: 'KOORDINATOR_SP', roleLabel: 'Studijní oddělení', source: 'Procesní šablona RVH', version: '1.0', status: 'ACTIVE', questions: [], system: true },
  { id: 'lib-sf-v1', code: 'SF', title: 'Stanovisko fakulty', description: 'Stanovisko děkana / vedení fakulty k předkládanému studijnímu programu.', role: 'VEDENI_FAKULTY', roleLabel: 'Děkan / vedení fakulty', source: 'Procesní šablona RVH', version: '1.0', status: 'ACTIVE', questions: [], system: true },
]

function loadFormLibrary(): LibraryFormTemplate[] {
  try {
    const raw = window.localStorage.getItem(FORM_LIBRARY_KEY)
    if (!raw) return defaultFormLibrary()
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : defaultFormLibrary()
  } catch {
    return defaultFormLibrary()
  }
}

function useFormLibrary() {
  const [templates, setTemplates] = useState<LibraryFormTemplate[]>(loadFormLibrary)
  const persist = (next: LibraryFormTemplate[]) => { setTemplates(next); window.localStorage.setItem(FORM_LIBRARY_KEY, JSON.stringify(next)) }
  const addBlank = () => {
    const template: LibraryFormTemplate = { id: `lib-${Date.now()}`, code: `F${templates.length + 1}`, title: 'Nová šablona formuláře', description: 'Vlastní znovupoužitelný formulář.', role: 'GARANT_SP', roleLabel: 'Garant SP', source: 'Vlastní knihovna', version: '1.0', status: 'DRAFT', questions: [] }
    persist([...templates, template]); return template
  }
  const duplicate = (template: LibraryFormTemplate) => {
    const copy: LibraryFormTemplate = { ...template, id: `lib-${Date.now()}`, code: `${template.code}-KOPIE`, title: `${template.title} (kopie)`, version: '1.0', status: 'DRAFT', system: false, questions: template.questions.map((q, i) => ({ ...q, id: `${q.id}-LIB-${Date.now()}-${i + 1}` })) }
    persist([...templates, copy]); return copy
  }
  const remove = (id: string) => persist(templates.filter((template) => template.id !== id || template.system))
  const update = (id: string, patch: Partial<LibraryFormTemplate>) => persist(templates.map((template) => template.id === id ? { ...template, ...patch } : template))
  return { templates, addBlank, duplicate, remove, update }
}
type SavedBuilderDraft = { id: string; savedAt: string; savedBy: string; data: ProcessDraft }
const BUILDER_DRAFTS_KEY = 'vut-process-builder-drafts-v15'
function loadBuilderDrafts(): SavedBuilderDraft[] { try { const raw=window.localStorage.getItem(BUILDER_DRAFTS_KEY); const parsed=raw?JSON.parse(raw):[]; return Array.isArray(parsed)?parsed:[] } catch { return [] } }
function persistBuilderDrafts(items: SavedBuilderDraft[]) { window.localStorage.setItem(BUILDER_DRAFTS_KEY, JSON.stringify(items)); window.dispatchEvent(new Event('vut-builder-drafts-changed')) }

const processTypes = [
  'Předběžná žádost / záměr pro RVH',
  'Plnohodnotné hodnocení RVH',
  'Roční hodnocení kvality SP',
  'Mimořádné hodnocení',
  'Změna studijního programu',
  'Periodické hodnocení',
  'Externí evaluace',
  'Vlastní typ procesu',
]

const vutFaculties = [
  ['FSI', 'Fakulta strojního inženýrství'],
  ['FAST', 'Fakulta stavební'],
  ['FEKT', 'Fakulta elektrotechniky a komunikačních technologií'],
  ['FIT', 'Fakulta informačních technologií'],
  ['FCH', 'Fakulta chemická'],
  ['FP', 'Fakulta podnikatelská'],
  ['FA', 'Fakulta architektury'],
  ['FAVU', 'Fakulta výtvarných umění'],
] as const
const facultyLongName = (code: string) => vutFaculties.find(([item]) => item === code)?.[1] ?? code

const initialPreparationQuestions: ProcessQuestion[] = gCriteria.map((criterion) => ({
  id: criterion.id,
  section: criterion.section,
  question: criterion.question,
  type: 'Dlouhý text',
  required: true,
  answerRole: 'GARANT_SP',
  answerRoleLabel: 'Garant SP',
}))

const initialReviewQuestions: ProcessQuestion[] = hCriteria.map((criterion) => ({
  id: criterion.id,
  section: criterion.section,
  question: criterion.question,
  type: 'Ano / částečně / ne / N/R',
  required: true,
  answerRole: 'HODNOTITEL_PS',
  answerRoleLabel: 'Hodnotitel',
}))

const initialDecisionQuestions: ProcessQuestion[] = rCriteria.map((criterion) => ({
  id: criterion.id, section: criterion.section, question: criterion.question, type: 'Dlouhý text', required: true, answerRole: 'PRACOVNIK_ODBORU_KVALITY', answerRoleLabel: 'Odbor kvality',
}))

const initialProcessQuestions: ProcessQuestion[] = prCriteria.map((criterion) => ({
  id: criterion.id, section: criterion.section, question: criterion.question, type: 'Ano / částečně / ne / N/R', required: true, answerRole: 'PRACOVNIK_ODBORU_KVALITY', answerRoleLabel: 'Odbor kvality',
}))

const initialQuestions: ProcessQuestion[] = [...initialPreparationQuestions, ...initialReviewQuestions, ...initialDecisionQuestions, ...initialProcessQuestions]

const persona = (id: string) => demoPersonas.find((item) => item.id === id)!

const defaultParticipants: ProcessParticipant[] = [
  persona('isaac-newton'),
  persona('emmy-noether'),
  persona('albert-einstein'),
  persona('pavel-quality'),
  persona('marie-curie'),
  persona('niels-bohr'),
  persona('katherine-johnson'),
  persona('sofia-kovalevskaya'),
].map((item) => ({
  personaId: item.id,
  name: item.name,
  email: item.email,
  institution: item.institution,
  role: item.assignment.role,
  roleLabel: roleLabel[item.assignment.role] ?? item.title,
  external: item.external,
  access: item.assignment.scopeId ?? 'Celý přidělený proces',
}))

const flowFrom = (id: string, title: string, deadline: string, canReturn = true): ProcessFlowStep => {
  const item = persona(id)
  return {
    id: `${id}-${title}`,
    title,
    role: item.assignment.role,
    roleLabel: roleLabel[item.assignment.role] ?? item.title,
    personaId: item.id,
    deadline,
    canReturn,
    locksAfterSubmit: true,
  }
}

const defaultWorkflow: ProcessFlowStep[] = [
  flowFrom('isaac-newton', 'Příprava studijního programu', '30. 9. 2027', false),
  flowFrom('emmy-noether', 'Formální kontrola studijním oddělením', '15. 10. 2027'),
  flowFrom('albert-einstein', 'Kontrola a schválení fakultou', '31. 10. 2027'),
  flowFrom('pavel-quality', 'Rektorátní kontrola úplnosti', '10. 11. 2027'),
  flowFrom('marie-curie', 'Externí hodnocení', '30. 11. 2027'),
  flowFrom('niels-bohr', 'Konsolidace pracovní skupiny', '10. 12. 2027'),
  flowFrom('katherine-johnson', 'Předání podkladů rozhodovacímu orgánu', '20. 12. 2027'),
  flowFrom('sofia-kovalevskaya', 'Záznam rozhodnutí RVH a uzavření procesu', '10. 1. 2028'),
]

export function QualityWorkspacePage({ persona: currentPersona, section }: Props) {
  const isRectorQuality = currentPersona.assignment.role === 'PRACOVNIK_ODBORU_KVALITY' || currentPersona.assignment.role === 'ADMIN'
  if (currentPersona.assignment.role === 'EXTERNI_AUDITOR' && section === 'Archiv') return <ArchiveView externalReadOnly />
  const isUniversityDecisionRole = currentPersona.assignment.role === 'VEDENI_UNIVERZITY' || currentPersona.assignment.role === 'CLEN_RVH'
  if (!isRectorQuality && !isUniversityDecisionRole) return <GuarantorQualityWorkspace section={section} persona={currentPersona} />
  if (isUniversityDecisionRole) {
    if (section === 'Procesy') return <ProcessesView currentPersona={currentPersona} />
    if (section === 'Podklady RVH') return <RvhView />
    if (section === 'Portfolio SP') return <PortfolioView />
    if (currentPersona.assignment.role === 'CLEN_RVH') return <RvhSecretaryOverview currentPersona={currentPersona} />
    return <QualityOfficeOverview />
  }
  if (section === 'Procesy') return <ProcessesView currentPersona={currentPersona} />
  if (section === 'Návrhář procesů') return <TemplateEditor currentPersona={currentPersona} />
  if (section === 'Knihovna formulářů') return <FormLibraryView />
  if (section === 'Termíny a workflow') return <DeadlinesView />
  if (section === 'Hodnotitelé') return <EvaluatorsView />
  if (section === 'Připomínky') return <CommentsView />
  if (section === 'Podklady RVH') return <RvhView />
  if (section === 'Portfolio SP') return <PortfolioView />
  if (section === 'Archiv') return <ArchiveView />
  if (section === 'Externí přístupy') return <ExternalAccessView />
  return <QualityOfficeOverview />
}

function RvhSecretaryOverview({ currentPersona }: { currentPersona: DemoPersona }) {
  const { processes } = useQualityProcesses()
  const waiting = processes.filter((process) => process.status === 'ACTIVE' && process.workflow[process.currentStepIndex]?.personaId === currentPersona.id)
  const completed = processes.filter((process) => process.status === 'COMPLETED' && (process.decisionHistory?.length || process.decision))
  return <div className="content-frame quality-office-page">
    <PageHeading eyebrow="RADA PRO VNITŘNÍ HODNOCENÍ · TAJEMNÍK" title="Rozhodnutí a uzavření procesů" description="Zde vidíte případy, které byly předány Tajemníkovi RVH k zápisu výsledku jednání a formálnímu uzavření." />
    <div className="quality-office-metrics"><Metric value={String(waiting.length)} label="Čeká na zápis rozhodnutí" /><Metric value={String(completed.length)} label="Uzavřené s rozhodnutím" /></div>
    <section className="quality-office-panel"><PanelHeader title="Čeká na vás" subtitle="Otevřete položku Procesy v levém menu. Případ čekající na Tajemníka RVH se vybere automaticky." />{waiting.length ? waiting.map((process) => { const step=process.workflow[process.currentStepIndex]; return <div className="quality-action-row" key={process.id}><div><strong>{process.programmeCode} · {process.title}</strong><span>{step?.title} · termín {step?.deadline || 'bez termínu'}</span></div><b>Procesy →</b></div> }) : <p className="quality-empty-note">Aktuálně žádný proces nečeká na zápis rozhodnutí RVH.</p>}</section>
  </div>
}

function QualityOfficeOverview() {
  const { processes } = useQualityProcesses()
  const active = processes.filter((process) => process.status === 'ACTIVE')
  return <div className="content-frame quality-office-page">
    <PageHeading eyebrow="ŘÍZENÍ KVALITY · REKTORÁT" title="Redakční a procesní řízení" description="Pracovník kvality vytváří proces, určuje účastníky a workflow, sestaví formuláře a podklady a odešle zadání příslušným rolím." />
    <div className="quality-office-metrics"><Metric value={String(active.length)} label="Aktivní procesy" /><Metric value={String(processes.filter((p) => p.currentStepIndex === 0 && p.status === 'ACTIVE').length)} label="V přípravě garantem" /><Metric value={String(processes.filter((p) => p.workflow[p.currentStepIndex]?.role === 'HODNOTITEL_PS').length)} label="V hodnocení" /><Metric value={String(processes.filter((p) => p.status === 'COMPLETED').length)} label="Dokončeno" /></div>
    <div className="quality-office-grid">
      <section className="quality-office-panel"><PanelHeader title="Vyžaduje pozornost" subtitle="Procesy, které jsou právě na rektorátu" />{active.filter((process) => process.workflow[process.currentStepIndex]?.role === 'PRACOVNIK_ODBORU_KVALITY').length ? active.filter((process) => process.workflow[process.currentStepIndex]?.role === 'PRACOVNIK_ODBORU_KVALITY').map((process) => <ActionRow key={process.id} title={`${process.programmeCode} · ${process.title}`} meta={`Aktuální krok: ${process.workflow[process.currentStepIndex]?.title}`} action="Otevřít v Procesy →" />) : <p className="quality-empty-note">Aktuálně nic nečeká na rektorátní kontrolu.</p>}</section>

    </div>
    <section className="quality-office-panel"><PanelHeader title="Aktivní procesy" subtitle="Stav předávání mezi rolemi" /><DataTable headers={['Proces', 'Typ', 'Aktuální krok', 'Odpovědná osoba', 'Termín']} rows={active.map((process) => { const step = process.workflow[process.currentStepIndex]; const owner = demoPersonas.find((p) => p.id === step?.personaId); return [process.title, process.processType, step?.title ?? '—', owner?.name ?? '—', step?.deadline ?? '—'] })} /></section>
  </div>
}

function TemplateEditor({ currentPersona }: { currentPersona: DemoPersona }) {
  const { publishProcess, processes } = useQualityProcesses()
  const { templates: formLibrary } = useFormLibrary()
  const [savedDrafts, setSavedDrafts] = useState<SavedBuilderDraft[]>(loadBuilderDrafts)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [builderStep, setBuilderStep] = useState<BuilderStep>('Základní údaje')
  const [title, setTitle] = useState('Plnohodnotné hodnocení SP N-PI pro RVH')
  const [processType, setProcessType] = useState('Plnohodnotné hodnocení RVH')
  const [scope, setScope] = useState('Studijní program N-PI · Procesní inženýrství · FSI')
  const [programmeCode, setProgrammeCode] = useState('N-PI')
  const [programmeName, setProgrammeName] = useState('Procesní inženýrství')
  const [faculty, setFaculty] = useState('FSI')
  const [cooperatingFacultiesText, setCooperatingFacultiesText] = useState('')
  const [academicYear, setAcademicYear] = useState('2026/2027')
  const [participants, setParticipants] = useState<ProcessParticipant[]>(defaultParticipants)
  const [workflow, setWorkflow] = useState<ProcessFlowStep[]>(defaultWorkflow)
  const [questions, setQuestions] = useState<ProcessQuestion[]>(initialQuestions)
  const [forms, setForms] = useState<ProcessForm[]>([
    { id: 'form-g', code: 'G', title: 'Sebehodnocení garanta', description: 'Příprava a sebehodnocení studijního programu.', role: 'GARANT_SP', roleLabel: 'Garant SP', workflowStepId: '', workflowStepIds: [defaultWorkflow[0]?.id ?? ''], required: true, source: 'Studijní program budoucnosti · G', questionIds: initialPreparationQuestions.map((q) => q.id), ownerPersonaId: 'isaac-newton', collaboratorPersonaIds: ['emmy-noether'], submitterPersonaIds: ['isaac-newton'], state: 'DRAFT' },
    { id: 'form-h', code: 'H', title: 'Hodnocení pracovní skupiny', description: 'Nezávislé posouzení důkazů a naplnění kritérií.', role: 'HODNOTITEL_PS', roleLabel: 'Hodnotitel', workflowStepId: '', workflowStepIds: [defaultWorkflow[4]?.id ?? ''], required: true, source: 'Studijní program budoucnosti · H', questionIds: initialReviewQuestions.map((q) => q.id), ownerPersonaId: 'marie-curie', collaboratorPersonaIds: ['lise-meitner'], submitterPersonaIds: ['marie-curie','lise-meitner'], state: 'DRAFT', rubricId: 'rubric-h-default', multiReviewerMode: 'INDIVIDUAL' },
    { id: 'form-formal', code: 'FK', title: 'Formální kontrola', description: 'Kontrola úplnosti a formálních náležitostí před předáním fakultě.', role: 'KOORDINATOR_SP', roleLabel: 'Studijní oddělení', workflowStepId: '', workflowStepIds: [defaultWorkflow[1]?.id ?? ''], required: true, source: 'Procesní šablona RVH', questionIds: [], state: 'DRAFT' },
    { id: 'form-dean', code: 'SF', title: 'Stanovisko fakulty', description: 'Stanovisko děkana / vedení fakulty k předkládanému programu.', role: 'VEDENI_FAKULTY', roleLabel: 'Děkan / vedení fakulty', workflowStepId: '', workflowStepIds: [defaultWorkflow[2]?.id ?? ''], required: true, source: 'Procesní šablona RVH', questionIds: [], state: 'DRAFT' },
    { id: 'form-r', code: 'R', title: 'Podklad pro rozhodnutí RVH', description: 'Rektorátní syntéza a rozhodovací podklad.', role: 'PRACOVNIK_ODBORU_KVALITY', roleLabel: 'Odbor kvality', workflowStepId: '', workflowStepIds: [defaultWorkflow[3]?.id ?? ''], required: true, source: 'Studijní program budoucnosti · R', questionIds: initialDecisionQuestions.map((q) => q.id) },
    { id: 'form-pr', code: 'PR', title: 'Procesní checklist', description: 'Kontrola průběhu, odpovědností a procesních náležitostí.', role: 'PRACOVNIK_ODBORU_KVALITY', roleLabel: 'Odbor kvality', workflowStepId: '', workflowStepIds: [defaultWorkflow[3]?.id ?? ''], required: true, source: 'Studijní program budoucnosti · PR', questionIds: initialProcessQuestions.map((q) => q.id) },
  ])
  const [rubrics, setRubrics] = useState<ProcessRubric[]>([
    { id: 'rubric-h-default', title: 'Hodnoticí rubrika SP budoucnosti', description: 'Výchozí rubrika pro nezávislé posouzení.', levels: [
      { code: 'A', label: 'Plně splněno', descriptor: 'Požadavek je doložen přesvědčivými a aktuálními důkazy.' },
      { code: 'C', label: 'Částečně splněno', descriptor: 'Požadavek je doložen jen částečně nebo s dílčími nedostatky.' },
      { code: 'N', label: 'Nesplněno', descriptor: 'Požadavek není doložen nebo existuje významný nedostatek.' },
      { code: 'N/R', label: 'Nerelevantní', descriptor: 'Kritérium se na posuzovaný případ nevztahuje.' },
    ] },
  ])
  const [reviewTasks, setReviewTasks] = useState<ProcessReviewTask[]>([
    { id: 'task-curie-h', formId: 'form-h', reviewerPersonaId: 'marie-curie', title: 'Posoudit H formulář', dueDate: '30. 11. 2027', status: 'ASSIGNED' },
    { id: 'task-meitner-h', formId: 'form-h', reviewerPersonaId: 'lise-meitner', title: 'Nezávisle posoudit H formulář', dueDate: '30. 11. 2027', status: 'ASSIGNED' },
  ])
  const [selectedFormId, setSelectedFormId] = useState('form-g')
  const [selectedQuestionId, setSelectedQuestionId] = useState(initialPreparationQuestions[0]?.id ?? '')
  const [formMode, setFormMode] = useState<'LIST' | 'EDIT'>('LIST')
  const [documents, setDocuments] = useState<ProcessDocument[]>([
    { id: 'doc-methodology', title: 'Studijní program budoucnosti – metodika', kind: 'Metodika', visibility: 'Všichni účastníci procesu', required: true },
    { id: 'doc-rvh', title: 'Pravidla a standardy RVH', kind: 'Předpis', visibility: 'Garant, studijní, děkan, hodnotitelé', required: true },
  ])
  const [publishedMessage, setPublishedMessage] = useState('')
  const [showPreviousForms, setShowPreviousForms] = useState(false)
  const [copySourceId, setCopySourceId] = useState('')
  const [showLibraryChooser, setShowLibraryChooser] = useState(false)
  const [libraryQuery, setLibraryQuery] = useState('')

  const steps: BuilderStep[] = ['Základní údaje', 'Účastníci', 'Formuláře', 'Workflow', 'Dokumenty', 'Pravidla a výstupy']
  const selectedForm = forms.find((form) => form.id === selectedFormId) ?? forms[0]
  const formQuestions = selectedForm ? selectedForm.questionIds.map((id) => questions.find((q) => q.id === id)).filter((q): q is ProcessQuestion => Boolean(q)) : []
  const selectedQuestion = formQuestions.find((q) => q.id === selectedQuestionId) ?? formQuestions[0]

  const openForm = (formId: string) => {
    const form = forms.find((item) => item.id === formId)
    setSelectedFormId(formId); setSelectedQuestionId(form?.questionIds[0] ?? ''); setFormMode('EDIT'); setShowPreviousForms(false)
  }
  const updateForm = (patch: Partial<ProcessForm>) => selectedForm && setForms((all) => all.map((form) => form.id === selectedForm.id ? { ...form, ...patch } : form))
  const addForm = () => {
    const id = `form-${Date.now()}`
    const form: ProcessForm = { id, code: `F${forms.length + 1}`, title: 'Nový formulář', description: 'Vlastní formulář tohoto procesu.', role: 'GARANT_SP', roleLabel: 'Garant SP', workflowStepId: '', workflowStepIds: [], required: false, source: 'Vlastní formulář', questionIds: [], state: 'DRAFT', collaboratorPersonaIds: [], submitterPersonaIds: [] }
    setForms((all) => [...all, form]); setSelectedFormId(id); setSelectedQuestionId(''); setFormMode('EDIT')
  }
  const addFormFromLibrary = (template: LibraryFormTemplate) => {
    const stamp = Date.now()
    const id = `form-lib-${stamp}`
    const questionCopies = template.questions.map((question, index) => ({
      ...question,
      id: questions.some((existing) => existing.id === question.id) ? `${question.id}-LIB-${stamp}-${index + 1}` : question.id,
    }))
    const form: ProcessForm = {
      id,
      code: template.code,
      title: template.title,
      description: template.description,
      role: template.role,
      roleLabel: template.roleLabel,
      workflowStepId: '',
      workflowStepIds: [],
      required: true,
      source: `${template.source} · verze ${template.version}`,
      questionIds: questionCopies.map((question) => question.id),
      state: 'DRAFT',
      collaboratorPersonaIds: [],
      submitterPersonaIds: [],
    }
    setQuestions((all) => [...all, ...questionCopies])
    setForms((all) => [...all, form])
    setSelectedFormId(id)
    setSelectedQuestionId(questionCopies[0]?.id ?? '')
    setFormMode('EDIT')
    setShowLibraryChooser(false)
  }
  const toggleFormForWorkflowStep = (formId: string, stepId: string, checked: boolean) => {
    setForms((all) => all.map((form) => {
      if (form.id !== formId) return form
      const current = form.workflowStepIds ?? (form.workflowStepId ? [form.workflowStepId] : [])
      const next = checked ? Array.from(new Set([...current, stepId])) : current.filter((id) => id !== stepId)
      return { ...form, workflowStepIds: next, workflowStepId: next[0] ?? '' }
    }))
  }
  const duplicateForm = (form: ProcessForm) => {
    const id = `form-${Date.now()}`
    const copies = form.questionIds.map((qid, index) => { const q = questions.find((item) => item.id === qid)!; return { ...q, id: `${q.id}-K${Date.now()}-${index + 1}` } })
    setQuestions((all) => [...all, ...copies])
    setForms((all) => [...all, { ...form, id, code: `${form.code}-KOPIE`, title: `${form.title} (kopie)`, source: `Kopie: ${form.title}`, questionIds: copies.map((q) => q.id), workflowStepId: '', workflowStepIds: [] }])
  }
  const deleteForm = (form: ProcessForm) => {
    if (forms.length <= 1) return
    setQuestions((all) => all.filter((q) => !form.questionIds.includes(q.id)))
    const remaining = forms.filter((item) => item.id !== form.id); setForms(remaining); setSelectedFormId(remaining[0]?.id ?? ''); setFormMode('LIST')
  }
  const updateQuestion = (patch: Partial<ProcessQuestion>) => selectedQuestion && setQuestions((all) => all.map((q) => q.id === selectedQuestion.id ? { ...q, ...patch } : q))
  const updateQuestionId = (nextId: string) => {
    if (!selectedQuestion || !selectedForm) return
    const normalized = nextId.trim().replace(/\s+/g, '-'); if (!normalized || questions.some((q) => q.id === normalized && q.id !== selectedQuestion.id)) return
    setQuestions((all) => all.map((q) => q.id === selectedQuestion.id ? { ...q, id: normalized } : q))
    setForms((all) => all.map((form) => form.id === selectedForm.id ? { ...form, questionIds: form.questionIds.map((id) => id === selectedQuestion.id ? normalized : id) } : form)); setSelectedQuestionId(normalized)
  }
  const addQuestion = () => {
    if (!selectedForm) return
    let index = selectedForm.questionIds.length + 1; let id = `${selectedForm.code}-X${index}`
    while (questions.some((q) => q.id === id)) { index += 1; id = `${selectedForm.code}-X${index}` }
    const q: ProcessQuestion = { id, section: 'Vlastní oblast', question: 'Nová otázka', type: selectedForm.code === 'H' ? 'Ano / částečně / ne / N/R' : 'Dlouhý text', required: false, helpText: '', evidenceRequired: false, answerRole: selectedForm.role, answerRoleLabel: selectedForm.roleLabel }
    setQuestions((all) => [...all, q]); setForms((all) => all.map((form) => form.id === selectedForm.id ? { ...form, questionIds: [...form.questionIds, id] } : form)); setSelectedQuestionId(id)
  }
  const duplicateQuestion = () => {
    if (!selectedQuestion || !selectedForm) return
    let id = `${selectedQuestion.id}-KOPIE`; let i = 2; while (questions.some((q) => q.id === id)) { id = `${selectedQuestion.id}-KOPIE-${i++}` }
    const copy = { ...selectedQuestion, id, question: `${selectedQuestion.question} (kopie)` }; setQuestions((all) => [...all, copy]); setForms((all) => all.map((form) => form.id === selectedForm.id ? { ...form, questionIds: [...form.questionIds, id] } : form)); setSelectedQuestionId(id)
  }
  const deleteQuestion = () => {
    if (!selectedQuestion || !selectedForm) return
    const remainingIds = selectedForm.questionIds.filter((id) => id !== selectedQuestion.id); setQuestions((all) => all.filter((q) => q.id !== selectedQuestion.id)); setForms((all) => all.map((form) => form.id === selectedForm.id ? { ...form, questionIds: remainingIds } : form)); setSelectedQuestionId(remainingIds[0] ?? '')
  }
  const previousForms = processes.filter((process) => process.questions.length > 0)
  const copySource = previousForms.find((process) => process.id === copySourceId) ?? previousForms[0]
  const copyFromPrevious = () => {
    if (!copySource || !selectedForm) return
    const source = copySource.questions.filter((q) => q.answerRole === selectedForm.role)
    const copies = source.map((q, index) => ({ ...q, id: questions.some((existing) => existing.id === q.id) ? `${q.id}-PREV-${Date.now()}-${index}` : q.id }))
    setQuestions((all) => [...all.filter((q) => !selectedForm.questionIds.includes(q.id)), ...copies]); setForms((all) => all.map((form) => form.id === selectedForm.id ? { ...form, questionIds: copies.map((q) => q.id), source: `Převzato z: ${copySource.title}` } : form)); setSelectedQuestionId(copies[0]?.id ?? ''); setShowPreviousForms(false)
  }
  const addParticipant = () => { const candidate = demoPersonas.find((item) => !participants.some((p) => p.personaId === item.id)) ?? persona('lise-meitner'); setParticipants((all) => [...all, { personaId: candidate.id, name: candidate.name, email: candidate.email, institution: candidate.institution, role: candidate.assignment.role, roleLabel: roleLabel[candidate.assignment.role] ?? candidate.title, external: candidate.external, access: candidate.assignment.scopeId ?? 'Přidělený proces' }]) }
  const moveWorkflowStep = (index: number, direction: -1 | 1) => { const target=index+direction; if(target<0||target>=workflow.length)return; setWorkflow((all)=>{const copy=[...all]; [copy[index],copy[target]]=[copy[target],copy[index]]; return copy}) }
  const removeWorkflowStep = (id: string) => setWorkflow((all)=>all.filter((step)=>step.id!==id))
  const addWorkflowStep = () => { const candidate = persona('lise-meitner'); setWorkflow((all) => [...all, { id: `step-${Date.now()}`, title: 'Další hodnoticí krok', role: candidate.assignment.role, roleLabel: 'Externí hodnotitel', personaId: candidate.id, deadline: '31. 12. 2027', canReturn: true, locksAfterSubmit: true }]) }
  const addDocument = () => setDocuments((all) => [...all, { id: `doc-${Date.now()}`, title: 'Nový dokument', kind: 'Informační dokument', visibility: 'Všichni účastníci procesu', required: false }])
  const buildDraft = (): ProcessDraft => { const orderedQuestions = forms.flatMap((form) => form.questionIds.map((id) => questions.find((q) => q.id === id)).filter((q): q is ProcessQuestion => Boolean(q))); const workflowWithForms = workflow.map((step) => ({ ...step, formCodes: forms.filter((form) => (form.workflowStepIds ?? (form.workflowStepId ? [form.workflowStepId] : [])).includes(step.id)).map((form) => form.code) })); return { title, processType, scope, programmeCode, programmeName, faculty, facultyName: facultyLongName(faculty), cooperatingFaculties: cooperatingFacultiesText.split(',').map((item)=>item.trim()).filter(Boolean), academicYear, participants, workflow: workflowWithForms, questions: orderedQuestions, forms, rubrics, reviewTasks, documents } }
  const saveWorkingDraft = () => { const id=currentDraftId ?? `DRAFT-${Date.now()}`; const item:SavedBuilderDraft={id,savedAt:new Date().toLocaleString('cs-CZ',{dateStyle:'short',timeStyle:'short'}),savedBy:currentPersona.name,data:buildDraft()}; const next=[item,...savedDrafts.filter((d)=>d.id!==id)]; persistBuilderDrafts(next); setSavedDrafts(next); setCurrentDraftId(id); setPublishedMessage(`Rozpracovaný návrh byl uložen · ${item.savedAt}`) }
  const loadWorkingDraft = (item: SavedBuilderDraft) => { const d=item.data; setTitle(d.title); setProcessType(d.processType); setScope(d.scope); setProgrammeCode(d.programmeCode); setProgrammeName(d.programmeName ?? d.scope?.split('·')?.[1]?.trim() ?? d.programmeCode); setFaculty(d.faculty ?? d.scope?.match(/·\s*([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]{2,8})\s*$/)?.[1] ?? 'VUT'); setCooperatingFacultiesText((d.cooperatingFaculties ?? []).join(', ')); setAcademicYear(d.academicYear ?? ''); setParticipants(d.participants); setWorkflow(d.workflow); setQuestions(d.questions); setForms(d.forms??[]); setRubrics(d.rubrics??[]); setReviewTasks(d.reviewTasks??[]); setDocuments(d.documents); setCurrentDraftId(item.id); setPublishedMessage(`Načten rozpracovaný návrh uložený ${item.savedAt}`) }
  const publish = () => { const process = publishProcess(buildDraft(), currentPersona.name); if(currentDraftId){const next=savedDrafts.filter((d)=>d.id!==currentDraftId);persistBuilderDrafts(next);setSavedDrafts(next);setCurrentDraftId(null)} setPublishedMessage(`Proces ${process.id} byl publikován. První krok nyní čeká na: ${demoPersonas.find((item) => item.id === process.workflow[0]?.personaId)?.name ?? process.workflow[0]?.roleLabel}.`) }

  return <div className="content-frame quality-office-page process-builder-page">
    <PageHeading eyebrow="ŘÍZENÍ KVALITY · NÁVRHÁŘ PROCESŮ" title="Nový hodnoticí proces" description="Proces je kontejner. Obsahuje workflow, libovolný počet samostatných formulářů, dokumenty, pravidla a výstupy." />
    <div className="builder-summarybar"><div><span>{currentDraftId ? 'ULOŽENÝ ROZPRACOVANÝ NÁVRH' : 'PRACOVNÍ VERZE'}</span><strong>{title}</strong><small>{processType} · {programmeCode} · {faculty}</small></div><div className="builder-save-actions"><button className="vut-secondary-button" type="button" onClick={saveWorkingDraft}>Uložit rozpracované</button><button className="vut-primary-button" type="button" onClick={publish}>Publikovat / spustit proces →</button></div></div>
    {publishedMessage && <div className="publish-success"><strong>✓ Zadání odesláno</strong><span>{publishedMessage}</span></div>}
    {savedDrafts.length > 0 && <section className="quality-office-panel saved-drafts-panel"><div><strong>Rozpracované návrhy</strong><span>Uložené návrhy lze kdykoliv znovu otevřít a dokončit.</span></div><div className="saved-draft-list">{savedDrafts.map((item)=><button type="button" key={item.id} onClick={()=>loadWorkingDraft(item)}><b>{item.data.programmeCode} · {item.data.title}</b><span>{item.savedBy} · {item.savedAt}</span><em>Pokračovat v úpravách →</em></button>)}</div></section>}
    <div className="builder-steps">{steps.map((step, index) => <button key={step} type="button" className={builderStep === step ? 'active' : ''} onClick={() => setBuilderStep(step)}><b>{index + 1}</b><span>{step}</span></button>)}</div>
    {builderStep === 'Základní údaje' && <section className="quality-office-panel builder-panel"><PanelHeader title="Základní údaje procesu" subtitle="Zvolte, co se hodnotí a k čemu proces směřuje." /><div className="builder-form-grid two"><label>Název procesu<input value={title} onChange={(e) => setTitle(e.target.value)} /></label><label>Typ procesu<select value={processType} onChange={(e) => setProcessType(e.target.value)}>{processTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Kód programu / případu<input value={programmeCode} onChange={(e) => setProgrammeCode(e.target.value)} /></label><label>Název studijního programu<input value={programmeName} onChange={(e)=>setProgrammeName(e.target.value)} /></label><label>Kmenová fakulta / součást<select value={faculty} onChange={(e)=>setFaculty(e.target.value)}>{vutFaculties.map(([code,name])=><option value={code} key={code}>{code} · {name}</option>)}</select></label><label>Spolupracující fakulty<input value={cooperatingFacultiesText} onChange={(e)=>setCooperatingFacultiesText(e.target.value)} placeholder="např. FEKT, FIT" /></label><label>Akademický rok / období<input value={academicYear} onChange={(e)=>setAcademicYear(e.target.value)} placeholder="2026/2027" /></label><label>Rozsah procesu<input value={scope} onChange={(e) => setScope(e.target.value)} /></label></div></section>}
    {builderStep === 'Účastníci' && <section className="quality-office-panel builder-panel"><div className="builder-panel-actions"><PanelHeader title="Účastníci a role" subtitle="Interní i externí osoby, které proces skutečně obdrží." /><button className="vut-secondary-button" type="button" onClick={addParticipant}>+ Přidat účastníka</button></div><div className="participant-list">{participants.map((p) => <div className="participant-card" key={`${p.personaId}-${p.roleLabel}`}><div className="participant-main"><input value={p.name} onChange={(e) => setParticipants((all) => all.map((x) => x.personaId === p.personaId ? { ...x, name: e.target.value } : x))} /><span className={p.external ? 'external-badge' : 'internal-badge'}>{p.external ? 'EXTERNÍ' : 'VUT'}</span></div><div className="participant-fields"><label>E-mail<input value={p.email} readOnly /></label><label>Instituce<input value={p.institution} readOnly /></label><label>Role<select value={p.role} onChange={(e) => { const r=e.target.value as Role; setParticipants((all)=>all.map((x)=>x.personaId===p.personaId?{...x,role:r,roleLabel:roleLabel[r]??r}:x)) }}>{Object.entries(roleLabel).map(([k,l])=><option value={k} key={k}>{l}</option>)}</select></label><label>Rozsah přístupu<input value={p.access} readOnly /></label></div></div>)}</div></section>}
    {builderStep === 'Workflow' && <section className="quality-office-panel builder-panel"><div className="builder-panel-actions"><PanelHeader title="Workflow a spouštění formulářů" subtitle="Pořadí kroků určuje, kdy se formuláře zpřístupní. V jednom kroku může být jeden nebo více formulářů; krok lze označit jako paralelní." /><button className="vut-secondary-button" type="button" onClick={addWorkflowStep}>+ Přidat krok</button></div><div className="workflow-legend"><span>SEKVENČNÍ = čeká na předchozí krok</span><span>PARALELNÍ = může běžet současně s paralelními kroky</span></div><div className="flow-builder">{workflow.map((step,index)=>{const assigned=forms.filter((form)=>(form.workflowStepIds??(form.workflowStepId?[form.workflowStepId]:[])).includes(step.id));return <div className="flow-builder-step orchestrated" key={step.id}><span className="flow-order">{index+1}</span><div className="flow-builder-fields"><label>Krok<input value={step.title} onChange={(e)=>setWorkflow((all)=>all.map((x)=>x.id===step.id?{...x,title:e.target.value}:x))}/></label><label>Příjemce<select value={step.personaId} onChange={(e)=>{const person=persona(e.target.value);setWorkflow((all)=>all.map((x)=>x.id===step.id?{...x,personaId:person.id,role:person.assignment.role,roleLabel:roleLabel[person.assignment.role]??person.title}:x))}}>{demoPersonas.filter((p)=>p.assignment.role!=='EXTERNI_AUDITOR').map((p)=><option value={p.id} key={p.id}>{p.name} · {p.title}</option>)}</select></label><label>Režim<select value={step.executionMode??'SEQUENTIAL'} onChange={(e)=>setWorkflow((all)=>all.map((x)=>x.id===step.id?{...x,executionMode:e.target.value as 'SEQUENTIAL'|'PARALLEL'}:x))}><option value="SEQUENTIAL">Sekvenční</option><option value="PARALLEL">Paralelní</option></select></label><label>Termín<input value={step.deadline} onChange={(e)=>setWorkflow((all)=>all.map((x)=>x.id===step.id?{...x,deadline:e.target.value}:x))}/></label><div className="workflow-form-links assign-forms"><span>FORMULÁŘE SPOUŠTĚNÉ V TOMTO KROKU</span><div className="workflow-form-checkboxes">{forms.map((form)=>{const checked=assigned.some((item)=>item.id===form.id);return <label key={form.id}><input type="checkbox" checked={checked} onChange={(e)=>toggleFormForWorkflowStep(form.id,step.id,e.target.checked)}/><b>{form.code}</b><span>{form.title}</span></label>})}</div>{!assigned.length&&<em>Vyberte alespoň jeden formulář, pokud má tento krok obsahovat vyplňování.</em>}</div><div className="workflow-step-actions"><button type="button" disabled={index===0} onClick={()=>moveWorkflowStep(index,-1)}>↑ Nahoru</button><button type="button" disabled={index===workflow.length-1} onClick={()=>moveWorkflowStep(index,1)}>↓ Dolů</button><button type="button" className="danger-link" onClick={()=>removeWorkflowStep(step.id)}>Smazat</button></div></div></div>})}</div><div className="workflow-note"><strong>Workflow řídí formuláře</strong><span>Formuláře jsou nejprve připraveny v kroku 3. Zde určíte, ve kterém kroku se každý z nich spustí. Jeden formulář lze přiřadit i do více kroků.</span></div></section>}
    {builderStep === 'Formuláře' && <div className="process-form-section">
      {formMode === 'LIST' ? <><div className="form-manager-head quality-office-panel"><div><span>3 · FORMULÁŘE PROCESU</span><h2>Vyberte a připravte formuláře</h2><p>Formuláře vznikají před workflow. Můžete je převzít z centrální knihovny nebo vytvořit pouze pro tento proces. Vazbu na kroky nastavíte až v následujícím kroku Workflow.</p></div><div className="form-manager-buttons"><button className="vut-secondary-button" type="button" onClick={()=>setShowLibraryChooser((v)=>!v)}>▥ Přidat z knihovny</button><button className="vut-primary-button" type="button" onClick={addForm}>+ Nový formulář pro proces</button></div></div>{showLibraryChooser&&<section className="process-library-chooser quality-office-panel"><div className="library-chooser-head"><div><span>CENTRÁLNÍ KNIHOVNA</span><h3>Znovupoužitelné formuláře</h3><p>Do procesu se vloží snapshot vybrané verze. Pozdější úprava knihovny již běžící proces nezmění.</p></div><input value={libraryQuery} onChange={(e)=>setLibraryQuery(e.target.value)} placeholder="Hledat G, H, RVH, studijní…"/></div><div className="library-template-grid compact">{formLibrary.filter((template)=>`${template.code} ${template.title} ${template.roleLabel} ${template.source}`.toLowerCase().includes(libraryQuery.toLowerCase())).map((template)=><article key={template.id}><div className="library-template-code">{template.code}</div><div><span>{template.system?'SYSTÉMOVÁ ŠABLONA':'VLASTNÍ ŠABLONA'} · v{template.version}</span><h4>{template.title}</h4><p>{template.description}</p><small>{template.roleLabel} · {template.questions.length} otázek · {template.source}</small><button className="vut-primary-button" type="button" onClick={()=>addFormFromLibrary(template)}>Použít v procesu</button></div></article>)}</div></section>}<div className="managed-form-grid">{forms.map((form)=><article className="managed-form-card" key={form.id}><div className="managed-form-code">{form.code}</div><div className="managed-form-body"><span>{form.required?'POVINNÝ FORMULÁŘ':'VOLITELNÝ FORMULÁŘ'}</span><h3>{form.title}</h3><p>{form.description}</p><div className="managed-form-meta"><b>{form.roleLabel}</b><span>{form.questionIds.length} otázek</span><span>{form.source}</span></div><div className="managed-form-actions"><button type="button" onClick={()=>openForm(form.id)}>Otevřít →</button><button type="button" onClick={()=>duplicateForm(form)}>Duplikovat</button><button className="danger-link" type="button" onClick={()=>deleteForm(form)}>Smazat</button></div></div></article>)}</div></> : selectedForm && <><div className="form-editor-breadcrumb"><button type="button" onClick={()=>setFormMode('LIST')}>← Všechny formuláře</button><span>{selectedForm.code} · {selectedForm.title}</span></div><div className="form-definition quality-office-panel"><div className="form-definition-grid"><label>Kód formuláře<input value={selectedForm.code} onChange={(e)=>updateForm({code:e.target.value})}/></label><label>Název<input value={selectedForm.title} onChange={(e)=>updateForm({title:e.target.value})}/></label><label>Vyplňuje / odpovídá<select value={selectedForm.role} onChange={(e)=>{const r=e.target.value as Role;updateForm({role:r,roleLabel:roleLabel[r]??r});setQuestions((all)=>all.map((q)=>selectedForm.questionIds.includes(q.id)?{...q,answerRole:r,answerRoleLabel:roleLabel[r]??r}:q))}}>{Object.entries(roleLabel).map(([k,l])=><option value={k} key={k}>{l}</option>)}</select></label><label>Stav formuláře<select value={selectedForm.state ?? 'DRAFT'} onChange={(e)=>updateForm({state:e.target.value as ProcessForm['state']})}><option value="DRAFT">Koncept</option><option value="IN_PROGRESS">Rozpracováno</option><option value="SUBMITTED">Odesláno</option><option value="UNDER_REVIEW">Hodnoceno</option><option value="RETURNED">Vráceno</option><option value="CORRECTED">Opraveno</option><option value="ACCEPTED">Přijato</option><option value="CLOSED">Uzavřeno</option></select></label><label className="wide">Popis<input value={selectedForm.description} onChange={(e)=>updateForm({description:e.target.value})}/></label><label className="wide">Zdroj / šablona<input value={selectedForm.source} onChange={(e)=>updateForm({source:e.target.value})}/></label></div><div className="form-collaboration-panel"><div><strong>Vlastník a spolupracovníci</strong><label>Vlastník<select value={selectedForm.ownerPersonaId ?? ''} onChange={(e)=>updateForm({ownerPersonaId:e.target.value})}><option value="">Podle role</option>{participants.filter((p)=>p.role===selectedForm.role).map((p)=><option key={p.personaId} value={p.personaId}>{p.name}</option>)}</select></label><div className="collaborator-chips">{participants.filter((p)=>p.personaId!==selectedForm.ownerPersonaId).map((p)=><label key={p.personaId}><input type="checkbox" checked={(selectedForm.collaboratorPersonaIds??[]).includes(p.personaId)} onChange={(e)=>updateForm({collaboratorPersonaIds:e.target.checked?[...(selectedForm.collaboratorPersonaIds??[]),p.personaId]:(selectedForm.collaboratorPersonaIds??[]).filter((id)=>id!==p.personaId)})}/>{p.name}</label>)}</div></div><div><strong>Hodnocení / rubrika</strong><label>Rubrika<select value={selectedForm.rubricId ?? ''} onChange={(e)=>updateForm({rubricId:e.target.value || undefined})}><option value="">Bez rubriky</option>{rubrics.map((r)=><option value={r.id} key={r.id}>{r.title}</option>)}</select></label>{selectedForm.role==='HODNOTITEL_PS'&&<label>Více hodnotitelů<select value={selectedForm.multiReviewerMode ?? 'INDIVIDUAL'} onChange={(e)=>updateForm({multiReviewerMode:e.target.value as ProcessForm['multiReviewerMode']})}><option value="INDIVIDUAL">Každý vlastní kopii</option><option value="SINGLE_SHARED">Jeden společný formulář</option><option value="ASSIGNED_SECTIONS">Přidělené sekce</option></select></label>}</div></div><div className="form-definition-actions"><label><input type="checkbox" checked={selectedForm.required} onChange={(e)=>updateForm({required:e.target.checked})}/> povinný formulář</label><button className="vut-secondary-button" type="button" onClick={()=>setShowPreviousForms((v)=>!v)}>⧉ Zkopírovat z předchozích</button><button className="vut-primary-button" type="button" onClick={addQuestion}>+ Přidat otázku</button></div></div>
      {showPreviousForms && <section className="previous-form-library quality-office-panel"><h2>Zkopírovat z předchozího procesu</h2>{previousForms.length?<><label>Předchozí proces<select value={copySource?.id??''} onChange={(e)=>setCopySourceId(e.target.value)}>{previousForms.map((p)=><option value={p.id} key={p.id}>{p.programmeCode} · {p.title}</option>)}</select></label><p>Budou převzaty otázky odpovídající roli <strong>{selectedForm.roleLabel}</strong>.</p><button className="vut-primary-button" type="button" onClick={copyFromPrevious}>Převzít do tohoto formuláře</button></>:<p>Zatím není dostupný žádný předchozí proces.</p>}</section>}
      <div className="template-editor-layout process-form-builder"><aside className="question-list"><div className="question-list-heading">{selectedForm.code} · OTÁZKY <span>{formQuestions.length}</span></div>{formQuestions.map((q)=><button key={q.id} type="button" className={selectedQuestion?.id===q.id?'selected':''} onClick={()=>setSelectedQuestionId(q.id)}><strong>{q.id}</strong><span>{q.section}</span><small>{q.question}</small></button>)}<button className="question-add" type="button" onClick={addQuestion}>+ Přidat otázku</button></aside>{selectedQuestion?<section className="question-editor quality-office-panel"><div className="question-editor-topline"><span>EDITACE POLOŽKY</span><span>{selectedQuestion.required?'Povinná':'Nepovinná'}</span></div><div className="question-editor-actions"><button className="vut-secondary-button" type="button" onClick={duplicateQuestion}>⧉ Duplikovat</button><button className="vut-danger-button" type="button" onClick={deleteQuestion}>Smazat otázku</button></div><div className="question-editor-grid"><label>ID otázky<input value={selectedQuestion.id} onChange={(e)=>updateQuestionId(e.target.value)}/></label><label>Oblast / sekce<input value={selectedQuestion.section} onChange={(e)=>updateQuestion({section:e.target.value})}/></label></div><label>Otázka<textarea rows={4} value={selectedQuestion.question} onChange={(e)=>updateQuestion({question:e.target.value})}/></label><label>Metodická nápověda<textarea rows={2} value={selectedQuestion.helpText ?? ''} onChange={(e)=>updateQuestion({helpText:e.target.value})} placeholder="Co má respondent doložit nebo vysvětlit…"/></label><div className="question-editor-grid"><label>Typ odpovědi<select value={selectedQuestion.type} onChange={(e)=>updateQuestion({type:e.target.value as ProcessQuestion['type']})}><option>Krátký text</option><option>Dlouhý text</option><option>Rich text</option><option>Ano / Ne</option><option>Ano / částečně / ne / N/R</option><option>Jedna možnost</option><option>Více možností</option><option>Číslo</option><option>Datum</option><option>Tabulka</option><option>Dokument</option><option>Odkaz</option></select></label><label>Vyplňuje<input value={selectedForm.roleLabel} readOnly/></label></div>{['Krátký text','Dlouhý text','Rich text'].includes(selectedQuestion.type) && <label>Maximální počet znaků<input type="number" min="1" placeholder="Bez omezení" value={selectedQuestion.maxCharacters ?? ''} onChange={(e)=>updateQuestion({maxCharacters:e.target.value ? Math.max(1, Number(e.target.value)) : undefined})}/><small className="field-help">Prázdné pole = bez omezení délky odpovědi.</small></label>}{['Jedna možnost','Více možností'].includes(selectedQuestion.type)&&<label>Možnosti odpovědi<input value={(selectedQuestion.options??[]).join(' | ')} onChange={(e)=>updateQuestion({options:e.target.value.split('|').map((x)=>x.trim()).filter(Boolean)})} placeholder="Možnost A | Možnost B | Možnost C"/></label>}<label className="checkbox-row"><input type="checkbox" checked={selectedQuestion.evidenceRequired ?? false} onChange={(e)=>updateQuestion({evidenceRequired:e.target.checked})}/> Vyžadovat důkaz / přílohu</label><label className="checkbox-row"><input type="checkbox" checked={selectedQuestion.required} onChange={(e)=>updateQuestion({required:e.target.checked})}/> Povinná odpověď před předáním</label><div className="question-preview"><span>NÁHLED PRO ROLI: {selectedForm.roleLabel}</span><strong>{selectedQuestion.id} · {selectedQuestion.section}</strong><p>{selectedQuestion.question}</p><div className="fake-answer-field">Prostor pro odpověď…{['Krátký text','Dlouhý text','Rich text'].includes(selectedQuestion.type) && selectedQuestion.maxCharacters ? ` · max. ${selectedQuestion.maxCharacters} znaků` : ''}</div></div></section>:<section className="question-editor quality-office-panel empty-question-editor"><strong>Formulář zatím nemá žádnou otázku.</strong><button className="vut-primary-button" type="button" onClick={addQuestion}>+ Přidat první otázku</button></section>}</div></>}</div>}
    {builderStep === 'Dokumenty' && <section className="quality-office-panel builder-panel"><div className="builder-panel-actions"><PanelHeader title="Dokumenty a metodické podklady" subtitle="Podklady procesu."/><button className="vut-secondary-button" type="button" onClick={addDocument}>+ Přidat dokument</button></div><div className="document-builder-list">{documents.map((d)=><div className="document-builder-row" key={d.id}><div className="document-icon">▤</div><label>Název<input value={d.title} onChange={(e)=>setDocuments((all)=>all.map((x)=>x.id===d.id?{...x,title:e.target.value}:x))}/></label><label>Typ<input value={d.kind} readOnly/></label><label>Viditelnost<input value={d.visibility} readOnly/></label></div>)}</div></section>}
    {builderStep === 'Pravidla a výstupy' && <section className="quality-office-panel builder-panel"><PanelHeader title="Pravidla dokončení a výstupy" subtitle="Co musí být splněno před předáním a co na konci procesu vznikne."/><div className="rules-output-grid"><div><h3>Podmínky předání</h3><label className="rule-check"><input type="checkbox" defaultChecked/> všechny povinné formuláře jsou dokončené</label><label className="rule-check"><input type="checkbox" defaultChecked/> všechny povinné otázky jsou vyplněné</label><label className="rule-check"><input type="checkbox" defaultChecked/> neexistují blokující připomínky</label></div><div><h3>Výstupy procesu</h3>{forms.map((form)=><label className="rule-check" key={form.id}><input type="checkbox" defaultChecked={form.required}/> {form.code} · {form.title}</label>)}</div></div></section>}
    {builderStep === 'Pravidla a výstupy' && <section className="quality-office-panel rubric-builder-panel"><div className="builder-panel-actions"><PanelHeader title="Rubriky a review tasks" subtitle="Předdefinované hodnoticí škály a konkrétní úkoly hodnotitelům."/><button className="vut-secondary-button" type="button" onClick={()=>setRubrics((all)=>[...all,{id:`rubric-${Date.now()}`,title:'Nová rubrika',description:'Vlastní hodnoticí rubrika',levels:[{code:'A',label:'Splněno',descriptor:''},{code:'N',label:'Nesplněno',descriptor:''}]}])}>+ Nová rubrika</button></div><div className="rubric-grid">{rubrics.map((rubric)=><article key={rubric.id}><input value={rubric.title} onChange={(e)=>setRubrics((all)=>all.map((r)=>r.id===rubric.id?{...r,title:e.target.value}:r))}/><textarea rows={2} value={rubric.description} onChange={(e)=>setRubrics((all)=>all.map((r)=>r.id===rubric.id?{...r,description:e.target.value}:r))}/>{rubric.levels.map((level,idx)=><div className="rubric-level-row" key={`${rubric.id}-${idx}`}><input value={level.code} onChange={(e)=>setRubrics((all)=>all.map((r)=>r.id===rubric.id?{...r,levels:r.levels.map((l,i)=>i===idx?{...l,code:e.target.value}:l)}:r))}/><input value={level.label} onChange={(e)=>setRubrics((all)=>all.map((r)=>r.id===rubric.id?{...r,levels:r.levels.map((l,i)=>i===idx?{...l,label:e.target.value}:l)}:r))}/><input value={level.descriptor} onChange={(e)=>setRubrics((all)=>all.map((r)=>r.id===rubric.id?{...r,levels:r.levels.map((l,i)=>i===idx?{...l,descriptor:e.target.value}:l)}:r))}/></div>)}</article>)}</div><div className="review-task-list"><h3>Přidělené hodnoticí úkoly</h3>{reviewTasks.map((task)=><div key={task.id}><select value={task.reviewerPersonaId} onChange={(e)=>setReviewTasks((all)=>all.map((t)=>t.id===task.id?{...t,reviewerPersonaId:e.target.value}:t))}>{participants.filter((p)=>p.role==='HODNOTITEL_PS'||p.role==='PREDSEDA_PS').map((p)=><option value={p.personaId} key={p.personaId}>{p.name}</option>)}</select><select value={task.formId} onChange={(e)=>setReviewTasks((all)=>all.map((t)=>t.id===task.id?{...t,formId:e.target.value}:t))}>{forms.filter((f)=>f.role==='HODNOTITEL_PS').map((f)=><option value={f.id} key={f.id}>{f.code} · {f.title}</option>)}</select><input value={task.dueDate} onChange={(e)=>setReviewTasks((all)=>all.map((t)=>t.id===task.id?{...t,dueDate:e.target.value}:t))}/></div>)}</div></section>}
  </div>
}
function InlineDecisionClose({ process, persona, saveDecision, closeProcess, returnProcess }: { process: any; persona: DemoPersona; saveDecision: any; closeProcess: () => void; returnProcess: () => void }) {
  const [draft,setDraft]=useState<any>({authority:'Rada pro vnitřní hodnocení VUT',meetingDate:'',resolutionNumber:'',outcome:'SCHVALENO',effectiveDate:'',validFrom:'',validTo:'',conditions:'',conditionsDeadline:'',responsiblePerson:'',note:'',documentName:''})
  const patch=(key:string,value:string)=>setDraft((d:any)=>({...d,[key]:value}))
  const requiresValidity = process.decision?.outcome === 'SCHVALENO' || process.decision?.outcome === 'SCHVALENO_S_PODMINKOU'
  const canClose=Boolean(process.decision && process.decision.meetingDate && process.decision.resolutionNumber && process.decision.outcome !== 'VRACENO_K_DOPLNENI' && (!requiresValidity || (process.decision.validFrom && process.decision.validTo)))
  return <section className="inline-decision-close"><div className="content-review-banner"><strong>Poslední krok · Tajemník RVH</strong><span>Zapište formální rozhodnutí RVH. Teprve potom lze proces definitivně uzavřít a archivovat.</span></div><div className="builder-form-grid two"><label>Rozhodující orgán<input value={draft.authority} onChange={(e)=>patch('authority',e.target.value)}/></label><label>Datum jednání<input type="date" value={draft.meetingDate} onChange={(e)=>patch('meetingDate',e.target.value)}/></label><label>Číslo usnesení<input value={draft.resolutionNumber} onChange={(e)=>patch('resolutionNumber',e.target.value)}/></label><label>Výsledek<select value={draft.outcome} onChange={(e)=>patch('outcome',e.target.value)}><option value="SCHVALENO">Schváleno</option><option value="SCHVALENO_S_PODMINKOU">Schváleno s podmínkou</option><option value="VRACENO_K_DOPLNENI">Vráceno k doplnění</option><option value="NESCHVALENO">Neschváleno</option><option value="JINE">Jiné</option></select></label><label>Datum účinnosti<input type="date" value={draft.effectiveDate} onChange={(e)=>patch('effectiveDate',e.target.value)}/></label><label>Odpovědná osoba<input value={draft.responsiblePerson} onChange={(e)=>patch('responsiblePerson',e.target.value)}/></label><label>Platnost od<input type="date" value={draft.validFrom} onChange={(e)=>patch('validFrom',e.target.value)}/></label><label>Platnost do<input type="date" value={draft.validTo} onChange={(e)=>patch('validTo',e.target.value)}/></label><label>Termín splnění podmínek<input type="date" value={draft.conditionsDeadline} onChange={(e)=>patch('conditionsDeadline',e.target.value)}/></label><label>Rozhodnutí / zápis<input value={draft.documentName} onChange={(e)=>patch('documentName',e.target.value)} placeholder="Usneseni_RVH.pdf"/></label></div><label>Podmínky / omezení<textarea rows={3} value={draft.conditions} onChange={(e)=>patch('conditions',e.target.value)}/></label><label>Poznámka / odůvodnění<textarea rows={3} value={draft.note} onChange={(e)=>patch('note',e.target.value)}/></label><div className="process-controls"><button className="vut-secondary-button" type="button" onClick={returnProcess}>← Vrátit k doplnění</button><button className="vut-secondary-button" type="button" onClick={()=>saveDecision(process.id,draft,persona.name)}>Uložit rozhodnutí</button><button className="vut-primary-button" disabled={!canClose} type="button" onClick={closeProcess}>Uzavřít proces a archivovat</button></div>{!canClose&&<small className="field-help">Pro uzavření nejprve uložte konečné rozhodnutí s datem jednání a číslem usnesení; u schválení také vyplňte platnost od–do. Výsledek „Vráceno k doplnění“ proces neuzavírá.</small>}</section>
}

function ProcessesView({ currentPersona }: { currentPersona: DemoPersona }) {
  const { processes, advanceProcess, returnProcess, resetDemoProcesses, deleteProcess, addReviewRequest, saveDecision } = useQualityProcesses()
  const [builderDrafts, setBuilderDrafts] = useState<SavedBuilderDraft[]>(loadBuilderDrafts)
  useEffect(() => { const refresh=()=>setBuilderDrafts(loadBuilderDrafts()); window.addEventListener('vut-builder-drafts-changed',refresh); return () => window.removeEventListener('vut-builder-drafts-changed',refresh) }, [])
  const preferredProcess = processes.find((process) => process.status === 'ACTIVE' && process.workflow[process.currentStepIndex]?.personaId === currentPersona.id) ?? processes[0]
  const [selectedId, setSelectedId] = useState<string | null>(preferredProcess?.id ?? null)
  const [detailTab, setDetailTab] = useState<'Workflow' | 'Formuláře' | 'Obsah' | 'Dokumenty' | 'Připomínky' | 'Auditní stopa'>('Workflow')
  useEffect(() => {
    const mine = processes.find((process) => process.status === 'ACTIVE' && process.workflow[process.currentStepIndex]?.personaId === currentPersona.id)
    if (mine) { setSelectedId(mine.id); setDetailTab('Workflow') }
  }, [currentPersona.id])
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { comment: string; targetPersonaId: string; dueDate: string }>>({})
  const selected = useMemo(() => processes.find((process) => process.id === selectedId) ?? processes[0], [processes, selectedId])
  if (!processes.length && !builderDrafts.length) return <SimplePage title="Procesy" eyebrow="ŘÍZENÍ KVALITY"><p>Zatím nebyl vytvořen ani uložen žádný proces. V Návrháři procesů můžete návrh uložit jako rozpracovaný nebo jej publikovat.</p></SimplePage>
  const currentStep = selected?.workflow[selected.currentStepIndex]
  const isMyTurn = currentStep?.personaId === currentPersona.id && selected.status === 'ACTIVE'

  const questionRows = selected ? selected.questions.map((question) => {
    const participantAnswers = selected.participants
      .map((participant) => ({ participant, value: selected.answers[participant.personaId]?.[question.id] ?? '' }))
      .filter((item) => item.value)
    return { question, participantAnswers }
  }) : []

  const sendReviewRequest = (questionId: string) => {
    if (!selected) return
    const draft = reviewDrafts[questionId]
    if (!draft?.comment || !draft.targetPersonaId) return
    const target = selected.participants.find((item) => item.personaId === draft.targetPersonaId)
    if (!target) return
    addReviewRequest(selected.id, {
      questionId,
      targetPersonaId: target.personaId,
      targetName: target.name,
      requestedByPersonaId: currentPersona.id,
      requestedByName: currentPersona.name,
      comment: draft.comment,
      dueDate: draft.dueDate,
    })
    setReviewDrafts((current) => ({ ...current, [questionId]: { comment: '', targetPersonaId: draft.targetPersonaId, dueDate: draft.dueDate } }))
  }

  return <div className="content-frame quality-office-page"><PageHeading eyebrow="ŘÍZENÍ KVALITY" title="Procesy studijních programů" description="Workflow, kompletní obsah procesu, dokumenty, připomínky a auditní stopa na jednom místě." /><div className="quality-office-grid process-master-detail"><section className="quality-office-panel"><div className="builder-panel-actions"><PanelHeader title="Procesy" subtitle="Aktivní a dokončené případy" /><button className="vut-secondary-button" type="button" onClick={resetDemoProcesses}>Vymazat demo</button></div>{builderDrafts.length>0 && <div className="process-draft-group"><span>ROZPRACOVANÉ</span>{builderDrafts.map((draft)=><div className="process-select draft" key={draft.id}><strong>{draft.data.programmeCode} · {draft.data.title}</strong><span>{draft.data.processType}</span><small>Rozpracované · {draft.savedBy} · {draft.savedAt}</small><em>Otevřete v Návrháři procesů</em></div>)}</div>}{processes.map((process) => <button type="button" key={process.id} className={`process-select ${selected?.id === process.id ? 'selected' : ''}`} onClick={() => { setSelectedId(process.id); setDetailTab('Workflow') }}><strong>{process.programmeCode} · {process.title}</strong><span>{process.processType}</span><small>{process.status === 'COMPLETED' ? 'Uzavřeno' : `${process.workflow[process.currentStepIndex]?.roleLabel} · ${process.workflow[process.currentStepIndex]?.deadline}`}</small>{process.reviewRequests.some((request) => request.status === 'OPEN') && <em>{process.reviewRequests.filter((request) => request.status === 'OPEN').length} otevřené připomínky</em>}</button>)}</section>{selected && <section className="quality-office-panel process-inspector"><div className="builder-panel-actions"><PanelHeader title={`${selected.programmeCode} · ${selected.title}`} subtitle={selected.status === 'COMPLETED' ? 'Proces uzavřen' : `Aktuální krok: ${currentStep?.title}`} /><button className="vut-danger-button" type="button" onClick={() => { if (window.confirm(`Opravdu chcete smazat proces „${selected.title}“? Tato akce odstraní i uložené odpovědi, připomínky a auditní stopu tohoto demo procesu.`)) { deleteProcess(selected.id); setSelectedId('') } }}>Smazat proces</button></div>
    <div className="process-inspector-tabs">{(['Workflow','Formuláře','Obsah','Dokumenty','Připomínky','Auditní stopa'] as const).map((tab) => <button type="button" className={detailTab === tab ? 'active' : ''} onClick={() => setDetailTab(tab)} key={tab}>{tab}</button>)}</div>

    {detailTab === 'Workflow' && <><div className="workflow-step-list">{selected.workflow.map((step, index) => <div className={`workflow-step ${selected.status === 'COMPLETED' && index <= selected.currentStepIndex ? 'done' : index < selected.currentStepIndex ? 'done' : index === selected.currentStepIndex ? 'current' : ''}`} key={step.id}><span className="step-number">{index + 1}</span><div><strong>{step.title}</strong><small>{demoPersonas.find((item) => item.id === step.personaId)?.name} · {step.roleLabel}</small><div className="workflow-step-time">{(()=>{const events=selected.history.filter((h)=>h.stepId===step.id);const completed=events.filter((h)=>h.kind==='COMPLETED').at(-1);const returned=events.filter((h)=>h.kind==='RETURNED').at(-1);const started=index===0?selected.createdAt:(selected.history.filter((h)=>h.kind==='COMPLETED'&&selected.workflow.findIndex((x)=>x.id===h.stepId)===index-1).at(-1)?.at);return <>{started&&<span>Zahájeno: <b>{started}</b></span>}{completed&&<span>{selected.status === 'COMPLETED' && index === selected.currentStepIndex ? 'Uzavřeno' : 'Dokončeno'}: <b>{completed.at}</b> · {completed.actor}</span>}{returned&&<span>Vráceno: <b>{returned.at}</b> · {returned.actor}</span>}</>})()}</div></div><b>{selected.status === 'COMPLETED' && index === selected.currentStepIndex ? 'Uzavřeno' : index < selected.currentStepIndex ? 'Hotovo' : index === selected.currentStepIndex ? 'Probíhá' : 'Čeká'}</b></div>)}</div>{isMyTurn && currentPersona.id==='sofia-kovalevskaya' && selected.currentStepIndex===selected.workflow.length-1 ? <InlineDecisionClose process={selected} persona={currentPersona} saveDecision={saveDecision} closeProcess={()=>advanceProcess(selected.id,currentPersona.id,currentPersona.name)} returnProcess={()=>returnProcess(selected.id,currentPersona.id,currentPersona.name)}/> : isMyTurn && <div className="process-controls">{currentStep?.canReturn && selected.currentStepIndex > 0 && <button className="vut-secondary-button" type="button" onClick={() => returnProcess(selected.id, currentPersona.id, currentPersona.name)}>← Vrátit celý krok</button>}<button className="vut-primary-button" type="button" onClick={() => advanceProcess(selected.id, currentPersona.id, currentPersona.name)}>Uzavřít krok a předat →</button></div>}</>}

    {detailTab === 'Formuláře' && <div className="process-forms-inspector">
      <div className="content-review-banner"><strong>Formuláře tohoto procesu</strong><span>G a H jsou samostatné podkategorie jednoho běžícího procesu. Před zahájením je připravuje pracovník kvality; po publikaci se konkrétní verze používá pro všechny účastníky procesu.</span></div>
      <div className="process-form-cards">
        <article className="process-form-card preparation"><div className="process-form-code">G</div><div><span>PŘÍPRAVA</span><h3>Formulář garanta studijního programu</h3><p>{selected.questions.filter((q) => q.id.startsWith('G') || q.answerRole === 'GARANT_SP').length} číslovaných otázek · zdroj: metodika Studijní program budoucnosti</p><small>Primární příjemce: Garant SP</small></div></article>
        <article className="process-form-card review"><div className="process-form-code">H</div><div><span>HODNOCENÍ</span><h3>Formulář externího hodnotitele / pracovní skupiny</h3><p>{selected.questions.filter((q) => q.id.startsWith('H') || q.answerRole === 'HODNOTITEL_PS' || q.answerRole === 'PREDSEDA_PS').length} číslovaných otázek · zdroj: metodika Studijní program budoucnosti</p><small>Primární příjemce: Externí hodnotitel / hodnotitel PS</small></div></article>
      </div>
      <p className="quality-empty-note">Další formuláře pro studijní oddělení, děkana nebo vlastní typ procesu lze později přidat stejným mechanismem.</p>
    </div>}

    {detailTab === 'Obsah' && <div className="process-content-review"><div className="content-review-banner"><strong>Rektorátní kontrola obsahu</strong><span>Výstupy předchozích rolí jsou pouze pro čtení. Opravu vyžádejte u konkrétní položky; cizí odpověď nelze přepsat.</span></div>{questionRows.map(({ question, participantAnswers }) => {
      const defaultTarget = participantAnswers[0]?.participant.personaId ?? selected.participants.find((item) => item.role === question.answerRole)?.personaId ?? ''
      const draft = reviewDrafts[question.id] ?? { comment: '', targetPersonaId: defaultTarget, dueDate: '20. 11. 2027' }
      const requests = selected.reviewRequests.filter((request) => request.questionId === question.id)
      return <article className="content-review-question" key={question.id}><div className="content-review-question-head"><div><span>{question.id} · {question.section}</span><h3>{question.question}</h3></div><b>{question.answerRoleLabel}</b></div>
        {participantAnswers.length ? participantAnswers.map(({ participant, value }) => {
          const revisions = selected.answerHistory[participant.personaId]?.[question.id] ?? []
          const previous = revisions.length > 1 ? revisions[revisions.length - 2]?.newValue : revisions[0]?.previousValue
          return <div className="readonly-answer" key={participant.personaId}><div><strong>{participant.name}</strong><span>{participant.roleLabel}</span></div><p>{value}</p>{previous && previous !== value && <details><summary>Zobrazit předchozí znění</summary><p className="previous-answer">{previous}</p></details>}</div>
        }) : <p className="quality-empty-note">Zatím nebyla uložena odpověď.</p>}
        {requests.length > 0 && <div className="question-review-history">{requests.map((request) => <div className={request.status === 'OPEN' ? 'review-request open' : 'review-request resolved'} key={request.id}><strong>{request.status === 'OPEN' ? 'Čeká na doplnění' : 'Doplněno'} · {request.targetName}</strong><span>{request.createdAt} · termín {request.dueDate || '—'}</span><p>{request.comment}</p>{request.resolutionComment && <p><b>Vyjádření:</b> {request.resolutionComment}</p>}</div>)}</div>}
        <div className="question-return-box"><strong>Vyžádat doplnění této položky</strong><div className="question-return-grid"><label>Komu<select value={draft.targetPersonaId} onChange={(event) => setReviewDrafts((current) => ({ ...current, [question.id]: { ...draft, targetPersonaId: event.target.value } }))}>{selected.participants.filter((item) => item.role === question.answerRole || participantAnswers.some((answer) => answer.participant.personaId === item.personaId)).map((item) => <option value={item.personaId} key={item.personaId}>{item.name} · {item.roleLabel}</option>)}</select></label><label>Termín<input value={draft.dueDate} onChange={(event) => setReviewDrafts((current) => ({ ...current, [question.id]: { ...draft, dueDate: event.target.value } }))} /></label></div><textarea rows={3} value={draft.comment} onChange={(event) => setReviewDrafts((current) => ({ ...current, [question.id]: { ...draft, comment: event.target.value } }))} placeholder="Co přesně je potřeba doplnit nebo opravit…" /><button className="vut-secondary-button" type="button" disabled={!draft.comment || !draft.targetPersonaId} onClick={() => sendReviewRequest(question.id)}>Vrátit položku k doplnění →</button></div>
      </article>
    })}</div>}

    {detailTab === 'Dokumenty' && <div className="process-documents-inspector">{selected.documents.length ? selected.documents.map((document) => <div className="process-document-card" key={document.id}><span>▤</span><div><strong>{document.title}</strong><small>{document.kind} · viditelnost: {document.visibility}</small>{document.fileName && <b>{document.fileName}</b>}</div><em>{document.required ? 'Povinný podklad' : 'Doplňkový podklad'}</em></div>) : <p className="quality-empty-note">K procesu nejsou přiloženy žádné dokumenty.</p>}</div>}

    {detailTab === 'Připomínky' && <div className="process-comments-inspector"><h3>Stanoviska jednotlivých rolí</h3>{Object.entries(selected.stepComments).length ? Object.entries(selected.stepComments).map(([personaId, comment]) => { const person = demoPersonas.find((item) => item.id === personaId); return <div className="step-comment-card" key={personaId}><strong>{person?.name ?? personaId}</strong><span>{person?.title ?? ''}</span><p>{comment}</p></div> }) : <p className="quality-empty-note">Zatím nebyla uložena žádná stanoviska.</p>}<h3>Požadavky na doplnění</h3>{selected.reviewRequests.length ? selected.reviewRequests.map((request) => <div className={`review-request ${request.status === 'OPEN' ? 'open' : 'resolved'}`} key={request.id}><strong>{request.questionId} · {request.targetName}</strong><span>{request.requestedByName} · {request.createdAt} · termín {request.dueDate || '—'}</span><p>{request.comment}</p>{request.resolutionComment && <p><b>Vyjádření:</b> {request.resolutionComment}</p>}</div>) : <p className="quality-empty-note">Žádné požadavky na doplnění.</p>}</div>}

    {detailTab === 'Auditní stopa' && <div className="audit-trail-open">{selected.history.map((item, index) => <div key={`${item.at}-${index}`}><time>{item.at}</time><strong>{item.actor}</strong><span>{item.event}</span></div>)}</div>}
  </section>}</div></div>
}

function DeadlinesView(){const { processes }=useQualityProcesses();return <SimplePage title="Termíny a workflow" eyebrow="PROCESNÍ ŘÍZENÍ"><DataTable headers={['Proces','Aktuální krok','Odpovědná osoba','Termín','Stav']} rows={processes.map((process)=>{const step=process.workflow[process.currentStepIndex];return [process.title,step?.title??'—',demoPersonas.find((p)=>p.id===step?.personaId)?.name??'—',step?.deadline??'—',process.status==='COMPLETED'?'Uzavřeno':'Aktivní']})}/></SimplePage>}
function EvaluatorsView(){return <SimplePage title="Hodnotitelé" eyebrow="HODNOCENÍ"><DataTable headers={['Jméno','Instituce','Role','Typ']} rows={demoPersonas.filter((p)=>p.assignment.role==='HODNOTITEL_PS'||p.assignment.role==='PREDSEDA_PS').map((p)=>[p.name,p.institution,p.title,p.external?'Externí':'VUT'])}/></SimplePage>}
function CommentsView(){return <SimplePage title="Připomínky" eyebrow="REDAKČNÍ KOMUNIKACE"><p>Připomínky se v prototypu ukládají jako stanovisko aktuální role přímo u konkrétního procesu a jsou viditelné v dalších krocích.</p></SimplePage>}

function RvhView(){const { processes }=useQualityProcesses();return <SimplePage title="Podklady pro RVH" eyebrow="ROZHODOVACÍ PODPORA"><DataTable headers={['Proces','Typ','Stav','Poslední krok']} rows={processes.map((p)=>[p.title,p.processType,p.status==='COMPLETED'?'Uzavřeno':'Aktivní',p.status==='COMPLETED'?'Proces uzavřen':p.workflow[p.currentStepIndex]?.title??'—'])}/></SimplePage>}
function PortfolioView(){
  const { processes, getCurrentAccreditation }=useQualityProcesses()
  const programmeCodes=Array.from(new Set(processes.map((p)=>p.programmeCode))).filter(Boolean)
  return <div className="content-frame quality-office-page"><PageHeading eyebrow="VZDĚLÁVÁNÍ · PORTFOLIO" title="Portfolio studijních programů" description="Aktuální stav oprávnění je odvozen z formálního rozhodnutí konkrétního procesu; stav procesu a platnost akreditace jsou vedeny odděleně."/>
    <section className="quality-office-panel"><DataTable headers={['Program','Aktuální oprávnění','Platnost','Poslední usnesení','Zdrojový proces']} rows={programmeCodes.map((code)=>{const current=getCurrentAccreditation(code);return [code,current?(current.outcome==='SCHVALENO_S_PODMINKOU'?'Schváleno s podmínkou':'Schváleno'):'Bez evidovaného rozhodnutí',current?`${current.validFrom||'—'} – ${current.validTo||'—'}`:'—',current?.resolutionNumber||'—',current?.processTitle||'—']})}/></section>
    <section className="quality-office-panel"><PanelHeader title="Běžící a historické procesy" subtitle="Každý proces zůstává samostatným auditovatelným případem."/><DataTable headers={['Program','Proces','Typ','Stav']} rows={processes.map((p)=>[p.programmeCode,p.title,p.processType,p.status])}/></section>
  </div>
}


function FormLibraryView() {
  const { templates, addBlank, duplicate, remove, update } = useFormLibrary()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('Všechny role')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = templates.find((template) => template.id === selectedId)
  const filtered = templates.filter((template) => {
    const text = `${template.code} ${template.title} ${template.description} ${template.roleLabel} ${template.source}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (roleFilter === 'Všechny role' || template.roleLabel === roleFilter)
  })
  const createBlank = () => { const next = addBlank(); setSelectedId(next.id) }
  const duplicateAndOpen = (template: LibraryFormTemplate) => { const next = duplicate(template); setSelectedId(next.id) }
  const updateQuestion = (index: number, patch: Partial<ProcessQuestion>) => selected && update(selected.id, { questions: selected.questions.map((question, i) => i === index ? { ...question, ...patch } : question) })
  const addQuestion = () => {
    if (!selected) return
    const index = selected.questions.length + 1
    const q: ProcessQuestion = { id: `${selected.code}-X${index}`, section: 'Vlastní oblast', question: 'Nová otázka', type: 'Dlouhý text', required: false, answerRole: selected.role, answerRoleLabel: selected.roleLabel }
    update(selected.id, { questions: [...selected.questions, q] })
  }
  const deleteQuestion = (index: number) => selected && update(selected.id, { questions: selected.questions.filter((_, i) => i !== index) })

  return <div className="content-frame quality-office-page form-library-page">
    <PageHeading eyebrow="ŠABLONY A METODIKA" title="Knihovna formulářů" description="Centrální katalog znovupoužitelných a verzovaných formulářů. Konkrétní proces si vždy ukládá vlastní snapshot použité verze." />
    {!selected ? <>
      <section className="quality-office-panel library-toolbar"><div><label>Hledat<input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="G, H, RVH, studijní…"/></label><label>Role<select value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)}><option>Všechny role</option>{Array.from(new Set(templates.map((template)=>template.roleLabel))).map((label)=><option key={label}>{label}</option>)}</select></label></div><button className="vut-primary-button" type="button" onClick={createBlank}>+ Nová šablona formuláře</button></section>
      <div className="library-template-grid">{filtered.map((template)=><article className="library-template-card" key={template.id}><div className="library-template-code">{template.code}</div><div className="library-template-body"><span>{template.system?'SYSTÉMOVÁ ŠABLONA':'VLASTNÍ ŠABLONA'} · v{template.version} · {template.status}</span><h3>{template.title}</h3><p>{template.description}</p><div className="managed-form-meta"><b>{template.roleLabel}</b><span>{template.questions.length} otázek</span><span>{template.source}</span></div><div className="managed-form-actions"><button type="button" onClick={()=>setSelectedId(template.id)}>Otevřít →</button><button type="button" onClick={()=>duplicateAndOpen(template)}>{template.system?'Vytvořit pracovní kopii':'Duplikovat'}</button>{!template.system&&<button className="danger-link" type="button" onClick={()=>remove(template.id)}>Smazat</button>}</div></div></article>)}</div>
    </> : <>
      <div className="form-editor-breadcrumb"><button type="button" onClick={()=>setSelectedId(null)}>← Knihovna formulářů</button><span>{selected.code} · {selected.title}</span></div>
      {selected.system && <div className="archive-readonly-banner"><strong>Systémová šablona</strong><span>Původní metodickou verzi neupravujeme. Pro vlastní změny vytvořte pracovní kopii / novou verzi.</span><button className="vut-secondary-button" type="button" onClick={()=>duplicateAndOpen(selected)}>Vytvořit pracovní kopii</button></div>}
      <section className="quality-office-panel library-template-editor"><div className="form-definition-grid"><label>Kód<input disabled={selected.system} value={selected.code} onChange={(e)=>update(selected.id,{code:e.target.value})}/></label><label>Název<input disabled={selected.system} value={selected.title} onChange={(e)=>update(selected.id,{title:e.target.value})}/></label><label>Verze<input disabled={selected.system} value={selected.version} onChange={(e)=>update(selected.id,{version:e.target.value})}/></label><label>Stav<select disabled={selected.system} value={selected.status} onChange={(e)=>update(selected.id,{status:e.target.value as LibraryFormTemplate['status']})}><option value="DRAFT">DRAFT</option><option value="ACTIVE">ACTIVE</option><option value="RETIRED">RETIRED</option></select></label><label className="wide">Popis<input disabled={selected.system} value={selected.description} onChange={(e)=>update(selected.id,{description:e.target.value})}/></label><label className="wide">Zdroj<input disabled={selected.system} value={selected.source} onChange={(e)=>update(selected.id,{source:e.target.value})}/></label></div></section>
      <section className="quality-office-panel"><div className="builder-panel-actions"><PanelHeader title={`Otázky šablony · ${selected.questions.length}`} subtitle="Otázky z centrální knihovny se při použití do procesu zkopírují jako snapshot." />{!selected.system&&<button className="vut-primary-button" type="button" onClick={addQuestion}>+ Přidat otázku</button>}</div><div className="library-question-list">{selected.questions.map((question,index)=><article key={`${question.id}-${index}`}><div className="library-question-head"><b>{question.id}</b><span>{question.section}</span>{!selected.system&&<button className="danger-link" type="button" onClick={()=>deleteQuestion(index)}>Smazat</button>}</div><textarea disabled={selected.system} rows={3} value={question.question} onChange={(e)=>updateQuestion(index,{question:e.target.value})}/><div className="question-editor-grid"><label>Typ<select disabled={selected.system} value={question.type} onChange={(e)=>updateQuestion(index,{type:e.target.value as ProcessQuestion['type']})}><option>Krátký text</option><option>Dlouhý text</option><option>Rich text</option><option>Ano / Ne</option><option>Ano / částečně / ne / N/R</option><option>Jedna možnost</option><option>Více možností</option><option>Číslo</option><option>Datum</option><option>Tabulka</option><option>Dokument</option><option>Odkaz</option></select></label><label>Max. znaků<input disabled={selected.system || !['Krátký text','Dlouhý text','Rich text'].includes(question.type)} type="number" value={question.maxCharacters ?? ''} onChange={(e)=>updateQuestion(index,{maxCharacters:e.target.value?Number(e.target.value):undefined})}/></label></div></article>)}</div></section>
    </>}
  </div>
}

function ArchiveView({ externalReadOnly = false }: { externalReadOnly?: boolean }) {
  const { processes } = useQualityProcesses()
  const [faculty, setFaculty] = useState('Všechny')
  const [programme, setProgramme] = useState('Všechny')
  const [processTypeFilter, setProcessTypeFilter] = useState('Všechny')
  const [year, setYear] = useState('Všechny')
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null)

  const archived = processes.filter((p) => p.status === 'COMPLETED').map((p) => {
    const closeEvent = [...p.history].reverse().find((h) => h.kind === 'COMPLETED' && h.stepId === p.workflow[p.currentStepIndex]?.id)
    const decision = p.decision
    const facultyCode = p.faculty || p.scope?.match(/·\s*([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]{2,8})\s*$/)?.[1] || 'VUT'
    const programmeTitle = p.programmeName || p.scope?.split('·')?.[1]?.trim() || p.programmeCode
    const closeYear = (decision?.meetingDate || decision?.effectiveDate || closeEvent?.at || '').match(/\d{4}/)?.[0] || '—'
    return { id:p.id, faculty:facultyCode, facultyName:p.facultyName||facultyLongName(facultyCode), cooperatingFaculties:p.cooperatingFaculties??[], programme:p.programmeCode, programmeName:programmeTitle, processType:p.processType, year:closeYear, closedAt:closeEvent?.at??'—', decisionLabel:decision?.outcome?decision.outcome.replaceAll('_',' '):'Bez evidovaného rozhodnutí', process:p }
  })

  const facultyOptions=Array.from(new Set(archived.map((r)=>r.faculty))).sort()
  const programmeOptions=Array.from(new Set(archived.map((r)=>r.programme))).sort()
  const processTypeOptions=Array.from(new Set(archived.map((r)=>r.processType))).sort()
  const yearOptions=Array.from(new Set(archived.map((r)=>r.year))).sort().reverse()
  const records=archived.filter((r)=>(faculty==='Všechny'||r.faculty===faculty||r.cooperatingFaculties.includes(faculty))&&(programme==='Všechny'||r.programme===programme)&&(processTypeFilter==='Všechny'||r.processType===processTypeFilter)&&(year==='Všechny'||r.year===year))

  const grouped=records.reduce<Record<string,Record<string,typeof records>>>((acc,record)=>{acc[record.faculty]??={};acc[record.faculty][record.programme]??=[];acc[record.faculty][record.programme].push(record);return acc},{})
  const selectedRecord=archived.find((r)=>r.id===selectedArchiveId)
  const selectedProcess=selectedRecord?.process

  return <div className="content-frame quality-office-page">
    <PageHeading eyebrow={externalReadOnly?'EXTERNÍ PŘÍSTUP · POUZE PRO ČTENÍ':'ŘÍZENÍ KVALITY · INSTITUCIONÁLNÍ PAMĚŤ'} title="Archiv hodnocení studijních programů" description="Archiv je uspořádán Fakulta → Studijní program → Uzavřené procesy. Jeden uzavřený proces představuje jeden neměnný case file."/>
    {externalReadOnly&&<div className="archive-readonly-banner"><strong>Režim pouze pro čtení</strong><span>Vidíte pouze uzavřené případy v rozsahu zpřístupněném VUT. Aktivní procesy a pracovní administrace nejsou dostupné.</span></div>}
    <section className="quality-office-panel archive-filters">
      <label>Fakulta<select value={faculty} onChange={(e)=>setFaculty(e.target.value)}><option>Všechny</option>{facultyOptions.map((item)=><option key={item}>{item}</option>)}</select></label>
      <label>Studijní program<select value={programme} onChange={(e)=>setProgramme(e.target.value)}><option>Všechny</option>{programmeOptions.map((item)=><option key={item}>{item}</option>)}</select></label>
      <label>Typ procesu<select value={processTypeFilter} onChange={(e)=>setProcessTypeFilter(e.target.value)}><option>Všechny</option>{processTypeOptions.map((item)=><option key={item}>{item}</option>)}</select></label>
      <label>Rok uzavření<select value={year} onChange={(e)=>setYear(e.target.value)}><option>Všechny</option>{yearOptions.map((item)=><option key={item}>{item}</option>)}</select></label>
    </section>
    <section className="quality-office-panel">
      <div className="archive-table-head"><div><h2>Archivní struktura</h2><p>{records.length} uzavřených případů odpovídá zvoleným filtrům.</p></div>{!externalReadOnly&&<button className="vut-secondary-button" type="button">+ Připravit balíček pro evaluátora</button>}</div>
      {!records.length&&<p className="quality-empty-note">Archiv je prázdný. Case file vznikne až formálním uzavřením procesu.</p>}
      <div className="archive-hierarchy">{Object.entries(grouped).map(([facultyCode,programmeGroups])=><div className="archive-faculty-group" key={facultyCode}>
        <div className="archive-group-heading"><strong>{facultyCode}</strong><span>{facultyLongName(facultyCode)}</span><em>{Object.values(programmeGroups).flat().length} případů</em></div>
        {Object.entries(programmeGroups).map(([programmeCode,cases])=><div className="archive-programme-group" key={programmeCode}>
          <div className="archive-programme-heading"><strong>{programmeCode} · {cases[0]?.programmeName}</strong><span>{cases.length} uzavřených procesů</span></div>
          <div className="archive-case-list">{cases.map((record)=><button type="button" key={record.id} className={`process-select ${selectedArchiveId===record.id?'selected':''}`} onClick={()=>setSelectedArchiveId(record.id)}><strong>{record.processType}</strong><span>Uzavřeno {record.closedAt}</span><small>{record.decisionLabel}</small><em>Otevřít case file →</em></button>)}</div>
        </div>)}
      </div>)}</div>
    </section>
    {selectedProcess&&<section className="quality-office-panel archive-snapshot">
      <div className="archive-table-head"><div><h2>Case file · {selectedProcess.programmeCode}</h2><p>{selectedProcess.title} · {selectedProcess.faculty??selectedRecord?.faculty} · pouze pro čtení</p></div><b>UZAVŘENO</b></div>
      <div className="archive-content-grid"><span>Formuláře: {(selectedProcess.forms??[]).length}</span><span>Dokumenty: {selectedProcess.documents.length}</span><span>Připomínky: {selectedProcess.reviewRequests.length}</span><span>Auditní události: {selectedProcess.history.length}</span><span>Rozhodnutí RVH: {selectedProcess.decision?'ano':'ne'}</span><span>Historie rozhodnutí: {(selectedProcess.decisionHistory??[]).length}</span></div>
      {selectedProcess.decision&&<DataTable headers={['Orgán','Datum jednání','Usnesení','Výsledek','Platnost','Dokument']} rows={[[selectedProcess.decision.authority||'—',selectedProcess.decision.meetingDate||'—',selectedProcess.decision.resolutionNumber||'—',selectedProcess.decision.outcome.replaceAll('_',' '),`${selectedProcess.decision.validFrom||'—'} – ${selectedProcess.decision.validTo||'—'}`,selectedProcess.decision.documentName||'—']]}/>}
      <h3>Dokumenty případu</h3><DataTable headers={['Dokument','Typ','Soubor']} rows={selectedProcess.documents.length?selectedProcess.documents.map((d)=>[d.title,d.kind,d.fileName??'—']):[['—','—','Bez připojených dokumentů']]}/>
      <h3>Historie procesu</h3><DataTable headers={['Datum a čas','Osoba','Událost']} rows={selectedProcess.history.map((h)=>[h.at,h.actor,h.event])}/>
      <p>Archivní case file je neměnný. Nová evaluace, změna nebo reakreditace vytváří nový proces a po jeho uzavření nový samostatný archivní záznam.</p>
    </section>}
  </div>
}

function ExternalAccessView(){
 const [scope,setScope]=useState('Celé VUT · vybrané archivní záznamy')
 return <div className="content-frame quality-office-page"><PageHeading eyebrow="ŘÍZENÍ KVALITY · EXTERNÍ EVALUACE" title="Externí přístupy" description="Časově omezené read-only přístupy k vybraným částem archivu pro EUA / IEP, NAÚ a další externí hodnotitele."/><section className="quality-office-panel"><div className="archive-table-head"><div><h2>Aktivní přístupy</h2><p>Externí účet nevidí návrhář procesů ani aktivní interní komunikaci.</p></div><button className="vut-primary-button" type="button">+ Nový externí přístup</button></div><DataTable headers={['Evaluátor','Organizace','Rozsah','Platnost','Oprávnění']} rows={[[ 'EUA / IEP Evaluator','European University Association',scope,'1. 3. 2029 – 30. 6. 2029','Pouze čtení' ],['NAÚ hodnotitel','NAÚ','N-PI · akreditace + evaluace 2025–2028','1. 9. 2028 – 31. 12. 2028','Pouze čtení']]}/></section><section className="quality-office-panel external-access-editor"><h2>Nastavení zpřístupnění</h2><div className="builder-form-grid two"><label>Rozsah<select value={scope} onChange={(e)=>setScope(e.target.value)}><option>Celé VUT · vybrané archivní záznamy</option><option>Jedna fakulta</option><option>Jeden studijní program</option><option>Jeden hodnoticí proces</option><option>Kurátorovaný balíček</option></select></label><label>Režim<input value="Pouze čtení" readOnly/></label></div><div className="external-permission-grid"><label><input type="checkbox" defaultChecked/> Akreditace</label><label><input type="checkbox" defaultChecked/> Roční evaluace</label><label><input type="checkbox" defaultChecked/> Dokumenty</label><label><input type="checkbox" defaultChecked/> Zjištění a opatření</label><label><input type="checkbox"/> Interní komentáře</label><label><input type="checkbox"/> Osobní údaje</label></div></section></div>
}

function GuarantorQualityWorkspace({ section, persona }: { section: string; persona: DemoPersona }) {
  const { getCurrentAccreditation, getProgrammeDecisionHistory } = useQualityProcesses()
  if (section === 'Rada SP') return <SimplePage title="Rada studijního programu" eyebrow="ŘÍZENÍ KVALITY SP"><ActionRow title="Jednání Rady SP · 12. 12. 2027" meta="Rozpracovaný zápis · 2 otevřené problémy" action="Otevřít zápis →" /></SimplePage>
  if (section === 'Roční evaluace') return <SimplePage title="Roční evaluace SP" eyebrow="ŘÍZENÍ KVALITY SP"><div className="annual-eval-card"><strong>Roční evaluace 2027</strong><span>Data VUT připravena</span><span>Interpretace garanta rozpracována</span><span>Závěr rady SP čeká</span></div></SimplePage>
  if (section === 'Zjištění a opatření') return <SimplePage title="Zjištění a opatření" eyebrow="QUALITY LOOP"><DataTable headers={['Zjištění','Opatření','Odpovědnost','Termín','Stav']} rows={[[ 'Průchodnost ve 2. ročníku','Revize návaznosti předmětů','Garant SP','30. 6. 2028','V řešení' ]]}/></SimplePage>
  if (section === 'Historie') return <SimplePage title="Historie kvality SP" eyebrow="AUDITNÍ STOPA"><ActionRow title="21. 8. 2027 · vytvořeno opatření A014" meta="Zdroj: Rada SP" action="Detail →" /></SimplePage>
  if (section === 'Akreditace a rozhodnutí') { const code=persona.assignment.scopeId ?? 'N-PI'; const current=getCurrentAccreditation(code); const history=getProgrammeDecisionHistory(code); return <div className="content-frame quality-office-page"><PageHeading eyebrow="STUDIJNÍ PROGRAM · FORMÁLNÍ STAV" title="Akreditace a rozhodnutí" description="Garant vidí formální stav svého programu pouze pro čtení. Zdrojovým záznamem je vždy rozhodnutí uložené u konkrétního procesu."/>{current?<section className="quality-office-panel"><PanelHeader title="Aktuální oprávnění" subtitle={`Zdroj: ${current.processTitle}`}/><div className="decision-summary-grid"><div><span>Stav</span><strong>{current.outcome==='SCHVALENO_S_PODMINKOU'?'Schváleno s podmínkou':'Schváleno'}</strong></div><div><span>Platnost</span><strong>{current.validFrom||'—'} – {current.validTo||'—'}</strong></div><div><span>Usnesení</span><strong>{current.resolutionNumber||'—'}</strong></div><div><span>Účinnost</span><strong>{current.effectiveDate||'—'}</strong></div></div>{current.conditions&&<p><b>Podmínky:</b> {current.conditions}</p>}</section>:<section className="quality-office-panel"><p>Pro program {code} zatím není evidováno schvalující rozhodnutí.</p></section>}<section className="quality-office-panel"><PanelHeader title="Historie rozhodnutí programu" subtitle="Neměnná časová řada rozhodnutí a změn."/><DataTable headers={['Proces','Usnesení','Výsledek','Platnost','Dokument']} rows={history.map((d)=>[d.processTitle,d.resolutionNumber||'—',d.outcome,`${d.validFrom||'—'} – ${d.validTo||'—'}`,d.documentName||'—'])}/></section></div> }
  return <div className="content-frame quality-office-page"><PageHeading eyebrow="ŘÍZENÍ KVALITY SP" title="Kvalita mého studijního programu" description="Průběžná práce Rady SP, roční evaluace, zjištění, opatření a jejich účinnost."/><div className="quality-office-metrics"><Metric value="2" label="Otevřená zjištění"/><Metric value="3" label="Aktivní opatření"/><Metric value="1" label="Čeká na ověření"/><Metric value="2027" label="Aktuální evaluace"/></div></div>
}

function SimplePage({title,eyebrow,children}:{title:string;eyebrow:string;children:ReactNode}){return <div className="content-frame quality-office-page"><PageHeading eyebrow={eyebrow} title={title} description=""/><section className="quality-office-panel">{children}</section></div>}
function PageHeading({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <div className="quality-page-heading"><span>{eyebrow}</span><h1>{title}</h1>{description&&<p>{description}</p>}</div>}
function PanelHeader({title,subtitle}:{title:string;subtitle:string}){return <div className="quality-panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div></div>}
function Metric({value,label}:{value:string;label:string}){return <div className="quality-metric"><strong>{value}</strong><span>{label}</span></div>}
function ActionRow({title,meta,action}:{title:string;meta:string;action:string}){return <div className="quality-action-row"><div><strong>{title}</strong><span>{meta}</span></div><button type="button">{action}</button></div>}
function DataTable({headers,rows}:{headers:string[];rows:string[][]}){return <div className="quality-table-wrap"><table className="quality-data-table"><thead><tr>{headers.map((h)=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}

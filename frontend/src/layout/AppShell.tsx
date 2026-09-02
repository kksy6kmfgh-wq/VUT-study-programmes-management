import { useEffect, useState, type ReactNode } from 'react'
import type { Role } from '../auth/roles'
import type { DemoPersona } from '../auth/demoPersonas'
import { scopeLabels } from '../presentation/roleLabels'
import { QualityWorkspacePage } from '../pages/QualityWorkspacePage'
import { AssignedProcessPage } from '../pages/AssignedProcessPage'

export type Workspace = 'PREPARATION' | 'REVIEW' | 'QUALITY'

type AppShellProps = {
  activeSection: string
  onNavigate: (section: string) => void
  persona: DemoPersona
  personas: DemoPersona[]
  onPersonaChange: (personaId: string) => void
  children: ReactNode
}

const workspaceLabels: Record<Workspace, string> = {
  PREPARATION: 'Příprava a správa SP',
  REVIEW: 'Hodnocení SP',
  QUALITY: 'Řízení kvality VUT',
}

const workspaceShortLabels: Record<Workspace, string> = {
  PREPARATION: 'Příprava',
  REVIEW: 'Hodnocení',
  QUALITY: 'Řízení kvality',
}

const allowedWorkspaces = (role: Role): Workspace[] => {
  if (role === 'PRACOVNIK_ODBORU_KVALITY' || role === 'ADMIN' || role === 'VEDENI_UNIVERZITY' || role === 'CLEN_RVH') return ['QUALITY']
  if (role === 'HODNOTITEL_PS' || role === 'PREDSEDA_PS' || role === 'EXTERNI_AUDITOR') return ['REVIEW']
  if (role === 'GARANT_SP') return ['PREPARATION', 'QUALITY']
  if (role === 'KOORDINATOR_SP' || role === 'VEDENI_FAKULTY') return ['PREPARATION']
  if (role === 'CLEN_RADY_SP' || role === 'FAKULTNI_KOORDINATOR_KVALITY') return ['QUALITY']
  return ['PREPARATION']
}

const navigationFor = (workspace: Workspace, role: Role): string[][] => {
  if (workspace === 'QUALITY' && role === 'GARANT_SP') return [
    ['■', 'Přehled kvality SP'],
    ['◆', 'Rada SP'],
    ['◒', 'Roční evaluace'],
    ['◆', 'Akreditace a rozhodnutí'],
    ['✓', 'Zjištění a opatření'],
    ['▤', 'Historie'],
  ]
  if (workspace === 'QUALITY' && (role === 'VEDENI_UNIVERZITY' || role === 'CLEN_RVH')) return [
    ['■', 'Přehled'],
    ['◆', 'Procesy'],
    ['✓', 'Podklady RVH'],
    ['▱', 'Portfolio SP'],
  ]
  if (workspace === 'QUALITY') return [
    ['■', 'Přehled'],
    ['◆', 'Procesy'],
    ['▤', 'Návrhář procesů'],
    ['▥', 'Knihovna formulářů'],
    ['◷', 'Termíny a workflow'],
    ['◎', 'Hodnotitelé'],
    ['◌', 'Připomínky'],
    ['✓', 'Podklady RVH'],
    ['▱', 'Portfolio SP'],
    ['▣', 'Archiv'],
    ['◉', 'Externí přístupy'],
  ]
  if (workspace === 'REVIEW') return [
    ['■', 'Přehled'],
    ...(role === 'EXTERNI_AUDITOR' ? [['▣', 'Archiv']] : []),
    ['✓', 'Přidělená hodnocení'],
    ['▤', 'Registr důkazů'],
    ['◇', 'Zjištění'],
  ]
  return [
    ['■', 'Přehled'],
    ['◆', 'Přidělené procesy'],
    ['◇', 'Můj program'],
    ['▤', 'Registr důkazů'],
    ['◒', 'Roční hodnocení SP'],
    ['✓', 'Opatření'],
  ]
}

export function AppShell({ activeSection, onNavigate, persona, personas, onPersonaChange, children }: AppShellProps) {
  const available = allowedWorkspaces(persona.assignment.role)
  const [workspace, setWorkspace] = useState<Workspace>(available[0])

  useEffect(() => {
    const next = allowedWorkspaces(persona.assignment.role)[0]
    setWorkspace(next)
    const firstNavigation = navigationFor(next, persona.assignment.role)[0]
    if (firstNavigation) onNavigate(firstNavigation[1])
  }, [persona.id])

  const navigation = navigationFor(workspace, persona.assignment.role)

  const changeWorkspace = (nextWorkspace: Workspace) => {
    if (!available.includes(nextWorkspace)) return
    setWorkspace(nextWorkspace)
    const nextNavigation = navigationFor(nextWorkspace, persona.assignment.role)
    if (nextNavigation[0]) onNavigate(nextNavigation[0][1])
  }

  const shouldShowAssignedProcessPage = workspace === 'PREPARATION'
    ? activeSection === 'Přehled' || activeSection === 'Přidělené procesy'
    : workspace === 'REVIEW'
      ? activeSection === 'Přehled' || activeSection === 'Přidělená hodnocení'
      : false

  return <div className="app-shell vut-shell">
    <header className="vut-topbar">
      <div className="vut-logo-block" aria-label="Vysoké učení technické v Brně"><span className="vut-symbol" aria-hidden="true">T</span><strong>VUT</strong></div>
      <div className="vut-app-name"><strong>Systém řízení kvality</strong><span>Vzdělávání · Studijní programy</span></div>

      <nav className="vut-portal-nav" aria-label="Pracovní prostředí">
        {(Object.keys(workspaceLabels) as Workspace[]).filter((item) => available.includes(item)).map((item) => <button type="button" key={item} className={workspace === item ? 'active' : ''} onClick={() => changeWorkspace(item)} title={workspaceLabels[item]}><span className="workspace-mark" aria-hidden="true">{item === 'PREPARATION' ? '▤' : item === 'REVIEW' ? '✓' : '◆'}</span><span className="workspace-title">{workspaceShortLabels[item]}</span></button>)}
      </nav>

      <div className="vut-user-tools demo-user-switcher">
        <label><span>Přihlášený uživatel</span><select value={persona.id} onChange={(event) => onPersonaChange(event.target.value)}>{personas.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.title}</option>)}</select></label>
        <span className="demo-persona-badge">{persona.external ? 'EXTERNÍ' : 'VUT'}</span>
      </div>
    </header>

    <div className="vut-contextbar"><span className="context-root">VUT</span><span aria-hidden="true">/</span><strong>{workspaceLabels[workspace]}</strong><span className="vut-context-scope">{persona.name} · {scopeLabels[persona.assignment.scopeType]}{persona.assignment.scopeId ? ` · ${persona.assignment.scopeId}` : ''}</span></div>

    <div className="app-body">
      <aside className="sidebar vut-sidebar">
        <div className="vut-menu-search">⌕&nbsp;&nbsp; Hledat v menu...</div>
        <div className="nav-label">PRACOVNÍ PROSTŘEDÍ</div>
        <nav className="nav-list" aria-label="Hlavní navigace">{navigation.map(([icon, label]) => <button className={`nav-item ${activeSection === label ? 'active' : ''}`} key={label} type="button" onClick={() => onNavigate(label)}><span className="nav-icon" aria-hidden="true">{icon}</span><span>{label}</span></button>)}</nav>
        <div className="vut-sidebar-section">KONTEXT</div>
        <div className="vut-sidebar-context"><strong>{persona.title}</strong><span>{persona.name}</span><span>{persona.institution}</span><span>{scopeLabels[persona.assignment.scopeType]}</span>{persona.assignment.scopeId && <span>{persona.assignment.scopeId}</span>}</div>
      </aside>

      <main className="main-content">
        {workspace === 'QUALITY' ? <QualityWorkspacePage persona={persona} section={activeSection} /> : workspace === 'REVIEW' && activeSection === 'Archiv' ? <QualityWorkspacePage persona={persona} section="Archiv" /> : shouldShowAssignedProcessPage ? <AssignedProcessPage persona={persona} workspace={workspace} /> : children}
      </main>
    </div>
  </div>
}

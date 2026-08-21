import type { ReactNode } from 'react'
import type { Role, RoleAssignment } from '../auth/roles'
import { roleLabels, scopeLabels } from '../presentation/roleLabels'

type AppShellProps = { activeSection: string; onNavigate: (section: string) => void; assignment: RoleAssignment; assignments: RoleAssignment[]; onRoleChange: (assignmentId: string) => void; children: ReactNode }
const commonNavigation = [['▦', 'Přehled']]
const roleNavigation: Record<Role, string[][]> = {
  GARANT_SP: [...commonNavigation, ['◈', 'Můj program'], ['◌', 'Hodnocení kvality'], ['✓', 'Opatření'], ['▤', 'Dokumenty']],
  KOORDINATOR_SP: [...commonNavigation, ['◈', 'Můj program'], ['▤', 'Dokumenty'], ['✓', 'Termíny']],
  CLEN_RADY_SP: [...commonNavigation, ['◈', 'Studijní programy'], ['◌', 'Kvalita SP'], ['✓', 'Opatření']],
  HODNOTITEL_PS: [...commonNavigation, ['◌', 'Moje hodnocení'], ['▤', 'Důkazy'], ['◇', 'Zjištění']],
  PREDSEDA_PS: [...commonNavigation, ['◌', 'Pracovní skupina'], ['◇', 'Zjištění'], ['✓', 'Termíny']],
  CLEN_RVH: [...commonNavigation, ['◇', 'Případy RVH'], ['▤', 'Podklady'], ['✓', 'Rozhodnutí']],
  PRACOVNIK_ODBORU_KVALITY: [...commonNavigation, ['◈', 'Studijní programy'], ['◇', 'Akreditace'], ['◌', 'Kvalita SP'], ['✓', 'Opatření'], ['◒', 'Dashboard kvality'], ['▱', 'Projekty']],
  FAKULTNI_KOORDINATOR_KVALITY: [...commonNavigation, ['◈', 'Studijní programy'], ['◇', 'Akreditace'], ['◌', 'Kvalita SP'], ['✓', 'Opatření']],
  VEDENI_FAKULTY: [...commonNavigation, ['◈', 'Portfolio SP'], ['◒', 'Dashboard kvality'], ['◇', 'Akreditační horizont']],
  VEDENI_UNIVERZITY: [...commonNavigation, ['◈', 'Portfolio SP'], ['◒', 'Dashboard kvality'], ['◇', 'Rizika'], ['▤', 'Strategické výstupy']],
  EXTERNI_AUDITOR: [...commonNavigation, ['◈', 'Studijní program'], ['▤', 'Důkazy'], ['◌', 'Hodnocení'], ['◇', 'Zjištění'], ['▤', 'Dokumenty']],
  ADMIN: [...commonNavigation, ['⚙', 'Uživatelé'], ['⚙', 'Role a oprávnění'], ['⚙', 'Konfigurace']],
}
const personaNames: Record<string, string> = { 'user-pavel': 'Pavel Lošák', jana: 'Jana Nováková', petr: 'Petr Svoboda', marie: 'Marie Dvořáková', anna: 'Anna Veselá', auditor: 'Externí auditor', admin: 'Administrátor' }

export function AppShell({ activeSection, onNavigate, assignment, assignments, onRoleChange, children }: AppShellProps) {
  const navigation = roleNavigation[assignment.role]
  const assignmentOptions = assignments.filter((item, index, items) => items.findIndex((candidate) => candidate.role === item.role) === index)
  const displayName = personaNames[assignment.userId] ?? 'Pavel Lošák'
  return <div className="app-shell"><header className="topbar"><div className="brand"><div className="brand-mark">V</div><div><div className="brand-title">VUT · Řízení kvality studijních programů</div><div className="brand-subtitle">Brno University of Technology · interní pracovní prostor</div></div></div><div className="user-area"><div className="role-switcher"><span className="user-name">{displayName}</span><select value={assignment.id} onChange={(event) => onRoleChange(event.target.value)} aria-label="Prototypová role"><option value={assignment.id}>{roleLabels[assignment.role]}</option>{assignmentOptions.filter((item) => item.id !== assignment.id).map((item) => <option value={item.id} key={item.id}>{roleLabels[item.role]}</option>)}</select><small>{scopeLabels[assignment.scopeType]}{assignment.scopeId ? ` · ${assignment.scopeId}` : ''}</small></div><span className="user-avatar">{displayName === 'Externí auditor' ? 'EA' : displayName === 'Administrátor' ? 'AD' : 'PL'}</span></div></header><div className="app-body"><aside className="sidebar"><div className="nav-label">HLAVNÍ NAVIGACE</div><nav className="nav-list" aria-label="Hlavní navigace">{navigation.map(([icon, label]) => <button className={`nav-item ${activeSection === label ? 'active' : ''}`} key={label} type="button" onClick={() => onNavigate(label)}><span className="nav-icon" aria-hidden="true">{icon}</span>{label}</button>)}</nav><div className="sidebar-note"><strong>{roleLabels[assignment.role]}</strong>{scopeLabels[assignment.scopeType]}{assignment.scopeId ? ` · ${assignment.scopeId}` : ''}<br />Role, scope a oprávnění určují pracovní perspektivu.</div></aside><main className="main-content">{children}</main></div></div>
}

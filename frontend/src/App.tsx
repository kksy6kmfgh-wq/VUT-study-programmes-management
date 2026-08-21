import { useState } from 'react'
import { AppShell } from './layout/AppShell'
import { currentUser } from './auth/roleAssignments'
import type { RoleAssignment } from './auth/roles'
import { RoleWorkspacePage } from './pages/RoleWorkspacePage'
import { StudyProgrammesPage } from './features/study-programmes/StudyProgrammesPage'
import { AccreditationPage } from './pages/AccreditationPage'
import { ProgrammeQualityPage } from './pages/ProgrammeQualityPage'
import { ActionsPage } from './pages/ActionsPage'
import { QualityDashboardPage } from './pages/QualityDashboardPage'
import { ProjectsPage } from './pages/ProjectsPage'
import './App.css'

function App() {
  const [assignment, setAssignment] = useState<RoleAssignment>(currentUser.assignments[0])
  const [activeSection, setActiveSection] = useState('Přehled')
  const handleRoleChange = (assignmentId: string) => { const next = currentUser.assignments.find((item) => item.id === assignmentId); if (next) { setAssignment(next); setActiveSection('Přehled') } }
  const content = activeSection === 'Přehled' ? <RoleWorkspacePage assignment={assignment} /> : activeSection === 'Studijní programy' || activeSection === 'Můj program' || activeSection === 'Studijní program' || activeSection === 'Portfolio SP' ? <StudyProgrammesPage assignment={assignment} /> : activeSection === 'Akreditace' ? <AccreditationPage /> : activeSection === 'Kvalita SP' || activeSection === 'Hodnocení kvality' ? <ProgrammeQualityPage /> : activeSection === 'Opatření' ? <ActionsPage /> : activeSection === 'Dashboard kvality' ? <QualityDashboardPage /> : activeSection === 'Projekty' ? <ProjectsPage /> : <RoleWorkspacePage assignment={assignment} />
  return <AppShell activeSection={activeSection} onNavigate={setActiveSection} assignment={assignment} assignments={currentUser.assignments} onRoleChange={handleRoleChange}>{content}</AppShell>
}

export default App

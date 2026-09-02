import { useState } from 'react'
import { demoPersonas, defaultDemoPersona, type DemoPersona } from './auth/demoPersonas'
import { AppShell } from './layout/AppShell'
import { StudyProgrammesPage } from './features/study-programmes/StudyProgrammesPage'
import { AccreditationPage } from './pages/AccreditationPage'
import { MethodologyPage } from './pages/MethodologyPage'
import { ProgrammeCouncilPage } from './pages/ProgrammeCouncilPage'
import { ActionsPage } from './pages/ActionsPage'
import { QualityDashboardPage } from './pages/QualityDashboardPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { RoleWorkspacePage } from './pages/RoleWorkspacePage'
import { QualityCasePage } from './pages/QualityCasePage'
import { QualityCaseProvider } from './quality-workflow/QualityCaseContext'
import { QualityProcessProvider } from './quality-process/QualityProcessContext'
import './App.css'

export default function App() {
  const [persona, setPersona] = useState<DemoPersona>(defaultDemoPersona)
  const [activeSection, setActiveSection] = useState('Přehled')
  const [showQualityCase, setShowQualityCase] = useState(false)

  const assignment = persona.assignment

  const handlePersonaChange = (personaId: string) => {
    const next = demoPersonas.find((item) => item.id === personaId)
    if (next) {
      setPersona(next)
      setActiveSection('Přehled')
      setShowQualityCase(false)
    }
  }

  const content = showQualityCase ? (
    <QualityCasePage assignment={assignment} onBack={() => setShowQualityCase(false)} />
  ) : activeSection === 'Přehled' ? (
    <RoleWorkspacePage assignment={assignment} onOpenCase={() => setShowQualityCase(true)} />
  ) : activeSection === 'Studijní programy' ||
    activeSection === 'Můj program' ||
    activeSection === 'Studijní program' ||
    activeSection === 'Portfolio SP' ? (
    <StudyProgrammesPage assignment={assignment} />
  ) : activeSection === 'Akreditace' ? (
    <AccreditationPage />
  ) : activeSection === 'Kvalita SP' ||
    activeSection === 'Hodnocení kvality' ||
    activeSection.includes('checklist') ||
    activeSection.includes('důkaz') ||
    activeSection.includes('map') ||
    activeSection === 'Metodika kvality' ? (
    <MethodologyPage assignment={assignment} />
  ) : activeSection === 'Roční hodnocení SP' || activeSection === 'Tabulky rady' ? (
    <ProgrammeCouncilPage />
  ) : activeSection === 'Opatření' ? (
    <ActionsPage />
  ) : activeSection === 'Dashboard kvality' ? (
    <QualityDashboardPage />
  ) : activeSection === 'Projekty' ? (
    <ProjectsPage />
  ) : (
    <RoleWorkspacePage assignment={assignment} onOpenCase={() => setShowQualityCase(true)} />
  )

  return <QualityCaseProvider>
    <QualityProcessProvider>
      <AppShell
        activeSection={activeSection}
        onNavigate={(section) => {
          setShowQualityCase(false)
          setActiveSection(section)
        }}
        persona={persona}
        personas={demoPersonas}
        onPersonaChange={handlePersonaChange}
      >
        {content}
      </AppShell>
    </QualityProcessProvider>
  </QualityCaseProvider>
}

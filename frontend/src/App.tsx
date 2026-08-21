import { useState } from 'react'
import { AppShell } from './layout/AppShell'
import { StudyProgrammesPage } from './features/study-programmes/StudyProgrammesPage'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('Studijní programy')

  return (
    <AppShell activeSection={activeSection} onNavigate={setActiveSection}>
      {activeSection === 'Studijní programy' ? (
        <StudyProgrammesPage />
      ) : (
        <section className="placeholder-page">
          <span className="eyebrow">PRACOVNÍ PROSTOR</span>
          <h1>{activeSection}</h1>
          <p>Tato část systému bude navazovat na centrální životní cyklus studijního programu.</p>
        </section>
      )}
    </AppShell>
  )
}

export default App

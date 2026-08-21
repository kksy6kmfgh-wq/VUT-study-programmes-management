import type { AccreditationPortfolioItem, AttentionItem, GlobalAction, ProjectMilestone, QualityPortfolioItem } from '../types/workspace'

export const workspaceAttention: AttentionItem[] = [
  { title: '3 opatření po termínu', detail: 'Vyžadují přiřazení dalšího kroku', tone: 'warning' },
  { title: '2 hodnocení čekají na doplnění důkazů', detail: 'Připraveno k doplnění v kvalitě SP', tone: 'warning' },
  { title: '1 akreditační proces čeká na rozhodnutí RVH', detail: 'Institucionální oprávnění', tone: 'neutral' },
  { title: '4 studijní programy mají hodnocení v příštích 12 měsících', detail: 'Termíny v portfoliu kvality', tone: 'neutral' },
  { title: '2 nové ProgrammeVersion čekají na schválení', detail: 'Budoucí změny připravené k posouzení', tone: 'neutral' },
]

export const accreditationPortfolio: AccreditationPortfolioItem[] = [
  { programme: 'Procesní inženýrství', code: 'N-PI', version: 'Verze 4', processType: 'PROGRAMME_CHANGE', regime: 'INSTITUTIONAL', status: 'IN_PREPARATION', step: 'Fakultní posouzení', responsible: 'Garant SP', due: '30. 9. 2027', decision: 'Žádné rozhodnutí' },
  { programme: 'Energetické inženýrství', code: 'N-EN', version: 'Verze 1', processType: 'NEW_PROGRAMME', regime: 'EXTERNAL_NAU', status: 'SUBMITTED', step: 'NAÚ', responsible: 'Odbor kvality', due: '15. 11. 2027', decision: 'Žádné rozhodnutí' },
  { programme: 'Strojírenství', code: 'B-STR', version: 'Verze 2', processType: 'REACCREDITATION', regime: 'INSTITUTIONAL', status: 'COMPLETED', step: 'RVH', responsible: 'RVH VUT', due: '—', decision: 'Schváleno' },
]

export const qualityPortfolio: QualityPortfolioItem[] = [
  { programme: 'Procesní inženýrství', code: 'N-PI', lastReview: '2026', nextReview: '2027', evidence: '3 / 6', findings: 2, actions: 3, state: 'Probíhá příprava', needsEvidence: true },
  { programme: 'Energetické inženýrství', code: 'N-EN', lastReview: '2025', nextReview: '2027', evidence: '4 / 6', findings: 1, actions: 2, state: 'Čeká na důkazy', needsEvidence: true },
  { programme: 'Strojírenství', code: 'B-STR', lastReview: '2025', nextReview: '2028', evidence: '6 / 6', findings: 0, actions: 1, state: 'Pravidelné sledování', needsEvidence: false },
]

export const globalActions: GlobalAction[] = [
  { programme: 'Procesní inženýrství', code: 'N-PI', title: 'Zvýšit podíl projektově orientovaných úloh', finding: 'Studenti požadují více projektové výuky.', responsible: 'Garant SP', due: '30. 6. 2027', status: 'OPEN', implementation: 'NOT_VERIFIED', effectiveness: 'NOT_VERIFIED', closure: 'OPEN' },
  { programme: 'Energetické inženýrství', code: 'N-EN', title: 'Doplnit členění studijní neúspěšnosti', finding: 'Chybí data podle ročníků.', responsible: 'Proděkan pro studium', due: '31. 1. 2027', status: 'OVERDUE', implementation: 'NOT_VERIFIED', effectiveness: 'NOT_VERIFIED', closure: 'OPEN' },
  { programme: 'Strojírenství', code: 'B-STR', title: 'Aktualizovat kurikulární mapu', finding: 'Provázanost předmětů vyžaduje doplnění.', responsible: 'Garant SP', due: '15. 12. 2026', status: 'COMPLETED', implementation: 'NOT_VERIFIED', effectiveness: 'NOT_VERIFIED', closure: 'OPEN' },
  { programme: 'Procesní inženýrství', code: 'N-PI', title: 'Zavést pravidelný sběr zpětné vazby absolventů', finding: 'Nízká návratnost zpětné vazby.', responsible: 'Rada SP', due: '30. 6. 2026', status: 'COMPLETED', implementation: 'VERIFIED', effectiveness: 'NOT_VERIFIED', closure: 'OPEN' },
  { programme: 'Strojírenství', code: 'B-STR', title: 'Upravit metodiku sběru indikátorů', finding: 'Historická metodika byla nahrazena.', responsible: 'Odbor kvality', due: '30. 6. 2026', status: 'COMPLETED', implementation: 'VERIFIED', effectiveness: 'VERIFIED', closure: 'CLOSED' },
]

export const projectMilestones: ProjectMilestone[] = [
  { title: 'Metodika SP budoucnosti', state: 'DONE' }, { title: 'Dashboard kvality', state: 'IN_PROGRESS' }, { title: 'Digitalizace akreditačního procesu', state: 'IN_PROGRESS' }, { title: 'Pilotní hodnocení SP', state: 'PLANNED' }, { title: 'Školení garantů', state: 'PLANNED' },
]
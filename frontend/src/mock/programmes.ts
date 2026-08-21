import type { StudyProgramme } from '../types/studyProgramme'

export const programmes: StudyProgramme[] = [
  {
    code: 'N-PI', name: 'Procesní inženýrství', faculty: 'FSI', degreeType: 'Navazující magisterský', activeVersion: 3, status: 'ACTIVE', validFrom: '2026/2027', nextReview: '2027', openActions: 3, activeAccreditation: 'Žádný', currentPhase: 'MONITORING',
    versions: [{ version: 1, status: 'RETIRED', validFrom: '2020/2021', validTo: '2022/2023' }, { version: 2, status: 'RETIRED', validFrom: '2023/2024', validTo: '2025/2026' }, { version: 3, status: 'ACTIVE', validFrom: '2026/2027', effectiveAcademicYear: '2026/2027' }, { version: 4, status: 'DRAFT', plannedEffectiveAcademicYear: '2030/2031' }],
    accreditationProcesses: [{ period: '2025/2026', processType: 'REACCREDITATION', approvalRegime: 'INSTITUTIONAL', status: 'COMPLETED', decision: { authority: 'RVH VUT', decisionType: 'APPROVED', decidedAt: '15. 5. 2026', validUntil: '31. 8. 2031' } }],
    qualityReview: {
      title: 'Pravidelné hodnocení studijního programu 2027', year: '2027', requirements: [
        { code: 'G12', title: 'Profil absolventa', result: 'FULFILLED', evidence: [{ title: 'Profil absolventa v programu', type: 'STRUCTURED_DATA' }] },
        { code: 'G18', title: 'Výsledky učení', result: 'FULFILLED', evidence: [{ title: 'Mapa výsledků učení', type: 'CURRICULUM_MAP' }] },
        { code: 'G27', title: 'Kurikulární provázanost', result: 'PARTIALLY_FULFILLED', evidence: [{ title: 'Kurikulární mapa 2026', type: 'CURRICULUM_MAP' }], finding: { title: 'Provázanost některých předmětů vyžaduje doplnění.', status: 'OPEN' } },
        { code: 'H05', title: 'Studijní neúspěšnost', result: 'NOT_ASSESSED', evidence: [], finding: { title: 'Chybí dostatečně členěná data podle ročníků.', status: 'OPEN' } },
        { code: 'H11', title: 'Zpětná vazba studentů', result: 'PARTIALLY_FULFILLED', evidence: [{ title: 'Studentský průzkum 2026', type: 'STAKEHOLDER_FEEDBACK' }, { title: 'Zápis Rady studijního programu 12/2026', type: 'MEETING_RECORD' }], finding: { title: 'Studenti požadují vyšší podíl projektové výuky.', status: 'OPEN' } },
        { code: 'R03', title: 'Udržitelnost programu', result: 'FULFILLED', evidence: [{ title: 'Indikátory kvality programu', type: 'QUALITY_INDICATOR' }] },
      ],
    },
    actions: [
      { title: 'Zvýšit podíl projektově orientovaných úloh v klíčových předmětech.', sourceFinding: 'Studenti požadují vyšší podíl projektové výuky.', responsible: 'Garant SP', dueDate: '30. 6. 2027', status: 'OPEN', verification: 'PLANNED', closure: 'OPEN' },
      { title: 'Doplnit členění studijní neúspěšnosti podle ročníků.', sourceFinding: 'Chybí dostatečně členěná data podle ročníků.', responsible: 'Proděkan pro studium', dueDate: '31. 1. 2027', status: 'OVERDUE', verification: 'PLANNED', closure: 'OPEN' },
      { title: 'Aktualizovat kurikulární mapu po revizi předmětů.', sourceFinding: 'Provázanost některých předmětů vyžaduje doplnění.', responsible: 'Garant SP', dueDate: '15. 12. 2026', status: 'COMPLETED', verification: 'PLANNED', closure: 'OPEN' },
      { title: 'Zavést pravidelný sběr zpětné vazby absolventů.', sourceFinding: 'Nízká návratnost zpětné vazby absolventů.', responsible: 'Rada SP', dueDate: '30. 6. 2026', status: 'COMPLETED', verification: 'VERIFIED', closure: 'CLOSED' },
    ],
    documents: [{ title: 'Akreditační žádost', type: 'Procesní dokument', updatedAt: '15. 5. 2026' }, { title: 'Sebehodnoticí zpráva', type: 'Hodnocení kvality', updatedAt: '10. 12. 2026' }, { title: 'Kurikulární mapa', type: 'Strukturovaná evidence', updatedAt: '15. 12. 2026' }, { title: 'Zápisy Rady studijního programu', type: 'Záznamy jednání', updatedAt: '12. 12. 2026' }],
    history: [{ date: '2026-05-15', title: 'RVH approved reaccreditation', detail: 'Rozhodnutí RVH VUT · institucionální akreditace' }, { date: '2026-09-01', title: 'ProgrammeVersion 3 became ACTIVE', detail: 'Verze 3 se stala aktuální realizovanou podobou programu' }, { date: '2026-12-10', title: 'Student feedback evidence added', detail: 'Přidány dva důkazy k požadavku H11' }, { date: '2027-01-15', title: 'Finding created', detail: 'Zjištění o podílu projektové výuky' }, { date: '2027-02-01', title: 'Corrective action assigned', detail: 'Opatření přiřazeno garantovi SP' }],
  },
  {
    code: 'B-STR', name: 'Strojírenství', faculty: 'FSI', degreeType: 'Bakalářský', activeVersion: 2, status: 'ACTIVE', validFrom: '2024/2025', nextReview: '2026', openActions: 1, activeAccreditation: 'Žádný', currentPhase: 'DELIVERY',
    versions: [{ version: 1, status: 'RETIRED' }, { version: 2, status: 'ACTIVE', effectiveAcademicYear: '2024/2025' }], accreditationProcesses: [], qualityReview: { title: '', year: '', requirements: [] }, actions: [], documents: [], history: [],
  },
  {
    code: 'N-EN', name: 'Energetické inženýrství', faculty: 'FSI', degreeType: 'Navazující magisterský', activeVersion: 1, status: 'IN_REVIEW', validFrom: '2026/2027', nextReview: '2027', openActions: 2, activeAccreditation: 'Připravuje se', currentPhase: 'APPROVAL',
    versions: [{ version: 1, status: 'IN_REVIEW', effectiveAcademicYear: '2026/2027' }], accreditationProcesses: [], qualityReview: { title: '', year: '', requirements: [] }, actions: [], documents: [], history: [],
  },
]
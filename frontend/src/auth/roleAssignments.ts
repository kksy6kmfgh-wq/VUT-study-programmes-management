import type { MockUser } from './roles'

export const currentUser: MockUser = { id: 'user-pavel', name: 'Pavel Lošák', initials: 'PL', assignments: [
  { id: 'pavel-garant', userId: 'user-pavel', role: 'GARANT_SP', scopeType: 'STUDY_PROGRAMME', scopeId: 'N-PI' },
  { id: 'pavel-council', userId: 'user-pavel', role: 'CLEN_RADY_SP', scopeType: 'STUDY_PROGRAMME', scopeId: 'N-PI' },
  { id: 'pavel-quality', userId: 'user-pavel', role: 'PRACOVNIK_ODBORU_KVALITY', scopeType: 'GLOBAL' },
  { id: 'jana-reviewer', userId: 'jana', role: 'HODNOTITEL_PS', scopeType: 'ACCREDITATION_PROCESS', scopeId: 'ACC-NPI-2027' },
  { id: 'petr-chair', userId: 'petr', role: 'PREDSEDA_PS', scopeType: 'ACCREDITATION_PROCESS', scopeId: 'ACC-NPI-2027' },
  { id: 'marie-rvh', userId: 'marie', role: 'CLEN_RVH', scopeType: 'GLOBAL' },
  { id: 'anna-faculty', userId: 'anna', role: 'FAKULTNI_KOORDINATOR_KVALITY', scopeType: 'FACULTY', scopeId: 'FSI' },
  { id: 'audit-eurace', userId: 'auditor', role: 'EXTERNI_AUDITOR', scopeType: 'AUDIT', scopeId: 'EUR-AE-2028-NPI', validFrom: '1. 3. 2028', validTo: '30. 6. 2028' },
  { id: 'admin', userId: 'admin', role: 'ADMIN', scopeType: 'GLOBAL' },
] }
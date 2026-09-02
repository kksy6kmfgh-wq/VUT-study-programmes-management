import type { RoleAssignment } from './roles'

export type DemoPersona = {
  id: string
  name: string
  email: string
  institution: string
  initials: string
  title: string
  external?: boolean
  assignment: RoleAssignment
}

export const demoPersonas: DemoPersona[] = [
  {
    id: 'pavel-quality',
    name: 'Alan Turing',
    email: 'alan.turing@vut-demo.cz',
    institution: 'VUT · Rektorát',
    initials: 'AT',
    title: 'Pracovník odboru kvality',
    assignment: { id: 'pavel-quality-assignment', userId: 'pavel-quality', role: 'PRACOVNIK_ODBORU_KVALITY', scopeType: 'GLOBAL' },
  },
  {
    id: 'isaac-newton',
    name: 'Isaac Newton',
    email: 'isaac.newton@vut-demo.cz',
    institution: 'VUT · FSI',
    initials: 'IN',
    title: 'Garant studijního programu',
    assignment: { id: 'isaac-guarantor', userId: 'isaac-newton', role: 'GARANT_SP', scopeType: 'STUDY_PROGRAMME', scopeId: 'N-PI' },
  },
  {
    id: 'emmy-noether',
    name: 'Emmy Noether',
    email: 'emmy.noether@vut-demo.cz',
    institution: 'VUT · FSI · Studijní oddělení',
    initials: 'EN',
    title: 'Studijní oddělení fakulty',
    assignment: { id: 'emmy-study-office', userId: 'emmy-noether', role: 'KOORDINATOR_SP', scopeType: 'FACULTY', scopeId: 'FSI' },
  },
  {
    id: 'albert-einstein',
    name: 'Albert Einstein',
    email: 'albert.einstein@vut-demo.cz',
    institution: 'VUT · FSI',
    initials: 'AE',
    title: 'Děkan / vedení fakulty',
    assignment: { id: 'albert-dean', userId: 'albert-einstein', role: 'VEDENI_FAKULTY', scopeType: 'FACULTY', scopeId: 'FSI' },
  },
  {
    id: 'marie-curie',
    name: 'Marie Curie',
    email: 'marie.curie@vut-demo.cz',
    institution: 'Univerzita Paříž · externí hodnotitelka',
    initials: 'MC',
    title: 'Externí hodnotitelka',
    external: true,
    assignment: { id: 'marie-reviewer', userId: 'marie-curie', role: 'HODNOTITEL_PS', scopeType: 'ACCREDITATION_PROCESS', scopeId: 'N-PI-RVH-2027' },
  },
  {
    id: 'niels-bohr',
    name: 'Niels Bohr',
    email: 'niels.bohr@vut-demo.cz',
    institution: 'DTU · externí předseda pracovní skupiny',
    initials: 'NB',
    title: 'Předseda pracovní skupiny',
    external: true,
    assignment: { id: 'bohr-chair', userId: 'niels-bohr', role: 'PREDSEDA_PS', scopeType: 'ACCREDITATION_PROCESS', scopeId: 'N-PI-RVH-2027' },
  },
  {
    id: 'lise-meitner',
    name: 'Lise Meitner',
    email: 'lise.meitner@external-demo.eu',
    institution: 'Externí instituce',
    initials: 'LM',
    title: 'Externí hodnotitelka',
    external: true,
    assignment: { id: 'meitner-reviewer', userId: 'lise-meitner', role: 'HODNOTITEL_PS', scopeType: 'ACCREDITATION_PROCESS', scopeId: 'N-PI-RVH-2027' },
  },
  {
    id: 'eua-evaluator',
    name: 'EUA / IEP Evaluator',
    email: 'evaluator@eua-demo.eu',
    institution: 'European University Association · IEP',
    initials: 'IEP',
    title: 'Externí evaluátor · archiv pouze pro čtení',
    external: true,
    assignment: { id: 'eua-archive', userId: 'eua-evaluator', role: 'EXTERNI_AUDITOR', scopeType: 'GLOBAL' },
  },
  {
    id: 'sofia-kovalevskaya',
    name: 'Sofia Kovalevskaya',
    email: 'sofia.kovalevskaya@vut-demo.cz',
    institution: 'VUT · Rada pro vnitřní hodnocení',
    initials: 'SK',
    title: 'Tajemnice RVH',
    assignment: { id: 'sofia-rvh-secretary', userId: 'sofia-kovalevskaya', role: 'CLEN_RVH', scopeType: 'GLOBAL' },
  },
  {
    id: 'katherine-johnson',
    name: 'Katherine Johnson',
    email: 'katherine.johnson@vut-demo.cz',
    institution: 'VUT · Vedení univerzity',
    initials: 'KJ',
    title: 'Vedení univerzity',
    assignment: { id: 'johnson-university', userId: 'katherine-johnson', role: 'VEDENI_UNIVERZITY', scopeType: 'GLOBAL' },
  },
]

export const defaultDemoPersona = demoPersonas[0]

export const personaById = (id: string) => demoPersonas.find((persona) => persona.id === id)

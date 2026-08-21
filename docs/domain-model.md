# Doménový model – Study Programme Quality Management

## 1. Účel systému

Systém poskytuje digitální podporu pro zajišťování a vnitřní hodnocení
kvality studijních programů VUT v průběhu celého jejich životního cyklu.

Není primárně akreditačním informačním systémem. Akreditace představuje
jeden z quality gates v životním cyklu studijního programu.

Systém podporuje uzavřený cyklus:

DESIGN → APPROVAL → DELIVERY → MONITORING → REVIEW → IMPROVEMENT → REDESIGN

Cílem je propojit:
- návrh studijního programu,
- akreditaci a schvalování,
- realizaci programu,
- průběžné sledování kvality,
- data a indikátory kvality,
- pravidelné hodnocení programu,
- zjištění a opatření,
- následné zlepšování programu.

## 2. Základní princip

Centrální entitou systému je StudyProgramme.

Studijní program je evidován pouze jednou. Jednotlivé části systému
nevytvářejí vlastní kopie stejných údajů.

Nad StudyProgramme vznikají verzované návrhy programu (ProgrammeVersion).

ProgrammeVersion umožňuje připravovat budoucí změnu programu bez zásahu
do aktuálně realizované verze.

Příklad:

StudyProgramme: Procesní inženýrství

- Version 2 – ACTIVE
- Version 3 – IN PREPARATION
- Version 3 – planned effective date 2030/2031

## 3. Životní cyklus studijního programu

### DESIGN
Návrh programu zahrnuje zejména:
- potřeby a zdůvodnění programu,
- cíle programu,
- profil absolventa,
- výsledky učení programu,
- kurikulum,
- výsledky učení předmětů,
- metody výuky,
- assessment,
- personální zabezpečení,
- materiální zabezpečení,
- zapojení stakeholderů.

### APPROVAL
Schvalování zahrnuje:
- automatické kontroly,
- sebehodnocení,
- fakultní procesy,
- hodnocení podle stanovených kritérií,
- RVH,
- připomínky,
- nápravná opatření,
- rozhodnutí,
- audit trail.

Akreditace představuje jeden z procesů v této fázi.

### DELIVERY
Systém eviduje schválenou a skutečně realizovanou podobu programu.

### MONITORING
Systém propojuje program s daty a indikátory kvality.

### REVIEW
Program je pravidelně hodnocen garantem, radou programu a dalšími
stanovenými aktéry.

### IMPROVEMENT
Z hodnocení vznikají zjištění a opatření.

Každé opatření může obsahovat:
- odpovědnou osobu,
- termín,
- stav,
- důkaz realizace,
- ověření účinnosti.

Výsledkem může být nová ProgrammeVersion a další průchod životním cyklem.

## 4. Workflow a review engine

Společná procesní vrstva systému je inspirována principy systému Malta.

Podporuje zejména:

DRAFT → SUBMITTED → REVIEW → RETURNED / APPROVED

Workflow engine umožňuje:
- formuláře,
- více autorů,
- role a oprávnění,
- komentáře,
- hodnoticí kritéria a rubriky,
- vrácení k doplnění,
- schválení,
- zjištění,
- opatření,
- dokumenty a důkazy,
- audit trail.

Stejný mechanismus mohou využívat různé procesy, zejména akreditace
a pravidelné hodnocení kvality SP.

## 5. Quality framework

Požadavky systému kvality jsou evidovány strukturovaně.

Mohou zahrnovat zejména:
- G – požadavky/checklist garanta,
- H – hodnoticí položky pracovní skupiny,
- R – rozhodovací položky RVH,
- PR – procesní požadavky.

Obecná vazba:

REQUIREMENT
→ EVIDENCE
→ ASSESSMENT
→ FINDING
→ ACTION
→ VERIFICATION
→ CLOSURE

## 6. Hlavní funkční oblasti

### Study Programme
Centrální evidence programu a jeho verzí.

### Accreditation
Proces přípravy, kontroly, hodnocení a schvalování akreditace.

### Programme Quality
Pravidelné hodnocení a zlepšování studijního programu.

### Quality Dashboard
Data, KPI, trendy, diagnostika a podklady pro rozhodování.

### Workflow / Review
Společný mechanismus formulářů, hodnocení, připomínek a schvalování.

### Evidence & Actions
Evidence důkazů, zjištění, opatření a jejich účinnosti.

### Projects
Samostatná propojená doména pro řízení projektových aktivit, například ESF+.

## 7. Architektonické principy

1. Single source of truth.
2. Data se zadávají pouze jednou a následně se znovu používají.
3. Akreditační formuláře se pokud možno generují z existujících dat.
4. Studijní program a jeho verze jsou odděleny.
5. Schválená podoba programu je dohledatelná.
6. Každé hodnocení má dohledatelné důkazy.
7. Každé významné zjištění může vést k opatření.
8. Opatření je sledováno až do ověření jeho účinnosti.
9. Procesy mají jasné role a odpovědnosti.
10. Významné operace mají audit trail.
11. Dashboard není samostatným reportingovým ostrovem, ale datovou
    podporou rozhodování a hodnocení.
12. Systém podporuje continuous enhancement, nikoliv pouze compliance.

## 8. Core domain entities and relationships

### StudyProgramme

StudyProgramme is the stable identity of a study programme. It is created
once and remains the central reference for the programme throughout its
lifecycle.

One StudyProgramme has one or more ProgrammeVersion records. Programme data
must not be duplicated in accreditation or quality-review processes.

### ProgrammeVersion

ProgrammeVersion represents a versioned design or approved form of a
programme. A version allows a future change to be prepared independently of
the currently delivered version.

A ProgrammeVersion may be subject to accreditation or institutional approval
processes, may be evaluated through QualityReview, and may have associated
Evidence and QualityIndicator records.

### AccreditationProcess

AccreditationProcess represents an accreditation or institutional approval
process. It references a specific ProgrammeVersion and contains or
coordinates the relevant reviews and assessments.

AccreditationProcess must reference existing programme data rather than
duplicating StudyProgramme or ProgrammeVersion data. Accreditation is one
quality gate in the programme lifecycle, not the central entity of the
system.

### QualityReview

QualityReview represents a periodic or extraordinary evaluation of programme
quality. It references a ProgrammeVersion and uses evidence, quality
indicators, stakeholder feedback and other relevant inputs. A QualityReview
may produce Findings.

### Requirement

Requirement represents a structured and reusable quality requirement. The
initial requirement types include:

- G - programme guarantor or checklist requirement,
- H - review-panel assessment item,
- R - RVH decision item,
- PR - process requirement.

Requirements should be reusable across processes and versionable in the
future so that historical assessments remain traceable to the requirement
definition used at the time.

### Assessment

Assessment records the evaluation of a Requirement in a particular process,
review or other context. It may reference one or more Evidence records and
may result in a Finding.

### Evidence

Evidence is reusable information supporting an Assessment or QualityReview.
It is a shared quality-management concept and must not belong exclusively to
AccreditationProcess or QualityReview.

### Finding

Finding represents an identified issue, observation, strength, risk or
improvement opportunity. It may originate from an AccreditationProcess,
QualityReview, Assessment or another future process. A Finding may lead to
one or more Actions.

### Action

Action represents a corrective, preventive or improvement measure. It
contains responsibility, a deadline and a status, and supports evidence of
implementation.

### Verification

Verification records whether an Action was implemented and whether it was
effective. Verification supports closure of the quality loop and preserves
the evidence needed to explain how the closure decision was reached.

### QualityIndicator

QualityIndicator is a quantitative or qualitative indicator associated with
a StudyProgramme or ProgrammeVersion and a defined period. It contains a
value, period and source, and may also contain thresholds.

Quality indicators provide evidence or other input for QualityReview. The
dashboard presents indicators and supports decisions, but it does not itself
decide programme quality or act as an autonomous assessment authority.

## 9. Conceptual relationships

The core relationships are:

```text
StudyProgramme
    1:N
ProgrammeVersion

ProgrammeVersion
    |-- AccreditationProcess
    |-- QualityReview
    |-- Evidence
    `-- QualityIndicator

AccreditationProcess --> Review / Assessment --> Finding
QualityReview -------> Assessment / Finding
Requirement ----------> Assessment --> Evidence --> Finding
Finding --------------> Action --> Verification --> Closure
```

The shared quality-management principle is:

```text
REQUIREMENT
    -> EVIDENCE
    -> ASSESSMENT
    -> FINDING
    -> ACTION
    -> VERIFICATION
    -> CLOSURE
```

Finding, Action, Evidence and Verification are shared quality-management
concepts. They must not be duplicated separately inside accreditation and
programme-quality modules.

The architecture must support a closed quality loop and institutional
memory. It should later allow traceability from a Requirement through
Evidence, Assessment, Finding and Action to Verification and Closure.
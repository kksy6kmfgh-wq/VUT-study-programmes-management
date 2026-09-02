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

## 10. Accreditation process model

### AccreditationProcess

AccreditationProcess represents an internal VUT approval or accreditation
process concerning one specific ProgrammeVersion. It contains process
metadata and does not own or duplicate programme content.

Programme content such as the programme name, graduate profile, programme
learning outcomes, curriculum, study plan and programme structure belongs to
ProgrammeVersion. AccreditationProcess references that version and must not
copy those data.

The relationship is:

```text
StudyProgramme
     1:N
ProgrammeVersion
     1:N
AccreditationProcess
```

A ProgrammeVersion may therefore pass through more than one approval or
accreditation process over its lifetime when necessary.

### Process type

AccreditationProcess has the conceptual attribute `process_type`. Its
initial values are:

- `NEW_PROGRAMME`
- `REACCREDITATION`
- `PROGRAMME_CHANGE`

`process_type` describes what is happening to the programme or version. The
model does not yet define detailed categories of programme changes; those
may be added later if required by VUT governance or legislation.

### Approval regime

AccreditationProcess also has the separate conceptual attribute
`approval_regime`. Its initial values are:

- `INSTITUTIONAL`
- `EXTERNAL_NAU`

`approval_regime` describes under which approval or accreditation regime the
process is conducted. `process_type` and `approval_regime` are intentionally
separate: for example, a `NEW_PROGRAMME` may be approved internally under
institutional accreditation or may require external accreditation by NAU.

### Process lifecycle metadata

AccreditationProcess should conceptually contain:

- `id`
- `programme_version_id`
- `process_type`
- `approval_regime`
- `status`
- `started_at`
- `submitted_at`
- `decided_at`
- `external_reference`

The detailed status enum is deliberately not defined yet. Process status
describes workflow or process progress, not the substantive decision. A
decision must not be encoded into a workflow status such as
`RVH_APPROVED`.

## 11. Accreditation workflow

AccreditationProcess uses the shared workflow and review infrastructure. The
workflow is reusable and configurable; its exact stages must not be
hard-coded into AccreditationProcess.

```text
AccreditationProcess
          |
          v
      Workflow
          |
          +-- faculty-level preparation/review
          +-- review panel / expert assessment
          +-- RVH
          +-- external NAU stage where applicable
```

Depending on the configured process, Workflow may produce Reviews,
Assessments, Findings and Actions. These reuse the shared quality-management
concepts already defined in this document. Accreditation must not create
separate copies of Finding, Action, Evidence, Assessment or Verification.

## 12. Decision

Decision is a concept separate from `AccreditationProcess.status`. It
represents a formal decision made by an authorised body.

Decision should conceptually contain:

- `id`
- `accreditation_process_id`
- `authority`
- `decision_type`
- `decided_at`
- `valid_until`
- `conditions`
- `reference`

Detailed authority and decision-type enums are not defined yet. A process
may contain more than one Decision where appropriate, for example an
internal RVH decision followed by an external NAU decision.

```text
PROCESS STATUS != DECISION
```

Process status describes where the case is in the workflow. Decision records
what an authorised body formally decided. Decisions are therefore separately
auditable records rather than alternative workflow statuses.

## 13. Accreditation and programme lifecycle

The conceptual flow is:

```text
StudyProgramme
        |
ProgrammeVersion
        |
AccreditationProcess
        |
Workflow / Reviews / Assessments
        |
Findings
        |
Actions
        |
Decision
        |
ProgrammeVersion lifecycle transition
```

An approval or accreditation Decision may enable a ProgrammeVersion to move
to an approved or active lifecycle state. The decision history remains
separately auditable and preserves the reasoning and process context for
that transition.

## 14. Accreditation architecture principles

1. Accreditation is a quality gate in the programme lifecycle, not the
    central entity of the system.
2. ProgrammeVersion remains the single source of truth for programme
    content.
3. AccreditationProcess contains process metadata, not duplicated programme
    content.
4. Workflow is reusable infrastructure and must not be hard-coded
    specifically for accreditation.
5. Decisions are auditable records separate from process status.
6. Findings, Actions, Evidence, Assessments and Verification remain shared
    quality-management concepts.
7. The architecture supports both institutional accreditation and external
    NAU accreditation.
8. The architecture preserves institutional memory and allows reconstruction
    of which version was assessed, by whom, under which regime, with what
    findings, actions and decisions.

## 15. Shared quality-management core

The following concepts form a reusable quality-management core for
AccreditationProcess, QualityReview and future quality processes. They are
not accreditation-specific and support the complete chain:

```text
REQUIREMENT
    -> EVIDENCE
    -> ASSESSMENT
    -> FINDING
    -> ACTION
    -> VERIFICATION
    -> CLOSURE
```

### Requirement

Requirement represents a structured, identifiable quality requirement. It is
reusable across processes and versionable so that historical assessments can
refer to the requirement definition that was valid at the time.

Conceptual fields:

- `id`
- `code`
- `requirement_type`
- `title`
- `description`
- `valid_from`
- `valid_to`
- `version`

The initial requirement types are:

- `G` - programme guarantor or checklist requirement,
- `H` - review-panel assessment item,
- `R` - RVH decision item,
- `PR` - process requirement.

Requirements must not be hard-coded directly into accreditation or
programme-quality models.

### Evidence

Evidence represents information or an artefact used to demonstrate, support
or challenge fulfilment of a Requirement or another quality claim. It is a
shared concept and is not owned exclusively by AccreditationProcess or
QualityReview.

Conceptual fields:

- `id`
- `evidence_type`
- `title`
- `description`
- `source`
- `reference`
- `created_at`

Evidence may later represent structured programme data, documents,
curriculum maps, quality indicators, stakeholder feedback, meeting records
or other auditable evidence. File storage is outside the scope of this
conceptual model.

Evidence may be associated with ProgrammeVersion, QualityReview,
AccreditationProcess, QualityIndicator or other future quality contexts
without duplicating the evidence record.

### Assessment

Assessment represents an evaluation of a Requirement in a specific context.
The context remains flexible enough to support AccreditationProcess,
QualityReview and future quality processes without creating separate
assessment concepts for each process.

Conceptual fields:

- `id`
- `requirement_id`
- `context_type`
- `context_id`
- `assessor`
- `result`
- `comment`
- `assessed_at`

An Assessment may use one or more Evidence records. Detailed result enums
are not defined yet.

### Finding

Finding represents a traceable outcome or observation arising from an
Assessment, review, monitoring activity or another quality process.

Conceptual fields:

- `id`
- `finding_type`
- `title`
- `description`
- `source_context_type`
- `source_context_id`
- `created_at`
- `status`

A Finding may represent non-compliance, weakness, risk, strength, good
practice or an improvement opportunity. Detailed `finding_type` and `status`
enums are not defined yet.

A Finding may arise from an Assessment, but the architecture also supports
findings originating directly from a review or monitoring process.

### Action

Action represents a corrective, preventive or improvement action responding
to a Finding or another approved improvement need.

Conceptual fields:

- `id`
- `finding_id`
- `title`
- `description`
- `responsible_party`
- `due_at`
- `status`
- `created_at`
- `completed_at`

A Finding may have zero, one or multiple Actions. Actions must support
traceable responsibility and deadlines. Detailed Action status enums are not
defined yet.

### Verification

Verification records whether an Action was actually implemented and whether
it was effective. These are conceptually distinct questions and must remain
auditable independently.

Conceptual fields:

- `id`
- `action_id`
- `verifier`
- `verified_at`
- `implementation_verified`
- `effectiveness_verified`
- `comment`

An Action may require one or more Verification records over time.
Verification remains separate from Action so that implementation and
effectiveness can be independently audited.

### Closure

Closure is not a separate entity yet. It is a controlled state reached only
when the relevant Action or Actions and required Verification records
demonstrate that the quality loop can be closed.

The architecture must preserve the evidence and verification history after
closure. Closing an issue must not erase its history.

## 16. Shared quality-management relationships

The core conceptual cardinalities are:

```text
Requirement
    1:N
Assessment

Assessment
    N:M
Evidence

Assessment
    0:N
Finding

Finding
    0:N
Action

Action
    0:N
Verification
```

The traceability chain is:

```text
Requirement
    |
Evidence
    |
Assessment
    |
Finding
    |
Action
    |
Verification
    |
Closure
```

This diagram represents traceability, not necessarily simple one-to-one
database cardinality. In particular, one Assessment may use multiple
Evidence records, Findings may arise from more than one source, and Actions
and Verifications may occur in multiples over time.

## 17. Shared quality-management principles

1. Requirement, Evidence, Assessment, Finding, Action and Verification are
   shared quality-management concepts.
2. Accreditation and programme quality review reuse these concepts rather
   than creating process-specific copies.
3. Quality evidence remains traceable to its source.
4. Findings remain traceable to the process, review, assessment or monitoring
   context in which they arose.
5. Actions have clear responsibility and deadlines.
6. Closing an issue does not erase its history.
7. Verification of implementation and verification of effectiveness are
   conceptually distinct.
8. The architecture supports institutional memory across successive
   ProgrammeVersions and quality cycles.
9. The system can reconstruct the chain Requirement -> Evidence ->
   Assessment -> Finding -> Action -> Verification.
10. The shared quality-management core remains usable beyond accreditation.

## 18. Role-aware access model

Access to the system is contextual and scoped. It is not a simple model in
which every User has exactly one permanent Role.

The conceptual relationship is:

```text
User
    1:N
RoleAssignment
```

A RoleAssignment contains:

- `user_id`
- `role`
- `scope_type`
- `scope_id`
- `valid_from`
- `valid_to`

Conceptually, access is determined by:

```text
User
    + RoleAssignment
    + Scope
    + Permission
    + Validity
```

The same user may hold several assignments at once. For example, a person
may be a GARANT_SP for StudyProgramme N-PI and also a CLEN_RADY_SP for that
same programme, while separately holding a global quality-office assignment.
Another person may be a HODNOTITEL_PS within one AccreditationProcess, and an
EXTERNI_AUDITOR may have a time-limited AUDIT scope for one explicitly
assigned audit.

Supported conceptual scope types include:

- `GLOBAL`
- `FACULTY`
- `STUDY_PROGRAMME`
- `PROGRAMME_VERSION`
- `ACCREDITATION_PROCESS`
- `QUALITY_REVIEW`
- `AUDIT`

This is scoped, contextual access control rather than simple single-role
RBAC. Role, scope, permissions and validity determine the working
perspective. External assignments expose only their explicitly granted
scope.

Academic ownership, review, process administration and formal
decision-making are separate responsibilities. The architecture therefore
preserves:

```text
EDITING != RESPONSIBILITY != ASSESSMENT != DECISION
```

One role must not implicitly gain another role's authority. User, Role and
RoleAssignment persistence tables are not defined yet; this section is the
conceptual boundary for future authorization design.

## 19. Quality-loop closure and separation of duties

Quality-loop closure requires Verification. Completing an Action alone does
not close the related Finding or quality case.

Verification should be independent from the actor responsible for the
Action where governance requires separation of duties. Implementation and
effectiveness are separate verification questions and must remain auditable
independently.

The architecture therefore preserves:

```text
ACTION COMPLETION != EFFECTIVENESS VERIFICATION != CLOSURE
```

Closure remains a derived or controlled state, not a separate Closure entity.
The full Requirement, Evidence, Assessment, Finding, Action and Verification
history remains available after closure.
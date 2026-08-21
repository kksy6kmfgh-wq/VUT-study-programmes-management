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
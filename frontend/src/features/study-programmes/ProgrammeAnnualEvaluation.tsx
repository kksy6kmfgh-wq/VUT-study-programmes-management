import { useState } from 'react'
import { councilTables } from '../../content/programmeCouncil'

export function ProgrammeAnnualEvaluation() {
  const [selected, setSelected] = useState(0)
  const table = councilTables[selected]
  return <div className="annual-evaluation-page">
    <section className="annual-evaluation-header"><div><span className="eyebrow">ROČNÍ EVALUACE · 2027</span><h2>Jak program fungoval a co změníme</h2><p>Strukturované výroční vyhodnocení: data → interpretace → vyhodnocení opatření → problémy a rizika → návrhy změn → plán dalšího roku.</p></div><div className="annual-evaluation-state"><strong>Rozpracováno</strong><span>Termín 15. 12. 2027</span><b>72 %</b></div></section>
    <div className="annual-evaluation-flow"><span className="done">1 Data připravena</span><b>→</b><span className="current">2 Komentář garanta</span><b>→</b><span>3 Projednání radou</span><b>→</b><span>4 Plán změn</span><b>→</b><span>5 Uzavření</span></div>
    <div className="annual-evaluation-layout">
      <aside className="annual-evaluation-nav"><strong>Roční evaluace 2027</strong><button type="button">Souhrn roku</button><button type="button">Vyhodnocení opatření</button><div className="annual-table-nav"><strong>Data a interpretace · tabulky 1–18</strong>{councilTables.map((item,index)=><button type="button" className={selected===index?'active':''} onClick={()=>setSelected(index)} key={item.number}>Tab. {item.number} · {item.title}</button>)}</div><button type="button">Silné stránky</button><button type="button">Problémy a rizika</button><button type="button">Návrhy změn</button><button type="button">Plán dalšího roku</button><button type="button">Stanovisko rady SP</button></aside>
      <main className="annual-evaluation-content">
        <section className="council-table-card"><span className="eyebrow">TABULKA {table.number} · DATA PRO ROČNÍ EVALUACI</span><h2>{table.title}</h2><p className="section-caption">{table.purpose}</p><div className="source-table-wrap"><table><thead><tr>{table.columns.map(column=><th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row,rowIndex)=><tr key={rowIndex}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
          <div className="annual-evaluation-commentary"><div className="system-data-note"><strong>1 · DATA VUT</strong><span>Automaticky dodaná data jsou vstupem pro interpretaci; garant je zde neupravuje.</span></div><label><strong>2 · INTERPRETACE GARANTA</strong><textarea defaultValue={table.comment || 'Popište, co z dat vyplývá, zda je vývoj očekávaný a zda vzniká problém nebo riziko.'}/></label><label><strong>3 · ZÁVĚR RADY SP</strong><textarea defaultValue={table.conclusion || 'Po projednání rada SP doplní závěr a rozhodne, zda je třeba sledování nebo opatření.'}/></label><div className="annual-evaluation-actions"><button type="button" className="text-button">+ Vytvořit zjištění</button><button type="button" className="text-button">+ Navrhnout opatření</button></div></div>
        </section>
        <section className="annual-summary-panel"><h2>Výstup roční evaluace</h2><div><span>Hlavní silné stránky</span><p>Co se v programu v uplynulém roce dařilo a co chceme zachovat.</p></div><div><span>Hlavní problémy a rizika</span><p>Souhrn z dat, jednání rady SP, studentské zpětné vazby a otevřených zjištění.</p></div><div><span>Vyhodnocení minulých opatření</span><p>Účinné · částečně účinné · neúčinné · čeká na ověření.</p></div><div><span>Návrhy změn programu</span><p>Drobné změny, nová opatření nebo podnět k vytvoření nové verze SP.</p></div><div><span>Plán na další rok</span><p>Opatření · odpovědná osoba · termín · očekávaný účinek · způsob ověření.</p></div></section>
      </main>
    </div>
  </div>
}

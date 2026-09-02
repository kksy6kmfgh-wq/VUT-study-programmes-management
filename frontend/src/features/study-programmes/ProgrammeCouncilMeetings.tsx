import { useState } from 'react'

const meetings = [
  { date:'12. 11. 2027', title:'Rada SP – podzimní jednání', status:'Uzavřeno', issues:2 },
  { date:'18. 4. 2027', title:'Rada SP – jarní jednání', status:'Uzavřeno', issues:1 },
  { date:'9. 12. 2026', title:'Rada SP – roční závěr', status:'Uzavřeno', issues:3 },
]

export function ProgrammeCouncilMeetings() {
  const [selected, setSelected] = useState(0)
  const meeting = meetings[selected]
  return <div className="council-meetings-page">
    <div className="section-panel-header"><div><span className="eyebrow">PRŮBĚŽNÉ ŘÍZENÍ PROGRAMU</span><h2>Rada studijního programu</h2><span className="section-caption">Zápisy, problémy, rozhodnutí a opatření vznikající během realizace programu. Rada jedná minimálně jednou ročně.</span></div><button type="button" className="primary-button">+ Nové jednání rady</button></div>
    <div className="council-meetings-layout">
      <aside className="section-panel meeting-list"><strong>Jednání rady SP</strong>{meetings.map((item,index)=><button type="button" className={selected===index?'selected':''} onClick={()=>setSelected(index)} key={item.date}><span>{item.date}</span><strong>{item.title}</strong><small>{item.status} · {item.issues} zjištění</small></button>)}</aside>
      <main className="section-panel meeting-detail"><div className="meeting-heading"><div><span className="eyebrow">ZÁPIS Z JEDNÁNÍ</span><h2>{meeting.title}</h2><span>{meeting.date} · Rada SP N-PI</span></div><span className="closed-chip">Uzavřeno</span></div>
        <div className="meeting-fields"><div><span>Přítomní</span><p>Garant SP, členové rady SP, zástupce studentů, zástupce zaměstnavatelů.</p></div><div><span>Program jednání</span><p>Vývoj programu, průchodnost studiem, podněty studentů, stav opatření, příprava roční evaluace.</p></div><div className="wide"><span>Zápis a závěry</span><p>Rada projednala dostupná data a stav dříve přijatých opatření. Identifikovala potřebu sledovat průchodnost ve 2. ročníku a posílit projektovou výuku.</p></div></div>
        <h3>Problémy, rizika a opatření z jednání</h3>
        <div className="meeting-actions-table"><div className="meeting-actions-head"><span>Problém / zjištění</span><span>Opatření / řešení</span><span>Odpovědná osoba</span><span>Termín</span><span>Stav</span></div><div><strong>Průchodnost ve 2. ročníku</strong><span>Prověřit návaznost klíčových předmětů a navrhnout úpravu.</span><span>Garant SP</span><span>30. 6. 2028</span><b>V řešení</b></div><div><strong>Projektová výuka</strong><span>Připravit společné zadání s průmyslovým partnerem.</span><span>Koordinátor předmětu</span><span>31. 8. 2028</span><b>Plánováno</b></div></div>
        <div className="meeting-footer-actions"><button type="button" className="text-button">+ Zapsat problém</button><button type="button" className="text-button">+ Přidat opatření</button><button type="button" className="text-button">Zobrazit historii →</button></div>
      </main>
    </div>
  </div>
}

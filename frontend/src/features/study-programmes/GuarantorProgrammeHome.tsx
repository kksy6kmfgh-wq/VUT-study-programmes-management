import type { StudyProgramme } from '../../types/studyProgramme'
import { StatusBadge } from '../../components/StatusBadge'

export function GuarantorProgrammeHome({ programme, onNavigate }: { programme: StudyProgramme; onNavigate: (tab: string) => void }) {
  return <div className="guarantor-home">
    <section className="guarantor-inbox">
      <div className="section-panel-header"><div><span className="eyebrow">PRACOVNÍ INBOX GARANTA</span><h2>Co vyžaduje vaši pozornost</h2><span className="section-caption">Úkoly, doplnění a termíny spojené s aktuální verzí programu.</span></div><span className="guarantor-task-count">4 úkoly</span></div>
      <div className="guarantor-task-list">
        <button type="button" onClick={() => onNavigate('Studijní program')}><span className="task-priority high">!</span><span><strong>Studijní program · návrh změny G27</strong><small>Požadavek se řeší návrhem nové verze; schválená verze zůstává uzamčena.</small></span><span className="task-deadline">30. 9. 2027</span><b>Otevřít →</b></button>
        <button type="button" onClick={() => onNavigate('Roční evaluace')}><span className="task-priority medium">●</span><span><strong>Roční hodnocení 2027 · doplnit komentář garanta</strong><small>Data jsou připravena, čeká se na interpretaci před jednáním rady SP.</small></span><span className="task-deadline">15. 12. 2027</span><b>Pokračovat →</b></button>
        <button type="button" onClick={() => onNavigate('Důkazy')}><span className="task-priority medium">●</span><span><strong>2 důkazy je nutné aktualizovat</strong><small>Kurikulární mapa a zápis rady SP mají novější verzi.</small></span><span className="task-deadline">bez termínu</span><b>Otevřít →</b></button>
        <button type="button" onClick={() => onNavigate('Opatření')}><span className="task-priority low">●</span><span><strong>A014 · blíží se termín opatření</strong><small>Aktualizujte stav realizace a připravte podklad pro ověření účinnosti.</small></span><span className="task-deadline">30. 6. 2028</span><b>Otevřít →</b></button>
      </div>
    </section>

    <div className="programme-file-metrics">
      <div><span>Aktuální verze</span><strong>Verze {programme.activeVersion}</strong><small>{programme.validFrom}</small></div>
      <div><span>Stav programu</span><strong><StatusBadge status={programme.status} /></strong><small>realizace a monitoring</small></div>
      <div><span>Studijní program</span><strong>Schválen</strong><small>79 / 79 G položek · uzamčeno</small></div>
      <div><span>Roční hodnocení</span><strong>Probíhá</strong><small>rok 2027</small></div>
      <div><span>Otevřená zjištění</span><strong>3</strong><small>2 vyžadují reakci</small></div>
      <div><span>Opatření</span><strong>{programme.openActions}</strong><small>1 čeká na ověření</small></div>
    </div>

    <div className="guarantor-overview-grid">
      <section className="section-panel">
        <div className="section-panel-header"><div><h2>Stav programu</h2><span className="section-caption">Základní provozní a hodnoticí informace.</span></div></div>
        <dl className="guarantor-facts">
          <div><dt>Garant</dt><dd>Pavel Lošák</dd></div>
          <div><dt>Fakulta</dt><dd>{programme.faculty}</dd></div>
          <div><dt>Typ studia</dt><dd>{programme.degreeType}</dd></div>
          <div><dt>Oprávnění / rozhodnutí</dt><dd>RVH VUT · platnost do 31. 8. 2031</dd></div>
          <div><dt>Poslední hodnocení</dt><dd>2026</dd></div>
          <div><dt>Další periodické hodnocení</dt><dd>{programme.nextReview}</dd></div>
        </dl>
      </section>

      <section className="section-panel quality-loop-panel">
        <div className="section-panel-header"><div><h2>Quality loop programu</h2><span className="section-caption">Od zjištění k ověřenému zlepšení.</span></div></div>
        <div className="quality-loop-flow">
          <div><strong>3</strong><span>Zjištění</span></div><b>→</b><div><strong>4</strong><span>Opatření</span></div><b>→</b><div><strong>1</strong><span>Čeká na ověření</span></div><b>→</b><div><strong>12</strong><span>Uzavřeno</span></div>
        </div>
        <p className="decision-note"><strong>Princip:</strong> dokončené opatření není automaticky uzavřený quality loop. Uzavření vyžaduje ověření účinnosti.</p>
      </section>
    </div>
  </div>
}

import { CalendarDays } from 'lucide-react'
import { useState, type CSSProperties } from 'react'

type ScheduleItem = {
  time?: string
  title: string
  kind?: 'break' | 'highlight'
}

type ScheduleDay = {
  label: string
  title: string
  items: ScheduleItem[]
}

const schedule: ScheduleDay[] = [
  {
    label: 'Dia 1',
    title: 'Abertura',
    items: [
      { time: '08h00', title: 'Credenciamento e Café da Manhã', kind: 'break' },
      { time: '09h00', title: 'Mesa de Abertura: Cláudio, Denis e Prof. Antônio', kind: 'highlight' },
      { time: '10h00', title: 'Palestra 1: O potencial da Margem Equatorial Brasileira no Cenário Energético Mundial' },
      { time: '10h50', title: 'Sorteio de Brindes', kind: 'break' },
      { time: '11h00', title: 'Palestra 2: Geologia da Margem Equatorial: sistemas petrolíferos de produção' },
      { time: '12h00', title: 'Almoço', kind: 'break' },
      { time: '14h00', title: 'Momento Picolé', kind: 'break' },
      { time: '14h30', title: 'Palestra 3: Aquisição e Interpretação Sísmica da Exploração Offshore' },
      { time: '15h30', title: 'Palestra 4: Gestão de Riscos na Exploração Offshore: segurança, meio ambiente e operações' },
      { time: '16h30', title: 'Painel 1: Licenciamento ambiental e desafios regulatórios na Margem Equatorial', kind: 'highlight' },
      { time: '17h30', title: 'Sorteio de Brindes', kind: 'break' },
      { time: '18h00', title: 'Coffee Break e Atração', kind: 'break' },
    ],
  },
  {
    label: 'Dia 2',
    title: 'Exploração e carreira',
    items: [
      { time: '08h30', title: 'Café da Manhã', kind: 'break' },
      { time: '09h00', title: 'Palestra 5: Perfuração Offshore em águas profundas e ultraprofundas' },
      { time: '09h50', title: 'Sorteio de Brindes', kind: 'break' },
      { time: '10h00', title: 'Palestra 6: Fluidos de perfuração e sua influência na estabilidade e produção do poço' },
      { time: '11h00', title: 'Painel 2: Como ingressar com sucesso no mercado de trabalho: ter um perfil relevante na indústria de óleo e gás', kind: 'highlight' },
      { time: '12h00', title: 'Almoço', kind: 'break' },
      { time: '14h00', title: 'Momento Picolé', kind: 'break' },
      { time: '14h30', title: 'Palestra 7: Engenharia de Reservatório: desenvolvimento de campos na Margem Equatorial' },
      { time: '15h40', title: 'Minicurso 1: Engenharia Submarina e Produção Offshore: sistemas subsea, infraestrutura e tecnologias para otimização da eficiência operacional', kind: 'highlight' },
      { time: '17h40', title: 'Sorteio de Brindes', kind: 'break' },
      { time: '18h00', title: 'Coffee Break e Atração', kind: 'break' },
    ],
  },
  {
    label: 'Dia 3',
    title: 'Tecnologia e futuro',
    items: [
      { time: '08h30', title: 'Café da Manhã', kind: 'break' },
      { time: '09h00', title: 'Minicurso 2: Controle de poço ou introdução ao Machine Learning para aplicações em óleo e gás', kind: 'highlight' },
      { time: '10h00', title: 'Intervalo do Minicurso e Sorteio de Brindes', kind: 'break' },
      { time: '10h10', title: 'Continuação do Minicurso', kind: 'highlight' },
      { time: '11h00', title: 'Mesa-redonda: Perspectivas profissionais em torno da exploração da Margem Equatorial', kind: 'highlight' },
      { time: '12h00', title: 'Almoço', kind: 'break' },
      { time: '14h00', title: 'Momento Picolé', kind: 'break' },
      { time: '14h30', title: 'Palestra 8: CCUS — Captura, Utilização e Armazenamento de Carbono da indústria de óleo e gás' },
      { time: '15h30', title: 'Palestra 9: O futuro da Engenharia de Petróleo na era da Inteligência Artificial: da sísmica à descoberta de reservatórios' },
      { time: '15h40', title: 'Sorteio de Brindes', kind: 'break' },
      { time: '16h00', title: 'Palestra SLB' },
      { time: '17h00', title: 'Encerramento', kind: 'highlight' },
      { time: '17h30', title: 'Coffee Break (Casemirão)', kind: 'break' },
      { title: 'Coquetel — Casemirão', kind: 'break' },
    ],
  },
]

export function EnergyFieldSection() {
  const [activeDay, setActiveDay] = useState(0)
  const day = schedule[activeDay]

  return <section className="energy-field energy-field--schedule" id="programacao" aria-labelledby="energy-field-title">
    <div className="energy-field__glow" aria-hidden="true" />
    <div className="energy-field__mesh" aria-hidden="true" />

    <div className="energy-field__content schedule-layout">
      <header className="energy-field__heading">
        <span>Energia em movimento</span>
        <h2 id="energy-field-title">Programação, público <em>e temas</em></h2>
        <p>Conhecimento, tecnologia e futuro conectando a Amazônia.</p>
      </header>

      <div className="schedule" aria-label="Programação dos três dias do evento">
        <div className="schedule__tabs" role="tablist" aria-label="Escolha o dia da programação">
          {schedule.map((item, index) => <button
            key={item.label}
            id={`schedule-tab-${index + 1}`}
            type="button"
            role="tab"
            aria-selected={activeDay === index}
            aria-controls={`schedule-panel-${index + 1}`}
            className={activeDay === index ? 'is-active' : ''}
            onClick={() => setActiveDay(index)}
          ><small>Programação</small><strong>{item.label}</strong></button>)}
        </div>

        <div key={activeDay} className="schedule__panel schedule__panel--entering" id={`schedule-panel-${activeDay + 1}`} role="tabpanel" aria-labelledby={`schedule-tab-${activeDay + 1}`}>
          <div className="schedule__day-heading"><CalendarDays aria-hidden="true" /><span><small>{day.label}</small><strong>{day.title}</strong></span></div>
          <ol className="schedule__list">
            {day.items.map((item, index) => <li style={{ '--item-index': index } as CSSProperties} className={item.kind ? `schedule__item schedule__item--${item.kind}` : 'schedule__item'} key={`${item.time}-${index}`}>
              <time>{item.time ?? 'Após'}</time>
              <span>{item.title}</span>
            </li>)}
          </ol>
        </div>
      </div>
    </div>
  </section>
}

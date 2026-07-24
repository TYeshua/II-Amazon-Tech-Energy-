import { ArrowLeft, ArrowRight, Cpu, MessagesSquare, Presentation, Target, Users, UserRoundSearch, type LucideIcon } from 'lucide-react'
import { useState, type CSSProperties } from 'react'

type EnergyCard = {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  tone: 'green' | 'blue'
  suffix?: string
  items?: string[]
}

const cards: EnergyCard[] = [
  { eyebrow: 'Programação', title: '10 palestras', description: 'Conteúdo técnico, tendências e perspectivas para o futuro da energia.', icon: Presentation, tone: 'green' },
  { eyebrow: 'Estimativa de público', title: '100–150', suffix: 'pessoas por dia', description: 'Um encontro próximo, relevante e pensado para boas conexões.', icon: Users, tone: 'green' },
  { eyebrow: 'Programação', title: '2 mesas-redondas', description: 'Debate aberto e troca de experiências entre diferentes vozes do setor.', icon: MessagesSquare, tone: 'blue' },
  { eyebrow: 'Perfis de audiência', title: 'Uma rede diversa', description: 'Estudantes, profissionais e interessados em energia, indústria e inovação.', icon: UserRoundSearch, tone: 'blue' },
  {
    eyebrow: 'Público-alvo', title: 'Para quem é o evento', description: 'Conhecimento que aproxima formação, mercado e novas oportunidades.',
    icon: Target, tone: 'green',
    items: ['Estudantes da região Norte e de todo o Brasil', 'Profissionais dos setores energético e tecnológico', 'Interessados em energia, indústria e inovação'],
  },
  {
    eyebrow: 'Conteúdo', title: 'Temas previstos', description: 'Da exploração à produção, com tecnologia e desenvolvimento regional.',
    icon: Cpu, tone: 'blue',
    items: ['Margem Equatorial', 'Engenharia de Reservatório', 'Energia e carreira', 'Engenharia de Poço', 'Tecnologia e Indústria 4.0'],
  },
]

export function EnergyFieldSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)

  const selectCard = (index: number) => {
    setHasInteracted(true)
    setActiveIndex((index + cards.length) % cards.length)
  }

  return <section className="energy-field" aria-labelledby="energy-field-title">
    <div className="energy-field__glow" aria-hidden="true" />
    <div className="energy-field__mesh" aria-hidden="true" />

    <div className="energy-field__content">
      <header className="energy-field__heading">
        <span>Energia em movimento</span>
        <h2 id="energy-field-title">Programação,<br />público <em>e temas</em></h2>
        <p>Conhecimento, tecnologia e futuro conectando a Amazônia.</p>
      </header>

      <div className={`energy-orbit${hasInteracted ? ' is-interactive' : ''}`} aria-label="Programação, público e temas do evento">
        <div className="energy-orbit__rings" aria-hidden="true"><i /><i /><i /></div>
        <div className="energy-orbit__core" aria-hidden="true"><span>ATE</span><small>2026</small></div>

        {cards.map((card, index) => {
          const relative = (index - activeIndex + cards.length) % cards.length
          const angle = relative * (Math.PI * 2 / cards.length)
          const style = {
            '--orbit-x': `${Math.sin(angle) * 44}%`,
            '--orbit-y': `${-Math.cos(angle) * 35}%`,
            '--orbit-depth': Math.cos(angle).toFixed(3),
            '--orbit-order': Math.round((Math.cos(angle) + 1) * 10),
          } as CSSProperties
          const Icon = card.icon
          return <button
            key={card.title}
            type="button"
            className={`energy-orbit__card energy-orbit__card--${card.tone}${index === activeIndex ? ' is-active' : ''}`}
            style={style}
            onClick={() => selectCard(index)}
            aria-pressed={index === activeIndex}
            aria-label={`${card.eyebrow}: ${card.title}`}
          >
            <span className="energy-orbit__card-top"><Icon aria-hidden="true" /><small>{String(index + 1).padStart(2, '0')}</small></span>
            <span className="energy-orbit__eyebrow">{card.eyebrow}</span>
            <strong>{card.title}</strong>
            {card.suffix && <b>{card.suffix}</b>}
            <span className="energy-orbit__description">{card.description}</span>
            {card.items && <span className="energy-orbit__items">{card.items.map(item => <i key={item}>{item}</i>)}</span>}
          </button>
        })}

        <div className="energy-orbit__controls">
          <button type="button" onClick={() => selectCard(activeIndex - 1)} aria-label="Ver card anterior"><ArrowLeft /></button>
          <span><b>{String(activeIndex + 1).padStart(2, '0')}</b> / {String(cards.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => selectCard(activeIndex + 1)} aria-label="Ver próximo card"><ArrowRight /></button>
        </div>
        <p className="energy-orbit__hint">Clique em um card para movimentar a experiência</p>
      </div>
    </div>
  </section>
}

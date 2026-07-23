import Antigravity from './Antigravity'
import BorderGlow from './BorderGlow'
import { Cpu, MessagesSquare, Presentation, Target, Users, UserRoundSearch } from 'lucide-react'

const highlights = [
  { value: '10 palestras', detail: 'Conteúdo técnico e tendências', tone: 'green', icon: Presentation },
  { value: '100–150', suffix: 'pessoas por dia', detail: 'Estimativa de público', tone: 'green', icon: Users },
  { value: '2 mesas-redondas', detail: 'Debate e troca de experiências', tone: 'blue', icon: MessagesSquare },
  { value: 'Perfis de audiência', detail: 'Estudantes, profissionais e interessados', tone: 'blue', icon: UserRoundSearch },
]

const audiences = [
  'Estudantes da região Norte e de outras regiões do Brasil.',
  'Profissionais dos setores energético e tecnológico.',
  'Interessados em energia, indústria e inovação.',
]

const themes = [
  'Margem Equatorial',
  'Engenharia de Reservatório',
  'Energia e carreira',
  'Engenharia de Poço',
  'Tecnologia e Indústria 4.0',
]

export function EnergyFieldSection() {
  return <section className="energy-field" aria-labelledby="energy-field-title">
    <div className="energy-field__glow" aria-hidden="true" />
    <div className="energy-field__particles" aria-hidden="true">
      <Antigravity count={300} magnetRadius={6} ringRadius={7} waveSpeed={.38} waveAmplitude={.8} particleSize={1.2} lerpSpeed={.045} color="#65bd59" colorSecondary="#159b9d" opacity={.64} autoAnimate particleVariance={.8} rotationSpeed={.015} depthFactor={.8} pulseSpeed={2.4} fieldStrength={11} />
    </div>

    <div className="energy-field__content">
      <div className="energy-field__overview">
        <header className="energy-field__heading">
          <span>Energia em movimento</span>
          <h2 id="energy-field-title">Programação,<br />público <em>e temas</em></h2>
          <p>Conhecimento, tecnologia e futuro conectando a Amazônia.</p>
        </header>

        <div className="energy-field__highlights">
          {highlights.map((item, index) => <BorderGlow key={item.value} className={`energy-stat energy-stat--${item.tone}`} edgeSensitivity={28} glowRadius={28} glowIntensity={.55} coneSpread={18}>
            <div className="energy-stat__top"><item.icon size={18} strokeWidth={1.6} /><span>0{index + 1}</span></div>
            <strong>{item.value}</strong>
            {item.suffix && <small>{item.suffix}</small>}
            <span className="energy-stat__detail">{item.detail}</span>
          </BorderGlow>)}
        </div>
      </div>

      <div className="energy-field__details">
        <BorderGlow className="energy-detail" edgeSensitivity={20} glowRadius={38} glowIntensity={.75} coneSpread={24}>
          <div className="energy-detail__inner">
            <span className="energy-detail__icon"><Target size={20} /></span>
            <span className="energy-detail__label">Público-alvo</span>
            <h3>Para quem é o evento</h3>
            <ul>{audiences.map((audience) => <li key={audience}>{audience}</li>)}</ul>
          </div>
        </BorderGlow>

        <BorderGlow className="energy-detail" edgeSensitivity={20} glowRadius={38} glowIntensity={.75} coneSpread={24}>
          <div className="energy-detail__inner">
            <span className="energy-detail__icon"><Cpu size={20} /></span>
            <span className="energy-detail__label">Conteúdo</span>
            <h3>Temas previstos</h3>
            <div className="energy-themes">{themes.map((theme, index) => <span className={index % 2 ? 'is-blue' : ''} key={theme}>{theme}</span>)}</div>
          </div>
        </BorderGlow>
      </div>
    </div>
  </section>
}

import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react'

const basins = [
  {
    name: 'Foz do Amazonas',
    initials: 'AP',
    location: 'Litoral do Amapá e norte do Pará',
    fact: 'A Bacia da Foz do Amazonas ocupa a porção mais setentrional da Margem Equatorial. Sua geologia offshore integra um sistema sedimentar influenciado pelo enorme volume de sedimentos transportado pelo rio Amazonas.',
  },
  {
    name: 'Pará–Maranhão',
    initials: 'PA',
    location: 'Costa do Pará e oeste do Maranhão',
    fact: 'A Bacia do Pará–Maranhão fica entre a Foz do Amazonas e Barreirinhas. Em águas profundas, reúne espessas sequências sedimentares formadas durante a abertura do Atlântico Equatorial.',
  },
  {
    name: 'Barreirinhas',
    initials: 'MA',
    location: 'Costa norte do estado do Maranhão',
    fact: 'Diferente de outras bacias da costa brasileira, Barreirinhas fica em uma margem do tipo “transformante”, onde grandes falhas horizontais e zonas de fratura controlaram a crosta durante a separação dos continentes.',
  },
  {
    name: 'Ceará',
    initials: 'CE',
    location: 'Costa dos estados do Ceará e Piauí',
    fact: 'A Bacia do Ceará é dividida em diferentes sub-bacias por altos estruturais. Essa compartimentação registra etapas distintas da evolução tectônica do Atlântico Equatorial.',
  },
  {
    name: 'Potiguar',
    initials: 'RN',
    location: 'Costa do Ceará e Rio Grande do Norte',
    fact: 'A Bacia Potiguar é a única da Margem Equatorial com produção de petróleo tanto em terra quanto no mar. Seu registro geológico preserva a transição entre a ruptura continental e a formação do oceano Atlântico.',
  },
]

export function BasinSection() {
  const [active, setActive] = useState(0)

  const basin = basins[active]

  const goPrev = () => setActive((current) => (current - 1 + basins.length) % basins.length)
  const goNext = () => setActive((current) => (current + 1) % basins.length)

  return (
    <section className="basin basin-story" id="bacia" aria-label="Curiosidades sobre as bacias da Margem Equatorial">
      <div className="basin-grid">
        <div className="basin-nav">
          <button type="button" className="basin-nav-btn" aria-label="Bacia anterior" onClick={goPrev}>
            <ChevronUp size={16} />
          </button>
          <div className="basin-progress" role="tablist" aria-label="Selecionar bacia">
            {basins.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Bacia ${item.name}`}
                className={index === active ? 'is-active' : ''}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button type="button" className="basin-nav-btn" aria-label="Próxima bacia" onClick={goNext}>
            <ChevronDown size={16} />
          </button>
        </div>
        <div className="orbit-reveal">
          <div className={`orbit orbit--step-${active + 1}`} key={basin.name}>
            <div className="arc" />
            <i className="node n1" />
            <i className="node n2"><i className="orbit-pulse" /></i>
            <i className="node n3" />
            <i className="basin-connector" />
            <div className="basin-changing" key={basin.name}>
              <div className={`basin-shape basin-shape--${active + 1}`}>{basin.initials}</div>
              <div className="basin-label">
                <strong>BACIA {basin.name.toUpperCase()}</strong>
                <span><MapPin size={12} /> {basin.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="basin-quote-wrap" aria-live="polite">
          <blockquote key={basin.name}>
            <span>“</span>{basin.fact}
          </blockquote>
          <p className="basin-counter"><b>{String(active + 1).padStart(2, '0')}</b> / {String(basins.length).padStart(2, '0')}</p>
        </div>
      </div>
    </section>
  )
}

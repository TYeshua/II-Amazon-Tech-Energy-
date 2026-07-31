import { useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

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
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const handleScroll = () => {
      const scroller = scrollerRef.current
      if (!scroller) return
      const distance = Math.max(1, scroller.scrollHeight - scroller.clientHeight)
      const progress = Math.min(1, Math.max(0, scroller.scrollTop / distance))
      setActive(Math.round(progress * (basins.length - 1)))
  }

  const basin = basins[active]

  return (
    <section className="basin basin-story" id="bacia" aria-label="Curiosidades sobre as bacias da Margem Equatorial">
      <div className="basin-scroller" ref={scrollerRef} onScroll={handleScroll} tabIndex={0} aria-label="Role para conhecer as cinco bacias">
        <div className="basin-sticky">
        <div className="basin-grid">
          <div className="basin-progress" aria-label={`Bacia ${active + 1} de ${basins.length}`}>
            {basins.map((item, index) => (
              <span key={item.name} className={index === active ? 'is-active' : ''} />
            ))}
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
        </div>
        <div className="basin-scroll-track" aria-hidden="true" />
      </div>
    </section>
  )
}

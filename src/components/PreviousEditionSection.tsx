import { Images, Sparkles, ZoomIn } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

const photos = ['A1.webp', 'A2.webp', 'A3.webp', 'A4.webp', 'A6.webp']
const transforms = [
  'rotate(-8deg) translateX(-156px)',
  'rotate(-4deg) translateX(-78px)',
  'rotate(1deg)',
  'rotate(5deg) translateX(78px)',
  'rotate(9deg) translateX(156px)',
]

export function PreviousEditionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '100px 0px', threshold: .12 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (selected === null) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null)
    addEventListener('keydown', close)
    return () => removeEventListener('keydown', close)
  }, [selected])

  return <section ref={sectionRef} className={`previous-edition${visible ? ' is-visible' : ''}${open ? ' is-open' : ''}`} id="amazon-2025" aria-labelledby="previous-edition-title">
    <div className="previous-edition__grid" aria-hidden="true" />
    <div className="previous-edition__glow" aria-hidden="true" />
    <div className="section-inner previous-edition__content">
      <div className="previous-edition__copy">
        <p className="previous-edition__eyebrow"><span /> Nossa história</p>
        <h2 id="previous-edition-title">1º Amazon<br/><em>em 2025</em></h2>
        <p className="previous-edition__lead">Antes de avançarmos para uma nova edição, abrimos o arquivo de onde tudo começou: encontros, ideias e conexões que deram vida ao primeiro Amazon Tech Energy.</p>
        <div className="previous-edition__note">
          <Sparkles aria-hidden="true" />
          <span><small>Primeira edição</small>Memórias que impulsionam o próximo capítulo.</span>
        </div>
      </div>

      <div className="edition-archive">
        <div className="edition-cards" aria-label="Galeria de registros da primeira edição">
          {photos.map((photo, index) => <button
            type="button"
            className={`edition-card${selected === index ? ' is-selected' : ''}`}
            key={photo}
            style={{ '--card-transform': transforms[index], '--card-delay': `${index * 65}ms` } as CSSProperties}
            onClick={() => setSelected(value => value === index ? null : index)}
            aria-label={`${selected === index ? 'Reduzir' : 'Ampliar'} registro ${index + 1}`}
            aria-pressed={selected === index}
          >
            <img
              src={`${import.meta.env.BASE_URL}imagens_vetorizadas/amazon_anterior/${photo}`}
              alt={`Registro ${index + 1} do 1º Amazon Tech Energy, em 2025`}
              width="640"
              height="640"
              loading="lazy"
              decoding="async"
            />
            <span><ZoomIn aria-hidden="true" /> {selected === index ? 'reduzir' : 'ampliar'}</span>
          </button>)}
        </div>

        <button className="archive-folder" type="button" onClick={() => { setOpen(value => !value); setSelected(null) }} aria-expanded={open} aria-describedby="edition-photo-stack">
          <span className="archive-folder__tab">AMAZON / 2025</span>
          <span className="archive-folder__back" />
          <span className="archive-folder__front">
            <Images aria-hidden="true" />
            <span><strong>{open ? 'Fechar arquivo' : 'Abrir arquivo'}</strong><small>registros da 1ª edição</small></span>
            <i>05</i>
          </span>
        </button>
        <span className="edition-archive__hint" id="edition-photo-stack">{open ? 'Arquivo aberto — explore os registros' : 'Clique para abrir o arquivo'}</span>
      </div>
    </div>
  </section>
}

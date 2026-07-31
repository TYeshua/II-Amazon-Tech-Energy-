import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

const organizers = [
  { name: 'Shelda Corrêa', title: 'Presidente', image: assetUrl('team_webp/shelda.webp'), linkedin: 'https://www.linkedin.com/in/shelda-corr%C3%AAa-988a10159/' },
  { name: 'Davi Maia', title: 'Vice-presidente', image: assetUrl('team_webp/davi.webp'), linkedin: 'https://www.linkedin.com/in/davi-maia-557a7634b' },
  { name: 'Evelyn Campelo', title: 'Conselheira', image: assetUrl('team_webp/Eveli.webp'), linkedin: 'https://www.linkedin.com/in/evelyncampelo' },
  { name: 'Thiago Yeshua', title: 'Diretor de Tecnologia — Webmaster', image: assetUrl('team_webp/yeshuanovo.webp'), linkedin: 'https://www.linkedin.com/in/thiagoyeshua' },
  { name: 'Ana Brito', title: 'Diretora de Marketing', image: assetUrl('team_webp/ana2.webp'), linkedin: 'https://www.linkedin.com/in/ana-clara-nascimento-7a4034255' },
  { name: 'Gabriel Braga', title: 'Diretor de Comunicação e Eventos', image: assetUrl('team_webp/braga.webp'), linkedin: 'https://www.linkedin.com/in/gabriel-braga-975990235' },
  { name: 'Ana Anjo', title: 'Tesoureira', image: assetUrl('team_webp/anaanjo.webp'), linkedin: 'https://www.linkedin.com/in/ana-clara-anjo-b59738256' },
  { name: 'Andressa Menezes', title: 'Secretária', image: assetUrl('team_webp/andressa.webp'), linkedin: 'https://www.linkedin.com/in/andressa-menezes-a1b358303' },
]

export function OrganizationSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const goTo = (index: number) => {
    const track = trackRef.current
    const card = track?.children[index] as HTMLElement | undefined
    if (!track || !card) return
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      const cards = [...track.children] as HTMLElement[]
      const closest = cards.reduce((best, card, index) =>
        Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft) < best.distance
          ? { index, distance: Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft) }
          : best, { index: 0, distance: Number.POSITIVE_INFINITY })
      setActive(closest.index)
    }
    track.addEventListener('scroll', update, { passive: true })
    return () => track.removeEventListener('scroll', update)
  }, [])

  return <section className="organization" id="organizacao" aria-labelledby="organization-title">
    <div className="organization__glow" aria-hidden="true" />
    <div className="section-inner organization__inner">
      <div className="organization__heading">
        <p className="organization__eyebrow"><span />Quem faz acontecer</p>
        <h2 id="organization-title">Organização</h2>
        <p>Conheça os responsáveis por estruturar e tornar o Amazon Tech Energy realidade.</p>
      </div>

      <div className="organization__carousel">
        <div className="organization__track" ref={trackRef} tabIndex={0} aria-label="Equipe organizadora">
          {organizers.map((person, index) => <article className="organizer-card" key={person.name}>
            <div className="organizer-card__image">
              <img src={person.image} alt={`Retrato de ${person.name}`} loading="lazy" draggable="false" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="organizer-card__body">
              <div><h3>{person.name}</h3><p>{person.title}</p></div>
              <a href={person.linkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn de ${person.name}`}><Linkedin size={17} /></a>
            </div>
          </article>)}
        </div>

        <div className="organization__controls">
          <button type="button" onClick={() => goTo(Math.max(0, active - 1))} disabled={active === 0} aria-label="Organizador anterior"><ChevronLeft /></button>
          <div className="organization__dots" aria-label="Selecionar organizador">
            {organizers.map((person, index) => <button type="button" key={person.name} className={active === index ? 'is-active' : ''} onClick={() => goTo(index)} aria-label={`Ver ${person.name}`} aria-current={active === index} />)}
          </div>
          <button type="button" onClick={() => goTo(Math.min(organizers.length - 1, active + 1))} disabled={active === organizers.length - 1} aria-label="Próximo organizador"><ChevronRight /></button>
        </div>
      </div>
    </div>
  </section>
}

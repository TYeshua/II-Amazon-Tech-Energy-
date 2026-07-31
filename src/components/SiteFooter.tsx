import { useEffect, useRef, useState } from 'react'
import { Code2, Instagram, Linkedin, Mail, X } from 'lucide-react'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

const creators = [
  { name: 'Douglas', image: assetUrl('team_webp/douglas.webp'), position: 'left' },
  { name: 'Thiago Yeshua', image: assetUrl('team_webp/yeshuanovo.webp'), role: 'Webmaster', position: 'center' },
  { name: 'Roberta', image: assetUrl('team_webp/roberta.webp'), credit: 'Criativo', position: 'right' },
]

export function SiteFooter() {
  const [isOpen, setIsOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <footer className="site-footer">
        <div className="site-footer__glow" aria-hidden="true" />
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <img src={assetUrl('speufpa.PNG')} alt="SPE UFPA Student Chapter" />
            <div>
              <strong>SPE UFPA</strong>
              <span>Student Chapter</span>
            </div>
          </div>

          <a className="site-footer__email" href="mailto:ufpaspe@gmail.com">
            <Mail aria-hidden="true" />
            <span>ufpaspe@gmail.com</span>
          </a>

          <div className="site-footer__actions">
            <nav className="site-footer__social" aria-label="Redes sociais">
              <a href="https://www.linkedin.com/company/spe-ufpa-student-chapter/posts/?feedView=all" target="_blank" rel="noreferrer" aria-label="LinkedIn da SPE UFPA">
                <Linkedin aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/spe.ufpa?igsh=dXM1M2s1bTEzbTdz" target="_blank" rel="noreferrer" aria-label="Instagram da SPE UFPA">
                <Instagram aria-hidden="true" />
              </a>
            </nav>
            <button className="site-footer__dev" type="button" onClick={() => setIsOpen(true)} aria-label="Conheça os criadores do site">
              <Code2 aria-hidden="true" />
              <span>DEV</span>
            </button>
          </div>
        </div>
        <p className="site-footer__copyright">© {new Date().getFullYear()} SPE UFPA Student Chapter</p>
      </footer>

      {isOpen && (
        <div className="creators-modal" role="dialog" aria-modal="true" aria-labelledby="creators-title" onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}>
          <div className="creators-modal__panel">
            <button ref={closeButtonRef} className="creators-modal__close" type="button" onClick={() => setIsOpen(false)} aria-label="Fechar">
              <X aria-hidden="true" />
            </button>
            <div className="creators-modal__heading">
              <span><Code2 aria-hidden="true" /> Criadores do Site</span>
              <h2 id="creators-title">Criadores do site</h2>
              <p>As pessoas que transformaram ideias em experiência digital.</p>
            </div>
            <div className="creators-modal__team">
              {creators.map((creator) => (
                <article className={`creator-card creator-card--${creator.position}`} key={creator.name}>
                  {creator.role && <span className="creator-card__badge">Webmaster</span>}
                  <div className="creator-card__photo"><img src={creator.image} alt={`Foto de ${creator.name}`} /></div>
                  <h3>{creator.name}</h3>
                  <p>{creator.role ?? creator.credit ?? 'Desenvolvimento'}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

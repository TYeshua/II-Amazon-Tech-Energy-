import { useEffect, useRef } from 'react'

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    let frame = 0
    const updateProgress = () => {
      frame = 0
      const rect = hero.getBoundingClientRect()
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1)
      hero.style.setProperty('--hero-progress', progress.toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <div className="hero-sticky">
        <div className="hero-origin" aria-label="Da SPE UFPA">
          <img src={`${import.meta.env.BASE_URL}spelogo.jpeg`} alt={'SPE International — Universidade Federal do Par\u00e1 Student Chapter'} />
          <span className="hero-origin__from">Da SPE UFPA</span>
          <small>{'Universidade Federal do Par\u00e1 · Student Chapter'}</small>
        </div>

        <div className="hero-panel">
          <div className="hero-scenery" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />

          <div className="hero-content">
            <p className="hero-eyebrow"><span /> {'Bel\u00e9m recebe o futuro da energia'}</p>
            <div className="hero-logo-stage">
              <img className="hero-logo" src={`${import.meta.env.BASE_URL}amazonlogo.png`} alt={'2\u00ba Amazon Tech Energy — Margem Equatorial: da explora\u00e7\u00e3o \u00e0 produ\u00e7\u00e3o'} />
            </div>
            <h1><span>{'A for\u00e7a do futuro'}</span> {'energ\u00e9tico.'}</h1>
            <p className="hero-date">15—17 <span>setembro</span></p>
          </div>

          <a className="scroll-cue" href="#sobre">
            <span>Role para expandir</span>
            <i aria-hidden="true" />
          </a>

          <div className="hero-progress" aria-hidden="true"><i /></div>
        </div>
      </div>
    </section>
  )
}

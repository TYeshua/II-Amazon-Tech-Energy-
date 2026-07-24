import { useEffect, useState } from 'react'

const letters = [
  { letter: 'A', images: ['A1.webp', 'A2.webp', 'A3.webp', 'A4.webp'] },
  { letter: 'M', images: ['M1.webp', 'M2.webp', 'M3.webp'] },
  { letter: 'A', images: ['A2.webp', 'A3.webp', 'A4.webp', 'A1.webp'] },
  { letter: 'Z', images: ['Z1.webp', 'Z2.webp'] },
  { letter: 'O', images: ['O1.webp', 'O2.webp'] },
  { letter: 'N', images: ['N1.webp'] },
  { letter: 'T', images: ['T1.webp', 'T2.webp'], newWord: true },
  { letter: 'E', images: ['E1.webp', 'E2.webp', 'E3.webp'] },
  { letter: 'C', images: ['C1.webp', 'C2.webp', 'C3.webp'] },
  { letter: 'H', images: ['H1.webp', 'H2.webp'] },
]

const loadingImages = [...new Set(letters.flatMap(({ images }) => images))]

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image()
    image.onload = image.onerror = () => resolve()
    image.src = src
  })
}

export function LoadingScreen() {
  const [stage, setStage] = useState<'logo' | 'name' | 'exit'>('logo')
  const [frame, setFrame] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let cancelled = false
    let exitTimer = 0
    document.body.classList.add('is-preloading')

    const windowReady = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const assetsReady = Promise.all([
      windowReady,
      document.fonts?.ready ?? Promise.resolve(),
      preloadImage(`${import.meta.env.BASE_URL}imagens_vetorizadas/amazonlogo.svg`),
      ...loadingImages.map((name) => preloadImage(`${import.meta.env.BASE_URL}imagens_vetorizadas/loading/${name}`)),
    ])
    const minimumRun = new Promise<void>((resolve) => window.setTimeout(resolve, 4700))
    const logoTimer = window.setTimeout(() => setStage('name'), 1650)
    const frameTimer = window.setInterval(() => setFrame((value) => value + 1), 680)

    Promise.all([assetsReady, minimumRun]).then(() => {
      if (cancelled) return
      setStage('exit')
      exitTimer = window.setTimeout(() => {
        document.body.classList.remove('is-preloading')
        setVisible(false)
      }, 900)
    })

    return () => {
      cancelled = true
      window.clearTimeout(logoTimer)
      window.clearTimeout(exitTimer)
      window.clearInterval(frameTimer)
      document.body.classList.remove('is-preloading')
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`loader loader--${stage}`} role="status" aria-live="polite" aria-label="Carregando Amazon Tech">
      <div className="loader__atmosphere" aria-hidden="true" />
      <div className="loader__logo-stage">
        <span className="loader__logo-orbit" aria-hidden="true" />
        <img src={`${import.meta.env.BASE_URL}imagens_vetorizadas/amazonlogo.svg`} alt="2º Amazon Tech Energy" className="loader__logo" />
      </div>

      <div className="loader__name-stage" aria-hidden="true">
        <p className="loader__eyebrow">Margem Equatorial Brasileira</p>
        <div className="loader__wordmark">
          {letters.map(({ letter, images, newWord }, index) => (
            <span
              className={`loader__letter${newWord ? ' loader__letter--word-start' : ''}`}
              style={{ '--letter-index': index } as React.CSSProperties}
              key={`${letter}-${index}`}
            >
              {images.map((image, imageIndex) => (
                <img
                  className={imageIndex === frame % images.length ? 'is-active' : ''}
                  src={`${import.meta.env.BASE_URL}imagens_vetorizadas/loading/${image}`}
                  alt=""
                  key={image}
                />
              ))}
              <span>{letter}</span>
            </span>
          ))}
        </div>
        <div className="loader__progress"><i /></div>
        <p className="loader__caption">Tecnologia, energia e futuro</p>
      </div>
    </div>
  )
}

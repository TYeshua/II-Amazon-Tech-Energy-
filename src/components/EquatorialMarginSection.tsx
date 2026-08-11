
import { useEffect, useRef } from 'react';
import equatorialVideo from '../assets/maps/Equatorial.mp4';
import { siteContent } from '../data/siteContent';
import { Reveal } from './Reveal';

export function EquatorialMarginSection() {
  const { margin } = siteContent;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Ignore play interruptions
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="margin-section" id="margem">
      <div className="section-inner">
        <Reveal>
          <header>
            <p className="kicker">{margin.title}</p>
            <h2>{margin.subtitle}</h2>
          </header>
        </Reveal>
        <div className="margin-grid">
          <Reveal delay={120}>
            <p>{margin.body}</p>
          </Reveal>
          <Reveal className="map-reveal" delay={220}>
            <figure className="map-figure">
              <video
                ref={videoRef}
                src={equatorialVideo}
                muted
                playsInline
                preload="auto"
                aria-label="Mapa das cinco bacias da Margem Equatorial brasileira"
              />
              <figcaption>AMAPÁ · PARÁ · MARANHÃO · CEARÁ · RIO GRANDE DO NORTE</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}




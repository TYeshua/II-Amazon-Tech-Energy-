import Antigravity from './Antigravity'

export default function AmbientParticles() {
  return <div className="lower-site__particles" aria-hidden="true">
    <Antigravity
      count={420}
      magnetRadius={5.5}
      ringRadius={6.5}
      waveSpeed={.3}
      waveAmplitude={.55}
      particleSize={.72}
      lerpSpeed={.035}
      color="#82ed76"
      colorSecondary="#27c8c9"
      opacity={.78}
      autoAnimate
      particleVariance={.7}
      rotationSpeed={.008}
      depthFactor={.65}
      pulseSpeed={1.8}
      fieldStrength={13}
    />
  </div>
}

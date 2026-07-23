import { useCallback, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

interface BorderGlowProps {
  children: ReactNode
  className?: string
  edgeSensitivity?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  colors?: string[]
}

export default function BorderGlow({ children, className = '', edgeSensitivity = 30, glowRadius = 38, glowIntensity = 1, coneSpread = 22, colors = ['#75d16c', '#15a7a8', '#3b82f6'] }: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [angle, setAngle] = useState(45)
  const [proximity, setProximity] = useState(0)

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const dx = event.clientX - rect.left - rect.width / 2
    const dy = event.clientY - rect.top - rect.height / 2
    const nextAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
    setAngle(nextAngle < 0 ? nextAngle + 360 : nextAngle)
    setProximity(Math.min(Math.max(Math.abs(dx) / (rect.width / 2), Math.abs(dy) / (rect.height / 2)), 1))
  }, [])

  const threshold = edgeSensitivity / 100
  const strength = isHovered ? Math.max(0, (proximity - threshold) / (1 - threshold)) : 0
  const variables = {
    '--border-glow-angle': `${angle}deg`,
    '--border-glow-opacity': strength,
    '--border-glow-radius': `${glowRadius}px`,
    '--border-glow-intensity': glowIntensity,
    '--border-glow-cone': `${coneSpread}%`,
    '--border-glow-colors': colors.join(', '),
  } as CSSProperties

  return <div ref={cardRef} className={`border-glow ${className}`} style={variables} onPointerEnter={() => setIsHovered(true)} onPointerMove={handlePointerMove} onPointerLeave={() => { setIsHovered(false); setProximity(0) }}>
    <div className="border-glow__edge" aria-hidden="true" />
    <div className="border-glow__aura" aria-hidden="true" />
    <div className="border-glow__content">{children}</div>
  </div>
}

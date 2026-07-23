import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

type AntigravityProps = {
  count?: number
  magnetRadius?: number
  ringRadius?: number
  waveSpeed?: number
  waveAmplitude?: number
  particleSize?: number
  lerpSpeed?: number
  color?: string
  colorSecondary?: string
  opacity?: number
  autoAnimate?: boolean
  particleVariance?: number
  rotationSpeed?: number
  depthFactor?: number
  pulseSpeed?: number
  fieldStrength?: number
  reducedMotion?: boolean
}

function AntigravityField({
  count = 240, magnetRadius = 6, ringRadius = 7, waveSpeed = .4,
  waveAmplitude = .75, particleSize = 1.25, lerpSpeed = .05,
  color = '#65bd59', colorSecondary = '#159c9c', opacity = .82, autoAnimate = true, particleVariance = .8,
  rotationSpeed = .015, depthFactor = .75, pulseSpeed = 2.4,
  fieldStrength = 10,
}: AntigravityProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const { viewport } = useThree()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const primaryColor = useMemo(() => new THREE.Color(color), [color])
  const secondaryColor = useMemo(() => new THREE.Color(colorSecondary), [colorSecondary])
  const particleColor = useMemo(() => new THREE.Color(), [])
  const lastPointer = useRef({ x: 0, y: 0 })
  const lastMove = useRef(0)
  const virtualPointer = useRef({ x: 0, y: 0 })

  const particles = useMemo(() => Array.from({ length: count }, () => {
    const x = (Math.random() - .5) * viewport.width
    const y = (Math.random() - .5) * viewport.height
    const z = (Math.random() - .5) * 16
    return {
      t: Math.random() * 100,
      speed: .01 + Math.random() / 200,
      mx: x, my: y, mz: z, cx: x, cy: y, cz: z,
      randomRadiusOffset: (Math.random() - .5) * 2,
      colorMix: Math.random(),
    }
  }), [count, viewport.width, viewport.height])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    particles.forEach((particle, index) => {
      particleColor.copy(primaryColor).lerp(secondaryColor, particle.colorMix)
      mesh.setColorAt(index, particleColor)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    if (materialRef.current) materialRef.current.needsUpdate = true
  }, [particles, primaryColor, secondaryColor, particleColor])

  useFrame(state => {
    const mesh = meshRef.current
    if (!mesh) return
    const { pointer, viewport: currentViewport, clock } = state
    const moved = Math.hypot(pointer.x - lastPointer.current.x, pointer.y - lastPointer.current.y)
    if (moved > .001) {
      lastMove.current = Date.now()
      lastPointer.current = { x: pointer.x, y: pointer.y }
    }

    let destinationX = pointer.x * currentViewport.width / 2
    let destinationY = pointer.y * currentViewport.height / 2
    if (autoAnimate && Date.now() - lastMove.current > 1800) {
      const time = clock.getElapsedTime()
      destinationX = Math.sin(time * .42) * currentViewport.width / 4
      destinationY = Math.cos(time * .68) * currentViewport.height / 5
    }
    virtualPointer.current.x += (destinationX - virtualPointer.current.x) * .045
    virtualPointer.current.y += (destinationY - virtualPointer.current.y) * .045

    const targetX = virtualPointer.current.x
    const targetY = virtualPointer.current.y
    const globalRotation = clock.getElapsedTime() * rotationSpeed

    particles.forEach((particle, index) => {
      particle.t += particle.speed / 2
      const projection = 1 - particle.cz / 50
      const projectedX = targetX * projection
      const projectedY = targetY * projection
      const dx = particle.mx - projectedX
      const dy = particle.my - projectedY
      const distance = Math.hypot(dx, dy)
      let x = particle.mx
      let y = particle.my
      let z = particle.mz * depthFactor

      if (distance < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation
        const wave = Math.sin(particle.t * waveSpeed + angle) * .5 * waveAmplitude
        const deviation = particle.randomRadiusOffset * (5 / (fieldStrength + .1))
        const radius = ringRadius + wave + deviation
        x = projectedX + radius * Math.cos(angle)
        y = projectedY + radius * Math.sin(angle)
        z += Math.sin(particle.t) * waveAmplitude * depthFactor
      }

      particle.cx += (x - particle.cx) * lerpSpeed
      particle.cy += (y - particle.cy) * lerpSpeed
      particle.cz += (z - particle.cz) * lerpSpeed
      dummy.position.set(particle.cx, particle.cy, particle.cz)
      dummy.lookAt(projectedX, projectedY, particle.cz)
      dummy.rotateX(Math.PI / 2)
      const ringDistance = Math.abs(Math.hypot(particle.cx - projectedX, particle.cy - projectedY) - ringRadius)
      const visibility = Math.max(.07, Math.min(1, 1 - ringDistance / 10))
      const scale = visibility * (.82 + Math.sin(particle.t * pulseSpeed) * .18 * particleVariance) * particleSize
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      particleColor.copy(primaryColor).lerp(secondaryColor, particle.colorMix)
      mesh.setColorAt(index, particleColor)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
    <capsuleGeometry args={[.08, .32, 3, 6]} />
    <meshBasicMaterial
      ref={materialRef}
      color="#ffffff"
      vertexColors
      transparent
      opacity={opacity}
      depthWrite={false}
      toneMapped={false}
      blending={THREE.AdditiveBlending}
    />
  </instancedMesh>
}

export default function Antigravity(props: AntigravityProps) {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 50], fov: 35 }} frameloop={reducedMotion ? 'demand' : 'always'} gl={{ alpha: true, antialias: true }}>
    <AntigravityField {...props} autoAnimate={!reducedMotion && props.autoAnimate} />
  </Canvas>
}

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { CalendarDays, Clock3, MapPin, UsersRound } from 'lucide-react'
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ACESFilmicToneMapping, Box3, Group, MathUtils, SRGBColorSpace, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { Reveal } from './Reveal'

function VenueModel() {
  const group = useRef<Group>(null)
  const targetRotation = useRef({ x: -0.06, y: -0.35 })
  const { gl, invalidate } = useThree()
  const gltf = useLoader(GLTFLoader, `${import.meta.env.BASE_URL}local.optimized.glb`, loader => loader.setMeshoptDecoder(MeshoptDecoder))
  const scene = useMemo(() => {
    const model = gltf.scene.clone(true)
    const bounds = new Box3().setFromObject(model)
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    const scale = 3.15 / Math.max(size.x, size.y, size.z)
    model.position.set(-center.x, -center.y, -center.z)
    model.scale.setScalar(scale)
    return model
  }, [gltf.scene])

  useFrame((_, delta) => {
    if (!group.current) return
    const easing = 1 - Math.exp(-7 * delta)
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, targetRotation.current.x, easing)
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, targetRotation.current.y, easing)
    const moving = Math.abs(group.current.rotation.x - targetRotation.current.x) > .001 || Math.abs(group.current.rotation.y - targetRotation.current.y) > .001
    if (moving) invalidate()
  })

  useEffect(() => {
    const canvas = gl.domElement
    let dragging = false
    let previousX = 0
    let previousY = 0

    const down = (event: PointerEvent) => {
      dragging = true
      previousX = event.clientX
      previousY = event.clientY
      canvas.setPointerCapture(event.pointerId)
      canvas.classList.add('is-dragging')
    }
    const move = (event: PointerEvent) => {
      if (dragging) {
        const deltaX = event.clientX - previousX
        const deltaY = event.clientY - previousY
        previousX = event.clientX
        previousY = event.clientY
        targetRotation.current.y += deltaX * .009
        targetRotation.current.x = MathUtils.clamp(targetRotation.current.x + deltaY * .006, -.55, .4)
      } else if (event.pointerType === 'mouse') {
        const rect = canvas.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
        targetRotation.current.x = -0.06 + y * .07
        targetRotation.current.y = -0.35 + x * .18
      }
      invalidate()
    }
    const up = (event: PointerEvent) => {
      dragging = false
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      canvas.classList.remove('is-dragging')
    }
    const leave = () => {
      if (!dragging) targetRotation.current = { x: -0.06, y: -0.35 }
      invalidate()
    }

    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)
    canvas.addEventListener('pointerleave', leave)
    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
      canvas.removeEventListener('pointerleave', leave)
    }
  }, [gl, invalidate])

  return <group ref={group} rotation={[-0.06, -0.35, 0]}><primitive object={scene} /></group>
}

class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <span className="venue-card__loading">Vista 3D indisponível</span> : this.props.children }
}

function LazyVenueCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = mountRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true)
        observer.disconnect()
      }
    }, { rootMargin: '220px 0px', threshold: 0.01 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={mountRef} className="venue-card__model" aria-label="Modelo 3D da localização do evento">
    {!ready && <span className="venue-card__loading">Preparando localização 3D…</span>}
    {ready && <ModelBoundary><Suspense fallback={<span className="venue-card__loading"><i /> Carregando localização 3D…</span>}>
      <Canvas frameloop="demand" camera={{ position: [3.8, 2.6, 4.4], fov: 34 }} dpr={1} performance={{ min: .6 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.toneMapping = ACESFilmicToneMapping; gl.outputColorSpace = SRGBColorSpace }} style={{ background: 'transparent', touchAction: 'pan-y' }}>
        <ambientLight intensity={2.2} />
        <directionalLight position={[4, 7, 5]} intensity={3.5} color="#f1fff1" />
        <directionalLight position={[-4, 2, -3]} intensity={1.4} color="#5bb5ff" />
        <VenueModel />
      </Canvas>
    </Suspense></ModelBoundary>}
  </div>
}

export function AboutEventSection() {
  return <section className="about-event" id="sobre" aria-labelledby="about-event-title">
    <div className="about-event__glow" aria-hidden="true" />
    <div className="section-inner about-event__grid">
      <Reveal className="about-event__copy">
        <p className="about-event__eyebrow"><span /> Sobre o evento</p>
        <h2 id="about-event-title">Visão geral do<br/><em>2º Amazon TechEnergy</em></h2>
        <p className="about-event__subtitle">Margem Equatorial: da Exploração à Produção</p>
        <p className="about-event__lead">Um encontro presencial para conectar conhecimento técnico, networking qualificado e oportunidades de marca em um dos temas mais estratégicos do setor energético.</p>

        <div className="about-event__facts">
          <div><CalendarDays aria-hidden="true" /><span><small>Quando</small><strong>15 a 17 de setembro de 2026</strong></span></div>
          <div><MapPin aria-hidden="true" /><span><small>Onde</small><strong>Casa de Cultura Fonte do Caranã</strong></span></div>
          <div><UsersRound aria-hidden="true" /><span><small>Encontro</small><strong>Especialistas e estudantes da Região Norte</strong></span></div>
          <div><Clock3 aria-hidden="true" /><span><small>Formato</small><strong>3 dias de programação presencial</strong></span></div>
        </div>
      </Reveal>

      <Reveal className="about-event__visual" delay={140}>
        <div className="venue-card">
          <div className="venue-card__environment" role="img" aria-label="Auditório da Casa de Cultura Fonte do Caranã" />
          <div className="venue-card__shade" />
          <LazyVenueCanvas />
          <div className="venue-card__label"><MapPin size={15}/><span><small>Local do evento</small>Fonte do Caranã</span></div>
          <div className="venue-card__city">
            <img src={`${import.meta.env.BASE_URL}salinas.webp`} alt="Vista aérea de Salinópolis, Pará" />
            <span><small>Cidade anfitriã</small>Salinópolis • PA</span>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
}

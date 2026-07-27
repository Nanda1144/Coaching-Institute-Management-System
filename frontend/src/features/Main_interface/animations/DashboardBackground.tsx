import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'

export default function DashboardBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const clockRef = useRef(new THREE.Timer())
  const animRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<THREE.Points | null>(null)

  const init = useCallback(() => {
    if (!containerRef.current) return
    const c = containerRef.current
    const w = c.clientWidth
    const h = c.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 30)
    camera.position.z = 6
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    c.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambient = new THREE.AmbientLight('#3b82f6', 0.3)
    scene.add(ambient)

    const count = 60
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20
      pos[i + 1] = (Math.random() - 0.5) * 14
      pos[i + 2] = (Math.random() - 0.5) * 10 - 2
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

    const mat = new THREE.PointsMaterial({
      color: '#3b82f6',
      size: 0.03,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)
    particlesRef.current = points

    const cubeGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3)
    const cubeMat = new THREE.MeshStandardMaterial({
      color: '#3b82f6',
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    })
    for (let i = 0; i < 4; i++) {
      const cube = new THREE.Mesh(cubeGeo, cubeMat)
      cube.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 6 - 3,
      )
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      scene.add(cube)
    }

    const ringMat = new THREE.MeshBasicMaterial({
      color: '#3b82f6',
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    })
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.8 + i * 0.3, 0.9 + i * 0.3, 32), ringMat)
      ring.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        -3 - i * 1.5,
      )
      ring.rotation.x = Math.PI / 3
      ring.rotation.z = Math.random() * Math.PI
      scene.add(ring)
    }
  }, [])

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return
    const delta = clockRef.current.getDelta()
    const elapsed = clockRef.current.getElapsed()

    if (particlesRef.current) {
      const p = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < p.length; i += 3) {
        p[i + 1] += Math.sin(elapsed * 0.15 + p[i] * 0.1) * 0.0003
        p[i] += Math.cos(elapsed * 0.12 + p[i + 1] * 0.1) * 0.0003
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    sceneRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.geometry.type === 'BoxGeometry') {
        child.rotation.x += delta * 0.2
        child.rotation.y += delta * 0.3
      }
      if (child instanceof THREE.Mesh && child.geometry.type === 'RingGeometry') {
        child.rotation.z += delta * 0.05
      }
    })

    mouseRef.current.x += (0 - mouseRef.current.x) * 0.02
    mouseRef.current.y += (0 - mouseRef.current.y) * 0.02

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    init()
    animRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
      if (rendererRef.current && containerRef.current) {
        const canvas = rendererRef.current.domElement
        if (containerRef.current.contains(canvas)) containerRef.current.removeChild(canvas)
        rendererRef.current.dispose()
      }
      sceneRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose())
          else child.material?.dispose()
        }
      })
    }
  }, [init, animate])

  return <div ref={containerRef} className="fixed inset-0 -z-10" aria-hidden="true" />
}

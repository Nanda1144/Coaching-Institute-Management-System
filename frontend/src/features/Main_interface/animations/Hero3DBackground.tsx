import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

interface Hero3DBackgroundProps {
  particleCount?: number
  color?: string
  size?: number
  opacity?: number
  mouseSensitivity?: number
  rotationSpeed?: number
}

export default function Hero3DBackground({
  particleCount = 80,
  color = '#3b82f6',
  size = 0.06,
  opacity = 0.6,
  mouseSensitivity = 0.05,
  rotationSpeed = 0.0005,
}: Hero3DBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    particles: THREE.Points
    mouse: { x: number; y: number }
  } | null>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 10
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [particleCount])

  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 50)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const material = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    const mouse = { x: 0, y: 0 }

    const handleMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / width - 0.5) * 2
      mouse.y = -(e.clientY / height - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    sceneRef.current = { scene, camera, renderer, particles, mouse }

    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      particles.rotation.x += rotationSpeed * 0.6
      particles.rotation.y += rotationSpeed
      particles.rotation.x += (mouse.y * mouseSensitivity - particles.rotation.x) * 0.01
      particles.rotation.y += (mouse.x * mouseSensitivity - particles.rotation.y) * 0.01
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      sceneRef.current = null
    }
  }, [geometry, color, size, opacity, mouseSensitivity, rotationSpeed])

  return <div ref={containerRef} className="absolute inset-0 -z-10" />
}

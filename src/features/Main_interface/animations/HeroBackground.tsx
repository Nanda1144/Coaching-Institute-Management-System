import { useRef, useEffect, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'

interface HeroBackgroundProps {
  theme?: 'light' | 'dark'
  particleCount?: number
}

type ThemeColors = {
  scene: string
  particles: string
  connections: string
  accent: string
  accentSecondary: string
  glow: string
  objects: string
  grid: string
}

const THEMES: Record<'light' | 'dark', ThemeColors> = {
  light: {
    scene: '#0B1220',
    particles: '#60A5FA',
    connections: 'rgba(96,165,250,0.15)',
    accent: '#3B82F6',
    accentSecondary: '#10B981',
    glow: 'rgba(59,130,246,0.12)',
    objects: '#E2E8F0',
    grid: 'rgba(96,165,250,0.06)',
  },
  dark: {
    scene: '#0B1220',
    particles: '#60A5FA',
    connections: 'rgba(96,165,250,0.15)',
    accent: '#3B82F6',
    accentSecondary: '#10B981',
    glow: 'rgba(59,130,246,0.12)',
    objects: '#E2E8F0',
    grid: 'rgba(96,165,250,0.06)',
  },
}

const PUBLIC_PATHS = [
  '/', '/login', '/signup', '/register', '/forgot-password',
  '/reset-password', '/student-registration', '/workflow',
  '/developers', '/about', '/contact', '/privacy', '/terms', '/cookies',
]

function getDeviceTier(): 'low' | 'medium' | 'high' {
  if (typeof window === 'undefined') return 'medium'
  const mem = (navigator as any).deviceMemory || 8
  const cores = navigator.hardwareConcurrency || 8
  const isMobile = /Mobi|Android/i.test(navigator.userAgent)
  if (isMobile || mem <= 4 || cores <= 4) return 'low'
  if (mem <= 6 || cores <= 6) return 'medium'
  return 'high'
}

function createGraduationCap(color: string): THREE.Group {
  const group = new THREE.Group()
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.05, 1.2),
    new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 }),
  )
  board.position.y = 0
  group.add(board)
  const button = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12),
    new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.6 }),
  )
  button.position.y = 0.07
  group.add(button)
  const tassel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.6, 6),
    new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.6 }),
  )
  tassel.position.set(0.5, -0.25, 0.5)
  tassel.rotation.z = 0.3
  tassel.rotation.x = 0.2
  group.add(tassel)
  return group
}

function createOpenBook(color: string): THREE.Group {
  const group = new THREE.Group()
  const pageMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1, side: THREE.DoubleSide })
  const coverMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5, metalness: 0.3 })
  const cover = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 1), coverMat)
  cover.position.y = -0.3
  group.add(cover)
  const left = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.9), pageMat)
  left.position.set(-0.35, 0.15, 0)
  left.rotation.y = 0.4
  left.rotation.x = -0.1
  group.add(left)
  const right = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.9), pageMat)
  right.position.set(0.35, 0.15, 0)
  right.rotation.y = -0.4
  right.rotation.x = -0.1
  group.add(right)
  return group
}

function createCertificate(color: string, gold: string): THREE.Group {
  const group = new THREE.Group()
  const paper = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.3, 0.02),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 }),
  )
  group.add(paper)
  const seal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.03, 16),
    new THREE.MeshStandardMaterial({ color: gold, roughness: 0.3, metalness: 0.8 }),
  )
  seal.position.set(0.3, 0.3, 0.02)
  group.add(seal)
  const ribbon = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.03, 0.02),
    new THREE.MeshStandardMaterial({ color: gold, roughness: 0.4, metalness: 0.6 }),
  )
  ribbon.position.set(0, 0.55, 0.02)
  group.add(ribbon)
  return group
}

function createBrainNetwork(color: string, glow: string): THREE.Group {
  const group = new THREE.Group()
  const sphereMat = new THREE.MeshStandardMaterial({
    color, emissive: glow, emissiveIntensity: 0.2, roughness: 0.1, metalness: 0.6, wireframe: true,
  })
  const brain = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), sphereMat)
  group.add(brain)
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 8),
      new THREE.MeshBasicMaterial({ color: glow, transparent: true, opacity: 0.7 }),
    )
    node.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0)
    group.add(node)
    const lineGeo = new THREE.BufferGeometry()
    const positions = new Float32Array([0, 0, 0, node.position.x, node.position.y, node.position.z])
    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: glow, transparent: true, opacity: 0.2 }))
    group.add(line)
  }
  return group
}

function createChart(color: string): THREE.Group {
  const group = new THREE.Group()
  const barMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 })
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.5), barMat)
  base.position.y = -0.3
  group.add(base)
  const heights = [0.6, 0.4, 0.8, 0.5]
  heights.forEach((h, i) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, 0.12), barMat)
    bar.position.set(-0.3 + i * 0.2, -0.3 + h / 2, 0)
    group.add(bar)
  })
  return group
}

function createCloudComputing(color: string): THREE.Group {
  const group = new THREE.Group()
  const cloudMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.7 })
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), cloudMat)
  p1.position.set(0, 0.1, 0)
  group.add(p1)
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), cloudMat)
  p2.position.set(-0.2, 0, 0)
  group.add(p2)
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), cloudMat)
  p3.position.set(0.2, -0.05, 0)
  group.add(p3)
  const p4 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), cloudMat)
  p4.position.set(0, -0.12, 0)
  group.add(p4)
  return group
}

function createDigitalNetwork(_color: string, glow: string): THREE.Group {
  const group = new THREE.Group()
  const nodeMat = new THREE.MeshBasicMaterial({ color: glow, transparent: true, opacity: 0.5 })
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), nodeMat)
    node.position.set(Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0)
    group.add(node)
  }
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.25, 0.28, 24),
    new THREE.MeshBasicMaterial({ color: glow, transparent: true, opacity: 0.15, side: THREE.DoubleSide }),
  )
  group.add(ring)
  return group
}

function createHexGrid(count: number, _color: string): THREE.BufferGeometry {
  const positions: number[] = []
  const spacing = 2.5
  const cols = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / cols)
  const radius = 0.5
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (positions.length / 3 >= count * 6) break
      const cx = (c - cols / 2) * spacing * 0.866
      const cy = (r - rows / 2) * spacing * 1.5 + (c % 2 === 0 ? 0 : spacing * 0.75)
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const nextAngle = (Math.PI / 3) * (i + 1) - Math.PI / 6
        positions.push(
          cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 0,
          cx + Math.cos(nextAngle) * radius, cy + Math.sin(nextAngle) * radius, 0,
        )
      }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geo
}

function createKnowledgeOrb(color: string, glow: string): THREE.Group {
  const group = new THREE.Group()
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 24, 24),
    new THREE.MeshStandardMaterial({ color, emissive: glow, emissiveIntensity: 0.3, roughness: 0.1, metalness: 0.8 }),
  )
  group.add(orb)
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.35, 0.45, 48),
    new THREE.MeshBasicMaterial({ color: glow, transparent: true, opacity: 0.3, side: THREE.DoubleSide }),
  )
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.05
  group.add(ring)
  return group
}

function createLightRing(color: string): THREE.Mesh {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1, 1.15, 64),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12, side: THREE.DoubleSide }),
  )
  ring.rotation.x = Math.PI / 3
  return ring
}

function createDigitalCube(color: string): THREE.Mesh {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.7, transparent: true, opacity: 0.6, wireframe: false }),
  )
  const edges = new THREE.EdgesGeometry(cube.geometry)
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 }))
  cube.add(line)
  return cube
}

function createGlassCard(color: string): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.5, 0.02),
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.2, clearcoat: 0.3, side: THREE.DoubleSide }),
  )
}

function createTorusKnot(color: string, glow: string): THREE.Mesh {
  const geo = new THREE.TorusKnotGeometry(0.25, 0.08, 64, 8)
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: glow,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.6,
    roughness: 0.2,
    metalness: 0.8,
  })
  return new THREE.Mesh(geo, mat)
}

function createIcosahedron(color: string): THREE.Mesh {
  const geo = new THREE.IcosahedronGeometry(0.3, 0)
  const mat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.08,
    wireframe: true,
    roughness: 0.3,
    metalness: 0.5,
  })
  return new THREE.Mesh(geo, mat)
}

function createBlurredCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.1, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const gradientVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const gradientFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.03;
    float mix1 = sin(uv.x * 2.0 + uv.y * 1.5 + t) * 0.5 + 0.5;
    float mix2 = cos(uv.y * 2.5 - uv.x * 1.2 + t * 0.7) * 0.5 + 0.5;
    float mix3 = sin((uv.x + uv.y) * 1.8 + t * 0.4) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, mix1 * 0.7);
    color = mix(color, uColor3, mix2 * 0.3 * mix3);
    gl_FragColor = vec4(color, 0.5);
  }
`

export default function HeroBackground({ theme: forcedTheme, particleCount: customParticleCount }: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const clockRef = useRef(new THREE.Timer())
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef(0)
  const objectsRef = useRef<THREE.Object3D[]>([])
  const particleSystemRef = useRef<THREE.Points | null>(null)
  const connectionLinesRef = useRef<THREE.LineSegments | null>(null)
  const gridRef = useRef<THREE.LineSegments | null>(null)
  const gradientMeshRef = useRef<THREE.Mesh | null>(null)
  const blurredCirclesRef = useRef<THREE.Sprite[]>([])
  const geometricShapesRef = useRef<THREE.Object3D[]>([])
  const themeColorsRef = useRef<ThemeColors>(THEMES.dark)
  const isVisibleRef = useRef(true)
  const location = useLocation()

  const isPublicRoute = useMemo(
    () => PUBLIC_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + '/')),
    [location.pathname],
  )

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const prefersDark = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [])

  const theme = forcedTheme || (prefersDark ? 'dark' : 'light')
  const colors = THEMES[theme]
  themeColorsRef.current = colors

  const deviceTier = useMemo(getDeviceTier, [])
  const particleCount = customParticleCount || (deviceTier === 'low' ? 200 : deviceTier === 'medium' ? 350 : 500)

  const initScene = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(colors.scene, 0.025)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 50)
    camera.position.set(0, 2, 8)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: deviceTier !== 'low',
      powerPreference: deviceTier === 'low' ? 'low-power' : 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, deviceTier === 'low' ? 1 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(colors.accent, 0.4)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(colors.accent, 1.2)
    dirLight.position.set(5, 10, 5)
    scene.add(dirLight)
    const hemiLight = new THREE.HemisphereLight(colors.accent, colors.accentSecondary, 0.6)
    scene.add(hemiLight)

    const allObjects: THREE.Object3D[] = []
    const objGroup = new THREE.Group()

    if (deviceTier !== 'low') {
      const gradientGeo = new THREE.PlaneGeometry(30, 20)
      const gradientMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color('#0F172A') },
          uColor2: { value: new THREE.Color('#2563EB') },
          uColor3: { value: new THREE.Color('#10B981') },
        },
        vertexShader: gradientVertexShader,
        fragmentShader: gradientFragmentShader,
        transparent: true,
        depthWrite: false,
      })
      const gradientMesh = new THREE.Mesh(gradientGeo, gradientMat)
      gradientMesh.position.z = -12
      scene.add(gradientMesh)
      gradientMeshRef.current = gradientMesh
    }

    if (deviceTier !== 'low') {
      const shapePositions = [
        [-2.8, 2, -3], [3.2, -1.8, -2.5], [-1.2, -2.2, -4],
        [4.2, 2.2, -3.5], [-3.8, -0.8, -1.5], [0.8, 2.8, -5],
        [-2, -1, -6], [2.5, 1.5, -5.5],
      ]
      const geoShapes: THREE.Object3D[] = []
      shapePositions.forEach((pos, i) => {
        const group = new THREE.Group()
        let mesh: THREE.Mesh
        const idx = i % 3
        if (idx === 0) {
          mesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.25, 0),
            new THREE.MeshStandardMaterial({
              color: colors.accent,
              transparent: true,
              opacity: 0.08,
              wireframe: true,
            }),
          )
        } else if (idx === 1) {
          mesh = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.22, 0),
            new THREE.MeshStandardMaterial({
              color: colors.accentSecondary,
              transparent: true,
              opacity: 0.06,
              wireframe: true,
            }),
          )
        } else {
          mesh = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.18, 0.06, 32, 6),
            new THREE.MeshStandardMaterial({
              color: colors.objects,
              transparent: true,
              opacity: 0.07,
              wireframe: true,
            }),
          )
        }
        group.add(mesh)
        group.position.set(pos[0], pos[1], pos[2])
        objGroup.add(group)
        geoShapes.push(group)
        allObjects.push(group)
      })
      geometricShapesRef.current = geoShapes
    }

    const pCount = particleCount
    const particleGeo = new THREE.BufferGeometry()
    const pPositions = new Float32Array(pCount * 3)
    const pSizes = new Float32Array(pCount)
    const pColors = new Float32Array(pCount * 3)
    const baseBlue = new THREE.Color('#3B82F6')
    const baseEmerald = new THREE.Color('#10B981')
    const baseGold = new THREE.Color('#D4AF37')
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 30
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 20
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2
      pSizes[i] = Math.random() * 3 + 1
      const choice = Math.random()
      let c: THREE.Color
      if (choice < 0.5) c = baseBlue
      else if (choice < 0.8) c = baseEmerald
      else c = baseGold
      pColors[i * 3] = c.r
      pColors[i * 3 + 1] = c.g
      pColors[i * 3 + 2] = c.b
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)
    particleSystemRef.current = particles

    if (deviceTier !== 'low') {
      const posAttr = particleGeo.attributes.position
      const connPositions: number[] = []
      const threshold = 3.5
      for (let i = 0; i < pCount; i++) {
        for (let j = i + 1; j < pCount; j++) {
          const dx = posAttr.getX(i) - posAttr.getX(j)
          const dy = posAttr.getY(i) - posAttr.getY(j)
          const dz = posAttr.getZ(i) - posAttr.getZ(j)
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < threshold) {
            const mx = (posAttr.getX(i) + posAttr.getX(j)) / 2
            const my = (posAttr.getY(i) + posAttr.getY(j)) / 2
            const mz = (posAttr.getZ(i) + posAttr.getZ(j)) / 2
            const distFromCenter = Math.sqrt(mx * mx + my * my + mz * mz)
            if (distFromCenter < 8) {
              connPositions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
              connPositions.push(posAttr.getX(j), posAttr.getY(j), posAttr.getZ(j))
            }
          }
        }
      }
      const connGeo = new THREE.BufferGeometry()
      connGeo.setAttribute('position', new THREE.Float32BufferAttribute(connPositions, 3))
      const connMat = new THREE.LineBasicMaterial({
        color: colors.connections,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      })
      const connections = new THREE.LineSegments(connGeo, connMat)
      scene.add(connections)
      connectionLinesRef.current = connections
    }

    if (deviceTier !== 'low') {
      const blurTexture = createBlurredCircleTexture()
      const circleData = [
        { x: -3, y: 1, z: -4, scale: 5, color: colors.accent, speed: 0.3 },
        { x: 3, y: -1, z: -5, scale: 4, color: colors.accentSecondary, speed: 0.2 },
        { x: 0, y: 2, z: -6, scale: 6, color: colors.glow, speed: 0.25 },
        { x: -2, y: -2, z: -4.5, scale: 3.5, color: '#D4AF37', speed: 0.35 },
        { x: 2.5, y: 1.5, z: -5.5, scale: 4.5, color: colors.accent, speed: 0.28 },
      ]
      const circles: THREE.Sprite[] = []
      circleData.forEach((cd) => {
        const mat = new THREE.SpriteMaterial({
          map: blurTexture,
          transparent: true,
          opacity: 0.08,
          blending: THREE.AdditiveBlending,
          color: cd.color,
          depthWrite: false,
        })
        const sprite = new THREE.Sprite(mat)
        sprite.position.set(cd.x, cd.y, cd.z)
        sprite.scale.set(cd.scale, cd.scale, 1)
        sprite.userData = {
          speed: cd.speed,
          initialX: cd.x,
          initialY: cd.y,
          baseScale: cd.scale,
          phase: Math.random() * Math.PI * 2,
        }
        scene.add(sprite)
        circles.push(sprite)
      })
      blurredCirclesRef.current = circles
    }

    const cap = createGraduationCap(colors.objects)
    cap.position.set(-3, 1.5, -2)
    cap.scale.set(0.7, 0.7, 0.7)
    objGroup.add(cap)
    allObjects.push(cap)

    const book = createOpenBook(colors.objects)
    book.position.set(2.5, -0.5, -3)
    book.scale.set(0.6, 0.6, 0.6)
    objGroup.add(book)
    allObjects.push(book)

    const cert = createCertificate(colors.objects, '#d4af37')
    cert.position.set(-2, -1.5, -3.5)
    cert.scale.set(0.5, 0.5, 0.5)
    cert.rotation.y = 0.3
    objGroup.add(cert)
    allObjects.push(cert)

    const brain = createBrainNetwork(colors.accent, colors.glow)
    brain.position.set(3.5, 1.2, -2.5)
    brain.scale.set(0.7, 0.7, 0.7)
    objGroup.add(brain)
    allObjects.push(brain)

    const chart = createChart(colors.accentSecondary)
    chart.position.set(-3.5, -0.8, -1.5)
    chart.scale.set(0.5, 0.5, 0.5)
    objGroup.add(chart)
    allObjects.push(chart)

    const cloud = createCloudComputing(colors.objects)
    cloud.position.set(1.5, 2.5, -4)
    cloud.scale.set(0.6, 0.6, 0.6)
    objGroup.add(cloud)
    allObjects.push(cloud)

    const network = createDigitalNetwork(colors.accent, colors.glow)
    network.position.set(-1, 2.2, -4.5)
    network.scale.set(0.6, 0.6, 0.6)
    objGroup.add(network)
    allObjects.push(network)

    const ico = createIcosahedron(colors.accent)
    ico.position.set(2, -2, -2.5)
    ico.scale.set(0.8, 0.8, 0.8)
    objGroup.add(ico)
    allObjects.push(ico)

    const knot = createTorusKnot(colors.objects, colors.glow)
    knot.position.set(-1, -2.5, -2)
    knot.scale.set(0.8, 0.8, 0.8)
    objGroup.add(knot)
    allObjects.push(knot)

    const orbPositions = [
      [-1.8, 2.5, -1.5], [3.2, 1.8, -2], [-2.5, -1, -3.5],
      [1.5, -1.5, -4], [0, 3, -1], [4, -1.5, -3],
      [-4, 1.5, -2.5], [0.5, -2.5, -2],
    ]
    orbPositions.forEach((pos) => {
      const orb = createKnowledgeOrb(colors.accent, colors.glow)
      orb.position.set(pos[0], pos[1], pos[2])
      orb.scale.set(0.6, 0.6, 0.6)
      objGroup.add(orb)
      allObjects.push(orb)
    })

    const ringPositions = [
      [0, 0, -2], [-2, -1.5, -3], [3, 1, -2.5], [-3.5, 2, -1],
    ]
    ringPositions.forEach((pos) => {
      const ring = createLightRing(colors.glow)
      ring.position.set(pos[0], pos[1], pos[2])
      objGroup.add(ring)
      allObjects.push(ring)
    })

    const cubePositions = [
      [-1, -2, -4], [4, 0.5, -1.5], [-3.5, -0.5, -1],
      [1, 2.5, -3.5], [-4, 1, -2], [2, -2.5, -3],
    ]
    cubePositions.forEach((pos) => {
      const cube = createDigitalCube(colors.accent)
      cube.position.set(pos[0], pos[1], pos[2])
      objGroup.add(cube)
      allObjects.push(cube)
    })

    const cardPositions = [
      [0.5, -1.8, -5], [-2, 2, -4.5], [3.5, -1, -4], [-3, -2, -5],
    ]
    cardPositions.forEach((pos) => {
      const card = createGlassCard(colors.accent)
      card.position.set(pos[0], pos[1], pos[2])
      objGroup.add(card)
      allObjects.push(card)
    })

    scene.add(objGroup)
    objectsRef.current = allObjects

    if (deviceTier !== 'low') {
      const hexGeo = createHexGrid(30, colors.grid)
      const hexMat = new THREE.LineBasicMaterial({ color: colors.grid, transparent: true, opacity: 0.4 })
      const hexGrid = new THREE.LineSegments(hexGeo, hexMat)
      hexGrid.position.z = -8
      scene.add(hexGrid)
      gridRef.current = hexGrid
    }

    const glowOrb = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 24, 24),
      new THREE.MeshBasicMaterial({ color: colors.glow, transparent: true, opacity: 0.08 }),
    )
    glowOrb.position.set(1, 0.5, -4)
    scene.add(glowOrb)
  }, [colors, particleCount, deviceTier])

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return
    if (!isVisibleRef.current) {
      animFrameRef.current = requestAnimationFrame(animate)
      return
    }

    const delta = clockRef.current.getDelta()
    const elapsed = clockRef.current.getElapsed()

    targetMouseRef.current.x += (mouseRef.current.x - targetMouseRef.current.x) * 0.05
    targetMouseRef.current.y += (mouseRef.current.y - targetMouseRef.current.y) * 0.05

    if (cameraRef.current) {
      cameraRef.current.position.x += (targetMouseRef.current.x * 0.3 - cameraRef.current.position.x) * 0.02
      cameraRef.current.position.y += (targetMouseRef.current.y * 0.2 + 2 - cameraRef.current.position.y) * 0.02
      cameraRef.current.lookAt(0, 0.5, 0)
    }

    if (gradientMeshRef.current) {
      const mat = gradientMeshRef.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = elapsed
    }

    blurredCirclesRef.current.forEach((circle) => {
      const data = circle.userData as { speed: number; initialX: number; initialY: number; baseScale: number; phase: number }
      const t = elapsed * data.speed + data.phase
      circle.position.x = data.initialX + Math.sin(t) * 0.8
      circle.position.y = data.initialY + Math.cos(t * 0.7) * 0.6
      const pulse = 1 + Math.sin(elapsed * data.speed + data.phase) * 0.15
      circle.scale.setScalar(data.baseScale * pulse)
    })

    geometricShapesRef.current.forEach((shape, i) => {
      const phase = i * 0.8
      shape.rotation.x += delta * 0.15
      shape.rotation.y += delta * 0.25
      shape.rotation.z += delta * 0.1
      const breath = Math.sin(elapsed * 0.2 + phase) * 0.03
      shape.scale.setScalar(1 + breath)
    })

    objectsRef.current.forEach((obj, i) => {
      const phase = i * 0.5
      const floatSpeed = 0.3 + (i % 3) * 0.1
      obj.position.y += Math.sin(elapsed * floatSpeed + phase) * 0.001
      obj.rotation.x += Math.sin(elapsed * 0.2 + phase) * 0.0005
      obj.rotation.y += delta * (0.1 + (i % 5) * 0.05)
      obj.rotation.z += Math.sin(elapsed * 0.15 + phase) * 0.0003
    })

    if (particleSystemRef.current) {
      const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsed * 0.2 + positions[i] * 0.1) * 0.0005
        positions[i] += Math.cos(elapsed * 0.15 + positions[i + 1] * 0.1) * 0.0005
      }
      particleSystemRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (!prefersReducedMotion && gridRef.current) {
      gridRef.current.rotation.z = Math.sin(elapsed * 0.05) * 0.02
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animFrameRef.current = requestAnimationFrame(animate)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!isPublicRoute) return

    initScene()

    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const handleVisibility = () => { isVisibleRef.current = !document.hidden }
    document.addEventListener('visibilitychange', handleVisibility)

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)

      if (rendererRef.current && containerRef.current) {
        const canvas = rendererRef.current.domElement
        if (containerRef.current.contains(canvas)) containerRef.current.removeChild(canvas)
        rendererRef.current.dispose()
      }

      sceneRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.LineSegments) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose())
          else child.material?.dispose()
        }
      })

      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
      objectsRef.current = []
      particleSystemRef.current = null
      connectionLinesRef.current = null
      gridRef.current = null
      gradientMeshRef.current = null
      blurredCirclesRef.current = []
      geometricShapesRef.current = []
    }
  }, [isPublicRoute, initScene, animate])

  if (!isPublicRoute) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ background: colors.scene }}
      aria-hidden="true"
    />
  )
}

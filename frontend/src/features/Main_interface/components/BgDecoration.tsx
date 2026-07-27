import type { ReactNode } from 'react'

interface BgDecorationProps {
  variant?: 'default' | 'alt' | 'gradient' | 'dots' | 'waves'
  children: ReactNode
}

const orbPositions: Record<string, { size: string; position: string; color: string; animation: string }[]> = {
  default: [
    { size: 'w-72 h-72', position: '-top-20 -left-20', color: 'bg-blue-400/5', animation: 'animate-float-slow' },
    { size: 'w-96 h-96', position: '-bottom-32 -right-32', color: 'bg-indigo-400/5', animation: 'animate-float' },
  ],
  alt: [
    { size: 'w-64 h-64', position: '-top-16 -right-16', color: 'bg-purple-400/5', animation: 'animate-float-slow' },
    { size: 'w-80 h-80', position: '-bottom-24 -left-24', color: 'bg-blue-400/5', animation: 'animate-float' },
  ],
  gradient: [
    { size: 'w-96 h-96', position: '-top-24 -right-24', color: 'bg-white/5', animation: 'animate-float-slow' },
    { size: 'w-[500px] h-[500px]', position: '-bottom-40 -left-40', color: 'bg-white/5', animation: 'animate-float' },
  ],
  dots: [
    { size: 'w-60 h-60', position: 'top-1/4 -left-12', color: 'bg-cyan-400/5', animation: 'animate-float-slow' },
    { size: 'w-72 h-72', position: 'bottom-1/4 -right-12', color: 'bg-violet-400/5', animation: 'animate-float' },
  ],
  waves: [
    { size: 'w-80 h-80', position: 'top-1/3 -right-20', color: 'bg-emerald-400/5', animation: 'animate-float-slow' },
    { size: 'w-64 h-64', position: 'bottom-1/3 -left-20', color: 'bg-amber-400/5', animation: 'animate-float' },
  ],
}

export default function BgDecoration({ variant = 'default', children }: BgDecorationProps) {
  const orbs = orbPositions[variant] || orbPositions.default

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {orbs.map((orb, i) => (
          <div
            key={'sk' + i}
            className={`absolute ${orb.size} ${orb.position} ${orb.color} rounded-full blur-[100px] ${orb.animation}`}
          />
        ))}
      </div>
      {children}
    </div>
  )
}

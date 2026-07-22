import type { SkeletonProps } from '../types'
import { cn } from '../utils/cn'

export default function Skeleton({ variant = 'text', width, height, count = 1, className }: SkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 rounded-xl'

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  if (variant === 'text') {
    style.height = height || '14px'
  } else if (variant === 'circular') {
    style.borderRadius = '9999px'
  } else if (variant === 'card') {
    style.height = height || '200px'
  } else if (variant === 'rectangular') {
    style.height = height || '100px'
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            baseClass,
            variant === 'text' && 'mb-2',
            className,
          )}
          style={style}
        />
      ))}
    </>
  )
}

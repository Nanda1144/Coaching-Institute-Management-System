import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface ContainerProps {
  children: ReactNode
  className?: string
  id?: string
}

export default function Container({ children, className, id }: ContainerProps) {
  return (
    <div id={id} className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}

import type { SectionProps } from '../types'
import { cn } from '../utils/cn'
import Container from './Container'
import FadeIn from '../animations/FadeIn'
import BgDecoration from './BgDecoration'

const bgStyles: Record<string, string> = {
  default: 'bg-white',
  alt: 'bg-gray-50',
  gradient: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600',
}

export default function Section({ id, title, subtitle, description, className, children, variant = 'default', bgDecoration }: SectionProps) {
  const section = (
    <section
      id={id}
      className={cn(
        'py-16 sm:py-20 lg:py-24',
        bgStyles[variant],
        variant === 'gradient' && 'text-white',
        className,
      )}
    >
      <Container>
        {(title || subtitle) && (
          <FadeIn variant="fadeInUp">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              {subtitle && (
                <p className={cn(
                  'text-sm font-semibold uppercase tracking-widest mb-3',
                  variant === 'gradient' ? 'text-blue-200' : 'text-blue-600',
                )}>
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className={cn(
                  'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
                  variant === 'gradient' ? 'text-white' : 'text-gray-900',
                )}>
                  {title}
                </h2>
              )}
              {description && (
                <p className={cn(
                  'mt-4 text-lg leading-relaxed max-w-2xl mx-auto',
                  variant === 'gradient' ? 'text-blue-100' : 'text-gray-500',
                )}>
                  {description}
                </p>
              )}
            </div>
          </FadeIn>
        )}
        {children}
      </Container>
    </section>
  )

  if (bgDecoration === false) return section

  return (
    <BgDecoration variant={bgDecoration ?? (variant === 'default' ? 'default' : variant === 'alt' ? 'alt' : 'gradient')}>
      {section}
    </BgDecoration>
  )
}

import type { NavClickHandler } from '../types'

export function createNavHandler(): NavClickHandler {
  return (href: string) => {
    window.location.href = href
  }
}

export function isExternalLink(href: string): boolean {
  return href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')
}

export function handleNavigation(href: string): void {
  if (isExternalLink(href)) {
    window.open(href, '_blank', 'noopener,noreferrer')
  } else if (href.startsWith('#')) {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.location.href = href
  }
}

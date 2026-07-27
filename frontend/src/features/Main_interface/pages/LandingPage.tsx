import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import PageTransition from '../animations/PageTransition'
import {
  HeroSection,
  OverviewSection,
  AboutSection,
  ServicesSection,
  UsageSection,
  WorkflowSection,
  WorkingModelSection,
  DownloadAppSection,
  ContactSection,
  FooterSection,
} from '../sections'
import { HERO_CONTENT } from '../constants'

function scrollToHash() {
  const hash = window.location.hash.replace('#', '')
  if (hash) {
    setTimeout(() => {
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}

export default function LandingPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) scrollToHash()
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [hash])

  return (
    <MainLayout>
      <PageTransition>
        <HeroSection
          title={HERO_CONTENT.title}
          subtitle={HERO_CONTENT.subtitle}
          description={HERO_CONTENT.description}
          primaryCta={{ label: 'Explore Services', href: '#services' }}
          secondaryCta={{ label: 'Sign In', href: '/login' }}
        />
        <OverviewSection />
        <AboutSection />
        <ServicesSection />
        <UsageSection />
        <WorkflowSection />
        <WorkingModelSection />
        <DownloadAppSection />
        <ContactSection />
        <FooterSection />
      </PageTransition>
    </MainLayout>
  )
}

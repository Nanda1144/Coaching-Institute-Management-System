import { HeroSection, FeaturesSection, StatsSection, CoursesSection, TestimonialsSection, CTASection, FooterSection } from '../sections'
import MainLayout from '../layouts/MainLayout'

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection
        title="Empowering Educators, Shaping Futures"
        subtitle="Coaching Institute Management System"
        description="Streamline your institute operations with our all-in-one management platform. From student enrollment to performance analytics, manage everything seamlessly."
        primaryCta={{ label: 'Get Started', href: '/get-started' }}
        secondaryCta={{ label: 'Learn More', href: '/about' }}
        enableThreeJs
      />
      <FeaturesSection />
      <StatsSection />
      <CoursesSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </MainLayout>
  )
}

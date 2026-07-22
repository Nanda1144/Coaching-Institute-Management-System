import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { LucideProps } from 'lucide-react'

type LucideIcon = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>

/* ─── Navigation ─── */
export interface NavItem {
  label: string
  href: string
  icon?: ReactNode
  children?: NavItem[]
  badge?: string | number
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

/* ─── UI Component Props ─── */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  href?: string
  fullWidth?: boolean
}

export type CardVariant = 'default' | 'glass' | 'bordered' | 'elevated' | 'gradient'

export interface CardProps {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
  onClick?: () => void
  hoverable?: boolean
}

export type InputVariant = 'default' | 'filled' | 'glass'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: InputVariant
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: { label: string; value: string; disabled?: boolean }[]
  placeholder?: string
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: InputVariant
}

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  className?: string
}

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gradient'
  size?: 'xs' | 'sm' | 'md'
  children: ReactNode
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
  showCloseButton?: boolean
  footer?: ReactNode
}

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  fullPage?: boolean
}

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  count?: number
  className?: string
}

/* ─── Section Data Types ─── */
export interface Feature {
  id: string
  icon: LucideIcon
  title: string
  description: string
  href?: string
  gradient?: string
}

export interface Stat {
  id: string
  value: number
  suffix?: string
  prefix?: string
  label: string
  icon?: LucideIcon
  trend?: 'up' | 'down'
  trendValue?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar?: string
  content: string
  rating: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  bio?: string
  social?: { platform: string; url: string }[]
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  studentsCount: number
  rating: number
  image?: string
  instructor?: string
  price?: number
  href?: string
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  currency?: string
  interval?: 'month' | 'year' | 'one-time'
  features: string[]
  highlighted?: boolean
  badge?: string
  href?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

/* ─── Section Props ─── */
export interface SectionProps {
  id?: string
  title?: string
  subtitle?: string
  description?: string
  className?: string
  children: ReactNode
  variant?: 'default' | 'alt' | 'gradient'
}

export interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  enableThreeJs?: boolean
}

/* ─── Layout ─── */
export interface MainLayoutProps {
  children: ReactNode
}

export interface DashboardLayoutProps {
  children: ReactNode
  sidebarItems?: NavItem[]
}

export interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

/* ─── Animation ─── */
export type AnimationVariant = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideUp' | 'slideDown' | 'stagger'
export type AnimationEasing = 'easeOut' | 'easeInOut' | 'spring' | 'springSoft' | 'springStiff'

export interface AnimationProps {
  variant?: AnimationVariant
  delay?: number
  duration?: number
  easing?: AnimationEasing
  once?: boolean
  className?: string
  children: ReactNode
}

export interface StaggerContainerProps {
  delay?: number
  staggerDelay?: number
  once?: boolean
  className?: string
  children: ReactNode
}

/* ─── Navigation ─── */
export type NavClickHandler = (href: string) => void

/* ─── Service Detail (for modals) ─── */
export interface ServiceDetail {
  id: string
  icon: LucideIcon
  title: string
  gradient: string
  fullDescription: string
  features: string[]
  benefits: string[]
  targetAudience: string
}

/* ─── Developer ─── */
export interface Developer {
  id: string
  name: string
  designation: string
  skills: string[]
  shortDescription: string
  fullDescription: string
  contribution: string
  responsibilities: string[]
  projectContribution: string
  email: string
  phone: string
  linkedin: string
  github: string
  githubAvatar: string
}

/* ─── Workflow Step ─── */
export interface WorkflowStep {
  id: string
  icon: LucideIcon
  title: string
  description: string
  details: string[]
  gradient: string
}

/* ─── Working Model ─── */
export interface WorkingModel {
  id: string
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  gradient: string
}

/* ─── Download App ─── */
export interface DownloadAppData {
  title: string
  description: string
  platforms: { name: string; icon: LucideIcon; href: string; badge: string }[]
  features: string[]
}

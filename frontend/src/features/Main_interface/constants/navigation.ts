import type { NavItem } from '../types'

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Overview', href: '#overview' },
  { label: 'About CIMS', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Usage', href: '#usage' },
  { label: 'Workflow', href: '/workflow' },
  { label: 'Developers', href: '/developers' },
  { label: 'Contact', href: '#contact' },
]

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Students', href: '/students' },
  { label: 'Faculty', href: '/faculty' },
  { label: 'Courses', href: '/courses' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Attendance', href: '/attendance' },
  { label: 'Reports', href: '/reports' },
  { label: 'Settings', href: '/settings' },
]

export const FOOTER_NAV_ITEMS: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
]

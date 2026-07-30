import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  Shield,
  Zap,
  Globe,
  UserPlus,
  Lock,
  User,
} from 'lucide-react'
import type { Feature, Stat, Testimonial, Course, PricingPlan, FaqItem, TeamMember, ServiceDetail, Developer, WorkflowStep, WorkingModel, DownloadAppData } from '../types'

export const HERO_CONTENT = {
  title: 'Empowering Educators, Shaping Futures',
  subtitle: 'Coaching Institute Management System',
  description:
    'Streamline your institute operations with our all-in-one management platform. From student enrollment to performance analytics, manage everything seamlessly.',
  primaryCta: { label: 'Get Started', href: '/get-started' },
  secondaryCta: { label: 'Learn More', href: '/about' },
}

export const FEATURES: Feature[] = [
  {
    id: 'student-mgmt',
    icon: Users,
    title: 'Student Management',
    description: 'Comprehensive student lifecycle management from enrollment to graduation with automated workflows.',
    href: '/features/student-management',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'course-mgmt',
    icon: BookOpen,
    title: 'Course Management',
    description: 'Create, organize, and manage courses with flexible scheduling and resource allocation.',
    href: '/features/course-management',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'attendance',
    icon: Calendar,
    title: 'Attendance Tracking',
    description: 'Multi-mode attendance with face recognition, QR codes, fingerprint, and manual marking.',
    href: '/features/attendance',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Real-time insights with interactive dashboards, performance trends, and exportable reports.',
    href: '/features/analytics',
    gradient: 'from-orange-600 to-red-600',
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Granular permission controls with role-based access for administrators, faculty, and staff.',
    href: '/features/security',
    gradient: 'from-cyan-600 to-blue-600',
  },
  {
    id: 'automation',
    icon: Zap,
    title: 'Smart Automation',
    description: 'Automate repetitive tasks like notifications, report generation, and fee reminders.',
    href: '/features/automation',
    gradient: 'from-violet-600 to-purple-600',
  },
]

export const STATS: Stat[] = [
  { id: 'students', value: 15000, suffix: '+', label: 'Active Students', trend: 'up', trendValue: '12%' },
  { id: 'faculty', value: 500, suffix: '+', label: 'Expert Faculty', trend: 'up', trendValue: '8%' },
  { id: 'courses', value: 200, suffix: '+', label: 'Courses Offered', trend: 'up', trendValue: '15%' },
  { id: 'centers', value: 50, suffix: '+', label: 'Learning Centers', trend: 'up', trendValue: '5%' },
]



export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Full-Stack Web Development',
    description: 'Comprehensive program covering HTML, CSS, JavaScript, React, Node.js, and database management.',
    category: 'Technology',
    duration: '6 Months',
    level: 'intermediate',
    studentsCount: 2340,
    rating: 4.8,
    instructor: 'Dr. Rajesh Kumar',
    href: '/courses/full-stack-web-development',
  },
  {
    id: 'c2',
    title: 'Data Science & Machine Learning',
    description: 'Master Python, statistics, ML algorithms, deep learning, and data visualization techniques.',
    category: 'Technology',
    duration: '8 Months',
    level: 'advanced',
    studentsCount: 1850,
    rating: 4.9,
    instructor: 'Prof. Deepa Krishnan',
    href: '/courses/data-science-ml',
  },
  {
    id: 'c3',
    title: 'Competitive Mathematics',
    description: 'Advanced problem-solving for IIT-JEE, Olympiad, and other competitive mathematics exams.',
    category: 'Mathematics',
    duration: '12 Months',
    level: 'advanced',
    studentsCount: 3200,
    rating: 4.7,
    instructor: 'Dr. Suresh Reddy',
    href: '/courses/competitive-mathematics',
  },
  {
    id: 'c4',
    title: 'English Communication Skills',
    description: 'Develop professional communication, public speaking, business writing, and presentation skills.',
    category: 'Language',
    duration: '3 Months',
    level: 'beginner',
    studentsCount: 1500,
    rating: 4.5,
    instructor: 'Prof. Meera Nair',
    href: '/courses/english-communication',
  },
  {
    id: 'c5',
    title: 'Physics for Competitive Exams',
    description: 'Comprehensive physics curriculum covering mechanics, electromagnetism, optics, and modern physics.',
    category: 'Science',
    duration: '10 Months',
    level: 'advanced',
    studentsCount: 2100,
    rating: 4.6,
    instructor: 'Dr. Amit Verma',
    href: '/courses/physics-competitive-exams',
  },
  {
    id: 'c6',
    title: 'Digital Marketing Masterclass',
    description: 'Learn SEO, SEM, social media marketing, content strategy, and analytics from industry experts.',
    category: 'Business',
    duration: '4 Months',
    level: 'intermediate',
    studentsCount: 980,
    rating: 4.4,
    instructor: 'Prof. Ishita Roy',
    href: '/courses/digital-marketing',
  },
]

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small coaching centers getting started.',
    price: 0,
    interval: 'month',
    features: [
      'Up to 100 students',
      'Basic attendance tracking',
      'Course management',
      'Email notifications',
      'Standard reports',
      'Community support',
    ],
    href: '/pricing/starter',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing institutes with advanced needs.',
    price: 499,
    currency: '₹',
    interval: 'month',
    features: [
      'Up to 1,000 students',
      'Multi-mode attendance',
      'Advanced analytics',
      'Role-based access control',
      'Custom reports',
      'Priority support',
      'API access',
      'Bulk import/export',
    ],
    highlighted: true,
    badge: 'Most Popular',
    href: '/pricing/professional',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large institutions requiring full customization.',
    price: 1499,
    currency: '₹',
    interval: 'month',
    features: [
      'Unlimited students',
      'All attendance modes',
      'Real-time analytics',
      'Custom role configurations',
      'Dedicated account manager',
      '24/7 phone & email support',
      'On-premise deployment option',
      'Custom integrations',
      'SLA guarantee',
      'White-label option',
    ],
    href: '/pricing/enterprise',
  },
]

export const FAQS: FaqItem[] = [
  {
    id: 'f1',
    question: 'How long does it take to set up CIMS for my institute?',
    answer:
      'Most institutes are fully operational within 24-48 hours. Our onboarding team guides you through every step, from data migration to staff training.',
  },
  {
    id: 'f2',
    question: 'Can I import existing student data?',
    answer:
      'Yes, CIMS supports bulk import from CSV, Excel, and most popular school management systems. Our import wizard handles data mapping automatically.',
  },
  {
    id: 'f3',
    question: 'Is my data secure?',
    answer:
      'Absolutely. CIMS uses bank-level encryption (AES-256), role-based access controls, regular security audits, and GDPR-compliant data handling practices.',
  },
  {
    id: 'f4',
    question: 'Can I customize the system for my institute?',
    answer:
      'Enterprise plans include full customization options including custom fields, workflows, reports, and white-labeling to match your brand.',
  },
  {
    id: 'f5',
    question: 'What kind of support do you provide?',
    answer:
      'All plans include email support. Professional plans add priority support, and Enterprise plans include a dedicated account manager with 24/7 phone support.',
  },
]

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'Dr. Rajesh Kumar',
    role: 'CEO & Founder',
    bio: '20+ years in education technology. Former Dean at IIT Delhi.',
  },
  {
    id: 'm2',
    name: 'Prof. Sunita Sharma',
    role: 'Chief Academic Officer',
    bio: '15+ years experience in curriculum design and academic administration.',
  },
  {
    id: 'm3',
    name: 'Amit Verma',
    role: 'CTO',
    bio: 'Ex-Google engineer leading our technology strategy and platform architecture.',
  },
  {
    id: 'm4',
    name: 'Priya Patel',
    role: 'Head of Product',
    bio: 'Passionate about building products that solve real education challenges.',
  },
]

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: 'student-mgmt',
    icon: Users,
    title: 'Student Management',
    gradient: 'from-blue-600 to-indigo-600',
    fullDescription:
      'A comprehensive student lifecycle management system that handles everything from enrollment to graduation. Automate admissions, track academic progress, manage communications, and maintain complete student records with our intuitive interface.',
    features: [
      'Automated enrollment and admission workflows',
      'Comprehensive student profiles with document management',
      'Academic progress tracking with GPA and grade analytics',
      'Automated fee management and receipt generation',
      'Parent/guardian communication portal',
      'Bulk student data import/export',
    ],
    benefits: [
      'Reduce administrative workload by 60%',
      'Eliminate manual data entry errors',
      'Real-time access to student information',
      'Improved parent satisfaction with transparent communication',
    ],
    targetAudience: 'Ideal for coaching institutes, tuition centers, and educational academies managing 100+ students.',
  },
  {
    id: 'course-mgmt',
    icon: BookOpen,
    title: 'Course Management',
    gradient: 'from-emerald-600 to-teal-600',
    fullDescription:
      'Design, organize, and manage your entire course catalog with flexible scheduling, resource allocation, and curriculum planning tools. Support for multiple batches, faculty assignments, and dynamic timetable management.',
    features: [
      'Course catalog with categories and levels',
      'Batch creation and management',
      'Faculty assignment and workload balancing',
      'Dynamic timetable generation',
      'Curriculum and syllabus management',
      'Resource allocation for classrooms and labs',
    ],
    benefits: [
      'Optimize faculty utilization by 40%',
      'Reduce scheduling conflicts to near zero',
      'Launch new courses in minutes',
      'Centralized curriculum control across branches',
    ],
    targetAudience: 'Perfect for institutes offering multiple courses across different streams and batches.',
  },
  {
    id: 'attendance',
    icon: Calendar,
    title: 'Attendance Tracking',
    gradient: 'from-purple-600 to-pink-600',
    fullDescription:
      'Multi-mode attendance system supporting face recognition, QR code scanning, biometric fingerprint, RFID cards, and manual marking. Real-time synchronization with parent notifications and automated report generation.',
    features: [
      'Face recognition attendance with AI',
      'QR code and barcode scanning',
      'Biometric fingerprint integration',
      'RFID card support',
      'Manual attendance marking fallback',
      'Real-time parent notifications',
    ],
    benefits: [
      'Reduce attendance marking time by 80%',
      'Eliminate proxy attendance',
      'Instant parent alerts for absentees',
      'Automated monthly attendance reports',
    ],
    targetAudience: 'Essential for institutes with high student attendance requirements and strict monitoring needs.',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Analytics & Reports',
    gradient: 'from-orange-600 to-red-600',
    fullDescription:
      'Powerful analytics engine providing real-time insights into student performance, attendance trends, fee collections, and institutional growth. Interactive dashboards with drill-down capabilities and exportable reports.',
    features: [
      'Interactive real-time dashboards',
      'Student performance analytics',
      'Attendance trend analysis',
      'Fee collection and financial reports',
      'Custom report builder',
      'Export to PDF, Excel, and CSV',
    ],
    benefits: [
      'Data-driven decision making',
      'Identify at-risk students early',
      'Track institutional KPIs in real-time',
      'Save 20+ hours per week on reporting',
    ],
    targetAudience: 'Designed for institute administrators, academic heads, and decision-makers who rely on data.',
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Role-Based Access',
    gradient: 'from-cyan-600 to-blue-600',
    fullDescription:
      'Enterprise-grade security with granular role-based access control (RBAC). Define custom permissions for administrators, faculty, staff, students, and parents. Complete audit logging and data encryption.',
    features: [
      'Granular role-based permission system',
      'Custom role creation with specific permissions',
      'Complete audit trail and activity logs',
      'AES-256 data encryption at rest and in transit',
      'Two-factor authentication support',
      'GDPR and data privacy compliance',
    ],
    benefits: [
      'Protect sensitive student and financial data',
      'Comply with data protection regulations',
      'Prevent unauthorized access',
      'Full visibility into system activities',
    ],
    targetAudience: 'Critical for institutes handling sensitive student data and requiring regulatory compliance.',
  },
  {
    id: 'automation',
    icon: Zap,
    title: 'Smart Automation',
    gradient: 'from-violet-600 to-purple-600',
    fullDescription:
      'Automate repetitive administrative tasks including fee reminders, notification broadcasts, report generation, and routine communications. Set up custom workflows that trigger based on specific events and conditions.',
    features: [
      'Automated fee reminders via SMS and email',
      'Bulk notification broadcasting',
      'Scheduled report generation and delivery',
      'Custom workflow automation engine',
      'Event-triggered actions and alerts',
      'Integration with email and messaging APIs',
    ],
    benefits: [
      'Save 30+ hours per month on manual tasks',
      'Improve fee collection rates with timely reminders',
      'Ensure no important communication is missed',
      'Streamline institute-wide operations',
    ],
    targetAudience: 'Perfect for growing institutes looking to scale operations without increasing administrative staff.',
  },
]

export const DEVELOPERS: Developer[] = [
  {
    id: 'd1',
    name: 'Chowdam Nanda Kishore',
    designation: 'Team Leader | Full-Stack Developer | Backend Developer',
    skills: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'REST APIs', 'JWT Authentication'],
    shortDescription: 'Full-stack engineer with 7+ years building scalable ed-tech platforms.',
    fullDescription:
      'Chowdam Nanda Kishore serves as the Team Leader and Lead Full-Stack Developer for EduMatrix ERP. He was responsible for planning the overall architecture, designing secure backend services, integrating PostgreSQL with Prisma ORM, implementing Role-Based Access Control (RBAC), and ensuring seamless communication between frontend and backend modules. He also supervised project execution, resolved technical challenges, and maintained code quality throughout developmentt.',
    contribution: 'Led the complete development of EduMatrix ERP by designing the system architecture, backend services, database structure, authentication system, and API integration. Coordinated the team, assigned development tasks, reviewed code, and ensured smooth integration of all project modules.',
    responsibilities: [
      'Project planning and team coordination', 
      'System architecture design',
      'Backend API development',
      'PostgreSQL database design',
      'Authentication and authorization',
      'API integration',
      'Performance optimization',
      'Final deployment and testing',
    ],
    projectContribution: 'Designed 20+ backend APIs, implemented RBAC for 5 user roles, and integrated PostgreSQL with Prisma ORM for efficient data management. Developed the authentication system using JWT and ensured secure data flow between frontend and backend modules. Supervised the team to deliver a fully functional ERP system within the project timeline.',

    email: 'nandalearner12@gmail.com',
    phone: '+91 9963517534',
    linkedin: 'https://linkedin.com/in/nanda-kishore-c-394221318',
    github: 'https://github.com/Nanda1144',
    githubAvatar: 'https://avatars.githubusercontent.com/Nanda1144?size=200',
  },
  {
    id: 'd2',
    name: 'Grishma',
    designation: 'Frontend Developer | UI/UX Designer',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Next.js'],
    shortDescription: 'UI/UX focused frontend developer passionate about pixel-perfect interfaces.',
    fullDescription:
      'Grishma worked on creating attractive, responsive, and user-friendly interfaces for the administration panel. She implemented reusable UI components, dashboard layouts, forms, tables, and integrated frontend screens with backend APIs to provide a smooth user experience.',
    contribution: 'Developed the Admin Dashboard and designed responsive user interfaces with reusable components for a modern user experience.',
    responsibilities: [
      'Admin Dashboard Development',
      'UI/UX Design',
      'Responsive Layouts',
      'API Integration',
      'Form Validation',
      'Dashboard Components', 
      'User Experience Enhancement'
    ],
    projectContribution: 'Admin Dashboard , Institute Management UI, Branch Management, User Management ,Dashboard Analytics, Responsive Components',
    email: 'girigrishma997@gmail.com',
    phone: '+91 9160410577',
    linkedin: 'https://linkedin.com/in/grishma',
    github: 'https://github.com/snehapatel',
    githubAvatar: 'https://avatars.githubusercontent.com/snehapatel?size=200',
  },
  {
    id: 'd3',
    name: 'Shaik Malin',
    designation: 'Frontend Developer | Student & Parent Portal Developer',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Next.js'],
    shortDescription: 'Frontend developer with expertise in creating responsive and engaging user interfaces.',
    fullDescription:
      'Shaik Malin is our frontend expert responsible for developing intuitive user interfaces and seamless user experiences. He specializes in React, TypeScript, and modern CSS frameworks.',
    contribution: 'Developed the student and parent portal interfaces with a focus on usability and performance.',
    responsibilities: [
      'Frontend Development',
      'UI/UX Design',
      'Responsive Layouts',
      'API Integration',
      'Form Validation',
      'Component Development', 
      'User Experience Enhancement'
    ],
    projectContribution: 'Student Portal , Parent Portal , Institute Management UI, Branch Management, User Management ,Dashboard Analytics, Responsive Components',
    email: 'reshmashaik9915@gmail.com',
    phone: '+91 9502688445',
    linkedin: 'https://linkedin.com/in/malin-shaik-9a0b1a1b3',
    github: 'https://github.com/shaikmalin',
    githubAvatar: 'https://avatars.githubusercontent.com/shaikmalin?size=200',
  },
]

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'w1',
    icon: UserPlus,
    title: 'Institute Registration',
    description: 'Register your institute and set up your profile in minutes.',
    details: [
      'Create your institute profile with basic details',
      'Configure academic year and term settings',
      'Set up branch and department structure',
      'Define course catalog and fee structure',
    ],
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'w2',
    icon: Users,
    title: 'Import Data',
    description: 'Import existing student and faculty data seamlessly.',
    details: [
      'Bulk import students via CSV or Excel',
      'Import faculty profiles with qualifications',
      'Map data fields automatically',
      'Verify and correct imported data',
    ],
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'w3',
    icon: Calendar,
    title: 'Create Schedule',
    description: 'Set up timetables, batches, and academic calendars.',
    details: [
      'Generate timetables with smart scheduling',
      'Create batches and assign faculty',
      'Set holiday calendar and events',
      'Configure classroom and lab allocation',
    ],
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'w4',
    icon: BarChart3,
    title: 'Go Live',
    description: 'Start taking attendance, managing courses, and tracking performance.',
    details: [
      'Begin attendance tracking with preferred mode',
      'Start course delivery and content sharing',
      'Monitor student performance in real-time',
      'Generate reports and insights',
    ],
    gradient: 'from-orange-600 to-red-600',
  },
]

export const WORKING_MODEL: WorkingModel[] = [
  {
    id: 'wm1',
    icon: Globe,
    title: 'Cloud-Based SaaS',
    description: 'Fully hosted cloud platform accessible from anywhere, anytime. No infrastructure management needed.',
    features: [
      '99.9% uptime guarantee',
      'Automatic backups and disaster recovery',
      'SSL encryption and data security',
      'Automatic updates and feature releases',
    ],
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'wm2',
    icon: Shield,
    title: 'Multi-Tenant Architecture',
    description: 'Secure isolation of institute data with shared infrastructure for cost efficiency.',
    features: [
      'Data isolation between institutes',
      'Custom branding for each institute',
      'Scalable resource allocation',
      'Independent configuration per tenant',
    ],
    gradient: 'from-violet-600 to-purple-600',
  },
  {
    id: 'wm3',
    icon: Zap,
    title: 'Real-Time Sync',
    description: 'Instant data synchronization across all devices and users with real-time updates.',
    features: [
      'Real-time attendance updates',
      'Instant notification delivery',
      'Live dashboard updates',
      'Cross-device data sync',
    ],
    gradient: 'from-orange-600 to-red-600',
  },
  {
    id: 'wm4',
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-grade security with role-based access, encryption, and comprehensive audit trails.',
    features: [
      'AES-256 encryption at rest and in transit',
      'Role-based access control (RBAC)',
      'Complete audit logging',
      'GDPR and data privacy compliance',
    ],
    gradient: 'from-emerald-600 to-teal-600',
  },
]

export const DOWNLOAD_APP: DownloadAppData = {
  title: 'CIMS Mobile App',
  description:
    'Take CIMS on the go. Access attendance, grades, schedules, and communications from your mobile device.',
  platforms: [
    {
      name: 'iOS',
      icon: Globe,
      href: '#',
      badge: 'App Store',
    },
    {
      name: 'Android',
      icon: Globe,
      href: '#',
      badge: 'Google Play',
    },
  ],
  features: [
    'Mark attendance on the go',
    'View student performance and reports',
    'Receive instant notifications',
    'Communicate with parents and faculty',
    'Access course materials anywhere',
    'Manage schedules and timetables',
  ],
}

export const APP_CONFIG = {
  name: 'CIMS',
  fullName: 'Coaching Institute Management System',
  tagline: 'Empowering Educators, Shaping Futures',
  description: 'All-in-one management platform for coaching institutes.',
  email: 'hello@cims.edu',
  phone: '+1 (555) 123-4567',
  address: '123 Education Lane, Learning City, ED 10001',
  social: {
    twitter: 'https://twitter.com/cims',
    linkedin: 'https://linkedin.com/company/cims',
    youtube: 'https://youtube.com/@cims',
    github: 'https://github.com/cims',
  },
}

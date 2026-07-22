import MainLayout from '../layouts/MainLayout'
import Section from '../components/Section'
import StaggerContainer from '../animations/StaggerContainer'
import CourseCard from '../cards/CourseCard'
import Input from '../components/Input'
import Select from '../components/Select'
import Badge from '../components/Badge'
import { COURSES } from '../constants'
import { Search } from 'lucide-react'
import { useState } from 'react'

const categories = ['All', 'Technology', 'Mathematics', 'Science', 'Language', 'Business']
const levels = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
]

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('all')

  const filtered = COURSES.filter((c) => {
    const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || c.category === category
    const matchesLevel = level === 'all' || c.level === level
    return matchesSearch && matchesCategory && matchesLevel
  })

  return (
    <MainLayout>
      <Section
        subtitle="Our Courses"
        title="Find the right program for you"
        description="Browse our comprehensive catalog of courses designed for academic excellence."
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 max-w-2xl mx-auto">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search courses..."
              icon={<Search size={18} aria-hidden="true" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              options={levels}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="focus:outline-none"
            >
              <Badge
                variant={category === cat ? 'gradient' : 'default'}
                size="md"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                {cat}
              </Badge>
            </button>
          ))}
        </div>

        <StaggerContainer staggerDelay={0.08}>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
              <button
                onClick={() => { setSearch(''); setCategory('All'); setLevel('all') }}
                className="text-blue-600 text-sm font-medium mt-2 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </StaggerContainer>
      </Section>
    </MainLayout>
  )
}

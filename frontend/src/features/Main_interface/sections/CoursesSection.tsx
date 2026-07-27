import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Section from '../components/Section'
import CourseCard from '../cards/CourseCard'
import Button from '../components/Button'
import { COURSES } from '../constants'

export default function CoursesSection() {
  return (
    <Section
      id="courses"
      variant="alt"
      subtitle="Our Courses"
      title="Explore popular programs"
      description="Discover courses designed by industry experts to help you achieve your learning goals."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.slice(0, 6).map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <CourseCard {...course} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Button variant="outline" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" href="/courses">
          View All Courses
        </Button>
      </motion.div>
    </Section>
  )
}

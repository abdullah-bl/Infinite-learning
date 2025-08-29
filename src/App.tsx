import { useState } from 'react'
import { Toaster } from 'sonner'
import { TopicInput } from './components/TopicInput'
import { CourseGenerator } from './components/CourseGenerator'
import { CourseContent } from './components/CourseContent'
import { useStore } from './store'

function App() {
  const [generatingTopic, setGeneratingTopic] = useState<string>('')
  const [viewMode, setViewMode] = useState<'input' | 'course'>('input')
  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number>(0)
  const { courses, setTopic } = useStore()

  const handleGenerateCourse = (topic: string) => {
    setTopic(topic)
    setGeneratingTopic(topic)
  }

  const handleCourseGenerated = () => {
    setSelectedCourseIndex(courses.length) // Will be the new course index
    setViewMode('course')
    setGeneratingTopic('')
  }

  const handleBackToInput = () => {
    setViewMode('input')
    setSelectedCourseIndex(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {viewMode === 'input' ? (
            <div className="space-y-8">
              <TopicInput onGenerateCourse={handleGenerateCourse} />

              {/* Show existing courses if any */}
              {courses.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-center">Previous Courses</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow bg-white"
                        onClick={() => {
                          setSelectedCourseIndex(index)
                          setViewMode('course')
                        }}
                      >
                        <h3 className="font-medium truncate">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground">
                            {course.lessons.filter(l => l.completed).length}/{course.lessons.length} lessons completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <CourseContent
              course={courses[selectedCourseIndex]}
              courseIndex={selectedCourseIndex}
              onBack={handleBackToInput}
            />
          )}
        </div>
      </div>

      {/* Course Generator Component */}
      {generatingTopic && (
        <CourseGenerator
          topic={generatingTopic}
          onCourseGenerated={handleCourseGenerated}
        />
      )}

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  )
}

export default App

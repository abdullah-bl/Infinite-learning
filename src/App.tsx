import { useCallback, useEffect, useRef, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { TopicInput } from '@/components/TopicInput'
import { CourseContent } from '@/components/CourseContent'
import { Settings } from '@/components/Settings'
import { useStore } from './store'
import { Footer } from './components/footer'
import { WebWorkerMLCEngine } from '@mlc-ai/web-llm'
import { generateCoursePrompt, systemPrompt } from './lib/prompt'
import { validatedCourse } from './components/validate'

function App() {
  const [, setGeneratingTopic] = useState<string>('')
  const [viewMode, setViewMode] = useState<'input' | 'course'>('input')
  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number>(0)
  const { courses, topic, setTopic, settings, addCourse, setIsGenerating } = useStore()
  const engineRef = useRef<WebWorkerMLCEngine | null>(null);


  useEffect(() => {
    const initEngine = async () => {
      if (!engineRef.current) {
        toast.info('Initializing AI model...', { id: 'init-engine', description: 'This may take a few seconds...Depends on the model and the topic.' })
        const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm')
        engineRef.current = await CreateWebWorkerMLCEngine(
          new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
          settings.defaultModel,
          {
            initProgressCallback: (progress) => {
              toast.info('Initializing AI model...', {
                id: 'init-engine',
                description: `Initializing AI model...${progress.progress.toFixed(2)}%`
              })
            },
          }
        )
        toast.success('AI model initialized!')
      }
    }
    initEngine()

    // cleanup
    return () => {
      engineRef.current?.unload()
      engineRef.current = null
    }
  }, [])

  const handleGenerateCourse = useCallback(async () => {
    setTopic(topic)
    setIsGenerating(true)
    if (!engineRef.current) return
    toast.info('Generating course...', { id: 'generating-course', dismissible: false, description: 'This may take a few seconds...Depends on the model and the topic.' })
    const startTime = performance.now()
    const response = await engineRef.current?.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt(settings.language) },
        { role: 'user', content: generateCoursePrompt(topic) }
      ],
      max_tokens: settings.maxTokens,
      temperature: settings.temperature,
      response_format: { type: 'json_object' }
    })
    const endTime = performance.now()
    const duration = endTime - startTime
    toast.info(`Course generated in ${duration.toFixed(2)}ms`)
    const responseText = response.choices[0]?.message?.content?.trim()
    const course = validatedCourse(responseText as string, topic)
    toast.success('Course generated!')
    if (course) {
      addCourse(course)
      setGeneratingTopic('')
      setSelectedCourseIndex(courses.length)
      setViewMode('course')
      setIsGenerating(false)
    } else {
      toast.error('Failed to generate course!')
    }
  }, [topic, settings, addCourse, setIsGenerating, setGeneratingTopic, setSelectedCourseIndex, courses])

  const handleBackToInput = () => {
    setViewMode('input')
    setSelectedCourseIndex(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Settings Modal */}
      <Settings />

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

      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App

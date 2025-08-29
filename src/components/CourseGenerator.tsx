import { useEffect, useRef } from 'react';
import { CreateWebWorkerMLCEngine } from '@mlc-ai/web-llm';
import { useStore } from '../store';
import { toast } from 'sonner';

interface CourseGeneratorProps {
    topic: string;
    onCourseGenerated: () => void;
}

export function CourseGenerator({ topic, onCourseGenerated }: CourseGeneratorProps) {
    const { addCourse, setIsGenerating } = useStore();
    const engineRef = useRef<any>(null);
    const isInitializingRef = useRef(false);

    useEffect(() => {
        if (!topic || isInitializingRef.current) return;

        const generateCourse = async () => {
            try {
                setIsGenerating(true);
                isInitializingRef.current = true;

                // Initialize the engine if not already done
                if (!engineRef.current) {
                    toast.info('Initializing AI model... This may take a moment.');
                    engineRef.current = await CreateWebWorkerMLCEngine(
                        new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' }),
                        'Qwen3-0.6B-q4f32_1-MLC'
                    );
                    toast.success('AI model ready!');
                }

                toast.info('Generating your micro course...');

                const prompt = `Create a comprehensive micro-course about "${topic}". Structure it as a JSON object with the following format:

{
  "title": "Course Title",
  "description": "Brief course description",
  "progress": 0,
  "score": 0,
  "lessons": [
    {
      "title": "Lesson Title",
      "content": "Detailed lesson content (2-3 paragraphs explaining the concept clearly)",
      "completed": false,
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": 0,
          "userAnswer": null
        }
      ]
    }
  ]
}

Create exactly 3 lessons, each with 2 quiz questions. Make the content educational, engaging, and appropriate for beginners. Ensure questions test understanding of the lesson content.

Return ONLY the JSON object, no additional text.`;

                const response = await engineRef.current.chat.completions.create({
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant that generates micro-courses about a given topic. You are also a teacher and you are very good at teaching. make sure to respond in the language of the user.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 2000,
                    temperature: 0.7,
                    response_format: { type: 'json_object' }
                });


                const responseText = response.choices[0]?.message?.content?.trim();

                if (!responseText) {
                    throw new Error('No response from AI model');
                }

                // Try to parse the JSON response with multiple fallback strategies
                let courseData;
                try {
                    // Strategy 1: Remove markdown formatting and parse
                    let cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();

                    // Strategy 2: Try to extract JSON from text if it's embedded
                    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        cleanJson = jsonMatch[0];
                    }

                    courseData = JSON.parse(cleanJson);
                } catch (parseError) {
                    console.error('Failed to parse JSON:', responseText);
                    console.error('Parse error:', parseError);

                    // Fallback: Create a basic course structure
                    console.warn('Creating fallback course structure due to parsing failure');
                    toast.warning('AI response was malformed. Creating a basic course structure for you.');
                    courseData = {
                        title: `${topic} Course`,
                        description: `A comprehensive course about ${topic}`,
                        lessons: [
                            {
                                title: `Introduction to ${topic}`,
                                content: `This lesson introduces the fundamental concepts of ${topic}. You'll learn the basic principles and key ideas that form the foundation of this subject.`,
                                questions: [
                                    {
                                        question: `What is the main focus of this ${topic} course?`,
                                        options: ['Basic concepts', 'Advanced techniques', 'Practical applications', 'Theoretical foundations'],
                                        correct: 0
                                    },
                                    {
                                        question: `Why is understanding ${topic} important?`,
                                        options: ['It\'s fundamental', 'It\'s practical', 'It\'s widely used', 'All of the above'],
                                        correct: 3
                                    }
                                ]
                            },
                            {
                                title: `Core Concepts of ${topic}`,
                                content: `In this lesson, we dive deeper into the core concepts of ${topic}. You'll explore the main principles and understand how they apply in various contexts.`,
                                questions: [
                                    {
                                        question: `What are the key principles of ${topic}?`,
                                        options: ['Simple rules', 'Complex theories', 'Practical guidelines', 'Fundamental concepts'],
                                        correct: 3
                                    },
                                    {
                                        question: `How do these concepts apply in practice?`,
                                        options: ['Directly', 'With modifications', 'Contextually', 'Systematically'],
                                        correct: 2
                                    }
                                ]
                            },
                            {
                                title: `Practical Applications of ${topic}`,
                                content: `This final lesson focuses on the practical applications of ${topic}. You'll learn how to apply what you've learned in real-world scenarios and understand the broader implications.`,
                                questions: [
                                    {
                                        question: `What is the best way to apply ${topic} knowledge?`,
                                        options: ['Theoretically', 'Practically', 'Systematically', 'Creatively'],
                                        correct: 1
                                    },
                                    {
                                        question: `What should you remember most about ${topic}?`,
                                        options: ['The details', 'The big picture', 'The applications', 'The fundamentals'],
                                        correct: 3
                                    }
                                ]
                            }
                        ]
                    };
                }

                // Validate the structure with detailed error messages
                console.log('Raw course data:', courseData);

                if (!courseData || typeof courseData !== 'object') {
                    throw new Error('Invalid course structure: Response is not a valid object');
                }

                if (!courseData.title || typeof courseData.title !== 'string') {
                    throw new Error('Invalid course structure: Missing or invalid title');
                }

                if (!courseData.lessons || !Array.isArray(courseData.lessons)) {
                    throw new Error('Invalid course structure: Missing or invalid lessons array');
                }

                if (courseData.lessons.length === 0) {
                    throw new Error('Invalid course structure: No lessons found');
                }

                // Validate each lesson structure
                for (let i = 0; i < courseData.lessons.length; i++) {
                    const lesson = courseData.lessons[i];
                    if (!lesson || typeof lesson !== 'object') {
                        throw new Error(`Invalid course structure: Lesson ${i + 1} is not a valid object`);
                    }

                    if (!lesson.title || typeof lesson.title !== 'string') {
                        console.warn(`Lesson ${i + 1} missing title, will use default`);
                    }

                    if (!lesson.content || typeof lesson.content !== 'string') {
                        console.warn(`Lesson ${i + 1} missing content, will use default`);
                    }

                    if (!lesson.questions || !Array.isArray(lesson.questions)) {
                        console.warn(`Lesson ${i + 1} missing questions, will use empty array`);
                    }
                }

                // Ensure proper structure with robust validation and fallbacks
                const validatedCourse = {
                    title: courseData.title || `${topic} Course`,
                    description: courseData.description || `Learn about ${topic}`,
                    progress: 0,
                    score: 0,
                    lessons: courseData.lessons.map((lesson: any, index: number) => {
                        // Ensure each lesson has proper structure
                        const validatedLesson = {
                            title: lesson.title || `Lesson ${index + 1}`,
                            content: lesson.content || `This lesson covers important concepts about ${topic}.`,
                            completed: false,
                            questions: [] as Array<{
                                question: string;
                                options: string[];
                                correct: number;
                                userAnswer: number | null;
                            }>
                        };

                        // Validate and process questions
                        if (lesson.questions && Array.isArray(lesson.questions)) {
                            validatedLesson.questions = lesson.questions.map((q: any, qIndex: number) => {
                                // Ensure question has valid structure
                                const question = q.question || `Question ${qIndex + 1}`;
                                let options = ['A', 'B', 'C', 'D'];
                                let correct = 0;

                                if (Array.isArray(q.options) && q.options.length >= 2) {
                                    options = q.options.slice(0, 4); // Limit to 4 options
                                    // Pad with generic options if less than 4
                                    while (options.length < 4) {
                                        options.push(`Option ${options.length + 1}`);
                                    }
                                }

                                if (typeof q.correct === 'number' && q.correct >= 0 && q.correct < options.length) {
                                    correct = q.correct;
                                }

                                return {
                                    question,
                                    options,
                                    correct,
                                    userAnswer: null
                                };
                            });
                        }

                        // Ensure at least one question per lesson
                        if (validatedLesson.questions.length === 0) {
                            validatedLesson.questions.push({
                                question: `What did you learn from this lesson about ${topic}?`,
                                options: [
                                    'Important concepts',
                                    'Basic principles',
                                    'Key fundamentals',
                                    'Core ideas'
                                ],
                                correct: 0,
                                userAnswer: null
                            });
                        }

                        return validatedLesson;
                    })
                };

                addCourse(validatedCourse);
                toast.success('Micro course generated successfully!');
                onCourseGenerated();

            } catch (error) {
                console.error('Error generating course:', error);

                // Provide more specific error feedback
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                if (errorMessage.includes('Invalid course structure')) {
                    toast.error(`Course generation failed: ${errorMessage}. Please try a different topic or try again.`);
                } else if (errorMessage.includes('Invalid response format')) {
                    toast.error('AI model returned malformed data. Please try again.');
                } else if (errorMessage.includes('No response')) {
                    toast.error('AI model did not respond. Please check your connection and try again.');
                } else {
                    toast.error('Failed to generate course. Please try again.');
                }
            } finally {
                setIsGenerating(false);
                isInitializingRef.current = false;
            }
        };

        generateCourse();
    }, [topic, addCourse, setIsGenerating, onCourseGenerated]);

    return null; // This component doesn't render anything
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, PlayCircle, ArrowLeft, Trophy } from 'lucide-react';
import { useStore } from '../store';
import { Quiz } from './Quiz';

interface Course {
    title: string;
    description: string;
    progress: number;
    score: number;
    lessons: {
        title: string;
        content: string;
        completed: boolean;
        questions: {
            question: string;
            options: string[];
            correct: number;
            userAnswer: number | null;
        }[];
    }[];
}

interface CourseContentProps {
    course: Course;
    courseIndex: number;
    onBack: () => void;
}

type ViewMode = 'overview' | 'lesson' | 'quiz';

export function CourseContent({ course, courseIndex, onBack }: CourseContentProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('overview');
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const { updateLessonProgress, courses } = useStore();

    // Get the latest course data from store
    const latestCourse = courses[courseIndex] || course;
    const currentLesson = latestCourse.lessons[currentLessonIndex];

    const completedLessons = latestCourse.lessons.filter(lesson => lesson.completed).length;
    const progressPercentage = (completedLessons / latestCourse.lessons.length) * 100;

    const handleStartLesson = (lessonIndex: number) => {
        setCurrentLessonIndex(lessonIndex);
        setViewMode('lesson');
    };

    const handleStartQuiz = () => {
        setViewMode('quiz');
    };

    const handleQuizComplete = () => {
        updateLessonProgress(courseIndex, currentLessonIndex, true);
        setViewMode('overview');
    };

    const handleBackToOverview = () => {
        setViewMode('overview');
    };

    if (viewMode === 'quiz') {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={handleBackToOverview}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Course
                </Button>
                <Quiz
                    questions={currentLesson.questions}
                    courseIndex={courseIndex}
                    lessonIndex={currentLessonIndex}
                    onComplete={handleQuizComplete}
                />
            </div>
        );
    }

    if (viewMode === 'lesson') {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={handleBackToOverview}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Course
                </Button>

                <Card className="w-full max-w-4xl mx-auto">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    {currentLesson.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Lesson {currentLessonIndex + 1} of {latestCourse.lessons.length}
                                </p>
                            </div>
                            {currentLesson.completed && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Completed
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                                {currentLesson.content}
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Ready for a quick quiz?</h3>
                                <Badge variant="outline">
                                    {currentLesson.questions.length} questions
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                Test your understanding of this lesson with a short quiz.
                            </p>
                            <Button onClick={handleStartQuiz} className="w-full">
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Start Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Generate New Course
            </Button>

            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <BookOpen className="w-6 h-6" />
                        {latestCourse.title}
                    </CardTitle>
                    <p className="text-muted-foreground">{latestCourse.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{completedLessons}/{latestCourse.lessons.length} lessons completed</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {progressPercentage === 100 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-green-800">Congratulations!</h3>
                            <p className="text-green-700 text-sm">You've completed this micro course!</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Lessons</h3>
                        <div className="grid gap-4">
                            {latestCourse.lessons.map((lesson, index) => (
                                <Card key={index} className="transition-all hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${lesson.completed
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {lesson.completed ? (
                                                            <CheckCircle className="w-4 h-4" />
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{lesson.title}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {lesson.questions.length} quiz questions
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleStartLesson(index)}
                                                variant={lesson.completed ? "outline" : "default"}
                                                size="sm"
                                            >
                                                {lesson.completed ? 'Review' : 'Start'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

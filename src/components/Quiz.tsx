import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useStore } from '../store';

interface Question {
    question: string;
    options: string[];
    correct: number;
    userAnswer: number | null;
}

interface QuizProps {
    questions: Question[];
    courseIndex: number;
    lessonIndex: number;
    onComplete: () => void;
}

export function Quiz({ questions, courseIndex, lessonIndex, onComplete }: QuizProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const { updateQuizAnswer } = useStore();

    const question = questions[currentQuestion];

    const handleAnswerSelect = (answerIndex: number) => {
        if (showResult) return;
        setSelectedAnswer(answerIndex);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;

        updateQuizAnswer(courseIndex, lessonIndex, currentQuestion, selectedAnswer);
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleFinishQuiz = () => {
        onComplete();
    };

    const getScore = () => {
        return questions.reduce((score, q) => {
            return score + (q.userAnswer === q.correct ? 1 : 0);
        }, 0);
    };

    const isCorrect = selectedAnswer === question.correct;

    if (quizCompleted) {
        const score = getScore();
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Quiz Complete!
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="text-3xl font-bold text-primary">
                        {score}/{questions.length}
                    </div>
                    <p className="text-lg text-muted-foreground">
                        You scored {percentage}%
                    </p>
                    <div className="space-y-2">
                        {percentage >= 80 && (
                            <p className="text-green-600 font-medium">Excellent work! 🎉</p>
                        )}
                        {percentage >= 60 && percentage < 80 && (
                            <p className="text-orange-600 font-medium">Good job! Keep learning! 👍</p>
                        )}
                        {percentage < 60 && (
                            <p className="text-red-600 font-medium">Keep practicing! You'll get there! 💪</p>
                        )}
                    </div>
                    <Button onClick={handleFinishQuiz} className="w-full">
                        Continue Learning
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        Quiz Question
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                        {currentQuestion + 1} of {questions.length}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">{question.question}</h3>

                    <div className="space-y-2">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={showResult}
                                className={`w-full p-4 text-left rounded-lg border transition-all ${selectedAnswer === index
                                    ? showResult
                                        ? index === question.correct
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-primary bg-primary/5'
                                    : showResult && index === question.correct
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full border text-sm font-medium">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span>{option}</span>
                                    {showResult && (
                                        <div className="ml-auto">
                                            {index === question.correct ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : selectedAnswer === index ? (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {showResult && (
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                        <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                        </p>
                        {!isCorrect && (
                            <p className="text-sm text-muted-foreground mt-1">
                                The correct answer is: {question.options[question.correct]}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex gap-3">
                    {!showResult ? (
                        <Button
                            onClick={handleSubmitAnswer}
                            disabled={selectedAnswer === null}
                            className="flex-1"
                        >
                            Submit Answer
                        </Button>
                    ) : (
                        <Button onClick={handleNextQuestion} className="flex-1">
                            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

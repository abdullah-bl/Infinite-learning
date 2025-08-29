import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Sparkles } from 'lucide-react';
import { useStore } from '../store';

interface TopicInputProps {
    onGenerateCourse: (topic: string) => void;
}

export function TopicInput({ onGenerateCourse }: TopicInputProps) {
    const [inputTopic, setInputTopic] = useState('');
    const { isGenerating } = useStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputTopic.trim() && !isGenerating) {
            onGenerateCourse(inputTopic.trim());
        }
    };

    const exampleTopics = [
        'JavaScript Promises',
        'Machine Learning Basics',
        'React Hooks',
        'Photography Fundamentals',
        'Financial Planning',
        'Mindfulness & Meditation'
    ];

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <BookOpen className="w-6 h-6" />
                    Infinite Learning
                </CardTitle>
                <CardDescription>
                    Generate a personalized micro-course on any topic you're curious about
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">What would you like to learn today?</Label>
                        <Input
                            id="topic"
                            type="text"
                            placeholder="e.g., JavaScript Promises, Photography Basics, Quantum Physics..."
                            value={inputTopic}
                            onChange={(e) => setInputTopic(e.target.value)}
                            className="text-base"
                            disabled={isGenerating}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!inputTopic.trim() || isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                Generating your course...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Micro Course
                            </>
                        )}
                    </Button>
                </form>

                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center">
                        Or try one of these popular topics:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {exampleTopics.map((topic) => (
                            <Button
                                key={topic}
                                variant="outline"
                                size="sm"
                                onClick={() => setInputTopic(topic)}
                                disabled={isGenerating}
                                className="text-xs"
                            >
                                {topic}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

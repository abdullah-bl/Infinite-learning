import { create } from "zustand";

interface InfiniteLearning {
    topic: string;
    courses: {
        title: string;
        description: string;
        progress: number;
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
        score: number;
    }[];
}

interface Store extends InfiniteLearning {
    setTopic: (topic: string) => void;
    setCourses: (courses: InfiniteLearning["courses"]) => void;
    addCourse: (course: InfiniteLearning["courses"][number]) => void;
    updateLessonProgress: (courseIndex: number, lessonIndex: number, completed: boolean) => void;
    updateQuizAnswer: (courseIndex: number, lessonIndex: number, questionIndex: number, answer: number) => void;
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;
}

export const useStore = create<Store>((set) => ({
    topic: "",
    courses: [],
    isGenerating: false,
    setTopic: (topic: string) => set({ topic }),
    setCourses: (courses: InfiniteLearning["courses"]) => set({ courses }),
    addCourse: (course: InfiniteLearning["courses"][number]) =>
        set((state) => ({ courses: [...state.courses, course] })),
    setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
    updateLessonProgress: (courseIndex: number, lessonIndex: number, completed: boolean) =>
        set((state) => {
            const newCourses = [...state.courses];
            if (newCourses[courseIndex]?.lessons[lessonIndex]) {
                newCourses[courseIndex].lessons[lessonIndex].completed = completed;
            }
            return { courses: newCourses };
        }),
    updateQuizAnswer: (courseIndex: number, lessonIndex: number, questionIndex: number, answer: number) =>
        set((state) => {
            const newCourses = [...state.courses];
            if (newCourses[courseIndex]?.lessons[lessonIndex]?.questions[questionIndex]) {
                newCourses[courseIndex].lessons[lessonIndex].questions[questionIndex].userAnswer = answer;
            }
            return { courses: newCourses };
        }),
}));
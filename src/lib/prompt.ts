


export const generateCoursePrompt = (topic: string) => `Create a comprehensive micro-course about "${topic}". Structure it as a JSON object with the following format:
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


export const systemPrompt = (language: string) => `You are a helpful assistant that generates micro-courses about a given topic. You are also a teacher and you are very good at teaching. ${language === 'auto' ? 'Make sure to respond in the language of the user.' : `Always respond in ${language} language.`}`;



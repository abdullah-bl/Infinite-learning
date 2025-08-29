# 🚀 Infinite Learning

An AI-powered personalized learning platform that generates interactive micro-courses on any topic you're curious about. Built with React, TypeScript, and powered by local AI models running directly in your browser.

![Infinite Learning](./public/iinfinite-learning.png)

## ✨ Features

- **🤖 AI-Powered Course Generation**: Uses WebLLM (Qwen3-0.6B model) to generate comprehensive courses on any topic
- **📚 Interactive Learning**: Each course includes multiple lessons with detailed content and quizzes
- **💾 Local Storage**: All courses are saved locally - no data leaves your browser
- **🎯 Progress Tracking**: Track your learning progress across multiple courses
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **⚡ Fast & Offline**: AI model runs locally in your browser using WebGPU

## 🎯 How It Works

1. **Enter a Topic**: Type in anything you want to learn about
2. **AI Generation**: The local AI model creates a structured course with lessons and quizzes
3. **Interactive Learning**: Work through lessons at your own pace
4. **Test Knowledge**: Take quizzes to reinforce your learning
5. **Track Progress**: See your completion status and scores

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + Radix UI components
- **AI Model**: WebLLM with Qwen3-0.6B (runs locally)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Modern browser with WebGPU support (Chrome/Edge 113+, Firefox with experimental features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/infinite-learning.git
cd infinite-learning
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using bun (recommended)
bun install
```

3. Start the development server:
```bash
# Using npm
npm run dev

# Using bun
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
# Using npm
npm run build

# Using bun
bun run build
```

## 🔧 Configuration

The application uses the Qwen3-0.6B model by default. You can modify the model in `src/components/CourseGenerator.tsx`:

```typescript
engineRef.current = await CreateWebWorkerMLCEngine(
    new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' }),
    'Qwen3-0.6B-q4f32_1-MLC' // Change this to use a different model
);
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (buttons, cards, etc.)
│   ├── CourseContent.tsx    # Main course viewing interface
│   ├── CourseGenerator.tsx  # AI course generation logic
│   ├── Quiz.tsx            # Interactive quiz component
│   └── TopicInput.tsx      # Topic input form
├── lib/
│   └── utils.ts        # Utility functions
├── store.ts            # Zustand state management
├── worker.ts           # Web Worker for AI model
└── App.tsx             # Main application component
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WebLLM](https://github.com/mlc-ai/web-llm) for enabling local AI models in the browser
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

---

**Happy Learning! 🎓**

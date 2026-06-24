# 📖 Storytime Buddy - AI-Powered Interactive Story App

A magical, interactive storytelling application for curious kids featuring an animated AI robot companion (Pip) that tells enchanting stories using text-to-speech technology, complete with interactive quizzes and delightful animations.

![Storytime Buddy](https://img.shields.io/badge/React-19.2.0-blue) ![TanStack Start](https://img.shields.io/badge/TanStack%20Start-1.167.50-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Vite](https://img.shields.io/badge/Vite-8.0.16-green)

## ✨ Features

### 🎭 Interactive Robot Companion
- **Pip the Robot**: An animated, roaming AI character that guides children through the storytelling experience
- Dynamic movement across the screen with collision avoidance
- Mood-based animations (idle, speaking, happy, sad)

### 🔊 Text-to-Speech Storytelling
- Professional female voice narration (with fallback options)
- Customizable speech rate and pitch for optimal kid-friendly listening
- Automatic voice selection from system's available voices
- Smooth playback with loading and error states

### 🎮 Interactive Quiz
- Post-story comprehension quiz to reinforce learning
- Multiple-choice questions with instant feedback
- Celebratory confetti animations on correct answers
- Engaging UI with visual feedback

### 🎨 Rich Visual Experience
- Beautiful cloud animations scrolling across the screen
- Particle effects (confetti) for celebration moments
- Responsive design optimized for all screen sizes
- Smooth animations and transitions using Tailwind CSS

### 🎵 Background Music
- Toggle-able ambient music to enhance storytelling atmosphere
- Seamless integration with story narration

### 🌐 Full-Stack Architecture
- Server-side rendering (SSR) with TanStack Start
- Client-side interactivity with React 19
- Type-safe with TypeScript throughout
- Built on Vite for ultra-fast development

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **npm**, **yarn**, or **bun** package manager

### Installation

1. **Clone or extract the project**
   ```bash
   cd storytime_buddy-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or if you have bun installed:
   bun install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## 📂 Project Structure

```
storytime_buddy-main/
├── src/
│   ├── components/
│   │   ├── Robot.tsx              # Main Pip robot component
│   │   └── ui/                    # Radix UI component library
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── accordion.tsx
│   │       └── ... (40+ UI components)
│   ├── routes/
│   │   ├── __root.tsx             # Root layout
│   │   ├── index.tsx              # Main story page
│   │   └── README.md
│   ├── hooks/
│   │   ├── useRoaming.ts          # Robot movement logic
│   │   ├── useHumming.ts          # Music control hook
│   │   └── use-mobile.tsx         # Mobile detection
│   ├── lib/
│   │   ├── utils.ts               # Utility functions
│   │   ├── error-page.ts          # Error handling
│   │   └── lovable-error-reporting.ts
│   ├── data/
│   │   └── story.ts               # Story content and quiz data
│   ├── router.tsx                 # TanStack Router setup
│   ├── server.ts                  # Server middleware
│   ├── start.ts                   # Application entry
│   └── styles.css                 # Global styles
├── public/                         # Static assets
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── components.json                # shadcn/ui components config
├── eslint.config.js              # ESLint rules
└── bunfig.toml                    # Bun configuration
```

## 🎯 Core Components

### Index Page (src/routes/index.tsx)
The main page component featuring:
- Story narration with TTS
- Quiz interaction
- Robot animation management
- Cloud background animations
- Confetti celebration effects

**Key Features:**
- Manages TTS state (idle, loading, speaking, completed, error)
- Handles mood state for robot animation
- Implements quiz logic with answer validation
- Uses Speech Synthesis API for narration

### Robot Component (src/components/Robot.tsx)
Animated robot character with:
- Dynamic positioning
- Mood-based visual states
- Smooth animations and transitions

### Custom Hooks

#### useRoaming (src/hooks/useRoaming.ts)
Handles robot movement logic:
- Random position generation within bounds
- Collision avoidance with UI elements
- Configurable movement intervals
- Pause functionality during interactions

#### useHumming (src/hooks/useHumming.ts)
Manages background music:
- Play/pause control
- State persistence
- Audio element management

## 🛠️ Technologies Used

### Frontend Framework
- **React 19.2.0** - UI component library
- **TanStack React Router 1.168.25** - Routing and navigation
- **TanStack React Query 5.83.0** - Server state management
- **TanStack React Start 1.167.50** - Full-stack framework

### Styling & UI
- **Tailwind CSS 4.2.1** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **clsx & tailwind-merge** - CSS utility helpers

### Build & Development
- **Vite 8.0.16** - Lightning-fast build tool
- **TypeScript 5.8.3** - Type safety
- **Nitro 3.0.260603-beta** - Server runtime

### Interactive Features
- **Web Speech API** - Text-to-speech narration
- **canvas-confetti** - Particle effects
- **react-hook-form** - Form handling
- **Zod** - Schema validation

### Accessibility & Quality
- **ESLint 9.32.0** - Code linting
- **Prettier 3.7.3** - Code formatting
- **TypeScript ESLint** - Type-aware linting

## 🎨 Customization

### Changing the Story
Edit `src/data/story.ts`:
```typescript
export const STORY_TEXT = "Your custom story here...";

export const QUIZ: QuizQuestion[] = [
  {
    question: "Your question?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    answer: "Correct Option",
  },
];
```

### Adjusting Robot Behavior
In `src/routes/index.tsx`, modify the `useRoaming` configuration:
```typescript
robotRef = useRoaming({
  bounds: stageRef,
  avoid: cardRef,
  size: { w: 160, h: 180 },
  intervalMs: 3000,        // Change movement interval
  paused: mood === "happy" || mood === "sad",
});
```

### Customizing Voice Settings
In `src/routes/index.tsx`, adjust speech synthesis parameters:
```typescript
u.pitch = 1.35;      // Voice pitch (0.1 - 2.0)
u.rate = 0.95;       // Speaking speed (0.1 - 10)
u.volume = 1;        // Volume (0 - 1)
```

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run build:dev` | Build with development mode enabled |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |

## 🌐 Environment Setup

### Development Server
- **Default Port**: 5173
- **Host**: localhost
- **Auto-reload**: Enabled
- **Type Checking**: Enabled

### Production Build
- **Output**: `dist/` directory
- **Optimized**: Tree-shaking, minification, code splitting
- **Target**: Modern browsers (ES2020+)

## 🔌 API Integration Ready

The project is built with TanStack Query, making it easy to:
- Fetch dynamic stories from a backend API
- Store quiz results
- Implement user authentication
- Track learning progress

Example integration point in `src/routes/index.tsx`:
```typescript
const queryClient = new QueryClient();
// Add API queries here
```

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Voice narration for story content
- High contrast UI components
- Mobile responsive design

## 🐛 Error Handling

- Server-side error middleware in `src/start.ts`
- Graceful fallbacks for browser API limitations
- Voice synthesis error states
- Network error boundaries

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with Web Speech API support

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop the 'dist' folder
```

### Deploy to Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Reporting Bugs

Found a bug? Please open an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

## 💡 Feature Requests

Have an idea? Open an issue with the `enhancement` label including:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

## 📞 Support

For questions and support:
- Check existing issues
- Review the documentation
- Contact the development team

## 🎓 Learning Resources

### About the Technologies
- [React Documentation](https://react.dev)
- [TanStack Router Guide](https://tanstack.com/router/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI Components](https://www.radix-ui.com)

### About the Architecture
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Vite Guide](https://vitejs.dev)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 🎉 Acknowledgments

- Built with [Lovable.dev](https://lovable.dev) design tools
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Animation library [Canvas Confetti](https://confetti.js.org)

---

**Happy storytelling!** 🚀📚✨

Made with ❤️ for curious kids and passionate developers.

# 🚀 Storytime Buddy - Advanced Configuration & API Guide

## 📋 Table of Contents
1. [Environment Variables](#environment-variables)
2. [API Integration Examples](#api-integration-examples)
3. [Advanced Customization](#advanced-customization)
4. [Performance Tuning](#performance-tuning)
5. [Debugging & Monitoring](#debugging--monitoring)

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=5000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_DEBUG_MODE=false

# TTS Configuration
VITE_TTS_PITCH=1.35
VITE_TTS_RATE=0.95
VITE_TTS_VOLUME=1.0

# Development
VITE_LOG_LEVEL=debug
```

---

## 🌐 API Integration Examples

### **1. Fetch Dynamic Stories from Backend**

Create a new file `src/hooks/useStoriesAPI.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';

export interface Story {
  id: string;
  title: string;
  text: string;
  quiz: {
    question: string;
    options: string[];
    answer: string;
  }[];
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
}

export function useStoriesAPI() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`);
      if (!response.ok) throw new Error('Failed to fetch stories');
      return response.json() as Promise<Story[]>;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useStoryByIdAPI(id: string) {
  return useQuery({
    queryKey: ['story', id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}`);
      if (!response.ok) throw new Error('Failed to fetch story');
      return response.json() as Promise<Story>;
    },
    enabled: !!id,
  });
}
```

### **2. Save Quiz Results to Backend**

Create `src/hooks/useSaveQuizResult.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';

export interface QuizResult {
  storyId: string;
  userId: string;
  answers: {
    questionIndex: number;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
  score: number;
  completedAt: Date;
  timeSpent: number; // in seconds
}

export function useSaveQuizResult() {
  return useMutation({
    mutationFn: async (result: QuizResult) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quiz-results`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        }
      );
      if (!response.ok) throw new Error('Failed to save quiz result');
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Quiz result saved:', data);
    },
    onError: (error) => {
      console.error('Failed to save quiz result:', error);
    },
  });
}
```

### **3. User Authentication**

Create `src/hooks/useAuth.ts`:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`);
      if (!response.ok) throw new Error('Not authenticated');
      return response.json() as Promise<User>;
    },
    retry: false,
  });
}

export function useLogin() {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        }
      );
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
    onSuccess: () => {
      navigate({ to: '/' });
    },
  });
}
```

---

## 🎨 Advanced Customization

### **1. Custom Voice Configuration**

Create `src/lib/tts-config.ts`:

```typescript
export interface TTSConfig {
  pitch: number;
  rate: number;
  volume: number;
  voicePreference: 'female' | 'male' | 'neutral';
  language: string;
}

export const TTS_PRESETS = {
  kids_friendly: {
    pitch: 1.35,
    rate: 0.95,
    volume: 1.0,
    voicePreference: 'female' as const,
    language: 'en-US',
  },
  natural: {
    pitch: 1.0,
    rate: 1.0,
    volume: 0.9,
    voicePreference: 'neutral' as const,
    language: 'en-US',
  },
  slow_clear: {
    pitch: 1.1,
    rate: 0.8,
    volume: 1.0,
    voicePreference: 'female' as const,
    language: 'en-US',
  },
};

export function applyTTSConfig(utterance: SpeechSynthesisUtterance, config: TTSConfig) {
  utterance.pitch = config.pitch;
  utterance.rate = config.rate;
  utterance.volume = config.volume;
  utterance.lang = config.language;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find((v) =>
    config.voicePreference === 'female'
      ? /female|samantha|victoria/i.test(v.name)
      : /male|david/i.test(v.name)
  );

  if (preferredVoice) utterance.voice = preferredVoice;
}
```

### **2. Theme Configuration**

Create `src/lib/theme-config.ts`:

```typescript
export type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset';

export const THEMES = {
  light: {
    primary: '#B856D6',
    secondary: '#9965D8',
    background: 'from-pink-200 to-yellow-100',
    text: '#1E3A8A',
  },
  dark: {
    primary: '#7E22CE',
    secondary: '#5B21B6',
    background: 'from-gray-900 to-gray-800',
    text: '#F3F4F6',
  },
  ocean: {
    primary: '#0369A1',
    secondary: '#06B6D4',
    background: 'from-blue-400 to-cyan-300',
    text: '#0C2340',
  },
  forest: {
    primary: '#15803D',
    secondary: '#22C55E',
    background: 'from-green-300 to-emerald-200',
    text: '#15450F',
  },
  sunset: {
    primary: '#EA580C',
    secondary: '#F97316',
    background: 'from-orange-300 to-pink-300',
    text: '#3F2305',
  },
};

export function getThemeClasses(theme: Theme) {
  const themeConfig = THEMES[theme];
  return {
    bgGradient: `bg-gradient-to-br ${themeConfig.background}`,
    primary: themeConfig.primary,
    secondary: themeConfig.secondary,
    text: themeConfig.text,
  };
}
```

### **3. Analytics Integration**

Create `src/lib/analytics.ts`:

```typescript
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

class Analytics {
  private isEnabled: boolean;

  constructor(enabled: boolean = true) {
    this.isEnabled = enabled;
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const payload = {
      ...event,
      timestamp: event.timestamp || new Date(),
      sessionId: this.getSessionId(),
    };

    // Send to your analytics service
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${import.meta.env.VITE_API_URL}/api/analytics`,
        JSON.stringify(payload)
      );
    }
  }

  trackStoryRead(storyId: string, duration: number) {
    this.track({
      name: 'story_read',
      properties: { storyId, duration },
    });
  }

  trackQuizCompleted(storyId: string, score: number, correct: number, total: number) {
    this.track({
      name: 'quiz_completed',
      properties: { storyId, score, correct, total },
    });
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
}

export const analytics = new Analytics(import.meta.env.VITE_ENABLE_ANALYTICS === 'true');
```

---

## ⚡ Performance Tuning

### **1. Code Splitting Strategy**

```typescript
// src/router.tsx - Dynamic imports for routes
import { lazy, Suspense } from 'react';

export const StoryRoute = lazy(() => import('./routes/story'));
export const QuizRoute = lazy(() => import('./routes/quiz'));

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StoryRoute />
    </Suspense>
  );
}
```

### **2. Image Optimization**

```typescript
// Use responsive images
export function OptimizedImage({ src, alt }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      srcSet={`${src}?w=300 300w, ${src}?w=600 600w, ${src}?w=1200 1200w`}
      sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 1200px"
    />
  );
}
```

### **3. React Query Cache Strategy**

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes (garbage collection)
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

---

## 🐛 Debugging & Monitoring

### **1. Error Tracking Setup**

```typescript
// src/lib/error-tracking.ts
export function setupErrorTracking() {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Send to error tracking service
    fetch(`${import.meta.env.VITE_API_URL}/api/errors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: event.error?.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
  });
}
```

### **2. Performance Monitoring**

```typescript
// src/lib/performance-monitor.ts
export function measurePageLoad() {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.log('Page Load Metrics:');
    console.log('DNS Lookup:', navigation.domainLookupEnd - navigation.domainLookupStart);
    console.log('TCP Connection:', navigation.connectEnd - navigation.connectStart);
    console.log('Server Response:', navigation.responseEnd - navigation.requestStart);
    console.log('DOM Processing:', navigation.domComplete - navigation.domLoading);
    console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart);
  });
}
```

### **3. Dev Tools Setup**

Enable React DevTools profiling:

```typescript
// src/main.tsx
if (import.meta.env.DEV) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.setShowStaleDependencies(true);
}
```

---

## 📊 API Endpoint Specifications

### **Stories API**

```
GET /api/stories
  Returns: Story[]
  Query params: ?limit=10&offset=0&difficulty=easy

GET /api/stories/:id
  Returns: Story

POST /api/stories
  Requires: Auth
  Body: { title, text, quiz, difficulty, ageGroup }
```

### **Quiz Results API**

```
POST /api/quiz-results
  Body: { storyId, userId, answers, score, completedAt, timeSpent }
  Returns: { id, ...result }

GET /api/quiz-results/:id
  Returns: QuizResult

GET /api/quiz-results/user/:userId
  Returns: QuizResult[]
```

### **Analytics API**

```
POST /api/analytics
  Body: { name, properties, timestamp, sessionId }
  No return
```

---

## 🔐 Security Best Practices

1. **Validate all inputs** with Zod schemas
2. **Use HTTPS** in production
3. **Implement CORS** properly
4. **Sanitize API responses**
5. **Store sensitive data** securely
6. **Implement rate limiting**
7. **Use JWT tokens** for auth
8. **Keep dependencies updated**: `npm audit fix`

---

## 📦 Production Build Checklist

- [ ] Run `npm run lint` (0 warnings)
- [ ] Run `npm run build` successfully
- [ ] Test production build locally: `npm run preview`
- [ ] Update `.env.production`
- [ ] Configure CDN if needed
- [ ] Set up monitoring/analytics
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify SEO meta tags
- [ ] Check lighthouse scores
- [ ] Deploy and monitor errors

---

## 🚀 Next Steps for Enhancement

1. **User Accounts**: Add authentication system
2. **Multiple Stories**: Create story library with database
3. **Progress Tracking**: Track user progress and statistics
4. **Achievements**: Add badge/achievement system
5. **Multiplayer**: Add live collaboration features
6. **Localization**: Support multiple languages
7. **Offline Support**: Add service workers for PWA
8. **Mobile App**: Build native mobile version with React Native

---

**Happy coding!** 🎉

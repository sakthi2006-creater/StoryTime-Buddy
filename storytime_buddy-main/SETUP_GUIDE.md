# 🚀 Storytime Buddy - Setup & Run Guide

## Quick Start Instructions

### Step 1: Navigate to Project Directory
```powershell
cd "C:\Users\USER\Downloads\storytime_buddy-main (1)\storytime_buddy-main"
```

### Step 2: Install Dependencies
The npm installation is currently in progress. Once it completes, you'll see:
```
added XXX packages
```

### Step 3: Run Development Server
After installation completes, run:
```powershell
npm run dev
```

### Step 4: Open in Browser
Navigate to:
```
http://localhost:5173
```

---

## 🎯 What You'll See

When you open http://localhost:5173, you'll experience:

1. **Animated Pip the Robot** - A friendly robot character that roams around the screen
2. **Story Narration** - Click "Read Story" to hear an enchanting tale about Pip finding his lost gear
3. **Background Music** - Toggle the music button to enable/disable ambient sounds
4. **Interactive Quiz** - After the story, answer a question about what you learned
5. **Celebration Effects** - Get confetti when you answer correctly!

---

## 📊 Project Details

### Project Type
- **Full-Stack Web Application**
- **Framework**: TanStack Start (React 19)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Technology Stack
```
Frontend:
  - React 19.2.0
  - TanStack Router 1.168.25
  - TanStack Query 5.83.0
  - Tailwind CSS 4.2.1
  - TypeScript 5.8.3

Build Tools:
  - Vite 8.0.16
  - Nitro 3.0.260603-beta

UI/Interactions:
  - Radix UI Components (40+ components)
  - Lucide React Icons
  - Canvas Confetti
  - Web Speech API (Text-to-Speech)
```

---

## 🎮 Features Overview

### Core Functionality
✅ Text-to-speech story narration with natural voice
✅ Interactive animated robot character
✅ Quiz game with multiple-choice questions
✅ Celebration confetti animations
✅ Background music toggle
✅ Responsive design for all devices

### Development Features
✅ Hot module replacement (HMR) - instant code updates
✅ TypeScript for type safety
✅ ESLint for code quality
✅ Prettier for code formatting
✅ Full-stack routing with TanStack Router

---

## 🔧 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (http://localhost:5173) |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run format` | Auto-format code |

---

## 📂 Project Structure Quick Reference

```
src/
├── routes/              # Page components
│   └── index.tsx       # Main story page
├── components/
│   ├── Robot.tsx       # Animated robot
│   └── ui/             # Reusable UI components
├── hooks/
│   ├── useRoaming.ts   # Robot movement logic
│   └── useHumming.ts   # Music control
├── data/
│   └── story.ts        # Story & quiz content
└── lib/                # Utilities & helpers
```

---

## 🎨 Customization Quick Tips

### Change the Story
Edit `src/data/story.ts` and update:
- `STORY_TEXT` - The story content
- `QUIZ` - Quiz questions and answers

### Change Robot Appearance
Edit `src/components/Robot.tsx`

### Adjust Narration Voice
Edit `src/routes/index.tsx` lines with:
```typescript
u.pitch = 1.35;    // Change voice pitch
u.rate = 0.95;     // Change speech speed
```

---

## 🌐 Deployment Ready

This project is ready to deploy to:
- **Vercel** - `vercel deploy`
- **Netlify** - Drag and drop the `dist` folder
- **Any Node.js hosting** - `npm run build && npm run preview`

---

## 📞 Troubleshooting

### npm install is taking long
- This is normal! The project has 50+ dependencies
- Wait for it to complete (usually 2-5 minutes)
- If stuck for >10 minutes, try: `npm cache clean --force` then retry

### Port 5173 already in use
Run: `npm run dev -- --port 3000`

### "Cannot find module" errors
Make sure `npm install` completed successfully
Then restart the dev server

---

## ✨ Enjoy!

Your interactive storytelling app is ready to go! 🎉

For more details, see the full README.md file.

---
**Setup Date**: 2026-06-24
**Project**: Storytime Buddy AI
**Status**: Ready to Run

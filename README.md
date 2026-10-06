# Werd — Quran & Adhkar Tracker

A modern web application designed to help users build a consistent daily Quran reading and Adhkar routine.

Werd provides a simple way to track daily Quran progress, maintain reading streaks, read Quran directly inside the application, and keep track of personal Adhkar and Sebha counts.

## ✨ Features

- 📖 **Quran Reader**
  - Browse and read the Quran directly from the application
  - Full Quran data included locally
  - Easy navigation between Surahs

- 📊 **Daily Werd Tracking**
  - Track daily Quran reading progress
  - Visual progress indicators
  - Daily completion tracking

- 🔥 **Reading Streaks**
  - Track consecutive days of Quran reading
  - Encourage consistency through progress and streak tracking

- 🤲 **Adhkar**
  - Dedicated daily Adhkar section
  - Custom Adhkar
  - Individual counters for repeated Dhikr

- 📿 **Sebha**
  - Digital Tasbih counter
  - Simple and focused interface for Dhikr

- ⚙️ **User Preferences**
  - Persistent user settings
  - Local progress storage
  - Personalized experience

- 📱 **Responsive Design**
  - Designed for desktop and mobile screens
  - Mobile-friendly navigation

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React | Frontend framework |
| TypeScript | Type-safe development |
| Vite | Development environment and build tool |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Supabase | Backend and data services |
| React Router | Application navigation |

## 📂 Project Structure

```text
werd-quran-tracker/
├── public/
│   ├── quran.json
│   └── ...
├── src/
│   ├── components/
│   ├── hooks/
│   ├── integrations/
│   │   └── supabase/
│   ├── lib/
│   ├── pages/
│   │   ├── Adhkar.tsx
│   │   ├── Home.tsx
│   │   ├── QuranViewer.tsx
│   │   ├── Sebha.tsx
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts

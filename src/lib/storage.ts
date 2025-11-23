// Local storage utilities for Werd app

export interface WerdEntry {
  date: string; // YYYY-MM-DD
  pagesRead: number;
  ayatRead?: number;
  completed: boolean;
}

export interface WerdGoal {
  dailyPages: number;
  dailyAyat?: number;
}

export interface AppSettings {
  goal: WerdGoal;
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm format
  lastTasbeehCount: number;
}

const STORAGE_KEYS = {
  WERD_ENTRIES: 'werd_entries',
  SETTINGS: 'werd_settings',
  TASBEEH_COUNT: 'tasbeeh_count',
} as const;

// Werd Entries
export const getWerdEntries = (): WerdEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WERD_ENTRIES);
  return data ? JSON.parse(data) : [];
};

export const saveWerdEntry = (entry: WerdEntry): void => {
  const entries = getWerdEntries();
  const existingIndex = entries.findIndex(e => e.date === entry.date);
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  
  localStorage.setItem(STORAGE_KEYS.WERD_ENTRIES, JSON.stringify(entries));
};

export const getTodayEntry = (): WerdEntry | null => {
  const today = new Date().toISOString().split('T')[0];
  const entries = getWerdEntries();
  return entries.find(e => e.date === today) || null;
};

// Settings
export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    goal: { dailyPages: 2 },
    reminderEnabled: false,
    reminderTime: '09:00',
    lastTasbeehCount: 0,
  };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Tasbeeh Counter
export const getTasbeehCount = (): number => {
  const data = localStorage.getItem(STORAGE_KEYS.TASBEEH_COUNT);
  return data ? parseInt(data) : 0;
};

export const saveTasbeehCount = (count: number): void => {
  localStorage.setItem(STORAGE_KEYS.TASBEEH_COUNT, count.toString());
};

// Calculate streak
export const calculateStreak = (): number => {
  const entries = getWerdEntries().sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < entries.length; i++) {
    const entryDate = new Date(entries[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - streak);
    
    if (entryDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
      if (entries[i].completed) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  
  return streak;
};

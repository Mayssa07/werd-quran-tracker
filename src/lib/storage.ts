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

export interface CustomDhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repetitions?: string;
  category: 'morning' | 'evening' | 'general' | 'personal';
}

export interface TasbeehPhrase {
  id: string;
  arabic: string;
  transliteration: string;
}

const STORAGE_KEYS = {
  WERD_ENTRIES: 'werd_entries',
  SETTINGS: 'werd_settings',
  TASBEEH_COUNT: 'tasbeeh_count',
  CUSTOM_ADHKAR: 'custom_adhkar',
  TASBEEH_PHRASES: 'tasbeeh_phrases',
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

// Custom Adhkar Management
export const getCustomAdhkar = (): CustomDhikr[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_ADHKAR);
  return data ? JSON.parse(data) : [];
};

export const saveCustomDhikr = (dhikr: CustomDhikr): void => {
  const adhkar = getCustomAdhkar();
  const existingIndex = adhkar.findIndex(d => d.id === dhikr.id);
  
  if (existingIndex >= 0) {
    adhkar[existingIndex] = dhikr;
  } else {
    adhkar.push(dhikr);
  }
  
  localStorage.setItem(STORAGE_KEYS.CUSTOM_ADHKAR, JSON.stringify(adhkar));
};

export const deleteCustomDhikr = (id: string): void => {
  const adhkar = getCustomAdhkar().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_ADHKAR, JSON.stringify(adhkar));
};

// Tasbeeh Phrases Management
export const getTasbeehPhrases = (): TasbeehPhrase[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TASBEEH_PHRASES);
  return data ? JSON.parse(data) : [
    { id: '1', arabic: 'سُبْحَانَ اللّهِ', transliteration: 'SubhanAllah' },
    { id: '2', arabic: 'الْحَمْدُ لِلّهِ', transliteration: 'Alhamdulillah' },
    { id: '3', arabic: 'اللّهُ أَكْبَرُ', transliteration: 'Allahu Akbar' },
    { id: '4', arabic: 'لَا إِلَٰهَ إِلَّا اللّٰهُ', transliteration: 'La ilaha illallah' },
    { id: '5', arabic: 'أَسْتَغْفِرُ اللّهَ', transliteration: 'Astaghfirullah' },
  ];
};

export const saveTasbeehPhrase = (phrase: TasbeehPhrase): void => {
  const phrases = getTasbeehPhrases();
  const existingIndex = phrases.findIndex(p => p.id === phrase.id);
  
  if (existingIndex >= 0) {
    phrases[existingIndex] = phrase;
  } else {
    phrases.push(phrase);
  }
  
  localStorage.setItem(STORAGE_KEYS.TASBEEH_PHRASES, JSON.stringify(phrases));
};

export const deleteTasbeehPhrase = (id: string): void => {
  const phrases = getTasbeehPhrases().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASBEEH_PHRASES, JSON.stringify(phrases));
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

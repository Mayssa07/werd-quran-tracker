// Local storage utilities for Werd app

export interface WerdEntry {
  date: string; // YYYY-MM-DD
  pagesRead: number;
  ayatRead?: number;
  completed: boolean;
  fromPage?: number;
  toPage?: number;
}

export interface DhikrCounter {
  dhikrId: string;
  remaining: number;
  total: number;
  lastReset: string;
}

export interface WerdGoal {
  dailyPages: number;
  dailyAyat?: number;
}

export interface WerdRange {
  mode: 'range' | 'surahs';
  // For range mode
  startSurah?: number;
  startAyah?: number;
  endSurah?: number;
  endAyah?: number;
  // For surahs mode (individual surahs)
  selectedSurahs?: number[];
}

export interface AppSettings {
  goal: WerdGoal;
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm format
  lastTasbeehCount: number;
  werdRange?: WerdRange;
  logoCacheBuster: number;
}

export interface CustomDhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repetitions?: string;
  count?: number;
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
  DHIKR_COUNTERS: 'dhikr_counters',
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
    logoCacheBuster: 0,
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
  const entries = getWerdEntries();
  if (entries.length === 0) return 0;

  const sortedEntries = entries
    .filter(e => e.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedEntries.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (sortedEntries[0].date !== today && sortedEntries[0].date !== yesterday) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = currentDate.toISOString().split('T')[0];
    if (entry.date === entryDate) {
      streak++;
      currentDate = new Date(currentDate.getTime() - 86400000);
    } else {
      break;
    }
  }
  
  return streak;
};

// Dhikr Counter Management
export const getDhikrCounters = (): DhikrCounter[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.DHIKR_COUNTERS);
  return stored ? JSON.parse(stored) : [];
};

export const getDhikrCounter = (dhikrId: string): DhikrCounter | null => {
  const counters = getDhikrCounters();
  return counters.find(c => c.dhikrId === dhikrId) || null;
};

export const saveDhikrCounter = (counter: DhikrCounter) => {
  const counters = getDhikrCounters();
  const index = counters.findIndex(c => c.dhikrId === counter.dhikrId);
  
  if (index >= 0) {
    counters[index] = counter;
  } else {
    counters.push(counter);
  }
  
  localStorage.setItem(STORAGE_KEYS.DHIKR_COUNTERS, JSON.stringify(counters));
};

export const resetDhikrCounter = (dhikrId: string, total: number) => {
  const counter: DhikrCounter = {
    dhikrId,
    remaining: total,
    total,
    lastReset: new Date().toISOString(),
  };
  saveDhikrCounter(counter);
};

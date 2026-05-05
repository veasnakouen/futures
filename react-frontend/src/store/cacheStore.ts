import { create } from 'zustand';

interface CacheState {
  cache: Record<string, { data: any; expiry: number }>;
  setCache: (key: string, data: any, ttl?: number) => void;
  getCache: (key: string) => any | null;
  clearCache: (pattern?: string) => void;
}

export const useCacheStore = create<CacheState>((set, get) => ({
  cache: {},
  
  setCache: (key, data, ttl = 300000) => { // Default 5 mins
    const expiry = Date.now() + ttl;
    set((state) => ({
      cache: { ...state.cache, [key]: { data, expiry } }
    }));
  },
  
  getCache: (key) => {
    const entry = get().cache[key];
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      // Lazy delete expired
      const newCache = { ...get().cache };
      delete newCache[key];
      set({ cache: newCache });
      return null;
    }
    return entry.data;
  },
  
  clearCache: (pattern) => {
    if (!pattern) {
      set({ cache: {} });
    } else {
      const newCache = { ...get().cache };
      Object.keys(newCache).forEach((key) => {
        if (key.includes(pattern)) {
          delete newCache[key];
        }
      });
      set({ cache: newCache });
    }
  }
}));

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  // Optional: Save to localStorage for persistence
  saveToLocalStorage(): void {
    const cacheData = Array.from(this.cache.entries());
    localStorage.setItem("movieCache", JSON.stringify(cacheData));
  }

  // Optional: Load from localStorage
  loadFromLocalStorage(): void {
    const stored = localStorage.getItem("movieCache");
    if (stored) {
      try {
        const cacheData = JSON.parse(stored);
        this.cache = new Map(cacheData);
      } catch (error) {
        console.error("Failed to load cache from localStorage:", error);
      }
    }
  }
}

export const movieCache = new Cache();

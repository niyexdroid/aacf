/**
 * Simple in-memory cache implementation
 * For production, consider using Redis or another distributed cache
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get a value from cache
   * @param key Cache key
   * @returns Cached value or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set a value in cache
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in seconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 300): void {
    const expiresAt = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Delete a value from cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
const cache = new MemoryCache();

// Clear expired entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      cache.clearExpired();
    },
    10 * 60 * 1000,
  );
}

export default cache;

/**
 * Higher-order function to cache the result of an async function
 * @param fn Function to cache
 * @param keyGenerator Function to generate cache key from arguments
 * @param ttl Time to live in seconds
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = 300,
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);

    // Try to get from cache
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn(...args);
    cache.set(key, result, ttl);
    return result;
  }) as T;
}

/**
 * Invalidate cache entries by pattern
 * @param pattern String or RegExp pattern to match keys
 */
export function invalidateCache(pattern: string | RegExp): void {
  const regex =
    typeof pattern === "string"
      ? new RegExp(pattern.replace(/\*/g, ".*"))
      : pattern;

  const stats = cache.getStats();
  for (const key of stats.keys) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

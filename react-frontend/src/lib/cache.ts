/**
 * Network-Resilient Cache Utility
 *
 * Provides a localStorage-backed cache for API responses so the app can
 * serve the last-known-good data when the network is down or slow.
 *
 * TTL (Time-To-Live) controls how long cached data is considered fresh.
 * After TTL expires, stale cached data may still be served but the app
 * will attempt to refresh in the background.
 */

const CACHE_VERSION = "v1";
const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const buildKey = (key: string) => `mtp:cache:${CACHE_VERSION}:${key}`;

/**
 * Save data to localStorage cache with a TTL.
 */
export function cacheSet<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl: ttlMs };
    localStorage.setItem(buildKey(key), JSON.stringify(entry));
  } catch {
    // localStorage may be unavailable (private browsing / quota exceeded) — silently ignore
  }
}

/**
 * Retrieve data from localStorage cache.
 * Returns null if not found OR if the TTL has expired.
 * Returns stale data (with isStale=true) if data exists but is past TTL.
 */
export function cacheGet<T>(
  key: string,
  allowStale = false
): { data: T; isStale: boolean } | null {
  try {
    const raw = localStorage.getItem(buildKey(key));
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const isStale = Date.now() - entry.timestamp > entry.ttl;

    if (isStale && !allowStale) return null;
    return { data: entry.data, isStale };
  } catch {
    return null;
  }
}

/**
 * Remove a specific cache entry.
 */
export function cacheDelete(key: string): void {
  try {
    localStorage.removeItem(buildKey(key));
  } catch {
    // ignore
  }
}

/**
 * Clear all MTP cache entries from localStorage.
 */
export function cacheClear(): void {
  try {
    const prefix = buildKey("");
    Object.keys(localStorage)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

/**
 * Higher-order query function that wraps a fetch with localStorage caching.
 *
 * Usage:
 *   queryFn: withCache("hrAssets", () => api.get("/stock/hr/assets?page=1&size=100").then(r => r.data?.data?.content || []))
 */
export async function withCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  options: { ttlMs?: number; fallback?: T } = {}
): Promise<T> {
  const { ttlMs = DEFAULT_TTL_MS, fallback } = options;

  try {
    const result = await fetcher();
    // Only cache if result is meaningful (non-empty array or truthy object)
    const isWorthCaching =
      result !== null &&
      result !== undefined &&
      (Array.isArray(result) ? (result as unknown[]).length > 0 : true);

    if (isWorthCaching) {
      cacheSet(cacheKey, result, ttlMs);
    }
    return result;
  } catch (err) {
    // Network failed — try serving from localStorage cache (allow stale data)
    const cached = cacheGet<T>(cacheKey, true);
    if (cached) {
      if (cached.isStale) {
        console.warn(`[Cache] Serving stale cached data for "${cacheKey}" due to network error.`);
      } else {
        console.info(`[Cache] Serving fresh cached data for "${cacheKey}".`);
      }
      return cached.data;
    }

    // No cache at all — return fallback if provided
    if (fallback !== undefined) {
      console.warn(`[Cache] No cache for "${cacheKey}", using static fallback.`);
      return fallback;
    }

    throw err; // re-throw so React Query marks it as an error
  }
}

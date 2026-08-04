import api from "./api";

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  staleTime: number;
}

class FlyweightApiCache {
  private cache: Map<string, CacheEntry> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private defaultStaleTime: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch data using Flyweight Stale-While-Revalidate (SWR) Caching.
   * Immediately returns cached data in 0ms if present, while revalidating asynchronously.
   */
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    options?: { staleTime?: number; forceRefresh?: boolean }
  ): Promise<T> {
    const key = this.generateKey(url, params);
    const staleTime = options?.staleTime ?? this.defaultStaleTime;
    const now = Date.now();

    const cached = this.cache.get(key);

    // 1. If cached and valid, return immediately
    if (cached && !options?.forceRefresh) {
      const isStale = now - cached.timestamp > staleTime;
      if (isStale) {
        // Asynchronously revalidate in the background
        this.revalidate(key, url, params, staleTime);
      }
      return cached.data;
    }

    // 2. De-duplicate concurrent requests (Request Collapsing)
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // 3. Fetch from API
    const fetchPromise = api
      .get(url, { params })
      .then((res) => {
        const data = res.data;
        this.cache.set(key, { data, timestamp: Date.now(), staleTime });
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((err) => {
        this.pendingRequests.delete(key);
        throw err;
      });

    this.pendingRequests.set(key, fetchPromise);
    return fetchPromise;
  }

  private async revalidate(
    key: string,
    url: string,
    params?: Record<string, any>,
    staleTime?: number
  ) {
    try {
      const res = await api.get(url, { params });
      this.cache.set(key, {
        data: res.data,
        timestamp: Date.now(),
        staleTime: staleTime ?? this.defaultStaleTime,
      });
    } catch (err) {
      console.warn("Background cache revalidation failed", err);
    }
  }
  /**s
   * Invalidate cache entries matching a URL prefix or pattern.
   * Call after POST/PUT/DELETE mutations to maintain data freshness.
   */
  invalidate(urlPrefix: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(urlPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  private generateKey(url: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) return url;
    return `${url}?${new URLSearchParams(params).toString()}`;
  }
}

export const apiCache = new FlyweightApiCache();
export default apiCache;

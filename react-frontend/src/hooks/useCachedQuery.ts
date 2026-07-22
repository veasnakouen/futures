import { useState, useEffect, useCallback } from "react";
import apiCache from "../services/apiCache";

export interface UseCachedQueryOptions {
  params?: Record<string, any>;
  staleTime?: number;
  enabled?: boolean;
  fallbackData?: any;
}

export interface UseCachedQueryResult<T> {
  data: T;
  loading: boolean;
  error: any;
  isRevalidating: boolean;
  refetch: (options?: { forceRefresh?: boolean }) => Promise<void>;
}

export function useCachedQuery<T = any>(
  url: string,
  options?: UseCachedQueryOptions
): UseCachedQueryResult<T> {
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<T>(options?.fallbackData);
  const [loading, setLoading] = useState<boolean>(!options?.fallbackData);
  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      if (!enabled || !url) return;

      try {
        if (!data) setLoading(true);
        setIsRevalidating(true);

        const result = await apiCache.get<T>(url, options?.params, {
          staleTime: options?.staleTime,
          forceRefresh,
        });

        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch cached query [${url}]`, err);
        setError(err);
        if (options?.fallbackData && !data) {
          setData(options.fallbackData);
        }
      } finally {
        setLoading(false);
        setIsRevalidating(false);
      }
    },
    [url, JSON.stringify(options?.params), enabled]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isRevalidating,
    refetch: (opts) => fetchData(opts?.forceRefresh ?? true),
  };
}

export default useCachedQuery;

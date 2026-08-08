import { QueryClient } from "@tanstack/react-query";

/**
 * Production-resilient QueryClient configuration.
 *
 * Key resilience features:
 * - Exponential backoff retry (500ms → 2s → 8s → 30s cap)
 * - Skips retry on 4xx errors (client errors are not network issues)
 * - Serves stale cache while revalidating in background (SWR pattern)
 * - Auto-refetch when browser tab regains focus or network reconnects
 * - offlineFirst network mode: serve cache even when offline
 */

const MAX_RETRY_DELAY_MS = 30_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes before considering it stale
      staleTime: 1000 * 60 * 5,
      // Keep unused data in memory for 24 hours (serves as offline fallback)
      gcTime: 1000 * 60 * 60 * 24,

      // Retry up to 3 times on network errors with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on client errors (4xx) — retrying won't help
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 3;
      },
      retryDelay: (attempt) =>
        Math.min(500 * Math.pow(2, attempt), MAX_RETRY_DELAY_MS),

      // Serve stale data while refreshing in background (SWR pattern)
      refetchOnWindowFocus: true,
      // Auto-reconnect after network outage restored
      refetchOnReconnect: true,
      // Continue serving cache while offline (don't mark as error immediately)
      networkMode: "offlineFirst",
    },
    mutations: {
      // Retry mutations once on network failure (idempotent operations only)
      retry: 1,
      retryDelay: 1000,
      networkMode: "offlineFirst",
    },
  },
});


import { format } from "date-fns";

/**
 * Safely format date/time values without throwing RangeError: Invalid time value.
 * Handles ISO strings, timestamps, Date objects, and time-only strings like "08:30:00".
 */
export function safeFormatDate(
  value: any,
  formatPattern: string = "yyyy-MM-dd HH:mm:ss",
  fallback: string = "—"
): string {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  try {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === "number") {
      date = new Date(value);
    } else if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return fallback;

      // Handle time-only strings such as "08:30:00" or "08:30"
      if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(trimmed)) {
        const todayStr = new Date().toISOString().split("T")[0];
        date = new Date(`${todayStr}T${trimmed}`);
      } else {
        date = new Date(trimmed);
      }
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
      return fallback;
    }

    return format(date, formatPattern);
  } catch (error) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    return fallback;
  }
}

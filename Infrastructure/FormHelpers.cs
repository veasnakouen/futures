using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.AspNetCore.Http;

namespace MtpApp.Infrastructure
{
    public static class FormHelpers
    {
        private static readonly string[] DateFormats = { "MM/dd/yyyy", "yyyy-MM-dd", "dd/MM/yyyy", "M/d/yyyy" };

        public static DateTime? ParseDate(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            if (DateTime.TryParseExact(value, DateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result))
                return result;

            return null;
        }

        public static bool ParseBool(string value, bool defaultValue = false)
        {
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            return bool.TryParse(value, out var result) ? result : defaultValue;
        }

        public static string GetFormValue(IFormCollection form, string key)
        {
            return form.TryGetValue(key, out var value) ? value.ToString() : null;
        }

        public static string ValidateDateString(IFormCollection form, string key, out DateTime? parsedDate)
        {
            parsedDate = null;
            var raw = GetFormValue(form, key);
            if (string.IsNullOrWhiteSpace(raw))
                return null; // not required

            parsedDate = ParseDate(raw);
            if (parsedDate == null)
                return $"Invalid date format for '{key}'. Expected format: MM/dd/yyyy.";

            return null;
        }
    }
}

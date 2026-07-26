package com.mtp.api.util;

import java.util.Set;

/**
 * Security Utility for Whitelisting & Sanitizing Sort Fields in REST Queries.
 * Prevents PropertyReferenceException and internal database schema leakage.
 */
public class SortUtils {

    private SortUtils() {
        // Utility class constructor
    }

    /**
     * Sanitizes requested sort field against allowed property names.
     *
     * @param requestedField Field requested by the REST client
     * @param allowedFields Set of whitelisted entity properties
     * @param defaultField Fallback property if requested field is invalid or not allowed
     * @return Safe property string for Spring Data sorting
     */
    public static String sanitizeSortField(String requestedField, Set<String> allowedFields, String defaultField) {
        if (requestedField == null || requestedField.trim().isEmpty()) {
            return defaultField;
        }

        String field = requestedField.trim();
        if (allowedFields != null && allowedFields.contains(field)) {
            return field;
        }

        return defaultField;
    }
}

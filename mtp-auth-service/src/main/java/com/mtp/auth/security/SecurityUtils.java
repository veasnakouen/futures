package com.mtp.auth.security;

import org.springframework.web.util.HtmlUtils;

public class SecurityUtils {

    /**
     * Sanitizes input strings to prevent XSS by escaping HTML special characters.
     */
    public static String sanitize(String input) {
        if (input == null) {
            return null;
        }
        // Basic HTML escaping
        return HtmlUtils.htmlEscape(input);
    }
}

package com.mtp.api.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // --- Standardized error shape ---
    private Map<String, Object> body(int status, String error, String message, String path) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status);
        body.put("error", error);
        body.put("message", message);
        body.put("path", path);
        return body;
    }

    // 400 — Bean Validation failures (@Valid on DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("Validation failed [{}]: {}", req.getRequestURI(), details);
        return ResponseEntity.badRequest().body(
                body(400, "Validation Failed", details, req.getRequestURI()));
    }

    // 401 — Wrong login credentials
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {
        log.warn("Bad credentials attempt on [{}]", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                body(401, "Unauthorized", "Invalid username or password", req.getRequestURI()));
    }

    // 403 — User is authenticated but lacks permission
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        log.warn("Access denied to [{}]", req.getRequestURI());
        
        // If the user is not authenticated, this should really be a 401
        if (org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() == null ||
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() instanceof org.springframework.security.authentication.AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                body(401, "Unauthorized", "Authentication required or token expired", req.getRequestURI()));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                body(403, "Forbidden", "You do not have permission to access this resource", req.getRequestURI()));
    }

    // 404 — Resource not found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        log.warn("Not found [{}]: {}", req.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                body(404, "Not Found", ex.getMessage(), req.getRequestURI()));
    }

    // 429 — Rate limit exceeded (thrown manually by RateLimitFilter)
    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<?> handleRateLimit(RateLimitExceededException ex, HttpServletRequest req) {
        log.warn("Rate limit exceeded for IP [{}] on [{}]", req.getRemoteAddr(), req.getRequestURI());
        return ResponseEntity.status(429).body(
                body(429, "Too Many Requests", "Rate limit exceeded. Please slow down.", req.getRequestURI()));
    }

    // 409 — Database Integrity Violation (e.g. Duplicate Key)
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException ex, HttpServletRequest req) {
        log.error("Database integrity violation on [{}]: {}", req.getRequestURI(), ex.getMessage());
        String message = "Database constraint violation. Please ensure ID number is unique and all required fields are provided.";
        if (ex.getMessage() != null && ex.getMessage().contains("duplicate")) {
            message = "An employee with this ID number already exists in the system.";
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                body(409, "Conflict", message, req.getRequestURI()));
    }

    @ExceptionHandler(org.springframework.orm.ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<?> handleOptimisticLocking(org.springframework.orm.ObjectOptimisticLockingFailureException ex, HttpServletRequest req) {
        log.error("CAP Consistency Conflict on [{}]: {}", req.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                body(409, "Consistency Conflict", "The record was updated by another user while you were editing. Please refresh and try again.", req.getRequestURI()));
    }

    // 500 — Catch-all: never expose internal details to the client
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception on [{}]: {}", req.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                body(500, "Internal Server Error", "Error: " + ex.getClass().getSimpleName() + " - " + ex.getMessage(), req.getRequestURI()));
    }
}

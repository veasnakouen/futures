package com.mtp.auth.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private Map<String, Object> body(int status, String error, String message, String path) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status);
        body.put("error", error);
        body.put("message", message);
        body.put("path", path);
        return body;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("Validation failed [{}]: {}", req.getRequestURI(), details);
        return ResponseEntity.badRequest().body(
                body(400, "Validation Failed", details, req.getRequestURI()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {
        log.warn("Bad credentials attempt on [{}]", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                body(401, "Unauthorized", "Invalid username or password", req.getRequestURI()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        log.warn("Access denied to [{}]", req.getRequestURI());
        
        if (org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() == null ||
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() instanceof org.springframework.security.authentication.AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                body(401, "Unauthorized", "Authentication required or token expired", req.getRequestURI()));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                body(403, "Forbidden", "You do not have permission to access this resource", req.getRequestURI()));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResourceFound(NoResourceFoundException ex, HttpServletRequest req) {
        log.warn("Resource not found [{}]: {}", req.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                body(404, "Not Found", "Endpoint not found: " + ex.getResourcePath(), req.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception on [{}]: {}", req.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                body(500, "Internal Server Error", "Error: " + ex.getClass().getSimpleName() + " - " + ex.getMessage(), req.getRequestURI()));
    }
}

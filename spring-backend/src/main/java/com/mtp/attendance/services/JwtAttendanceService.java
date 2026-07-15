package com.mtp.attendance.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtAttendanceService {

    // In a real production system, this should be injected via @Value from application.yml
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // Dynamic QR codes should expire quickly (e.g., 30 seconds) to prevent photo sharing
    private static final long EXPIRATION_TIME_MS = 30000;

    public String generateAttendanceToken(Long departmentId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME_MS);

        return Jwts.builder()
                .setSubject(String.valueOf(departmentId))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .claim("type", "DYNAMIC_ATTENDANCE")
                .signWith(secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            // Token is expired, invalid, or tampered with
            return false;
        }
    }

    public Long extractDepartmentId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Long.parseLong(claims.getSubject());
    }
}

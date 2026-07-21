package com.mtp.api.services;

import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {

    // For a real production app, this key should be in application.yml
    private final SecretKey key = Jwts.SIG.HS256.key().build();

    // Valid for 5 minutes
    private static final long EXPIRATION_TIME = 5 * 60 * 1000;
    // Valid for 10 years (effectively permanent)
    private static final long PERMANENT_TIME = 10L * 365 * 24 * 60 * 60 * 1000;

    public String generateDepartmentQrToken(Integer departmentId, boolean isPermanent) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("departmentId", departmentId);
        claims.put("type", "attendance_qr");

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(departmentId))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (isPermanent ? PERMANENT_TIME : EXPIRATION_TIME)))
                .signWith(key)
                .compact();
    }

    public Integer validateAndGetDepartmentId(String token) {
        try {
            String subject = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
            return Integer.parseInt(subject);
        } catch (Exception e) {
            // Token expired, invalid signature, etc.
            return null;
        }
    }
}

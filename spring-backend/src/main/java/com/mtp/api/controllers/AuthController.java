package com.mtp.api.controllers;

import com.mtp.api.security.AuthRequest;
import com.mtp.api.security.AuthResponse;
import com.mtp.api.security.JwtUtils;
import com.mtp.api.security.UserPrincipal;
import com.mtp.api.models.RefreshToken;
import com.mtp.api.models.User;
import com.mtp.api.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private JwtUtils jwtUtils;

        @Autowired
        private RefreshTokenService refreshTokenService;

        @GetMapping("/debug")
        public ResponseEntity<?> debug(@RequestHeader Map<String, String> headers) {
                System.out.println("DEBUG HEADERS:");
                headers.forEach((k, v) -> System.out.println(k + ": " + v));
                return ResponseEntity.ok(headers);
        }

        @GetMapping("/test")
        public ResponseEntity<String> test() {
                return ResponseEntity.ok("Backend is reachable!");
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@jakarta.validation.Valid @RequestBody AuthRequest request) {
                try {
                        Authentication authentication = authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

                        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                        String jwt = jwtUtils.generateToken(userPrincipal);

                        // Use real refresh token service
                        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userPrincipal.getId().toString());

                        List<String> roles = userPrincipal.getAuthorities().stream()
                                        .map(GrantedAuthority::getAuthority)
                                        .collect(Collectors.toList());

                        return ResponseEntity.ok(new AuthResponse(jwt, refreshToken.getToken(),
                                        userPrincipal.getUsername(), userPrincipal.getEmail(), roles));
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("message", "Authentication failed: Invalid credentials"));
                }
        }

        @PostMapping("/refresh")
        public ResponseEntity<?> refreshToken(@jakarta.validation.Valid @RequestBody Map<String, String> body) {
                String requestRefreshToken = body.get("refreshToken");
                Optional<RefreshToken> tokenOpt = refreshTokenService.findByToken(requestRefreshToken)
                                .map(refreshTokenService::verifyExpiration);

                if (tokenOpt.isPresent()) {
                        RefreshToken rt = tokenOpt.get();
                        User user = rt.getUser();
                        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName()))
                                        .collect(Collectors.toList());
                        org.springframework.security.core.userdetails.User springUser = new org.springframework.security.core.userdetails.User(
                                        user.getUserName(),
                                        user.getPasswordHash(),
                                        authorities);
                        String newJwt = jwtUtils.generateToken(springUser);
                        List<String> roleNames = user.getRoles().stream()
                                        .map(r -> "ROLE_" + r.getName())
                                        .collect(Collectors.toList());
                        return ResponseEntity
                                        .ok(new AuthResponse(newJwt, rt.getToken(), user.getUserName(), user.getEmail(), roleNames));
                }

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Refresh token not found or expired");
        }
}

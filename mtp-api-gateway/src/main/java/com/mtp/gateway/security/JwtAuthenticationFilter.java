package com.mtp.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret:defaultSecretKeyWithAtLeast256BitsLongForSecurityPurpose}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (isPublicEndpoint(request)) {
            System.out.println("Skipping JWT for public endpoint: " + request.getURI().getPath());
            // Even on public endpoints, strip malicious internal headers
            ServerHttpRequest cleanRequest = exchange.getRequest().mutate()
                    .headers(httpHeaders -> {
                        httpHeaders.remove("X-Tenant-ID");
                        httpHeaders.remove("X-User-Roles");
                        httpHeaders.remove("X-Username");
                    })
                    .build();
            return chain.filter(exchange.mutate().request(cleanRequest).build());
        }

        if (!request.getHeaders().containsKey("Authorization")) {
            return this.onError(exchange, "Missing Authorization header", HttpStatus.UNAUTHORIZED);
        }

        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return this.onError(exchange, "Invalid Authorization header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // Extract claims
            String tenantId = claims.get("tenantId", String.class);
            List<String> rolesList = claims.get("roles", List.class);
            String roles = rolesList != null ? String.join(",", rolesList) : "";
            String username = claims.getSubject();

            // Mutate request to add verified headers for downstream services
            // AND strip out any malicious headers originally sent by client
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .headers(httpHeaders -> {
                        httpHeaders.remove("X-Tenant-ID");
                        httpHeaders.remove("X-User-Roles");
                        httpHeaders.remove("X-Username");
                        httpHeaders.add("X-Tenant-ID", tenantId != null ? tenantId : "default-tenant");
                        httpHeaders.add("X-User-Roles", roles);
                        httpHeaders.add("X-Username", username);
                    })
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            return this.onError(exchange, "Invalid JWT Token", HttpStatus.UNAUTHORIZED);
        }
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        return path.contains("/api/auth/login") || path.contains("/api/auth/register") || path.contains("/eureka") || path.contains("/actuator") || path.contains("/ws");
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return -1; // Execute before routing
    }
}

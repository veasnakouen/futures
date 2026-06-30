# Full Microservices Tutorial with Java Spring Boot

> A comprehensive, hands-on guide to building production-ready microservices from scratch.

---

## Table of Contents

1. [What Are Microservices?](#1-what-are-microservices)
2. [Architecture Overview](#2-architecture-overview)
3. [Prerequisites & Project Setup](#3-prerequisites--project-setup)
4. [Service 1 – User Service](#4-service-1--user-service)
5. [Service 2 – Product Service](#5-service-2--product-service)
6. [Service 3 – Order Service](#6-service-3--order-service)
7. [API Gateway (Spring Cloud Gateway)](#7-api-gateway-spring-cloud-gateway)
8. [Service Discovery (Eureka)](#8-service-discovery-eureka)
9. [Inter-Service Communication (OpenFeign)](#9-inter-service-communication-openfeign)
10. [Centralized Configuration (Spring Cloud Config)](#10-centralized-configuration-spring-cloud-config)
11. [Distributed Tracing (Micrometer + Zipkin)](#11-distributed-tracing-micrometer--zipkin)
12. [Resilience (Resilience4j Circuit Breaker)](#12-resilience-resilience4j-circuit-breaker)
13. [Messaging with Kafka](#13-messaging-with-kafka)
14. [Security with JWT & OAuth2](#14-security-with-jwt--oauth2)
15. [Containerization with Docker & Docker Compose](#15-containerization-with-docker--docker-compose)
16. [Summary & Next Steps](#16-summary--next-steps)

---

## 1. What Are Microservices?

Microservices is an architectural style where an application is built as a collection of **small, independent, loosely coupled services**, each responsible for a specific business domain. They communicate over lightweight protocols (HTTP/REST, gRPC, or messaging queues).

### Monolith vs Microservices

| Aspect | Monolith | Microservices |
|---|---|---|
| Deployment | Single unit | Independent per service |
| Scalability | Scale everything | Scale only what's needed |
| Tech stack | One stack | Polyglot possible |
| Fault isolation | One failure = app down | Failures are contained |
| Complexity | Lower initially | Higher, but manageable |

---

## 2. Architecture Overview

```
                         ┌─────────────────────────────────────────┐
                         │              Client Apps                │
                         │         (Web / Mobile / CLI)            │
                         └──────────────────┬──────────────────────┘
                                            │
                         ┌──────────────────▼──────────────────────┐
                         │           API Gateway :8080             │
                         │       (Spring Cloud Gateway)            │
                         └────┬──────────────┬──────────────┬──────┘
                              │              │              │
               ┌──────────────▼──┐   ┌───────▼──────┐  ┌───▼─────────────┐
               │  User Service   │   │Product Service│  │  Order Service  │
               │    :8081        │   │    :8082      │  │     :8083       │
               └──────────────┬──┘   └───────┬───────┘  └───┬─────────────┘
                              │              │              │
               ┌──────────────▼──────────────▼──────────────▼──────────────┐
               │                   Eureka Discovery Server :8761            │
               └────────────────────────────────────────────────────────────┘
                              │              │              │
               ┌──────────────▼──┐   ┌───────▼──────┐  ┌───▼─────────────┐
               │   PostgreSQL    │   │   PostgreSQL  │  │   PostgreSQL    │
               │  (users db)     │   │ (products db) │  │  (orders db)    │
               └─────────────────┘   └──────────────┘  └─────────────────┘

                    Kafka (event bus) ←──────────────────────────────────▶
                    Config Server :8888
                    Zipkin Tracing :9411
```

---

## 3. Prerequisites & Project Setup

### Requirements

- Java 21+
- Maven 3.9+
- Docker & Docker Compose
- An IDE (IntelliJ IDEA recommended)

### Project Structure

```
microservices-demo/
├── config-server/
├── discovery-server/
├── api-gateway/
├── user-service/
├── product-service/
├── order-service/
├── docker-compose.yml
└── pom.xml  (parent)
```

### Parent `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.demo</groupId>
  <artifactId>microservices-demo</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>

  <modules>
    <module>config-server</module>
    <module>discovery-server</module>
    <module>api-gateway</module>
    <module>user-service</module>
    <module>product-service</module>
    <module>order-service</module>
  </modules>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
  </parent>

  <properties>
    <java.version>21</java.version>
    <spring-cloud.version>2023.0.2</spring-cloud.version>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies</artifactId>
        <version>${spring-cloud.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>
```

---

## 4. Service 1 – User Service

### `pom.xml` dependencies

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
  </dependency>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
</dependencies>
```

### `application.yml`

```yaml
server:
  port: 8081

spring:
  application:
    name: user-service
  datasource:
    url: jdbc:postgresql://localhost:5432/usersdb
    username: postgres
    password: secret
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### Entity

```java
// User.java
package com.demo.userservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role;
}
```

### Repository

```java
// UserRepository.java
package com.demo.userservice.repository;

import com.demo.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### DTO

```java
// UserRequest.java
package com.demo.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class UserRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    private String role;
}

// UserResponse.java
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
}
```

### Service

```java
// UserService.java
package com.demo.userservice.service;

import com.demo.userservice.dto.*;
import com.demo.userservice.entity.User;
import com.demo.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // hash in production!
                .role(request.getRole() != null ? request.getRole() : "USER")
                .build();
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return toResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        return toResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
```

### Controller

```java
// UserController.java
package com.demo.userservice.controller;

import com.demo.userservice.dto.*;
import com.demo.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Main Application

```java
// UserServiceApplication.java
package com.demo.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

---

## 5. Service 2 – Product Service

> Follows the same structure as User Service. Only key differences are shown.

### Entity

```java
// Product.java
@Entity
@Table(name = "products")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String description;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stock;
}
```

### DTO

```java
// ProductRequest.java
@Data
public class ProductRequest {
    @NotBlank private String name;
    private String description;
    @NotNull @DecimalMin("0.0") private BigDecimal price;
    @NotNull @Min(0) private Integer stock;
}

// ProductResponse.java
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
}
```

### application.yml

```yaml
server:
  port: 8082

spring:
  application:
    name: product-service
  datasource:
    url: jdbc:postgresql://localhost:5432/productsdb
    username: postgres
    password: secret
  jpa:
    hibernate:
      ddl-auto: update

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

---

## 6. Service 3 – Order Service

The Order Service references both User and Product services.

### Entity

```java
// Order.java
@Entity
@Table(name = "orders")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long userId;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.PENDING;
    }
}

// OrderItem.java
@Entity
@Table(name = "order_items")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private Integer quantity;
    private BigDecimal price;
}

// OrderStatus.java
public enum OrderStatus {
    PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
}
```

### application.yml

```yaml
server:
  port: 8083

spring:
  application:
    name: order-service
  datasource:
    url: jdbc:postgresql://localhost:5432/ordersdb
    username: postgres
    password: secret
  jpa:
    hibernate:
      ddl-auto: update

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

---

## 7. API Gateway (Spring Cloud Gateway)

### `pom.xml` dependencies

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
  </dependency>
</dependencies>
```

### `application.yml`

```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=0

        - id: product-service
          uri: lb://product-service
          predicates:
            - Path=/api/products/**
          filters:
            - StripPrefix=0

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=0

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### Main Application

```java
@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

---

## 8. Service Discovery (Eureka)

All services register themselves with Eureka. The gateway then routes using `lb://service-name`.

### `pom.xml` for Eureka Server

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
  </dependency>
</dependencies>
```

### `application.yml`

```yaml
server:
  port: 8761

spring:
  application:
    name: discovery-server

eureka:
  instance:
    hostname: localhost
  client:
    register-with-eureka: false
    fetch-registry: false
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
```

### Main Application

```java
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServerApplication.class, args);
    }
}
```

> Visit `http://localhost:8761` to see all registered services on the Eureka dashboard.

---

## 9. Inter-Service Communication (OpenFeign)

Order Service calls Product Service to get product details and validate stock.

### Add to `order-service/pom.xml`

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

### Enable Feign

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

### Feign Client

```java
// ProductClient.java
package com.demo.orderservice.client;

import com.demo.orderservice.dto.ProductResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "product-service", fallback = ProductClientFallback.class)
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ProductResponse getProductById(@PathVariable Long id);

    @PutMapping("/api/products/{id}/reduce-stock")
    void reduceStock(@PathVariable Long id, @RequestParam int quantity);
}

// ProductClientFallback.java
@Component
public class ProductClientFallback implements ProductClient {

    @Override
    public ProductResponse getProductById(Long id) {
        // return a default/empty product as fallback
        return ProductResponse.builder()
                .id(id)
                .name("Unknown Product")
                .price(BigDecimal.ZERO)
                .stock(0)
                .build();
    }

    @Override
    public void reduceStock(Long id, int quantity) {
        // log or handle gracefully
    }
}
```

### Using Feign in Order Service

```java
// OrderService.java (excerpt)
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            ProductResponse product = productClient.getProductById(itemReq.getProductId());

            if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getId());
            }

            productClient.reduceStock(itemReq.getProductId(), itemReq.getQuantity());

            return OrderItem.builder()
                    .productId(product.getId())
                    .quantity(itemReq.getQuantity())
                    .price(product.getPrice())
                    .build();
        }).toList();

        Order order = Order.builder()
                .userId(request.getUserId())
                .items(items)
                .build();

        return toResponse(orderRepository.save(order));
    }
}
```

---

## 10. Centralized Configuration (Spring Cloud Config)

### Config Server Setup

```xml
<!-- pom.xml -->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-config-server</artifactId>
</dependency>
```

```yaml
# application.yml
server:
  port: 8888

spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/config-repo
          default-label: main
```

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

### Client Configuration

Add to each service's `pom.xml`:

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

Add `bootstrap.yml` to each service:

```yaml
spring:
  application:
    name: user-service   # must match the config file name in the git repo
  cloud:
    config:
      uri: http://localhost:8888
      fail-fast: true
```

> Store files like `user-service.yml`, `product-service.yml`, `order-service.yml` in the Git repo.

---

## 11. Distributed Tracing (Micrometer + Zipkin)

### Dependencies (add to all services)

```xml
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
  <groupId>io.zipkin.reporter2</groupId>
  <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### `application.yml` addition (all services)

```yaml
management:
  tracing:
    sampling:
      probability: 1.0   # 100% sampling (use 0.1 in production)
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
```

### Run Zipkin with Docker

```bash
docker run -d -p 9411:9411 openzipkin/zipkin
```

> Visit `http://localhost:9411` to trace requests across services.

---

## 12. Resilience (Resilience4j Circuit Breaker)

### Dependencies

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

### Configuration

```yaml
# application.yml
resilience4j:
  circuitbreaker:
    instances:
      productService:
        register-health-indicator: true
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 5s
        permitted-number-of-calls-in-half-open-state: 3
  retry:
    instances:
      productService:
        max-attempts: 3
        wait-duration: 1s
  timelimiter:
    instances:
      productService:
        timeout-duration: 3s
```

### Applying to Feign Client

```java
// ProductClient.java
@FeignClient(
    name = "product-service",
    fallback = ProductClientFallback.class
)
public interface ProductClient {
    // ...
}
```

### Applying Programmatically

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final ProductClient productClient;
    private final CircuitBreakerFactory circuitBreakerFactory;

    public ProductResponse getProductSafely(Long productId) {
        CircuitBreaker cb = circuitBreakerFactory.create("productService");
        return cb.run(
            () -> productClient.getProductById(productId),
            throwable -> ProductResponse.builder().id(productId).name("Fallback").build()
        );
    }
}
```

---

## 13. Messaging with Kafka

Kafka enables **async, event-driven** communication between services. For example: when an order is placed, publish an `OrderPlacedEvent` that the user-service or notification-service can consume.

### Add Kafka to `pom.xml` (Order Service)

```xml
<dependency>
  <groupId>org.springframework.kafka</groupId>
  <artifactId>spring-kafka</artifactId>
</dependency>
```

### application.yml

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: order-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"
```

### Event Class (shared or duplicated)

```java
// OrderPlacedEvent.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPlacedEvent {
    private Long orderId;
    private Long userId;
    private String status;
}
```

### Producer (Order Service)

```java
// OrderEventProducer.java
@Service
@RequiredArgsConstructor
public class OrderEventProducer {

    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    public void publishOrderPlaced(OrderPlacedEvent event) {
        kafkaTemplate.send("order-placed", event);
    }
}
```

### Consumer (Notification Service or User Service)

```java
// OrderEventConsumer.java
@Service
@Slf4j
public class OrderEventConsumer {

    @KafkaListener(topics = "order-placed", groupId = "notification-group")
    public void handleOrderPlaced(OrderPlacedEvent event) {
        log.info("Order placed: orderId={}, userId={}", event.getOrderId(), event.getUserId());
        // send email, push notification, etc.
    }
}
```

---

## 14. Security with JWT & OAuth2

### Dependencies (all secured services)

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.11.5</version>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-impl</artifactId>
  <version>0.11.5</version>
  <scope>runtime</scope>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-jackson</artifactId>
  <version>0.11.5</version>
  <scope>runtime</scope>
</dependency>
```

### JWT Utility

```java
// JwtUtil.java
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private final long EXPIRY_MS = 86400000L; // 24 hours

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRY_MS))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token, String username) {
        return extractClaims(token).getSubject().equals(username)
                && !extractClaims(token).getExpiration().before(new Date());
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}
```

### JWT Filter

```java
// JwtAuthFilter.java
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractClaims(token).getSubject();

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.isTokenValid(token, username)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
```

### Security Configuration

```java
// SecurityConfig.java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/products/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .anyRequest().authenticated()
                )
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

---

## 15. Containerization with Docker & Docker Compose

### Dockerfile (same pattern for all services)

```dockerfile
# Dockerfile (place in each service root)
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### `docker-compose.yml`

```yaml
version: '3.9'

services:

  # ─── Infrastructure ───────────────────────────────────────────

  postgres-users:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: usersdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"

  postgres-products:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: productsdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports:
      - "5433:5432"

  postgres-orders:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ordersdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports:
      - "5434:5432"

  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"

  zipkin:
    image: openzipkin/zipkin
    ports:
      - "9411:9411"

  # ─── Platform Services ────────────────────────────────────────

  discovery-server:
    build: ./discovery-server
    ports:
      - "8761:8761"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8761/actuator/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  config-server:
    build: ./config-server
    ports:
      - "8888:8888"
    depends_on:
      discovery-server:
        condition: service_healthy

  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    depends_on:
      - discovery-server
      - config-server
    environment:
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/

  # ─── Business Services ────────────────────────────────────────

  user-service:
    build: ./user-service
    ports:
      - "8081:8081"
    depends_on:
      - postgres-users
      - discovery-server
      - kafka
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-users:5432/usersdb
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      MANAGEMENT_ZIPKIN_TRACING_ENDPOINT: http://zipkin:9411/api/v2/spans

  product-service:
    build: ./product-service
    ports:
      - "8082:8082"
    depends_on:
      - postgres-products
      - discovery-server
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-products:5432/productsdb
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/

  order-service:
    build: ./order-service
    ports:
      - "8083:8083"
    depends_on:
      - postgres-orders
      - discovery-server
      - kafka
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-orders:5432/ordersdb
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
```

### Run Everything

```bash
# Build all services
mvn clean package -DskipTests

# Start all containers
docker-compose up --build

# Stop everything
docker-compose down -v
```

---

## 16. Summary & Next Steps

### What We Built

| Component | Technology | Port |
|---|---|---|
| Discovery Server | Spring Cloud Eureka | 8761 |
| Config Server | Spring Cloud Config | 8888 |
| API Gateway | Spring Cloud Gateway | 8080 |
| User Service | Spring Boot + JPA | 8081 |
| Product Service | Spring Boot + JPA | 8082 |
| Order Service | Spring Boot + JPA | 8083 |
| Distributed Tracing | Micrometer + Zipkin | 9411 |
| Event Bus | Apache Kafka | 9092 |
| Database (×3) | PostgreSQL | 5432–5434 |

### Recommended Next Steps

1. **Kubernetes Deployment** — Move from Docker Compose to K8s with Helm charts for production-grade orchestration.
2. **Centralized Logging** — Add ELK Stack (Elasticsearch, Logstash, Kibana) or Grafana Loki for log aggregation.
3. **Metrics Dashboard** — Integrate Prometheus + Grafana with Micrometer metrics from all services.
4. **API Documentation** — Add Springdoc OpenAPI (Swagger UI) to each service.
5. **CQRS + Event Sourcing** — Separate read/write models per service using Axon Framework or manual CQRS.
6. **Rate Limiting** — Add Redis-backed rate limiting in the API Gateway.
7. **Service Mesh** — Consider Istio or Linkerd for advanced traffic management and mTLS.

---

*Happy building! 🚀*

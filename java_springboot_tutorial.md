# Spring Boot: Complete Tutorial — Beginner to Master

> **Coverage:** Spring Core → Spring Boot → REST APIs → Data/JPA → Security → Testing → Microservices → Advanced Patterns

---

## Table of Contents

1. [Spring Framework Fundamentals](#1-spring-framework-fundamentals)
2. [Spring Boot Getting Started](#2-spring-boot-getting-started)
3. [Dependency Injection & IoC](#3-dependency-injection--ioc)
4. [Spring Boot Configuration](#4-spring-boot-configuration)
5. [Building REST APIs](#5-building-rest-apis)
6. [Validation & Error Handling](#6-validation--error-handling)
7. [Spring Data JPA](#7-spring-data-jpa)
8. [Spring Security](#8-spring-security)
9. [JWT Authentication](#9-jwt-authentication)
10. [Spring Boot Testing](#10-spring-boot-testing)
11. [Spring AOP](#11-spring-aop)
12. [Caching](#12-caching)
13. [Async & Scheduling](#13-async--scheduling)
14. [Spring Events](#14-spring-events)
15. [File Upload & Download](#15-file-upload--download)
16. [Email Sending](#16-email-sending)
17. [WebSocket & Real-Time](#17-websocket--real-time)
18. [Microservices with Spring Boot](#18-microservices-with-spring-boot)
19. [Spring Cloud](#19-spring-cloud)
20. [Production Best Practices](#20-production-best-practices)

---

## 1. Spring Framework Fundamentals

### What is Spring?

Spring is a powerful **Java application framework** providing:

| Module | Purpose |
|---|---|
| Spring Core | IoC container, Dependency Injection |
| Spring MVC | Web layer, REST APIs |
| Spring Data | Database abstraction (JPA, MongoDB, Redis) |
| Spring Security | Authentication & Authorization |
| Spring AOP | Aspect-Oriented Programming |
| Spring Boot | Auto-configuration, opinionated defaults |

### Spring vs Spring Boot

| Feature | Spring | Spring Boot |
|---|---|---|
| Configuration | Manual XML / Java config | Auto-configured |
| Server | External (Tomcat WAR) | Embedded (Tomcat/Jetty/Undertow) |
| Startup | Complex | `main()` method |
| Dependencies | Manual management | Starter POMs |
| Production | Manual setup | Actuator built-in |

---

## 2. Spring Boot Getting Started

### 2.1 Project Structure

```
my-app/
├── src/
│   ├── main/
│   │   ├── java/com/example/myapp/
│   │   │   ├── MyAppApplication.java      ← Entry point
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/  (entity/)
│   │   │   ├── dto/
│   │   │   ├── config/
│   │   │   └── exception/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/java/com/example/myapp/
└── pom.xml
```

### 2.2 pom.xml (Maven)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Web (REST API) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- JPA + Hibernate -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Actuator (monitoring) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- PostgreSQL -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.5.5.Final</version>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Redis Cache -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.3 Entry Point

```java
package com.example.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication           // = @Configuration + @EnableAutoConfiguration + @ComponentScan
@EnableAsync                     // enables @Async
@EnableScheduling                // enables @Scheduled
public class MyAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyAppApplication.class, args);
    }
}
```

---

## 3. Dependency Injection & IoC

### 3.1 Core Stereotypes

```java
// @Component — generic Spring-managed bean
@Component
public class EmailValidator {
    public boolean isValid(String email) {
        return email != null && email.contains("@");
    }
}

// @Service — business logic layer
@Service
public class UserService {
    // ...
}

// @Repository — data access layer (translates DB exceptions)
@Repository
public class UserRepository {
    // ...
}

// @Controller / @RestController — web layer
@RestController
public class UserController {
    // ...
}

// @Configuration — bean factory class
@Configuration
public class AppConfig {
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

### 3.2 Injection Types

```java
@Service
public class OrderService {

    // ① Constructor Injection (RECOMMENDED)
    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final EmailService emailService;

    // @Autowired optional when single constructor (Spring 4.3+)
    public OrderService(ProductService productService,
                        OrderRepository orderRepository,
                        EmailService emailService) {
        this.productService = productService;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }

    // ② Field Injection (NOT recommended — hard to test)
    @Autowired
    private ProductService productService2;

    // ③ Setter Injection (for optional deps)
    @Autowired(required = false)
    public void setNotificationService(NotificationService ns) {
        this.notificationService = ns;
    }
}
```

### 3.3 Bean Scopes

```java
@Component
@Scope("singleton")    // default: one instance per context
public class AppConfig {}

@Component
@Scope("prototype")    // new instance each time requested
public class ReportGenerator {}

@Component
@RequestScope          // one per HTTP request (web only)
public class RequestContext {}

@Component
@SessionScope          // one per HTTP session (web only)
public class UserSession {}

// Conditional beans
@Bean
@ConditionalOnProperty(name = "feature.email.enabled", havingValue = "true")
public EmailService emailService() {
    return new EmailService();
}

@Bean
@ConditionalOnMissingBean
public CacheManager cacheManager() {
    return new ConcurrentMapCacheManager();
}

@Bean
@Profile("prod")   // only active in prod profile
public DataSource prodDataSource() { /* ... */ }
```

### 3.4 Qualifier & Primary

```java
public interface PaymentGateway {
    void process(double amount);
}

@Component("stripe")
public class StripeGateway implements PaymentGateway { /* ... */ }

@Component("paypal")
@Primary   // used when no qualifier specified
public class PaypalGateway implements PaymentGateway { /* ... */ }

@Service
public class CheckoutService {

    @Autowired
    @Qualifier("stripe")  // inject specific implementation
    private PaymentGateway stripeGateway;

    @Autowired
    private PaymentGateway defaultGateway; // gets @Primary (PayPal)
}
```

---

## 4. Spring Boot Configuration

### 4.1 application.yml

```yaml
spring:
  application:
    name: my-app

  # Database
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:secret}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000

  # JPA / Hibernate
  jpa:
    hibernate:
      ddl-auto: validate          # none | validate | update | create | create-drop
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        default_schema: public

  # Redis
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: 6379
      password: ${REDIS_PASSWORD:}
      timeout: 2000ms

  # Email
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true

  # File Upload
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# Server
server:
  port: 8080
  servlet:
    context-path: /api
  error:
    include-message: always
    include-binding-errors: always

# Actuator
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized

# Custom properties
app:
  jwt:
    secret: ${JWT_SECRET:my-secret-key-must-be-at-least-256-bits}
    expiration: 86400000     # 24h in ms
    refresh-expiration: 604800000  # 7 days

  cors:
    allowed-origins: http://localhost:3000,http://localhost:4200

  upload:
    dir: ./uploads
    allowed-types: image/jpeg,image/png,application/pdf
```

### 4.2 Profile-specific configs

```yaml
# application-dev.yml
spring:
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: create-drop
  datasource:
    url: jdbc:h2:mem:devdb   # in-memory for dev

logging:
  level:
    com.example: DEBUG
    org.hibernate.SQL: DEBUG

---
# application-prod.yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
logging:
  level:
    root: WARN
    com.example: INFO
```

### 4.3 Custom Configuration Properties

```java
// application.yml: app.jwt.secret, app.jwt.expiration
@ConfigurationProperties(prefix = "app.jwt")
@Component
@Validated
public class JwtProperties {

    @NotBlank
    private String secret;

    @Positive
    private long expiration = 86400000L;

    @Positive
    private long refreshExpiration = 604800000L;

    // getters & setters (or use @Data from Lombok)
    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    public long getExpiration() { return expiration; }
    public void setExpiration(long expiration) { this.expiration = expiration; }
    public long getRefreshExpiration() { return refreshExpiration; }
    public void setRefreshExpiration(long exp) { this.refreshExpiration = exp; }
}

// Usage
@Service
public class JwtService {
    private final JwtProperties jwtProperties;
    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }
}
```

---

## 5. Building REST APIs

### 5.1 Entity

```java
package com.example.myapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal price;

    @Column(nullable = false)
    private Integer stock = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Version   // optimistic locking
    private Long version;
}

public enum ProductStatus { ACTIVE, INACTIVE, OUT_OF_STOCK }
```

### 5.2 DTOs

```java
// Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 200)
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stock;

    private Long categoryId;
}

// Response DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String status;
    private String categoryName;
    private LocalDateTime createdAt;
}

// Paginated response wrapper
@Data
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isLast()
        );
    }
}
```

### 5.3 Mapper (MapStruct)

```java
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "status", target = "status", qualifiedByName = "enumToString")
    ProductResponse toResponse(Product product);

    @Mapping(source = "categoryId", target = "category.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toEntity(ProductRequest request);

    List<ProductResponse> toResponseList(List<Product> products);

    @Named("enumToString")
    default String enumToString(ProductStatus status) {
        return status != null ? status.name() : null;
    }
}
```

### 5.4 Repository

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Derived queries
    List<Product> findByStatus(ProductStatus status);
    List<Product> findByCategory_IdAndStatus(Long categoryId, ProductStatus status);
    Optional<Product> findByNameIgnoreCase(String name);
    boolean existsByName(String name);

    // Custom JPQL
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max AND p.status = :status")
    List<Product> findByPriceRangeAndStatus(
        @Param("min") BigDecimal min,
        @Param("max") BigDecimal max,
        @Param("status") ProductStatus status
    );

    // Native SQL
    @Query(value = "SELECT * FROM products WHERE LOWER(name) LIKE %:keyword%",
           nativeQuery = true)
    List<Product> searchByKeyword(@Param("keyword") String keyword);

    // Pagination + Sorting
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    // Projection
    @Query("SELECT p.id as id, p.name as name, p.price as price FROM Product p")
    List<ProductSummary> findAllSummaries();

    // Update
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :qty WHERE p.id = :id AND p.stock >= :qty")
    int decrementStock(@Param("id") Long id, @Param("qty") int qty);
}

// Projection interface
public interface ProductSummary {
    Long getId();
    String getName();
    BigDecimal getPrice();
}
```

### 5.5 Service

```java
@Service
@Transactional(readOnly = true)  // default read-only, override for writes
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public PageResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductResponse> result = productRepository.findAll(pageable)
            .map(productMapper::toResponse);
        return PageResponse.from(result);
    }

    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Product name already exists: " + request.getName());
        }

        Product product = productMapper.toEntity(request);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        log.info("Created product: id={}, name={}", saved.getId(), saved.getName());
        return productMapper.toResponse(saved);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }
        productRepository.deleteById(id);
        log.info("Deleted product: id={}", id);
    }

    public List<ProductResponse> search(String keyword, BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceRangeAndStatus(minPrice, maxPrice, ProductStatus.ACTIVE)
            .stream()
            .filter(p -> keyword == null || p.getName().toLowerCase().contains(keyword.toLowerCase()))
            .map(productMapper::toResponse)
            .toList();
    }
}
```

### 5.6 Controller

```java
@RestController
@RequestMapping("/v1/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products (paginated)")
    public ResponseEntity<PageResponse<ProductResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return ResponseEntity.ok(productService.getAllProducts(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(response.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus status) {
        productService.updateStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(productService.search(keyword, minPrice, maxPrice));
    }
}
```

---

## 6. Validation & Error Handling

### 6.1 Custom Validators

```java
// Custom annotation
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneNumberValidator.class)
public @interface ValidPhone {
    String message() default "Invalid phone number";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Validator implementation
public class PhoneNumberValidator implements ConstraintValidator<ValidPhone, String> {
    private static final Pattern PHONE_PATTERN =
        Pattern.compile("^\\+?[1-9]\\d{7,14}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        if (value == null) return true; // use @NotNull separately
        return PHONE_PATTERN.matcher(value).matches();
    }
}

// Usage in DTO
public class UserRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @ValidPhone
    private String phone;

    @Past
    private LocalDate birthDate;

    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
             message = "Password must contain letters and numbers")
    private String password;
}
```

### 6.2 Global Exception Handler

```java
// Custom exceptions
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s not found with %s: %s", resource, field, value));
    }
}

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) { super(message); }
}

public class BusinessException extends RuntimeException {
    private final String errorCode;
    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    public String getErrorCode() { return errorCode; }
}

// Error response model
@Data @Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<FieldError> fieldErrors;

    @Data @AllArgsConstructor
    public static class FieldError {
        private String field;
        private Object rejectedValue;
        private String message;
    }
}

// Global handler
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(
            DuplicateResourceException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
            .getFieldErrors().stream()
            .map(e -> new ErrorResponse.FieldError(
                e.getField(), e.getRejectedValue(), e.getDefaultMessage()))
            .toList();
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation failed", request, fieldErrors);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN, "Access denied", request, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(
            Exception ex, HttpServletRequest request) {
        log.error("Unexpected error", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred", request, null);
    }

    private ResponseEntity<ErrorResponse> buildResponse(
            HttpStatus status, String message,
            HttpServletRequest request, List<ErrorResponse.FieldError> fieldErrors) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(status.value())
            .error(status.getReasonPhrase())
            .message(message)
            .path(request.getRequestURI())
            .fieldErrors(fieldErrors)
            .build();
        return ResponseEntity.status(status).body(error);
    }
}
```

---

## 7. Spring Data JPA

### 7.1 Entity Relationships

```java
// @OneToMany / @ManyToOne
@Entity
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // Helper method to maintain bidirectional relationship
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}

// @ManyToMany
@Entity
public class User {
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}

// @OneToOne
@Entity
public class UserProfile {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    @MapsId  // shares same PK as User
    private User user;
}
```

### 7.2 Auditing

```java
// Enable auditing
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .map(auth -> auth.getName());
    }
}

// Base entity
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter
public abstract class BaseEntity {
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}

// Use in entities
@Entity
public class Product extends BaseEntity { /* ... */ }
```

### 7.3 Specifications (Dynamic Queries)

```java
// Specification for dynamic filtering
public class ProductSpecification {

    public static Specification<Product> hasName(String name) {
        return (root, query, cb) -> name == null ? cb.conjunction()
            : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Product> hasStatus(ProductStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction()
            : cb.equal(root.get("status"), status);
    }

    public static Specification<Product> hasPriceRange(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min == null) return cb.lessThanOrEqualTo(root.get("price"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            return cb.between(root.get("price"), min, max);
        };
    }

    public static Specification<Product> inCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null ? cb.conjunction()
            : cb.equal(root.get("category").get("id"), categoryId);
    }
}

// Repository extends JpaSpecificationExecutor
public interface ProductRepository extends
        JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {}

// Service usage
public Page<ProductResponse> filter(ProductFilter filter, Pageable pageable) {
    Specification<Product> spec = Specification
        .where(hasName(filter.getName()))
        .and(hasStatus(filter.getStatus()))
        .and(hasPriceRange(filter.getMinPrice(), filter.getMaxPrice()))
        .and(inCategory(filter.getCategoryId()));

    return productRepository.findAll(spec, pageable)
        .map(productMapper::toResponse);
}
```

### 7.4 Transactions

```java
@Service
@Transactional(readOnly = true)  // class-level default
public class TransferService {

    @Transactional  // overrides class-level for write
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accountRepository.findById(fromId)
            .orElseThrow(() -> new ResourceNotFoundException("Account", "id", fromId));
        Account to = accountRepository.findById(toId)
            .orElseThrow(() -> new ResourceNotFoundException("Account", "id", toId));

        if (from.getBalance().compareTo(amount) < 0) {
            throw new BusinessException("INSUFFICIENT_FUNDS", "Not enough balance");
        }

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));

        accountRepository.save(from);
        accountRepository.save(to);
    }

    // Propagation types
    @Transactional(propagation = Propagation.REQUIRES_NEW)  // new transaction always
    public void auditLog(String action) { /* always in its own transaction */ }

    @Transactional(propagation = Propagation.NESTED)  // savepoint inside existing
    public void nestedOp() { /* ... */ }

    // Rollback rules
    @Transactional(rollbackFor = Exception.class)            // rollback on any Exception
    @Transactional(noRollbackFor = BusinessException.class)  // don't rollback on this

    // Timeout
    @Transactional(timeout = 30)  // 30 seconds
    public void longOperation() { /* ... */ }
}
```

---

## 8. Spring Security

### 8.1 Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/v1/products/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // Role-based
                .requestMatchers("/v1/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/v1/products").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/v1/products/**").hasRole("ADMIN")
                // All others require authentication
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(unauthorizedHandler())
                .accessDeniedHandler(accessDeniedHandler())
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:3000", "http://localhost:4200"));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationEntryPoint unauthorizedHandler() {
        return (request, response, ex) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Unauthorized\"}");
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, ex) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"error\": \"Access Denied\"}");
        };
    }
}
```

### 8.2 UserDetails Implementation

```java
@Entity
@Table(name = "users")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class User extends BaseEntity implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private boolean enabled = true;
    private boolean accountNonLocked = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .toList();
    }

    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return accountNonLocked; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }
}

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
```

### 8.3 Method-Level Security

```java
@Service
public class OrderService {

    // Only authenticated users
    @PreAuthorize("isAuthenticated()")
    public List<Order> getMyOrders() { /* ... */ }

    // Only admins
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteOrder(Long id) { /* ... */ }

    // Only the owner or admin
    @PreAuthorize("hasRole('ADMIN') or #order.user.email == authentication.principal.username")
    public Order updateOrder(Order order) { /* ... */ }

    // Post-authorize (filter after method returns)
    @PostAuthorize("returnObject.userId == authentication.principal.id")
    public Order getOrder(Long id) { /* ... */ }

    // Filter collections
    @PreFilter("filterObject.status == 'ACTIVE'")
    public void processOrders(List<Order> orders) { /* ... */ }

    @PostFilter("filterObject.userId == authentication.principal.id")
    public List<Order> getUserOrders() { /* ... */ }
}
```

---

## 9. JWT Authentication

### 9.1 JWT Service

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    private final JwtProperties jwtProperties;

    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, jwtProperties.getExpiration());
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, jwtProperties.getRefreshExpiration());
    }

    private String generateToken(UserDetails userDetails, long expiry) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof User user) {
            claims.put("userId", user.getId());
            claims.put("roles", user.getRoles().stream().map(Role::getName).toList());
        }

        return Jwts.builder()
            .claims(claims)
            .subject(userDetails.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiry))
            .signWith(getSigningKey(), Jwts.SIG.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### 9.2 JWT Filter

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws IOException, ServletException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);

            // Check blacklist (for logout)
            if (tokenBlacklistService.isBlacklisted(jwt)) {
                filterChain.doFilter(request, response);
                return;
            }

            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException ex) {
            log.warn("JWT expired: {}", ex.getMessage());
        } catch (JwtException ex) {
            log.warn("Invalid JWT: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
```

### 9.3 Auth Controller

```java
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody RefreshTokenRequest request) {
        authService.logout(authHeader.substring(7), request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.getCurrentUser(userDetails));
    }
}

// AuthService
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        Role userRole = roleRepository.findByName("USER")
            .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "USER"));

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .roles(Set.of(userRole))
            .build();

        userRepository.save(user);
        return generateTokenPair(user);
    }

    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        return generateTokenPair(user);
    }

    private AuthResponse generateTokenPair(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        // save refresh token to DB for validation
        saveRefreshToken(user, refreshToken);
        return new AuthResponse(accessToken, refreshToken);
    }
}
```

---

## 10. Spring Boot Testing

### 10.1 Unit Tests

```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductResponse productResponse;

    @BeforeEach
    void setUp() {
        product = Product.builder()
            .id(1L).name("Test Product").price(BigDecimal.TEN).stock(100).build();
        productResponse = ProductResponse.builder()
            .id(1L).name("Test Product").price(BigDecimal.TEN).build();
    }

    @Test
    void getById_WhenExists_ReturnsProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productMapper.toResponse(product)).thenReturn(productResponse);

        ProductResponse result = productService.getById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Test Product");
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void getById_WhenNotExists_ThrowsException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(99L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Product");
    }

    @Test
    void create_WhenDuplicateName_ThrowsException() {
        when(productRepository.existsByName("Test Product")).thenReturn(true);
        ProductRequest request = ProductRequest.builder().name("Test Product").build();

        assertThatThrownBy(() -> productService.create(request))
            .isInstanceOf(DuplicateResourceException.class);

        verify(productRepository, never()).save(any());
    }

    @Test
    void create_WhenValid_SavesAndReturns() {
        ProductRequest request = ProductRequest.builder()
            .name("New Product").price(BigDecimal.TEN).stock(50).build();

        when(productRepository.existsByName(any())).thenReturn(false);
        when(productMapper.toEntity(request)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toResponse(product)).thenReturn(productResponse);

        ProductResponse result = productService.create(request);

        assertThat(result).isNotNull();
        verify(productRepository).save(product);
    }
}
```

### 10.2 Repository Tests

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ProductRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void findByStatus_ReturnsMatchingProducts() {
        Product p1 = Product.builder().name("P1").price(BigDecimal.TEN)
            .stock(10).status(ProductStatus.ACTIVE).build();
        Product p2 = Product.builder().name("P2").price(BigDecimal.ONE)
            .stock(5).status(ProductStatus.INACTIVE).build();

        entityManager.persistAndFlush(p1);
        entityManager.persistAndFlush(p2);

        List<Product> active = productRepository.findByStatus(ProductStatus.ACTIVE);

        assertThat(active).hasSize(1);
        assertThat(active.get(0).getName()).isEqualTo("P1");
    }
}
```

### 10.3 Integration Tests

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@AutoConfigureMockMvc
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtService jwtService;

    private String adminToken;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        // generate a test JWT
        adminToken = jwtService.generateAccessToken(buildAdminUser());
    }

    @Test
    void createProduct_WhenValidRequest_Returns201() throws Exception {
        ProductRequest request = ProductRequest.builder()
            .name("Test Product")
            .price(new BigDecimal("99.99"))
            .stock(100)
            .build();

        mockMvc.perform(post("/api/v1/products")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.name").value("Test Product"))
            .andExpect(jsonPath("$.price").value(99.99));
    }

    @Test
    void getProduct_WhenNotFound_Returns404() throws Exception {
        mockMvc.perform(get("/api/v1/products/9999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void createProduct_WhenInvalid_Returns400() throws Exception {
        ProductRequest invalid = ProductRequest.builder().name("").build();

        mockMvc.perform(post("/api/v1/products")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldErrors").isArray());
    }
}
```

---

## 11. Spring AOP

### 11.1 Aspects

```java
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    // Pointcut definitions
    @Pointcut("execution(* com.example.myapp.service.*.*(..))")
    private void serviceLayer() {}

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    private void controllerLayer() {}

    // Before advice
    @Before("serviceLayer()")
    public void logBefore(JoinPoint jp) {
        log.debug("Calling: {}.{}({})",
            jp.getTarget().getClass().getSimpleName(),
            jp.getSignature().getName(),
            Arrays.toString(jp.getArgs()));
    }

    // After returning advice
    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logAfter(JoinPoint jp, Object result) {
        log.debug("Returned from: {} → {}", jp.getSignature().getName(), result);
    }

    // After throwing advice
    @AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
    public void logException(JoinPoint jp, Throwable ex) {
        log.error("Exception in {}: {}", jp.getSignature().getName(), ex.getMessage());
    }

    // Around advice (most powerful — controls execution)
    @Around("serviceLayer()")
    public Object measureExecutionTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = pjp.proceed();
            long duration = System.currentTimeMillis() - start;
            log.info("{} executed in {}ms", pjp.getSignature().getName(), duration);
            return result;
        } catch (Throwable ex) {
            log.error("{} failed after {}ms", pjp.getSignature().getName(),
                System.currentTimeMillis() - start);
            throw ex;
        }
    }
}

// Custom annotation-based AOP
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String action();
}

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @Around("@annotation(auditable)")
    public Object audit(ProceedingJoinPoint pjp, Auditable auditable) throws Throwable {
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        Object result = pjp.proceed();
        auditLogRepository.save(AuditLog.builder()
            .action(auditable.action())
            .performedBy(user)
            .timestamp(LocalDateTime.now())
            .build());
        return result;
    }
}

// Usage
@Service
public class ProductService {
    @Auditable(action = "CREATE_PRODUCT")
    public ProductResponse create(ProductRequest request) { /* ... */ }

    @Auditable(action = "DELETE_PRODUCT")
    public void delete(Long id) { /* ... */ }
}
```

---

## 12. Caching

```java
// Enable caching
@Configuration
@EnableCaching
public class CacheConfig {

    // Redis cache manager
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .disableCachingNullValues()
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .withCacheConfiguration("products",
                config.entryTtl(Duration.ofHours(1)))
            .withCacheConfiguration("categories",
                config.entryTtl(Duration.ofHours(6)))
            .build();
    }
}

// Usage
@Service
@RequiredArgsConstructor
public class ProductService {

    // Cache result with key
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getById(Long id) {
        log.info("DB hit for product: {}", id);
        return productMapper.toResponse(productRepository.findById(id).orElseThrow(...));
    }

    // Cache all products
    @Cacheable(value = "products", key = "'all_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public PageResponse<ProductResponse> getAll(Pageable pageable) { /* ... */ }

    // Update cache entry
    @CachePut(value = "products", key = "#result.id")
    @Transactional
    public ProductResponse update(Long id, ProductRequest request) { /* ... */ }

    // Remove from cache
    @CacheEvict(value = "products", key = "#id")
    @Transactional
    public void delete(Long id) { /* ... */ }

    // Evict all entries in cache
    @CacheEvict(value = "products", allEntries = true)
    public void clearAllProductCache() {}

    // Conditional caching
    @Cacheable(value = "products", key = "#id", condition = "#id > 0",
               unless = "#result.stock == 0")
    public ProductResponse getByIdConditional(Long id) { /* ... */ }
}
```

---

## 13. Async & Scheduling

### 13.1 Async Processing

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) ->
            log.error("Async error in {}: {}", method.getName(), ex.getMessage());
    }
}

@Service
@Slf4j
public class NotificationService {

    // Fire and forget
    @Async
    public void sendWelcomeEmail(String email, String name) {
        log.info("Sending email to {} on thread: {}", email, Thread.currentThread().getName());
        // email sending logic...
    }

    // Return future
    @Async
    public CompletableFuture<String> processReport(Long reportId) {
        // long-running processing
        return CompletableFuture.completedFuture("Report " + reportId + " processed");
    }
}

// Calling async methods
@Service
public class OrderService {
    private final NotificationService notificationService;

    public void placeOrder(Order order) {
        // ... save order ...
        notificationService.sendWelcomeEmail(order.getEmail(), order.getName()); // non-blocking
    }

    public void generateReports(List<Long> ids) throws Exception {
        List<CompletableFuture<String>> futures = ids.stream()
            .map(notificationService::processReport)
            .toList();

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        List<String> results = futures.stream().map(CompletableFuture::join).toList();
    }
}
```

### 13.2 Scheduling

```java
@Component
@Slf4j
public class ScheduledTasks {

    // Fixed rate (every 5 minutes, regardless of execution time)
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void syncInventory() {
        log.info("Syncing inventory...");
    }

    // Fixed delay (5 min AFTER previous execution completes)
    @Scheduled(fixedDelay = 300000, initialDelay = 60000)
    public void cleanupExpiredTokens() {
        log.info("Cleaning expired tokens...");
    }

    // Cron expression
    @Scheduled(cron = "0 0 2 * * *")      // 2 AM daily
    public void dailyReport() { /* ... */ }

    @Scheduled(cron = "0 0 0 1 * *")      // 1st of every month
    public void monthlyBilling() { /* ... */ }

    @Scheduled(cron = "0 */15 8-18 * * MON-FRI")  // Every 15min, 8-6pm, weekdays
    public void businessHoursCheck() { /* ... */ }
}

// Dynamic scheduling
@Component
@RequiredArgsConstructor
public class DynamicScheduler {
    private final TaskScheduler taskScheduler;
    private ScheduledFuture<?> scheduledTask;

    public void start(String cronExpression) {
        scheduledTask = taskScheduler.schedule(
            this::performTask,
            new CronTrigger(cronExpression));
    }

    public void stop() {
        if (scheduledTask != null) scheduledTask.cancel(true);
    }

    private void performTask() {
        System.out.println("Dynamic task at: " + LocalDateTime.now());
    }
}
```

---

## 14. Spring Events

```java
// Custom event
public class OrderPlacedEvent extends ApplicationEvent {
    private final Order order;
    public OrderPlacedEvent(Object source, Order order) {
        super(source);
        this.order = order;
    }
    public Order getOrder() { return order; }
}

// Publish event
@Service
@RequiredArgsConstructor
public class OrderService {
    private final ApplicationEventPublisher eventPublisher;

    public Order placeOrder(OrderRequest request) {
        Order order = // ... save order
        eventPublisher.publishEvent(new OrderPlacedEvent(this, order));
        return order;
    }
}

// Listen to event (synchronous by default)
@Component
@Slf4j
public class OrderEventListener {

    @EventListener
    public void handleOrderPlaced(OrderPlacedEvent event) {
        log.info("Order placed: {}", event.getOrder().getId());
        // send confirmation email, update inventory, etc.
    }

    // Asynchronous listener
    @Async
    @EventListener
    public void handleOrderAsync(OrderPlacedEvent event) {
        // runs in separate thread
    }

    // Conditional listener
    @EventListener(condition = "#event.order.totalAmount > 1000")
    public void handleHighValueOrder(OrderPlacedEvent event) {
        // only for orders > $1000
    }

    // Transaction-bound event (fires AFTER successful commit)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAfterCommit(OrderPlacedEvent event) {
        // safe to send email/notifications here
    }
}
```

---

## 15. File Upload & Download

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(uploadDir));
    }

    public String store(MultipartFile file) {
        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = originalName.substring(originalName.lastIndexOf('.'));
        String fileName = UUID.randomUUID() + extension;

        try {
            if (file.isEmpty()) throw new BusinessException("EMPTY_FILE", "File is empty");
            if (originalName.contains(".."))
                throw new BusinessException("INVALID_PATH", "Invalid file path");

            Path targetLocation = Paths.get(uploadDir).resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file: " + fileName, ex);
        }
    }

    public Resource loadAsResource(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) return resource;
            throw new ResourceNotFoundException("File", "name", fileName);
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + fileName, ex);
        }
    }

    public void delete(String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        Files.deleteIfExists(filePath);
    }
}

@RestController
@RequestMapping("/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.store(file);
        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/api/v1/files/download/").path(fileName).toUriString();
        return ResponseEntity.ok(Map.of("fileName", fileName, "fileUrl", fileUrl));
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<List<Map<String, String>>> uploadMultiple(
            @RequestParam("files") MultipartFile[] files) {
        List<Map<String, String>> responses = Arrays.stream(files)
            .map(f -> {
                String name = fileStorageService.store(f);
                return Map.of("fileName", name);
            }).toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> download(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadAsResource(fileName);
        String contentType = "application/octet-stream";
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + resource.getFilename() + "\"")
            .body(resource);
    }
}
```

---

## 16. Email Sending

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;  // Thymeleaf

    @Value("${spring.mail.username}")
    private String from;

    // Simple text email
    public void sendSimple(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    // HTML email with Thymeleaf template
    public void sendHtml(String to, String subject, String template, Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);

            Context context = new Context();
            context.setVariables(variables);
            String html = templateEngine.process(template, context);
            helper.setText(html, true);

            mailSender.send(message);
            log.info("Email sent to: {}", to);
        } catch (MessagingException ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
            throw new RuntimeException("Failed to send email", ex);
        }
    }

    // Email with attachment
    public void sendWithAttachment(String to, String subject, String text,
                                   String attachmentName, byte[] attachmentData) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);
        helper.addAttachment(attachmentName, new ByteArrayResource(attachmentData));
        mailSender.send(message);
    }

    // Async sending
    @Async
    public void sendWelcomeEmail(String to, String name) {
        Map<String, Object> vars = new HashMap<>();
        vars.put("name", name);
        vars.put("year", LocalDate.now().getYear());
        sendHtml(to, "Welcome to MyApp!", "welcome-email", vars);
    }
}
```

---

## 17. WebSocket & Real-Time

```java
// WebSocket config
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");  // in-memory broker
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS();  // SockJS fallback
    }
}

// Controller
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    // Client sends to /app/chat.send
    @MessageMapping("/chat.send")
    @SendTo("/topic/public")  // broadcast to all subscribers
    public ChatMessage send(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        return message;
    }

    // Send to specific user: /user/{userId}/queue/notifications
    public void sendNotification(String userId, NotificationDTO notification) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }

    // Broadcast to topic from service
    public void broadcastUpdate(String topic, Object data) {
        messagingTemplate.convertAndSend("/topic/" + topic, data);
    }
}

// SSE (Server-Sent Events) — simpler one-way streaming
@RestController
@RequestMapping("/v1/sse")
public class SseController {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable String userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userId, emitter);
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        return emitter;
    }

    public void sendEvent(String userId, String eventName, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data));
            } catch (IOException e) {
                emitters.remove(userId);
            }
        }
    }
}
```

---

## 18. Microservices with Spring Boot

### 18.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Clients (Web/Mobile)                 │
└────────────────────────┬────────────────────────────────┘
                         │
                ┌────────▼────────┐
                │   API Gateway   │  ← Spring Cloud Gateway
                └────────┬────────┘
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌─────────────┐ ┌──────────┐ ┌────────────┐
   │ User Service│ │  Order   │ │  Product   │
   │   :8081     │ │ Service  │ │  Service   │
   │             │ │  :8082   │ │   :8083    │
   └─────────────┘ └──────────┘ └────────────┘
          │              │              │
          └──────────────┼──────────────┘
                         │
            ┌────────────▼────────────┐
            │  Service Discovery      │  ← Eureka
            │  Config Server          │  ← Spring Cloud Config
            │  Message Broker         │  ← Kafka/RabbitMQ
            └─────────────────────────┘
```

### 18.2 Inter-Service Communication (OpenFeign)

```java
// Feign client
@FeignClient(name = "product-service", url = "${services.product-service.url}",
             configuration = FeignConfig.class,
             fallbackFactory = ProductClientFallbackFactory.class)
public interface ProductServiceClient {

    @GetMapping("/api/v1/products/{id}")
    ProductResponse getProduct(@PathVariable Long id);

    @PutMapping("/api/v1/products/{id}/inventory")
    void updateInventory(@PathVariable Long id, @RequestBody InventoryRequest request);
}

// Fallback (circuit breaker)
@Component
public class ProductClientFallbackFactory implements FallbackFactory<ProductServiceClient> {
    @Override
    public ProductServiceClient create(Throwable cause) {
        return new ProductServiceClient() {
            @Override
            public ProductResponse getProduct(Long id) {
                log.error("Fallback for getProduct: {}", cause.getMessage());
                return ProductResponse.builder().id(id).name("Unavailable").build();
            }
            @Override
            public void updateInventory(Long id, InventoryRequest req) {
                log.error("Fallback for updateInventory");
            }
        };
    }
}

// Feign config
@Configuration
public class FeignConfig {
    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            // forward JWT token
            String token = SecurityContextHolder.getContext()
                .getAuthentication().getCredentials().toString();
            template.header("Authorization", "Bearer " + token);
        };
    }

    @Bean
    public Retryer retryer() {
        return new Retryer.Default(100, 1000, 3); // retry 3 times
    }
}
```

### 18.3 Event-Driven with Kafka

```java
// Producer
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {

    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public void publishOrderPlaced(Order order) {
        OrderEvent event = OrderEvent.builder()
            .eventId(UUID.randomUUID().toString())
            .eventType("ORDER_PLACED")
            .orderId(order.getId())
            .userId(order.getUserId())
            .totalAmount(order.getTotalAmount())
            .timestamp(LocalDateTime.now())
            .build();

        kafkaTemplate.send("order-events", order.getId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to send order event: {}", ex.getMessage());
                } else {
                    log.info("Order event sent: topic={}, partition={}, offset={}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
                }
            });
    }
}

// Consumer
@Service
@Slf4j
public class InventoryEventConsumer {

    @KafkaListener(topics = "order-events", groupId = "inventory-service",
                   containerFactory = "kafkaListenerContainerFactory")
    public void handleOrderEvent(OrderEvent event) {
        log.info("Received order event: type={}, orderId={}", event.getEventType(), event.getOrderId());

        switch (event.getEventType()) {
            case "ORDER_PLACED" -> reserveInventory(event);
            case "ORDER_CANCELLED" -> releaseInventory(event);
            default -> log.warn("Unknown event type: {}", event.getEventType());
        }
    }

    // Dead letter queue handler
    @KafkaListener(topics = "order-events.DLT", groupId = "inventory-dlt")
    public void handleDeadLetter(OrderEvent event) {
        log.error("Dead letter event: {}", event);
        // alert, manual review, etc.
    }
}

// Kafka config
@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic orderEventsTopic() {
        return TopicBuilder.name("order-events")
            .partitions(3)
            .replicas(1)
            .build();
    }

    @Bean
    public ProducerFactory<String, OrderEvent> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.RETRIES_CONFIG, 3);
        return new DefaultKafkaProducerFactory<>(props);
    }
}
```

---

## 19. Spring Cloud

### 19.1 API Gateway

```yaml
# application.yml for API Gateway
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE    # lb = load balanced via Eureka
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: userServiceCB
                fallbackUri: forward:/fallback/users

        - id: product-service
          uri: lb://PRODUCT-SERVICE
          predicates:
            - Path=/api/products/**
          filters:
            - StripPrefix=1
            - name: RateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200

      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin
        - name: RequestRateLimiter
          args:
            rate-limiter: "#{@redisRateLimiter}"
```

```java
// Global filter (auth validation)
@Component
@Order(1)
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter {

    private final JwtService jwtService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();

        // Skip auth for public paths
        if (isPublicPath(path)) return chain.filter(exchange);

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        if (!jwtService.isValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Add user info to headers for downstream services
        String userId = jwtService.extractUserId(token);
        ServerHttpRequest modifiedRequest = request.mutate()
            .header("X-User-Id", userId)
            .build();

        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }
}
```

### 19.2 Eureka Service Discovery

```yaml
# Eureka Server
eureka:
  instance:
    hostname: localhost
  client:
    registerWithEureka: false
    fetchRegistry: false

# Eureka Client (each microservice)
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
  instance:
    preferIpAddress: true
    leaseRenewalIntervalInSeconds: 10
```

### 19.3 Circuit Breaker (Resilience4j)

```java
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductServiceClient productClient;

    @CircuitBreaker(name = "productService", fallbackMethod = "getProductFallback")
    @Retry(name = "productService")
    @TimeLimiter(name = "productService")
    public CompletableFuture<ProductResponse> getProduct(Long id) {
        return CompletableFuture.supplyAsync(() -> productClient.getProduct(id));
    }

    public CompletableFuture<ProductResponse> getProductFallback(Long id, Throwable ex) {
        log.warn("Circuit open for product {}: {}", id, ex.getMessage());
        return CompletableFuture.completedFuture(
            ProductResponse.builder().id(id).name("Unavailable").build());
    }
}
```

```yaml
# Resilience4j config
resilience4j:
  circuitbreaker:
    instances:
      productService:
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
        permittedNumberOfCallsInHalfOpenState: 3
  retry:
    instances:
      productService:
        maxAttempts: 3
        waitDuration: 500ms
        retryExceptions:
          - java.io.IOException
  timelimiter:
    instances:
      productService:
        timeoutDuration: 3s
```

---

## 20. Production Best Practices

### 20.1 Actuator & Monitoring

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,env,loggers
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true     # /actuator/health/liveness, /actuator/health/readiness
  metrics:
    export:
      prometheus:
        enabled: true
```

```java
// Custom health indicator
@Component
public class DatabaseHealthIndicator extends AbstractHealthIndicator {

    private final DataSource dataSource;

    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    protected void doHealthCheck(Health.Builder builder) {
        try (Connection conn = dataSource.getConnection()) {
            builder.up()
                .withDetail("database", conn.getMetaData().getDatabaseProductName())
                .withDetail("url", conn.getMetaData().getURL());
        } catch (Exception ex) {
            builder.down().withException(ex);
        }
    }
}

// Custom metrics
@Component
@RequiredArgsConstructor
public class OrderMetrics {

    private final MeterRegistry meterRegistry;
    private final Counter orderCounter;
    private final Gauge activeOrdersGauge;

    @Autowired
    public OrderMetrics(MeterRegistry meterRegistry, OrderRepository orderRepository) {
        this.meterRegistry = meterRegistry;
        this.orderCounter = Counter.builder("orders.created")
            .description("Number of orders created")
            .tag("service", "order-service")
            .register(meterRegistry);

        Gauge.builder("orders.active", orderRepository, repo -> repo.countByStatus(PROCESSING))
            .description("Active orders in processing")
            .register(meterRegistry);
    }

    public void recordOrderCreated(String region) {
        meterRegistry.counter("orders.created", "region", region).increment();
    }

    public void recordProcessingTime(long ms) {
        meterRegistry.timer("orders.processing.time").record(ms, TimeUnit.MILLISECONDS);
    }
}
```

### 20.2 Logging

```yaml
logging:
  level:
    root: INFO
    com.example: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql: TRACE

  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 30
```

```java
// MDC (Mapped Diagnostic Context) for request tracing
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {
        String requestId = Optional.ofNullable(request.getHeader("X-Request-Id"))
            .orElse(UUID.randomUUID().toString());

        MDC.put("requestId", requestId);
        MDC.put("userId", extractUserId(request));
        response.addHeader("X-Request-Id", requestId);

        try {
            chain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
```

### 20.3 Docker & Deployment

```dockerfile
# Dockerfile
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY target/my-app-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/api/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      retries: 3

volumes:
  postgres_data:
```

### 20.4 Security Checklist

```yaml
# Production security settings
spring:
  security:
    headers:
      frame-options: DENY
      content-type-options: nosniff
      xss-protection: 1; mode=block
      content-security-policy: "default-src 'self'"

server:
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_PASSWORD}
    key-store-type: PKCS12
  http2:
    enabled: true
```

```java
// Rate limiting per user
@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, Integer> redisTemplate;

    private static final int MAX_REQUESTS_PER_MINUTE = 60;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {
        String key = "rate_limit:" + getClientIp(request);
        Integer count = redisTemplate.opsForValue().get(key);

        if (count != null && count >= MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("{\"error\": \"Rate limit exceeded\"}");
            return;
        }

        redisTemplate.opsForValue().increment(key);
        redisTemplate.expire(key, Duration.ofMinutes(1));
        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return (ip != null) ? ip.split(",")[0].trim() : request.getRemoteAddr();
    }
}
```

### 20.5 Performance Tips

```java
// N+1 problem — use JOIN FETCH
// BAD: triggers N queries for category
List<Product> products = productRepository.findAll(); // each product.getCategory() = new query

// GOOD: single join query
@Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.status = :status")
List<Product> findWithCategory(@Param("status") ProductStatus status);

// Or use @EntityGraph
@EntityGraph(attributePaths = {"category", "images"})
List<Product> findByStatus(ProductStatus status);

// Projection for read-only queries (faster than full entity)
@Query("SELECT new com.example.dto.ProductSummaryDTO(p.id, p.name, p.price) FROM Product p")
List<ProductSummaryDTO> findAllSummaries();

// Bulk operations (avoid per-row processing)
@Modifying
@Query("UPDATE Product p SET p.status = 'INACTIVE' WHERE p.stock = 0")
int deactivateOutOfStockProducts();

// Connection pool tuning (HikariCP)
spring:
  datasource:
    hikari:
      maximum-pool-size: 20          # CPU * 2 + spindles
      minimum-idle: 5
      connection-timeout: 20000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000

// Async for I/O-bound tasks
@Async
public CompletableFuture<Void> processExternalApiCalls(List<Long> ids) {
    List<CompletableFuture<Void>> futures = ids.stream()
        .map(id -> CompletableFuture.runAsync(() -> callExternalApi(id)))
        .toList();
    return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
}
```

### 20.6 Quick Reference: Annotations

| Annotation | Layer | Purpose |
|---|---|---|
| `@SpringBootApplication` | App | Enable auto-config + component scan |
| `@RestController` | Controller | REST controller (combines @Controller + @ResponseBody) |
| `@RequestMapping` | Controller | Base URL mapping |
| `@GetMapping` / `@PostMapping` | Controller | HTTP method mapping |
| `@PathVariable` | Controller | URL path variable |
| `@RequestParam` | Controller | Query parameter |
| `@RequestBody` | Controller | Request body (JSON→object) |
| `@Valid` | Controller | Trigger validation |
| `@Service` | Service | Business logic bean |
| `@Transactional` | Service | Transaction management |
| `@Repository` | Repository | Data access bean + exception translation |
| `@Entity` | Entity | JPA entity |
| `@Table` | Entity | Map to DB table |
| `@Id` | Entity | Primary key |
| `@Column` | Entity | Column config |
| `@ManyToOne` | Entity | Many-to-one relation |
| `@OneToMany` | Entity | One-to-many relation |
| `@Component` | Any | Generic bean |
| `@Autowired` | Any | Dependency injection |
| `@Value` | Any | Inject property value |
| `@ConfigurationProperties` | Config | Bind property group |
| `@Profile` | Config | Conditional on profile |
| `@Cacheable` | Service | Cache method result |
| `@CacheEvict` | Service | Remove cache entry |
| `@Async` | Service | Execute in thread pool |
| `@Scheduled` | Component | Schedule task |
| `@EventListener` | Component | Handle application event |
| `@PreAuthorize` | Service | Method security |
| `@ExceptionHandler` | Handler | Handle specific exception |
| `@RestControllerAdvice` | Handler | Global exception handler |

---

## Learning Path: Spring Boot Mastery

```
Week 1-2:   Spring Core → DI → Bean lifecycle → Configuration
Week 3-4:   REST APIs → Controllers → Services → JPA → Repositories
Week 5-6:   Security → JWT → Roles/Permissions → Method security
Week 7-8:   Testing → Unit → Integration → Testcontainers
Week 9-10:  Async → Caching → AOP → Events → Scheduling
Week 11-12: Microservices → Feign → Kafka → Gateway → Eureka
Week 13+:   Production → Monitoring → Docker → CI/CD → Performance
```

---

*This tutorial covers Spring Boot from first REST API to production-ready microservices. Build something real — a blog API, an inventory system, a food delivery backend — that's where the patterns click.*

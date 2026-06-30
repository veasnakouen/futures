# Advanced & Secure Java Spring Boot Concepts

---

## Table of Contents

1. [Security Architecture](#1-security-architecture)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [JWT & OAuth2 / OpenID Connect](#3-jwt--oauth2--openid-connect)
4. [Data Security & Encryption](#4-data-security--encryption)
5. [API Security Best Practices](#5-api-security-best-practices)
6. [Advanced Spring Data & JPA](#6-advanced-spring-data--jpa)
7. [Caching Strategies](#7-caching-strategies)
8. [Reactive Programming (WebFlux)](#8-reactive-programming-webflux)
9. [Messaging & Event-Driven Architecture](#9-messaging--event-driven-architecture)
10. [Observability: Logging, Metrics & Tracing](#10-observability-logging-metrics--tracing)
11. [Resilience Patterns](#11-resilience-patterns)
12. [Performance Optimization](#12-performance-optimization)
13. [Multi-Tenancy](#13-multi-tenancy)
14. [Testing Advanced Scenarios](#14-testing-advanced-scenarios)
15. [Deployment & Containerization](#15-deployment--containerization)

---

## 1. Security Architecture

### Security Filter Chain

Spring Security processes every request through an ordered chain of filters.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/items/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(customAuthEntryPoint())
                .accessDeniedHandler(customAccessDeniedHandler())
            );

        return http.build();
    }
}
```

### Custom Security Expressions

```java
@Component("securityService")
public class SecurityService {

    public boolean isOwner(Long resourceId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return resourceRepository.existsByIdAndOwnerUsername(resourceId, username);
    }
}

// Usage in Controller
@GetMapping("/{id}")
@PreAuthorize("@securityService.isOwner(#id) or hasRole('ADMIN')")
public ResponseEntity<ItemDto> getItem(@PathVariable Long id) { ... }
```

---

## 2. Authentication & Authorization

### Method-Level Security

```java
@Configuration
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class MethodSecurityConfig { }

@Service
public class ReportService {

    @PreAuthorize("hasAuthority('REPORT_READ')")
    public List<Report> getAllReports() { ... }

    @PostAuthorize("returnObject.createdBy == authentication.name or hasRole('ADMIN')")
    public Report getReport(Long id) { ... }

    @PreFilter("filterObject.active == true")
    public void processItems(List<Item> items) { ... }

    @PostFilter("filterObject.owner == authentication.name")
    public List<Item> getUserItems() { ... }
}
```

### Role Hierarchy

```java
@Bean
public RoleHierarchy roleHierarchy() {
    RoleHierarchyImpl hierarchy = new RoleHierarchyImpl();
    hierarchy.setHierarchy("""
        ROLE_SUPER_ADMIN > ROLE_ADMIN
        ROLE_ADMIN > ROLE_MANAGER
        ROLE_MANAGER > ROLE_USER
    """);
    return hierarchy;
}

@Bean
public DefaultWebSecurityExpressionHandler expressionHandler() {
    DefaultWebSecurityExpressionHandler handler = new DefaultWebSecurityExpressionHandler();
    handler.setRoleHierarchy(roleHierarchy());
    return handler;
}
```

### Custom UserDetailsService with Caching

```java
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Cacheable(value = "userDetails", key = "#username")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsernameWithRoles(username)
            .map(this::buildUserDetails)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private UserDetails buildUserDetails(User user) {
        Set<GrantedAuthority> authorities = user.getRoles().stream()
            .flatMap(role -> role.getPermissions().stream())
            .map(perm -> new SimpleGrantedAuthority(perm.getName()))
            .collect(Collectors.toSet());

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities(authorities)
            .accountExpired(!user.isActive())
            .credentialsExpired(user.isCredentialsExpired())
            .build();
    }
}
```

---

## 3. JWT & OAuth2 / OpenID Connect

### JWT Filter with Refresh Token Logic

```java
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                    );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}
```

### JWT Service with RS256 (Asymmetric Signing)

```java
@Service
public class JwtService {

    @Value("${jwt.private-key}")
    private RSAPrivateKey privateKey;

    @Value("${jwt.public-key}")
    private RSAPublicKey publicKey;

    @Value("${jwt.expiration:3600000}")
    private long expiration;

    public String generateToken(UserDetails userDetails, Map<String, Object> extraClaims) {
        return Jwts.builder()
            .claims(extraClaims)
            .subject(userDetails.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(privateKey, Jwts.SIG.RS256)
            .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername())
            && !isTokenExpired(token);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(publicKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
```

### OAuth2 Resource Server Configuration

```java
@Configuration
@EnableWebSecurity
public class OAuth2ResourceServerConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );
        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
        converter.setAuthoritiesClaimName("roles");
        converter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(converter);
        return jwtConverter;
    }
}
```

---

## 4. Data Security & Encryption

### Field-Level Encryption with JPA AttributeConverter

```java
@Component
public class EncryptionConverter implements AttributeConverter<String, String> {

    private final AesEncryptionService encryptionService;

    @Override
    public String convertToDatabaseColumn(String attribute) {
        return attribute == null ? null : encryptionService.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return dbData == null ? null : encryptionService.decrypt(dbData);
    }
}

@Entity
public class Patient {
    @Id
    private Long id;

    @Convert(converter = EncryptionConverter.class)
    @Column(name = "national_id")
    private String nationalId;

    @Convert(converter = EncryptionConverter.class)
    @Column(name = "phone_number")
    private String phoneNumber;
}
```

### AES-256 Encryption Service

```java
@Service
public class AesEncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;

    @Value("${encryption.secret-key}")
    private String secretKey;

    public String encrypt(String plaintext) {
        try {
            byte[] iv = new byte[IV_LENGTH];
            new SecureRandom().nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(), spec);

            byte[] encrypted = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
            byte[] combined = new byte[iv.length + encrypted.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new EncryptionException("Encryption failed", e);
        }
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return new SecretKeySpec(keyBytes, "AES");
    }
}
```

### Preventing SQL Injection (Always use Parameterized Queries)

```java
// UNSAFE — Never do this
String query = "SELECT * FROM users WHERE name = '" + name + "'";

// SAFE — Named parameters with Spring Data JPA
@Query("SELECT u FROM User u WHERE u.username = :username AND u.active = :active")
Optional<User> findByUsernameAndActive(@Param("username") String username,
                                        @Param("active") boolean active);

// SAFE — Criteria API
public List<User> findUsers(String name, String email) {
    CriteriaBuilder cb = em.getCriteriaBuilder();
    CriteriaQuery<User> cq = cb.createQuery(User.class);
    Root<User> root = cq.from(User.class);

    List<Predicate> predicates = new ArrayList<>();
    if (name != null) predicates.add(cb.like(root.get("name"), "%" + name + "%"));
    if (email != null) predicates.add(cb.equal(root.get("email"), email));

    cq.where(cb.and(predicates.toArray(new Predicate[0])));
    return em.createQuery(cq).getResultList();
}
```

---

## 5. API Security Best Practices

### Rate Limiting with Bucket4j

```java
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        return Bucket.builder()
            .addLimit(Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1))))
            .build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String key = getClientKey(request);
        Bucket bucket = buckets.computeIfAbsent(key, k -> createNewBucket());

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("{\"error\": \"Rate limit exceeded\"}");
        }
    }

    private String getClientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        return forwardedFor != null ? forwardedFor.split(",")[0] : request.getRemoteAddr();
    }
}
```

### Security Headers Configuration

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.headers(headers -> headers
        .contentSecurityPolicy(csp ->
            csp.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self'")
        )
        .frameOptions(frame -> frame.deny())
        .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
        .referrerPolicy(ref -> ref.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
        .permissionsPolicy(perm ->
            perm.policy("geolocation=(), camera=(), microphone=()")
        )
    );
    return http.build();
}
```

### Input Validation & Sanitization

```java
@RestController
@Validated
public class UserController {

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.create(request));
    }
}

public record CreateUserRequest(
    @NotBlank @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Username must be alphanumeric")
    String username,

    @NotBlank @Email
    String email,

    @NotBlank @Size(min = 8, max = 100)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
             message = "Password must meet complexity requirements")
    String password
) {}
```

### CORS Configuration

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://yourapp.com", "https://admin.yourapp.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Request-ID"));
        config.setExposedHeaders(List.of("X-Total-Count", "X-Request-ID"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
```

---

## 6. Advanced Spring Data & JPA

### Specifications for Dynamic Queries

```java
public class UserSpecifications {

    public static Specification<User> hasRole(String role) {
        return (root, query, cb) ->
            cb.isMember(role, root.get("roles"));
    }

    public static Specification<User> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("active"));
    }

    public static Specification<User> createdAfter(LocalDate date) {
        return (root, query, cb) ->
            cb.greaterThanOrEqualTo(root.get("createdAt"), date.atStartOfDay());
    }

    public static Specification<User> nameLike(String name) {
        return (root, query, cb) ->
            cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
}

// Usage
Specification<User> spec = Specification.where(UserSpecifications.isActive())
    .and(UserSpecifications.hasRole("MANAGER"))
    .and(UserSpecifications.createdAfter(LocalDate.now().minusMonths(6)));

Page<User> users = userRepository.findAll(spec, PageRequest.of(0, 20, Sort.by("name")));
```

### Auditing with Spring Data

```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .map(Authentication::getName);
    }
}

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String lastModifiedBy;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### Optimistic Locking & Pessimistic Locking

```java
@Entity
public class Inventory extends Auditable {

    @Id
    private Long id;

    private Integer quantity;

    @Version
    private Long version; // Optimistic locking
}

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // Pessimistic write lock
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.id = :id")
    Optional<Inventory> findByIdWithLock(@Param("id") Long id);
}
```

### N+1 Problem Solutions

```java
// Problem: N+1 queries
List<Order> orders = orderRepository.findAll(); // 1 query
orders.forEach(o -> o.getItems().size()); // N queries

// Solution 1: JOIN FETCH
@Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.status = :status")
List<Order> findByStatusWithItems(@Param("status") OrderStatus status);

// Solution 2: @EntityGraph
@EntityGraph(attributePaths = {"items", "items.product", "customer"})
List<Order> findByStatus(OrderStatus status);

// Solution 3: Batch Fetching in properties
// spring.jpa.properties.hibernate.default_batch_fetch_size=20
```

---

## 7. Caching Strategies

### Multi-Level Cache with Redis

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()))
            .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> configs = Map.of(
            "products", defaultConfig.entryTtl(Duration.ofHours(1)),
            "userDetails", defaultConfig.entryTtl(Duration.ofMinutes(5)),
            "reports", defaultConfig.entryTtl(Duration.ofHours(24))
        );

        return RedisCacheManager.builder(factory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(configs)
            .build();
    }
}

@Service
public class ProductService {

    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public ProductDto getProduct(Long id) { ... }

    @CachePut(value = "products", key = "#result.id")
    public ProductDto updateProduct(Long id, UpdateProductRequest request) { ... }

    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) { ... }

    @Caching(evict = {
        @CacheEvict(value = "products", allEntries = true),
        @CacheEvict(value = "reports", allEntries = true)
    })
    public void clearAllCaches() { }
}
```

---

## 8. Reactive Programming (WebFlux)

### Reactive REST Controller

```java
@RestController
@RequestMapping("/api/reactive")
@RequiredArgsConstructor
public class ReactiveProductController {

    private final ProductRepository productRepository;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Product> streamProducts() {
        return productRepository.findAll()
            .delayElements(Duration.ofMillis(100));
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Product>> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Product> createProduct(@Valid @RequestBody Mono<CreateProductRequest> request) {
        return request
            .flatMap(req -> productRepository.save(Product.from(req)))
            .doOnSuccess(p -> log.info("Product created: {}", p.getId()));
    }
}
```

### Reactive Security

```java
@Configuration
@EnableWebFluxSecurity
public class ReactiveSecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/api/public/**").permitAll()
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .build();
    }
}
```

---

## 9. Messaging & Event-Driven Architecture

### Application Events (In-Process)

```java
// Domain Event
public record OrderPlacedEvent(Long orderId, String customerEmail, BigDecimal total)
    implements ApplicationEvent { }

// Publisher
@Service
@RequiredArgsConstructor
public class OrderService {

    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public Order placeOrder(PlaceOrderRequest request) {
        Order order = orderRepository.save(Order.from(request));
        eventPublisher.publishEvent(new OrderPlacedEvent(order.getId(),
            order.getCustomerEmail(), order.getTotal()));
        return order;
    }
}

// Listener
@Component
@RequiredArgsConstructor
public class OrderEventListener {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderPlaced(OrderPlacedEvent event) {
        emailService.sendOrderConfirmation(event.customerEmail(), event.orderId());
    }
}
```

### Kafka Integration

```java
@Service
@RequiredArgsConstructor
public class OrderKafkaPublisher {

    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public void publish(OrderEvent event) {
        kafkaTemplate.send("orders.placed", event.orderId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish order event: {}", event.orderId(), ex);
                } else {
                    log.info("Order event published to partition {} at offset {}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
                }
            });
    }
}

@Component
@RequiredArgsConstructor
public class OrderKafkaConsumer {

    @KafkaListener(topics = "orders.placed", groupId = "notification-service",
                   containerFactory = "orderKafkaListenerFactory")
    public void consume(OrderEvent event, Acknowledgment ack) {
        try {
            notificationService.notify(event);
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Error processing order event: {}", event, e);
            // Dead letter queue handling
        }
    }
}
```

### Outbox Pattern (Transactional Messaging)

```java
@Entity
public class OutboxEvent {
    @Id @GeneratedValue
    private UUID id;
    private String aggregateType;
    private String aggregateId;
    private String eventType;
    @Column(columnDefinition = "jsonb")
    private String payload;
    private boolean processed;
    private LocalDateTime createdAt;
}

@Service
@Transactional
public class OrderService {

    public Order placeOrder(PlaceOrderRequest request) {
        Order order = orderRepository.save(Order.from(request));

        // Save event in same transaction — guarantees atomicity
        outboxRepository.save(OutboxEvent.of("ORDER", order.getId().toString(),
            "ORDER_PLACED", objectMapper.writeValueAsString(order)));

        return order;
    }
}

// Scheduled poller publishes outbox events to Kafka
@Scheduled(fixedDelay = 1000)
@Transactional
public void publishPendingEvents() {
    outboxRepository.findUnprocessed(PageRequest.of(0, 50)).forEach(event -> {
        kafkaTemplate.send(event.getEventType(), event.getPayload());
        event.setProcessed(true);
    });
}
```

---

## 10. Observability: Logging, Metrics & Tracing

### Structured Logging with MDC

```java
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId);
        MDC.put("method", request.getMethod());
        MDC.put("uri", request.getRequestURI());

        String username = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .map(Authentication::getName).orElse("anonymous");
        MDC.put("user", username);

        try {
            chain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
```

### Custom Actuator Endpoint

```java
@Component
@Endpoint(id = "app-health")
public class AppHealthEndpoint {

    private final DataSource dataSource;
    private final RedisTemplate<?, ?> redisTemplate;

    @ReadOperation
    public Map<String, Object> health() {
        return Map.of(
            "database", checkDatabase(),
            "redis", checkRedis(),
            "version", getClass().getPackage().getImplementationVersion()
        );
    }

    private String checkDatabase() {
        try (var conn = dataSource.getConnection()) {
            return conn.isValid(2) ? "UP" : "DOWN";
        } catch (Exception e) { return "DOWN"; }
    }
}
```

### Micrometer Custom Metrics

```java
@Service
@RequiredArgsConstructor
public class OrderMetricsService {

    private final MeterRegistry meterRegistry;
    private final AtomicInteger activeOrders = new AtomicInteger(0);

    @PostConstruct
    public void init() {
        Gauge.builder("orders.active", activeOrders, AtomicInteger::get)
            .description("Number of active orders")
            .register(meterRegistry);
    }

    public void recordOrderPlaced(BigDecimal amount, String region) {
        meterRegistry.counter("orders.placed",
            "region", region,
            "currency", "USD"
        ).increment();

        meterRegistry.summary("orders.amount", "region", region).record(amount.doubleValue());
        activeOrders.incrementAndGet();
    }
}
```

---

## 11. Resilience Patterns

### Resilience4j — Circuit Breaker, Retry, Bulkhead

```java
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentGatewayClient client;

    @CircuitBreaker(name = "paymentGateway", fallbackMethod = "paymentFallback")
    @Retry(name = "paymentGateway")
    @Bulkhead(name = "paymentGateway", type = Bulkhead.Type.SEMAPHORE)
    @TimeLimiter(name = "paymentGateway")
    public CompletableFuture<PaymentResult> processPayment(PaymentRequest request) {
        return CompletableFuture.supplyAsync(() -> client.process(request));
    }

    public CompletableFuture<PaymentResult> paymentFallback(PaymentRequest request, Exception ex) {
        log.warn("Payment gateway unavailable, using fallback", ex);
        return CompletableFuture.completedFuture(PaymentResult.pending(request.getOrderId()));
    }
}
```

**application.yml configuration:**

```yaml
resilience4j:
  circuitbreaker:
    instances:
      paymentGateway:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
        permittedNumberOfCallsInHalfOpenState: 3
  retry:
    instances:
      paymentGateway:
        maxAttempts: 3
        waitDuration: 500ms
        retryExceptions:
          - java.net.ConnectException
          - java.util.concurrent.TimeoutException
  bulkhead:
    instances:
      paymentGateway:
        maxConcurrentCalls: 10
        maxWaitDuration: 100ms
```

---

## 12. Performance Optimization

### Async Processing

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}

@Service
public class ReportService {

    @Async("taskExecutor")
    public CompletableFuture<Report> generateReport(ReportRequest request) {
        // Long-running operation
        Report report = buildComplexReport(request);
        return CompletableFuture.completedFuture(report);
    }
}
```

### Cursor-Based Pagination

```java
public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("SELECT i FROM Item i WHERE i.id > :cursor ORDER BY i.id ASC")
    List<Item> findAfterCursor(@Param("cursor") Long cursor, Pageable pageable);
}

@Service
public class ItemService {

    public CursorPage<ItemDto> getItems(Long cursor, int pageSize) {
        List<Item> items = itemRepository.findAfterCursor(
            cursor != null ? cursor : 0L,
            PageRequest.of(0, pageSize + 1)
        );

        boolean hasNext = items.size() > pageSize;
        List<Item> content = hasNext ? items.subList(0, pageSize) : items;
        Long nextCursor = hasNext ? content.get(content.size() - 1).getId() : null;

        return new CursorPage<>(content.stream().map(itemMapper::toDto).toList(),
            nextCursor, hasNext);
    }
}
```

### Lazy Loading vs Projection

```java
// Projection — fetch only what you need
public interface UserSummary {
    Long getId();
    String getUsername();
    String getEmail();
}

public interface UserRepository extends JpaRepository<User, Long> {
    List<UserSummary> findAllProjectedBy();

    // DTO Projection
    @Query("SELECT new com.example.dto.UserDto(u.id, u.username, u.email) FROM User u")
    List<UserDto> findAllAsDto();
}
```

---

## 13. Multi-Tenancy

### Schema-Based Multi-Tenancy with Hibernate

```java
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {

    @Override
    public String resolveCurrentTenantIdentifier() {
        return TenantContext.getCurrentTenant() != null
            ? TenantContext.getCurrentTenant()
            : "public";
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}

public class SchemaMultiTenantConnectionProvider implements MultiTenantConnectionProvider {

    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
        Connection connection = getAnyConnection();
        connection.createStatement().execute("SET search_path TO " + tenantIdentifier);
        return connection;
    }
}

// Tenant filter
@Component
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String tenantId = resolveTenantId(request);
        TenantContext.setCurrentTenant(tenantId);
        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private String resolveTenantId(HttpServletRequest request) {
        // Could come from subdomain, header, or JWT claim
        String host = request.getServerName();
        return host.split("\\.")[0]; // e.g., "acme" from "acme.yourapp.com"
    }
}
```

---

## 14. Testing Advanced Scenarios

### Integration Testing with Security

```java
@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturnOrdersForAuthenticatedUser() throws Exception {
        mockMvc.perform(get("/api/orders")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/orders"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturn403WhenAccessingAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
            .andExpect(status().isForbidden());
    }
}
```

### Testcontainers for Integration Tests

```java
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class RepositoryIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7")
        .withExposedPorts(6379);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }
}
```

### Slice Tests

```java
// Test only the web layer
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ProductService productService;

    @Test
    void shouldReturnProduct() throws Exception {
        given(productService.getProduct(1L))
            .willReturn(new ProductDto(1L, "Widget", BigDecimal.TEN));

        mockMvc.perform(get("/api/products/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Widget"));
    }
}

// Test only the persistence layer
@DataJpaTest
class UserRepositoryTest {

    @Autowired private UserRepository userRepository;

    @Test
    void shouldFindUserByEmail() {
        User saved = userRepository.save(User.builder()
            .username("veasna").email("veasna@example.com").build());

        Optional<User> found = userRepository.findByEmail("veasna@example.com");
        assertThat(found).isPresent().get().isEqualTo(saved);
    }
}
```

---

## 15. Deployment & Containerization

### Production-Ready Dockerfile

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -q
COPY src ./src
RUN ./mvnw package -DskipTests -q

# Stage 2: Extract layers
FROM eclipse-temurin:21-jdk AS layers
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Stage 3: Final image
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring

COPY --from=layers /app/dependencies ./
COPY --from=layers /app/spring-boot-loader ./
COPY --from=layers /app/snapshot-dependencies ./
COPY --from=layers /app/application ./

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "org.springframework.boot.loader.launch.JarLauncher"]
```

### Security Hardening Checklist

```yaml
# application-prod.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000

  jpa:
    show-sql: false
    open-in-view: false

server:
  error:
    include-stacktrace: never
    include-message: never
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
    key-store-type: PKCS12

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
  server:
    port: 8081  # Separate management port
```

---

## Quick Reference: Security Checklist

| Area | Practice |
|---|---|
| **Authentication** | Use bcrypt/argon2 for passwords, short-lived JWT tokens |
| **Authorization** | Principle of least privilege, method-level security |
| **Transport** | Enforce HTTPS, HSTS header, TLS 1.2+ |
| **Input** | Validate all inputs, parameterized queries only |
| **Headers** | CSP, X-Frame-Options, X-XSS-Protection |
| **Dependencies** | Regularly audit with `mvn dependency-check` |
| **Secrets** | Never hardcode secrets, use Vault or env vars |
| **Logging** | Log security events, never log passwords or tokens |
| **Rate Limiting** | Protect all endpoints, especially auth endpoints |
| **Encryption** | Encrypt PII at rest, use AES-256-GCM |
| **Sessions** | Stateless JWT preferred, invalidate on logout |
| **Error Handling** | Generic error messages to clients, details in logs only |

---

*Document covers Spring Boot 3.x, Spring Security 6.x, Java 21+*

# Advanced Spring Boot Microservices Tutorial
> Gradle vs Maven · Data Structures & Algorithms for Performance · User Management with Auth & RBAC

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Setup: Gradle vs Maven](#2-project-setup-gradle-vs-maven)
3. [Service Structure & Module Design](#3-service-structure--module-design)
4. [Data Structures & Algorithms for Microservice Performance](#4-data-structures--algorithms-for-microservice-performance)
5. [User Management Service — Auth + RBAC](#5-user-management-service--auth--rbac)
6. [Inter-Service Communication](#6-inter-service-communication)
7. [API Gateway & Load Balancing](#7-api-gateway--load-balancing)
8. [Caching Layer](#8-caching-layer)
9. [Observability — Logging, Tracing, Metrics](#9-observability--logging-tracing-metrics)
10. [Docker & Kubernetes Deployment](#10-docker--kubernetes-deployment)
11. [Performance Benchmark Patterns](#11-performance-benchmark-patterns)

---

## 1. Architecture Overview

```
                          ┌──────────────────────────────────────────┐
                          │             API Gateway (port 8080)       │
                          │         Spring Cloud Gateway + JWT Filter  │
                          └──────────────┬───────────────────────────┘
                                         │
              ┌──────────────────────────┼───────────────────────────┐
              │                          │                           │
   ┌──────────▼──────────┐  ┌───────────▼──────────┐  ┌────────────▼────────────┐
   │  User-Auth Service  │  │   Product Service     │  │   Order Service         │
   │  (port 8081)        │  │   (port 8082)         │  │   (port 8083)           │
   │  JWT + RBAC         │  │   Catalog, Search     │  │   Orders, Transactions  │
   └──────────┬──────────┘  └───────────┬──────────┘  └────────────┬────────────┘
              │                          │                           │
   ┌──────────▼──────────────────────────▼───────────────────────────▼────────────┐
   │                        Service Registry (Eureka / port 8761)                  │
   └────────────────────────────────────────────────────────────────────────────────┘
              │                          │                           │
   ┌──────────▼──────────┐  ┌───────────▼──────────┐  ┌────────────▼────────────┐
   │   PostgreSQL (Auth) │  │  PostgreSQL (Product) │  │  PostgreSQL (Order)     │
   └─────────────────────┘  └──────────────────────┘  └─────────────────────────┘
              │
   ┌──────────▼──────────┐
   │   Redis (Cache +    │
   │   Session + Rate    │
   │   Limiting)         │
   └─────────────────────┘
```

### Core Principles Applied

| Principle | Implementation |
|-----------|----------------|
| Single Responsibility | Each service owns one bounded context |
| Database per Service | No shared schemas between services |
| API First | OpenAPI 3 specs before code |
| Fail Fast | Circuit Breakers via Resilience4j |
| Stateless Auth | JWT — no server-side sessions |
| Event Driven | Kafka for async operations |

---

## 2. Project Setup: Gradle vs Maven

### 2.1 Build Tool Comparison

| Feature | Gradle | Maven |
|---------|--------|-------|
| Build Speed | ✅ Faster (incremental + caching) | ❌ Slower (full lifecycle) |
| Configuration | Groovy/Kotlin DSL (concise) | XML (verbose) |
| Flexibility | ✅ Highly flexible | ❌ Convention-bound |
| IDE Support | ✅ Excellent | ✅ Excellent |
| Learning Curve | Steeper | Gentler |
| Multi-project Build | ✅ First-class support | ⚠️ Possible but complex |
| Dependency Lock | ✅ `gradle.lockfile` | ✅ `pom.xml` managed |
| Best For | Large, multi-module mono-repos | Teams preferring convention |

**Verdict for Microservices:** Gradle wins in multi-module setups. Maven is safer for regulated environments.

---

### 2.2 Maven — Multi-Module Setup

**Root `pom.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>microservices-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>api-gateway</module>
        <module>user-auth-service</module>
        <module>product-service</module>
        <module>order-service</module>
        <module>common-lib</module>
    </modules>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>21</java.version>
        <spring-cloud.version>2023.0.2</spring-cloud.version>
        <jjwt.version>0.12.5</jjwt.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Spring Cloud BOM -->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- JWT -->
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-api</artifactId>
                <version>${jjwt.version}</version>
            </dependency>
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-impl</artifactId>
                <version>${jjwt.version}</version>
            </dependency>
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-jackson</artifactId>
                <version>${jjwt.version}</version>
            </dependency>

            <!-- Common Lib (internal) -->
            <dependency>
                <groupId>com.example</groupId>
                <artifactId>common-lib</artifactId>
                <version>${project.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                    <configuration>
                        <excludes>
                            <exclude>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                            </exclude>
                        </excludes>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

**Service-Level `pom.xml` (user-auth-service)**

```xml
<project>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>microservices-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>user-auth-service</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>common-lib</artifactId>
        </dependency>
    </dependencies>
</project>
```

---

### 2.3 Gradle — Multi-Module Setup (Kotlin DSL)

**Root `settings.gradle.kts`**

```kotlin
rootProject.name = "microservices-parent"

include(
    "api-gateway",
    "user-auth-service",
    "product-service",
    "order-service",
    "common-lib"
)
```

**Root `build.gradle.kts`**

```kotlin
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    id("org.springframework.boot") version "3.3.0" apply false
    id("io.spring.dependency-management") version "1.1.5" apply false
    kotlin("jvm") version "1.9.24" apply false
    kotlin("plugin.spring") version "1.9.24" apply false
    kotlin("plugin.jpa") version "1.9.24" apply false
}

// Shared config across all subprojects
subprojects {
    apply(plugin = "java")
    apply(plugin = "io.spring.dependency-management")

    group = "com.example"
    version = "1.0.0-SNAPSHOT"

    configure<JavaPluginExtension> {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }

    val springCloudVersion = "2023.0.2"
    val jjwtVersion = "0.12.5"

    configure<io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension> {
        imports {
            mavenBom("org.springframework.cloud:spring-cloud-dependencies:$springCloudVersion")
        }
        dependencies {
            dependency("io.jsonwebtoken:jjwt-api:$jjwtVersion")
            dependency("io.jsonwebtoken:jjwt-impl:$jjwtVersion")
            dependency("io.jsonwebtoken:jjwt-jackson:$jjwtVersion")
        }
    }

    repositories {
        mavenCentral()
    }

    // Skip bootJar for non-boot modules (like common-lib)
    tasks.withType<BootJar> {
        enabled = false
    }
    tasks.withType<Jar> {
        enabled = true
    }
}
```

**`user-auth-service/build.gradle.kts`**

```kotlin
plugins {
    id("org.springframework.boot")
    id("io.spring.dependency-management")
    java
    id("org.projectlombok.lombok") version "8.6"
}

tasks.withType<org.springframework.boot.gradle.tasks.bundling.BootJar> {
    enabled = true  // This IS a boot app
    archiveFileName.set("user-auth-service.jar")
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springframework.cloud:spring-cloud-starter-netflix-eureka-client")

    // JWT
    implementation("io.jsonwebtoken:jjwt-api")
    runtimeOnly("io.jsonwebtoken:jjwt-impl")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson")

    // DB
    runtimeOnly("org.postgresql:postgresql")

    // Internal
    implementation(project(":common-lib"))

    // Lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
}
```

---

### 2.4 Gradle Dependency Locking (Production Must-Have)

```bash
# Generate lock files for all configurations
./gradlew dependencies --write-locks

# Verify locks on CI
./gradlew dependencies --verify-locks
```

Add to `build.gradle.kts`:

```kotlin
dependencyLocking {
    lockAllConfigurations()
    lockFile.set(file("$projectDir/gradle.lockfile"))
}
```

---

## 3. Service Structure & Module Design

### 3.1 Hexagonal Architecture (Ports & Adapters)

```
user-auth-service/
├── src/main/java/com/example/auth/
│   ├── application/                  ← Use cases / application services
│   │   ├── port/
│   │   │   ├── in/                   ← Driving ports (interfaces)
│   │   │   │   ├── AuthUseCase.java
│   │   │   │   └── UserManagementUseCase.java
│   │   │   └── out/                  ← Driven ports (interfaces)
│   │   │       ├── UserRepository.java
│   │   │       └── TokenBlacklistPort.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       └── UserService.java
│   ├── domain/                       ← Pure domain logic (no Spring dependencies!)
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Role.java
│   │   │   └── Permission.java
│   │   └── exception/
│   │       ├── UserNotFoundException.java
│   │       └── InvalidTokenException.java
│   ├── infrastructure/               ← Adapters (Spring, JPA, Redis)
│   │   ├── persistence/
│   │   │   ├── entity/
│   │   │   │   └── UserEntity.java
│   │   │   ├── repository/
│   │   │   │   └── JpaUserRepository.java
│   │   │   └── adapter/
│   │   │       └── UserPersistenceAdapter.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── SecurityConfig.java
│   │   └── redis/
│   │       └── RedisTokenBlacklistAdapter.java
│   └── web/                          ← REST Controllers (adapter)
│       ├── AuthController.java
│       ├── UserController.java
│       └── dto/
│           ├── LoginRequest.java
│           ├── RegisterRequest.java
│           └── TokenResponse.java
```

---

## 4. Data Structures & Algorithms for Microservice Performance

This is the most critical section for building enterprise-grade services. Below are concrete implementations for real production scenarios.

---

### 4.1 Token Blacklist — Bloom Filter (Space-Efficient, O(1))

**Problem:** Invalidated JWTs must be tracked. A naive `HashSet` holding millions of UUIDs wastes memory.

**Solution:** Bloom Filter — probabilistic, ~10 bits per element, O(1) lookup.

```java
// Dependency (Gradle): implementation("com.google.guava:guava:32.1.3-jre")

import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklistService {

    /**
     * Bloom Filter: probabilistic set membership check.
     *
     * Space complexity: O(n * m / ln(2)) bits  where m is bits per element
     * Insert: O(k)  where k is number of hash functions
     * Query:  O(k)
     * False positives: ~1% at expectedInsertions=1_000_000, fpp=0.01
     * False negatives: NEVER — cannot miss a truly blacklisted token
     */
    private final BloomFilter<String> bloomFilter = BloomFilter.create(
        Funnels.stringFunnel(StandardCharsets.UTF_8),
        1_000_000,   // expected number of blacklisted tokens
        0.01         // 1% false positive rate
    );

    // Secondary precise store for tokens within a 24h window (bounded size)
    private final ConcurrentHashMap<String, Long> preciseBlacklist = new ConcurrentHashMap<>();

    public void blacklist(String jti, long expiryEpochMillis) {
        bloomFilter.put(jti);
        preciseBlacklist.put(jti, expiryEpochMillis);
    }

    public boolean isBlacklisted(String jti) {
        // Fast path: bloom filter says NOT blacklisted → definitely valid
        if (!bloomFilter.mightContain(jti)) {
            return false; // O(k), guaranteed correct
        }
        // Slow path: bloom says MAYBE blacklisted → confirm in precise map
        Long expiry = preciseBlacklist.get(jti);
        if (expiry == null) return false; // false positive from bloom
        if (System.currentTimeMillis() > expiry) {
            preciseBlacklist.remove(jti); // TTL cleanup
            return false;
        }
        return true;
    }

    /**
     * Periodic cleanup — runs via @Scheduled
     * Time complexity: O(n) where n = preciseBlacklist size
     */
    public void evictExpired() {
        long now = System.currentTimeMillis();
        preciseBlacklist.entrySet().removeIf(e -> now > e.getValue());
    }
}
```

---

### 4.2 Rate Limiting — Sliding Window Counter (O(1) per request)

**Problem:** API Gateway must prevent abuse without complex distributed locking.

**Algorithm:** Sliding Window Log vs Sliding Window Counter.

```
Sliding Window Log: accurate, O(n) space per user
Sliding Window Counter: approximate, O(1) space per user — preferred for high-traffic
```

```java
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import java.time.Duration;

@Component
public class SlidingWindowRateLimiter {

    private final RedisTemplate<String, String> redisTemplate;

    // Window = 60 seconds, limit = 100 requests per user
    private static final long WINDOW_MILLIS  = 60_000L;
    private static final long WINDOW_SECONDS = 60L;
    private static final int  MAX_REQUESTS   = 100;

    public SlidingWindowRateLimiter(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Algorithm:
     *  - Divide time into fixed 1-second slots
     *  - Key = "rate:userId:currentSlot"
     *  - Sum counts from currentSlot - windowSize to currentSlot
     *
     * Time:  O(W) where W = window size in seconds (60 here)
     * Space: O(W) keys per user in Redis (auto-expire)
     */
    public boolean isAllowed(String userId) {
        long now = System.currentTimeMillis();
        long currentSlot = now / 1000; // 1-second granularity

        String pipeline = redisTemplate.execute(connection -> {
            long total = 0;
            for (long slot = currentSlot - WINDOW_SECONDS + 1; slot <= currentSlot; slot++) {
                String key = "rate:" + userId + ":" + slot;
                String val = (String) connection.stringCommands().get(key.getBytes());
                if (val != null) total += Long.parseLong(val);
            }
            return total;
        }, true);

        if (getTotalRequests(userId, currentSlot) >= MAX_REQUESTS) {
            return false; // RATE LIMITED
        }

        // Increment current slot
        String key = "rate:" + userId + ":" + currentSlot;
        redisTemplate.opsForValue().increment(key);
        redisTemplate.expire(key, Duration.ofSeconds(WINDOW_SECONDS + 1));
        return true;
    }

    private long getTotalRequests(String userId, long currentSlot) {
        long total = 0;
        for (long slot = currentSlot - WINDOW_SECONDS + 1; slot <= currentSlot; slot++) {
            String key = "rate:" + userId + ":" + slot;
            String val = redisTemplate.opsForValue().get(key);
            if (val != null) total += Long.parseLong(val);
        }
        return total;
    }
}
```

---

### 4.3 Permission Lookup — Trie for Role Hierarchy (O(m) Lookup)

**Problem:** Role-based permission matching often involves prefix patterns like `ORDER:READ`, `ORDER:WRITE`, `ORDER:*`.

**Algorithm:** Trie (Prefix Tree) for O(m) permission lookup where m = permission string length.

```java
import java.util.*;

/**
 * Trie-based permission resolver for hierarchical RBAC.
 *
 * Supports wildcard permissions: "ORDER:*" grants all ORDER sub-permissions.
 *
 * Time complexity:
 *   Insert: O(m)  — m = length of permission string
 *   Search: O(m)
 * Space complexity: O(SIGMA * N * M)
 *   SIGMA = alphabet (characters), N = number of permissions, M = avg length
 */
public class PermissionTrie {

    private static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isTerminal = false;
        boolean isWildcard = false;
    }

    private final TrieNode root = new TrieNode();

    public void insert(String permission) {
        TrieNode current = root;
        for (char ch : permission.toCharArray()) {
            if (ch == '*') {
                current.isWildcard = true;
                return; // wildcard means all sub-paths match
            }
            current.children.putIfAbsent(ch, new TrieNode());
            current = current.children.get(ch);
        }
        current.isTerminal = true;
    }

    /**
     * Check if a required permission is granted.
     * Handles exact matches AND wildcard parent grants.
     *
     * Example: inserted "ORDER:*" → hasPermission("ORDER:READ") → true
     */
    public boolean hasPermission(String required) {
        TrieNode current = root;
        for (char ch : required.toCharArray()) {
            if (current.isWildcard) return true; // parent wildcard covers this
            if (!current.children.containsKey(ch)) return false;
            current = current.children.get(ch);
        }
        return current.isTerminal || current.isWildcard;
    }

    public static PermissionTrie buildForUser(List<String> permissions) {
        PermissionTrie trie = new PermissionTrie();
        permissions.forEach(trie::insert);
        return trie;
    }
}
```

**Usage in Security Context:**

```java
@Component
public class PermissionEvaluator {

    public boolean hasPermission(Authentication auth, String requiredPermission) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();

        // Build trie from user's effective permissions (roles expanded)
        PermissionTrie trie = PermissionTrie.buildForUser(user.getEffectivePermissions());
        return trie.hasPermission(requiredPermission);
    }
}
```

---

### 4.4 Request Deduplication — LRU Cache (O(1) Get/Put)

**Problem:** Network retries cause duplicate order creation, payment charges, etc.

**Solution:** Idempotency keys checked via an LRU Cache backed by Redis.

```java
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * In-memory LRU Cache using LinkedHashMap with access-order=true.
 *
 * Get:    O(1) average — HashMap lookup
 * Put:    O(1) average — HashMap insert + doubly-linked list reorder
 * Evict:  O(1) — remove eldest entry (tail of list)
 *
 * Use this as L1 cache; Redis as L2 for cross-instance deduplication.
 */
public class LRUIdempotencyCache<K, V> extends LinkedHashMap<K, V> {

    private final int maxCapacity;

    public LRUIdempotencyCache(int maxCapacity) {
        // accessOrder=true: moves accessed entries to head (MRU position)
        super(maxCapacity, 0.75f, true);
        this.maxCapacity = maxCapacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > maxCapacity; // evict LRU when full
    }

    // Thread-safe wrapper
    public static <K, V> Map<K, V> newSynchronizedLRU(int capacity) {
        return java.util.Collections.synchronizedMap(new LRUIdempotencyCache<>(capacity));
    }
}
```

**Idempotency Filter:**

```java
@Component
@Order(1)
public class IdempotencyFilter extends OncePerRequestFilter {

    private final Map<String, ResponseWrapper> l1Cache =
        LRUIdempotencyCache.newSynchronizedLRU(10_000);
    private final RedisTemplate<String, String> redis;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {

        String idempotencyKey = request.getHeader("Idempotency-Key");
        if (idempotencyKey == null || !isWriteMethod(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        // L1 check (in-process, O(1))
        if (l1Cache.containsKey(idempotencyKey)) {
            replayResponse(response, l1Cache.get(idempotencyKey));
            return;
        }

        // L2 check (Redis, cross-instance)
        String cached = redis.opsForValue().get("idem:" + idempotencyKey);
        if (cached != null) {
            // Populate L1 and replay
            replayResponse(response, deserialize(cached));
            return;
        }

        // Process request and cache result
        CachingResponseWrapper wrapper = new CachingResponseWrapper(response);
        chain.doFilter(request, wrapper);
        ResponseWrapper result = ResponseWrapper.of(wrapper.getStatus(), wrapper.getCachedBody());
        l1Cache.put(idempotencyKey, result);
        redis.opsForValue().set("idem:" + idempotencyKey, serialize(result),
            Duration.ofHours(24));
    }

    private boolean isWriteMethod(String method) {
        return method.equals("POST") || method.equals("PUT") || method.equals("PATCH");
    }
}
```

---

### 4.5 Cursor Pagination — Skip List Inspired (O(log n) Seek)

**Problem:** `OFFSET n` in SQL is O(n) — terrible at page 50,000. Use keyset/cursor pagination.

```java
/**
 * Cursor Pagination using keyset seek.
 *
 * SQL: SELECT * FROM orders
 *      WHERE (created_at, id) < (:cursorTimestamp, :cursorId)
 *      ORDER BY created_at DESC, id DESC
 *      LIMIT :pageSize
 *
 * Time: O(log n) — B-tree index seek on (created_at, id)
 * vs OFFSET: O(n) — full table scan up to offset
 */
@Repository
public class OrderCursorRepository {

    private final JdbcTemplate jdbc;

    public CursorPage<OrderSummary> findPage(CursorPageRequest request) {
        String sql;
        List<Object> params = new ArrayList<>();
        int limit = request.getPageSize() + 1; // fetch one extra to detect next page

        if (request.getCursor() == null) {
            // First page
            sql = """
                SELECT id, status, total_amount, created_at, customer_id
                FROM orders
                ORDER BY created_at DESC, id DESC
                LIMIT ?
                """;
            params.add(limit);
        } else {
            // Subsequent pages — keyset seek
            Cursor cursor = decodeCursor(request.getCursor());
            sql = """
                SELECT id, status, total_amount, created_at, customer_id
                FROM orders
                WHERE (created_at, id) < (?, ?)
                ORDER BY created_at DESC, id DESC
                LIMIT ?
                """;
            params.add(cursor.createdAt());
            params.add(cursor.id());
            params.add(limit);
        }

        List<OrderSummary> rows = jdbc.query(sql, orderSummaryMapper(), params.toArray());

        boolean hasNext = rows.size() > request.getPageSize();
        if (hasNext) rows.removeLast(); // remove the extra sentinel row

        String nextCursor = hasNext
            ? encodeCursor(rows.getLast())
            : null;

        return new CursorPage<>(rows, nextCursor, hasNext);
    }

    private String encodeCursor(OrderSummary last) {
        // Base64 encode composite cursor
        String raw = last.getCreatedAt() + "," + last.getId();
        return Base64.getUrlEncoder().encodeToString(raw.getBytes());
    }

    private Cursor decodeCursor(String encoded) {
        String raw = new String(Base64.getUrlDecoder().decode(encoded));
        String[] parts = raw.split(",");
        return new Cursor(Instant.parse(parts[0]), UUID.fromString(parts[1]));
    }
}
```

---

### 4.6 Circuit Breaker State Machine

**States:** CLOSED → OPEN → HALF_OPEN → CLOSED

```java
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import java.time.Duration;

@Configuration
public class ResilienceConfig {

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
            .failureRateThreshold(50)           // open if 50% of calls fail
            .slowCallRateThreshold(80)           // open if 80% of calls are slow
            .slowCallDurationThreshold(Duration.ofSeconds(2))
            .waitDurationInOpenState(Duration.ofSeconds(30)) // wait before HALF_OPEN
            .permittedNumberOfCallsInHalfOpenState(5)
            .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
            .slidingWindowSize(20)
            .minimumNumberOfCalls(10)
            .recordExceptions(IOException.class, TimeoutException.class)
            .build();

        return CircuitBreakerRegistry.of(config);
    }
}

@Service
public class OrderServiceClient {

    private final CircuitBreaker cb;
    private final WebClient webClient;

    public OrderServiceClient(CircuitBreakerRegistry registry, WebClient.Builder builder) {
        this.cb = registry.circuitBreaker("order-service");
        this.webClient = builder.baseUrl("http://order-service").build();
    }

    public Mono<OrderDto> getOrder(UUID orderId) {
        return CircuitBreakerOperator.of(cb)
            .apply(webClient.get()
                .uri("/api/orders/{id}", orderId)
                .retrieve()
                .bodyToMono(OrderDto.class))
            .onErrorResume(CallNotPermittedException.class,
                ex -> Mono.error(new ServiceUnavailableException("Order service unavailable")));
    }
}
```

---

## 5. User Management Service — Auth + RBAC

### 5.1 Database Schema

```sql
-- users table
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username    VARCHAR(50)  UNIQUE NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,  -- BCrypt hash
    enabled     BOOLEAN NOT NULL DEFAULT true,
    locked      BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- roles table
CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) UNIQUE NOT NULL,  -- e.g. ROLE_ADMIN, ROLE_USER
    description TEXT
);

-- permissions table
CREATE TABLE permissions (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL, -- e.g. ORDER:READ, USER:MANAGE
    description TEXT
);

-- many-to-many: users ↔ roles
CREATE TABLE user_roles (
    user_id UUID    REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- many-to-many: roles ↔ permissions
CREATE TABLE role_permissions (
    role_id       INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- refresh tokens
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) UNIQUE NOT NULL,  -- SHA-256 of actual token
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    family      UUID NOT NULL  -- for rotation attack detection
);

-- Indexes for performance
CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_refresh_tokens_user_id   ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
```

---

### 5.2 Domain Model

```java
// User.java (Domain — no JPA annotations here!)
@Getter
@Builder
public class User {
    private UUID id;
    private String username;
    private String email;
    private String passwordHash;
    private boolean enabled;
    private boolean locked;
    private Set<Role> roles;
    private Instant createdAt;

    public Set<String> getEffectivePermissions() {
        return roles.stream()
            .flatMap(role -> role.getPermissions().stream())
            .map(Permission::getName)
            .collect(Collectors.toSet());
    }

    public boolean hasRole(String roleName) {
        return roles.stream().anyMatch(r -> r.getName().equals(roleName));
    }

    public boolean isActive() {
        return enabled && !locked;
    }
}

// Role.java
@Getter
@Builder
public class Role {
    private Integer id;
    private String name;
    private Set<Permission> permissions;
}

// Permission.java
@Getter
@AllArgsConstructor
public class Permission {
    private Integer id;
    private String name;
}
```

---

### 5.3 JPA Entities

```java
@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private boolean locked = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<RoleEntity> roles = new HashSet<>();

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}

@Entity
@Table(name = "roles")
@Getter @Setter
@NoArgsConstructor
public class RoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 50)
    private String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<PermissionEntity> permissions = new HashSet<>();
}

@Entity
@Table(name = "refresh_tokens")
@Getter @Setter
@NoArgsConstructor
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "token_hash", unique = true, nullable = false)
    private String tokenHash;  // SHA-256 of the actual token (never store raw)

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean revoked = false;

    @Column(nullable = false)
    private UUID family;  // Token family for rotation attack detection

    @CreationTimestamp
    private Instant createdAt;
}
```

---

### 5.4 JWT Token Provider

```java
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.access-token-expiry-ms:900000}")   // 15 min
    private long accessTokenExpiryMs;

    @Value("${app.jwt.refresh-token-expiry-ms:604800000}") // 7 days
    private long refreshTokenExpiryMs;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Create access token (short-lived).
     * Claims: sub=userId, jti=unique-id, roles, permissions, type=ACCESS
     */
    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Set<String> permissions = user.getEffectivePermissions();

        return Jwts.builder()
            .subject(user.getId().toString())
            .id(UUID.randomUUID().toString())           // jti — unique token ID
            .claim("type", "ACCESS")
            .claim("username", user.getUsername())
            .claim("roles", user.getRoles().stream()
                .map(Role::getName).collect(Collectors.toSet()))
            .claim("permissions", permissions)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusMillis(accessTokenExpiryMs)))
            .signWith(secretKey, Jwts.SIG.HS512)
            .compact();
    }

    /**
     * Create refresh token (long-lived, stored hashed in DB).
     * Minimal claims — just sub and jti. Permission changes reflected on next refresh.
     */
    public String generateRefreshToken(UUID userId, UUID family) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(userId.toString())
            .id(UUID.randomUUID().toString())
            .claim("type", "REFRESH")
            .claim("family", family.toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusMillis(refreshTokenExpiryMs)))
            .signWith(secretKey, Jwts.SIG.HS512)
            .compact();
    }

    public Claims parseAndValidate(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
```

---

### 5.5 JWT Authentication Filter

```java
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final TokenBlacklistService blacklist;
    private final UserDetailsServiceImpl userDetailsService;

    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            Claims claims = tokenProvider.parseAndValidate(token);

            // Reject non-ACCESS tokens (e.g. refresh tokens used as access)
            if (!"ACCESS".equals(claims.get("type", String.class))) {
                chain.doFilter(request, response);
                return;
            }

            // Bloom filter + precise check: O(k) amortized
            if (blacklist.isBlacklisted(claims.getId())) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Set security context
            String userId = claims.getSubject();
            List<String> permissions = claims.get("permissions", List.class);

            List<GrantedAuthority> authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(userId, null, authorities);
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (JwtException | IllegalArgumentException e) {
            // Invalid token — just clear context and continue (let security decide)
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(request, response);
    }
}
```

---

### 5.6 Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final JwtAuthEntryPoint authEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e
                .authenticationEntryPoint(authEntryPoint)    // 401
                .accessDeniedHandler(accessDeniedHandler))   // 403
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login",
                                 "/api/auth/register",
                                 "/api/auth/refresh",
                                 "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt with strength 12 (2^12 = 4096 iterations)
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

---

### 5.7 Auth Service — Login + Register + Refresh

```java
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserPersistenceAdapter userAdapter;
    private final RefreshTokenRepository refreshTokenRepo;
    private final JwtTokenProvider tokenProvider;
    private final TokenBlacklistService blacklist;
    private final PasswordEncoder passwordEncoder;
    private final SlidingWindowRateLimiter rateLimiter;

    /**
     * Register a new user.
     * Default role: ROLE_USER
     */
    public UserDto register(RegisterRequest request) {
        if (userAdapter.existsByEmail(request.email())) {
            throw new ConflictException("Email already registered");
        }
        if (userAdapter.existsByUsername(request.username())) {
            throw new ConflictException("Username already taken");
        }

        User user = User.builder()
            .username(request.username())
            .email(request.email())
            .passwordHash(passwordEncoder.encode(request.password()))
            .enabled(true)
            .roles(Set.of(userAdapter.findRoleByName("ROLE_USER")))
            .build();

        User saved = userAdapter.save(user);
        log.info("New user registered: {}", saved.getId());
        return UserDto.from(saved);
    }

    /**
     * Login — returns access + refresh token pair.
     * Rate limited: 10 attempts per minute per email.
     */
    public TokenResponse login(LoginRequest request) {
        // Rate limit check
        if (!rateLimiter.isAllowed("login:" + request.email())) {
            throw new TooManyRequestsException("Too many login attempts. Try again in 1 minute.");
        }

        User user = userAdapter.findByEmail(request.email())
            .orElseThrow(() -> new AuthException("Invalid credentials"));

        if (!user.isActive()) {
            throw new AuthException("Account is disabled or locked");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AuthException("Invalid credentials");
        }

        return issueTokenPair(user);
    }

    /**
     * Refresh — rotates refresh token (prevents theft).
     * Token family tracking detects reuse attacks.
     */
    public TokenResponse refresh(String rawRefreshToken) {
        Claims claims;
        try {
            claims = tokenProvider.parseAndValidate(rawRefreshToken);
        } catch (JwtException e) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        if (!"REFRESH".equals(claims.get("type", String.class))) {
            throw new InvalidTokenException("Not a refresh token");
        }

        String tokenHash = tokenProvider.hashToken(rawRefreshToken);
        RefreshTokenEntity stored = refreshTokenRepo.findByTokenHash(tokenHash)
            .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        UUID family = UUID.fromString(claims.get("family", String.class));

        // Rotation attack detection: if token was already used (revoked), revoke ENTIRE family
        if (stored.isRevoked()) {
            log.warn("Refresh token reuse detected! Revoking family {}", family);
            refreshTokenRepo.revokeByFamily(family);
            throw new SecurityException("Refresh token reuse detected. Please log in again.");
        }

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidTokenException("Refresh token expired");
        }

        // Revoke old token
        stored.setRevoked(true);
        refreshTokenRepo.save(stored);

        // Issue new pair
        User user = userAdapter.findById(stored.getUser().getId())
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        return issueTokenPair(user, family); // same family, new token
    }

    /**
     * Logout — blacklists access token + revokes refresh token.
     */
    public void logout(String rawAccessToken, String rawRefreshToken) {
        // Blacklist access token
        Claims accessClaims = tokenProvider.parseAndValidate(rawAccessToken);
        blacklist.blacklist(accessClaims.getId(), accessClaims.getExpiration().getTime());

        // Revoke refresh token
        if (rawRefreshToken != null) {
            String hash = tokenProvider.hashToken(rawRefreshToken);
            refreshTokenRepo.findByTokenHash(hash).ifPresent(rt -> {
                rt.setRevoked(true);
                refreshTokenRepo.save(rt);
            });
        }
    }

    private TokenResponse issueTokenPair(User user) {
        return issueTokenPair(user, UUID.randomUUID()); // new family for new login
    }

    private TokenResponse issueTokenPair(User user, UUID family) {
        String accessToken  = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), family);

        // Store hashed refresh token
        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setUser(userAdapter.toEntity(user));
        entity.setTokenHash(tokenProvider.hashToken(refreshToken));
        entity.setFamily(family);
        entity.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
        refreshTokenRepo.save(entity);

        return TokenResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(900L) // 15 minutes in seconds
            .build();
    }
}
```

---

### 5.8 Auth Controller

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, Register, Token management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request), "User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(
        @Valid @RequestBody LoginRequest request) {

        TokenResponse tokens = authService.login(request);
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, buildRefreshCookie(tokens.getRefreshToken()))
            .body(ApiResponse.success(tokens, "Login successful"));
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(
        @CookieValue(name = "refresh_token", required = false) String cookieToken,
        @RequestBody(required = false) RefreshRequest body) {

        String token = cookieToken != null ? cookieToken
                       : (body != null ? body.refreshToken() : null);
        if (token == null) throw new BadRequestException("Refresh token required");

        return ApiResponse.success(authService.refresh(token));
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> logout(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
        @CookieValue(name = "refresh_token", required = false) String refreshToken) {

        String accessToken = authHeader.substring("Bearer ".length());
        authService.logout(accessToken, refreshToken);
        return ApiResponse.success(null, "Logged out successfully");
    }

    private String buildRefreshCookie(String refreshToken) {
        return ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .maxAge(Duration.ofDays(7))
            .path("/api/auth/refresh")
            .build().toString();
    }
}
```

---

### 5.9 Role & Permission Management Controller

```java
@RestController
@RequestMapping("/api/admin/roles")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public List<RoleDto> getAllRoles() {
        return roleService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoleDto createRole(@Valid @RequestBody CreateRoleRequest request) {
        return roleService.create(request);
    }

    @PutMapping("/{roleId}/permissions")
    public RoleDto assignPermissions(
        @PathVariable Integer roleId,
        @RequestBody @NotEmpty Set<Integer> permissionIds) {
        return roleService.assignPermissions(roleId, permissionIds);
    }

    @PostMapping("/assign")
    public UserDto assignRoleToUser(
        @RequestBody @Valid AssignRoleRequest request) {
        return roleService.assignToUser(request.userId(), request.roleId());
    }

    @DeleteMapping("/revoke")
    public UserDto revokeRoleFromUser(
        @RequestBody @Valid AssignRoleRequest request) {
        return roleService.revokeFromUser(request.userId(), request.roleId());
    }
}
```

---

### 5.10 Method-Level Security with Permission Checks

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PermissionEvaluator permissionEvaluator;

    // Requires exact permission OR admin wildcard
    @PreAuthorize("hasAuthority('ORDER:READ') or hasRole('ADMIN')")
    public OrderDto getOrder(UUID orderId) {
        return orderRepository.findById(orderId)
            .map(OrderDto::from)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
    }

    @PreAuthorize("hasAuthority('ORDER:CREATE')")
    public OrderDto createOrder(CreateOrderRequest request, UUID userId) {
        // ... business logic
    }

    @PreAuthorize("hasAuthority('ORDER:DELETE') or @orderOwnerChecker.isOwner(authentication, #orderId)")
    public void cancelOrder(UUID orderId) {
        // ...
    }
}

// Custom bean for ownership check
@Component("orderOwnerChecker")
public class OrderOwnerChecker {
    public boolean isOwner(Authentication auth, UUID orderId) {
        UUID currentUserId = UUID.fromString(auth.getName());
        return orderRepository.isOwner(orderId, currentUserId);
    }
}
```

---

## 6. Inter-Service Communication

### 6.1 Synchronous — WebClient with Retry

```java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder(CircuitBreakerRegistry cbRegistry) {
        return WebClient.builder()
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
    }
}

@Component
@RequiredArgsConstructor
public class UserServiceClient {

    private final WebClient.Builder webClientBuilder;
    private final CircuitBreakerRegistry cbRegistry;

    private WebClient client() {
        return webClientBuilder.baseUrl("http://user-auth-service").build();
    }

    public Mono<UserDto> getUserById(UUID userId) {
        CircuitBreaker cb = cbRegistry.circuitBreaker("user-service");

        return client().get()
            .uri("/api/users/{id}", userId)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError,
                response -> Mono.error(new UserNotFoundException(userId)))
            .bodyToMono(UserDto.class)
            .retryWhen(Retry.backoff(3, Duration.ofMillis(200))  // exponential backoff
                .filter(ex -> !(ex instanceof UserNotFoundException)))
            .transformDeferred(CircuitBreakerOperator.of(cb))
            .timeout(Duration.ofSeconds(3))
            .onErrorReturn(fallbackUser(userId));
    }
}
```

---

### 6.2 Asynchronous — Kafka Events

```java
// Event publishing from Order Service
@Service
@RequiredArgsConstructor
public class OrderEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = OrderCreatedEvent.builder()
            .orderId(order.getId())
            .userId(order.getUserId())
            .totalAmount(order.getTotalAmount())
            .occurredAt(Instant.now())
            .build();

        kafkaTemplate.send("orders.created", order.getId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish OrderCreated event: {}", ex.getMessage());
                }
            });
    }
}

// Consuming in Notification Service
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
        topics = "orders.created",
        groupId = "notification-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void onOrderCreated(@Payload OrderCreatedEvent event,
                               @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                               Acknowledgment ack) {
        try {
            log.info("Processing OrderCreated event for order {}", event.getOrderId());
            notificationService.sendOrderConfirmation(event);
            ack.acknowledge();  // manual ack for at-least-once
        } catch (Exception e) {
            log.error("Failed to process event, will retry", e);
            // Don't ack — Kafka retries automatically
        }
    }
}
```

---

## 7. API Gateway & Load Balancing

### 7.1 Spring Cloud Gateway Configuration

```yaml
# api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: user-auth-service
          uri: lb://user-auth-service     # 'lb://' = Eureka load-balanced
          predicates:
            - Path=/api/auth/**, /api/users/**
          filters:
            - name: CircuitBreaker
              args:
                name: user-auth-cb
                fallbackUri: forward:/fallback/user-auth
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 20
                redis-rate-limiter.burstCapacity: 40
                key-resolver: "#{@ipKeyResolver}"
            - AddRequestHeader=X-Gateway-Source, api-gateway
            - RewritePath=/api/(?<segment>.*), /api/${segment}

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - name: JwtAuthenticationFilter  # custom global filter
            - StripPrefix=0

      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin
        - name: Retry
          args:
            retries: 3
            statuses: BAD_GATEWAY, SERVICE_UNAVAILABLE
            backoff:
              firstBackoff: 100ms
              maxBackoff: 1s
              factor: 2
```

### 7.2 Global JWT Validation Filter (Gateway Level)

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtGatewayFilter implements GlobalFilter, Ordered {

    private final JwtTokenProvider tokenProvider;
    private final TokenBlacklistService blacklist;

    private static final List<String> PUBLIC_PATHS = List.of(
        "/api/auth/login", "/api/auth/register", "/api/auth/refresh",
        "/actuator/health"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();

        if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders()
            .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange, "Missing authorization header");
        }

        try {
            Claims claims = tokenProvider.parseAndValidate(
                authHeader.substring(7));

            if (blacklist.isBlacklisted(claims.getId())) {
                return unauthorized(exchange, "Token has been revoked");
            }

            // Forward user context as headers to downstream services
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header("X-User-Id",       claims.getSubject())
                .header("X-User-Roles",    claims.get("roles").toString())
                .header("X-User-Perms",    claims.get("permissions").toString())
                .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (JwtException e) {
            return unauthorized(exchange, "Invalid token: " + e.getMessage());
        }
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add(HttpHeaders.CONTENT_TYPE,
            MediaType.APPLICATION_JSON_VALUE);
        byte[] body = ("{\"error\":\"" + message + "\"}").getBytes();
        return exchange.getResponse().writeWith(
            Mono.just(exchange.getResponse().bufferFactory().wrap(body)));
    }

    @Override
    public int getOrder() {
        return -100; // Run before routing
    }
}
```

---

## 8. Caching Layer

### 8.1 Redis Cache Configuration

```java
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .disableCachingNullValues()
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()));
    }

    @Bean
    public RedisCacheManagerBuilderCustomizer cacheManagerCustomizer() {
        return builder -> builder
            .withCacheConfiguration("users",
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(30)))
            .withCacheConfiguration("roles",
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(1)))
            .withCacheConfiguration("permissions",
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(2)));
    }
}
```

### 8.2 Cacheable Services

```java
@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = "users")
public class UserQueryService {

    private final UserPersistenceAdapter userAdapter;

    @Cacheable(key = "#userId.toString()")
    public UserDto getUserById(UUID userId) {
        return userAdapter.findById(userId)
            .map(UserDto::from)
            .orElseThrow(() -> new UserNotFoundException(userId));
    }

    @CacheEvict(key = "#userId.toString()")
    public void evictUser(UUID userId) {
        // Called when user data is updated
    }

    @Caching(evict = {
        @CacheEvict(key = "#user.id.toString()"),
        @CacheEvict(cacheNames = "roles", allEntries = true) // roles changed
    })
    public UserDto updateUserRoles(User user) {
        return UserDto.from(userAdapter.save(user));
    }
}
```

---

## 9. Observability — Logging, Tracing, Metrics

### 9.1 Structured Logging with MDC

```java
@Aspect
@Component
public class CorrelationIdAspect {

    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public Object injectCorrelationId(ProceedingJoinPoint pjp) throws Throwable {
        String correlationId = Optional.ofNullable(
            ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .getRequest().getHeader("X-Correlation-Id"))
            .orElse(UUID.randomUUID().toString());

        MDC.put("correlationId", correlationId);
        MDC.put("service", "user-auth-service");
        try {
            return pjp.proceed();
        } finally {
            MDC.clear();
        }
    }
}
```

**`logback-spring.xml`** (JSON output for log aggregation):

```xml
<configuration>
    <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <includeMdcKeyName>correlationId</includeMdcKeyName>
            <includeMdcKeyName>service</includeMdcKeyName>
            <includeMdcKeyName>userId</includeMdcKeyName>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="JSON"/>
    </root>
</configuration>
```

### 9.2 Micrometer Metrics

```java
@Component
@RequiredArgsConstructor
public class AuthMetrics {

    private final MeterRegistry registry;
    private Counter loginSuccessCounter;
    private Counter loginFailureCounter;
    private Timer tokenValidationTimer;

    @PostConstruct
    public void init() {
        loginSuccessCounter = Counter.builder("auth.login.success")
            .description("Successful logins")
            .register(registry);

        loginFailureCounter = Counter.builder("auth.login.failure")
            .description("Failed login attempts")
            .tag("reason", "invalid_credentials")
            .register(registry);

        tokenValidationTimer = Timer.builder("auth.token.validation")
            .description("JWT validation duration")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(registry);
    }

    public void recordLoginSuccess() { loginSuccessCounter.increment(); }
    public void recordLoginFailure() { loginFailureCounter.increment(); }
    public <T> T timeTokenValidation(Supplier<T> supplier) {
        return tokenValidationTimer.record(supplier);
    }
}
```

---

## 10. Docker & Kubernetes Deployment

### 10.1 Optimized Dockerfile (Multi-Stage)

```dockerfile
# Stage 1: Build (Maven)
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build

# Cache dependencies layer separately (only rebuild if pom.xml changes)
COPY pom.xml .
COPY user-auth-service/pom.xml user-auth-service/
RUN mvn dependency:go-offline -pl user-auth-service -am -q

COPY . .
RUN mvn package -pl user-auth-service -am -DskipTests -q

# Stage 2: Extract layers (Spring Boot layered jars)
FROM eclipse-temurin:21-jre-alpine AS layers
WORKDIR /app
COPY --from=builder /build/user-auth-service/target/user-auth-service.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Stage 3: Final minimal image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Spring Boot layers (most stable → least stable for Docker cache efficiency)
COPY --from=layers /app/dependencies/ ./
COPY --from=layers /app/spring-boot-loader/ ./
COPY --from=layers /app/snapshot-dependencies/ ./
COPY --from=layers /app/application/ ./

EXPOSE 8081
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+UseG1GC", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "org.springframework.boot.loader.launch.JarLauncher"]
```

### 10.2 Docker Compose (Local Dev)

```yaml
version: '3.9'
services:
  postgres-auth:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: auth_user
      POSTGRES_PASSWORD: ${AUTH_DB_PASSWORD}
    volumes:
      - postgres_auth_data:/var/lib/postgresql/data
      - ./user-auth-service/src/main/resources/db/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U auth_user -d auth_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s

  eureka-server:
    image: steeltoeoss/eureka-server:latest
    ports:
      - "8761:8761"

  user-auth-service:
    build:
      context: .
      dockerfile: user-auth-service/Dockerfile
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-auth:5432/auth_db
      SPRING_DATASOURCE_USERNAME: auth_user
      SPRING_DATASOURCE_PASSWORD: ${AUTH_DB_PASSWORD}
      SPRING_DATA_REDIS_HOST: redis
      SPRING_DATA_REDIS_PASSWORD: ${REDIS_PASSWORD}
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
      APP_JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres-auth:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  api-gateway:
    build:
      context: .
      dockerfile: api-gateway/Dockerfile
    ports:
      - "8080:8080"
    environment:
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
      APP_JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - eureka-server
      - user-auth-service

volumes:
  postgres_auth_data:
  redis_data:
```

---

## 11. Performance Benchmark Patterns

### 11.1 Algorithm Complexity Summary

| Operation | Data Structure | Time | Space | Notes |
|-----------|---------------|------|-------|-------|
| Token blacklist check | Bloom Filter + HashMap | O(k) | O(n·m bits) | k=hash functions, 1% FP |
| Permission lookup | Trie | O(m) | O(SIGMA·N·M) | m=perm length |
| Rate limiting per window | Sliding Window Counter (Redis) | O(W) | O(W) | W=window seconds |
| Idempotency dedup | LRU Cache (LinkedHashMap) | O(1) amortized | O(capacity) | eviction is O(1) |
| Pagination | Keyset/Cursor (B-tree) | O(log n) | O(1) | vs O(n) for OFFSET |
| User permission gather | HashSet union | O(R·P) | O(P) | R=roles, P=permissions per role |
| JWT parse & verify | HMAC-SHA512 | O(len) | O(1) | hardware-accelerated |
| BCrypt password verify | BCrypt | O(2^cost) | O(1) | cost=12, ~250ms intentional |
| Redis GET/SET | Hash table | O(1) | O(n) | network RTT dominates |

### 11.2 JVM Tuning for Microservices (Java 21)

```bash
# application startup flags
JAVA_OPTS=" \
  -XX:+UseContainerSupport \
  -XX:MaxRAMPercentage=75.0 \
  -XX:InitialRAMPercentage=50.0 \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=100 \
  -XX:G1HeapRegionSize=16m \
  -XX:+UseStringDeduplication \
  -XX:+AlwaysPreTouch \
  -Xss512k \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/tmp/heapdump.hprof \
  -Djava.security.egd=file:/dev/./urandom"

# For GraalVM Native Image (Spring Boot 3 AOT) — 10x faster startup, 3x less memory
./gradlew nativeCompile
# → Results in 50ms startup vs 3s JVM startup
```

### 11.3 Database Connection Pool Sizing

```yaml
# application.yml
spring:
  datasource:
    hikari:
      # Formula: pool_size = (core_count * 2) + effective_spindle_count
      # For 4-core CPU, SSD: (4 * 2) + 1 = 9
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 3000    # 3s — fail fast
      idle-timeout: 600000        # 10 min
      max-lifetime: 1800000       # 30 min (below DB wait_timeout)
      keepalive-time: 60000       # prevent firewall drops
      pool-name: HikariPool-AuthService
      data-source-properties:
        cachePrepStmts: true
        prepStmtCacheSize: 250
        prepStmtCacheSqlLimit: 2048
        useServerPrepStmts: true   # PostgreSQL server-side prepared statements
```

### 11.4 Application Properties Reference

```yaml
# user-auth-service/src/main/resources/application.yml
server:
  port: 8081
  compression:
    enabled: true
    mime-types: application/json
    min-response-size: 1024
  http2:
    enabled: true
  shutdown: graceful  # drain requests before stopping

spring:
  application:
    name: user-auth-service
  jpa:
    open-in-view: false   # CRITICAL: avoid lazy-load anti-pattern
    show-sql: false
    hibernate:
      ddl-auto: validate  # use Flyway/Liquibase for schema management
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          batch_size: 50
          order_inserts: true
          order_updates: true
        query:
          in_clause_parameter_padding: true

  lifecycle:
    timeout-per-shutdown-phase: 30s

app:
  jwt:
    secret: ${JWT_SECRET}                    # Base64-encoded 64-byte key
    access-token-expiry-ms: 900000           # 15 min
    refresh-token-expiry-ms: 604800000       # 7 days

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_URL:http://localhost:8761/eureka/}
    registry-fetch-interval-seconds: 30
  instance:
    lease-renewal-interval-in-seconds: 10
    lease-expiration-duration-in-seconds: 30
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: health, info, prometheus, metrics
  endpoint:
    health:
      show-details: when-authorized
  metrics:
    export:
      prometheus:
        enabled: true
  tracing:
    sampling:
      probability: 0.1  # 10% trace sampling in production
```

---

## Quick Reference — Common Commands

```bash
# ── Maven ──────────────────────────────────────────────────────────────────
mvn clean install -DskipTests                    # Build all modules
mvn clean package -pl user-auth-service -am      # Build single service
mvn dependency:tree -pl user-auth-service        # Inspect dependency tree
mvn versions:display-dependency-updates          # Check for updates

# ── Gradle ─────────────────────────────────────────────────────────────────
./gradlew clean build -x test                    # Build all
./gradlew :user-auth-service:bootRun             # Run single service
./gradlew :user-auth-service:dependencies        # Dependency tree
./gradlew dependencyUpdates                      # Outdated deps (plugin needed)
./gradlew --build-cache build                    # Enabled build caching

# ── Docker ─────────────────────────────────────────────────────────────────
docker compose up -d postgres-auth redis eureka-server   # Infrastructure only
docker compose up -d --build user-auth-service           # Rebuild and start
docker compose logs -f user-auth-service                 # Stream logs

# ── Testing ────────────────────────────────────────────────────────────────
./gradlew test                                   # Unit tests
./gradlew integrationTest                        # Integration tests (Testcontainers)
```

---

*Built with Spring Boot 3.3 · Java 21 · Spring Cloud 2023.0 · Gradle 8.7 / Maven 3.9*

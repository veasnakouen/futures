# 🚀 Java Developer Roadmap — Beginner to Professional

> A complete, structured guide to becoming a job-ready and production-grade Java developer.  
> Estimated total time: **12–18 months** (full-time study) or **24–36 months** (part-time).

---

## Table of Contents

1. [Phase 1 — Core Java Fundamentals](#phase-1--core-java-fundamentals)
2. [Phase 2 — Object-Oriented Programming (OOP)](#phase-2--object-oriented-programming-oop)
3. [Phase 3 — Java Standard Library & Collections](#phase-3--java-standard-library--collections)
4. [Phase 4 — Exception Handling & I/O](#phase-4--exception-handling--io)
5. [Phase 5 — Concurrency & Multithreading](#phase-5--concurrency--multithreading)
6. [Phase 6 — Java 8+ Modern Features](#phase-6--java-8-modern-features)
7. [Phase 7 — Build Tools & Dependency Management](#phase-7--build-tools--dependency-management)
8. [Phase 8 — Databases & SQL](#phase-8--databases--sql)
9. [Phase 9 — Spring Framework & Spring Boot](#phase-9--spring-framework--spring-boot)
10. [Phase 10 — Testing](#phase-10--testing)
11. [Phase 11 — APIs & Web Services](#phase-11--apis--web-services)
12. [Phase 12 — Security](#phase-12--security)
13. [Phase 13 — DevOps & Cloud](#phase-13--devops--cloud)
14. [Phase 14 — Microservices Architecture](#phase-14--microservices-architecture)
15. [Phase 15 — Advanced Topics & Architecture Patterns](#phase-15--advanced-topics--architecture-patterns)
16. [Career Path & Portfolio](#career-path--portfolio)
17. [Recommended Resources](#recommended-resources)

---

## Phase 1 — Core Java Fundamentals

> ⏱ Estimated Time: **4–6 weeks**  
> 🎯 Goal: Write basic programs, understand Java syntax and the JVM.

### 1.1 Environment Setup

- Install **JDK 17** or **JDK 21** (LTS versions recommended)
- Choose an IDE: **IntelliJ IDEA** (recommended), Eclipse, or VS Code
- Understand JDK vs JRE vs JVM
- Learn how `javac` compiles `.java` → `.class` bytecode
- Learn how `java` runs bytecode on the JVM

### 1.2 Java Syntax Basics

- Data types: `int`, `long`, `double`, `float`, `char`, `boolean`, `String`
- Variables, constants (`final`), and naming conventions
- Operators: arithmetic, comparison, logical, bitwise, ternary
- Type casting: widening and narrowing
- String basics: concatenation, `String.format()`, `StringBuilder`

### 1.3 Control Flow

- `if`, `else if`, `else`
- `switch` (classic and enhanced switch expressions — Java 14+)
- Loops: `for`, `while`, `do-while`, enhanced `for-each`
- `break`, `continue`, labeled loops

### 1.4 Methods & Functions

- Method declaration, parameters, return types
- Method overloading
- Varargs (`String... args`)
- Recursion basics
- `static` vs instance methods

### 1.5 Arrays

- Single and multi-dimensional arrays
- `Arrays` utility class: sort, search, copy
- Array vs `ArrayList` trade-offs

### ✅ Milestone Project
> **Calculator CLI** — A console-based calculator supporting +, –, ×, ÷, and modulus with input validation.

---

## Phase 2 — Object-Oriented Programming (OOP)

> ⏱ Estimated Time: **4–6 weeks**  
> 🎯 Goal: Master OOP principles that Java is built around.

### 2.1 Classes & Objects

- Class definition, fields, constructors
- `this` keyword
- Object creation with `new`
- Access modifiers: `public`, `private`, `protected`, package-private
- Getters, setters, encapsulation

### 2.2 Inheritance

- `extends` keyword
- `super` constructor and method calls
- Method overriding (`@Override`)
- `final` classes and methods (preventing inheritance)
- Covariant return types

### 2.3 Polymorphism

- Compile-time (overloading) vs runtime (overriding) polymorphism
- Upcasting and downcasting
- `instanceof` operator (and pattern matching — Java 16+)
- Dynamic method dispatch

### 2.4 Abstraction

- Abstract classes (`abstract` keyword)
- Interfaces: declaration, implementation, multiple interfaces
- Default and static methods in interfaces (Java 8+)
- Interface vs abstract class — when to use which

### 2.5 Key OOP Principles

- **SOLID Principles**:
  - **S** — Single Responsibility Principle
  - **O** — Open/Closed Principle
  - **L** — Liskov Substitution Principle
  - **I** — Interface Segregation Principle
  - **D** — Dependency Inversion Principle
- **DRY** (Don't Repeat Yourself)
- **YAGNI** (You Aren't Gonna Need It)

### 2.6 Enums & Records

- Enums with fields and methods
- Records (Java 16+) for immutable data carriers
- Sealed classes (Java 17+)

### ✅ Milestone Project
> **Library Management System** — Model `Book`, `Member`, `Loan` with OOP relationships and a CLI menu.

---

## Phase 3 — Java Standard Library & Collections

> ⏱ Estimated Time: **3–4 weeks**  
> 🎯 Goal: Use the JDK's rich built-in APIs confidently.

### 3.1 Collections Framework

| Interface | Common Implementations | Use Case |
|-----------|------------------------|----------|
| `List` | `ArrayList`, `LinkedList` | Ordered, index-based |
| `Set` | `HashSet`, `LinkedHashSet`, `TreeSet` | Unique elements |
| `Map` | `HashMap`, `LinkedHashMap`, `TreeMap` | Key-value pairs |
| `Queue` | `LinkedList`, `PriorityQueue`, `ArrayDeque` | FIFO / priority |
| `Deque` | `ArrayDeque` | Stack or queue |

- Iterating: `for-each`, `Iterator`, `ListIterator`
- `Collections` utility class: sort, reverse, shuffle, min, max
- `Comparable` vs `Comparator`
- Generics: type parameters `<T>`, wildcards `<?>`, bounded types `<T extends Comparable<T>>`

### 3.2 Common Standard Library Classes

- `String`, `StringBuilder`, `StringBuffer`
- `Math`, `Random`, `Scanner`
- `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime` (java.time API)
- `Optional<T>` — avoiding NullPointerException
- `Objects` utility class
- `UUID`

### 3.3 Generics Deep Dive

- Generic classes and methods
- Bounded type parameters
- Wildcards: `<?>`, `<? extends T>`, `<? super T>`
- Type erasure understanding

### ✅ Milestone Project
> **Student Grade Tracker** — Store and sort students by grades using `TreeMap`, `Comparator`, and `Optional`.

---

## Phase 4 — Exception Handling & I/O

> ⏱ Estimated Time: **2–3 weeks**  
> 🎯 Goal: Write robust programs that handle failures gracefully.

### 4.1 Exception Handling

- Exception hierarchy: `Throwable` → `Error` vs `Exception`
- Checked vs unchecked exceptions
- `try`, `catch`, `finally`, `try-with-resources`
- Throwing exceptions: `throw` vs `throws`
- Creating custom exceptions
- Multi-catch blocks
- Exception chaining

### 4.2 Java I/O (Classic)

- `File`, `FileReader`, `FileWriter`
- `BufferedReader`, `BufferedWriter`
- `InputStream`, `OutputStream`
- Reading from console with `Scanner`
- Serialization: `Serializable`, `ObjectInputStream`, `ObjectOutputStream`

### 4.3 Java NIO (Modern)

- `Path`, `Paths`, `Files` (java.nio.file)
- Reading, writing, copying, moving files with `Files` API
- Walking directory trees: `Files.walk()`, `Files.list()`
- Watching file system changes: `WatchService`

### ✅ Milestone Project
> **File-based To-Do App** — CRUD to-do items persisted to a `.txt` or `.json` file using NIO APIs.

---

## Phase 5 — Concurrency & Multithreading

> ⏱ Estimated Time: **3–4 weeks**  
> 🎯 Goal: Write thread-safe, concurrent Java programs.

### 5.1 Thread Basics

- `Thread` class and `Runnable` interface
- Thread lifecycle: new, runnable, blocked, waiting, terminated
- `Thread.sleep()`, `join()`, `interrupt()`
- Daemon threads

### 5.2 Synchronization

- `synchronized` keyword (methods and blocks)
- `volatile` keyword
- Deadlock, livelock, starvation — how to avoid
- `wait()`, `notify()`, `notifyAll()`

### 5.3 java.util.concurrent

- `ExecutorService`, `ThreadPoolExecutor`, `Executors`
- `Callable<T>` and `Future<T>`
- `CompletableFuture<T>` (async, chaining, error handling)
- `CountDownLatch`, `CyclicBarrier`, `Semaphore`
- Concurrent collections: `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue`
- `AtomicInteger`, `AtomicLong`, `AtomicReference`
- `Lock`, `ReentrantLock`, `ReadWriteLock`

### 5.4 Virtual Threads (Java 21)

- Project Loom — virtual threads overview
- `Thread.ofVirtual()`, `Executors.newVirtualThreadPerTaskExecutor()`
- When to use virtual vs platform threads

### ✅ Milestone Project
> **Concurrent File Processor** — Use a thread pool to process 1,000 files in parallel with `CompletableFuture` and aggregate results.

---

## Phase 6 — Java 8+ Modern Features

> ⏱ Estimated Time: **2–3 weeks**  
> 🎯 Goal: Write clean, functional-style Java code.

### 6.1 Lambdas & Functional Interfaces

- Lambda syntax: `(params) -> expression`
- Built-in functional interfaces: `Function<T,R>`, `Predicate<T>`, `Consumer<T>`, `Supplier<T>`, `BiFunction<T,U,R>`
- Method references: `Class::method`, `instance::method`, `Class::new`
- Creating custom `@FunctionalInterface`

### 6.2 Streams API

- Creating streams: `stream()`, `Stream.of()`, `IntStream.range()`
- Intermediate operations: `filter`, `map`, `flatMap`, `distinct`, `sorted`, `limit`, `peek`
- Terminal operations: `collect`, `forEach`, `reduce`, `count`, `findFirst`, `anyMatch`
- `Collectors`: `toList()`, `groupingBy()`, `partitioningBy()`, `joining()`, `counting()`
- Parallel streams: when to use, pitfalls

### 6.3 Optional

- Creating: `Optional.of()`, `Optional.ofNullable()`, `Optional.empty()`
- Using: `isPresent()`, `ifPresent()`, `orElse()`, `orElseGet()`, `orElseThrow()`, `map()`, `filter()`

### 6.4 Other Modern Features

- **Java 9**: Modules (`module-info.java`), `List.of()`, `Map.of()`
- **Java 10**: `var` local variable type inference
- **Java 11**: `String` methods (strip, isBlank, lines, repeat), `Files.readString()`
- **Java 14**: Switch expressions, `instanceof` pattern matching preview
- **Java 15**: Text blocks `""" """`
- **Java 16**: Records, `instanceof` pattern matching GA
- **Java 17**: Sealed classes, `RandomGenerator`
- **Java 21**: Virtual threads, sequenced collections, record patterns

### ✅ Milestone Project
> **Data Pipeline** — Read a CSV, process with Streams (filter, group, aggregate), and write a summary report.

---

## Phase 7 — Build Tools & Dependency Management

> ⏱ Estimated Time: **1–2 weeks**  
> 🎯 Goal: Manage projects professionally with standard build tools.

### 7.1 Maven

- `pom.xml` structure: groupId, artifactId, version
- Dependency management and scopes: compile, test, runtime, provided
- Maven lifecycle: `clean`, `validate`, `compile`, `test`, `package`, `install`, `deploy`
- Plugins: `maven-compiler-plugin`, `maven-surefire-plugin`, `maven-jar-plugin`
- Multi-module Maven projects
- Repositories: Maven Central, private Nexus/Artifactory

### 7.2 Gradle

- `build.gradle` (Groovy) vs `build.gradle.kts` (Kotlin DSL)
- Task lifecycle vs Maven phases
- Dependency configurations: `implementation`, `testImplementation`, `runtimeOnly`
- Gradle wrapper (`gradlew`)
- Incremental builds and build cache

### 7.3 Version Control with Git

- `init`, `clone`, `add`, `commit`, `push`, `pull`
- Branching: `branch`, `checkout`, `merge`, `rebase`
- Pull Requests / Merge Requests workflow
- `.gitignore` for Java projects
- Conventional commits

---

## Phase 8 — Databases & SQL

> ⏱ Estimated Time: **3–4 weeks**  
> 🎯 Goal: Store and retrieve data from relational databases.

### 8.1 SQL Fundamentals

- DDL: `CREATE`, `ALTER`, `DROP`
- DML: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- Filtering: `WHERE`, `AND`, `OR`, `IN`, `LIKE`, `BETWEEN`, `IS NULL`
- Joins: `INNER`, `LEFT`, `RIGHT`, `FULL OUTER`, `CROSS`
- Aggregates: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING`
- Subqueries, CTEs (`WITH`), window functions (`ROW_NUMBER`, `RANK`, `LAG`, `LEAD`)
- Indexes: B-tree, composite, covering indexes
- Transactions: ACID, `COMMIT`, `ROLLBACK`, `SAVEPOINT`
- Normalization: 1NF, 2NF, 3NF

### 8.2 JDBC

- `DriverManager`, `Connection`, `PreparedStatement`, `ResultSet`
- Preventing SQL injection with `PreparedStatement`
- Connection pooling: HikariCP (recommended), c3p0, DBCP
- Transactions with JDBC

### 8.3 JPA & Hibernate (ORM)

- ORM concepts and entity mapping
- `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`
- Relationships: `@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@OneToOne`
- Fetch types: `EAGER` vs `LAZY` (N+1 problem and solutions)
- JPQL — object-oriented query language
- Hibernate-specific: `Session`, `SessionFactory`
- Criteria API for dynamic queries
- Entity lifecycle: transient, persistent, detached, removed

### 8.4 Databases to Learn

- **PostgreSQL** — primary recommendation (open source, feature-rich)
- **MySQL / MariaDB** — widely used alternative
- **H2** — in-memory DB for testing

### ✅ Milestone Project
> **Product Catalog with JDBC + PostgreSQL** — CRUD products and categories, with connection pooling and prepared statements.

---

## Phase 9 — Spring Framework & Spring Boot

> ⏱ Estimated Time: **8–10 weeks**  
> 🎯 Goal: Build production-grade Java applications with the industry-standard framework.

### 9.1 Spring Core

- IoC (Inversion of Control) and DI (Dependency Injection)
- Bean scopes: singleton, prototype, request, session
- Annotations: `@Component`, `@Service`, `@Repository`, `@Controller`, `@Bean`, `@Configuration`
- `@Autowired`, `@Qualifier`, `@Primary`
- ApplicationContext and BeanFactory
- `@Value` for property injection
- Spring Profiles: `@Profile`, `spring.profiles.active`
- AOP (Aspect-Oriented Programming): `@Aspect`, `@Before`, `@After`, `@Around`

### 9.2 Spring Boot

- `spring-boot-starter-*` dependencies
- Auto-configuration mechanism (`spring.factories` / `@AutoConfiguration`)
- `application.properties` / `application.yml`
- `@SpringBootApplication` = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`
- Embedded servers: Tomcat, Jetty, Undertow
- Spring Boot DevTools (hot reload)
- Actuator: health, metrics, info endpoints

### 9.3 Spring Data JPA

- `JpaRepository<T, ID>` and `CrudRepository<T, ID>`
- Derived query methods: `findByNameAndEmail()`, `findTop5ByOrderByCreatedAtDesc()`
- `@Query` with JPQL and native SQL
- Pagination: `Pageable`, `Page<T>`, `Slice<T>`
- Sorting: `Sort`, `PageRequest`
- Auditing: `@CreatedDate`, `@LastModifiedDate`, `@EnableJpaAuditing`
- Custom repository implementations

### 9.4 Spring MVC (REST API)

- `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping`
- `@PathVariable`, `@RequestParam`, `@RequestBody`, `@RequestHeader`
- `ResponseEntity<T>` for full response control
- `@ExceptionHandler` and `@ControllerAdvice` for global error handling
- Input validation: `@Valid`, `@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Max`
- `BindingResult` for validation errors
- Content negotiation: JSON, XML

### 9.5 Spring Security

- Authentication vs Authorization
- Security filter chain
- `UserDetailsService` and `UserDetails`
- Password encoding: `BCryptPasswordEncoder`
- JWT (JSON Web Tokens): access tokens, refresh tokens
- Method-level security: `@PreAuthorize`, `@PostAuthorize`
- OAuth2 / OIDC integration
- CORS configuration

### 9.6 Spring Data & Caching

- **Spring Data Redis** — `@Cacheable`, `@CacheEvict`, `@CachePut`
- **Spring Cache Abstraction** — cache manager, TTL
- **Spring Data MongoDB** — NoSQL document storage

### 9.7 Messaging

- **Spring AMQP** — RabbitMQ integration
- **Spring Kafka** — Kafka producer/consumer with `@KafkaListener`

### ✅ Milestone Projects
> 1. **Blog REST API** — Full CRUD with Spring Boot, Spring Data JPA, PostgreSQL, JWT auth, and `@ControllerAdvice`.  
> 2. **E-commerce Backend** — Products, orders, payments, users with role-based access control.

---

## Phase 10 — Testing

> ⏱ Estimated Time: **3–4 weeks**  
> 🎯 Goal: Write reliable, maintainable tests at every level.

### 10.1 Unit Testing

- **JUnit 5** (Jupiter): `@Test`, `@BeforeEach`, `@AfterEach`, `@BeforeAll`, `@AfterAll`
- Assertions: `assertEquals`, `assertThrows`, `assertAll`, `assertTimeout`
- Parameterized tests: `@ParameterizedTest`, `@ValueSource`, `@CsvSource`, `@MethodSource`
- **Mockito**: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `verify()`, `ArgumentCaptor`
- Testing for exceptions, null values, edge cases

### 10.2 Integration Testing

- `@SpringBootTest` — full context loading
- `@WebMvcTest` — controller layer only
- `@DataJpaTest` — repository layer with in-memory DB
- `MockMvc` — testing HTTP endpoints without a server
- `TestRestTemplate` — HTTP client for full integration tests
- `@Testcontainers` — spin up real databases/services in Docker for tests

### 10.3 Testing Best Practices

- AAA pattern: Arrange, Act, Assert
- Test coverage with JaCoCo
- Test naming conventions
- Testing pyramid: unit > integration > e2e
- TDD (Test-Driven Development) workflow

### ✅ Milestone Project
> Achieve **80%+ test coverage** on your Blog REST API with unit and integration tests.

---

## Phase 11 — APIs & Web Services

> ⏱ Estimated Time: **2–3 weeks**  
> 🎯 Goal: Design and consume industry-standard APIs.

### 11.1 RESTful API Design

- REST constraints: stateless, uniform interface, layered system
- HTTP methods and idempotency
- HTTP status codes: 2xx, 3xx, 4xx, 5xx
- URI design best practices
- API versioning strategies: URL path, header, query param
- Pagination, filtering, sorting conventions (HATEOAS)
- OpenAPI 3.0 / Swagger documentation with `springdoc-openapi`

### 11.2 HTTP Clients

- `RestTemplate` (legacy)
- `WebClient` (reactive, non-blocking) — Spring WebFlux
- **OpenFeign** — declarative HTTP client (Spring Cloud)
- `HttpClient` (Java 11+) — built-in async HTTP client

### 11.3 GraphQL (Optional)

- Schema definition language (SDL)
- Queries, mutations, subscriptions
- **Spring for GraphQL**
- `DataFetcher`, `RuntimeWiring`

### 11.4 gRPC (Optional)

- Protocol Buffers (`.proto` files)
- Unary, server streaming, client streaming, bidirectional streaming
- `grpc-java` library

---

## Phase 12 — Security

> ⏱ Estimated Time: **2–3 weeks**  
> 🎯 Goal: Build secure applications by default.

### 12.1 Authentication & Authorization

- Session-based vs token-based auth
- JWT deep dive: header, payload, signature; RS256 vs HS256
- OAuth2 flows: Authorization Code, Client Credentials, PKCE
- OpenID Connect (OIDC)
- API key authentication

### 12.2 Common Vulnerabilities (OWASP Top 10)

- SQL Injection — prevention with parameterized queries
- XSS (Cross-Site Scripting)
- CSRF — token-based protection
- Insecure deserialization
- Broken access control
- Security misconfiguration

### 12.3 Data Security

- Password hashing: BCrypt, Argon2, SCrypt
- Encryption at rest: AES-256-GCM
- Encryption in transit: TLS/HTTPS
- Secrets management: environment variables, AWS Secrets Manager, Vault

### 12.4 Rate Limiting & DoS Protection

- **Bucket4j** — token bucket rate limiting in Spring Boot
- `Resilience4j` — rate limiting, circuit breaking, retry

---

## Phase 13 — DevOps & Cloud

> ⏱ Estimated Time: **4–5 weeks**  
> 🎯 Goal: Deploy and operate Java applications in production.

### 13.1 Linux Fundamentals

- File system, permissions, `chmod`, `chown`
- Process management: `ps`, `top`, `htop`, `kill`
- Networking: `curl`, `netstat`, `ss`, `iptables`
- `systemd` service management
- Bash scripting basics

### 13.2 Docker

- Dockerfile: `FROM`, `COPY`, `RUN`, `EXPOSE`, `CMD`, `ENTRYPOINT`
- Multi-stage builds for lean Java images
- `docker build`, `docker run`, `docker exec`
- `docker-compose.yml` for local dev stacks (app + postgres + redis)
- Container registries: Docker Hub, AWS ECR, GitHub Container Registry

### 13.3 CI/CD Pipelines

- **GitHub Actions** — workflows, jobs, steps, secrets
- **GitLab CI/CD** — `.gitlab-ci.yml`
- **Jenkins** — Jenkinsfile, pipeline stages
- Automated: lint → test → build → docker build → deploy

### 13.4 Kubernetes (K8s) Basics

- Pods, Deployments, Services, Ingress
- ConfigMaps and Secrets
- Horizontal Pod Autoscaler
- `kubectl` CLI commands
- Helm charts for packaging

### 13.5 Cloud Platforms

- **AWS**: EC2, RDS, S3, ECS/EKS, Lambda, SQS, API Gateway, CloudWatch
- **GCP**: Cloud Run, Cloud SQL, GKE, Pub/Sub
- **Azure**: App Service, Azure SQL, AKS
- Infrastructure as Code: Terraform basics

### 13.6 Monitoring & Observability

- **Metrics**: Micrometer + Prometheus + Grafana
- **Logging**: Logback (with SLF4J), centralized logging with ELK Stack or Loki
- **Distributed Tracing**: Zipkin, Jaeger, OpenTelemetry
- Spring Boot Actuator endpoints

---

## Phase 14 — Microservices Architecture

> ⏱ Estimated Time: **5–6 weeks**  
> 🎯 Goal: Design, build, and orchestrate distributed microservices systems.

### 14.1 Microservices Concepts

- Monolith vs microservices trade-offs
- Domain-Driven Design (DDD): bounded contexts, aggregates, entities, value objects
- Database-per-service pattern
- CAP theorem and eventual consistency
- Saga pattern for distributed transactions (choreography vs orchestration)

### 14.2 Spring Cloud

- **Spring Cloud Netflix Eureka** — service discovery and registration
- **Spring Cloud Gateway** — API gateway with routing, filters, rate limiting
- **OpenFeign** — declarative inter-service REST clients
- **Spring Cloud Config** — centralized configuration management
- **Spring Cloud LoadBalancer** — client-side load balancing

### 14.3 Messaging & Event-Driven Architecture

- **Apache Kafka**: topics, partitions, consumer groups, producers, offsets
- **RabbitMQ**: exchanges, queues, bindings, routing keys, DLQ
- Event sourcing and CQRS patterns
- Outbox pattern for reliable event publishing

### 14.4 Resilience Patterns

- **Resilience4j**: Circuit Breaker, Retry, Bulkhead, Rate Limiter, TimeLimiter
- Fallback strategies
- `@CircuitBreaker`, `@Retry` annotations

### ✅ Milestone Project
> **Order Management System** — 4+ microservices (user-service, product-service, order-service, notification-service) with Eureka, Gateway, Kafka, and Resilience4j.

---

## Phase 15 — Advanced Topics & Architecture Patterns

> ⏱ Estimated Time: **6–8 weeks (ongoing)**  
> 🎯 Goal: Think like a senior/staff engineer; design scalable systems.

### 15.1 Design Patterns

**Creational**: Factory, Abstract Factory, Builder, Singleton, Prototype  
**Structural**: Adapter, Decorator, Facade, Proxy, Composite, Bridge  
**Behavioral**: Strategy, Observer, Command, Chain of Responsibility, Template Method, State, Iterator

### 15.2 Architecture Patterns

- **Layered / N-Tier Architecture**
- **Hexagonal Architecture** (Ports & Adapters)
- **Clean Architecture** (Uncle Bob)
- **CQRS** (Command Query Responsibility Segregation)
- **Event Sourcing**
- **SAGA Pattern**
- **API Gateway Pattern**
- **Strangler Fig** (monolith migration)

### 15.3 Data Structures & Algorithms

- Arrays, Linked Lists, Stacks, Queues
- Trees: BST, AVL, Red-Black, B-Tree
- Graphs: BFS, DFS, Dijkstra, topological sort
- Hash tables and collision resolution
- Sorting: quick sort, merge sort, heap sort
- Big O notation and complexity analysis
- Practice on: LeetCode, HackerRank, Codeforces

### 15.4 Reactive Programming

- Reactive Manifesto principles
- **Project Reactor**: `Mono<T>`, `Flux<T>`, operators
- **Spring WebFlux**: reactive web layer
- Backpressure strategies
- Reactive database access: R2DBC

### 15.5 Performance & JVM Tuning

- JVM memory model: heap, stack, metaspace, GC roots
- Garbage Collectors: G1GC, ZGC, Shenandoah
- GC tuning flags: `-Xms`, `-Xmx`, `-XX:+UseG1GC`
- Profiling tools: VisualVM, Java Mission Control, Async Profiler
- Flame graphs and CPU profiling
- JVM startup: GraalVM Native Image, CRaC

### 15.6 Data Storage Deep Dive

- NoSQL: MongoDB (documents), Redis (key-value / cache), Cassandra (wide-column)
- Search engines: Elasticsearch / OpenSearch
- Time-series: InfluxDB
- Choosing the right database for the use case

---

## Career Path & Portfolio

### Junior Java Developer (0–2 years)
- Master Phases 1–9
- Build 2–3 solid projects on GitHub
- Basic Spring Boot REST APIs
- Know SQL and JPA well
- Basic Git workflow

### Mid-Level Java Developer (2–5 years)
- Deep expertise in Spring Boot + Security + Testing
- Microservices experience
- CI/CD and Docker proficiency
- Performance debugging ability
- Code review skills

### Senior Java Developer (5+ years)
- System design expertise
- Mentoring and architectural decisions
- Distributed systems (Kafka, Kubernetes)
- JVM internals knowledge
- Cross-functional leadership

### Portfolio Checklist

- [ ] Blog REST API (Spring Boot, JPA, JWT, Swagger, Tests)
- [ ] E-Commerce Backend (microservices, Kafka, Docker Compose)
- [ ] Real-time Chat App (WebSocket, Redis Pub/Sub)
- [ ] Data Dashboard API (aggregation queries, pagination, Elasticsearch)
- [ ] Open source contribution (even documentation counts)

### Job Preparation

- **LeetCode**: Focus on Easy–Medium: arrays, strings, hashmaps, trees
- **System Design**: "Designing Data-Intensive Applications" (Kleppmann)
- **Behavioral**: STAR method for past experience questions
- **Mock interviews**: Pramp, Interviewing.io, peers

---

## Recommended Resources

### Books

| Title | Author | Level |
|-------|--------|-------|
| Head First Java | Kathy Sierra | Beginner |
| Effective Java | Joshua Bloch | Intermediate–Advanced |
| Java Concurrency in Practice | Brian Goetz | Advanced |
| Clean Code | Robert C. Martin | All levels |
| Designing Data-Intensive Applications | Martin Kleppmann | Advanced |
| Spring in Action | Craig Walls | Intermediate |
| Building Microservices | Sam Newman | Advanced |

### Online Courses

- **Udemy**: "Java Masterclass" by Tim Buchalka
- **Udemy**: "Spring Boot Microservices" by Sergey Kargopolov
- **Baeldung** (baeldung.com) — #1 Java/Spring reference site
- **Spring.io/guides** — official Spring tutorials
- **Java Brains** (YouTube) — excellent Spring/Java videos

### Practice Platforms

- **LeetCode** — algorithm and data structure problems
- **HackerRank** — Java-specific challenges
- **Exercism.io** — guided mentorship exercises
- **Codewars** — gamified challenges

### Communities

- **Stack Overflow** — Java/Spring tags
- **Reddit**: r/java, r/learnjava, r/SpringBoot
- **Discord**: Java Community, Spring Community
- **Dev.to** — Java and Spring articles

---

## Quick-Reference: Learning Order Summary

```
[1] Java Syntax & OOP (2 months)
     ↓
[2] Collections, Generics, Modern Java Features (1 month)
     ↓
[3] Exception Handling, I/O, Concurrency (1.5 months)
     ↓
[4] Build Tools, Git, SQL + JDBC (1.5 months)
     ↓
[5] Spring Core + Spring Boot + Spring Data JPA (2 months)
     ↓
[6] Spring MVC REST API + Spring Security + JWT (1.5 months)
     ↓
[7] Testing: JUnit 5 + Mockito + Integration Tests (1 month)
     ↓
[8] Docker + CI/CD + Cloud basics (1.5 months)
     ↓
[9] Microservices + Spring Cloud + Kafka (2 months)
     ↓
[10] System Design + Design Patterns + Advanced JVM (ongoing)
```

---

> 💡 **Pro Tip**: Don't try to complete everything before building projects. Build something after each phase — real projects solidify knowledge faster than any tutorial.

> 🗓 **Consistency beats intensity.** 2 hours/day every day beats 14 hours on a weekend.

> 🤝 **Network actively.** Join communities, contribute to open source, write blog posts about what you learn.

---

*Roadmap version: 2025 | Java LTS: 17 / 21 | Spring Boot: 3.x*
Great question! **Java (Spring Boot) + React** is one of the most popular enterprise full-stack combos. Here's the complete pairing breakdown across every layer.

---

## The core stack pairing

| Layer | Java side | React side |
|---|---|---|
| API communication | Spring MVC `@RestController` | `fetch` / Axios / TanStack Query |
| Auth | Spring Security + JWT | JWT stored in `httpOnly` cookie or memory |
| Real-time | Spring WebSocket / SSE | `useEffect` + `EventSource` / SockJS |
| File I/O | `MultipartFile` + `StreamingResponseBody` | `FormData` + `axios` with `onUploadProgress` |
| Validation | Bean Validation (`@Valid`, `@NotNull`) | React Hook Form + Zod / Yup |
| Docs | Springdoc OpenAPI (Swagger UI) | Auto-generate typed clients with `openapi-generator` |

---

## 1. Spring Boot REST + React fetch

```java
// ProductController.java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @GetMapping
    public ResponseEntity<Page<ProductDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(service.list(PageRequest.of(page, size), search));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto create(@Valid @RequestBody CreateProductRequest req) {
        return service.create(req);
    }
}
```

```tsx
// useProducts.ts
export const useProducts = (page: number, search: string) =>
    useQuery({
        queryKey: ['products', page, search],
        queryFn: () =>
            axios.get<PageResponse<Product>>('/api/products', {
                params: { page, size: 20, search }
            }).then(r => r.data),
        staleTime: 2 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
```

---

## 2. JWT authentication pairing

```java
// JwtFilter.java (Spring Security filter chain)
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, ...) {
        String token = extractToken(req);        // from Authorization header
        if (token != null && jwtService.isValid(token)) {
            var auth = new UsernamePasswordAuthenticationToken(
                jwtService.extractUser(token), null,
                jwtService.extractAuthorities(token));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(req, res);
    }
}
```

```tsx
// authStore.ts (Zustand)
interface AuthState {
    token: string | null;
    user: User | null;
    login: (creds: Credentials) => Promise<void>;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    token: null,
    user: null,
    login: async (creds) => {
        const { data } = await axios.post('/api/auth/login', creds);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        set({ token: data.token, user: data.user });
    },
    logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        set({ token: null, user: null });
    },
}));
```

---

## 3. Validation pairing (Bean Validation → Zod)

The cleanest pattern: mirror your Java validation on the frontend with Zod so errors feel instant, but the server always validates authoritatively.

```java
// CreateProductRequest.java
public record CreateProductRequest(
    @NotBlank @Size(max = 200) String name,
    @NotNull @Positive BigDecimal price,
    @Min(0) int stock,
    @NotNull Long categoryId
) {}

// GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public Map<String, List<String>> handleValidation(MethodArgumentNotValidException ex) {
        return ex.getBindingResult().getFieldErrors().stream()
            .collect(groupingBy(
                FieldError::getField,
                mapping(FieldError::getDefaultMessage, toList())));
    }
}
```

```tsx
// productSchema.ts — mirrors Java constraints exactly
const productSchema = z.object({
    name: z.string().min(1).max(200),
    price: z.number().positive(),
    stock: z.number().int().min(0),
    categoryId: z.number(),
});

// ProductForm.tsx
const { register, handleSubmit, setError, formState: { errors } } =
    useForm<ProductForm>({ resolver: zodResolver(productSchema) });

const onSubmit = async (data: ProductForm) => {
    try {
        await createProduct(data);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 422) {
            Object.entries(err.response.data).forEach(([field, msgs]) =>
                setError(field as keyof ProductForm, { message: (msgs as string[])[0] }));
        }
    }
};
```

---

## 4. File upload pairing

```java
// FileController.java
@PostMapping("/upload")
public ResponseEntity<FileDto> upload(@RequestParam("file") MultipartFile file) {
    if (file.getSize() > 50 * 1024 * 1024) throw new FileTooLargeException();
    return ResponseEntity.ok(storageService.store(file));
}

@GetMapping("/download/{id}")
public ResponseEntity<StreamingResponseBody> download(@PathVariable UUID id) {
    var meta = storageService.getMeta(id);
    StreamingResponseBody body = out -> storageService.stream(id, out);
    return ResponseEntity.ok()
        .header(CONTENT_DISPOSITION, "attachment; filename=\"" + meta.name() + "\"")
        .contentType(MediaType.parseMediaType(meta.mimeType()))
        .body(body);
}
```

```tsx
// FileUpload.tsx
const uploadFile = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await axios.post<FileDto>('/api/files/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round(e.progress! * 100)),
    });
    return data;
};
```

---

## 5. Real-time with Server-Sent Events

```java
// EventController.java
@GetMapping(value = "/stream/jobs/{jobId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamJob(@PathVariable String jobId) {
    SseEmitter emitter = new SseEmitter(5 * 60 * 1000L); // 5 min timeout
    jobService.registerEmitter(jobId, emitter);
    return emitter;
}

// JobService.java — called from background job
public void sendProgress(String jobId, int percent) {
    emitters.get(jobId).send(SseEmitter.event()
        .name("progress")
        .data(Map.of("percent", percent)));
}
```

```tsx
// useJobStream.ts
export const useJobStream = (jobId: string | null) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!jobId) return;
        const es = new EventSource(`/api/stream/jobs/${jobId}`);
        es.addEventListener('progress', (e) => {
            const { percent } = JSON.parse(e.data);
            setProgress(percent);
            if (percent === 100) es.close();
        });
        return () => es.close();
    }, [jobId]);

    return progress;
};
```

---

## Full stack architecture> Click any node to go deeper on that specific pairing.

---

## 6. Dev proxy setup (Vite → Spring Boot)

One of the most practical pairings — Vite proxies API calls during development so React and Spring Boot run independently:

```ts
// vite.config.ts
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
});
```

```yaml
# application.yml (Spring Boot)
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/myapp
  jpa:
    hibernate:
      ddl-auto: validate   # Flyway handles schema
  data:
    redis:
      host: localhost
      port: 6379
```

---

## 7. OpenAPI → typed React client (the golden pairing)

```yaml
# pom.xml / build.gradle — adds Springdoc
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0'
```

```bash
# Generate TypeScript client from the running Spring Boot app
npx openapi-generator-cli generate \
  -i http://localhost:8080/v3/api-docs \
  -g typescript-axios \
  -o src/api/generated
```

This gives you fully typed DTOs, request interfaces, and API functions in React — zero manual duplication of Java models.

---

## Quick pairing cheat sheet

| Concern | Java | React |
|---|---|---|
| State | Spring bean scope | Zustand / Context |
| Validation | `@Valid` + Bean Validation | React Hook Form + Zod |
| Auth | Spring Security + JWT | Axios interceptor + Zustand |
| Pagination | `Page<T>` + `Pageable` | TanStack Query infinite |
| Real-time | `SseEmitter` / WebSocket | `EventSource` / SockJS |
| File upload | `MultipartFile` | `FormData` + progress |
| Error format | `@ControllerAdvice` RFC 7807 | Axios error handler |
| Type safety | OpenAPI annotations | `openapi-generator` client |
| Build | Maven / Gradle | Vite |
| Deploy | Docker / Spring Boot JAR | `vite build` → static files |

The single most powerful pairing in this whole stack is **Springdoc OpenAPI + `openapi-generator`** — it eliminates an entire class of bugs by keeping your Java types and React types in perfect sync automatically.
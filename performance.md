Here's a comprehensive breakdown of the best patterns and algorithms for massive data handling across your entire stack.

---

## Backend — ASP.NET Core Web API

### 1. Pagination strategy (most critical)

**Cursor-based pagination** beats offset for large datasets — no skipping rows, consistent under inserts/deletes:

```csharp
public record CursorPageRequest(string? Cursor, int PageSize = 50);
public record CursorPageResponse<T>(IEnumerable<T> Items, string? NextCursor, bool HasMore);

public async Task<CursorPageResponse<ProductDto>> GetProductsAsync(CursorPageRequest req)
{
    var query = _db.Products.AsNoTracking().OrderBy(p => p.Id);

    if (req.Cursor is not null)
    {
        var decoded = long.Parse(Base64Url.Decode(req.Cursor));
        query = query.Where(p => p.Id > decoded);
    }

    var items = await query.Take(req.PageSize + 1).ProjectTo<ProductDto>(_mapper).ToListAsync();
    var hasMore = items.Count > req.PageSize;
    if (hasMore) items.RemoveAt(items.Count - 1);

    var nextCursor = hasMore ? Base64Url.Encode(items.Last().Id.ToString()) : null;
    return new(items, nextCursor, hasMore);
}
```

### 2. Streaming large exports (avoid memory blow-up)

Use `IAsyncEnumerable` + `HttpContext.Response` streaming for CSV/JSON exports:

```csharp
[HttpGet("export")]
public async IAsyncEnumerable<ProductDto> StreamProducts(
    [EnumeratorCancellation] CancellationToken ct)
{
    await foreach (var item in _db.Products.AsNoTracking()
        .AsAsyncEnumerable().WithCancellation(ct))
    {
        yield return _mapper.Map<ProductDto>(item);
    }
}
```

Or for CSV with `CsvHelper`:

```csharp
[HttpGet("export/csv")]
public async Task ExportCsvAsync(CancellationToken ct)
{
    Response.ContentType = "text/csv";
    await using var writer = new StreamWriter(Response.Body);
    await using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
    csv.WriteHeader<ProductDto>();
    await csv.NextRecordAsync();
    await foreach (var row in _db.Products.AsAsyncEnumerable().WithCancellation(ct))
        csv.WriteRecord(_mapper.Map<ProductDto>(row));
}
```

### 3. Multi-layer caching

```csharp
// L1: In-memory (nanoseconds)
// L2: Redis distributed (milliseconds)
// L3: Database (tens of ms+)

public async Task<T?> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan ttl)
{
    // L1 hit
    if (_memoryCache.TryGetValue(key, out T? cached)) return cached;

    // L2 hit
    var bytes = await _redis.GetAsync(key);
    if (bytes is not null)
    {
        var val = JsonSerializer.Deserialize<T>(bytes)!;
        _memoryCache.Set(key, val, TimeSpan.FromMinutes(1)); // warm L1
        return val;
    }

    // L3 — hydrate all layers
    var result = await factory();
    await _redis.SetAsync(key, JsonSerializer.SerializeToUtf8Bytes(result),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = ttl });
    _memoryCache.Set(key, result, TimeSpan.FromMinutes(1));
    return result;
}
```

### 4. Bulk writes with EF Core + batching

```csharp
// Use EFCore.BulkExtensions for INSERT/UPDATE of thousands of rows
await _db.BulkInsertAsync(records, options => {
    options.BatchSize = 1000;
    options.SetOutputIdentity = true;
});

// Or chunked SaveChanges to avoid transaction timeout
const int chunkSize = 500;
for (int i = 0; i < records.Count; i += chunkSize)
{
    _db.Products.AddRange(records.Skip(i).Take(chunkSize));
    await _db.SaveChangesAsync();
    _db.ChangeTracker.Clear(); // prevent memory leak
}
```

### 5. CQRS + background job offloading

```csharp
// Heavy reads → IQueryable projections, no tracking
// Heavy writes → push to queue (Hangfire / Azure Service Bus)

[HttpPost("import")]
public async Task<IActionResult> ImportAsync(IFormFile file)
{
    var jobId = BackgroundJob.Enqueue<ImportService>(s => s.ProcessAsync(file.FileName));
    return Accepted(new { jobId }); // return 202 immediately
}
```

### 6. Database query optimizations

```csharp
// Always use: AsNoTracking, projection, compiled queries

private static readonly Func<AppDbContext, int, Task<ProductSummary?>> _getProduct =
    EF.CompileAsyncQuery((AppDbContext db, int id) =>
        db.Products.Where(p => p.Id == id)
          .Select(p => new ProductSummary(p.Id, p.Name, p.Stock))
          .FirstOrDefault());

// Execution plan hint — add covering index
// CREATE INDEX IX_Products_CategoryId_Stock ON Products (CategoryId) INCLUDE (Name, Price, Stock)

// Split large queries
var orders = await _db.Orders
    .AsSplitQuery()
    .Include(o => o.Lines).ThenInclude(l => l.Product)
    .ToListAsync();
```

---

## Frontend — React

### 1. Virtualization (the #1 pattern for large lists)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function MassiveList({ items }: { items: Product[] }) {
    const parentRef = useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 56,       // row height estimate
        overscan: 10,                 // render 10 extra rows off-screen
    });

    return (
        <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
            <div style={{ height: rowVirtualizer.getTotalSize() }}>
                {rowVirtualizer.getVirtualItems().map(vRow => (
                    <div key={vRow.key}
                         style={{ position: 'absolute', top: vRow.start, height: vRow.size }}>
                        <ProductRow item={items[vRow.index]} />
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### 2. Infinite scroll with TanStack Query

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
        queryKey: ['products', filters],
        queryFn: ({ pageParam }) =>
            api.get(`/products?cursor=${pageParam}&pageSize=50`),
        getNextPageParam: (last) => last.nextCursor ?? undefined,
        staleTime: 5 * 60 * 1000,    // 5 min cache
        gcTime: 10 * 60 * 1000,
    });

// Intersection observer trigger
const sentinelRef = useRef(null);
useIntersectionObserver(sentinelRef, () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
});
```

### 3. Web Workers for heavy computation

```tsx
// worker.ts
self.onmessage = ({ data }) => {
    const result = heavyTransform(data); // runs off the main thread
    self.postMessage(result);
};

// component.tsx
const workerRef = useRef<Worker>();
useEffect(() => {
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url));
    workerRef.current.onmessage = (e) => setResult(e.data);
    return () => workerRef.current?.terminate();
}, []);

const processData = (rawData: unknown[]) => workerRef.current?.postMessage(rawData);
```

### 4. Debounce + abort controller for search

```tsx
const abortRef = useRef<AbortController>();

const search = useDebouncedCallback(async (term: string) => {
    abortRef.current?.abort();               // cancel in-flight request
    abortRef.current = new AbortController();
    const data = await api.get(`/search?q=${term}`, {
        signal: abortRef.current.signal
    });
    setResults(data);
}, 300);
```

### 5. Memoization and render control

```tsx
// Memoize expensive row renders
const ProductRow = memo(({ item }: { item: Product }) => (
    <div>{item.name} — {item.stock}</div>
), (prev, next) => prev.item.id === next.item.id && prev.item.stock === next.item.stock);

// Stable callbacks
const handleSelect = useCallback((id: number) => {
    setSelected(prev => new Set(prev).add(id));
}, []);

// Defer non-critical updates
const [isPending, startTransition] = useTransition();
const applyFilter = (f: Filter) => startTransition(() => setFilter(f));
```

---

## Architecture diagram> Click any node in the diagram to dive deeper into that specific pattern.

---

## Quick decision reference

| Scenario | Pattern | Why |
|---|---|---|
| Browse 100k+ rows | Cursor pagination + Virtualizer | No DB skip cost, only DOM nodes in view rendered |
| Export 50k+ records | `IAsyncEnumerable` stream | Constant memory, no 500MB response buffering |
| Search-as-you-type | Debounce 300ms + AbortController | Cancels stale requests, prevents race conditions |
| Repeated read-heavy queries | L1 memory + L2 Redis | 99% of reads never hit the DB |
| Heavy filter recalculation | `useTransition` + Web Worker | UI stays responsive, compute off main thread |
| Bulk import (10k+ rows) | Background job + chunked `SaveChanges` | 202 Accepted immediately, process async |
| Real-time progress | SignalR / SSE | Push state from background job to UI |
| N+1 query risk | `AsSplitQuery` + `AsNoTracking` | Prevents cartesian explosion, no change-tracking overhead |

## Critical indexing rules (SQL Server / PostgreSQL)

```sql
-- Covering index for cursor pagination (include all projected columns)
CREATE INDEX IX_Products_Id_Covering
    ON Products (Id)
    INCLUDE (Name, CategoryId, Stock, Price, UpdatedAt);

-- Composite for filtered + sorted queries
CREATE INDEX IX_Products_Category_Stock
    ON Products (CategoryId, Stock DESC)
    INCLUDE (Name, Price);

-- Partial index for active records only
CREATE INDEX IX_Orders_Active
    ON Orders (CreatedAt DESC)
    WHERE Status IN ('Pending', 'Processing');
```

The single biggest performance wins at scale are: **cursor pagination over offset**, **virtualizing the DOM**, and **multi-layer caching**. Everything else builds on top of those three.
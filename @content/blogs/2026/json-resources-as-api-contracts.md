---
title: "JSON Resources as API Contracts in Laravel: Standard Shapes, Versioning, and Data Hygiene"
date: "2025-11-01"
description: "Why I treat Laravel JSON Resources as stable API contracts—envelopes, versioning, and leak-proof responses."
readTime: "6 min"
tags: ["Laravel", "API", "Resources", "Versioning", "Contracts"]
---

I treat JSON Resources as the API contract: they define what clients can rely on and let me evolve internals safely.

---

## Why Treat JSON Resources as Contracts?
- They define the public shape of your API—clients rely on them.
- Hide internals: rename/move backend fields without breaking consumers.
- Enforce consistency (envelopes, timestamps, links) and versioning.

---

## Core Practices
- **Envelope once, reuse everywhere**: e.g., `{ data, meta, links, errors }`.
- **Stable keys**: pick snake_case or camelCase and stick to it.
- **Data minimization**: expose only what clients need; omit internals/secrets.
- **Version discipline**: evolve via `v1`, `v2` resources/namespaces; never silently change meaning.

---

## Resource Skeleton (v1)
```php
class LeaveResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'type'       => $this->type,
            'status'     => $this->status,
            'period'     => [
                'start' => $this->start_date?->toDateString(),
                'end'   => $this->end_date?->toDateString(),
            ],
            'owner'      => new UserTinyResource($this->whenLoaded('user')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
```
Principles: explicit keys, nested structures, `whenLoaded` to avoid N+1, ISO timestamps.

---

## Standardizing the Envelope
```php
class ApiResource extends JsonResource
{
    public function with($request)
    {
        return [
            'meta' => [
                'trace_id' => $request->header('X-Request-Id'),
                'version'  => 'v1',
            ],
        ];
    }
}
```
Then extend it:
```php
class LeaveResource extends ApiResource { /* ... */ }
```
For collections, use `LeaveResource::collection($leaves)`; Laravel wraps with `data`.

---

## Preventing Leakage of Internal Fields
- Never return raw models—always Resources.
- Omit foreign keys unless needed; prefer meaningful references/links.
- Strip columns like `password`, tokens, internal flags.
- Use `when()` / `mergeWhen()` for conditional fields (e.g., admin-only):
```php
'admin_notes' => $this->when(
    $request->user()?->can('viewAdminNotes', $this->resource),
    $this->admin_notes
),
```

---

## Versioning Strategies
- Namespace: `App\Http\Resources\V1\...`, `V2\...`.
- Duplicate only what changes; share transformers where possible.
- Deprecate gracefully: warn via `meta.deprecated` before removal; document EOL.

Example v2 tweak:
```php
class LeaveResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'     => $this->id,
            'kind'   => $this->type, // renamed from 'type'
            'status' => $this->status,
            'period' => ['from' => ..., 'to' => ...],
            'links'  => ['self' => route('leaves.show', $this)],
        ];
    }

    public function with($request)
    {
        return ['meta' => ['version' => 'v2']];
    }
}
```

---

## Error Shape Consistency
Define a uniform error contract (422, 403, 404, 500):
```json
{
  "errors": [
    { "code": "validation_failed", "field": "start_date", "message": "Must be a valid date" }
  ],
  "meta": { "trace_id": "..." }
}
```
Keep `code` stable even if wording changes.

---

## Performance & N+1
- Use `whenLoaded` + eager-load in controllers/Actions.
- For heavy lists, `Resource::collection($query->paginate())` to include `links` and `meta.pagination`.
- Avoid expensive derived fields inside `toArray`; precompute/cache.

---

## Testing the Contract
- Snapshot/structure tests: verify keys, types, and absence of sensitive fields.
- Versioned tests: separate suites for v1/v2 to catch regressions.
- Ensure pagination envelopes are stable (`links`, `meta` present).

---

## Rollout Tips
- Document every field (name, type, nullable, example) and version.
- Use feature flags to introduce new fields safely.
- Log usage of deprecated versions to plan cutover.

**Takeaway**: Treat JSON Resources as stable contracts. Standard envelopes, disciplined versioning, data minimization, and tests keep clients happy while your backend evolves.

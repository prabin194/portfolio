---
title: "Designing Consistent API Errors in Laravel: Envelopes, Messages, and Status Codes"
date: "2025-10-23"
description: "How I build a unified JSON error contract in Laravel—stable codes, clean envelopes, and disciplined status mapping."
readTime: "6 min"
tags: ["Laravel", "API", "Errors", "Contracts", "HTTP"]
---

A unified error contract keeps clients predictable and observability clean. Here’s how I shape API errors in Laravel.

---

## Why a Unified Error Contract?
- One shape to parse, regardless of origin.
- Structured fields (`code`, `trace_id`) improve logging/dashboards.
- Safe evolution: change wording without breaking clients keyed on codes.

---

## Recommended Error Envelope
```json
{
  "errors": [
    {
      "code": "validation_failed",
      "field": "email",
      "message": "The email must be a valid address."
    }
  ],
  "meta": {
    "trace_id": "req-123",
    "version": "v1"
  }
}
```
Rules: `errors` is always an array; `code` is stable; include `field` when relevant; echo `trace_id` for correlation; `meta.version` for contract visibility.

---

## HTTP Status Codes (be intentional)
- 400 Bad Request: malformed JSON/unsupported content-type.
- 401 Unauthorized: missing/invalid auth (not permission failure).
- 403 Forbidden: authenticated but not allowed.
- 404 Not Found: missing (or hidden) resource.
- 409 Conflict: business rule clash/state transition invalid.
- 422 Unprocessable Entity: validation errors.
- 429 Too Many Requests: include `Retry-After`.
- 500 Server Error: unexpected; keep message generic.

---

## Validation Errors (422)
Convert Form Request errors to your envelope:
```php
public function invalidJson($request, ValidationException $exception)
{
    return response()->json([
        'errors' => collect($exception->errors())->flatMap(function ($messages, $field) {
            return collect($messages)->map(fn ($m) => [
                'code' => 'validation_failed',
                'field' => $field,
                'message' => $m,
            ]);
        })->values(),
        'meta' => [
            'trace_id' => $request->header('X-Request-Id'),
            'version'  => 'v1',
        ],
    ], 422);
}
```

---

## Authorization & Policies (403)
```json
{
  "errors": [{ "code": "forbidden", "message": "You do not have permission to perform this action." }],
  "meta": { "trace_id": "..." }
}
```
Avoid leaking resource existence.

---

## Business Rule Conflicts (409)
```json
{
  "errors": [{ "code": "state_conflict", "message": "Leave request is not pending." }]
}
```

---

## Rate Limits (429)
Include backoff hints and header:
```json
{
  "errors": [{ "code": "rate_limited", "message": "Too many attempts." }],
  "meta": { "retry_after": 30, "trace_id": "..." }
}
```

---

## Server Errors (500)
Generic outward message; log internally with trace_id:
```json
{
  "errors": [{ "code": "server_error", "message": "Something went wrong. Please try again." }],
  "meta": { "trace_id": "..." }
}
```

---

## Centralizing Error Responses
- Create a responder/helper to build envelopes.
- Map exceptions in the handler: Validation→422, Auth→401, Forbidden→403, NotFound→404, Conflict→409, RateLimit→429, fallback→500.
- Always return JSON.

---

## Testing Checklist
- Assert status + envelope for validation, forbidden, not found, conflict, rate limit, server error.
- `errors` is an array; `code` present; `trace_id` echoed when provided.
- Snapshot error payloads for versioned APIs.

---

## Versioning & Deprecation
- Embed `meta.version` in every response.
- For changes, add `meta.deprecated: true` before removing fields/codes.
- Keep `code` stable; add new codes instead of mutating meaning.

---

## Practical Tips
- Verb-noun, scoped codes: `validation_failed`, `forbidden`, `state_conflict`, `rate_limited`.
- Localize messages on server or let clients localize off `code`.
- Propagate `X-Request-Id` and echo as `trace_id`.
- Cap `per_page`; never leak stack traces in prod.

**Takeaway**: A unified error envelope + disciplined status codes turns failures into predictable, debuggable signals while keeping your API contract stable.

---
title: "A Feature-First, Action-Driven Laravel Architecture (With SOLID Applied)"
date: "2026-02-06"
description: "How I structure Laravel APIs with thin controllers, form requests, actions, and resources—aligned with SOLID."
readTime: "5 min"
tags: ["Laravel", "Architecture", "SOLID", "API"]
---

Over time, I’ve settled on a **feature-first, action-driven architecture** for Laravel APIs:

**Thin Controllers + Form Requests + Actions + API Resources**
(Command-style, one use case per class)

This structure scales well as applications grow and, importantly, it **naturally aligns with the SOLID principles**—without forcing patterns or over-engineering.

---

## How the Pattern Maps to SOLID

Each layer has a single, clear purpose:

* **Single Responsibility (SRP)**
  * Form Requests: validation + authorization  
  * Actions: business logic  
  * Resources: response shaping  
  * Controllers: orchestration  
  * Models: persistence, relations, scopes

* **Open/Closed (OCP)**  
  New behavior is added by introducing new Actions or Resources, not by modifying existing ones.

* **Liskov Substitution (LSP)**  
  Form Requests and Resources respect Laravel’s base contracts and can be substituted without breaking expectations.

* **Interface Segregation (ISP)**  
  Controllers depend only on narrow, purpose-built inputs (`validated()` data) and a single Action method (`execute()`).

* **Dependency Inversion (DIP)**  
  Controllers depend on Actions (application-level abstractions for business logic), not on database or model details.

---

## Conceptual Folder Structure

```
app/
├── Actions/<Feature>/...
├── Http/
│   ├── Controllers/API/<Feature>Controller.php
│   ├── Requests/<Feature>/...
│   └── Resources/<Feature>/...
├── Models/
├── Traits/
database/
├── migrations/
routes/
└── api.php
```

* **Actions**: one class per use case  
* **Requests**: validation and authorization  
* **Resources**: public API contracts  
* **Controllers**: thin coordinators  
* **Models**: lean Eloquent models (relations, scopes, casts)

---

## End-to-End Flow (Create Leave Example)

1. `POST /api/leaves` → `LeaveController@store`  
2. `LeaveStoreRequest` handles validation and authorization  
3. Controller calls `LeaveStoreAction->execute($request)`  
4. Action performs the business logic (transaction if needed)  
5. Response is returned via `LeaveResource`

---

## Example Implementation

### Migration

```php
Schema::create('leaves', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('type');
    $table->date('start_date');
    $table->date('end_date');
    $table->text('reason')->nullable();
    $table->timestamps();
});
```

### Model

```php
class Leave extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = ['id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUpcoming($query)
    {
        return $query->whereDate('start_date', '>=', today());
    }
}
```

### Shared Trait

```php
trait WithDbTransaction
{
    protected function inTransaction(callable $callback)
    {
        return DB::transaction(fn () => $callback());
    }
}
```

### Form Request

```php
class LeaveStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Leave::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'type'       => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'reason'     => 'nullable|string|max:1000',
        ];
    }
}
```

### Action

```php
class LeaveStoreAction
{
    use WithDbTransaction;

    public function execute(LeaveStoreRequest $request): Leave
    {
        $data = $request->validated();

        return $this->inTransaction(fn () =>
            Leave::create([
                ...$data,
                'user_id' => $request->user()->id,
            ])
        );
    }
}
```

### API Resource

```php
class LeaveResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'type'       => $this->type,
            'period'     => [$this->start_date, $this->end_date],
            'reason'     => $this->reason,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
```

### Controller

```php
class LeaveController extends Controller
{
    public function store(
        LeaveStoreRequest $request,
        LeaveStoreAction $action
    ) {
        $leave = $action->execute($request);

        return new LeaveResource($leave);
    }
}
```

### Route

```php
Route::post('/leaves', [LeaveController::class, 'store']);
```

---

## Why This Works in Practice

* Controllers stay small and readable  
* Business logic lives in Actions, not controllers or models  
* Each layer has one reason to change  
* Behavior is extended by adding classes, not modifying existing ones  
* The public API contract is explicitly defined via Resources

This results in a system that is **predictable, testable, and resilient to growth**.

---

## Advantages

* Consistent structure across features  
* Easy to unit-test Actions in isolation  
* Feature-test controllers without mocking internals  
* Reusable Actions across HTTP, jobs, and console commands

---

## Trade-Offs to Watch

* Many small classes — keep feature folders organized  
* Avoid overusing traits; keep them small and specific  
* Choose `execute()` or `__invoke()` and stay consistent  
* Clear config and route caches in CI to avoid stale state

---

## Practical Guidelines

* Use **verb-based Action names** (`CreateLeave`, `ApproveLeave`, `CancelLeave`)  
* Share validation logic via base Form Requests per feature  
* Standardize API envelopes in a base controller or helper  
* Wrap multi-write operations in transactions inside Actions  
* Treat Resources as the public contract — never leak internal fields

This approach doesn’t fight Laravel — it **leans into the framework while keeping application logic clean, explicit, and SOLID-friendly**.

---
title: "Activity Auditing in Laravel with Spatie: Structured Logs and a Queryable Feed"
date: "2025-10-06"
description: "How I use Spatie Activitylog with a feature-first stack to capture who did what, with consistent metadata and a searchable feed."
readTime: "6 min"
tags: ["Laravel", "Logging", "Spatie", "Security", "Audit"]
---

I lean on Spatie Activitylog for audit trails. Paired with a feature-first, action-driven stack (Form Requests → Actions → Resources), it gives consistent, queryable events that are safe to expose.

---

## Why Spatie Activitylog?
- Minimal boilerplate: traits on models or `activity()` calls in Actions.
- Flexible metadata: `properties` JSON for device/IP/old/new values.
- Built-in query API for feeds (search, date, subject/causer filtering).

---

## Model-Level Logging (automatic)
```php
class ForestSurvey extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = ['id'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('forest_survey')
            ->dontSubmitEmptyLogs();
    }
}
```
**Use when** CRUD snapshots are enough.  
**Watchouts**: exclude sensitive fields; log names help filter feeds.

---

## Action-Level Logging (richer context)
```php
class LeaveStoreAction
{
    public function execute(LeaveStoreRequest $request): Leave
    {
        $leave = Leave::create([...]);

        activity('leave')
            ->performedOn($leave)
            ->causedBy($request->user())
            ->withProperties([
                'ip' => $request->ip(),
                'ua' => $request->userAgent(),
                'reason' => $request->input('reason'),
            ])
            ->event('created')
            ->log('Leave created');

        return $leave;
    }
}
```
**Use when** you need domain verbs (approve, cancel) or request/device metadata.

---

## Structuring Log Metadata
Baseline keys I keep consistent:
- `ip`, `ua`, `device` (or hashed fingerprint)
- `actor_role` snapshot (optional)
- `old`, `new` for key fields on updates
- domain context (`leave_type`, `status_before/after`, `amount`)
- `request_id` or `activity_uid` for correlation

Consistency makes feeds easy to query and parse.

---

## Building a Queryable Activity Feed
**Controller outline**
```php
class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with('causer')
            ->when($request->filled('event'), fn($q) => $q->where('event', $request->event))
            ->when($request->filled('log_name'), fn($q) => $q->where('log_name', $request->log_name))
            ->when($request->filled('causer_id'), fn($q) => $q->where('causer_id', $request->causer_id))
            ->when($request->filled('subject_type'), fn($q) => $q->where('subject_type', $request->subject_type))
            ->when($request->filled('date_from'), fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->latest();

        $activities = $query->paginate($request->get('per_page', 15));

        return ActivityLogResource::collection($activities);
    }
}
```

**Resource**
```php
class ActivityLogResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'event'      => $this->event,
            'log_name'   => $this->log_name,
            'description'=> $this->description,
            'actor'      => $this->causer?->only(['id','name','email']),
            'subject'    => [
                'type' => class_basename($this->subject_type),
                'id'   => $this->subject_id,
            ],
            'properties' => $this->properties,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
```

---

## Exposure & Security
- Strip secrets from `properties`; never log tokens/passwords/PII you don’t need.
- Gate feed endpoints via policies (admins see all; users see their own).
- Paginate with sensible caps; filter by date/event/log_name.
- Redact sensitive fields before responding.

---

## Edge Cases & Hygiene
- Bulk updates: log a summary event instead of per-row.
- Idempotent actions: use request IDs to avoid double-logging.
- Timezones: store UTC; convert in Resources/UI.
- Backfills/migrations: tag `event = backfill`.

---

## Testing Checklist
- Logs created with correct `event`, `log_name`, `causer`, `subject`.
- Properties have expected keys; no sensitive data.
- Feed filters work: event/log_name/date/subject/causer.
- Pagination caps respected; unauthorized users get 403.

---

## Performance Tips
- Index `log_name`, `event`, `causer_id`, `subject_type+subject_id`, `created_at`.
- Prune or archive old logs if volume is large.
- For chatty domains, batch-create logs in a queue job.

---

**Takeaway**  
Define a consistent metadata schema, log at the Action level when you need context, and expose a filtered feed through Resources. Spatie Activitylog becomes a trustworthy audit trail for users and auditors alike.

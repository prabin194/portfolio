---
title: "Role & Permission Architecture in Laravel APIs: Gating Actions with Policies and Form Requests"
date: "2025-12-03"
description: "How I gate Laravel API actions with policies, form requests, and feature-first actions while keeping SOLID and least privilege."
readTime: "6 min"
tags: ["Laravel", "Authorization", "Policies", "Roles", "Security"]
---

I use a **feature-first, action-driven** approach for Laravel APIs: thin controllers → Form Requests → Actions → Resources, with policies enforcing permissions. This keeps authorization explicit, testable, and SOLID-aligned.

---

## Core Pattern
- Feature-first, action-driven: Controllers stay thin; Form Requests handle validation/authorization; Actions do business logic; Policies enforce permissions; Resources shape responses.
- Principles: SOLID + least privilege + explicit contracts per endpoint.

---

## Building Blocks
- **Roles & permissions**: Stored in tables or via Spatie. Users get permissions directly or through roles.
- **Policies**: One per aggregate (e.g., `LeavePolicy`, `UserPolicy`), methods named after abilities (`view`, `create`, `update`, `delete`, `approve`, etc.).
- **Form Requests**: Call `$this->authorize()` or implement `authorize()` to delegate to policies; validate payloads.
- **Actions**: Assume auth/validation passed; contain business rules.
- **Resources**: Hide fields users shouldn’t see; enforce data minimization.

---

## Flow for a Protected Endpoint (Approve Leave)
1) Route → `LeaveController@approve`  
2) `ApproveLeaveRequest` (`authorize()` calls `Gate::authorize('approve', $leave)`; validates status)  
3) Controller resolves `ApproveLeaveAction` → `execute($request, $leave)`  
4) Action updates model, logs activity/audit, fires events  
5) `LeaveResource` returns only allowed fields

---

## Policy Example
```php
class LeavePolicy
{
    public function view(User $user, Leave $leave): bool
    {
        return $user->id === $leave->user_id || $user->can('leave.viewAny');
    }

    public function approve(User $user, Leave $leave): bool
    {
        return $user->can('leave.approve') && $leave->status === 'pending';
    }
}
```

## Form Request Example
```php
class ApproveLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        $leave = $this->route('leave');
        return $this->user()?->can('approve', $leave);
    }

    public function rules(): array
    {
        return ['approved_notes' => 'nullable|string|max:500'];
    }
}
```

## Action Example
```php
class ApproveLeaveAction
{
    public function execute(ApproveLeaveRequest $request, Leave $leave): Leave
    {
        if ($leave->status !== 'pending') {
            throw ValidationException::withMessages(['status' => 'Not pending']);
        }

        $leave->forceFill([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
        ])->save();

        // Audit/event hooks here
        return $leave->fresh();
    }
}
```

## Resource Example (data minimization)
```php
class LeaveResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'      => $this->id,
            'type'    => $this->type,
            'status'  => $this->status,
            'period'  => [$this->start_date, $this->end_date],
            'owner'   => $this->when(
                $request->user()->can('view', $this->resource),
                fn () => new UserResource($this->user)
            ),
        ];
    }
}
```

---

## Onboarding New Users Safely
- **Least privilege default**: assign a minimal role at signup.  
- **Progressive grants**: elevate via admin workflows; log who granted what, when.  
- **Email/OTP verification**: require before state-changing actions.  
- **Contextual checks**: policies combine role + ownership + status.  
- **Defense in depth**: Form Request authorize + controller authorize (optional) + Action preconditions.  
- **Audit trail**: log permission changes and key decisions with actor/device/IP.  
- **Rate limits**: per-route throttles for sensitive endpoints.

---

## Testing Checklist
- Policy coverage: allowed/denied per ability.  
- Form Request authorization: 403 when unauthorized; valid payload passes.  
- Action invariants: status/ownership guards.  
- Resource leaks: sensitive fields absent without permission.  
- Role changes: permission changes take effect immediately.

---

## Common Pitfalls & Remedies
- **Drift between policy and UI**: keep ability names clear; mirror them in front-end flags.  
- **God roles**: avoid all-powerful roles; scope admin abilities.  
- **Hidden N+1 in policies**: eager-load before `authorize()` when policies query relations.  
- **Stale permissions in tokens**: use short TTL or permission versioning if using JWT.

---

## Practical Tips
- Verb-first, resource-scoped permissions (`leave.viewAny`, `leave.approve`, `user.invite`).  
- Form Requests per action/verb; share base rules via abstracts if needed.  
- Centralize response envelopes for consistent 401/403/422 handling.  
- Wrap multi-write operations in transactions inside Actions.  
- Treat Resources as the public contract—never leak internal fields.

This structure keeps authorization explicit, testable, and auditable while letting you grow features without accruing security debt.

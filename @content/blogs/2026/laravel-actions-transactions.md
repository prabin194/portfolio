---
title: "Keeping Laravel Actions Consistent: Transactions, Partial-Write Safety, and Tests"
date: "2025-11-12"
description: "When and how I wrap Laravel Actions in transactions to avoid partial writes, defer side-effects, and test rollbacks."
readTime: "5 min"
tags: ["Laravel", "Transactions", "Testing", "Architecture"]
---

I keep Controllers thin, Form Requests for validation/authorization, and Actions for business logic. When Actions perform multi-step changes, I wrap them in transactions to avoid partial writes and to keep side-effects consistent.

---

## When to Use a Transaction
- Multi-write operations: create/update multiple models in one flow (record + log + attachments).
- Money/stock/quotas: anything that must be “all or nothing.”
- Cross-table invariants: totals, counters, status transitions spanning rows.
- External side-effects that can be deferred: do DB work in a transaction, queue side-effects after commit.

## When to Skip
- Read-only endpoints.
- Simple single-row writes where failure risk is tiny and latency matters.
- Long-running or I/O-heavy work inside the transaction (avoid lock contention).

---

## Reusable Transaction Helper
```php
trait WithDbTransaction
{
    protected function inTransaction(callable $callback)
    {
        return DB::transaction(fn () => $callback());
    }
}
```
Attach to Actions that need atomicity:

```php
class ApproveLeaveAction
{
    use WithDbTransaction;

    public function execute(ApproveLeaveRequest $request, Leave $leave): Leave
    {
        return $this->inTransaction(function () use ($request, $leave) {
            if ($leave->status !== 'pending') {
                throw ValidationException::withMessages(['status' => 'Not pending']);
            }

            $leave->forceFill([
                'status'      => 'approved',
                'approved_by' => $request->user()->id,
            ])->save();

            // queue side-effects AFTER commit
            dispatch(fn () => Mail::to($leave->user)->send(new LeaveApprovedMail($leave)));

            return $leave->fresh();
        });
    }
}
```
**Why**: any exception rolls back all DB changes; queued jobs run after commit so they don’t see partial state.

---

## Avoiding Partial Writes
- Guard status transitions: check current status inside the transaction.
- Check ownership/quotas with fresh reads inside the transaction.
- Defer side-effects: queue emails/SMS/API calls after commit; pass IDs, not models.
- Use `fresh()` after commit when returning data.
- Consistent errors: throw `ValidationException` for domain rules → 422.

## Handling Contention
- Keep transactions short; no HTTP calls inside.
- Let DB constraints work (unique indexes, FK cascades).
- Use atomic increments for counters inside the transaction.

---

## Testing Transactional Paths
- Happy path: assert data changes and jobs dispatched.
- Rollback: trigger a failing invariant and assert no rows changed.
- Partial-write guard: simulate an exception mid-way and assert first write is rolled back.
- Idempotency: double-call doesn’t double-apply if forbidden.
- Events after commit: `Bus::fake()` / `Mail::fake()` to ensure side-effects only on success.

Example rollback test:
```php
public function test_approve_leave_rolls_back_on_invalid_status()
{
    Bus::fake();

    $leave = Leave::factory()->create(['status' => 'approved']);
    $request = ApproveLeaveRequest::create('/leaves/'.$leave->id, 'POST');
    $request->setUserResolver(fn() => User::factory()->create());

    $this->expectException(ValidationException::class);

    (new ApproveLeaveAction())->execute($request, $leave);

    $this->assertEquals('approved', $leave->fresh()->status);
    Bus::assertNothingDispatched();
}
```

---

## Practical Tips
- Standardize on one transaction helper/trait.
- Name Actions with verbs so atomic ones are obvious (`Create`, `Approve`, `Cancel`).
- Add unique indexes and FK constraints; transactions + constraints give strong guarantees.
- In CI, run with DB refresh/transactions to catch isolation issues.

**Takeaway**: Wrap multi-step Actions in transactions, keep them short, defer side-effects, and test both success and failure paths to eliminate partial writes.

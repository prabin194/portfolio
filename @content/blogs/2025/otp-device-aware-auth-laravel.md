---
title: "OTP + Device-Aware Authentication in Laravel: Flows, Tracking, and Edge Cases"
date: "2025-11-24"
description: "Feature-first, action-driven OTP login with device awareness, rate limits, and clean SOLID-aligned layers."
readTime: "6 min"
tags: ["Laravel", "Authentication", "OTP", "Security", "Architecture"]
---

I use a **feature-first, action-driven** structure for OTP + device-aware auth in Laravel: thin controllers → Form Requests → Actions → Resources. OTP and device logic stay in dedicated Actions; validation lives in Form Requests; responses go through Resources.

---

## Architecture Snapshot
- Actions: `SendOtpVerificationAction`, `ResendOtpAction`, `VerifyOtpAction`, `LoginActivityAction`, `DeviceDetectorAction`, etc.
- Requests: `LoginUserRequest`, `ResendOtpRequest`, `VerifyOtpRequest` to validate + authorize.
- Models/Logging: User + activity log (e.g., Spatie) to capture device/IP/UA data.
- Traits: Helpers for shared concerns (e.g., DB transactions or logging helpers).
- Controllers: only coordinate—resolve Form Request → call Action → return JSON/Resource.

---

## 1) Login + OTP Issue Flow
1. User submits email/password → `LoginAction->execute($request)`.
2. Form Request validates credentials; on success, session regenerates.
3. `LoginActivityAction` records device fingerprint/IP/UA.
4. `SendOtpVerificationAction` sends OTP via SMS/email.
5. Response returns activity ID + user resource; client moves to OTP screen.

**Key points**
- Never store raw OTP; hash + expiry in DB/cache.
- Tie OTP to a specific activity/session to prevent reuse.
- Rate-limit OTP sends per user/device/IP.

---

## 2) Resend Flow
- Guarded by `ResendOtpRequest` (validates activity/user, throttle).
- `ResendOtpAction` issues a new OTP, invalidates previous token, modestly extends expiry.
- Log resend in activity log for audit/abuse detection.

---

## 3) Verify Flow
1. Client posts OTP + activity ID.  
2. `VerifyOtpRequest` validates shape and rate limits.  
3. `VerifyOtpAction`:
   - Checks token validity, expiry, match.
   - Marks activity verified; stores verified_at + device fingerprint.
   - Issues auth token / sets session.
4. Resource returns flags like `device_trusted`, `requires_mfa`, etc.

**Edge cases**
- Expired OTP → clear token, prompt resend.
- Incorrect attempts → increment counter; lock after N tries; surface retry-after.
- Replay prevention → single-use tokens; rotate on each resend.
- Desync between devices → bind OTP to activity ID + user ID; invalidate on success.

---

## 4) Device Awareness
- `DeviceDetectorAction` parses UA/IP, tags activity with device/OS/browser.
- On verify success, store a hashed fingerprint (UA+IP+optional client id).
- Same device can be fast-pathed; unknown device triggers stricter checks.

---

## 5) Activity Logging
- Use an activity log model to record:
  - events: login_attempt, login_success, otp_sent, otp_resend, otp_verify_fail/success
  - user_id, activity_id, device info, IP, UA, timestamps
- Provide an API endpoint to list activity for the current user (filters: event/date).

---

## 6) Response Shapes (Resources)
- OTP sent: `{ activity_id, user, otp_required: true }`
- Verify success: `{ token|session, user, device_trusted: bool, next: "dashboard" }`
- Errors: `{ message, code, retry_after?, attempts_left? }`

---

## 7) Security & UX Safeguards
- Rate limits: per-user + per-IP for send/resend/verify.
- Lockouts: temp lock after N bad OTPs; return `retry_after`.
- Expiry: short-lived (5–10 min); regen on resend.
- Transport: sign emails/SMS; never echo OTPs back.
- Observability: log anomalies (multi-device, rapid resends, geo jumps).

---

## 8) Testing Checklist
- Happy paths: login → otp → verify; resend then verify.
- Failure: wrong OTP, expired, too many attempts, replayed token.
- Device tagging: same UA/IP recognized; new UA/IP marked new.
- Rate limits: send/verify caps return 429 with retry.
- Logging: events written with correct metadata.

---

## 9) Quick Code Skeleton (illustrative)
```php
// Controller
public function verify(VerifyOtpRequest $request, VerifyOtpAction $action)
{
    $result = $action->execute($request);
    return new AuthResponseResource($result);
}

// Action
class VerifyOtpAction
{
    public function execute(VerifyOtpRequest $request): array
    {
        $otp = $request->input('otp');
        $activityId = $request->input('activity_id');

        // 1) load activity & token, 2) validate, 3) mark verified, 4) issue token
        // ...domain logic...
        return ['user' => $user, 'token' => $token, 'device_trusted' => $trusted];
    }
}
```

---

## Takeaways
- Separate concerns: Requests validate, Actions enforce business rules, Resources shape outputs, logging records the narrative.
- Bind OTPs to activities/devices to kill replay risk.
- Device metadata + activity logs give security signals and user transparency.
- Rigorous rate limiting and unified error envelopes keep the experience secure and predictable.

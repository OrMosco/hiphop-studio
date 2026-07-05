# RPD — Login & Password Improvement (Google Sign-In Sync)

## 1. Problem
The current login flow (`src/pages/Login.jsx`, `src/pages/StudentLogin.jsx`) only asks for a phone number, with a `TODO` comment noting it should later be replaced by real Supabase OTP. There is no password, no account recovery, and no way to sync a user's identity across devices. For this app (studio class sign-ups for a small group of students), **security risk is low** — the priority is making entry as fast and frictionless as possible.

## 2. Goal
Make login **super easy and light**: one tap, no password to remember, and automatic sync via Google (so a student who signs in on her phone is already signed in if she opens the site on another device with the same Google account).

## 3. Non-Goals
- No enterprise-grade security (MFA, password complexity rules, session hardening).
- No custom password reset flows — passwords are being removed entirely, not improved.
- No new backend framework — reuse the `@supabase/supabase-js` dependency already in `package.json`.

## 4. Proposed Solution: "Sign in with Google" via Supabase Auth
Supabase Auth supports Google as an OAuth provider out of the box, which fits the existing dependency and requires no custom backend code.

### User Flow
1. Student taps a single **"התחברות עם Google" (Sign in with Google)** button on `Login.jsx` / `StudentLogin.jsx`.
2. Google's account picker opens (or auto-selects if already signed into the browser/device).
3. Supabase exchanges the Google token for a session and returns the user's profile (name, email, avatar).
4. App stores the Supabase session (handled automatically by `supabase-js`, persisted in `localStorage`), so the student stays logged in across visits and devices without re-entering anything.
5. First-time sign-in auto-creates a student record (matched/linked by email) instead of the current manual phone lookup against `MOCK_STUDENTS`.

### Why this is "super easy and light"
- **Zero fields to fill** — no phone number typing, no password, no OTP code to wait for/copy.
- **One tap** — Google handles identity; returning users on the same device aren't prompted again.
- **Cross-device sync for free** — signing in with the same Google account on a new phone/laptop restores the same account instantly.
- **No password = no "forgot password" support burden** — nothing to reset, nothing to leak.

## 5. Implementation Outline
1. **Supabase project setup**: Enable the Google provider in Supabase Auth settings, add OAuth client ID/secret from Google Cloud Console, set redirect URL.
2. **Client setup**: Add a `src/lib/supabaseClient.js` (if not already present) initializing `createClient(url, anonKey)`.
3. **UI change**: Replace the phone `<input>` + `Btn` in `Login.jsx`/`StudentLogin.jsx` with a single Google sign-in button calling `supabase.auth.signInWithOAuth({ provider: 'google' })`.
4. **Session handling**: Use `supabase.auth.onAuthStateChange` in `App.jsx` to detect the logged-in user and route to the dashboard automatically — removing the current manual `onLogin`/`onSuccess` phone-matching logic.
5. **Student record linking**: On first login, look up (or create) a row in the students table by the Google-verified email instead of by phone, keeping `MOCK_STUDENTS`-style data but keyed on email.
6. **Remove password/OTP TODOs**: Delete the `TODO: להחליף ב-Supabase OTP אמיתי` comment and the "demo only" disclaimer text, since Google sign-in is now the real auth method.

## 6. Rollout Considerations
- Keep the flow RTL/Hebrew-consistent with a Hebrew label on the Google button (Google's button supports localization).
- Since security risk is accepted as low, no additional verification step (e.g., phone confirmation) is required after Google sign-in.
- Existing students without a Google account can be migrated by asking them to sign up once with the Google account tied to their existing phone/email on file.

## 7. Success Criteria
- A student can go from "not logged in" to "on the dashboard" in one tap, with no typing.
- Returning on a different device with the same Google account restores the session without any manual re-entry.
- No password fields, reset flows, or OTP codes remain anywhere in the login UI.

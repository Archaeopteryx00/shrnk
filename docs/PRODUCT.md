# PRODUCT.md

> Defines what LinkLite does, who uses it, and the rules that govern its behavior.
> Use this as the authority for business logic decisions.

---

## Product Summary

LinkLite is a URL shortening service. Authenticated users submit a long URL and receive a short, shareable link. Every redirect is recorded. Users can view click counts and history per link through a personal dashboard.

---

## Users

### Visitor (unauthenticated)
- Can access the redirect endpoint (`/:shortCode`).
- Cannot view, create, or manage any links.
- Redirected to the original URL without needing an account.

### Member (authenticated)
- Can register and log in.
- Can create, view, update, and delete their own links.
- Can view analytics for their own links.
- Cannot access or modify links belonging to other users.

> There is no admin role in the MVP.

---

## Core Flows

### Registration
1. User submits username, email, and password.
2. System validates all fields (see Validation Rules).
3. System checks email uniqueness.
4. Password is hashed with bcrypt.
5. User record is created.
6. Response returns the created user (no token on register).

### Login
1. User submits email and password.
2. System finds the user by email.
3. Password is verified against the stored hash.
4. System generates a signed JWT.
5. Token and user object are returned.

### Create Short Link
1. Authenticated user submits `originalUrl` and optional `title`.
2. System validates the URL format.
3. System generates a unique `shortCode`.
4. ShortLink record is created and linked to the user.
5. Full short URL is returned in the response.

### Redirect
1. Visitor requests `GET /:shortCode`.
2. System looks up the ShortLink by `shortCode`.
3. If not found: return 404.
4. System increments `clickCount` on the ShortLink.
5. System creates a `ClickHistory` record.
6. System redirects (302) to `originalUrl`.

### View Analytics
1. Authenticated user requests stats for a link they own.
2. System returns: `totalClicks`, `createdAt`, `lastClickedAt`, `originalUrl`, full short URL.
3. If the link does not belong to the user: return 403.

---

## Validation Rules

### Register
| Field | Rule |
|-------|------|
| `username` | Required. String. Min 3 chars. Max 30 chars. |
| `email` | Required. Must be valid email format. |
| `password` | Required. Min 8 chars. |

### Login
| Field | Rule |
|-------|------|
| `email` | Required. Must be valid email format. |
| `password` | Required. |

### Create / Update Link
| Field | Rule |
|-------|------|
| `originalUrl` | Required on create. Must be a valid URL (http or https). |
| `title` | Optional. String. Max 100 chars. |

---

## Business Rules

| Rule | Description |
|------|-------------|
| **Ownership** | Users may only read, update, or delete their own links. |
| **shortCode uniqueness** | Every `shortCode` must be globally unique. Regenerate on collision. |
| **Email uniqueness** | No two accounts may share the same email address. |
| **Password storage** | Passwords must never be stored in plaintext. bcrypt only. |
| **Token scope** | JWT contains only `id` and `email`. Never embed sensitive data. |
| **Delete cascade** | Deleting a ShortLink must also delete all related ClickHistory records. |
| **Redirect type** | Redirects use HTTP 302 (temporary), not 301 (permanent). |

---

## Error Scenarios

| Scenario | HTTP Status |
|----------|------------|
| Validation failure | 400 |
| Invalid credentials | 401 |
| Missing or invalid JWT | 401 |
| Accessing another user's resource | 403 |
| Resource not found | 404 |
| Email already registered | 409 |
| Unexpected server error | 500 |

---

## Frontend Pages

| Route | Auth Required | Description |
|-------|--------------|-------------|
| `/login` | No | Login form |
| `/register` | No | Registration form |
| `/dashboard` | Yes | List of user's links with summary stats |
| `/links/new` | Yes | Create new short link |
| `/links/:id/edit` | Yes | Edit link title or URL |
| `/links/:id` | Yes | Link detail and analytics view |

---

## Optional Features (Post-MVP)

The following are explicitly deferred. Do not implement unless added to `TASK.md`.

- Custom alias (`/links/new` lets user choose their own `shortCode`)
- QR code generation per link
- Link expiration date
- Search and filter on dashboard
- Sorting (by date, by clicks)
- Pagination on dashboard

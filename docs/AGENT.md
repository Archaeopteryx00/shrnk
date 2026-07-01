# AGENT.md

> **Primary reference for AI agents.**
> Read this file first before any other document.
> This file defines how to work on this project — not what the project is.

---

## Project Identity

**Name:** LinkLite
**Type:** Full-stack web application
**Domain:** URL shortening with user authentication and analytics

---

## Document Map

| File | Purpose |
|------|---------|
| `AGENT.md` | How to work on this project (you are here) |
| `PRODUCT.md` | What the product does and why |
| `ARCHITECTURE.md` | How the system is structured |
| `STYLE.md` | How code must be written |
| `TASK.md` | What to build and in what order |

**Read order before implementing:** PRODUCT → ARCHITECTURE → STYLE → TASK

---

## How to Use This Repository

- `TASK.md` is the single source of truth for what to implement next.
- Never implement features not listed in `TASK.md` without explicit instruction.
- Never create abstraction layers not specified in `ARCHITECTURE.md`.
- When unsure about code style, defer to `STYLE.md`.
- When unsure about business logic, defer to `PRODUCT.md`.

---

## Scope Boundaries

### In Scope
- REST API with Express.js
- JWT authentication and route protection
- Prisma ORM with PostgreSQL
- React frontend consuming the API
- CRUD for shortened links
- Click tracking and basic analytics
- Redirect service (public)

### Out of Scope
- Custom alias (optional, deferred)
- QR code generation (optional, deferred)
- Link expiration (optional, deferred)
- Email verification
- OAuth / social login
- Rate limiting (unless explicitly added to TASK.md)
- Multi-tenancy

---

## Execution Rules for AI Agents

1. **Implement exactly what is specified.** Do not add unrequested features.
2. **Do not introduce new dependencies** without checking `ARCHITECTURE.md` first.
3. **Follow naming conventions** defined in `STYLE.md` without deviation.
4. **Keep controllers thin.** Business logic may live in controllers only if it is simple.
5. **Do not create a service layer or repository layer** unless `ARCHITECTURE.md` is updated.
6. **Always validate inputs** at the controller level before hitting the database.
7. **Return consistent JSON error shapes** as defined in `ARCHITECTURE.md`.
8. **Never expose password hashes** in any API response.
9. **Every protected route must pass through the auth middleware.**
10. **Do not modify the Prisma schema** without updating `ARCHITECTURE.md`.

---

## Key Terminology

| Term | Meaning |
|------|---------|
| `shortCode` | The unique alphanumeric slug appended to the base URL |
| `originalUrl` | The full destination URL submitted by the user |
| `ShortLink` | The Prisma model representing a shortened URL record |
| `ClickHistory` | The Prisma model recording each redirect event |
| `auth middleware` | Express middleware that validates JWT and attaches `req.user` |
| `protected route` | Any route that requires a valid JWT |
| `public route` | Any route accessible without authentication |
| `owner check` | Verifying that `req.user.id === resource.userId` before mutation |

---

## Environment Variables

The application requires the following variables in `.env`:

```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
CLIENT_URL=
```

Never hardcode any of these values. Never commit `.env` to version control.

---

## Testing Conventions

- Use **Thunder Client** or **Postman** for manual API testing during development.
- No automated test suite is required for the MVP.
- Every endpoint must be manually verified against the acceptance criteria in `TASK.md` before marking a task complete.

# ARCHITECTURE.md

> Defines system structure, data models, API contracts, and cross-cutting conventions.
> Do not deviate from this without updating this document first.

---

## System Overview

```
Browser (React SPA)
      │
      │  HTTP / JSON
      ▼
Express.js REST API  ──►  PostgreSQL (via Prisma)
      │
      │  302 Redirect
      ▼
Original URL
```

The backend is a stateless REST API. The frontend is a single-page React application that communicates exclusively through the API. The redirect service is handled by the same Express server.

---

## Repository Structure

```
linklite/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth and error middleware
│   │   ├── routes/            # Express router definitions
│   │   ├── utils/             # Helpers (jwt, hash, shortCode)
│   │   ├── prisma/            # schema.prisma
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # HTTP server entry point
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/               # Axios instance and request functions
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Route-level page components
    │   ├── context/           # AuthContext (token + user state)
    │   └── main.jsx           # App entry point with router
    ├── .env
    └── package.json
```

---

## Database Schema

### User
```prisma
model User {
  id        Int        @id @default(autoincrement())
  username  String
  email     String     @unique
  password  String
  createdAt DateTime   @default(now())
  links     ShortLink[]
}
```

### ShortLink
```prisma
model ShortLink {
  id          Int            @id @default(autoincrement())
  title       String?
  originalUrl String
  shortCode   String         @unique
  clickCount  Int            @default(0)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  userId      Int
  user        User           @relation(fields: [userId], references: [id])
  clicks      ClickHistory[]
}
```

### ClickHistory
```prisma
model ClickHistory {
  id          Int       @id @default(autoincrement())
  shortLinkId Int
  clickedAt   DateTime  @default(now())
  shortLink   ShortLink @relation(fields: [shortLinkId], references: [id], onDelete: Cascade)
}
```

> `onDelete: Cascade` on ClickHistory ensures records are removed when a ShortLink is deleted.

---

## API Reference

### Base URL
```
http://localhost:{PORT}/api
```

### Authentication Header
```
Authorization: Bearer <jwt>
```

---

### Auth Endpoints

#### POST /api/auth/register
**Body:**
```json
{ "username": "string", "email": "string", "password": "string" }
```
**Success 201:**
```json
{ "user": { "id": 1, "username": "mufti", "email": "mufti@mail.com", "createdAt": "..." } }
```

---

#### POST /api/auth/login
**Body:**
```json
{ "email": "string", "password": "string" }
```
**Success 200:**
```json
{ "token": "eyJ...", "user": { "id": 1, "username": "mufti", "email": "mufti@mail.com" } }
```

---

### Link Endpoints (all protected)

#### GET /api/links
Returns all links belonging to the authenticated user.

**Success 200:**
```json
[
  {
    "id": 1,
    "title": "My Blog",
    "originalUrl": "https://example.com/very/long/url",
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "clickCount": 42,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

#### GET /api/links/:id
Returns a single link owned by the authenticated user.

**Success 200:** Single link object (same shape as above).
**Error 403:** Link exists but belongs to another user.
**Error 404:** Link not found.

---

#### POST /api/links
**Body:**
```json
{ "originalUrl": "https://...", "title": "optional string" }
```
**Success 201:** Created link object including `shortUrl`.

---

#### PUT /api/links/:id
**Body:** (all fields optional)
```json
{ "originalUrl": "https://...", "title": "string" }
```
**Success 200:** Updated link object.
**Error 403:** Not the owner.
**Error 404:** Not found.

---

#### DELETE /api/links/:id
**Success 200:**
```json
{ "message": "Link deleted successfully." }
```
**Error 403:** Not the owner.
**Error 404:** Not found.

---

### Analytics Endpoint (protected)

#### GET /api/links/:id/stats
**Success 200:**
```json
{
  "id": 1,
  "originalUrl": "https://...",
  "shortUrl": "http://localhost:3000/abc123",
  "totalClicks": 42,
  "createdAt": "...",
  "lastClickedAt": "..." 
}
```
> `lastClickedAt` is the `clickedAt` value of the most recent `ClickHistory` record. `null` if never clicked.

---

### Redirect Endpoint (public)

#### GET /:shortCode
- **302** → Redirects to `originalUrl`
- **404** → `{ "error": "Short link not found." }`

---

## Middleware

### `authenticate`
Location: `src/middleware/authenticate.js`

- Reads the `Authorization` header.
- Verifies the JWT using `JWT_SECRET`.
- Attaches decoded payload to `req.user` as `{ id, email }`.
- Returns 401 if token is missing, malformed, or expired.

### Error Handler
Location: `src/middleware/errorHandler.js`

- Registered as the last middleware in `app.js`.
- Catches any error passed via `next(err)`.
- Returns consistent JSON:
```json
{ "error": "Human-readable message." }
```

---

## Error Response Shape

All error responses follow this shape:
```json
{ "error": "Descriptive message." }
```

All success responses return the relevant data object or array directly (no wrapper key), except for delete and login which return `{ message }` and `{ token, user }` respectively.

---

## Utilities

### `generateShortCode`
Location: `src/utils/shortCode.js`

Generates a random alphanumeric string (default length: 6). Must be checked for uniqueness before saving. Regenerate on collision.

### `hashPassword` / `verifyPassword`
Location: `src/utils/hash.js`

Thin wrappers around `bcrypt.hash` and `bcrypt.compare`. Salt rounds: 10.

### `generateToken` / `verifyToken`
Location: `src/utils/jwt.js`

Wrappers around `jsonwebtoken.sign` and `jsonwebtoken.verify`. Payload: `{ id, email }`.

---

## Frontend Architecture

### State Management
- No external state library. Use React Context only for auth state.
- `AuthContext` holds: `{ user, token, login(), logout() }`.
- Token is persisted in `localStorage`.

### API Layer
- All HTTP requests go through a central Axios instance at `src/api/axios.js`.
- The Axios instance attaches the JWT to every request via a request interceptor.
- Per-resource functions (e.g., `getLinks`, `createLink`) are defined in `src/api/links.js` and `src/api/auth.js`.

### Routing
- Use React Router v6.
- Protected routes redirect to `/login` if no token exists in context.

---

## Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| `express` | HTTP framework |
| `prisma` + `@prisma/client` | ORM |
| `jsonwebtoken` | JWT sign and verify |
| `bcrypt` | Password hashing |
| `dotenv` | Environment variable loading |
| `cors` | Cross-origin request handling |

### Frontend
| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP client |

> Do not add packages outside this list without updating this section.

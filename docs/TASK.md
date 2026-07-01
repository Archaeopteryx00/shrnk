# TASK.md

> Implementation plan for LinkLite MVP.
> Tasks are ordered by dependency. Complete each phase fully before moving to the next.
> Each task has acceptance criteria that define "done."

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[x]` | Complete |
| `[~]` | In progress |

---

## Phase 0 — Project Setup

### T-00: Initialize Backend

- [ ] Create `backend/` directory with `npm init -y`
- [ ] Install dependencies: `express`, `prisma`, `@prisma/client`, `jsonwebtoken`, `bcrypt`, `dotenv`, `cors`
- [ ] Create folder structure per `ARCHITECTURE.md`
- [ ] Create `.env` with all required variables (see `AGENT.md`)
- [ ] Create `src/app.js` and `src/server.js` with minimal Express server
- [ ] Confirm server starts and responds to `GET /` with 200

**Acceptance criteria:**
- `node src/server.js` starts without error
- `GET http://localhost:{PORT}/` returns a response

---

### T-01: Initialize Database

- [ ] Run `npx prisma init`
- [ ] Define `User`, `ShortLink`, and `ClickHistory` models per `ARCHITECTURE.md`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Create `src/prisma/client.js` singleton

**Acceptance criteria:**
- Migration succeeds with no errors
- All three tables exist in the database
- `ClickHistory` has `onDelete: Cascade` configured

---

### T-02: Initialize Frontend

- [ ] Create `frontend/` with Vite: `npm create vite@latest frontend -- --template react`
- [ ] Install: `react-router-dom`, `axios`
- [ ] Create folder structure per `ARCHITECTURE.md`
- [ ] Create `src/api/axios.js` with Axios instance and JWT interceptor
- [ ] Create `src/context/AuthContext.jsx` with `{ user, token, login(), logout() }`
- [ ] Set up React Router in `main.jsx` with placeholder routes for all pages
- [ ] Create `ProtectedRoute` component per `STYLE.md`

**Acceptance criteria:**
- `npm run dev` starts without error
- Navigating to `/login` and `/register` renders placeholder content
- Navigating to `/dashboard` without a token redirects to `/login`

---

## Phase 1 — Authentication

### T-10: Register Endpoint

- [ ] Create `src/controllers/authController.js`
- [ ] Implement `POST /api/auth/register`:
  - Validate `username`, `email`, `password` per `PRODUCT.md`
  - Return 409 if email already exists
  - Hash password with bcrypt (10 rounds)
  - Create user via Prisma
  - Return 201 with user object (no password field)
- [ ] Mount route in `src/routes/auth.js`
- [ ] Register route in `app.js`

**Acceptance criteria:**
- Valid body → 201 with `{ user }` (no `password` in response)
- Duplicate email → 409
- Missing fields → 400
- Invalid email format → 400

---

### T-11: Login Endpoint

- [ ] Implement `POST /api/auth/login`:
  - Validate `email` and `password`
  - Find user by email; return 401 if not found
  - Compare password with bcrypt; return 401 if mismatch
  - Sign JWT with `{ id, email }` payload
  - Return 200 with `{ token, user }` (no `password` in user object)

**Acceptance criteria:**
- Valid credentials → 200 with token
- Wrong password → 401
- Non-existent email → 401
- Missing fields → 400

---

### T-12: Auth Middleware

- [ ] Create `src/middleware/authenticate.js`
- [ ] Read and verify JWT from `Authorization: Bearer <token>` header
- [ ] Attach `req.user = { id, email }` on success
- [ ] Return 401 if token missing, expired, or invalid

**Acceptance criteria:**
- Valid token → request passes through, `req.user` populated
- Missing token → 401
- Expired/invalid token → 401

---

### T-13: Register and Login UI

- [ ] Build `Register.jsx` page with form (username, email, password)
- [ ] Build `Login.jsx` page with form (email, password)
- [ ] Create `src/api/auth.js` with `register(data)` and `login(data)` functions
- [ ] On successful login: save token via `AuthContext.login()`, redirect to `/dashboard`
- [ ] On registration success: redirect to `/login`
- [ ] Display field-level or form-level error messages on failure

**Acceptance criteria:**
- Submitting valid register form → redirected to `/login`
- Submitting valid login form → token stored, redirected to `/dashboard`
- API errors → shown to user without crashing

---

## Phase 2 — Link Management (Backend)

### T-20: Error Handler Middleware

- [ ] Create `src/middleware/errorHandler.js`
- [ ] Catch all errors passed via `next(err)`
- [ ] Return `{ error: "..." }` with appropriate status code
- [ ] Register as last middleware in `app.js`

**Acceptance criteria:**
- Throwing inside a controller and calling `next(err)` returns a JSON error response, not an HTML stack trace

---

### T-21: Get All Links

- [ ] Create `src/controllers/linkController.js`
- [ ] Implement `GET /api/links` (protected):
  - Query all ShortLinks where `userId === req.user.id`
  - Include computed `shortUrl` in each record
  - Return array

**Acceptance criteria:**
- Returns only links belonging to the authenticated user
- Empty array if user has no links
- No links from other users appear

---

### T-22: Get Single Link

- [ ] Implement `GET /api/links/:id` (protected):
  - Find link by `id`
  - Return 404 if not found
  - Return 403 if `userId !== req.user.id`
  - Return link with `shortUrl`

**Acceptance criteria:**
- Own link → 200 with link object
- Another user's link → 403
- Non-existent id → 404

---

### T-23: Create Link

- [ ] Implement `POST /api/links` (protected):
  - Validate `originalUrl` (required, must be valid URL)
  - Generate unique `shortCode` (retry on collision)
  - Create ShortLink with `userId = req.user.id`
  - Return 201 with created link including `shortUrl`

**Acceptance criteria:**
- Valid URL → 201 with new link
- Invalid URL → 400
- Missing URL → 400
- `shortCode` is unique (no duplicate in DB)

---

### T-24: Update Link

- [ ] Implement `PUT /api/links/:id` (protected):
  - Find link, check existence (404) and ownership (403)
  - Accept optional `title` and `originalUrl`
  - Validate `originalUrl` if provided
  - Update and return updated link

**Acceptance criteria:**
- Owner updates title → 200 with updated link
- Owner updates URL with invalid value → 400
- Non-owner → 403
- Non-existent → 404

---

### T-25: Delete Link

- [ ] Implement `DELETE /api/links/:id` (protected):
  - Find link, check existence and ownership
  - Delete ShortLink (ClickHistory cascades automatically)
  - Return 200 with `{ message: 'Link deleted successfully.' }`

**Acceptance criteria:**
- Owner deletes → 200, link and all ClickHistory removed
- Non-owner → 403
- Non-existent → 404

---

### T-26: Analytics Endpoint

- [ ] Implement `GET /api/links/:id/stats` (protected):
  - Check existence and ownership
  - Query most recent ClickHistory record for `lastClickedAt`
  - Return `{ id, originalUrl, shortUrl, totalClicks, createdAt, lastClickedAt }`

**Acceptance criteria:**
- Returns correct `totalClicks` from `ShortLink.clickCount`
- `lastClickedAt` matches most recent `ClickHistory.clickedAt`
- `null` if no clicks recorded

---

### T-27: Redirect Endpoint

- [ ] Create `src/controllers/redirectController.js`
- [ ] Implement `GET /:shortCode` (public):
  - Find ShortLink by `shortCode`
  - Return 404 JSON if not found
  - Increment `clickCount` on ShortLink
  - Create ClickHistory record
  - Respond with 302 redirect to `originalUrl`

**Acceptance criteria:**
- Valid shortCode → 302 redirect, `clickCount` incremented, ClickHistory record created
- Invalid shortCode → 404 JSON

---

## Phase 3 — Link Management (Frontend)

### T-30: Dashboard Page

- [ ] Build `Dashboard.jsx` displaying user's links
- [ ] Create `src/api/links.js` with `getLinks()`, `deleteLink(id)`
- [ ] Each link displayed as a card with: title, `originalUrl` (truncated), `shortUrl`, `clickCount`
- [ ] Each card has: Copy button (copies `shortUrl`), Edit button (→ `/links/:id/edit`), Delete button
- [ ] Delete button shows confirmation before calling API
- [ ] Summary row: total links count, total clicks count

**Acceptance criteria:**
- Dashboard loads and shows all user links
- Copy button copies short URL to clipboard
- Delete removes the link from the list without page refresh
- Empty state shown if no links exist

---

### T-31: Create Link Page

- [ ] Build `CreateLink.jsx` with form for `originalUrl` and optional `title`
- [ ] Add `createLink(data)` to `src/api/links.js`
- [ ] On success: redirect to `/dashboard`
- [ ] On error: display error message

**Acceptance criteria:**
- Valid submission → link created, redirected to dashboard
- Invalid URL → error shown
- New link visible on dashboard after redirect

---

### T-32: Edit Link Page

- [ ] Build `EditLink.jsx` pre-populated with existing link data
- [ ] Add `updateLink(id, data)` to `src/api/links.js`
- [ ] Add `getLinkById(id)` to `src/api/links.js`
- [ ] Fetch link on mount; show 403/404 message if inaccessible
- [ ] On success: redirect to `/dashboard`

**Acceptance criteria:**
- Form pre-fills with current title and URL
- Valid update → redirected to dashboard with updated data
- Unauthorized access → error message shown

---

### T-33: Link Detail and Analytics Page

- [ ] Build `LinkDetail.jsx` showing full link info and stats
- [ ] Add `getLinkStats(id)` to `src/api/links.js`
- [ ] Display: title, `shortUrl` with copy button, `originalUrl`, `clickCount`, `createdAt`, `lastClickedAt`

**Acceptance criteria:**
- All stat fields render correctly
- `lastClickedAt` shows "Never clicked" if null
- Copy button works

---

## Phase 4 — Polish

### T-40: Global Error Handling (Frontend)

- [ ] Handle 401 responses globally in Axios interceptor: clear token, redirect to `/login`
- [ ] Show a generic error message for 500 responses

---

### T-41: Loading States

- [ ] Show loading indicator on Dashboard, CreateLink, EditLink, and LinkDetail while fetching
- [ ] Disable submit buttons during API calls to prevent double submission

---

### T-42: Environment and Deployment Prep

- [ ] Confirm all environment variables are documented in `AGENT.md`
- [ ] Add `.env.example` to both `backend/` and `frontend/`
- [ ] Add `README.md` to project root with setup instructions
- [ ] Verify `/:shortCode` redirect works correctly in production URL configuration

---

## Optional Phase — Post-MVP Features

> Only begin if all Phase 0–4 tasks are complete and marked `[x]`.

- [ ] **T-50:** Custom alias — allow users to specify their own `shortCode` on create
- [ ] **T-51:** QR code — generate and display QR code per link on detail page
- [ ] **T-52:** Link expiration — add optional `expiresAt` field; 410 Gone response after expiry
- [ ] **T-53:** Search — filter dashboard links by title or URL
- [ ] **T-54:** Pagination — paginate `/api/links` and dashboard list

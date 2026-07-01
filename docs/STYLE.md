# STYLE.md

> Defines how code is written in this project. Apply these rules everywhere, every time.
> Consistency matters more than personal preference.

---

## General

- Language: JavaScript (no TypeScript in MVP).
- Runtime: Node.js 20+.
- Module system: CommonJS (`require` / `module.exports`) on the backend; ESM (`import` / `export`) on the frontend.
- Async pattern: `async/await` exclusively. Never use raw `.then()` chains.
- No semicolons (follow the existing Prettier config if added; otherwise write consistently without them).
- Single quotes for strings in both backend and frontend.

---

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| Variables and functions | camelCase | `clickCount`, `generateShortCode` |
| React components | PascalCase | `LinkCard`, `AuthContext` |
| Files (backend) | camelCase | `authController.js`, `authenticate.js` |
| Files (frontend components) | PascalCase | `LinkCard.jsx`, `Dashboard.jsx` |
| Files (frontend non-components) | camelCase | `links.js`, `axios.js` |
| Prisma models | PascalCase | `User`, `ShortLink`, `ClickHistory` |
| Database columns | camelCase (Prisma default) | `shortCode`, `originalUrl`, `userId` |
| Environment variables | SCREAMING_SNAKE_CASE | `JWT_SECRET`, `DATABASE_URL` |
| REST routes | kebab-case (avoid where possible; prefer path params) | `/api/links/:id/stats` |

---

## Backend Patterns

### Controller Structure

Every controller function follows this shape:

```js
const exampleAction = async (req, res, next) => {
  try {
    // 1. Extract and validate input
    // 2. Execute database operation
    // 3. Return response
  } catch (err) {
    next(err)
  }
}
```

- Validate input at the top of the function. Return early with 400 if invalid.
- Always call `next(err)` for unexpected errors. Never swallow errors silently.
- Never return raw Prisma errors to the client.

### Validation Pattern

Use early returns for validation. Do not nest validation inside `if` chains.

```js
if (!email || !password) {
  return res.status(400).json({ error: 'Email and password are required.' })
}
```

### Owner Check Pattern

Always verify ownership before mutating a resource:

```js
const link = await prisma.shortLink.findUnique({ where: { id } })
if (!link) return res.status(404).json({ error: 'Link not found.' })
if (link.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden.' })
```

### Route File Structure

```js
const express = require('express')
const router = express.Router()
const { actionOne, actionTwo } = require('../controllers/exampleController')
const authenticate = require('../middleware/authenticate')

router.get('/', authenticate, actionOne)
router.post('/', authenticate, actionTwo)

module.exports = router
```

### app.js Structure

```js
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const linkRoutes = require('./routes/links')
const redirectHandler = require('./controllers/redirectController')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/links', linkRoutes)
app.get('/:shortCode', redirectHandler)

app.use(errorHandler)

module.exports = app
```

> The redirect route `/:shortCode` must come after all `/api/*` routes.

---

## Frontend Patterns

### Component Structure

Functional components only. Hooks at the top. Logic before return.

```jsx
import { useState, useEffect } from 'react'

const MyComponent = ({ propA }) => {
  const [value, setValue] = useState(null)

  useEffect(() => {
    // side effect
  }, [])

  const handleAction = () => {
    // handler
  }

  return (
    <div>
      {/* JSX */}
    </div>
  )
}

export default MyComponent
```

### API Call Pattern

All API calls in components use `useEffect` or event handlers. Always handle loading and error states.

```jsx
const [links, setLinks] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchLinks = async () => {
    try {
      const data = await getLinks()
      setLinks(data)
    } catch (err) {
      setError('Failed to load links.')
    } finally {
      setLoading(false)
    }
  }
  fetchLinks()
}, [])
```

### Axios Instance

```js
// src/api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

### Protected Route Pattern

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to='/login' replace />
}

export default ProtectedRoute
```

---

## Error Handling

- Backend: all unhandled errors must flow through `next(err)` to `errorHandler`.
- Frontend: never crash the UI on API errors. Show a user-readable message.
- Never log sensitive data (`password`, `token`) to the console.
- Use `console.error` for unexpected errors during development; remove before production.

---

## What to Avoid

| Avoid | Reason |
|-------|--------|
| Service layer / Repository pattern | Not required for this scale; adds indirection |
| `var` | Use `const` and `let` only |
| `.then()` chains | Use `async/await` |
| Inline styles in React | Use CSS modules or a utility class approach |
| Hardcoded strings for error messages | Keep messages consistent and close to their usage |
| Multiple Prisma client instances | Instantiate once and import where needed |
| Exposing `password` field in any response | Always select or omit explicitly |

---

## Prisma Client Singleton

Create a single Prisma client instance:

```js
// src/prisma/client.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
module.exports = prisma
```

Import this file wherever database access is needed. Never call `new PrismaClient()` in controllers.

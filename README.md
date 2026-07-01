# shrnk

Production-inspired full-stack URL shortening service featuring JWT authentication, REST APIs, Prisma ORM, SQLite/PostgreSQL, and React.

## Project Structure

- `backend/`: Express.js server, Prisma Client DB mapping, controllers, and middlewares.
- `frontend/`: React + Vite application with custom Vanilla CSS styles.
- `docs/`: Product, architecture, style, and task descriptions.

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm (v10+)

### Setup

1. **Backend Configuration**
   - Navigate to `backend/`
   - Copy `.env.example` to `.env`
   - Configure variables. By default, it uses SQLite for zero-setup local dev:
     ```env
     DATABASE_URL="file:./dev.db"
     JWT_SECRET="your-random-jwt-key"
     JWT_EXPIRES_IN="7d"
     PORT=3000
     CLIENT_URL="http://localhost:5173"
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run database migrations:
     ```bash
     npx prisma migrate dev --name init --schema=src/prisma/schema.prisma
     ```

2. **Frontend Configuration**
   - Navigate to `frontend/`
   - Copy `.env.example` to `.env`
   - Set the API URL endpoint:
     ```env
     VITE_API_URL="http://localhost:3000/api"
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

### Running Locally

1. **Start Backend**
   - In the `backend/` directory:
     ```bash
     npm run dev
     ```
   - The server will run on `http://localhost:3000`.

2. **Start Frontend**
   - In the `frontend/` directory:
     ```bash
     npm run dev
     ```
   - The client will run on `http://localhost:5173`.


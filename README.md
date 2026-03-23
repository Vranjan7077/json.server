# json.server

Simple mock API built with `json-server` for frontend development and testing.

## Important Files

- `db.json` -> mock database
- `routes.json` -> route aliases and `/api/*` mapping
- `server.js` -> app startup entrypoint
- `repro.json.server.postman_collection.json` -> ready Postman collection for API testing

## What This Project Gives You

- Ready-to-use REST endpoints from `db.json`
- API prefix support (`/api/...`)
- Mock login/session endpoints (`/api/login`, `/api/me`, `/api/logout`)
- Search and stats endpoints
- Optional response delay and forced error simulation

## Quick Start (2 minutes)

1. Install packages

```bash
npm install
```

2. Run server

```bash
npm run dev
```

3. Open API

- Base URL: `http://localhost:3100`
- API URL: `http://localhost:3100/api`
- Health: `http://localhost:3100/health`

## Most Useful Endpoints

### Auth

- `POST /api/login`
- `GET /api/me` (requires bearer token)
- `POST /api/logout` (requires bearer token)

Login body:

```json
{
  "email": "ava@example.com",
  "password": "demo123"
}
```

Header for protected routes:

```http
Authorization: Bearer <token>
```

### Data

- `GET /api/users`
- `GET /api/projects`
- `GET /api/tasks`
- `GET /api/projectMembers`
- `GET /api/taskComments`
- `GET /api/attachments`
- `GET /api/activityLogs`

### Utility

- `GET /api/stats`
- `GET /api/search?q=design`

## Friendly Route Shortcuts

Defined in `routes.json`:

- `GET /api/users/:id/tasks`
- `GET /api/projects/:id/tasks`
- `GET /api/projects/:id/members`
- `GET /api/dashboard` -> `GET /api/stats`

## Simulate Real-World UI States

Use these query params on GET requests:

- `?delay=800` (delay in ms, max 10000)
- `?fail=true` (returns 500)

Examples:

- `/api/tasks?delay=1200`
- `/api/projects?fail=true`

## Postman Collection (Recommended)

Use `repro.json.server.postman_collection.json` for one-click testing.

1. Open Postman -> Import -> select `repro.json.server.postman_collection.json`
2. Set collection variable `baseUrl` to `http://localhost:3100`
3. Run `Login` request first
4. Copy `token` from login response
5. Set collection variable `token` and run `Me` / `Logout`

Included requests:

- Health
- Login
- Me
- Logout
- Stats
- Search
- User Tasks
- Project Members
- Tasks (Delayed)
- Projects (Fail)

## Project Structure

```text
server.js
routes.json
db.json
repro.json.server.postman_collection.json
src/
  app.js
  config/constants.js
  middleware/
  routes/customRoutes.js
  services/
  utils/
```

## Keep It Simple

- Edit `db.json` to change data model
- Keep custom logic inside `src/routes/customRoutes.js`
- Keep validation inside `src/middleware/validatePayload.js`

If you only need plain JSON Server behavior, you can disable custom features by removing custom route/middleware registration in `src/app.js`.

## Port Notes

- npm run dev uses port 3100 by default (avoids common clashes on 3000)
- npm run dev:3000 forces port 3000

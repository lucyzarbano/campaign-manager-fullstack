# Campaign Manager

Full-stack application for managing advertising campaigns and their creatives.
The project consists of two independent TypeScript applications: an Express API
and a React single-page application.

## Features

- Paginated campaign list
- Filtering by campaign ID, name, and status
- Campaign editing
- Creative listing, upload, and deletion
- Backend validation for 320x480 creative images
- Maximum of three creatives per campaign
- Creative uploads disabled for paused campaigns
- Favorite campaigns stored in browser `localStorage`
- Loading, empty, and error states
- Backend integration tests

## Tech Stack

### Backend

- Node.js and TypeScript
- Express
- `csv-parse` for campaign seed data
- Sharp for image dimension validation
- Vitest and Supertest for API tests

### Frontend

- React and TypeScript
- Vite
- Material UI

## Project Structure

```text
campaign-manager-fullstack/
|-- backend/    Express API, CSV data, and tests
|-- frontend/   React SPA
`-- technical_documentation/
```

The frontend and backend have separate dependencies, environment variables,
and build commands.

## Requirements

- Node.js 22 recommended
- npm 10 or newer

## Local Setup

Clone the repository, then configure and run each application in a separate
terminal.

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API is available at `http://localhost:3000` by default.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Vite prints the frontend URL in the terminal, normally
`http://localhost:5173`.

## Environment Variables

Backend:

```env
PORT=3000
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API availability |
| `GET` | `/api/campaigns` | List and filter campaigns |
| `GET` | `/api/campaigns/:id` | Get one campaign |
| `PUT` | `/api/campaigns/:id` | Update one campaign |
| `GET` | `/api/campaigns/:id/creatives` | List campaign creatives |
| `POST` | `/api/campaigns/:id/creatives` | Create a creative |
| `DELETE` | `/api/campaigns/:id/creatives/:creativeId` | Delete a creative |

`GET /api/campaigns` accepts the following query parameters:

| Parameter | Description |
| --- | --- |
| `id` | Exact campaign ID |
| `q` | Partial, case-insensitive campaign name |
| `status` | `1` for active or `0` for paused |
| `page` | Page number |
| `limit` | Results per page |

The campaign ID is required in the body of `PUT /api/campaigns/:id` and must
match the route ID. Creative images are sent as data URLs and must be exactly
320x480 pixels.

## Tests and Builds

Run backend tests:

```bash
cd backend
npm test
```

Build the backend:

```bash
cd backend
npm run build
```

Lint and build the frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Persistence

Campaigns are loaded from the supplied CSV file. Campaign updates and creatives
are stored in memory, so they are reset when the backend process restarts.
Favorite campaign IDs are stored in the browser's `localStorage`.

## Performance Considerations

Pagination and filtering are handled by the backend so the frontend only
renders the requested result set. The CSV is read and parsed lazily on the
first campaign request, then cached for the lifetime of the backend process to
avoid repeated disk I/O. Base64 image payloads add transfer overhead and are
suitable here only because uploads are small and constrained.

## Production Approach

For production, campaign and creative data would be moved to a persistent
database with indexes on ID, status, and searchable fields. Creative files
would be uploaded directly to object storage through signed URLs and served
through a CDN. The API would also add authentication, authorization, stricter
CORS configuration, rate limiting, centralized validation and error handling,
structured logging, and monitoring. CI would run tests, linting, and builds on
every change, while secrets would be managed by the deployment platform rather
than committed environment files.

# Carevia

### Discover better work, in one focused search.

Carevia is a modern job discovery platform that brings opportunities from multiple sources into one thoughtful experience. Candidates can search, compare, save, and understand roles without jumping between disconnected job boards, while recruiters and administrators get dedicated spaces to manage the platform.

![Carevia job discovery platform](https://placehold.co/1600x720/111827/F8FAFC?text=Carevia+Job+Discovery)

## What makes Carevia useful

- **One search across many sources** with normalized listings and source attribution.
- **Candidate-first discovery** with salary, work mode, skills, matching scores, saved jobs, and useful empty states.
- **A complete product surface** including public search, job details, dashboards, profiles, recruiter tools, and admin views.
- **A foundation for smarter matching** through transparent skill-based recommendations and AI-assisted experiences.
- **Production-minded foundations** with API security, rate limiting, CORS controls, Supabase integration, and documented crawler compliance considerations.

## How it works

```text
Job sources -> Backend adapters -> Normalize and deduplicate -> Supabase/API -> Carevia web app
```

The backend gathers jobs from supported providers, normalizes their shape, and exposes a consistent API. The React frontend turns that data into a fast, responsive search and comparison workflow.

## Repository layout

| Directory | Purpose |
| --- | --- |
| [`Carvia-Frontend-main`](./Carvia-Frontend-main) | React + Vite web application |
| [`Carvia-Backend-main`](./Carvia-Backend-main) | Express API, aggregation services, and integrations |
| [`Carvia-Backend-main/docs`](./Carvia-Backend-main/docs) | Architecture, API, schema, and crawler-compliance documentation |

## Run locally

### Frontend

```powershell
cd Carvia-Frontend-main
npm ci
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173`.

### Backend

```powershell
cd Carvia-Backend-main
npm ci
Copy-Item .env.example .env
npm start
```

The backend listens on port `5000` by default. Add provider and Supabase credentials to `.env` when enabling live integrations.

## Built with

**Frontend:** React, Vite, React Router, Framer Motion, Supabase

**Backend:** Node.js, Express, Axios, Cheerio, Supabase, Helmet, CORS, and rate limiting

## Documentation

- [Backend architecture](./Carvia-Backend-main/docs/ARCHITECTURE.md)
- [API contract](./Carvia-Backend-main/docs/API.md)
- [Crawler compliance](./Carvia-Backend-main/docs/CRAWLER_COMPLIANCE.md)
- [Database schema](./Carvia-Backend-main/docs/schema.sql)

## Project status

Carevia currently includes a complete seeded UI experience and a backend foundation for live job aggregation. The next steps toward production include provider agreements, background sync queues, stronger deduplication, secure resume storage, server-side role-based access control, and explainable recommendations.

## License

This project is currently shared for demonstration and educational purposes.
# Carvia — multi-source job aggregator

A B.Tech final-year major-project implementation of a Skyscanner-style comparison layer for employment opportunities.

## Demo features

- Responsive public landing experience, jobs search, detailed comparison, candidate dashboard, profile/resume workflow, recruiter console, admin view, and animated demo authentication.
- Unified seeded job cards with salary, work mode, skills, source attribution, save feedback, matching score, skeleton loading, and empty states.
- Purposeful motion: route loading state, search skeletons, button feedback, toasts, hover states, and responsive navigation.
- Dark, accessible visual system built with React and CSS; no heavy component framework is required.

## Run locally

```powershell
cd Carvia-Frontend-main
npm ci
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173`.

To run the API:

```powershell
cd Carvia-Backend-main
npm ci
Copy-Item .env.example .env
npm start
```

## Project documentation

- [Architecture](../Carvia-Backend-main/docs/ARCHITECTURE.md)
- [API contract](../Carvia-Backend-main/docs/API.md)
- [PostgreSQL/Supabase schema](../Carvia-Backend-main/docs/schema.sql)

## Limitations and roadmap

This submission uses realistic seeded client data for the full UI demo; existing backend source adapters remain the starting point for live search. Third-party boards may require paid API keys, have rate limits, or prohibit scraping. Production work should add provider agreements, background sync queues, deduplication, secure storage uploads, server-side RBAC, proper analytics, and a recommendation service based on skills, behavioural signals, and transparent matching explanations.

# Carvia architecture

Carvia follows a layered multi-source aggregation model.

```text
React client → Express API → Source adapters → public job APIs / cached scraper
                    ↓                 ↓
              PostgreSQL/Supabase   normalizer + deduplicator
                    ↓
              user profiles, saved jobs, applications, notifications
```

- **Client:** React + Vite. Routes are lazy-loaded and use local seeded data in demo mode.
- **API:** Express owns authentication checks, source orchestration, rate limits, and normalization.
- **Source adapter:** Each provider returns its native payload. An adapter maps it to the common `Job` shape before results are combined and ranked.
- **Roles:** `candidate`, `recruiter`, `company_admin`, and `platform_admin`. Role middleware must protect recruiter and platform-management routes.
- **Storage:** Supabase/PostgreSQL stores account data and user-created entities. Resumes and images should live in object storage (Supabase Storage, S3, or Cloudinary), with only URLs and metadata in the database.

## Production hardening

Add a queued ingestion worker, provider-specific retry/backoff, deduplication using normalized title/company/location keys, audit logs, antivirus scanning for uploads, pagination, request validation, and server-side RBAC before deploying.

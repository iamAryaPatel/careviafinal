# API contract (planned)

All protected requests send `Authorization: Bearer <jwt>`.

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| `GET` | `/search?keyword=&location=&mode=&minSalary=` | candidate | Aggregated, normalized job search |
| `GET` | `/jobs/:id` | candidate | Full job detail plus source attribution |
| `POST` | `/saved-jobs` | candidate | Save an opportunity |
| `POST` | `/applications` | candidate | Track a source redirect/application |
| `PATCH` | `/profile` | candidate | Update profile builder data |
| `POST` | `/resumes` | candidate | Create signed upload URL / store metadata |
| `POST` | `/recruiter/jobs` | recruiter | Create a company listing |
| `GET` | `/recruiter/jobs/:id/candidates` | recruiter | List role candidates |
| `PATCH` | `/admin/jobs/:id` | platform_admin | Moderate a listing |
| `GET` | `/admin/analytics` | platform_admin | Platform metrics |
| `GET` | `/v1/jobs` | public | Normalized compliant crawler results |
| `GET` | `/v1/admin/crawler/status` | platform_admin | Source health and crawl logs |
| `POST` | `/v1/admin/crawler/sync` | platform_admin | Trigger approved sources |
| `PATCH` | `/v1/admin/crawler/sources/:id` | platform_admin | Enable/disable/configure an approved source |

### Normalized job response

```json
{ "id":"j-101", "title":"Frontend Engineer", "company":"Linear Labs", "location":"Bengaluru, India", "workMode":"Hybrid", "salary":{"min":1600000,"max":2400000,"currency":"INR"}, "skills":["React","TypeScript"], "source":"LinkedIn", "sourceUrl":"https://…", "postedAt":"2026-07-19T08:00:00Z" }
```

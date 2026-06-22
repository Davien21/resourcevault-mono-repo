# API Reference

Base URL: `http://localhost:7842/api/v1`

Authentication uses an HTTP-only cookie (`rv_session`) set on login/register.
Send requests with credentials included. A `Bearer` token in the
`Authorization` header is also accepted.

Roles: **public** (no auth), **member**, **contributor**, **admin**.

---

## Auth — `/auth`

| Method | Path           | Access  | Description |
| ------ | -------------- | ------- | ----------- |
| POST   | `/register`    | public  | Create an account (joins as member), sets session cookie. |
| POST   | `/login`       | public  | Sign in, sets session cookie. |
| POST   | `/logout`      | public  | Clears the session cookie. |
| GET    | `/me`          | auth    | Current user. |

## Resources — `/resources`

| Method | Path               | Access            | Description |
| ------ | ------------------ | ----------------- | ----------- |
| GET    | `/`                | public            | List resources. Query: `q, category, type, tag, sort, featured, mine, page, pageSize`. |
| GET    | `/:slug`           | public¹           | Resource detail (+ related). Increments view count. |
| POST   | `/`                | contributor/admin | Create a resource (contributor → pending, admin → published). |
| PATCH  | `/:slug`           | owner/admin       | Update a resource. |
| POST   | `/:slug/submit`    | owner/admin       | Submit a draft for review. |
| POST   | `/:slug/review`    | admin             | `{ decision: "approve" \| "reject", note? }`. |
| POST   | `/:slug/archive`   | owner/admin       | Archive a resource. |
| POST   | `/:slug/download`  | public            | Records a download, returns the file URL. |

¹ Unpublished resources are only visible to their owner or an admin.

## Categories — `/categories`

| Method | Path      | Access | Description |
| ------ | --------- | ------ | ----------- |
| GET    | `/`       | public | List categories with published counts. |
| POST   | `/`       | admin  | Create a category. |
| PATCH  | `/:id`    | admin  | Update a category. |
| DELETE | `/:id`    | admin  | Delete (blocked if it still contains resources). |

## Tags — `/tags`

| Method | Path | Access | Description |
| ------ | ---- | ------ | ----------- |
| GET    | `/`  | public | All tags, ordered by usage. |

## Bookmarks — `/bookmarks`

| Method | Path             | Access | Description |
| ------ | ---------------- | ------ | ----------- |
| GET    | `/`              | auth   | The current user's saved resources. |
| POST   | `/:slug/toggle`  | auth   | Toggle a bookmark; returns `{ bookmarked }`. |

## Users — `/users`

| Method | Path           | Access | Description |
| ------ | -------------- | ------ | ----------- |
| PATCH  | `/me`          | auth   | Update own profile (name, title, bio, organisation). |
| GET    | `/`            | admin  | List members. Query: `q, role, page`. |
| PATCH  | `/:id/role`    | admin  | Change a member's role. |

## Admin — `/admin`

| Method | Path             | Access | Description |
| ------ | ---------------- | ------ | ----------- |
| GET    | `/analytics`     | admin  | Library analytics (counts, breakdowns, activity, top resources). |
| GET    | `/review-queue`  | admin  | Resources awaiting review. |

## Meta — `/meta`

| Method | Path         | Access | Description |
| ------ | ------------ | ------ | ----------- |
| GET    | `/stats`     | public | Headline library stats (resources, categories, contributors, downloads). |
| GET    | `/featured`  | public | Featured published resources. |
| GET    | `/recent`    | public | Recently published resources. |

## Files

| Method | Path           | Access | Description |
| ------ | -------------- | ------ | ----------- |
| GET    | `/files/:name` | public | Generated sample PDF documents (served statically, not under `/api/v1`). |

## Errors

Errors return a consistent JSON shape:

```json
{ "message": "Human-readable message", "code": "bad_request", "details": { "email": ["..."] } }
```

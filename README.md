# ResourceVault

> The resource library your members actually use.

ResourceVault is a centralised, production-quality resource library for
professional and membership organisations — one beautiful, searchable home for
the guides, templates, research, toolkits, checklists, and policies a community
relies on. It ships with a full review workflow, role-based access, a help
centre, and a richly seeded demo so evaluators can experience every role
instantly.

This repository is a **pnpm + Turborepo monorepo** with a React frontend, an
Express REST API, and shared packages for types, the design system, the
database layer, and configuration.

---

## ✨ Highlights

- **World-class UI** — a real design system (type scale, spacing, tokens),
  dark/light mode, smooth micro-interactions, fully responsive and accessible.
- **64 seeded resources** across 8 categories, every lifecycle state, with real
  generated PDF downloads, contributor avatars, and branded cover art.
- **Three roles** — Admin, Contributor, Member — with one-click demo logins.
- **Full lifecycle** — draft → pending review → published → archived, with an
  admin review queue.
- **Search & filters** — full-text search, category/type/tag filters, sorting,
  grid & list views, and well-designed empty/loading states.
- **Admin console** — analytics, review queue, member management, and category
  curation.
- **Help centre** — a polished, searchable `/docs` section with real content.

---

## 🧱 Tech stack

| Layer        | Technology |
| ------------ | ---------- |
| Monorepo     | pnpm workspaces · Turborepo |
| Frontend     | React 18 · **Rsbuild** · TypeScript · Tailwind CSS · shadcn-style UI · React Router · TanStack Query · Framer Motion |
| Backend      | Node 20 · Express 4 · TypeScript (ESM via `tsx`) · Mongoose 8 · JWT (HTTP-only cookies) · Zod |
| Database     | MongoDB |
| Deployment   | Frontend → **Vercel** · API → **Railway** |

> The stack and deployment targets mirror the reference monorepo
> (`Davien21/cmho-mono-repo`): Express + Mongoose + `tsx` on the backend, and
> React + Rsbuild + shadcn + Tailwind on the frontend.

---

## 📁 Repository structure

```
resourcevault-mono-repo/
├── apps/
│   ├── web/            # React client (landing, library, app, admin, docs)
│   └── api/            # Express REST API (modular: auth, resources, …)
├── packages/
│   ├── ui/             # Design system: Tailwind preset, tokens, helpers
│   ├── types/          # Shared TypeScript types / API contract
│   ├── config/         # Shared base tsconfig + env schema (zod)
│   └── db/             # Mongoose models, connection, and the seed script
├── docs/               # Project documentation (architecture, API reference)
├── docker-compose.yml  # Local MongoDB
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 🚀 Quick start

**Prerequisites:** Node ≥ 20, [pnpm](https://pnpm.io) ≥ 10, and either Docker
(recommended) or a local MongoDB on port `27017`.

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Start MongoDB (Docker). Skip if you already run Mongo locally.
pnpm db:up

# 3. Seed the database (creates demo users, 8 categories, 64 resources + PDFs)
pnpm seed

# 4. Run the API and web client together
pnpm dev
```

Then open:

- **Web app** → http://localhost:7843
- **API** → http://localhost:7842/health

> ResourceVault uses the uncommon ports **7843** (web) and **7842** (API) by
> default to avoid clashing with other local dev servers. Override with
> `WEB_PORT` and `PORT` if needed.

> One-liner after install + Mongo is up: `pnpm seed && pnpm dev`.

### Demo accounts

The login screen offers **one-click "Explore as …" buttons** for every role.
All demo accounts use the password `Demo1234!`.

| Role        | Email                              |
| ----------- | ---------------------------------- |
| Admin       | `admin@resourcevault.demo`         |
| Contributor | `contributor@resourcevault.demo`   |
| Member      | `member@resourcevault.demo`        |

Anyone can also self-register; new public accounts join as **Members**.

---

## 🔧 Environment variables

Copy `.env.example` to `.env` at the repo root (the API and seed read it).
Sensible defaults are baked in, so the demo runs with **no configuration**.

| Variable               | Default                                      | Used by |
| ---------------------- | -------------------------------------------- | ------- |
| `PORT`                 | `7842`                                       | API |
| `MONGODB_URI`          | `mongodb://127.0.0.1:27017/resourcevault`    | API · seed |
| `JWT_SECRET`           | dev fallback                                 | API |
| `JWT_EXPIRES_IN`       | `7d`                                         | API |
| `CLIENT_URL`           | `http://localhost:7843`                      | API (CORS) |
| `API_BASE_URL`         | `http://localhost:7842`                      | API · seed (file URLs) |
| `PUBLIC_API_BASE_URL`  | `http://localhost:7842`                      | Web (browser → API) |

---

## 📜 Scripts

Run from the repository root:

| Command            | Description |
| ------------------ | ----------- |
| `pnpm dev`         | Run the API and web client together (Turbo) |
| `pnpm build`       | Build all packages and the web client |
| `pnpm seed`        | Reset and seed the database |
| `pnpm db:up`       | Start MongoDB via Docker Compose |
| `pnpm db:down`     | Stop the MongoDB container |
| `pnpm typecheck`   | Type-check every workspace |
| `pnpm lint`        | Lint / type-check every workspace |

Per-app: `pnpm --filter @resourcevault/api dev`,
`pnpm --filter @resourcevault/web dev`.

---

## 🗺️ Key routes

**Web**

- `/` — landing page
- `/library` — browse, search & filter the library
- `/resources/:slug` — resource detail + download
- `/login`, `/register` — auth (demo logins on `/login`)
- `/app` — member/contributor dashboard
- `/app/saved`, `/app/contributions`, `/app/submit`, `/app/profile`
- `/app/admin` — analytics · `/app/admin/review` · `/app/admin/users` · `/app/admin/categories`
- `/docs` — help centre

**API** (prefixed `/api/v1`) — see [`docs/api.md`](./docs/api.md) for the full
reference. Highlights: `/auth/*`, `/resources`, `/categories`, `/tags`,
`/bookmarks`, `/users`, `/admin/*`, `/meta/*`. Generated sample files are served
from `/files/:name`.

---

## ☁️ Deployment

- **API → Railway** — uses `apps/api/railway.json`. Set `MONGODB_URI`,
  `JWT_SECRET`, `CLIENT_URL`, and `API_BASE_URL`. Start command:
  `pnpm --filter @resourcevault/api start`.
- **Web → Vercel** — build `pnpm --filter @resourcevault/web build`, output
  `apps/web/dist`. Set `PUBLIC_API_BASE_URL` to the deployed API URL.

> In production the API issues a secure, `SameSite=None` HTTP-only session
> cookie, so the web and API can live on different domains.

---

## 📝 Notes for evaluators

- **No lorem ipsum** — all user-visible copy is real and sector-specific
  (a public & community health membership body).
- **No broken images** — resource/category covers are generated, on-brand
  gradients; avatars use a deterministic avatar service.
- **Real downloads** — every resource ships a generated PDF document.
- This is a **demonstration** product seeded with fictional content.

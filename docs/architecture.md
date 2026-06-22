# Architecture

ResourceVault is a pnpm + Turborepo monorepo with two applications and four
shared packages.

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│         apps/web             │  HTTP  │          apps/api            │
│  React + Rsbuild + Tailwind  │ ─────► │  Express + Mongoose (tsx)    │
│  TanStack Query · Router     │ cookie │  JWT (HTTP-only cookie)      │
└──────────────┬──────────────┘        └───────────────┬──────────────┘
               │                                        │
        @resourcevault/ui                       @resourcevault/db
        @resourcevault/types  ◄── shared ──►     @resourcevault/types
                                                @resourcevault/config
                                                        │
                                                   ┌────▼────┐
                                                   │ MongoDB │
                                                   └─────────┘
```

## Packages

| Package                  | Responsibility |
| ------------------------ | -------------- |
| `@resourcevault/types`   | The single source of truth for the API contract — entities, enums, request/response shapes. Imported by **both** apps. |
| `@resourcevault/config`  | Shared base `tsconfig` and a Zod environment schema (`parseServerEnv`) so every service validates config the same way. |
| `@resourcevault/ui`      | The design system: the Tailwind preset (colour, type, radius, shadow, motion tokens), shared CSS variables for light/dark, the `cn` helper, cover-gradient logic, and role/type/status metadata. |
| `@resourcevault/db`      | Mongoose connection + models (`User`, `Category`, `Tag`, `Resource`, `Bookmark`, `Activity`) and the seed script (which also generates sample PDFs with `pdfkit`). |

## API design

The API follows a **module-per-feature** layout, mirroring the reference repo:

```
apps/api/src/modules/<feature>/<feature>.{router,controller,service,validators}.ts
```

- **Routers** wire paths to middleware + controllers.
- **Controllers** are thin: parse the request, call a service, send the response.
- **Services** hold the business logic and talk to the models.
- **Validators** are Zod schemas applied by the `validate()` middleware.

Cross-cutting concerns live in `src/config` (env, db, errors, logger, routes),
`src/middlewares` (auth, validate, error), and `src/lib` (jwt, http helpers,
serializers that map Mongoose documents to the shared `@resourcevault/types`).

### Auth & roles

- Email + password. Passwords are hashed with `bcryptjs`.
- On login/register the API sets an **HTTP-only JWT cookie** and also returns
  the token in the body. The client relies on the cookie (`credentials: include`).
- `attachUser` decodes the cookie on every request (never throws);
  `requireAuth` and `requireRole(...)` guard protected routes.
- Roles: **admin**, **contributor**, **member**. Public sign-ups are members.

### Resource visibility

Library listing only ever returns `published` resources to the public and to
members. Contributors can see their own drafts/pending via `?mine=true`; admins
can see everything and filter by status.

## Frontend design

- **Rsbuild** (Rspack/SWC) compiles the app; the shared `@resourcevault/ui`
  source is included in the Tailwind `content` glob.
- **Design tokens** are CSS variables (HSL) defined once in
  `packages/ui/styles.css` and surfaced through the Tailwind preset, enabling a
  flicker-free dark mode (applied before paint via an inline script).
- **Data fetching** uses TanStack Query against a typed `api` client.
- **Cover art** for resources/categories is generated on the client as branded
  SVG-like gradients (`GradientCover`), so the library is visually cohesive and
  never shows a broken image.

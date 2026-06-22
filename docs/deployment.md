# Deployment

ResourceVault deploys with the **frontend on Vercel** and the **API on Railway**,
backed by **MongoDB Atlas**.

| Piece     | Host    | URL |
| --------- | ------- | --- |
| Frontend  | Vercel  | _(set when imported)_ |
| API       | Railway | https://resourcevault-api-production.up.railway.app |
| Database  | Atlas   | _(your free M0 cluster)_ |
| Repo      | GitHub  | https://github.com/Davien21/resourcevault-mono-repo |

---

## 1. MongoDB Atlas (free M0)

1. Sign in at https://cloud.mongodb.com and **create a free M0 cluster**.
2. **Database Access** → add a database user (username + password). Save them.
3. **Network Access** → **Add IP Address** → **Allow access from anywhere**
   (`0.0.0.0/0`). Railway's egress IPs are dynamic, so this is required.
4. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Insert the database name `resourcevault` before the `?`:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/resourcevault?retryWrites=true&w=majority
   ```

That final string is the `MONGODB_URI`.

---

## 2. Railway (API) — already provisioned

- Project: `resourcevault-demo`, service `resourcevault-api`.
- Variables set: `NODE_ENV`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `API_BASE_URL`.
- Still to set: `MONGODB_URI` (from Atlas) and `CLIENT_URL` (the Vercel URL).
- Deploy uploads the repo via `railway up`; start command is
  `pnpm --filter @resourcevault/api start` (see root `railway.json`).
- Sample PDFs are committed under `apps/api/storage`, so `/files/*.pdf`
  downloads work on the hosted API.

Seed the production database (run locally, writes to Atlas):

```bash
MONGODB_URI="<atlas-uri>" \
API_BASE_URL="https://resourcevault-api-production.up.railway.app" \
pnpm --filter @resourcevault/db seed
```

---

## 3. Vercel (frontend)

1. https://vercel.com/new → **Import** `Davien21/resourcevault-mono-repo`.
2. Vercel reads `vercel.json` (root). Confirm:
   - Build command: `pnpm --filter @resourcevault/web build`
   - Output directory: `apps/web/dist`
   - Install command: `pnpm install`
3. **Environment Variables** → add:
   ```
   PUBLIC_API_BASE_URL = https://resourcevault-api-production.up.railway.app
   ```
4. Deploy. Note the resulting URL, e.g. `https://resourcevault-xxxx.vercel.app`.

---

## 4. Wire the two together (CORS + cookies)

After Vercel gives you a URL, set it on Railway so the API accepts the browser:

```bash
railway variables --service resourcevault-api \
  --set "CLIENT_URL=https://<your-vercel-url>"
```

The API issues a `Secure`, `SameSite=None` HTTP-only cookie in production, so
auth works across the Vercel and Railway domains over HTTPS.

---

## 5. Custom domain (optional, later)

To use a custom domain (e.g. a fresh domain or a subdomain):

- **Web (Vercel):** add the domain in Vercel → it gives you a `CNAME`
  (usually `cname.vercel-dns.com`) to add at your DNS provider.
- **API (Railway):** `railway domain <api.yourdomain.com>` → Railway gives a
  `CNAME` target to add at your DNS provider.
- Then update `CLIENT_URL` (Railway) and `PUBLIC_API_BASE_URL` (Vercel) to the
  custom domains and redeploy.

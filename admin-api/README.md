# Banky Auto admin API

Small Vercel serverless API behind the website's admin portal (`/admin`).
The owner signs in with an email and password; this API holds the GitHub
token and commits their changes to `src/content/*.json` and `public/cars/`.
Each commit to `main` triggers the "Deploy site" workflow, which republishes
the site.

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Value |
| --- | --- |
| `ADMIN_EMAIL` | The owner's login email |
| `ADMIN_PASSWORD` | The owner's password (changing it signs everyone out) |
| `ADMIN_NAME` | Optional. Name shown in the admin, e.g. `Bankole` |
| `GITHUB_TOKEN` | Fine-grained GitHub token for `VictorOmoha/banky-auto` with **Contents: Read and write** and **Actions: Read-only** |
| `ALLOWED_ORIGINS` | Optional. Extra comma-separated site origins allowed to call the API |

Redeploy after changing variables.

## Endpoints

`POST /api/login`, `GET /api/me`, `GET /api/file?path=…`, `POST /api/blob`,
`POST /api/commit`, `GET /api/deploy-status`, `GET /api/health`.
Only the three content files and photos in `public/cars/` can be changed.

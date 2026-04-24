# Pragathi Wellness Centre

Single-page website with a lightweight Node backend for local development and deployment.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## What the backend does

- Serves `pragathi-wellness-centre.html`
- Handles `POST /api/enquiries`
- Saves form submissions to `data/enquiries.json`
- Exposes `GET /api/health`
- Fills in the live site URL and business address at request time

## Deployment notes

This app is ready for Railway or any Docker-friendly host.

- Recommended host: Railway
- Required for persistent enquiries: attach a volume to `/app/data`
- Health check path: `/api/health`
- Public start command: `npm start`

Optional environment variables:

- `PUBLIC_SITE_URL=https://your-domain.com`
- `PUBLIC_OG_IMAGE=https://your-domain.com/assets/og-preview.svg`
- `BUSINESS_STREET_ADDRESS=Your full street address`
- `BUSINESS_DISPLAY_ADDRESS=Your display address for the contact section`
- `DATA_DIR=/app/data`

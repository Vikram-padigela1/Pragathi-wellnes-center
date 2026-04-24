# Deployment Guide

This project is ready to deploy as a real website with a backend.

## Recommended: Railway

Railway is the best fit for the current setup because the enquiry form writes to a file, and Railway volumes can persist that data when mounted to the app directory.

### Deploy steps

1. Push this project to GitHub.
2. In Railway, create a new project and choose `Deploy from GitHub repo`.
3. Select this repository and let Railway build it.
4. In the service settings, generate a public Railway domain.
5. Add a volume and mount it to `/app/data`.
6. Set these variables:

```text
PUBLIC_SITE_URL=https://your-live-domain.com
BUSINESS_STREET_ADDRESS=Your full street address
BUSINESS_DISPLAY_ADDRESS=Your full display address
DATA_DIR=/app/data
```

7. Set the health check path to `/api/health`.
8. Redeploy the service.

### Custom domain

After the Railway URL works, add your own custom domain in Railway and update `PUBLIC_SITE_URL` to that final domain.

## Alternative: Render

Render also works for this app, but the enquiry file storage needs a persistent disk because the default filesystem is ephemeral.

Recommended Render settings:

- Service type: Web Service
- Start command: `npm start`
- Health check path: `/api/health`
- Persistent disk mount path: `/opt/render/project/src/data`

If you deploy with Docker on Render, use `/app/data` as the disk mount path instead.

## Important

Without persistent storage, form enquiries can disappear after a restart or redeploy.

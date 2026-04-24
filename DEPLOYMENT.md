# Deployment Guide

This project is ready to deploy as a real MERN website.

## Recommended setup

- Frontend: React build served by Express
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Hosting: Railway, Render, or any Node-friendly host

## Recommended database

Use `MongoDB Atlas` for production. It matches the MERN stack, works cleanly with Mongoose, and avoids the reliability problems of file-based storage.

## Deploy flow

1. Push this repository to GitHub.
2. Create a MongoDB Atlas cluster.
3. Create a database user and whitelist the host IPs you need.
4. Copy the Atlas connection string into `MONGODB_URI`.
5. Create a Gmail App Password for `pragathiwellnesscentre@gmail.com`.
6. Deploy this repository to Railway or Render.
7. Set environment variables on the host:

```text
MONGODB_URI=your-atlas-connection-string
NODE_ENV=production
PORT=5001
CLIENT_URL=https://your-live-domain.com
PUBLIC_SITE_URL=https://your-live-domain.com
BUSINESS_STREET_ADDRESS=Your full street address
BUSINESS_DISPLAY_ADDRESS=Your full display address
OWNER_NOTIFICATION_EMAIL=pragathiwellnesscentre@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=pragathiwellnesscentre@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=pragathiwellnesscentre@gmail.com
VITE_PUBLIC_SITE_URL=https://your-live-domain.com
VITE_PUBLIC_OG_IMAGE=https://your-live-domain.com/assets/logo.jpg
VITE_BUSINESS_STREET_ADDRESS=Your full street address
VITE_BUSINESS_DISPLAY_ADDRESS=Your full display address
```

8. Use the build command:

```text
npm install
```

9. Use the start command:

```text
npm start
```

## Health check

Use this path for health checks:

```text
/api/health
```

## Notes

- The frontend is built during `npm install` through the root `postinstall` script.
- The backend serves the compiled React app in production.
- Contact form submissions are stored in MongoDB through Mongoose.
- Owner notifications are sent by email when the SMTP settings are configured.

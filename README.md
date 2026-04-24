# Pragathi Wellness Centre

This repository now runs as a MERN stack website:

- `client/` contains the React frontend built with Vite
- `server/` contains the Express API
- `MongoDB Atlas` is the recommended database, connected through Mongoose

## Stack

- MongoDB Atlas
- Express
- React
- Node.js

## Local setup

1. Copy `server/.env.example` to `server/.env`
2. Add your MongoDB Atlas connection string to `MONGODB_URI`
3. Add Gmail SMTP details so the owner gets enquiry emails
4. Install everything from the project root:

```bash
npm install
```

5. Start the full MERN app in development:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5001`

## Production build

Build the React frontend:

```bash
npm run build
```

Start the backend:

```bash
npm start
```

In production, Express serves the built React app from `client/dist`.

## Main API route

- `POST /api/enquiries` saves contact enquiries to MongoDB
- `GET /api/health` checks backend health

## Environment values

Set these in `server/.env`:

- `MONGODB_URI`
- `PORT`
- `CLIENT_URL`
- `PUBLIC_SITE_URL`
- `BUSINESS_STREET_ADDRESS`
- `BUSINESS_DISPLAY_ADDRESS`
- `OWNER_NOTIFICATION_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Optional frontend build-time values for `client/.env`:

- `VITE_API_BASE_URL`
- `VITE_PUBLIC_SITE_URL`
- `VITE_PUBLIC_OG_IMAGE`
- `VITE_BUSINESS_STREET_ADDRESS`
- `VITE_BUSINESS_DISPLAY_ADDRESS`

For Gmail, use an App Password for `SMTP_PASS`, not your normal Gmail password.

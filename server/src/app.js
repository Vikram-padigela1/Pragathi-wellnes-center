const express = require("express");
const cors = require("cors");
const path = require("node:path");
const fs = require("node:fs");
const enquiryRoutes = require("./routes/enquiryRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { isEmailConfigured } = require("./services/emailService");
const { isDatabaseReady } = require("./config/db");

const app = express();
const clientDistPath = path.resolve(__dirname, "../../client/dist");
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  process.env.PUBLIC_SITE_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    const error = new Error("Origin not allowed by CORS.");
    error.statusCode = 403;
    callback(error);
  },
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (request, response) => {
  response.json({
    ok: true,
    service: "pragathi-wellness-centre-api",
    timestamp: new Date().toISOString(),
    emailConfigured: isEmailConfigured(),
    mongoConfigured: Boolean(process.env.MONGODB_URI),
    mongoReady: isDatabaseReady(),
  });
});

app.use("/api/enquiries", enquiryRoutes);

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      next();
      return;
    }

    response.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (request, response) => {
    response.status(200).json({
      ok: true,
      message: "Frontend build not found yet. Run npm install or npm run build at the project root.",
    });
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;

const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const ROOT_DIR = __dirname;
const HOME_FILE = path.join(ROOT_DIR, "pragathi-wellness-centre.html");
const DATA_DIR = process.env.DATA_DIR || process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(ROOT_DIR, "data");
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");
const MAX_BODY_SIZE = 1024 * 1024;
const DEFAULT_BUSINESS_ADDRESS = "Pragatinagar, Hyderabad, Telangana";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function getBusinessStreetAddress() {
  const configuredAddress = cleanField(process.env.BUSINESS_STREET_ADDRESS || DEFAULT_BUSINESS_ADDRESS, 200);
  return configuredAddress || DEFAULT_BUSINESS_ADDRESS;
}

function getBusinessDisplayAddress() {
  const configuredAddress = cleanField(process.env.BUSINESS_DISPLAY_ADDRESS || getBusinessStreetAddress(), 240);
  return configuredAddress || DEFAULT_BUSINESS_ADDRESS;
}

function getPublicSiteUrl(request) {
  const configuredUrl = normalizeUrl(process.env.PUBLIC_SITE_URL);

  if (configuredUrl) {
    return configuredUrl;
  }

  const host = request.headers.host || `localhost:${PORT}`;
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const protocol = forwardedProto || (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${protocol}://${host}`;
}

function toAbsoluteUrl(target, baseUrl) {
  try {
    return new URL(target, `${baseUrl}/`).toString();
  } catch {
    return baseUrl;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeJsonString(value) {
  return JSON.stringify(String(value))
    .slice(1, -1)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function ensureDataStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(ENQUIRIES_FILE);
  } catch {
    await fs.writeFile(ENQUIRIES_FILE, "[]\n", "utf8");
  }
}

async function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    request.on("data", (chunk) => {
      size += chunk.length;

      if (size > MAX_BODY_SIZE) {
        reject(createHttpError(413, "Request body is too large."));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

function cleanField(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function validateEnquiry(payload) {
  const enquiry = {
    name: cleanField(payload.name, 80),
    phone: cleanField(payload.phone, 24),
    email: cleanField(payload.email, 120),
    service: cleanField(payload.service, 120),
    message: cleanField(payload.message, 1200),
    source: "website-contact-form",
    submittedAt: new Date().toISOString(),
  };

  if (!enquiry.name) {
    throw createHttpError(400, "Please enter your name.");
  }

  if (!enquiry.phone) {
    throw createHttpError(400, "Please enter your phone number.");
  }

  if (!/^[+\d()\-\s]{7,20}$/.test(enquiry.phone)) {
    throw createHttpError(400, "Please enter a valid phone number.");
  }

  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    throw createHttpError(400, "Please enter a valid email address.");
  }

  if (!enquiry.message) {
    throw createHttpError(400, "Please enter a short message.");
  }

  return enquiry;
}

async function saveEnquiry(enquiry) {
  const raw = await fs.readFile(ENQUIRIES_FILE, "utf8");
  const existing = JSON.parse(raw);

  if (!Array.isArray(existing)) {
    throw createHttpError(500, "Enquiry storage is not configured correctly.");
  }

  existing.unshift(enquiry);
  await fs.writeFile(ENQUIRIES_FILE, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  response.end(body);
}

async function serveFile(response, filePath, headOnly) {
  const fileBuffer = await fs.readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";
  const headers = {
    "Content-Type": contentType,
    "Content-Length": fileBuffer.byteLength,
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=86400",
  };

  response.writeHead(200, headers);

  if (headOnly) {
    response.end();
    return;
  }

  response.end(fileBuffer);
}

async function serveHomePage(request, response, headOnly) {
  const template = await fs.readFile(HOME_FILE, "utf8");
  const publicSiteUrl = getPublicSiteUrl(request);
  const ogImageUrl = normalizeUrl(process.env.PUBLIC_OG_IMAGE)
    ? toAbsoluteUrl(process.env.PUBLIC_OG_IMAGE, publicSiteUrl)
    : toAbsoluteUrl("/assets/og-preview.svg", publicSiteUrl);
  const html = template
    .replaceAll("__PUBLIC_SITE_URL_HTML__", escapeHtml(publicSiteUrl))
    .replaceAll("__PUBLIC_SITE_URL_JSON__", escapeJsonString(publicSiteUrl))
    .replaceAll("__PUBLIC_OG_IMAGE_HTML__", escapeHtml(ogImageUrl))
    .replaceAll("__BUSINESS_STREET_ADDRESS_JSON__", escapeJsonString(getBusinessStreetAddress()))
    .replaceAll("__BUSINESS_DISPLAY_ADDRESS_HTML__", escapeHtml(getBusinessDisplayAddress()));
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(html),
    "Cache-Control": "no-cache",
  };

  response.writeHead(200, headers);

  if (headOnly) {
    response.end();
    return;
  }

  response.end(html);
}

async function serveStaticAsset(request, pathname, response, headOnly) {
  if (pathname === "/" || pathname === "/index.html") {
    await serveHomePage(request, response, headOnly);
    return;
  }

  const safePath = pathname.replace(/^\/+/, "");
  const decodedPath = decodeURIComponent(safePath);
  const absolutePath = path.normalize(path.join(ROOT_DIR, decodedPath));

  if (!absolutePath.startsWith(ROOT_DIR)) {
    throw createHttpError(403, "Access denied.");
  }

  try {
    const fileStats = await fs.stat(absolutePath);

    if (!fileStats.isFile()) {
      throw createHttpError(404, "File not found.");
    }

    if (absolutePath === HOME_FILE) {
      await serveHomePage(request, response, headOnly);
      return;
    }

    await serveFile(response, absolutePath, headOnly);
  } catch (error) {
    if (error && error.code === "ENOENT" && !path.extname(absolutePath)) {
      await serveHomePage(request, response, headOnly);
      return;
    }

    if (error && error.code === "ENOENT") {
      throw createHttpError(404, "File not found.");
    }

    throw error;
  }
}

async function handleEnquirySubmission(request, response) {
  const contentType = request.headers["content-type"] || "";

  if (!contentType.includes("application/json")) {
    throw createHttpError(415, "Please submit the form in JSON format.");
  }

  const rawBody = await readRequestBody(request);
  let payload = {};

  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    throw createHttpError(400, "Invalid form submission.");
  }

  const enquiry = validateEnquiry(payload);
  await saveEnquiry(enquiry);

  sendJson(response, 201, {
    ok: true,
    message: "Thanks for reaching out. Your enquiry has been received.",
  });
}

function handleError(error, response) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500
    ? "Something went wrong on the server."
    : error.message;

  if (!response.headersSent) {
    sendJson(response, statusCode, {
      ok: false,
      message,
    });
  } else {
    response.end();
  }

  if (statusCode === 500) {
    console.error(error);
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const { pathname } = requestUrl;
    const method = request.method || "GET";

    if (pathname === "/favicon.ico") {
      response.writeHead(204);
      response.end();
      return;
    }

    if (method === "GET" && pathname === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        service: "pragathi-wellness-centre",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (method === "POST" && pathname === "/api/enquiries") {
      await handleEnquirySubmission(request, response);
      return;
    }

    if (pathname.startsWith("/api/")) {
      throw createHttpError(404, "API route not found.");
    }

    if (method === "GET" || method === "HEAD") {
      await serveStaticAsset(request, pathname, response, method === "HEAD");
      return;
    }

    throw createHttpError(405, "Method not allowed.");
  } catch (error) {
    handleError(error, response);
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Please stop the other process or use a different PORT.`);
  } else if (error.code === "EPERM") {
    console.error(`The server could not open ${HOST}:${PORT}. Try a different port or run in a less restricted environment.`);
  } else {
    console.error(error);
  }

  process.exit(1);
});

async function startServer() {
  await ensureDataStore();

  server.listen(PORT, HOST, () => {
    console.log(`Pragathi's Wellness Centre is running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

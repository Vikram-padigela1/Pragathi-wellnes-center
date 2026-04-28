const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("DEBUG: OWNER_EMAIL loaded as:", process.env.OWNER_EMAIL);
console.log("DEBUG: EMAIL_PASS loaded as:", Boolean(process.env.EMAIL_PASS) ? "***" : "undefined");

const app = require("./app");
const { connectDatabase } = require("./config/db");

const PORT = Number.parseInt(process.env.PORT || "5001", 10);

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Pragathi Wellness Centre server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

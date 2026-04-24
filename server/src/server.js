const dotenv = require("dotenv");

dotenv.config();

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

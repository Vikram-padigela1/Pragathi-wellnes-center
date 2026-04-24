const mongoose = require("mongoose");

let databaseReady = false;

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MONGODB_URI is missing. Add it to server/.env to enable enquiry storage.");
    databaseReady = false;
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    databaseReady = true;
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    databaseReady = false;
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

function isDatabaseReady() {
  return databaseReady || mongoose.connection.readyState === 1;
}

module.exports = {
  connectDatabase,
  isDatabaseReady,
};

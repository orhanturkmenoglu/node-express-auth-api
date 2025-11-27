const mongoose = require("mongoose");
const app = require("./index"); // make sure your Express app is imported

const PORT = process.env.PORT || 5173;
const MONGODB_URL = process.env.MONGODB_URL;

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); 
  }
}

startServer();

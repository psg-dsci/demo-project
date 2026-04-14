const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// ✅ Smart root handler (handles BOTH test + browser)
app.get("/", (req, res) => {
  const accept = req.headers.accept || "";

  // If request expects JSON → return API response (for tests)
  if (accept.includes("application/json")) {
    return res.status(200).json({
      message: "🚀 Hello from EC2!",
      environment: process.env.NODE_ENV || "development",
      version: process.env.APP_VERSION || "1.0.0",
      timestamp: new Date().toISOString(),
    });
  }

  // Otherwise → serve HTML (for browser)
  return res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

// System info
app.get("/info", (req, res) => {
  res.status(200).json({
    node: process.version,
    platform: process.platform,
    memory: process.memoryUsage(),
  });
});

// Prevent server during tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
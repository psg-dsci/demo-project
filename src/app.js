const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ✅ Routes FIRST
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 Hello from EC2!",
    environment: process.env.NODE_ENV || "development",
    version: process.env.APP_VERSION || "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.get("/info", (req, res) => {
  res.status(200).json({
    node: process.version,
    platform: process.platform,
    memory: process.memoryUsage(),
  });
});

// ✅ Static AFTER routes (IMPORTANT)
app.use(express.static(path.join(__dirname, "../public")));

// ✅ Prevent server during tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
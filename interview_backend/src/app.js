const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const env = require("./config/env");
const prisma = require("./lib/prisma");
const mockTestRoutes = require("./routes/mockTestRoutes");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet()); // safe default security headers
app.use(cors({ origin: env.clientOrigin })); // only your frontend may call the API
app.use(express.json({ limit: "100kb" })); // lets the server read JSON request bodies
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300, // max requests per visitor in that window
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check: proves the server is up and can reach PostgreSQL.
app.use("/api/mock-tests", mockTestRoutes);
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database check failed:", error.message);
    res.status(503).json({ status: "error", database: "unreachable" });
  }
});
app.use("/api/mock-tests", mockTestRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
import "dotenv/config";
import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { pool } from "./db.js";
import enquiriesRouter from "./routes/enquiries.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    return res.status(200).json({
      status: "ok",
      service: "forge-api",
      database: "connected",
    });
  } catch {
    return res.status(503).json({
      status: "error",
      service: "forge-api",
      database: "unavailable",
    });
  }
});

app.use("/api/enquiries", enquiriesRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const isMalformedJson =
    error instanceof SyntaxError && "status" in error && error.status === 400;

  if (isMalformedJson) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_JSON",
      message: "The request body contains invalid JSON.",
    });
  }

  console.error(
    "Unhandled API error:",
    error instanceof Error ? error.message : "Unknown error",
  );

  return res.status(500).json({
    status: "error",
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected server error occurred.",
  });
});

export default app;

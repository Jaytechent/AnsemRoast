import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import analyzeRoutes from "./routes/analyze.routes";

const app = express();

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disable to allow Vite asset loading in dev
}));

// Cross-Origin Resource Sharing
app.use(cors());

// Compression for faster payload transfer
app.use(compression());

// Parse JSON payloads
app.use(express.json());

// Rate Limiter: 100 requests per hour
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: { error: "Too many wallet scans from this IP, please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to the analyze API endpoint
app.use("/api", limiter);

// Register routes
app.use("/api", analyzeRoutes);

export default app;

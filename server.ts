import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import app from "./src/expressApp";
import { connectDB } from "./src/config/db";

// Load environment variables
dotenv.config();

const PORT = 3000;

async function startServer() {
  // Connect to MongoDB Atlas (returns false on failure, falls back to in-memory node-cache)
  await connectDB();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server after our /api routes (which are registered inside src/app)
    app.use(vite.middlewares);
  } else {
    // Serve production built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Ansem Wallet Roast server is actively listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

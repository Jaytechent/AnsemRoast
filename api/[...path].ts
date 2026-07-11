import app from "../src/expressApp";
import { connectDB } from "../src/config/db";

// Serverless functions are re-invoked per request but the *module scope* is reused
// across "warm" invocations on the same instance, so we only want to kick off the
// MongoDB connection once per warm instance, not on every single request.
let dbConnection: Promise<boolean> | null = null;

/**
 * Vercel Node.js entry point. This is deliberately separate from server.ts:
 * server.ts calls app.listen(...) and is meant for a persistent process
 * (used locally via `npm run dev` / on platforms like Render via `npm start`).
 * Vercel does not run persistent processes - it invokes this default-exported
 * handler per request and manages the HTTP transport itself, so app.listen()
 * must never be called here.
 */
export default async function handler(req: any, res: any) {
  if (!dbConnection) {
    dbConnection = connectDB();
  }
  // Never let a Mongo failure crash the function - connectDB() already resolves
  // to `false` on failure and the app falls back to in-memory caching.
  await dbConnection.catch(() => false);

  // Express apps are callable as a plain (req, res) request handler.
  return (app as unknown as (req: any, res: any) => void)(req, res);
}

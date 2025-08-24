import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('[STARTUP] Initializing server...');
  console.log('[STARTUP] NODE_ENV:', process.env.NODE_ENV);
  console.log('[STARTUP] PORT:', process.env.PORT);
  console.log('[STARTUP] Platform:', process.platform);
  
  try {
    const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on Heroku's assigned port or 5000 for development
  // this serves both the API and the client
  const PORT = process.env.PORT || 5000;
  
  // Add error handling for server startup
  server.on('error', (err: any) => {
    log(`Server error: ${err.message}`);
    if (err.code === 'EADDRINUSE') {
      log(`Port ${PORT} is already in use`);
      process.exit(1);
    }
    throw err;
  });

  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
    log(`Environment: ${process.env.NODE_ENV}`);
    log(`Platform: ${process.platform}`);
  });
  
  } catch (error) {
    console.error('[STARTUP] Fatal error during server initialization:', error);
    process.exit(1);
  }
})().catch(error => {
  console.error('[STARTUP] Unhandled error in main function:', error);
  process.exit(1);
});

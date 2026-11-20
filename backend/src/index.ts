
import "dotenv/config";
import app from "./app.js";
import { pool, verifyDatabaseConnection } from "./db.js";

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await verifyDatabaseConnection();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`FORGE API running on port ${PORT}`);
    });

    let isShuttingDown = false;

    const shutdown = (signal: NodeJS.Signals): void => {
      if (isShuttingDown) return;

      isShuttingDown = true;
      console.log(`${signal} received. Shutting down FORGE API...`);

      server.close((error) => {
        void (async () => {
          if (error) {
            console.error("HTTP server shutdown error:", error.message);
            process.exitCode = 1;
          }

          try {
            await pool.end();
            console.log("PostgreSQL connection pool closed.");
          } catch (poolError) {
            console.error(
              "Failed to close PostgreSQL pool:",
              poolError instanceof Error
                ? poolError.message
                : poolError,
            );

            process.exitCode = 1;
          }
        })();
      });
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);

    server.once("error", (error: Error) => {
      console.error("FORGE HTTP server error:", error.message);

      void pool.end().finally(() => {
        process.exitCode = 1;
      });
    });
  } catch (error) {
    console.error(
      "FORGE API startup failed. PostgreSQL connection could not be verified.",
      error instanceof Error ? error.message : error,
    );

    try {
      await pool.end();
    } catch (poolError) {
      console.error("Failed to close PostgreSQL pool:", poolError);
    }

    process.exitCode = 1;
  }
}

void startServer();

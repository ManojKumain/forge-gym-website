
import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Check your backend/.env file.",
  );
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Handle unexpected errors from idle pooled connections.
pool.on("error", (error: Error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

export async function verifyDatabaseConnection(): Promise<void> {
  const result = await pool.query<{
    current_database: string;
    current_user: string;
  }>(`
    SELECT
      current_database(),
      current_user
  `);

  const connection = result.rows[0];

  if (!connection) {
    throw new Error("PostgreSQL connection verification returned no result.");
  }

  console.log(
    `PostgreSQL connected: database=${connection.current_database}, user=${connection.current_user}`,
  );
}

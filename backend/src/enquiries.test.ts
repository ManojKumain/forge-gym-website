import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import { once } from "node:events";
import { after, before, test } from "node:test";

import app from "./app.js";
import { pool } from "./db.js";

const testKeys = Array.from({ length: 8 }, () => randomUUID());

let server: Server | undefined;
let baseUrl: string;

const validPayload = {
  name: "Test Visitor",
  phone: "+91 98765 43210",
  fitnessGoal: "Build strength",
  preferredContactMethod: "whatsapp",
  message: "I would like to know about membership.",
  privacyConsent: true,
};

before(async () => {
  await pool.query("SELECT 1");

  const testServer = app.listen(0, "127.0.0.1");
  server = testServer;

  await once(testServer, "listening");

  const address = testServer.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not determine test server address.");
  }

  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  try {
    if (server?.listening) {
      const activeServer = server;
      server = undefined;

      await new Promise<void>((resolve, reject) => {
        activeServer.close((error) => {
          if (error) reject(error);
          else resolve();
        });

        activeServer.closeAllConnections();
      });
    }

    await pool.query(
      "DELETE FROM enquiries WHERE idempotency_key = ANY($1::uuid[])",
      [testKeys],
    );
  } finally {
    await pool.end();
  }
});

test("rejects requests without a valid idempotency key", async () => {
  const response = await fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validPayload),
  });

  assert.equal(response.status, 400);

  const body = (await response.json()) as { code: string };

  assert.equal(body.code, "INVALID_IDEMPOTENCY_KEY");
});

test("rejects enquiries without privacy consent", async () => {
  const response = await fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": testKeys[0],
    },
    body: JSON.stringify({
      ...validPayload,
      privacyConsent: false,
    }),
  });

  assert.equal(response.status, 400);

  const body = (await response.json()) as { code: string };

  assert.equal(body.code, "VALIDATION_ERROR");
});

test("persists an enquiry and handles duplicate requests safely", async () => {
  const headers = {
    "Content-Type": "application/json",
    "Idempotency-Key": testKeys[1],
  };

  const firstResponse = await fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers,
    body: JSON.stringify(validPayload),
  });

  assert.equal(firstResponse.status, 201);

  const firstBody = (await firstResponse.json()) as {
    duplicate: boolean;
    enquiry: { id: string };
  };

  assert.equal(firstBody.duplicate, false);
  assert.ok(firstBody.enquiry.id);

  const duplicateResponse = await fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers,
    body: JSON.stringify(validPayload),
  });

  assert.equal(duplicateResponse.status, 200);

  const duplicateBody = (await duplicateResponse.json()) as {
    duplicate: boolean;
    enquiry: { id: string };
  };

  assert.equal(duplicateBody.duplicate, true);
  assert.equal(duplicateBody.enquiry.id, firstBody.enquiry.id);

  const conflictResponse = await fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...validPayload,
      message: "Different enquiry details.",
    }),
  });

  assert.equal(conflictResponse.status, 409);

  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM enquiries WHERE idempotency_key = $1",
    [testKeys[1]],
  );

  assert.equal(countResult.rows[0].count, "1");
});

test("rejects invalid name, phone, and unknown fields", async () => {
  const invalidPayloads = [
    { ...validPayload, name: "   " },
    { ...validPayload, phone: "abc" },
    { ...validPayload, unexpectedField: "not allowed" },
  ];

  for (const payload of invalidPayloads) {
    const response = await fetch(`${baseUrl}/api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": testKeys[2],
      },
      body: JSON.stringify(payload),
    });

    assert.equal(response.status, 400);

    const body = (await response.json()) as { code: string };
    assert.equal(body.code, "VALIDATION_ERROR");
  }
});

test("accepts an enquiry with optional fields omitted", async () => {
  const response = await fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": testKeys[3],
    },
    body: JSON.stringify({
      name: "Optional Fields Visitor",
      phone: "+91 98765 43210",
      privacyConsent: true,
    }),
  });

  assert.equal(response.status, 201);

  const result = await pool.query(
    `SELECT fitness_goal, preferred_contact_method, message
     FROM enquiries
     WHERE idempotency_key = $1`,
    [testKeys[3]],
  );

  assert.equal(result.rowCount, 1);
  assert.equal(result.rows[0].fitness_goal, null);
  assert.equal(result.rows[0].preferred_contact_method, null);
  assert.equal(result.rows[0].message, null);
});

test("returns a structured error for malformed JSON", async () => {
  const response = await fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": testKeys[4],
    },
    body: '{"name":',
  });

  assert.equal(response.status, 400);

  const body = (await response.json()) as { code: string };
  assert.equal(body.code, "INVALID_JSON");
});

test("allows the configured frontend origin through CORS", async () => {
  const response = await fetch(`${baseUrl}/api/health`, {
    headers: {
      Origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    },
  });

  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  );
});

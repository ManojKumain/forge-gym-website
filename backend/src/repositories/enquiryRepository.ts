
import { pool } from "../db.js";
import type { EnquiryInput } from "../schemas/enquiry.js";

interface EnquiryRecord {
  id: string;
  name: string;
  phone: string;
  fitness_goal: string | null;
  preferred_contact_method: string | null;
  message: string | null;
  privacy_consent: boolean;
  created_at: Date;
}

type CreateEnquiryResult =
  | {
      kind: "created" | "duplicate";
      enquiry: {
        id: string;
        createdAt: Date;
      };
    }
  | {
      kind: "conflict";
    };

export async function createEnquiry(
  input: EnquiryInput,
  idempotencyKey: string,
): Promise<CreateEnquiryResult> {
  const insertResult = await pool.query<{
    id: string;
    created_at: Date;
  }>(
    `
      INSERT INTO enquiries (
        name,
        phone,
        fitness_goal,
        preferred_contact_method,
        message,
        privacy_consent,
        idempotency_key
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING id, created_at
    `,
    [
      input.name,
      input.phone,
      input.fitnessGoal ?? null,
      input.preferredContactMethod ?? null,
      input.message ?? null,
      input.privacyConsent,
      idempotencyKey,
    ],
  );

  const inserted = insertResult.rows[0];

  if (inserted) {
    return {
      kind: "created",
      enquiry: {
        id: inserted.id,
        createdAt: inserted.created_at,
      },
    };
  }

  // The idempotency key already exists. Check whether this is
  // a legitimate retry of the original request.
  const existingResult = await pool.query<EnquiryRecord>(
    `
      SELECT
        id,
        name,
        phone,
        fitness_goal,
        preferred_contact_method,
        message,
        privacy_consent,
        created_at
      FROM enquiries
      WHERE idempotency_key = $1
    `,
    [idempotencyKey],
  );

  const existing = existingResult.rows[0];

  if (!existing) {
    throw new Error("Existing idempotency record could not be found.");
  }

  const samePayload =
    existing.name === input.name &&
    existing.phone === input.phone &&
    existing.fitness_goal === (input.fitnessGoal ?? null) &&
    existing.preferred_contact_method ===
      (input.preferredContactMethod ?? null) &&
    existing.message === (input.message ?? null) &&
    existing.privacy_consent === input.privacyConsent;

  if (!samePayload) {
    return { kind: "conflict" };
  }

  return {
    kind: "duplicate",
    enquiry: {
      id: existing.id,
      createdAt: existing.created_at,
    },
  };
}

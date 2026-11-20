
import { Router } from "express";
import { z } from "zod";
import { createEnquiry } from "../repositories/enquiryRepository.js";
import { enquirySchema } from "../schemas/enquiry.js";

const router = Router();

const idempotencyKeySchema = z.string().uuid();

router.post("/", async (req, res) => {
  const keyResult = idempotencyKeySchema.safeParse(
    req.get("Idempotency-Key"),
  );

  if (!keyResult.success) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_IDEMPOTENCY_KEY",
      message: "A valid Idempotency-Key UUID header is required.",
    });
  }

  const validation = enquirySchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Please check the submitted enquiry fields.",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const result = await createEnquiry(
      validation.data,
      keyResult.data,
    );

    if (result.kind === "conflict") {
      return res.status(409).json({
        status: "error",
        code: "IDEMPOTENCY_KEY_CONFLICT",
        message:
          "This submission key was already used with different enquiry details.",
      });
    }

    if (result.kind === "duplicate") {
      return res.status(200).json({
        status: "success",
        duplicate: true,
        message: "This enquiry was already received.",
        enquiry: {
          id: result.enquiry.id,
          createdAt: result.enquiry.createdAt.toISOString(),
        },
      });
    }

    return res.status(201).json({
      status: "success",
      duplicate: false,
      message: "Your enquiry has been received.",
      enquiry: {
        id: result.enquiry.id,
        createdAt: result.enquiry.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "Failed to persist enquiry:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return res.status(500).json({
      status: "error",
      code: "ENQUIRY_PERSISTENCE_ERROR",
      message: "We could not receive your enquiry. Please try again.",
    });
  }
});

export default router;


import { z } from "zod";

const optionalText = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? undefined
        : value,
    z.string().trim().max(maxLength).optional(),
  );

export const enquirySchema = z
  .object({
    name: z.string().trim().min(1).max(100),

    phone: z
      .string()
      .trim()
      .min(7)
      .max(32)
      .regex(/^\+?[0-9][0-9\s().-]*$/)
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      }, "Phone number must contain between 7 and 15 digits."),

    fitnessGoal: optionalText(100),

    preferredContactMethod: z
      .enum(["phone", "whatsapp", "email"])
      .optional(),

    message: optionalText(2000),

    privacyConsent: z.literal(true),
  })
  .strict();

export type EnquiryInput = z.infer<typeof enquirySchema>;

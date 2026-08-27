// src/lib/validation/signupSchema.ts
import { z } from "zod"

const PARTNER_TYPES = ["tour-operator", "transport", "sim-seller", "tour-guide"] as const

export const onboardingSchema = z
  .object({
    // Step 1
    partnerType: z.enum(PARTNER_TYPES, { errorMap: () => ({ message: "Please select a partner type" }) }),

    // Step 2
    country: z.string().min(1, "Country is required"),
    companyName: z.string().min(2, "Company name is required"),
    tradingName: z.string().optional(),
    rcNumber: z.string().optional(),
    yearEstablished: z.string().optional(),
    officeAddress: z.string().min(5, "Office address is required"),

    // Type-specific
    nahconLicense: z.string().optional(),
    capacity: z.string().optional(),
    transportReg: z.string().optional(),
    fleetSize: z.string().optional(),
    telecomPermit: z.string().optional(),
    supportedNetworks: z.string().optional(),

    // Tour guide
    guideLanguages: z.string().optional(),
    guideExperience: z.string().optional(),
    guideExpertise: z.array(z.string()).optional(),

    // Step 3
    directorTitle: z.string().optional(),
    directorName: z.string().optional(),
    directorPhone: z.string().min(1, "Phone number is required"),
    directorWhatsApp: z.string().optional(),
    directorNin: z.string().optional(),
    description: z.string().optional(),

    // Step 4
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.partnerType !== "tour-guide") {
        return data.rcNumber && data.rcNumber.trim().length > 0
      }
      return true
    },
    { message: "RC / CAC number is required", path: ["rcNumber"] }
  )
  .refine(
    (data) => {
      if (data.partnerType === "tour-operator" && data.country === "Nigeria") {
        return data.nahconLicense && data.nahconLicense.trim().length > 0
      }
      return true
    },
    { message: "NAHCON license is required for Tour Operators in Nigeria", path: ["nahconLicense"] }
  )

export type OnboardingSchemaType = z.infer<typeof onboardingSchema>

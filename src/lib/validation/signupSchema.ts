// signupSchema.ts
import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),

    phone: z
      .string()
      .min(1, "Phone number is required")               // ← catches empty/undefined early
      .regex(/^\+\d{8,15}$/, "Phone must start with + and contain 8–15 digits")
      .regex(/^\+?\d[\d\s+()-]{8,15}$/, "Invalid phone number format")
      .refine(
        (val) => {
          // Optional: more strict check (e.g. using libphonenumber-js)
          // but for now this is usually enough
          return val.length >= 10;
        },
        { message: "Phone number too short" }
      ),

    // Optional fields → keep .optional() or use .nullish() if you want null too
    companyName: z.string().min(2, "Company name is required").optional(),
    cacNumber: z.string().min(5, "CAC number is required").optional(),

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
  });

export type SignupFormData = z.infer<typeof signupSchema>;
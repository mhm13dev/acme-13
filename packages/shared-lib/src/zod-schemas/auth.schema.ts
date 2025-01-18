import { z } from "zod";

export const authFormDataSchema = z.object({
  email: z.string().trim().toLowerCase().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export type AuthFormData = z.infer<typeof authFormDataSchema>;

import { z } from "zod/v4";

export const authFormDataSchema = z.object({
  email: z
    .email({
      message: "Please enter a valid email address.",
    })
    .trim()
    .toLowerCase(),
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export type AuthFormData = z.infer<typeof authFormDataSchema>;

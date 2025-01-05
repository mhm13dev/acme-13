import { z } from "zod";

export const signupUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().trim().min(8),
});

export const loginUserSchema = signupUserSchema.pick({
  email: true,
  password: true,
});

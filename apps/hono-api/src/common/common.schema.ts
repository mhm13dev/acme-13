import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

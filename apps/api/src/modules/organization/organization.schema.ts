import { z } from "zod/v4";
import slugify from "slugify";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .transform((val) => slugify.default(val, { lower: true, strict: true })),
});

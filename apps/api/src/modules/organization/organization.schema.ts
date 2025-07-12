import { z } from "zod";
import slugify from "slugify";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .transform((val) => slugify(val, { lower: true, strict: true })),
});

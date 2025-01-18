import { z } from "zod";
import { idSchema } from "../../common/common.schema.js";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
});

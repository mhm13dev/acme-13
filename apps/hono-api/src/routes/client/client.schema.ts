import { z } from "zod";
import { idSchema } from "../../common/common.schema.js";

export const createClientSchema = z.object({
  name: z.string().trim().min(1),
  orgId: idSchema,
});

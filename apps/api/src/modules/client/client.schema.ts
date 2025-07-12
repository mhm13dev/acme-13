import { z } from "zod/v4";
import { idSchema } from "../../common/common.schema.js";

export const clientsBaseParamsSchema = z.object({
  orgId: idSchema,
});

export const createClientSchema = z.object({
  name: z.string().trim().min(1),
});
